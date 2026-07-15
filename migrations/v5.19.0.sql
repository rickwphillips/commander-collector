-- v5.19.0: Rematch (changelog only)
--
-- No schema change. The rematch feature reads the existing decks.partner column
-- and adds a read-only GET /games?recent=1 branch; this migration only records
-- the user-facing changelog for the release.

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.19.0', '2026-07-15', 'Rematch a previous game', 113)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.19.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'added', 'Rematch: start a new game pre-filled from a previous one, with the same players, decks, commanders and game type. Use the Rematch button on the dashboard or games list to replay your most recent game, or the one on a game''s detail page to replay that game. Everything stays editable before you start, and nothing is recorded until you play.', 0);
