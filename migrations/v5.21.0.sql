-- v5.21.0: Double-faced card handling + TTS export fix

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.21.0', '2026-07-27', 'Double-faced card handling + TTS export fix', 115)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.21.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'Double-faced cards are now categorized by their front face, so a spell with a land back (e.g. Malakir Rebirth // Malakir Mire) is no longer counted as a land in deck breakdowns and type filters.', 0),
  (UUID(), @rid, 'fixed', 'Double-faced cards that failed to load their image and type now resolve correctly when added by their full name.', 1),
  (UUID(), @rid, 'fixed', 'The Tabletop Simulator export no longer errors out; deck and list exports to TTS work again.', 2),
  (UUID(), @rid, 'fixed', 'Saving a Commander deck now removes accidental duplicate copies of a non-basic card, keeping the singleton rule.', 3);
