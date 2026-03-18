'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Stack, Box, Chip, Grow, Divider } from '@mui/material';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import BuildIcon from '@mui/icons-material/Build';
import BugReportIcon from '@mui/icons-material/BugReport';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { PageContainer } from '@/components/PageContainer';

type ChangeType = 'added' | 'changed' | 'fixed' | 'improved';

interface Change {
  type: ChangeType;
  text: string;
}

interface Release {
  version: string;
  date: string;
  title: string;
  changes: Change[];
}

const changeTypeConfig: Record<
  ChangeType,
  { label: string; color: string; icon: React.ReactElement }
> = {
  added: { label: 'Added', color: '#2e7d32', icon: <NewReleasesIcon sx={{ fontSize: 14 }} /> },
  changed: { label: 'Changed', color: '#ed6c02', icon: <BuildIcon sx={{ fontSize: 14 }} /> },
  fixed: { label: 'Fixed', color: '#d32f2f', icon: <BugReportIcon sx={{ fontSize: 14 }} /> },
  improved: {
    label: 'Improved',
    color: '#0288d1',
    icon: <AutoAwesomeIcon sx={{ fontSize: 14 }} />,
  },
};

const releases: Release[] = [
  {
    version: '1.9.1',
    date: '2026-03-17',
    title: 'Mana Symbol Visuals',
    changes: [
      {
        type: 'added',
        text: 'Mana symbol SVG icons — all color identity displays now show official mana pip icons (W/U/B/R/G/C)',
      },
      {
        type: 'added',
        text: 'Geometric pip arrangements — 3 colors display as a triangle, 4 as a square, 5 as a pentagon',
      },
      {
        type: 'added',
        text: 'Colorless (C) option in color pickers throughout the app, mutually exclusive with WUBRG',
      },
      {
        type: 'improved',
        text: 'Color identity sentence in comparison builder now reads as a subject ("Show me all white and blue commanders…") rather than a condition clause',
      },
      {
        type: 'improved',
        text: 'Deck list filter and edit dialog use interactive mana symbol toggles instead of checkboxes',
      },
    ],
  },
  {
    version: '1.9.0',
    date: '2026-03-17',
    title: 'Custom Comparison Builder Overhaul',
    changes: [
      {
        type: 'improved',
        text: 'Color filter in comparison builder now uses has_W/U/B/R/G columns instead of exact string match — AND/OR/Only modes work correctly for all group-bys',
      },
      {
        type: 'added',
        text: 'Opponent filters in comparison conditions — filter games by opponent players, opponent commanders, and opponent deck colors (with AND/OR/Only mode)',
      },
      {
        type: 'added',
        text: 'Opponent group-bys — group results by Opponent Player or Opponent Commander to see your performance against specific opponents',
      },
      {
        type: 'added',
        text: 'New metrics: Consistency Score (std dev of finish position) and First Eliminated Rate',
      },
      {
        type: 'added',
        text: 'My Games Only condition — restrict results to games you personally played in (requires claimed player)',
      },
      {
        type: 'added',
        text: 'Exclude Players condition — remove specific players from pod when counting stats',
      },
      {
        type: 'added',
        text: 'Top N results limit — show only the top N entities in comparison results',
      },
      {
        type: 'added',
        text: 'Color filter (with AND/OR/Only mode) in Section C Narrow To — filter by deck color for player, deck, deck_age, and game-property group-bys',
      },
      {
        type: 'added',
        text: 'Query Sentence — live natural-language description of the current comparison query, updating in real time as conditions are configured in the panel builder',
      },
      {
        type: 'changed',
        text: 'Panel builder is now comparison-only — Pre-built Sections tab removed; all new panels use the custom comparison builder',
      },
      {
        type: 'improved',
        text: 'Commander autocomplete in conditions now pulls from your loaded decks data instead of requiring free-text entry',
      },
      {
        type: 'fixed',
        text: 'Color filter on decks page now uses has_X columns with AND/OR/Only mode instead of exact string match',
      },
      {
        type: 'fixed',
        text: 'stat_panels.user_id column widened to VARCHAR(36) to match UUID-based auth system',
      },
    ],
  },
  {
    version: '1.8.1',
    date: '2026-02-23',
    title: 'Versioned DB Migrations',
    changes: [
      {
        type: 'improved',
        text: 'Deploy script now applies versioned DB migrations automatically — schema changes in migrations/v*.sql run before PHP deploy, tracked in schema_migrations table',
      },
    ],
  },
  {
    version: '1.8.0',
    date: '2026-02-23',
    title: 'Color Stats, 2HG Overhaul & UX Polish',
    changes: [
      {
        type: 'added',
        text: 'Color Presence stats — win rates for all decks containing each color (W/U/B/R/G), regardless of other colors in the identity',
      },
      {
        type: 'added',
        text: 'Color Complexity stats — performance breakdown by number of colors (Colorless through Five-color)',
      },
      {
        type: 'added',
        text: 'Must Include Colors condition in comparison builder — filter results to decks containing all specified colors',
      },
      {
        type: 'changed',
        text: '2HG game form redesigned — replaced per-player team assignment with direct team cards; each non-winning team has its own Eliminated Turn field',
      },
      {
        type: 'added',
        text: 'Add Team button in 2HG form — supports up to 4 teams with finish positions ordered by elimination turn',
      },
      {
        type: 'changed',
        text: 'Game Length (winning turn) is now auto-derived from the last-eliminated player\'s turn — no longer a manual input field',
      },
      {
        type: 'changed',
        text: 'Game Length filter on custom panel form replaced with number input plus "or more" / "or less" / "Any" controls; supports both min and max turn bounds',
      },
      {
        type: 'changed',
        text: 'Game Type filter label updated from "Standard" to "Commander" on the comparison builder',
      },
      {
        type: 'improved',
        text: 'Overall stats cards on home and stats pages link to their respective pages; Avg Turns links to Stats',
      },
      {
        type: 'improved',
        text: 'Test coverage: api.ts at 94%+ branch coverage (31 new tests); StatsCard at 100% across all metrics; 92 total tests',
      },
    ],
  },
  {
    version: '1.7.1',
    date: '2026-02-22',
    title: 'Coverage Reporting',
    changes: [
      {
        type: 'added',
        text: 'V8 coverage reporting — npm run test:coverage shows per-file line/branch/function percentages',
      },
      {
        type: 'improved',
        text: 'Tested files hit 95–100% line coverage; statsSections, ColorIdentityChips, and StatsCard at 100%',
      },
    ],
  },
  {
    version: '1.7.0',
    date: '2026-02-22',
    title: 'Test Suite',
    changes: [
      { type: 'added', text: 'Vitest test suite — 58 tests across 5 files' },
      {
        type: 'added',
        text: 'Unit tests for statsSections: getSectionDef lookups, VALID_SECTION_IDS membership, DEFAULT_SECTION_ORDER',
      },
      {
        type: 'added',
        text: 'Hook tests for useHiddenStats: toggle, showAll, hideAll, panel visibility, localStorage persistence',
      },
      {
        type: 'added',
        text: 'API tests: auth headers, .php endpoint insertion, 401 handling, typed method endpoints',
      },
      { type: 'added', text: 'Component tests for ColorIdentityChips and StatsCard' },
    ],
  },
  {
    version: '1.6.0',
    date: '2026-02-20',
    title: 'Auth & Security',
    changes: [
      {
        type: 'fixed',
        text: 'Logout now works correctly when switching between apps — login page clears its own stored token on explicit logout',
      },
      {
        type: 'fixed',
        text: 'Auth user IDs upgraded to UUIDs — removed integer casts that would break after the ID type migration',
      },
      {
        type: 'improved',
        text: 'User registration and bootstrap generate a UUID before insert rather than relying on lastInsertId()',
      },
    ],
  },
  {
    version: '1.5.0',
    date: '2026-02-19',
    title: 'Comparison Builder',
    changes: [
      {
        type: 'added',
        text: 'Comparison Builder — create custom stat queries with conditions, group-by, entity filters, and metrics',
      },
      {
        type: 'added',
        text: '12 group-by types: Player, Deck, Commander, Color, Deck Age, Pod Size, Game Length, Game Type, Month, Year, Season, Day of Week',
      },
      {
        type: 'added',
        text: '9 metrics: Win Rate, Wins, Total Games, Avg Finish Position, Recent Win Rate, Avg Survival Turns, Avg Turns to Win, Top-2 Rate, Elimination Rate',
      },
      {
        type: 'added',
        text: 'Condition filters: game type, pod size, game length, required player/commander in pod, finish position, date range, min games threshold',
      },
      {
        type: 'added',
        text: 'Color identity chips in comparison results for deck and color group-bys',
      },
      { type: 'added', text: 'Panel preview button on the Customize page with inline results' },
      {
        type: 'added',
        text: 'Inline panel toggle — show any panel directly on the Stats page from the settings drawer',
      },
      {
        type: 'improved',
        text: 'Section Visibility drawer now includes Your Panels and Shared Panels sections',
      },
    ],
  },
  {
    version: '1.4.0',
    date: '2026-02-17',
    title: 'Stats Customization & Sharing',
    changes: [
      { type: 'added', text: 'Hide stats sections — click the eye icon on any section to hide it' },
      {
        type: 'added',
        text: 'Settings drawer — toggle all section visibility with Show All / Hide All',
      },
      {
        type: 'added',
        text: 'Custom panels — save named views with your preferred sections and order',
      },
      { type: 'added', text: 'Drag-and-drop panel builder at Stats > Customize' },
      {
        type: 'added',
        text: 'Panel sharing — toggle a panel to shared and copy the link for others',
      },
      {
        type: 'added',
        text: 'Shared panel URL support — open a shared link to load that panel view',
      },
      {
        type: 'added',
        text: 'View selector dropdown on stats page to switch between default and custom panels',
      },
      { type: 'added', text: 'Hide shared panels from your view selector via settings drawer' },
      {
        type: 'improved',
        text: 'Stats page refactored for dynamic section rendering and ordering',
      },
    ],
  },
  {
    version: '1.3.0',
    date: '2026-02-13',
    title: 'Two-Headed Giant Stats',
    changes: [
      { type: 'added', text: 'Two-Headed Giant stats section on stats page' },
      { type: 'added', text: 'Team pairing records — wins, games, and win rate per duo' },
      { type: 'added', text: 'Individual player 2HG records' },
      { type: 'added', text: 'Recent 2HG game history with winning team and decks' },
      { type: 'changed', text: 'Replaced "Coming Soon! 2HG" placeholder with live data' },
    ],
  },
  {
    version: '1.2.0',
    date: '2026-02-12',
    title: 'Deck Filtering & Advanced Stats',
    changes: [
      { type: 'added', text: 'Deck page search — filter by deck name or commander' },
      { type: 'added', text: 'Deck page player filter dropdown' },
      { type: 'added', text: 'Deck page color identity toggle filters (W/U/B/R/G)' },
      { type: 'added', text: 'Deck page sort options — name, win rate, games played' },
      { type: 'added', text: 'Color Meta Analysis on stats page — win rates by color identity' },
      { type: 'added', text: 'Performance by Pod Size — player breakdowns for 2-6 player games' },
      {
        type: 'added',
        text: 'Player Streaks & Form — current streak, best streak, hot/cold/steady trend',
      },
      { type: 'added', text: 'Deck Streaks & Form — same streak tracking per deck' },
      { type: 'added', text: 'Changelog page' },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-02-04',
    title: 'User-Player Association',
    changes: [
      { type: 'added', text: 'Link player profiles to authenticated user accounts' },
      { type: 'added', text: 'Admin can assign users to players from player detail page' },
      { type: 'improved', text: 'Player detail page shows linked user info' },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-02-04',
    title: 'Initial Release',
    changes: [
      { type: 'added', text: 'Player management — add, edit, delete players' },
      { type: 'added', text: 'Deck tracking with commander and color identity' },
      { type: 'added', text: 'Game logging with finish positions and elimination turns' },
      { type: 'added', text: 'Statistics dashboard — top players, decks, commanders' },
      { type: 'added', text: 'Head-to-head records (1v1 and multiplayer)' },
      { type: 'added', text: 'JWT authentication with invite-only registration' },
      { type: 'added', text: 'Dark/light mode toggle' },
      { type: 'added', text: 'Responsive design for mobile and desktop' },
    ],
  },
];

export default function ChangelogPage() {

  return (
    <PageContainer title="Changelog" subtitle="What's new in Commander Collector">
      <Stack spacing={3}>
        {releases.map((release, index) => (
          <Grow key={release.version} in timeout={600 + index * 200}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Chip
                    label={`v${release.version}`}
                    sx={{
                      fontWeight: 700,
                      fontSize: '1rem',
                      backgroundColor: index === 0 ? 'primary.main' : 'action.selected',
                      color: index === 0 ? '#fff' : 'text.primary',
                    }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {release.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(release.date + 'T00:00:00').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1}>
                  {release.changes.map((change, i) => {
                    const config = changeTypeConfig[change.type];
                    return (
                      <Stack key={i} direction="row" alignItems="flex-start" spacing={1.5}>
                        <Chip
                          icon={config.icon}
                          label={config.label}
                          size="small"
                          sx={{
                            backgroundColor: config.color,
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            minWidth: 90,
                            '& .MuiChip-icon': { color: '#fff' },
                          }}
                        />
                        <Typography variant="body2" sx={{ pt: 0.3 }}>
                          {change.text}
                        </Typography>
                      </Stack>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Grow>
        ))}
      </Stack>
    </PageContainer>
  );
}
