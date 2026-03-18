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
} from '@mui/material';
import { PageContainer } from '@/components/PageContainer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ManaSymbol } from '@/components/ManaSymbol';
import { api } from '@/lib/api';
import { MTG_COLORS_WITH_C } from '@/lib/utils';
import type { Player } from '@/lib/types';

export default function NewDeckPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [playerId, setPlayerId] = useState<number | ''>('');
  const [name, setName] = useState('');
  const [commander, setCommander] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const data = await api.getPlayers();
      setPlayers(data);
    } catch {
      setError('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handleColorClick = (color: string) => {
    const active = colors.includes(color);
    if (color === 'C') {
      setColors(active ? [] : ['C']);
    } else {
      const current = colors.filter((c) => c !== 'C');
      const next = active ? current.filter((c) => c !== color) : [...current, color];
      setColors(next);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!playerId || !name.trim() || !commander.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await api.createDeck({
        player_id: playerId as number,
        name: name.trim(),
        commander: commander.trim(),
        colors: colors.length > 0 ? colors.join('') : 'C',
      });
      router.push('/decks');
    } catch {
      setError('Failed to create deck');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer title="Add Deck" backHref="/decks" backLabel="Back to Decks">
        <LoadingSpinner message="Loading..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Add Deck" backHref="/decks" backLabel="Back to Decks">
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                select
                label="Player"
                value={playerId}
                onChange={(e) => setPlayerId(Number(e.target.value))}
                required
                fullWidth
              >
                <MenuItem value="">Select a player</MenuItem>
                {players.map((player) => (
                  <MenuItem key={player.id} value={player.id}>
                    {player.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Deck Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                placeholder="e.g., Landfall Aggro"
              />

              <TextField
                label="Commander"
                value={commander}
                onChange={(e) => setCommander(e.target.value)}
                required
                fullWidth
                placeholder="e.g., Omnath, Locus of Creation"
              />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Color Identity
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  {MTG_COLORS_WITH_C.map((color) => (
                    <ManaSymbol
                      key={color}
                      color={color}
                      size={32}
                      active={colors.includes(color)}
                      dimmed
                      onClick={() => handleColorClick(color)}
                    />
                  ))}
                </Stack>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  {colors.length === 0
                    ? 'Leave empty for colorless'
                    : `Selected: ${colors.join('')}`}
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                sx={{ mt: 2 }}
              >
                {submitting ? 'Creating...' : 'Create Deck'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
