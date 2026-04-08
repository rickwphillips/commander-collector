'use client';

import { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import LinkIcon from '@mui/icons-material/Link';

import { PageContainer } from '@/components/PageContainer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { CardListView } from '@/components/cards/CardListView';
import { CardListToolbar } from '@/components/cards/CardListToolbar';
import { useList } from '@/lib/lists/useList';
import { api } from '@/lib/api';
import type { Card } from '@/lib/cards/types';
import type { FilterSortState } from '@/lib/cards/filter';
import type { SaveDestination } from '@/components/cards/SaveToListDialog';

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_FILTER_STATE: FilterSortState = { sort: 'name', sortDir: 'asc' };

// ── Undo stack (simple array of Card[] snapshots, 50-step cap) ─────────────────

interface UndoStack {
  past: Card[][];
  future: Card[][];
}

const UNDO_CAP = 50;

function pushUndo(stack: UndoStack, snapshot: Card[]): UndoStack {
  const past = [...stack.past, snapshot].slice(-UNDO_CAP);
  return { past, future: [] };
}

// ── Inner component (uses useSearchParams) ────────────────────────────────────

function ListPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listId = searchParams.get('id') ?? '';

  // ── List hook ──────────────────────────────────────────────────────────────
  const {
    list,
    cards,
    loading,
    error: listError,
    conflict,
    save,
    detachFromDeck,
    refresh,
  } = useList({ id: listId });

  // ── Deck name (only fetched when list is attached to a deck) ──────────────
  const [deckName, setDeckName] = useState<string | null>(null);
  const [deckNameLoading, setDeckNameLoading] = useState(false);

  // ── Local UI state ────────────────────────────────────────────────────────
  const [error, setError] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [buffer, setBuffer] = useState<Card[]>([]);
  const [viewMode, setViewMode] = useState<'gallery' | 'text' | 'breakdown'>('gallery');
  const [filterState, setFilterState] = useState<FilterSortState>(DEFAULT_FILTER_STATE);

  // Undo/redo
  const undoStack = useRef<UndoStack>({ past: [], future: [] });
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Conflict resolution
  const [conflictProp, setConflictProp] = useState<{ serverCards: Card[] } | null>(null);

  // ── Load deck name when list has a deck_id ────────────────────────────────

  useEffect(() => {
    if (!list?.deck_id) {
      setDeckName(null);
      return;
    }
    let cancelled = false;
    setDeckNameLoading(true);
    api.getDeck(list.deck_id)
      .then((deck) => {
        if (!cancelled) setDeckName(deck.name);
      })
      .catch(() => {
        if (!cancelled) setDeckName(null);
      })
      .finally(() => {
        if (!cancelled) setDeckNameLoading(false);
      });
    return () => { cancelled = true; };
  }, [list?.deck_id]);

  // ── Sync buffer when cards load (or are reloaded) ─────────────────────────

  useEffect(() => {
    setBuffer(cards);
    // Reset undo stack on reload
    undoStack.current = { past: [], future: [] };
    setCanUndo(false);
    setCanRedo(false);
  }, [cards]);

  // ── Redirect to /lists on 404 (list not found after load completes) ────────

  useEffect(() => {
    if (!loading && !listError && !list && listId) {
      router.replace('/lists');
    }
  }, [loading, listError, list, listId, router]);

  // ── Conflict: propagate hook conflict into prop ───────────────────────────

  useEffect(() => {
    if (conflict) {
      // Server cards are available via refresh; use current server-loaded cards
      // as the conflict snapshot (the hook retains its server state on conflict).
      setConflictProp({ serverCards: cards });
    } else {
      setConflictProp(null);
    }
  }, [conflict, cards]);

  // ── Buffer change handler (records undo step) ─────────────────────────────

  const handleBufferChange = useCallback((next: Card[]) => {
    undoStack.current = pushUndo(undoStack.current, buffer);
    setBuffer(next);
    setCanUndo(true);
    setCanRedo(false);
  }, [buffer]);

  // ── Undo / Redo ───────────────────────────────────────────────────────────

  const handleUndo = useCallback(() => {
    const { past, future } = undoStack.current;
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    undoStack.current = {
      past: past.slice(0, -1),
      future: [buffer, ...future].slice(0, UNDO_CAP),
    };
    setBuffer(previous);
    setCanUndo(undoStack.current.past.length > 0);
    setCanRedo(true);
  }, [buffer]);

  const handleRedo = useCallback(() => {
    const { past, future } = undoStack.current;
    if (future.length === 0) return;
    const next = future[0];
    undoStack.current = {
      past: [...past, buffer].slice(-UNDO_CAP),
      future: future.slice(1),
    };
    setBuffer(next);
    setCanUndo(true);
    setCanRedo(undoStack.current.future.length > 0);
  }, [buffer]);

  // ── Clear ─────────────────────────────────────────────────────────────────

  const handleClear = useCallback(() => {
    undoStack.current = pushUndo(undoStack.current, buffer);
    setBuffer([]);
    setCanUndo(true);
    setCanRedo(false);
  }, [buffer]);

  // ── Save ──────────────────────────────────────────────────────────────────

  const handleSave = useCallback(async (_destination: SaveDestination) => {
    try {
      await save(buffer);
      setEditMode(false);
    } catch {
      setError('Failed to save list');
    }
  }, [save, buffer]);

  // ── Detach from deck ──────────────────────────────────────────────────────

  const handleDetach = useCallback(async () => {
    try {
      await detachFromDeck();
      await refresh();
    } catch {
      setError('Failed to detach list from deck');
    }
  }, [detachFromDeck, refresh]);

  // ── Restore soft-deleted list ─────────────────────────────────────────────

  const handleRestore = useCallback(async () => {
    setRestoring(true);
    try {
      // api.restoreList does not exist yet — surface via error banner for now.
      // TODO: implement api.restoreList when the PHP endpoint is available.
      setError('Restore is not yet available. Please contact an admin.');
    } finally {
      setRestoring(false);
    }
  }, []);

  // ── Conflict resolution ───────────────────────────────────────────────────

  const handleConflictResolve = useCallback(async (choice: 'accept-server' | 'keep-local') => {
    if (choice === 'accept-server') {
      await refresh();
    }
    setConflictProp(null);
  }, [refresh]);

  // ── Guards ────────────────────────────────────────────────────────────────

  if (!listId) {
    return (
      <PageContainer title="List Not Found" backHref="/lists" backLabel="Lists">
        <Typography>No list ID provided.</Typography>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer title="Card List" backHref="/lists" backLabel="Lists">
        <LoadingSpinner message="Loading list…" />
      </PageContainer>
    );
  }

  if (listError && !list) {
    return (
      <PageContainer title="Error" backHref="/lists" backLabel="Lists">
        <Alert severity="error">{listError}</Alert>
      </PageContainer>
    );
  }

  if (!list) {
    // Redirect effect will fire; show spinner while navigating
    return (
      <PageContainer title="Not Found" backHref="/lists" backLabel="Lists">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────────

  const isDeleted = !!list.deleted_at;
  const deckContext =
    list.deck_id && deckName
      ? { id: list.deck_id, name: deckName }
      : list.deck_id
      ? { id: list.deck_id, name: deckNameLoading ? 'Loading…' : 'Attached Deck' }
      : undefined;

  const headerSubtitle = (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
      {list.format && (
        <Chip label={list.format} size="small" variant="outlined" />
      )}
      {deckContext && (
        <Chip
          icon={<LinkIcon />}
          label={`Deck: ${deckContext.name}`}
          size="small"
          color="primary"
          variant="outlined"
          component="a"
          href={`/decks/detail?id=${deckContext.id}`}
          clickable
        />
      )}
      {isDeleted && (
        <Chip label="Deleted" size="small" color="error" variant="filled" />
      )}
    </Stack>
  );

  return (
    <PageContainer
      title={list.name}
      subtitle={headerSubtitle}
      backHref="/lists"
      backLabel="Lists"
    >
      {/* Error banner */}
      {(error || listError) && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error ?? listError}
        </Alert>
      )}

      {/* Soft-delete banner */}
      {isDeleted && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={
            <Button
              size="small"
              startIcon={<RestoreIcon />}
              onClick={handleRestore}
              disabled={restoring}
            >
              Restore
            </Button>
          }
        >
          This list is in the trash.
        </Alert>
      )}

      {/* Toolbar */}
      <CardListToolbar
        buffer={buffer}
        onBufferChange={handleBufferChange}
        format={list.format}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        editMode={editMode}
        onEditModeChange={setEditMode}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        onClear={handleClear}
        listId={list.id}
        deckContext={deckContext ?? null}
        onDetachFromDeck={deckContext ? handleDetach : undefined}
      />

      {/* Card list */}
      <CardListView
        cards={buffer}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        editMode={editMode}
        onChange={handleBufferChange}
        filterState={filterState}
        onFilterStateChange={setFilterState}
        conflict={conflictProp}
        onConflictResolve={handleConflictResolve}
        deckContext={deckContext}
      />

    </PageContainer>
  );
}

export default function ListDetailPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    }>
      <ListPageInner />
    </Suspense>
  );
}
