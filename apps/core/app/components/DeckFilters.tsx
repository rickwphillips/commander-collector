'use client';

import { useMemo } from 'react';
import { Box, Button, Chip, IconButton, InputAdornment, MenuItem, Select, Stack, TextField, Tooltip, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import BoltIcon from '@mui/icons-material/Bolt';
import CategoryIcon from '@mui/icons-material/Category';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import PaletteIcon from '@mui/icons-material/Palette';
import SearchIcon from '@mui/icons-material/Search';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import { ManaSymbol } from '@/components/ManaSymbol';
import { ASSET_BASE } from '@/lib/api';

export const TYPE_CATEGORIES = ['Creature', 'Instant', 'Sorcery', 'Enchantment', 'Artifact', 'Planeswalker', 'Battle', 'Land'] as const;
export type TypeCategory = typeof TYPE_CATEGORIES[number];

export type SortOrder = 'name' | 'type' | 'color' | 'quantity' | 'mana';
export type SortDirection = 'asc' | 'desc';
export type ColorMode = 'or' | 'and' | 'exact';

const MTG_COLORS = ['W', 'U', 'B', 'R', 'G', 'C'] as const;
const BASIC_COLORS = new Set(['W', 'U', 'B', 'R', 'G', 'C']);

/** Interleaved color-wheel order: basic colors with adjacent hybrids between them */
const COLOR_WHEEL_ORDER = ['W', 'WU', 'U', 'UB', 'B', 'BR', 'R', 'RG', 'G', 'GW', 'GU', 'RW', 'BG', 'UR', 'WB', 'C'] as const;

/** Non-adjacent / 2-cost hybrids shown in a second wheel row if present */
const OTHER_HYBRID_ORDER = ['2W', '2U', '2B', '2R', '2G', 'CW', 'CU', 'CB', 'CR', 'CG'] as const;

/** Phyrexian symbols in WUBRG order — always in their own row */
const PHYREXIAN_ORDER = ['WP', 'UP', 'BP', 'RP', 'GP', 'CP', 'WUP', 'WBP', 'UBP', 'URP', 'BRP', 'BGP', 'RGP', 'RWP', 'GUP', 'GWP'] as const;

/** Mana symbol codes (slash removed) that can appear in mana costs and are filter-worthy */
const COLOR_NAMES: Record<string, string> = {
  W: 'White', U: 'Blue', B: 'Black', R: 'Red', G: 'Green', C: 'Colorless',
};

const SYMBOL_NAMES: Record<string, string> = {
  WU: 'White/Blue Hybrid', WB: 'White/Black Hybrid',
  UB: 'Blue/Black Hybrid',  UR: 'Blue/Red Hybrid',
  BR: 'Black/Red Hybrid',   BG: 'Black/Green Hybrid',
  RG: 'Red/Green Hybrid',   RW: 'Red/White Hybrid',
  GW: 'Green/White Hybrid', GU: 'Green/Blue Hybrid',
  WP: 'Phyrexian White', UP: 'Phyrexian Blue',   BP: 'Phyrexian Black',
  RP: 'Phyrexian Red',   GP: 'Phyrexian Green',  CP: 'Phyrexian Colorless',
  WUP: 'Phyrexian White/Blue', WBP: 'Phyrexian White/Black',
  UBP: 'Phyrexian Blue/Black', URP: 'Phyrexian Blue/Red',
  BRP: 'Phyrexian Black/Red',  BGP: 'Phyrexian Black/Green',
  RGP: 'Phyrexian Red/Green',  RWP: 'Phyrexian Red/White',
  GUP: 'Phyrexian Green/Blue', GWP: 'Phyrexian Green/White',
  '2W': '2/White Hybrid', '2U': '2/Blue Hybrid', '2B': '2/Black Hybrid',
  '2R': '2/Red Hybrid',   '2G': '2/Green Hybrid',
  CW: 'Colorless/White', CU: 'Colorless/Blue', CB: 'Colorless/Black',
  CR: 'Colorless/Red',   CG: 'Colorless/Green',
};

const FILTERABLE_SYMBOLS = new Set([
  // Hybrid two-color
  'WU','WB','UB','UR','BR','BG','RG','RW','GW','GU',
  // Phyrexian single-color
  'WP','UP','BP','RP','GP','CP',
  // Phyrexian hybrid
  'WUP','WBP','UBP','URP','BRP','BGP','RGP','RWP','GUP','GWP',
  // 2-cost hybrid
  '2W','2U','2B','2R','2G',
  // Colorless hybrid
  'CW','CU','CB','CR','CG',
]);

export interface DeckFilterState {
  nameFilter: string;
  typeFilter: TypeCategory[];
  cmcFilter: number[];
  colorFilter: string[];
  colorMode: ColorMode;
  useColorIdentity: boolean;
  manaSymbolFilter: string[];
  proxyOnly: boolean;
  commanderOnly: boolean;
  dfcOnly: boolean;
  sortOrder: SortOrder;
  sortDirection: SortDirection;
}

export const EMPTY_FILTERS: DeckFilterState = {
  nameFilter: '',
  typeFilter: [],
  cmcFilter: [],
  colorFilter: [],
  colorMode: 'or',
  useColorIdentity: false,
  manaSymbolFilter: [],
  proxyOnly: false,
  commanderOnly: false,
  dfcOnly: false,
  sortOrder: 'name',
  sortDirection: 'asc',
};

export function hasActiveFilters(f: DeckFilterState) {
  return !!(f.nameFilter || f.typeFilter.length || f.cmcFilter.length || f.colorFilter.length || f.manaSymbolFilter.length || f.proxyOnly || f.commanderOnly || f.dfcOnly);
}

export function getTypeCategory(typeLine: string | null | undefined): TypeCategory | 'Other' {
  const tl = typeLine ?? '';
  if (tl.includes('Creature'))     return 'Creature';
  if (tl.includes('Planeswalker')) return 'Planeswalker';
  if (tl.includes('Battle'))       return 'Battle';
  if (tl.includes('Land'))         return 'Land';
  if (tl.includes('Instant'))      return 'Instant';
  if (tl.includes('Sorcery'))      return 'Sorcery';
  if (tl.includes('Enchantment'))  return 'Enchantment';
  if (tl.includes('Artifact'))     return 'Artifact';
  return 'Other';
}

export function matchesFilters(
  card: { card_name: string; type_line?: string | null; mana_cost?: string | null; colors?: string | null; color_identity?: string | null; is_proxy?: number | boolean; is_commander?: number | boolean; back_image_uri?: string | null },
  f: DeckFilterState,
): boolean {
  if (f.nameFilter && !card.card_name.toLowerCase().includes(f.nameFilter.toLowerCase())) return false;
  if (f.typeFilter.length) {
    const cat = getTypeCategory(card.type_line);
    if (!f.typeFilter.includes(cat as TypeCategory)) return false;
  }
  if (f.cmcFilter.length) {
    if (!f.cmcFilter.includes(parseManaValue(card.mana_cost))) return false;
  }
  if (f.colorFilter.length) {
    const isLand = card.type_line?.includes('Land') ?? false;
    // Lands always use color_identity for filtering (their colors field is always empty)
    const raw = (f.useColorIdentity || isLand) ? (card.color_identity ?? '') : (card.colors ?? '');
    const cardColors = [...raw].filter(ch => 'WUBRG'.includes(ch));
    const isColorless = cardColors.length === 0;
    const cardSet = isColorless ? new Set(['C']) : new Set(cardColors);
    const sel = f.colorFilter;

    if (f.colorMode === 'or') {
      if (!sel.some(col => cardSet.has(col))) return false;
    } else if (f.colorMode === 'and') {
      if (!sel.every(col => cardSet.has(col))) return false;
    } else {
      // exact: card's color set must equal selection exactly
      if (sel.length !== cardSet.size || !sel.every(col => cardSet.has(col))) return false;
    }
  }
  if (f.manaSymbolFilter.length) {
    const costSymbols = new Set(
      [...(card.mana_cost ?? '').matchAll(/\{([^}]+)\}/g)].map(m => m[1].replace('/', ''))
    );
    if (!f.manaSymbolFilter.some(sym => costSymbols.has(sym))) return false;
  }
  if (f.proxyOnly && !card.is_proxy) return false;
  if (f.commanderOnly && !card.is_commander) return false;
  if (f.dfcOnly && !card.back_image_uri) return false;
  return true;
}

// ── Sort ──────────────────────────────────────────────────────────────────────

const TYPE_SORT_ORDER: Record<string, number> = {
  Commander: 0, Creature: 1, Planeswalker: 2, Battle: 3,
  Instant: 4, Sorcery: 5, Enchantment: 6, Artifact: 7, Land: 8, Other: 9,
};

const COLOR_SORT_ORDER: Record<string, number> = { W: 0, U: 1, B: 2, R: 3, G: 4, C: 5 };

function parseManaValue(manaCost: string | null | undefined): number {
  if (!manaCost) return 0;
  let mv = 0;
  for (const m of manaCost.matchAll(/\{([^}]+)\}/g)) {
    const inner = m[1];
    const n = Number(inner);
    if (!isNaN(n)) mv += n;
    else if (inner !== 'X') mv += 1;
  }
  return mv;
}

function firstColorOrder(colorIdentity: string | null | undefined): number {
  const ci = colorIdentity ?? '';
  if (!ci) return COLOR_SORT_ORDER['C'];
  for (const ch of ci) if (ch in COLOR_SORT_ORDER) return COLOR_SORT_ORDER[ch];
  return COLOR_SORT_ORDER['C'];
}

export function sortCards<T extends {
  card_name: string;
  type_line?: string | null;
  color_identity?: string | null;
  quantity?: number;
  mana_cost?: string | null;
  is_commander?: number | boolean;
}>(cards: T[], order: SortOrder, direction: SortDirection = 'asc'): T[] {
  const arr = [...cards];
  const dir = direction === 'desc' ? -1 : 1;
  const byName = (a: T, b: T) => dir * a.card_name.localeCompare(b.card_name);
  switch (order) {
    case 'name':
      return arr.sort(byName);
    case 'type':
      return arr.sort((a, b) => {
        const ta = a.is_commander ? 0 : (TYPE_SORT_ORDER[getTypeCategory(a.type_line)] ?? 9);
        const tb = b.is_commander ? 0 : (TYPE_SORT_ORDER[getTypeCategory(b.type_line)] ?? 9);
        return ta !== tb ? dir * (ta - tb) : byName(a, b);
      });
    case 'color':
      return arr.sort((a, b) => {
        const diff = firstColorOrder(a.color_identity) - firstColorOrder(b.color_identity);
        return diff !== 0 ? dir * diff : byName(a, b);
      });
    case 'quantity':
      return arr.sort((a, b) => {
        const diff = (a.quantity ?? 1) - (b.quantity ?? 1);
        return diff !== 0 ? dir * diff : byName(a, b);
      });
    case 'mana':
      return arr.sort((a, b) => {
        const diff = parseManaValue(a.mana_cost) - parseManaValue(b.mana_cost);
        return diff !== 0 ? dir * diff : byName(a, b);
      });
    default:
      return arr;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  filters: DeckFilterState;
  onChange: (f: DeckFilterState) => void;
  resultCount?: number;
  totalCount?: number;
  /** Cards in the current view — used to show only relevant filter chips */
  cards?: { card_name: string; type_line?: string | null; mana_cost?: string | null; colors?: string | null; color_identity?: string | null; is_proxy?: number | boolean; is_commander?: number | boolean; back_image_uri?: string | null; }[];
}

export function DeckFilters({ filters, onChange, resultCount, totalCount, cards = [] }: Props) {
  const { nameFilter, typeFilter, cmcFilter, colorFilter, colorMode, useColorIdentity, manaSymbolFilter, proxyOnly, commanderOnly, dfcOnly, sortOrder, sortDirection } = filters;
  const COLOR_MODE_CYCLE: ColorMode[] = ['or', 'and', 'exact'];

  // For each chip dimension, filter by all OTHER active filters so chips update reactively
  const withoutType       = useMemo(() => ({ ...filters, typeFilter: [] as TypeCategory[] }), [filters]);
  const withoutCmc        = useMemo(() => ({ ...filters, cmcFilter: [] as number[] }), [filters]);
  const withoutColor      = useMemo(() => ({ ...filters, colorFilter: [] as string[] }), [filters]);
  const withoutManaSymbol = useMemo(() => ({ ...filters, manaSymbolFilter: [] as string[] }), [filters]);
  const withoutProxy    = useMemo(() => ({ ...filters, proxyOnly: false }), [filters]);
  const withoutCmd      = useMemo(() => ({ ...filters, commanderOnly: false }), [filters]);
  const withoutDfc      = useMemo(() => ({ ...filters, dfcOnly: false }), [filters]);

  // Full pool (no cross-filtering) — defines what chips to SHOW
  const allTypes = useMemo(() => {
    const s = new Set<TypeCategory>();
    for (const c of cards) {
      const cat = getTypeCategory(c.type_line);
      if (cat !== 'Other') s.add(cat as TypeCategory);
    }
    return TYPE_CATEGORIES.filter(t => s.has(t));
  }, [cards]);

  const allCmcs = useMemo(() => {
    const s = new Set<number>();
    for (const c of cards) s.add(parseManaValue(c.mana_cost));
    return [...s].sort((a, b) => a - b);
  }, [cards]);

  const anyCommanders = useMemo(() => cards.some(c => !!c.is_commander),     [cards]);
  const anyProxies    = useMemo(() => cards.some(c => !!c.is_proxy),         [cards]);
  const anyDfcs       = useMemo(() => cards.some(c => !!c.back_image_uri),   [cards]);

  // Cross-filtered — defines what chips are VALID given other active filters
  const presentTypes = useMemo(() => {
    const s = new Set<TypeCategory>();
    for (const c of cards) {
      if (!matchesFilters(c, withoutType)) continue;
      const cat = getTypeCategory(c.type_line);
      if (cat !== 'Other') s.add(cat as TypeCategory);
    }
    return new Set(TYPE_CATEGORIES.filter(t => s.has(t)));
  }, [cards, withoutType]);

  const presentCmcs = useMemo(() => {
    const s = new Set<number>();
    for (const c of cards) {
      if (!matchesFilters(c, withoutCmc)) continue;
      s.add(parseManaValue(c.mana_cost));
    }
    return s;
  }, [cards, withoutCmc]);

  const extractManaSymbols = (subset: typeof cards) => {
    const s = new Set<string>();
    for (const c of subset) {
      for (const m of (c.mana_cost ?? '').matchAll(/\{([^}]+)\}/g)) {
        const code = m[1].replace('/', '');
        if (FILTERABLE_SYMBOLS.has(code)) s.add(code);
      }
    }
    return s;
  };

  const allManaSymbols = useMemo(() => extractManaSymbols(cards),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cards]);

  const validManaSymbols = useMemo(
    () => extractManaSymbols(cards.filter(c => matchesFilters(c, withoutManaSymbol))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cards, withoutManaSymbol],
  );

  const extractColors = (subset: typeof cards) => {
    const s = new Set<string>();
    for (const c of subset) {
      const isLand = c.type_line?.includes('Land') ?? false;
      if (useColorIdentity || isLand) {
        // Always use color_identity for lands; use it for everyone when identity mode is on
        const ci = c.color_identity ?? '';
        if (ci === '') s.add('C');
        else for (const ch of ci) if ('WUBRG'.includes(ch)) s.add(ch);
      } else {
        const col = c.colors ?? '';
        if (col === '') s.add('C');
        else for (const ch of col) if ('WUBRG'.includes(ch)) s.add(ch);
      }
    }
    return s;
  };

  // All colors present in the full unfiltered card pool
  const allColors = useMemo(
    () => MTG_COLORS.filter(c => extractColors(cards).has(c)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cards, useColorIdentity],
  );

  // Colors still available given every OTHER active filter
  const validColors = useMemo(
    () => new Set(MTG_COLORS.filter(c => extractColors(cards.filter(c2 => matchesFilters(c2, withoutColor))).has(c))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cards, withoutColor, useColorIdentity],
  );

  const hasProxies    = useMemo(() => cards.some(c => matchesFilters(c, withoutProxy) && !!c.is_proxy),    [cards, withoutProxy]);
  const hasCommanders = useMemo(() => cards.some(c => matchesFilters(c, withoutCmd)   && !!c.is_commander), [cards, withoutCmd]);
  const hasDfcs       = useMemo(() => cards.some(c => matchesFilters(c, withoutDfc)   && !!c.back_image_uri), [cards, withoutDfc]);

  const set = (patch: Partial<DeckFilterState>) => onChange({ ...filters, ...patch });
  const clearFilters = () => onChange({ ...EMPTY_FILTERS, sortOrder, sortDirection });

  const toggleType  = (t: TypeCategory) =>
    set({ typeFilter: typeFilter.includes(t) ? typeFilter.filter(x => x !== t) : [...typeFilter, t] });

  const toggleCmc        = (n: number) =>
    set({ cmcFilter: cmcFilter.includes(n) ? cmcFilter.filter(x => x !== n) : [...cmcFilter, n] });

  const toggleManaSymbol = (sym: string) =>
    set({ manaSymbolFilter: manaSymbolFilter.includes(sym) ? manaSymbolFilter.filter(x => x !== sym) : [...manaSymbolFilter, sym] });

  const toggleColor = (c: string) =>
    set({ colorFilter: colorFilter.includes(c) ? colorFilter.filter(x => x !== c) : [...colorFilter, c] });

  const active = hasActiveFilters(filters);

  const VDivider = () => (
    <Box sx={{
      alignSelf: 'stretch',
      width: '1px',
      mx: 0.5,
      background: (theme) =>
        `linear-gradient(to bottom, transparent, ${theme.palette.divider} 30%, ${theme.palette.divider} 70%, transparent)`,
      flexShrink: 0,
    }} />
  );

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

        <VDivider />

        {/* Sort order */}
        <Select
          size="small"
          value={sortOrder}
          onChange={e => set({ sortOrder: e.target.value as SortOrder })}
          startAdornment={
            <Tooltip title={sortDirection === 'asc' ? 'Ascending — click to reverse' : 'Descending — click to reverse'}>
              <Box
                onClick={e => { e.stopPropagation(); set({ sortDirection: sortDirection === 'asc' ? 'desc' : 'asc' }); }}
                sx={{ display: 'flex', alignItems: 'center', mr: 0.5, color: 'text.secondary', cursor: 'pointer' }}
              >
                {sortOrder === 'name'     ? <SortByAlphaIcon        fontSize="small" /> :
                 sortOrder === 'type'     ? <CategoryIcon           fontSize="small" /> :
                 sortOrder === 'color'    ? <PaletteIcon            fontSize="small" /> :
                 sortOrder === 'mana'     ? <BoltIcon               fontSize="small" /> :
                                            <FormatListNumberedIcon fontSize="small" />}
                {sortDirection === 'asc'
                  ? <ArrowUpwardIcon   sx={{ fontSize: 12, ml: '1px' }} />
                  : <ArrowDownwardIcon sx={{ fontSize: 12, ml: '1px' }} />}
              </Box>
            </Tooltip>
          }
          sx={{ fontSize: '0.8rem', height: 40, minWidth: 130 }}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="type">Type</MenuItem>
          <MenuItem value="color">Color</MenuItem>
          <MenuItem value="mana">Mana Value</MenuItem>
          <MenuItem value="quantity">Quantity</MenuItem>
        </Select>

        {(allColors.length > 0 || allManaSymbols.size > 0) && <VDivider />}

        {/* Color pips + mode buttons */}
        {(allColors.length > 0 || allManaSymbols.size > 0) && (() => {
          const anyPipSelected = colorFilter.length > 0 || manaSymbolFilter.length > 0;

          const renderPip = (sym: string) => {
            const isBasic = BASIC_COLORS.has(sym);
            const inDeck  = isBasic ? allColors.includes(sym as typeof MTG_COLORS[number]) : allManaSymbols.has(sym);

            // Not in deck at all — skip entirely
            if (!inDeck) return null;

            const selected  = isBasic ? colorFilter.includes(sym) : manaSymbolFilter.includes(sym);
            const valid     = isBasic ? validColors.has(sym as typeof MTG_COLORS[number]) : validManaSymbols.has(sym);
            const disabled  = !valid && !selected;
            const opacity   = disabled ? 0.2 : (selected || !anyPipSelected) ? 1 : 0.4;
            const onClick   = disabled ? undefined : () => isBasic ? toggleColor(sym) : toggleManaSymbol(sym);
            const label     = isBasic ? (COLOR_NAMES[sym] ?? sym) : (SYMBOL_NAMES[sym] ?? sym);

            return (
              <Tooltip key={sym} title={label} placement="top">
                <Box
                  onClick={onClick}
                  sx={{
                    cursor: disabled ? 'default' : 'pointer',
                    opacity,
                    transform: selected ? 'scale(1.15)' : 'scale(1)',
                    transition: 'opacity 0.15s, transform 0.15s',
                  }}
                >
                  {isBasic
                    ? <ManaSymbol color={sym as 'W'|'U'|'B'|'R'|'G'|'C'} size={26} active={selected} tooltip={false} />
                    : <Box component="img" src={`${ASSET_BASE}/mana/${sym}.svg`} alt={sym}
                        sx={{
                          width: 26, height: 26, display: 'block', borderRadius: '50%',
                          outline: selected ? '2px solid' : 'none',
                          outlineColor: 'warning.main',
                          outlineOffset: 1,
                        }} />
                  }
                </Box>
              </Tooltip>
            );
          };

          const wheelPips      = COLOR_WHEEL_ORDER.map(renderPip).filter(Boolean);
          const otherPips      = OTHER_HYBRID_ORDER.map(renderPip).filter(Boolean);
          const phyrexianPips  = PHYREXIAN_ORDER.map(renderPip).filter(Boolean);

          return (
            <Stack direction="column" spacing={0.5}>
              {wheelPips.length > 0 && (
                <Stack direction="row" spacing={1} alignItems="center">{wheelPips}</Stack>
              )}
              {otherPips.length > 0 && (
                <Stack direction="row" spacing={1} alignItems="center">{otherPips}</Stack>
              )}
              {phyrexianPips.length > 0 && (
                <Stack direction="row" spacing={1} alignItems="center">{phyrexianPips}</Stack>
              )}
              <Stack direction="row" spacing={0.5} justifyContent="flex-start">
                <Tooltip title={colorMode === 'or' ? 'Match any selected color' : colorMode === 'and' ? 'Match all selected colors' : 'Match exactly these colors'}>
                  <Button
                    size="small"
                    variant="contained"
                    color={colorMode === 'exact' ? 'secondary' : colorMode === 'and' ? 'primary' : 'inherit'}
                    onClick={() => set({ colorMode: COLOR_MODE_CYCLE[(COLOR_MODE_CYCLE.indexOf(colorMode) + 1) % 3], colorFilter: [] })}
                    sx={{ minWidth: 0, px: 1, height: 22, fontSize: '0.65rem', fontWeight: 700, lineHeight: 1 }}
                  >
                    {colorMode.toUpperCase()}
                  </Button>
                </Tooltip>
                <Tooltip title={useColorIdentity ? 'Filtering by color identity — click to switch to card color' : 'Filtering by card color — click to switch to color identity'}>
                  <Button
                    size="small"
                    variant={useColorIdentity ? 'contained' : 'outlined'}
                    color="inherit"
                    onClick={() => set({ useColorIdentity: !useColorIdentity, colorFilter: [] })}
                    sx={{ minWidth: 0, px: 1, height: 22, fontSize: '0.65rem', fontWeight: 700, lineHeight: 1 }}
                  >
                    {useColorIdentity ? 'Identity' : 'Color'}
                  </Button>
                </Tooltip>
              </Stack>
            </Stack>
          );
        })()}

        {(allTypes.length > 0 || anyCommanders || allCmcs.length > 0 || anyProxies || anyDfcs) && <VDivider />}

        {/* Type + CMC chips */}
        {(allTypes.length > 0 || anyCommanders || allCmcs.length > 0) && (
          <Stack direction="column" spacing={0.5}>
            {(allTypes.length > 0 || anyCommanders) && (
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap justifyContent="flex-start">
                {allTypes.map(t => {
                  const disabled = !presentTypes.has(t) && !typeFilter.includes(t);
                  const selected = typeFilter.includes(t);
                  return (
                    <Chip
                      key={t}
                      label={t}
                      size="small"
                      variant={selected ? 'filled' : 'outlined'}
                      color={selected ? 'primary' : 'default'}
                      onClick={disabled ? undefined : () => toggleType(t)}
                      sx={{ height: 24, fontSize: '0.7rem', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.2 : selected ? 1 : typeFilter.length === 0 ? 1 : 0.5, transition: 'opacity 0.2s' }}
                    />
                  );
                })}
                {anyCommanders && (() => {
                  const disabled = !hasCommanders && !commanderOnly;
                  return (
                    <Chip
                      label="Commander"
                      size="small"
                      variant={commanderOnly ? 'filled' : 'outlined'}
                      color={commanderOnly ? 'secondary' : 'default'}
                      onClick={disabled ? undefined : () => set({ commanderOnly: !commanderOnly })}
                      sx={{ height: 24, fontSize: '0.7rem', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.2 : commanderOnly ? 1 : typeFilter.length === 0 && !commanderOnly ? 1 : 0.5, transition: 'opacity 0.2s' }}
                    />
                  );
                })()}
              </Stack>
            )}
            {allCmcs.length > 0 && (
              <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap justifyContent="flex-start">
                {allCmcs.map(n => {
                  const disabled = !presentCmcs.has(n) && !cmcFilter.includes(n);
                  const selected = cmcFilter.includes(n);
                  return (
                    <Chip
                      key={n}
                      label={n}
                      size="small"
                      variant={selected ? 'filled' : 'outlined'}
                      color={selected ? 'primary' : 'default'}
                      onClick={disabled ? undefined : () => toggleCmc(n)}
                      sx={{ height: 24, fontSize: '0.7rem', minWidth: 32, cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.2 : selected ? 1 : cmcFilter.length === 0 ? 1 : 0.5, transition: 'opacity 0.2s' }}
                    />
                  );
                })}
              </Stack>
            )}
          </Stack>
        )}

        {anyProxies && (() => {
          const disabled = !hasProxies && !proxyOnly;
          return (
            <Chip
              label="Proxy"
              size="small"
              variant={proxyOnly ? 'filled' : 'outlined'}
              color={proxyOnly ? 'warning' : 'default'}
              onClick={disabled ? undefined : () => set({ proxyOnly: !proxyOnly })}
              sx={{ height: 24, fontSize: '0.7rem', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.2 : 1, transition: 'opacity 0.2s' }}
            />
          );
        })()}
        {anyDfcs && (() => {
          const disabled = !hasDfcs && !dfcOnly;
          return (
            <Chip
              label="DFC"
              size="small"
              variant={dfcOnly ? 'filled' : 'outlined'}
              color={dfcOnly ? 'info' : 'default'}
              onClick={disabled ? undefined : () => set({ dfcOnly: !dfcOnly })}
              sx={{ height: 24, fontSize: '0.7rem', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.2 : 1, transition: 'opacity 0.2s' }}
            />
          );
        })()}

        {(resultCount !== undefined && totalCount !== undefined) || active ? (
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {active && (
              <Tooltip title="Clear filters">
                <IconButton size="small" onClick={clearFilters} sx={{ color: 'warning.main' }}>
                  <FilterAltOffIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {resultCount !== undefined && totalCount !== undefined && (
              <Typography variant="caption" color="text.secondary">
                {resultCount} / {totalCount}
              </Typography>
            )}
          </Box>
        ) : null}
      </Stack>
    </Stack>
  );
}
