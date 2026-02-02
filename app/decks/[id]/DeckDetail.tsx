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
import { PageContainer } from '../../components/PageContainer';
import { StatsCard } from '../../components/StatsCard';
import { ColorIdentityChips } from '../../components/ColorIdentityChips';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { api } from '../../lib/api';
import type { DeckDetail as DeckDetailType, GameWithResults } from '../../lib/types';

interface DeckDetailProps {
  deckId: number;
}

export function DeckDetail({ deckId }: DeckDetailProps) {
  const [mounted, setMounted] = useState(false);
  const [deck, setDeck] = useState<DeckDetailType | null>(null);
  const [games, setGames] = useState<GameWithResults[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    fetchData();
    return () => clearTimeout(timer);
  }, [deckId]);

  const fetchData = async () => {
    try {
      const [deckData, gamesData] = await Promise.all([
        api.getDeck(deckId),
        api.getGames(),
      ]);
      setDeck(deckData);

      // Filter games where this deck participated
      const deckGames = gamesData.filter((game) =>
        game.results?.some((r) => r.deck_id === deckId)
      );
      setGames(deckGames);
    } catch {
      setError('Failed to load deck data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Deck" backHref="/decks" backLabel="Back to Decks">
        <LoadingSpinner message="Loading deck..." />
      </PageContainer>
    );
  }

  if (!deck) {
    return (
      <PageContainer title="Deck Not Found" backHref="/decks" backLabel="Back to Decks">
        <EmptyState title="Deck not found" description="This deck doesn't exist" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={deck.name}
      subtitle={deck.commander}
      backHref="/decks"
      backLabel="Back to Decks"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Deck Info */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body1" color="text.secondary">
                Piloted by <strong>{deck.player_name}</strong>
              </Typography>
            </Box>
            <ColorIdentityChips colors={deck.colors} size="large" />
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Total Games"
            value={deck.total_games}
            color="#D2691E"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Wins"
            value={deck.wins}
            icon={<EmojiEventsIcon />}
            color="#DAA520"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Win Rate"
            value={deck.win_rate ? `${deck.win_rate}%` : '-'}
            color="#8B4513"
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard
            title="Avg. Finish"
            value={deck.avg_finish_position?.toFixed(2) || '-'}
            color="#CD853F"
          />
        </Grid>
      </Grid>

      {/* Game History */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Game History
      </Typography>

      {games.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              title="No games yet"
              description="This deck hasn't been played yet"
              actionLabel="Log a Game"
              actionHref="/games/new"
            />
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {games.map((game, index) => {
            const deckResult = game.results?.find((r) => r.deck_id === deckId);
            const isWin = deckResult?.finish_position === 1;

            return (
              <Grow key={game.id} in={mounted} timeout={600 + index * 100}>
                <Card>
                  <CardActionArea component={Link} href={`/games/${game.id}`}>
                    <CardContent>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={1}
                      >
                        <Box>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {isWin && (
                              <EmojiEventsIcon sx={{ color: '#DAA520', fontSize: 20 }} />
                            )}
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {isWin ? 'Victory!' : `Finished ${deckResult?.finish_position}${getOrdinalSuffix(deckResult?.finish_position || 0)}`}
                            </Typography>
                          </Stack>
                          {deckResult?.eliminated_turn && (
                            <Typography variant="body2" color="text.secondary">
                              Eliminated turn {deckResult.eliminated_turn}
                            </Typography>
                          )}
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

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
