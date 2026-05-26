# Commander Collector — Known Bugs / Fix List

Track bugs here. Fix them in dedicated sessions, not on the fly.

---

## Open

_(none)_

---

## Fixed (log for reference)

- **Changelog mojibake (em dashes as `â€"`):** v5.0.0 migration double-encoded em dashes in `changelog_releases.title` and `changelog_changes.text`. Verified clean on prod 2026-05-26; no affected rows remain.
- **Card lookup fails on apostrophe names (e.g. "Teferi's Protection"):** `isKnownCardName` did an exact Set lookup but LLM output uses curly/right apostrophe (U+2019) while the catalog stores straight apostrophes (U+0027). Fixed by normalizing U+2019 and U+02BC to U+0027 before lookup in `cardCatalog.ts`.
- **MCP endpoint double `.php` extension:** `apiFetch` appends `.php` automatically, but new MCP proxy endpoints were passed with `.php` already in the path (e.g. `/rules/score-deck.php` → `score-deck.php.php`). Fixed by stripping `.php` from all six endpoint strings in `api.ts`.
- **PHP dev server wrong working directory:** Local PHP server (port 8081) was started from the workspace root instead of `apps/core/app/`, causing all `/php-api/*` requests to 404. Fix: `kill <pid>` and restart from `apps/core/app/`.

- **Nav guard (lists/decks):** Back buttons and in-page links guarded via `confirmLeaveIfDirty` + `onBackClick`. No unprotected escape routes exist (app has no persistent header nav).
- **Playwright MCP tools not loading:** Moved config from project-level `.mcp.json` to global user config with `--headless` flag. Tools now surface as `mcp__playwright__*` on session start.

- **v5.0.0 deploy:** `useList.save` was POSTing instead of PATCHing → fixed to PATCH
- **v5.0.0 deploy:** Toolbar Add (+) used wrong handler (reconcile instead of replace) → split into `handleBufferReplace` / `handleVisibleChange`
- **v5.0.0 deploy:** Lands matching WUBRG in Color mode → fixed (Color mode treats lands as colorless)
- **v5.0.0 deploy:** v4.7.0 migration FK name mismatch on prod (`game_results_ibfk_3` didn't exist) → created resume script with actual prod FK names
- **v5.0.0 deploy:** v4.8.0 migration used `utf8mb4_0900_ai_ci` collation (MySQL 8.0+) on MySQL 5.7 prod → changed to `utf8mb4_general_ci`
- **v5.0.0 deploy:** v4.8.0 migration used `DEFAULT (UUID())` functional default (MySQL 8.0+) → removed, PHP handles UUID generation
