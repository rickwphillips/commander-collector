-- v5.2.0: Game Manager Improvements

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.2.0', '2026-04-14', 'Game Manager Improvements', 92)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.2.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'improved', 'Card name tooltips now show a loading animation while the card image is being fetched, instead of appearing unresponsive', 0),
  (UUID(), @rid, 'added',    'Tap any commander name or art in the snapshot panel to view the full card — tap again to zoom in, tap outside to close', 1),
  (UUID(), @rid, 'added',    'Tap your own commander art in your panel header to view the full card the same way', 2),
  (UUID(), @rid, 'added',    'Theme toggle added to the in-game settings panel', 3),
  (UUID(), @rid, 'improved', 'Light/dark theme switch now fades smoothly instead of snapping', 4);
