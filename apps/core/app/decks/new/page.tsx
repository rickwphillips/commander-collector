'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { PageContainer } from '@/components/PageContainer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ManaSymbol } from '@/components/ManaSymbol';
import { CardListImport } from '@/components/CardListImport';
import { api } from '@/lib/api';
import { MTG_COLORS_WITH_C } from '@/lib/utils';
import type { ParsedCard } from '@/lib/parseImport';
import type { Player } from '@/lib/types';

// ── Component ─────────────────────────────────────────────────────────────────

export default function NewDeckPage() {
  const router       = useRouter();

  const [players,    setPlayers]    = useState<Player[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  // Deck fields
  const [playerId,   setPlayerId]   = useState<number | ''>('');
  const [name,       setName]       = useState('');
  const [commander,  setCommander]  = useState('');
  const [colors,     setColors]     = useState<string[]>([]);

  // Import
  const [parsedCards,  setParsedCards]  = useState<ParsedCard[]>([]);

  useEffect(() => {
    api.getPlayers()
      .then(setPlayers)
      .catch(() => setError('Failed to load players'))
      .finally(() => setLoading(false));
  }, []);

  const handleColorClick = (color: string) => {
    const active = colors.includes(color);
    if (color === 'C') {
      setColors(active ? [] : ['C']);
    } else {
      const current = colors.filter((c) => c !== 'C');
      setColors(active ? current.filter((c) => c !== color) : [...current, color]);
    }
  };

  const handleImport = (cards: ParsedCard[], deckName: string | null) => {
    setParsedCards(cards);
    if (!name.trim() && deckName) setName(deckName);
    const cmdr = cards.find((c) => c.is_commander);
    if (!commander.trim() && cmdr) setCommander(cmdr.card_name);
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
      const deck = await api.createDeck({
        player_id: playerId as number,
        name:      name.trim(),
        commander: commander.trim(),
        colors:    colors.length > 0 ? colors.join('') : 'C',
      });

      if (parsedCards.length > 0) {
        // Attempt to resolve Scryfall data for all imported cards
        const scryfallMap = new Map<string, string>();
        try {
          const { results } = await api.bulkLookupCards(parsedCards.map((c) => c.card_name));
          for (const card of results) {
            if (!card.error) scryfallMap.set(card.name.toLowerCase(), card.scryfall_id);
          }
        } catch { /* non-fatal — save cards without scryfall_id */ }

        await api.saveDeckCards(
          deck.id,
          parsedCards.map((c) => ({
            card_name:    c.card_name,
            scryfall_id:  scryfallMap.get(c.card_name.toLowerCase()) ?? null,
            quantity:     c.quantity,
            is_commander: c.is_commander,
            is_proxy:     c.is_proxy,
          }))
        );
        router.push(`/decks/detail?id=${deck.id}`);
      } else {
        router.push('/decks');
      }
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

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>

          {/* ── Deck metadata ── */}
          <Card>
            <CardContent sx={{ p: 4 }}>
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
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {colors.length === 0 ? 'Leave empty for colorless' : `Selected: ${colors.join('')}`}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* ── Card list import ── */}
          <Card>
            <CardContent sx={{ p: 4 }}>
              <CardListImport onImport={handleImport} />
            </CardContent>
          </Card>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting}
          >
            {submitting ? 'Creating…' : parsedCards.length > 0 ? 'Create Deck & Import Cards' : 'Create Deck'}
          </Button>

        </Stack>
      </form>
    </PageContainer>
  );
}
