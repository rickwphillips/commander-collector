-- Stat Panels table for Commander Collector
-- Stores custom stat view configurations per user

CREATE TABLE IF NOT EXISTS stat_panels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    sections JSON NOT NULL,
    is_shared TINYINT(1) NOT NULL DEFAULT 0,
    share_code VARCHAR(20) DEFAULT NULL UNIQUE,
    panel_type ENUM('predefined','comparison') NOT NULL DEFAULT 'predefined',
    config JSON NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_is_shared (is_shared)
);

-- Migration for existing databases (add columns if table already exists):
-- ALTER TABLE stat_panels ADD COLUMN panel_type ENUM('predefined','comparison') NOT NULL DEFAULT 'predefined';
-- ALTER TABLE stat_panels ADD COLUMN config JSON NULL;
