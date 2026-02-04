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
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Tooltip,
} from '@mui/material';
import { PageContainer } from '../../components/PageContainer';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { api } from '../../lib/api';
import type { Player } from '../../lib/types';

const mtgColors = [
  { code: 'W', name: 'White', color: '#F8E7B9', textColor: '#333' },
  { code: 'U', name: 'Blue', color: '#0E68AB', textColor: '#FFF' },
  { code: 'B', name: 'Black', color: '#332B2E', textColor: '#FFF' },
  { code: 'R', name: 'Red', color: '#D3202A', textColor: '#FFF' },
  { code: 'G', name: 'Green', color: '#00733E', textColor: '#FFF' },
];

export default function NewDeckPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [playerId, setPlayerId] = useState<number | ''>('');
  const [name, setName] = useState('');
  const [commander, setCommander] = useState('');
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    fetchPlayers();
    return () => clearTimeout(timer);
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

  const handleColorsChange = (
    _event: React.MouseEvent<HTMLElement>,
    newColors: string[]
  ) => {
    setColors(newColors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
                <ToggleButtonGroup
                  value={colors}
                  onChange={handleColorsChange}
                  aria-label="color identity"
                >
                  {mtgColors.map((color) => (
                    <ToggleButton
                      key={color.code}
                      value={color.code}
                      aria-label={color.name}
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: colors.includes(color.code)
                          ? color.color
                          : 'transparent',
                        color: colors.includes(color.code)
                          ? color.textColor
                          : 'text.primary',
                        border: `2px solid ${color.color}`,
                        '&:hover': {
                          backgroundColor: color.color,
                          opacity: 0.8,
                        },
                        '&.Mui-selected': {
                          backgroundColor: color.color,
                          color: color.textColor,
                          '&:hover': {
                            backgroundColor: color.color,
                            opacity: 0.9,
                          },
                        },
                      }}
                    >
                      <Tooltip title={color.name}>
                        <span style={{ fontWeight: 700, fontSize: 18 }}>
                          {color.code}
                        </span>
                      </Tooltip>
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
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
