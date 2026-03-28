'use client';

import { useEffect, useState, Suspense } from 'react';
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
import { api } from '@/lib/api';
import type { DeckDetail, DeckCard } from '@/lib/types';

function DecklistPageInner() {
  const searchParams = useSearchParams();
  const deckId = Number(searchParams.get('id'));

  const [deck, setDeck] = useState<DeckDetail | null>(null);
  const [cards, setCards] = useState<DeckCard[]>([]);
  const [loading, setLoading] = useState(!!deckId);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState(0);

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
        <Stack alignItems="center" py={8}>
          <CircularProgress size={48} />
        </Stack>
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

  // Expand by quantity for gallery (show each copy)
  const galleryCards: DeckCard[] = cards.flatMap((c) =>
    Array.from({ length: c.quantity }, (_, i) => ({ ...c, _key: `${c.id}-${i}` } as DeckCard & { _key: string }))
  );
  const cardsWithImages = galleryCards.filter((c) => c.image_uri);
  const cardsWithoutImages = galleryCards.filter((c) => !c.image_uri);

  return (
    <PageContainer
      title={deck.name}
      subtitle={`Commander: ${deck.commander}`}
      backHref={`/decks/detail?id=${deckId}`}
      backLabel="Back to Deck"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Breakdown" />
        <Tab label={`Gallery (${cardsWithImages.length})`} />
      </Tabs>

      {tab === 0 && <DeckBreakdown cards={cards} showList />}

      {tab === 1 && (
        <>
          <Grid container spacing={1}>
            {cardsWithImages.map((card, i) => (
              <Grid key={`${card.card_name}-${i}`} size={{ xs: 4, sm: 3, md: 2 }}>
                <Tooltip
                  disableInteractive
                  placement="top"
                  title={
                    <Box
                      component="img"
                      src={card.image_uri!}
                      alt={card.card_name}
                      sx={{ width: 220, borderRadius: 1.5, display: 'block' }}
                    />
                  }
                  slotProps={{ tooltip: { sx: { bgcolor: 'transparent', p: 0, boxShadow: 8 } } }}
                >
                  <Card sx={{ cursor: 'default' }}>
                    <CardMedia
                      component="img"
                      image={card.image_uri!}
                      alt={card.card_name}
                      sx={{ aspectRatio: '488/680' }}
                    />
                  </Card>
                </Tooltip>
              </Grid>
            ))}
          </Grid>

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
