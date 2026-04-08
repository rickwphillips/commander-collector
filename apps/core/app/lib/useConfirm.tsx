'use client';

/**
 * useConfirm — promise-based confirm dialog hook with MUI styling.
 *
 * Replaces `window.confirm()` for in-app navigation prompts so the dialog matches
 * the rest of the app (autumn theme, MUI buttons) instead of the browser's
 * 1995-era system confirm.
 *
 * Usage:
 *   const { confirm, dialog } = useConfirm();
 *
 *   // anywhere a click handler needs gating:
 *   const ok = await confirm({ message: 'Discard unsaved changes?' });
 *   if (!ok) return;
 *
 *   // render `{dialog}` once in the component tree (renders nothing when closed)
 */

import { useCallback, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** When true, the confirm button uses error color (destructive action). */
  destructive?: boolean;
}

interface PendingConfirm extends Required<Pick<ConfirmOptions, 'message'>> {
  title:        string;
  confirmLabel: string;
  cancelLabel:  string;
  destructive:  boolean;
}

export function useConfirm() {
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setPending({
        title:        opts.title        ?? 'Confirm',
        message:      opts.message,
        confirmLabel: opts.confirmLabel ?? 'OK',
        cancelLabel:  opts.cancelLabel  ?? 'Cancel',
        destructive:  opts.destructive  ?? false,
      });
    });
  }, []);

  const handleResolve = useCallback((value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setPending(null);
  }, []);

  const dialog = (
    <Dialog
      open={pending !== null}
      onClose={() => handleResolve(false)}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="confirm-dialog-title" sx={{ fontWeight: 600 }}>
        {pending?.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-message">
          {pending?.message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => handleResolve(false)} variant="text">
          {pending?.cancelLabel}
        </Button>
        <Button
          onClick={() => handleResolve(true)}
          variant="contained"
          color={pending?.destructive ? 'error' : 'primary'}
          autoFocus
        >
          {pending?.confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return { confirm, dialog };
}
