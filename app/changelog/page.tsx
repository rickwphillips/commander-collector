'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Chip,
  Grow,
  Divider,
} from '@mui/material';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import BuildIcon from '@mui/icons-material/Build';
import BugReportIcon from '@mui/icons-material/BugReport';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { PageContainer } from '../components/PageContainer';

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

const changeTypeConfig: Record<ChangeType, { label: string; color: string; icon: React.ReactElement }> = {
  added: { label: 'Added', color: '#2e7d32', icon: <NewReleasesIcon sx={{ fontSize: 14 }} /> },
  changed: { label: 'Changed', color: '#ed6c02', icon: <BuildIcon sx={{ fontSize: 14 }} /> },
  fixed: { label: 'Fixed', color: '#d32f2f', icon: <BugReportIcon sx={{ fontSize: 14 }} /> },
  improved: { label: 'Improved', color: '#0288d1', icon: <AutoAwesomeIcon sx={{ fontSize: 14 }} /> },
};

const releases: Release[] = [
  {
    version: '1.3.0',
    date: '2026-02-12',
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
      { type: 'added', text: 'Player Streaks & Form — current streak, best streak, hot/cold/steady trend' },
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageContainer title="Changelog" subtitle="What's new in Commander Collector">
      <Stack spacing={3}>
        {releases.map((release, index) => (
          <Grow key={release.version} in={mounted} timeout={600 + index * 200}>
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
