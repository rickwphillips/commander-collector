-- v3.8.1: AI self-correction tracking

-- Dedicated table for AI self-corrections
CREATE TABLE IF NOT EXISTS rules_ai_corrections (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id       INT UNSIGNED NOT NULL,
  qa_log_id             INT NULL,
  severity              TINYINT UNSIGNED NOT NULL CHECK (severity BETWEEN 1 AND 4),
  correction            TEXT NOT NULL,
  assumptions           TEXT NOT NULL,
  model                 VARCHAR(64) NULL,
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_corrections_conversation FOREIGN KEY (conversation_id) REFERENCES rules_conversations (id) ON DELETE CASCADE,
  CONSTRAINT fk_ai_corrections_qa_log FOREIGN KEY (qa_log_id) REFERENCES rules_qa_log (id) ON DELETE SET NULL
);

CREATE INDEX idx_ai_corrections_conversation ON rules_ai_corrections (conversation_id);
CREATE INDEX idx_ai_corrections_severity ON rules_ai_corrections (severity);
