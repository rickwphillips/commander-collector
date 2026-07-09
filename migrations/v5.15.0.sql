-- v5.15.0: phone-safe commander art_crop proxy + server-side art cache
-- Adds a dedicated art_b64 column so art crops fetched through card-image.php
-- (?art=) are cached separately from the full-card image (image_b64). This lets
-- the board and remote load each crop once instead of re-downloading it from
-- Scryfall on every view.

-- Idempotent ADD COLUMN (MySQL has no ADD COLUMN IF NOT EXISTS): skip if the
-- column already exists so re-runs / pre-applied dev DBs don't error 1060.
SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'scryfall_card_cache'
    AND COLUMN_NAME = 'art_b64'
);
SET @ddl = IF(@col_exists = 0,
  'ALTER TABLE scryfall_card_cache ADD COLUMN art_b64 MEDIUMTEXT NULL AFTER image_b64',
  'DO 0'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.15.0', '2026-07-09', 'Phone-safe commander art on the live-game remote', 109)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.15.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed',    'Commander art now shows on the live-game remote and the board even when a phone cannot reach the image CDN directly. Art is served through the host as an art crop and filled in by commander name, so it works even for older games whose saved state never stored an art URL', 0),
  (UUID(), @rid, 'improved', 'Commander art crops fetched through the host are cached server-side, so the board and remote load each crop once instead of re-downloading it from Scryfall on every view', 1);
