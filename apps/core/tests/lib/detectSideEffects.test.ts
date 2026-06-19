import { describe, it, expect } from 'vitest';
import { detectSideEffects } from '@/game-manager/detectSideEffects';
import {
  applyLifeChange,
  applyPoisonChange,
  applyCommanderDamageChange,
  applyToggleMonarch,
  applyEliminate,
} from '@/game-manager/remoteTransforms';
import type { GameManagerState, PlayerState } from '@/lib/types';

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

describe('detectSideEffects — life-kill prompt', () => {
  it('fires when a player drops from positive life to zero by direct life loss', () => {
    const prev = makeState();
    const next = applyLifeChange(prev, 1, -40); // Bob: 40 → 0
    const fx = detectSideEffects(prev, next);
    expect(fx).toContainEqual({ type: 'lifeKillPrompt', targetIdx: 1 });
  });

  it('fires when life crosses below zero (e.g. damage exceeds remaining life)', () => {
    const prev = makeState();
    const next = applyLifeChange(prev, 2, -100); // Carol: 40 → -60
    const fx = detectSideEffects(prev, next);
    expect(fx).toContainEqual({ type: 'lifeKillPrompt', targetIdx: 2 });
  });

  it('does NOT fire when commander damage caused the life drop (attribution implicit)', () => {
    const prev = makeState();
    // 40 damage from Alice's commander to Bob — kills Bob via life loss
    const next = applyCommanderDamageChange(prev, 1, 0, false, 40);
    const fx = detectSideEffects(prev, next);
    expect(fx.find((e) => e.type === 'lifeKillPrompt')).toBeUndefined();
  });

  it('does NOT fire when life starts at zero or below (no fresh kill)', () => {
    const prev = makeState({
      players: [
        makePlayer({ position: 'bottom', playerName: 'Alice', life: 0, isEliminated: true }),
        makePlayer({ position: 'top', playerName: 'Carol' }),
      ],
    });
    const next = applyLifeChange(prev, 0, -5); // 0 → -5: was already at 0
    const fx = detectSideEffects(prev, next);
    expect(fx.find((e) => e.type === 'lifeKillPrompt')).toBeUndefined();
  });
});

describe('detectSideEffects — poison-kill prompt', () => {
  it('fires when poison crosses from <10 to >=10', () => {
    const prev = makeState({
      players: [
        makePlayer({ position: 'bottom', playerName: 'Alice', poison: 8 }),
        makePlayer({ position: 'top', playerName: 'Carol' }),
      ],
    });
    const next = applyPoisonChange(prev, 0, 2); // 8 → 10
    const fx = detectSideEffects(prev, next);
    const poisonFx = fx.find((e) => e.type === 'poisonKillPrompt');
    expect(poisonFx).toBeDefined();
    expect(poisonFx).toMatchObject({ type: 'poisonKillPrompt', targetIdx: 0 });
  });

  it('does NOT fire when poison stays below 10', () => {
    const prev = makeState();
    const next = applyPoisonChange(prev, 0, 3);
    const fx = detectSideEffects(prev, next);
    expect(fx.find((e) => e.type === 'poisonKillPrompt')).toBeUndefined();
  });

  it('does NOT fire when player was already eliminated by poison', () => {
    const prev = makeState({
      players: [
        makePlayer({ position: 'bottom', poison: 10, isEliminated: true }),
        makePlayer({ position: 'top' }),
      ],
    });
    const next = applyPoisonChange(prev, 0, 1); // 10 → 11
    const fx = detectSideEffects(prev, next);
    expect(fx.find((e) => e.type === 'poisonKillPrompt')).toBeUndefined();
  });
});

describe('detectSideEffects — monarch transfer', () => {
  it('fires when monarch is granted to a new player', () => {
    const prev = makeState();
    const next = applyToggleMonarch(prev, 2);
    const fx = detectSideEffects(prev, next);
    expect(fx).toContainEqual({ type: 'monarchTransfer', fromPos: null, toPos: 'top' });
  });

  it('fires when monarch moves between players', () => {
    const prev = makeState({
      players: [
        makePlayer({ position: 'bottom', isMonarch: true }),
        makePlayer({ position: 'left' }),
        makePlayer({ position: 'top' }),
        makePlayer({ position: 'right' }),
      ],
    });
    const next = applyToggleMonarch(prev, 2);
    const fx = detectSideEffects(prev, next);
    expect(fx).toContainEqual({ type: 'monarchTransfer', fromPos: 'bottom', toPos: 'top' });
  });

  it('fires when monarch is removed (toggled off)', () => {
    const prev = makeState({
      players: [
        makePlayer({ position: 'bottom', isMonarch: true }),
        makePlayer({ position: 'top' }),
      ],
    });
    const next = applyToggleMonarch(prev, 0);
    const fx = detectSideEffects(prev, next);
    expect(fx).toContainEqual({ type: 'monarchTransfer', fromPos: 'bottom', toPos: null });
  });

  it('does NOT fire when monarch is unchanged', () => {
    const prev = makeState();
    const next = applyLifeChange(prev, 0, -1);
    const fx = detectSideEffects(prev, next);
    expect(fx.find((e) => e.type === 'monarchTransfer')).toBeUndefined();
  });
});

describe('detectSideEffects — no spurious effects', () => {
  it('returns empty for an identity transition', () => {
    const prev = makeState();
    expect(detectSideEffects(prev, prev)).toEqual([]);
  });

  it('returns empty for unrelated state changes', () => {
    const prev = makeState();
    const next = { ...prev, turnNumber: 2, currentPlayerIdx: 1, turnStartTime: 1000 };
    expect(detectSideEffects(prev, next)).toEqual([]);
  });

  it('concede (eliminate) by itself does not fire life/poison prompts', () => {
    const prev = makeState();
    const next = applyEliminate(prev, 1);
    const fx = detectSideEffects(prev, next);
    expect(fx.find((e) => e.type === 'lifeKillPrompt')).toBeUndefined();
    expect(fx.find((e) => e.type === 'poisonKillPrompt')).toBeUndefined();
  });
});
