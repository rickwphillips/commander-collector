-- v5.23.0: Paired phones end with the game

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.23.0', '2026-07-29', 'Paired phones end with the game', 117)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.23.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'A phone paired to a live game now shows "Game Over" when the host ends the game. Previously the phone kept displaying a live panel indefinitely, so you could carry on tapping life totals and counters into a game that had already finished and none of it was recorded.', 0);
