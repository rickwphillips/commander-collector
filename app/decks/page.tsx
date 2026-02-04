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
import type { DeckWithPlayer } from '../lib/types';

interface DeckWithStats extends DeckWithPlayer {
  total_games: number;
  wins: number;
  win_rate: number | null;
}

export default function DecksPage() {
  const [mounted, setMounted] = useState(false);
  const [decks, setDecks] = useState<DeckWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    fetchDecks();
    return () => clearTimeout(timer);
  }, []);

  const fetchDecks = async () => {
    try {
      const data = await api.getDecks();
      setDecks(data as DeckWithStats[]);
    } catch {
      setError('Failed to load decks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Decks" subtitle="Track your commanders and decks">
        <LoadingSpinner message="Loading decks..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Decks"
      subtitle="Track your commanders and decks"
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          href="/decks/new"
        >
          Add Deck
        </Button>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {decks.length === 0 ? (
        <EmptyState
          title="No decks yet"
          description="Add decks to start tracking your Commander games"
          actionLabel="Add Deck"
          actionHref="/decks/new"
        />
      ) : (
        <Grid container spacing={3}>
          {decks.map((deck, index) => (
            <Grid key={deck.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Grow in={mounted} timeout={600 + index * 100}>
                <Card>
                  <CardActionArea component={Link} href={`/decks/detail?id=${deck.id}`}>
                    <CardContent>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {deck.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {deck.commander}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Piloted by {deck.player_name}
                          </Typography>
                        </Box>
                        <ColorIdentityChips colors={deck.colors} size="medium" />
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
                        {deck.win_rate !== null && deck.total_games > 0 && (
                          <Chip
                            label={`${deck.win_rate}%`}
                            size="small"
                            variant="outlined"
                            color="secondary"
                          />
                        )}
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
