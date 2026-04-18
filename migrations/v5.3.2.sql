-- v5.3.2: Fix Test Players Appearing in Player List

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.3.2', '2026-04-18', 'Fix Test Players Appearing in Player List', 95)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.3.2');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'Test automation players no longer appear in the Players list', 0);
