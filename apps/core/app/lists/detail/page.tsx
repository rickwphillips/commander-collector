'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinkIcon from '@mui/icons-material/Link';
import { PageContainer } from '@/components/PageContainer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { api } from '@/lib/api';
import type { CardListDetail, DeckWithPlayer } from '@/lib/types';

function ListDetailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = Number(searchParams.get('id'));

  const [list, setList] = useState<CardListDetail | null>(null);
  const [decks, setDecks] = useState<DeckWithPlayer[]>([]);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<string | null>(null);

  // Attach to deck dialog
  const [attachOpen, setAttachOpen] = useState(false);
  const [selectedDeckId, setSelectedDeckId] = useState<number | ''>('');
  const [attaching, setAttaching] = useState(false);

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
      } catch {
        setError('Failed to load list');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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

  if (!id) {
    return (
      <PageContainer title="List Not Found">
        <Typography>No list ID provided.</Typography>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer title="Card List">
        <LoadingSpinner message="Loading list..." />
      </PageContainer>
    );
  }

  if (!list) {
    return (
      <PageContainer title="Not Found">
        <Alert severity="error">List not found.</Alert>
      </PageContainer>
    );
  }

  const commanders = list.cards.filter((c) => c.is_commander);
  const nonCommanders = list.cards.filter((c) => !c.is_commander);
  const totalCards = list.cards.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <PageContainer
      title={list.name}
      subtitle={list.description ?? `${totalCards} cards`}
      actions={
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.push('/lists')}>
            Lists
          </Button>
          <Button
            variant="contained"
            startIcon={<LinkIcon />}
            onClick={() => setAttachOpen(true)}
            disabled={list.cards.length === 0}
          >
            Attach to Deck
          </Button>
        </Stack>
      }
    >
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {list.cards.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">This list has no cards yet.</Typography>
        </Card>
      ) : (
        <>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip label={`${totalCards} cards`} variant="outlined" />
            <Chip label={`${list.cards.length} unique`} variant="outlined" />
          </Stack>

          <Grid container spacing={2}>
            {commanders.length > 0 && (
              <>
                <Grid size={12}>
                  <Typography variant="overline" color="text.secondary">Commander</Typography>
                  <Divider />
                </Grid>
                {commanders.map((card) => (
                  <Grid key={card.id ?? card.card_name} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                    <Tooltip
                      disableInteractive
                      placement="top"
                      title={
                        card.image_uri ? (
                          <Stack direction="row" spacing={0.5}>
                            <Box component="img" src={card.image_uri} alt={card.card_name}
                              sx={{ width: 220, borderRadius: 1.5, display: 'block' }} />
                            {card.back_image_uri && (
                              <Box component="img" src={card.back_image_uri} alt={`${card.card_name} (back)`}
                                sx={{ width: 220, borderRadius: 1.5, display: 'block' }} />
                            )}
                          </Stack>
                        ) : card.card_name
                      }
                      slotProps={{ tooltip: { sx: { bgcolor: 'transparent', p: 0, boxShadow: 8 } } }}
                    >
                      <Card>
                        {card.image_uri ? (
                          <CardMedia component="img" image={card.image_uri} alt={card.card_name} sx={{ aspectRatio: '488/680' }} />
                        ) : (
                          <Box sx={{ p: 1.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{card.card_name}</Typography>
                          </Box>
                        )}
                      </Card>
                    </Tooltip>
                  </Grid>
                ))}
              </>
            )}

            <Grid size={12}>
              <Typography variant="overline" color="text.secondary">Cards</Typography>
              <Divider />
            </Grid>
            {nonCommanders.map((card) => (
              <Grid key={`${card.id ?? card.card_name}-${card.card_name}`} size={{ xs: 6, sm: 4, md: 3, lg: 2 }}>
                <Tooltip
                  disableInteractive
                  placement="top"
                  title={
                    card.image_uri ? (
                      <Stack direction="row" spacing={0.5}>
                        <Box component="img" src={card.image_uri} alt={card.card_name}
                          sx={{ width: 220, borderRadius: 1.5, display: 'block' }} />
                        {card.back_image_uri && (
                          <Box component="img" src={card.back_image_uri} alt={`${card.card_name} (back)`}
                            sx={{ width: 220, borderRadius: 1.5, display: 'block' }} />
                        )}
                      </Stack>
                    ) : card.card_name
                  }
                  slotProps={{ tooltip: { sx: { bgcolor: 'transparent', p: 0, boxShadow: 8 } } }}
                >
                  <Card sx={{ position: 'relative' }}>
                    {card.image_uri ? (
                      <CardMedia component="img" image={card.image_uri} alt={card.card_name} sx={{ aspectRatio: '488/680' }} />
                    ) : (
                      <Box sx={{ p: 1.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>{card.card_name}</Typography>
                      </Box>
                    )}
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
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Attach to Deck Dialog */}
      <Dialog open={attachOpen} onClose={() => { setAttachOpen(false); setSelectedDeckId(''); }} maxWidth="xs" fullWidth>
        <DialogTitle>Attach to Deck</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This will replace the selected deck&apos;s current card list with the cards from <strong>{list.name}</strong>.
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Deck</InputLabel>
            <Select
              value={selectedDeckId}
              label="Deck"
              onChange={(e) => setSelectedDeckId(e.target.value as number)}
            >
              {decks.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name} <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>— {d.commander}</Typography>
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
    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
      <ListDetailInner />
    </Suspense>
  );
}
