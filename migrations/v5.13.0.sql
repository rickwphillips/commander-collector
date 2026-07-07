-- v5.13.0: Two-Headed Giant — remote phones, concede & UI parity

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.13.0', '2026-07-07', 'Two-Headed Giant: remote phones, concede & UI parity', 107)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.13.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'added',    'Two-Headed Giant: pair a phone to each team from the team menu to run its shared life, per-player counters, and commander damage from your seat.', 0),
  (UUID(), @rid, 'added',    'Concede a team from the team menu, with an undo in case you tap it by mistake.', 1),
  (UUID(), @rid, 'improved', 'The turn timer and the Highlight setting now light up the active team in Two-Headed Giant, matching standard games.', 2),
  (UUID(), @rid, 'improved', 'Two-Headed Giant panels scale to your screen instead of staying tiny on larger displays, and each teammate''s counters are now labeled with the pilot''s name.', 3),
  (UUID(), @rid, 'fixed',    'The Two-Headed Giant turn tracker now faces the right way and shows your edited team names.', 4),
  (UUID(), @rid, 'improved', 'The in-game settings menu opens as a centered panel with an even four-button layout instead of overflowing the board.', 5);
