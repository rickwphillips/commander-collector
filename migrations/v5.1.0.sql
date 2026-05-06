-- v5.1.0: Remote QR Codes, Panel Sizing, Pass Turn UX

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.1.0', '2026-04-14', 'Remote QR Codes, Panel Sizing, Pass Turn UX', 91)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.1.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed',    'Remote panel QR codes now appear correctly when starting a game — a missing seat ID was causing session creation to fail silently', 0),
  (UUID(), @rid, 'improved', 'Left and right player panels are wider, giving side players more room on 3- and 4-player boards', 1),
  (UUID(), @rid, 'improved', 'Pass Turn button is now a single tap instead of a hold', 2);
