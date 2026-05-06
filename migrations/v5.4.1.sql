-- v5.4.1: Fix game save 500 and win-condition not firing for seat 0

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.4.1', '2026-05-06', 'Fix game save and win-condition triggers', 98)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.4.1');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'Saving a game no longer 500s: game_results inserts now generate their own UUID id', 0),
  (UUID(), @rid, 'fixed', 'Win-condition auto-save now fires when the bottom seat (index 0) is chosen as first player', 1);
