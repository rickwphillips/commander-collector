-- v1.19.0: Add remote_events queue column for delta-based live sync
--
-- Remote panels now append typed events (life_change, pass_turn, etc.) instead of
-- writing full game state. The host consumes and applies events atomically, then
-- writes the authoritative merged state. This eliminates the race condition where
-- a remote write could overwrite the host's turn advance.

ALTER TABLE live_game_sessions
  ADD COLUMN remote_events JSON NULL DEFAULT NULL;
