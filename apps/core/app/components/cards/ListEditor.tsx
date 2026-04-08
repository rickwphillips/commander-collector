'use client';

/**
 * ListEditor — THE shared card-editing surface for both decks and lists.
 *
 * This component is the entire reason for the unified card workflow refactor.
 * Both `decks/decklist/page.tsx` and `lists/detail/page.tsx` MUST use this and
 * MUST NOT re-implement any of: buffer, undo/redo, save, clear, conflict UI,
 * filtering, display. Pages own header metadata only.
 *
 * Per the peers rule, this component does not know whether the list is attached
 * to a deck — it just edits a list. Pages provide `deckContext` if applicable.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Box, Button } from '@mui/material';

import { CardListDisplay } from '@/components/CardListDisplay';
import { ListGallery } from '@/components/cards/ListGallery';
import { CardListToolbar } from '@/components/cards/CardListToolbar';
import {
  DeckFilters,
  EMPTY_FILTERS,
  matchesFilters,
  sortCards,
  type DeckFilterState,
} from '@/components/DeckFilters';
import type { Card } from '@/lib/cards/types';
import type { SaveDestination } from '@/components/cards/SaveToListDialog';

// ── Undo stack ───────────────────────────────────────────────────────────────

interface UndoStack {
  past: Card[][];
  future: Card[][];
}

const UNDO_CAP = 50;

function pushUndo(stack: UndoStack, snapshot: Card[]): UndoStack {
  return { past: [...stack.past, snapshot].slice(-UNDO_CAP), future: [] };
}

// ── Props ────────────────────────────────────────────────────────────────────

export interface ListEditorProps {
  /** The list metadata (id, format, name, deck_id). Null when no list exists yet. */
  list: { id: string; format: string; name: string; deck_id: string | null } | null;
  /** Cards as currently loaded from the server. Source of truth for the buffer. */
  cards: Card[];
  /** Atomic save: replaces the entire list's cards on the server. */
  save: (cards: Card[]) => Promise<void>;
  /** True when the last save hit a 409 conflict. */
  conflict: boolean;
  /** Reload from server (used by conflict-resolution Reload button). */
  refresh: () => Promise<void>;
  /** Optional deck context — used to render the detach button on the toolbar. */
  deckContext?: { id: string; name: string } | null;
  /** Called when the user clicks Detach. Parent handles navigation if any. */
  onDetachFromDeck?: () => Promise<void> | void;
  /** Notified whenever the buffer becomes dirty/clean relative to server cards. */
  onDirtyChange?: (dirty: boolean) => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export function ListEditor({
  list,
  cards,
  save,
  conflict,
  refresh,
  deckContext,
  onDetachFromDeck,
  onDirtyChange,
}: ListEditorProps) {
  // ── Edit state (buffer + undo) ──────────────────────────────────────────────
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<'text' | 'gallery'>('text');
  const [buffer,   setBuffer]   = useState<Card[]>(cards);
  const [filters,  setFilters]  = useState<DeckFilterState>(EMPTY_FILTERS);
  const [error,    setError]    = useState<string | null>(null);

  const undoStack = useRef<UndoStack>({ past: [], future: [] });
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Sync buffer when server cards change (initial load + refresh).
  useEffect(() => {
    setBuffer(cards);
    undoStack.current = { past: [], future: [] };
    setCanUndo(false);
    setCanRedo(false);
  }, [cards]);

  // Dirty flag: buffer differs from server cards. Cheap shallow check by
  // (length, card_name, quantity) — sufficient for the qty/remove edits this
  // editor produces. Doesn't track reorder-only changes (we don't reorder).
  const isDirty = (() => {
    if (buffer.length !== cards.length) return true;
    const byKey = new Map(cards.map((c) => [c.card_name, c.quantity]));
    for (const c of buffer) {
      if (byKey.get(c.card_name) !== c.quantity) return true;
    }
    return false;
  })();

  // Guard against accidental close / refresh / navigation when buffer has
  // unsaved changes. The browser shows a generic "Leave site?" confirm.
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Required for Chrome to actually show the prompt.
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Notify parent when dirty state flips so it can guard in-app navigation.
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // ── Full-buffer replacement (toolbar Add, Clear, undo/redo, etc.) ──────────
  // Caller passes the COMPLETE next buffer; we just snapshot for undo and set.

  const handleBufferReplace = useCallback((next: Card[]) => {
    undoStack.current = pushUndo(undoStack.current, buffer);
    setBuffer(next);
    setCanUndo(true);
    setCanRedo(false);
  }, [buffer]);

  // ── Filtered-subset mutation (in-place +/- and × in the list/gallery view) ──
  // Caller passes the (post-edit) FILTERED VISIBLE subset; we reconcile against
  // the full pool by card_name so cards hidden by the current filter are kept.

  const handleVisibleChange = useCallback((nextVisible: Card[]) => {
    const visibleBefore = new Set(
      buffer.filter((c) => matchesFilters(c, filters)).map((c) => c.card_name),
    );
    const nextMap = new Map(nextVisible.map((c) => [c.card_name, c]));
    const merged: Card[] = [];
    for (const c of buffer) {
      if (visibleBefore.has(c.card_name)) {
        const updated = nextMap.get(c.card_name);
        if (updated) merged.push(updated);
        // else: removed in edit, drop it
      } else {
        merged.push(c);
      }
    }
    undoStack.current = pushUndo(undoStack.current, buffer);
    setBuffer(merged);
    setCanUndo(true);
    setCanRedo(false);
  }, [buffer, filters]);

  // ── Undo / Redo ─────────────────────────────────────────────────────────────

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

  // ── Clear ───────────────────────────────────────────────────────────────────

  const handleClear = useCallback(() => {
    handleBufferReplace([]);
  }, [handleBufferReplace]);

  // ── Save (toolbar) ──────────────────────────────────────────────────────────
  // Simple save: commit buffer back to the current list. Used by the primary
  // Save button when an existing list is loaded.
  const handleSimpleSave = useCallback(async () => {
    try {
      await save(buffer);
      setEditMode(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    }
  }, [save, buffer]);

  // Save as: legacy callback used by SaveToListDialog with a destination payload.
  // Currently the in-page editor only supports the simple commit path; advanced
  // destinations (new-list / new-deck / append-to-list) are caller's responsibility.
  // For now, treat any returned destination as "save buffer to current list".
  const handleSave = useCallback(async (_destination: SaveDestination) => {
    await handleSimpleSave();
  }, [handleSimpleSave]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <CardListToolbar
        buffer={buffer}
        onBufferChange={handleBufferReplace}
        format={list?.format}
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
        onSimpleSave={list ? handleSimpleSave : undefined}
        isDirty={isDirty}
        listId={list?.id}
        currentList={list}
        deckContext={deckContext ?? null}
        onDetachFromDeck={onDetachFromDeck}
      />

      {conflict && (
        <Alert severity="warning" sx={{ mb: 2 }} action={
          <Button size="small" onClick={refresh}>Reload</Button>
        }>
          Save conflict — another session modified this list. Reload to merge.
        </Alert>
      )}

      {(() => {
        const visible = sortCards(
          buffer.filter((c) => matchesFilters(c, filters)),
          filters.sortOrder,
          filters.sortDirection,
        );
        return (
          <>
            <DeckFilters
              filters={filters}
              onChange={setFilters}
              cards={buffer}
              resultCount={visible.length}
              totalCount={buffer.length}
            />
            {viewMode === 'gallery' ? (
          <ListGallery
            cards={visible}
            editMode={editMode}
            onChange={handleVisibleChange}
          />
            ) : (
              <CardListDisplay
                cards={visible}
                useColorIdentity={filters.useColorIdentity}
                editMode={editMode}
                onChange={handleVisibleChange}
              />
            )}
          </>
        );
      })()}
    </Box>
  );
}
