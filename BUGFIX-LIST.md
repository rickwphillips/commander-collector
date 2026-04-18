# Commander Collector — Known Bugs / Fix List

Track bugs here. Fix them in dedicated sessions, not on the fly.

---

## Open

### 1. Changelog mojibake — em dashes display as `â€"`
- **Where:** Changelog page on prod (`/changelog`)
- **Cause:** v5.0.0 migration inserted changelog entries containing em dashes (`—`, UTF-8 `E2 80 94`) but the `changelog_changes.text` and `changelog_releases.title` columns use `utf8` charset (3-byte), and the MySQL 5.7 connection or migration runner double-encoded the bytes
- **Affected entries:** v5.0.0 changelog — "Unified Card Workflow — Phase 5 Cleanup" title and the two `changed` entries with em dashes in their text
- **Fix approach:** Either update the affected rows with correct bytes via a PHP script that connects with `charset=utf8`, or convert the columns to `utf8mb4` and re-insert. Test the REPLACE pattern against the actual stored bytes first — the naive `REPLACE(text, 'â€"', '—')` matched 0 rows, so the actual byte sequence is different from what's displayed in the browser.

### 2. In-app `<Link>` navigation not guarded in layout header
- **Where:** Global nav links (Decks, Games, Lists, etc.) in the app layout
- **Cause:** Next.js App Router has no router-level navigation guard hook. The `beforeunload` guard only covers hard navigation (refresh, close tab, browser back). In-app `<Link>` clicks bypass it.
- **Impact:** If you have unsaved changes in ListEditor and click a nav link in the header, you lose changes without a prompt
- **Fix approach:** Either a `NavigationGuardProvider` context that wraps Link clicks, or patch the layout's nav component to read dirty state from a context

### 3. Playwright MCP tools not loading
- **Where:** `.mcp.json` has playwright config, `claude mcp list` shows `✓ Connected`, but no `mcp__playwright__*` tools appear in ToolSearch
- **Impact:** Can't use Playwright MCP for browser automation; workaround is running Playwright scripts via Bash
- **Fix approach:** Check Playwright MCP version compatibility with Claude Code, or use `--headless` flag

---

## Fixed (log for reference)

- **v5.0.0 deploy:** `useList.save` was POSTing instead of PATCHing → fixed to PATCH
- **v5.0.0 deploy:** Toolbar Add (+) used wrong handler (reconcile instead of replace) → split into `handleBufferReplace` / `handleVisibleChange`
- **v5.0.0 deploy:** Lands matching WUBRG in Color mode → fixed (Color mode treats lands as colorless)
- **v5.0.0 deploy:** v4.7.0 migration FK name mismatch on prod (`game_results_ibfk_3` didn't exist) → created resume script with actual prod FK names
- **v5.0.0 deploy:** v4.8.0 migration used `utf8mb4_0900_ai_ci` collation (MySQL 8.0+) on MySQL 5.7 prod → changed to `utf8mb4_general_ci`
- **v5.0.0 deploy:** v4.8.0 migration used `DEFAULT (UUID())` functional default (MySQL 8.0+) → removed, PHP handles UUID generation
