-- v5.28.0: 1v1 Two-Headed Giant
-- No schema changes. This migration only seeds the changelog entry for the release.
-- Safe to re-run.

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.28.0', '2026-11-13', '1v1 Two-Headed Giant', 131)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.28.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'added', '1v1 Two-Headed Giant: a new game type where two players each pilot both heads of a team. It plays as ordinary 2HG (four decks, shared life, 15 poison) and is recorded with one player on both decks of a team. The games list labels it, and it can be entered or edited by hand.', 0),
  (UUID(), @rid, 'changed', 'Player stats count each game once: wins, games played, win rate and streaks no longer double for a player with two decks in the same game. Head-to-head counts 1v1 2HG games in the 1v1 table.', 1),
  (UUID(), @rid, 'added', 'Game manager (iPad): 1v1 2HG in the new-game menu with one picker per team for a player and two decks; choosing who goes first starts the game; roll house rules moved into settings.', 2),
  (UUID(), @rid, 'added', 'Game manager (iPad): teams can be named, renamed and cleared from the team''s settings menu. A custom name shows wherever the team is named and is recorded in the game log.', 3),
  (UUID(), @rid, 'changed', 'Game manager (iPad), Two-Headed Giant: commander art behind each team panel, poison above the shared life, one line per opposing commander, and a commander info panel that shows what the other team''s commanders have dealt your team.', 4),
  (UUID(), @rid, 'improved', 'Game manager (iPad): larger Next Turn and pass buttons that go back a turn on a long press, effect sounds stop on restart, and a rare bug that wanders the board and can be squished (it has its own switch in settings).', 5);
