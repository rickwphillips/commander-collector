-- v4.2.0: Settings Panel, DFC Improvements & Coach Enhancements

INSERT INTO changelog_releases (version, date, title, sort_order)
VALUES ('4.2.0', '2026-04-02', 'Settings Panel, DFC Improvements & Coach Enhancements', 82);

SET @rid = LAST_INSERT_ID();

INSERT INTO changelog_changes (release_id, type, text, sort_order) VALUES
(@rid, 'added',    'Collapsible settings tab — dark mode toggle and sign-out button unified in a slide-out panel pinned to the top-right corner', 0),
(@rid, 'added',    'Full-card flip overlay for double-faced cards — hover to reveal a centered flip button, replacing the small corner button', 1),
(@rid, 'added',    'Side-by-side front and back face preview in card tooltips for double-faced cards', 2),
(@rid, 'added',    'Save & Continue button in deck and list edit mode — saves without exiting, keeps editing', 3),
(@rid, 'added',    'Floating save button appears when unsaved changes are detected in edit mode', 4),
(@rid, 'added',    'Edit shortcut button on the decks and lists index pages — jumps straight into card edit mode', 5),
(@rid, 'added',    'Auto-edit mode for lists — navigating with ?edit=1 opens the editor immediately', 6),
(@rid, 'added',    'Stop button in Coach Chat — abort an in-flight response without starting a new message', 7),
(@rid, 'improved', 'Typing a new message while the coach is responding now interrupts and replaces the current request', 8),
(@rid, 'improved', 'Coach card lookup now uses fuzzy name matching for single-card queries, improving typo tolerance', 9),
(@rid, 'improved', 'Coach always verifies the commander card before analyzing any deck', 10),
(@rid, 'improved', 'Expanded mana symbol name support — hybrid, Phyrexian, and 2-cost hybrid symbols now have proper names', 11),
(@rid, 'fixed',    '"Edit Deck" and "Edit List" links in My Collection now use Next.js Link for proper client-side navigation', 12);
