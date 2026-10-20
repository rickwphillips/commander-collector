-- v5.23.3: Security and accessibility fixes

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.23.3', '2026-10-20', 'Security and accessibility fixes', 120)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.23.3');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'Upgraded Next.js 16.3.8 to 16.4.2, patching a critical remote-code-execution flaw in the image optimizer (CVE-2026-96889), a cached-data disclosure, a Server Actions denial of service, and a catch-all route auth bypass.', 0),
  (UUID(), @rid, 'improved', 'Eleven icon-only buttons now have accessible names for screen readers.', 1),
  (UUID(), @rid, 'fixed', 'Handing a game off to the Rules Guru no longer breaks on names with accented or non-Latin characters.', 2),
  (UUID(), @rid, 'fixed', 'Outbound requests from the API now stop following redirects after a bounded number of hops.', 3),
  (UUID(), @rid, 'changed', 'Removed the unused deck-cards API endpoint.', 4);
