-- v5.26.0: Deleted decks go to the trash and keep their game history
-- No schema changes: decks.deleted_at and its index arrived in v4.8.0 and were
-- never used by the decks endpoint. Until now DELETE decks.php removed the row
-- and, through game_results.deck_id ON DELETE CASCADE, every game result that
-- deck had earned: games lost a seat and win rates shifted for everyone else at
-- the table. Decks are now soft-deleted and restorable, and a deck that was
-- ever played is never hard-deleted.
-- Safe to re-run.

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.26.0', '2026-11-02', 'Deleted decks go to the trash and keep their game history', 128)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.26.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed',    'Deleting a deck no longer deletes the games it was played in. Game results used to go with the deck, so past games lost a seat and every other player''s win rate at that table changed. The deck is now moved to the trash and keeps its place in game history and stats.', 0),
  (UUID(), @rid, 'added',    'Decks page: a Recently deleted section lists trashed decks with a Restore button. The deck detail page shows a banner with Restore when the deck is in the trash.', 1),
  (UUID(), @rid, 'added',    'API: GET decks.php?trash=1 lists the caller''s trashed decks; POST decks.php?id=&action=restore brings one back. Deleting an already-trashed deck, or restoring a live one, answers 409.', 2),
  (UUID(), @rid, 'changed',  'Trash cleanup purges a trashed deck after 30 days only if it was never played. Decks with game results stay in the trash indefinitely, hidden from pickers.', 3),
  (UUID(), @rid, 'changed',  'Trashed decks leave the deck list and per-player reads, so the iPad game manager drops them from its cache on its next refresh.', 4),
  (UUID(), @rid, 'added',    'iPad game manager: Clear cached data under Reference data (with or without an immediate refresh), and the player and deck cache refreshes automatically when the app returns to the foreground.', 5),
  (UUID(), @rid, 'added',    'iPad game manager: the New game screen links to the website''s Games and Decks pages.', 6),
  (UUID(), @rid, 'fixed',    'iPad game manager: a Two-Headed Giant team panel now shows the paired phone (header icon and QR overlay caption). The remote connected indicator tolerates one dropped heartbeat on web and iPad (20 s window).', 7);
