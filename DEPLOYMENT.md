# Commander Collector - Deployment

Commander Collector is a Turborepo monorepo. This doc covers only this project.
Portfolio and Grandkid are separate repos with their own deploy scripts; never
deploy them from here.

## Apps

| App               | Path              | Dev port | Notes                          |
| ----------------- | ----------------- | -------- | ------------------------------ |
| Core (main app)   | `apps/core/`      | 3001     | Next.js App Router, static export |
| Rules Guru        | `apps/rules-guru/`| 3003     | Rules chat sub-app             |
| PHP API           | `apps/core/app/`  | 8081     | served with `php -S` in dev    |

- DB: `commander_collector` (local) / `rickwphi_app_commander` (prod)
- prod basePath: `/app/projects/commander` (dev: `''`)
- `API_BASE` must include the basePath; browser fetch does NOT auto-prepend it.

## Local development

```bash
npm run local-start   # PHP :8081 + core :3001 + rules-guru :3003 (scripts/start-dev.sh)
npm run local-stop    # stop them (scripts/stop-dev.sh)
```

Open http://localhost:3001. Logs: `tail -f /tmp/php-server.log /tmp/nextjs-*.log`.

### Local database

Bluehost restricts MySQL to localhost, so no SSH tunnel to prod. Use a local DB:

```bash
brew install mysql && brew services start mysql
mysql -u root < scripts/setup-local-db.sql   # creates commander_collector + commander_dev
```

The PHP config auto-detects local vs production and picks the right credentials.
DB reads/writes in tooling go through the request-record / write-record skills.

## Deploy to production

Preferred: the deploy skill (runs preflight: git-clean + migration-location check).

```
/deploy commander           # full: build both apps, static, PHP API, migrations, tests
/deploy commander --static-only
/deploy c -r                # rules-guru only
```

Direct script (same thing; not portable across machines):

```bash
bash deploy.sh [--skip-build] [--php-only] [--static-only] [--guru-only]
```

`deploy.sh` builds `apps/core` + `apps/rules-guru`, mirrors the static export to
prod, rsyncs the PHP API, applies any pending migration, restores the `.htaccess`
files, and runs the post-deploy Playwright suite (`--skip-tests` to opt out).

### Migrations

- Files live at `migrations/v<version>.sql` at the **repo root** (NOT
  `apps/core/migrations/` - the deploy reads root only; wrong dir = silently skipped).
- Filename version MUST match `apps/core/package.json` exactly.
- Applied automatically on deploy unless `--static-only`. Tracked per-DB in
  `schema_migrations`. See `/bump-version` for the version + changelog flow.

## Server paths

| What                   | Server path                                   |
| ---------------------- | --------------------------------------------- |
| Core + rules static    | `~/public_html/app/projects/commander/`       |
| Rules Guru static      | `~/public_html/app/projects/commander/rules/` |
| PHP API                | `~/public_html/php-api/` (canonical)          |

`~/public_html/app/php-api` is a symlink to `~/public_html/php-api`; the commander
PHP API is written to the canonical path. Do not "fix" the symlink.

## URLs

- App:      https://rickwphillips.com/app/projects/commander/
- Rules:    https://rickwphillips.com/app/projects/commander/rules/
- PHP API:  https://rickwphillips.com/php-api/

## Known gotcha

The final `.htaccess` restore step can fail with `ssh: Connection refused` when
the deploy's many rapid SSH connections trip Bluehost's rate limit (the static
files, migration, and pattern seed still land). Workaround: re-run the four
`.htaccess` writes in a single SSH connection once the limit clears. Tracked in
the global TODO.
