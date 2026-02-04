-- The Commander Collector - Database Setup
-- Run this in phpMyAdmin to create the required tables

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create decks table
CREATE TABLE IF NOT EXISTS decks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  commander VARCHAR(150) NOT NULL,
  colors VARCHAR(10) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  played_at DATE NOT NULL,
  winning_turn INT NULL,
  notes TEXT NULL,
  game_type VARCHAR(10) NOT NULL DEFAULT 'standard',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create game_results table
CREATE TABLE IF NOT EXISTS game_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_id INT NOT NULL,
  deck_id INT NOT NULL,
  finish_position TINYINT NOT NULL,
  eliminated_turn INT NULL,
  team_number TINYINT NULL DEFAULT NULL,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_decks_player ON decks(player_id);
CREATE INDEX idx_game_results_game ON game_results(game_id);
CREATE INDEX idx_game_results_deck ON game_results(deck_id);
CREATE INDEX idx_games_played_at ON games(played_at);

-- Migration for existing databases (run these in phpMyAdmin if tables already exist)
-- ALTER TABLE games ADD COLUMN game_type VARCHAR(10) NOT NULL DEFAULT 'standard';
-- ALTER TABLE game_results ADD COLUMN team_number TINYINT NULL DEFAULT NULL;

-- Optional: Insert initial players (customize with your playgroup names)
-- INSERT INTO players (name) VALUES ('Rick'), ('Player 2'), ('Player 3'), ('Player 4');
