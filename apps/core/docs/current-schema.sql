-- Commander Collector dev DB schema snapshot
-- Generated: 2026-04-07 18:15:42
-- Database: commander_collector (dev)
-- Source: live introspection via request-record skill

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `changelog_changes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `release_id` int NOT NULL,
  `type` enum('added','changed','fixed','improved') NOT NULL,
  `text` text NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_changelog_changes_release` (`release_id`,`sort_order`),
  CONSTRAINT `fk_changelog_release` FOREIGN KEY (`release_id`) REFERENCES `changelog_releases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=513 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `changelog_releases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `version` varchar(20) NOT NULL,
  `date` date NOT NULL,
  `title` varchar(255) NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `version` (`version`),
  KEY `idx_changelog_releases_sort` (`sort_order` DESC)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `coach_notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `player_id` int NOT NULL,
  `topic` varchar(200) NOT NULL,
  `observation` text NOT NULL,
  `reasoning` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_player_topic` (`player_id`,`topic`),
  KEY `idx_player` (`player_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `deck_cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `deck_id` int NOT NULL,
  `scryfall_id` varchar(36) DEFAULT NULL,
  `card_name` varchar(255) NOT NULL,
  `quantity` tinyint NOT NULL DEFAULT '1',
  `is_commander` tinyint(1) NOT NULL DEFAULT '0',
  `is_proxy` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_deck_cards_deck` (`deck_id`),
  CONSTRAINT `deck_cards_ibfk_1` FOREIGN KEY (`deck_id`) REFERENCES `decks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5764 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `decks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `player_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `commander` varchar(150) NOT NULL,
  `partner` varchar(150) DEFAULT NULL,
  `colors` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `has_w` tinyint(1) NOT NULL DEFAULT '0',
  `has_u` tinyint(1) NOT NULL DEFAULT '0',
  `has_b` tinyint(1) NOT NULL DEFAULT '0',
  `has_r` tinyint(1) NOT NULL DEFAULT '0',
  `has_g` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `player_id` (`player_id`),
  CONSTRAINT `decks_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `game_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `game_id` int NOT NULL,
  `deck_id` int NOT NULL,
  `player_id` int DEFAULT NULL,
  `finish_position` tinyint NOT NULL,
  `eliminated_turn` int DEFAULT NULL,
  `team_number` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `game_id` (`game_id`),
  KEY `deck_id` (`deck_id`),
  KEY `player_id` (`player_id`),
  CONSTRAINT `game_results_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`) ON DELETE CASCADE,
  CONSTRAINT `game_results_ibfk_2` FOREIGN KEY (`deck_id`) REFERENCES `decks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `game_results_ibfk_3` FOREIGN KEY (`player_id`) REFERENCES `players` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=214 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `game_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) NOT NULL,
  `sound_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `highlight_mode` tinyint(1) NOT NULL DEFAULT '1',
  `turn_timer_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `turn_timer_seconds` int NOT NULL DEFAULT '300',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `games` (
  `id` int NOT NULL AUTO_INCREMENT,
  `played_at` date NOT NULL,
  `winning_turn` int DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `game_type` varchar(20) NOT NULL DEFAULT 'standard',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `list_cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `list_id` int NOT NULL,
  `scryfall_id` varchar(64) DEFAULT NULL,
  `card_name` varchar(255) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `is_commander` tinyint(1) NOT NULL DEFAULT '0',
  `is_proxy` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_list_cards_list` (`list_id`),
  CONSTRAINT `fk_list_cards_list` FOREIGN KEY (`list_id`) REFERENCES `lists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3767 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `lists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `user_id` varchar(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `live_game_seats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `seat` varchar(10) NOT NULL,
  `code` char(8) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_code` (`code`),
  KEY `fk_session` (`session_id`),
  CONSTRAINT `live_game_seats_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `live_game_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=290 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `live_game_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) DEFAULT NULL,
  `state` json NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `remote_events` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_expires` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `pattern_errors` (
  `id` varchar(16) NOT NULL,
  `pattern_id` varchar(8) NOT NULL,
  `pattern_file` varchar(255) NOT NULL,
  `status` enum('needs_fix','fixing','fixed','verified','wont_fix') NOT NULL DEFAULT 'needs_fix',
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `error_type` enum('oracle_text','cr_ref','rules_logic','missing_interaction','factual','broken_link','incomplete_verification') NOT NULL,
  `section` varchar(64) DEFAULT NULL,
  `description` text NOT NULL,
  `evidence_expected` text,
  `evidence_found` text,
  `evidence_source` varchar(32) DEFAULT NULL,
  `evidence_source_url` text,
  `evidence_cr_refs` json DEFAULT NULL,
  `severity` enum('minor','moderate','critical') NOT NULL,
  `verifier_notes` text,
  `fix_applied` text,
  `fix_notes` text,
  `fixed_at` datetime DEFAULT NULL,
  `fix_attempts` int NOT NULL DEFAULT '0',
  `reverify_notes` text,
  `reverified_at` datetime DEFAULT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_pattern` (`pattern_id`),
  KEY `idx_severity` (`severity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `players` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `rules_ai_corrections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conversation_id` int unsigned NOT NULL,
  `qa_log_id` int DEFAULT NULL,
  `severity` tinyint unsigned NOT NULL,
  `correction` text NOT NULL,
  `assumptions` text NOT NULL,
  `model` varchar(64) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_ai_corrections_qa_log` (`qa_log_id`),
  KEY `idx_ai_corrections_conversation` (`conversation_id`),
  KEY `idx_ai_corrections_severity` (`severity`),
  CONSTRAINT `fk_ai_corrections_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `rules_conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ai_corrections_qa_log` FOREIGN KEY (`qa_log_id`) REFERENCES `rules_qa_log` (`id`) ON DELETE SET NULL,
  CONSTRAINT `rules_ai_corrections_chk_1` CHECK ((`severity` between 1 and 4))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `rules_conversations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `rules_messages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `conversation_id` int unsigned NOT NULL,
  `role` enum('user','assistant') NOT NULL,
  `content` mediumtext NOT NULL,
  `pending_pattern` json DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `conversation_id` (`conversation_id`),
  CONSTRAINT `rules_messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `rules_conversations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `rules_patterns` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `pattern_id` varchar(32) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category` varchar(50) NOT NULL,
  `cr_refs` text,
  `tags` text,
  `content` mediumtext NOT NULL,
  `examples_count` int NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `suggested_questions` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_pattern_id` (`pattern_id`)
) ENGINE=InnoDB AUTO_INCREMENT=57651 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `rules_qa_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conversation_id` int unsigned NOT NULL,
  `user_message_id` int unsigned DEFAULT NULL,
  `assistant_message_id` int unsigned DEFAULT NULL,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `pattern_ids` varchar(255) DEFAULT NULL,
  `cr_refs` varchar(512) DEFAULT NULL,
  `cards_referenced` json DEFAULT NULL,
  `pending_pattern_id` varchar(32) DEFAULT NULL,
  `model` varchar(64) DEFAULT NULL,
  `had_game_context` tinyint(1) NOT NULL DEFAULT '0',
  `correctness` tinyint unsigned DEFAULT NULL,
  `rating_notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `rated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_qa_log_conversation` (`conversation_id`),
  KEY `idx_qa_log_correctness` (`correctness`),
  KEY `idx_qa_log_unrated` (`correctness`,`created_at`),
  CONSTRAINT `fk_qa_log_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `rules_conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `rules_qa_log_chk_1` CHECK ((`correctness` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `scan_drafts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `state` json NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `schema_migrations` (
  `version` varchar(20) NOT NULL,
  `applied_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `scryfall_card_cache` (
  `id` int NOT NULL AUTO_INCREMENT,
  `scryfall_id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image_uri` text,
  `back_image_uri` text,
  `image_b64` mediumtext,
  `colors` varchar(10) DEFAULT NULL,
  `color_identity` varchar(10) DEFAULT NULL,
  `type_line` varchar(255) DEFAULT NULL,
  `mana_cost` varchar(100) DEFAULT NULL,
  `cached_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `scryfall_id` (`scryfall_id`),
  KEY `idx_scryfall_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5083 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE `stat_panels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `sections` json NOT NULL,
  `is_shared` tinyint(1) NOT NULL DEFAULT '0',
  `share_code` varchar(20) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `panel_type` enum('predefined','comparison') NOT NULL DEFAULT 'predefined',
  `config` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `share_code` (`share_code`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_shared` (`is_shared`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

