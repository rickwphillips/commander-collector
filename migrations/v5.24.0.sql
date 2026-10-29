-- v5.24.0: Live game reconnects back off instead of hammering the server

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.24.0', '2026-10-29', 'Live game reconnects back off instead of hammering the server', 124)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.24.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed',    'When the live game connection drops, the game board and phone seats now wait progressively longer between reconnect attempts (one second doubling to thirty, with a random spread) instead of retrying ten times a second. On October 27 that rapid retry turned a brief server hiccup into a forty-minute lockout of every page on the site.', 0),
  (UUID(), @rid, 'improved', 'A reconnect after the server''s normal periodic refresh is still immediate, so nothing feels slower in a healthy game. The server also tells browsers to wait three seconds rather than a tenth of a second as a fallback.', 1),
  (UUID(), @rid, 'added',    'An automated test now simulates an outage in the browser and fails if the game pages ever return to rapid retrying. The test suite can also be pointed at a local stack before deploying.', 2);
