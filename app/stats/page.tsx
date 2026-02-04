'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Box,
  Grow,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StyleIcon from '@mui/icons-material/Style';
import PeopleIcon from '@mui/icons-material/People';
import { PageContainer } from '../components/PageContainer';
import { StatsCard } from '../components/StatsCard';
import { ColorIdentityChips } from '../components/ColorIdentityChips';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { api } from '../../lib/api';
import type { StatsResponse, HeadToHeadRecord } from '../../lib/types';

export default function StatsPage() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [headToHead, setHeadToHead] = useState<HeadToHeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    fetchStats();
    return () => clearTimeout(timer);
  }, []);

  const fetchStats = async () => {
    try {
      const [statsData, h2hData] = await Promise.all([
        api.getStats(),
        api.getHeadToHead(),
      ]);
      setStats(statsData);
      setHeadToHead(h2hData);
    } catch {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Statistics" subtitle="Win rates and analytics">
        <LoadingSpinner message="Loading statistics..." />
      </PageContainer>
    );
  }

  if (!stats || stats.overall.total_games === 0) {
    return (
      <PageContainer title="Statistics" subtitle="Win rates and analytics">
        <EmptyState
          title="No data yet"
          description="Log some games to start seeing statistics"
          actionLabel="Log a Game"
          actionHref="/games/new"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Statistics" subtitle="Win rates and analytics">
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Overall Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Total Games"
            value={stats.overall.total_games}
            color="#D2691E"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Players"
            value={stats.overall.total_players}
            icon={<PeopleIcon />}
            color="#8B4513"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Decks"
            value={stats.overall.total_decks}
            icon={<StyleIcon />}
            color="#DAA520"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Avg. Game Length"
            value={stats.overall.avg_game_length?.toFixed(1) || '-'}
            subtitle="turns"
            color="#CD853F"
          />
        </Grid>
      </Grid>

      {/* Top Players */}
      {stats.topPlayers.length > 0 && (
        <Grow in={mounted} timeout={800}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <EmojiEventsIcon color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Top Players
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  (min 3 games)
                </Typography>
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Player</TableCell>
                      <TableCell align="center">Games</TableCell>
                      <TableCell align="center">Wins</TableCell>
                      <TableCell align="right">Win Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.topPlayers.map((player, index) => (
                      <TableRow key={player.player_id}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {index === 0 && (
                              <EmojiEventsIcon sx={{ color: '#DAA520', fontSize: 20 }} />
                            )}
                            <Typography sx={{ fontWeight: index === 0 ? 600 : 400 }}>
                              {player.player_name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">{player.total_games}</TableCell>
                        <TableCell align="center">{player.wins}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" alignItems="center" spacing={1} justifyContent="flex-end">
                            <Box sx={{ width: 60 }}>
                              <LinearProgress
                                variant="determinate"
                                value={player.win_rate || 0}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: 'action.hover',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#DAA520',
                                  },
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ minWidth: 45 }}>
                              {player.win_rate?.toFixed(1)}%
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grow>
      )}

      {/* Top Decks */}
      {stats.topDecks.length > 0 && (
        <Grow in={mounted} timeout={1000}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <StyleIcon color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Top Decks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  (min 3 games)
                </Typography>
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Deck</TableCell>
                      <TableCell>Commander</TableCell>
                      <TableCell>Player</TableCell>
                      <TableCell align="center">Games</TableCell>
                      <TableCell align="right">Win Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.topDecks.map((deck, index) => (
                      <TableRow key={deck.deck_id}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <ColorIdentityChips colors={deck.colors} size="small" />
                            <Typography sx={{ fontWeight: index === 0 ? 600 : 400 }}>
                              {deck.deck_name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{deck.commander}</TableCell>
                        <TableCell>{deck.player_name}</TableCell>
                        <TableCell align="center">{deck.total_games}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" alignItems="center" spacing={1} justifyContent="flex-end">
                            <Box sx={{ width: 60 }}>
                              <LinearProgress
                                variant="determinate"
                                value={deck.win_rate || 0}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: 'action.hover',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#8B4513',
                                  },
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ minWidth: 45 }}>
                              {deck.win_rate?.toFixed(1)}%
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grow>
      )}

      {/* Top Commanders */}
      {stats.topCommanders.length > 0 && (
        <Grow in={mounted} timeout={1200}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Top Commanders
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Commander</TableCell>
                      <TableCell align="center">Decks Using</TableCell>
                      <TableCell align="center">Games</TableCell>
                      <TableCell align="center">Wins</TableCell>
                      <TableCell align="right">Win Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.topCommanders.map((commander) => (
                      <TableRow key={commander.commander}>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500 }}>
                            {commander.commander}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{commander.decks_using}</TableCell>
                        <TableCell align="center">{commander.total_games}</TableCell>
                        <TableCell align="center">{commander.wins}</TableCell>
                        <TableCell align="right">
                          {commander.win_rate?.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grow>
      )}

      {/* Head to Head */}
      {headToHead.length > 0 && (
        <Grow in={mounted} timeout={1400}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Head-to-Head Records
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Matchup</TableCell>
                      <TableCell align="center">Games</TableCell>
                      <TableCell align="center">Record</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {headToHead.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography>
                            {record.player1_name} vs {record.player2_name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{record.total_games}</TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Typography
                              sx={{
                                fontWeight:
                                  record.player1_wins > record.player2_wins ? 700 : 400,
                                color:
                                  record.player1_wins > record.player2_wins
                                    ? 'primary.main'
                                    : 'text.primary',
                              }}
                            >
                              {record.player1_wins}
                            </Typography>
                            <Typography color="text.secondary">-</Typography>
                            <Typography
                              sx={{
                                fontWeight:
                                  record.player2_wins > record.player1_wins ? 700 : 400,
                                color:
                                  record.player2_wins > record.player1_wins
                                    ? 'primary.main'
                                    : 'text.primary',
                              }}
                            >
                              {record.player2_wins}
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grow>
      )}
    </PageContainer>
  );
}
