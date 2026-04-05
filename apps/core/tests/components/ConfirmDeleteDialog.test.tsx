import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDeleteDialog } from '../../../../packages/shared/src/components/ConfirmDeleteDialog';

describe('ConfirmDeleteDialog', () => {
  it('does not render when closed', () => {
    render(
      <ConfirmDeleteDialog open={false} title="Delete?" message="Sure?" onConfirm={async () => {}} onClose={() => {}} />
    );
    expect(screen.queryByText('Delete?')).not.toBeInTheDocument();
  });

  it('renders title and message when open', () => {
    render(
      <ConfirmDeleteDialog open={true} title="Delete Game?" message="This cannot be undone." onConfirm={async () => {}} onClose={() => {}} />
    );
    expect(screen.getByText('Delete Game?')).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
  });

  it('renders ReactNode message (with bold)', () => {
    render(
      <ConfirmDeleteDialog
        open={true}
        title="Delete?"
        message={<>Delete <strong>My Deck</strong>? This cannot be undone.</>}
        onConfirm={async () => {}}
        onClose={() => {}}
      />
    );
    expect(screen.getByText('My Deck')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ConfirmDeleteDialog open={true} title="Delete?" message="Sure?" onConfirm={async () => {}} onClose={onClose} />
    );
    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onConfirm and onClose when Delete is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(
      <ConfirmDeleteDialog open={true} title="Delete?" message="Sure?" onConfirm={onConfirm} onClose={onClose} />
    );
    await user.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledOnce();
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  it('shows Deleting... while onConfirm is in progress', async () => {
    let resolveConfirm: () => void;
    const onConfirm = vi.fn().mockReturnValue(new Promise<void>((r) => { resolveConfirm = r; }));
    const user = userEvent.setup();

    render(
      <ConfirmDeleteDialog open={true} title="Delete?" message="Sure?" onConfirm={onConfirm} onClose={() => {}} />
    );

    await user.click(screen.getByText('Delete'));
    expect(screen.getByText('Deleting...')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeDisabled();

    resolveConfirm!();
    await waitFor(() => {
      expect(screen.queryByText('Deleting...')).not.toBeInTheDocument();
    });
  });

  it('keeps dialog open on error so user can retry', async () => {
    const onConfirm = vi.fn().mockRejectedValue(new Error('Network error'));
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <ConfirmDeleteDialog open={true} title="Delete?" message="Sure?" onConfirm={onConfirm} onClose={onClose} />
    );

    await user.click(screen.getByText('Delete'));

    await waitFor(() => {
      // onClose should NOT be called on error
      expect(onClose).not.toHaveBeenCalled();
      // Delete button should be re-enabled for retry
      expect(screen.getByText('Delete')).not.toBeDisabled();
    });
  });
});
