import { describe, it, expect } from 'vitest';
import {
  encodeGameContextParam,
  decodeGameContextParam,
} from '@commander/shared/lib/gameContextCodec';

describe('game context codec', () => {
  it('round-trips an ASCII context', () => {
    const ctx = { turnNumber: 4, currentPlayer: 'Mason', players: [] };
    expect(decodeGameContextParam(encodeGameContextParam(ctx))).toEqual(ctx);
  });

  it('stays byte-compatible with plain btoa for ASCII payloads', () => {
    const ctx = { turnNumber: 4, currentPlayer: 'Mason', players: [] };
    expect(encodeGameContextParam(ctx)).toBe(
      encodeURIComponent(btoa(JSON.stringify(ctx)))
    );
  });

  it('encodes the smart punctuation that made plain btoa throw', () => {
    // U+2019 is what an iOS keyboard substitutes for a typed apostrophe, and
    // what LLM output uses for card names; U+2014 arrives the same way.
    const ctx = { currentPlayer: 'Rick’s Pod', players: [{ deckName: 'Ping—Pong' }] };
    expect(() => btoa(JSON.stringify(ctx))).toThrow();
    expect(decodeGameContextParam(encodeGameContextParam(ctx))).toEqual(ctx);
  });

  it('round-trips non-Latin-1 card and player names', () => {
    const ctx = {
      currentPlayer: 'さくら',
      players: [{ commander: 'Jötun Grunt' }, { commander: 'Æther Vial' }],
    };
    expect(decodeGameContextParam(encodeGameContextParam(ctx))).toEqual(ctx);
  });

  it('throws on a malformed param', () => {
    expect(() => decodeGameContextParam('not-base64-json')).toThrow();
  });
});
