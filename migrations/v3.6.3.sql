-- v3.6.3: Game settings persistence
-- Store user preferences (sound, highlight, timer) per authenticated user

CREATE TABLE IF NOT EXISTS game_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  sound_enabled TINYINT(1) NOT NULL DEFAULT 1,
  highlight_mode TINYINT(1) NOT NULL DEFAULT 1,
  turn_timer_enabled TINYINT(1) NOT NULL DEFAULT 1,
  turn_timer_seconds INT NOT NULL DEFAULT 300,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user_id (user_id)
);
