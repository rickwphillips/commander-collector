'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  MenuItem,
  Alert,
  Typography,
  Box,
  IconButton,
  Grow,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { PageContainer } from '../../components/PageContainer';
import { ColorIdentityChips } from '../../components/ColorIdentityChips';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { api } from '../../../lib/api';
import type { DeckWithPlayer, GameResultInput } from '../../../lib/types';

interface DeckOption extends DeckWithPlayer {
  total_games?: number;
  wins?: number;
}

interface PlayerResult {
  deck_id: number | '';
  finish_position: number;
  eliminated_turn: number | '';
}

const defaultResults: PlayerResult[] = [
  { deck_id: '', finish_position: 1, eliminated_turn: '' },
  { deck_id: '', finish_position: 2, eliminated_turn: '' },
  { deck_id: '', finish_position: 3, eliminated_turn: '' },
  { deck_id: '', finish_position: 4, eliminated_turn: '' },
];

export default function NewGamePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [decks, setDecks] = useState<DeckOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [playedAt, setPlayedAt] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [winningTurn, setWinningTurn] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [results, setResults] = useState<PlayerResult[]>(defaultResults);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    fetchDecks();
    return () => clearTimeout(timer);
  }, []);

  const fetchDecks = async () => {
    try {
      const data = await api.getDecks();
      setDecks(data as DeckOption[]);
    } catch {
      setError('Failed to load decks. Make sure you have decks created first.');
    } finally {
      setLoading(false);
    }
  };

  const addPlayer = () => {
    if (results.length < 4) {
      setResults([
        ...results,
        { deck_id: '', finish_position: results.length + 1, eliminated_turn: '' },
      ]);
    }
  };

  const removePlayer = (index: number) => {
    if (results.length > 2) {
      const newResults = results.filter((_, i) => i !== index);
      // Re-assign finish positions
      setResults(
        newResults.map((r, i) => ({ ...r, finish_position: i + 1 }))
      );
    }
  };

  const updateResult = (
    index: number,
    field: keyof PlayerResult,
    value: number | string
  ) => {
    const newResults = [...results];
    if (field === 'deck_id') {
      newResults[index].deck_id = value as number | '';
    } else if (field === 'finish_position') {
      newResults[index].finish_position = value as number;
    } else if (field === 'eliminated_turn') {
      newResults[index].eliminated_turn = value as number | '';
    }
    setResults(newResults);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const validResults = results.filter((r) => r.deck_id !== '');
    if (validResults.length < 2) {
      setError('Please select at least 2 decks');
      return;
    }

    // Check for duplicate decks
    const deckIds = validResults.map((r) => r.deck_id);
    if (new Set(deckIds).size !== deckIds.length) {
      setError('Each deck can only be used once per game');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const gameResults: GameResultInput[] = validResults.map((r, index) => ({
        deck_id: r.deck_id as number,
        finish_position: index + 1, // Use order in list as finish position
        eliminated_turn: r.eliminated_turn === '' ? null : Number(r.eliminated_turn),
      }));

      await api.createGame({
        played_at: playedAt,
        winning_turn: winningTurn === '' ? null : Number(winningTurn),
        notes: notes.trim() || null,
        results: gameResults,
      });

      router.push('/games');
    } catch {
      setError('Failed to save game');
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedDeck = (deckId: number | '') => {
    if (deckId === '') return null;
    return decks.find((d) => d.id === deckId);
  };

  if (loading) {
    return (
      <PageContainer title="Log New Game" backHref="/games" backLabel="Back to Games">
        <LoadingSpinner message="Loading decks..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Log New Game"
      subtitle="Record the results of your Commander match"
      backHref="/games"
      backLabel="Back to Games"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {decks.length === 0 ? (
        <Card>
          <CardContent>
            <Alert severity="info">
              You need to create some decks before logging a game.{' '}
              <Button component="a" href="/decks/new" size="small">
                Add Deck
              </Button>
            </Alert>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Game Info */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Game Details
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <TextField
                    label="Date Played"
                    type="date"
                    value={playedAt}
                    onChange={(e) => setPlayedAt(e.target.value)}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="Winning Turn"
                    type="number"
                    value={winningTurn}
                    onChange={(e) =>
                      setWinningTurn(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    fullWidth
                    placeholder="e.g., 8"
                    inputProps={{ min: 1 }}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Players */}
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Players & Results
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Order from winner (1st) to last eliminated
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  {results.map((result, index) => {
                    const selectedDeck = getSelectedDeck(result.deck_id);
                    const isWinner = index === 0;

                    return (
                      <Grow key={index} in={mounted} timeout={600 + index * 100}>
                        <Card
                          variant="outlined"
                          sx={{
                            borderColor: isWinner ? 'primary.main' : 'divider',
                            borderWidth: isWinner ? 2 : 1,
                          }}
                        >
                          <CardContent>
                            <Stack spacing={2}>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  {isWinner && (
                                    <EmojiEventsIcon sx={{ color: '#DAA520' }} />
                                  )}
                                  <Typography
                                    variant="subtitle1"
                                    sx={{
                                      fontWeight: 600,
                                      color: isWinner ? 'primary.main' : 'text.primary',
                                    }}
                                  >
                                    {isWinner ? 'Winner' : `${index + 1}${getOrdinalSuffix(index + 1)} Place`}
                                  </Typography>
                                </Stack>
                                {results.length > 2 && (
                                  <IconButton
                                    onClick={() => removePlayer(index)}
                                    color="error"
                                    size="small"
                                  >
                                    <RemoveIcon />
                                  </IconButton>
                                )}
                              </Stack>

                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField
                                  select
                                  label="Deck"
                                  value={result.deck_id}
                                  onChange={(e) =>
                                    updateResult(index, 'deck_id', Number(e.target.value))
                                  }
                                  fullWidth
                                  required
                                >
                                  <MenuItem value="">Select a deck</MenuItem>
                                  {decks.map((deck) => (
                                    <MenuItem
                                      key={deck.id}
                                      value={deck.id}
                                      disabled={results.some(
                                        (r, i) => i !== index && r.deck_id === deck.id
                                      )}
                                    >
                                      <Stack direction="row" alignItems="center" spacing={1}>
                                        <span>
                                          {deck.name} ({deck.player_name}) - {deck.commander}
                                        </span>
                                      </Stack>
                                    </MenuItem>
                                  ))}
                                </TextField>

                                {!isWinner && (
                                  <TextField
                                    label="Eliminated Turn"
                                    type="number"
                                    value={result.eliminated_turn}
                                    onChange={(e) =>
                                      updateResult(
                                        index,
                                        'eliminated_turn',
                                        e.target.value === '' ? '' : Number(e.target.value)
                                      )
                                    }
                                    sx={{ minWidth: 150 }}
                                    inputProps={{ min: 1 }}
                                  />
                                )}
                              </Stack>

                              {selectedDeck && (
                                <Stack direction="row" alignItems="center" spacing={2}>
                                  <ColorIdentityChips colors={selectedDeck.colors} size="small" />
                                  <Typography variant="body2" color="text.secondary">
                                    {selectedDeck.commander}
                                  </Typography>
                                </Stack>
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grow>
                    );
                  })}
                </Stack>

                {results.length < 4 && (
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addPlayer}
                    sx={{ mt: 2 }}
                  >
                    Add Player
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Notes
                </Typography>
                <TextField
                  label="Game Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Notable plays, combos, memorable moments..."
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Game'}
            </Button>
          </Stack>
        </form>
      )}
    </PageContainer>
  );
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
