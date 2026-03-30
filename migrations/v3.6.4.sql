-- v3.6.4: Fix pattern_id column size
-- Expand pattern_id from VARCHAR(10) to VARCHAR(32) to accommodate longer pattern IDs (P027, P494, etc.)

ALTER TABLE rules_patterns MODIFY COLUMN pattern_id VARCHAR(32) NOT NULL;
