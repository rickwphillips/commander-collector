-- v5.16.0: Live-game remote: game log, big life display & 2HG drawers

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.16.0', '2026-07-10', 'Live-game remote: game log, big life display & 2HG drawers', 110)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.16.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'added',    'View the game log from your phone, via a link on the far right of the remote panel''s turn bar.', 0),
  (UUID(), @rid, 'added',    'Two-Headed Giant team panels now get the same collapsible commander-damage and pilot drawers on the phone as standard games.', 1),
  (UUID(), @rid, 'added',    'First-player intro reveal: seats light up their commander art in turn order at the start of a game.', 2),
  (UUID(), @rid, 'added',    'Remote turn control: tap to pass the turn, long-press to step back a turn.', 3),
  (UUID(), @rid, 'added',    'Local mana/counter icons and a Two-Headed Giant experience-gain celebration.', 4),
  (UUID(), @rid, 'improved', 'On the phone, the life total scales to fill the panel in both orientations, with tighter, aligned minus / plus buttons.', 5),
  (UUID(), @rid, 'improved', 'Commander-damage rows show a commander thumbnail (or player initial) in landscape to fit the narrow column.', 6),
  (UUID(), @rid, 'improved', 'Counter controls, their limit readouts, and the frosted control backing are aligned and no longer waste space.', 7);
