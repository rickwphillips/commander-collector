-- v5.25.0: Finished games can be uploaded from offline clients without duplicates
-- Adds games.client_game_id: a client-generated UUID sent with POST games.php.
-- A repeat POST carrying the same id returns the existing game instead of
-- inserting a second one, so a retry after a dropped response is safe. The
-- unique index is what makes concurrent retries safe as well. Groundwork for
-- the native iOS game manager (docs/ios-game-manager-plan.md, Phase 0).
--
-- Idempotent: column and index are added only if missing (MySQL 5.7 has no
-- ADD COLUMN IF NOT EXISTS, so this uses the information_schema + PREPARE
-- pattern from v5.15.0). Safe to re-run.

SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'games'
    AND COLUMN_NAME = 'client_game_id'
);
SET @ddl = IF(@col_exists = 0,
  'ALTER TABLE games ADD COLUMN client_game_id CHAR(36) NULL AFTER id',
  'DO 0'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_exists = (
  SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'games'
    AND INDEX_NAME = 'uq_games_client_game_id'
);
SET @ddl = IF(@idx_exists = 0,
  'ALTER TABLE games ADD UNIQUE INDEX uq_games_client_game_id (client_game_id)',
  'DO 0'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.25.0', '2026-10-29', 'Finished games can be uploaded from offline clients without duplicates', 125)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.25.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'added', 'Saving a game can include a client-generated game id. Sending the same id again returns the game that was already saved instead of creating a duplicate, so a retry after a dropped connection is safe.', 0),
  (UUID(), @rid, 'added', 'A finished game''s event log can be sent with the save, or uploaded afterwards by a player who was in the game or an admin. This is the groundwork for the native iPad game manager, which plays offline and syncs later.', 1),
  (UUID(), @rid, 'added', 'The API the game manager uses (sign-in, players, decks, game settings, games, game log) is now described in an OpenAPI document, so the web and native clients are built from one contract.', 2);
