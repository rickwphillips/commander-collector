# The Commander Collector

A Magic: The Gathering Commander game tracking app.

## Features

- Track Commander game results (date, winning turn, notes)
- Manage players and their decks
- Track commanders separately from deck names
- MTG color identity display
- Statistics: win rates, head-to-head records, top commanders
- Dark/light theme with autumn color palette

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, MUI 7
- **Backend**: PHP API (for Bluehost deployment)
- **Database**: MySQL

## Local Development

### Prerequisites

- Node.js 18+
- MySQL database (on Bluehost or local)

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up the database by running `apps/core/app/php-api/setup.sql` in phpMyAdmin (or via `mysql -u … < setup.sql` locally)

3. Place a `~/auth_secrets_dev.php` file outside the web root with the local DB credentials and JWT secret (config.php reads from there in dev; the keychain-backed variant is described in the project's local-dev notes). For prod, the same file lives on Bluehost as `~/auth_secrets.php`.

4. Start the dev stack via the workspace script (starts MySQL, the PHP CLI server on :8081, and the Next dev server on :3001):

   ```bash
   ./scripts/start-dev.sh
   ```

5. Open http://localhost:3001

## Database

Schema lives in `apps/core/app/php-api/setup.sql`. Migrations are versioned at the monorepo root in `migrations/v{version}.sql` and applied by the `deploy` workspace script. Core tables include `players`, `decks`, `games`, `game_results`, `lists`, `list_cards`, `live_game_sessions`, `live_game_seats`, plus the auth/users tables in the shared `rickwphillips_auth` database.

## PHP API

`apps/core/app/php-api/` contains 50+ endpoints. Auth is JWT (issued by `auth/login.php`, verified by `auth/middleware.php`). The SSE endpoint is `live-game-stream.php` (text/event-stream, self-closes well under any proxy timeout). Endpoints accept the dev-only `_cb=` cache buster appended by the JS client.

## Deployment

### Single-host on Bluehost (current)

The Next app is built as a static export (`output: 'export'` in `apps/core/next.config.ts`) and deployed under `/app/projects/commander/` on Bluehost. The PHP API ships from `apps/core/app/php-api/` to the same Bluehost account; LiteSpeed serves `/php-api/*.php` directly. In dev, a Next rewrite (also in `next.config.ts`) proxies `/php-api/*` to `http://localhost:8081`, so the same client code works in both modes.

Deploy with the `deploy` workspace script (handles version-aware migration application + skill-driven preflight checks).

## Project Structure

```
apps/
├── core/                # Main app (Commander tracker)
│   ├── app/
│   │   ├── components/          # Shared UI
│   │   ├── lib/                 # API client, types, useList, etc.
│   │   ├── theme/               # MUI autumn palette
│   │   ├── game-manager/        # Live game UI (PlayerCard split lives here)
│   │   │   ├── components/      # PlayerPanel (orchestrator), PlayerCard (renderer), SeatingCard, etc.
│   │   │   ├── hooks/           # useDamageFlash, useMonarchTransition, useLongPress, useSounds, ...
│   │   │   ├── remoteTransforms.ts   # Pure reducers shared by host + remote panels
│   │   │   └── detectSideEffects.ts  # State-diff → UI side-effect helper
│   │   ├── players/, decks/, games/, stats/, lists/, rules/  # Routes
│   │   └── php-api/             # PHP backend
│   └── tests/                   # vitest specs (754 tests)
└── rules-guru/                  # MTG rules-Q&A standalone app (port 3003 in dev)

packages/
└── shared/                      # Cross-app TypeScript helpers (@commander/shared)
```
