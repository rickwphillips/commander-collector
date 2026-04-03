'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { PageContainer } from '@/components/PageContainer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ManaSymbol } from '@/components/ManaSymbol';
import { api } from '@/lib/api';
import { MTG_COLORS_WITH_C } from '@/lib/utils';
import type { Player } from '@/lib/types';

// ── Import parser ─────────────────────────────────────────────────────────────

interface ParsedCard {
  card_name: string;
  quantity: number;
  is_commander: boolean;
  is_proxy: boolean;
}

function parseImport(raw: string): { cards: ParsedCard[]; deckName: string | null } {
  const text = raw.trim();

  // TTS saved-object JSON
  try {
    const json = JSON.parse(text);
    const state   = json?.ObjectStates?.[0];
    const objects = state?.ContainedObjects;
    if (Array.isArray(objects)) {
      const counts = new Map<string, number>();
      for (const obj of objects) {
        const name = (obj?.Nickname as string | undefined)?.trim();
        if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
      }
      return {
        deckName: (state?.Nickname as string | undefined) || null,
        cards: Array.from(counts, ([card_name, quantity]) => ({
          card_name, quantity, is_commander: false, is_proxy: false,
        })),
      };
    }
  } catch { /* not JSON */ }

  // Text formats: TCGPlayer · Moxfield · Archidekt · Arena · MTGO · Tappedout
  const cards: ParsedCard[] = [];
  let inCommander = false;
  let inSideboard = false;

  for (const rawLine of text.split('\n')) {
    const line    = rawLine.trim();
    if (!line) continue;

    const stripped = line.replace(/^\/\/\s*/, '').trim().toLowerCase();

    // Section markers
    if (['sideboard', 'sb:'].includes(stripped))         { inSideboard = true;  inCommander = false; continue; }
    if (['deck', 'main', 'maindeck'].includes(stripped)) { inSideboard = false; inCommander = false; continue; }
    if (stripped === 'commander')                         { inCommander = true;  inSideboard = false; continue; }

    if (line.startsWith('//') || line.startsWith('#')) {
      if (stripped.includes('sideboard'))  { inSideboard = true;  inCommander = false; }
      else if (stripped.includes('commander')) { inCommander = true;  inSideboard = false; }
      else                                 { inCommander = false; }
      continue;
    }

    if (inSideboard) continue;

    // <qty>[x] <name> [optional set code / *tags*]
    const m = line.match(/^(\d+)[xX]?\s+(.+)$/);
    if (!m) continue;

    const qty         = parseInt(m[1], 10);
    let   name        = m[2].trim();
    const hasCmdrTag  = /\*CMDR\*/i.test(name);

    // Strip "(SET) 123", "[SET]", "*TAG*"
    name = name.replace(/\s+\([A-Za-z0-9-]{2,6}\)\s*\d*\s*$/, '').trim();
    name = name.replace(/\s+\[[^\]]+\]\s*$/,                   '').trim();
    name = name.replace(/(\s+\*\w+\*)+\s*$/gi,                 '').trim();

    if (!name || qty < 1) continue;

    cards.push({ card_name: name, quantity: qty, is_commander: inCommander || hasCmdrTag, is_proxy: false });
  }

  return { cards, deckName: null };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function NewDeckPage() {
  const router       = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [importText,   setImportText]   = useState('');
  const [parsedCards,  setParsedCards]  = useState<ParsedCard[]>([]);
  const [parseError,   setParseError]   = useState<string | null>(null);

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

  const applyImport = (raw: string) => {
    setImportText(raw);
    setParseError(null);
    if (!raw.trim()) { setParsedCards([]); return; }

    const { cards, deckName } = parseImport(raw);

    if (cards.length === 0) {
      setParseError('No cards recognized — check the format and try again.');
      setParsedCards([]);
      return;
    }

    setParsedCards(cards);

    // Auto-fill deck name from TTS JSON if field is empty
    if (!name.trim() && deckName) setName(deckName);

    // Auto-fill commander if field is empty and import flagged one
    const cmdr = cards.find((c) => c.is_commander);
    if (!commander.trim() && cmdr) setCommander(cmdr.card_name);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => applyImport((ev.target?.result as string) ?? '');
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => applyImport((ev.target?.result as string) ?? '');
    reader.readAsText(file);
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

  const totalCards       = parsedCards.reduce((s, c) => s + c.quantity, 0);
  const detectedCommander = parsedCards.find((c) => c.is_commander);

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
              <Typography variant="h6" sx={{ mb: 0.5 }}>Import Card List</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Optional — TCGPlayer, Moxfield, Archidekt, Arena, MTGO, Tappedout, or TTS JSON
              </Typography>

              <TextField
                label="Paste card list"
                multiline
                rows={10}
                fullWidth
                value={importText}
                onChange={(e) => applyImport(e.target.value)}
                placeholder={
                  '1 Sol Ring\n1 Command Tower\n4 Island\n\n' +
                  '// Commander\n1 Atraxa, Praetors\u2019 Voice\n\n' +
                  'Or paste a TTS JSON export\u2026'
                }
                slotProps={{ input: { sx: { fontFamily: 'monospace', fontSize: '0.85rem' } } }}
              />

              <Stack direction="row" alignItems="center" spacing={2} sx={{ my: 2 }}>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="caption" color="text.secondary">or</Typography>
                <Divider sx={{ flex: 1 }} />
              </Stack>

              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  '&:hover': { borderColor: 'primary.main' },
                }}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept=".txt,.json"
                  onChange={handleFileChange}
                />
                <FileUploadIcon sx={{ fontSize: 36, color: 'text.secondary', mb: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  Click or drag a <strong>.txt</strong> or <strong>.json</strong> file
                </Typography>
              </Box>

              {parseError && (
                <Alert severity="warning" sx={{ mt: 2 }} onClose={() => setParseError(null)}>
                  {parseError}
                </Alert>
              )}

              {parsedCards.length > 0 && (
                <Stack direction="row" sx={{ mt: 2, gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${totalCards} cards · ${parsedCards.length} unique`}
                    color="success"
                    size="small"
                  />
                  {detectedCommander && (
                    <Chip
                      label={`Commander: ${detectedCommander.card_name}`}
                      color="primary"
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Stack>
              )}
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
