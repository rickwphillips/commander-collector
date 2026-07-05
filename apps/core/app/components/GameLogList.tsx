'use client';

import { Box, Typography } from '@mui/material';
import type { GameLogEntry } from '@/lib/types';
import { describeLogEntry, logEntryTime } from '@/lib/gameLogFormat';

// Shared game-log list body. Renders newest-first (events are stored
// oldest-first) with a tabular-nums time column plus describeLogEntry text, and
// an empty state. Used by both the in-game viewer (CenterZone) and the
// game-details page so the two stay in lockstep; only sizing differs, exposed as
// props. Callers own any loading state.
export function GameLogList({
  entries,
  emptyText,
  timeFontSize = 12,
  textFontSize = 14,
  timeMinWidth = 64,
}: {
  entries: GameLogEntry[];
  emptyText: string;
  timeFontSize?: number;
  textFontSize?: number;
  timeMinWidth?: number;
}) {
  if (entries.length === 0) {
    return (
      <Typography sx={{ p: 2, color: 'text.secondary', fontSize: 13 }}>{emptyText}</Typography>
    );
  }
  return (
    <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
      {entries.slice().reverse().map((e, i) => (
        <Box
          component="li"
          key={i}
          sx={{
            display: 'flex', gap: 1, px: 2, py: 0.75,
            borderTop: i > 0 ? '1px solid' : 'none', borderColor: 'divider',
          }}
        >
          <Typography
            component="span"
            sx={{ color: 'text.disabled', fontVariantNumeric: 'tabular-nums', fontSize: timeFontSize, minWidth: timeMinWidth, flexShrink: 0 }}
          >
            {logEntryTime(e.ts)}
          </Typography>
          <Typography component="span" sx={{ fontSize: textFontSize }}>{describeLogEntry(e)}</Typography>
        </Box>
      ))}
    </Box>
  );
}
