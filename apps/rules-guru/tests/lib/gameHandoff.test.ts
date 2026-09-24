import { describe, it, expect, beforeEach } from 'vitest';
import { readGameHandoff } from '@/lib/gameContext';

function setSearch(search: string) {
  window.history.replaceState({}, '', `/chat/${search}`);
}

const encode = (obj: object) => encodeURIComponent(btoa(JSON.stringify(obj)));

beforeEach(() => setSearch(''));

describe('readGameHandoff', () => {
  it('returns null when the page was not opened from the game manager', () => {
    expect(readGameHandoff()).toBeNull();
  });

  it('parses the game and builds the opening message from turn info', () => {
    setSearch(`?ctx=${encode({ turnNumber: 4, currentPlayer: 'Mason', players: [] })}`);
    const handoff = readGameHandoff();
    expect(handoff?.ctx?.currentPlayer).toBe('Mason');
    expect(handoff?.openingMessage).toContain("Turn 4, Mason's turn");
  });

  it('adds a hidden timer note when the turn timer is running', () => {
    setSearch(`?ctx=${encode({ turnNumber: 2, currentPlayer: 'Ella', timerSeconds: 100, elapsedSeconds: 90, players: [] })}`);
    const note = readGameHandoff()?.ctx?._timerNote ?? '';
    expect(note).toMatch(/Ella/);
  });

  it('has no opening message without turn info', () => {
    setSearch(`?ctx=${encode({ players: [] })}`);
    expect(readGameHandoff()).toEqual(expect.objectContaining({ openingMessage: null }));
  });

  it('flags a malformed handoff so the page falls back to a lookup', () => {
    setSearch('?ctx=not-base64-json');
    expect(readGameHandoff()).toEqual({ ctx: null, openingMessage: null });
  });
});
