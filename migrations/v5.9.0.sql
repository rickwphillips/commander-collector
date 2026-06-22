-- v5.9.0: PlayerPanel split + host action unification + security hardening
-- No schema changes. This migration only seeds the changelog entry for the release.
-- Safe to re-run: changelog_releases upsert + delete-then-insert of changes is idempotent.

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.9.0', '2026-06-19', 'Game Manager perf, host/remote unification + security fixes', 103)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.9.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed',    'Remote-driven life and poison kills now trigger the host attribution prompt - previously only host-side button presses fired it, and kills applied from a remote device over the live stream silently bypassed it', 0),
  (UUID(), @rid, 'fixed',    'Security (access control): the list image-resolution endpoint now verifies you own the list. Previously any signed-in user could run resolution against another user''s list and read back its card names. Present since v5.7.0', 1),
  (UUID(), @rid, 'fixed',    'Security: the live game and list endpoints no longer return internal database error details to the client. The live game endpoint is unauthenticated, so those messages could reach anonymous callers', 2),
  (UUID(), @rid, 'fixed',    'Game save: removed a redundant per-row database prepare when creating or updating a game, so saving games with many decks does less work', 3),
  (UUID(), @rid, 'improved', 'Game Manager: a life change in one seat no longer re-renders the JSX for the other seats at the table (PlayerPanel split into a thin orchestrator plus a memoized presentational PlayerCard)', 4),
  (UUID(), @rid, 'improved', 'Game Manager: opening another player''s panel as a view-only overlay is much cheaper - the host-only hook tree (poison sound, monarch transition, city''s blessing exit, long press, damage flash) no longer mounts on the read-only path', 5),
  (UUID(), @rid, 'improved', 'Reliability: host controls and incoming remote events now run through one shared event reducer, so host button presses and remote-driven updates behave identically - this is what fixed the kill prompt and removes a class of host-vs-remote drift bugs; the live game event format was also tightened into a strict typed union', 6),
  (UUID(), @rid, 'changed',  'Security (build tooling): updated esbuild and vite to patched versions, clearing two HIGH advisories. Development-only dependencies, no runtime impact', 7);
