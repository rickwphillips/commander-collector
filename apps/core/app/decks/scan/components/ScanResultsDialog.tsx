'use client';

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ScannedCard } from '@/lib/types';

interface ScanResultsDialogProps {
  results: ScannedCard[] | null;
  cropMap: Record<string, string>;
  onClose: () => void;
}

export function ScanResultsDialog({ results, cropMap, onClose }: ScanResultsDialogProps) {
  return (
    <Dialog open={!!results} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Scan Results
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {results && results.length === 0 ? (
          <Typography color="text.secondary">No new cards were identified.</Typography>
        ) : (
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {results?.length} card{results?.length !== 1 ? 's' : ''} added to your deck:
            </Typography>
            {results?.map((c) => (
              <Box key={c.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {c.notFound ? (
                  cropMap[c.id] ? (
                    <Box
                      component="img"
                      src={cropMap[c.id]}
                      alt={c.card_name}
                      sx={{ width: 36, height: 50, borderRadius: 0.5, objectFit: 'cover', flexShrink: 0, opacity: 0.85 }}
                    />
                  ) : (
                    <Box sx={{ width: 36, height: 50, bgcolor: 'action.hover', borderRadius: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CircularProgress size={16} />
                    </Box>
                  )
                ) : c.image_uri ? (
                  <Box component="img" src={c.image_uri} alt={c.card_name} sx={{ width: 36, height: 50, borderRadius: 0.5, objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <Box sx={{ width: 36, height: 50, bgcolor: 'action.hover', borderRadius: 0.5, flexShrink: 0 }} />
                )}
                <Box>
                  <Typography variant="body2">{c.card_name}</Typography>
                  {c.notFound && <Typography variant="caption" color="error">Not found on Scryfall</Typography>}
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}
