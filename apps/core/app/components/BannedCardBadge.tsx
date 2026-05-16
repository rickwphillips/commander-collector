'use client';

import { useEffect, useState } from 'react';
import { Chip, Tooltip } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import { api } from '../lib/api';

interface Props {
  name: string;
  format?: string;
}

interface NoteState {
  kind: 'banned' | 'trap' | 'staple' | 'situational' | 'requirement' | null;
  reason: string | null;
}

// Module-scope cache keyed on `name|format`. Survives component remounts.
// Failures (null kind, MCP unreachable) are cached so we don't re-hit the
// endpoint for every render of a non-banned card.
const cache = new Map<string, NoteState>();

/**
 * Inline badge rendered next to a card name. Shows ONLY when the card has
 * a banned card_note for the given format. Otherwise renders null.
 *
 * Visual: small red Chip with a Block icon. Tooltip carries the reason text.
 */
export function BannedCardBadge({ name, format = 'commander' }: Props) {
  const key = `${name.toLowerCase()}|${format}`;
  const [state, setState] = useState<NoteState | null>(() => cache.get(key) ?? null);

  useEffect(() => {
    if (cache.has(key)) {
      setState(cache.get(key) ?? null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const r = await api.getCardNote(name, format);
        const next: NoteState = r.band === 'certain' && r.data?.kind === 'banned'
          ? { kind: 'banned', reason: r.data.reason ?? 'Banned in this format' }
          : { kind: null, reason: null };
        if (!cancelled) {
          cache.set(key, next);
          setState(next);
        }
      } catch {
        if (!cancelled) {
          // Don't cache transient errors; let next render retry.
          setState({ kind: null, reason: null });
        }
      }
    })();
    return () => { cancelled = true; };
  }, [key, name, format]);

  if (state?.kind !== 'banned') return null;

  return (
    <Tooltip title={state.reason ?? 'Banned in this format'} placement="top" arrow>
      <Chip
        icon={<BlockIcon sx={{ fontSize: 12 }} />}
        label="Banned"
        size="small"
        color="error"
        variant="filled"
        sx={{ height: 18, '& .MuiChip-label': { px: 0.5, fontSize: '0.625rem' } }}
      />
    </Tooltip>
  );
}
