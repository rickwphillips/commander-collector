-- v3.5.0: Add card lists feature
-- Lists are standalone card collections (not tied to a commander or player)
-- Can be attached to decks as their card list, or used as imports

CREATE TABLE IF NOT EXISTS lists (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS list_cards (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  list_id      INT NOT NULL,
  scryfall_id  VARCHAR(64),
  card_name    VARCHAR(255) NOT NULL,
  quantity     INT NOT NULL DEFAULT 1,
  is_commander TINYINT(1) NOT NULL DEFAULT 0,
  is_proxy     TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_list_cards_list FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE
);

CREATE INDEX idx_list_cards_list ON list_cards (list_id);
