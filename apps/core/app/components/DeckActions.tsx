'use client';

import { Button, Stack } from '@mui/material';
import Link from 'next/link';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import LinkIcon from '@mui/icons-material/Link';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TableChartIcon from '@mui/icons-material/TableChart';

export interface DeckActionsProps {
  // ── View mode ──────────────────────────────────────────────────────────────
  /** Download TCGPlayer-format text file */
  onExport?: () => void;
  /** Download TTS JSON */
  onTTS?: () => void;
  ttsBusy?: boolean;
  /** Navigate to /decks/decklist?id=<deckId> */
  decklistHref?: string;
  /** Edit deck metadata (or enter card edit mode on decklist page) */
  onEdit?: () => void;
  editLabel?: string;
  /** Re-fetch Scryfall data for all cards and persist */
  onRefresh?: () => void;
  /** Detach deck cards to a standalone list */
  onDetach?: () => void;
  /** Import a card list */
  onImport?: () => void;
  /** Delete the deck */
  onDelete?: () => void;
  /** Open the Coach to discuss this deck */
  onDiscuss?: () => void;
  /** Attach this list to a deck */
  onAttach?: () => void;

  // ── Edit mode ──────────────────────────────────────────────────────────────
  /** Presence of onCancel switches the layout to edit mode */
  onCancel?: () => void;
  onSaveAndContinue?: () => void;
  onSave?: () => void;

  // ── Shared state ───────────────────────────────────────────────────────────
  /** Disables Export / TTS / Decklist / Refresh / Detach when false */
  hasCards?: boolean;
  saving?: boolean;
  refreshing?: boolean;
}

export function DeckActions({
  onExport, onTTS, ttsBusy = false, decklistHref,
  onEdit, editLabel = 'Edit',
  onRefresh, onDetach, onImport, onDelete, onAttach, onDiscuss,
  onCancel, onSaveAndContinue, onSave,
  hasCards = true, saving = false, refreshing = false,
}: DeckActionsProps) {
  const busy = saving || refreshing;

  // ── Edit mode ──────────────────────────────────────────────────────────────
  if (onCancel) {
    return (
      <Stack direction="row" spacing={1}>
        <Button startIcon={<CancelIcon />} onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        {onRefresh && (
          <Button startIcon={<RefreshIcon />} onClick={onRefresh} disabled={busy}>
            {refreshing ? 'Refreshing…' : 'Refresh All'}
          </Button>
        )}
        {onSaveAndContinue && (
          <Button variant="outlined" startIcon={<SaveIcon />} onClick={onSaveAndContinue} disabled={busy}>
            {saving ? 'Saving…' : 'Save & Continue'}
          </Button>
        )}
        {onSave && (
          <Button variant="contained" startIcon={<SaveIcon />} onClick={onSave} disabled={busy}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        )}
      </Stack>
    );
  }

  // ── View mode ──────────────────────────────────────────────────────────────
  return (
    <Stack direction="row" spacing={1}>
      {onExport && (
        <Button startIcon={<DownloadIcon />} onClick={onExport} disabled={!hasCards}>
          Export
        </Button>
      )}
      {onTTS && (
        <Button startIcon={<TableChartIcon />} onClick={onTTS} disabled={!hasCards || ttsBusy}>
          {ttsBusy ? 'Building…' : 'TTS'}
        </Button>
      )}
      {onImport && (
        <Button startIcon={<FileUploadIcon />} onClick={onImport}>
          Import
        </Button>
      )}
      {onRefresh && (
        <Button startIcon={<RefreshIcon />} onClick={onRefresh} disabled={!hasCards || refreshing}>
          {refreshing ? 'Refreshing…' : 'Refresh Card Data'}
        </Button>
      )}
      {decklistHref && (
        <Button component={Link} href={decklistHref} startIcon={<ListAltIcon />} disabled={!hasCards}>
          Decklist
        </Button>
      )}
      {onEdit && (
        <Button startIcon={<EditIcon />} onClick={onEdit}>
          {editLabel}
        </Button>
      )}
      {onDetach && (
        <Button startIcon={<CallSplitIcon />} onClick={onDetach} disabled={!hasCards}>
          Detach to List
        </Button>
      )}
      {onAttach && (
        <Button variant="contained" startIcon={<LinkIcon />} onClick={onAttach} disabled={!hasCards}>
          Attach to Deck
        </Button>
      )}
      {onDiscuss && (
        <Button startIcon={<SmartToyIcon />} onClick={onDiscuss} sx={{ color: '#6B8E6B' }}>
          Discuss
        </Button>
      )}
      {onDelete && (
        <Button color="error" startIcon={<DeleteIcon />} onClick={onDelete}>
          Delete
        </Button>
      )}
    </Stack>
  );
}
