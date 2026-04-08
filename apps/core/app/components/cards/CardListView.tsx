'use client';

/**
 * CardListView — THE list-of-cards display for Commander Collector.
 *
 * Generic: renders deck-attached lists, standalone lists, scan buffers, and
 * import buffers through the same component. `commanderId` lights up the
 * commander-star affordance on a specific tile but does NOT change semantics.
 *
 * View modes:
 *   gallery   — responsive card-tile grid (default)
 *   text      — dense table with name, qty, mana cost, type, set
 *   breakdown — grouped by type category, each group a labeled tile grid
 *
 * Filter/sort: mounts <CardFilterBar>; controlled when filterState + onFilterStateChange
 * are provided, otherwise owns state internally.
 *
 * Edit mode: qty stepper + delete per tile, bulk-select with sticky toolbar,
 * undo/redo stack (50-step cap, Cmd+Z / Cmd+Shift+Z).
 *
 * 409 conflict: accepts a `conflict` prop — the caller sets it when a concurrent-edit
 * 409 arrives. CardListView renders a dialog offering to accept server state. Caller
 * clears the prop after resolution. Chosen over an imperative ref because it keeps
 * the state machine in the parent (where persistence lives) and keeps this component
 * pure-presentation.
 *
 * Virtual scrolling: FixedSizeGrid (gallery ≥50) and FixedSizeList (text ≥50)
 * from react-window. Container width is measured via a ResizeObserver on a
 * wrapping <Box> ref. Below 50 cards, plain rendering is used in all modes.
 *
 * Keyboard shortcuts (see useKeyboardShortcuts below):
 *   /          focus search
 *   Del/Back   delete focused card (edit mode)
 *   Cmd+Z      undo
 *   Cmd+Shift+Z redo
 *   V          cycle view mode
 *   E          toggle edit mode (when onChange provided)
 *   ?          open keyboard help overlay
 *   Esc        close dialogs (handled by individual dialogs)
 *
 * Enter / Cmd+S are reserved for SaveToListDialog (Phase 1 wave 3) and the
 * lookup tab inside CardInputPanel — hooks are noted in comments but not implemented.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useReducer,
  useRef,
  useState,
} from 'react';
import { FixedSizeGrid, FixedSizeList } from 'react-window';
import type { GridChildComponentProps, ListChildComponentProps } from 'react-window';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import CategoryIcon from '@mui/icons-material/Category';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

import { CardTile } from '@/components/cards/CardTile';
import { CardFilterBar } from '@/components/cards/CardFilterBar';
import { ManaCost } from '@/components/ManaCost';
import { filterCards, sortCards, type FilterSortState } from '@/lib/cards/filter';
import { categorizeByType, TYPE_CATEGORIES, type TypeCategory } from '@/lib/cards/categorize';
import type { Card } from '@/lib/cards/types';
import type { LookupState } from '@/components/cards/CardTile';

// ── Constants ─────────────────────────────────────────────────────────────────

const VIRTUAL_THRESHOLD = 50;
const UNDO_CAP = 50;
const DEFAULT_FILTER_STATE: FilterSortState = { sort: 'name', sortDir: 'asc' };

// ── Virtual scrolling layout constants ────────────────────────────────────────

/** Minimum tile width for column-count calculation. Matches md breakpoint in tileGridSx. */
const TILE_MIN_WIDTH = 180;
/** Gap between tiles (px). Matches gap: 2 = 16px from theme spacing. */
const TILE_GAP = 16;
/** Fixed row height for gallery tiles (card image + name label). */
const TILE_ROW_HEIGHT = 280;
/** Fixed row height for virtualised text-mode rows (dense table). */
const TEXT_ROW_HEIGHT = 48;
/** Visible height of the virtualised text list (px). */
const TEXT_LIST_HEIGHT = 600;
/** Visible height of the virtualised gallery grid (px). */
const GALLERY_GRID_HEIGHT = 600;

// ── useContainerWidth — ResizeObserver-based width measurement ────────────────

/**
 * Measures the pixel width of a DOM element via ResizeObserver.
 * Returns [measuredWidth, ref] — attach the ref to the container element.
 * Falls back to 0 until the first observation fires (first render will be
 * a plain grid; virtual grid mounts once width > 0).
 */
function useContainerWidth(): [number, React.RefObject<HTMLDivElement | null>] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Seed with initial width before the observer fires
    setWidth(el.getBoundingClientRect().width);

    // ResizeObserver is not available in all environments (e.g. jsdom in tests)
    if (typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [width, ref];
}

// Canonical type group display order and labels
const TYPE_GROUP_LABELS: Record<TypeCategory, string> = {
  creature:     'Creatures',
  planeswalker: 'Planeswalkers',
  battle:       'Battles',
  instant:      'Instants',
  sorcery:      'Sorceries',
  enchantment:  'Enchantments',
  artifact:     'Artifacts',
  land:         'Lands',
  other:        'Other',
};

// ── Prop types ────────────────────────────────────────────────────────────────

export interface CardListViewProps {
  cards: Card[];
  viewMode?: 'gallery' | 'text' | 'breakdown';
  onViewModeChange?: (mode: 'gallery' | 'text' | 'breakdown') => void;
  editMode?: boolean;
  onChange?: (cards: Card[]) => void;
  /** scryfall_id of the card that should be visually marked as commander */
  commanderId?: string;
  /** Controlled filter state. If absent, CardListView owns it internally. */
  filterState?: FilterSortState;
  onFilterStateChange?: (state: FilterSortState) => void;
  /** Per-row lookupState map keyed by tempId or scryfall_id */
  lookupStates?: Record<string, LookupState>;
  /**
   * When set, CardListView shows a 409-conflict resolution dialog.
   * Caller sets this when a concurrent-edit 409 arrives and clears it
   * after the user resolves it.
   *
   * Design choice: prop (not imperative ref) — keeps the state machine in the
   * parent where persistence lives; this component stays pure-presentation.
   */
  conflict?: { serverCards: Card[] } | null;
  /** Called after the user accepts or discards the conflict. */
  onConflictResolve?: (choice: 'accept-server' | 'keep-local') => void;
  /** Optional: the currently-attached deck context, for inline detach affordance */
  deckContext?: { id: string; name: string };
}

// Imperative handle (currently a no-op placeholder; callers use the conflict prop instead)
export interface CardListViewHandle {
  /** Focus the filter search input */
  focusSearch: () => void;
}

// ── Undo/redo stack ───────────────────────────────────────────────────────────

interface UndoState {
  history: Card[][];  // index < cursor = past; cursor = current live state
  cursor: number;
}

type UndoAction =
  | { type: 'push'; cards: Card[] }
  | { type: 'undo' }
  | { type: 'redo' };

function undoReducer(state: UndoState, action: UndoAction): UndoState {
  switch (action.type) {
    case 'push': {
      // Trim the future (anything past cursor) then append
      const history = [...state.history.slice(0, state.cursor + 1), action.cards];
      // Cap at UNDO_CAP total snapshots
      const trimmed = history.length > UNDO_CAP + 1
        ? history.slice(history.length - (UNDO_CAP + 1))
        : history;
      return { history: trimmed, cursor: trimmed.length - 1 };
    }
    case 'undo':
      if (state.cursor <= 0) return state;
      return { ...state, cursor: state.cursor - 1 };
    case 'redo':
      if (state.cursor >= state.history.length - 1) return state;
      return { ...state, cursor: state.cursor + 1 };
    default:
      return state;
  }
}

function useUndoStack(initial: Card[]) {
  const [state, dispatch] = useReducer(undoReducer, {
    history: [initial],
    cursor: 0,
  });

  const canUndo = state.cursor > 0;
  const canRedo = state.cursor < state.history.length - 1;
  const current = state.history[state.cursor];

  const push = useCallback((cards: Card[]) => dispatch({ type: 'push', cards }), []);
  const undo  = useCallback(() => dispatch({ type: 'undo' }), []);
  const redo  = useCallback(() => dispatch({ type: 'redo' }), []);

  return { current, canUndo, canRedo, push, undo, redo };
}

// ── Keyboard shortcuts hook ───────────────────────────────────────────────────

interface KeyboardShortcutOptions {
  onSlash: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCycleView: () => void;
  onToggleEdit: () => void;
  onHelp: () => void;
  editMode: boolean;
  canToggleEdit: boolean;
}

function useKeyboardShortcuts({
  onSlash,
  onDelete,
  onUndo,
  onRedo,
  onCycleView,
  onToggleEdit,
  onHelp,
  editMode,
  canToggleEdit,
}: KeyboardShortcutOptions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const inInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
        target.isContentEditable;

      // / — focus search (allow even in inputs for discoverability via the
      //     default browser behavior; here we override only when NOT in an input)
      if (e.key === '/' && !inInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onSlash();
        return;
      }

      // ? — keyboard help
      if (e.key === '?' && !inInput) {
        e.preventDefault();
        onHelp();
        return;
      }

      // V — cycle view mode
      if (e.key === 'v' && !inInput && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onCycleView();
        return;
      }

      // E — toggle edit mode
      if (e.key === 'e' && !inInput && !e.metaKey && !e.ctrlKey && canToggleEdit) {
        e.preventDefault();
        onToggleEdit();
        return;
      }

      // Del / Backspace — delete focused card in edit mode
      if ((e.key === 'Delete' || e.key === 'Backspace') && editMode && !inInput) {
        e.preventDefault();
        onDelete();
        return;
      }

      // Cmd+Z / Ctrl+Z — undo
      if (e.key === 'z' && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        e.preventDefault();
        onUndo();
        return;
      }

      // Cmd+Shift+Z / Ctrl+Shift+Z — redo
      if (e.key === 'z' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        onRedo();
        return;
      }

      // NOTE: Enter → SaveToListDialog (Phase 1 wave 3) — not yet implemented
      // NOTE: Cmd+S → lookup tab save in CardInputPanel — not yet implemented
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSlash, onDelete, onUndo, onRedo, onCycleView, onToggleEdit, onHelp, editMode, canToggleEdit]);
}

// ── Keyboard help overlay ─────────────────────────────────────────────────────

const SHORTCUTS = [
  { keys: '/', description: 'Focus search' },
  { keys: 'V', description: 'Cycle view modes' },
  { keys: 'E', description: 'Toggle edit mode (when editable)' },
  { keys: 'Del / Backspace', description: 'Delete focused card (edit mode)' },
  { keys: 'Cmd/Ctrl + Z', description: 'Undo' },
  { keys: 'Cmd/Ctrl + Shift + Z', description: 'Redo' },
  { keys: '?', description: 'Open this help dialog' },
  { keys: 'Esc', description: 'Close open dialog' },
  { keys: 'Enter', description: 'Save to list (Phase 1 wave 3 — coming soon)' },
  { keys: 'Cmd/Ctrl + S', description: 'Save lookup (CardInputPanel — coming soon)' },
];

function KeyboardHelpDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth aria-labelledby="kb-help-title">
      <DialogTitle id="kb-help-title">
        <Stack direction="row" alignItems="center" spacing={1}>
          <KeyboardIcon fontSize="small" aria-hidden />
          <span>Keyboard shortcuts</span>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Table size="small">
          <TableBody>
            {SHORTCUTS.map(({ keys, description }) => (
              <TableRow key={keys}>
                <TableCell sx={{ fontFamily: 'monospace', whiteSpace: 'nowrap', pr: 2 }}>
                  {keys}
                </TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size="small">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── 409 conflict dialog ───────────────────────────────────────────────────────

function ConflictDialog({
  open,
  serverCardCount,
  onAcceptServer,
  onKeepLocal,
}: {
  open: boolean;
  serverCardCount: number;
  onAcceptServer: () => void;
  onKeepLocal: () => void;
}) {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth aria-labelledby="conflict-dialog-title">
      <DialogTitle id="conflict-dialog-title">Concurrent edit conflict</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Someone else saved this list while you were editing it. The server now
          has {serverCardCount} card{serverCardCount !== 1 ? 's' : ''}. You can
          accept the server version (discarding your local changes) or keep
          editing your local copy.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onKeepLocal} variant="outlined" color="inherit">
          Keep my changes
        </Button>
        <Button onClick={onAcceptServer} variant="contained" color="warning">
          Accept server version
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ editMode }: { editMode: boolean }) {
  return (
    <Box
      sx={{
        py: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        color: 'text.disabled',
      }}
      aria-label="No cards in this list"
    >
      <HelpOutlineIcon sx={{ fontSize: 48, opacity: 0.4 }} aria-hidden />
      <Typography variant="body1" fontWeight={500}>
        No cards in this list
      </Typography>
      {editMode && (
        <Typography variant="body2" color="text.secondary">
          Use the toolbar above to add cards.
        </Typography>
      )}
    </Box>
  );
}

// ── Text-mode row ─────────────────────────────────────────────────────────────

function TextRow({
  card,
  editMode,
  selected,
  onSelectChange,
  onQtyChange,
  onDelete,
  lookupState,
  isCommander,
}: {
  card: Card;
  editMode: boolean;
  selected: boolean;
  onSelectChange: (v: boolean) => void;
  onQtyChange: (qty: number) => void;
  onDelete: () => void;
  lookupState: LookupState;
  isCommander: boolean;
}) {
  return (
    <TableRow
      hover
      selected={selected}
      aria-selected={editMode ? selected : undefined}
      sx={{
        '& .MuiTableCell-root': { py: 0.75 },
        opacity: lookupState === 'pending' ? 0.6 : 1,
      }}
    >
      {editMode && (
        <TableCell padding="checkbox">
          <Checkbox
            size="small"
            checked={selected}
            onChange={(e) => onSelectChange(e.target.checked)}
            aria-label={selected ? `Deselect ${card.card_name}` : `Select ${card.card_name}`}
          />
        </TableCell>
      )}
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          {isCommander && (
            <Tooltip title="Commander">
              <Box
                component="span"
                aria-label="Commander"
                sx={{ color: 'warning.main', fontSize: '0.85rem', lineHeight: 1 }}
              >
                ★
              </Box>
            </Tooltip>
          )}
          <Typography
            variant="body2"
            sx={{
              fontWeight: isCommander ? 700 : 400,
              color: lookupState === 'not_found' ? 'error.main' : 'text.primary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 240,
            }}
          >
            {card.card_name}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align="right" sx={{ width: 60 }}>
        {editMode ? (
          <Stack direction="row" alignItems="center" spacing={0.25}>
            <IconButton
              size="small"
              aria-label="Decrease quantity"
              disabled={card.quantity <= 1}
              onClick={() => onQtyChange(card.quantity - 1)}
              sx={{ width: 28, height: 28 }}
            >
              −
            </IconButton>
            <Typography variant="body2" sx={{ minWidth: 16, textAlign: 'center' }}>
              {card.quantity}
            </Typography>
            <IconButton
              size="small"
              aria-label="Increase quantity"
              onClick={() => onQtyChange(card.quantity + 1)}
              sx={{ width: 28, height: 28 }}
            >
              +
            </IconButton>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            ×{card.quantity}
          </Typography>
        )}
      </TableCell>
      <TableCell sx={{ width: 120 }}>
        {card.mana_cost ? (
          <ManaCost cost={card.mana_cost} size={0.875} />
        ) : (
          <Typography variant="body2" color="text.disabled">
            —
          </Typography>
        )}
      </TableCell>
      <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem', width: 160 }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 160,
          }}
        >
          {card.type_line ?? '—'}
        </Typography>
      </TableCell>
      {editMode && (
        <TableCell padding="checkbox" align="right">
          <IconButton
            size="small"
            aria-label={`Delete ${card.card_name}`}
            onClick={onDelete}
            sx={{ color: 'error.main', '&:hover': { bgcolor: 'error.light', color: 'error.dark' } }}
          >
            ✕
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
}

// ── CardListView ──────────────────────────────────────────────────────────────

const VIEW_MODES: Array<'gallery' | 'text' | 'breakdown'> = ['gallery', 'text', 'breakdown'];

export const CardListView = forwardRef<CardListViewHandle, CardListViewProps>(
  function CardListView(
    {
      cards,
      viewMode: viewModeProp,
      onViewModeChange,
      editMode: editModeProp = false,
      onChange,
      commanderId,
      filterState: filterStateProp,
      onFilterStateChange,
      lookupStates = {},
      conflict,
      onConflictResolve,
      deckContext: _deckContext, // reserved for detach affordance in a future wave
    },
    ref,
  ) {
    // ── View mode ──────────────────────────────────────────────────────────────

    const [internalViewMode, setInternalViewMode] = useState<'gallery' | 'text' | 'breakdown'>(
      'gallery',
    );
    const isViewControlled = viewModeProp !== undefined;
    const viewMode = isViewControlled ? viewModeProp : internalViewMode;

    const setViewMode = useCallback(
      (mode: 'gallery' | 'text' | 'breakdown') => {
        if (!isViewControlled) setInternalViewMode(mode);
        onViewModeChange?.(mode);
      },
      [isViewControlled, onViewModeChange],
    );

    // ── Edit mode — internal toggle; caller can also force it via editMode prop ─

    const [internalEditMode, setInternalEditMode] = useState(editModeProp);
    const effectiveEditMode = editModeProp || internalEditMode;
    const canToggleEdit = !!onChange;

    // ── Filter state ───────────────────────────────────────────────────────────

    const [internalFilterState, setInternalFilterState] = useState<FilterSortState>(
      DEFAULT_FILTER_STATE,
    );
    const isFilterControlled = filterStateProp !== undefined;
    const filterState = isFilterControlled ? filterStateProp : internalFilterState;

    const setFilterState = useCallback(
      (next: FilterSortState) => {
        if (!isFilterControlled) setInternalFilterState(next);
        onFilterStateChange?.(next);
      },
      [isFilterControlled, onFilterStateChange],
    );

    // ── Undo/redo stack ────────────────────────────────────────────────────────

    const { current: _undoCurrent, canUndo, canRedo, push: undoPush, undo, redo } =
      useUndoStack(cards);

    // Mutation helper — snapshot before applying, fire onChange
    const mutate = useCallback(
      (nextCards: Card[]) => {
        undoPush(cards); // snapshot the BEFORE state
        onChange?.(nextCards);
      },
      [cards, undoPush, onChange],
    );

    // ── Bulk selection ─────────────────────────────────────────────────────────

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const cardKey = (card: Card): string =>
      card.id != null ? `db:${card.id}`
      : card.tempId ? `tmp:${card.tempId}`
      : card.scryfall_id ? `sf:${card.scryfall_id}`
      : `nm:${card.card_name}`;

    const toggleSelect = useCallback((card: Card, selected: boolean) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        const k = cardKey(card);
        if (selected) next.add(k); else next.delete(k);
        return next;
      });
    }, []);

    const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

    const deleteSelected = useCallback(() => {
      const next = cards.filter((c) => !selectedIds.has(cardKey(c)));
      mutate(next);
      clearSelection();
    }, [cards, selectedIds, mutate, clearSelection]);

    // Track which tile is "focused" for Del/Backspace keyboard shortcut
    const focusedCardKeyRef = useRef<string | null>(null);

    const deleteFocused = useCallback(() => {
      const k = focusedCardKeyRef.current;
      if (!k || !effectiveEditMode) return;
      const next = cards.filter((c) => cardKey(c) !== k);
      mutate(next);
    }, [cards, effectiveEditMode, mutate]);

    // ── Filter + sort the displayed array ─────────────────────────────────────

    const displayedCards = sortCards(filterCards(cards, filterState), filterState);

    // ── Search input ref (for / shortcut) ─────────────────────────────────────

    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const focusSearch = useCallback(() => {
      // CardFilterBar renders a TextField for the search — find it via ref or
      // query the DOM within our container.
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      } else if (containerRef.current) {
        const input = containerRef.current.querySelector<HTMLInputElement>(
          'input[aria-label="Search cards by name"]',
        );
        input?.focus();
      }
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);

    // ── Dialogs ───────────────────────────────────────────────────────────────

    const [helpOpen, setHelpOpen] = useState(false);

    // ── Imperative handle ─────────────────────────────────────────────────────

    useImperativeHandle(ref, () => ({
      focusSearch,
    }));

    // ── Keyboard shortcuts ─────────────────────────────────────────────────────

    const cycleViewMode = useCallback(() => {
      const idx = VIEW_MODES.indexOf(viewMode);
      setViewMode(VIEW_MODES[(idx + 1) % VIEW_MODES.length]);
    }, [viewMode, setViewMode]);

    const toggleEditMode = useCallback(() => {
      if (canToggleEdit) setInternalEditMode((v) => !v);
    }, [canToggleEdit]);

    useKeyboardShortcuts({
      onSlash: focusSearch,
      onDelete: deleteFocused,
      onUndo: () => {
        // Undo pops cursor; we need to notify parent of the new card state.
        // Because undo/redo cursor lives in useUndoStack, we dispatch the
        // undo action and read the resulting state on the next render.
        // Simpler: we inline a small undo effect here.
        undo();
      },
      onRedo: () => {
        redo();
      },
      onCycleView: cycleViewMode,
      onToggleEdit: toggleEditMode,
      onHelp: () => setHelpOpen(true),
      editMode: effectiveEditMode,
      canToggleEdit,
    });

    // Propagate undo/redo cursor changes upstream via onChange.
    // We track the last-propagated cards snapshot to avoid loops.
    const lastPropagatedRef = useRef<Card[]>(cards);
    useEffect(() => {
      // _undoCurrent is the cards array at the undo cursor position.
      // If it differs from what the parent currently has, push the update.
      if (_undoCurrent !== lastPropagatedRef.current && _undoCurrent !== cards) {
        lastPropagatedRef.current = _undoCurrent;
        onChange?.(_undoCurrent);
      }
    }, [_undoCurrent, cards, onChange]);

    // ── Container width for virtual scrolling ─────────────────────────────────

    const [containerWidth, containerWidthRef] = useContainerWidth();

    // ── Aria live regions ─────────────────────────────────────────────────────

    // Derive live-region message directly from viewMode — no state or effect needed.
    // The aria-live region will announce the current mode whenever viewMode changes.
    const liveMessage = `View mode: ${viewMode}`;

    // ── Helpers for gallery / breakdown tile grids ────────────────────────────

    const tileGridSx = {
      display: 'grid',
      gridTemplateColumns: {
        xs: 'repeat(auto-fill, minmax(120px, 1fr))',
        sm: 'repeat(auto-fill, minmax(160px, 1fr))',
        md: 'repeat(auto-fill, minmax(180px, 1fr))',
      },
      gap: { xs: 1.5, sm: 2 },
    };

    const lookupStateForCard = (card: Card): LookupState => {
      const key = card.tempId ?? card.scryfall_id ?? '';
      return lookupStates[key] ?? (card.scryfall_id ? 'resolved' : 'not_found');
    };

    const isCommanderCard = (card: Card): boolean => {
      if (commanderId && card.scryfall_id === commanderId) return true;
      return card.role === 'commander' || card.is_commander === true;
    };

    // ── Render helpers ────────────────────────────────────────────────────────

    function renderTile(card: Card) {
      const key = cardKey(card);
      const selected = selectedIds.has(key);
      const lookupState = lookupStateForCard(card);

      // If the card is marked commander by commanderId, we synthesise the
      // is_commander visual signal without altering the data shape.
      const tileCard: Card = isCommanderCard(card)
        ? { ...card, is_commander: true }
        : card;

      return (
        <Box
          key={key}
          onFocus={() => { focusedCardKeyRef.current = key; }}
          onBlur={() => {
            if (focusedCardKeyRef.current === key) focusedCardKeyRef.current = null;
          }}
        >
          <CardTile
            card={tileCard}
            lookupState={lookupState}
            editMode={effectiveEditMode}
            selected={effectiveEditMode ? selected : undefined}
            onSelectChange={effectiveEditMode ? (v) => toggleSelect(card, v) : undefined}
            onQtyChange={
              effectiveEditMode && onChange
                ? (qty) => {
                    const next = cards.map((c) =>
                      cardKey(c) === key ? { ...c, quantity: qty } : c,
                    );
                    mutate(next);
                  }
                : undefined
            }
            onDelete={
              effectiveEditMode && onChange
                ? () => {
                    const next = cards.filter((c) => cardKey(c) !== key);
                    mutate(next);
                  }
                : undefined
            }
          />
        </Box>
      );
    }

    function renderGallery(cardList: Card[]) {
      // Plain render for small lists
      if (cardList.length <= VIRTUAL_THRESHOLD) {
        return <Box sx={tileGridSx}>{cardList.map(renderTile)}</Box>;
      }

      // Virtual grid for large lists — requires measured container width
      const colCount = containerWidth > 0
        ? Math.max(1, Math.floor((containerWidth + TILE_GAP) / (TILE_MIN_WIDTH + TILE_GAP)))
        : 1;
      const colWidth = containerWidth > 0
        ? Math.floor((containerWidth - (colCount - 1) * TILE_GAP) / colCount)
        : TILE_MIN_WIDTH;
      const rowCount = Math.ceil(cardList.length / colCount);

      type GalleryCell = GridChildComponentProps<undefined>;
      function GalleryCell({ columnIndex, rowIndex, style }: GalleryCell) {
        const idx = rowIndex * colCount + columnIndex;
        if (idx >= cardList.length) return null;
        const card = cardList[idx];
        return (
          <div style={{ ...style, paddingRight: TILE_GAP, paddingBottom: TILE_GAP }}>
            {renderTile(card)}
          </div>
        );
      }

      return (
        <Box ref={containerWidthRef} sx={{ width: '100%' }}>
          {containerWidth > 0 && (
            <FixedSizeGrid
              columnCount={colCount}
              columnWidth={colWidth + TILE_GAP}
              rowCount={rowCount}
              rowHeight={TILE_ROW_HEIGHT}
              width={containerWidth}
              height={GALLERY_GRID_HEIGHT}
              style={{ overflowX: 'hidden' }}
            >
              {GalleryCell}
            </FixedSizeGrid>
          )}
        </Box>
      );
    }

    function renderText(cardList: Card[]) {
      // Shared table header — rendered above both plain and virtual bodies
      const tableHeader = (
        <TableHead>
          <TableRow>
            {effectiveEditMode && <TableCell padding="checkbox" />}
            <TableCell>Name</TableCell>
            <TableCell align="right" sx={{ width: 80 }}>Qty</TableCell>
            <TableCell sx={{ width: 120 }}>Mana</TableCell>
            <TableCell sx={{ width: 160 }}>Type</TableCell>
            {effectiveEditMode && <TableCell padding="checkbox" />}
          </TableRow>
        </TableHead>
      );

      // Plain render for small lists
      if (cardList.length <= VIRTUAL_THRESHOLD) {
        return (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small" aria-label="Card list">
              {tableHeader}
              <TableBody>
                {cardList.map((card) => {
                  const key = cardKey(card);
                  return (
                    <TextRow
                      key={key}
                      card={card}
                      editMode={effectiveEditMode}
                      selected={selectedIds.has(key)}
                      onSelectChange={(v) => toggleSelect(card, v)}
                      onQtyChange={(qty) => {
                        const next = cards.map((c) =>
                          cardKey(c) === key ? { ...c, quantity: qty } : c,
                        );
                        mutate(next);
                      }}
                      onDelete={() => {
                        const next = cards.filter((c) => cardKey(c) !== key);
                        mutate(next);
                      }}
                      lookupState={lookupStateForCard(card)}
                      isCommander={isCommanderCard(card)}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        );
      }

      // Virtual list for large lists using FixedSizeList.
      // FixedSizeList requires a single scrollable container; we render the
      // sticky <TableHead> outside the scrolled area and virtualise only the body.
      type TextListRow = ListChildComponentProps<undefined>;
      function TextListRow({ index, style }: TextListRow) {
        const card = cardList[index];
        const key = cardKey(card);
        return (
          // FixedSizeList passes absolute-positioned style — wrap in a <tr>-
          // compatible container. We use a plain div here because FixedSizeList
          // renders into a div scroller, not a <tbody>; the table header is
          // rendered separately above.
          <div style={style}>
            <Table size="small" sx={{ tableLayout: 'fixed' }}>
              <TableBody>
                <TextRow
                  key={key}
                  card={card}
                  editMode={effectiveEditMode}
                  selected={selectedIds.has(key)}
                  onSelectChange={(v) => toggleSelect(card, v)}
                  onQtyChange={(qty) => {
                    const next = cards.map((c) =>
                      cardKey(c) === key ? { ...c, quantity: qty } : c,
                    );
                    mutate(next);
                  }}
                  onDelete={() => {
                    const next = cards.filter((c) => cardKey(c) !== key);
                    mutate(next);
                  }}
                  lookupState={lookupStateForCard(card)}
                  isCommander={isCommanderCard(card)}
                />
              </TableBody>
            </Table>
          </div>
        );
      }

      return (
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          {/* Sticky header */}
          <Table size="small" aria-label="Card list" sx={{ tableLayout: 'fixed' }}>
            {tableHeader}
          </Table>
          {/* Virtualised body */}
          <FixedSizeList
            itemCount={cardList.length}
            itemSize={TEXT_ROW_HEIGHT}
            height={TEXT_LIST_HEIGHT}
            width="100%"
          >
            {TextListRow}
          </FixedSizeList>
        </Paper>
      );
    }

    function renderBreakdown(cardList: Card[]) {
      // Group by type
      const groups: Record<TypeCategory, Card[]> = {} as Record<TypeCategory, Card[]>;
      for (const cat of TYPE_CATEGORIES) groups[cat] = [];
      for (const card of cardList) {
        const cat = categorizeByType(card.type_line);
        groups[cat].push(card);
      }

      return (
        <Stack spacing={3}>
          {TYPE_CATEGORIES.filter((cat) => groups[cat].length > 0).map((cat) => (
            <Box key={cat}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1.5 }}
              >
                <Typography variant="subtitle2" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                  {TYPE_GROUP_LABELS[cat]}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({groups[cat].length})
                </Typography>
              </Stack>
              <Box sx={tileGridSx}>{groups[cat].map(renderTile)}</Box>
            </Box>
          ))}
        </Stack>
      );
    }

    // ── Main render ───────────────────────────────────────────────────────────

    const selectedCount = selectedIds.size;

    return (
      <Box ref={containerRef} sx={{ position: 'relative' }}>
        {/* ARIA live region — announces view mode changes and selection count */}
        <Box
          aria-live="polite"
          aria-atomic="true"
          sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}
        >
          {liveMessage}
        </Box>

        {/* ── Toolbar row: filter + view mode toggle + undo/redo + help ──────── */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
          justifyContent="space-between"
          spacing={1}
          sx={{ mb: 1.5 }}
          flexWrap="wrap"
        >
          {/* Filter bar takes up the left portion */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CardFilterBar
              state={filterState}
              onChange={setFilterState}
              cards={cards}
            />
          </Box>

          {/* Right-side controls: undo/redo + view mode + help */}
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
            {effectiveEditMode && onChange && (
              <>
                <Tooltip title={canUndo ? 'Undo (Cmd+Z)' : 'Nothing to undo'}>
                  <span>
                    <IconButton
                      size="small"
                      onClick={undo}
                      disabled={!canUndo}
                      aria-label="Undo"
                    >
                      <UndoIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={canRedo ? 'Redo (Cmd+Shift+Z)' : 'Nothing to redo'}>
                  <span>
                    <IconButton
                      size="small"
                      onClick={redo}
                      disabled={!canRedo}
                      aria-label="Redo"
                    >
                      <RedoIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </>
            )}

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              size="small"
              onChange={(_e, mode) => { if (mode) setViewMode(mode); }}
              aria-label="View mode"
            >
              <ToggleButton value="gallery" aria-label="Gallery view">
                <Tooltip title="Gallery (V)">
                  <GridViewIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="text" aria-label="Text view">
                <Tooltip title="Text list (V)">
                  <TableRowsIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="breakdown" aria-label="Breakdown view">
                <Tooltip title="Type breakdown (V)">
                  <CategoryIcon fontSize="small" />
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>

            <Tooltip title="Keyboard shortcuts (?)">
              <IconButton size="small" onClick={() => setHelpOpen(true)} aria-label="Keyboard shortcuts">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* ── Bulk-select sticky toolbar ──────────────────────────────────────── */}
        {effectiveEditMode && selectedCount > 0 && (
          <Paper
            elevation={3}
            sx={{
              position: 'sticky',
              top: 8,
              zIndex: 10,
              mb: 1.5,
              borderRadius: 1,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            <Toolbar variant="dense" sx={{ gap: 1, minHeight: 40 }}>
              <Typography variant="body2" fontWeight={700} aria-live="polite" aria-atomic="true">
                {selectedCount} selected
              </Typography>
              <Button
                size="small"
                color="inherit"
                startIcon={<DeleteSweepIcon fontSize="small" />}
                onClick={deleteSelected}
                aria-label={`Delete ${selectedCount} selected card${selectedCount !== 1 ? 's' : ''}`}
              >
                Delete selected
              </Button>
              <Button size="small" color="inherit" onClick={clearSelection}>
                Clear selection
              </Button>
            </Toolbar>
          </Paper>
        )}

        {/* ── Card list body ─────────────────────────────────────────────────── */}
        {displayedCards.length === 0 ? (
          <EmptyState editMode={effectiveEditMode} />
        ) : viewMode === 'gallery' ? (
          renderGallery(displayedCards)
        ) : viewMode === 'text' ? (
          renderText(displayedCards)
        ) : (
          renderBreakdown(displayedCards)
        )}

        {/* ── Dialogs ────────────────────────────────────────────────────────── */}

        <KeyboardHelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />

        <ConflictDialog
          open={!!conflict}
          serverCardCount={conflict?.serverCards.length ?? 0}
          onAcceptServer={() => onConflictResolve?.('accept-server')}
          onKeepLocal={() => onConflictResolve?.('keep-local')}
        />
      </Box>
    );
  },
);
