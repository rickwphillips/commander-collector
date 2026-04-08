'use client';

/**
 * CardFilterBar — unified filter-and-sort control surface.
 *
 * Controlled: caller owns state via `state` + `onChange`.
 * Does NOT filter cards itself — emits the new FilterSortState to the consumer,
 * which calls filterCards() + sortCards() from lib/cards/filter.ts.
 *
 * Color-identity axiom (enforced in the picker UI):
 *   C (colorless) is mutually exclusive with W/U/B/R/G.
 *   Selecting C clears WUBRG; selecting any WUBRG pip clears C.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import SearchIcon from '@mui/icons-material/Search';

import { ManaSymbol } from '@/components/ManaSymbol';
import { type FilterSortState } from '@/lib/cards/filter';
import { TYPE_CATEGORIES, type TypeCategory } from '@/lib/cards/categorize';
import type { Card } from '@/lib/cards/types';
import type { ColorIdentitySymbol } from '@/lib/cards/colorIdentity';

// CardLookupField is written by a sibling agent — import its expected shape.
// It will exist by the time the component is exercised in tests.
import { CardLookupField } from '@/components/cards/CardLookupField';

// ── Constants ─────────────────────────────────────────────────────────────────

/** WUBRG + C in color-wheel order for the picker row */
const PICKER_COLORS: ColorIdentitySymbol[] = ['W', 'U', 'B', 'R', 'G', 'C'];

/** Default state — used by "clear" action */
const DEFAULT_STATE: FilterSortState = { sort: 'name', sortDir: 'asc' };

const COLOR_MODE_LABELS: Record<NonNullable<FilterSortState['colorMode']>, string> = {
  or:    'OR',
  and:   'AND',
  exact: 'EXACT',
};

const COLOR_MODE_TIPS: Record<NonNullable<FilterSortState['colorMode']>, string> = {
  or:    'Match any selected color',
  and:   'Match all selected colors',
  exact: 'Match exactly these colors',
};

const SORT_OPTIONS: Array<{ value: FilterSortState['sort']; label: string }> = [
  { value: 'name',  label: 'Name' },
  { value: 'cmc',   label: 'Mana Value' },
  { value: 'color', label: 'Color' },
  { value: 'type',  label: 'Type' },
  { value: 'qty',   label: 'Quantity' },
];

const COLOR_MODE_CYCLE: NonNullable<FilterSortState['colorMode']>[] = ['or', 'and', 'exact'];

// ── Prop types ────────────────────────────────────────────────────────────────

export interface EnabledFacets {
  search?:  boolean;
  colors?:  boolean;
  types?:   boolean;
  cmc?:     boolean;
  sort?:    boolean;
  contains?: boolean;
}

export interface CardFilterBarProps {
  state: FilterSortState;
  onChange: (state: FilterSortState) => void;
  /** Optional card pool — used to populate dynamic facet chips (types, cmc). */
  cards?: Card[];
  /** When true, collapses behind a "Filter" button (mobile). */
  compact?: boolean;
  /** Which facets to show. All default to true. */
  enabledFacets?: EnabledFacets;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isActive(state: FilterSortState): boolean {
  return !!(
    (state.search && state.search.trim() !== '') ||
    (state.colors && state.colors.length > 0) ||
    (state.types  && state.types.length  > 0) ||
    (state.cmcFilter?.values && state.cmcFilter.values.length > 0) ||
    (state.cmcFilter?.min !== undefined) ||
    (state.cmcFilter?.max !== undefined) ||
    state.contains != null ||
    state.sort     !== 'name' ||
    state.sortDir  !== 'asc'
  );
}

function allEnabled(enabled: EnabledFacets | undefined): Required<EnabledFacets> {
  return {
    search:   enabled?.search   ?? true,
    colors:   enabled?.colors   ?? true,
    types:    enabled?.types    ?? true,
    cmc:      enabled?.cmc      ?? true,
    sort:     enabled?.sort     ?? true,
    contains: enabled?.contains ?? true,
  };
}

/** Extract unique CMC values from the card pool, sorted ascending. */
function extractCmcs(cards: Card[]): number[] {
  const s = new Set<number>();
  for (const c of cards) {
    let mv = 0;
    for (const m of (c.mana_cost ?? '').matchAll(/\{([^}]+)\}/g)) {
      const inner = m[1];
      const n = Number(inner);
      if (!isNaN(n)) mv += n;
      else if (inner !== 'X') mv += 1;
    }
    s.add(mv);
  }
  return [...s].sort((a, b) => a - b);
}

/** Extract unique TypeCategories present in the card pool, in canonical order. */
function extractTypes(cards: Card[]): TypeCategory[] {
  const s = new Set<TypeCategory>();
  for (const c of cards) {
    const tl = c.type_line ?? '';
    if (tl.includes('Creature'))     s.add('creature');
    else if (tl.includes('Planeswalker')) s.add('planeswalker');
    else if (tl.includes('Battle'))  s.add('battle');
    else if (tl.includes('Land'))    s.add('land');
    else if (tl.includes('Instant')) s.add('instant');
    else if (tl.includes('Sorcery')) s.add('sorcery');
    else if (tl.includes('Enchantment')) s.add('enchantment');
    else if (tl.includes('Artifact')) s.add('artifact');
    else s.add('other');
  }
  // Return in TYPE_CATEGORIES order
  return TYPE_CATEGORIES.filter(t => s.has(t));
}

// ── Color picker (inner) ──────────────────────────────────────────────────────

interface ColorPickerProps {
  selected: ColorIdentitySymbol[];
  mode: NonNullable<FilterSortState['colorMode']>;
  onToggleColor: (c: ColorIdentitySymbol) => void;
  onCycleMode: () => void;
}

function ColorPicker({ selected, mode, onToggleColor, onCycleMode }: ColorPickerProps) {
  const selectedSet = new Set(selected);
  const hasAny = selected.length > 0;

  return (
    <Stack spacing={0.5}>
      {/* Pip row */}
      <Stack
        direction="row"
        spacing={0.75}
        alignItems="center"
        role="group"
        aria-label="Color filter"
      >
        {PICKER_COLORS.map((color) => {
          const isSelected = selectedSet.has(color);

          return (
            <ManaSymbol
              key={color}
              color={color}
              size={26}
              active={isSelected}
              dimmed={hasAny && !isSelected}
              onClick={() => onToggleColor(color)}
              tooltip
            />
          );
        })}
      </Stack>

      {/* Mode toggle */}
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Tooltip title={COLOR_MODE_TIPS[mode]}>
          <Button
            size="small"
            variant="contained"
            color={mode === 'exact' ? 'secondary' : mode === 'and' ? 'primary' : 'inherit'}
            onClick={onCycleMode}
            aria-label={`Color mode: ${COLOR_MODE_LABELS[mode]}`}
            sx={{
              minWidth: 0,
              px: 1,
              height: 22,
              fontSize: '0.65rem',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {COLOR_MODE_LABELS[mode]}
          </Button>
        </Tooltip>
      </Stack>
    </Stack>
  );
}

// ── Visual divider ────────────────────────────────────────────────────────────

function VDivider() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        alignSelf: 'stretch',
        width: '1px',
        mx: 0.5,
        background: (theme) =>
          `linear-gradient(to bottom, transparent, ${theme.palette.divider} 30%, ${theme.palette.divider} 70%, transparent)`,
        flexShrink: 0,
      }}
    />
  );
}

// ── Filter controls (shared between inline and drawer) ───────────────────────

interface FilterControlsProps {
  state: FilterSortState;
  facets: Required<EnabledFacets>;
  availableTypes: TypeCategory[];
  availableCmcs: number[];
  patch: (partial: Partial<FilterSortState>) => void;
  onClear: () => void;
  hasActive: boolean;
}

function FilterControls({
  state,
  facets,
  availableTypes,
  availableCmcs,
  patch,
  onClear,
  hasActive,
}: FilterControlsProps) {
  // Debounced search
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Sync localSearch with external state.search using React's render-time derived-state
  // pattern (avoids set-state-in-effect; see reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops).
  const [localSearch, setLocalSearch] = useState(state.search ?? '');
  const [prevStateSearch, setPrevStateSearch] = useState(state.search ?? '');

  if ((state.search ?? '') !== prevStateSearch) {
    const next = state.search ?? '';
    setPrevStateSearch(next);
    setLocalSearch(next);
  }

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => {
        patch({ search: value });
      }, 200);
    },
    [patch],
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  const selectedColors = state.colors ?? [];
  const selectedTypes  = state.types  ?? [];
  const colorMode      = state.colorMode ?? 'or';

  /** Toggle a color, enforcing the C ↔ WUBRG mutual-exclusion axiom. */
  const handleToggleColor = useCallback(
    (color: ColorIdentitySymbol) => {
      const current = state.colors ?? [];
      if (current.includes(color)) {
        // Deselect
        patch({ colors: current.filter((c) => c !== color) });
        return;
      }
      // Select — apply axiom
      if (color === 'C') {
        // Selecting C: clear all WUBRG, set only C
        patch({ colors: ['C'] });
      } else {
        // Selecting WUBRG: clear C, add this color
        patch({ colors: [...current.filter((c) => c !== 'C'), color] });
      }
    },
    [state.colors, patch],
  );

  const handleCycleMode = useCallback(() => {
    const idx = COLOR_MODE_CYCLE.indexOf(colorMode);
    patch({ colorMode: COLOR_MODE_CYCLE[(idx + 1) % COLOR_MODE_CYCLE.length] });
  }, [colorMode, patch]);

  const handleToggleType = useCallback(
    (type: TypeCategory) => {
      const current = state.types ?? [];
      patch({
        types: current.includes(type)
          ? current.filter((t) => t !== type)
          : [...current, type],
      });
    },
    [state.types, patch],
  );

  const handleToggleCmc = useCallback(
    (mv: number) => {
      const current = state.cmcFilter?.values ?? [];
      const next = current.includes(mv)
        ? current.filter((v) => v !== mv)
        : [...current, mv];
      patch({ cmcFilter: next.length > 0 ? { ...state.cmcFilter, values: next } : undefined });
    },
    [state.cmcFilter, patch],
  );

  const handleContainsCard = useCallback(
    (card: Card | null) => {
      patch({ contains: card ?? undefined });
    },
    [patch],
  );

  return (
    <Stack spacing={1.5}>
      {/* Row 1: search, sort, colors */}
      <Stack direction="row" spacing={1} alignItems="flex-start" flexWrap="wrap" useFlexGap>
        {facets.search && (
          <TextField
            size="small"
            placeholder="Search cards…"
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            inputProps={{ 'aria-label': 'Search cards by name' }}
            sx={{ width: 200 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        )}

        {facets.sort && (
          <>
            {facets.search && <VDivider />}
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Tooltip
                title={
                  state.sortDir === 'asc'
                    ? 'Ascending — click to reverse'
                    : 'Descending — click to reverse'
                }
              >
                <IconButton
                  size="small"
                  onClick={() =>
                    patch({ sortDir: state.sortDir === 'asc' ? 'desc' : 'asc' })
                  }
                  aria-label={`Sort direction: ${state.sortDir === 'asc' ? 'ascending' : 'descending'}, click to toggle`}
                  sx={{ color: 'text.secondary' }}
                >
                  {state.sortDir === 'asc' ? (
                    <ArrowUpwardIcon fontSize="small" />
                  ) : (
                    <ArrowDownwardIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Select
                size="small"
                value={state.sort}
                onChange={(e) =>
                  patch({ sort: e.target.value as FilterSortState['sort'] })
                }
                inputProps={{ 'aria-label': 'Sort by' }}
                sx={{ fontSize: '0.8rem', height: 36, minWidth: 130 }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </>
        )}

        {facets.colors && (
          <>
            <VDivider />
            <ColorPicker
              selected={selectedColors}
              mode={colorMode}
              onToggleColor={handleToggleColor}
              onCycleMode={handleCycleMode}
            />
          </>
        )}

        {/* Clear button — far right */}
        {hasActive && (
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Clear all filters and sort">
              <IconButton
                size="small"
                onClick={onClear}
                aria-label="Clear all filters and sort"
                sx={{ color: 'warning.main' }}
              >
                <FilterAltOffIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Stack>

      {/* Row 2: type chips */}
      {facets.types && availableTypes.length > 0 && (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap aria-label="Filter by type">
          {availableTypes.map((type) => {
            const selected = selectedTypes.includes(type);
            const dimmed   = selectedTypes.length > 0 && !selected;
            return (
              <Chip
                key={type}
                label={type}
                size="small"
                variant={selected ? 'filled' : 'outlined'}
                color={selected ? 'primary' : 'default'}
                onClick={() => handleToggleType(type)}
                aria-pressed={selected}
                aria-label={`Filter by type: ${type}`}
                sx={{
                  height: 24,
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  opacity: dimmed ? 0.4 : 1,
                  transition: 'opacity 0.15s',
                  textTransform: 'capitalize',
                }}
              />
            );
          })}
        </Stack>
      )}

      {/* Row 3: CMC chips */}
      {facets.cmc && availableCmcs.length > 0 && (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap aria-label="Filter by mana value">
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ alignSelf: 'center', mr: 0.5 }}
          >
            MV
          </Typography>
          {availableCmcs.map((n) => {
            const selectedCmcs = state.cmcFilter?.values ?? [];
            const selected = selectedCmcs.includes(n);
            const dimmed   = selectedCmcs.length > 0 && !selected;
            return (
              <Chip
                key={n}
                label={String(n)}
                size="small"
                variant={selected ? 'filled' : 'outlined'}
                color={selected ? 'primary' : 'default'}
                onClick={() => handleToggleCmc(n)}
                aria-pressed={selected}
                aria-label={`Mana value ${n}`}
                sx={{
                  height: 24,
                  fontSize: '0.7rem',
                  minWidth: 32,
                  cursor: 'pointer',
                  opacity: dimmed ? 0.4 : 1,
                  transition: 'opacity 0.15s',
                }}
              />
            );
          })}
        </Stack>
      )}

      {/* Row 4: Contains-card lookup */}
      {facets.contains && (
        <Box>
          <CardLookupField
            label="Contains card"
            onChange={handleContainsCard}
            aria-label="Filter by card presence"
          />
        </Box>
      )}
    </Stack>
  );
}

// ── CardFilterBar ─────────────────────────────────────────────────────────────

export function CardFilterBar({
  state,
  onChange,
  cards = [],
  compact: compactProp,
  enabledFacets,
}: CardFilterBarProps) {
  const theme     = useTheme();
  const isMobile  = useMediaQuery(theme.breakpoints.down('sm'));
  const compact   = compactProp ?? isMobile;

  const [drawerOpen, setDrawerOpen] = useState(false);

  const facets         = allEnabled(enabledFacets);
  const availableTypes = useMemo(() => extractTypes(cards), [cards]);
  const availableCmcs  = useMemo(() => extractCmcs(cards), [cards]);
  const hasActive      = isActive(state);

  const patch = useCallback(
    (partial: Partial<FilterSortState>) => {
      onChange({ ...state, ...partial });
    },
    [state, onChange],
  );

  const handleClear = useCallback(() => {
    onChange(DEFAULT_STATE);
  }, [onChange]);

  const controls = (
    <FilterControls
      state={state}
      facets={facets}
      availableTypes={availableTypes}
      availableCmcs={availableCmcs}
      patch={patch}
      onClear={handleClear}
      hasActive={hasActive}
    />
  );

  if (!compact) {
    return <Box sx={{ mb: 2 }}>{controls}</Box>;
  }

  // ── Compact / mobile: button + bottom-sheet drawer ─────────────────────────
  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Button
          size="small"
          variant={hasActive ? 'contained' : 'outlined'}
          color={hasActive ? 'primary' : 'inherit'}
          startIcon={<FilterAltIcon />}
          onClick={() => setDrawerOpen(true)}
          aria-label={hasActive ? 'Filters active — open filter panel' : 'Open filter panel'}
          aria-expanded={drawerOpen}
          aria-haspopup="dialog"
        >
          Filter
          {hasActive && (
            <Box
              component="span"
              sx={{
                ml: 0.5,
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'warning.main',
                display: 'inline-block',
              }}
            />
          )}
        </Button>

        {hasActive && (
          <Tooltip title="Clear all filters">
            <IconButton
              size="small"
              onClick={handleClear}
              aria-label="Clear all filters"
              sx={{ color: 'warning.main' }}
            >
              <FilterAltOffIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            px: 2,
            py: 2,
            maxHeight: '80vh',
            overflowY: 'auto',
          },
        }}
        aria-label="Filter panel"
        role="dialog"
        aria-modal="true"
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Filter &amp; Sort
          </Typography>
          <Button
            size="small"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close filter panel"
          >
            Done
          </Button>
        </Stack>
        {controls}
      </Drawer>
    </>
  );
}
