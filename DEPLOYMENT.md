# Commander Collector

## Local Development

### 1. Start PHP server (Terminal 1)
```bash
cd /Users/rick/FreddyRhetorickProjects/commander-collector/app
php -S localhost:8080
```

### 2. Start Next.js dev server (Terminal 2)
```bash
cd /Users/rick/FreddyRhetorickProjects/commander-collector
npm run dev
```

Then open http://localhost:3000

**Note:** The Next.js dev server proxies `/php-api/*` requests to the PHP server at `localhost:8080`.

### Database for Local Dev

Bluehost restricts MySQL to localhost-only connections, so SSH tunneling won't work. You need a local MySQL database.

**Setup Local MySQL:**
```bash
# Install MySQL if needed
brew install mysql
brew services start mysql

# Create local database and user
mysql -u root < scripts/setup-local-db.sql
```

The PHP config auto-detects local vs production and uses the appropriate credentials.

---

# Deployment Commands

## Commander Collector App

### Build
```bash
cd /Users/rick/FreddyRhetorickProjects/commander-collector
npm run build
```

### Deploy Static Files
```bash
rsync -avz --delete --exclude '.DS_Store' /Users/rick/FreddyRhetorickProjects/commander-collector/out/ rickwphillips:~/public_html/app/projects/commander/
```

### Deploy PHP API
```bash
rsync -avz --exclude '.DS_Store' /Users/rick/FreddyRhetorickProjects/commander-collector/app/php-api/ rickwphillips:~/public_html/php-api/
```

**Note:** The PHP API lives at `~/public_html/php-api/` (not inside `/app/`) due to Bluehost security rules.

---

## Main Portfolio Website

### Build
```bash
cd /Users/rick/FreddyRhetorickProjects/website/rickwphillips.com
npm run build
```

### Deploy Static Files
```bash
rsync -avz --delete --exclude '.DS_Store' --exclude 'projects/commander' --exclude 'php-api' /Users/rick/FreddyRhetorickProjects/website/rickwphillips.com/out/ rickwphillips:~/public_html/app/
```

**Important:** After deploying the main website, restore the .htaccess file:

```bash
ssh rickwphillips "cat > ~/public_html/app/.htaccess << 'EOF'
# Disable automatic directory slash redirect
DirectorySlash Off

# Enable RewriteEngine
RewriteEngine On

# If request matches a directory name and .html file exists, serve the .html
RewriteCond %{REQUEST_FILENAME} -d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ \$1.html [L]

# Handle clean URLs - rewrite /path to /path.html if .html exists
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ \$1.html [L]

# Handle trailing slash - remove and serve .html
RewriteCond %{REQUEST_URI} ^(.+)/$
RewriteCond %{DOCUMENT_ROOT}%1.html -f
RewriteRule ^(.+)/$ \$1.html [L]

# Disable directory listing
Options -Indexes
EOF"
```

---

## Server Paths

| Local | Server |
|-------|--------|
| Commander static files | `~/public_html/app/projects/commander/` |
| Commander PHP API | `~/public_html/php-api/` |
| Portfolio website | `~/public_html/app/` |

## URLs

- Portfolio: https://rickwphillips.com/app/
- Commander Collector: https://rickwphillips.com/app/projects/commander/
- PHP API: https://rickwphillips.com/php-api/
