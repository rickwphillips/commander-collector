-- v5.18.0: House rules table for the deckbuilder tool
--
-- The user's own house rules, playgroup conventions, and saved reference
-- rulings. Distinct from official rules and verified patterns, which are served
-- read-only through commander-mcp. This table is the ONLY rules content the
-- deckbuilder tool may add to or edit, always after confirming the exact change.

CREATE TABLE IF NOT EXISTS `house_rules` (
  `id` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `player_id` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `deck_id` char(36) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `category` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL DEFAULT 'house_rule',
  `title` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `body` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `source` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_house_rules_deck` (`deck_id`),
  KEY `idx_house_rules_category` (`category`),
  KEY `idx_house_rules_deleted` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.18.0', '2026-07-14', 'Live-game security & reliability fixes', 112)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.18.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'Live game security: only the host device can overwrite the shared game state or clear the queue of remote actions. A paired phone can no longer take host-only actions on the session.', 0),
  (UUID(), @rid, 'fixed', 'Live game security: starting a live session now requires you to be signed in, and the session is tied to your own account so it cannot be ended on your behalf by someone else.', 1),
  (UUID(), @rid, 'fixed', 'Live game: remote life and counter changes are no longer lost if the host connection briefly drops and reconnects.', 2),
  (UUID(), @rid, 'fixed', 'Live game: undoing a life, poison, or commander-damage change no longer brings back a player who is still eliminated by a different cause (for example, still at 21 commander damage).', 3),
  (UUID(), @rid, 'fixed', 'Deck filters: a hybrid mana symbol like {2/W} now counts as 2 toward mana value, so mana-value sorting and CMC filtering are correct.', 4),
  (UUID(), @rid, 'fixed', 'The phone panel''s "connection lost" banner now clears on its own once the connection recovers.', 5),
  (UUID(), @rid, 'added', 'A house rules store for the deckbuilder: keep your own house rules, playgroup conventions, and saved reference rulings alongside your decks.', 6);
