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
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestoreIcon from '@mui/icons-material/Restore';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { SettingsTab } from './components/SettingsTab';
import { StatsCard } from './components/StatsCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { RematchButton } from './components/RematchButton';
import { useThemeMode } from './components/ThemeProvider';
import { useAuth } from './components/AuthGuard';
import { api } from './lib/api';
import { navItems, resolveNavHref } from './page.types';
import { APP_VERSION } from './lib/version';
import type { StatsResponse, RecentGame, GameManagerState } from './lib/types';
import styles from './page.module.scss';

/**
 * The app's landing page: a snapshot of the playgroup plus the entry points into
 * every other section.
 *
 * Renders, top to bottom: the hero, four headline stats, a resume-or-start
 * quick action pair, the {@link navItems} tile grid, the five most recent games,
 * and the version chip linking to the changelog. Stats and the active-game probe
 * are fetched once on mount; a stats failure degrades to an info alert rather
 * than blocking the page, and an active-game failure is swallowed so the tile
 * simply offers a new game.
 *
 * All animations are gated on `mounted` (set on a zero-delay timer) so the MUI
 * transitions actually run on first paint instead of starting mid-flight.
 */
export default function Dashboard() {
  const { user } = useAuth();
  const { mode } = useThemeMode();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<GameManagerState | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    fetchStats();
    fetchActiveGame();
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

  const fetchActiveGame = async () => {
    try {
      const data = await api.getActiveGame();
      if (data.is_active && data.state) setActiveGame(data.state);
    } catch {
      // silently ignore — just show Play New Game
    }
  };

  return (
    <>
      <SettingsTab />
      <Container maxWidth="lg" className={styles.container} data-theme={mode}>
        {/* Hero Section */}
        <Fade in={mounted} timeout={800}>
          <Box className={styles.hero}>
            <Typography variant="h2" className={styles.heroTitle}>
              The Commander Collector
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Track your Magic: The Gathering Commander games
            </Typography>
            <Box className={styles.heroActions}>
              <RematchButton size="large" />
            </Box>
          </Box>
        </Fade>

        {/* Quick Stats */}
        {!loading && stats && (
          <Fade in={mounted} timeout={1000}>
            <Grid container spacing={3} className={styles.statsGrid}>
              <Grid size={{ xs: 6, md: 3 }}>
                <StatsCard title="Total Games" value={stats.overall.total_games} color="#D2691E" href="/games" />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <StatsCard title="Players" value={stats.overall.total_players} color="#8B4513" href="/players" />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <StatsCard title="Decks" value={stats.overall.total_decks} color="#DAA520" href="/decks" />
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <StatsCard
                  title="Avg. Turns"
                  value={
                    stats.overall.avg_game_length != null
                      ? Number(stats.overall.avg_game_length).toFixed(1)
                      : '-'
                  }
                  color="#CD853F"
                  href="/stats"
                />
              </Grid>
            </Grid>
          </Fade>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="info" className={styles.alert}>
            {error}
          </Alert>
        )}

        {/* Quick Actions */}
        <Fade in={mounted} timeout={1100}>
          <Grid container spacing={2} className={styles.quickActions}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                className={`${styles.quickActionCard} ${
                  activeGame ? styles.quickActionCardResume : styles.quickActionCardNew
                }`}
              >
                <CardActionArea component={Link} href="/game-manager" className={styles.cardAction}>
                  <CardContent className={styles.quickActionBody}>
                    {activeGame ? (
                      <>
                        <RestoreIcon color="success" className={styles.quickActionIcon} />
                        <Typography variant="h5" className={styles.quickActionTitle}>
                          Resume Game
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className={styles.resumeMeta}>
                          Turn {activeGame.turnNumber} · {activeGame.players.length} players
                        </Typography>
                        <Typography variant="caption" color="text.secondary" className={styles.resumeCommanders}>
                          {activeGame.players.map(p => p.commander?.name ?? p.playerName).join(' · ')}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <PlayArrowIcon color="success" className={styles.quickActionIcon} />
                        <Typography variant="h5" className={styles.quickActionTitle}>
                          Play New Game
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Launch the live game board and track a match in real time
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card className={styles.quickActionCard}>
                <CardActionArea component={Link} href="/games/new" className={styles.cardAction}>
                  <CardContent className={styles.quickActionBody}>
                    <AddIcon color="primary" className={styles.quickActionIcon} />
                    <Typography variant="h5" className={styles.quickActionTitle}>
                      Log New Game
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Record the results of a completed Commander match
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          </Grid>
        </Fade>

        {/* Navigation Cards */}
        <Grid container spacing={3} className={styles.navGrid}>
          {navItems.map((item, index) => (
            <Grid key={item.title} size={{ xs: 6, md: 3 }}>
              <Grow in={mounted} timeout={800 + index * 150}>
                <Card className={styles.navCard}>
                  <CardActionArea
                    component={item.external ? 'a' : Link}
                    href={resolveNavHref(item)}
                    className={styles.cardAction}
                  >
                    <CardContent className={styles.navCardBody}>
                      <Box className={`${styles.navIcon} ${styles[`navIcon-${item.slug}`]}`}>
                        <item.icon />
                      </Box>
                      <Typography variant="h6" className={styles.navTitle}>
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
              <Typography variant="h5" className={styles.sectionTitle}>
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
                              <EmojiEventsIcon className={styles.trophyIcon} />
                              <Typography variant="subtitle1" className={styles.winnerName}>
                                {game.winner}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {game.winning_deck} ({game.winning_commander})
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {game.winning_turn && (
                              <Chip
                                label={`Turn ${game.winning_turn}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                            <Typography variant="body2" color="text.secondary">
                              {new Date(game.played_at + 'T00:00:00').toLocaleDateString()}
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

        {/* Version Footer */}
        <Fade in={mounted} timeout={1400}>
          <Box className={styles.footer}>
            <Chip
              component={Link}
              href="/changelog"
              label={`v${APP_VERSION}`}
              size="small"
              clickable
              variant="outlined"
              className={styles.versionChip}
            />
          </Box>
        </Fade>
      </Container>
    </>
  );
}
