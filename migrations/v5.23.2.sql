-- v5.23.2: Security fixes

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.23.2', '2026-10-07', 'Security fixes', 119)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.23.2');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'Upgraded Next.js 16.3.6 to 16.3.8, patching CVE-2026-94483 (SSRF, CVSS 8.3).', 0),
  (UUID(), @rid, 'fixed', 'The rules database seed script can no longer be run by an anonymous web request; it now runs from the command line only.', 1),
  (UUID(), @rid, 'fixed', 'The rules chat stream now requires a signed-in user, like every other rules endpoint.', 2),
  (UUID(), @rid, 'fixed', 'Opening a stale or expired sign-in link no longer signs out a user who is already logged in.', 3);
