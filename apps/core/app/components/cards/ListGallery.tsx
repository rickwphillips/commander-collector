'use client';

/**
 * ListGallery — gallery (image grid) view of a card list.
 *
 * Counterpart to CardListDisplay (text view). Both are pure renderers driven by
 * the unified ListEditor; both honor the same edit-mode contract (qty stepper +
 * remove). Use the same view-mode toggle in CardListToolbar to swap between them.
 *
 * Cards without resolved images fall back to CardTile's placeholder so the grid
 * stays uniform. Hover preview is provided by CardTile's built-in <FlipCard>
 * front/back facing — no extra Tooltip layer here.
 */

import { useCallback } from 'react';
import { Box } from '@mui/material';

import { CardTile } from '@/components/cards/CardTile';
import type { Card } from '@/lib/cards/types';

export interface ListGalleryProps {
  cards: Card[];
  /** When true, each tile shows a qty stepper + remove button. */
  editMode?: boolean;
  /** Required when editMode is true. Receives the new full cards array. */
  onChange?: (next: Card[]) => void;
}

export function ListGallery({ cards, editMode = false, onChange }: ListGalleryProps) {
  // Mutate quantities and removals against the full passed-in array.
  const handleQty = useCallback((cardName: string, delta: number) => {
    if (!onChange) return;
    const next = cards
      .map((c) => (c.card_name === cardName ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c))
      .filter((c) => c.quantity > 0);
    onChange(next);
  }, [cards, onChange]);

  const handleRemove = useCallback((cardName: string) => {
    if (!onChange) return;
    onChange(cards.filter((c) => c.card_name !== cardName));
  }, [cards, onChange]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
        },
        gap: 1.5,
        py: 1,
      }}
    >
      {cards.map((c, i) => (
        <CardTile
          key={`${c.card_name}-${i}`}
          card={c}
          size="md"
          editMode={editMode}
          onQtyChange={editMode ? (next) => handleQty(c.card_name, next - c.quantity) : undefined}
          onDelete={editMode ? () => handleRemove(c.card_name) : undefined}
        />
      ))}
    </Box>
  );
}
