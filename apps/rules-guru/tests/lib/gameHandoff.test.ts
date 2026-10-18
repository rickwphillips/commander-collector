import { describe, it, expect, beforeEach } from 'vitest';
import { readGameHandoff } from '@/lib/gameContext';
import { encodeGameContextParam } from '@commander/shared/lib/gameContextCodec';

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

  it('parses a handoff carrying smart punctuation in names', () => {
    // The encoder is UTF-8 safe; plain btoa threw on U+2019 and dropped the
    // handoff, so the chat opened with no game attached.
    setSearch(`?ctx=${encodeGameContextParam({ turnNumber: 3, currentPlayer: 'Rick\u2019s Pod', players: [] })}`);
    expect(readGameHandoff()?.ctx?.currentPlayer).toBe('Rick\u2019s Pod');
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
