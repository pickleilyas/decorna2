# Decorna — Backend PHP & MySQL

A simple, lightweight single-file REST API built in PHP 8+ and MySQL (PDO).

---

## 📁 File Structure

```
backend/
├── index.php    # Single-file API (Database, Auth, Products CRUD, Orders, Chat)
└── schema.sql   # MySQL database schema + 19 products seed + default admin
```

---

## 🗄️ Database Setup

1. **MySQL Configuration**:
   The backend connects to MySQL using standard defaults:
   - Host: `127.0.0.1` (or ENV `DB_HOST`)
   - Port: `3306` (or ENV `DB_PORT`)
   - Database: `decorna` (or ENV `DB_NAME`)
   - User: `root` (or ENV `DB_USER`)
   - Password: `""` (empty by default, or ENV `DB_PASS`)

2. **Automatic Initialization**:
   When MySQL is running, `backend/index.php` will automatically create the database `decorna` and import `schema.sql` on first request if the tables do not exist!

   You can also manually import `backend/schema.sql` into phpMyAdmin or MySQL CLI.

---

## 🔑 Default Admin Account

- **Email**: `admin@decorna.ma`
- **Password**: `Decorna2026!`
- **Admin Panel**: `/admin.html`

---

## 🚀 Running Locally

From the project root:
```bash
php -S localhost:8000 router.php
```
- Storefront: `http://localhost:8000/`
- Admin Panel: `http://localhost:8000/admin.html`

Or place the `decorna` folder in your XAMPP/WAMP `htdocs` directory and open `http://localhost/decorna/`.

---

## 📡 API Endpoints

- **Auth**:
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET  /api/auth/me`
- **Products**:
  - `GET    /api/products` (optional `?cat=...`)
  - `GET    /api/products/{id}`
  - `GET    /api/admin/products`
  - `POST   /api/admin/products`
  - `PUT    /api/admin/products/{id}`
  - `DELETE /api/admin/products/{id}`
  - `POST   /api/admin/products/{id}/photo`
- **Orders**:
  - `POST /api/orders`
  - `GET  /api/orders/mine`
  - `GET  /api/admin/orders`
  - `PUT  /api/admin/orders/{id}/status`
- **Chatbot**:
  - `POST /api/chat`
