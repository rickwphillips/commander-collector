# Commander Collector — Known Bugs / Fix List

Track bugs here. Fix them in dedicated sessions, not on the fly.

---

## Open

### 1. Changelog mojibake — em dashes display as `â€"`
- **Where:** Changelog page on prod (`/changelog`)
- **Cause:** v5.0.0 migration inserted changelog entries containing em dashes (`—`, UTF-8 `E2 80 94`) but the `changelog_changes.text` and `changelog_releases.title` columns use `utf8` charset (3-byte), and the MySQL 5.7 connection or migration runner double-encoded the bytes
- **Affected entries:** v5.0.0 changelog — "Unified Card Workflow — Phase 5 Cleanup" title and the two `changed` entries with em dashes in their text
- **Fix approach:** Either update the affected rows with correct bytes via a PHP script that connects with `charset=utf8`, or convert the columns to `utf8mb4` and re-insert. Test the REPLACE pattern against the actual stored bytes first — the naive `REPLACE(text, 'â€"', '—')` matched 0 rows, so the actual byte sequence is different from what's displayed in the browser.

---

## Fixed (log for reference)

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
