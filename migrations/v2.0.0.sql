-- v1.31.0: Deck Scanner — Scryfall card cache + deck card lists

CREATE TABLE IF NOT EXISTS scryfall_card_cache (
  id INT AUTO_INCREMENT PRIMARY KEY,
  scryfall_id VARCHAR(36) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  image_uri TEXT,
  colors VARCHAR(10),
  color_identity VARCHAR(10),
  type_line VARCHAR(255),
  mana_cost VARCHAR(100),
  cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_scryfall_name (name)
);

CREATE TABLE IF NOT EXISTS deck_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  deck_id INT NOT NULL,
  scryfall_id VARCHAR(36),
  card_name VARCHAR(255) NOT NULL,
  quantity TINYINT NOT NULL DEFAULT 1,
  is_commander TINYINT(1) NOT NULL DEFAULT 0,
  is_proxy TINYINT(1) NOT NULL DEFAULT 0,
  FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE,
  INDEX idx_deck_cards_deck (deck_id)
);
