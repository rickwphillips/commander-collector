'use client';

import { useRef, useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Turn-navigation control shared by the remote player panels (standard + 2HG).
 *
 * Abstracted from the host CenterZone "Next Turn" button so both surfaces share
 * one interaction: TAP advances the turn, LONG-PRESS (500ms) steps it back (with
 * a transient "Previous Turn" tooltip). Any connected phone can drive the shared
 * turn, so it is always present (not gated on whose turn it is); the label reads
 * "Your Turn" when it IS this seat's / team's turn, otherwise "Next Turn".
 */
export function TurnNavControl({
  isYourTurn,
  onNext,
  onPrev,
  sx,
}: {
  isYourTurn: boolean;
  onNext: () => void;
  onPrev: () => void;
  sx?: SxProps<Theme>;
}) {
  const lpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpFired = useRef(false);
  const [prevTip, setPrevTip] = useState(false);

  const clearLp = () => {
    if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; }
  };

  return (
    <Tooltip
      open={prevTip}
      title="Previous Turn"
      placement="top"
      disableFocusListener
      disableHoverListener
      disableTouchListener
    >
      <Button
        variant={isYourTurn ? 'contained' : 'outlined'}
        // A long-press fires onPrev and sets lpFired so the trailing click (which
        // fires on pointer-up) doesn't also advance the turn.
        onClick={() => { if (lpFired.current) { lpFired.current = false; return; } onNext(); }}
        onPointerDown={() => {
          lpFired.current = false;
          lpTimer.current = setTimeout(() => {
            lpFired.current = true;
            onPrev();
            setPrevTip(true);
            setTimeout(() => setPrevTip(false), 700);
          }, 500);
        }}
        onPointerUp={clearLp}
        onPointerLeave={clearLp}
        onPointerCancel={clearLp}
        sx={{
          fontWeight: 800,
          borderRadius: 2,
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          ...sx,
        }}
      >
        {isYourTurn ? 'Your Turn' : 'Next Turn'}
      </Button>
    </Tooltip>
  );
}
