'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AttachedList {
  id: string;
  name: string;
  cardCount: number;
}

interface DeckTarget {
  kind: 'deck';
  id: string;
  name: string;
  attachedLists: AttachedList[];
  gameCount: number;
  coachChatRefCount: number;
}

interface ListTarget {
  kind: 'list';
  id: string;
  name: string;
  deckId: string | null;
  deckName: string | null;
  cardCount: number;
  gameCount: number;
  coachChatRefCount: number;
}

type DeleteTarget = DeckTarget | ListTarget;

interface DeckDecision {
  kind: 'deck';
  deleteListIds: string[];
}

interface ListDecision {
  kind: 'list';
}

type DeleteDecision = DeckDecision | ListDecision;

export interface DeleteImpactDialogProps {
  open: boolean;
  target: DeleteTarget | null;
  onCancel: () => void;
  onConfirm: (decision: DeleteDecision) => void;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InfoFooter({
  gameCount,
  coachChatRefCount,
}: {
  gameCount: number;
  coachChatRefCount: number;
}) {
  if (gameCount === 0 && coachChatRefCount === 0) return null;

  const parts: string[] = [];
  if (gameCount > 0) {
    parts.push(
      `${gameCount} recorded ${gameCount === 1 ? 'game' : 'games'}`,
    );
  }
  if (coachChatRefCount > 0) {
    parts.push(
      `${coachChatRefCount} coach chat ${coachChatRefCount === 1 ? 'reference' : 'references'}`,
    );
  }

  return (
    <Box
      sx={(theme) => ({
        mt: 2,
        p: 1.5,
        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.05)'
            : 'rgba(0,0,0,0.04)',
      })}
      role="note"
      aria-label="Downstream information"
    >
      <Typography variant="body2" color="text.secondary">
        This item has {parts.join(' and ')} — these will not be affected.
      </Typography>
    </Box>
  );
}

function SoftDeleteNote() {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      display="block"
      mt={1.5}
      aria-live="polite"
    >
      Soft delete — restorable from Trash for 30 days.
    </Typography>
  );
}

// ---------------------------------------------------------------------------
// Deck content
// ---------------------------------------------------------------------------

function DeckDialogContent({
  target,
  selectedListIds,
  onToggleList,
}: {
  target: DeckTarget;
  selectedListIds: Set<string>;
  onToggleList: (id: string) => void;
}) {
  const totalCardCount = target.attachedLists.reduce(
    (sum, l) => sum + l.cardCount,
    0,
  );

  return (
    <>
      <Typography variant="body1" gutterBottom>
        Delete deck{' '}
        <Box component="strong" sx={{ fontWeight: 600 }}>
          {target.name}
        </Box>
        {totalCardCount > 0 && (
          <>
            {' '}({totalCardCount.toLocaleString()} total{' '}
            {totalCardCount === 1 ? 'card' : 'cards'} across attached lists)
          </>
        )}
        ?
      </Typography>

      {target.attachedLists.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="subtitle2"
            component="h3"
            gutterBottom
            id="attached-lists-heading"
          >
            Attached lists
          </Typography>
          <Stack
            spacing={0}
            role="group"
            aria-labelledby="attached-lists-heading"
          >
            {target.attachedLists.map((list) => (
              <FormControlLabel
                key={list.id}
                control={
                  <Checkbox
                    checked={selectedListIds.has(list.id)}
                    onChange={() => onToggleList(list.id)}
                    inputProps={{
                      'aria-label': `Delete ${list.name} (${list.cardCount} ${list.cardCount === 1 ? 'card' : 'cards'}) along with the deck`,
                    }}
                    size="medium"
                  />
                }
                label={
                  <Typography variant="body2">
                    Delete{' '}
                    <Box component="em" sx={{ fontStyle: 'normal', fontWeight: 500 }}>
                      {list.name}
                    </Box>{' '}
                    ({list.cardCount.toLocaleString()}{' '}
                    {list.cardCount === 1 ? 'card' : 'cards'}) along with the
                    deck
                  </Typography>
                }
                sx={{ minHeight: 44, alignItems: 'center', ml: 0 }}
              />
            ))}
          </Stack>
          <Typography variant="caption" color="text.secondary" display="block">
            Unchecked lists will be kept as standalone lists.
          </Typography>
        </>
      )}

      <InfoFooter
        gameCount={target.gameCount}
        coachChatRefCount={target.coachChatRefCount}
      />
      <SoftDeleteNote />
    </>
  );
}

// ---------------------------------------------------------------------------
// List content
// ---------------------------------------------------------------------------

function ListDialogContent({ target }: { target: ListTarget }) {
  return (
    <>
      <Typography variant="body1" gutterBottom>
        Delete list{' '}
        <Box component="strong" sx={{ fontWeight: 600 }}>
          {target.name}
        </Box>{' '}
        ({target.cardCount.toLocaleString()}{' '}
        {target.cardCount === 1 ? 'card' : 'cards'})?
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {target.deckId !== null && target.deckName !== null ? (
          <>
            This list is attached to deck{' '}
            <Box component="em" sx={{ fontStyle: 'normal', fontWeight: 500 }}>
              {target.deckName}
            </Box>
            . Deleting it will leave the deck with one fewer list — the deck is
            not affected.
          </>
        ) : (
          'This is a standalone list.'
        )}
      </Typography>

      <InfoFooter
        gameCount={target.gameCount}
        coachChatRefCount={target.coachChatRefCount}
      />
      <SoftDeleteNote />
    </>
  );
}

// ---------------------------------------------------------------------------
// Main dialog
// ---------------------------------------------------------------------------

export function DeleteImpactDialog({
  open,
  target,
  onCancel,
  onConfirm,
}: DeleteImpactDialogProps) {
  const [selectedListIds, setSelectedListIds] = useState<Set<string>>(
    new Set(),
  );

  // Reset checkbox state when the target changes (new deck opened)
  const [prevTargetId, setPrevTargetId] = useState<string | null>(null);
  const targetId = target?.id ?? null;
  if (targetId !== prevTargetId) {
    setPrevTargetId(targetId);
    setSelectedListIds(new Set());
  }

  function handleToggleList(id: string) {
    setSelectedListIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleConfirm() {
    if (!target) return;
    if (target.kind === 'deck') {
      onConfirm({ kind: 'deck', deleteListIds: Array.from(selectedListIds) });
    } else {
      onConfirm({ kind: 'list' });
    }
  }

  const title =
    target?.kind === 'deck' ? 'Delete Deck' : 'Delete List';

  const confirmLabel =
    target?.kind === 'deck'
      ? `Delete deck${
          selectedListIds.size > 0
            ? ` (and ${selectedListIds.size} selected ${selectedListIds.size === 1 ? 'list' : 'lists'})`
            : ''
        }`
      : 'Delete list';

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="sm"
      aria-labelledby="delete-impact-dialog-title"
    >
      <DialogTitle id="delete-impact-dialog-title">
        {title}
        <IconButton
          onClick={onCancel}
          aria-label="Close dialog"
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {target?.kind === 'deck' && (
          <DeckDialogContent
            target={target}
            selectedListIds={selectedListIds}
            onToggleList={handleToggleList}
          />
        )}
        {target?.kind === 'list' && <ListDialogContent target={target} />}
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} variant="text">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          aria-label={confirmLabel}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
