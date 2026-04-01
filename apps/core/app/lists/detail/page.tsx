'use client';

import { useEffect, useState, useMemo, useCallback, useTransition, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import LinkIcon from '@mui/icons-material/Link';
import SaveIcon from '@mui/icons-material/Save';
import { PageContainer } from '@/components/PageContainer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DeckBreakdown } from '@/components/DeckBreakdown';
import { DeckFilters, EMPTY_FILTERS, TYPE_CATEGORIES, getTypeCategory, sortCards, hasActiveFilters, matchesFilters } from '@/components/DeckFilters';
import type { DeckFilterState } from '@/components/DeckFilters';
import { CardGridEditor } from '@/components/CardGridEditor';
import type { EditableCard } from '@/components/CardGridEditor';
import { CardTooltip } from '@commander/shared/components/CardTooltip';
import { api } from '@/lib/api';
import type { CardListDetail, ListCard, DeckWithPlayer } from '@/lib/types';

// ── Converters ────────────────────────────────────────────────────────────────

function listCardToEditable(card: ListCard, idx: number): EditableCard {
  return {
    _key:           `${card.id ?? 'new'}-${idx}-${Math.random().toString(36).slice(2)}`,
    card_name:      card.card_name,
    scryfall_id:    card.scryfall_id,
    image_uri:      card.image_uri      ?? null,
    back_image_uri: card.back_image_uri ?? null,
    type_line:      card.type_line      ?? null,
    mana_cost:      card.mana_cost      ?? null,
    color_identity: card.color_identity ?? '',
    quantity:       card.quantity,
    is_commander:   !!card.is_commander,
    is_proxy:       !!card.is_proxy,
  };
}

// ── Gallery card (view mode, DFC flip) ───────────────────────────────────────

function GalleryCard({ card }: { card: ListCard & { _key?: string } }) {
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
      <Card
        sx={{ cursor: isDfc ? 'pointer' : 'default', perspective: '600px', position: 'relative' }}
        onClick={isDfc ? () => setFlipped(f => !f) : undefined}
      >
        <Box sx={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s ease',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          position: 'relative',
          aspectRatio: '488/680',
        }}>
          <CardMedia component="img" image={card.image_uri!} alt={card.card_name}
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backfaceVisibility: 'hidden' }} />
          {card.back_image_uri && (
            <CardMedia component="img" image={card.back_image_uri} alt={`${card.card_name} (back)`}
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} />
          )}
        </Box>
        {card.quantity > 1 && (
          <Box sx={{
            position: 'absolute', bottom: 4, right: 4,
            bgcolor: 'rgba(0,0,0,0.7)', color: 'white',
            borderRadius: '50%', width: 22, height: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700,
          }}>
            {card.quantity}
          </Box>
        )}
      </Card>
    </Tooltip>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

function ListDetailInner() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const id           = Number(searchParams.get('id'));

  const [list, setList]       = useState<CardListDetail | null>(null);
  const [decks, setDecks]     = useState<DeckWithPlayer[]>([]);
  const [loading, setLoading]   = useState(!!id);
  const [auditing, setAuditing] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [tab, setTab]                   = useState(0);
  const [filters, setFilters]           = useState<DeckFilterState>(EMPTY_FILTERS);
  const [filterPending, startFilterTransition] = useTransition();

  // ── Edit state ─────────────────────────────────────────────────────────────
  const [editMode, setEditMode]     = useState(false);
  const [draftName, setDraftName]   = useState('');
  const [draftDesc, setDraftDesc]   = useState('');
  const [draftCards, setDraftCards] = useState<EditableCard[]>([]);
  const [saving, setSaving]         = useState(false);

  // Attach to deck state
  const [attachOpen, setAttachOpen]         = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<number | ''>('');
  const [attaching, setAttaching]           = useState(false);

  // ── Load ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const [listData, decksData] = await Promise.all([
          api.getList(id),
          api.getDecks(),
        ]);
        setList(listData);
        setDecks(decksData as DeckWithPlayer[]);
        runAudit(listData);
      } catch {
        setError('Failed to load list');
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const runAudit = useCallback(async (listData: CardListDetail) => {
    if (!listData.cards.some(c => !c.image_uri)) return;
    setAuditing(true);
    try {
      const { updated } = await api.auditListImages(id);
      if (updated.length > 0) {
        const byId = new Map(updated.map(u => [u.id!, u]));
        setList(prev => prev ? {
          ...prev,
          cards: prev.cards.map(c => byId.has(c.id!) ? { ...c, ...byId.get(c.id!)! } : c),
        } : prev);
      }
    } catch {
      // Silent
    } finally {
      setAuditing(false);
    }
  }, [id]);

  // ── Edit mode ──────────────────────────────────────────────────────────────

  const handleEditStart = () => {
    if (!list) return;
    setDraftName(list.name);
    setDraftDesc(list.description ?? '');
    setDraftCards(list.cards.map(listCardToEditable));
    setEditMode(true);
  };

  const handleEditCancel = () => {
    setEditMode(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updateList(id, {
        name:        draftName.trim(),
        description: draftDesc.trim() || undefined,
        cards:       draftCards.map(c => ({
          card_name:    c.card_name,
          scryfall_id:  c.scryfall_id ?? undefined,
          quantity:     c.quantity,
          is_commander: c.is_commander,
          is_proxy:     c.is_proxy,
        })),
      });
      const fresh = await api.getList(id);
      setList(fresh);
      setEditMode(false);
      runAudit(fresh);
    } catch {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Attach to deck
  const handleAttach = async () => {
    if (!list || !selectedDeckId) return;
    setAttaching(true);
    try {
      await api.attachListToDeck(list.id, selectedDeckId as number);
      setAttachOpen(false);
      setSelectedDeckId('');
    } catch {
      setError('Failed to attach list to deck');
    } finally {
      setAttaching(false);
    }
  };

  // ── Derived display data ──────────────────────────────────────────────────

  const viewCards     = list?.cards ?? [];
  const totalCards    = (editMode ? draftCards : viewCards).reduce((s, c) => s + c.quantity, 0);
  const commanderCard = useMemo(() => viewCards.find(c => c.is_commander), [viewCards]);

  const galleryExpanded = useMemo(() =>
    viewCards.flatMap((c, ci) =>
      Array.from({ length: c.quantity }, (_, i) => ({ ...c, _key: `${ci}-${i}` }))
    ), [viewCards]);

  const cardsWithImages    = useMemo(() => galleryExpanded.filter(c => c.image_uri && !c.is_commander), [galleryExpanded]);
  const cardsWithoutImages = useMemo(() => galleryExpanded.filter(c => !c.image_uri), [galleryExpanded]);
  const filteredGallery    = useMemo(() => sortCards(cardsWithImages.filter(c => matchesFilters(c, filters)), filters.sortOrder, filters.sortDirection), [cardsWithImages, filters]);
  const filteredBreakdown  = useMemo(() => sortCards(viewCards.filter(c => matchesFilters(c, filters)), filters.sortOrder, filters.sortDirection), [viewCards, filters]);
  const active             = hasActiveFilters(filters);

  // Gallery always grouped by type
  const galleryByType = useMemo(() => {
    const source = filteredGallery;
    const groups: Partial<Record<string, typeof cardsWithImages>> = {};
    for (const card of source) {
      const cat = card.is_commander ? 'Commander' : getTypeCategory(card.type_line);
      if (!groups[cat]) groups[cat] = [];
      groups[cat]!.push(card);
    }
    const order = ['Commander', ...TYPE_CATEGORIES, 'Other'];
    return order.filter(t => groups[t]?.length).map(t => ({ type: t, cards: groups[t]! }));
  }, [filteredGallery, cardsWithImages, active]);

  // ── Guards ────────────────────────────────────────────────────────────────

  if (!id) {
    return (
      <PageContainer title="List Not Found">
        <Typography>No list ID provided.</Typography>
      </PageContainer>
    );
  }

  if (loading) {
    return <PageContainer title="Card List"><LoadingSpinner message="Loading list…" /></PageContainer>;
  }

  if (!list) {
    return <PageContainer title="Not Found"><Alert severity="error">List not found.</Alert></PageContainer>;
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <PageContainer
      title={editMode ? `Editing: ${list.name}` : list.name}
      subtitle={editMode ? undefined : (list.description ?? `${totalCards} cards`)}
      titleImage={!editMode ? (commanderCard?.image_uri ?? null) : null}
      backHref="/lists"
      backLabel="Lists"
      actions={
        editMode ? (
          <Stack direction="row" spacing={1}>
            <Button startIcon={<CancelIcon />} onClick={handleEditCancel} disabled={saving}>
              Cancel
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button startIcon={<EditIcon />} onClick={handleEditStart}>Edit</Button>
            <Button
              variant="contained"
              startIcon={<LinkIcon />}
              onClick={() => setAttachOpen(true)}
              disabled={list.cards.length === 0}
            >
              Attach to Deck
            </Button>
          </Stack>
        )
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>
      )}

      {auditing && (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <CircularProgress size={14} />
          <Typography variant="caption" color="text.secondary">Fetching card images…</Typography>
        </Stack>
      )}

      {/* ── Edit Mode ──────────────────────────────────────────────────────── */}
      {editMode ? (
        <>
          {/* Metadata */}
          <Card sx={{ mb: 3 }}>
            <Box sx={{ p: 2, pb: 1 }}>
              <TextField
                label="List name"
                size="small"
                value={draftName}
                onChange={e => setDraftName(e.target.value)}
                fullWidth
              />
            </Box>
            <Accordion disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, minHeight: 36, '& .MuiAccordionSummary-content': { my: 0.5 } }}>
                <Typography variant="caption" color="text.secondary">Description</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
                <TextField
                  size="small"
                  value={draftDesc}
                  onChange={e => setDraftDesc(e.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                />
              </AccordionDetails>
            </Accordion>
          </Card>

          <CardGridEditor cards={draftCards} onChange={setDraftCards} />
        </>
      ) : (
        /* ── View Mode ─────────────────────────────────────────────────────── */
        <>
          {list.cards.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                This list has no cards yet.
              </Typography>
              <Button variant="contained" startIcon={<EditIcon />} onClick={handleEditStart}>
                Add Cards
              </Button>
            </Card>
          ) : (
            <>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
                <Tab label="Breakdown" />
                <Tab label={`Gallery (${cardsWithImages.length})`} />
              </Tabs>

              <DeckFilters
                filters={filters}
                onChange={f => startFilterTransition(() => setFilters(f))}
                cards={tab === 0 ? viewCards : cardsWithImages}
                resultCount={tab === 0 ? filteredBreakdown.reduce((s, c) => s + c.quantity, 0) : filteredGallery.length}
                totalCount={tab === 0 ? viewCards.reduce((s, c) => s + c.quantity, 0) : cardsWithImages.length}
              />

              <Box sx={{ opacity: filterPending ? 0.5 : 1, transition: 'opacity 0.25s ease' }}>

              {tab === 0 && (
                <>
                  {active && (
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap alignItems="center" sx={{ mb: 1.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>Filters:</Typography>
                      {filters.nameFilter && (
                        <Chip size="small" label={`"${filters.nameFilter}"`} variant="filled" sx={{ height: 20, fontSize: '0.68rem' }} />
                      )}
                      {filters.typeFilter.map(t => (
                        <Chip key={t} size="small" label={t} color="primary" variant="filled" sx={{ height: 20, fontSize: '0.68rem' }} />
                      ))}
                      {filters.cmcFilter.map(n => (
                        <Chip key={n} size="small" label={`CMC ${n}`} color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.68rem' }} />
                      ))}
                      {filters.colorFilter.length > 0 && (
                        <Chip
                          size="small"
                          label={`${filters.colorFilter.join('')} (${filters.colorMode}${filters.useColorIdentity ? ' · identity' : ''})`}
                          variant="filled"
                          sx={{ height: 20, fontSize: '0.68rem' }}
                        />
                      )}
                      {filters.commanderOnly && <Chip size="small" label="Commander" color="secondary" variant="filled" sx={{ height: 20, fontSize: '0.68rem' }} />}
                      {filters.proxyOnly    && <Chip size="small" label="Proxy"     color="warning"   variant="filled" sx={{ height: 20, fontSize: '0.68rem' }} />}
                      {filters.dfcOnly      && <Chip size="small" label="DFC"       color="info"      variant="filled" sx={{ height: 20, fontSize: '0.68rem' }} />}
                    </Stack>
                  )}
                  <DeckBreakdown cards={filteredBreakdown} showList sortOrder={filters.sortOrder} sortDirection={filters.sortDirection} useColorIdentity={filters.useColorIdentity} />
                </>
              )}

              {tab === 1 && (
                <>
                  {galleryByType.length === 0 ? (
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

              </Box>{/* end filterPending transition wrapper */}
            </>
          )}
        </>
      )}

      {/* ── Attach to Deck Dialog ─────────────────────────────────────────── */}
      <Dialog
        open={attachOpen}
        onClose={() => { setAttachOpen(false); setSelectedDeckId(''); }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Attach to Deck</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This will replace the selected deck&apos;s current card list with the cards from{' '}
            <strong>{list.name}</strong>.
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Deck</InputLabel>
            <Select
              value={selectedDeckId}
              label="Deck"
              onChange={e => setSelectedDeckId(e.target.value as number)}
            >
              {decks.map(d => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name}
                  <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    — {d.commander}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setAttachOpen(false); setSelectedDeckId(''); }}>Cancel</Button>
          <Button variant="contained" disabled={!selectedDeckId || attaching} onClick={handleAttach}>
            Attach
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
}

export default function ListDetailPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading…" />}>
      <ListDetailInner />
    </Suspense>
  );
}
