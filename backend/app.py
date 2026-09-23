"""
app.py — Decorna backend.

A small Flask + SQLite app that:
  * serves the existing static frontend (../decorna) as-is,
  * exposes a JSON API under /api/* for products, authentication and orders,
  * exposes an admin-only JSON API under /api/admin/* for managing the catalog.

Run it with:
    cd backend
    pip install -r requirements.txt
    flask --app app init-db
    flask --app app seed
    flask --app app run --debug
"""
import os
import re
import uuid
from functools import wraps

from flask import Flask, g, jsonify, request, session, send_from_directory
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

import db as db_module
import seed as seed_module
import chat as chat_module

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Check if frontend files are directly in parent dir or in a nested "decorna" folder
_parent_dir = os.path.abspath(os.path.join(BASE_DIR, ".."))
if os.path.exists(os.path.join(_parent_dir, "index.html")):
    FRONTEND_DIR = _parent_dir
else:
    FRONTEND_DIR = os.path.join(_parent_dir, "decorna")
PRODUCTS_UPLOAD_DIR = os.path.join(FRONTEND_DIR, "assets", "products")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
_EXPIRY_RE = re.compile(r"^(0[1-9]|1[0-2])\/\d{2}$")  # MM/YY


def create_app():
    app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
    app.config.update(
        DATABASE=os.path.join(BASE_DIR, "decorna.db"),
        SECRET_KEY=os.environ.get("DECORNA_SECRET_KEY", "dev-secret-change-me"),
    )
    app.json.ensure_ascii = False  # keep accented / Arabic characters readable in JSON

    db_module.init_app(app)
    seed_module.init_app(app)

    register_frontend_routes(app)
    register_product_routes(app)
    register_auth_routes(app)
    register_order_routes(app)
    register_admin_routes(app)
    register_chat_routes(app)

    return app


# ---------------------------------------------------------------- helpers --

def admin_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if not session.get("user_id") or not session.get("is_admin"):
            return jsonify(error="Admin authentication required"), 401
        return view(*args, **kwargs)
    return wrapped


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if not session.get("user_id"):
            return jsonify(error="Authentication required"), 401
        return view(*args, **kwargs)
    return wrapped


def product_to_dict(row):
    return {
        "id": row["id"],
        "catKey": row["cat_key"],
        "icon": row["icon"],
        "imagePath": row["image_path"],
        "price": row["price"],
        "stock": row["stock"],
        "name": {"fr": row["name_fr"], "en": row["name_en"], "ar": row["name_ar"] or row["name_fr"]},
        "material": {"fr": row["material_fr"], "en": row["material_en"], "ar": row["material_ar"] or row["material_fr"]},
        "desc": {"fr": row["desc_fr"], "en": row["desc_en"], "ar": row["desc_ar"] or row["desc_fr"]},
        "long": {"fr": row["long_fr"], "en": row["long_en"], "ar": row["long_ar"] or row["long_fr"]},
        "isActive": bool(row["is_active"]),
    }


def user_to_dict(row):
    return {
        "id": row["id"],
        "fullName": row["full_name"],
        "email": row["email"],
        "isAdmin": bool(row["is_admin"]),
    }


# ------------------------------------------------------------ frontend  ---

def register_frontend_routes(app):
    """Serve the existing static site untouched, so `flask run` alone gives
    you the whole working website (frontend + API) on one port."""

    @app.route("/")
    def index():
        return send_from_directory(FRONTEND_DIR, "index.html")

    @app.route("/<path:path>")
    def frontend_files(path):
        full_path = os.path.join(FRONTEND_DIR, path)
        if os.path.isfile(full_path):
            return send_from_directory(FRONTEND_DIR, path)
        # Unknown non-API path: fall back to the SPA's index.html
        return send_from_directory(FRONTEND_DIR, "index.html")


# ------------------------------------------------------------- products ---

def register_product_routes(app):

    @app.get("/api/products")
    def list_products():
        db = db_module.get_db()
        cat = request.args.get("cat")
        if cat and cat != "all":
            rows = db.execute(
                "SELECT * FROM products WHERE is_active = 1 AND cat_key = ? ORDER BY id",
                (cat,),
            ).fetchall()
        else:
            rows = db.execute(
                "SELECT * FROM products WHERE is_active = 1 ORDER BY id"
            ).fetchall()
        return jsonify([product_to_dict(r) for r in rows])

    @app.get("/api/products/<int:product_id>")
    def get_product(product_id):
        db = db_module.get_db()
        row = db.execute(
            "SELECT * FROM products WHERE id = ? AND is_active = 1", (product_id,)
        ).fetchone()
        if not row:
            return jsonify(error="Product not found"), 404
        return jsonify(product_to_dict(row))


# ------------------------------------------------------------------ auth --

def register_auth_routes(app):

    @app.post("/api/auth/signup")
    def signup():
        data = request.get_json(silent=True) or {}
        full_name = (data.get("fullName") or "").strip()
        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""

        if not full_name or not email or len(password) < 6:
            return jsonify(error="fullName, email and a password (6+ chars) are required"), 400

        db = db_module.get_db()
        existing = db.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
        if existing:
            return jsonify(error="An account with this email already exists"), 409

        cur = db.execute(
            "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)",
            (full_name, email, generate_password_hash(password)),
        )
        db.commit()
        user = db.execute("SELECT * FROM users WHERE id = ?", (cur.lastrowid,)).fetchone()

        session.clear()
        session["user_id"] = user["id"]
        session["is_admin"] = bool(user["is_admin"])
        return jsonify(user_to_dict(user)), 201

    @app.post("/api/auth/login")
    def login():
        data = request.get_json(silent=True) or {}
        email = (data.get("email") or "").strip().lower()
        password = data.get("password") or ""

        db = db_module.get_db()
        user = db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        if not user or not check_password_hash(user["password_hash"], password):
            return jsonify(error="Invalid email or password"), 401

        session.clear()
        session["user_id"] = user["id"]
        session["is_admin"] = bool(user["is_admin"])
        return jsonify(user_to_dict(user))

    @app.post("/api/auth/logout")
    def logout():
        session.clear()
        return jsonify(ok=True)

    @app.get("/api/auth/me")
    def me():
        if not session.get("user_id"):
            return jsonify(user=None)
        db = db_module.get_db()
        user = db.execute("SELECT * FROM users WHERE id = ?", (session["user_id"],)).fetchone()
        if not user:
            session.clear()
            return jsonify(user=None)
        return jsonify(user=user_to_dict(user))


# ---------------------------------------------------------------- orders --

def register_order_routes(app):

    @app.post("/api/orders")
    def create_order():
        data = request.get_json(silent=True) or {}
        items = data.get("items") or []  # [{productId, qty}, ...]
        if not items:
            return jsonify(error="Cart is empty"), 400

        payment_method = data.get("paymentMethod", "cod")
        if payment_method not in ("card", "cod"):
            return jsonify(error="paymentMethod must be 'card' or 'cod'"), 400

        card_last4 = None
        payment_status = "unpaid"
        if payment_method == "card":
            card = data.get("card") or {}
            card_number = "".join(ch for ch in str(card.get("number", "")) if ch.isdigit())
            expiry = str(card.get("expiry", "")).strip()
            cvc = "".join(ch for ch in str(card.get("cvc", "")) if ch.isdigit())
            name_on_card = str(card.get("name", "")).strip()

            if len(card_number) < 13 or len(card_number) > 19:
                return jsonify(error="Invalid card number"), 400
            if not name_on_card:
                return jsonify(error="Cardholder name is required"), 400
            if not _EXPIRY_RE.match(expiry):
                return jsonify(error="Expiry must be in MM/YY format"), 400
            if len(cvc) < 3 or len(cvc) > 4:
                return jsonify(error="Invalid CVC"), 400

            # No real payment gateway is wired up here — this is a demo checkout.
            # We deliberately never store the full card number or CVC, only the
            # last 4 digits, so the database never holds sensitive card data.
            card_last4 = card_number[-4:]
            payment_status = "paid"

        db = db_module.get_db()
        user_id = session.get("user_id")
        guest_name = (data.get("guestName") or "").strip() or None
        guest_email = (data.get("guestEmail") or "").strip() or None

        if not user_id and not guest_email:
            return jsonify(error="guestEmail is required for orders placed without an account"), 400

        total = 0
        resolved_items = []
        for item in items:
            product = db.execute(
                "SELECT * FROM products WHERE id = ? AND is_active = 1", (item.get("productId"),)
            ).fetchone()
            qty = int(item.get("qty") or 0)
            if not product or qty <= 0:
                return jsonify(error=f"Invalid item: {item}"), 400
            if product["stock"] < qty:
                name = product["name_fr"]
                return jsonify(
                    error=f"Not enough stock for {name}: only {product['stock']} left"
                ), 409
            total += product["price"] * qty
            resolved_items.append((product["id"], qty, product["price"]))

        cur = db.execute(
            "INSERT INTO orders (user_id, guest_name, guest_email, status, payment_method, payment_status, card_last4, total) "
            "VALUES (?, ?, ?, 'pending', ?, ?, ?, ?)",
            (user_id, guest_name, guest_email, payment_method, payment_status, card_last4, total),
        )
        order_id = cur.lastrowid
        db.executemany(
            "INSERT INTO order_items (order_id, product_id, qty, unit_price) VALUES (?, ?, ?, ?)",
            [(order_id, pid, qty, price) for pid, qty, price in resolved_items],
        )
        # Decrement stock now that the order is confirmed as placeable. Done
        # after all items pass validation so a failed order never partially
        # reserves stock for the items checked before the failure.
        db.executemany(
            "UPDATE products SET stock = stock - ? WHERE id = ?",
            [(qty, pid) for pid, qty, _price in resolved_items],
        )
        db.commit()
        return jsonify(
            id=order_id, total=total, status="pending",
            paymentMethod=payment_method, paymentStatus=payment_status,
            cardLast4=card_last4,
        ), 201

    @app.get("/api/orders/mine")
    @login_required
    def my_orders():
        db = db_module.get_db()
        orders = db.execute(
            "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
            (session["user_id"],),
        ).fetchall()
        result = []
        for o in orders:
            items = db.execute(
                "SELECT oi.*, p.name_fr, p.name_en FROM order_items oi "
                "JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?",
                (o["id"],),
            ).fetchall()
            result.append({
                "id": o["id"],
                "status": o["status"],
                "paymentMethod": o["payment_method"],
                "paymentStatus": o["payment_status"],
                "cardLast4": o["card_last4"],
                "total": o["total"],
                "createdAt": o["created_at"],
                "items": [
                    {"productId": i["product_id"], "name": i["name_fr"], "qty": i["qty"], "unitPrice": i["unit_price"]}
                    for i in items
                ],
            })
        return jsonify(result)


# ---------------------------------------------------------------- admin ---

def register_admin_routes(app):

    @app.get("/api/admin/products")
    @admin_required
    def admin_list_products():
        db = db_module.get_db()
        rows = db.execute("SELECT * FROM products ORDER BY id").fetchall()
        return jsonify([product_to_dict(r) for r in rows])

    @app.post("/api/admin/products")
    @admin_required
    def admin_create_product():
        data = request.get_json(silent=True) or {}
        required = ["catKey", "icon", "price", "name", "material", "desc"]
        if not all(k in data for k in required):
            return jsonify(error=f"Missing fields, required: {required}"), 400

        db = db_module.get_db()
        cur = db.execute(
            """INSERT INTO products
               (cat_key, icon, image_path, price, stock,
                name_fr, name_en, name_ar,
                material_fr, material_en, material_ar,
                desc_fr, desc_en, desc_ar,
                long_fr, long_en, long_ar, is_active)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                data["catKey"], data["icon"], data.get("imagePath"), int(data["price"]),
                int(data.get("stock", 0)),
                data["name"].get("fr", ""), data["name"].get("en", ""), data["name"].get("ar"),
                data["material"].get("fr", ""), data["material"].get("en", ""), data["material"].get("ar"),
                data["desc"].get("fr", ""), data["desc"].get("en", ""), data["desc"].get("ar"),
                data.get("long", {}).get("fr"), data.get("long", {}).get("en"), data.get("long", {}).get("ar"),
                1 if data.get("isActive", True) else 0,
            ),
        )
        db.commit()
        row = db.execute("SELECT * FROM products WHERE id = ?", (cur.lastrowid,)).fetchone()
        return jsonify(product_to_dict(row)), 201

    @app.put("/api/admin/products/<int:product_id>")
    @admin_required
    def admin_update_product(product_id):
        db = db_module.get_db()
        row = db.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
        if not row:
            return jsonify(error="Product not found"), 404

        data = request.get_json(silent=True) or {}
        name = data.get("name", {})
        material = data.get("material", {})
        desc = data.get("desc", {})
        long_ = data.get("long", {})

        db.execute(
            """UPDATE products SET
                 cat_key=?, icon=?, image_path=?, price=?, stock=?,
                 name_fr=?, name_en=?, name_ar=?,
                 material_fr=?, material_en=?, material_ar=?,
                 desc_fr=?, desc_en=?, desc_ar=?,
                 long_fr=?, long_en=?, long_ar=?, is_active=?
               WHERE id=?""",
            (
                data.get("catKey", row["cat_key"]),
                data.get("icon", row["icon"]),
                data.get("imagePath", row["image_path"]),
                int(data.get("price", row["price"])),
                int(data.get("stock", row["stock"])),
                name.get("fr", row["name_fr"]), name.get("en", row["name_en"]), name.get("ar", row["name_ar"]),
                material.get("fr", row["material_fr"]), material.get("en", row["material_en"]), material.get("ar", row["material_ar"]),
                desc.get("fr", row["desc_fr"]), desc.get("en", row["desc_en"]), desc.get("ar", row["desc_ar"]),
                long_.get("fr", row["long_fr"]), long_.get("en", row["long_en"]), long_.get("ar", row["long_ar"]),
                1 if data.get("isActive", bool(row["is_active"])) else 0,
                product_id,
            ),
        )
        db.commit()
        updated = db.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
        return jsonify(product_to_dict(updated))

    @app.delete("/api/admin/products/<int:product_id>")
    @admin_required
    def admin_delete_product(product_id):
        db = db_module.get_db()
        db.execute("UPDATE products SET is_active = 0 WHERE id = ?", (product_id,))
        db.commit()
        return jsonify(ok=True)

    @app.post("/api/admin/products/<int:product_id>/photo")
    @admin_required
    def admin_upload_photo(product_id):
        db = db_module.get_db()
        row = db.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
        if not row:
            return jsonify(error="Product not found"), 404

        file = request.files.get("photo")
        if not file or file.filename == "":
            return jsonify(error="No photo file provided (field name: 'photo')"), 400

        ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
        if ext not in ALLOWED_EXTENSIONS:
            return jsonify(error=f"Unsupported file type. Allowed: {sorted(ALLOWED_EXTENSIONS)}"), 400

        os.makedirs(PRODUCTS_UPLOAD_DIR, exist_ok=True)
        filename = secure_filename(f"product-{product_id}-{uuid.uuid4().hex[:8]}.{ext}")
        file.save(os.path.join(PRODUCTS_UPLOAD_DIR, filename))

        image_path = f"products/{filename}"
        db.execute("UPDATE products SET image_path = ? WHERE id = ?", (image_path, product_id))
        db.commit()
        updated = db.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
        return jsonify(product_to_dict(updated))

    @app.get("/api/admin/orders")
    @admin_required
    def admin_list_orders():
        db = db_module.get_db()
        orders = db.execute("SELECT * FROM orders ORDER BY created_at DESC").fetchall()
        result = []
        for o in orders:
            items = db.execute(
                "SELECT oi.*, p.name_fr FROM order_items oi "
                "JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?",
                (o["id"],),
            ).fetchall()
            result.append({
                "id": o["id"],
                "userId": o["user_id"],
                "guestName": o["guest_name"],
                "guestEmail": o["guest_email"],
                "status": o["status"],
                "paymentMethod": o["payment_method"],
                "paymentStatus": o["payment_status"],
                "cardLast4": o["card_last4"],
                "total": o["total"],
                "createdAt": o["created_at"],
                "items": [{"name": i["name_fr"], "qty": i["qty"], "unitPrice": i["unit_price"]} for i in items],
            })
        return jsonify(result)

    @app.put("/api/admin/orders/<int:order_id>/status")
    @admin_required
    def admin_update_order_status(order_id):
        data = request.get_json(silent=True) or {}
        status = data.get("status")
        if status not in ("pending", "confirmed", "cancelled"):
            return jsonify(error="status must be one of pending/confirmed/cancelled"), 400
        db = db_module.get_db()
        db.execute("UPDATE orders SET status = ? WHERE id = ?", (status, order_id))
        db.commit()
        return jsonify(ok=True)


# ------------------------------------------------------------------ chat ---

def register_chat_routes(app):

    @app.post("/api/chat")
    def chat():
        data = request.get_json(silent=True) or {}
        message = (data.get("message") or "").strip()
        if not message:
            return jsonify(error="message is required"), 400
        if len(message) > 2000:
            return jsonify(error="message is too long"), 400

        history = data.get("history") or []
        # Only pass through well-formed {role, content} pairs, capped in size,
        # so a malformed or oversized payload can't be smuggled to the API.
        clean_history = []
        for turn in history[-20:]:
            role = turn.get("role")
            content = turn.get("content")
            if role in ("user", "assistant") and isinstance(content, str) and content.strip():
                clean_history.append({"role": role, "content": content[:2000]})

        reply, source = chat_module.get_reply(message, clean_history)
        return jsonify(reply=reply, source=source)


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
