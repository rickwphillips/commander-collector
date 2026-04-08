'use client';

/**
 * DEV SANDBOX — cards-sandbox/page.tsx
 * Reachable at http://localhost:3001/dev/cards-sandbox
 * NOT linked from any nav. NOT for production.
 * All actions are local state only. No DB, no API writes.
 */

import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import {
  FlipCard,
  CardTile,
  DeleteImpactDialog,
  Trash,
  CardInputPanel,
  SaveToListDialog,
  CardLookupField,
} from '@/components/cards';
import type { TrashItem } from '@/components/cards';
import type { Card } from '@/lib/cards/types';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const COLOR_POOLS = ['W', 'U', 'B', 'R', 'G', 'WU', 'UB', 'BR', 'RG', 'GW', 'C'];

function make250Cards(): Card[] {
  return Array.from({ length: 250 }, (_, i) => ({
    id: `sandbox-card-${i + 1}`,
    card_name: `Card ${i + 1}`,
    scryfall_id: `sandbox-${i + 1}`,
    image_uri: '/card-not-found.webp',
    back_image_uri: undefined,
    color_identity: COLOR_POOLS[i % COLOR_POOLS.length],
    mana_cost: '{1}{R}',
    type_line: i % 7 === 0 ? 'Creature — Goblin' : 'Instant',
    quantity: (i % 4) + 1,
    is_commander: i === 0,
    is_proxy: i % 5 === 0,
  }));
}

const FIXTURE_250 = make250Cards();

const FIXTURE_CARD: Card = {
  id: 'fixture-card-42',
  card_name: 'Lightning Bolt',
  scryfall_id: 'e3285e6b-3e79-4d7c-bf96-d920f973b122',
  image_uri: 'https://cards.scryfall.io/normal/front/e/3/e3285e6b-3e79-4d7c-bf96-d920f973b122.jpg',
  back_image_uri: undefined,
  color_identity: 'R',
  mana_cost: '{R}',
  type_line: 'Instant',
  quantity: 1,
  is_commander: false,
  is_proxy: false,
};

const FIXTURE_FLIP_CARD: Card = {
  id: 'fixture-flip-99',
  card_name: 'Delver of Secrets',
  scryfall_id: '11bf83bb-421f-4f12-a9d4-591bb4f8e756',
  image_uri: 'https://cards.scryfall.io/normal/front/1/1/11bf83bb-421f-4f12-a9d4-591bb4f8e756.jpg',
  back_image_uri: 'https://cards.scryfall.io/normal/back/1/1/11bf83bb-421f-4f12-a9d4-591bb4f8e756.jpg',
  color_identity: 'U',
  mana_cost: '{U}',
  type_line: 'Creature — Human Wizard',
  quantity: 1,
  is_commander: false,
  is_proxy: false,
};

const FAKE_DECKS = [
  { id: 'fake-deck-1', name: 'Sandbox Deck A' },
  { id: 'fake-deck-2', name: 'Sandbox Deck B' },
  { id: 'fake-deck-3', name: 'Sandbox Deck C' },
];

const FAKE_LISTS = [
  { id: 'fake-list-10', name: 'Sandbox List Alpha' },
  { id: 'fake-list-11', name: 'Sandbox List Beta' },
  { id: 'fake-list-12', name: 'Sandbox List Gamma' },
];

const FAKE_ATTACHED_LISTS = [
  { id: 'fake-list-10', name: 'Sandbox List Alpha', cardCount: 14 },
  { id: 'fake-list-11', name: 'Sandbox List Beta', cardCount: 7 },
];

function nowMinus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const TRASH_ITEMS_INIT: TrashItem[] = [
  {
    kind: 'deck',
    id: 'trash-deck-77',
    name: 'Old Deck',
    deletedAt: nowMinus(27),   // 3 days remaining — warning visual
    cardCount: 100,
    attachedListCount: 2,
  },
  {
    kind: 'list',
    id: 'trash-list-88',
    name: 'Orphaned List',
    deletedAt: nowMinus(10),
    cardCount: 33,
    deckName: null,
  },
  {
    kind: 'list',
    id: 'trash-list-89',
    name: 'Attached List',
    deletedAt: nowMinus(2),    // 28 days remaining
    cardCount: 18,
    deckName: 'Some Deck',
  },
];

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

// ── Main Sandbox Page ─────────────────────────────────────────────────────────

export default function CardsSandboxPage() {

  // ── Section 2: FlipCard ───────────────────────────────────────────────────
  const [controlledFlipped, setControlledFlipped] = useState(false);

  // ── Section 5: DeleteImpactDialog ─────────────────────────────────────────
  const [deleteDeckOpen, setDeleteDeckOpen] = useState(false);
  const [deleteListOpen, setDeleteListOpen] = useState(false);

  // ── Section 6: Trash ──────────────────────────────────────────────────────
  const [trashItems, setTrashItems] = useState<TrashItem[]>(TRASH_ITEMS_INIT);

  // ── Section 7: Standalone CardInputPanel ─────────────────────────────────
  const [panelBuffer, setPanelBuffer] = useState<Card[]>([]);

  // ── Section 8: Standalone SaveToListDialog ────────────────────────────────
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // ── Section 9: Standalone CardLookupField added cards ────────────────────
  const [lookupAdded, setLookupAdded] = useState<Card[]>([]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>

      {/* Warning banner */}
      <Alert severity="warning" sx={{ mb: 4, fontWeight: 700 }}>
        DEV SANDBOX — not for production use. All actions are local state only.
      </Alert>

      {/* ── Section 2: FlipCard ───────────────────────────────────────────── */}
      <Section title="2. FlipCard — uncontrolled / controlled / no-back">
        <Stack direction="row" spacing={4} flexWrap="wrap" useFlexGap>

          {/* Uncontrolled */}
          <Box>
            <Typography variant="caption" display="block" mb={1}>Uncontrolled (owns state)</Typography>
            <FlipCard
              front={<Box sx={{ width: 146, aspectRatio: '63/88', bgcolor: 'primary.light', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography variant="caption">Front</Typography></Box>}
              back={<Box sx={{ width: 146, aspectRatio: '63/88', bgcolor: 'secondary.light', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography variant="caption">Back</Typography></Box>}
              onFlip={(v) => console.log('[sandbox] FlipCard uncontrolled onFlip', v)}
              width={146}
              height={204}
            />
          </Box>

          {/* Controlled */}
          <Box>
            <Typography variant="caption" display="block" mb={1}>
              Controlled — currently: {controlledFlipped ? 'back' : 'front'}
            </Typography>
            <FlipCard
              front={<Box sx={{ width: 146, aspectRatio: '63/88', bgcolor: 'success.light', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography variant="caption">Front</Typography></Box>}
              back={<Box sx={{ width: 146, aspectRatio: '63/88', bgcolor: 'warning.light', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography variant="caption">Back</Typography></Box>}
              flipped={controlledFlipped}
              onFlip={(v) => {
                console.log('[sandbox] FlipCard controlled onFlip', v);
                setControlledFlipped(v);
              }}
              width={146}
              height={204}
            />
            <Button size="small" sx={{ mt: 1 }} onClick={() => setControlledFlipped((f) => !f)}>
              Toggle parent
            </Button>
          </Box>

          {/* No-back */}
          <Box>
            <Typography variant="caption" display="block" mb={1}>No-back (no-op)</Typography>
            <FlipCard
              front={<Box sx={{ width: 146, aspectRatio: '63/88', bgcolor: 'error.light', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography variant="caption">Front only</Typography></Box>}
              width={146}
              height={204}
            />
          </Box>

        </Stack>
      </Section>

      {/* ── Section 3: CardTile states ────────────────────────────────────── */}
      <Section title="3. CardTile — all 5 lookup states + editMode">
        <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap mb={3}>
          <Box>
            <Typography variant="caption" display="block" mb={1}>resolved</Typography>
            <CardTile card={FIXTURE_CARD} lookupState="resolved" onClick={() => console.log('[sandbox] tile resolved click')} />
          </Box>
          <Box>
            <Typography variant="caption" display="block" mb={1}>pending</Typography>
            <CardTile card={{ ...FIXTURE_CARD, scryfall_id: null, image_uri: null }} lookupState="pending" />
          </Box>
          <Box>
            <Typography variant="caption" display="block" mb={1}>not_found</Typography>
            <CardTile
              card={{ ...FIXTURE_CARD, scryfall_id: null, image_uri: null }}
              lookupState="not_found"
              onClick={() => console.log('[sandbox] tile not_found click')}
            />
          </Box>
          <Box>
            <Typography variant="caption" display="block" mb={1}>transient_error</Typography>
            <CardTile card={{ ...FIXTURE_CARD, scryfall_id: null, image_uri: null }} lookupState="transient_error" />
          </Box>
          <Box>
            <Typography variant="caption" display="block" mb={1}>custom</Typography>
            <CardTile card={{ ...FIXTURE_CARD, is_custom: true }} lookupState="custom" />
          </Box>
        </Stack>
        <Stack direction="row" spacing={3}>
          <Box>
            <Typography variant="caption" display="block" mb={1}>editMode (qty stepper + delete)</Typography>
            <CardTile
              card={FIXTURE_CARD}
              lookupState="resolved"
              editMode
              onQtyChange={(n) => console.log('[sandbox] tile onQtyChange', n)}
              onDelete={() => console.log('[sandbox] tile onDelete')}
            />
          </Box>
        </Stack>
      </Section>

      {/* ── Section 5: DeleteImpactDialog ─────────────────────────────────── */}
      <Section title="5. DeleteImpactDialog — deck mode / list mode">
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="error" onClick={() => setDeleteDeckOpen(true)}>
            Open (deck — 2 attached lists)
          </Button>
          <Button variant="outlined" color="error" onClick={() => setDeleteListOpen(true)}>
            Open (list — with deckContext)
          </Button>
        </Stack>

        <DeleteImpactDialog
          open={deleteDeckOpen}
          target={{
            kind: 'deck',
            id: 'fake-deck-1',
            name: 'Sandbox Deck A',
            attachedLists: FAKE_ATTACHED_LISTS,
            gameCount: 3,
            coachChatRefCount: 1,
          }}
          onCancel={() => {
            console.log('[sandbox] DeleteImpactDialog deck cancel');
            setDeleteDeckOpen(false);
          }}
          onConfirm={(decision) => {
            console.log('[sandbox] DeleteImpactDialog deck confirm', decision);
            setDeleteDeckOpen(false);
          }}
        />

        <DeleteImpactDialog
          open={deleteListOpen}
          target={{
            kind: 'list',
            id: 'fake-list-10',
            name: 'Sandbox List Alpha',
            deckId: 'fake-deck-1',
            deckName: 'Sandbox Deck A',
            cardCount: 14,
            gameCount: 0,
            coachChatRefCount: 0,
          }}
          onCancel={() => {
            console.log('[sandbox] DeleteImpactDialog list cancel');
            setDeleteListOpen(false);
          }}
          onConfirm={(decision) => {
            console.log('[sandbox] DeleteImpactDialog list confirm', decision);
            setDeleteListOpen(false);
          }}
        />
      </Section>

      {/* ── Section 6: Trash ──────────────────────────────────────────────── */}
      <Section title="6. Trash — 3 items (1 deck ≤3 days remaining, 2 lists)">
        <Trash
          items={trashItems}
          onRestore={(item) => {
            console.log('[sandbox] Trash onRestore', item);
            setTrashItems((prev) => prev.filter((t) => t.id !== item.id));
          }}
        />
      </Section>

      {/* ── Section 7: Standalone CardInputPanel ─────────────────────────── */}
      <Section title="7. Standalone CardInputPanel (buffer dump below)">
        <CardInputPanel
          buffer={panelBuffer}
          onBufferChange={(cards) => {
            console.log('[sandbox] CardInputPanel onBufferChange', cards);
            setPanelBuffer(cards);
          }}
          format="commander"
          defaultTab="lookup"
        />
        <Box mt={2}>
          <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all', bgcolor: 'action.hover', p: 1, borderRadius: 1, display: 'block' }}>
            {JSON.stringify(panelBuffer, null, 2)}
          </Typography>
        </Box>
      </Section>

      {/* ── Section 8: Standalone SaveToListDialog ────────────────────────── */}
      <Section title="8. Standalone SaveToListDialog">
        <Button variant="outlined" onClick={() => setSaveDialogOpen(true)}>
          Open SaveToListDialog (empty buffer, 3 decks, 3 lists)
        </Button>
        <SaveToListDialog
          open={saveDialogOpen}
          buffer={[]}
          decks={FAKE_DECKS}
          lists={FAKE_LISTS}
          onCancel={() => {
            console.log('[sandbox] SaveToListDialog cancel');
            setSaveDialogOpen(false);
          }}
          onConfirm={(dest) => {
            console.log('[sandbox] SaveToListDialog confirm', dest);
            setSaveDialogOpen(false);
          }}
        />
      </Section>

      {/* ── Section 9: Standalone CardLookupField ────────────────────────── */}
      <Section title="9. Standalone CardLookupField — singleton on / off / legendary-only">
        <Stack spacing={3}>
          <Box>
            <Typography variant="caption" display="block" mb={1}>singletonMode off (qty stepper visible)</Typography>
            <CardLookupField
              label="Card lookup (default)"
              onAdd={(cards) => {
                console.log('[sandbox] CardLookupField onAdd', cards);
                setLookupAdded((prev) => [...prev, ...cards]);
              }}
              singletonMode={false}
            />
          </Box>
          <Box>
            <Typography variant="caption" display="block" mb={1}>singletonMode on (no qty stepper)</Typography>
            <CardLookupField
              label="Card lookup (singleton)"
              onAdd={(cards) => {
                console.log('[sandbox] CardLookupField singleton onAdd', cards);
                setLookupAdded((prev) => [...prev, ...cards]);
              }}
              singletonMode
            />
          </Box>
          <Box>
            <Typography variant="caption" display="block" mb={1}>legendaryCreaturesOnly filter (commander picker)</Typography>
            <CardLookupField
              label="Commander picker"
              onAdd={(cards) => {
                console.log('[sandbox] CardLookupField commander onAdd', cards);
                setLookupAdded((prev) => [...prev, ...cards]);
              }}
              singletonMode
              resultFilter={{ legendaryCreaturesOnly: true }}
            />
          </Box>
          <Box mt={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography variant="caption" fontWeight={700}>
                Added so far: {lookupAdded.length}
              </Typography>
              {lookupAdded.length > 0 && (
                <Button size="small" onClick={() => setLookupAdded([])}>Clear</Button>
              )}
            </Stack>
            <Typography variant="caption" component="pre" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all', bgcolor: 'action.hover', p: 1, borderRadius: 1, display: 'block', maxHeight: 200, overflow: 'auto' }}>
              {lookupAdded.length === 0 ? '(none yet — click Add on a result row)' : JSON.stringify(lookupAdded.map(c => ({ name: c.card_name, qty: c.quantity })), null, 2)}
            </Typography>
          </Box>
        </Stack>
      </Section>

    </Box>
  );
}
