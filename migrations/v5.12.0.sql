-- v5.12.0: Two-Headed Giant team roll and game log polish
-- Changelog only (no schema changes). Idempotent upsert; safe to re-run.

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.12.0', '2026-07-05', 'Two-Headed Giant team roll & log polish', 106)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.12.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'added', 'Two-Headed Giant now rolls for the first turn as a team: the highest roller''s team goes first, and only a tie across teams triggers a reroll', 0),
  (UUID(), @rid, 'added', 'In 2HG, the game log names team actions (turn order, turns, shared life and poison, eliminations) by your editable team name instead of a single player, and no longer double-logs shared changes', 1),
  (UUID(), @rid, 'improved', 'Finished games always save even if the event log cannot be written, and auto-save now retries a few times before prompting you to save manually', 2),
  (UUID(), @rid, 'improved', 'Opening events such as the first-turn roll are captured even when they happen before the live game session is ready', 3),
  (UUID(), @rid, 'fixed', 'Opening a game''s details no longer errors when the game has no saved event log', 4);
