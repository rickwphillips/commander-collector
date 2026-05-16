'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Link as MuiLink,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import Link from 'next/link';
import { PageContainer } from '@/components/PageContainer';
import { ColorIdentityChips } from '@/components/ColorIdentityChips';
import { CardTooltip } from '@commander/shared/components/CardTooltip';
import { ListEditor } from '@/components/cards/ListEditor';
import { GuruChat, type GuruChatHandle } from '@/components/GuruChat';
import { useList } from '@/lib/lists/useList';
import { useConfirm } from '@/lib/useConfirm';
import { api } from '@/lib/api';
import type { DeckDetail } from '@/lib/types';

function DeckListPageInner() {
  const searchParams = useSearchParams();
  const router  = useRouter();
  const deckId  = searchParams.get('id') ?? '';

  // ── Deck metadata (deck-native: name, commander, partner, colors) ─────────
  const [deck,        setDeck]        = useState<DeckDetail | null>(null);
  const [deckLoading, setDeckLoading] = useState(true);
  const [deckError,   setDeckError]   = useState<string | null>(null);

  // ── Discuss Deck coach ────────────────────────────────────────────────────
  const [coachOpen, setCoachOpen] = useState(false);
  const coachRef = useRef<GuruChatHandle>(null);

  useEffect(() => {
    if (!deckId) { setDeckLoading(false); return; }
    api.getDeck(deckId)
      .then(d => {
        setDeck(d);
        coachRef.current?.setActiveDeck({
          deckId: d.id,
          deckName: d.name,
          cardCount: 0,
          commander: d.commander ?? '',
          colors: d.colors ?? '',
        });
      })
      .catch(() => setDeckError('Deck not found.'))
      .finally(() => setDeckLoading(false));
  }, [deckId]);

  // ── List data (list-native: cards, version, role) ────────────────────────
  const {
    list, cards, loading: listLoading, error: listError, conflict,
    save, detachFromDeck, refresh,
  } = useList({ deckId });

  // ── Dirty guard ───────────────────────────────────────────────────────────
  const [dirty, setDirty] = useState(false);
  const { confirm, dialog: confirmDialog } = useConfirm();

  // Synchronous link interceptor: a click handler can't await a Promise and
  // still preventDefault, so we approximate — preventDefault FIRST, then prompt
  // and (on confirm) navigate via router.push.
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

  // ── Toolbar Detach — unlink list from deck, navigate away ─────────────────
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
    await detachFromDeck();
    await refresh();
    router.push('/decks');
  }, [dirty, confirm, detachFromDeck, refresh, router]);

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
      onBackClick={confirmLeaveIfDirty}
      actions={
        <Tooltip title="Discuss this deck with the Coach">
          <IconButton onClick={() => setCoachOpen(true)} sx={{ color: '#6B8E6B' }}>
            <SmartToyIcon />
          </IconButton>
        </Tooltip>
      }
    >
      {/* Errors */}
      {listError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {listError}
        </Alert>
      )}

      {/* Empty-state when deck has no list yet */}
      {!list && (
        <Alert severity="info" sx={{ mb: 2 }}>
          This deck has no cards yet. Click <strong>Add</strong> in the toolbar to start.
        </Alert>
      )}

      {/* Unified card editor — same component used by lists/detail */}
      <ListEditor
        list={list}
        cards={cards}
        save={save}
        conflict={conflict}
        refresh={refresh}
        deckContext={deckContext}
        onDetachFromDeck={handleDetach}
        onDirtyChange={setDirty}
      />

      {/* Back link */}
      <Box sx={{ mt: 3 }}>
        <MuiLink component={Link} href={`/decks/detail?id=${deckId}`} onClick={confirmLeaveIfDirty} variant="body2" color="text.secondary">
          Back to deck profile
        </MuiLink>
      </Box>

      {confirmDialog}

      <GuruChat
        ref={coachRef}
        notes={[]}
        open={coachOpen}
        onToggle={setCoachOpen}
        autoGreet={deck ? `I want to discuss my ${deck.name} deck (commander: ${deck.commander}). Give me a focused overview — key synergies, win conditions, and anything you'd flag as a weakness.` : undefined}
      />
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
