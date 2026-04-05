'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface ConfirmDeleteDialogProps {
  /** Controls visibility. */
  open: boolean;
  /** Dialog title, e.g. "Delete Game?" */
  title: string;
  /** Confirmation message body. Supports ReactNode for <strong> etc. */
  message: React.ReactNode;
  /** Async handler called on confirm. Dialog closes automatically on success. */
  onConfirm: () => Promise<void>;
  /** Called when the user cancels or the dialog should close. */
  onClose: () => void;
}

export function ConfirmDeleteDialog({
  open,
  title,
  message,
  onConfirm,
  onClose,
}: ConfirmDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Caller handles errors; keep dialog open so user can retry
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={deleting}>Cancel</Button>
        <Button onClick={handleConfirm} color="error" disabled={deleting}>
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
