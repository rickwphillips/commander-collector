'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ManaSymbol } from '@/components/ManaSymbol';
import { CardListDisplay } from '@/components/CardListDisplay';
import type { SortDirection, SortOrder } from '@/components/DeckFilters';

export interface BreakdownCard {
  card_name: string;
  quantity: number;
  is_commander: number | boolean;
  is_proxy: number | boolean;
  type_line?: string | null;
  color_identity?: string | null;
  mana_cost?: string | null;
  image_uri?: string | null;
  back_image_uri?: string | null;
  scryfall_id?: string | null;
  notFound?: boolean;
}

interface Props {
  cards: BreakdownCard[];
  /** When true, renders grouped card lists under each type category */
  showList?: boolean;
  /** Sort order and direction applied within each type group in the list view */
  sortOrder?: SortOrder;
  sortDirection?: SortDirection;
  /** When true, shows color identity pips instead of mana cost in the list */
  useColorIdentity?: boolean;
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

const TYPE_COLORS: Record<TypeCategory, string> = {
  Commander: '#9c27b0',
  Creature:  '#4caf50',
  Planeswalker: '#ffa726',
  Battle:    '#ff7043',
  Instant:   '#29b6f6',
  Sorcery:   '#ef5350',
  Enchantment: '#ec407a',
  Artifact:  '#90a4ae',
  Land:      '#8d6e63',
  Unknown:   '#607d8b',
};

const MTG_PIE_COLORS: Record<string, string> = {
  W: '#e8d44d',
  U: '#1565c0',
  B: '#6a1b9a',
  R: '#c62828',
  G: '#2e7d32',
  C: '#9e9e9e',
};

const MTG_COLORS = ['W', 'U', 'B', 'R', 'G'] as const;

function getCategory(card: BreakdownCard): TypeCategory {
  if (card.is_commander) return 'Commander';
  const tl = card.type_line ?? '';
  if (tl.includes('Creature'))     return 'Creature';
  if (tl.includes('Planeswalker')) return 'Planeswalker';
  if (tl.includes('Battle'))       return 'Battle';
  if (tl.includes('Land'))         return 'Land';
  if (tl.includes('Instant'))      return 'Instant';
  if (tl.includes('Sorcery'))      return 'Sorcery';
  if (tl.includes('Enchantment'))  return 'Enchantment';
  if (tl.includes('Artifact'))     return 'Artifact';
  return 'Unknown';
}

// ─── Donut pie chart ─────────────────────────────────────────────────────────

interface PieSlice {
  label: string;
  value: number;
  color: string;
}

function DonutChart({ data, size = 140 }: { data: PieSlice[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 2;
  const innerR = outerR * 0.52;

  let angle = -Math.PI / 2;
  const slices = data.map((d) => {
    const start = angle;
    const sweep = (d.value / total) * 2 * Math.PI;
    angle += sweep;
    return { ...d, start, end: angle, sweep };
  });

  function arcPath(s: (typeof slices)[0]) {
    if (s.sweep < 0.001) return null;
    const cos1 = Math.cos(s.start), sin1 = Math.sin(s.start);
    const cos2 = Math.cos(s.end),   sin2 = Math.sin(s.end);
    const large = s.sweep > Math.PI ? 1 : 0;
    return [
      `M ${cx + outerR * cos1} ${cy + outerR * sin1}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${cx + outerR * cos2} ${cy + outerR * sin2}`,
      `L ${cx + innerR * cos2} ${cy + innerR * sin2}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${cx + innerR * cos1} ${cy + innerR * sin1}`,
      'Z',
    ].join(' ');
  }

  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      {slices.map((s, i) => {
        const path = arcPath(s);
        if (!path) return null;
        return (
          <Tooltip key={i} title={`${s.label}: ${s.value}`} placement="top">
            <path d={path} fill={s.color} stroke="rgba(0,0,0,0.08)" strokeWidth={1} style={{ cursor: 'default' }} />
          </Tooltip>
        );
      })}
    </svg>
  );
}

function ChartLegend({ data }: { data: PieSlice[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <Stack spacing={0.4} sx={{ minWidth: 110 }}>
      {data.map((d) => (
        <Stack key={d.label} direction="row" alignItems="center" spacing={0.75}>
          <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: d.color, flexShrink: 0 }} />
          <Typography variant="caption" color="text.secondary" sx={{ flex: 1, lineHeight: 1.2 }}>
            {d.label}
          </Typography>
          <Typography variant="caption" fontWeight={600} sx={{ lineHeight: 1.2 }}>
            {total > 0 ? Math.round((d.value / total) * 100) : 0}%
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DeckBreakdown({ cards, showList = false, sortOrder, sortDirection, useColorIdentity = false }: Props) {
  const [colorExpanded, setColorExpanded] = useState(false);

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

  // Pie data — exclude Commander from type chart (usually just 1)
  const typePieData: PieSlice[] = presentTypes
    .filter((t) => t !== 'Commander')
    .map((t) => ({
      label: t,
      value: byType[t]!.reduce((s, c) => s + (c.quantity ?? 1), 0),
      color: TYPE_COLORS[t],
    }));

  const colorPieData: PieSlice[] = [
    ...MTG_COLORS.filter((c) => colorCounts[c]).map((c) => ({
      label: c,
      value: colorCounts[c],
      color: MTG_PIE_COLORS[c],
    })),
    ...(colorCounts['C']
      ? [{ label: 'C', value: colorCounts['C'], color: MTG_PIE_COLORS['C'] }]
      : []),
  ];

  return (
    <Stack spacing={2}>
      {/* Summary row */}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Chip label={`${total} cards`} size="small" variant="outlined" />
        {proxyCount > 0 && (
          <Chip label={`${proxyCount} proxies`} size="small" color="warning" variant="outlined" />
        )}
      </Stack>

      {/* Combined breakdown card */}
      <Card variant="outlined">
        <CardContent sx={{ pb: colorExpanded ? '16px !important' : '12px !important', pt: 1.5 }}>
          {/* Header: type counts left, color pips right, expand toggle far right */}
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Grid container spacing={0.5} sx={{ flex: 1 }}>
              {presentTypes.map((type) => {
                const qty = byType[type]!.reduce((s, c) => s + (c.quantity ?? 1), 0);
                return (
                  <Grid key={type} size={{ xs: 6, sm: 4 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ pr: 1 }}>
                      <Typography variant="body2" color="text.secondary">{type}</Typography>
                      <Typography variant="body2" fontWeight={600}>{qty}</Typography>
                    </Stack>
                  </Grid>
                );
              })}
            </Grid>

            <Box sx={{
              alignSelf: 'stretch',
              width: '1px',
              mx: 0.5,
              flexShrink: 0,
              background: (theme) =>
                `linear-gradient(to bottom, transparent, ${theme.palette.divider} 25%, ${theme.palette.divider} 75%, transparent)`,
            }} />

            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
              {Object.keys(colorCounts).length > 0 && (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap alignItems="center">
                  {MTG_COLORS.filter((c) => colorCounts[c]).map((c) => (
                    <Stack key={c} direction="row" alignItems="center" spacing={0.5}>
                      <ManaSymbol color={c} size={20} active />
                      <Typography variant="body2" fontWeight={600}>{colorCounts[c]}</Typography>
                    </Stack>
                  ))}
                  {colorCounts['C'] ? (
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <ManaSymbol color="C" size={20} active />
                      <Typography variant="body2" fontWeight={600}>{colorCounts['C']}</Typography>
                    </Stack>
                  ) : null}
                </Stack>
              )}
              {(typePieData.length > 1 || colorPieData.length > 1) && (
                <IconButton
                  size="small"
                  onClick={() => setColorExpanded(x => !x)}
                  sx={{ transform: colorExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                >
                  <ExpandMoreIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Stack>

          {/* Collapsible pie charts */}
          <Collapse in={colorExpanded}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {typePieData.length > 1 && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    By Type
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <DonutChart data={typePieData} size={120} />
                    <ChartLegend data={typePieData} />
                  </Stack>
                </Grid>
              )}
              {colorPieData.length > 1 && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    By Color Identity
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <DonutChart data={colorPieData} size={120} />
                    <Stack spacing={0.4} sx={{ minWidth: 110 }}>
                      {colorPieData.map((d) => {
                        const ttl = colorPieData.reduce((s, x) => s + x.value, 0);
                        return (
                          <Stack key={d.label} direction="row" alignItems="center" spacing={0.75}>
                            <ManaSymbol color={d.label as 'W' | 'U' | 'B' | 'R' | 'G' | 'C'} size={16} active />
                            <Typography variant="caption" fontWeight={600} sx={{ minWidth: 22 }}>
                              {d.value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {Math.round((d.value / ttl) * 100)}%
                            </Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Stack>
                </Grid>
              )}
            </Grid>
          </Collapse>
        </CardContent>
      </Card>

      {/* Grouped card list */}
      {showList && (
        <CardListDisplay cards={cards} sortOrder={sortOrder} sortDirection={sortDirection} useColorIdentity={useColorIdentity} />
      )}
    </Stack>
  );
}
