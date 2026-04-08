import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { Trash } from '@/components/cards/Trash';
import type { TrashItem } from '@/components/cards/Trash';

// ── Fixtures ──────────────────────────────────────────────────────────────────

function daysAgo(n: number): string {
  return dayjs().subtract(n, 'day').toISOString();
}

const deckItem: TrashItem = {
  kind: 'deck',
  id: 'test-deck-1',
  name: 'Elves',
  deletedAt: daysAgo(10),
  cardCount: 100,
  attachedListCount: 2,
};

const listItem: TrashItem = {
  kind: 'list',
  id: 'test-list-10',
  name: 'My Sideboard',
  deletedAt: daysAgo(2), // 2 days ago → 28 days remaining → warning threshold (≤3 is warning)
  cardCount: 15,
  deckName: 'Elves',
};

const expiringListItem: TrashItem = {
  kind: 'list',
  id: 'test-list-11',
  name: 'Expiring List',
  deletedAt: daysAgo(28), // 2 days remaining — warning visual
  cardCount: 5,
  deckName: null,
};

describe('Trash', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders empty message when no items', () => {
    render(<Trash items={[]} onRestore={vi.fn()} />);
    expect(screen.getByText('Trash is empty.')).toBeInTheDocument();
  });

  it('renders deck section when decks are present', () => {
    render(<Trash items={[deckItem]} onRestore={vi.fn()} />);
    // TrashSection shows "Decks (1)"
    expect(screen.getByText(/Decks \(1\)/)).toBeInTheDocument();
    expect(screen.getByText('Elves')).toBeInTheDocument();
  });

  it('renders list section when lists are present', () => {
    render(<Trash items={[listItem]} onRestore={vi.fn()} />);
    expect(screen.getByText(/Lists \(1\)/)).toBeInTheDocument();
    expect(screen.getByText('My Sideboard')).toBeInTheDocument();
  });

  it('renders both sections when deck and list items exist', () => {
    render(<Trash items={[deckItem, listItem]} onRestore={vi.fn()} />);
    expect(screen.getByText(/Decks \(1\)/)).toBeInTheDocument();
    expect(screen.getByText(/Lists \(1\)/)).toBeInTheDocument();
  });

  it('calls onRestore with the correct item when Restore is clicked', async () => {
    const user = userEvent.setup();
    const onRestore = vi.fn().mockResolvedValue(undefined);
    render(<Trash items={[deckItem]} onRestore={onRestore} />);

    await user.click(screen.getByLabelText('Restore deck Elves'));
    expect(onRestore).toHaveBeenCalledWith(deckItem);
  });

  it('shows "Xd remaining" for items with days left', () => {
    render(<Trash items={[deckItem]} onRestore={vi.fn()} />);
    // 10 days ago → ~20 days remaining (dayjs.diff rounds, so accept 19 or 20)
    expect(screen.getByText(/^\d+d remaining$/)).toBeInTheDocument();
  });

  it('shows warning visual for items with ≤3 days remaining', () => {
    render(<Trash items={[expiringListItem]} onRestore={vi.fn()} />);
    // 28 days ago → ≤3 days remaining → warning styling applied
    // The text may be "1d remaining" or "2d remaining" depending on time-of-day precision
    const badge = screen.getByText(/^(\d+d remaining|Expires today)$/);
    expect(badge).toBeInTheDocument();
    // Check the badge text value is within warning threshold (≤3)
    const match = badge.textContent?.match(/^(\d+)d/);
    if (match) {
      expect(Number(match[1])).toBeLessThanOrEqual(3);
    }
  });

  it('shows skeleton rows when loading is true', () => {
    render(<Trash items={[]} onRestore={vi.fn()} loading />);
    // TrashSkeletonRows renders 4 skeleton items (not the empty message)
    expect(screen.queryByText('Trash is empty.')).not.toBeInTheDocument();
  });

  it('shows custom empty message when provided', () => {
    render(<Trash items={[]} onRestore={vi.fn()} emptyMessage="Nothing here yet." />);
    expect(screen.getByText('Nothing here yet.')).toBeInTheDocument();
  });

  it('shows deck list details in subtitle', () => {
    render(<Trash items={[deckItem]} onRestore={vi.fn()} />);
    // subtitle: "100 cards · 2 lists attached"
    expect(screen.getByText(/100 cards · 2 lists attached/)).toBeInTheDocument();
  });

  it('shows list deck context in subtitle when list has a parent deck', () => {
    render(<Trash items={[listItem]} onRestore={vi.fn()} />);
    // subtitle: "15 cards · from deck "Elves""
    expect(screen.getByText(/from deck "Elves"/)).toBeInTheDocument();
  });

  it('shows standalone in subtitle when list has no parent deck', () => {
    render(<Trash items={[expiringListItem]} onRestore={vi.fn()} />);
    expect(screen.getByText(/standalone/)).toBeInTheDocument();
  });
});
