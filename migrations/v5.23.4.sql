-- v5.23.4: Dependency security patches

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.23.4', '2026-10-26', 'Dependency security patches', 121)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.23.4');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'Upgraded the zod validation library to 4.6.7, closing a memory-exhaustion flaw (GHSA-mrhx-c7xc-m3w5) that was reachable from the form validation used across the app.', 0),
  (UUID(), @rid, 'fixed', 'Upgraded undici to 7.30.1 and the vitest test tooling to 4.1.12, clearing the remaining development-only advisories. The project now reports zero known vulnerabilities.', 1),
  (UUID(), @rid, 'changed', 'The build now uses npm 11; npm 10 could no longer regenerate the dependency lockfile for this project.', 2);
