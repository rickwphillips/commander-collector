-- v5.23.1: Security fix

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.23.1', '2026-09-29', 'Security fix', 118)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.23.1');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'Upgraded Next.js 16.3.4 to 16.3.6, patching a critical remote-code-execution vulnerability in next/og ImageResponse (CVE-2026-94545, CVSS 9.5).', 0);
