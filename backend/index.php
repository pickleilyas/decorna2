<?php
/**
 * Decorna Backend — Single-file PHP & MySQL REST API.
 * Handles Authentication, Products CRUD, Orders, and Chatbot.
 */

// ------------------------------------------------------------- CONFIG & SESSIONS --
$dbHost = getenv('DB_HOST') ?: '127.0.0.1';
$dbPort = getenv('DB_PORT') ?: '3306';
$dbName = getenv('DB_NAME') ?: 'decorna';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASS') !== false ? getenv('DB_PASS') : '';

if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_httponly' => true,
        'cookie_samesite' => 'Lax'
    ]);
}

// CORS Headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: {$origin}");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ----------------------------------------------------------------- DB CONNECTION --
function get_db(): PDO {
    global $dbHost, $dbPort, $dbName, $dbUser, $dbPass;
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO("mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, $options);
    } catch (PDOException $e) {
        // If DB does not exist, try creating it and import schema.sql automatically
        $initPdo = new PDO("mysql:host={$dbHost};port={$dbPort};charset=utf8mb4", $dbUser, $dbPass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        $initPdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $pdo = new PDO("mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4", $dbUser, $dbPass, $options);
    }

    // Auto-initialize tables from schema.sql if empty
    try {
        $check = $pdo->query("SHOW TABLES LIKE 'products'")->fetch();
        if (!$check && file_exists(__DIR__ . '/schema.sql')) {
            $pdo->exec(file_get_contents(__DIR__ . '/schema.sql'));
        }
    } catch (Exception $e) {
        // Ignore table check errors
    }

    return $pdo;
}

// ----------------------------------------------------------------------- HELPERS --
function json_res(mixed $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function error_res(string $message, int $code = 400): void {
    json_res(['error' => $message], $code);
}

function current_user_id(): ?int {
    return isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;
}

function is_admin(): bool {
    return !empty($_SESSION['is_admin']);
}

function require_login(): void {
    if (current_user_id() === null) error_res('Authentication required', 401);
}

function require_admin(): void {
    if (current_user_id() === null || !is_admin()) error_res('Admin authentication required', 401);
}

function user_to_dict(array $row): array {
    return [
        'id'       => (int)$row['id'],
        'fullName' => $row['full_name'],
        'email'    => $row['email'],
        'isAdmin'  => (bool)$row['is_admin'],
    ];
}

function product_to_dict(array $row): array {
    return [
        'id'        => (int)$row['id'],
        'catKey'    => $row['cat_key'],
        'icon'      => $row['icon'],
        'imagePath' => $row['image_path'],
        'price'     => (int)$row['price'],
        'stock'     => (int)$row['stock'],
        'name'      => ['fr' => $row['name_fr'], 'en' => $row['name_en'], 'ar' => $row['name_ar'] ?: $row['name_fr']],
        'material'  => ['fr' => $row['material_fr'], 'en' => $row['material_en'], 'ar' => $row['material_ar'] ?: $row['material_fr']],
        'desc'      => ['fr' => $row['desc_fr'], 'en' => $row['desc_en'], 'ar' => $row['desc_ar'] ?: $row['desc_fr']],
        'long'      => ['fr' => $row['long_fr'], 'en' => $row['long_en'], 'ar' => $row['long_ar'] ?: $row['long_fr']],
        'isActive'  => (bool)$row['is_active'],
    ];
}

// ----------------------------------------------------------------- PARSE REQUEST --
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);

// Normalize API route (e.g. /api/products, /backend/index.php/api/products -> /api/products)
$pos = strpos($uri, '/api');
$path = ($pos !== false) ? substr($uri, $pos) : '/api' . (str_starts_with($uri, '/') ? $uri : '/' . $uri);
if ($path !== '/api/' && str_ends_with($path, '/')) $path = rtrim($path, '/');

// Parse JSON Body
$body = [];
if (str_contains($_SERVER['CONTENT_TYPE'] ?? '', 'application/json')) {
    $raw = file_get_contents('php://input');
    if ($raw) $body = json_decode($raw, true) ?? [];
} else if ($method === 'POST') {
    $body = $_POST;
}

// ------------------------------------------------------------------- AUTH ROUTES --
if ($path === '/api/auth/signup' && $method === 'POST') {
    $fullName = trim($body['fullName'] ?? '');
    $email = strtolower(trim($body['email'] ?? ''));
    $password = $body['password'] ?? '';

    if (!$fullName || !$email || strlen($password) < 6) {
        error_res('fullName, email and a password (6+ chars) are required', 400);
    }

    $db = get_db();
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) error_res('An account with this email already exists', 409);

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $ins = $db->prepare('INSERT INTO users (full_name, email, password_hash, is_admin) VALUES (?, ?, ?, 0)');
    $ins->execute([$fullName, $email, $hash]);
    $newId = (int)$db->lastInsertId();

    $user = $db->query("SELECT * FROM users WHERE id = {$newId}")->fetch();
    session_regenerate_id(true);
    $_SESSION['user_id'] = (int)$user['id'];
    $_SESSION['is_admin'] = (bool)$user['is_admin'];

    json_res(user_to_dict($user), 201);
}

if ($path === '/api/auth/login' && $method === 'POST') {
    $email = strtolower(trim($body['email'] ?? ''));
    $password = $body['password'] ?? '';

    $db = get_db();
    $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        error_res('Invalid email or password', 401);
    }

    session_regenerate_id(true);
    $_SESSION['user_id'] = (int)$user['id'];
    $_SESSION['is_admin'] = (bool)$user['is_admin'];

    json_res(user_to_dict($user));
}

if ($path === '/api/auth/logout' && $method === 'POST') {
    $_SESSION = [];
    if (session_id()) session_destroy();
    json_res(['ok' => true]);
}

if ($path === '/api/auth/me' && $method === 'GET') {
    $uid = current_user_id();
    if (!$uid) json_res(['user' => null]);

    $user = get_db()->query("SELECT * FROM users WHERE id = {$uid}")->fetch();
    if (!$user) {
        $_SESSION = [];
        json_res(['user' => null]);
    }
    json_res(['user' => user_to_dict($user)]);
}

// --------------------------------------------------------------- PRODUCTS ROUTES --
if ($path === '/api/products' && $method === 'GET') {
    $cat = $_GET['cat'] ?? null;
    $db = get_db();
    if ($cat && $cat !== 'all') {
        $stmt = $db->prepare('SELECT * FROM products WHERE is_active = 1 AND cat_key = ? ORDER BY id');
        $stmt->execute([$cat]);
    } else {
        $stmt = $db->query('SELECT * FROM products WHERE is_active = 1 ORDER BY id');
    }
    json_res(array_map('product_to_dict', $stmt->fetchAll()));
}

if (preg_match('#^/api/products/(\d+)$#', $path, $m) && $method === 'GET') {
    $stmt = get_db()->prepare('SELECT * FROM products WHERE id = ? AND is_active = 1');
    $stmt->execute([(int)$m[1]]);
    $prod = $stmt->fetch();
    if (!$prod) error_res('Product not found', 404);
    json_res(product_to_dict($prod));
}

// Admin Products CRUD
if ($path === '/api/admin/products' && $method === 'GET') {
    require_admin();
    $rows = get_db()->query('SELECT * FROM products ORDER BY id')->fetchAll();
    json_res(array_map('product_to_dict', $rows));
}

if ($path === '/api/admin/products' && $method === 'POST') {
    require_admin();
    $req = ['catKey', 'icon', 'price', 'name', 'material', 'desc'];
    foreach ($req as $f) {
        if (!isset($body[$f])) error_res("Missing field: {$f}", 400);
    }

    $db = get_db();
    $sql = "INSERT INTO products (cat_key, icon, image_path, price, stock,
                name_fr, name_en, name_ar, material_fr, material_en, material_ar,
                desc_fr, desc_en, desc_ar, long_fr, long_en, long_ar, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $db->prepare($sql);
    $stmt->execute([
        $body['catKey'], $body['icon'], $body['imagePath'] ?? null, (int)$body['price'], (int)($body['stock'] ?? 0),
        $body['name']['fr'] ?? '', $body['name']['en'] ?? '', $body['name']['ar'] ?? null,
        $body['material']['fr'] ?? '', $body['material']['en'] ?? '', $body['material']['ar'] ?? null,
        $body['desc']['fr'] ?? '', $body['desc']['en'] ?? '', $body['desc']['ar'] ?? null,
        $body['long']['fr'] ?? null, $body['long']['en'] ?? null, $body['long']['ar'] ?? null,
        isset($body['isActive']) ? ($body['isActive'] ? 1 : 0) : 1
    ]);
    $newProd = $db->query("SELECT * FROM products WHERE id = " . $db->lastInsertId())->fetch();
    json_res(product_to_dict($newProd), 201);
}

if (preg_match('#^/api/admin/products/(\d+)$#', $path, $m) && $method === 'PUT') {
    require_admin();
    $id = (int)$m[1];
    $db = get_db();
    $prod = $db->query("SELECT * FROM products WHERE id = {$id}")->fetch();
    if (!$prod) error_res('Product not found', 404);

    $sql = "UPDATE products SET
                cat_key = ?, icon = ?, image_path = ?, price = ?, stock = ?,
                name_fr = ?, name_en = ?, name_ar = ?,
                material_fr = ?, material_en = ?, material_ar = ?,
                desc_fr = ?, desc_en = ?, desc_ar = ?,
                long_fr = ?, long_en = ?, long_ar = ?, is_active = ?
            WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute([
        $body['catKey'] ?? $prod['cat_key'],
        $body['icon'] ?? $prod['icon'],
        array_key_exists('imagePath', $body) ? $body['imagePath'] : $prod['image_path'],
        isset($body['price']) ? (int)$body['price'] : (int)$prod['price'],
        isset($body['stock']) ? (int)$body['stock'] : (int)$prod['stock'],
        $body['name']['fr'] ?? $prod['name_fr'],
        $body['name']['en'] ?? $prod['name_en'],
        array_key_exists('ar', $body['name'] ?? []) ? $body['name']['ar'] : $prod['name_ar'],
        $body['material']['fr'] ?? $prod['material_fr'],
        $body['material']['en'] ?? $prod['material_en'],
        array_key_exists('ar', $body['material'] ?? []) ? $body['material']['ar'] : $prod['material_ar'],
        $body['desc']['fr'] ?? $prod['desc_fr'],
        $body['desc']['en'] ?? $prod['desc_en'],
        array_key_exists('ar', $body['desc'] ?? []) ? $body['desc']['ar'] : $prod['desc_ar'],
        $body['long']['fr'] ?? $prod['long_fr'],
        $body['long']['en'] ?? $prod['long_en'],
        array_key_exists('ar', $body['long'] ?? []) ? $body['long']['ar'] : $prod['long_ar'],
        isset($body['isActive']) ? ($body['isActive'] ? 1 : 0) : (int)$prod['is_active'],
        $id
    ]);

    $updated = $db->query("SELECT * FROM products WHERE id = {$id}")->fetch();
    json_res(product_to_dict($updated));
}

if (preg_match('#^/api/admin/products/(\d+)$#', $path, $m) && $method === 'DELETE') {
    require_admin();
    $id = (int)$m[1];
    $db = get_db();
    if (isset($_GET['purge']) && $_GET['purge'] === '1') {
        $prod = $db->query("SELECT * FROM products WHERE id = {$id}")->fetch();
        if ($prod && !empty($prod['image_path'])) {
            $photoPath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $prod['image_path']);
            if (file_exists($photoPath) && is_file($photoPath)) {
                @unlink($photoPath);
            }
        }
        $stmt = $db->prepare('DELETE FROM order_items WHERE product_id = ?');
        $stmt->execute([$id]);
        $stmt = $db->prepare('DELETE FROM products WHERE id = ?');
        $stmt->execute([$id]);
    } else {
        $stmt = $db->prepare('UPDATE products SET is_active = 0 WHERE id = ?');
        $stmt->execute([$id]);
    }
    json_res(['ok' => true]);
}

if (preg_match('#^/api/admin/products/(\d+)/photo$#', $path, $m) && $method === 'POST') {
    require_admin();
    $id = (int)$m[1];
    $db = get_db();
    $prod = $db->query("SELECT * FROM products WHERE id = {$id}")->fetch();
    if (!$prod) error_res('Product not found', 404);

    $file = $_FILES['photo'] ?? null;
    if (!$file || $file['error'] !== UPLOAD_ERR_OK) error_res("No photo file provided (field name: 'photo')", 400);

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['png', 'jpg', 'jpeg', 'webp'], true)) error_res('Unsupported file type', 400);

    $uploadDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'products';
    if (!is_dir($uploadDir)) @mkdir($uploadDir, 0755, true);

    $filename = "product-{$id}-" . bin2hex(random_bytes(4)) . ".{$ext}";
    move_uploaded_file($file['tmp_name'], $uploadDir . DIRECTORY_SEPARATOR . $filename);

    $imagePath = 'products/' . $filename;
    $stmt = $db->prepare('UPDATE products SET image_path = ? WHERE id = ?');
    $stmt->execute([$imagePath, $id]);

    $updated = $db->query("SELECT * FROM products WHERE id = {$id}")->fetch();
    json_res(product_to_dict($updated));
}

// ----------------------------------------------------------------- ORDERS ROUTES --
if ($path === '/api/orders' && $method === 'POST') {
    $items = $body['items'] ?? [];
    if (!is_array($items) || empty($items)) error_res('Cart is empty', 400);

    $paymentMethod = $body['paymentMethod'] ?? 'cod';
    if (!in_array($paymentMethod, ['card', 'cod'], true)) error_res("paymentMethod must be 'card' or 'cod'", 400);

    $cardLast4 = null;
    $paymentStatus = 'unpaid';

    if ($paymentMethod === 'card') {
        $card = is_array($body['card'] ?? null) ? $body['card'] : [];
        $num = preg_replace('/\D/', '', (string)($card['number'] ?? ''));
        $exp = trim((string)($card['expiry'] ?? ''));
        $cvc = preg_replace('/\D/', '', (string)($card['cvc'] ?? ''));
        $name = trim((string)($card['name'] ?? ''));

        if (strlen($num) < 13 || strlen($num) > 19) error_res('Invalid card number', 400);
        if (!$name) error_res('Cardholder name is required', 400);
        if (!preg_match('/^(0[1-9]|1[0-2])\/\d{2}$/', $exp)) error_res('Expiry must be in MM/YY format', 400);
        if (strlen($cvc) < 3 || strlen($cvc) > 4) error_res('Invalid CVC', 400);

        $cardLast4 = substr($num, -4);
        $paymentStatus = 'paid';
    }

    $db = get_db();
    $userId = current_user_id();
    $guestName = trim((string)($body['guestName'] ?? '')) ?: null;
    $guestEmail = trim((string)($body['guestEmail'] ?? '')) ?: null;

    if ($userId === null && !$guestEmail) {
        error_res('guestEmail is required for orders placed without an account', 400);
    }

    $db->beginTransaction();
    try {
        $total = 0;
        $resolved = [];
        $pStmt = $db->prepare('SELECT * FROM products WHERE id = ? AND is_active = 1 FOR UPDATE');

        foreach ($items as $item) {
            $pid = (int)($item['productId'] ?? 0);
            $qty = (int)($item['qty'] ?? 0);
            if ($pid <= 0 || $qty <= 0) {
                $db->rollBack();
                error_res('Invalid item', 400);
            }

            $pStmt->execute([$pid]);
            $p = $pStmt->fetch();
            if (!$p) {
                $db->rollBack();
                error_res("Product not found", 400);
            }
            if ((int)$p['stock'] < $qty) {
                $db->rollBack();
                error_res("Not enough stock for {$p['name_fr']}: only {$p['stock']} left", 409);
            }

            $price = (int)$p['price'];
            $total += $price * $qty;
            $resolved[] = ['id' => $pid, 'qty' => $qty, 'price' => $price];
        }

        $orderSql = "INSERT INTO orders (user_id, guest_name, guest_email, status, payment_method, payment_status, card_last4, total)
                     VALUES (?, ?, ?, 'pending', ?, ?, ?, ?)";
        $stmt = $db->prepare($orderSql);
        $stmt->execute([$userId, $guestName, $guestEmail, $paymentMethod, $paymentStatus, $cardLast4, $total]);
        $orderId = (int)$db->lastInsertId();

        $itemStmt = $db->prepare('INSERT INTO order_items (order_id, product_id, qty, unit_price) VALUES (?, ?, ?, ?)');
        $stockStmt = $db->prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
        foreach ($resolved as $r) {
            $itemStmt->execute([$orderId, $r['id'], $r['qty'], $r['price']]);
            $stockStmt->execute([$r['qty'], $r['id']]);
        }

        $db->commit();
        json_res([
            'id'            => $orderId,
            'total'         => $total,
            'status'        => 'pending',
            'paymentMethod' => $paymentMethod,
            'paymentStatus' => $paymentStatus,
            'cardLast4'     => $cardLast4
        ], 201);
    } catch (Exception $e) {
        if ($db->inTransaction()) $db->rollBack();
        error_res($e->getMessage(), 500);
    }
}

if ($path === '/api/orders/mine' && $method === 'GET') {
    require_login();
    $db = get_db();
    $stmt = $db->prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC');
    $stmt->execute([current_user_id()]);
    $orders = $stmt->fetchAll();

    $iStmt = $db->prepare('SELECT oi.*, p.name_fr FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?');
    $res = [];
    foreach ($orders as $o) {
        $iStmt->execute([(int)$o['id']]);
        $items = $iStmt->fetchAll();
        $res[] = [
            'id'            => (int)$o['id'],
            'status'        => $o['status'],
            'paymentMethod' => $o['payment_method'],
            'paymentStatus' => $o['payment_status'],
            'cardLast4'     => $o['card_last4'],
            'total'         => (int)$o['total'],
            'createdAt'     => $o['created_at'],
            'items'         => array_map(fn($i) => ['productId' => (int)$i['product_id'], 'name' => $i['name_fr'], 'qty' => (int)$i['qty'], 'unitPrice' => (int)$i['unit_price']], $items)
        ];
    }
    json_res($res);
}

if ($path === '/api/admin/orders' && $method === 'GET') {
    require_admin();
    $db = get_db();
    $orders = $db->query('SELECT * FROM orders ORDER BY created_at DESC')->fetchAll();
    $iStmt = $db->prepare('SELECT oi.*, p.name_fr FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?');

    $res = [];
    foreach ($orders as $o) {
        $iStmt->execute([(int)$o['id']]);
        $items = $iStmt->fetchAll();
        $res[] = [
            'id'            => (int)$o['id'],
            'userId'        => $o['user_id'] ? (int)$o['user_id'] : null,
            'guestName'     => $o['guest_name'],
            'guestEmail'    => $o['guest_email'],
            'status'        => $o['status'],
            'paymentMethod' => $o['payment_method'],
            'paymentStatus' => $o['payment_status'],
            'cardLast4'     => $o['card_last4'],
            'total'         => (int)$o['total'],
            'createdAt'     => $o['created_at'],
            'items'         => array_map(fn($i) => ['name' => $i['name_fr'], 'qty' => (int)$i['qty'], 'unitPrice' => (int)$i['unit_price']], $items)
        ];
    }
    json_res($res);
}

if (preg_match('#^/api/admin/orders/(\d+)/status$#', $path, $m) && $method === 'PUT') {
    require_admin();
    $status = $body['status'] ?? '';
    if (!in_array($status, ['pending', 'confirmed', 'cancelled'], true)) {
        error_res('status must be one of pending/confirmed/cancelled', 400);
    }
    $stmt = get_db()->prepare('UPDATE orders SET status = ? WHERE id = ?');
    $stmt->execute([$status, (int)$m[1]]);
    json_res(['ok' => true]);
}

// ------------------------------------------------------------------- CHAT ROUTE --
if ($path === '/api/chat' && $method === 'POST') {
    $msg = trim((string)($body['message'] ?? ''));
    if (!$msg) error_res('message is required', 400);
    if (mb_strlen($msg) > 2000) error_res('message is too long', 400);

    $lang = preg_match('/[\x{0600}-\x{06FF}]/u', $msg) ? 'ar' : (preg_match('/\b(the|is|are|price|how|what|hello|hi|thanks)\b/i', $msg) ? 'en' : 'fr');

    $db = get_db();
    $reply = null;

    // Check price intent with catalog
    if (preg_match('/prix|coût|cout|combien|price|cost|how much|سعر|ثمن/iu', $msg)) {
        $products = $db->query('SELECT name_fr, name_en, price FROM products WHERE is_active = 1')->fetchAll();
        $msgLow = mb_strtolower($msg);
        foreach ($products as $p) {
            $nameFr = mb_strtolower(trim(preg_replace('/["\x{201c}]([^"\x{201d}]+)["\x{201d}]/u', '$1', $p['name_fr'])));
            $nameEn = mb_strtolower(trim(preg_replace('/["\x{201c}]([^"\x{201d}]+)["\x{201d}]/u', '$1', $p['name_en'])));
            if (($nameFr && str_contains($msgLow, $nameFr)) || ($nameEn && str_contains($msgLow, $nameEn))) {
                $pName = ($lang === 'en') ? $p['name_en'] : $p['name_fr'];
                $reply = match ($lang) {
                    'en' => "{$pName} costs {$p['price']} MAD.",
                    'ar' => "{$pName} — {$p['price']} درهم.",
                    default => "{$pName} coûte {$p['price']} MAD."
                };
                break;
            }
        }
    }

    if (!$reply) {
        $rules = [
            ['/panier|achat|command|cart|buy|order|سلة|طلب/iu', [
                'fr' => "Pour ajouter un produit, clique sur \"Ajouter\" sur sa fiche, puis ouvre ton panier avec l'icône en haut à droite pour ajuster les quantités ou payer.",
                'en' => 'To add a product, click "Add" on its card, then open your cart from the top-right icon to adjust quantities or check out.',
                'ar' => 'لإضافة منتج، اضغط على "أضف" في بطاقته، ثم افتح سلتك من الأيقونة أعلى اليمين لضبط الكميات أو الدفع.'
            ]],
            ['/compte|profil|inscri|connex|login|account|profile|signup|حساب|تسجيل/iu', [
                'fr' => "Tu peux créer un compte ou te connecter depuis l'icône profil en haut à droite.",
                'en' => 'You can create an account or log in from the profile icon at the top right.',
                'ar' => 'يمكنك إنشاء حساب أو تسجيل الدخول من أيقونة الملف الشخصي أعلى اليمين.'
            ]],
            ['/contact|instagram|facebook|email|mail|تواصل|بريد/iu', [
                'fr' => "Tu peux nous écrire sur Instagram @decorna.officiel, Facebook 'Decorna Officiel', ou par email à decornacontact@gmail.com.",
                'en' => "You can reach us on Instagram @decorna.officiel, Facebook 'Decorna Officiel', or by email at decornacontact@gmail.com.",
                'ar' => "يمكنك مراسلتنا عبر إنستغرام @decorna.officiel أو فيسبوك 'Decorna Officiel'، أو البريد الإلكتروني decornacontact@gmail.com."
            ]],
            ['/livrai|paiement|payment|delivery|cod|carte|card|شحن|توصيل|دفع/iu', [
                'fr' => "Deux modes de paiement : à la livraison, ou par carte bancaire (paiement de démonstration sur ce site).",
                'en' => "Two payment options: cash on delivery, or by card (demo payment on this site).",
                'ar' => "طريقتان للدفع: عند الاستلام، أو بالبطاقة البنكية (دفع تجريبي على هذا الموقع)."
            ]],
            ['/qui|histoire|lycee|lycée|khemisset|propos|who|about|story|school|قصة|مدرسة/iu', [
                'fr' => "Decorna est un projet mené par des lycéens du Lycée Al Fath à Khemisset : ils recyclent le plastique pour créer des objets de décoration faits main.",
                'en' => "Decorna is a project run by high-schoolers at Lycée Al Fath in Khemisset: they recycle plastic into handmade decor pieces.",
                'ar' => "ديكورنا مشروع يقوده تلاميذ ثانوية الفتح بالخميسات: يعيدون تدوير البلاستيك لصنع قطع ديكور يدوية."
            ]],
            ['/bonjour|salut|slt|hello|hi\b|hey|مرحبا|سلام/iu', [
                'fr' => "Salut ! Comment puis-je t'aider à te repérer sur Decorna aujourd'hui ?",
                'en' => "Hi! How can I help you find your way around Decorna today?",
                'ar' => "مرحبًا! كيف يمكنني مساعدتك في التنقل داخل ديكورنا اليوم؟"
            ]],
            ['/merci|thanks|thank you|شكرا/iu', [
                'fr' => "Avec plaisir.",
                'en' => "My pleasure!",
                'ar' => "بكل سرور!"
            ]],
        ];

        foreach ($rules as [$pat, $res]) {
            if (preg_match($pat, $msg)) {
                $reply = $res[$lang] ?? $res['fr'];
                break;
            }
        }
    }

    if (!$reply) {
        $fallbacks = [
            'fr' => "Je peux t'aider à trouver un produit, expliquer notre démarche de recyclage ou te donner nos coordonnées — que souhaites-tu savoir ?",
            'en' => "I can help you find a product, explain our recycling mission, or give you our contact details — what would you like to know?",
            'ar' => "يمكنني مساعدتك في إيجاد منتج أو شرح مشروع إعادة التدوير أو تزويدك بمعلومات التواصل — ماذا تريد أن تعرف؟"
        ];
        $reply = $fallbacks[$lang] ?? $fallbacks['fr'];
    }

    json_res(['reply' => $reply, 'source' => 'fallback']);
}

// ------------------------------------------------------------------ 404 FALLBACK --
error_res("Endpoint not found: {$method} {$path}", 404);
