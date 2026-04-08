'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { PageContainer } from '@/components/PageContainer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { CardLookupField } from '@/components/cards/CardLookupField';
import { api } from '@/lib/api';
import type { Card as CardData } from '@/lib/cards/types';
import type { Player } from '@/lib/types';
import type { CreateDeckInput } from '@/lib/types';

// ── Constants ──────────────────────────────────────────────────────────────────

const FORMATS = [
  'commander',
  'standard',
  'modern',
  'pioneer',
  'legacy',
  'vintage',
  'pauper',
] as const;

type Format = (typeof FORMATS)[number];

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Union two color_identity strings (WUBRG chars) into a sorted WUBRG string or 'C'. */
function unionColorIdentity(a: string, b?: string): string {
  const WUBRG = ['W', 'U', 'B', 'R', 'G'];
  const chars = new Set<string>(
    [...(a ?? ''), ...(b ?? '')].filter((c) => WUBRG.includes(c))
  );
  const result = WUBRG.filter((c) => chars.has(c)).join('');
  return result.length > 0 ? result : 'C';
}

// ── Component ──────────────────────────────────────────────────────────────────

// CreateDeckInput doesn't expose has_* or format yet; cast via extension.
type CreateDeckPayload = CreateDeckInput & {
  has_w: number;
  has_u: number;
  has_b: number;
  has_r: number;
  has_g: number;
  format: string;
};

export default function NewDeckPage() {
  const router = useRouter();

  const [players,    setPlayers]    = useState<Player[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  // Form fields
  const [playerId,   setPlayerId]   = useState<string>('');
  const [name,       setName]       = useState('');
  const [format,     setFormat]     = useState<Format>('commander');
  const [commander,  setCommander]  = useState<CardData | null>(null);
  const [hasPartner, setHasPartner] = useState(false);
  const [partner,    setPartner]    = useState<CardData | null>(null);

  useEffect(() => {
    api.getPlayers()
      .then((data) => {
        setPlayers(data);
        // No auto-select: let user choose explicitly.
      })
      .catch(() => setError('Failed to load players'))
      .finally(() => setLoading(false));
  }, []);

  // Auto-suggest deck name when commander is picked and name is still blank.
  useEffect(() => {
    if (commander && !name.trim()) {
      setName(`${commander.card_name} deck`);
    }
  }, [commander]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCommanderChange = (card: CardData | null) => {
    setCommander(card);
    // If no name set yet, auto-fill; if name was auto-filled from old commander, replace it.
    if (card) {
      setName((prev) => {
        if (!prev.trim() || (commander && prev === `${commander.card_name} deck`)) {
          return `${card.card_name} deck`;
        }
        return prev;
      });
    }
  };

  const handlePartnerToggle = (checked: boolean) => {
    setHasPartner(checked);
    if (!checked) setPartner(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!playerId) { setError('Please select a player'); return; }
    if (!name.trim()) { setError('Please enter a deck name'); return; }
    if (!commander) { setError('Please select a commander'); return; }

    setSubmitting(true);
    setError(null);

    try {
      const colors = unionColorIdentity(
        commander.color_identity,
        partner?.color_identity
      );
      const colorSet = new Set(colors === 'C' ? [] : [...colors]);

      const payload: CreateDeckPayload = {
        player_id: playerId,
        name:      name.trim(),
        commander: commander.card_name,
        partner:   hasPartner && partner ? partner.card_name : null,
        colors,
        has_w: colorSet.has('W') ? 1 : 0,
        has_u: colorSet.has('U') ? 1 : 0,
        has_b: colorSet.has('B') ? 1 : 0,
        has_r: colorSet.has('R') ? 1 : 0,
        has_g: colorSet.has('G') ? 1 : 0,
        format,
      };

      const deck = await api.createDeck(payload as CreateDeckInput);
      router.push(`/decks/decklist?id=${encodeURIComponent(deck.id)}`);
    } catch {
      setError('Failed to create deck');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading state ────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <PageContainer title="New Deck" backHref="/decks" backLabel="Back to Decks">
        <LoadingSpinner message="Loading..." />
      </PageContainer>
    );
  }

  // ── Empty players guard ──────────────────────────────────────────────────────

  if (players.length === 0) {
    return (
      <PageContainer title="New Deck" backHref="/decks" backLabel="Back to Decks">
        <Alert severity="info">
          No players found.{' '}
          <Typography
            component="a"
            href="/players"
            variant="body2"
            sx={{ color: 'primary.main' }}
          >
            Add a player first
          </Typography>{' '}
          before creating a deck.
        </Alert>
      </PageContainer>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────

  return (
    <PageContainer title="New Deck" backHref="/decks" backLabel="Back to Decks">
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
              <Stack spacing={3}>

                {/* Player */}
                <TextField
                  select
                  label="Player"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  required
                  fullWidth
                >
                  <MenuItem value="">Select a player</MenuItem>
                  {players.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Deck name */}
                <TextField
                  label="Deck Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                  placeholder="e.g., Omnath Lands"
                />

                {/* Commander */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Commander
                  </Typography>
                  <CardLookupField
                    label="Commander"
                    resultFilter={{ legendaryCreaturesOnly: true }}
                    singletonMode
                    placeholder="Search for a legendary permanent…"
                    onChange={handleCommanderChange}
                  />
                </Box>

                {/* Partner toggle + picker */}
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={hasPartner}
                        onChange={(e) => handlePartnerToggle(e.target.checked)}
                        size="small"
                      />
                    }
                    label="Add a partner / background"
                  />
                  {hasPartner && (
                    <Box sx={{ mt: 1 }}>
                      <CardLookupField
                        label="Partner"
                        resultFilter={{ partnerOnly: true }}
                        singletonMode
                        placeholder="Search for a partner or background…"
                        onChange={(card) => setPartner(card)}
                      />
                    </Box>
                  )}
                </Box>

                {/* Format */}
                <TextField
                  select
                  label="Format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as Format)}
                  fullWidth
                >
                  {FORMATS.map((f) => (
                    <MenuItem key={f} value={f}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>

              </Stack>
            </CardContent>
          </Card>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting || !playerId || !name.trim() || !commander}
          >
            {submitting ? 'Creating…' : 'Create Deck'}
          </Button>
        </Stack>
      </form>
    </PageContainer>
  );
}
