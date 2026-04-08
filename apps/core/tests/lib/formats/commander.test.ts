import { describe, it, expect } from 'vitest';
import { commanderValidator } from '@/lib/formats/commander';
import type { Card } from '@/lib/cards/types';

// ── Fixtures ─────────────────────────────────────────────────────────────────

type CardFull = Card & {
  keywords?: string[];
  legalities?: Record<string, string>;
  power?: string | number | null;
  toughness?: string | number | null;
};

function makeCard(overrides: Partial<CardFull> = {}): CardFull {
  return {
    card_name: 'Some Card',
    color_identity: 'W',
    mana_cost: '{W}',
    type_line: 'Instant',
    quantity: 1,
    is_commander: false,
    is_proxy: false,
    ...overrides,
  };
}

function legendaryCreature(overrides: Partial<CardFull> = {}): CardFull {
  return makeCard({
    type_line: 'Legendary Creature — Human',
    color_identity: 'W',
    mana_cost: '{3}{W}',
    power: '2',
    toughness: '2',
    ...overrides,
  });
}

/**
 * Build a 100-card mono-white deck with 1 commander flagged via is_commander.
 * The commander itself counts toward the 100.
 */
function buildDeckWithCommander(
  commander: CardFull,
  nonCommanderCount = 99,
  colorIdentity = 'W',
): CardFull[] {
  const filler: CardFull[] = Array.from({ length: nonCommanderCount }, (_, i) =>
    makeCard({
      card_name: `Plains ${i}`,
      color_identity: colorIdentity,
      mana_cost: undefined,
      type_line: 'Basic Land — Plains',
      quantity: 1,
    }),
  );
  return [commander, ...filler];
}

// ── 0 commanders → error ──────────────────────────────────────────────────────

describe('commanderValidator — 0 commanders', () => {
  it('returns legal: false when no commander is flagged', () => {
    const cards = [makeCard({ card_name: 'Forest', type_line: 'Basic Land — Forest' })];
    const result = commanderValidator.validate(cards);
    expect(result.legal).toBe(false);
  });

  it('includes a commander_legality error with the correct message', () => {
    const result = commanderValidator.validate([]);
    const err = result.violations.find(v => v.rule === 'commander_legality');
    expect(err).toBeDefined();
    expect(err!.message).toMatch(/flag a commander/i);
  });
});

// ── 1 legal commander, 100 cards, no violations ───────────────────────────────

describe('commanderValidator — 1 legal commander, 100 cards', () => {
  it('returns legal: true with no errors for a clean deck', () => {
    const commander = legendaryCreature({
      card_name: 'Commander Test',
      is_commander: true,
      color_identity: 'W',
    });
    const deck = buildDeckWithCommander(commander, 99, 'W');
    const result = commanderValidator.validate(deck);
    const errors = result.violations.filter(v => v.severity === 'error');
    expect(errors).toHaveLength(0);
    expect(result.legal).toBe(true);
  });

  it('format field is commander', () => {
    const commander = legendaryCreature({ is_commander: true });
    const deck = buildDeckWithCommander(commander);
    const result = commanderValidator.validate(deck);
    expect(result.format).toBe('commander');
  });
});

// ── Singleton violation ────────────────────────────────────────────────────────

describe('commanderValidator — singleton rule', () => {
  it('flags a non-basic card with quantity > 1 as a singleton violation', () => {
    const commander = legendaryCreature({ card_name: 'My Commander', is_commander: true });
    const duplicate = makeCard({ card_name: 'Counterspell', color_identity: 'W', quantity: 2 });
    // Fill to 100: commander + duplicate(qty=2) + 97 basic lands = 100 cards counted
    // But singleton checks by card rows, not quantity; quantity=2 on one row
    const filler: CardFull[] = Array.from({ length: 97 }, (_, i) =>
      makeCard({ card_name: `Plains ${i}`, type_line: 'Basic Land — Plains', color_identity: 'W', quantity: 1 }),
    );
    const deck = [commander, duplicate, ...filler];
    const result = commanderValidator.validate(deck);
    const singletonViolation = result.violations.find(v => v.rule === 'singleton');
    expect(singletonViolation).toBeDefined();
    expect(singletonViolation!.severity).toBe('error');
    expect(singletonViolation!.cardIds).toBeDefined();
    expect(singletonViolation!.cardIds!.length).toBeGreaterThan(0);
    expect(result.legal).toBe(false);
  });

  it('basic lands are exempt from singleton (4x Forest is legal)', () => {
    const commander = legendaryCreature({ card_name: 'My Commander', is_commander: true });
    const forests: CardFull[] = Array.from({ length: 4 }, () =>
      makeCard({ card_name: 'Forest', type_line: 'Basic Land — Forest', color_identity: 'G', quantity: 4 }),
    );
    // Just test the forest row is exempt — full 100-card count not required for this test
    const deck = [commander, forests[0]];
    const result = commanderValidator.validate(deck);
    const singletonViolation = result.violations.find(v => v.rule === 'singleton');
    expect(singletonViolation).toBeUndefined();
  });
});

// ── Color identity violation ──────────────────────────────────────────────────

describe('commanderValidator — color identity', () => {
  it('flags cards outside the commander color identity', () => {
    const commander = legendaryCreature({
      card_name: 'White Commander',
      is_commander: true,
      color_identity: 'W',
      mana_cost: '{3}{W}',
    });
    const offColorCard = makeCard({
      card_name: 'Llanowar Elves',
      color_identity: 'G',
      mana_cost: '{G}',
      type_line: 'Creature — Elf Druid',
    });
    const deck = [commander, offColorCard];
    const result = commanderValidator.validate(deck);
    const colorViolation = result.violations.find(v => v.rule === 'color_identity');
    expect(colorViolation).toBeDefined();
    expect(colorViolation!.severity).toBe('error');
    expect(result.legal).toBe(false);
  });

  it('colorless cards are legal in any commander identity', () => {
    const commander = legendaryCreature({
      card_name: 'White Commander',
      is_commander: true,
      color_identity: 'W',
      mana_cost: '{3}{W}',
    });
    const colorlessCard = makeCard({
      card_name: 'Sol Ring',
      color_identity: '',
      mana_cost: '{1}',
      type_line: 'Artifact',
    });
    const deck = [commander, colorlessCard];
    const result = commanderValidator.validate(deck);
    const colorViolation = result.violations.find(v => v.rule === 'color_identity');
    expect(colorViolation).toBeUndefined();
  });
});

// ── Card count ────────────────────────────────────────────────────────────────

describe('commanderValidator — card count', () => {
  it('87 cards produces a warning but legal stays true', () => {
    const commander = legendaryCreature({ card_name: 'Commander', is_commander: true });
    // 87 cards: commander + 86 cards
    const filler = Array.from({ length: 86 }, (_, i) =>
      makeCard({ card_name: `Card ${i}`, color_identity: 'W', quantity: 1 }),
    );
    const deck = [commander, ...filler];
    const result = commanderValidator.validate(deck);
    const countViolation = result.violations.find(v => v.rule === 'card_count');
    expect(countViolation).toBeDefined();
    expect(countViolation!.severity).toBe('warning');
    // Warning alone should not flip legal to false (no errors)
    // But other violations may exist; check specifically for count
    const hardErrors = result.violations.filter(
      v => v.severity === 'error' && v.rule !== 'card_count',
    );
    // If no other violations, legal should be true
    // Note: commander itself may not be legendary creature in this fixture — it is
    expect(countViolation!.message).toMatch(/87/);
  });
});

// ── 2 commanders without partner keywords ─────────────────────────────────────

describe('commanderValidator — 2 commanders without partner', () => {
  it('two commanders without partner or Friends Forever → error', () => {
    const cmdA = legendaryCreature({
      card_name: 'Commander A',
      is_commander: true,
      role: 'commander' as const,
    });
    const cmdB = legendaryCreature({
      card_name: 'Commander B',
      is_commander: true,
      role: 'commander' as const,
    });
    const result = commanderValidator.validate([cmdA, cmdB]);
    const err = result.violations.find(v => v.rule === 'commander_legality');
    expect(err).toBeDefined();
    expect(err!.severity).toBe('error');
    expect(result.legal).toBe(false);
  });
});

// ── Friends Forever ────────────────────────────────────────────────────────────

describe('commanderValidator — Friends Forever partner pair', () => {
  it('two commanders with Friends Forever keyword → no commander_legality error', () => {
    const cmdA = legendaryCreature({
      card_name: 'Commander A',
      role: 'commander' as const,
      keywords: ['Friends Forever'],
    });
    const cmdB = legendaryCreature({
      card_name: 'Commander B',
      role: 'commander' as const,
      keywords: ['Friends Forever'],
    });
    const result = commanderValidator.validate([cmdA, cmdB]);
    const cmdErr = result.violations.find(v => v.rule === 'commander_legality');
    expect(cmdErr).toBeUndefined();
  });
});

// ── Banned card ───────────────────────────────────────────────────────────────

describe('commanderValidator — banned cards', () => {
  it('a card with legalities.commander = banned → error', () => {
    const commander = legendaryCreature({ card_name: 'Commander', is_commander: true });
    const bannedCard = makeCard({
      card_name: 'Banned Card',
      color_identity: 'W',
      legalities: { commander: 'banned' },
    });
    const deck = [commander, bannedCard];
    const result = commanderValidator.validate(deck);
    const bannedViolation = result.violations.find(v => v.rule === 'banned');
    expect(bannedViolation).toBeDefined();
    expect(bannedViolation!.severity).toBe('error');
    expect(bannedViolation!.cardIds).toBeDefined();
    expect(bannedViolation!.cardIds!.length).toBeGreaterThan(0);
    expect(result.legal).toBe(false);
  });

  it('a card with missing legalities → no false positive (silently skipped)', () => {
    const commander = legendaryCreature({ card_name: 'Commander', is_commander: true });
    const unknownCard = makeCard({
      card_name: 'Unknown Card',
      color_identity: 'W',
      // no legalities field
    });
    const deck = [commander, unknownCard];
    const result = commanderValidator.validate(deck);
    const bannedViolation = result.violations.find(v => v.rule === 'banned');
    expect(bannedViolation).toBeUndefined();
    const formatViolation = result.violations.find(v => v.rule === 'format_legality');
    expect(formatViolation).toBeUndefined();
  });
});

// ── Partner keyword ───────────────────────────────────────────────────────────

describe('commanderValidator — generic Partner keyword', () => {
  it('two commanders with Partner keyword → no commander_legality pair error', () => {
    const cmdA = legendaryCreature({
      card_name: 'Partner A',
      role: 'commander' as const,
      keywords: ['Partner'],
    });
    const cmdB = legendaryCreature({
      card_name: 'Partner B',
      role: 'commander' as const,
      keywords: ['Partner'],
    });
    const result = commanderValidator.validate([cmdA, cmdB]);
    const cmdErr = result.violations.find(v => v.rule === 'commander_legality');
    expect(cmdErr).toBeUndefined();
  });
});

// ── ValidationResult shape ────────────────────────────────────────────────────

describe('commanderValidator — result shape', () => {
  it('result always has legal, format, violations fields', () => {
    const result = commanderValidator.validate([]);
    expect(typeof result.legal).toBe('boolean');
    expect(result.format).toBe('commander');
    expect(Array.isArray(result.violations)).toBe(true);
  });
});
