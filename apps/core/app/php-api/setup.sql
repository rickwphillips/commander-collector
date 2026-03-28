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
  player_id INT NOT NULL,
  finish_position TINYINT NOT NULL,
  eliminated_turn INT NULL,
  team_number TINYINT NULL DEFAULT NULL,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_decks_player ON decks(player_id);
CREATE INDEX idx_game_results_game ON game_results(game_id);
CREATE INDEX idx_game_results_deck ON game_results(deck_id);
CREATE INDEX idx_game_results_player ON game_results(player_id);
CREATE INDEX idx_games_played_at ON games(played_at);

-- Migration for existing databases (run these in phpMyAdmin if tables already exist)
-- ALTER TABLE games ADD COLUMN game_type VARCHAR(10) NOT NULL DEFAULT 'standard';
-- ALTER TABLE game_results ADD COLUMN team_number TINYINT NULL DEFAULT NULL;

-- Migration: Add player_id to game_results (deck pilot, distinct from deck owner)
-- Step 1: Add nullable column
-- ALTER TABLE game_results ADD COLUMN player_id INT NULL AFTER deck_id;
-- Step 2: Backfill from deck owners
-- UPDATE game_results gr JOIN decks d ON gr.deck_id = d.id SET gr.player_id = d.player_id;
-- Step 3: Make NOT NULL and add constraints
-- ALTER TABLE game_results MODIFY COLUMN player_id INT NOT NULL;
-- ALTER TABLE game_results ADD CONSTRAINT fk_game_results_player FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE;
-- CREATE INDEX idx_game_results_player ON game_results(player_id);

-- Optional: Insert initial players (customize with your playgroup names)
-- INSERT INTO players (name) VALUES ('Rick'), ('Player 2'), ('Player 3'), ('Player 4');

-- NOTE: Authentication tables live in a separate database (rickwphi_auth).
-- See auth/setup.sql for the auth schema.

-- Migration: Add comparison panel support to stat_panels
-- Run in phpMyAdmin on rickwphi_app_commander (prod) and grandkid_arcade/dev DB:
-- ALTER TABLE stat_panels ADD COLUMN panel_type ENUM('predefined','comparison') NOT NULL DEFAULT 'predefined';
-- ALTER TABLE stat_panels ADD COLUMN config JSON NULL;

-- Migration: Add color boolean columns to decks table
-- Run in phpMyAdmin on rickwphi_app_commander (prod) and grandkid_arcade/dev DB:
-- ALTER TABLE decks
--   ADD COLUMN has_w TINYINT(1) NOT NULL DEFAULT 0,
--   ADD COLUMN has_u TINYINT(1) NOT NULL DEFAULT 0,
--   ADD COLUMN has_b TINYINT(1) NOT NULL DEFAULT 0,
--   ADD COLUMN has_r TINYINT(1) NOT NULL DEFAULT 0,
--   ADD COLUMN has_g TINYINT(1) NOT NULL DEFAULT 0;
--
-- UPDATE decks SET
--   has_w = IF(colors LIKE '%W%', 1, 0),
--   has_u = IF(colors LIKE '%U%', 1, 0),
--   has_b = IF(colors LIKE '%B%', 1, 0),
--   has_r = IF(colors LIKE '%R%', 1, 0),
--   has_g = IF(colors LIKE '%G%', 1, 0);
--
-- Normalize existing colors strings to canonical WUBRG order
-- UPDATE decks SET colors = CONCAT(
--   IF(has_w, 'W', ''), IF(has_u, 'U', ''), IF(has_b, 'B', ''),
--   IF(has_r, 'R', ''), IF(has_g, 'G', '')
-- ) WHERE colors != 'C' AND colors != '';
