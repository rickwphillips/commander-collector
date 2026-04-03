'use client';

import { useEffect, useState, Suspense, useMemo, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  Zoom,
} from '@mui/material';
import FlipIcon from '@mui/icons-material/SyncAlt';
import SaveIcon from '@mui/icons-material/Save';
import { DeckActions } from '@/components/DeckActions';
import { PageContainer } from '@/components/PageContainer';
import { DeckBreakdown } from '@/components/DeckBreakdown';
import { DeckFilters, EMPTY_FILTERS, TYPE_CATEGORIES, getTypeCategory, hasActiveFilters, matchesFilters, sortCards } from '@/components/DeckFilters';
import type { DeckFilterState, TypeCategory } from '@/components/DeckFilters';
import { CardGridEditor } from '@/components/CardGridEditor';
import type { EditableCard } from '@/components/CardGridEditor';
import { CardTooltip } from '@commander/shared/components/CardTooltip';
import { api } from '@/lib/api';
import type { DeckDetail, DeckCard } from '@/lib/types';

// ── Converter ─────────────────────────────────────────────────────────────────

function deckCardToEditable(c: DeckCard): EditableCard {
  return {
    _key:           `${c.id ?? 'new'}-${Math.random().toString(36).slice(2)}`,
    card_name:      c.card_name,
    scryfall_id:    c.scryfall_id,
    image_uri:      c.image_uri      ?? null,
    back_image_uri: c.back_image_uri ?? null,
    type_line:      c.type_line      ?? null,
    mana_cost:      c.mana_cost      ?? null,
    color_identity: c.color_identity ?? '',
    quantity:       c.quantity,
    is_commander:   !!c.is_commander,
    is_proxy:       !!c.is_proxy,
  };
}

// ── Gallery card (view mode) ──────────────────────────────────────────────────

function GalleryCard({ card }: { card: DeckCard }) {
  const [flipped, setFlipped] = useState(false);
  const isDfc = !!card.back_image_uri;
  return (
    <Tooltip
      disableInteractive
      placement="top"
      title={
        <Stack direction="row" spacing={0.5}>
          <Box component="img" src={card.image_uri!} alt={card.card_name}
            sx={{ width: 220, borderRadius: 1.5, display: 'block' }} />
          {card.back_image_uri && (
            <Box component="img" src={card.back_image_uri} alt={`${card.card_name} (back)`}
              sx={{ width: 220, borderRadius: 1.5, display: 'block' }} />
          )}
        </Stack>
      }
      slotProps={{ tooltip: { sx: { bgcolor: 'transparent', p: 0, boxShadow: 8 } } }}
    >
      <Card sx={{ cursor: isDfc ? 'pointer' : 'default', perspective: '600px', position: 'relative' }}
        onClick={isDfc ? () => setFlipped((f) => !f) : undefined}>
        <Box sx={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s ease',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          position: 'relative',
          aspectRatio: '488/680',
        }}>
          <CardMedia component="img" image={card.image_uri!} alt={card.card_name}
            sx={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' }} />
          {card.back_image_uri && (
            <CardMedia component="img" image={card.back_image_uri} alt={`${card.card_name} (back)`}
              sx={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} />
          )}
        </Box>
        {isDfc && (
          <Box
            onClick={(e) => { e.stopPropagation(); setFlipped((f) => !f); }}
            sx={{
              position: 'absolute', inset: 0, zIndex: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.2s',
              '&:hover': { opacity: 1 },
              cursor: 'pointer',
            }}
          >
            <Box sx={{
              bgcolor: 'rgba(0,0,0,0.45)', borderRadius: '50%',
              width: 44, height: 44,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FlipIcon sx={{ fontSize: 26, color: '#fff' }} />
            </Box>
          </Box>
        )}
      </Card>
    </Tooltip>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function DecklistPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const deckId = Number(searchParams.get('id'));

  const [deck, setDeck]     = useState<DeckDetail | null>(null);
  const [cards, setCards]   = useState<DeckCard[]>([]);
  const [loading, setLoading] = useState(!!deckId);
  const [error, setError]   = useState<string | null>(null);
  const [tab, setTab]       = useState(0);
  const [filters, setFilters] = useState<DeckFilterState>(EMPTY_FILTERS);

  // ── Edit state ─────────────────────────────────────────────────────────────
  const [editMode, setEditMode]     = useState(false);
  const [draftCards, setDraftCards] = useState<EditableCard[]>([]);
  const [saving, setSaving]         = useState(false);
  const [isDirty, setIsDirty]       = useState(false);
  const savedCardsRef               = useRef<EditableCard[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  // Detach to List
  const [detachOpen, setDetachOpen] = useState(false);
  const [detachName, setDetachName] = useState('');
  const [detaching, setDetaching]   = useState(false);

  // ── Load ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!deckId) return;
    (async () => {
      try {
        const [deckData, cardsData] = await Promise.all([
          api.getDeck(deckId),
          api.getDeckCards(deckId),
        ]);
        setDeck(deckData);
        setCards(cardsData);
      } catch {
        setError('Failed to load deck');
      } finally {
        setLoading(false);
      }
    })();
  }, [deckId]);

  // ── Edit mode ──────────────────────────────────────────────────────────────

  const handleEditStart = () => {
    const editable = cards.map(deckCardToEditable);
    savedCardsRef.current = editable;
    setDraftCards(editable);
    setIsDirty(false);
    setEditMode(true);
  };

  const handleEditCancel = () => {
    setIsDirty(false);
    setEditMode(false);
  };

  const handleDraftChange = (updated: EditableCard[]) => {
    setDraftCards(updated);
    setIsDirty(true);
  };

  const doSave = async (exitEdit: boolean) => {
    if (!deck) return;
    setSaving(true);
    try {
      await api.saveDeckCards(deckId, draftCards.map(c => ({
        card_name:    c.card_name,
        scryfall_id:  c.scryfall_id,
        quantity:     c.quantity,
        is_commander: c.is_commander,
        is_proxy:     c.is_proxy,
      })));
      const commanderCard = draftCards.find(c => c.is_commander);
      if (commanderCard && commanderCard.card_name !== deck.commander) {
        await api.updateDeck(deckId, { commander: commanderCard.card_name }).catch(() => {});
      }
      const [freshDeck, freshCards] = await Promise.all([
        api.getDeck(deckId),
        api.getDeckCards(deckId),
      ]);
      setDeck(freshDeck);
      setCards(freshCards);
      if (exitEdit) {
        setEditMode(false);
      } else {
        const editable = freshCards.map(deckCardToEditable);
        savedCardsRef.current = editable;
        setDraftCards(editable);
        setIsDirty(false);
      }
    } catch {
      setError('Failed to save deck cards');
    } finally {
      setSaving(false);
    }
  };

  const handleSave            = () => doSave(true);
  const handleSaveAndContinue = () => doSave(false);

  // ── Detach to list ─────────────────────────────────────────────────────────

  const handleDetach = async () => {
    if (!deck || !detachName.trim()) return;
    setDetaching(true);
    try {
      const res = await api.detachDeckToList(deck.id, detachName.trim());
      setCards([]);
      setDetachOpen(false);
      router.push(`/lists/detail?id=${res.list_id}`);
    } catch {
      setError('Failed to detach list');
      setDetaching(false);
    }
  };

  // ── Scryfall refresh ───────────────────────────────────────────────────────

  const handleRefreshViewCards = async () => {
    setRefreshing(true);
    try {
      const { results } = await api.bulkLookupCards(cards.map(c => c.card_name));
      const hit = new Map(results.filter(r => !r.error).map(r => [r.name.toLowerCase(), r]));
      await api.saveDeckCards(deckId, cards.map(c => ({
        card_name:    c.card_name,
        scryfall_id:  hit.get(c.card_name.toLowerCase())?.scryfall_id ?? c.scryfall_id,
        quantity:     c.quantity,
        is_commander: !!c.is_commander,
        is_proxy:     !!c.is_proxy,
      })));
      setCards(await api.getDeckCards(deckId));
    } catch {
      setError('Failed to refresh card data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefreshDraftCards = async () => {
    setRefreshing(true);
    try {
      const { results } = await api.bulkLookupCards(draftCards.map(c => c.card_name));
      const hit = new Map(results.filter(r => !r.error).map(r => [r.name.toLowerCase(), r]));
      setDraftCards(prev => prev.map(c => {
        const found = hit.get(c.card_name.toLowerCase());
        if (!found) return c;
        return { ...c, scryfall_id: found.scryfall_id, image_uri: found.image_uri, back_image_uri: found.back_image_uri ?? null, type_line: found.type_line, mana_cost: found.mana_cost, color_identity: found.color_identity, notFound: false };
      }));
      setIsDirty(true);
    } catch {
      setError('Failed to refresh card data');
    } finally {
      setRefreshing(false);
    }
  };

  // ── Exports ────────────────────────────────────────────────────────────────

  const [ttsBusy, setTtsBusy] = useState(false);

  const handleExportTCGPlayer = () => {
    if (!deck || cards.length === 0) return;
    const blob = new Blob([cards.map(c => `${c.quantity} ${c.card_name}`).join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.name.replace(/[^a-z0-9]/gi, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportTTS = async () => {
    if (!deck || cards.length === 0 || ttsBusy) return;
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

  // ── View mode derived data ─────────────────────────────────────────────────

  const commanderCard = useMemo(() => cards.find(c => c.is_commander), [cards]);

  const galleryCards = useMemo(() =>
    cards.flatMap(c => Array.from({ length: c.quantity }, (_, i) => ({ ...c, _key: `${c.id}-${i}` } as DeckCard & { _key: string }))),
    [cards]
  );
  const cardsWithImages    = useMemo(() => galleryCards.filter(c => c.image_uri), [galleryCards]);
  const cardsWithoutImages = useMemo(() => galleryCards.filter(c => !c.image_uri), [galleryCards]);
  const filteredGallery    = useMemo(() => sortCards(cardsWithImages.filter(c => matchesFilters(c, filters)), filters.sortOrder, filters.sortDirection), [cardsWithImages, filters]);
  const filteredBreakdown  = useMemo(() => sortCards(cards.filter(c => matchesFilters(c, filters)), filters.sortOrder, filters.sortDirection), [cards, filters]);
  const active             = hasActiveFilters(filters);

  // Gallery grouped by type (only when filters active)
  const galleryByType = useMemo(() => {
    if (!active) return null;
    const groups: Partial<Record<TypeCategory | 'Other', DeckCard[]>> = {};
    for (const card of filteredGallery) {
      const cat = getTypeCategory(card.type_line);
      if (!groups[cat]) groups[cat] = [];
      groups[cat]!.push(card);
    }
    const order: (TypeCategory | 'Other')[] = [...TYPE_CATEGORIES, 'Other'];
    return order.filter(t => groups[t]?.length).map(t => ({ type: t, cards: groups[t]! }));
  }, [filteredGallery, active]);

  // ── Guards ────────────────────────────────────────────────────────────────

  if (!deckId) {
    return (
      <PageContainer title="Decklist" backHref="/decks" backLabel="Back to Decks">
        <Typography>No deck ID provided.</Typography>
      </PageContainer>
    );
  }
  if (loading) {
    return (
      <PageContainer title="Decklist" backHref="/decks" backLabel="Back to Decks">
        <Stack alignItems="center" py={8}><CircularProgress size={48} /></Stack>
      </PageContainer>
    );
  }
  if (!deck) {
    return (
      <PageContainer title="Decklist" backHref="/decks" backLabel="Back to Decks">
        <Typography>Deck not found.</Typography>
      </PageContainer>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <PageContainer
      title={editMode ? `Editing: ${deck.name}` : deck.name}
      subtitle={editMode
        ? undefined
        : <>Commander: <CardTooltip name={deck.commander} style={{ borderBottom: '1px dotted currentColor' }}>{deck.commander}</CardTooltip></>
      }
      backHref={`/decks/detail?id=${deckId}`}
      backLabel="Back to Deck"
      actions={
        editMode ? (
          <DeckActions
            onCancel={handleEditCancel}
            onRefresh={handleRefreshDraftCards}
            onSaveAndContinue={handleSaveAndContinue}
            onSave={handleSave}
            saving={saving}
            refreshing={refreshing}
          />
        ) : cards.length > 0 ? (
          <DeckActions
            onExport={handleExportTCGPlayer}
            onTTS={handleExportTTS}
            ttsBusy={ttsBusy}
            onRefresh={handleRefreshViewCards}
            onEdit={handleEditStart}
            editLabel="Edit Cards"
            onDetach={() => { setDetachName(deck.name + ' List'); setDetachOpen(true); }}
            hasCards
            refreshing={refreshing}
          />
        ) : undefined
      }
    >
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Detach to List Dialog */}
      <Dialog open={detachOpen} onClose={() => setDetachOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Save as Standalone List</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            All cards will be removed from this deck and saved as a standalone list.
          </Typography>
          <TextField
            label="List Name"
            fullWidth
            size="small"
            autoFocus
            value={detachName}
            onChange={(e) => setDetachName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleDetach(); }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetachOpen(false)}>Cancel</Button>
          <Button variant="contained" disabled={!detachName.trim() || detaching} onClick={handleDetach}>
            Save &amp; Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Edit Mode ──────────────────────────────────────────────────────── */}
      {editMode ? (
        <>
          <CardGridEditor cards={draftCards} onChange={handleDraftChange} />
          <Zoom in={isDirty && !saving}>
            <Box sx={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 1100 }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleSaveAndContinue}
                disabled={saving}
                sx={{ borderRadius: 3, px: 3, boxShadow: 6 }}
              >
                Save
              </Button>
            </Box>
          </Zoom>
        </>
      ) : (
        /* ── View Mode ─────────────────────────────────────────────────────── */
        <>
          {/* Commander hero */}
          {commanderCard?.image_uri && (
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, mb: 3, alignItems: 'flex-start' }}>
              <Box sx={{ flexShrink: 0, width: { xs: 90, sm: 110, md: 130 } }}>
                <Box
                  component="img"
                  src={commanderCard.image_uri}
                  alt={commanderCard.card_name}
                  sx={{ width: '100%', borderRadius: 2, display: 'block', boxShadow: 4 }}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
                  {deck.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Commander:{' '}
                  <CardTooltip name={deck.commander} style={{ borderBottom: '1px dotted currentColor' }}>
                    {deck.commander}
                  </CardTooltip>
                </Typography>
              </Box>
            </Box>
          )}

          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="Breakdown" />
            <Tab label={`Gallery (${cardsWithImages.length})`} />
          </Tabs>

          {/* Shared filter bar */}
          <DeckFilters
            filters={filters}
            onChange={setFilters}
            cards={tab === 0 ? cards : cardsWithImages}
            resultCount={tab === 0 ? filteredBreakdown.length : filteredGallery.length}
            totalCount={tab === 0 ? cards.length : cardsWithImages.length}
          />

          {tab === 0 && (
            <DeckBreakdown cards={active ? filteredBreakdown : cards} showList sortOrder={filters.sortOrder} sortDirection={filters.sortDirection} />
          )}

          {tab === 1 && (
            <>
              {galleryByType ? (
                galleryByType.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                    No cards match the current filters.
                  </Typography>
                ) : (
                  <Stack spacing={3}>
                    {galleryByType.map(({ type, cards: group }) => (
                      <Box key={type}>
                        <Typography variant="subtitle2" color="text.secondary"
                          sx={{ mb: 1, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>
                          {type} ({group.length})
                        </Typography>
                        <Grid container spacing={1}>
                          {group.map((card, i) => (
                            <Grid key={`${card.card_name}-${i}`} size={{ xs: 4, sm: 3, md: 2 }}>
                              <GalleryCard card={card} />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    ))}
                  </Stack>
                )
              ) : (
                <Grid container spacing={1}>
                  {filteredGallery.map((card, i) => (
                    <Grid key={`${card.card_name}-${i}`} size={{ xs: 4, sm: 3, md: 2 }}>
                      <GalleryCard card={card} />
                    </Grid>
                  ))}
                </Grid>
              )}

              {cardsWithoutImages.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    No image available ({cardsWithoutImages.length})
                  </Typography>
                  <Stack spacing={0.5}>
                    {cardsWithoutImages.map((card, i) => (
                      <Typography key={`${card.card_name}-${i}`} variant="body2">
                        {card.quantity > 1 ? `${card.quantity}× ` : ''}
                        <CardTooltip name={card.card_name} style={{ borderBottom: '1px dotted currentColor' }}>
                          {card.card_name}
                        </CardTooltip>
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              )}
            </>
          )}
        </>
      )}
    </PageContainer>
  );
}

export default function DecklistPage() {
  return (
    <Suspense>
      <DecklistPageInner />
    </Suspense>
  );
}
