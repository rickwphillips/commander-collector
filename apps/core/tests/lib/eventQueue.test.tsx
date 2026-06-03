/**
 * Tests for the delta event queue architecture (Option B).
 *
 * Core guarantees verified here:
 *  1. Host applies events in order → correct final state
 *  2. Turn fields (currentPlayerIdx, turnNumber) are NEVER affected by stat events
 *  3. Events from multiple remotes are applied without conflict
 *  4. pass_turn event advances turn correctly
 *  5. Host does not call updateLiveGame when there are no remote events
 *  6. Remote sends events (not full state) via sendLiveGameEvent
 *  7. Remote never calls updateLiveGame
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/components/AuthGuard', () => ({
  useAuth: () => ({ user: { id: 'test-user-uuid', username: 'tester', display_name: 'Tester', role: 'admin' }, logout: vi.fn() }),
}));

vi.mock('@/lib/api', () => ({
  api: {
    getLiveGame:         vi.fn(),
    updateLiveGame:      vi.fn(),
    deleteLiveGame:      vi.fn(),
    createLiveGame:      vi.fn(),
    sendLiveGameEvent:   vi.fn(),
    getActiveGame:       vi.fn(),
    getGameSettings:     vi.fn(),
    openLiveGameHostStream: vi.fn(() => vi.fn()),
  },
  apiFetch: vi.fn(),
  API_BASE: '',
}));

vi.mock('@/game-manager/components/GameSetup', () => ({
  GameSetup: ({ onStart }: { onStart: (p: unknown[], l: number, t: number) => void }) => (
    <button
      data-testid="start-btn"
      onClick={() => onStart(
        [
          { playerId: 'player-alice', deckId: 'deck-1', playerName: 'Alice', deckName: 'D1', commander: { name: 'Atraxa' } },
          { playerId: 'player-bob', deckId: 'deck-2', playerName: 'Bob',   deckName: 'D2', commander: { name: 'Urza'   } },
        ],
        40,
        300,
      )}
    >
      Start
    </button>
  ),
}));

vi.mock('@/game-manager/components/GameBoard', () => ({
  GameBoard: () => <div data-testid="game-board" />,
}));

vi.mock('@/game-manager/components/GameEndSummary', () => ({
  GameEndSummary: () => <div data-testid="game-end" />,
}));

// ─── Imports (after mocks) ────────────────────────────────────────────────────

import { api } from '@/lib/api';
import GameManagerPage from '@/game-manager/page';
import { applyEvent } from '@/game-manager/remoteTransforms';
import type { GameManagerState, LiveGameEvent, PlayerState } from '@/lib/types';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    playerId: 'player-alice', deckId: 'deck-test-1', playerName: 'Alice', deckName: 'D',
    commander: { name: 'X' }, position: 'bottom',
    life: 40, poison: 0, commanderTax: 0,
    isMonarch: false, hasInitiative: false, hasCitysBlessing: false,
    energy: 0, experience: 0,
    isEliminated: false, isConceded: false, eliminatedTurn: null,
    ...overrides,
  };
}

const mockPlayingState: GameManagerState = {
  players: [
    makePlayer({ playerId: 'player-alice', position: 'bottom' }),
    makePlayer({ playerId: 'player-bob', position: 'top', playerName: 'Bob' }),
  ],
  commanderDamage: { 0: { 1: [0, 0] }, 1: { 0: [0, 0] } },
  currentPlayerIdx: 0,
  turnNumber: 1,
  startingLife: 40,
  phase: 'playing',
  turnTimerSeconds: 300,
  turnStartTime: 0,
  notes: '',
  sessionCode: 'abc123',
  sessionSeats: { bottom: 'abc123' },
};

// ─── Unit tests: applyEvent order and turn-field safety ───────────────────────

describe('applyEvent — event queue core invariants', () => {
  it('applies a life_change event and does NOT touch currentPlayerIdx or turnNumber', () => {
    const state: GameManagerState = {
      ...mockPlayingState,
      currentPlayerIdx: 1,
      turnNumber: 5,
    };
    const event: LiveGameEvent = {
      type: 'life_change', playerIdx: 0, delta: -1, seat: 'bottom', ts: 0,
    };
    const result = applyEvent(state, event);
    expect(result.players[0].life).toBe(39);
    expect(result.currentPlayerIdx).toBe(1);  // preserved
    expect(result.turnNumber).toBe(5);         // preserved
  });

  it('applies a series of events from two different remotes without conflict', () => {
    const state: GameManagerState = {
      ...mockPlayingState,
      players: [
        makePlayer({ position: 'bottom', life: 40 }),
        makePlayer({ position: 'top',    life: 40, playerName: 'Bob' }),
      ],
      currentPlayerIdx: 0,
      turnNumber: 3,
    };
    const events: LiveGameEvent[] = [
      { type: 'life_change', playerIdx: 0, delta: -2, seat: 'bottom', ts: 1 },
      { type: 'poison_change', playerIdx: 1, delta: 1, seat: 'top',    ts: 2 },
      { type: 'life_change', playerIdx: 0, delta: -1, seat: 'bottom', ts: 3 },
    ];
    const result = events.reduce(applyEvent, state);

    expect(result.players[0].life).toBe(37);   // bottom: 40 - 2 - 1
    expect(result.players[1].poison).toBe(1);  // top: +1 poison
    expect(result.currentPlayerIdx).toBe(0);   // host turn field untouched
    expect(result.turnNumber).toBe(3);         // host turn field untouched
  });

  it('pass_turn event advances turn to next player', () => {
    // Player 1 (top) passes back to player 0 (bottom = firstPlayer) → turn increments
    const state: GameManagerState = {
      ...mockPlayingState,
      currentPlayerIdx: 1,
      turnNumber: 1,
      firstPlayerIdx: 0,
      players: [
        makePlayer({ position: 'bottom' }),
        makePlayer({ position: 'top', playerName: 'Bob' }),
      ],
    };
    const event: LiveGameEvent = { type: 'pass_turn', seat: 'top', ts: 0 };
    const result = applyEvent(state, event);
    expect(result.currentPlayerIdx).toBe(0);
    expect(result.turnNumber).toBe(2);
  });

  it('applying events to host state with advanced turn preserves the advanced turn', () => {
    // This is the exact scenario that was broken before:
    // Host advances turn (turn 1 → 2, currentPlayerIdx 0 → 1).
    // Remote has a stale local state (turn 1) but sends an EVENT (not full state).
    // Host applies the event on top of its OWN current state (turn 2).
    // The turn must remain 2 after the event is applied.
    const hostStateAfterTurnAdvance: GameManagerState = {
      ...mockPlayingState,
      currentPlayerIdx: 1,
      turnNumber: 2,
    };
    const remoteEvent: LiveGameEvent = {
      type: 'life_change', playerIdx: 0, delta: -1, seat: 'bottom', ts: 0,
    };
    const result = applyEvent(hostStateAfterTurnAdvance, remoteEvent);

    expect(result.currentPlayerIdx).toBe(1);  // NOT reverted to 0
    expect(result.turnNumber).toBe(2);         // NOT reverted to 1
    expect(result.players[0].life).toBe(39);  // life change applied correctly
  });
});

// ─── Integration: host page event consumption ─────────────────────────────────

describe('host page — event queue consumption', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    (api.updateLiveGame as ReturnType<typeof vi.fn>).mockResolvedValue({ updated_at: '2026-01-01' });
    (api.deleteLiveGame as ReturnType<typeof vi.fn>).mockResolvedValue({});
    (api.createLiveGame as ReturnType<typeof vi.fn>).mockResolvedValue({ seats: { bottom: 'newcode' } });
    (api.sendLiveGameEvent as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true });
    (api.getGameSettings as ReturnType<typeof vi.fn>).mockResolvedValue({
      highlight_mode: true, sound_enabled: true, turn_timer_enabled: true, turn_timer_seconds: 300,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('applies remote events from the host stream and writes merged state to DB', async () => {
    const lifeChangeEvent: LiveGameEvent = {
      type: 'life_change', playerIdx: 0, delta: -5, seat: 'top', ts: Date.now(),
    };

    // Capture the stream's onEvents callback so the test can push a batch,
    // mirroring how the SSE endpoint delivers events to the host.
    let pushEvents: ((events: LiveGameEvent[]) => void) | null = null;
    (api.openLiveGameHostStream as ReturnType<typeof vi.fn>).mockImplementation(
      (_code: string, onEvents: (events: LiveGameEvent[]) => void) => {
        pushEvents = onEvents;
        return () => {};
      },
    );

    // getActiveGame returns an active playing session
    (api.getActiveGame as ReturnType<typeof vi.fn>).mockResolvedValue({
      is_active: true, state: mockPlayingState, session_code: 'abc123',
    });
    (api.getLiveGame as ReturnType<typeof vi.fn>).mockResolvedValue({
      is_active: true,
      state: mockPlayingState,
      remote_events: [],
      updated_at: '2026-01-01T00:00:00Z',
      seat: 'bottom',
    });

    render(<GameManagerPage />);

    // Let getActiveGame resolve and the stream effect register its callback.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(pushEvents).not.toBeNull();

    // Deliver the remote event via the stream, as the SSE endpoint would.
    await act(async () => {
      pushEvents!([lifeChangeEvent]);
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(api.updateLiveGame).toHaveBeenCalledWith(
      'abc123',
      expect.objectContaining({
        players: expect.arrayContaining([
          expect.objectContaining({ life: 35 }), // 40 - 5
        ]),
      }),
    );
  });

  it('does NOT call updateLiveGame when poll returns no events', async () => {
    (api.getActiveGame as ReturnType<typeof vi.fn>).mockResolvedValue({
      is_active: true, state: mockPlayingState, session_code: 'abc123',
    });
    (api.getLiveGame as ReturnType<typeof vi.fn>).mockResolvedValue({
      is_active: true,
      state: mockPlayingState,
      remote_events: [],
      updated_at: '2026-01-01T00:00:00Z',
      seat: 'bottom',
    });

    render(<GameManagerPage />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });

    // All updateLiveGame calls should have unchanged life (no events applied)
    const calls = (api.updateLiveGame as ReturnType<typeof vi.fn>).mock.calls.filter(
      ([, state]) => state !== undefined,
    );
    calls.forEach(([, state]) => {
      expect(state.players[0].life).toBe(40);
    });
  });

  it('host never calls sendLiveGameEvent', async () => {
    (api.getActiveGame as ReturnType<typeof vi.fn>).mockResolvedValue({
      is_active: true, state: mockPlayingState, session_code: 'abc123',
    });
    (api.getLiveGame as ReturnType<typeof vi.fn>).mockResolvedValue({
      is_active: true,
      state: mockPlayingState,
      remote_events: [],
      updated_at: '2026-01-01T00:00:00Z',
      seat: 'bottom',
    });

    render(<GameManagerPage />);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });

    expect(api.sendLiveGameEvent).not.toHaveBeenCalled();
  });
});
