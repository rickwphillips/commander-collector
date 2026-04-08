'use client';

import { useCallback, useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { PageContainer } from '@/components/PageContainer';
import { ScanInput } from '@/components/scan/ScanInput';
import { CardListView } from '@/components/cards/CardListView';
import { SaveToListDialog, type SaveDestination } from '@/components/cards/SaveToListDialog';
import { api } from '@/lib/api';
import type { Card } from '@/lib/cards/types';
import type { CardList, DeckWithPlayer } from '@/lib/types';

function ScanPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // ?edit=<deck_id> — backwards-compat URL param for editing an existing deck's cards
  const editDeckId = searchParams.get('edit') ?? null;

  const [buffer, setBuffer] = useState<Card[]>([]);

  // Deck context: name only (for page title / back link) — loaded when editDeckId present
  const [deckName, setDeckName] = useState<string | null>(null);
  const [deckLoading, setDeckLoading] = useState(!!editDeckId);
  const [deckLoadError, setDeckLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!editDeckId) return;
    api.getDeck(editDeckId)
      .then((d) => setDeckName(d.name))
      .catch(() => setDeckLoadError('Failed to load deck'))
      .finally(() => setDeckLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editDeckId]);

  // Save dialog state
  const [saveOpen, setSaveOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Deck / list pickers for SaveToListDialog — loaded lazily on first open
  const [decks, setDecks] = useState<DeckWithPlayer[]>([]);
  const [lists, setLists] = useState<CardList[]>([]);
  const [pickersLoaded, setPickersLoaded] = useState(false);

  const openSaveDialog = useCallback(async () => {
    if (!pickersLoaded) {
      try {
        const [d, l] = await Promise.all([api.getDecks(), api.getLists()]);
        setDecks(d); setLists(l); setPickersLoaded(true);
      } catch {
        setSaveError('Failed to load decks and lists');
        return;
      }
    }
    setSaveOpen(true);
  }, [pickersLoaded]);

  const handleSaveConfirm = useCallback(async (dest: SaveDestination) => {
    setSaving(true);
    setSaveError(null);
    const payload = buffer.map((c) => ({
      card_name: c.card_name, scryfall_id: c.scryfall_id,
      quantity: c.quantity, is_commander: c.is_commander, is_proxy: c.is_proxy,
    }));
    const done = (msg: string, href: string) => {
      setSaveOpen(false); setBuffer([]); setSuccessMsg(msg); router.push(href);
    };
    try {
      if (dest.kind === 'new-list') {
        const res = await api.createList(dest.name, undefined, payload);
        done(`List "${dest.name}" saved.`, `/lists/detail?id=${encodeURIComponent(res.list_id)}`);
      } else if (dest.kind === 'new-deck') {
        const deck = await api.createDeck({
          player_id: '', name: dest.deckName,
          commander: dest.commander.card_name,
          colors: dest.commander.color_identity || 'C',
        });
        await api.saveDeckCards(deck.id, payload);
        done(`Deck "${dest.deckName}" saved.`, `/decks/detail?id=${deck.id}`);
      } else if (dest.kind === 'attach-to-deck') {
        const res = await api.createList(dest.listName, undefined, payload);
        await api.attachListToDeckV2(res.list_id, dest.deckId);
        done('List attached to deck.', `/decks/detail?id=${dest.deckId}`);
      } else if (dest.kind === 'into-deck') {
        await api.saveDeckCards(dest.deckId, payload);
        done('Cards saved into deck.', `/decks/detail?id=${dest.deckId}`);
      } else if (dest.kind === 'append-to-list') {
        // Load current list to obtain OCC version — PHP response includes `version`
        const existing = await api.getList(dest.listId) as import('@/lib/types').CardListDetail & { version?: number };
        const merged = [...(existing.cards as unknown as Card[]), ...buffer].map((c) => ({
          card_name: c.card_name, scryfall_id: c.scryfall_id,
          quantity: c.quantity, is_commander: c.is_commander, is_proxy: c.is_proxy,
        }));
        await api.saveListCards(dest.listId, merged, existing.version ?? 0);
        done('Cards appended to list.', `/lists/detail?id=${encodeURIComponent(dest.listId)}`);
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, [buffer, router]);

  const handleDiscard = useCallback(() => {
    if (buffer.length > 0 && !window.confirm(`Discard ${buffer.length} scanned card${buffer.length !== 1 ? 's' : ''}?`)) return;
    setBuffer([]);
  }, [buffer.length]);

  const pageTitle = editDeckId ? (deckName ? `Scan into "${deckName}"` : 'Scan into Deck') : 'Scan Cards';
  const backHref  = editDeckId ? `/decks/detail?id=${editDeckId}` : '/decks';
  const backLabel = editDeckId ? 'Back to Deck' : 'Back to Decks';
  const deckContext = editDeckId && deckName ? { id: editDeckId, name: deckName } : null;

  if (deckLoading) {
    return (
      <PageContainer title="Scan Cards" backHref={backHref} backLabel={backLabel}>
        <Stack alignItems="center" spacing={2} py={8}>
          <CircularProgress size={48} />
          <Typography>Loading deck…</Typography>
        </Stack>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={pageTitle} backHref={backHref} backLabel={backLabel}>
      {(deckLoadError || saveError) && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => { setDeckLoadError(null); setSaveError(null); }}>
          {deckLoadError ?? saveError}
        </Alert>
      )}

      {/* Capture surface — always visible; user can scan multiple batches */}
      <ScanInput
        onCardsRecognized={(incoming) => setBuffer((prev) => [...prev, ...incoming])}
        autoSave={!editDeckId}
      />

      {/* Buffer — shown once cards have been scanned */}
      {buffer.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">{buffer.length} card{buffer.length !== 1 ? 's' : ''} ready</Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" color="error" size="small" onClick={handleDiscard}>Discard</Button>
              <Button variant="contained" size="small" startIcon={<SaveIcon />} onClick={openSaveDialog} disabled={saving}>
                Save
              </Button>
            </Stack>
          </Stack>
          <CardListView cards={buffer} editMode onChange={setBuffer} />
        </Box>
      )}

      <SaveToListDialog
        open={saveOpen}
        buffer={buffer}
        deckContext={deckContext}
        decks={decks.map((d) => ({ id: d.id, name: d.name }))}
        lists={lists.map((l) => ({ id: l.id, name: l.name }))}
        defaultDestination={editDeckId ? 'into-deck' : undefined}
        onCancel={() => setSaveOpen(false)}
        onConfirm={handleSaveConfirm}
      />

      <Snackbar
        open={!!successMsg}
        autoHideDuration={4000}
        onClose={() => setSuccessMsg(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMsg(null)} sx={{ width: '100%' }}>{successMsg}</Alert>
      </Snackbar>
    </PageContainer>
  );
}

export default function ScanDeckPage() {
  return (
    <Suspense fallback={
      <PageContainer title="Scan Cards" backHref="/decks" backLabel="Back to Decks">
        <Stack alignItems="center" py={8}><CircularProgress size={48} /></Stack>
      </PageContainer>
    }>
      <ScanPageInner />
    </Suspense>
  );
}
