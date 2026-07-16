-- v5.20.0: Two-Headed Giant team panel polish

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.20.0', '2026-07-16', 'Two-Headed Giant team panel polish', 114)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.20.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'added',    'Rename your team right from your phone during Two-Headed Giant games.', 0),
  (UUID(), @rid, 'improved', 'The Two-Headed Giant team panel now plays the full monarch crown animation (gain, loss, and changing hands), the shared-life damage swipe, and City''s Blessing banners for both commanders, matching the single-player panel.', 1),
  (UUID(), @rid, 'fixed',    'Polished the team panel''s City''s Blessing scene: windows sit correctly on the buildings, the distant castle edge is softened, the scene fills the wider panel, and it fades out cleanly instead of some pieces blinking away.', 2),
  (UUID(), @rid, 'fixed',    'Live-game remote (Two-Headed Giant): centered the shared life total, kept the monarch crown on-screen and above the controls, aligned the collapsible side drawers so the right one fits, and corrected the drawer arrow directions.', 3);
