import { describe, it, expect } from 'vitest';
import { diffGameEvents, buildGameStartedEvent } from '@/game-manager/gameLog';
import type { GameManagerState, PlayerState } from '@/game-manager/types';

function player(name: string, overrides: Partial<PlayerState> = {}): PlayerState {
  return {
    playerId: `id-${name}`,
    deckId: `deck-${name}`,
    playerName: name,
    deckName: `${name}'s deck`,
    commander: { name: `${name} Commander` },
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
    teamNumber: null,
    ...overrides,
  };
}

function baseState(players: PlayerState[], overrides: Partial<GameManagerState> = {}): GameManagerState {
  const commanderDamage: GameManagerState['commanderDamage'] = {};
  for (let t = 0; t < players.length; t++) {
    commanderDamage[t] = {};
    for (let s = 0; s < players.length; s++) if (s !== t) commanderDamage[t][s] = [0, 0];
  }
  return {
    players,
    commanderDamage,
    currentPlayerIdx: 0,
    turnNumber: 1,
    startingLife: 40,
    phase: 'playing',
    turnTimerSeconds: 300,
    turnStartTime: 0,
    notes: '',
    ...overrides,
  };
}

const FOUR = () => [
  player('Rick', { position: 'bottom' }),
  player('Sam', { position: 'left' }),
  player('Amy', { position: 'top' }),
  player('Jo', { position: 'right' }),
];

describe('diffGameEvents', () => {
  it('emits nothing when nothing meaningful changes', () => {
    const s = baseState(FOUR(), { firstPlayerIdx: 0 });
    expect(diffGameEvents(s, s)).toEqual([]);
  });

  it('emits turn_order with clockwise order when a first player is chosen', () => {
    const prev = baseState(FOUR());
    const next = baseState(FOUR(), { firstPlayerIdx: 2, currentPlayerIdx: 2 });
    const events = diffGameEvents(prev, next);
    const turnOrder = events.find((e) => e.type === 'turn_order');
    expect(turnOrder).toBeTruthy();
    // First player Amy (idx 2), then clockwise Jo, Rick, Sam.
    expect(turnOrder?.payload).toMatchObject({
      firstPlayer: 'Amy',
      order: ['Amy', 'Jo', 'Rick', 'Sam'],
    });
  });

  it('emits pass_turn when the active player advances', () => {
    const prev = baseState(FOUR(), { firstPlayerIdx: 0, currentPlayerIdx: 0 });
    const next = baseState(FOUR(), { firstPlayerIdx: 0, currentPlayerIdx: 1, turnNumber: 1 });
    const pass = diffGameEvents(prev, next).find((e) => e.type === 'pass_turn');
    expect(pass?.payload).toMatchObject({ to: 'Sam', turn: 1 });
  });

  it('logs a backwards turn step as turn_revert when reverse is set', () => {
    const prev = baseState(FOUR(), { firstPlayerIdx: 0, currentPlayerIdx: 2 });
    const next = baseState(FOUR(), { firstPlayerIdx: 0, currentPlayerIdx: 1 });
    expect(diffGameEvents(prev, next).some((e) => e.type === 'pass_turn')).toBe(true);
    const rev = diffGameEvents(prev, next, { reverse: true });
    expect(rev.some((e) => e.type === 'pass_turn')).toBe(false);
    expect(rev.find((e) => e.type === 'turn_revert')?.payload).toMatchObject({ to: 'Sam', turn: 1 });
  });

  it('does not emit pass_turn before a first player is set', () => {
    const prev = baseState(FOUR());
    const next = baseState(FOUR(), { currentPlayerIdx: 1 });
    expect(diffGameEvents(prev, next).some((e) => e.type === 'pass_turn')).toBe(false);
  });

  it('emits life, poison, eliminate, monarch, energy changes with the right player', () => {
    const prev = baseState(FOUR(), { firstPlayerIdx: 0 });
    const nextPlayers = FOUR();
    nextPlayers[1] = player('Sam', { position: 'left', life: 34, poison: 3, isMonarch: true, energy: 2 });
    nextPlayers[2] = player('Amy', { position: 'top', isEliminated: true });
    const next = baseState(nextPlayers, { firstPlayerIdx: 0, turnNumber: 5 });
    const events = diffGameEvents(prev, next);
    const byType = (t: string) => events.find((e) => e.type === t)?.payload;
    expect(byType('life_change')).toMatchObject({ player: 'Sam', from: 40, to: 34, delta: -6 });
    expect(byType('poison_change')).toMatchObject({ player: 'Sam', from: 0, to: 3 });
    expect(byType('monarch')).toMatchObject({ player: 'Sam', value: true });
    expect(byType('energy_change')).toMatchObject({ player: 'Sam', to: 2 });
    expect(byType('eliminate')).toMatchObject({ player: 'Amy', turn: 5 });
  });

  it('emits commander_damage when a source deals damage to a target', () => {
    const prev = baseState(FOUR(), { firstPlayerIdx: 0 });
    const next = baseState(FOUR(), { firstPlayerIdx: 0 });
    // Rick (source 0) deals 7 commander damage to Sam (target 1).
    next.commanderDamage[1][0] = [7, 0];
    const cmd = diffGameEvents(prev, next).find((e) => e.type === 'commander_damage');
    expect(cmd?.payload).toMatchObject({ source: 'Rick', target: 'Sam', from: 0, to: 7 });
  });
});

describe('diffGameEvents elimination attribution', () => {
  function eliminatedNext(targetIdx: number, notes: string, conceded = false) {
    const players = FOUR();
    players[targetIdx] = {
      ...players[targetIdx],
      isEliminated: true,
      isConceded: conceded,
    };
    return baseState(players, { firstPlayerIdx: 0, turnNumber: 6, notes });
  }

  it('attributes a commander-damage kill to its source (same-commit cmdkill tag)', () => {
    const prev = baseState(FOUR(), { firstPlayerIdx: 0 });
    // Amy (idx 2) killed by Rick (idx 0) via commander damage.
    const next = eliminatedNext(2, '[cmdkill:2:0] Amy eliminated by commander damage (turn 6)');
    const evt = diffGameEvents(prev, next).find((e) => e.type === 'eliminate');
    expect(evt?.payload).toMatchObject({ player: 'Amy', cause: 'commander_damage', source: 'Rick', turn: 6 });
  });

  it('attributes a life-to-0 kill with source when the tag carries it', () => {
    const prev = baseState(FOUR(), { firstPlayerIdx: 0 });
    const next = eliminatedNext(1, '[lifekill:1:3] Sam brought to 0 life (turn 6)');
    const evt = diffGameEvents(prev, next).find((e) => e.type === 'eliminate');
    expect(evt?.payload).toMatchObject({ player: 'Sam', cause: 'life', source: 'Jo' });
  });

  it('records poison cause with no source when the tag has none', () => {
    const prev = baseState(FOUR(), { firstPlayerIdx: 0 });
    const next = eliminatedNext(0, '[poisonkill:0] Rick eliminated by poison (turn 6)');
    const evt = diffGameEvents(prev, next).find((e) => e.type === 'eliminate');
    expect(evt?.payload).toMatchObject({ player: 'Rick', cause: 'poison' });
    expect(evt?.payload).not.toHaveProperty('source');
  });

  it('marks a concede as cause=concede regardless of notes', () => {
    const prev = baseState(FOUR(), { firstPlayerIdx: 0 });
    const next = eliminatedNext(3, 'Jo conceded (turn 6)', true);
    const evt = diffGameEvents(prev, next).find((e) => e.type === 'eliminate');
    expect(evt?.payload).toMatchObject({ player: 'Jo', cause: 'concede' });
  });

  it('does not emit a standalone concede when the concede also eliminates', () => {
    const prev = baseState(FOUR(), { firstPlayerIdx: 0 });
    const next = eliminatedNext(3, 'Jo conceded (turn 6)', true);
    const events = diffGameEvents(prev, next);
    expect(events.filter((e) => e.type === 'concede')).toHaveLength(0);
  });

  it('infers poison cause from state when no kill tag is present yet', () => {
    const prev = baseState(FOUR(), { firstPlayerIdx: 0 });
    const players = FOUR();
    players[1] = { ...players[1], isEliminated: true, poison: 10 };
    const next = baseState(players, { firstPlayerIdx: 0, turnNumber: 6, notes: '' });
    const evt = diffGameEvents(prev, next).find((e) => e.type === 'eliminate');
    expect(evt?.payload).toMatchObject({ player: 'Sam', cause: 'poison' });
    expect(evt?.payload).not.toHaveProperty('source');
  });

  it('infers life cause from state when brought to 0 with no tag', () => {
    const prev = baseState(FOUR(), { firstPlayerIdx: 0 });
    const players = FOUR();
    players[2] = { ...players[2], isEliminated: true, life: 0 };
    const next = baseState(players, { firstPlayerIdx: 0, turnNumber: 8, notes: '' });
    const evt = diffGameEvents(prev, next).find((e) => e.type === 'eliminate');
    expect(evt?.payload).toMatchObject({ player: 'Amy', cause: 'life' });
  });
});

describe('buildGameStartedEvent', () => {
  it('captures players, seats, decks, and game type', () => {
    const state = baseState(FOUR(), { gameType: 'standard', startingLife: 40 });
    const evt = buildGameStartedEvent(state);
    expect(evt.type).toBe('game_started');
    expect(evt.payload).toMatchObject({ gameType: 'standard', startingLife: 40 });
    const players = (evt.payload as { players: Array<{ name: string; seat: number }> }).players;
    expect(players).toHaveLength(4);
    expect(players[0]).toMatchObject({ seat: 0, name: 'Rick', position: 'bottom' });
  });
});
