-- v5.0.0: Phase 5 cleanup — drop deck_cards table, drop list_cards.is_commander column
--
-- After this migration:
--   - The legacy deck_cards table no longer exists
--   - list_cards.is_commander is replaced by list_cards.role enum
--   - Backsync from list_cards → deck_cards via scripts/sync-list-cards-to-deck-cards.php
--     no longer works (the rollback script needs deck_cards to exist)
--
-- Pre-conditions (verified manually before running):
--   1. mysqldump backup of commander_collector taken
--   2. scripts/verify-deck-list-parity.php passes (zero violations)
--   3. All PHP readers/writers cut over from deck_cards to list_cards (Phase 2.2 step 2)
--
-- Rollback: restore from the mysqldump backup. There is no in-migration rollback path.
--
-- Peers rule reminder: decks.commander/partner/colors/has_* stay forever. They are
-- deck-native. Only the join table dies.

-- ─── Drop deck_cards FK and table ────────────────────────────────────────────

-- The FK was named `deck_cards_ibfk_1` per the original schema. Drop it explicitly first
-- because some MySQL versions don't drop FKs cleanly via DROP TABLE alone.
SET @fk_exists = (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'deck_cards'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
);
SET @sql = IF(@fk_exists > 0, 'ALTER TABLE deck_cards DROP FOREIGN KEY deck_cards_ibfk_1', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Drop the table.
DROP TABLE IF EXISTS deck_cards;

-- ─── Drop list_cards.is_commander column ─────────────────────────────────────

-- list_cards.role (added in v4.8.0) replaces is_commander. Verify the role column
-- exists before dropping is_commander to avoid leaving the data without a signal.
SET @role_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'list_cards'
    AND COLUMN_NAME = 'role'
);
SET @sql = IF(
  @role_exists = 1,
  'ALTER TABLE list_cards DROP COLUMN is_commander',
  'SELECT "ABORT: list_cards.role does not exist; cannot drop is_commander safely"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ─── schema_migrations row ────────────────────────────────────────────────────

INSERT IGNORE INTO schema_migrations (version, applied_at) VALUES ('5.0.0', NOW());

-- ─── Changelog entry ─────────────────────────────────────────────────────────
-- Note: changelog_releases.id and changelog_changes.id are CHAR(36) UUID post-v4.7.0
-- and have no DEFAULT — explicit UUID() required on every INSERT.

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.0.0', CURDATE(), 'Unified Card Workflow — Phase 5 Cleanup', 90)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.0.0');
DELETE FROM changelog_changes WHERE release_id = @rid;

-- The `type` enum is ('added','changed','fixed','improved') — 'removed' is not allowed.
INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'changed',  'Legacy deck_cards table dropped — all card storage now lives in list_cards via lists.deck_id', 0),
  (UUID(), @rid, 'changed',  'list_cards.is_commander column dropped — replaced by list_cards.role enum (commander/partner)', 1),
  (UUID(), @rid, 'changed',  'Phase 5 of the unified card workflow refactor complete: decks and lists are now first-class peers throughout the schema', 2);
