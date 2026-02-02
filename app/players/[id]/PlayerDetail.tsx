'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Typography,
  Stack,
  Chip,
  Box,
  Grow,
  Alert,
} from '@mui/material';
import Link from 'next/link';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StyleIcon from '@mui/icons-material/Style';
import { PageContainer } from '../../components/PageContainer';
import { StatsCard } from '../../components/StatsCard';
import { ColorIdentityChips } from '../../components/ColorIdentityChips';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { api } from '../../lib/api';
import type { Player, Deck, PlayerStats } from '../../lib/types';

interface DeckWithStats extends Deck {
  total_games: number;
  wins: number;
  player_name: string;
}

interface PlayerDetailProps {
  playerId: number;
}

export function PlayerDetail({ playerId }: PlayerDetailProps) {
  const [mounted, setMounted] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [decks, setDecks] = useState<DeckWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    fetchData();
    return () => clearTimeout(timer);
  }, [playerId]);

  const fetchData = async () => {
    try {
      const [playerData, statsData, decksData] = await Promise.all([
        api.getPlayer(playerId),
        api.getPlayerStats(playerId),
        api.getDecksByPlayer(playerId),
      ]);
      setPlayer(playerData);
      setStats(statsData);
      setDecks(decksData as DeckWithStats[]);
    } catch {
      setError('Failed to load player data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Player" backHref="/players" backLabel="Back to Players">
        <LoadingSpinner message="Loading player..." />
      </PageContainer>
    );
  }

  if (!player) {
    return (
      <PageContainer title="Player Not Found" backHref="/players" backLabel="Back to Players">
        <EmptyState title="Player not found" description="This player doesn't exist" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={player.name}
      backHref="/players"
      backLabel="Back to Players"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatsCard
              title="Total Games"
              value={stats.total_games}
              color="#D2691E"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatsCard
              title="Wins"
              value={stats.wins}
              icon={<EmojiEventsIcon />}
              color="#DAA520"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatsCard
              title="Win Rate"
              value={stats.win_rate ? `${stats.win_rate}%` : '-'}
              color="#8B4513"
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatsCard
              title="Avg. Finish"
              value={stats.avg_finish_position?.toFixed(2) || '-'}
              color="#CD853F"
            />
          </Grid>
        </Grid>
      )}

      {/* Decks */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Decks ({decks.length})
      </Typography>

      {decks.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={<StyleIcon />}
              title="No decks yet"
              description={`${player.name} hasn't added any decks yet`}
              actionLabel="Add Deck"
              actionHref="/decks/new"
            />
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {decks.map((deck, index) => (
            <Grid key={deck.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Grow in={mounted} timeout={600 + index * 100}>
                <Card>
                  <CardActionArea component={Link} href={`/decks/${deck.id}`}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {deck.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {deck.commander}
                          </Typography>
                        </Box>
                        <ColorIdentityChips colors={deck.colors} size="small" />
                      </Stack>

                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        {deck.wins > 0 && (
                          <Chip
                            icon={<EmojiEventsIcon />}
                            label={`${deck.wins} wins`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                        <Chip
                          label={`${deck.total_games} games`}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}
    </PageContainer>
  );
}
