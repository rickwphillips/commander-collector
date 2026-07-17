# AGENTS.md — Commander Collector

MTG Commander game-tracking app. Live at `https://rickwphillips.com/app/projects/commander/`.
Canonical agent guide for any tool; `CLAUDE.md` is a symlink to it.

## Layout (Turborepo)
- `apps/core` — the main Next.js 16 / React 19 / MUI app
- `apps/rules-guru` — separate Next app (rules assistant)
- `packages/@commander/shared` — shared code (`transpilePackages`)
- PHP + MySQL backend; game event log via PHP + SQLite → `game_logs`
- `apps/core` basePath: **`''` in dev**, `/app/projects/commander` in prod

## Run it (local dev)
```bash
bash scripts/start-dev.sh          # MySQL + PHP :8081 + Next core :3001
bash scripts/start-dev.sh all      # also apps/rules-guru on :3003
```
- Core app: http://localhost:3001/   PHP API proxied `/php-api/*` → `:8081`
- Requires the **Portfolio dev server on :3000** for shared auth (start it first).
- Ports: Next core 3001, rules-guru 3003, PHP 8081.

## Database
- Prod `rickwphi_app_commander`; local `commander_collector`; shared auth `rickwphi_auth`.
- Never use raw `mysql`: use the mcp-skills `db_read`/`db_write` tools.
- Version: `cc_status` tool, or `apps/core/package.json`.

## Deploy
- `deploy-scripts/deploy-commander.sh` with flags: `--static-only`, `--php-only`,
  `--decks-only`, `--guru-only` (or none for full). Prefer the `deploy` skill. Dev-first.

## Gotchas (these have bitten before)
- **Migrations live in the repo ROOT `migrations/`, NOT `apps/core/migrations/`** — the
  wrong dir is silently skipped.
- **Migration filename MUST match `apps/core/package.json` version exactly** — a
  mismatch is silently skipped. Bump version + file together.
- Static export in prod ⇒ any server-side feature MUST be implemented in PHP.
- Commander tax is **per-commander** (partner/background decks accrue two taxes).
- Local PHP must bind both IPv4+IPv6 (`0.0.0.0`), or a phone on the LAN gets
  "Connection lost".

## Deeper context
The `commander-collector` skill; the `commander-mcp` server is the MTG rules/synergy
brain. Known-bug work is `BUGFIX-LIST.md` (dedicated sessions only).
