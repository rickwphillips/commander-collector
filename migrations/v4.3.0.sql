-- v4.3.0: TTS Export, Deck Import & Card Refresh

INSERT INTO changelog_releases (version, date, title, sort_order)
VALUES ('4.3.0', '2026-04-03', 'TTS Export, Deck Import & Card Refresh', 83);

SET @rid = LAST_INSERT_ID();

INSERT INTO changelog_changes (release_id, type, text, sort_order) VALUES
(@rid, 'added',    'Export any deck to Tabletop Simulator format — generates a sprite-sheet image and downloadable JSON ready to load in TTS', 0),
(@rid, 'added',    'Paste a card list when creating a new deck to auto-fill cards, quantities, and commander', 1),
(@rid, 'added',    'Refresh Scryfall card data for a deck or list in one click to pick up updated images and IDs', 2),
(@rid, 'improved', 'Deck and list action buttons consolidated into a shared component for a more consistent layout', 3);
