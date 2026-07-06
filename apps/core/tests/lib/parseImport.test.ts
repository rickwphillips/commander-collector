import { describe, it, expect } from 'vitest';
import { parseImport } from '@/lib/parseImport';

describe('parseImport — TTS JSON', () => {
  it('counts ContainedObjects by Nickname and reads the deck name', () => {
    const tts = JSON.stringify({
      ObjectStates: [
        {
          Nickname: 'My Deck',
          ContainedObjects: [
            { Nickname: 'Sol Ring' },
            { Nickname: 'Sol Ring' },
            { Nickname: 'Island' },
            { Nickname: '' }, // skipped
            {}, // no Nickname → skipped
          ],
        },
      ],
    });
    const { cards, deckName } = parseImport(tts);
    expect(deckName).toBe('My Deck');
    expect(cards.find((c) => c.card_name === 'Sol Ring')?.quantity).toBe(2);
    expect(cards.find((c) => c.card_name === 'Island')?.quantity).toBe(1);
    expect(cards).toHaveLength(2);
  });

  it('returns null deck name when state Nickname is missing', () => {
    const tts = JSON.stringify({
      ObjectStates: [{ ContainedObjects: [{ Nickname: 'Forest' }] }],
    });
    const { cards, deckName } = parseImport(tts);
    expect(deckName).toBeNull();
    expect(cards[0].card_name).toBe('Forest');
  });

  it('falls through to text parsing when JSON has no ObjectStates', () => {
    // Valid JSON but not a TTS object → text branch (no numeric lines → empty)
    const { cards } = parseImport('{"foo":"bar"}');
    expect(cards).toEqual([]);
  });
});

describe('parseImport — text formats', () => {
  it('parses simple quantity + name lines with x-suffix support', () => {
    const { cards } = parseImport('1 Sol Ring\n2x Forest');
    expect(cards).toEqual([
      { card_name: 'Sol Ring', quantity: 1, is_commander: false, is_proxy: false },
      { card_name: 'Forest', quantity: 2, is_commander: false, is_proxy: false },
    ]);
  });

  it('marks cards under a Commander section and *CMDR* tag as commanders', () => {
    const { cards } = parseImport('Commander\n1 Atraxa\n\nDeck\n1 Sol Ring\n1 Kenrith *CMDR*');
    expect(cards.find((c) => c.card_name === 'Atraxa')?.is_commander).toBe(true);
    expect(cards.find((c) => c.card_name === 'Sol Ring')?.is_commander).toBe(false);
    expect(cards.find((c) => c.card_name === 'Kenrith')?.is_commander).toBe(true);
  });

  it('strips set codes, bracketed sets and star tags from names', () => {
    const { cards } = parseImport('1 Sol Ring (CMR) 263\n1 Lightning Bolt [2XM]\n1 Island *Foil*');
    const names = cards.map((c) => c.card_name);
    expect(names).toContain('Sol Ring');
    expect(names).toContain('Lightning Bolt');
    expect(names).toContain('Island');
  });

  it('skips sideboard cards and comment / non-matching lines', () => {
    const { cards } = parseImport(
      'Sideboard\n1 Not In Deck\nDeck\n1 In Deck\n// a comment\nrandom text with no qty',
    );
    expect(cards.find((c) => c.card_name === 'Not In Deck')).toBeUndefined();
    expect(cards.find((c) => c.card_name === 'In Deck')).toBeDefined();
  });

  it('handles // sideboard and // commander comment markers', () => {
    const { cards } = parseImport('// Commander\n1 Atraxa\n// Sideboard\n1 Bench Card');
    expect(cards.find((c) => c.card_name === 'Atraxa')?.is_commander).toBe(true);
    expect(cards.find((c) => c.card_name === 'Bench Card')).toBeUndefined();
  });

  it('ignores lines with a zero quantity', () => {
    const { cards } = parseImport('0 Nothing\n1 Something');
    expect(cards.find((c) => c.card_name === 'Nothing')).toBeUndefined();
    expect(cards.find((c) => c.card_name === 'Something')).toBeDefined();
  });
});
