-- v5.23.5: Player count no longer includes test fixtures

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.23.5', '2026-10-26', 'Player count no longer includes test fixtures', 122)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.23.5');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'The Players stat on the dashboard showed 74 when there are 6 real players. Automated post-deploy tests had been leaving a placeholder player behind after every deploy since April, and the count included them. The placeholders have been removed and the count now ignores any that appear.', 0),
  (UUID(), @rid, 'fixed', 'Post-deploy tests now clean up the placeholder players they create. The cleanup was looking for them through the same player list that hides placeholders, so it never found anything to delete.', 1);
