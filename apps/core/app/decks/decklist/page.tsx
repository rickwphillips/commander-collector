'use client';

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Alert,
  Box,
  Card,
  CardMedia,
  CircularProgress,
  Grid,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import { PageContainer } from '@/components/PageContainer';
import { DeckBreakdown } from '@/components/DeckBreakdown';
import { DeckFilters, EMPTY_FILTERS, TYPE_CATEGORIES, getTypeCategory, hasActiveFilters, matchesFilters } from '@/components/DeckFilters';
import type { DeckFilterState, TypeCategory } from '@/components/DeckFilters';
import { api } from '@/lib/api';
import type { DeckDetail, DeckCard } from '@/lib/types';

function GalleryCard({ card }: { card: DeckCard }) {
  return (
    <Tooltip
      disableInteractive
      placement="top"
      title={
        <Box component="img" src={card.image_uri!} alt={card.card_name}
          sx={{ width: 220, borderRadius: 1.5, display: 'block' }} />
      }
      slotProps={{ tooltip: { sx: { bgcolor: 'transparent', p: 0, boxShadow: 8 } } }}
    >
      <Card sx={{ cursor: 'default' }}>
        <CardMedia component="img" image={card.image_uri!} alt={card.card_name}
          sx={{ aspectRatio: '488/680' }} />
      </Card>
    </Tooltip>
  );
}

function DecklistPageInner() {
  const searchParams = useSearchParams();
  const deckId = Number(searchParams.get('id'));

  const [deck, setDeck] = useState<DeckDetail | null>(null);
  const [cards, setCards] = useState<DeckCard[]>([]);
  const [loading, setLoading] = useState(!!deckId);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [filters, setFilters] = useState<DeckFilterState>(EMPTY_FILTERS);

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
      subtitle={`Commander: ${deck.commander}`}
      backHref={`/decks/detail?id=${deckId}`}
      backLabel="Back to Deck"
    >
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

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
                    {card.quantity > 1 ? `${card.quantity}× ` : ''}{card.card_name}
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
