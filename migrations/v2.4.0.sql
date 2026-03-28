-- v2.4.0: MTG Rules Guru — patterns, conversations, messages

CREATE TABLE IF NOT EXISTS rules_patterns (
  id           INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  pattern_id   VARCHAR(10)    NOT NULL,
  name         VARCHAR(255)   NOT NULL,
  category     VARCHAR(50)    NOT NULL,
  cr_refs      TEXT,
  tags         TEXT,
  content      MEDIUMTEXT     NOT NULL,
  examples_count INT          NOT NULL DEFAULT 0,
  created_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_pattern_id (pattern_id)
);

CREATE TABLE IF NOT EXISTS rules_conversations (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  title      VARCHAR(255),
  created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS rules_messages (
  id               INT UNSIGNED                 NOT NULL AUTO_INCREMENT,
  conversation_id  INT UNSIGNED                 NOT NULL,
  role             ENUM('user','assistant')     NOT NULL,
  content          MEDIUMTEXT                   NOT NULL,
  pending_pattern  JSON,
  created_at       DATETIME                     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (conversation_id) REFERENCES rules_conversations(id) ON DELETE CASCADE
);
