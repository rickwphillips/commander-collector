'use client';

import { useMemo } from 'react';
import { Box, Checkbox, Chip, FormControlLabel, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ManaSymbol } from '@/components/ManaSymbol';

export const TYPE_CATEGORIES = ['Creature', 'Instant', 'Sorcery', 'Enchantment', 'Artifact', 'Planeswalker', 'Battle', 'Land'] as const;
export type TypeCategory = typeof TYPE_CATEGORIES[number];

const MTG_COLORS = ['W', 'U', 'B', 'R', 'G', 'C'] as const;

export interface DeckFilterState {
  nameFilter: string;
  typeFilter: TypeCategory[];
  colorFilter: string[];
  useColorIdentity: boolean;
  proxyOnly: boolean;
  commanderOnly: boolean;
  dfcOnly: boolean;
}

export const EMPTY_FILTERS: DeckFilterState = {
  nameFilter: '',
  typeFilter: [],
  colorFilter: [],
  useColorIdentity: false,
  proxyOnly: false,
  commanderOnly: false,
  dfcOnly: false,
};

export function hasActiveFilters(f: DeckFilterState) {
  return !!(f.nameFilter || f.typeFilter.length || f.colorFilter.length || f.proxyOnly || f.commanderOnly || f.dfcOnly);
}

export function getTypeCategory(typeLine: string | null | undefined): TypeCategory | 'Other' {
  const tl = typeLine ?? '';
  if (tl.includes('Creature'))     return 'Creature';
  if (tl.includes('Planeswalker')) return 'Planeswalker';
  if (tl.includes('Battle'))       return 'Battle';
  if (tl.includes('Instant'))      return 'Instant';
  if (tl.includes('Sorcery'))      return 'Sorcery';
  if (tl.includes('Enchantment'))  return 'Enchantment';
  if (tl.includes('Artifact'))     return 'Artifact';
  if (tl.includes('Land'))         return 'Land';
  return 'Other';
}

export function matchesFilters(
  card: { card_name: string; type_line?: string | null; colors?: string | null; color_identity?: string | null; is_proxy?: number | boolean; is_commander?: number | boolean; back_image_uri?: string | null },
  f: DeckFilterState,
): boolean {
  if (f.nameFilter && !card.card_name.toLowerCase().includes(f.nameFilter.toLowerCase())) return false;
  if (f.typeFilter.length) {
    const cat = getTypeCategory(card.type_line);
    if (!f.typeFilter.includes(cat as TypeCategory)) return false;
  }
  if (f.colorFilter.length) {
    const isLand = card.type_line?.includes('Land') ?? false;
    if (f.useColorIdentity) {
      // Color identity mode: all pips anywhere on card; basic lands match their mana identity
      const ci = card.color_identity ?? '';
      const isColorless = ci === '' && !isLand;
      if (!f.colorFilter.some(col => col === 'C' ? isColorless : ci.includes(col))) return false;
    } else {
      // Color mode: mana cost only; lands are colorless (no mana cost)
      const colors = card.colors ?? '';
      const isColorless = isLand || colors === '';
      if (!f.colorFilter.some(col => col === 'C' ? isColorless : colors.includes(col))) return false;
    }
  }
  if (f.proxyOnly && !card.is_proxy) return false;
  if (f.commanderOnly && !card.is_commander) return false;
  if (f.dfcOnly && !card.back_image_uri) return false;
  return true;
}

interface Props {
  filters: DeckFilterState;
  onChange: (f: DeckFilterState) => void;
  resultCount?: number;
  totalCount?: number;
  /** Cards in the current view — used to show only relevant filter chips */
  cards?: { type_line?: string | null; colors?: string | null; color_identity?: string | null; is_proxy?: number | boolean; is_commander?: number | boolean; back_image_uri?: string | null; }[];
}

export function DeckFilters({ filters, onChange, resultCount, totalCount, cards = [] }: Props) {
  const { nameFilter, typeFilter, colorFilter, useColorIdentity, proxyOnly, commanderOnly, dfcOnly } = filters;

  // Derive which filters are actually relevant to the current card list
  const presentTypes = useMemo(() => {
    const s = new Set<TypeCategory>();
    for (const c of cards) {
      const cat = getTypeCategory(c.type_line);
      if (cat !== 'Other') s.add(cat as TypeCategory);
    }
    return TYPE_CATEGORIES.filter(t => s.has(t));
  }, [cards]);

  const presentColors = useMemo(() => {
    const s = new Set<string>();
    for (const c of cards) {
      const ci = c.color_identity ?? '';
      if (ci === '') s.add('C');
      else for (const ch of ci) s.add(ch);
    }
    return MTG_COLORS.filter(c => s.has(c));
  }, [cards]);

  const hasProxies     = useMemo(() => cards.some(c => c.is_proxy), [cards]);
  const hasCommanders  = useMemo(() => cards.some(c => c.is_commander), [cards]);
  const hasDfcs        = useMemo(() => cards.some(c => c.back_image_uri), [cards]);

  const set = (patch: Partial<DeckFilterState>) => onChange({ ...filters, ...patch });

  const toggleType = (t: TypeCategory) =>
    set({ typeFilter: typeFilter.includes(t) ? typeFilter.filter(x => x !== t) : [...typeFilter, t] });

  const toggleColor = (c: string) =>
    set({ colorFilter: colorFilter.includes(c) ? colorFilter.filter(x => x !== c) : [...colorFilter, c] });

  const active = hasActiveFilters(filters);

  return (
    <Stack spacing={1} sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <TextField
          size="small"
          placeholder="Search cards…"
          value={nameFilter}
          onChange={e => set({ nameFilter: e.target.value })}
          sx={{ width: 200 }}
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
            },
          }}
        />

        {/* Color identity toggle */}
        {presentColors.length > 0 && (
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={useColorIdentity}
                onChange={e => set({ useColorIdentity: e.target.checked, colorFilter: [] })}
                sx={{ py: 0 }}
              />
            }
            label={<Typography variant="caption">Identity</Typography>}
            sx={{ m: 0 }}
          />
        )}

        {/* Color pips — only colors present in the list */}
        {presentColors.length > 0 && (
          <Stack direction="row" spacing={0.5} alignItems="center">
            {presentColors.map(c => (
              <Box
                key={c}
                onClick={() => toggleColor(c)}
                sx={{
                  cursor: 'pointer',
                  opacity: colorFilter.length === 0 || colorFilter.includes(c) ? 1 : 0.3,
                  transform: colorFilter.includes(c) ? 'scale(1.15)' : 'scale(1)',
                  transition: 'opacity 0.15s, transform 0.15s',
                }}
              >
                <ManaSymbol color={c as 'W' | 'U' | 'B' | 'R' | 'G' | 'C'} size={26} active={colorFilter.includes(c)} />
              </Box>
            ))}
          </Stack>
        )}

        {/* Type chips — only types present in the list */}
        {presentTypes.length > 0 && (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {presentTypes.map(t => (
              <Chip
                key={t}
                label={t}
                size="small"
                variant={typeFilter.includes(t) ? 'filled' : 'outlined'}
                color={typeFilter.includes(t) ? 'primary' : 'default'}
                onClick={() => toggleType(t)}
                sx={{ height: 24, fontSize: '0.7rem' }}
              />
            ))}
          </Stack>
        )}

        {hasProxies && (
          <Chip
            label="Proxy"
            size="small"
            variant={proxyOnly ? 'filled' : 'outlined'}
            color={proxyOnly ? 'warning' : 'default'}
            onClick={() => set({ proxyOnly: !proxyOnly })}
            sx={{ height: 24, fontSize: '0.7rem' }}
          />
        )}
        {hasCommanders && (
          <Chip
            label="Commander"
            size="small"
            variant={commanderOnly ? 'filled' : 'outlined'}
            color={commanderOnly ? 'secondary' : 'default'}
            onClick={() => set({ commanderOnly: !commanderOnly })}
            sx={{ height: 24, fontSize: '0.7rem' }}
          />
        )}
        {hasDfcs && (
          <Chip
            label="DFC"
            size="small"
            variant={dfcOnly ? 'filled' : 'outlined'}
            color={dfcOnly ? 'info' : 'default'}
            onClick={() => set({ dfcOnly: !dfcOnly })}
            sx={{ height: 24, fontSize: '0.7rem' }}
          />
        )}

        {active && resultCount !== undefined && totalCount !== undefined && (
          <Typography variant="caption" color="text.secondary">
            {resultCount} / {totalCount}
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}
