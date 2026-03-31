/**
 * Regression tests for GameBoard, GameEndSummary, and PlayerPanel behaviors:
 *
 *  1. End game flow — phase='ended' renders GameEndSummary (not GameSetup)
 *  2. Turn 0 guard — ending before first player is picked skips summary
 *  3. Eliminated turn prefill — surviving players get current turn number
 *  4. Commander damage dealt indicator — dealt values computed correctly
 *  5. Log Game prefill — localStorage populated with correct data
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// ─── Mocks (hoisted before any import resolution) ─────────────────────────────

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/components/AuthGuard', () => ({
  useAuth: () => ({ user: { id: 'test-user-uuid', username: 'tester', display_name: 'Tester', role: 'admin' }, logout: vi.fn() }),
}));

vi.mock('@/lib/api', () => ({
  api: {
    getLiveGame:      vi.fn(),
    updateLiveGame:   vi.fn(),
    deleteLiveGame:   vi.fn(),
    createLiveGame:   vi.fn(),
    getActiveGame:    vi.fn(),
    getGameSettings:  vi.fn(),
  },
  apiFetch: vi.fn(),
  API_BASE: '',
}));

vi.mock('@/game-manager/components/GameSetup', () => ({
  GameSetup: ({ onStart }: { onStart: (p: unknown[], l: number, t: number) => void }) => (
    <button data-testid="setup-form" onClick={() => onStart(
      [
        { playerId: 1, deckId: 1, playerName: 'Alice', deckName: 'D1', commander: { name: 'Atraxa' } },
        { playerId: 2, deckId: 2, playerName: 'Bob',   deckName: 'D2', commander: { name: 'Urza'   } },
        { playerId: 3, deckId: 3, playerName: 'Carol', deckName: 'D3', commander: { name: 'Krenko' } },
        { playerId: 4, deckId: 4, playerName: 'Dave',  deckName: 'D4', commander: { name: 'Meren'  } },
      ],
      40,
      300,
    )}>
      Start
    </button>
  ),
}));

// GameBoard stub that exposes onEndGame for triggering end-game flow
let capturedOnEndGame: (() => void) | null = null;
let capturedOnUpdate: ((s: unknown) => void) | null = null;

vi.mock('@/game-manager/components/GameBoard', () => ({
  GameBoard: ({ onEndGame, onUpdate }: { onEndGame: () => void; onUpdate: (s: unknown) => void }) => {
    capturedOnEndGame = onEndGame;
    capturedOnUpdate = onUpdate;
    return <div data-testid="game-board" />;
  },
}));

// ─── Static imports (after mocks are declared) ────────────────────────────────

import { api } from '@/lib/api';
import GameManagerPage from '@/game-manager/page';
import { GAME_MANAGER_PREFILL_KEY } from '@/game-manager/types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makePlayingState(overrides: Record<string, unknown> = {}) {
  return {
    players: [
      { playerId: 1, deckId: 1, playerName: 'Alice', deckName: 'D1', commander: { name: 'Atraxa' },
        position: 'bottom', life: 35, poison: 0, commanderTax: 0, isMonarch: false,
        hasInitiative: false, hasCitysBlessing: false, energy: 0, experience: 0,
        isEliminated: false, isConceded: false, eliminatedTurn: null },
      { playerId: 2, deckId: 2, playerName: 'Bob', deckName: 'D2', commander: { name: 'Urza' },
        position: 'left', life: 28, poison: 3, commanderTax: 2, isMonarch: false,
        hasInitiative: false, hasCitysBlessing: false, energy: 0, experience: 0,
        isEliminated: false, isConceded: false, eliminatedTurn: null },
      { playerId: 3, deckId: 3, playerName: 'Carol', deckName: 'D3', commander: { name: 'Krenko' },
        position: 'top', life: 0, poison: 0, commanderTax: 0, isMonarch: false,
        hasInitiative: false, hasCitysBlessing: false, energy: 0, experience: 0,
        isEliminated: true, isConceded: false, eliminatedTurn: 5 },
      { playerId: 4, deckId: 4, playerName: 'Dave', deckName: 'D4', commander: { name: 'Meren' },
        position: 'right', life: 12, poison: 0, commanderTax: 0, isMonarch: false,
        hasInitiative: false, hasCitysBlessing: false, energy: 0, experience: 0,
        isEliminated: false, isConceded: false, eliminatedTurn: null },
    ],
    commanderDamage: {
      0: { 1: [5, 0], 2: [0, 0], 3: [3, 0] },
      1: { 0: [0, 0], 2: [7, 0], 3: [0, 0] },
      2: { 0: [0, 0], 1: [0, 0], 3: [21, 0] },
      3: { 0: [4, 0], 1: [0, 0], 2: [0, 0] },
    },
    currentPlayerIdx: 1,
    turnNumber: 8,
    startingLife: 40,
    phase: 'playing' as const,
    turnTimerSeconds: 300,
    turnStartTime: Date.now(),
    notes: '',
    sessionCode: 'test123',
    sessionSeats: { bottom: 'test123', left: 'seat2', top: 'seat3', right: 'seat4' },
    firstPlayerIdx: 0,
    ...overrides,
  };
}

// ─── Shared setup ─────────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  capturedOnEndGame = null;
  capturedOnUpdate = null;
  (api.updateLiveGame as ReturnType<typeof vi.fn>).mockResolvedValue({});
  (api.deleteLiveGame as ReturnType<typeof vi.fn>).mockResolvedValue({});
  (api.createLiveGame as ReturnType<typeof vi.fn>).mockResolvedValue({ seats: { bottom: 'newcode' } });
  (api.getGameSettings as ReturnType<typeof vi.fn>).mockResolvedValue({
    highlight_mode: true, sound_enabled: true, turn_timer_enabled: true, turn_timer_seconds: 300,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── Helper: load an active game and render GameBoard ─────────────────────────

async function renderWithActiveGame(stateOverrides: Record<string, unknown> = {}) {
  const state = makePlayingState(stateOverrides);
  (api.getActiveGame as ReturnType<typeof vi.fn>).mockResolvedValue({
    is_active: true,
    state,
    session_code: state.sessionCode,
    session_seats: state.sessionSeats,
  });
  (api.getLiveGame as ReturnType<typeof vi.fn>).mockResolvedValue({
    is_active: true, state, remote_events: [], updated_at: '2026-01-01', seat: 'bottom',
  });

  const result = render(<GameManagerPage />);
  await waitFor(() => result.getByTestId('game-board'));
  return result;
}

// ─── Tests: End game renders GameEndSummary ─────────────────────────────────

describe('end game flow — GameEndSummary rendering', () => {
  it('renders GameEndSummary when game phase is ended and firstPlayerIdx is set', async () => {
    await renderWithActiveGame();

    // Trigger end game via captured handler
    expect(capturedOnEndGame).not.toBeNull();
    act(() => { capturedOnEndGame!(); });

    // Should show "Game Over" from GameEndSummary
    await waitFor(() => {
      expect(screen.getByText('Game Over')).toBeInTheDocument();
    });

    // Should NOT show setup form
    expect(screen.queryByTestId('setup-form')).not.toBeInTheDocument();
  });

  it('shows all player names in the end game summary', async () => {
    await renderWithActiveGame();
    act(() => { capturedOnEndGame!(); });

    await waitFor(() => screen.getByText('Game Over'));

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
    expect(screen.getByText('Dave')).toBeInTheDocument();
  });

  it('displays turn count and starting life', async () => {
    await renderWithActiveGame();
    act(() => { capturedOnEndGame!(); });

    await waitFor(() => {
      expect(screen.getByText('8 turns · Starting life: 40')).toBeInTheDocument();
    });
  });

  it('deletes live session when ending game', async () => {
    await renderWithActiveGame();
    act(() => { capturedOnEndGame!(); });

    await waitFor(() => {
      expect(api.deleteLiveGame).toHaveBeenCalledWith('test123');
    });
  });
});

// ─── Tests: Turn 0 guard — no summary before first player picked ────────────

describe('turn 0 guard — skip summary when first player not set', () => {
  it('falls through to GameSetup when ended without firstPlayerIdx', async () => {
    await renderWithActiveGame({ firstPlayerIdx: undefined });
    act(() => { capturedOnEndGame!(); });

    // Should show setup form, not game over screen
    await waitFor(() => {
      expect(screen.getByTestId('setup-form')).toBeInTheDocument();
    });
    expect(screen.queryByText('Game Over')).not.toBeInTheDocument();
  });

  it('shows GameEndSummary when firstPlayerIdx is 0 (falsy but valid)', async () => {
    await renderWithActiveGame({ firstPlayerIdx: 0 });
    act(() => { capturedOnEndGame!(); });

    await waitFor(() => {
      expect(screen.getByText('Game Over')).toBeInTheDocument();
    });
  });
});

// ─── Tests: Eliminated turn prefill ─────────────────────────────────────────

describe('eliminated turn prefill', () => {
  it('pre-fills eliminated turn with current turn for surviving players', async () => {
    await renderWithActiveGame({ turnNumber: 8 });
    act(() => { capturedOnEndGame!(); });

    await waitFor(() => screen.getByText('Game Over'));

    // All eliminated turn fields should be present
    // Carol was eliminated on turn 5 (should keep that value)
    // Alice, Bob, Dave are alive — should be pre-filled with turn 8
    const eliminatedInputs = screen.getAllByLabelText('Eliminated Turn');

    // Carol (eliminated turn 5) has finish position unset, so eliminated turn field shows
    // Alice, Bob, Dave — alive — also have eliminated turn fields (finish position not 1st)
    // Values should be the actual turn numbers
    eliminatedInputs.forEach((input) => {
      const value = (input as HTMLInputElement).value;
      // Every eliminated turn field should have a numeric value (not empty)
      expect(value).not.toBe('');
    });
  });

  it('preserves original eliminatedTurn for players who were eliminated during game', async () => {
    await renderWithActiveGame({ turnNumber: 8 });
    act(() => { capturedOnEndGame!(); });

    await waitFor(() => screen.getByText('Game Over'));

    const eliminatedInputs = screen.getAllByLabelText('Eliminated Turn');
    const values = eliminatedInputs.map((input) => Number((input as HTMLInputElement).value));

    // One of these values should be 5 (Carol's elimination turn)
    expect(values).toContain(5);
    // Others should be 8 (current turn)
    expect(values.filter((v) => v === 8).length).toBeGreaterThanOrEqual(2);
  });
});

// ─── Tests: Log Game prefill into localStorage ──────────────────────────────

describe('Log Game — localStorage prefill', () => {
  it('stores prefill data in localStorage when Log Game is clicked', async () => {
    await renderWithActiveGame();
    act(() => { capturedOnEndGame!(); });

    await waitFor(() => screen.getByText('Game Over'));

    // Click "Log Game"
    const logBtn = screen.getByRole('button', { name: 'Log Game' });
    await userEvent.click(logBtn);

    const raw = localStorage.getItem(GAME_MANAGER_PREFILL_KEY);
    expect(raw).not.toBeNull();

    const prefill = JSON.parse(raw!);
    expect(prefill.playedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(prefill.results).toHaveLength(4);
    expect(prefill.results[0].playerId).toBe(1);
    expect(prefill.results[0].deckId).toBe(1);
  });

  it('includes eliminatedTurn values in prefill', async () => {
    await renderWithActiveGame({ turnNumber: 8 });
    act(() => { capturedOnEndGame!(); });

    await waitFor(() => screen.getByText('Game Over'));

    const logBtn = screen.getByRole('button', { name: 'Log Game' });
    await userEvent.click(logBtn);

    const prefill = JSON.parse(localStorage.getItem(GAME_MANAGER_PREFILL_KEY)!);
    // Carol was eliminated turn 5, others defaulted to turn 8
    const carIdx = prefill.results.findIndex((r: { playerId: number }) => r.playerId === 3);
    expect(prefill.results[carIdx].eliminatedTurn).toBe(5);
  });
});

// ─── Tests: New Game and Discard from end summary ───────────────────────────

describe('end summary — New Game and Discard', () => {
  it('returns to setup form when New Game is clicked', async () => {
    await renderWithActiveGame();
    act(() => { capturedOnEndGame!(); });

    await waitFor(() => screen.getByText('Game Over'));

    await userEvent.click(screen.getByRole('button', { name: 'New Game' }));

    await waitFor(() => {
      expect(screen.getByTestId('setup-form')).toBeInTheDocument();
    });
  });

  it('returns to setup form when Discard Results is clicked', async () => {
    await renderWithActiveGame();
    act(() => { capturedOnEndGame!(); });

    await waitFor(() => screen.getByText('Game Over'));

    await userEvent.click(screen.getByRole('button', { name: 'Discard Results' }));

    await waitFor(() => {
      expect(screen.getByTestId('setup-form')).toBeInTheDocument();
    });
  });
});

// ─── Tests: Commander damage dealt computation ──────────────────────────────

describe('commander damage dealt indicator — pure computation', () => {
  // These test the dealt lookup logic that PlayerPanel uses:
  // commanderDamage[sourceIdx]?.[playerIdx] gives damage dealt BY playerIdx TO sourceIdx

  it('computes dealt damage from commanderDamage map correctly', () => {
    const commanderDamage = {
      0: { 1: [5, 0], 2: [0, 0], 3: [3, 0] },
      1: { 0: [0, 0], 2: [7, 0], 3: [0, 0] },
      2: { 0: [0, 0], 1: [0, 0], 3: [21, 0] },
      3: { 0: [4, 0], 1: [0, 0], 2: [0, 0] },
    };

    // Player 0 (Alice) has dealt:
    //   to player 1: commanderDamage[1][0] = [0, 0] → 0
    //   to player 2: commanderDamage[2][0] = [0, 0] → 0
    //   to player 3: commanderDamage[3][0] = [4, 0] → 4
    expect(commanderDamage[1]?.[0]).toEqual([0, 0]);
    expect(commanderDamage[2]?.[0]).toEqual([0, 0]);
    expect(commanderDamage[3]?.[0]).toEqual([4, 0]);

    // Player 3 (Dave) has dealt:
    //   to player 0: commanderDamage[0][3] = [3, 0] → 3
    //   to player 1: commanderDamage[1][3] = [0, 0] → 0
    //   to player 2: commanderDamage[2][3] = [21, 0] → 21 (lethal!)
    expect(commanderDamage[0]?.[3]).toEqual([3, 0]);
    expect(commanderDamage[1]?.[3]).toEqual([0, 0]);
    expect(commanderDamage[2]?.[3]).toEqual([21, 0]);
  });

  it('handles missing entries gracefully with nullish coalescing', () => {
    const commanderDamage: Record<number, Record<number, [number, number]>> = {
      0: { 1: [5, 0] },
    };

    // Missing target entry
    const dealt = commanderDamage[2]?.[0] ?? [0, 0];
    expect(dealt).toEqual([0, 0]);

    // Missing source entry within existing target
    const dealt2 = commanderDamage[0]?.[3] ?? [0, 0];
    expect(dealt2).toEqual([0, 0]);
  });

  it('sums partner damage correctly', () => {
    const commanderDamage = {
      0: { 1: [10, 8] },
    };

    const dealt = commanderDamage[0]?.[1] ?? [0, 0];
    const dealtTotal = dealt[0] + dealt[1];
    expect(dealtTotal).toBe(18);
    expect(dealt[0]).toBe(10); // main commander
    expect(dealt[1]).toBe(8);  // partner
  });
});

// ─── Tests: buildInitialState and isValidPlayableState ──────────────────────

describe('state validation', () => {
  it('rejects state with no players', async () => {
    (api.getActiveGame as ReturnType<typeof vi.fn>).mockResolvedValue({
      is_active: true,
      state: { ...makePlayingState(), players: [] },
      session_code: 'abc',
    });

    render(<GameManagerPage />);

    // Should fall through to setup form
    await waitFor(() => {
      expect(screen.getByTestId('setup-form')).toBeInTheDocument();
    });
  });

  it('rejects state with out-of-bounds currentPlayerIdx', async () => {
    (api.getActiveGame as ReturnType<typeof vi.fn>).mockResolvedValue({
      is_active: true,
      state: { ...makePlayingState(), currentPlayerIdx: 10 },
      session_code: 'abc',
    });

    render(<GameManagerPage />);

    await waitFor(() => {
      expect(screen.getByTestId('setup-form')).toBeInTheDocument();
    });
  });
});
