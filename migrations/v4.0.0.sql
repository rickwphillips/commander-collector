-- v4.0.0: Add user_id to lists table (missed from v3.11.0 session)

ALTER TABLE lists ADD COLUMN user_id VARCHAR(36) DEFAULT NULL AFTER description;
