-- v5.8.0: Live game streaming (SSE)
-- No schema changes (live_game_sessions/seats columns already exist on all envs).
-- This migration only seeds the changelog entry for the release.
-- NOTE: v5.8.0 was already recorded in schema_migrations on dev+prod (an earlier
-- empty placeholder), so on existing envs this changelog is applied directly via
-- write-record rather than the migration runner. Kept here as the canonical record
-- for fresh setups.

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.8.0', '2026-06-01', 'Live game streaming (SSE)', 102)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.8.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'changed',  'Live game updates now stream in real time over server-sent events instead of polling, so remote panels and the host stay in sync instantly', 0),
  (UUID(), @rid, 'improved', 'Remote player panels reconnect automatically and recover any queued events after a brief connection drop', 1),
  (UUID(), @rid, 'improved', 'Hardened CORS handling on the live game stream endpoint', 2);
