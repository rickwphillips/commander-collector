-- Fix stat_panels.user_id to match auth_users.id which uses char(36) UUIDs
-- Run on rickwphi_app_commander database
ALTER TABLE stat_panels MODIFY COLUMN user_id VARCHAR(36) NOT NULL;
