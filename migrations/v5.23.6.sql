-- v5.23.6: Post-deploy tests fully remove their own data

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.23.6', '2026-10-26', 'Post-deploy tests fully remove their own data', 123)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.23.6');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'changed', 'The automated checks that run after each deploy now erase everything they created, including the placeholder card lists that were previously only hidden, and sweep up anything left behind by an earlier interrupted run.', 0);
