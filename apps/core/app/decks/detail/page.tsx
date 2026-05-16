'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useRef } from 'react';
import {
  Autocomplete,
  Card,
  CardContent,
  CardActionArea,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Stack,
  Chip,
  Box,
  Grow,
  Alert,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Link from 'next/link';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { DeckActions } from '@/components/DeckActions';
import { PageContainer } from '@/components/PageContainer';
import { CoachChat, type CoachChatHandle } from '@/my-collection/CoachChat';
import { StatsCard } from '@/components/StatsCard';
import { ColorIdentityChips } from '@/components/ColorIdentityChips';
import { ManaSymbol } from '@/components/ManaSymbol';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { CardTooltip } from '@commander/shared/components/CardTooltip';
import { api } from '@/lib/api';
import { scryfallCommanderSearch, scryfallPartnerSearch, scryfallGetCard, getOracleText, type ScryfallSearchResult } from '@/lib/scryfall';
import { ManaCost } from '@/components/ManaCost';
import { getOrdinalSuffix, MTG_COLORS_WITH_C } from '@/lib/utils';
import type { DeckDetail as DeckDetailType, GameWithResults, DeckCard } from '@/lib/types';



export default function DeckDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const deckId = searchParams.get('id') ?? '';

  const [deck, setDeck] = useState<DeckDetailType | null>(null);
  const [games, setGames] = useState<GameWithResults[]>([]);
  const [deckCards, setDeckCards] = useState<DeckCard[]>([]);
  const [loading, setLoading] = useState(!!deckId);
  const [error, setError] = useState<string | null>(null);

  // Edit state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCommander, setEditCommander] = useState('');
  const [editCmdrOptions, setEditCmdrOptions] = useState<ScryfallSearchResult[]>([]);
  const [editHasPartner, setEditHasPartner] = useState(false);
  const [editPartner, setEditPartner] = useState('');
  const [editPartnerOptions, setEditPartnerOptions] = useState<ScryfallSearchResult[]>([]);
  const [editBgEligible, setEditBgEligible] = useState(false);
  const [editColors, setEditColors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const editCmdrDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editPartnerDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Delete state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // TTS export
  const [ttsBusy, setTtsBusy] = useState(false);

  // Discuss Deck coach
  const [coachOpen, setCoachOpen] = useState(false);
  const coachRef = useRef<CoachChatHandle>(null);

  const fetchData = useCallback(async () => {
    try {
      const [deckData, gamesData, cardsData] = await Promise.all([
        api.getDeck(deckId),
        api.getGames(),
        api.getDeckCards(deckId),
      ]);
      setDeckCards(cardsData);
      setDeck(deckData);
      coachRef.current?.setActiveDeck({
        deckId: deckData.id,
        deckName: deckData.name,
        cardCount: cardsData.length,
        commander: deckData.commander ?? '',
        colors: deckData.colors ?? '',
      });
      setEditName(deckData.name);
      setEditCommander(deckData.commander);
      setEditColors(deckData.colors ? deckData.colors.split('') : []);

      // Filter games where this deck participated
      const deckGames = gamesData.filter((game) => game.results?.some((r) => r.deck_id === deckId));
      setGames(deckGames);
    } catch {
      setError('Failed to load deck data');
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    if (deckId) {
      fetchData();
    }
  }, [deckId, fetchData]);

  const handleEdit = () => {
    setEditName(deck?.name || '');
    setEditCommander(deck?.commander || '');
    setEditCmdrOptions([]);
    setEditHasPartner(!!deck?.partner);
    setEditPartner(deck?.partner || '');
    setEditPartnerOptions([]);
    setEditBgEligible(false);
    setEditColors(deck?.colors ? deck.colors.split('') : []);
    setEditDialogOpen(true);
    // Check background eligibility for current commander
    if (deck?.commander) {
      scryfallGetCard(deck.commander).then((card) => {
        if (card) setEditBgEligible(getOracleText(card).includes('Choose a Background'));
      });
    }
  };

  const handleColorToggle = (color: string) => {
    const active = editColors.includes(color);
    if (color === 'C') {
      setEditColors(active ? [] : ['C']);
    } else {
      const current = editColors.filter((c) => c !== 'C');
      const next = active ? current.filter((c) => c !== color) : [...current, color];
      setEditColors(next);
    }
  };

  const handleSave = async () => {
    if (!editName.trim() || !editCommander.trim()) return;

    setSaving(true);
    try {
      const colorsString = MTG_COLORS_WITH_C.filter((c) => editColors.includes(c)).join('');
      const partnerValue = editHasPartner && editPartner.trim() ? editPartner.trim() : null;

      await api.updateDeck(deckId, {
        name: editName.trim(),
        commander: editCommander.trim(),
        partner: partnerValue,
        colors: colorsString || 'C',
      });
      setDeck({
        ...deck!,
        name: editName.trim(),
        commander: editCommander.trim(),
        partner: partnerValue,
        colors: colorsString || 'C',
      });
      setEditDialogOpen(false);
    } catch {
      setError('Failed to update deck');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteDeck(deckId);
      router.push('/decks');
    } catch {
      setError('Failed to delete deck');
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleExportTCGPlayer = () => {
    if (!deck || deckCards.length === 0) return;
    const lines = deckCards.map((c) => `${c.quantity} ${c.card_name}`);
    const content = lines.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.name.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportTTS = async () => {
    if (!deck || deckCards.length === 0 || ttsBusy) return;
    setTtsBusy(true);
    try {
      const ttsData = await api.exportTTS({ deckId });
      const blob = new Blob([JSON.stringify(ttsData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${deck.name.replace(/[^a-z0-9]/gi, '_')}_TTS.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'TTS export failed');
    } finally {
      setTtsBusy(false);
    }
  };

  if (!deckId) {
    return (
      <PageContainer title="Deck Not Found" backHref="/decks" backLabel="Back to Decks">
        <EmptyState title="No deck ID provided" description="Please select a deck from the list" />
      </PageContainer>
    );
  }

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
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        <EmptyState title="Deck not found" description="This deck doesn't exist" />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={deck.name}
      subtitle={
        <>
          <CardTooltip name={deck.commander} style={{ borderBottom: '1px dotted currentColor' }}>{deck.commander}</CardTooltip>
          {deck.partner && (
            <> + <CardTooltip name={deck.partner} style={{ borderBottom: '1px dotted currentColor' }}>{deck.partner}</CardTooltip></>
          )}
        </>
      }
      backHref="/decks"
      backLabel="Back to Decks"
      actions={
        <DeckActions
          onExport={handleExportTCGPlayer}
          onTTS={handleExportTTS}
          ttsBusy={ttsBusy}
          decklistHref={`/decks/decklist?id=${encodeURIComponent(deckId)}`}
          onEdit={handleEdit}
          onDelete={() => setDeleteDialogOpen(true)}
          onDiscuss={() => setCoachOpen(true)}
          hasCards={deckCards.length > 0}
        />
      }
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
                Created by <strong>{deck.player_name}</strong>
              </Typography>
            </Box>
            <ColorIdentityChips colors={deck.colors} size="large" />
          </Stack>
        </CardContent>
      </Card>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard title="Total Games" value={deck.total_games} color="#D2691E" />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatsCard title="Wins" value={deck.wins} icon={<EmojiEventsIcon />} color="#DAA520" />
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
            value={
              deck.avg_finish_position != null ? Number(deck.avg_finish_position).toFixed(2) : '-'
            }
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
              <Grow key={game.id} in timeout={600 + index * 100}>
                <Card>
                  <CardActionArea component={Link} href={`/games/detail?id=${game.id}`}>
                    <CardContent>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={1}
                      >
                        <Box>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {isWin && <EmojiEventsIcon sx={{ color: '#DAA520', fontSize: 20 }} />}
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {isWin
                                ? 'Victory!'
                                : `Finished ${deckResult?.finish_position}${getOrdinalSuffix(deckResult?.finish_position || 0)}`}
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
                            {new Date(game.played_at + 'T00:00:00').toLocaleDateString()}
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

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Deck</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Deck Name"
              fullWidth
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <Autocomplete<ScryfallSearchResult, false, false, true>
              freeSolo
              options={editCmdrOptions}
              inputValue={editCommander}
              onInputChange={(_, value) => {
                setEditCommander(value);
                if (editCmdrDebounce.current) clearTimeout(editCmdrDebounce.current);
                if (value.length < 2) { setEditCmdrOptions([]); return; }
                editCmdrDebounce.current = setTimeout(async () => {
                  setEditCmdrOptions((await scryfallCommanderSearch(value)).slice(0, 8));
                }, 300);
              }}
              onChange={async (_, value) => {
                const name = typeof value === 'string' ? value : value?.name;
                if (!name) return;
                setEditCommander(name);
                const card = await scryfallGetCard(name);
                if (card) {
                  const ci = card.color_identity ?? [];
                  setEditColors(ci.length > 0 ? ci : ['C']);
                  setEditBgEligible(getOracleText(card).includes('Choose a Background'));
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
                <TextField {...params} label="Commander" fullWidth />
              )}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={editHasPartner}
                  onChange={(e) => {
                    setEditHasPartner(e.target.checked);
                    if (!e.target.checked) { setEditPartner(''); setEditPartnerOptions([]); }
                  }}
                  size="small"
                />
              }
              label="Partner Commander?"
            />
            {editHasPartner && (
              <Autocomplete<ScryfallSearchResult, false, false, true>
                freeSolo
                options={editPartnerOptions}
                inputValue={editPartner}
                onInputChange={(_, value) => {
                  setEditPartner(value);
                  if (editPartnerDebounce.current) clearTimeout(editPartnerDebounce.current);
                  if (value.length < 2) { setEditPartnerOptions([]); return; }
                  editPartnerDebounce.current = setTimeout(async () => {
                    setEditPartnerOptions((await scryfallPartnerSearch(value, editBgEligible)).slice(0, 8));
                  }, 300);
                }}
                onChange={(_, value) => {
                  const name = typeof value === 'string' ? value : value?.name;
                  if (name) setEditPartner(name);
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
                  <TextField {...params} label="Partner Commander" fullWidth
                    placeholder={editBgEligible ? 'Search partners or backgrounds…' : 'Search partner commanders…'}
                  />
                )}
              />
            )}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Color Identity
              </Typography>
              <Stack direction="row" spacing={1}>
                {MTG_COLORS_WITH_C.map((c) => (
                  <ManaSymbol
                    key={c}
                    color={c}
                    size={32}
                    active={editColors.includes(c)}
                    dimmed
                    onClick={() => handleColorToggle(c)}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={() => {
              setEditDialogOpen(false);
              router.push(`/decks/scan?edit=${deckId}`);
            }}
          >
            Edit Cards
          </Button>
          <Stack direction="row" spacing={1}>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={!editName.trim() || !editCommander.trim() || saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Deck?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {deck.name}? This will also remove it from all game
            results.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <CoachChat
        ref={coachRef}
        notes={[]}
        open={coachOpen}
        onToggle={setCoachOpen}
      />
    </PageContainer>
  );
}

