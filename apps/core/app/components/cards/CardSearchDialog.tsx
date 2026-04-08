'use client';

/**
 * CardSearchDialog — unified add/edit dialog shell built on CardLookupField.
 *
 * Add mode:
 *   Renders CardLookupField inside an MUI Dialog. Each time the user hits "Add"
 *   on a result row, onConfirm([card]) fires immediately and the dialog closes.
 *   Rationale for close-on-each (not multi-accumulate): the quantity stepper
 *   already handles N copies in one shot, so the common path is "find card →
 *   set qty → add → done." A hidden staging buffer + "Done" button would slow
 *   that path and surprise users. Callers can re-open the dialog for a second
 *   card if needed.
 *
 * Edit mode:
 *   Shows the current card in a "Current" panel at the top (thumbnail + name +
 *   qty + scryfall id), then renders CardLookupField pre-filled with the
 *   current card name. Selecting any result replaces the current card:
 *   onConfirm([replacement]) fires and the dialog closes. Used by the repair
 *   flow on not_found rows and by the swap-printing flow.
 *
 * Keep it thin — all search/filter/stepper logic lives in CardLookupField.
 */

import { useRef } from 'react';
import Image from 'next/image';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { CardLookupField } from '@/components/cards/CardLookupField';
import type { ResultFilter } from '@/components/cards/CardLookupField';
import type { Card } from '@/lib/cards/types';

// ── Props ─────────────────────────────────────────────────────────────────────

interface CardSearchDialogPropsBase {
  open: boolean;
  onCancel: () => void;
  /**
   * Called when the user confirms a selection.
   * - Add mode: always exactly one card (the result row that was clicked).
   *   The dialog closes after each Add; re-open for subsequent cards.
   * - Edit mode: always exactly one card (the replacement).
   */
  onConfirm: (cards: Card[]) => void;
  /** Passthrough to CardLookupField: hides qty stepper, always sends qty=1. */
  singletonMode?: boolean;
  /** Passthrough to CardLookupField: filters results after fetch. */
  resultFilter?: ResultFilter;
  /** Optional title override; defaults to "Add card" / "Edit card". */
  title?: string;
}

export type CardSearchDialogProps =
  | (CardSearchDialogPropsBase & { mode: 'add'; initialCard?: Card })
  | (CardSearchDialogPropsBase & {
      mode: 'edit';
      /**
       * Required when mode === 'edit'. Pre-fills the lookup field with the existing
       * card name and renders the "Current card" panel so the user can compare
       * printings before swapping.
       */
      initialCard: Card;
    });

// ── CardSearchDialog ──────────────────────────────────────────────────────────

export function CardSearchDialog({
  open,
  mode,
  initialCard,
  onCancel,
  onConfirm,
  singletonMode,
  resultFilter,
  title,
}: CardSearchDialogProps) {
  const theme      = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // The element that triggered the dialog — focus returns here on close.
  const triggerRef = useRef<Element | null>(null);

  const defaultTitle = mode === 'edit' ? 'Edit card' : 'Add card';
  const dialogTitle  = title ?? defaultTitle;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleAdd = (cards: Card[]) => {
    onConfirm(cards);
  };

  const handleCancel = () => {
    onCancel();
  };

  // Capture trigger on open so we can restore focus on close.
  const handleTransitionEnter = () => {
    triggerRef.current = document.activeElement;
  };

  const handleTransitionExited = () => {
    if (triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus();
    }
    triggerRef.current = null;
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      aria-labelledby="card-search-dialog-title"
      TransitionProps={{
        onEnter:  handleTransitionEnter,
        onExited: handleTransitionExited,
      }}
    >
      {/* ── Title bar ─────────────────────────────────────────────────────── */}
      <DialogTitle
        id="card-search-dialog-title"
        sx={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          pb:             1,
          pr:             1,
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
          {dialogTitle}
        </Typography>

        <IconButton
          aria-label="Close dialog"
          onClick={handleCancel}
          size="small"
          edge="end"
          sx={{ ml: 1 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Stack spacing={2}>
          {/* ── Edit mode: current card panel ─────────────────────────────── */}
          {mode === 'edit' && initialCard && (
            <>
              <CurrentCardPanel card={initialCard} />
              <Divider />
            </>
          )}

          {/* ── Lookup field ──────────────────────────────────────────────── */}
          <CardLookupField
            autoFocus
            defaultValue={mode === 'edit' ? (initialCard?.card_name ?? '') : ''}
            onAdd={handleAdd}
            singletonMode={singletonMode}
            resultFilter={resultFilter}
            placeholder={
              mode === 'edit'
                ? 'Search for a replacement…'
                : 'Search for a card…'
            }
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

// ── CurrentCardPanel ──────────────────────────────────────────────────────────

interface CurrentCardPanelProps {
  card: Card;
}

function CurrentCardPanel({ card }: CurrentCardPanelProps) {
  const hasImage = Boolean(card.image_uri);

  return (
    <Box
      aria-label="Current card"
      sx={{
        display:      'flex',
        alignItems:   'center',
        gap:          1.5,
        p:            1.5,
        borderRadius: 1,
        bgcolor:      (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(0,0,0,0.04)',
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          position:   'relative',
          width:      48,
          height:     67,
          flexShrink: 0,
          borderRadius: 0.75,
          overflow:   'hidden',
          bgcolor:    'action.hover',
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {hasImage ? (
          <Image
            src={card.image_uri as string}
            alt={card.card_name}
            fill
            sizes="48px"
            style={{ objectFit: 'cover', objectPosition: 'top' }}
          />
        ) : (
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontSize: '0.6rem' }}
          >
            ?
          </Typography>
        )}
      </Box>

      {/* Card info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          noWrap
          title={card.card_name}
        >
          {card.card_name}
        </Typography>

        {card.type_line && (
          <Typography variant="caption" color="text.secondary" noWrap display="block">
            {card.type_line}
          </Typography>
        )}

        <Stack direction="row" spacing={1} mt={0.25} flexWrap="wrap">
          <Typography variant="caption" color="text.disabled">
            Qty: {card.quantity}
          </Typography>

          {card.scryfall_id && (
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontFamily: 'monospace', fontSize: '0.65rem' }}
              noWrap
              title={card.scryfall_id}
            >
              {card.scryfall_id.slice(0, 8)}…
            </Typography>
          )}
        </Stack>
      </Box>

      {/* "Current" label */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          flexShrink:   0,
          px:           0.75,
          py:           0.25,
          borderRadius: 0.5,
          border:       '1px solid',
          borderColor:  'divider',
          lineHeight:   1.4,
          whiteSpace:   'nowrap',
        }}
      >
        Current
      </Typography>
    </Box>
  );
}
