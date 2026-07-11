-- v5.17.0: Remote opponent status + fullscreen toggle

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.17.0', '2026-07-10', 'Remote opponent status & fullscreen', 111)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.17.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'added',    'Fullscreen toggle on the phone panel, at the left of the turn bar.', 0),
  (UUID(), @rid, 'improved', 'Each opponent in the phone Commander Damage list now shows their live status: life, commander tax, poison, energy and experience, plus any monarch / city''s blessing / initiative, using the game''s own icons. Tap an opponent to record the commander damage they have dealt you.', 1),
  (UUID(), @rid, 'improved', 'Two-Headed Giant phone panels now use the exact same opponent rows as standard games, so the opposing team''s status and commander damage read consistently.', 2);
