/**
 * Shared fixtures for the native game manager (apps/ios/CommanderGameKit).
 *
 * The Swift package ports remoteTransforms.ts and gameLog.ts. To prove both
 * implementations agree, this file builds the scenarios the vitest suites cover,
 * runs them through the TypeScript implementation, and compares the result with
 * the JSON committed under apps/ios/CommanderGameKit/Tests/CommanderGameKitTests/
 * Fixtures. The Swift tests load the same JSON and must reproduce `expected`.
 *
 * When the TypeScript behaviour changes on purpose, regenerate the JSON:
 *   UPDATE_IOS_FIXTURES=1 npx vitest run tests/game-manager/ios-fixtures.test.ts
 * and the Swift side will fail until it is ported too — that is the point.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { applyEvent } from '@/game-manager/remoteTransforms';
import { diffGameEvents, buildGameStartedEvent } from '@/game-manager/gameLog';
import type { GameManagerState, PlayerState, LiveGameEvent, GameLogEvent, DistributiveOmit } from '@/lib/types';

const FIXTURE_DIR = path.resolve(
  __dirname,
  '../../../ios/CommanderGameKit/Tests/CommanderGameKitTests/Fixtures',
);

// ─── Builders (same defaults as remoteTransforms.test.ts / gameLog.test.ts) ──

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

function zeroDamage(n: number): GameManagerState['commanderDamage'] {
  const cd: GameManagerState['commanderDamage'] = {};
  for (let t = 0; t < n; t++) {
    cd[t] = {};
    for (let s = 0; s < n; s++) if (s !== t) cd[t][s] = [0, 0];
  }
  return cd;
}

function state(players: PlayerState[], overrides: Partial<GameManagerState> = {}): GameManagerState {
  return {
    players,
    commanderDamage: zeroDamage(players.length),
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

const FOUR = (o: Partial<PlayerState>[] = []) => [
  player('Alice', { position: 'bottom', ...o[0] }),
  player('Bob',   { position: 'left',   ...o[1] }),
  player('Carol', { position: 'top',    ...o[2] }),
  player('Dave',  { position: 'right',  ...o[3] }),
];
const TEAMS = (o: Partial<PlayerState>[] = []) => [
  player('Alice', { position: 'bottom', teamNumber: 1, life: 30, ...o[0] }),
  player('Bob',   { position: 'left',   teamNumber: 1, life: 30, ...o[1] }),
  player('Carol', { position: 'top',    teamNumber: 2, life: 30, ...o[2] }),
  player('Dave',  { position: 'right',  teamNumber: 2, life: 30, ...o[3] }),
];
const twoHG = (players: PlayerState[], o: Partial<GameManagerState> = {}) =>
  state(players, { gameType: '2hg', startingLife: 30, ...o });

const ev = (e: DistributiveOmit<LiveGameEvent, 'seat' | 'ts'>, seat = 'bottom', ts = 1): LiveGameEvent =>
  ({ seat, ts, ...e }) as LiveGameEvent;

// ─── Scenarios ────────────────────────────────────────────────────────────────

interface TransformScenario { name: string; initial: GameManagerState; events: LiveGameEvent[]; expected: GameManagerState }
interface DiffScenario { name: string; prev: GameManagerState; next: GameManagerState; reverse: boolean; expected: GameLogEvent[] }
interface StartScenario { name: string; state: GameManagerState; expected: GameLogEvent }

function transform(name: string, initial: GameManagerState, events: LiveGameEvent[]): TransformScenario {
  const folded = events.reduce(applyEvent, initial);
  // applyPassTurn / applyPrevTurn stamp Date.now(); the Swift fold runs with now = 0.
  const expected = { ...folded, turnStartTime: 0 };
  return { name, initial, events, expected };
}

const cd21 = (() => { const cd = zeroDamage(4); cd[0][1] = [21, 0]; return cd; })();
const cd21x2 = (() => { const cd = zeroDamage(4); cd[0][1] = [21, 0]; cd[0][2] = [21, 0]; return cd; })();
const cd20 = (() => { const cd = zeroDamage(4); cd[0][1] = [20, 0]; return cd; })();

function buildTransforms(): TransformScenario[] {
  return [
    transform('life: reduce by delta', state(FOUR()), [ev({ type: 'life_change', playerIdx: 0, delta: -5 })]),
    transform('life: increase by positive delta', state(FOUR()), [ev({ type: 'life_change', playerIdx: 1, delta: 3 })]),
    transform('life: eliminates at 0', state(FOUR([{ life: 1 }])), [ev({ type: 'life_change', playerIdx: 0, delta: -1 })]),
    transform('life: no double elimination', state(FOUR([{ life: 1, isEliminated: true, eliminatedTurn: 3 }])), [ev({ type: 'life_change', playerIdx: 0, delta: -1 })]),
    transform('life: revive when restored above 0', state(FOUR([{ life: 0, isEliminated: true, eliminatedTurn: 2 }]), { notes: '[lifekill:0] Alice brought to 0 life (turn 2)' }), [ev({ type: 'life_change', playerIdx: 0, delta: 1 })]),
    transform('life: no revive while poisoned', state(FOUR([{ life: 0, poison: 10, isEliminated: true, eliminatedTurn: 2 }])), [ev({ type: 'life_change', playerIdx: 0, delta: 1 })]),
    transform('life: preserves host turn fields', state(FOUR(), { currentPlayerIdx: 2, turnNumber: 7 }), [ev({ type: 'life_change', playerIdx: 0, delta: -1 })]),
    transform('life: three decrements stack', state(FOUR()), [1, 2, 3].map((ts) => ev({ type: 'life_change', playerIdx: 0, delta: -1 }, 'bottom', ts))),
    transform('life: two seats do not conflict', state(FOUR()), [
      ev({ type: 'life_change', playerIdx: 0, delta: -2 }, 'bottom', 1),
      ev({ type: 'life_change', playerIdx: 2, delta: -3 }, 'top', 2),
    ]),

    transform('poison: increases', state(FOUR()), [ev({ type: 'poison_change', playerIdx: 0, delta: 3 })]),
    transform('poison: eliminates at 10', state(FOUR([{ poison: 9 }])), [ev({ type: 'poison_change', playerIdx: 0, delta: 1 })]),
    transform('poison: clamps at 0', state(FOUR()), [ev({ type: 'poison_change', playerIdx: 0, delta: -5 })]),
    transform('poison: revive below 10 strips tag', state(FOUR([{ poison: 10, isEliminated: true, eliminatedTurn: 2 }]), { notes: '[poisonkill:0] Alice was poisoned' }), [ev({ type: 'poison_change', playerIdx: 0, delta: -1 })]),
    transform('poison: no revive while life is 0', state(FOUR([{ life: 0, poison: 10, isEliminated: true, eliminatedTurn: 2 }])), [ev({ type: 'poison_change', playerIdx: 0, delta: -1 })]),

    transform('tax: increases', state(FOUR()), [ev({ type: 'commander_tax_change', playerIdx: 0, delta: 2 })]),
    transform('tax: clamps at 0', state(FOUR()), [ev({ type: 'commander_tax_change', playerIdx: 0, delta: -5 })]),
    transform('tax: partner independent', state(FOUR()), [
      ev({ type: 'commander_tax_change', playerIdx: 0, delta: 2, isPartner: false }),
      ev({ type: 'commander_tax_change', playerIdx: 0, delta: 5, isPartner: true }),
      ev({ type: 'commander_tax_change', playerIdx: 1, delta: -5, isPartner: true }),
    ]),

    transform('energy: adds and clamps', state(FOUR()), [
      ev({ type: 'energy_change', playerIdx: 0, delta: 3 }),
      ev({ type: 'energy_change', playerIdx: 1, delta: -5 }),
    ]),
    transform('experience: adds and clamps', state(FOUR()), [
      ev({ type: 'experience_change', playerIdx: 1, delta: 5 }),
      ev({ type: 'experience_change', playerIdx: 2, delta: -10 }),
    ]),

    transform('monarch: exclusive, moves between seats', state(FOUR([{ isMonarch: true }])), [ev({ type: 'toggle_monarch', playerIdx: 1 })]),
    transform('monarch: toggles off', state(FOUR([{ isMonarch: true }])), [ev({ type: 'toggle_monarch', playerIdx: 0 })]),
    transform('initiative: exclusive', state(FOUR([{ hasInitiative: true }])), [ev({ type: 'toggle_initiative', playerIdx: 1 })]),
    transform('citys blessing: independent toggle on then off', state(FOUR()), [
      ev({ type: 'toggle_citys_blessing', playerIdx: 0 }),
      ev({ type: 'toggle_citys_blessing', playerIdx: 1 }),
      ev({ type: 'toggle_citys_blessing', playerIdx: 0 }),
    ]),

    transform('concede: eliminated + conceded at turn 4', state(FOUR(), { turnNumber: 4 }), [ev({ type: 'eliminate', playerIdx: 1 })]),
    transform('concede: note appends to existing notes', state(FOUR(), { notes: 'first line' }), [ev({ type: 'eliminate', playerIdx: 1 })]),
    transform('undo eliminate: restores', state(FOUR([{}, { isEliminated: true, isConceded: true, eliminatedTurn: 3 }])), [ev({ type: 'undo_eliminate', playerIdx: 1 })]),

    transform('cmd damage: records and reduces life', state(FOUR()), [ev({ type: 'commander_damage_change', targetIdx: 0, sourceIdx: 1, isPartner: false, delta: 5 })]),
    transform('cmd damage: partner slot', state(FOUR()), [ev({ type: 'commander_damage_change', targetIdx: 0, sourceIdx: 1, isPartner: true, delta: 3 })]),
    transform('cmd damage: 21 eliminates with cmdkill note', state(FOUR(), { commanderDamage: cd20 }), [ev({ type: 'commander_damage_change', targetIdx: 0, sourceIdx: 1, isPartner: false, delta: 1 })]),
    transform('cmd damage: partner deck label in note', state(FOUR([{}, { partner: { name: 'Bob Partner' } }]), { commanderDamage: cd20 }), [ev({ type: 'commander_damage_change', targetIdx: 0, sourceIdx: 1, isPartner: false, delta: 1 })]),
    transform('cmd damage: life-to-0 kill note with source', state(FOUR([{ life: 3 }])), [ev({ type: 'commander_damage_change', targetIdx: 0, sourceIdx: 2, isPartner: false, delta: 3 })]),
    transform('cmd damage: clamps at 0', state(FOUR()), [ev({ type: 'commander_damage_change', targetIdx: 0, sourceIdx: 1, isPartner: false, delta: -5 })]),
    transform('cmd damage: undo 21 revives and strips note', state(FOUR([{ life: 19, isEliminated: true, eliminatedTurn: 2 }]), { commanderDamage: cd21, notes: 'x\n[cmdkill:0:1] Alice eliminated by Bob Commander (Bob) commander damage (turn 2)' }), [ev({ type: 'commander_damage_change', targetIdx: 0, sourceIdx: 1, isPartner: false, delta: -1 })]),
    transform('cmd damage: undo one of two 21s does not revive', state(FOUR([{ life: 30, isEliminated: true, eliminatedTurn: 2 }]), { commanderDamage: cd21x2 }), [ev({ type: 'commander_damage_change', targetIdx: 0, sourceIdx: 1, isPartner: false, delta: -1 })]),
    transform('cmd damage: undo life kill strips lifekill tag', state(FOUR([{ life: 0, isEliminated: true, eliminatedTurn: 2 }]), { commanderDamage: (() => { const cd = zeroDamage(4); cd[0][1] = [5, 0]; return cd; })(), notes: '[lifekill:0:1] Alice brought to 0 life by Bob Commander (Bob) (turn 2)' }), [ev({ type: 'commander_damage_change', targetIdx: 0, sourceIdx: 1, isPartner: false, delta: -2 })]),

    transform('cross-cause: life restore does not revive on 21', state(FOUR([{ life: 0, isEliminated: true, eliminatedTurn: 2 }]), { commanderDamage: cd21 }), [ev({ type: 'life_change', playerIdx: 0, delta: 5 })]),
    transform('cross-cause: revive when last cause clears', state(FOUR([{ life: 0, isEliminated: true, eliminatedTurn: 2 }])), [ev({ type: 'life_change', playerIdx: 0, delta: 5 })]),
    transform('cross-cause: conceded never revives by stat', state(FOUR([{ life: 0, isConceded: true, isEliminated: true, eliminatedTurn: 2 }])), [ev({ type: 'life_change', playerIdx: 0, delta: 5 })]),

    transform('kill attr: life with source', state(FOUR([{ life: 0, isEliminated: true, eliminatedTurn: 2 }])), [ev({ type: 'life_kill_attr', playerIdx: 0, sourcePlayerIdx: 2 })]),
    transform('kill attr: life without source', state(FOUR(), { notes: 'existing' }), [ev({ type: 'life_kill_attr', playerIdx: 1, sourcePlayerIdx: null })]),
    transform('kill attr: poison with and without source', state(FOUR()), [
      ev({ type: 'poison_kill_attr', playerIdx: 0, sourcePlayerIdx: 3 }),
      ev({ type: 'poison_kill_attr', playerIdx: 1, sourcePlayerIdx: null }),
    ]),

    transform('turn: clockwise next', state(FOUR()), [ev({ type: 'pass_turn' })]),
    transform('turn: increments passing first player', state(FOUR(), { currentPlayerIdx: 3 }), [ev({ type: 'pass_turn' })]),
    transform('turn: no increment mid-round', state(FOUR(), { turnNumber: 2 }), [ev({ type: 'pass_turn' })]),
    transform('turn: skips eliminated', state(FOUR([{}, { isEliminated: true }])), [ev({ type: 'pass_turn' })]),
    transform('turn: first player not at bottom', state(FOUR(), { firstPlayerIdx: 2, currentPlayerIdx: 1, turnNumber: 3 }), [ev({ type: 'pass_turn' })]),
    transform('turn: prev steps back and decrements', state(FOUR(), { currentPlayerIdx: 0, turnNumber: 2 }), [ev({ type: 'prev_turn' })]),
    transform('turn: prev refuses below turn 1', state(FOUR(), { currentPlayerIdx: 0, turnNumber: 1 }), [ev({ type: 'prev_turn' })]),
    transform('turn: prev mid-round keeps turn', state(FOUR(), { currentPlayerIdx: 2, turnNumber: 2 }), [ev({ type: 'prev_turn' })]),
    transform('turn: full lap', state(FOUR()), [1, 2, 3, 4].map((ts) => ev({ type: 'pass_turn' }, 'bottom', ts))),

    transform('checkin: adds, keeps, overwrites', state(FOUR(), { remoteCheckins: { bottom: 99 } }), [
      ev({ type: 'checkin' }, 'top', 12345),
      ev({ type: 'checkin' }, 'bottom', 200),
    ]),
    transform('unknown event: unchanged', state(FOUR()), [{ type: 'unknown_future_event', seat: 'top', ts: 0 } as unknown as LiveGameEvent]),

    transform('team name: set, preserving others', state(FOUR(), { teamNames: { 2: 'Team 2' } }), [ev({ type: 'set_team_name', team: 1, name: 'Goblins' })]),
    transform('team name: trims and caps at 32', state(FOUR()), [ev({ type: 'set_team_name', team: 1, name: '  ' + 'x'.repeat(40) + '  ' })]),
    transform('team name: blank ignored', state(FOUR(), { teamNames: { 1: 'Keep' } }), [ev({ type: 'set_team_name', team: 1, name: '   ' })]),

    transform('2hg: life mirrors to teammate', twoHG(TEAMS()), [ev({ type: 'life_change', playerIdx: 0, delta: -5 })]),
    transform('2hg: delta on either head moves total once', twoHG(TEAMS()), [
      ev({ type: 'life_change', playerIdx: 0, delta: -4 }, 'bottom', 1),
      ev({ type: 'life_change', playerIdx: 1, delta: -6 }, 'left', 2),
    ]),
    transform('2hg: shared life 0 eliminates both', twoHG(TEAMS([{ life: 3 }, { life: 3 }])), [ev({ type: 'life_change', playerIdx: 0, delta: -3 })]),
    transform('2hg: poison 12 alive, 15 dead', twoHG(TEAMS([{ poison: 9 }, { poison: 9 }])), [
      ev({ type: 'poison_change', playerIdx: 0, delta: 3 }, 'bottom', 1),
      ev({ type: 'poison_change', playerIdx: 0, delta: 3 }, 'bottom', 2),
    ]),
    transform('2hg: 21 from one commander summed across heads', twoHG(TEAMS()), [
      ev({ type: 'commander_damage_change', targetIdx: 0, sourceIdx: 2, isPartner: false, delta: 11 }, 'top', 1),
      ev({ type: 'commander_damage_change', targetIdx: 1, sourceIdx: 2, isPartner: false, delta: 10 }, 'top', 2),
    ]),
    transform('2hg: team revives when life restored', twoHG(TEAMS([{ life: 1 }, { life: 1 }])), [
      ev({ type: 'life_change', playerIdx: 0, delta: -1 }, 'bottom', 1),
      ev({ type: 'life_change', playerIdx: 0, delta: 5 }, 'bottom', 2),
    ]),
    transform('2hg: one concede eliminates team', twoHG(TEAMS()), [ev({ type: 'eliminate', playerIdx: 0 })]),
    transform('2hg: tax is per player', twoHG(TEAMS()), [ev({ type: 'commander_tax_change', playerIdx: 0, delta: 2, isPartner: true })]),
    transform('2hg turns: pass to other team keeps turn 1', twoHG(TEAMS()), [ev({ type: 'pass_turn' })]),
    transform('2hg turns: full round increments', twoHG(TEAMS()), [ev({ type: 'pass_turn' }, 'bottom', 1), ev({ type: 'pass_turn' }, 'bottom', 2)]),
    transform('2hg turns: prev unwinds a round', twoHG(TEAMS(), { currentPlayerIdx: 0, turnNumber: 2 }), [ev({ type: 'prev_turn' })]),
    transform('2hg turns: prev refuses before turn 1', twoHG(TEAMS(), { currentPlayerIdx: 0, turnNumber: 1 }), [ev({ type: 'prev_turn' })]),
    transform('2hg turns: skips an eliminated opposing seat', twoHG(TEAMS([{}, {}, { isEliminated: true, eliminatedTurn: 1 }])), [ev({ type: 'pass_turn' })]),
  ];
}

function diff(name: string, prev: GameManagerState, next: GameManagerState, reverse = false): DiffScenario {
  return { name, prev, next, reverse, expected: diffGameEvents(prev, next, reverse ? { reverse } : undefined) };
}

const LOG4 = (o: Partial<PlayerState>[] = []) => [
  player('Rick', { position: 'bottom', ...o[0] }),
  player('Sam',  { position: 'left',   ...o[1] }),
  player('Amy',  { position: 'top',    ...o[2] }),
  player('Jo',   { position: 'right',  ...o[3] }),
];
const LOGTEAMS = (o: Partial<PlayerState>[] = []) => [
  player('Rick', { position: 'bottom', teamNumber: 1, ...o[0] }),
  player('Sam',  { position: 'left',   teamNumber: 1, ...o[1] }),
  player('Amy',  { position: 'top',    teamNumber: 2, ...o[2] }),
  player('Jo',   { position: 'right',  teamNumber: 2, ...o[3] }),
];
const unset = (players: PlayerState[], o: Partial<GameManagerState> = {}) => {
  const s = state(players, o);
  delete s.firstPlayerIdx;
  return s;
};
const log2hg = (players: PlayerState[], o: Partial<GameManagerState> = {}) => state(players, { gameType: '2hg', ...o });

function buildDiffs(): DiffScenario[] {
  const same = state(LOG4());
  const cmd7 = state(LOG4()); cmd7.commanderDamage[1][0] = [7, 0];
  const cmdBoth = state(LOG4()); cmdBoth.commanderDamage[1][0] = [7, 2]; cmdBoth.commanderDamage[3][2] = [0, 4];
  return [
    diff('nothing changes', same, same),
    diff('turn_order when first player chosen', unset(LOG4()), state(LOG4(), { firstPlayerIdx: 2, currentPlayerIdx: 2 })),
    diff('pass_turn on advance', state(LOG4()), state(LOG4(), { currentPlayerIdx: 1 })),
    diff('turn_revert when reverse', state(LOG4(), { currentPlayerIdx: 2 }), state(LOG4(), { currentPlayerIdx: 1 }), true),
    diff('turn_change without player change', state(LOG4(), { turnNumber: 1 }), state(LOG4(), { turnNumber: 2 })),
    diff('turn_revert on turn number only', state(LOG4(), { turnNumber: 2 }), state(LOG4(), { turnNumber: 1 }), true),
    diff('no pass_turn before first player', unset(LOG4()), unset(LOG4(), { currentPlayerIdx: 1 })),
    diff('life, poison, eliminate, monarch, energy', state(LOG4()), state(LOG4([{}, { life: 34, poison: 3, isMonarch: true, energy: 2 }, { isEliminated: true }]), { turnNumber: 5 })),
    diff('initiative, blessing, experience, tax', state(LOG4()), state(LOG4([{ hasInitiative: true }, { hasCitysBlessing: true, experience: 4 }, { commanderTax: 2 }]))),
    diff('commander_damage single', state(LOG4()), cmd7),
    diff('commander_damage two targets, partner slot', state(LOG4()), cmdBoth),
    diff('eliminate: cmdkill attribution', state(LOG4()), state(LOG4([{}, {}, { isEliminated: true }]), { turnNumber: 6, notes: '[cmdkill:2:0] Amy eliminated by commander damage (turn 6)' })),
    diff('eliminate: lifekill with source', state(LOG4()), state(LOG4([{}, { isEliminated: true }]), { turnNumber: 6, notes: '[lifekill:1:3] Sam brought to 0 life (turn 6)' })),
    diff('eliminate: poison without source', state(LOG4()), state(LOG4([{ isEliminated: true }]), { turnNumber: 6, notes: '[poisonkill:0] Rick eliminated by poison (turn 6)' })),
    diff('eliminate: concede cause', state(LOG4()), state(LOG4([{}, {}, {}, { isEliminated: true, isConceded: true }]), { turnNumber: 6, notes: 'Jo conceded (turn 6)' })),
    diff('eliminate: infers poison from state', state(LOG4()), state(LOG4([{}, { isEliminated: true, poison: 10 }]), { turnNumber: 6 })),
    diff('eliminate: infers life from state', state(LOG4()), state(LOG4([{}, {}, { isEliminated: true, life: 0 }]), { turnNumber: 8 })),
    diff('eliminate: unknown cause when nothing matches', state(LOG4()), state(LOG4([{}, {}, {}, { isEliminated: true }]), { turnNumber: 8 })),
    diff('standalone concede without elimination change', state(LOG4([{}, { isEliminated: true, eliminatedTurn: 2 }])), state(LOG4([{}, { isEliminated: true, eliminatedTurn: 2, isConceded: true }]), { turnNumber: 3 })),
    diff('2hg: turn_order lists teams with custom name', unset(LOGTEAMS(), { gameType: '2hg' }), log2hg(LOGTEAMS(), { firstPlayerIdx: 0, teamNames: { 1: 'The Berries' } })),
    diff('2hg: pass_turn names team', log2hg(LOGTEAMS()), log2hg(LOGTEAMS(), { currentPlayerIdx: 2 })),
    diff('2hg: turn_revert names team', log2hg(LOGTEAMS()), log2hg(LOGTEAMS(), { currentPlayerIdx: 2 }), true),
    diff('2hg: mirrored life/poison collapse', log2hg(LOGTEAMS()), log2hg(LOGTEAMS([{ life: 34, poison: 2 }, { life: 34, poison: 2 }]))),
    diff('2hg: joint elimination with team-labelled source', log2hg(LOGTEAMS()), log2hg(LOGTEAMS([{}, {}, { isEliminated: true }, { isEliminated: true }]), { turnNumber: 7, notes: '[cmdkill:2:0]' })),
    diff('2hg: attribution found on second teammate', log2hg(LOGTEAMS()), log2hg(LOGTEAMS([{}, {}, { isEliminated: true }, { isEliminated: true }]), { turnNumber: 9, notes: '[cmdkill:3:0]' })),
    diff('2hg: per-player counters stay individual', log2hg(LOGTEAMS()), log2hg(LOGTEAMS([{}, {}, { isMonarch: true, energy: 3 }]))),
    diff('2hg: blank team name falls back', log2hg(LOGTEAMS()), log2hg(LOGTEAMS([{ life: 38 }, { life: 38 }]), { teamNames: { 1: '   ' } })),
    diff('2hg: joint concede collapses', log2hg(LOGTEAMS()), log2hg(LOGTEAMS([{}, {}, { isEliminated: true, isConceded: true }, { isEliminated: true }]), { turnNumber: 4 })),
  ];
}

function buildStarts(): StartScenario[] {
  const std = state(LOG4([{}, { partner: { name: 'Sam Partner' } }]), { gameType: 'standard' });
  const noType = state(LOG4()); delete noType.gameType;
  const teams = log2hg(LOGTEAMS(), { startingLife: 30 });
  return [
    { name: 'standard four players', state: std, expected: buildGameStartedEvent(std) },
    { name: 'gameType absent defaults to standard', state: noType, expected: buildGameStartedEvent(noType) },
    { name: '2hg teams', state: teams, expected: buildGameStartedEvent(teams) },
  ];
}

// ─── Compare with (or regenerate) the committed JSON ─────────────────────────

const FILES = {
  'transforms.json': buildTransforms,
  'diffs.json': buildDiffs,
  'game-started.json': buildStarts,
} as const;

describe('iOS shared fixtures', () => {
  for (const [file, build] of Object.entries(FILES)) {
    it(`${file} matches the TypeScript implementation`, () => {
      const actual = JSON.parse(JSON.stringify(build()));
      const target = path.join(FIXTURE_DIR, file);
      if (process.env.UPDATE_IOS_FIXTURES) {
        fs.mkdirSync(FIXTURE_DIR, { recursive: true });
        fs.writeFileSync(target, JSON.stringify(actual, null, 2) + '\n');
      }
      expect(fs.existsSync(target), `${target} is missing — run with UPDATE_IOS_FIXTURES=1`).toBe(true);
      const committed = JSON.parse(fs.readFileSync(target, 'utf8'));
      expect(actual, `apps/ios fixture ${file} is stale — run with UPDATE_IOS_FIXTURES=1 and port the change to Swift`).toEqual(committed);
    });
  }
});
