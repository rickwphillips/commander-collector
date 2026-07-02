-- v5.11.0: Game event log
-- Adds the durable game_logs table: one row per game, holding the full event
-- stream (die rolls, turn order, life and poison changes, eliminations, and
-- other actions) serialized into a single text field. The game manager buffers
-- events locally in a fast SQLite store during play (see php-api/game-log.php)
-- and promotes them into this table on successful completion (see games.php).
--
-- No DB-level foreign key: game_id is CHAR(36) matching games.id but is only
-- indexed here to avoid cross-table collation coupling. games.php removes the
-- game_logs row alongside the game on delete.
--
-- Idempotent: CREATE TABLE IF NOT EXISTS + changelog upsert. Safe to re-run.

CREATE TABLE IF NOT EXISTS game_logs (
  game_id    CHAR(36) NOT NULL PRIMARY KEY,
  events     LONGTEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.11.0', '2026-07-02', 'Game event log', 105)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.11.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'added', 'Game manager records a full event log for every game: die rolls with their values, the turn order (who played 1st through 4th), life and poison changes, counters, commander damage, and eliminations attributed to the player who dealt the killing blow', 0),
  (UUID(), @rid, 'added', 'View the running log during a game from the Game Log button in the game manager settings menu, newest events first', 1),
  (UUID(), @rid, 'added', 'Review a finished game''s event log from the Game Log button on the game details page', 2),
  (UUID(), @rid, 'added', 'New Game has a Random option that auto-fills each seat with a different player and one of their own decks', 3),
  (UUID(), @rid, 'fixed', 'Selecting a commander or partner from the card search now fills the field with the chosen card and clears the search indicator', 4);
