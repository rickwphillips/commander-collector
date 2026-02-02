'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Fade,
  Grow,
  Chip,
  Stack,
  Alert,
} from '@mui/material';
import Link from 'next/link';
import PeopleIcon from '@mui/icons-material/People';
import StyleIcon from '@mui/icons-material/Style';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import BarChartIcon from '@mui/icons-material/BarChart';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { DarkModeToggle } from './components/DarkModeToggle';
import { StatsCard } from './components/StatsCard';
import { ColorIdentityChips } from './components/ColorIdentityChips';
import { LoadingSpinner } from './components/LoadingSpinner';
import { api } from './lib/api';
import type { StatsResponse, RecentGame } from './lib/types';
import styles from './page.module.scss';

const navItems = [
  {
    title: 'Players',
    description: 'Manage your playgroup',
    href: '/players',
    icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    color: '#D2691E',
  },
  {
    title: 'Decks',
    description: 'Track commanders and decks',
    href: '/decks',
    icon: <StyleIcon sx={{ fontSize: 40 }} />,
    color: '#8B4513',
  },
  {
    title: 'Games',
    description: 'View game history',
    href: '/games',
    icon: <SportsEsportsIcon sx={{ fontSize: 40 }} />,
    color: '#DAA520',
  },
  {
    title: 'Stats',
    description: 'Win rates and analytics',
    href: '/stats',
    icon: <BarChartIcon sx={{ fontSize: 40 }} />,
    color: '#CD853F',
  },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    fetchStats();
    return () => clearTimeout(timer);
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch {
      setError('Unable to load stats. Make sure the database is set up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DarkModeToggle />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Fade in={mounted} timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #FF8C00 0%, #DAA520 50%, #CD853F 100%)'
                    : 'linear-gradient(135deg, #D2691E 0%, #8B4513 50%, #DAA520 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              The Commander Collector
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Track your Magic: The Gathering Commander games
            </Typography>
          </Box>
        </Fade>

        {/* Quick Stats */}
        {!loading && stats && (
          <Fade in={mounted} timeout={1000}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 6, md: 3 }}>
                <StatsCard
                  title="Total Games"
                  value={stats.overall.total_games}
                  color="#D2691E"
                />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <StatsCard
                  title="Players"
                  value={stats.overall.total_players}
                  color="#8B4513"
                />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <StatsCard
                  title="Decks"
                  value={stats.overall.total_decks}
                  color="#DAA520"
                />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <StatsCard
                  title="Avg. Turns"
                  value={stats.overall.avg_game_length?.toFixed(1) || '-'}
                  color="#CD853F"
                />
              </Grid>
            </Grid>
          </Fade>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="info" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Quick Action */}
        <Fade in={mounted} timeout={1100}>
          <Card
            sx={{
              mb: 4,
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #FF8C0020 0%, #DAA52010 100%)'
                  : 'linear-gradient(135deg, #D2691E10 0%, #8B451308 100%)',
            }}
          >
            <CardActionArea component={Link} href="/games/new">
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <AddIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Log New Game
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Record the results of your latest Commander match
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Fade>

        {/* Navigation Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {navItems.map((item, index) => (
            <Grid key={item.title} size={{ xs: 6, md: 3 }}>
              <Grow in={mounted} timeout={800 + index * 150}>
                <Card className={styles.navCard}>
                  <CardActionArea
                    component={Link}
                    href={item.href}
                    sx={{ height: '100%' }}
                  >
                    <CardContent sx={{ textAlign: 'center', py: 3 }}>
                      <Box sx={{ color: item.color, mb: 2 }}>{item.icon}</Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* Recent Games */}
        {loading ? (
          <LoadingSpinner message="Loading recent games..." />
        ) : stats && stats.recentGames.length > 0 ? (
          <Fade in={mounted} timeout={1200}>
            <Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Recent Games
              </Typography>
              <Stack spacing={2}>
                {stats.recentGames.slice(0, 5).map((game: RecentGame) => (
                  <Card key={game.id}>
                    <CardActionArea component={Link} href={`/games/detail?id=${game.id}`}>
                      <CardContent>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          justifyContent="space-between"
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                          spacing={1}
                        >
                          <Box>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <EmojiEventsIcon
                                sx={{ color: '#DAA520', fontSize: 20 }}
                              />
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {game.winner}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {game.winning_deck} ({game.winning_commander})
                            </Typography>
                          </Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            {game.winning_turn && (
                              <Chip
                                label={`Turn ${game.winning_turn}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                            <Typography variant="body2" color="text.secondary">
                              {new Date(game.played_at).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Fade>
        ) : null}
      </Container>
    </>
  );
}
