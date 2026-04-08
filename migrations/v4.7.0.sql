-- v4.7.0: INT → CHAR(36) UUID Primary Key Conversion
-- Date: 2026-04-07
-- Summary: Converts all INT AUTO_INCREMENT primary keys and their referencing FK columns
--   to CHAR(36) UUID values. Existing rows get fresh UUIDs. The database is fully
--   operational after this migration; all FK constraints are preserved with identical
--   ON DELETE behavior. New rows inserted after this migration should use UUID().
--
-- Strategy: shadow-column pattern
--   Block A — add new_id CHAR(36) NULL alongside each INT id, populate with UUID(),
--              add shadow FK columns on child tables, populate by joining parent.
--   Block B — drop all FK constraints, swap columns (drop old, rename shadow),
--              rebuild PKs, recreate FK constraints.
--   Block C — schema_migrations catch-up backfill + 4.7.0 row.
--
-- Tables converted (20):
--   changelog_changes, changelog_releases, coach_notes, deck_cards, decks,
--   game_results, game_settings, games, list_cards, lists, live_game_seats,
--   live_game_sessions, players, rules_ai_corrections, rules_conversations,
--   rules_messages, rules_patterns, rules_qa_log, scan_drafts, scryfall_card_cache,
--   stat_panels
--
-- Note: pattern_errors.id is already VARCHAR(16) — skipped.
--       schema_migrations.version is already VARCHAR(20) — skipped.
--       scryfall_card_cache.scryfall_id is a lookup field (not the PK) — left alone.
--
-- Note on coach_notes.player_id: this column semantically references players.id
--   but has NO declared FK constraint (only a KEY index). It is converted via shadow
--   column exactly like FK columns, but no FK drop/recreate is needed for it.
--
-- Note on rules_qa_log.user_message_id / assistant_message_id: these reference
--   rules_messages.id semantically but have no declared FK constraint. Converted
--   via shadow columns without FK operations.
--
-- FK count: 12 declared FK constraints dropped and recreated (per verified inventory).

-- ══════════════════════════════════════════════════════════════════════════════
-- Block A: Add and populate shadow columns
-- ══════════════════════════════════════════════════════════════════════════════

-- ── A1: changelog_releases (parent; referenced by changelog_changes) ──────────

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'changelog_releases' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE changelog_releases ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE changelog_releases SET new_id = UUID() WHERE new_id IS NULL;

-- ── A2: changelog_changes (child of changelog_releases) ───────────────────────

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'changelog_changes' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE changelog_changes ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE changelog_changes SET new_id = UUID() WHERE new_id IS NULL;

-- Shadow FK column: changelog_changes.release_id → changelog_releases.id
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'changelog_changes' AND COLUMN_NAME = 'new_release_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE changelog_changes ADD COLUMN new_release_id CHAR(36) NULL AFTER release_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE changelog_changes cc
  JOIN changelog_releases cr ON cr.id = cc.release_id
  SET cc.new_release_id = cr.new_id
  WHERE cc.new_release_id IS NULL;

-- ── A3: players (parent; referenced by decks, game_results, coach_notes) ──────

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'players' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE players ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE players SET new_id = UUID() WHERE new_id IS NULL;

-- ── A4: decks (parent of deck_cards, game_results; child of players) ──────────

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'decks' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE decks ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE decks SET new_id = UUID() WHERE new_id IS NULL;

-- Shadow FK column: decks.player_id → players.id
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'decks' AND COLUMN_NAME = 'new_player_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE decks ADD COLUMN new_player_id CHAR(36) NULL AFTER player_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE decks d
  JOIN players p ON p.id = d.player_id
  SET d.new_player_id = p.new_id
  WHERE d.new_player_id IS NULL;

-- ── A5: games (parent; referenced by game_results) ────────────────────────────

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'games' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE games ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE games SET new_id = UUID() WHERE new_id IS NULL;

-- ── A6: game_results (child of games, decks, players) ────────────────────────

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'game_results' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE game_results ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE game_results SET new_id = UUID() WHERE new_id IS NULL;

-- Shadow FK: game_results.game_id → games.id
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'game_results' AND COLUMN_NAME = 'new_game_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE game_results ADD COLUMN new_game_id CHAR(36) NULL AFTER game_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE game_results gr
  JOIN games g ON g.id = gr.game_id
  SET gr.new_game_id = g.new_id
  WHERE gr.new_game_id IS NULL;

-- Shadow FK: game_results.deck_id → decks.id
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'game_results' AND COLUMN_NAME = 'new_deck_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE game_results ADD COLUMN new_deck_id CHAR(36) NULL AFTER deck_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE game_results gr
  JOIN decks d ON d.id = gr.deck_id
  SET gr.new_deck_id = d.new_id
  WHERE gr.new_deck_id IS NULL;

-- Shadow FK: game_results.player_id → players.id (nullable)
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'game_results' AND COLUMN_NAME = 'new_player_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE game_results ADD COLUMN new_player_id CHAR(36) NULL AFTER player_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- player_id is nullable; rows with NULL player_id keep NULL in shadow column
UPDATE game_results gr
  JOIN players p ON p.id = gr.player_id
  SET gr.new_player_id = p.new_id
  WHERE gr.player_id IS NOT NULL AND gr.new_player_id IS NULL;

-- ── A7: deck_cards (child of decks) ───────────────────────────────────────────

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'deck_cards' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE deck_cards ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE deck_cards SET new_id = UUID() WHERE new_id IS NULL;

-- Shadow FK: deck_cards.deck_id → decks.id
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'deck_cards' AND COLUMN_NAME = 'new_deck_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE deck_cards ADD COLUMN new_deck_id CHAR(36) NULL AFTER deck_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE deck_cards dc
  JOIN decks d ON d.id = dc.deck_id
  SET dc.new_deck_id = d.new_id
  WHERE dc.new_deck_id IS NULL;

-- ── A8: lists (parent; referenced by list_cards) ──────────────────────────────

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'lists' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE lists ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE lists SET new_id = UUID() WHERE new_id IS NULL;

-- ── A9: list_cards (child of lists) ───────────────────────────────────────────

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'list_cards' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE list_cards ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE list_cards SET new_id = UUID() WHERE new_id IS NULL;

-- Shadow FK: list_cards.list_id → lists.id
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'list_cards' AND COLUMN_NAME = 'new_list_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE list_cards ADD COLUMN new_list_id CHAR(36) NULL AFTER list_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE list_cards lc
  JOIN lists l ON l.id = lc.list_id
  SET lc.new_list_id = l.new_id
  WHERE lc.new_list_id IS NULL;

-- ── A10: live_game_sessions (parent; referenced by live_game_seats) ───────────

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'live_game_sessions' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE live_game_sessions ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE live_game_sessions SET new_id = UUID() WHERE new_id IS NULL;

-- ── A11: live_game_seats (child of live_game_sessions) ───────────────────────

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'live_game_seats' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE live_game_seats ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE live_game_seats SET new_id = UUID() WHERE new_id IS NULL;

-- Shadow FK: live_game_seats.session_id → live_game_sessions.id
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'live_game_seats' AND COLUMN_NAME = 'new_session_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE live_game_seats ADD COLUMN new_session_id CHAR(36) NULL AFTER session_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE live_game_seats lgs
  JOIN live_game_sessions s ON s.id = lgs.session_id
  SET lgs.new_session_id = s.new_id
  WHERE lgs.new_session_id IS NULL;

-- ── A12: rules_conversations (parent; referenced by rules_messages, rules_qa_log, rules_ai_corrections) ──

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rules_conversations' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE rules_conversations ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE rules_conversations SET new_id = UUID() WHERE new_id IS NULL;

-- ── A13: rules_messages (child of rules_conversations) ────────────────────────

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rules_messages' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE rules_messages ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE rules_messages SET new_id = UUID() WHERE new_id IS NULL;

-- Shadow FK: rules_messages.conversation_id → rules_conversations.id
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rules_messages' AND COLUMN_NAME = 'new_conversation_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE rules_messages ADD COLUMN new_conversation_id CHAR(36) NULL AFTER conversation_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE rules_messages rm
  JOIN rules_conversations rc ON rc.id = rm.conversation_id
  SET rm.new_conversation_id = rc.new_id
  WHERE rm.new_conversation_id IS NULL;

-- ── A14: rules_qa_log (child of rules_conversations; parent of rules_ai_corrections) ──

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rules_qa_log' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE rules_qa_log ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE rules_qa_log SET new_id = UUID() WHERE new_id IS NULL;

-- Shadow FK: rules_qa_log.conversation_id → rules_conversations.id
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rules_qa_log' AND COLUMN_NAME = 'new_conversation_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE rules_qa_log ADD COLUMN new_conversation_id CHAR(36) NULL AFTER conversation_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE rules_qa_log rql
  JOIN rules_conversations rc ON rc.id = rql.conversation_id
  SET rql.new_conversation_id = rc.new_id
  WHERE rql.new_conversation_id IS NULL;

-- Shadow columns for undeclared references: user_message_id / assistant_message_id
-- These reference rules_messages.id semantically but have no FK constraint declared.
-- Converting them to CHAR(36) to stay consistent; no FK drop/recreate needed.
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rules_qa_log' AND COLUMN_NAME = 'new_user_message_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE rules_qa_log ADD COLUMN new_user_message_id CHAR(36) NULL AFTER user_message_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE rules_qa_log rql
  JOIN rules_messages rm ON rm.id = rql.user_message_id
  SET rql.new_user_message_id = rm.new_id
  WHERE rql.user_message_id IS NOT NULL AND rql.new_user_message_id IS NULL;

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rules_qa_log' AND COLUMN_NAME = 'new_assistant_message_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE rules_qa_log ADD COLUMN new_assistant_message_id CHAR(36) NULL AFTER assistant_message_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE rules_qa_log rql
  JOIN rules_messages rm ON rm.id = rql.assistant_message_id
  SET rql.new_assistant_message_id = rm.new_id
  WHERE rql.assistant_message_id IS NOT NULL AND rql.new_assistant_message_id IS NULL;

-- ── A15: rules_ai_corrections (child of rules_conversations and rules_qa_log) ──

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rules_ai_corrections' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE rules_ai_corrections ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE rules_ai_corrections SET new_id = UUID() WHERE new_id IS NULL;

-- Shadow FK: rules_ai_corrections.conversation_id → rules_conversations.id
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rules_ai_corrections' AND COLUMN_NAME = 'new_conversation_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE rules_ai_corrections ADD COLUMN new_conversation_id CHAR(36) NULL AFTER conversation_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE rules_ai_corrections rac
  JOIN rules_conversations rc ON rc.id = rac.conversation_id
  SET rac.new_conversation_id = rc.new_id
  WHERE rac.new_conversation_id IS NULL;

-- Shadow FK: rules_ai_corrections.qa_log_id → rules_qa_log.id (nullable, ON DELETE SET NULL)
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rules_ai_corrections' AND COLUMN_NAME = 'new_qa_log_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE rules_ai_corrections ADD COLUMN new_qa_log_id CHAR(36) NULL AFTER qa_log_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE rules_ai_corrections rac
  JOIN rules_qa_log rql ON rql.id = rac.qa_log_id
  SET rac.new_qa_log_id = rql.new_id
  WHERE rac.qa_log_id IS NOT NULL AND rac.new_qa_log_id IS NULL;

-- ── A16: rules_patterns (no incoming or outgoing FK constraints) ───────────────

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'rules_patterns' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE rules_patterns ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE rules_patterns SET new_id = UUID() WHERE new_id IS NULL;

-- ── A17: game_settings (no FK constraints; user_id is already VARCHAR(36)) ────

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'game_settings' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE game_settings ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE game_settings SET new_id = UUID() WHERE new_id IS NULL;

-- ── A18: stat_panels (no FK constraints; user_id is already VARCHAR(36)) ──────

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'stat_panels' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE stat_panels ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE stat_panels SET new_id = UUID() WHERE new_id IS NULL;

-- ── A19: scryfall_card_cache (no FK constraints) ──────────────────────────────
-- Note: scryfall_id (VARCHAR(36)) is an EXTERNAL reference field, not the PK.
-- We convert the internal `id` column only. scryfall_id stays as-is.

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'scryfall_card_cache' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE scryfall_card_cache ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE scryfall_card_cache SET new_id = UUID() WHERE new_id IS NULL;

-- ── A20: scan_drafts (no FK constraints; user_id is INT — left as-is here,
--   converted to VARCHAR(36) during Phase 2.1 rename in v4.8.0) ──────────────

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'scan_drafts' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE scan_drafts ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE scan_drafts SET new_id = UUID() WHERE new_id IS NULL;

-- ── A21: coach_notes (player_id references players.id — no FK constraint declared) ──

SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'coach_notes' AND COLUMN_NAME = 'new_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE coach_notes ADD COLUMN new_id CHAR(36) NULL AFTER id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE coach_notes SET new_id = UUID() WHERE new_id IS NULL;

-- Shadow column for undeclared reference: coach_notes.player_id → players.id
-- No FK constraint to drop/recreate; just convert the column type.
SET @col_exists = (SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'coach_notes' AND COLUMN_NAME = 'new_player_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE coach_notes ADD COLUMN new_player_id CHAR(36) NULL AFTER player_id',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE coach_notes cn
  JOIN players p ON p.id = cn.player_id
  SET cn.new_player_id = p.new_id
  WHERE cn.new_player_id IS NULL;

-- ══════════════════════════════════════════════════════════════════════════════
-- Block B: Atomic FK swap
-- Note: MySQL DDL operations (ALTER TABLE) are auto-committing and cannot be
-- wrapped in a single atomic transaction. The sequence below is ordered to
-- minimize the window of inconsistency:
--   1. Drop all FK constraints first (leaves then roots).
--   2. Swap all columns on all tables (drop old id/FK, rename shadow, rebuild PK).
--   3. Recreate all FK constraints (roots first so children can reference them).
-- ══════════════════════════════════════════════════════════════════════════════

-- ── B1: Drop all FK constraints (leaf-first ordering) ─────────────────────────

-- Leaves: tables that only have outgoing FKs (no other table FKs into them)
ALTER TABLE changelog_changes    DROP FOREIGN KEY fk_changelog_release;
ALTER TABLE deck_cards           DROP FOREIGN KEY deck_cards_ibfk_1;
ALTER TABLE list_cards           DROP FOREIGN KEY fk_list_cards_list;
ALTER TABLE live_game_seats      DROP FOREIGN KEY live_game_seats_ibfk_1;
ALTER TABLE rules_messages       DROP FOREIGN KEY rules_messages_ibfk_1;
ALTER TABLE rules_ai_corrections DROP FOREIGN KEY fk_ai_corrections_conversation;
ALTER TABLE rules_ai_corrections DROP FOREIGN KEY fk_ai_corrections_qa_log;

-- Mid-level: tables that have outgoing FKs and are referenced by leaves above
ALTER TABLE game_results         DROP FOREIGN KEY game_results_ibfk_1;
ALTER TABLE game_results         DROP FOREIGN KEY game_results_ibfk_2;
ALTER TABLE game_results         DROP FOREIGN KEY game_results_ibfk_3;
ALTER TABLE rules_qa_log         DROP FOREIGN KEY fk_qa_log_conversation;
ALTER TABLE decks                DROP FOREIGN KEY decks_ibfk_1;

-- ── B2: Swap columns on all tables ────────────────────────────────────────────
-- Order: leaves first (so we don't block parent swaps), roots last.
-- Each table: DROP old id column, CHANGE new_id → id, set NOT NULL, ADD PRIMARY KEY.
-- For child FK columns: DROP old FK column, CHANGE new_FK → FK.

-- changelog_changes (leaf child of changelog_releases)
ALTER TABLE changelog_changes
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id),
  DROP COLUMN release_id,
  CHANGE COLUMN new_release_id release_id CHAR(36) NOT NULL;

-- deck_cards (leaf child of decks)
ALTER TABLE deck_cards
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id),
  DROP COLUMN deck_id,
  CHANGE COLUMN new_deck_id deck_id CHAR(36) NOT NULL;

-- list_cards (leaf child of lists)
ALTER TABLE list_cards
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id),
  DROP COLUMN list_id,
  CHANGE COLUMN new_list_id list_id CHAR(36) NOT NULL;

-- live_game_seats (leaf child of live_game_sessions)
ALTER TABLE live_game_seats
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id),
  DROP COLUMN session_id,
  CHANGE COLUMN new_session_id session_id CHAR(36) NOT NULL;

-- rules_messages (leaf child of rules_conversations)
ALTER TABLE rules_messages
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id),
  DROP COLUMN conversation_id,
  CHANGE COLUMN new_conversation_id conversation_id CHAR(36) NOT NULL;

-- rules_ai_corrections (leaf child of rules_conversations and rules_qa_log)
ALTER TABLE rules_ai_corrections
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id),
  DROP COLUMN conversation_id,
  CHANGE COLUMN new_conversation_id conversation_id CHAR(36) NOT NULL,
  DROP COLUMN qa_log_id,
  CHANGE COLUMN new_qa_log_id qa_log_id CHAR(36) NULL;

-- coach_notes (undeclared reference to players.id — no FK constraint)
ALTER TABLE coach_notes
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id),
  DROP COLUMN player_id,
  CHANGE COLUMN new_player_id player_id CHAR(36) NOT NULL;

-- game_results (child of games, decks, players)
ALTER TABLE game_results
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id),
  DROP COLUMN game_id,
  CHANGE COLUMN new_game_id game_id CHAR(36) NOT NULL,
  DROP COLUMN deck_id,
  CHANGE COLUMN new_deck_id deck_id CHAR(36) NOT NULL,
  DROP COLUMN player_id,
  CHANGE COLUMN new_player_id player_id CHAR(36) NULL;

-- rules_qa_log (child of rules_conversations; also has undeclared refs to rules_messages)
ALTER TABLE rules_qa_log
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id),
  DROP COLUMN conversation_id,
  CHANGE COLUMN new_conversation_id conversation_id CHAR(36) NOT NULL,
  DROP COLUMN user_message_id,
  CHANGE COLUMN new_user_message_id user_message_id CHAR(36) NULL,
  DROP COLUMN assistant_message_id,
  CHANGE COLUMN new_assistant_message_id assistant_message_id CHAR(36) NULL;

-- decks (child of players; parent of deck_cards and game_results)
ALTER TABLE decks
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id),
  DROP COLUMN player_id,
  CHANGE COLUMN new_player_id player_id CHAR(36) NOT NULL;

-- Root parents (no outgoing FK constraints):

-- changelog_releases
ALTER TABLE changelog_releases
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id);

-- players
ALTER TABLE players
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id);

-- games
ALTER TABLE games
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id);

-- lists
ALTER TABLE lists
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id);

-- live_game_sessions
ALTER TABLE live_game_sessions
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id);

-- rules_conversations
ALTER TABLE rules_conversations
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id);

-- rules_patterns (no FK references in or out)
ALTER TABLE rules_patterns
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id);

-- game_settings (no FK constraints; user_id is VARCHAR(36) auth ref)
ALTER TABLE game_settings
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id);

-- stat_panels (no FK constraints; user_id is VARCHAR(36) auth ref)
ALTER TABLE stat_panels
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id);

-- scryfall_card_cache (no FK constraints)
ALTER TABLE scryfall_card_cache
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id);

-- scan_drafts (no FK constraints)
ALTER TABLE scan_drafts
  DROP COLUMN id,
  CHANGE COLUMN new_id id CHAR(36) NOT NULL,
  ADD PRIMARY KEY (id);

-- ── B3: Recreate all FK constraints (root-first ordering) ─────────────────────

-- changelog_changes.release_id → changelog_releases.id ON DELETE CASCADE
ALTER TABLE changelog_changes
  ADD CONSTRAINT fk_changelog_release
    FOREIGN KEY (release_id) REFERENCES changelog_releases (id) ON DELETE CASCADE;

-- decks.player_id → players.id ON DELETE CASCADE
ALTER TABLE decks
  ADD CONSTRAINT decks_ibfk_1
    FOREIGN KEY (player_id) REFERENCES players (id) ON DELETE CASCADE;

-- game_results.game_id → games.id ON DELETE CASCADE
ALTER TABLE game_results
  ADD CONSTRAINT game_results_ibfk_1
    FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE;

-- game_results.deck_id → decks.id ON DELETE CASCADE
ALTER TABLE game_results
  ADD CONSTRAINT game_results_ibfk_2
    FOREIGN KEY (deck_id) REFERENCES decks (id) ON DELETE CASCADE;

-- game_results.player_id → players.id ON DELETE CASCADE
ALTER TABLE game_results
  ADD CONSTRAINT game_results_ibfk_3
    FOREIGN KEY (player_id) REFERENCES players (id) ON DELETE CASCADE;

-- deck_cards.deck_id → decks.id ON DELETE CASCADE
ALTER TABLE deck_cards
  ADD CONSTRAINT deck_cards_ibfk_1
    FOREIGN KEY (deck_id) REFERENCES decks (id) ON DELETE CASCADE;

-- list_cards.list_id → lists.id ON DELETE CASCADE
ALTER TABLE list_cards
  ADD CONSTRAINT fk_list_cards_list
    FOREIGN KEY (list_id) REFERENCES lists (id) ON DELETE CASCADE;

-- live_game_seats.session_id → live_game_sessions.id ON DELETE CASCADE
ALTER TABLE live_game_seats
  ADD CONSTRAINT live_game_seats_ibfk_1
    FOREIGN KEY (session_id) REFERENCES live_game_sessions (id) ON DELETE CASCADE;

-- rules_messages.conversation_id → rules_conversations.id ON DELETE CASCADE
ALTER TABLE rules_messages
  ADD CONSTRAINT rules_messages_ibfk_1
    FOREIGN KEY (conversation_id) REFERENCES rules_conversations (id) ON DELETE CASCADE;

-- rules_qa_log.conversation_id → rules_conversations.id ON DELETE CASCADE
ALTER TABLE rules_qa_log
  ADD CONSTRAINT fk_qa_log_conversation
    FOREIGN KEY (conversation_id) REFERENCES rules_conversations (id) ON DELETE CASCADE;

-- rules_ai_corrections.conversation_id → rules_conversations.id ON DELETE CASCADE
ALTER TABLE rules_ai_corrections
  ADD CONSTRAINT fk_ai_corrections_conversation
    FOREIGN KEY (conversation_id) REFERENCES rules_conversations (id) ON DELETE CASCADE;

-- rules_ai_corrections.qa_log_id → rules_qa_log.id ON DELETE SET NULL
ALTER TABLE rules_ai_corrections
  ADD CONSTRAINT fk_ai_corrections_qa_log
    FOREIGN KEY (qa_log_id) REFERENCES rules_qa_log (id) ON DELETE SET NULL;

-- ══════════════════════════════════════════════════════════════════════════════
-- Block C: schema_migrations catch-up
-- ══════════════════════════════════════════════════════════════════════════════

-- Backfill tracking rows for migrations that were applied via manual or alternate
-- paths without writing to schema_migrations. INSERT IGNORE is idempotent.
INSERT IGNORE INTO schema_migrations (version, applied_at) VALUES
  ('4.0.0', '2026-04-01 00:00:00'),
  ('4.2.0', '2026-04-02 00:00:00'),
  ('4.3.0', '2026-04-03 00:00:00'),
  ('4.4.0', '2026-04-05 00:00:00'),
  ('4.5.0', '2026-04-05 00:00:00'),
  ('4.6.0', '2026-04-05 00:00:00'),
  ('4.7.0', NOW());
