'use client';

/**
 * CardTile — single card visual for Commander Collector.
 *
 * Renders one card in any context (deck or list — both are peers).
 * Wraps <FlipCard> when a back face is available.
 *
 * Commander star signal:
 *   - card.role === 'commander'  (list-native)
 *   - card.is_commander === true (deck-native)
 *   Both are valid; show the star when either is true.
 *
 * Partner badge:
 *   - card.role === 'partner' renders a distinct badge (no star).
 *
 * Lookup state:
 *   Defaults to 'resolved' when card.scryfall_id is set, else 'not_found'.
 *   Caller may override via the `lookupState` prop.
 */

import {
  type KeyboardEvent,
  useCallback,
  useState,
} from 'react';
import Image from 'next/image';
import {
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import GroupIcon from '@mui/icons-material/Group';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { FlipCard } from '@/components/cards/FlipCard';
import type { Card } from '@/lib/cards/types';

// ── Types ─────────────────────────────────────────────────────────────────────

export type LookupState =
  | 'resolved'
  | 'pending'
  | 'not_found'
  | 'transient_error'
  | 'custom';

export type TileSize = 'sm' | 'md' | 'lg';

export interface CardTileProps {
  card: Card;
  /**
   * Lookup state. Defaults to 'resolved' when card.scryfall_id is set,
   * otherwise defaults to 'not_found'.
   */
  lookupState?: LookupState;
  /** Visual size. Defaults to 'md'. */
  size?: TileSize;
  /** When true, shows qty stepper, delete button, and optional selection. */
  editMode?: boolean;
  /** Called when the user changes the quantity via the stepper. */
  onQtyChange?: (newQty: number) => void;
  /** Called when the user clicks the delete button. */
  onDelete?: () => void;
  /**
   * Contextual click handler.
   * In not_found state, triggers repair flow (caller wires CardSearchDialog).
   * In other states, caller defines meaning.
   */
  onClick?: () => void;
  /** Whether this tile is selected in batch-select edit mode. */
  selected?: boolean;
  /** Called when selection changes. Renders checkbox when provided + editMode. */
  onSelectChange?: (selected: boolean) => void;
  /** Controlled flip state — passed through to FlipCard. */
  flipped?: boolean;
  /** Called when the user flips the card — passed through to FlipCard. */
  onFlip?: (flipped: boolean) => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

/** MTG card aspect ratio (63 mm × 88 mm). */
const MTG_ASPECT = '63 / 88';

const SIZE_WIDTH: Record<TileSize, number | string> = {
  sm: 90,
  md: 146,
  lg: 220,
};

const PLACEHOLDER: Record<TileSize, string> = {
  sm: '/card-not-found-small.webp',
  md: '/card-not-found.webp',
  lg: '/card-not-found.webp',
};

// ── Sub-components ────────────────────────────────────────────────────────────

/** Card image wrapper — hoisted to module scope to avoid "create component during render". */
function CardImage({
  src,
  alt,
  size,
  rounded = false,
}: {
  src: string;
  alt: string;
  size: TileSize;
  rounded?: boolean;
}) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: MTG_ASPECT,
        borderRadius: rounded ? '4px' : 0,
        overflow: 'hidden',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`(max-width: 600px) ${SIZE_WIDTH[size]}px, ${SIZE_WIDTH[size]}px`}
        style={{ objectFit: 'cover' }}
        priority={false}
      />
    </Box>
  );
}

/** Quantity pill shown in view mode. */
function QtyPill({ qty }: { qty: number }) {
  return (
    <Chip
      label={`×${qty}`}
      size="small"
      aria-label={`Quantity: ${qty}`}
      sx={{
        position: 'absolute',
        bottom: 6,
        right: 6,
        zIndex: 2,
        height: 22,
        fontSize: '0.7rem',
        fontWeight: 700,
        bgcolor: 'rgba(0,0,0,0.72)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.25)',
        '& .MuiChip-label': { px: '6px' },
        pointerEvents: 'none',
      }}
    />
  );
}

/** ± stepper shown in edit mode. */
function QtyStepper({
  qty,
  onQtyChange,
}: {
  qty: number;
  onQtyChange: (n: number) => void;
}) {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        bgcolor: 'rgba(0,0,0,0.72)',
        py: '4px',
        borderBottomLeftRadius: '4px',
        borderBottomRightRadius: '4px',
      }}
    >
      <IconButton
        size="small"
        aria-label="Decrease quantity"
        onClick={(e) => {
          e.stopPropagation();
          if (qty > 1) onQtyChange(qty - 1);
        }}
        disabled={qty <= 1}
        sx={{ color: '#fff', width: 44, height: 44, flexShrink: 0 }}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>

      <Typography
        variant="body2"
        component="span"
        aria-label={`Quantity: ${qty}`}
        sx={{ color: '#fff', fontWeight: 700, minWidth: 20, textAlign: 'center' }}
      >
        {qty}
      </Typography>

      <IconButton
        size="small"
        aria-label="Increase quantity"
        onClick={(e) => {
          e.stopPropagation();
          onQtyChange(qty + 1);
        }}
        sx={{ color: '#fff', width: 44, height: 44, flexShrink: 0 }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

// ── CardTile ──────────────────────────────────────────────────────────────────

export function CardTile({
  card,
  lookupState: lookupStateProp,
  size = 'md',
  editMode = false,
  onQtyChange,
  onDelete,
  onClick,
  selected = false,
  onSelectChange,
  flipped,
  onFlip,
}: CardTileProps) {
  // ── Derived state ──────────────────────────────────────────────────────────

  const lookupState: LookupState =
    lookupStateProp ??
    (card.scryfall_id ? 'resolved' : 'not_found');

  const isResolved  = lookupState === 'resolved';
  const isPending   = lookupState === 'pending';
  const isNotFound  = lookupState === 'not_found';
  const isError     = lookupState === 'transient_error';
  const isCustom    = lookupState === 'custom';

  // Commander / partner badges — either signal is valid (peers rule)
  const isCommander = card.role === 'commander' || card.is_commander === true;
  const isPartner   = card.role === 'partner';

  const showFlip    = isResolved && Boolean(card.back_image_uri);
  const imageUri    = card.image_uri ?? null;
  const backUri     = card.back_image_uri ?? null;
  const placeholder = PLACEHOLDER[size];

  // ── Internal flip state (fallback when caller is uncontrolled) ─────────────
  // FlipCard itself owns uncontrolled state; we only need this for the
  // front/back src logic if the caller is in controlled mode.
  const [localFlipped, setLocalFlipped] = useState(false);
  const effectiveFlipped = flipped !== undefined ? flipped : localFlipped;

  const handleFlip = useCallback(
    (next: boolean) => {
      setLocalFlipped(next);
      onFlip?.(next);
    },
    [onFlip],
  );

  // ── Click / keyboard ───────────────────────────────────────────────────────

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onClick?.();
      }
    },
    [onClick],
  );

  // ── Front / back face nodes ───────────────────────────────────────────────

  const frontFace =
    isResolved && imageUri ? (
      <CardImage src={imageUri} alt={card.card_name} size={size} rounded />
    ) : (
      <CardImage
        src={placeholder}
        alt={
          isPending
            ? 'Looking up card…'
            : isNotFound
              ? 'Card not found'
              : isError
                ? 'Lookup failed'
                : isCustom
                  ? 'Custom card'
                  : card.card_name
        }
        size={size}
        rounded
      />
    );

  const backFace =
    showFlip && backUri ? (
      <CardImage src={backUri} alt={`${card.card_name} — back face`} size={size} rounded />
    ) : undefined;

  // ── Render ────────────────────────────────────────────────────────────────

  const showSelection = editMode && !!onSelectChange;
  const showQtyStepper = editMode && !!onQtyChange;
  const showQtyPill = !editMode;
  const isClickable = !!onClick;

  // not_found tile tooltip text
  const notFoundTooltip = 'Click to find this card on Scryfall';

  const tileContents = (
    <Box
      // Outer tile: position:relative container, aspect-ratio locked
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable || editMode ? 0 : undefined}
      aria-label={
        isNotFound
          ? `${card.card_name} — card not found. ${notFoundTooltip}`
          : card.card_name
      }
      aria-pressed={
        isClickable && selected !== undefined ? selected : undefined
      }
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      sx={{
        position: 'relative',
        width: SIZE_WIDTH[size],
        aspectRatio: MTG_ASPECT,
        borderRadius: '4px',
        overflow: 'visible', // badges may bleed slightly
        cursor: isNotFound && isClickable ? 'pointer' : isClickable ? 'pointer' : 'default',
        outline: selected ? '2px solid' : 'none',
        outlineColor: 'primary.main',
        outlineOffset: 2,
        userSelect: 'none',
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
      }}
    >
      {/* ── Card image / flip ─────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: MTG_ASPECT,
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        {showFlip ? (
          <FlipCard
            front={frontFace}
            back={backFace}
            flipped={flipped !== undefined ? effectiveFlipped : undefined}
            onFlip={handleFlip}
            width="100%"
            height="100%"
          />
        ) : (
          frontFace
        )}
      </Box>

      {/* ── State badges ─────────────────────────────────────────────────── */}

      {/* pending — spinner overlay */}
      {isPending && (
        <Box
          aria-label="Looking up…"
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.45)',
            borderRadius: '4px',
          }}
        >
          <CircularProgress size={32} aria-hidden />
        </Box>
      )}

      {/* not_found — red ? badge top-right */}
      {isNotFound && (
        <Tooltip title={isClickable ? notFoundTooltip : 'Card not found'}>
          <Box
            aria-label="Card not found — click to repair"
            sx={{
              position: 'absolute',
              top: -6,
              right: -6,
              zIndex: 5,
              width: 22,
              height: 22,
              borderRadius: '50%',
              bgcolor: 'error.main',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 1,
            }}
          >
            <HelpOutlineIcon sx={{ fontSize: 14 }} aria-hidden />
          </Box>
        </Tooltip>
      )}

      {/* transient_error — yellow ! badge top-right */}
      {isError && (
        <Tooltip title="Lookup failed — retrying">
          <Box
            aria-label="Lookup failed — retrying"
            sx={{
              position: 'absolute',
              top: -6,
              right: -6,
              zIndex: 5,
              width: 22,
              height: 22,
              borderRadius: '50%',
              bgcolor: 'warning.main',
              color: 'warning.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 1,
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 14 }} aria-hidden />
          </Box>
        </Tooltip>
      )}

      {/* custom — small tag bottom-left */}
      {isCustom && (
        <Chip
          label="custom"
          size="small"
          aria-label="Custom card"
          sx={{
            position: 'absolute',
            bottom: 6,
            left: 6,
            zIndex: 4,
            height: 18,
            fontSize: '0.62rem',
            fontWeight: 600,
            bgcolor: 'rgba(255,255,255,0.15)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(2px)',
            '& .MuiChip-label': { px: '5px' },
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── Left-column badges: commander star OR partner + selection ─────── */}
      {/*
       * Layout: top-left column.
       * Commander star (or partner badge) sits at the very top-left.
       * Selection checkbox is below it (stacked), or replaces it if neither
       * commander nor partner.
       */}

      {isCommander && (
        <Tooltip title="Commander">
          <Box
            aria-label="Commander"
            sx={{
              position: 'absolute',
              top: -6,
              left: -6,
              zIndex: 5,
              width: 22,
              height: 22,
              borderRadius: '50%',
              bgcolor: 'warning.main',
              color: 'warning.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 1,
            }}
          >
            <StarIcon sx={{ fontSize: 14 }} aria-hidden />
          </Box>
        </Tooltip>
      )}

      {!isCommander && isPartner && (
        <Tooltip title="Partner">
          <Box
            aria-label="Partner"
            sx={{
              position: 'absolute',
              top: -6,
              left: -6,
              zIndex: 5,
              width: 22,
              height: 22,
              borderRadius: '50%',
              bgcolor: 'info.main',
              color: 'info.contrastText',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 1,
            }}
          >
            <GroupIcon sx={{ fontSize: 13 }} aria-hidden />
          </Box>
        </Tooltip>
      )}

      {/* Selection checkbox — below commander/partner badge */}
      {showSelection && (
        <Box
          sx={{
            position: 'absolute',
            top: isCommander || isPartner ? 20 : -4,
            left: -4,
            zIndex: 5,
          }}
        >
          <Checkbox
            checked={selected}
            onChange={(e) => {
              e.stopPropagation();
              onSelectChange(e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()}
            size="small"
            aria-label={selected ? `Deselect ${card.card_name}` : `Select ${card.card_name}`}
            sx={{
              p: '2px',
              color: '#fff',
              bgcolor: 'rgba(0,0,0,0.55)',
              borderRadius: '4px',
              '&.Mui-checked': { color: 'primary.main' },
              width: 28,
              height: 28,
            }}
          />
        </Box>
      )}

      {/* ── Foil / proxy badge ────────────────────────────────────────────── */}
      {card.is_proxy && (
        <Chip
          label="PROXY"
          size="small"
          aria-label="Proxy card"
          sx={{
            position: 'absolute',
            top: 6,
            // right side — avoid not_found/error badge (top-right -6)
            right: 6,
            zIndex: 4,
            height: 18,
            fontSize: '0.6rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            bgcolor: 'rgba(120,60,0,0.82)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.25)',
            '& .MuiChip-label': { px: '5px' },
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── Quantity ─────────────────────────────────────────────────────── */}
      {showQtyPill && <QtyPill qty={card.quantity} />}
      {showQtyStepper && (
        <QtyStepper qty={card.quantity} onQtyChange={onQtyChange!} />
      )}

      {/* ── Delete button (edit mode) ─────────────────────────────────────── */}
      {editMode && onDelete && (
        <IconButton
          size="small"
          aria-label={`Delete ${card.card_name}`}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          sx={{
            position: 'absolute',
            // Offset away from the not_found badge when both might show
            top: isNotFound ? 18 : -4,
            right: -4,
            zIndex: 6,
            width: 28,
            height: 28,
            bgcolor: 'rgba(0,0,0,0.65)',
            color: '#fff',
            '&:hover': { bgcolor: 'error.dark', color: '#fff' },
          }}
        >
          <DeleteIcon sx={{ fontSize: 16 }} />
        </IconButton>
      )}
    </Box>
  );

  // not_found state wraps the whole tile in a tooltip for discoverability
  if (isNotFound && isClickable) {
    return (
      <Tooltip title={notFoundTooltip} placement="top">
        {tileContents}
      </Tooltip>
    );
  }

  return tileContents;
}
