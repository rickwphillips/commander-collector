# Phase 2.1 Schema Discrepancy Report

**Generated:** 2026-04-07
**Live schema source:** `apps/core/docs/current-schema.sql` (introspected from dev `commander_collector`)
**Plan source:** `REFACTOR-PLAN-unified-card-workflow.md` lines 405–528

---

## Summary

| Severity | Count | Notes |
|---|---|---|
| ERROR (plan assumes table/column exists, doesn't) | 0 | All target tables present |
| WARNING (column already widened / pre-existing) | 2 | `list_cards.scryfall_id`, `decks.partner` |
| INFO (untouched table or pre-existing column) | 14 | Listed below |
| **Tracking discrepancy** | 1 | `schema_migrations` is behind by 7 entries |

No Phase 2.1 blockers. The migration is safe to author.

---

## Tracking discrepancy (must fix before migration runs)

`schema_migrations` table has its latest entry as **v3.10.0** (applied 2026-04-05), but migration files exist on disk for **v4.0.0 through v4.6.0** and the schema clearly reflects them being applied (`decks.partner` exists, `lists.user_id` exists).

The `schema_migrations` tracking has been silently skipping these. The deploy-script alias path may have stopped writing rows to that table, OR these migrations were applied via a manual path.

**Implication for Phase 2.1:** The migration filename must match `package.json` version per project convention. `package.json` is at **v4.6.0**. The next migration must bump to a new minor version (e.g. **v4.7.0**) and `apps/core/package.json` must be bumped in the same commit.

**Recommendation before authoring the migration:** backfill `schema_migrations` for v4.0.0–v4.6.0 manually (one-row inserts) so the tracking table catches up to reality. Otherwise the next migration runner may try to re-apply those files (most are idempotent or changelog-only, but it's noise).

---

## Per-table discrepancies vs Phase 2.1 plan

### `lists` (plan: add deck_id, format, role, source, deleted_at, version)
| Plan column | Live state | Action |
|---|---|---|
| `deck_id INT NULL` + index | ❌ missing | ADD |
| `format VARCHAR(32) DEFAULT 'commander'` | ❌ missing | ADD |
| `role VARCHAR(32)` | ❌ missing | ADD |
| `source VARCHAR(64)` | ❌ missing | ADD |
| `deleted_at TIMESTAMP NULL` + index | ❌ missing | ADD |
| `version INT DEFAULT 1` | ❌ missing | ADD |

Live `lists` already has: `id, name, description, user_id (varchar 36), created_at, updated_at`. **`user_id` is pre-existing** — plan doesn't mention it but it's harmless.

### `game_results` (plan: add cardlist_snapshot)
| Plan column | Live state | Action |
|---|---|---|
| `cardlist_snapshot JSON NULL` | ❌ missing | ADD |

### `scan_drafts` → rename to `buffer_drafts`
- Live: `id, user_id (INT, not VARCHAR), state JSON, updated_at`. Composite key is `(id)` PK + `uq_user(user_id)`.
- Plan: rename to `buffer_drafts`, add `device_id, context_type, context_ref`, new composite PK.
- ⚠️ **Note: live `user_id` is `INT NOT NULL`** — diverges from the rest of the project where user_id is `VARCHAR(36)` (e.g. `lists.user_id`, `players.user_id`). Migration should either coerce or document. Phase 2.2 cutover may need to map int→uuid.

### `decks` (plan: add deleted_at index, add format)
| Plan column | Live state | Action |
|---|---|---|
| `deleted_at TIMESTAMP NULL` + index | ❌ missing | ADD |
| `format VARCHAR(32) DEFAULT 'commander'` | ❌ missing | ADD |
| `partner VARCHAR(150)` | ✅ already present (v4.6.0) | SKIP — use IF NOT EXISTS guard |
| `commander, colors, has_w/u/b/r/g` | ✅ deck-native, peers rule | NEVER drop |

### `list_cards` (plan: add is_custom, role)
| Plan column | Live state | Action |
|---|---|---|
| `is_custom TINYINT(1)` | ❌ missing | ADD |
| `role ENUM('commander','partner')` | ❌ missing | ADD |
| `scryfall_id` widening to VARCHAR(64) | ✅ already VARCHAR(64) | SKIP |

### `deck_cards` (plan: widen scryfall_id, add is_custom + role)
| Plan column | Live state | Action |
|---|---|---|
| `scryfall_id` widen to VARCHAR(64) | ⚠️ currently VARCHAR(36) | WIDEN |
| `is_custom TINYINT(1)` | ❌ missing | ADD |
| `role ENUM('commander','partner')` | ❌ missing | ADD |

### `scryfall_card_cache` (plan: widen scryfall_id, add legalities + prices)
| Plan column | Live state | Action |
|---|---|---|
| `scryfall_id` widen to VARCHAR(64) | ⚠️ currently VARCHAR(36) | WIDEN |
| `legalities JSON` | ❌ missing | ADD |
| `legalities_cached_at TIMESTAMP` | ❌ missing | ADD |
| `prices JSON` | ❌ missing | ADD |
| `prices_cached_at TIMESTAMP` | ❌ missing | ADD |
| `image_b64 mediumtext` | ✅ present (not in plan) | LEAVE — info only |

### New tables (plan)
| Table | Live state | Action |
|---|---|---|
| `system_state` | ❌ missing | CREATE |
| `list_history` | ❌ missing | CREATE |

---

## Tables in live DB the plan doesn't mention (info only — Phase 2.1 leaves them untouched)

- `changelog_changes`, `changelog_releases` — release notes content
- `coach_notes` — coach observations
- `game_settings` — per-user preferences
- `live_game_seats`, `live_game_sessions` — live game tracking (untouched per plan note line 530)
- `pattern_errors` — MTG rules pattern tracking (rules-guru subsystem)
- `players` — game players
- `rules_ai_corrections`, `rules_conversations`, `rules_messages`, `rules_patterns`, `rules_qa_log` — rules guru subsystem
- `stat_panels` — user stat panel customization
- `schema_migrations` — see "Tracking discrepancy" above

---

## Backfill plan (to be authored in the migration)

1. For every `decks` row that has `deck_cards`: INSERT a `lists` row with `deck_id = decks.id`, `role = 'main'`, `format = decks.format` (default 'commander'), `name = decks.name + ' (main)'`.
2. For every `deck_cards` row: INSERT into `list_cards` with `list_id` = the just-inserted list, copy `card_name, scryfall_id, quantity, is_commander, is_proxy`, set `role = 'commander'` if `is_commander = 1` AND name matches `decks.commander`, set `role = 'partner'` if name matches `decks.partner`.
3. **Backfill `schema_migrations`** with rows for v4.0.0 through v4.6.0 (plus the new v4.7.0 we're about to add) so the tracking table catches up.

---

## Questions for the orchestrator before authoring the migration

1. **Should the migration include the `schema_migrations` backfill** for v4.0.0–v4.6.0, or should that be a one-off cleanup script?
2. **`scan_drafts.user_id` is INT** — is the rename to `buffer_drafts` the right time to convert it to VARCHAR(36) to match the rest of the project, or leave it INT for compatibility?
3. **Migration filename**: should it be `v4.7.0` (next minor) or jump straight to `v5.0.0` since this is the start of the unified-card-workflow v5 family?
