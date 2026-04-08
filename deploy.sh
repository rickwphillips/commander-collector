#!/bin/bash
# Commander Collector — Full Build & Deploy (Turborepo monorepo)
# Usage: bash deploy.sh [--skip-build] [--php-only] [--static-only] [--decks-only] [--guru-only]
#
# ┌─────────────────────────────────────────────────────────────────────┐
# │  REMOTE PATHS — DO NOT CHANGE WITHOUT VERIFYING ON PROD            │
# │                                                                     │
# │  PHP API (canonical):  ~/public_html/php-api/                      │
# │  PHP API (symlink):    ~/public_html/app/php-api → php-api         │
# │  Static (core+decks):  ~/public_html/app/projects/commander/       │
# │  Static (rules-guru):  ~/public_html/app/projects/commander/rules/ │
# │  Rules patterns:       ~/rules-data/                               │
# │                                                                     │
# │  The symlink makes both /php-api/ and /app/php-api/ URL paths      │
# │  work. rsync MUST target the real dir (php-api/), NOT the symlink. │
# └─────────────────────────────────────────────────────────────────────┘

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
CORE_DIR="$PROJECT_DIR/apps/core"

GURU_DIR="$PROJECT_DIR/apps/rules-guru"
PHP_API_DIR="$CORE_DIR/app/php-api"
CORE_OUT="$CORE_DIR/out"

GURU_OUT="$GURU_DIR/out"
REMOTE_HOST="rickwphillips"
REMOTE_COMMANDER="public_html/app/projects/commander/"
REMOTE_GURU="public_html/app/projects/commander/rules/"
REMOTE_PHP="~/public_html/php-api/"
FTP_HOST="ftp://ftp.rickwphillips.com"

# Load FTP credentials from .env.local (never committed)
ENV_FILE="$CORE_DIR/.env.local"
if [ -f "$ENV_FILE" ]; then
  FTP_USER=$(grep '^FTP_USER=' "$ENV_FILE" | cut -d= -f2-)
  FTP_PASS=$(grep '^FTP_PASS=' "$ENV_FILE" | cut -d= -f2-)
fi
if [ -z "$FTP_USER" ] || [ -z "$FTP_PASS" ]; then
  echo "ERROR: FTP_USER/FTP_PASS not found in $ENV_FILE"
  exit 1
fi

# ── Sanity check: verify we're in the right repo ─────────────
if [ ! -f "$PROJECT_DIR/apps/core/package.json" ]; then
  echo "ERROR: Cannot find apps/core/package.json — are you in the commander-collector repo?"
  exit 1
fi

if [ ! -d "$PHP_API_DIR" ]; then
  echo "ERROR: PHP API dir not found at $PHP_API_DIR"
  exit 1
fi

SKIP_BUILD=false
PHP_ONLY=false
STATIC_ONLY=false

GURU_ONLY=false

# Parse flags
for arg in "$@"; do
  case $arg in
    --skip-build)  SKIP_BUILD=true ;;
    --php-only)    PHP_ONLY=true ;;
    --static-only) STATIC_ONLY=true ;;

    --guru-only)   GURU_ONLY=true ;;
    --help|-h)
      echo "Usage: bash deploy.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --skip-build   Skip npm run build (use existing out/ directories)"
      echo "  --php-only     Only deploy PHP API files (no static build/deploy)"
      echo "  --static-only  Only build and deploy static files (no PHP or DB migration)"

      echo "  --guru-only    Only build and deploy apps/rules-guru (fast path)"
      echo "  -h, --help     Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $arg"
      exit 1
      ;;
  esac
done

# ── Step 1: Build ──────────────────────────────────────────────
if [ "$PHP_ONLY" = false ] && [ "$SKIP_BUILD" = false ]; then
  if [ "$GURU_ONLY" = false ]; then
    echo "═══════════════════════════════════════════"
    echo "  Building apps/core..."
    echo "═══════════════════════════════════════════"
    (cd "$CORE_DIR" && npm run build)
    echo ""
    echo "apps/core build complete."
    echo ""
  fi

  if [ "$GURU_ONLY" = false ]; then
    echo "═══════════════════════════════════════════"
    echo "  Building apps/rules-guru..."
    echo "═══════════════════════════════════════════"
    (cd "$GURU_DIR" && npm run build)
    echo ""
    echo "apps/rules-guru build complete."
    echo ""
  fi
fi

# ── Step 2: Deploy static files via lftp ───────────────────────
if [ "$PHP_ONLY" = false ]; then
  if [ "$GURU_ONLY" = false ]; then
    echo "═══════════════════════════════════════════"
    echo "  Deploying apps/core static files (--delete)..."
    echo "═══════════════════════════════════════════"
    # Preserve rules-guru dir — core --delete would wipe it since rules/ is inside commander/
    ssh "$REMOTE_HOST" "cd ~/public_html/app/projects/commander && tar czf /tmp/rules-guru-backup.tar.gz rules/ 2>/dev/null || true"
    lftp -u "$FTP_USER,$FTP_PASS" "$FTP_HOST" -e "
      set ssl:verify-certificate no
      mirror -R --verbose --delete $CORE_OUT/ $REMOTE_COMMANDER
      bye
    "
    # Restore rules-guru dir after core deploy
    ssh "$REMOTE_HOST" "cd ~/public_html/app/projects/commander && tar xzf /tmp/rules-guru-backup.tar.gz 2>/dev/null && rm -f /tmp/rules-guru-backup.tar.gz || true"
    echo ""
    echo "apps/core static deploy complete."
    echo ""
  fi

  if [ "$GURU_ONLY" = false ]; then
    echo "═══════════════════════════════════════════"
    echo "  Deploying apps/rules-guru static files..."
    echo "═══════════════════════════════════════════"
    lftp -u "$FTP_USER,$FTP_PASS" "$FTP_HOST" -e "
      set ssl:verify-certificate no
      mirror -R --verbose --delete $GURU_OUT/ $REMOTE_GURU
      bye
    "
    echo ""
    echo "apps/rules-guru static deploy complete."
    echo ""
  fi
fi

# ── Step 3: DB Migrations — apply pending to dev and prod ──────
if [ "$STATIC_ONLY" = false ] && [ "$GURU_ONLY" = false ]; then
  echo "═══════════════════════════════════════════"
  echo "  Auditing DB migrations (dev + prod)..."
  echo "═══════════════════════════════════════════"

  MIGRATION_DIR="$PROJECT_DIR/migrations"
  MIGRATION_FILES=($(ls "$MIGRATION_DIR"/v*.sql 2>/dev/null | sort -V))

  if [ ${#MIGRATION_FILES[@]} -eq 0 ]; then
    echo "  No migration files found — skipping."
  else
    # ── Prod credentials ──────────────────────────────────────────
    DB_USER=$(ssh "$REMOTE_HOST" "php -r \"include getenv('HOME') . '/auth_secrets.php'; echo DB_USER;\"")
    DB_PASS=$(ssh "$REMOTE_HOST" "php -r \"include getenv('HOME') . '/auth_secrets.php'; echo DB_PASS;\"")
    DB_NAME=$(ssh "$REMOTE_HOST" "php -r \"include getenv('HOME') . '/auth_secrets.php'; echo DB_NAME;\"")

    # ── Ensure schema_migrations exists on both envs ──────────────
    mysql -u root commander_collector -e \
      "CREATE TABLE IF NOT EXISTS schema_migrations (version VARCHAR(20) NOT NULL, applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (version));"

    ssh "$REMOTE_HOST" "mysql -h localhost -u $DB_USER -p\"$DB_PASS\" $DB_NAME -e \
      \"CREATE TABLE IF NOT EXISTS schema_migrations (version VARCHAR(20) NOT NULL, applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (version));\""

    # ── Fetch applied versions from both envs ─────────────────────
    DEV_APPLIED=$(mysql -u root commander_collector -sNe "SELECT version FROM schema_migrations;")
    PROD_APPLIED=$(ssh "$REMOTE_HOST" "mysql -h localhost -u $DB_USER -p\"$DB_PASS\" $DB_NAME -sNe \"SELECT version FROM schema_migrations;\"")

    DEV_PENDING=0
    PROD_PENDING=0

    for MIGRATION_FILE in "${MIGRATION_FILES[@]}"; do
      FILENAME=$(basename "$MIGRATION_FILE")
      MIG_VERSION=$(echo "$FILENAME" | sed 's/^v//; s/\.sql$//')

      # ── Dev ───────────────────────────────────────────────────────
      if echo "$DEV_APPLIED" | grep -qx "$MIG_VERSION"; then
        echo "  [dev]  v${MIG_VERSION} already applied."
      else
        echo "  [dev]  Applying v${MIG_VERSION}..."
        mysql -u root commander_collector < "$MIGRATION_FILE"
        mysql -u root commander_collector -e "INSERT IGNORE INTO schema_migrations (version) VALUES ('$MIG_VERSION');"
        echo "  [dev]  v${MIG_VERSION} done."
        DEV_PENDING=$((DEV_PENDING + 1))
      fi

      # ── Prod ──────────────────────────────────────────────────────
      if echo "$PROD_APPLIED" | grep -qx "$MIG_VERSION"; then
        echo "  [prod] v${MIG_VERSION} already applied."
      else
        echo "  [prod] Applying v${MIG_VERSION}..."
        scp "$MIGRATION_FILE" "$REMOTE_HOST:/tmp/migration_${MIG_VERSION}.sql"
        ssh "$REMOTE_HOST" "mysql -h localhost -u $DB_USER -p\"$DB_PASS\" $DB_NAME \
          < /tmp/migration_${MIG_VERSION}.sql \
          && mysql -h localhost -u $DB_USER -p\"$DB_PASS\" $DB_NAME -e \
            \"INSERT IGNORE INTO schema_migrations (version) VALUES ('$MIG_VERSION');\" \
          && rm /tmp/migration_${MIG_VERSION}.sql"
        echo "  [prod] v${MIG_VERSION} done."
        PROD_PENDING=$((PROD_PENDING + 1))
      fi
    done

    echo "  Dev: $DEV_PENDING new migration(s). Prod: $PROD_PENDING new migration(s)."
  fi
  echo ""
fi

# ── Step 4: Deploy PHP API via rsync ──────────────────────────
# Target: ~/public_html/php-api/ (the REAL directory, not the app/php-api symlink)
if [ "$STATIC_ONLY" = false ] && [ "$GURU_ONLY" = false ]; then
  echo "═══════════════════════════════════════════"
  echo "  Deploying PHP API via rsync..."
  echo "  Source: $PHP_API_DIR/"
  echo "  Target: $REMOTE_HOST:$REMOTE_PHP"
  echo "═══════════════════════════════════════════"

  # Verify the remote target is the real directory, not a symlink
  REMOTE_TYPE=$(ssh "$REMOTE_HOST" "if [ -L ~/public_html/php-api ]; then echo symlink; elif [ -d ~/public_html/php-api ]; then echo dir; else echo missing; fi")
  if [ "$REMOTE_TYPE" != "dir" ]; then
    echo "ERROR: Remote php-api/ is '$REMOTE_TYPE', expected real directory. Aborting PHP deploy."
    exit 1
  fi

  rsync -avz --exclude '.DS_Store' "$PHP_API_DIR/" "$REMOTE_HOST:$REMOTE_PHP"
  echo ""
  echo "PHP API deploy complete."
  echo ""

  echo "═══════════════════════════════════════════"
  echo "  Syncing rules patterns to DB..."
  echo "═══════════════════════════════════════════"
  ssh "$REMOTE_HOST" "php ${REMOTE_PHP}rules/seed.php --source ~/rules-data"
  echo ""

  echo ""
fi

# ── Step 5: Restore .htaccess files (ALWAYS — lftp mirror excludes dotfiles) ──
# WHY THIS EXISTS: lftp's mirror command has a built-in mirror:exclude-regex "^\."
# that silently drops all dotfiles, including .htaccess. Combined with --delete,
# any existing .htaccess on the remote is wiped on every static deploy. This has
# recurred 4 times. The explicit SSH cat-write below is the canonical fix — do NOT
# remove it or replace with set mirror:exclude-regex "". See memory file:
# ~/.claude/projects/-Users-rick-FreddyRhetorickProjects/memory/feedback_htaccess_deploy.md
if [ "$PHP_ONLY" = false ]; then
  echo "═══════════════════════════════════════════"
  echo "  Restoring .htaccess files..."
  echo "═══════════════════════════════════════════"

  if [ "$GURU_ONLY" = false ]; then
    ssh "$REMOTE_HOST" 'cat > ~/public_html/app/.htaccess << '\''HTEOF'\''
DirectorySlash Off

RewriteEngine On

RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
HTEOF'

    ssh "$REMOTE_HOST" 'cat > ~/public_html/app/projects/.htaccess << '\''HTEOF'\''
DirectorySlash On
HTEOF'

    ssh "$REMOTE_HOST" 'cat > ~/public_html/app/projects/commander/.htaccess << '\''HTEOF'\''
DirectorySlash On
HTEOF'
  fi

  ssh "$REMOTE_HOST" 'cat > ~/public_html/app/projects/commander/rules/.htaccess << '\''HTEOF'\''
DirectorySlash On
HTEOF'

  echo ".htaccess files restored."
  echo ""
fi

echo "═══════════════════════════════════════════"
echo "  Commander Collector deploy complete!"
echo "═══════════════════════════════════════════"
