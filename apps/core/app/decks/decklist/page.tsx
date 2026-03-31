'use client';

import { useEffect, useState, Suspense, useMemo } from 'react';
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
} from '@mui/material';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import EditIcon from '@mui/icons-material/Edit';
import { PageContainer } from '@/components/PageContainer';
import { DeckBreakdown } from '@/components/DeckBreakdown';
import { DeckFilters, EMPTY_FILTERS, TYPE_CATEGORIES, getTypeCategory, hasActiveFilters, matchesFilters } from '@/components/DeckFilters';
import type { DeckFilterState, TypeCategory } from '@/components/DeckFilters';
import { CardTooltip } from '@commander/shared/components/CardTooltip';
import { api } from '@/lib/api';
import type { DeckDetail, DeckCard } from '@/lib/types';

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
      <Card sx={{ cursor: isDfc ? 'pointer' : 'default', perspective: '600px' }}
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
      </Card>
    </Tooltip>
  );
}

function DecklistPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const deckId = Number(searchParams.get('id'));

  const [deck, setDeck] = useState<DeckDetail | null>(null);
  const [cards, setCards] = useState<DeckCard[]>([]);
  const [loading, setLoading] = useState(!!deckId);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [filters, setFilters] = useState<DeckFilterState>(EMPTY_FILTERS);

  // Detach to List
  const [detachOpen, setDetachOpen] = useState(false);
  const [detachName, setDetachName] = useState('');
  const [detaching, setDetaching] = useState(false);

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

  // Gallery: expand by quantity, then filter
  const galleryCards = useMemo(() =>
    cards.flatMap(c => Array.from({ length: c.quantity }, (_, i) => ({ ...c, _key: `${c.id}-${i}` } as DeckCard & { _key: string }))),
    [cards]
  );
  const cardsWithImages = useMemo(() => galleryCards.filter(c => c.image_uri), [galleryCards]);
  const cardsWithoutImages = useMemo(() => galleryCards.filter(c => !c.image_uri), [galleryCards]);

  const filteredGallery = useMemo(() => cardsWithImages.filter(c => matchesFilters(c, filters)), [cardsWithImages, filters]);
  const filteredBreakdown = useMemo(() => cards.filter(c => matchesFilters(c, filters)), [cards, filters]);

  const active = hasActiveFilters(filters);

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

  return (
    <PageContainer
      title={deck.name}
      subtitle={<>Commander: <CardTooltip name={deck.commander} style={{ borderBottom: '1px dotted currentColor' }}>{deck.commander}</CardTooltip></>}
      backHref={`/decks/detail?id=${deckId}`}
      backLabel="Back to Deck"
      actions={
        cards.length > 0 ? (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => router.push(`/decks/scan?edit=${deckId}`)}
            >
              Edit Cards
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CallSplitIcon />}
              onClick={() => { setDetachName(deck.name + ' List'); setDetachOpen(true); }}
            >
              Detach to List
            </Button>
          </Stack>
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

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Breakdown" />
        <Tab label={`Gallery (${cardsWithImages.length})`} />
      </Tabs>

      {/* Shared filter bar — persists across tabs */}
      <DeckFilters
        filters={filters}
        onChange={setFilters}
        cards={tab === 0 ? cards : cardsWithImages}
        resultCount={tab === 0 ? filteredBreakdown.length : filteredGallery.length}
        totalCount={tab === 0 ? cards.length : cardsWithImages.length}
      />

      {tab === 0 && (
        <DeckBreakdown cards={active ? filteredBreakdown : cards} showList />
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
              {cardsWithImages.map((card, i) => (
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
