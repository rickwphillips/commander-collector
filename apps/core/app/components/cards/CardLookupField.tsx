'use client';

/**
 * CardLookupField — the canonical card-name input for the Commander Collector app.
 *
 * Every card-name field in the app should use this component.
 *
 * Dual-mode (auto-detected from input content):
 *   Autocomplete mode — prefix match via Scryfall /cards/autocomplete, results
 *     resolved through the PHP cache layer (api.bulkLookupCards).
 *   Query mode — full Scryfall syntax (/cards/search), results resolved through
 *     the PHP cache layer. Activated when input contains: * : = < > ( " or starts with ! or -
 *
 * All card data returned via onAdd is built through cardFromScryfall, ensuring
 * a canonical Card shape with correct boolean flags and a fresh tempId.
 */

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import {
  Box,
  CircularProgress,
  ClickAwayListener,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';

import { ManaCost } from '@/components/ManaCost';
import { CardLookupTips } from '@/components/cards/CardLookupTips';
import { api } from '@/lib/api';
import { cardFromScryfall } from '@/lib/cards/fromScryfall';
import type { Card } from '@/lib/cards/types';
import type { ScryfallCachedCard } from '@/lib/types';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ResultFilter {
  legendaryCreaturesOnly?: boolean;
  partnerOnly?: boolean;
  colorIdentity?: string[];
}

export interface CardLookupFieldProps {
  /** Optional label shown above the field (passed to MUI TextField). */
  label?: string;
  /** Controlled value. Use either value+onChange or defaultValue, not both. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /**
   * Fires when user commits N copies of a result. Cards are canonical Card objects.
   * Required unless `onChange` is provided.
   */
  onAdd?: (cards: Card[]) => void;
  /**
   * Alternative single-card callback for use in filter/picker contexts.
   * Receives the first selected Card or null when cleared.
   * When provided alongside onAdd, both fire (onAdd first).
   */
  onChange?: (card: Card | null) => void;
  placeholder?: string;
  autoFocus?: boolean;
  /**
   * When true, the per-result quantity stepper is hidden and Add always sends qty=1.
   * Use for commander pickers, single-card selectors, etc.
   */
  singletonMode?: boolean;
  /**
   * Filters applied after results are fetched.
   * legendaryCreaturesOnly and partnerOnly restrict type_line matching.
   * colorIdentity restricts by color identity string intersection.
   */
  resultFilter?: ResultFilter;
  /**
   * When true, onAdd may receive multiple Card objects in a single call.
   * When false (default), onAdd always receives a 1-element array.
   * (Currently both modes build the full Card[] — the flag is available for
   * callers that want to enforce single-select semantics in their own state.)
   */
  multiSelect?: boolean;
  disabled?: boolean;
}

// ── Scryfall query mode detector ──────────────────────────────────────────────

const QUERY_TRIGGER = /[*:=<>("]/;

function isQueryMode(input: string): boolean {
  const trimmed = input.trimStart();
  if (!trimmed) return false;
  if (trimmed[0] === '!' || trimmed[0] === '-') return true;
  return QUERY_TRIGGER.test(trimmed);
}

// ── Result row shape (resolved from cache) ────────────────────────────────────

interface ResolvedResult {
  cachedCard: ScryfallCachedCard | null;
  /** The name we searched for (may differ from cachedCard.name on fuzzy match) */
  searchedName: string;
  qty: number;
}

// ── Scryfall fetch helpers (names only — data resolved via PHP cache) ──────────

/** Scryfall autocomplete: returns up to 20 name suggestions for a prefix.
 *  Dedupes Scryfall's "X // X" merged-face aliases (which the cache layer doesn't resolve)
 *  and any case-insensitive duplicates. */
async function fetchAutocompleteName(query: string): Promise<string[]> {
  if (query.length < 2) return [];
  try {
    const url = `https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(query)}&include_extras=false`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = (await res.json()) as { data: string[] };
    const raw = data.data ?? [];
    const seen = new Set<string>();
    const cleaned: string[] = [];
    for (const name of raw) {
      // Drop "X // X" merged-face aliases — they refer to the same single-face card.
      const halves = name.split(' // ');
      if (halves.length === 2 && halves[0].trim().toLowerCase() === halves[1].trim().toLowerCase()) {
        continue;
      }
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      cleaned.push(name);
    }
    return cleaned;
  } catch {
    return [];
  }
}

/** Scryfall full-syntax search: returns card names matching the query. */
async function fetchQueryNames(
  query: string,
  page: number,
  filter: ResultFilter | undefined
): Promise<{ names: string[]; hasMore: boolean }> {
  try {
    let q = query;

    // Append resultFilter as Scryfall query terms (only when not already specified).
    // legendaryCreaturesOnly = "valid commander" filter.
    // A legal commander is a legendary permanent with power/toughness — Scryfall
    // encodes this rule via `is:commander`. See memory/feedback_commander_legality.md.
    if (filter?.legendaryCreaturesOnly && !q.includes('is:commander')) {
      q += ' is:commander';
    }
    if (filter?.partnerOnly && !q.includes('kw:partner')) {
      q += ' kw:partner';
    }
    if (filter?.colorIdentity?.length && !q.includes('id:')) {
      q += ` id<=${filter.colorIdentity.join('')}`;
    }

    const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(q)}&unique=names&order=name&page=${page}`;
    const res = await fetch(url);
    if (res.status === 404) return { names: [], hasMore: false };
    if (!res.ok) return { names: [], hasMore: false };
    const data = (await res.json()) as { data: { name: string }[]; has_more: boolean };
    return {
      names: (data.data ?? []).map((c) => c.name),
      hasMore: data.has_more ?? false,
    };
  } catch {
    return { names: [], hasMore: false };
  }
}

// ── Post-fetch client-side filters ────────────────────────────────────────────

function applyResultFilter(
  results: ResolvedResult[],
  filter: ResultFilter | undefined
): ResolvedResult[] {
  if (!filter) return results;
  return results.filter((r) => {
    const card = r.cachedCard;
    if (!card) return true; // keep not-found so user sees them

    if (filter.legendaryCreaturesOnly) {
      // Valid commander = legendary permanent with power/toughness.
      // ScryfallCachedCard doesn't carry power/toughness, so we can't enforce
      // the strict rule post-fetch. The commander-picker code path forces
      // query mode and prepends `is:commander`, which encodes the correct rule
      // server-side, so this branch is mainly defensive.
      const tl = card.type_line?.toLowerCase() ?? '';
      if (!tl.includes('legendary')) return false;
    }
    if (filter.partnerOnly) {
      // We can't check keywords in ScryfallCachedCard (no oracle/keywords field).
      // This filter is enforced via the Scryfall query in fetchQueryNames above;
      // in autocomplete mode we can't enforce it post-fetch without oracle text,
      // so we pass through (partial enforcement only in autocomplete mode).
    }
    if (filter.colorIdentity?.length) {
      const allowedSet = new Set(filter.colorIdentity);
      const cardColors = (card.color_identity ?? '').split('').filter(Boolean);
      if (!cardColors.every((c) => allowedSet.has(c))) return false;
    }

    return true;
  });
}

// ── Main component ────────────────────────────────────────────────────────────

export function CardLookupField({
  label,
  value: controlledValue,
  defaultValue = '',
  onAdd,
  onChange,
  placeholder = 'Search for a card…',
  autoFocus = false,
  singletonMode = false,
  resultFilter,
  disabled = false,
}: CardLookupFieldProps) {
  const inputId       = useId();
  const listId        = useId();
  const inputRef      = useRef<HTMLInputElement>(null);

  // ── Input state (controlled or uncontrolled) ─────────────────────────────
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const inputValue   = isControlled ? controlledValue : internalValue;

  // ── Result/UI state ──────────────────────────────────────────────────────
  const [results,   setResults]   = useState<ResolvedResult[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [focusIdx,  setFocusIdx]  = useState(-1);
  const [queryMode, setQueryMode] = useState(false);
  const [hasMore,   setHasMore]   = useState(false);
  const [page,      setPage]      = useState(1);
  // Esc / click-away hides the result list without clearing it.
  // Re-typing or re-focusing the input shows it again.
  const [resultsHidden, setResultsHidden] = useState(false);
  // Briefly highlights the row that was just added so the user has a visual cue.
  const [flashIdx, setFlashIdx] = useState(-1);

  const debounceRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef      = useRef<AbortController | null>(null);
  const resultsRef    = useRef<HTMLDivElement>(null);
  // When the user hovers the result panel, freeze the list so new searches
  // can't shift rows out from under their click.
  const hoverInResults = useRef(false);

  // ── Debounced search ─────────────────────────────────────────────────────

  const runSearch = useCallback(
    async (query: string, pageNum: number) => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      setFocusIdx(-1);

      try {
        // Filter-driven query mode: any resultFilter that requires server-side
        // semantics (commander legality, partner-only, color identity) forces
        // query mode so the Scryfall query encodes the rule correctly.
        const filterForcesQuery = Boolean(
          resultFilter?.legendaryCreaturesOnly ||
          resultFilter?.partnerOnly ||
          resultFilter?.colorIdentity?.length
        );
        const inQuery = isQueryMode(query) || filterForcesQuery;
        setQueryMode(inQuery);

        let names: string[]   = [];
        let more              = false;

        if (inQuery) {
          // For filter-forced query mode with plain text, wrap user input as a
          // quoted name match so "Parhelion II" becomes `name:"Parhelion II"`.
          // Quoting avoids the space-encoding pitfall and gives Scryfall a clean
          // substring search.
          const q = filterForcesQuery && !isQueryMode(query)
            ? `name:"${query.replace(/"/g, '')}"`
            : query;
          const res  = await fetchQueryNames(q, pageNum, resultFilter);
          names      = res.names;
          more       = res.hasMore;
        } else {
          const raw  = await fetchAutocompleteName(query);
          names      = raw.slice(0, 20);
          more       = false;
        }

        if (!names.length) {
          setResults([]);
          setHasMore(false);
          setLoading(false);
          return;
        }

        // Resolve names through the PHP cache layer (bulk lookup)
        const { results: cacheRows } = await api.bulkLookupCards(names);

        const resolved: ResolvedResult[] = names.map((name, i) => {
          const row = cacheRows[i];
          // bulkLookupCards returns ScryfallCachedCard & { error?: string };
          // a truthy error field means the cache lookup failed for this name.
          const hasError = Boolean(row?.error);
          return {
            searchedName: name,
            cachedCard:   hasError ? null : (row as ScryfallCachedCard | null) ?? null,
            qty:          1,
          };
        });

        const filtered = applyResultFilter(resolved, resultFilter);

        setResults(pageNum > 1 ? (prev) => [...prev, ...filtered] : filtered);
        setHasMore(more);
      } catch (err) {
        // Aborted — ignore
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setResults([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [resultFilter]
  );

  const scheduleSearch = useCallback(
    (query: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!query.trim() || query.trim().length < 2) {
        setResults([]);
        setHasMore(false);
        setPage(1);
        return;
      }
      // If the user's mouse is parked in the results panel, don't shift rows
      // out from under them. Defer the search until they move away.
      if (hoverInResults.current) return;
      debounceRef.current = setTimeout(() => {
        setPage(1);
        runSearch(query, 1);
      }, 450);
    },
    [runSearch]
  );

  // ── Input change handler ─────────────────────────────────────────────────

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!isControlled) setInternalValue(v);
    setResultsHidden(false);
    scheduleSearch(v);
  };

  // ── Load next page (query mode only) ────────────────────────────────────

  const loadMore = () => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    runSearch(inputValue, nextPage);
  };

  // ── Per-row qty stepper ──────────────────────────────────────────────────

  const setRowQty = (idx: number, delta: number) => {
    setResults((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, qty: Math.max(1, r.qty + delta) } : r))
    );
  };

  // ── Add handler ──────────────────────────────────────────────────────────

  const handleAdd = useCallback(
    (result: ResolvedResult) => {
      const qty     = singletonMode ? 1 : result.qty;
      const base    = cardFromScryfall(result.searchedName, result.cachedCard);
      const collapsed: Card = { ...base, quantity: qty };
      onAdd?.([collapsed]);
      onChange?.(collapsed);

      setResultsHidden(true);
      setFocusIdx(-1);
      setFlashIdx(-1);
    },
    [onAdd, onChange, singletonMode]
  );

  // ── Keyboard navigation ───────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusIdx((i) => Math.min(i + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusIdx((i) => Math.max(i - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusIdx >= 0 && results[focusIdx]) {
          handleAdd(results[focusIdx]);
        } else if (results.length === 1) {
          handleAdd(results[0]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setResultsHidden(true);
        setFocusIdx(-1);
        // Field value preserved — user can re-focus or type to reopen.
        break;
      case '/':
        // Let '/' refocus the input (used when focus is elsewhere)
        break;
    }
  };

  // '/' shortcut: focus the input from anywhere on the page
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isEditableTarget =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;
      if (e.key === '/' && !isEditableTarget && !disabled) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [disabled]);

  // Scroll focused row into view
  useEffect(() => {
    if (focusIdx < 0 || !resultsRef.current) return;
    const row = resultsRef.current.children[focusIdx] as HTMLElement | undefined;
    row?.scrollIntoView({ block: 'nearest' });
  }, [focusIdx]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  const showResults = results.length > 0 && !resultsHidden;

  const closeResults = () => {
    setResultsHidden(true);
    setFocusIdx(-1);
  };

  return (
    <ClickAwayListener onClickAway={closeResults}>
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* ── Input ─────────────────────────────────────────────────────────── */}
      <TextField
        id={inputId}
        inputRef={inputRef}
        fullWidth
        size="small"
        label={label}
        disabled={disabled}
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (results.length > 0) setResultsHidden(false);
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        slotProps={{
          input: {
            role: 'combobox',
            'aria-expanded': showResults,
            'aria-controls': showResults ? listId : undefined,
            'aria-autocomplete': 'list',
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  fontSize="small"
                  sx={{
                    color: queryMode ? 'primary.main' : 'text.secondary',
                    transition: 'color 0.15s',
                  }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress size={16} sx={{ mr: 0.5 }} />
                ) : (
                  <CardLookupTips />
                )}
              </InputAdornment>
            ),
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            pr: 0.5,
          },
        }}
      />

      {/* Query mode badge */}
      {queryMode && inputValue.trim() && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: '100%',
            left: 4,
            mt: 0.25,
            color: 'primary.main',
            fontWeight: 600,
            lineHeight: 1,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          Query mode
        </Typography>
      )}

      {/* ── Result list ───────────────────────────────────────────────────── */}
      {showResults && (
        <Paper
          elevation={4}
          onMouseEnter={() => {
            hoverInResults.current = true;
            // Cancel any in-flight debounce so it doesn't fire while hovering.
            if (debounceRef.current) {
              clearTimeout(debounceRef.current);
              debounceRef.current = null;
            }
          }}
          onMouseLeave={() => {
            hoverInResults.current = false;
          }}
          sx={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 1400,
            maxHeight: 360,
            overflowY: 'auto',
            borderRadius: 1,
          }}
        >
          <Box
            ref={resultsRef}
            id={listId}
            role="listbox"
            aria-label="Card search results"
          >
            {results.map((result, idx) => (
              <ResultRow
                key={`${result.searchedName}-${idx}`}
                result={result}
                focused={idx === focusIdx}
                flashing={idx === flashIdx}
                singletonMode={singletonMode}
                onFocus={() => setFocusIdx(idx)}
                onQtyChange={(delta) => setRowQty(idx, delta)}
                onAdd={() => handleAdd(result)}
              />
            ))}

            {/* Load more (query mode pagination) */}
            {hasMore && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  p: 1,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="caption"
                  component="button"
                  onClick={loadMore}
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    p: '4px 8px',
                    minHeight: 44,
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {loading ? 'Loading…' : 'Load more results'}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}
    </Box>
    </ClickAwayListener>
  );
}

// ── ResultRow ─────────────────────────────────────────────────────────────────

interface ResultRowProps {
  result: ResolvedResult;
  focused: boolean;
  flashing: boolean;
  singletonMode: boolean;
  onFocus: () => void;
  onQtyChange: (delta: number) => void;
  onAdd: () => void;
}

function ResultRow({
  result,
  focused,
  flashing,
  singletonMode,
  onFocus,
  onQtyChange,
  onAdd,
}: ResultRowProps) {
  const card = result.cachedCard;
  const name = card?.name ?? result.searchedName;

  const ariaLabel = [
    name,
    card?.type_line ? `· ${card.type_line}` : '',
    card?.mana_cost ? `· ${card.mana_cost}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      role="option"
      aria-selected={focused}
      aria-label={ariaLabel}
      onMouseEnter={onFocus}
      onClick={onAdd}
      sx={{
        px: 1,
        py: 0.75,
        cursor: 'pointer',
        minHeight: 44,
        bgcolor: (theme) =>
          flashing
            ? theme.palette.success.main
            : focused
            ? theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.05)'
            : 'transparent',
        transition: 'background-color 0.2s ease-out',
        '&:not(:last-child)': {
          borderBottom: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          width: 32,
          height: 44,
          flexShrink: 0,
          borderRadius: 0.5,
          overflow: 'hidden',
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {card?.image_uri ? (
          <Box
            component="img"
            src={card.image_uri}
            alt={name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
          />
        ) : (
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6rem' }}>
            ?
          </Typography>
        )}
      </Box>

      {/* Card info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap">
          <Typography
            variant="body2"
            fontWeight={600}
            noWrap
            sx={{ maxWidth: '100%' }}
          >
            {name}
          </Typography>
          {card?.mana_cost && (
            <ManaCost cost={card.mana_cost} size={0.75} />
          )}
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap">
          {card?.type_line && (
            <Typography variant="caption" color="text.secondary" noWrap>
              {card.type_line}
            </Typography>
          )}
          {!card && (
            <Typography variant="caption" color="warning.main">
              Not found
            </Typography>
          )}
        </Stack>
      </Box>

      {/* Controls: [− qty +] [Add] */}
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
        {!singletonMode && (
          <>
            <Tooltip title="Decrease quantity" placement="top">
              <IconButton
                size="small"
                aria-label={`Decrease quantity of ${name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onQtyChange(-1);
                }}
                sx={{ p: 0.5, minWidth: 28, minHeight: 28 }}
              >
                <RemoveIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>

            <Typography
              variant="body2"
              sx={{ minWidth: 20, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}
            >
              {result.qty}
            </Typography>

            <Tooltip title="Increase quantity" placement="top">
              <IconButton
                size="small"
                aria-label={`Increase quantity of ${name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onQtyChange(1);
                }}
                sx={{ p: 0.5, minWidth: 28, minHeight: 28 }}
              >
                <AddIcon sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          </>
        )}

        <Tooltip title={`Add ${singletonMode ? '' : `${result.qty}× `}${name}`} placement="top">
          <IconButton
            size="small"
            color="primary"
            aria-label={`Add ${name}`}
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            sx={{ p: 0.5, minWidth: 36, minHeight: 36 }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
