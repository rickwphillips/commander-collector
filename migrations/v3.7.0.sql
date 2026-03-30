-- v3.7.0: Fix game_settings user_id column type for UUID support
-- v3.6.3 created the table with INT UNSIGNED but user IDs are UUIDs (VARCHAR(36))

-- Drop the foreign key constraint first (cross-DB FK doesn't work reliably)
ALTER TABLE game_settings DROP FOREIGN KEY fk_game_settings_user;

-- Change column type to VARCHAR(36) for UUID values
ALTER TABLE game_settings MODIFY COLUMN user_id VARCHAR(36) NOT NULL;
