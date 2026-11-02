-- v5.26.1: iPad game manager stays signed in
-- No schema changes. This migration only seeds the changelog entry for the release.
-- Safe to re-run.

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.26.1', '2026-11-02', 'iPad game manager stays signed in', 129)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.26.1');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'iPad game manager: sign-in tokens last 24 hours, so the first refresh or upload each day failed with "Wrong username or password" and sent you back to the login screen. The app now keeps your sign-in in the Keychain, renews it by itself when a request is refused, and retries the request. Only Sign out ends the session; clearing the cache never does.', 0),
  (UUID(), @rid, 'changed', 'iPad game manager: a sign-in that cannot be renewed reads "Your sign-in expired" instead of blaming the password.', 1);
