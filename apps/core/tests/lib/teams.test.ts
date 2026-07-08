import { describe, it, expect } from 'vitest';
import { teamName, teamLabel, teamColor, otherTeam } from '@/lib/teams';

describe('teamName', () => {
  it('uses the custom name when set', () => {
    expect(teamName(1, { 1: 'Alpha' })).toBe('Alpha');
  });
  it('falls back to "Team N" for blank or missing names', () => {
    expect(teamName(1, { 1: '   ' })).toBe('Team 1');
    expect(teamName(2, null)).toBe('Team 2');
    expect(teamName(2, undefined)).toBe('Team 2');
  });
});

describe('teamLabel', () => {
  it('joins the team members after the name', () => {
    const players = [
      { teamNumber: 1, playerName: 'A' },
      { teamNumber: 1, playerName: 'B' },
      { teamNumber: 2, playerName: 'C' },
    ];
    expect(teamLabel(1, players, { 1: 'Alpha' })).toBe('Alpha (A / B)');
    expect(teamLabel(2, players, null)).toBe('Team 2 (C)');
  });
});

describe('teamColor', () => {
  it('maps team 1 to primary and every other team to secondary', () => {
    expect(teamColor(1)).toBe('primary.main');
    expect(teamColor(2)).toBe('secondary.main');
    expect(teamColor(null)).toBe('secondary.main');
    expect(teamColor(undefined)).toBe('secondary.main');
  });
});

describe('otherTeam', () => {
  it('returns the opposing team in a two-team game', () => {
    expect(otherTeam(1)).toBe(2);
    expect(otherTeam(2)).toBe(1);
  });
});
