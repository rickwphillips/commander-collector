'use client';

import { useState, useEffect } from 'react';
import {
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
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { api } from '@/lib/api';
import type { ScannedCard, CardPrint } from '@/lib/types';

interface VersionPickerDialogProps {
  card: ScannedCard | null;
  onClose: () => void;
  onSelect: (cardId: string, print: CardPrint) => void;
}

export function VersionPickerDialog({ card, onClose, onSelect }: VersionPickerDialogProps) {
  const [prints, setPrints] = useState<CardPrint[]>([]);
  const [loading, setLoading] = useState(false);
  // Track previous card to detect changes without setState-in-effect.
  const [prevCard, setPrevCard] = useState(card);

  // Render-time derived-state reset: when card changes, clear prints and mark loading.
  // This avoids calling setState inside a useEffect body (react-compiler rule).
  if (card !== prevCard) {
    setPrevCard(card);
    setPrints([]);
    setLoading(!!card);
  }

  // Fetch prints asynchronously; state updates happen only in async callbacks.
  useEffect(() => {
    if (!card) return;
    let cancelled = false;
    api.getCardPrints(card.card_name)
      .then(({ prints: data }) => { if (!cancelled) setPrints(data); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [card]);

  function handleSelect(print: CardPrint) {
    if (!card) return;
    if (print.image_uri) {
      api.getCardImage(print.scryfall_id, print.image_uri).catch(() => {});
    }
    onSelect(card.id, print);
    onClose();
  }

  return (
    <Dialog open={!!card} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Choose Version — {card?.card_name}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary" mt={1}>
              Loading printings...
            </Typography>
          </Stack>
        ) : prints.length === 0 ? (
          <Typography color="text.secondary" py={2}>
            No printings found.
          </Typography>
        ) : (
          <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
            {prints.map((print) => (
              <Grid key={print.scryfall_id} size={{ xs: 6, sm: 4, md: 3 }}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    outline: card?.scryfall_id === print.scryfall_id ? '2px solid' : undefined,
                    outlineColor: 'primary.main',
                    '&:hover': { outline: '2px solid', outlineColor: 'primary.light' },
                  }}
                  onClick={() => handleSelect(print)}
                >
                  {print.image_uri ? (
                    <CardMedia
                      component="img"
                      image={print.image_uri}
                      alt={print.name}
                      sx={{ aspectRatio: '488/680' }}
                    />
                  ) : (
                    <Box
                      sx={{
                        aspectRatio: '488/680',
                        bgcolor: 'action.hover',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        No image
                      </Typography>
                    </Box>
                  )}
                  <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                    <Typography variant="caption" noWrap display="block">
                      {print.set_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      #{print.collector_number} · {print.released_at.slice(0, 4)}
                      {print.image_cached && (
                        <Chip label="cached" size="small" color="success" sx={{ ml: 0.5, height: 14, fontSize: '0.55rem' }} />
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
