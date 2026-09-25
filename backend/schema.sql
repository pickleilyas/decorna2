-- Decorna MySQL Schema
-- Database: decorna
-- Charset: utf8mb4

CREATE DATABASE IF NOT EXISTS `decorna` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `decorna`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- Users table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `is_admin` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `cat_key` VARCHAR(50) NOT NULL,
  `icon` VARCHAR(50) NOT NULL,
  `image_path` VARCHAR(255) DEFAULT NULL,
  `price` INT NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `name_fr` VARCHAR(255) NOT NULL,
  `name_en` VARCHAR(255) NOT NULL,
  `name_ar` VARCHAR(255) DEFAULT NULL,
  `material_fr` VARCHAR(255) NOT NULL,
  `material_en` VARCHAR(255) NOT NULL,
  `material_ar` VARCHAR(255) DEFAULT NULL,
  `desc_fr` TEXT NOT NULL,
  `desc_en` TEXT NOT NULL,
  `desc_ar` TEXT DEFAULT NULL,
  `long_fr` TEXT DEFAULT NULL,
  `long_en` TEXT DEFAULT NULL,
  `long_ar` TEXT DEFAULT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_products_cat` (`cat_key`),
  INDEX `idx_products_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Orders table
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `guest_name` VARCHAR(255) DEFAULT NULL,
  `guest_email` VARCHAR(255) DEFAULT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `payment_method` VARCHAR(50) NOT NULL DEFAULT 'cod',
  `payment_status` VARCHAR(50) NOT NULL DEFAULT 'unpaid',
  `card_last4` VARCHAR(4) DEFAULT NULL,
  `total` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_orders_user` (`user_id`),
  INDEX `idx_orders_created` (`created_at`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order items table
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `qty` INT NOT NULL,
  `unit_price` INT NOT NULL,
  INDEX `idx_order_items_order` (`order_id`),
  INDEX `idx_order_items_product` (`product_id`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default Admin Account (admin@decorna.ma / Decorna2026!)
INSERT INTO `users` (`full_name`, `email`, `password_hash`, `is_admin`)
VALUES ('Admin Decorna', 'admin@decorna.ma', '$2y$10$LWU945CDeSLltTO8xnvMZerbGO2vRBLysbvrhqtLpJlFQS7mLoP0G', 1)
ON DUPLICATE KEY UPDATE `is_admin` = 1;
