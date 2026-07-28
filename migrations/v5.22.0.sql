-- v5.22.0: Accurate card counts

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.22.0', '2026-07-28', 'Accurate card counts', 116)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.22.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'Card counts now count copies rather than rows. A deck holding 13 Islands stored them as a single entry, so it reported far fewer cards than it actually contained. This affected the deck page counter, the type breakdown, the import panel, and the deck legality check.', 0),
  (UUID(), @rid, 'added', 'The deck page counter now shows your deck against the size it should be: 99 cards for a single commander, or 98 when a partner, background, or Doctor''s companion takes a second command slot.', 1),
  (UUID(), @rid, 'added', 'The card counter turns red when a deck is over its size limit, with a tooltip showing how many cards you need to cut. Filtering the list no longer hides the warning.', 2),
  (UUID(), @rid, 'fixed', 'The AI coach is now given your deck''s true card count. It previously received the number of stored entries while its own lookup tools reported the real total, so it could reason from two conflicting numbers for the same deck.', 3);
