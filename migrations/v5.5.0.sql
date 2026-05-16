-- v5.5.0: Rules Guru feedback system

CREATE TABLE IF NOT EXISTS rules_guru_message_feedback (
  id                  CHAR(36)     NOT NULL,
  conversation_id     INT          NOT NULL,
  message_id          INT          NULL,
  message_snippet     TEXT         NULL,
  rating              ENUM('up','down') NOT NULL,
  wrong_conclusion    TINYINT(1)   NOT NULL DEFAULT 0,
  wrong_cr_cite       TINYINT(1)   NOT NULL DEFAULT 0,
  missing_cr_rules    TINYINT(1)   NOT NULL DEFAULT 0,
  off_topic           TINYINT(1)   NOT NULL DEFAULT 0,
  hard_to_apply       TINYINT(1)   NOT NULL DEFAULT 0,
  cards_not_relevant  TINYINT(1)   NOT NULL DEFAULT 0,
  card_feedback       TEXT         NULL,
  notes               TEXT         NULL,
  flag_pattern        TINYINT(1)   NOT NULL DEFAULT 0,
  user_id             VARCHAR(36)  NULL,
  created_at          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_msg_feedback_conv (conversation_id),
  INDEX idx_msg_feedback_flag (flag_pattern, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS rules_guru_session_feedback (
  id               CHAR(36)     NOT NULL,
  conversation_id  INT          NOT NULL,
  rating           TINYINT      NOT NULL,
  helpful_indices  JSON         NULL,
  notes            TEXT         NULL,
  user_id          VARCHAR(36)  NULL,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_session_feedback_conv (conversation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO changelog_releases (id, version, date, title, sort_order)
VALUES (UUID(), '5.5.0', '2026-05-16', 'Rules Guru feedback system', 99)
ON DUPLICATE KEY UPDATE date=VALUES(date), title=VALUES(title), sort_order=VALUES(sort_order);

SET @rid = (SELECT id FROM changelog_releases WHERE version = '5.5.0');

DELETE FROM changelog_changes WHERE release_id = @rid;

INSERT INTO changelog_changes (id, release_id, type, text, sort_order) VALUES
  (UUID(), @rid, 'added', 'Per-message thumbs up/down feedback with targeted questions: wrong conclusion, wrong CR cite, missing rules, off-topic, hard to apply, card relevance', 0),
  (UUID(), @rid, 'added', 'Per-card relevance rating on example card chips in each answer', 1),
  (UUID(), @rid, 'added', 'End-of-session feedback drawer with 1-5 star rating, helpful message selection, and notes', 2),
  (UUID(), @rid, 'added', 'Feedback review queue page for surfacing flagged rulings', 3);
