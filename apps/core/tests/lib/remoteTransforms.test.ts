import { describe, it, expect } from 'vitest';
import {
  applyLifeChange,
  applyPoisonChange,
  applyCommanderTaxChange,
  applyEnergyChange,
  applyExperienceChange,
  applyToggleMonarch,
  applyToggleInitiative,
  applyToggleCitysBlessing,
  applyCommanderDamageChange,
  applyEliminate,
  applyUndoEliminate,
  applyPassTurn,
  applyCheckin,
  applyEvent,
} from '@/game-manager/remoteTransforms';
import type { GameManagerState, PlayerState, LiveGameEvent } from '@/lib/types';

// ─── Test helpers ─────────────────────────────────────────────────────────────

function makePlayer(overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    playerId: 'player-alice',
    deckId: 'deck-test-1',
    playerName: 'Alice',
    deckName: 'Test Deck',
    commander: { name: 'Atraxa' },
    position: 'bottom',
    life: 40,
    poison: 0,
    commanderTax: 0,
    isMonarch: false,
    hasInitiative: false,
    hasCitysBlessing: false,
    energy: 0,
    experience: 0,
    isEliminated: false,
    isConceded: false,
    eliminatedTurn: null,
    ...overrides,
  };
}

function makeState(overrides: Partial<GameManagerState> = {}): GameManagerState {
  const players: PlayerState[] = overrides.players ?? [
    makePlayer({ position: 'bottom', playerName: 'Alice', playerId: 'player-alice' }),
    makePlayer({ position: 'left',   playerName: 'Bob',   playerId: 'player-bob' }),
    makePlayer({ position: 'top',    playerName: 'Carol', playerId: 'player-carol' }),
    makePlayer({ position: 'right',  playerName: 'Dave',  playerId: 'player-dave' }),
  ];
  return {
    players,
    commanderDamage: {
      0: { 1: [0, 0], 2: [0, 0], 3: [0, 0] },
      1: { 0: [0, 0], 2: [0, 0], 3: [0, 0] },
      2: { 0: [0, 0], 1: [0, 0], 3: [0, 0] },
      3: { 0: [0, 0], 1: [0, 0], 2: [0, 0] },
    },
    currentPlayerIdx: 0,
    turnNumber: 1,
    startingLife: 40,
    phase: 'playing',
    turnTimerSeconds: 300,
    turnStartTime: 0,
    notes: '',
    firstPlayerIdx: 0,
    ...overrides,
  };
}

// ─── Critical: stale-state resistance ────────────────────────────────────────
// These tests directly model the race condition: the remote has stale state
// (turn=1, player=0) while the DB already has fresh state (turn=2, player=1).
// The transforms must preserve whatever turn/player they're given — meaning
// when remoteWrite() applies them to the fresh DB state, the host's turn
// advance is NOT overwritten.

describe('stale-state resistance — currentPlayerIdx and turnNumber are preserved', () => {
  const freshDBState = makeState({ currentPlayerIdx: 2, turnNumber: 5 });

  it('applyLifeChange preserves currentPlayerIdx and turnNumber from input state', () => {
    const result = applyLifeChange(freshDBState, 0, -1);
    expect(result.currentPlayerIdx).toBe(2);
    expect(result.turnNumber).toBe(5);
  });

  it('applyPoisonChange preserves currentPlayerIdx and turnNumber from input state', () => {
    const result = applyPoisonChange(freshDBState, 0, 1);
    expect(result.currentPlayerIdx).toBe(2);
    expect(result.turnNumber).toBe(5);
  });

  it('applyCommanderTaxChange preserves currentPlayerIdx and turnNumber', () => {
    const result = applyCommanderTaxChange(freshDBState, 0, 2);
    expect(result.currentPlayerIdx).toBe(2);
    expect(result.turnNumber).toBe(5);
  });

  it('applyEnergyChange preserves currentPlayerIdx and turnNumber', () => {
    const result = applyEnergyChange(freshDBState, 0, 1);
    expect(result.currentPlayerIdx).toBe(2);
    expect(result.turnNumber).toBe(5);
  });

  it('applyToggleMonarch preserves currentPlayerIdx and turnNumber', () => {
    const result = applyToggleMonarch(freshDBState, 0);
    expect(result.currentPlayerIdx).toBe(2);
    expect(result.turnNumber).toBe(5);
  });

  it('applyEliminate preserves currentPlayerIdx and turnNumber', () => {
    const result = applyEliminate(freshDBState, 1);
    expect(result.currentPlayerIdx).toBe(2);
    expect(result.turnNumber).toBe(5);
  });

  it('applyCommanderDamageChange preserves currentPlayerIdx and turnNumber', () => {
    const result = applyCommanderDamageChange(freshDBState, 0, 1, false, 5);
    expect(result.currentPlayerIdx).toBe(2);
    expect(result.turnNumber).toBe(5);
  });
});

// ─── applyLifeChange ──────────────────────────────────────────────────────────

describe('applyLifeChange', () => {
  it('reduces life by delta', () => {
    const state = makeState();
    const result = applyLifeChange(state, 0, -5);
    expect(result.players[0].life).toBe(35);
    expect(result.players[1].life).toBe(40); // other players unchanged
  });

  it('increases life by positive delta', () => {
    const state = makeState();
    const result = applyLifeChange(state, 1, 3);
    expect(result.players[1].life).toBe(43);
  });

  it('eliminates player when life drops to 0', () => {
    const state = makeState({ players: [makePlayer({ life: 1 }), makePlayer({ position: 'left' })] });
    const result = applyLifeChange(state, 0, -1);
    expect(result.players[0].isEliminated).toBe(true);
    expect(result.players[0].eliminatedTurn).toBe(1);
  });

  it('does not double-eliminate an already-eliminated player', () => {
    const state = makeState({
      players: [
        makePlayer({ life: 1, isEliminated: true, eliminatedTurn: 3 }),
        makePlayer({ position: 'left' }),
      ],
    });
    const result = applyLifeChange(state, 0, -1);
    expect(result.players[0].isEliminated).toBe(true);
    expect(result.players[0].eliminatedTurn).toBe(3); // unchanged
  });

  it('un-eliminates player when life goes above 0 (life kill undo)', () => {
    const state = makeState({
      players: [
        makePlayer({ life: 0, isEliminated: true, eliminatedTurn: 2 }),
        makePlayer({ position: 'left' }),
      ],
    });
    const result = applyLifeChange(state, 0, 1);
    expect(result.players[0].isEliminated).toBe(false);
    expect(result.players[0].eliminatedTurn).toBeNull();
  });

  it('does not un-eliminate a player who was killed by poison', () => {
    const state = makeState({
      players: [
        makePlayer({ life: 0, poison: 10, isEliminated: true, eliminatedTurn: 2 }),
        makePlayer({ position: 'left' }),
      ],
    });
    const result = applyLifeChange(state, 0, 1);
    // wasEliminatedByLife is false (poison >= 10), so still eliminated
    expect(result.players[0].isEliminated).toBe(true);
  });
});

// ─── applyPoisonChange ────────────────────────────────────────────────────────

describe('applyPoisonChange', () => {
  it('increases poison', () => {
    const state = makeState();
    const result = applyPoisonChange(state, 0, 3);
    expect(result.players[0].poison).toBe(3);
  });

  it('eliminates player at 10 poison', () => {
    const state = makeState({ players: [makePlayer({ poison: 9 }), makePlayer({ position: 'left' })] });
    const result = applyPoisonChange(state, 0, 1);
    expect(result.players[0].poison).toBe(10);
    expect(result.players[0].isEliminated).toBe(true);
    expect(result.players[0].eliminatedTurn).toBe(1);
  });

  it('does not go below 0', () => {
    const state = makeState();
    const result = applyPoisonChange(state, 0, -5);
    expect(result.players[0].poison).toBe(0);
  });

  it('un-eliminates player when poison drops below 10 (poison kill undo)', () => {
    const state = makeState({
      players: [
        makePlayer({ poison: 10, isEliminated: true, eliminatedTurn: 2 }),
        makePlayer({ position: 'left' }),
      ],
      notes: '[poisonkill:0] Alice was poisoned',
    });
    const result = applyPoisonChange(state, 0, -1);
    expect(result.players[0].isEliminated).toBe(false);
    expect(result.notes).not.toContain('[poisonkill:0]');
  });
});

// ─── applyCommanderTaxChange ─────────────────────────────────────────────────

describe('applyCommanderTaxChange', () => {
  it('increases commander tax', () => {
    const state = makeState();
    const result = applyCommanderTaxChange(state, 0, 2);
    expect(result.players[0].commanderTax).toBe(2);
  });

  it('does not go below 0', () => {
    const state = makeState();
    const result = applyCommanderTaxChange(state, 0, -5);
    expect(result.players[0].commanderTax).toBe(0);
  });
});

// ─── applyEnergyChange / applyExperienceChange ────────────────────────────────

describe('applyEnergyChange', () => {
  it('adds energy', () => {
    expect(applyEnergyChange(makeState(), 0, 3).players[0].energy).toBe(3);
  });
  it('clamps at 0', () => {
    expect(applyEnergyChange(makeState(), 0, -5).players[0].energy).toBe(0);
  });
});

describe('applyExperienceChange', () => {
  it('adds experience', () => {
    expect(applyExperienceChange(makeState(), 1, 5).players[1].experience).toBe(5);
  });
  it('clamps at 0', () => {
    expect(applyExperienceChange(makeState(), 1, -10).players[1].experience).toBe(0);
  });
});

// ─── applyToggleMonarch / Initiative / CitysBlessing ─────────────────────────

describe('applyToggleMonarch', () => {
  it('sets monarch on target and clears others', () => {
    const state = makeState({ players: [makePlayer({ isMonarch: true }), makePlayer({ position: 'left' })] });
    const result = applyToggleMonarch(state, 1);
    expect(result.players[0].isMonarch).toBe(false);
    expect(result.players[1].isMonarch).toBe(true);
  });

  it('toggles monarch off if already set on target', () => {
    const state = makeState({ players: [makePlayer({ isMonarch: true }), makePlayer({ position: 'left' })] });
    const result = applyToggleMonarch(state, 0);
    expect(result.players[0].isMonarch).toBe(false);
  });
});

describe('applyToggleInitiative', () => {
  it('sets initiative on target and clears others', () => {
    const state = makeState({ players: [makePlayer({ hasInitiative: true }), makePlayer({ position: 'left' })] });
    const result = applyToggleInitiative(state, 1);
    expect(result.players[0].hasInitiative).toBe(false);
    expect(result.players[1].hasInitiative).toBe(true);
  });
});

describe('applyToggleCitysBlessing', () => {
  it('toggles citys blessing independently', () => {
    const state = makeState();
    const r1 = applyToggleCitysBlessing(state, 0);
    expect(r1.players[0].hasCitysBlessing).toBe(true);
    expect(r1.players[1].hasCitysBlessing).toBe(false);
    const r2 = applyToggleCitysBlessing(r1, 0);
    expect(r2.players[0].hasCitysBlessing).toBe(false);
  });
});

// ─── applyEliminate / applyUndoEliminate ─────────────────────────────────────

describe('applyEliminate', () => {
  it('marks player as eliminated + conceded at current turn', () => {
    const state = makeState({ turnNumber: 4 });
    const result = applyEliminate(state, 1);
    expect(result.players[1].isEliminated).toBe(true);
    expect(result.players[1].isConceded).toBe(true);
    expect(result.players[1].eliminatedTurn).toBe(4);
  });

  it('does not affect other players', () => {
    const state = makeState();
    const result = applyEliminate(state, 1);
    expect(result.players[0].isEliminated).toBe(false);
  });
});

describe('applyUndoEliminate', () => {
  it('restores player to active', () => {
    const state = makeState({
      players: [
        makePlayer(),
        makePlayer({ position: 'left', isEliminated: true, isConceded: true, eliminatedTurn: 3 }),
      ],
    });
    const result = applyUndoEliminate(state, 1);
    expect(result.players[1].isEliminated).toBe(false);
    expect(result.players[1].isConceded).toBe(false);
    expect(result.players[1].eliminatedTurn).toBeNull();
  });
});

// ─── applyCommanderDamageChange ───────────────────────────────────────────────

describe('applyCommanderDamageChange', () => {
  it('records commander damage and reduces target life', () => {
    const state = makeState();
    const result = applyCommanderDamageChange(state, 0, 1, false, 5);
    expect(result.commanderDamage[0][1]).toEqual([5, 0]);
    expect(result.players[0].life).toBe(35); // 40 - 5
  });

  it('records partner commander damage in second slot', () => {
    const state = makeState();
    const result = applyCommanderDamageChange(state, 0, 1, true, 3);
    expect(result.commanderDamage[0][1]).toEqual([0, 3]);
    expect(result.players[0].life).toBe(37);
  });

  it('eliminates target at 21 total commander damage', () => {
    const state = makeState({
      commanderDamage: {
        0: { 1: [20, 0], 2: [0, 0], 3: [0, 0] },
        1: { 0: [0, 0], 2: [0, 0], 3: [0, 0] },
        2: { 0: [0, 0], 1: [0, 0], 3: [0, 0] },
        3: { 0: [0, 0], 1: [0, 0], 2: [0, 0] },
      },
    });
    const result = applyCommanderDamageChange(state, 0, 1, false, 1);
    expect(result.commanderDamage[0][1]).toEqual([21, 0]);
    expect(result.players[0].isEliminated).toBe(true);
    expect(result.players[0].eliminatedTurn).toBe(1);
  });

  it('does not go below 0 damage', () => {
    const state = makeState();
    const result = applyCommanderDamageChange(state, 0, 1, false, -5);
    expect(result.commanderDamage[0][1]).toEqual([0, 0]);
    expect(result.players[0].life).toBe(40); // no change
  });

  it('preserves currentPlayerIdx from input state', () => {
    const state = makeState({ currentPlayerIdx: 3, turnNumber: 7 });
    const result = applyCommanderDamageChange(state, 0, 1, false, 5);
    expect(result.currentPlayerIdx).toBe(3);
    expect(result.turnNumber).toBe(7);
  });
});

// ─── applyPassTurn ────────────────────────────────────────────────────────────

describe('applyPassTurn', () => {
  it('advances to the next player clockwise', () => {
    // bottom(0) → left(1) → top(2) → right(3) → bottom(0)
    const state = makeState({ currentPlayerIdx: 0, firstPlayerIdx: 0 });
    const result = applyPassTurn(state);
    expect(result.currentPlayerIdx).toBe(1); // left player
  });

  it('increments turnNumber when passing the first player', () => {
    // right(3) → bottom(0, firstPlayer) → turnNumber++
    const state = makeState({ currentPlayerIdx: 3, turnNumber: 1, firstPlayerIdx: 0 });
    const result = applyPassTurn(state);
    expect(result.currentPlayerIdx).toBe(0);
    expect(result.turnNumber).toBe(2);
  });

  it('does not increment turn when passing a non-first player', () => {
    const state = makeState({ currentPlayerIdx: 0, turnNumber: 2, firstPlayerIdx: 0 });
    const result = applyPassTurn(state);
    expect(result.turnNumber).toBe(2); // still 2
  });

  it('skips eliminated players', () => {
    const state = makeState({
      currentPlayerIdx: 0,
      firstPlayerIdx: 0,
      players: [
        makePlayer({ position: 'bottom' }),
        makePlayer({ position: 'left', isEliminated: true }),
        makePlayer({ position: 'top', playerName: 'Carol', playerId: 'player-carol' }),
        makePlayer({ position: 'right', playerName: 'Dave', playerId: 'player-dave' }),
      ],
    });
    const result = applyPassTurn(state);
    // left(1) is eliminated, should skip to top(2)
    expect(result.currentPlayerIdx).toBe(2);
  });

  it('preserves player life totals when advancing turn', () => {
    const state = makeState({
      currentPlayerIdx: 3,
      turnNumber: 1,
      firstPlayerIdx: 0,
      players: [
        makePlayer({ position: 'bottom', life: 38 }),
        makePlayer({ position: 'left',   life: 35 }),
        makePlayer({ position: 'top',    life: 40 }),
        makePlayer({ position: 'right',  life: 32 }),
      ],
    });
    const result = applyPassTurn(state);
    expect(result.players[0].life).toBe(38);
    expect(result.players[1].life).toBe(35);
    expect(result.players[3].life).toBe(32);
  });
});

// ─── applyCheckin ─────────────────────────────────────────────────────────────

describe('applyCheckin', () => {
  it('adds a seat timestamp to remoteCheckins', () => {
    const state = makeState();
    const result = applyCheckin(state, 'top', 12345);
    expect(result.remoteCheckins?.top).toBe(12345);
  });

  it('preserves existing checkins when adding a new one', () => {
    const state = makeState({ remoteCheckins: { bottom: 99 } });
    const result = applyCheckin(state, 'top', 12345);
    expect(result.remoteCheckins?.bottom).toBe(99);
    expect(result.remoteCheckins?.top).toBe(12345);
  });

  it('overwrites the timestamp for a seat that re-checks in', () => {
    const state = makeState({ remoteCheckins: { bottom: 100 } });
    const result = applyCheckin(state, 'bottom', 200);
    expect(result.remoteCheckins?.bottom).toBe(200);
  });
});

// ─── applyEvent ───────────────────────────────────────────────────────────────

describe('applyEvent', () => {
  const baseEvent: Omit<LiveGameEvent, 'type'> = { seat: 'top', ts: 0 };

  it('routes life_change to applyLifeChange', () => {
    const state = makeState();
    const result = applyEvent(state, { ...baseEvent, type: 'life_change', playerIdx: 0, delta: -3 });
    expect(result.players[0].life).toBe(37);
  });

  it('routes poison_change to applyPoisonChange', () => {
    const state = makeState();
    const result = applyEvent(state, { ...baseEvent, type: 'poison_change', playerIdx: 0, delta: 2 });
    expect(result.players[0].poison).toBe(2);
  });

  it('routes commander_tax_change to applyCommanderTaxChange', () => {
    const state = makeState();
    const result = applyEvent(state, { ...baseEvent, type: 'commander_tax_change', playerIdx: 0, delta: 2 });
    expect(result.players[0].commanderTax).toBe(2);
  });

  it('routes energy_change to applyEnergyChange', () => {
    const state = makeState();
    const result = applyEvent(state, { ...baseEvent, type: 'energy_change', playerIdx: 0, delta: 3 });
    expect(result.players[0].energy).toBe(3);
  });

  it('routes experience_change to applyExperienceChange', () => {
    const state = makeState();
    const result = applyEvent(state, { ...baseEvent, type: 'experience_change', playerIdx: 0, delta: 1 });
    expect(result.players[0].experience).toBe(1);
  });

  it('routes toggle_monarch to applyToggleMonarch', () => {
    const state = makeState();
    const result = applyEvent(state, { ...baseEvent, type: 'toggle_monarch', playerIdx: 0 });
    expect(result.players[0].isMonarch).toBe(true);
  });

  it('routes toggle_initiative to applyToggleInitiative', () => {
    const state = makeState();
    const result = applyEvent(state, { ...baseEvent, type: 'toggle_initiative', playerIdx: 0 });
    expect(result.players[0].hasInitiative).toBe(true);
  });

  it('routes toggle_citys_blessing to applyToggleCitysBlessing', () => {
    const state = makeState();
    const result = applyEvent(state, { ...baseEvent, type: 'toggle_citys_blessing', playerIdx: 0 });
    expect(result.players[0].hasCitysBlessing).toBe(true);
  });

  it('routes eliminate to applyEliminate', () => {
    const state = makeState();
    const result = applyEvent(state, { ...baseEvent, type: 'eliminate', playerIdx: 0 });
    expect(result.players[0].isEliminated).toBe(true);
  });

  it('routes undo_eliminate to applyUndoEliminate', () => {
    const state = makeState({ players: [makePlayer({ isEliminated: true, isConceded: true, eliminatedTurn: 1 })] });
    const result = applyEvent(state, { ...baseEvent, type: 'undo_eliminate', playerIdx: 0 });
    expect(result.players[0].isEliminated).toBe(false);
  });

  it('routes pass_turn to applyPassTurn', () => {
    const state = makeState({
      currentPlayerIdx: 0,
      turnNumber: 1,
      firstPlayerIdx: 0,
      players: [
        makePlayer({ position: 'bottom' }),
        makePlayer({ position: 'left' }),
      ],
    });
    const result = applyEvent(state, { ...baseEvent, type: 'pass_turn' });
    expect(result.currentPlayerIdx).toBe(1);
  });

  it('routes checkin to applyCheckin', () => {
    const state = makeState();
    const result = applyEvent(state, { type: 'checkin', seat: 'top', ts: 9999 });
    expect(result.remoteCheckins?.top).toBe(9999);
  });

  it('returns state unchanged for unknown event type', () => {
    const state = makeState();
    // Cast through unknown to bypass the now-strict union — simulates a
    // future/unknown event type arriving from the wire that didn't exist when
    // this client was deployed.
    const result = applyEvent(state, { type: 'unknown_future_event', seat: 'top', ts: 0 } as unknown as LiveGameEvent);
    expect(result).toBe(state);
  });

  // ── The core correctness guarantee ────────────────────────────────────────
  // Remote events must NEVER affect turn-control fields (currentPlayerIdx,
  // turnNumber, turnStartTime). These are host-owned. If a remote's event were
  // applied to a state with a stale turn number, the correct host turn number
  // must be preserved after the event is applied.

  it('life_change event preserves host turn fields', () => {
    const state = makeState({ currentPlayerIdx: 2, turnNumber: 7 });
    const result = applyEvent(state, { ...baseEvent, type: 'life_change', playerIdx: 0, delta: -1 });
    expect(result.currentPlayerIdx).toBe(2);
    expect(result.turnNumber).toBe(7);
  });

  it('multiple events applied in sequence stack correctly', () => {
    const state = makeState();
    const events: LiveGameEvent[] = [
      { ...baseEvent, type: 'life_change', playerIdx: 0, delta: -1 },
      { ...baseEvent, type: 'life_change', playerIdx: 0, delta: -1 },
      { ...baseEvent, type: 'life_change', playerIdx: 0, delta: -1 },
    ];
    const result = events.reduce(applyEvent, state);
    expect(result.players[0].life).toBe(37);
  });

  it('events from two different remotes do not conflict', () => {
    const state = makeState({
      players: [
        makePlayer({ position: 'bottom', life: 40 }),
        makePlayer({ position: 'top',    life: 40 }),
      ],
    });
    const events: LiveGameEvent[] = [
      { seat: 'bottom', ts: 1, type: 'life_change', playerIdx: 0, delta: -2 },
      { seat: 'top',    ts: 2, type: 'life_change', playerIdx: 1, delta: -3 },
    ];
    const result = events.reduce(applyEvent, state);
    expect(result.players[0].life).toBe(38); // bottom player's change
    expect(result.players[1].life).toBe(37); // top player's change
  });
});
