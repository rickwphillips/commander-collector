-- v3.11.0: Double-faced card support — store back face image URI

ALTER TABLE scryfall_card_cache
  ADD COLUMN back_image_uri TEXT DEFAULT NULL AFTER image_uri;

-- Changelog entry
INSERT INTO changelog_releases (version, date, title, sort_order)
VALUES ('3.11.0', '2026-03-31', 'Double-Faced Cards & Flexible Deck Saving', 78);

SET @release_id = LAST_INSERT_ID();

INSERT INTO changelog_changes (release_id, type, text, sort_order) VALUES
(@release_id, 'added', 'Double-faced card support — back face images are fetched from Scryfall and stored in the card cache', 0),
(@release_id, 'added', 'Flip button on card previews with 3D flip animation to view the back face', 1),
(@release_id, 'added', 'Side-by-side front and back tooltip preview for double-faced cards across all card views', 2),
(@release_id, 'added', 'DFC filter chip on the gallery page to filter double-faced cards', 3),
(@release_id, 'added', 'Save as List option when saving scanned cards — no commander required', 4),
(@release_id, 'added', 'Edit Cards button on the deck gallery page', 5),
(@release_id, 'changed', 'Commander is no longer required to save a card list — only required when attaching to a deck', 6),
(@release_id, 'changed', 'Deck commander name auto-syncs when saving cards with a different commander selected', 7),
(@release_id, 'improved', 'Stale DFC cache entries are automatically re-fetched to populate back face images', 8);
