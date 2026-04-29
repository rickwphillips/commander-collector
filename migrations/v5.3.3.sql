-- v5.3.3: Fix deck detail page for decks without card lists

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.3.3', '2026-04-29', 'Fix deck detail page for decks without card lists', 96)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.3.3');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'Deck detail page no longer shows "Deck not found" for decks that have no card list', 0),
  (UUID(), @rid, 'improved', 'API errors on the deck detail page now display the actual error message instead of a misleading "deck not found"', 1);
