-- v5.27.0: Game manager fits an iPhone
-- No schema changes. This migration only seeds the changelog entry for the release.
-- Safe to re-run.

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.27.0', '2026-11-09', 'Game manager fits an iPhone', 130)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.27.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'added', 'Game manager on iPhone: the table lays itself out for a phone lying flat. Every seat still faces its player, the board runs edge to edge while keeping clear of the Dynamic Island, and the centre strip shrinks to one row with the turn, Next Turn and the log, rules, settings and dice buttons.', 0),
  (UUID(), @rid, 'added', 'Phone seats: the commander damage and counters drawers open over the seat instead of beside the life total, as tappable chips. Damage chips show each opponent''s commander art, name and damage; counter chips show the glyph and value. Tap a value to edit it in the large modal, which returns you to the drawer.', 1),
  (UUID(), @rid, 'changed', 'Phone seats: life totals show minus and plus beside the number; the plus menu, the editing modal and the "who brought you to 0" prompt fit a phone seat; the seat picker, dice, settings, notes and roll-off house rules open as sheets.', 2),
  (UUID(), @rid, 'changed', 'Phone setup screen: Continue to seating is a full-width button at the top and Starting life sits on its own line. Zooming a commander card on a phone enlarges it to a readable size instead of past the screen.', 3),
  (UUID(), @rid, 'changed', 'Game log lists the newest event first.', 4),
  (UUID(), @rid, 'improved', 'City''s Blessing fireworks: each burst now makes a boom timed to the burst you see, with no launch hiss. Booms close together are softer, near-simultaneous ones are dropped, and the phone plays them at about half the iPad volume.', 5),
  (UUID(), @rid, 'improved', 'Two-Headed Giant on a phone: the shared life stays fixed in the middle of each team panel while the opponent and pilot sections scroll.', 6);
