import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DeleteImpactDialog } from '@/components/cards/DeleteImpactDialog';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const deckTarget = {
  kind: 'deck' as const,
  id: 'test-deck-1',
  name: 'Elves',
  attachedLists: [
    { id: 'test-list-10', name: 'Main', cardCount: 100 },
    { id: 'test-list-11', name: 'Sideboard', cardCount: 15 },
  ],
  gameCount: 3,
  coachChatRefCount: 0,
};

const listTarget = {
  kind: 'list' as const,
  id: 'test-list-10',
  name: 'My Sideboard',
  deckId: 'test-deck-1',
  deckName: 'Elves',
  cardCount: 15,
  gameCount: 0,
  coachChatRefCount: 0,
};

describe('DeleteImpactDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render when open is false', () => {
    render(
      <DeleteImpactDialog
        open={false}
        target={deckTarget}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.queryByText('Delete Deck')).not.toBeInTheDocument();
  });

  it('shows "Delete Deck" title for deck target', () => {
    render(
      <DeleteImpactDialog
        open
        target={deckTarget}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByText('Delete Deck')).toBeInTheDocument();
  });

  it('shows "Delete List" title for list target', () => {
    render(
      <DeleteImpactDialog
        open
        target={listTarget}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByText('Delete List')).toBeInTheDocument();
  });

  it('deck mode renders attached-list checkboxes defaulted unchecked', () => {
    render(
      <DeleteImpactDialog
        open
        target={deckTarget}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
    checkboxes.forEach((cb) => expect(cb).not.toBeChecked());
  });

  it('list mode shows deck context message when list has a parent deck', () => {
    render(
      <DeleteImpactDialog
        open
        target={listTarget}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByText(/attached to deck/)).toBeInTheDocument();
    expect(screen.getByText(/Elves/)).toBeInTheDocument();
  });

  it('confirm payload includes checked list ids for deck mode', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <DeleteImpactDialog
        open
        target={deckTarget}
        onCancel={vi.fn()}
        onConfirm={onConfirm}
      />
    );

    // Check the first list (id=10, "Main")
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    await user.click(screen.getByRole('button', { name: /Delete deck/i }));
    expect(onConfirm).toHaveBeenCalledOnce();
    const [decision] = onConfirm.mock.calls[0] as [{ kind: string; deleteListIds?: string[] }];
    expect(decision.kind).toBe('deck');
    expect(decision.deleteListIds).toContain('test-list-10');
    expect(decision.deleteListIds).not.toContain('test-list-11');
  });

  it('confirm payload does NOT include unchecked list ids', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <DeleteImpactDialog
        open
        target={deckTarget}
        onCancel={vi.fn()}
        onConfirm={onConfirm}
      />
    );

    // Confirm without checking any list
    await user.click(screen.getByRole('button', { name: /Delete deck/i }));
    const [decision] = onConfirm.mock.calls[0] as [{ deleteListIds: string[] }];
    expect(decision.deleteListIds).toHaveLength(0);
  });

  it('list confirm payload has kind: list', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <DeleteImpactDialog
        open
        target={listTarget}
        onCancel={vi.fn()}
        onConfirm={onConfirm}
      />
    );
    await user.click(screen.getByLabelText('Delete list'));
    const [decision] = onConfirm.mock.calls[0] as [{ kind: string }];
    expect(decision.kind).toBe('list');
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <DeleteImpactDialog
        open
        target={deckTarget}
        onCancel={onCancel}
        onConfirm={vi.fn()}
      />
    );
    await user.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('shows soft-delete note', () => {
    render(
      <DeleteImpactDialog
        open
        target={deckTarget}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByText(/Soft delete/)).toBeInTheDocument();
  });
});
