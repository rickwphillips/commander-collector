-- v5.4.0: UI polish and layout fixes

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.4.0', '2026-04-29', 'UI polish and layout fixes', 97)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.4.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'Long deck names no longer overlap color pips and action icons on the deck list page', 0),
  (UUID(), @rid, 'changed', 'Moved Admin panel access from the homepage grid into the settings gear menu', 1),
  (UUID(), @rid, 'fixed', 'Fixed 10 failing unit tests across CardTooltip, SaveToListDialog, and card image caching', 2);
