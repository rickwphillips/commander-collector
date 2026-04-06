'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Autocomplete,
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
import { ManaSymbol } from '@/components/ManaSymbol';
import { CardListImport } from '@/components/CardListImport';
import { CardTooltip } from '@commander/shared/components/CardTooltip';
import { api } from '@/lib/api';
import { scryfallCommanderSearch, scryfallPartnerSearch, scryfallGetCard, getOracleText, getCardArtCrop, type ScryfallCard, type ScryfallSearchResult } from '@/lib/scryfall';
import { ManaCost } from '@/components/ManaCost';
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

  // Commander autocomplete
  const [cmdrOptions, setCmdrOptions] = useState<ScryfallSearchResult[]>([]);
  const cmdrDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Commander preview
  const [cmdrArt, setCmdrArt] = useState<string | null>(null);
  const [partnerArt, setPartnerArt] = useState<string | null>(null);
  const cardCache = useRef(new Map<string, ScryfallCard>());

  // Partner
  const [hasPartner,         setHasPartner]         = useState(false);
  const [partner,            setPartner]            = useState('');
  const [partnerOptions,     setPartnerOptions]     = useState<ScryfallSearchResult[]>([]);
  const [backgroundEligible, setBackgroundEligible] = useState(false);
  const partnerDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getCachedCard = async (name: string) => {
    if (cardCache.current.has(name)) return cardCache.current.get(name)!;
    const card = await scryfallGetCard(name);
    if (card) cardCache.current.set(name, card);
    return card;
  };

  const handleCommanderInput = (_: unknown, value: string) => {
    setCommander(value);
    const cached = cardCache.current.get(value);
    if (cached) {
      setCmdrArt(getCardArtCrop(cached));
    }
    if (cmdrDebounce.current) clearTimeout(cmdrDebounce.current);
    if (value.length < 2) { setCmdrOptions([]); return; }
    cmdrDebounce.current = setTimeout(async () => {
      setCmdrOptions((await scryfallCommanderSearch(value)).slice(0, 8));
    }, 300);
  };

  const handleCommanderSelect = async (_: unknown, value: string | null) => {
    if (typeof value !== 'string') return;
    setCommander(value);
    const card = await getCachedCard(value);
    if (card) {
      setCmdrArt(getCardArtCrop(card));
      const ci = card.color_identity ?? [];
      setColors(ci.length > 0 ? ci : ['C']);
      const hasBg = getOracleText(card).includes('Choose a Background');
      setBackgroundEligible(hasBg);
      if (!hasBg && backgroundEligible) {
        setPartner('');
        setPartnerOptions([]);
        setPartnerArt(null);
      }
    } else {
      setCmdrArt(null);
    }
  };

  const handlePartnerInput = (_: unknown, value: string) => {
    setPartner(value);
    // Restore art instantly from cache if exact match
    const cached = cardCache.current.get(value);
    if (cached) {
      setPartnerArt(getCardArtCrop(cached));
    }
    if (partnerDebounce.current) clearTimeout(partnerDebounce.current);
    if (value.length < 2) { setPartnerOptions([]); return; }
    partnerDebounce.current = setTimeout(async () => {
      setPartnerOptions((await scryfallPartnerSearch(value, backgroundEligible)).slice(0, 8));
    }, 300);
  };

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
    const cmdrs = cards.filter((c) => c.is_commander);
    if (!commander.trim() && cmdrs[0]) setCommander(cmdrs[0].card_name);
    if (cmdrs.length >= 2 && !partner.trim()) {
      setHasPartner(true);
      setPartner(cmdrs[1].card_name);
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
      const deck = await api.createDeck({
        player_id: playerId as number,
        name:      name.trim(),
        commander: commander.trim(),
        partner:   hasPartner && partner.trim() ? partner.trim() : null,
        colors:    colors.length > 0 ? colors.join('') : 'C',
      });

      if (parsedCards.length > 0) {
        const scryfallMap = new Map<string, string>();
        try {
          const { results } = await api.bulkLookupCards(parsedCards.map((c) => c.card_name));
          for (const card of results) {
            if (!card.error) scryfallMap.set(card.name.toLowerCase(), card.scryfall_id);
          }
        } catch { /* non-fatal */ }

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

                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ flex: 1 }}>
                    <Autocomplete<ScryfallSearchResult, false, false, true>
                      freeSolo
                      options={cmdrOptions}
                      inputValue={commander}
                      onInputChange={handleCommanderInput}
                      onChange={(_, value) => handleCommanderSelect(_, typeof value === 'string' ? value : value?.name ?? null)}
                      getOptionLabel={(opt) => typeof opt === 'string' ? opt : opt.name}
                      filterOptions={(x) => x}
                      renderOption={(props, opt) => (
                        <li {...props} key={opt.name}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <span>{opt.name}</span>
                            {opt.mana_cost && <ManaCost cost={opt.mana_cost} size={0.7} />}
                          </Box>
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Commander"
                          required
                          fullWidth
                          placeholder="e.g., Omnath, Locus of Creation"
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Autocomplete<ScryfallSearchResult, false, false, true>
                      freeSolo
                      disabled={!hasPartner}
                      options={partnerOptions}
                      inputValue={partner}
                      onInputChange={handlePartnerInput}
                      onChange={async (_, value) => {
                        const name = typeof value === 'string' ? value : value?.name;
                        if (!name) return;
                        setPartner(name);
                        const card = await getCachedCard(name);
                        if (card) {
                          setPartnerArt(getCardArtCrop(card));
                          if (card.color_identity?.length) {
                            setColors((prev) => {
                              const merged = [...new Set([...prev.filter(c => c !== 'C'), ...card.color_identity!])];
                              return merged.length > 0 ? merged : ['C'];
                            });
                          }
                        } else {
                          setPartnerArt(null);
                        }
                      }}
                      getOptionLabel={(opt) => typeof opt === 'string' ? opt : opt.name}
                      filterOptions={(x) => x}
                      renderOption={(props, opt) => (
                        <li {...props} key={opt.name}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <span>{opt.name}</span>
                            {opt.mana_cost && <ManaCost cost={opt.mana_cost} size={0.7} />}
                          </Box>
                        </li>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Partner Commander"
                          fullWidth
                          placeholder={backgroundEligible ? 'Search partners or backgrounds…' : 'Search partner commanders…'}
                        />
                      )}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={hasPartner}
                          onChange={(e) => {
                            setHasPartner(e.target.checked);
                            if (!e.target.checked) { setPartner(''); setPartnerOptions([]); setPartnerArt(null); }
                          }}
                          size="small"
                        />
                      }
                      label="Partner Commander?"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Stack>

                <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                  {(cmdrArt || partnerArt) && (
                    <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                      {cmdrArt && (
                        <CardTooltip name={commander} placement="right">
                          <Box
                            component="img"
                            src={cmdrArt}
                            alt={commander}
                            sx={{ width: 120, borderRadius: 2, boxShadow: 3 }}
                          />
                        </CardTooltip>
                      )}
                      {partnerArt && (
                        <CardTooltip name={partner} placement="right">
                          <Box
                            component="img"
                            src={partnerArt}
                            alt={partner}
                            sx={{ width: 120, borderRadius: 2, boxShadow: 3 }}
                          />
                        </CardTooltip>
                      )}
                    </Stack>
                  )}
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Color Identity
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {MTG_COLORS_WITH_C.map((color) => (
                        <ManaSymbol
                          key={color}
                          color={color}
                          size={22}
                          active={colors.includes(color)}
                          dimmed
                          onClick={cmdrArt ? undefined : () => handleColorClick(color)}
                        />
                      ))}
                    </Stack>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {colors.length === 0 ? 'Leave empty for colorless' : `Selected: ${colors.join('')}`}
                    </Typography>
                  </Box>
                </Stack>
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
