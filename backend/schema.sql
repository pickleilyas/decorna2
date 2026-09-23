-- Decorna database schema (SQLite)

PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  is_admin      INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE products (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  cat_key       TEXT NOT NULL,          -- vases, lighting, frames, ... (matches frontend category chips)
  icon          TEXT NOT NULL,          -- icon key used by the frontend (svg icon or 'bubbleVase' for a real photo)
  image_path    TEXT,                   -- optional real product photo, relative to /assets/products/
  price         INTEGER NOT NULL,       -- price in MAD (Moroccan dirham)
  stock         INTEGER NOT NULL DEFAULT 0,  -- units currently available; decremented when an order is placed
  name_fr       TEXT NOT NULL,
  name_en       TEXT NOT NULL,
  name_ar       TEXT,
  material_fr   TEXT NOT NULL,
  material_en   TEXT NOT NULL,
  material_ar   TEXT,
  desc_fr       TEXT NOT NULL,
  desc_en       TEXT NOT NULL,
  desc_ar       TEXT,
  long_fr       TEXT,                   -- longer description shown in the "Lire plus" modal
  long_en       TEXT,
  long_ar       TEXT,
  is_active     INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE orders (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
  guest_name      TEXT,
  guest_email     TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',  -- pending | confirmed | cancelled
  payment_method  TEXT NOT NULL DEFAULT 'cod',       -- 'card' | 'cod' (cash on delivery)
  payment_status  TEXT NOT NULL DEFAULT 'unpaid',    -- 'unpaid' | 'paid' (cod stays unpaid until delivery)
  card_last4      TEXT,                              -- last 4 digits only, for card orders — never store full card data
  total           INTEGER NOT NULL,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE order_items (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id      INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    INTEGER NOT NULL REFERENCES products(id),
  qty           INTEGER NOT NULL,
  unit_price    INTEGER NOT NULL         -- price snapshot at time of order
);

CREATE INDEX idx_products_cat ON products(cat_key);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
