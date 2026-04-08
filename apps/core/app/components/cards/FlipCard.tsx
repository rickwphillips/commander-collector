'use client';

/**
 * FlipCard — canonical 3D-flip primitive for Commander Collector.
 *
 * Replaces four inline flip implementations:
 *   - app/components/CardGridEditor.tsx         (set-based, hover-overlay)
 *   - app/decks/scan/components/CardReviewGrid.tsx (set-based, corner button)
 *   - app/lists/detail/page.tsx GalleryCard     (per-instance, card-click + hover-overlay)
 *   - app/decks/decklist/page.tsx GalleryCard   (per-instance, card-click + hover-overlay)
 *
 * Controlled vs uncontrolled:
 *   - Controlled:   pass `flipped` + `onFlip`; component mirrors parent state.
 *   - Uncontrolled: pass `defaultFlipped` (or nothing); component owns state.
 *
 * No-back no-op:
 *   - When `back` is undefined the flip is entirely skipped — no transform,
 *     no button, no keyboard handler. The front still renders normally.
 */

import { useState, useCallback, type KeyboardEvent, type ReactNode } from 'react';
import { Box } from '@mui/material';
import FlipIcon from '@mui/icons-material/SyncAlt';

// ── Props ─────────────────────────────────────────────────────────────────────

export interface FlipCardProps {
  /** Front face content — always rendered. */
  front: ReactNode;
  /**
   * Back face content. When omitted the component renders front-only with no
   * flip behaviour (no transform, no button, no keyboard handler).
   */
  back?: ReactNode;

  // ── Controlled mode ──────────────────────────────────────────────────────
  /** Controlled flip state. Pair with `onFlip`. */
  flipped?: boolean;
  /** Called when the user requests a flip. Parent must update `flipped`. */
  onFlip?: (flipped: boolean) => void;

  // ── Uncontrolled mode ────────────────────────────────────────────────────
  /** Initial flip state in uncontrolled mode. Ignored when `flipped` is provided. */
  defaultFlipped?: boolean;

  // ── Behaviour ────────────────────────────────────────────────────────────
  /**
   * When true, the flip button and keyboard handler are suppressed.
   * The card still renders both faces in their current positions.
   */
  disabled?: boolean;

  // ── Layout ───────────────────────────────────────────────────────────────
  /** Defaults to '100%'. */
  width?: number | string;
  /** Defaults to '100%'. */
  height?: number | string;

  // ── Accessibility ────────────────────────────────────────────────────────
  /** Accessible label for the flip button. Defaults to 'Flip card'. */
  ariaLabel?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function FlipCard({
  front,
  back,
  flipped: controlledFlipped,
  onFlip,
  defaultFlipped = false,
  disabled = false,
  width = '100%',
  height = '100%',
  ariaLabel = 'Flip card',
}: FlipCardProps) {
  // ── State (uncontrolled) ─────────────────────────────────────────────────

  const [internalFlipped, setInternalFlipped] = useState(defaultFlipped);

  // ── Derived ──────────────────────────────────────────────────────────────

  const isControlled = controlledFlipped !== undefined;
  const isFlipped     = isControlled ? controlledFlipped : internalFlipped;
  const hasBothFaces  = back !== undefined;
  const interactive   = hasBothFaces && !disabled;

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleFlip = useCallback(() => {
    if (!interactive) return;
    const next = !isFlipped;
    if (isControlled) {
      onFlip?.(next);
    } else {
      setInternalFlipped(next);
      onFlip?.(next);
    }
  }, [interactive, isFlipped, isControlled, onFlip]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleFlip();
    }
  }, [interactive, handleFlip]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box
      sx={{
        position: 'relative',
        width,
        height,
        // perspective must sit on the container, not the inner rotating element
        perspective: '800px',
      }}
    >
      {/* ── Rotating inner card ──────────────────────────────────────────── */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: hasBothFaces
            ? 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)'
            : 'none',
          transform: hasBothFaces && isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front face */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {front}
        </Box>

        {/* Back face — only mounted when a back is provided */}
        {hasBothFaces && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {back}
          </Box>
        )}
      </Box>

      {/* ── Flip button overlay ───────────────────────────────────────────── */}
      {/*
       * Rendered only when there is a back face and the card is not disabled.
       * Hover-reveal pattern (opacity 0 → 1) matches both GalleryCard variants
       * and the CardGridEditor inline implementation. The touch target is
       * exactly 44×44 px to satisfy WCAG 2.5.5 / mobile-first requirement.
       *
       * role="button" + tabIndex + aria-pressed give full keyboard + AT support.
       */}
      {interactive && (
        <Box
          role="button"
          tabIndex={0}
          aria-label={ariaLabel}
          aria-pressed={isFlipped}
          onClick={handleFlip}
          onKeyDown={handleKeyDown}
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Invisible until hovered / focused — matches existing pattern
            opacity: 0,
            transition: 'opacity 0.2s ease',
            cursor: 'pointer',
            '&:hover, &:focus-visible': {
              opacity: 1,
              outline: 'none',
            },
          }}
        >
          {/* Pill button — 44×44 minimum touch target */}
          <Box
            sx={{
              bgcolor: 'rgba(0,0,0,0.45)',
              borderRadius: '50%',
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // Show ring on keyboard focus without relying on the outer opacity
              '[role="button"]:focus-visible &': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: 2,
              },
            }}
          >
            <FlipIcon sx={{ fontSize: 26, color: '#fff' }} aria-hidden />
          </Box>
        </Box>
      )}
    </Box>
  );
}
