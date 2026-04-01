'use client';

import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { CardTooltip } from '@commander/shared/components/CardTooltip';
import { ManaCost } from '@/components/ManaCost';
import { ColorSymbols } from '@/components/ManaSymbol';
import { getTypeCategory, sortCards, TYPE_CATEGORIES } from '@/components/DeckFilters';
import type { SortDirection, SortOrder } from '@/components/DeckFilters';

export interface CardListEntry {
  card_name: string;
  quantity: number;
  is_commander: number | boolean;
  type_line?: string | null;
  mana_cost?: string | null;
  color_identity?: string | null;
}

interface Props {
  cards: CardListEntry[];
  /** Sort order applied within each type group */
  sortOrder?: SortOrder;
  sortDirection?: SortDirection;
  /** When true, shows color identity pips instead of mana cost for all cards */
  useColorIdentity?: boolean;
  /** Called when a card name is clicked — e.g. to send it to coach input */
  onCardClick?: (name: string) => void;
}

/**
 * Compact multi-column card list grouped by type category.
 * Commander section highlighted; all names show a CardTooltip image preview.
 */
export function CardListDisplay({ cards, sortOrder = 'name', sortDirection = 'asc', useColorIdentity = false, onCardClick }: Props) {
  const sections = useMemo(() => {
    const commanders: CardListEntry[] = [];
    const map: Record<string, CardListEntry[]> = {};

    for (const c of cards) {
      if (c.is_commander) { commanders.push(c); continue; }
      const cat = getTypeCategory(c.type_line);
      if (!map[cat]) map[cat] = [];
      map[cat].push(c);
    }

    const order = [...TYPE_CATEGORIES, 'Other'] as string[];
    const result: { type: string; cards: CardListEntry[]; isCommander?: boolean }[] = [];
    if (commanders.length > 0) result.push({ type: 'Commander', cards: sortCards(commanders, sortOrder, sortDirection), isCommander: true });
    for (const t of order) {
      if (map[t]?.length) result.push({ type: t, cards: sortCards(map[t], sortOrder, sortDirection) });
    }
    return result;
  }, [cards, sortOrder, sortDirection]);

  const sectionCount = sections.length;

  return (
    <Box sx={{
      columnCount: { xs: 2, sm: 3, md: 4 },
      columnGap: 3,
      py: 1,
      backgroundImage: (theme) => {
        const c = theme.palette.divider;
        const grad = `linear-gradient(to bottom, transparent 0%, ${c} 15%, ${c} 85%, transparent 100%)`;
        const g2 = [grad, grad].join(', ');
        const g3 = [grad, grad, grad].join(', ');
        // Number of dividers = min(sectionCount - 1, columnCount - 1)
        const xs = sectionCount >= 2 ? grad : 'none';
        const sm = sectionCount >= 3 ? g2 : sectionCount >= 2 ? grad : 'none';
        const md = sectionCount >= 4 ? g3 : sectionCount >= 3 ? g2 : sectionCount >= 2 ? grad : 'none';
        return { xs, sm, md };
      },
      backgroundRepeat: 'no-repeat',
      backgroundPosition: {
        // Positions always use column-grid boundaries, not dynamic fractions
        xs: '50% 0',
        sm: sectionCount >= 3 ? '33.333% 0, 66.667% 0' : '33.333% 0',
        md: sectionCount >= 4 ? '25% 0, 50% 0, 75% 0' : sectionCount >= 3 ? '25% 0, 50% 0' : '25% 0',
      },
      backgroundSize: '1px 100%',
    }}>
      {sections.map(({ type, cards: group, isCommander }) => (
        <Box key={type} sx={{ breakInside: 'avoid', mb: 1.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              color: isCommander ? 'warning.main' : 'text.secondary',
              display: 'block',
              mb: 0.5,
            }}
          >
            {type} ({group.reduce((s, c) => s + c.quantity, 0)})
          </Typography>
          {group.map((c, i) => (
            <Box key={`${c.card_name}-${i}`} sx={{ display: 'flex', alignItems: 'center', lineHeight: 1.6, gap: 0.5 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {c.quantity > 1 && (
                  <Typography variant="caption" component="span">{c.quantity}x </Typography>
                )}
                <CardTooltip name={c.card_name} onClick={onCardClick}>
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{
                      borderBottom: '1px dotted',
                      borderColor: 'text.disabled',
                      fontWeight: isCommander ? 700 : 400,
                      color: isCommander ? 'warning.main' : 'text.primary',
                    }}
                  >
                    {c.card_name}
                  </Typography>
                </CardTooltip>
              </Box>
              {useColorIdentity && (c.type_line?.includes('Land') ?? false)
                ? <ColorSymbols colors={c.color_identity || 'C'} size={12} />
                : c.mana_cost ? <ManaCost cost={c.mana_cost} size={0.75} /> : null}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
