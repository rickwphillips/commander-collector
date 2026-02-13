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
  Chip,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StyleIcon from '@mui/icons-material/Style';
import PeopleIcon from '@mui/icons-material/People';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import PaletteIcon from '@mui/icons-material/Palette';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { PageContainer } from '../components/PageContainer';
import { StatsCard } from '../components/StatsCard';
import { ColorIdentityChips } from '../components/ColorIdentityChips';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { api } from '../lib/api';
import type {
  StatsResponse,
  HeadToHeadResponse,
  AdvancedStatsResponse,
} from '../lib/types';

export default function StatsPage() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [headToHead, setHeadToHead] = useState<HeadToHeadResponse>({ twoPlayer: [], multiplayer: [] });
  const [advancedStats, setAdvancedStats] = useState<AdvancedStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    fetchStats();
    return () => clearTimeout(timer);
  }, []);

  const fetchStats = async () => {
    try {
      const [statsData, h2hData, advData] = await Promise.all([
        api.getStats(),
        api.getHeadToHead(),
        api.getAdvancedStats(),
      ]);
      setStats(statsData);
      setHeadToHead(h2hData);
      setAdvancedStats(advData);
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
            value={stats.overall.avg_game_length != null ? Number(stats.overall.avg_game_length).toFixed(1) : '-'}
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
                              {Number(player.win_rate).toFixed(1)}%
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
                              {Number(deck.win_rate).toFixed(1)}%
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
                          {Number(commander.win_rate).toFixed(1)}%
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

      {/* Head to Head - 1v1 */}
      {headToHead.twoPlayer.length > 0 && (
        <Grow in={mounted} timeout={1400}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Head-to-Head
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
                    {headToHead.twoPlayer.map((record, index) => (
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

      {/* Head to Head - Multiplayer */}
      {headToHead.multiplayer.length > 0 && (
        <Grow in={mounted} timeout={1600}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Multiplayer
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
                    {headToHead.multiplayer.map((record, index) => (
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

      {/* Two-Headed Giant */}
      {advancedStats && advancedStats.twoHgStats && advancedStats.twoHgStats.teamPairings.length > 0 && (
        <Grow in={mounted} timeout={1800}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <HandshakeIcon color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Two-Headed Giant
                </Typography>
              </Stack>

              {/* Team Pairings */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Team Records
              </Typography>
              <TableContainer sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Team</TableCell>
                      <TableCell align="center">Games</TableCell>
                      <TableCell align="center">Wins</TableCell>
                      <TableCell align="right">Win Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {advancedStats.twoHgStats.teamPairings.map((team, i) => (
                      <TableRow key={`${team.player1_id}-${team.player2_id}`}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            {i === 0 && (
                              <EmojiEventsIcon sx={{ color: '#DAA520', fontSize: 20 }} />
                            )}
                            <Typography sx={{ fontWeight: i === 0 ? 600 : 400 }}>
                              {team.player1_name} & {team.player2_name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">{team.total_games}</TableCell>
                        <TableCell align="center">{team.wins}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" alignItems="center" spacing={1} justifyContent="flex-end">
                            <Box sx={{ width: 60 }}>
                              <LinearProgress
                                variant="determinate"
                                value={Number(team.win_rate) || 0}
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
                              {Number(team.win_rate).toFixed(1)}%
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Individual 2HG Records */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Individual 2HG Records
              </Typography>
              <TableContainer sx={{ mb: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Player</TableCell>
                      <TableCell align="center">Games</TableCell>
                      <TableCell align="center">Wins</TableCell>
                      <TableCell align="right">Win Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {advancedStats.twoHgStats.players.map((p) => (
                      <TableRow key={p.player_id}>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500 }}>{p.player_name}</Typography>
                        </TableCell>
                        <TableCell align="center">{p.total_games}</TableCell>
                        <TableCell align="center">{p.wins}</TableCell>
                        <TableCell align="right">
                          {Number(p.win_rate).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Recent 2HG Games */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Recent 2HG Games
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Winning Team</TableCell>
                      <TableCell>Decks</TableCell>
                      <TableCell align="center">Turn</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {advancedStats.twoHgStats.recentGames.map((game) => (
                      <TableRow key={game.id}>
                        <TableCell>
                          <Typography variant="body2">
                            {new Date(game.played_at).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <EmojiEventsIcon sx={{ color: '#DAA520', fontSize: 16 }} />
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {game.winners}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {game.winning_decks}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {game.winning_turn && (
                            <Chip label={`T${game.winning_turn}`} size="small" variant="outlined" />
                          )}
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

      {/* === ADVANCED STATS === */}

      {/* Color Meta Analysis */}
      {advancedStats && advancedStats.colorMeta.length > 0 && (
        <Grow in={mounted} timeout={1800}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <PaletteIcon color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Color Meta Analysis
                </Typography>
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Colors</TableCell>
                      <TableCell align="center">Decks</TableCell>
                      <TableCell align="center">Games</TableCell>
                      <TableCell align="center">Wins</TableCell>
                      <TableCell align="right">Win Rate</TableCell>
                      <TableCell align="right">Avg Position</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {advancedStats.colorMeta.map((row) => (
                      <TableRow key={row.colors}>
                        <TableCell>
                          <ColorIdentityChips colors={row.colors} size="small" />
                        </TableCell>
                        <TableCell align="center">{row.deck_count}</TableCell>
                        <TableCell align="center">{row.total_games}</TableCell>
                        <TableCell align="center">{row.wins}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" alignItems="center" spacing={1} justifyContent="flex-end">
                            <Box sx={{ width: 60 }}>
                              <LinearProgress
                                variant="determinate"
                                value={Number(row.win_rate) || 0}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: 'action.hover',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#D2691E',
                                  },
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ minWidth: 45 }}>
                              {Number(row.win_rate).toFixed(1)}%
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          {Number(row.avg_finish_position).toFixed(2)}
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

      {/* Performance by Pod Size */}
      {advancedStats && advancedStats.gameSizeStats.length > 0 && (
        <Grow in={mounted} timeout={2000}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <GroupsIcon color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Performance by Pod Size
                </Typography>
              </Stack>

              {advancedStats.gameSizeStats.map((pod) => (
                <Box key={pod.pod_size} sx={{ mb: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                    <Chip
                      label={`${pod.pod_size}-Player`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({pod.total_games} games)
                    </Typography>
                  </Stack>

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Player</TableCell>
                          <TableCell align="center">Games</TableCell>
                          <TableCell align="center">Wins</TableCell>
                          <TableCell align="right">Win Rate</TableCell>
                          <TableCell align="right">Avg Position</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pod.entries.map((entry) => (
                          <TableRow key={entry.player_id}>
                            <TableCell>{entry.player_name}</TableCell>
                            <TableCell align="center">{entry.games_played}</TableCell>
                            <TableCell align="center">{entry.wins}</TableCell>
                            <TableCell align="right">
                              <Stack direction="row" alignItems="center" spacing={1} justifyContent="flex-end">
                                <Box sx={{ width: 50 }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={Number(entry.win_rate) || 0}
                                    sx={{
                                      height: 6,
                                      borderRadius: 3,
                                      backgroundColor: 'action.hover',
                                      '& .MuiLinearProgress-bar': {
                                        backgroundColor: '#CD853F',
                                      },
                                    }}
                                  />
                                </Box>
                                <Typography variant="body2" sx={{ minWidth: 40 }}>
                                  {Number(entry.win_rate).toFixed(1)}%
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell align="right">
                              {Number(entry.avg_finish_position).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grow>
      )}

      {/* Player Streaks & Form */}
      {advancedStats && advancedStats.playerStreaks.length > 0 && (
        <Grow in={mounted} timeout={2200}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Player Streaks & Form
                </Typography>
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Player</TableCell>
                      <TableCell align="center">Streak</TableCell>
                      <TableCell align="center">Best Streak</TableCell>
                      <TableCell align="center">Last 5</TableCell>
                      <TableCell align="right">Overall</TableCell>
                      <TableCell align="center">Trend</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {advancedStats.playerStreaks.map((p) => (
                      <TableRow key={p.player_id}>
                        <TableCell>
                          <Typography sx={{ fontWeight: 500 }}>{p.player_name}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${p.current_streak_type}${p.current_streak}`}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              backgroundColor: p.current_streak_type === 'W' ? '#2e7d32' : '#c62828',
                              color: '#fff',
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={<EmojiEventsIcon sx={{ fontSize: 16 }} />}
                            label={`W${p.longest_win_streak}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {p.last_5_wins}/{p.last_5_games}
                        </TableCell>
                        <TableCell align="right">
                          {Number(p.overall_win_rate).toFixed(1)}%
                        </TableCell>
                        <TableCell align="center">
                          {p.trend === 'hot' && (
                            <Chip
                              icon={<WhatshotIcon sx={{ fontSize: 16 }} />}
                              label="Hot"
                              size="small"
                              sx={{ backgroundColor: '#ff5722', color: '#fff' }}
                            />
                          )}
                          {p.trend === 'cold' && (
                            <Chip
                              icon={<AcUnitIcon sx={{ fontSize: 16 }} />}
                              label="Cold"
                              size="small"
                              sx={{ backgroundColor: '#1565c0', color: '#fff' }}
                            />
                          )}
                          {p.trend === 'steady' && (
                            <Chip label="Steady" size="small" variant="outlined" />
                          )}
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

      {/* Deck Streaks & Form */}
      {advancedStats && advancedStats.deckStreaks.length > 0 && (
        <Grow in={mounted} timeout={2400}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Deck Streaks & Form
                </Typography>
              </Stack>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Deck</TableCell>
                      <TableCell>Player</TableCell>
                      <TableCell align="center">Streak</TableCell>
                      <TableCell align="center">Best Streak</TableCell>
                      <TableCell align="center">Last 5</TableCell>
                      <TableCell align="right">Overall</TableCell>
                      <TableCell align="center">Trend</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {advancedStats.deckStreaks.map((d) => (
                      <TableRow key={d.deck_id}>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <ColorIdentityChips colors={d.colors} size="small" />
                            <Box>
                              <Typography sx={{ fontWeight: 500 }}>{d.deck_name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {d.commander}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>{d.player_name}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${d.current_streak_type}${d.current_streak}`}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              backgroundColor: d.current_streak_type === 'W' ? '#2e7d32' : '#c62828',
                              color: '#fff',
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={<EmojiEventsIcon sx={{ fontSize: 16 }} />}
                            label={`W${d.longest_win_streak}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {d.last_5_wins}/{d.last_5_games}
                        </TableCell>
                        <TableCell align="right">
                          {Number(d.overall_win_rate).toFixed(1)}%
                        </TableCell>
                        <TableCell align="center">
                          {d.trend === 'hot' && (
                            <Chip
                              icon={<WhatshotIcon sx={{ fontSize: 16 }} />}
                              label="Hot"
                              size="small"
                              sx={{ backgroundColor: '#ff5722', color: '#fff' }}
                            />
                          )}
                          {d.trend === 'cold' && (
                            <Chip
                              icon={<AcUnitIcon sx={{ fontSize: 16 }} />}
                              label="Cold"
                              size="small"
                              sx={{ backgroundColor: '#1565c0', color: '#fff' }}
                            />
                          )}
                          {d.trend === 'steady' && (
                            <Chip label="Steady" size="small" variant="outlined" />
                          )}
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
