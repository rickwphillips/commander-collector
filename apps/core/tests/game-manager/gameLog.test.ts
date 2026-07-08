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
    partnerCommanderTax: 0,
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

// 2HG: team 1 = Rick + Sam, team 2 = Amy + Jo. reconcileTeams mirrors shared
// life/poison across teammates, so in a real diff both team members move together.
const TEAMS = () => [
  player('Rick', { position: 'bottom', teamNumber: 1 }),
  player('Sam', { position: 'left', teamNumber: 1 }),
  player('Amy', { position: 'top', teamNumber: 2 }),
  player('Jo', { position: 'right', teamNumber: 2 }),
];
const twoHG = (players: PlayerState[], overrides: Partial<GameManagerState> = {}) =>
  baseState(players, { gameType: '2hg', ...overrides });

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

describe('diffGameEvents 2HG team labels', () => {
  it('turn_order lists the two teams, using the editable team name with a Team N fallback', () => {
    const prev = twoHG(TEAMS());
    const next = twoHG(TEAMS(), { firstPlayerIdx: 0, currentPlayerIdx: 0, teamNames: { 1: 'The Berries' } });
    const to = diffGameEvents(prev, next).find((e) => e.type === 'turn_order')?.payload;
    expect(to).toMatchObject({
      firstPlayer: 'The Berries (Rick / Sam)',
      order: ['The Berries (Rick / Sam)', 'Team 2 (Amy / Jo)'],
    });
  });

  it('pass_turn and turn_revert name the whole team', () => {
    const prev = twoHG(TEAMS(), { firstPlayerIdx: 0, currentPlayerIdx: 0 });
    const next = twoHG(TEAMS(), { firstPlayerIdx: 0, currentPlayerIdx: 2 });
    expect(diffGameEvents(prev, next).find((e) => e.type === 'pass_turn')?.payload)
      .toMatchObject({ to: 'Team 2 (Amy / Jo)', turn: 1 });
    expect(diffGameEvents(prev, next, { reverse: true }).find((e) => e.type === 'turn_revert')?.payload)
      .toMatchObject({ to: 'Team 2 (Amy / Jo)' });
  });

  it('collapses mirrored shared life/poison to a single team-labelled entry', () => {
    const prev = twoHG(TEAMS(), { firstPlayerIdx: 0 });
    const nextPlayers = TEAMS();
    nextPlayers[0] = { ...nextPlayers[0], life: 34, poison: 2 };
    nextPlayers[1] = { ...nextPlayers[1], life: 34, poison: 2 };
    const events = diffGameEvents(prev, twoHG(nextPlayers, { firstPlayerIdx: 0 }));
    const life = events.filter((e) => e.type === 'life_change');
    const poison = events.filter((e) => e.type === 'poison_change');
    expect(life).toHaveLength(1);
    expect(life[0].payload).toMatchObject({ player: 'Team 1 (Rick / Sam)', from: 40, to: 34, delta: -6 });
    expect(poison).toHaveLength(1);
    expect(poison[0].payload).toMatchObject({ player: 'Team 1 (Rick / Sam)', from: 0, to: 2 });
  });

  it('collapses a joint elimination to one team entry and team-labels the source', () => {
    const prev = twoHG(TEAMS(), { firstPlayerIdx: 0 });
    const nextPlayers = TEAMS();
    nextPlayers[2] = { ...nextPlayers[2], isEliminated: true };
    nextPlayers[3] = { ...nextPlayers[3], isEliminated: true };
    // cmdkill tag targets seat 2 (Amy), dealt by seat 0 (Rick, team 1).
    const next = twoHG(nextPlayers, { firstPlayerIdx: 0, turnNumber: 7, notes: '[cmdkill:2:0]' });
    const elim = diffGameEvents(prev, next).filter((e) => e.type === 'eliminate');
    expect(elim).toHaveLength(1);
    expect(elim[0].payload).toMatchObject({
      player: 'Team 2 (Amy / Jo)',
      cause: 'commander_damage',
      source: 'Team 1 (Rick / Sam)',
      turn: 7,
    });
  });

  it('gathers joint-elimination attribution from whichever teammate carries the kill tag', () => {
    const prev = twoHG(TEAMS(), { firstPlayerIdx: 0 });
    const nextPlayers = TEAMS();
    nextPlayers[2] = { ...nextPlayers[2], isEliminated: true };
    nextPlayers[3] = { ...nextPlayers[3], isEliminated: true };
    // Tag sits on seat 3 (Jo), the SECOND teammate processed. The dedup emits at
    // seat 2 (Amy), so attribution must still be found on seat 3.
    const next = twoHG(nextPlayers, { firstPlayerIdx: 0, turnNumber: 9, notes: '[cmdkill:3:0]' });
    const elim = diffGameEvents(prev, next).filter((e) => e.type === 'eliminate');
    expect(elim).toHaveLength(1);
    expect(elim[0].payload).toMatchObject({
      player: 'Team 2 (Amy / Jo)',
      cause: 'commander_damage',
      source: 'Team 1 (Rick / Sam)',
      turn: 9,
    });
  });

  it('keeps per-player counters (monarch, energy) individual in 2HG', () => {
    const prev = twoHG(TEAMS(), { firstPlayerIdx: 0 });
    const nextPlayers = TEAMS();
    nextPlayers[2] = { ...nextPlayers[2], isMonarch: true, energy: 3 };
    const events = diffGameEvents(prev, twoHG(nextPlayers, { firstPlayerIdx: 0 }));
    expect(events.find((e) => e.type === 'monarch')?.payload).toMatchObject({ player: 'Amy', value: true });
    expect(events.find((e) => e.type === 'energy_change')?.payload).toMatchObject({ player: 'Amy', to: 3 });
  });

  it('falls back to "Team N" when the team name is blank or unset', () => {
    const prev = twoHG(TEAMS(), { firstPlayerIdx: 0 });
    const nextPlayers = TEAMS();
    nextPlayers[0] = { ...nextPlayers[0], life: 38 };
    nextPlayers[1] = { ...nextPlayers[1], life: 38 };
    const next = twoHG(nextPlayers, { firstPlayerIdx: 0, teamNames: { 1: '   ' } });
    expect(diffGameEvents(prev, next).find((e) => e.type === 'life_change')?.payload)
      .toMatchObject({ player: 'Team 1 (Rick / Sam)' });
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
