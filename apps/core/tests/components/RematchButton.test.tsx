import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { RematchButton } from '@/components/RematchButton';

// ---- Mocks ----

const { mockPush, mockGetMostRecentGame } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockGetMostRecentGame: vi.fn<() => Promise<{ id: string } | null>>(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/lib/api', () => ({
  api: {
    getMostRecentGame: (...args: unknown[]) => mockGetMostRecentGame(...(args as [])),
  },
}));

describe('RematchButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders immediately for an explicit gameId without querying for the most recent game', () => {
    render(<RematchButton gameId="g-42" />);
    expect(screen.getByRole('button', { name: /rematch/i })).toBeInTheDocument();
    expect(mockGetMostRecentGame).not.toHaveBeenCalled();
  });

  it('navigates to the pre-filled setup with the explicit gameId on click', () => {
    render(<RematchButton gameId="g-42" />);
    fireEvent.click(screen.getByRole('button', { name: /rematch/i }));
    expect(mockPush).toHaveBeenCalledWith('/game-manager?rematch=g-42');
  });

  it('resolves and shows the most recent game when no gameId is given', async () => {
    mockGetMostRecentGame.mockResolvedValue({ id: 'recent-7' });
    render(<RematchButton />);

    const btn = await screen.findByRole('button', { name: /rematch/i });
    fireEvent.click(btn);
    expect(mockPush).toHaveBeenCalledWith('/game-manager?rematch=recent-7');
  });

  it('renders nothing when there is no prior game to rematch', async () => {
    mockGetMostRecentGame.mockResolvedValue(null);
    render(<RematchButton />);

    await waitFor(() => expect(mockGetMostRecentGame).toHaveBeenCalled());
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders nothing when the most-recent-game lookup fails', async () => {
    mockGetMostRecentGame.mockRejectedValue(new Error('network'));
    render(<RematchButton />);

    await waitFor(() => expect(mockGetMostRecentGame).toHaveBeenCalled());
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('honors a custom label', () => {
    render(<RematchButton gameId="g-1" label="Rematch this game" />);
    expect(screen.getByRole('button', { name: /rematch this game/i })).toBeInTheDocument();
  });
});
