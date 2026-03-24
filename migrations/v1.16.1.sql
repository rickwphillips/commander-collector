-- v1.10.0: Live game session tables for remote player panels

CREATE TABLE live_game_sessions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  state       JSON NOT NULL,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at  DATETIME NOT NULL,
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  INDEX idx_expires (expires_at)
);

CREATE TABLE live_game_seats (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  session_id  INT NOT NULL,
  seat        VARCHAR(10) NOT NULL,  -- 'bottom' | 'top' | 'left' | 'right'
  code        CHAR(8) NOT NULL,
  UNIQUE KEY uq_code (code),
  KEY fk_session (session_id),
  FOREIGN KEY (session_id) REFERENCES live_game_sessions(id) ON DELETE CASCADE
);
