-- v5.25.2: Player and deck stats come back as numbers
-- No schema changes. MySQL returns ROUND()/SUM() aggregates as strings through
-- PDO, so win_rate, avg_finish_position and card_count arrived as "33.3" and
-- "100". The web app's JavaScript tolerated it; the native app's client,
-- generated from docs/openapi.yaml, rejected the whole response and the iPad
-- could not load players or decks. The endpoints now cast those fields.
-- Safe to re-run.

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.25.2', '2026-10-29', 'Player and deck stats come back as numbers', 127)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.25.2');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'The players and decks endpoints returned win rate, average finish and card count as text instead of numbers. The web app never noticed, but the native game manager refused to load the lists. They are numbers now, as the API contract always said.', 0),
  (UUID(), @rid, 'changed', 'The API contract names the single-deck average finish field correctly, and win rate is documented as null for a player or deck with no games.', 1);
