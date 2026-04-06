-- v4.6.0: Partner Commanders & Commander Autocomplete

-- Add partner column (safe if already exists)
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'decks' AND COLUMN_NAME = 'partner');
SET @sql = IF(@col_exists = 0, 'ALTER TABLE decks ADD COLUMN partner VARCHAR(150) NULL DEFAULT NULL AFTER commander', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

INSERT INTO changelog_releases (version, date, title, sort_order)
VALUES ('4.6.0', '2026-04-05', 'Partner Commanders & Commander Autocomplete', 86)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '4.6.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (release_id, type, text, sort_order) VALUES
  (@rid, 'added',    'Partner commander support — decks can now store a partner alongside the main commander', 0),
  (@rid, 'added',    'Commander autocomplete with Scryfall lookup on new deck and deck edit pages', 1),
  (@rid, 'added',    'Partner autocomplete with smart filtering — Background enchantments only appear when commander has Choose a Background', 2),
  (@rid, 'added',    'Commander art preview shown next to color identity when commander is selected', 3),
  (@rid, 'added',    'Mana cost pips shown in autocomplete dropdown results', 4),
  (@rid, 'improved', 'Color identity auto-set from commander and partner on selection', 5),
  (@rid, 'improved', 'Game Manager auto-populates partner from deck data when starting a game', 6),
  (@rid, 'improved', 'Decklist page syncs partner commander when saving card edits', 7);
