'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { PageContainer } from '@/components/PageContainer';
import { ColorIdentityChips } from '@/components/ColorIdentityChips';
import { CardTooltip } from '@commander/shared/components/CardTooltip';
import { CardListToolbar } from '@/components/cards/CardListToolbar';
import { CardListView } from '@/components/cards/CardListView';
import { useList } from '@/lib/lists/useList';
import { api } from '@/lib/api';
import type { Card } from '@/lib/cards/types';
import type { DeckDetail } from '@/lib/types';
import type { SaveDestination } from '@/components/cards/SaveToListDialog';

function DeckListPageInner() {
  const searchParams = useSearchParams();
  const router  = useRouter();
  const deckId  = searchParams.get('id') ?? '';

  // ── Deck metadata (deck-native: name, commander, partner, colors) ─────────
  const [deck,        setDeck]        = useState<DeckDetail | null>(null);
  const [deckLoading, setDeckLoading] = useState(true);
  const [deckError,   setDeckError]   = useState<string | null>(null);

  useEffect(() => {
    if (!deckId) { setDeckLoading(false); return; }
    api.getDeck(deckId)
      .then(setDeck)
      .catch(() => setDeckError('Deck not found.'))
      .finally(() => setDeckLoading(false));
  }, [deckId]);

  // ── List data (list-native: cards, version, role) ────────────────────────
  const {
    list, cards, loading: listLoading, error: listError, conflict,
    save, addCards, detachFromDeck, refresh,
  } = useList({ deckId });

  // ── Local UI state ────────────────────────────────────────────────────────
  const [viewMode,  setViewMode]  = useState<'gallery' | 'text' | 'breakdown'>('gallery');
  const [editMode,  setEditMode]  = useState(false);
  const [buffer,    setBuffer]    = useState<Card[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Handlers ──────────────────────────────────────────────────────────────

  // Toolbar Save — merge buffer into list
  const handleSave = useCallback(async (_destination: SaveDestination) => {
    if (buffer.length === 0) return;
    try {
      await addCards(buffer);
      setBuffer([]);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    }
  }, [buffer, addCards]);

  // Toolbar Clear — wipe the list
  const handleClear = useCallback(async () => {
    try {
      await save([]);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Clear failed');
    }
  }, [save]);

  // Toolbar Detach — unlink list from deck, navigate away
  const handleDetach = useCallback(async () => {
    await detachFromDeck();
    await refresh();
    router.push('/decks');
  }, [detachFromDeck, refresh, router]);

  // CardListView onChange — called on every in-editor mutation; save immediately
  const handleCardsChange = useCallback(async (updated: Card[]) => {
    try {
      await save(updated);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Auto-save failed');
    }
  }, [save]);

  // Conflict resolution
  const handleConflictResolve = useCallback((choice: 'accept-server' | 'keep-local') => {
    if (choice === 'accept-server') refresh();
  }, [refresh]);

  // ── Guards ────────────────────────────────────────────────────────────────

  const loading = deckLoading || listLoading;

  if (!deckId) {
    return (
      <PageContainer title="Deck Card List" backHref="/decks" backLabel="Back to Decks">
        <Typography>No deck ID provided.</Typography>
      </PageContainer>
    );
  }

  if (loading) {
    return (
      <PageContainer title="Deck Card List" backHref="/decks" backLabel="Back to Decks">
        <Stack alignItems="center" py={8}><CircularProgress size={48} /></Stack>
      </PageContainer>
    );
  }

  if (deckError || !deck) {
    return (
      <PageContainer title="Deck Not Found" backHref="/decks" backLabel="Back to Decks">
        <Alert severity="error" sx={{ mb: 2 }}>{deckError ?? 'Deck not found.'}</Alert>
        <Button component={Link} href="/decks" variant="outlined">Back to Decks</Button>
      </PageContainer>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const deckContext = { id: deckId, name: deck.name };

  return (
    <PageContainer
      title={deck.name}
      subtitle={
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography variant="body2" color="text.secondary" component="span">
            Commander:{' '}
            <CardTooltip name={deck.commander} style={{ borderBottom: '1px dotted currentColor' }}>
              {deck.commander}
            </CardTooltip>
            {deck.partner && (
              <>
                {' + '}
                <CardTooltip name={deck.partner} style={{ borderBottom: '1px dotted currentColor' }}>
                  {deck.partner}
                </CardTooltip>
              </>
            )}
          </Typography>
          <ColorIdentityChips colors={deck.colors} size="small" />
        </Stack>
      }
      backHref={`/decks/detail?id=${deckId}`}
      backLabel="Back to Deck"
    >
      {/* Errors */}
      {(listError || saveError) && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSaveError(null)}>
          {listError ?? saveError}
        </Alert>
      )}

      {/* Empty-state when deck has no list yet */}
      {!list && (
        <Alert severity="info" sx={{ mb: 2 }}>
          This deck has no cards yet. Click <strong>Add</strong> in the toolbar to start.
        </Alert>
      )}

      {/* Toolbar — add, view/edit mode, undo/redo, save, clear, detach */}
      <CardListToolbar
        buffer={buffer}
        onBufferChange={setBuffer}
        format={list?.format}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        editMode={editMode}
        onEditModeChange={setEditMode}
        canUndo={false}
        canRedo={false}
        onUndo={() => {}}
        onRedo={() => {}}
        onSave={handleSave}
        onClear={handleClear}
        listId={list?.id}
        deckContext={deckContext}
        onDetachFromDeck={handleDetach}
      />

      {/* Card list */}
      <Box sx={{ mt: 2 }}>
        <CardListView
          cards={cards}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          editMode={editMode}
          onChange={handleCardsChange}
          conflict={conflict ? { serverCards: cards } : null}
          onConflictResolve={handleConflictResolve}
          deckContext={deckContext}
        />
      </Box>

      {/* Back link */}
      <Box sx={{ mt: 3 }}>
        <MuiLink component={Link} href={`/decks/detail?id=${deckId}`} variant="body2" color="text.secondary">
          Back to deck profile
        </MuiLink>
      </Box>
    </PageContainer>
  );
}

export default function DeckListPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    }>
      <DeckListPageInner />
    </Suspense>
  );
}
