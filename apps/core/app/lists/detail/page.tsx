'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
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
import { ListEditor } from '@/components/cards/ListEditor';
import { useList } from '@/lib/lists/useList';
import { useConfirm } from '@/lib/useConfirm';
import { api } from '@/lib/api';

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

  // ── Dirty guard ───────────────────────────────────────────────────────────
  const [dirty, setDirty] = useState(false);
  const { confirm, dialog: confirmDialog } = useConfirm();

  const confirmLeaveIfDirty = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!dirty) return;
      e.preventDefault();
      const href = e.currentTarget.getAttribute('href');
      confirm({
        title:        'Unsaved changes',
        message:      'You have unsaved changes. Leave this page anyway?',
        confirmLabel: 'Leave',
        cancelLabel:  'Stay',
        destructive:  true,
      }).then((ok) => {
        if (ok && href) router.push(href);
      });
    },
    [dirty, confirm, router],
  );

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

  // ── Redirect to /lists on 404 (list not found after load completes) ────────

  useEffect(() => {
    if (!loading && !listError && !list && listId) {
      router.replace('/lists');
    }
  }, [loading, listError, list, listId, router]);

  // ── Detach from deck ──────────────────────────────────────────────────────

  const handleDetach = useCallback(async () => {
    if (dirty) {
      const ok = await confirm({
        title:        'Unsaved changes',
        message:      'You have unsaved changes. Detach from deck anyway?',
        confirmLabel: 'Detach',
        cancelLabel:  'Cancel',
        destructive:  true,
      });
      if (!ok) return;
    }
    try {
      await detachFromDeck();
      await refresh();
    } catch {
      setError('Failed to detach list from deck');
    }
  }, [dirty, confirm, detachFromDeck, refresh]);

  // ── Restore soft-deleted list ─────────────────────────────────────────────

  const handleRestore = useCallback(async () => {
    setRestoring(true);
    try {
      // api.restoreList does not exist yet — surface via error banner for now.
      setError('Restore is not yet available. Please contact an admin.');
    } finally {
      setRestoring(false);
    }
  }, []);

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
      onBackClick={confirmLeaveIfDirty}
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

      {/* Unified card editor — same component used by decks/decklist */}
      <ListEditor
        list={list}
        cards={cards}
        save={save}
        conflict={conflict}
        refresh={refresh}
        deckContext={deckContext ?? null}
        onDetachFromDeck={deckContext ? handleDetach : undefined}
        onDirtyChange={setDirty}
      />

      {confirmDialog}
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
