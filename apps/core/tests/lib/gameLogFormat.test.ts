import { describe, it, expect } from 'vitest';
import { describeLogEntry, logEntryTime } from '@/lib/gameLogFormat';
import type { GameLogEntry } from '@/lib/types';

function entry(type: string, payload?: Record<string, unknown>): GameLogEntry {
  return { type, payload } as unknown as GameLogEntry;
}

describe('describeLogEntry', () => {
  it('describes game_started with 2HG flag', () => {
    expect(describeLogEntry(entry('game_started', { players: [1, 2], gameType: '2hg' }))).toBe(
      'Game started: 2 players (2HG)'
    );
  });

  it('describes game_started without 2HG and no players array', () => {
    expect(describeLogEntry(entry('game_started', {}))).toBe('Game started: 0 players');
  });

  it('describes turn_order', () => {
    expect(describeLogEntry(entry('turn_order', { order: ['A', 'B'] }))).toBe('Turn order: A, B');
  });

  it('describes pass_turn and turn_change', () => {
    expect(describeLogEntry(entry('pass_turn', { turn: 2, to: 'Bob' }))).toBe('Turn 2: Bob to play');
    expect(describeLogEntry(entry('turn_change', { turn: 3 }))).toBe('Turn 3');
  });

  it('describes turn_revert with and without a target', () => {
    expect(describeLogEntry(entry('turn_revert', { turn: 3, to: 'Al' }))).toBe(
      'Turn reverted: back to Al (turn 3)'
    );
    expect(describeLogEntry(entry('turn_revert', { turn: 3 }))).toBe('Turn reverted (turn 3)');
  });

  it('describes die_roll with and without a total', () => {
    expect(describeLogEntry(entry('die_roll', { die: 'd20', rolls: [5, 10], total: 15 }))).toBe(
      'Rolled d20: 5, 10 (total 15)'
    );
    expect(describeLogEntry(entry('die_roll', { die: 'd6', rolls: [4] }))).toBe('Rolled d6: 4');
  });

  it('describes roll_for_first', () => {
    expect(
      describeLogEntry(entry('roll_for_first', { rolls: [{ player: 'A', roll: 6 }] }))
    ).toBe('Roll for first: A 6');
  });

  it('describes life_change with positive and negative deltas', () => {
    expect(describeLogEntry(entry('life_change', { player: 'A', from: 40, to: 37, delta: -3 }))).toBe(
      'A life 40 → 37 (-3)'
    );
    expect(describeLogEntry(entry('life_change', { player: 'A', from: 40, to: 42, delta: 2 }))).toBe(
      'A life 40 → 42 (+2)'
    );
  });

  it('describes the various counter changes', () => {
    expect(describeLogEntry(entry('poison_change', { player: 'A', from: 0, to: 3 }))).toBe(
      'A poison 0 → 3'
    );
    expect(
      describeLogEntry(entry('commander_damage', { source: 'X', target: 'Y', from: 0, to: 5 }))
    ).toBe('X → Y commander damage 0 → 5');
    expect(describeLogEntry(entry('energy_change', { player: 'A', to: 4 }))).toBe('A energy → 4');
    expect(describeLogEntry(entry('experience_change', { player: 'A', to: 2 }))).toBe(
      'A experience → 2'
    );
    expect(describeLogEntry(entry('commander_tax', { player: 'A', to: 4 }))).toBe(
      'A commander tax → 4'
    );
  });

  it('describes monarch / initiative / citys_blessing toggles', () => {
    expect(describeLogEntry(entry('monarch', { player: 'A', value: true }))).toBe('A became Monarch');
    expect(describeLogEntry(entry('monarch', { player: 'A', value: false }))).toBe('A lost Monarch');
    expect(describeLogEntry(entry('initiative', { player: 'A', value: true }))).toBe(
      'A took the Initiative'
    );
    expect(describeLogEntry(entry('initiative', { player: 'A', value: false }))).toBe(
      'A lost the Initiative'
    );
    expect(describeLogEntry(entry('citys_blessing', { player: 'A', value: true }))).toBe(
      "A gained the City's Blessing"
    );
    expect(describeLogEntry(entry('citys_blessing', { player: 'A', value: false }))).toBe(
      "A lost the City's Blessing"
    );
  });

  it('describes eliminate with all optional fields', () => {
    expect(
      describeLogEntry(entry('eliminate', { player: 'A', cause: 'combat', source: 'B', turn: 5 }))
    ).toBe('A eliminated (combat) by B, turn 5');
    expect(describeLogEntry(entry('eliminate', { player: 'A' }))).toBe('A eliminated');
  });

  it('describes kill_attribution, concede and manual_entry', () => {
    expect(
      describeLogEntry(entry('kill_attribution', { player: 'A', cause: 'burn', source: 'B' }))
    ).toBe("A's burn kill credited to B");
    expect(describeLogEntry(entry('kill_attribution', { player: 'A', cause: 'burn' }))).toBe(
      "A's burn kill credited to unknown"
    );
    expect(describeLogEntry(entry('concede', { player: 'A', turn: 4 }))).toBe('A conceded, turn 4');
    expect(describeLogEntry(entry('manual_entry', { created_by: 'Rick' }))).toBe(
      'Manual entry by Rick'
    );
    expect(describeLogEntry(entry('manual_entry', {}))).toBe('Manual entry by unknown');
  });

  it('returns the raw type for an unknown entry and handles a missing payload', () => {
    expect(describeLogEntry(entry('something_new'))).toBe('something_new');
  });
});

describe('logEntryTime', () => {
  it('extracts HH:MM:SS from an ISO timestamp', () => {
    expect(logEntryTime('2026-07-02T18:15:25Z')).toBe('18:15:25');
  });

  it('returns empty string for a malformed, empty or nullish timestamp', () => {
    expect(logEntryTime('not-a-date')).toBe('');
    expect(logEntryTime('')).toBe('');
    expect(logEntryTime(undefined as unknown as string)).toBe('');
  });
});
