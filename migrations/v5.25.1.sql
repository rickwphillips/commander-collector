-- v5.25.1: Deploys no longer leave a blank page behind
-- No schema changes. Changelog entry for the deploy-pipeline fix: after each
-- deploy the host's front proxy kept serving the previous build's HTML, whose
-- script files the deploy had just deleted, so the app rendered blank for up
-- to half an hour. The deploy scripts now purge every route from the proxy,
-- keep the previous build's hashed script files for a week, and mark HTML
-- no-cache. Safe to re-run.

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.25.1', '2026-10-29', 'Deploys no longer leave a blank page behind', 126)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.25.1');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'After a deploy, pages could come up blank for up to half an hour. The host''s cache kept handing out the previous version of each page, which pointed at script files the deploy had just removed. Every deploy now clears the cache for every page as soon as the new build lands.', 0),
  (UUID(), @rid, 'changed', 'The previous build''s script files are kept on the server for a week after a deploy instead of being deleted immediately, so a page that is already open, or still cached somewhere, can keep loading.', 1),
  (UUID(), @rid, 'changed', 'Pages are now marked as not cacheable by the host, while the versioned script and style files stay cached as before. The same fix applies to the portfolio site and Grandkid Arcade deploys.', 2);
