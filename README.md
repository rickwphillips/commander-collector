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

2. Set up the database by running `app/php-api/setup.sql` in phpMyAdmin

3. Update `app/php-api/config.php` with your database credentials

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

## Database Setup

Run the SQL in `app/php-api/setup.sql` in phpMyAdmin to create:

- `players` - Your playgroup members
- `decks` - Each player's decks with commander and colors
- `games` - Game records with date, winning turn, notes
- `game_results` - Each player's result per game

## PHP API Files

Upload `app/php-api/` contents to Bluehost:

- `config.php` - Database connection (update credentials)
- `players.php` - CRUD for players
- `decks.php` - CRUD for decks
- `games.php` - CRUD for games
- `stats.php` - Statistics queries
- `head-to-head.php` - Head-to-head records
- `setup.sql` - Database schema

## Deployment

### Recommended: Vercel + Bluehost

1. Deploy Next.js app to [Vercel](https://vercel.com) (free tier)
2. Keep PHP API and MySQL on Bluehost
3. Update `app/lib/api.ts` API_BASE to point to your Bluehost PHP API URL

### PHP API on Bluehost

1. Upload `app/php-api/` files to `public_html/api/commander/`
2. Update `config.php` with your database credentials
3. Test endpoints: `https://yourdomain.com/api/commander/players.php`

## Project Structure

```
app/
├── components/          # UI components
├── lib/                 # API client and types
├── theme/               # MUI theme
├── players/             # Player pages
├── decks/               # Deck pages
├── games/               # Game pages
├── stats/               # Statistics page
├── php-api/             # PHP backend
└── page.tsx             # Dashboard
```
