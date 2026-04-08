import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/components/cards/CardInputPanel', () => ({
  CardInputPanel: () => <div data-testid="card-input-panel" />,
}));

vi.mock('@/components/cards/CardExportPanel', () => ({
  CardExportPanel: () => <div data-testid="card-export-panel" />,
}));

vi.mock('@/components/cards/SaveToListDialog', () => ({
  SaveToListDialog: ({
    open,
    onCancel,
    onConfirm,
  }: {
    open: boolean;
    onCancel: () => void;
    onConfirm: (d: unknown) => void;
    buffer: unknown;
    decks: unknown[];
    lists: unknown[];
  }) =>
    open ? (
      <div>
        <span>Save Dialog</span>
        <button onClick={() => onConfirm({ kind: 'new-list', name: 'Test', format: 'commander' })}>
          Confirm Save
        </button>
        <button onClick={onCancel}>Cancel Save</button>
      </div>
    ) : null,
}));

// ── Import ─────────────────────────────────────────────────────────────────────

import { CardListToolbar } from '@/components/cards/CardListToolbar';
import type { Card } from '@/lib/cards/types';

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeCard(name: string): Card {
  return {
    card_name: name,
    quantity: 1,
    color_identity: 'C',
    is_commander: false,
    is_proxy: false,
    scryfall_id: `sf-${name}`,
  };
}

const defaultProps = {
  buffer: [makeCard('Sol Ring')],
  onBufferChange: vi.fn(),
  viewMode: 'gallery' as const,
  onViewModeChange: vi.fn(),
  editMode: false,
  onEditModeChange: vi.fn(),
  canUndo: false,
  canRedo: false,
  onUndo: vi.fn(),
  onRedo: vi.fn(),
  onSave: vi.fn(),
  onClear: vi.fn(),
};

describe('CardListToolbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
  });

  it('renders the toolbar', () => {
    render(<CardListToolbar {...defaultProps} />);
    // Add button is always present
    expect(screen.getByLabelText('Add cards to buffer')).toBeInTheDocument();
  });

  it('undo button is disabled when canUndo is false', () => {
    render(<CardListToolbar {...defaultProps} canUndo={false} />);
    expect(screen.getByLabelText('Undo')).toBeDisabled();
  });

  it('redo button is disabled when canRedo is false', () => {
    render(<CardListToolbar {...defaultProps} canRedo={false} />);
    expect(screen.getByLabelText('Redo')).toBeDisabled();
  });

  it('undo button is enabled when canUndo is true', () => {
    render(<CardListToolbar {...defaultProps} canUndo={true} />);
    expect(screen.getByLabelText('Undo')).not.toBeDisabled();
  });

  it('redo button is enabled when canRedo is true', () => {
    render(<CardListToolbar {...defaultProps} canRedo={true} />);
    expect(screen.getByLabelText('Redo')).not.toBeDisabled();
  });

  it('calls onUndo when undo button is clicked', async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    render(<CardListToolbar {...defaultProps} canUndo onUndo={onUndo} />);
    await user.click(screen.getByLabelText('Undo'));
    expect(onUndo).toHaveBeenCalledOnce();
  });

  it('calls onRedo when redo button is clicked', async () => {
    const user = userEvent.setup();
    const onRedo = vi.fn();
    render(<CardListToolbar {...defaultProps} canRedo onRedo={onRedo} />);
    await user.click(screen.getByLabelText('Redo'));
    expect(onRedo).toHaveBeenCalledOnce();
  });

  it('clear button calls window.confirm and does not call onClear when cancelled', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const onClear = vi.fn();
    render(<CardListToolbar {...defaultProps} onClear={onClear} />);

    await user.click(screen.getByLabelText('Clear all cards from buffer'));
    expect(confirmSpy).toHaveBeenCalled();
    expect(onClear).not.toHaveBeenCalled();
  });

  it('clear button calls onClear when confirmed', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const onClear = vi.fn();
    render(<CardListToolbar {...defaultProps} onClear={onClear} />);

    await user.click(screen.getByLabelText('Clear all cards from buffer'));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('detach button is NOT rendered when deckContext is absent', () => {
    render(<CardListToolbar {...defaultProps} deckContext={null} />);
    expect(screen.queryByLabelText(/Detach list from deck/)).not.toBeInTheDocument();
  });

  it('detach button IS rendered when deckContext is set', () => {
    render(
      <CardListToolbar
        {...defaultProps}
        deckContext={{ id: 'test-deck-1', name: 'Elves' }}
        onDetachFromDeck={vi.fn()}
      />
    );
    expect(screen.getByLabelText(/Detach list from deck Elves/)).toBeInTheDocument();
  });
});
