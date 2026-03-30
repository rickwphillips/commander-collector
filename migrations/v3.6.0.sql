-- v3.6.0: Rules Q&A log for validity review
-- Every AI answer is stored here for later correctness rating (1–5 scale)

CREATE TABLE IF NOT EXISTS rules_qa_log (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id       INT UNSIGNED NOT NULL,
  user_message_id       INT UNSIGNED NULL,
  assistant_message_id  INT UNSIGNED NULL,
  question              TEXT NOT NULL,
  answer                TEXT NOT NULL,
  -- Verification aids (extracted from response at save time)
  pattern_ids           VARCHAR(255) NULL,   -- comma-separated P-IDs cited, e.g. "P027,P104"
  cr_refs               VARCHAR(512) NULL,   -- comma-separated CR sections cited, e.g. "603.3b,117.5"
  cards_referenced      JSON NULL,           -- array of card names from CARDS: manifest
  pending_pattern_id    VARCHAR(32) NULL,    -- pattern proposed alongside this answer, if any
  model                 VARCHAR(64) NULL,    -- Claude model that answered
  had_game_context      TINYINT(1) NOT NULL DEFAULT 0,
  -- Rating (1=Incorrect, 2=Mostly wrong, 3=Partial, 4=Mostly correct, 5=Correct, NULL=unrated)
  correctness           TINYINT UNSIGNED NULL CHECK (correctness BETWEEN 1 AND 5),
  rating_notes          TEXT NULL,
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  rated_at              TIMESTAMP NULL,
  CONSTRAINT fk_qa_log_conversation FOREIGN KEY (conversation_id) REFERENCES rules_conversations (id) ON DELETE CASCADE
);

CREATE INDEX idx_qa_log_conversation ON rules_qa_log (conversation_id);
CREATE INDEX idx_qa_log_correctness  ON rules_qa_log (correctness);
CREATE INDEX idx_qa_log_unrated      ON rules_qa_log (correctness, created_at);
