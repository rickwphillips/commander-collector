-- v5.3.1: Fix Rules Guru API Path and Conversation History

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.3.1', '2026-04-18', 'Fix Rules Guru API Path and Conversation History', 94)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.3.1');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'fixed', 'Rules Guru chat now connects correctly in production (requests were going to the wrong API path)', 0),
  (UUID(), @rid, 'fixed', 'Rules Guru follow-up questions no longer fail (conversation history was being loaded in wrong order due to UUID string sorting)', 1);
