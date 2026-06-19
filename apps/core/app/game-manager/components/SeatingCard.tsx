'use client';

/**
 * SeatingCard — the dashed-border card shown for each seat during the seating
 * phase of the Game Manager.
 *
 * Renders either an empty "Tap to choose player & deck" CTA or, once the seat
 * has been filled, a compact summary (position label / player name / commander)
 * with a "Tap to edit" affordance. Tapping anywhere fires `onOpenSeatPicker`,
 * which the parent wires to its SeatPickerModal.
 *
 * Extracted from PlayerPanel.tsx (the prior `seatingMode` early-return). Pulling
 * it out means GameBoard renders SeatingCard directly during the seating phase
 * and PlayerPanel no longer carries the `seatingMode` prop or the dead-weight
 * of all 11 noop handlers that were threaded in just to satisfy its interface.
 */
import { Box } from '@mui/material';
import type { PlayerState } from '../types';

interface SeatingCardProps {
  player: PlayerState;
  onOpenSeatPicker?: () => void;
}

export function SeatingCard({ player, onOpenSeatPicker }: SeatingCardProps) {
  const isFilled = !!(player.playerId && player.deckId && player.commander?.name);
  const positionLabel = player.position.charAt(0).toUpperCase() + player.position.slice(1);

  return (
    <Box
      onClick={onOpenSeatPicker}
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 0.5,
        cursor: onOpenSeatPicker ? 'pointer' : 'default',
        border: 2,
        borderStyle: 'dashed',
        borderColor: isFilled ? 'primary.main' : 'divider',
        borderRadius: 2,
        bgcolor: isFilled ? 'action.selected' : 'transparent',
        transition: 'background-color 120ms, border-color 120ms',
        textAlign: 'center',
        p: 1,
        '&:hover': onOpenSeatPicker
          ? { bgcolor: 'action.hover', borderColor: 'primary.main' }
          : {},
      }}
    >
      {isFilled ? (
        <>
          <Box sx={{ fontSize: 'clamp(11px, 1.2dvh, 14px)', fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>
            {positionLabel}
          </Box>
          <Box sx={{ fontSize: 'clamp(16px, 2.4dvh, 24px)', fontWeight: 700, lineHeight: 1.1 }}>
            {player.playerName}
          </Box>
          <Box sx={{ fontSize: 'clamp(12px, 1.5dvh, 16px)', opacity: 0.85 }}>
            {player.commander.name}{player.partner ? ` / ${player.partner.name}` : ''}
          </Box>
          <Box sx={{ fontSize: 'clamp(10px, 1.1dvh, 12px)', opacity: 0.6, mt: 0.5 }}>
            Tap to edit
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ fontSize: 'clamp(11px, 1.2dvh, 14px)', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 }}>
            {positionLabel}
          </Box>
          <Box sx={{ fontSize: 'clamp(14px, 2.2dvh, 20px)', fontWeight: 600, opacity: 0.85 }}>
            Tap to choose player & deck
          </Box>
        </>
      )}
    </Box>
  );
}
