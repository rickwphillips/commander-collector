-- v3.6.3: Game settings persistence
-- Store user preferences (sound, highlight, timer) per authenticated user

CREATE TABLE IF NOT EXISTS game_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  sound_enabled TINYINT(1) NOT NULL DEFAULT 1,
  highlight_mode TINYINT(1) NOT NULL DEFAULT 1,
  turn_timer_enabled TINYINT(1) NOT NULL DEFAULT 1,
  turn_timer_seconds INT NOT NULL DEFAULT 300,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_game_settings_user FOREIGN KEY (user_id) REFERENCES rickwphi_auth.users (id) ON DELETE CASCADE,
  UNIQUE KEY uk_user_id (user_id)
);

CREATE INDEX idx_game_settings_user ON game_settings (user_id);
