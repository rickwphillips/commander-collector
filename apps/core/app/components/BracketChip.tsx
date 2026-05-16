'use client';

import { Chip, CircularProgress, Tooltip, Typography, Box } from '@mui/material';
import { useDeckBracket } from '../lib/useDeckBracket';

interface Props {
  deckId: string | null | undefined;
  commander?: string | null;
  size?: 'small' | 'medium';
}

const BRACKET_COLOR: Record<number, 'success' | 'primary' | 'warning' | 'error'> = {
  1: 'success',
  2: 'success',
  3: 'primary',
  4: 'warning',
  5: 'error',
};

/**
 * Compact bracket label for a deck. Shows:
 *   - spinner while loading
 *   - "Bracket N" chip with color-coded power level when known
 *   - "Bracket ?" chip with caveat tooltip when contingency hit (no deck cards,
 *     MCP unreachable, etc.)
 *
 * Hovering reveals the signal trace so the user can see WHY a bracket landed
 * where it did.
 */
export function BracketChip({ deckId, commander, size = 'small' }: Props) {
  const { loading, bracket, bracketName, strengthScore, signals, caveats } = useDeckBracket(deckId, commander);

  if (loading) {
    return (
      <Chip
        size={size}
        icon={<CircularProgress size={12} thickness={5} sx={{ ml: 0.5 }} />}
        label="Scoring deck"
        variant="outlined"
        sx={{ opacity: 0.7 }}
      />
    );
  }

  if (bracket === null) {
    const caveat = caveats[0] ?? 'Bracket pending';
    return (
      <Tooltip title={caveat} placement="top" arrow>
        <Chip
          size={size}
          label="Bracket ?"
          variant="outlined"
          sx={{ opacity: 0.7, fontStyle: 'italic' }}
        />
      </Tooltip>
    );
  }

  const title = (
    <Box sx={{ maxWidth: 320, p: 0.5 }}>
      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
        {bracketName} (strength {strengthScore?.toFixed(2)})
      </Typography>
      {signals.length === 0 && (
        <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
          No bracket-shifting signals fired.
        </Typography>
      )}
      {signals.map((s) => (
        <Typography key={s.name} variant="caption" sx={{ display: 'block', lineHeight: 1.4, opacity: 0.95 }}>
          <Box component="span" sx={{ fontFamily: 'monospace', mr: 0.5 }}>
            {s.contribution >= 0 ? '+' : ''}{s.contribution.toFixed(2)}
          </Box>
          {s.reason}
        </Typography>
      ))}
    </Box>
  );

  return (
    <Tooltip title={title} placement="top" arrow>
      <Chip
        size={size}
        label={`Bracket ${bracket}`}
        color={BRACKET_COLOR[bracket] ?? 'default'}
        variant="filled"
      />
    </Tooltip>
  );
}
