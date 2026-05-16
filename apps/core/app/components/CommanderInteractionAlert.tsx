'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertTitle, Box, Collapse, IconButton, Snackbar, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { api } from '../lib/api';

interface CommanderPair {
  a: string;
  b: string;
}

interface PatternHit {
  pair: CommanderPair;
  pattern_id: string;
  name: string;
  abstract?: string;
}

interface Props {
  /** Commander names, one per active seat. Duplicates and empty strings are ignored. */
  commanders: string[];
  /** Optional: dismissed state persists in this key so a refresh doesn't replay. */
  storageKey?: string;
}

/**
 * Looks up every commander pair against the verified pattern library when the
 * game starts. Surfaces matches in a dismissable Snackbar at the top of the
 * board. Quiet when no patterns match: never shows an empty popup.
 *
 * Contingency: if the MCP is unreachable (band:'unknown'), this stays silent.
 * No false alarms, no scary "MCP offline" messages: the user doesn't need to
 * know the brain is down for a hover-feature that wasn't critical anyway.
 */
export function CommanderInteractionAlert({ commanders, storageKey }: Props) {
  const [hits, setHits] = useState<PatternHit[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // De-dupe and filter empty.
    const names = Array.from(new Set(commanders.map((c) => c.trim()).filter(Boolean)));
    if (names.length < 2) return;

    // Skip if user already dismissed for this commander-set.
    const dismissKey = storageKey
      ? `${storageKey}:${names.slice().sort().join('|')}`
      : null;
    if (dismissKey && typeof window !== 'undefined' && sessionStorage.getItem(dismissKey)) {
      return;
    }

    let cancelled = false;
    const pairs: CommanderPair[] = [];
    for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
        pairs.push({ a: names[i], b: names[j] });
      }
    }

    (async () => {
      const found: PatternHit[] = [];
      for (const p of pairs) {
        try {
          const r = await api.lookupInteraction(p.a, p.b);
          if (r.band === 'certain' && r.data?.patterns?.length) {
            for (const pat of r.data.patterns) {
              found.push({ pair: p, pattern_id: pat.pattern_id, name: pat.name });
            }
          }
        } catch {
          // Silent on individual pair failure.
        }
      }
      if (cancelled) return;
      if (found.length > 0) {
        setHits(found);
        setOpen(true);
      }
    })();

    return () => { cancelled = true; };
  }, [commanders, storageKey]);

  const handleClose = () => {
    setOpen(false);
    if (storageKey && typeof window !== 'undefined') {
      const names = Array.from(new Set(commanders.map((c) => c.trim()).filter(Boolean)));
      sessionStorage.setItem(`${storageKey}:${names.slice().sort().join('|')}`, '1');
    }
  };

  if (hits.length === 0) return null;

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ top: 8, maxWidth: '90vw' }}
    >
      <Collapse in={open}>
        <Alert
          severity="info"
          sx={{ maxWidth: 540, boxShadow: 4 }}
          action={
            <IconButton size="small" onClick={handleClose} aria-label="dismiss">
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <AlertTitle>Verified commander interactions in this pod</AlertTitle>
          <Stack spacing={0.5}>
            {hits.map((h, i) => (
              <Box key={`${h.pattern_id}-${i}`}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {h.pair.a} + {h.pair.b}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', opacity: 0.85 }}>
                  {h.pattern_id.toUpperCase()}: {h.name}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Alert>
      </Collapse>
    </Snackbar>
  );
}
