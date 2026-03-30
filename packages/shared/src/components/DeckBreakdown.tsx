'use client';

import { useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { ManaSymbol } from './ManaSymbol';

export interface BreakdownCard {
  card_name: string;
  quantity: number;
  is_commander: number | boolean;
  is_proxy: number | boolean;
  type_line?: string | null;
  color_identity?: string | null;
  mana_cost?: string | null;
  image_uri?: string | null;
  scryfall_id?: string | null;
  notFound?: boolean;
}

interface Props {
  cards: BreakdownCard[];
  /** When true, renders grouped card lists under each type category */
  showList?: boolean;
}

const TYPE_ORDER = [
  'Commander',
  'Creature',
  'Planeswalker',
  'Battle',
  'Instant',
  'Sorcery',
  'Enchantment',
  'Artifact',
  'Land',
  'Unknown',
] as const;

type TypeCategory = (typeof TYPE_ORDER)[number];

function getCategory(card: BreakdownCard): TypeCategory {
  if (card.is_commander) return 'Commander';
  const tl = card.type_line ?? '';
  if (tl.includes('Creature')) return 'Creature';
  if (tl.includes('Planeswalker')) return 'Planeswalker';
  if (tl.includes('Battle')) return 'Battle';
  if (tl.includes('Instant')) return 'Instant';
  if (tl.includes('Sorcery')) return 'Sorcery';
  if (tl.includes('Enchantment')) return 'Enchantment';
  if (tl.includes('Artifact')) return 'Artifact';
  if (tl.includes('Land')) return 'Land';
  return 'Unknown';
}

const MTG_COLORS = ['W', 'U', 'B', 'R', 'G'] as const;

export function DeckBreakdown({ cards, showList = false }: Props) {
  const { byType, colorCounts, total, proxyCount } = useMemo(() => {
    const byType: Partial<Record<TypeCategory, BreakdownCard[]>> = {};
    const colorCounts: Record<string, number> = {};
    let total = 0;
    let proxyCount = 0;

    for (const card of cards) {
      const cat = getCategory(card);
      const qty = card.quantity ?? 1;
      total += qty;
      if (card.is_proxy) proxyCount += qty;

      if (!byType[cat]) byType[cat] = [];
      byType[cat]!.push(card);

      // Color identity distribution
      const ci = card.color_identity ?? '';
      if (ci) {
        for (const ch of ci) {
          colorCounts[ch] = (colorCounts[ch] ?? 0) + qty;
        }
      } else {
        colorCounts['C'] = (colorCounts['C'] ?? 0) + qty;
      }
    }

    return { byType, colorCounts, total, proxyCount };
  }, [cards]);

  const presentTypes = TYPE_ORDER.filter((t) => byType[t]?.length);

  return (
    <Stack spacing={2}>
      {/* Summary row */}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip label={`${total} cards`} size="small" variant="outlined" />
        {proxyCount > 0 && (
          <Chip label={`${proxyCount} proxies`} size="small" color="warning" variant="outlined" />
        )}
      </Stack>

      {/* Type breakdown */}
      <Card variant="outlined">
        <CardContent sx={{ pb: '12px !important', pt: 1.5 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Card Types
          </Typography>
          <Grid container spacing={0.5}>
            {presentTypes.map((type) => {
              const group = byType[type]!;
              const qty = group.reduce((s, c) => s + (c.quantity ?? 1), 0);
              return (
                <Grid key={type} size={{ xs: 6, sm: 4 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ pr: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {type}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {qty}
                    </Typography>
                  </Stack>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Color distribution */}
      {Object.keys(colorCounts).length > 0 && (
        <Card variant="outlined">
          <CardContent sx={{ pb: '12px !important', pt: 1.5 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Color Distribution
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              {MTG_COLORS.filter((c) => colorCounts[c]).map((c) => (
                <Stack key={c} direction="row" alignItems="center" spacing={0.5}>
                  <ManaSymbol color={c} size={20} active />
                  <Typography variant="body2" fontWeight={600}>
                    {colorCounts[c]}
                  </Typography>
                </Stack>
              ))}
              {colorCounts['C'] ? (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <ManaSymbol color="C" size={20} active />
                  <Typography variant="body2" fontWeight={600}>
                    {colorCounts['C']}
                  </Typography>
                </Stack>
              ) : null}
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Grouped card list */}
      {showList && (
        <Stack spacing={1.5}>
          {presentTypes.map((type) => (
            <Box key={type}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 0.5, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}
              >
                {type} ({byType[type]!.reduce((s, c) => s + (c.quantity ?? 1), 0)})
              </Typography>
              <Divider sx={{ mb: 0.5 }} />
              <Stack spacing={0.25}>
                {byType[type]!
                  .sort((a, b) => a.card_name.localeCompare(b.card_name))
                  .map((card, i) => (
                    <Stack
                      key={`${card.card_name}-${i}`}
                      direction="row"
                      alignItems="center"
                      spacing={1}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ minWidth: 20, textAlign: 'right' }}
                      >
                        {card.quantity}
                      </Typography>
                      <Tooltip
                        disableInteractive
                        placement="right"
                        title={
                          card.image_uri ? (
                            <Box
                              component="img"
                              src={card.image_uri}
                              alt={card.card_name}
                              sx={{ width: 160, borderRadius: 1, display: 'block' }}
                            />
                          ) : ''
                        }
                        slotProps={{ tooltip: { sx: { bgcolor: 'transparent', p: 0, boxShadow: 6 } } }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ flex: 1, cursor: card.image_uri ? 'default' : undefined }}
                        >
                          {card.card_name}
                        </Typography>
                      </Tooltip>
                      {card.is_proxy ? (
                        <Chip label="proxy" size="small" color="warning" sx={{ height: 16, fontSize: '0.6rem' }} />
                      ) : null}
                    </Stack>
                  ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
