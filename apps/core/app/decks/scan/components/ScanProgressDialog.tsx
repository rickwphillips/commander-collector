'use client';

import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import type { ScannedCard } from '@/lib/types';

const SCAN_QUIPS = [
  'Wibbling\u2026',
  'Concentrating\u2026',
  'Tapping out\u2026',
  'Consulting the oracle\u2026',
  'Shuffling through the library\u2026',
  'Reading the name bars\u2026',
  'Checking for proxies\u2026',
  'Cross-referencing Scryfall\u2026',
  'Identifying your commanders\u2026',
  'Counting the spells\u2026',
];

interface ScanProgressDialogProps {
  open: boolean;
  progress: { current: number; total: number } | null;
  newCards: ScannedCard[];
  previewUrl: string | null;
}

export function ScanProgressDialog({ open, progress, newCards, previewUrl }: ScanProgressDialogProps) {
  const quipIdx = progress
    ? Math.floor((progress.current / progress.total) * SCAN_QUIPS.length)
    : 0;
  const quip = SCAN_QUIPS[Math.min(quipIdx, SCAN_QUIPS.length - 1)];
  const hasResults = newCards.length > 0;

  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogContent>
        <Stack alignItems="center" spacing={1.5} py={1}>
          <Stack direction="row" alignItems="center" spacing={1.5} width="100%">
            <CircularProgress size={hasResults ? 20 : 40} sx={{ flexShrink: 0, transition: 'all 0.3s' }} />
            <Box flex={1}>
              <Typography variant={hasResults ? 'body2' : 'body1'}>
                {progress
                  ? `Tile ${progress.current} of ${progress.total} \u2014 ${quip}`
                  : 'Preparing image\u2026'}
              </Typography>
              {progress && (
                <LinearProgress
                  variant="determinate"
                  value={(progress.current / progress.total) * 100}
                  sx={{ mt: 0.5 }}
                />
              )}
            </Box>
          </Stack>
          {hasResults ? (
            <Box sx={{ width: '100%', maxHeight: 220, overflowY: 'auto' }}>
              {newCards.map((c) => (
                <Box key={c.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.25 }}>
                  {c.image_uri ? (
                    <Box component="img" src={c.image_uri} alt={c.card_name}
                      sx={{ width: 24, height: 34, borderRadius: 0.5, objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <Box sx={{ width: 24, height: 34, bgcolor: 'action.hover', borderRadius: 0.5, flexShrink: 0 }} />
                  )}
                  <Typography variant="caption" noWrap sx={{ flex: 1 }}>{c.card_name}</Typography>
                  {c.notFound && (
                    <Typography variant="caption" color="error" sx={{ flexShrink: 0 }}>?</Typography>
                  )}
                </Box>
              ))}
            </Box>
          ) : previewUrl && (
            <Box
              component="img"
              src={previewUrl}
              alt="Deck photo"
              sx={{ maxWidth: '100%', maxHeight: 180, borderRadius: 1, objectFit: 'contain' }}
            />
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
