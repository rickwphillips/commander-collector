'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import type { StatPanel } from '@/lib/types';

interface DeletePanelDialogProps {
  target: StatPanel | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeletePanelDialog({ target, onConfirm, onCancel }: DeletePanelDialogProps) {
  return (
    <Dialog open={!!target} onClose={onCancel}>
      <DialogTitle>Delete Panel</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete &quot;{target?.name}&quot;?
          {target?.is_shared && ' This panel is currently shared with other users.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
