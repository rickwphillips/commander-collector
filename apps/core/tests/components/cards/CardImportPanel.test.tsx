import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ── Import ─────────────────────────────────────────────────────────────────────

import { CardImportPanel } from '@/components/cards/CardImportPanel';
import type { Card } from '@/lib/cards/types';

describe('CardImportPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders paste textarea in paste mode', () => {
    render(<CardImportPanel onCards={vi.fn()} mode="paste" />);
    expect(screen.getByLabelText('Paste card list text')).toBeInTheDocument();
  });

  it('renders dropzone in file mode', () => {
    render(<CardImportPanel onCards={vi.fn()} mode="file" />);
    expect(screen.getByLabelText(/Drop a card list file here/)).toBeInTheDocument();
  });

  it('renders both paste and dropzone in both mode', () => {
    render(<CardImportPanel onCards={vi.fn()} mode="both" />);
    expect(screen.getByLabelText('Paste card list text')).toBeInTheDocument();
    expect(screen.getByLabelText(/Drop a card list file here/)).toBeInTheDocument();
  });

  it('Parse button is disabled when textarea is empty', () => {
    render(<CardImportPanel onCards={vi.fn()} mode="paste" />);
    expect(screen.getByLabelText('Parse pasted card list')).toBeDisabled();
  });

  it('Parse button is enabled after typing in textarea', async () => {
    const user = userEvent.setup();
    render(<CardImportPanel onCards={vi.fn()} mode="paste" />);
    await user.type(screen.getByLabelText('Paste card list text'), '1 Sol Ring');
    expect(screen.getByLabelText('Parse pasted card list')).not.toBeDisabled();
  });

  it('calls onCards with parsed Card[] after clicking Parse', async () => {
    const user = userEvent.setup();
    const onCards = vi.fn();
    render(<CardImportPanel onCards={onCards} mode="paste" />);

    await user.type(screen.getByLabelText('Paste card list text'), '1 Sol Ring\n2 Lightning Bolt');
    await user.click(screen.getByLabelText('Parse pasted card list'));

    expect(onCards).toHaveBeenCalledOnce();
    const cards = onCards.mock.calls[0]?.[0] as Card[];
    expect(cards).toHaveLength(2);
    expect(cards[0].card_name).toBe('Sol Ring');
    expect(cards[1].quantity).toBe(2);
  });

  it('shows error message when no cards are recognised', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    render(<CardImportPanel onCards={vi.fn()} onError={onError} mode="paste" />);

    await user.type(screen.getByLabelText('Paste card list text'), '   ');
    // Whitespace-only — should not trigger parse (button disabled)
    expect(screen.getByLabelText('Parse pasted card list')).toBeDisabled();
  });

  it('shows error when pasted text produces zero cards', async () => {
    const user = userEvent.setup();
    const onError = vi.fn();
    render(<CardImportPanel onCards={vi.fn()} onError={onError} mode="paste" />);

    // Type something that isn't a valid card line
    await user.type(screen.getByLabelText('Paste card list text'), '######');
    await user.click(screen.getByLabelText('Parse pasted card list'));

    expect(onError).toHaveBeenCalledWith(
      expect.stringContaining('No cards recognised'),
    );
    expect(screen.getByText(/No cards recognised/)).toBeInTheDocument();
  });

  it('shows success chip with count after successful parse', async () => {
    const user = userEvent.setup();
    render(<CardImportPanel onCards={vi.fn()} mode="paste" />);

    await user.type(screen.getByLabelText('Paste card list text'), '4 Forest\n1 Sol Ring');
    await user.click(screen.getByLabelText('Parse pasted card list'));

    expect(screen.getByText('5 cards ready')).toBeInTheDocument();
  });
});
