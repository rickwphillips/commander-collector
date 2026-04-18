-- v5.3.0: Chat Re-render Performance

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.3.0', '2026-04-17', 'Chat Re-render Performance', 93)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.3.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'improved', 'Typing in the Rules Guru chat no longer causes the full message list to re-render on every keystroke', 0),
  (UUID(), @rid, 'improved', 'Typing in the Commander Coach chat no longer causes the full chat to re-render on every keystroke', 1),
  (UUID(), @rid, 'improved', 'Correction form in Rules Guru is isolated so typing a correction does not re-render existing messages', 2),
  (UUID(), @rid, 'improved', 'Existing chat bubbles in Commander Coach skip re-renders when new messages arrive or loading state changes', 3),
  (UUID(), @rid, 'fixed',    'Card preview tooltips now retry on hover if a previous lookup failed transiently, instead of staying broken for the session', 4),
  (UUID(), @rid, 'fixed',    'Card preview tooltips no longer show a card cursor on non-card bold text such as section headers and labels', 5),
  (UUID(), @rid, 'fixed',    'Rules Guru mid-conversation failures caused by the history window starting on an assistant turn', 6),
  (UUID(), @rid, 'improved', 'TTS export button shows a loading indicator while building and displays an error message if the export fails', 7);
