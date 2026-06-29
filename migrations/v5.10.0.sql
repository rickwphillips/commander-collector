-- v5.10.0: Two-Headed Giant mode
-- No schema changes. This migration only seeds the changelog entry for the release.
-- Safe to re-run: changelog_releases upsert + delete-then-insert of changes is idempotent.

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.10.0', '2026-06-29', 'Two-Headed Giant mode', 104)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.10.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'added',   'Two-Headed Giant (2HG) game mode: teammates share one life and poison total, take collective team turns, and play from team panels along the top and bottom edges of the table', 0),
  (UUID(), @rid, 'added',   'Each 2HG teammate keeps their own energy and experience counters plus Monarch, Initiative, and City''s Blessing toggles', 1),
  (UUID(), @rid, 'added',   'Tap any commander in a 2HG team panel - your own team''s or an opponent''s - to view its card', 2),
  (UUID(), @rid, 'added',   'Each 2HG team panel has its own app bar showing both pilots and their commanders, with an editable team name you can rename in-game', 3),
  (UUID(), @rid, 'changed', 'Unified the life total into a shared component, so the standard 4-player card and the 2HG team panel show the same damage flash, claw swipes, and poison and energy reactions', 4);
