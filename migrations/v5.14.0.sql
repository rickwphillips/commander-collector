-- v5.14.0: Per-commander tax for partner decks + opponent stats in 2HG

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.14.0', '2026-07-07', 'Partner commander tax & 2HG opponent stats', 108)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.14.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'added',    'Decks with two commanders (Partner, Partner With, Backgrounds) now track a separate commander tax for each commander, in both standard and Two-Headed Giant games and on the remote phone.', 0),
  (UUID(), @rid, 'added',    'The Two-Headed Giant panel now shows the opposing team: their name, shared life, poison, the commander damage you have dealt them, and each of their commanders'' current tax.', 1),
  (UUID(), @rid, 'improved', 'The Two-Headed Giant layout was reworked: commander-damage on the left, shared life centered, your pilots and counters on the right, with the panel scaling to your device (portrait phones stack the sections).', 2),
  (UUID(), @rid, 'improved', 'Life totals use a smooth color ramp that greens above starting life and reds out as it drops; hold any +/- to change by 5; tap a name or a value to view that commander''s card.', 3);
