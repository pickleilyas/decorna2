<?php
/**
 * router.php — Development server router for Decorna.
 *
 * Run with:
 *     php -S localhost:8000 router.php
 *
 * This serves static files (HTML, JS, CSS, images) and routes /api/* to the PHP backend.
 */

$rawUri = $_SERVER['REQUEST_URI'];
$uriPath = parse_url($rawUri, PHP_URL_PATH);
$filePath = __DIR__ . $uriPath;

// Route API requests to backend/index.php
if (str_starts_with($uriPath, '/api')) {
    require __DIR__ . '/backend/index.php';
    exit;
}

// Serve existing static files directly
if ($uriPath !== '/' && file_exists($filePath) && is_file($filePath)) {
    return false; // let PHP built-in server serve the static file
}

// Route root to index.html
if ($uriPath === '/' || $uriPath === '') {
    readfile(__DIR__ . '/index.html');
    exit;
}

// SPA fallback for unknown non-file paths
if (!pathinfo($uriPath, PATHINFO_EXTENSION)) {
    readfile(__DIR__ . '/index.html');
    exit;
}

// File not found
http_response_code(404);
echo "404 Not Found";
