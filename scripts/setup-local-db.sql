-- Local development database setup
-- Run: mysql -u root < scripts/setup-local-db.sql

CREATE DATABASE IF NOT EXISTS commander_collector;

USE commander_collector;

CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS decks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  commander VARCHAR(150) NOT NULL,
  colors VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  played_at DATE NOT NULL,
  game_type VARCHAR(20) DEFAULT 'ffa',
  winning_turn INT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_id INT NOT NULL,
  deck_id INT NOT NULL,
  player_id INT NULL,
  finish_position TINYINT NOT NULL,
  eliminated_turn INT NULL,
  team_number TINYINT NULL,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Create local dev user
CREATE USER IF NOT EXISTS 'commander_dev'@'localhost' IDENTIFIED BY 'devpassword';
GRANT ALL PRIVILEGES ON commander_collector.* TO 'commander_dev'@'localhost';
FLUSH PRIVILEGES;
