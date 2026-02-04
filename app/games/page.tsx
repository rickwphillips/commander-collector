'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Stack,
  Chip,
  Button,
  Box,
  Grow,
  Alert,
} from '@mui/material';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { PageContainer } from '../components/PageContainer';
import { ColorIdentityChips } from '../components/ColorIdentityChips';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { api } from '../lib/api';
import type { GameWithResults } from '../lib/types';

export default function GamesPage() {
  const [mounted, setMounted] = useState(false);
  const [games, setGames] = useState<GameWithResults[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    fetchGames();
    return () => clearTimeout(timer);
  }, []);

  const fetchGames = async () => {
    try {
      const data = await api.getGames();
      setGames(data);
    } catch {
      setError('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Games" subtitle="View your game history">
        <LoadingSpinner message="Loading games..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Games"
      subtitle="View your game history"
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/games/new"
        >
          Log Game
        </Button>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {games.length === 0 ? (
        <EmptyState
          title="No games recorded"
          description="Start logging your Commander games to track stats"
          actionLabel="Log Your First Game"
          actionHref="/games/new"
        />
      ) : (
        <Stack spacing={2}>
          {games.map((game, index) => {
            const winners = game.results?.filter((r) => r.finish_position === 1) || [];
            const winner = winners[0];
            const is2HG = game.game_type === '2hg';

            return (
              <Grow key={game.id} in={mounted} timeout={600 + index * 50}>
                <Card>
                  <CardActionArea component={Link} href={`/games/detail?id=${game.id}`}>
                    <CardContent>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={2}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <EmojiEventsIcon sx={{ color: '#DAA520', fontSize: 24 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {is2HG
                                ? winners.map((w) => w.player_name).join(' & ')
                                : winner?.player_name || 'Unknown'}
                            </Typography>
                            {!is2HG && winner && (
                              <ColorIdentityChips colors={winner.colors} size="small" />
                            )}
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            {is2HG
                              ? winners.map((w) => `${w.deck_name} (${w.commander})`).join(' & ')
                              : `${winner?.deck_name} (${winner?.commander})`}
                          </Typography>
                          {game.results && game.results.length > 1 && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              vs {game.results
                                .filter((r) => r.finish_position !== 1)
                                .map((r) => r.player_name)
                                .join(', ')}
                            </Typography>
                          )}
                        </Box>

                        <Stack direction="row" spacing={1} alignItems="center">
                          {is2HG && (
                            <Chip
                              label="2HG"
                              size="small"
                              variant="outlined"
                              color="secondary"
                            />
                          )}
                          <Chip
                            label={`${game.results?.length || 0} players`}
                            size="small"
                            variant="outlined"
                          />
                          {game.winning_turn && (
                            <Chip
                              label={`Turn ${game.winning_turn}`}
                              size="small"
                              variant="outlined"
                              color="primary"
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
              </Grow>
            );
          })}
        </Stack>
      )}
    </PageContainer>
  );
}
