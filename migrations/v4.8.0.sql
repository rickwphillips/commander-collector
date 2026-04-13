-- v4.8.0: Unified Card Workflow — Phase 2.1 Schema Foundation (UUID-native)
-- Date: 2026-04-07
-- Depends on: v4.7.0 (all INT PKs already converted to CHAR(36))
-- Summary: Adds list-first architecture — deck_id linkage on lists,
--   buffer_drafts generalization, list_cards/deck_cards role columns,
--   scryfall_card_cache legality + price columns, soft-delete trash on
--   decks/lists, system_state KV table, list_history audit log, and
--   backfills existing deck cards into list_cards for the dual-write bridge.
--
-- All new ID columns are CHAR(36) from birth. All new FK columns are CHAR(36)
-- matching their parent PKs (which are now CHAR(36) after v4.7.0).
--
-- IMPORTANT: deck_cards is NOT dropped in this migration. It stays as a
--   read-shadow table during dual-write. Phase 5 drops it.

-- ── Schema additions: lists ───────────────────────────────────────────────────
-- lists.id is now CHAR(36) after v4.7.0. The new deck_id column references
-- decks.id which is also CHAR(36).

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'lists' AND COLUMN_NAME = 'deck_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE lists ADD COLUMN deck_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'lists' AND COLUMN_NAME = 'format');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE lists ADD COLUMN format VARCHAR(32) NOT NULL DEFAULT ''commander'' AFTER deck_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'lists' AND COLUMN_NAME = 'role');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE lists ADD COLUMN role VARCHAR(32) NULL DEFAULT ''main'' AFTER format',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'lists' AND COLUMN_NAME = 'source');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE lists ADD COLUMN source VARCHAR(64) NULL AFTER role',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'lists' AND COLUMN_NAME = 'deleted_at');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE lists ADD COLUMN deleted_at TIMESTAMP NULL AFTER updated_at',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'lists' AND COLUMN_NAME = 'version');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE lists ADD COLUMN version INT NOT NULL DEFAULT 1 AFTER deleted_at',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Indexes on lists (MySQL 8.0+ supports IF NOT EXISTS here via INFORMATION_SCHEMA guard)
SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'lists' AND INDEX_NAME = 'idx_lists_deck');
SET @sql = IF(@idx_exists = 0,
  'ALTER TABLE lists ADD INDEX idx_lists_deck (deck_id, format, role)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'lists' AND INDEX_NAME = 'idx_lists_deleted');
SET @sql = IF(@idx_exists = 0,
  'ALTER TABLE lists ADD INDEX idx_lists_deleted (deleted_at)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── Schema additions: game_results ───────────────────────────────────────────

-- Per-game cardlist snapshot (thin: scryfall_id + qty + role). NULL for historical rows.
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'game_results' AND COLUMN_NAME = 'cardlist_snapshot');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE game_results ADD COLUMN cardlist_snapshot JSON NULL AFTER team_number',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── Schema additions: buffer_drafts (renamed from scan_drafts) ────────────────

-- Generalizes scan_drafts into buffer_drafts: supports all input methods
-- (Lookup, Import, Paste, Scan) per-user-per-device-per-context.
--
-- Rename guard: check if scan_drafts still exists before renaming.
SET @tbl_exists = (SELECT COUNT(*) FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'scan_drafts');
SET @sql = IF(@tbl_exists > 0,
  'RENAME TABLE scan_drafts TO buffer_drafts',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add new columns (guard each individually; table may already be buffer_drafts on re-run)
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'buffer_drafts' AND COLUMN_NAME = 'device_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE buffer_drafts ADD COLUMN device_id VARCHAR(64) NOT NULL DEFAULT ''''',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'buffer_drafts' AND COLUMN_NAME = 'context_type');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE buffer_drafts ADD COLUMN context_type ENUM(''new_list'',''new_deck_list'',''existing_list'',''existing_deck_list'') NOT NULL DEFAULT ''new_list''',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- context_ref: references a list_id or deck_id (now CHAR(36)) depending on context_type.
-- The original plan used BIGINT NULL, but NULL is not valid in a PRIMARY KEY column.
-- Decision: use CHAR(36) NOT NULL DEFAULT '' (empty string = no context).
-- This matches the UUID schema for list/deck ids, and empty string is the sentinel
-- for "no specific context" (e.g. new_list rows that don't link to an existing entity yet).
-- Phase 2.2 will validate that non-empty values match real list/deck UUIDs.
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'buffer_drafts' AND COLUMN_NAME = 'context_ref');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE buffer_drafts ADD COLUMN context_ref CHAR(36) NOT NULL DEFAULT ''''',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Coerce user_id from INT (the original scan_drafts.user_id type) to VARCHAR(36).
-- After v4.7.0, scan_drafts.id is now CHAR(36) but user_id was NOT converted there
-- because it is a local-system bug (INT should have been VARCHAR(36) from the start,
-- matching lists.user_id, players.user_id, etc.).
-- MySQL will CAST existing INT values to their string representation (e.g. 5 → '5').
-- Phase 2.2 will map these legacy int-as-string user_ids to proper auth UUIDs if needed.
SET @col_type = (SELECT DATA_TYPE FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'buffer_drafts' AND COLUMN_NAME = 'user_id');
SET @sql = IF(@col_type = 'int',
  'ALTER TABLE buffer_drafts MODIFY COLUMN user_id VARCHAR(36) NOT NULL',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Rebuild composite PK: drop old PK (on id) + unique key (uq_user), add new composite PK.
-- New PK: (user_id, device_id, context_type, context_ref).
-- Guard: check if the old single-column PK on `id` still exists.
SET @old_pk_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'buffer_drafts'
  AND INDEX_NAME = 'PRIMARY' AND COLUMN_NAME = 'id' AND SEQ_IN_INDEX = 1);
SET @sql = IF(@old_pk_exists > 0,
  'ALTER TABLE buffer_drafts DROP PRIMARY KEY',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @uq_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'buffer_drafts' AND INDEX_NAME = 'uq_user');
SET @sql = IF(@uq_exists > 0,
  'ALTER TABLE buffer_drafts DROP INDEX uq_user',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Drop the old id column (now a CHAR(36) after v4.7.0 — no longer needed with composite PK)
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'buffer_drafts' AND COLUMN_NAME = 'id');
SET @sql = IF(@col_exists > 0,
  'ALTER TABLE buffer_drafts DROP COLUMN id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @pk_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'buffer_drafts' AND INDEX_NAME = 'PRIMARY');
SET @sql = IF(@pk_exists = 0,
  'ALTER TABLE buffer_drafts ADD PRIMARY KEY (user_id, device_id, context_type, context_ref)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── Schema additions: decks ───────────────────────────────────────────────────

-- 30-day trash support on decks. Peers rule: commander/colors/has_* are untouched.
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'decks' AND COLUMN_NAME = 'deleted_at');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE decks ADD COLUMN deleted_at TIMESTAMP NULL',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @idx_exists = (SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'decks' AND INDEX_NAME = 'idx_decks_deleted');
SET @sql = IF(@idx_exists = 0,
  'ALTER TABLE decks ADD INDEX idx_decks_deleted (deleted_at)',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Format column on decks (re-audit confirmed it doesn't exist).
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'decks' AND COLUMN_NAME = 'format');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE decks ADD COLUMN format VARCHAR(32) NOT NULL DEFAULT ''commander'' AFTER name',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- partner column: already exists from v4.6.0 — guard with IF NOT EXISTS just in case.
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'decks' AND COLUMN_NAME = 'partner');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE decks ADD COLUMN partner VARCHAR(150) NULL DEFAULT NULL AFTER commander',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── Schema additions: list_cards ──────────────────────────────────────────────

-- list_cards.scryfall_id is already VARCHAR(64) NULL (verified in re-audit) — no widen needed.
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'list_cards' AND COLUMN_NAME = 'is_custom');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE list_cards ADD COLUMN is_custom TINYINT(1) NOT NULL DEFAULT 0',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'list_cards' AND COLUMN_NAME = 'role');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE list_cards ADD COLUMN role ENUM(''commander'',''partner'') NULL',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── Schema additions: deck_cards ──────────────────────────────────────────────

-- Widen scryfall_id from VARCHAR(36) to VARCHAR(64) to align with list_cards.
SET @col_len = (SELECT CHARACTER_MAXIMUM_LENGTH FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'deck_cards' AND COLUMN_NAME = 'scryfall_id');
SET @sql = IF(@col_len < 64,
  'ALTER TABLE deck_cards MODIFY COLUMN scryfall_id VARCHAR(64) DEFAULT NULL',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'deck_cards' AND COLUMN_NAME = 'is_custom');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE deck_cards ADD COLUMN is_custom TINYINT(1) NOT NULL DEFAULT 0',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'deck_cards' AND COLUMN_NAME = 'role');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE deck_cards ADD COLUMN role ENUM(''commander'',''partner'') NULL',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── Schema additions: scryfall_card_cache ─────────────────────────────────────

-- Widen scryfall_id from VARCHAR(36) to VARCHAR(64).
-- MySQL widens a UNIQUE KEY column in-place without needing to drop/re-add the index.
SET @col_len = (SELECT CHARACTER_MAXIMUM_LENGTH FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'scryfall_card_cache' AND COLUMN_NAME = 'scryfall_id');
SET @sql = IF(@col_len < 64,
  'ALTER TABLE scryfall_card_cache MODIFY COLUMN scryfall_id VARCHAR(64) NOT NULL',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'scryfall_card_cache' AND COLUMN_NAME = 'legalities');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE scryfall_card_cache ADD COLUMN legalities JSON NULL',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'scryfall_card_cache' AND COLUMN_NAME = 'legalities_cached_at');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE scryfall_card_cache ADD COLUMN legalities_cached_at TIMESTAMP NULL',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'scryfall_card_cache' AND COLUMN_NAME = 'prices');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE scryfall_card_cache ADD COLUMN prices JSON NULL',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'scryfall_card_cache' AND COLUMN_NAME = 'prices_cached_at');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE scryfall_card_cache ADD COLUMN prices_cached_at TIMESTAMP NULL',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── New table: system_state ───────────────────────────────────────────────────

-- Singleton-style key/value store for app-level state
-- (e.g. last_cleanup_run, feature flags, maintenance windows).
-- No UUID concerns: PK is the string key itself.
CREATE TABLE IF NOT EXISTS system_state (
  k           VARCHAR(64) NOT NULL,
  v           TEXT NULL,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (k)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ── New table: list_history ───────────────────────────────────────────────────

-- Write-only audit log for list mutations (v1). History view UI ships in v1.x.
-- id: CHAR(36) PRIMARY KEY with DEFAULT (UUID()) — MySQL 8.0+ functional default.
-- list_id: CHAR(36) NOT NULL — references lists.id (now CHAR(36) after v4.7.0).
-- user_id: VARCHAR(36) NULL — matches project-wide auth ID convention
--   (lists.user_id, players.user_id, stat_panels.user_id all use this shape).
--   NULL means system-generated action.
CREATE TABLE IF NOT EXISTS list_history (
  id               CHAR(36)     NOT NULL,
  list_id          CHAR(36)     NOT NULL,
  user_id          VARCHAR(36)  NULL,
  action           ENUM('create','update','rename','detach','attach','soft_delete','restore') NOT NULL,
  before_snapshot  JSON         NULL,
  after_snapshot   JSON         NULL,
  source           ENUM('manual','scan','import') NULL,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_list_history_list (list_id, created_at),
  INDEX idx_list_history_user (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ── Backfill: role columns from is_commander / decks.partner ──────────────────

-- Seed role='commander' on deck_cards from is_commander flag.
UPDATE deck_cards SET role = 'commander' WHERE is_commander = 1 AND role IS NULL;

-- Seed role='partner' on deck_cards where card_name matches the deck's partner name.
-- decks.partner stays untouched — it is the deck's identity, independent of any list.
UPDATE deck_cards dc
  JOIN decks d ON d.id = dc.deck_id
  SET dc.role = 'partner'
  WHERE d.partner IS NOT NULL
    AND dc.card_name = d.partner
    AND dc.role IS NULL;

-- Seed role='commander' on list_cards from is_commander flag.
UPDATE list_cards SET role = 'commander' WHERE is_commander = 1 AND role IS NULL;

-- ── Backfill: lists from decks ────────────────────────────────────────────────

-- For every deck that already has cards, create a paired 'main' list.
-- Decks without any deck_cards rows are left without a list (empty decks stay empty).
-- user_id is resolved through players: decks.player_id → players.user_id.
-- source='manual' is used as the default for all migrated lists.
-- id: UUID() called inline since list_history.id uses DEFAULT (UUID()) but
--   INSERT INTO ... SELECT needs explicit UUID() calls for each row.
START TRANSACTION;

INSERT INTO lists (id, deck_id, format, role, name, source, user_id, created_at, updated_at)
SELECT
  UUID(),
  d.id,
  'commander',
  'main',
  CONCAT(d.name, ' (main)'),
  'manual',
  p.user_id,
  d.created_at,
  d.created_at
FROM decks d
JOIN players p ON p.id = d.player_id
WHERE EXISTS (SELECT 1 FROM deck_cards dc WHERE dc.deck_id = d.id)
  AND NOT EXISTS (
    SELECT 1 FROM lists l
    WHERE l.deck_id = d.id AND l.role = 'main' AND l.format = 'commander'
  );

-- ── Backfill: list_cards from deck_cards ──────────────────────────────────────

-- Mirror deck_cards into list_cards for the just-created lists.
-- deck_cards is NOT dropped — it stays as a read-shadow table during dual-write.
-- Phase 5 drops it.
INSERT INTO list_cards (id, list_id, scryfall_id, card_name, quantity, is_commander, is_proxy, role)
SELECT
  UUID(),
  l.id,
  dc.scryfall_id,
  dc.card_name,
  dc.quantity,
  dc.is_commander,
  dc.is_proxy,
  dc.role
FROM deck_cards dc
JOIN lists l
  ON l.deck_id = dc.deck_id
  AND l.role = 'main'
  AND l.format = 'commander'
WHERE NOT EXISTS (
  SELECT 1 FROM list_cards lc
  WHERE lc.list_id = l.id AND lc.card_name = dc.card_name
);

COMMIT;

-- ── schema_migrations catch-up ────────────────────────────────────────────────

-- Backfill tracking rows for all migrations up through v4.8.0.
-- INSERT IGNORE skips rows that already exist (safe to re-run; v4.0.0–v4.7.0
-- were already backfilled by v4.7.0.sql but INSERT IGNORE is harmless on re-run).
INSERT IGNORE INTO schema_migrations (version, applied_at) VALUES
  ('4.0.0', '2026-04-01 00:00:00'),
  ('4.2.0', '2026-04-02 00:00:00'),
  ('4.3.0', '2026-04-03 00:00:00'),
  ('4.4.0', '2026-04-05 00:00:00'),
  ('4.5.0', '2026-04-05 00:00:00'),
  ('4.6.0', '2026-04-05 00:00:00'),
  ('4.7.0', '2026-04-07 00:00:00'),
  ('4.8.0', NOW());

-- ── Changelog ─────────────────────────────────────────────────────────────────

-- v4.7.0 release entry (UUID conversion — landed as part of the same logical phase)
INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '4.7.0', '2026-04-07', 'UUID Primary Key Conversion', 87)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid47 = (SELECT id FROM changelog_releases WHERE version = '4.7.0');

DELETE FROM changelog_changes WHERE release_id = @rid47;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid47, 'improved', 'All internal primary keys converted from INT AUTO_INCREMENT to CHAR(36) UUID — eliminates integer ID leakage and collision risk across environments', 0),
  (UUID(), @rid47, 'improved', 'All foreign key columns updated to CHAR(36) in lockstep with their parent PKs — FK constraints fully preserved', 1),
  (UUID(), @rid47, 'improved', 'coach_notes.player_id and rules_qa_log message ID references converted to CHAR(36) (undeclared references, not FK constraints)', 2),
  (UUID(), @rid47, 'improved', 'scan_drafts.id converted to CHAR(36) before Phase 2.1 rename to buffer_drafts', 3);

-- v4.8.0 release entry (Phase 2.1 schema additions)
INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '4.8.0', '2026-04-07', 'Unified Card Workflow — Phase 2.1 Schema Foundation', 88)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid48 = (SELECT id FROM changelog_releases WHERE version = '4.8.0');

DELETE FROM changelog_changes WHERE release_id = @rid48;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid48, 'added',    'Lists now link to decks via deck_id (CHAR(36)) — foundation for unified card workflow dual-write bridge', 0),
  (UUID(), @rid48, 'added',    'Lists gain format, role, source, deleted_at (30-day trash), and optimistic-concurrency version columns', 1),
  (UUID(), @rid48, 'added',    'Decks gain format and deleted_at (30-day trash) columns', 2),
  (UUID(), @rid48, 'added',    'list_cards and deck_cards gain role (commander/partner) and is_custom columns', 3),
  (UUID(), @rid48, 'added',    'scryfall_card_cache gains legalities + prices JSON columns with independent TTL timestamps', 4),
  (UUID(), @rid48, 'added',    'scryfall_id widened to VARCHAR(64) on deck_cards and scryfall_card_cache to support alternate card IDs', 5),
  (UUID(), @rid48, 'added',    'scan_drafts generalized to buffer_drafts — supports all input methods with per-device-per-context composite PK', 6),
  (UUID(), @rid48, 'added',    'buffer_drafts.context_ref is CHAR(36) NOT NULL DEFAULT '''' (empty string = no context) — fixes original plan''s NULL-in-PK bug', 7),
  (UUID(), @rid48, 'added',    'system_state key/value table for app-level singleton state (cleanup timestamps, feature flags)', 8),
  (UUID(), @rid48, 'added',    'list_history audit log table with CHAR(36) id and CHAR(36) list_id — write-only in v1, history view ships in v1.x', 9),
  (UUID(), @rid48, 'added',    'game_results gains cardlist_snapshot JSON column for per-player deck snapshots at game time', 10),
  (UUID(), @rid48, 'added',    'Backfilled existing deck cards into list_cards for the dual-write bridge (decks with cards only)', 11),
  (UUID(), @rid48, 'improved', 'schema_migrations tracking table caught up to reflect all migrations applied since v3.10.0', 12);
