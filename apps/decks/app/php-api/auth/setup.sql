-- Authentication database (separate from app databases)
-- Create database: rickwphi_auth on Bluehost
-- Run this SQL in phpMyAdmin against the auth database

CREATE TABLE IF NOT EXISTS auth_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS auth_invite_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(64) NOT NULL UNIQUE,
    created_by INT NOT NULL,
    used_by INT NULL,
    used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES auth_users(id),
    FOREIGN KEY (used_by) REFERENCES auth_users(id)
);

CREATE INDEX idx_auth_invite_codes_code ON auth_invite_codes(code);

-- Migration: Link players to auth users
-- Run on app DB (rickwphi_app_commander / commander_collector):
-- ALTER TABLE players ADD COLUMN user_id INT NULL;
-- UPDATE players SET user_id = 1 WHERE name = "Paul's Mom";
