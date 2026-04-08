'use client';

/**
 * SaveToListDialog — destination picker for saving a card buffer.
 *
 * Pure props-in / callback-out. Makes NO API calls.
 * The caller is responsible for all network operations after onConfirm fires.
 *
 * Five peer destinations (none is subordinate to the others):
 *   new-list       — create a standalone list (no deck)
 *   new-deck       — create a deck + attached main list; user picks commander here
 *   attach-to-deck — add a new list to an existing deck; deck row unchanged
 *   into-deck      — overwrite or append to the deck's main list (requires deckContext)
 *   append-to-list — merge cards into an existing list (dedup on server side)
 */

import {
  useId,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { CardLookupField } from '@/components/cards/CardLookupField';
import type { Card } from '@/lib/cards/types';

// ── Formats ────────────────────────────────────────────────────────────────────

const FORMATS = [
  'commander',
  'standard',
  'modern',
  'pioneer',
  'legacy',
  'vintage',
  'pauper',
  'brawl',
] as const;

type Format = (typeof FORMATS)[number];

// ── SaveDestination ────────────────────────────────────────────────────────────

export type SaveDestination =
  | { kind: 'new-list'; name: string; format: string }
  | { kind: 'new-deck'; deckName: string; listName: string; format: string; commander: Card; partner: Card | null }
  | { kind: 'attach-to-deck'; deckId: string; listName: string; format: string }
  | { kind: 'into-deck'; deckId: string; mode: 'overwrite' | 'append' }
  | { kind: 'append-to-list'; listId: string };

// ── Props ──────────────────────────────────────────────────────────────────────

export interface SaveToListDialogProps {
  open: boolean;
  buffer: Card[];
  /** Currently-attached deck context, if any. Pre-selects the "into-deck" tab. */
  deckContext?: { id: string; name: string } | null;
  /** Existing decks for the "attach to deck" picker */
  decks: Array<{ id: string; name: string }>;
  /** Existing lists for the "append to list" picker */
  lists: Array<{ id: string; name: string }>;
  onCancel: () => void;
  onConfirm: (destination: SaveDestination) => void;
  /** Default destination tab — auto-derived if absent */
  defaultDestination?: SaveDestination['kind'];
}

// ── Auto-naming helpers ────────────────────────────────────────────────────────

/** Today's date in YYYY-MM-DD format (plain, no time component). */
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Derive a default name from the buffer. Checks `role === 'commander'` first
 * (list-native, Phase 2+), then falls back to `is_commander` (deck-native).
 * Returns null when no commander card is found in the buffer.
 */
function commanderNameFromBuffer(buffer: Card[]): string | null {
  const cmd =
    buffer.find((c) => c.role === 'commander') ??
    buffer.find((c) => c.is_commander);
  return cmd?.card_name ?? null;
}

function defaultListName(buffer: Card[]): string {
  const name = commanderNameFromBuffer(buffer);
  return name ? `${name} list` : `Untitled list (${todayISO()})`;
}

function defaultDeckName(buffer: Card[]): string {
  return commanderNameFromBuffer(buffer) ?? `Untitled deck (${todayISO()})`;
}

// ── Tab ordering ───────────────────────────────────────────────────────────────

const TAB_ORDER: SaveDestination['kind'][] = [
  'new-list',
  'new-deck',
  'attach-to-deck',
  'into-deck',
  'append-to-list',
];

const TAB_LABELS: Record<SaveDestination['kind'], string> = {
  'new-list':       'New list',
  'new-deck':       'New deck',
  'attach-to-deck': 'Attach to deck',
  'into-deck':      'Into deck',
  'append-to-list': 'Append to list',
};

// ── CommanderPreview ───────────────────────────────────────────────────────────

interface CommanderPreviewProps {
  commander: Card | null;
  partner: Card | null;
}

function CommanderPreview({ commander, partner }: CommanderPreviewProps) {
  if (!commander && !partner) return null;

  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        p: 1.5,
        borderRadius: 1,
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(0,0,0,0.04)',
      }}
      aria-label="Commander preview"
    >
      {[commander, partner].map((card, i) => {
        if (!card) return null;
        return (
          <Stack key={i} direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
            <Box
              sx={{
                position:   'relative',
                width:      36,
                height:     50,
                flexShrink: 0,
                borderRadius: 0.5,
                overflow:   'hidden',
                bgcolor:    'action.hover',
                display:    'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {card.image_uri ? (
                <Image
                  src={card.image_uri}
                  alt={card.card_name}
                  fill
                  sizes="36px"
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                />
              ) : (
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6rem' }}>
                  ?
                </Typography>
              )}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap title={card.card_name}>
                {card.card_name}
              </Typography>
              {card.type_line && (
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {card.type_line}
                </Typography>
              )}
              <Typography variant="caption" color="text.disabled">
                {i === 0 ? 'Commander' : 'Partner'}
              </Typography>
            </Box>
          </Stack>
        );
      })}
    </Stack>
  );
}

// ── NewListPanel ───────────────────────────────────────────────────────────────

interface NewListPanelProps {
  name: string;
  format: Format;
  onChangeName: (v: string) => void;
  onChangeFormat: (v: Format) => void;
}

function NewListPanel({ name, format, onChangeName, onChangeFormat }: NewListPanelProps) {
  const nameId   = useId();
  const formatId = useId();

  return (
    <Stack spacing={2}>
      <TextField
        id={nameId}
        label="List name"
        value={name}
        onChange={(e) => onChangeName(e.target.value)}
        fullWidth
        size="small"
        inputProps={{ 'aria-label': 'List name', maxLength: 255 }}
        autoFocus
      />
      <FormControl fullWidth size="small">
        <InputLabel id={formatId}>Format</InputLabel>
        <Select
          labelId={formatId}
          label="Format"
          value={format}
          onChange={(e) => onChangeFormat(e.target.value as Format)}
          inputProps={{ 'aria-label': 'Format' }}
        >
          {FORMATS.map((f) => (
            <MenuItem key={f} value={f}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}

// ── NewDeckPanel ───────────────────────────────────────────────────────────────

interface NewDeckPanelProps {
  deckName: string;
  listName: string;
  format: Format;
  commander: Card | null;
  partner: Card | null;
  showPartnerPicker: boolean;
  onChangeDeckName: (v: string) => void;
  onChangeListName: (v: string) => void;
  onChangeFormat:   (v: Format) => void;
  onPickCommander:  (card: Card | null) => void;
  onPickPartner:    (card: Card | null) => void;
  onTogglePartner:  (on: boolean) => void;
}

function NewDeckPanel({
  deckName,
  listName,
  format,
  commander,
  partner,
  showPartnerPicker,
  onChangeDeckName,
  onChangeListName,
  onChangeFormat,
  onPickCommander,
  onPickPartner,
  onTogglePartner,
}: NewDeckPanelProps) {
  const deckNameId = useId();
  const listNameId = useId();
  const formatId   = useId();

  return (
    <Stack spacing={2}>
      {/* Commander/partner preview */}
      <CommanderPreview commander={commander} partner={partner} />

      <TextField
        id={deckNameId}
        label="Deck name"
        value={deckName}
        onChange={(e) => onChangeDeckName(e.target.value)}
        fullWidth
        size="small"
        inputProps={{ 'aria-label': 'Deck name', maxLength: 255 }}
        autoFocus
      />
      <TextField
        id={listNameId}
        label="List name"
        value={listName}
        onChange={(e) => onChangeListName(e.target.value)}
        fullWidth
        size="small"
        inputProps={{ 'aria-label': 'List name', maxLength: 255 }}
        helperText="The primary list attached to this deck."
      />

      <FormControl fullWidth size="small">
        <InputLabel id={formatId}>Format</InputLabel>
        <Select
          labelId={formatId}
          label="Format"
          value={format}
          onChange={(e) => onChangeFormat(e.target.value as Format)}
          inputProps={{ 'aria-label': 'Format' }}
        >
          {FORMATS.map((f) => (
            <MenuItem key={f} value={f}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider />

      {/* Commander picker */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Commander <Box component="span" sx={{ color: 'error.main' }}>*</Box>
        </Typography>
        <CardLookupField
          label="Search for a commander"
          placeholder="Legendary creature name…"
          singletonMode
          resultFilter={{ legendaryCreaturesOnly: true }}
          onChange={onPickCommander}
        />
      </Box>

      {/* Partner toggle + picker (commander format only) */}
      {format === 'commander' && (
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={showPartnerPicker}
                onChange={(e) => onTogglePartner(e.target.checked)}
                inputProps={{ 'aria-label': 'Add partner commander' }}
                size="small"
              />
            }
            label="Add partner"
          />
          {showPartnerPicker && (
            <Box mt={1}>
              <CardLookupField
                label="Search for a partner"
                placeholder="Partner card name…"
                singletonMode
                resultFilter={{ partnerOnly: true }}
                onChange={onPickPartner}
              />
            </Box>
          )}
        </Box>
      )}
    </Stack>
  );
}

// ── AttachToDeckPanel ──────────────────────────────────────────────────────────

interface AttachToDeckPanelProps {
  deckId: string | null;
  listName: string;
  format: Format;
  decks: Array<{ id: string; name: string }>;
  onChangeDeckId:  (v: string) => void;
  onChangeListName: (v: string) => void;
  onChangeFormat:  (v: Format) => void;
}

function AttachToDeckPanel({
  deckId,
  listName,
  format,
  decks,
  onChangeDeckId,
  onChangeListName,
  onChangeFormat,
}: AttachToDeckPanelProps) {
  const deckSelectId = useId();
  const listNameId   = useId();
  const formatId     = useId();

  return (
    <Stack spacing={2}>
      <FormControl fullWidth size="small" required>
        <InputLabel id={deckSelectId}>Deck</InputLabel>
        <Select
          labelId={deckSelectId}
          label="Deck"
          value={deckId ?? ''}
          onChange={(e) => onChangeDeckId(e.target.value)}
          inputProps={{ 'aria-label': 'Select a deck' }}
          displayEmpty
        >
          <MenuItem value="" disabled>
            <em>Select a deck…</em>
          </MenuItem>
          {decks.map((d) => (
            <MenuItem key={d.id} value={d.id}>
              {d.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        id={listNameId}
        label="New list name"
        value={listName}
        onChange={(e) => onChangeListName(e.target.value)}
        fullWidth
        size="small"
        inputProps={{ 'aria-label': 'New list name', maxLength: 255 }}
        helperText="This list will be attached to the selected deck."
      />

      <FormControl fullWidth size="small">
        <InputLabel id={formatId}>Format</InputLabel>
        <Select
          labelId={formatId}
          label="Format"
          value={format}
          onChange={(e) => onChangeFormat(e.target.value as Format)}
          inputProps={{ 'aria-label': 'Format' }}
        >
          {FORMATS.map((f) => (
            <MenuItem key={f} value={f}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
}

// ── IntoDeckPanel ──────────────────────────────────────────────────────────────

interface IntoDeckPanelProps {
  deckContext: { id: string; name: string } | null | undefined;
  mode: 'overwrite' | 'append';
  bufferCount: number;
  onChangeMode: (v: 'overwrite' | 'append') => void;
}

function IntoDeckPanel({ deckContext, mode, bufferCount, onChangeMode }: IntoDeckPanelProps) {
  const radioGroupId = useId();

  if (!deckContext) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 1,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.04)'
              : 'rgba(0,0,0,0.04)',
        }}
        role="status"
      >
        <Typography variant="body2" color="text.secondary">
          No deck context is active. Open a deck first to use this option.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          p: 1.5,
          borderRadius: 1,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.04)',
        }}
        aria-label="Active deck context"
      >
        <Typography variant="body2" color="text.secondary">
          Active deck
        </Typography>
        <Typography variant="subtitle2" fontWeight={600}>
          {deckContext.name}
        </Typography>
      </Box>

      <FormControl component="fieldset">
        <Typography
          component="legend"
          variant="subtitle2"
          id={radioGroupId}
          sx={{ mb: 1 }}
        >
          Save mode ({bufferCount} {bufferCount === 1 ? 'card' : 'cards'})
        </Typography>
        <RadioGroup
          aria-labelledby={radioGroupId}
          value={mode}
          onChange={(e) => onChangeMode(e.target.value as 'overwrite' | 'append')}
        >
          <FormControlLabel
            value="overwrite"
            control={<Radio size="small" />}
            label={
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Overwrite the deck&apos;s main list
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Replaces all cards in the main list with the buffer.
                </Typography>
              </Box>
            }
            sx={{ alignItems: 'flex-start', mt: 0.5 }}
          />
          <FormControlLabel
            value="append"
            control={<Radio size="small" />}
            label={
              <Box>
                <Typography variant="body2" fontWeight={500}>
                  Append to the deck&apos;s main list
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Merges the buffer in; dedup applies on the server side.
                </Typography>
              </Box>
            }
            sx={{ alignItems: 'flex-start', mt: 0.5 }}
          />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}

// ── AppendToListPanel ──────────────────────────────────────────────────────────

interface AppendToListPanelProps {
  listId: string | null;
  bufferCount: number;
  lists: Array<{ id: string; name: string }>;
  onChangeListId: (v: string) => void;
}

function AppendToListPanel({
  listId,
  bufferCount,
  lists,
  onChangeListId,
}: AppendToListPanelProps) {
  const listSelectId = useId();

  const selectedList = lists.find((l) => l.id === listId) ?? null;

  return (
    <Stack spacing={2}>
      <FormControl fullWidth size="small" required>
        <InputLabel id={listSelectId}>List</InputLabel>
        <Select
          labelId={listSelectId}
          label="List"
          value={listId ?? ''}
          onChange={(e) => onChangeListId(e.target.value)}
          inputProps={{ 'aria-label': 'Select a list' }}
          displayEmpty
        >
          <MenuItem value="" disabled>
            <em>Select a list…</em>
          </MenuItem>
          {lists.map((l) => (
            <MenuItem key={l.id} value={l.id}>
              {l.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedList && (
        <Box
          sx={{
            p: 1.5,
            borderRadius: 1,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(0,0,0,0.04)',
          }}
          aria-label="Append preview"
          aria-live="polite"
        >
          <Typography variant="body2" color="text.secondary">
            Adding{' '}
            <Box component="strong" sx={{ fontWeight: 600 }}>
              {bufferCount} {bufferCount === 1 ? 'card' : 'cards'}
            </Box>{' '}
            to{' '}
            <Box component="em" sx={{ fontStyle: 'normal', fontWeight: 600 }}>
              {selectedList.name}
            </Box>
            . Dedup applies on the server side.
          </Typography>
        </Box>
      )}
    </Stack>
  );
}

// ── SaveToListDialog ───────────────────────────────────────────────────────────

export function SaveToListDialog({
  open,
  buffer,
  deckContext,
  decks,
  lists,
  onCancel,
  onConfirm,
  defaultDestination,
}: SaveToListDialogProps) {
  const theme      = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const titleId    = useId();

  // Focus-return ref: capture the trigger element when the dialog opens.
  const triggerRef = useRef<Element | null>(null);

  // ── Derive initial tab ──────────────────────────────────────────────────────
  const initialTab: SaveDestination['kind'] =
    defaultDestination ??
    (deckContext ? 'into-deck' : 'new-list');

  // ── Tab state ───────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<SaveDestination['kind']>(initialTab);

  // Reset to derived default when the dialog opens (or deckContext changes).
  // We track `open` as a stable key — on each open we re-derive from props.
  // (Tabs state is intentionally preserved while the dialog is open.)

  // ── new-list state ──────────────────────────────────────────────────────────
  const [newListName,   setNewListName]   = useState(() => defaultListName(buffer));
  const [newListFormat, setNewListFormat] = useState<Format>('commander');

  // ── new-deck state ──────────────────────────────────────────────────────────
  const [newDeckName,        setNewDeckName]        = useState(() => defaultDeckName(buffer));
  const [newDeckListName,    setNewDeckListName]     = useState('Main');
  const [newDeckFormat,      setNewDeckFormat]       = useState<Format>('commander');
  const [pickedCommander,    setPickedCommander]     = useState<Card | null>(null);
  const [pickedPartner,      setPickedPartner]       = useState<Card | null>(null);
  const [showPartnerPicker,  setShowPartnerPicker]   = useState(false);

  // ── attach-to-deck state ────────────────────────────────────────────────────
  const [attachDeckId,       setAttachDeckId]        = useState<string | null>(null);
  const [attachListName,     setAttachListName]       = useState('Sideboard');
  const [attachFormat,       setAttachFormat]         = useState<Format>('commander');

  // ── into-deck state ─────────────────────────────────────────────────────────
  const [intoDeckMode, setIntoDeckMode] = useState<'overwrite' | 'append'>('append');

  // ── append-to-list state ────────────────────────────────────────────────────
  const [appendListId, setAppendListId] = useState<string | null>(null);

  // ── Confirm-button disabled logic ────────────────────────────────────────────
  function isConfirmDisabled(): boolean {
    switch (activeTab) {
      case 'new-list':
        return !newListName.trim();
      case 'new-deck':
        return !newDeckName.trim() || !newDeckListName.trim() || !pickedCommander;
      case 'attach-to-deck':
        return attachDeckId === null || !attachListName.trim();
      case 'into-deck':
        return !deckContext;
      case 'append-to-list':
        return appendListId === null;
    }
  }

  // ── Confirm-button label ─────────────────────────────────────────────────────
  function confirmLabel(): string {
    switch (activeTab) {
      case 'new-list':       return 'Save as new list';
      case 'new-deck':       return 'Create deck';
      case 'attach-to-deck': return 'Attach to deck';
      case 'into-deck':
        return intoDeckMode === 'overwrite' ? 'Overwrite' : 'Append';
      case 'append-to-list': return 'Append to list';
    }
  }

  // ── Build destination payload ────────────────────────────────────────────────
  function buildDestination(): SaveDestination | null {
    switch (activeTab) {
      case 'new-list':
        if (!newListName.trim()) return null;
        return { kind: 'new-list', name: newListName.trim(), format: newListFormat };

      case 'new-deck':
        if (!newDeckName.trim() || !newDeckListName.trim() || !pickedCommander) return null;
        return {
          kind:      'new-deck',
          deckName:  newDeckName.trim(),
          listName:  newDeckListName.trim(),
          format:    newDeckFormat,
          commander: pickedCommander,
          partner:   showPartnerPicker ? pickedPartner : null,
        };

      case 'attach-to-deck':
        if (attachDeckId === null || !attachListName.trim()) return null;
        return {
          kind:     'attach-to-deck',
          deckId:   attachDeckId,
          listName: attachListName.trim(),
          format:   attachFormat,
        };

      case 'into-deck':
        if (!deckContext) return null;
        return { kind: 'into-deck', deckId: deckContext.id, mode: intoDeckMode };

      case 'append-to-list':
        if (appendListId === null) return null;
        return { kind: 'append-to-list', listId: appendListId };
    }
  }

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function handleConfirm() {
    const dest = buildDestination();
    if (!dest) return;
    onConfirm(dest);
  }

  function handleTogglePartner(on: boolean) {
    setShowPartnerPicker(on);
    if (!on) setPickedPartner(null);
  }

  // Reset partner state when switching away from commander format.
  function handleNewDeckFormatChange(f: Format) {
    setNewDeckFormat(f);
    if (f !== 'commander') {
      setShowPartnerPicker(false);
      setPickedPartner(null);
    }
  }

  // Focus-return: capture active element when the dialog opens.
  function handleTransitionEnter() {
    triggerRef.current = document.activeElement;
  }

  function handleTransitionExited() {
    if (triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus();
    }
    triggerRef.current = null;
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      aria-labelledby={titleId}
      TransitionProps={{
        onEnter:  handleTransitionEnter,
        onExited: handleTransitionExited,
      }}
    >
      {/* ── Title bar ──────────────────────────────────────────────────────── */}
      <DialogTitle
        id={titleId}
        sx={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          pb:             1,
          pr:             1,
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
          Save {buffer.length} {buffer.length === 1 ? 'card' : 'cards'}
        </Typography>

        <Tooltip title="Cancel">
          <IconButton
            aria-label="Close dialog"
            onClick={onCancel}
            size="small"
            edge="end"
            sx={{ ml: 1 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      {/* ── Destination tabs ───────────────────────────────────────────────── */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 0 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v: SaveDestination['kind']) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Save destination"
        >
          {TAB_ORDER.map((kind) => (
            <Tab
              key={kind}
              value={kind}
              label={TAB_LABELS[kind]}
              id={`save-tab-${kind}`}
              aria-controls={`save-tabpanel-${kind}`}
              disabled={kind === 'into-deck' && !deckContext}
              sx={{ minWidth: 100, fontSize: '0.8rem' }}
            />
          ))}
        </Tabs>
      </Box>

      {/* ── Panel content ──────────────────────────────────────────────────── */}
      <DialogContent>
        {TAB_ORDER.map((kind) => (
          <Box
            key={kind}
            role="tabpanel"
            id={`save-tabpanel-${kind}`}
            aria-labelledby={`save-tab-${kind}`}
            hidden={activeTab !== kind}
            sx={{ pt: activeTab === kind ? 1 : 0 }}
          >
            {activeTab === kind && (
              <>
                {kind === 'new-list' && (
                  <NewListPanel
                    name={newListName}
                    format={newListFormat}
                    onChangeName={setNewListName}
                    onChangeFormat={setNewListFormat}
                  />
                )}
                {kind === 'new-deck' && (
                  <NewDeckPanel
                    deckName={newDeckName}
                    listName={newDeckListName}
                    format={newDeckFormat}
                    commander={pickedCommander}
                    partner={pickedPartner}
                    showPartnerPicker={showPartnerPicker}
                    onChangeDeckName={setNewDeckName}
                    onChangeListName={setNewDeckListName}
                    onChangeFormat={handleNewDeckFormatChange}
                    onPickCommander={setPickedCommander}
                    onPickPartner={setPickedPartner}
                    onTogglePartner={handleTogglePartner}
                  />
                )}
                {kind === 'attach-to-deck' && (
                  <AttachToDeckPanel
                    deckId={attachDeckId}
                    listName={attachListName}
                    format={attachFormat}
                    decks={decks}
                    onChangeDeckId={setAttachDeckId}
                    onChangeListName={setAttachListName}
                    onChangeFormat={setAttachFormat}
                  />
                )}
                {kind === 'into-deck' && (
                  <IntoDeckPanel
                    deckContext={deckContext}
                    mode={intoDeckMode}
                    bufferCount={buffer.length}
                    onChangeMode={setIntoDeckMode}
                  />
                )}
                {kind === 'append-to-list' && (
                  <AppendToListPanel
                    listId={appendListId}
                    bufferCount={buffer.length}
                    lists={lists}
                    onChangeListId={setAppendListId}
                  />
                )}
              </>
            )}
          </Box>
        ))}
      </DialogContent>

      {/* ── Actions ────────────────────────────────────────────────────────── */}
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} variant="text">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={isConfirmDisabled()}
          aria-label={confirmLabel()}
        >
          {confirmLabel()}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
