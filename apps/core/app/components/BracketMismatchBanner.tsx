'use client';

import { Alert, AlertTitle } from '@mui/material';
import { useDeckBracket } from '../lib/useDeckBracket';

interface Props {
  /** One entry per active slot. Slots with no deckId are ignored. */
  slots: Array<{ deckId: string | null | undefined; commander?: string | null; playerName?: string }>;
  /** Spread threshold to warn at. Default 2 (Bracket 1 vs 3, etc.) */
  thresholdSpread?: number;
}

/**
 * Renders a non-blocking warning when bracket spread across slots is large.
 *
 * Reads each slot's bracket via useDeckBracket (cache hit if already fetched
 * by BracketChip). Slots that haven't resolved a bracket yet (no deck list,
 * MCP unreachable) are silently excluded from the spread calculation — we
 * never warn based on partial data.
 */
export function BracketMismatchBanner({ slots, thresholdSpread = 2 }: Props) {
  // Hooks must run in stable order, so we always call useDeckBracket for the
  // 4 possible slot positions (game manager supports 2-4 players).
  const b0 = useDeckBracket(slots[0]?.deckId, slots[0]?.commander);
  const b1 = useDeckBracket(slots[1]?.deckId, slots[1]?.commander);
  const b2 = useDeckBracket(slots[2]?.deckId, slots[2]?.commander);
  const b3 = useDeckBracket(slots[3]?.deckId, slots[3]?.commander);
  const all = [b0, b1, b2, b3];

  const resolved: Array<{ name: string; bracket: number }> = [];
  for (let i = 0; i < slots.length; i++) {
    const s = slots[i];
    const b = all[i];
    if (!s?.deckId || b.bracket === null) continue;
    resolved.push({ name: s.playerName ?? `Player ${i + 1}`, bracket: b.bracket });
  }

  if (resolved.length < 2) return null;
  const lo = Math.min(...resolved.map((r) => r.bracket));
  const hi = Math.max(...resolved.map((r) => r.bracket));
  if (hi - lo < thresholdSpread) return null;

  const sorted = [...resolved].sort((a, b) => a.bracket - b.bracket);
  const lowest = sorted[0];
  const highest = sorted[sorted.length - 1];

  return (
    <Alert severity="warning" sx={{ mb: 2 }}>
      <AlertTitle>Bracket spread is large</AlertTitle>
      {lowest.name} is Bracket {lowest.bracket} while {highest.name} is Bracket {highest.bracket}.
      Wizards rates {hi - lo}-bracket gaps as likely to feel one-sided. Consider rebalancing
      or running this anyway if your pod has agreed.
    </Alert>
  );
}
