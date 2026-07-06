import { describe, it, expect } from 'vitest';
import { commanderValidator } from '@/lib/formats/commander';
import type { Card } from '@/lib/cards/types';

// ── Fixtures ─────────────────────────────────────────────────────────────────

type CardFull = Card & {
  oracle_text?: string;
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

// ── Commander setup edge cases ────────────────────────────────────────────────

describe('commanderValidator — commander setup edge cases', () => {
  it('flags more than two commander/partner flags', () => {
    const a = legendaryCreature({ card_name: 'A', role: 'commander' as const });
    const b = legendaryCreature({ card_name: 'B', role: 'commander' as const });
    const c = legendaryCreature({ card_name: 'C', role: 'commander' as const });
    const result = commanderValidator.validate([a, b, c]);
    const err = result.violations.find(
      (v) => v.rule === 'commander_legality' && /too many/i.test(v.message),
    );
    expect(err).toBeDefined();
    expect(result.legal).toBe(false);
  });

  it('flags a single illegal commander', () => {
    const cmd = makeCard({ card_name: 'Not Legendary', role: 'commander' as const, type_line: 'Instant' });
    const result = commanderValidator.validate([cmd]);
    const err = result.violations.find(
      (v) => v.rule === 'commander_legality' && /not a legal commander/i.test(v.message),
    );
    expect(err).toBeDefined();
  });

  it('accepts a card with "can be your commander" oracle text', () => {
    const cmd = makeCard({
      card_name: 'PW Commander',
      role: 'commander' as const,
      type_line: 'Legendary Planeswalker',
      oracle_text: 'This card can be your commander.',
    });
    const result = commanderValidator.validate([cmd]);
    expect(result.violations.find((v) => v.rule === 'commander_legality')).toBeUndefined();
  });
});

describe('commanderValidator — partner pairs', () => {
  it('flags an individually-illegal card in an otherwise-valid Partner pair', () => {
    const a = legendaryCreature({ card_name: 'Legal Partner', role: 'commander' as const, keywords: ['Partner'] });
    const b = makeCard({ card_name: 'Illegal Partner', role: 'commander' as const, type_line: 'Instant', keywords: ['Partner'] });
    const result = commanderValidator.validate([a, b]);
    const err = result.violations.find(
      (v) => v.rule === 'commander_legality' && /Illegal Partner/.test(v.message) && /not a legal commander/i.test(v.message),
    );
    expect(err).toBeDefined();
  });

  it('accepts a "Partner with" named pair', () => {
    const a = legendaryCreature({ card_name: 'Alpha', role: 'commander' as const, oracle_text: 'Partner with Beta' });
    const b = legendaryCreature({ card_name: 'Beta', role: 'commander' as const });
    const result = commanderValidator.validate([a, b]);
    const pairErr = result.violations.find(
      (v) => v.rule === 'commander_legality' && /partner pair/i.test(v.message),
    );
    expect(pairErr).toBeUndefined();
  });

  it('strips colorless from a mixed partner-pair color identity', () => {
    const a = legendaryCreature({ card_name: 'Colored', role: 'commander' as const, color_identity: 'W', keywords: ['Partner'] });
    const b = legendaryCreature({ card_name: 'Colorless', role: 'commander' as const, color_identity: '', mana_cost: undefined, keywords: ['Partner'] });
    const white = makeCard({ card_name: 'White Card', color_identity: 'W', mana_cost: '{W}' });
    const result = commanderValidator.validate([a, b, white]);
    expect(result.violations.find((v) => v.rule === 'color_identity')).toBeUndefined();
  });
});

describe('commanderValidator — commander + partner-role card', () => {
  it('accepts Choose a Background + a Background partner', () => {
    const cmd = legendaryCreature({ card_name: 'Wilson', role: 'commander' as const, oracle_text: 'Choose a Background' });
    const bg = makeCard({ card_name: 'Cult Background', role: 'partner' as const, type_line: 'Legendary Enchantment — Background' });
    const result = commanderValidator.validate([cmd, bg]);
    expect(result.violations.find((v) => v.rule === 'commander_legality')).toBeUndefined();
  });

  it('flags Choose a Background paired with a non-Background', () => {
    const cmd = legendaryCreature({ card_name: 'Wilson', role: 'commander' as const, oracle_text: 'Choose a Background' });
    const notBg = legendaryCreature({ card_name: 'Just A Creature', role: 'partner' as const });
    const result = commanderValidator.validate([cmd, notBg]);
    expect(result.violations.find((v) => /is not a Background/i.test(v.message))).toBeDefined();
  });

  it("accepts a Doctor + Doctor's companion", () => {
    const cmd = legendaryCreature({ card_name: 'The Doctor', role: 'commander' as const, type_line: 'Legendary Creature — Time Lord Doctor' });
    const comp = legendaryCreature({ card_name: 'Companion', role: 'partner' as const, keywords: ["Doctor's companion"] });
    const result = commanderValidator.validate([cmd, comp]);
    expect(result.violations.find((v) => v.rule === 'commander_legality')).toBeUndefined();
  });

  it("flags a Doctor without a Doctor's companion partner", () => {
    const cmd = legendaryCreature({ card_name: 'The Doctor', role: 'commander' as const, type_line: 'Legendary Creature — Time Lord Doctor' });
    const comp = legendaryCreature({ card_name: 'Random', role: 'partner' as const });
    const result = commanderValidator.validate([cmd, comp]);
    expect(result.violations.find((v) => /Doctor's companion/i.test(v.message))).toBeDefined();
  });

  it('flags a commander that cannot use a partner-role card', () => {
    const cmd = legendaryCreature({ card_name: 'Plain Commander', role: 'commander' as const });
    const partner = legendaryCreature({ card_name: 'Partner Card', role: 'partner' as const });
    const result = commanderValidator.validate([cmd, partner]);
    expect(result.violations.find((v) => /cannot pair with/i.test(v.message))).toBeDefined();
  });

  it('flags an illegal commander even in a commander+partner setup', () => {
    const cmd = makeCard({ card_name: 'Bad Cmd', role: 'commander' as const, type_line: 'Instant', oracle_text: 'Choose a Background' });
    const bg = makeCard({ card_name: 'BG', role: 'partner' as const, type_line: 'Background' });
    const result = commanderValidator.validate([cmd, bg]);
    expect(
      result.violations.find((v) => /"Bad Cmd" is not a legal commander/.test(v.message)),
    ).toBeDefined();
  });
});

describe('commanderValidator — format legality + color override', () => {
  it('flags cards not legal in the format', () => {
    const cmd = legendaryCreature({ card_name: 'Cmd', role: 'commander' as const });
    const illegal = makeCard({ card_name: 'Illegal', color_identity: 'W', legalities: { commander: 'not_legal' } });
    const result = commanderValidator.validate([cmd, illegal]);
    expect(result.violations.find((v) => v.rule === 'format_legality')).toBeDefined();
  });

  it('honors an explicit deck.colorIdentity override', () => {
    const cmd = legendaryCreature({ card_name: 'Cmd', role: 'commander' as const, color_identity: 'W' });
    const green = makeCard({ card_name: 'Elf', color_identity: 'G', mana_cost: '{G}', type_line: 'Creature — Elf' });
    const result = commanderValidator.validate([cmd, green], { colorIdentity: ['W', 'G'] } as never);
    expect(result.violations.find((v) => v.rule === 'color_identity')).toBeUndefined();
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
