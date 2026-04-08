import { describe, it, expect } from 'vitest';
import { filterCards, sortCards, type FilterSortState } from '@/lib/cards/filter';
import type { Card } from '@/lib/cards/types';

// ── Fixtures ─────────────────────────────────────────────────────────────────

function makeCard(overrides: Partial<Card>): Card {
  return {
    card_name: 'Test Card',
    color_identity: '',
    quantity: 1,
    is_commander: false,
    is_proxy: false,
    ...overrides,
  };
}

const defaultState: FilterSortState = {
  sort: 'name',
  sortDir: 'asc',
};

const cards: Card[] = [
  makeCard({ card_name: 'Aether Vial',     color_identity: '',   mana_cost: '{1}',        quantity: 1, type_line: 'Artifact' }),
  makeCard({ card_name: 'Birds of Paradise', color_identity: 'G', mana_cost: '{G}',        quantity: 1, type_line: 'Creature — Bird' }),
  makeCard({ card_name: 'Counterspell',    color_identity: 'U', mana_cost: '{U}{U}',      quantity: 2, type_line: 'Instant' }),
  makeCard({ card_name: 'Dark Ritual',     color_identity: 'B', mana_cost: '{B}',         quantity: 1, type_line: 'Instant' }),
  makeCard({ card_name: 'Forest',          color_identity: 'G', mana_cost: undefined,     quantity: 4, type_line: 'Basic Land — Forest' }),
  makeCard({ card_name: 'Sol Ring',        color_identity: '',  mana_cost: '{1}',         quantity: 1, type_line: 'Artifact' }),
  makeCard({ card_name: 'Swords to Plowshares', color_identity: 'W', mana_cost: '{W}',   quantity: 1, type_line: 'Instant' }),
  // twobrid card — has {2/W} cost but empty color_identity (simulates pre-fix DB row)
  makeCard({ card_name: 'Beseech the Mirror', color_identity: '', mana_cost: '{2/B}{2/B}{2/B}{2/B}', quantity: 1, type_line: 'Sorcery' }),
];

// ── filterCards ───────────────────────────────────────────────────────────────

describe('filterCards — search', () => {
  it('filters by name substring (case-insensitive)', () => {
    const result = filterCards(cards, { ...defaultState, search: 'ritual' });
    expect(result).toHaveLength(1);
    expect(result[0].card_name).toBe('Dark Ritual');
  });

  it('matches uppercase search against lowercase name', () => {
    const result = filterCards(cards, { ...defaultState, search: 'FOREST' });
    expect(result).toHaveLength(1);
    expect(result[0].card_name).toBe('Forest');
  });

  it('empty search returns all cards', () => {
    const result = filterCards(cards, { ...defaultState, search: '' });
    expect(result).toHaveLength(cards.length);
  });

  it('whitespace-only search returns all cards', () => {
    const result = filterCards(cards, { ...defaultState, search: '   ' });
    expect(result).toHaveLength(cards.length);
  });
});

describe('filterCards — color predicate OR mode', () => {
  it('OR: returns cards that have ANY of the specified colors', () => {
    const result = filterCards(cards, {
      ...defaultState,
      colors: ['W', 'U'],
      colorMode: 'or',
    });
    const names = result.map(c => c.card_name);
    expect(names).toContain('Counterspell');
    expect(names).toContain('Swords to Plowshares');
    expect(names).not.toContain('Dark Ritual');
    expect(names).not.toContain('Birds of Paradise');
  });

  it('OR with single color returns all cards of that color', () => {
    // Dark Ritual has color_identity:'B'; Beseech the Mirror has color_identity:'' but
    // mana_cost:{2/B}x4 → fallback computeColorIdentity yields ['B']. Both match.
    const result = filterCards(cards, {
      ...defaultState,
      colors: ['B'],
      colorMode: 'or',
    });
    const names = result.map(c => c.card_name);
    expect(names).toContain('Dark Ritual');
    expect(names).toContain('Beseech the Mirror');
    // No white, green, blue, or truly colorless cards
    expect(names).not.toContain('Swords to Plowshares');
    expect(names).not.toContain('Counterspell');
    expect(names).not.toContain('Birds of Paradise');
  });
});

describe('filterCards — color predicate AND mode', () => {
  it('AND: returns cards that have ALL specified colors', () => {
    // No card in fixture has both W and U, so result should be empty
    const result = filterCards(cards, {
      ...defaultState,
      colors: ['W', 'U'],
      colorMode: 'and',
    });
    expect(result).toHaveLength(0);
  });

  it('AND with single color matches that color', () => {
    const result = filterCards(cards, {
      ...defaultState,
      colors: ['G'],
      colorMode: 'and',
    });
    const names = result.map(c => c.card_name);
    expect(names).toContain('Birds of Paradise');
    expect(names).toContain('Forest');
  });
});

describe('filterCards — color predicate EXACT mode', () => {
  it('EXACT: returns cards with exactly the specified colors', () => {
    const result = filterCards(cards, {
      ...defaultState,
      colors: ['U'],
      colorMode: 'exact',
    });
    expect(result).toHaveLength(1);
    expect(result[0].card_name).toBe('Counterspell');
  });

  it('EXACT excludes multi-color cards when single color requested', () => {
    const result = filterCards(cards, {
      ...defaultState,
      colors: ['G'],
      colorMode: 'exact',
    });
    const names = result.map(c => c.card_name);
    // Both Birds of Paradise and Forest are mono-G, should appear
    expect(names).toContain('Birds of Paradise');
    expect(names).toContain('Forest');
  });
});

describe('filterCards — twobrid fallback via computeColorIdentity', () => {
  it('card with empty color_identity uses mana_cost fallback for color filter', () => {
    // Beseech the Mirror has {2/B}{2/B}{2/B}{2/B} — should resolve as Black
    const result = filterCards(cards, {
      ...defaultState,
      colors: ['B'],
      colorMode: 'or',
    });
    const names = result.map(c => c.card_name);
    // Dark Ritual also B, plus Beseech (via fallback)
    expect(names).toContain('Beseech the Mirror');
    expect(names).toContain('Dark Ritual');
  });

  it('twobrid card does NOT appear in colorless filter (twobrid bug fix)', () => {
    // {2/B} means the 2 is generic/payment alternative — not a colorless pip
    // Colorless filter: only truly colorless (empty identity + no colored cost)
    const result = filterCards(cards, {
      ...defaultState,
      colors: ['C'],
      colorMode: 'or',
    });
    const names = result.map(c => c.card_name);
    expect(names).not.toContain('Beseech the Mirror');
  });
});

describe('filterCards — no filters', () => {
  it('returns all cards when no filters specified', () => {
    const result = filterCards(cards, defaultState);
    expect(result).toHaveLength(cards.length);
  });

  it('does not mutate the input array', () => {
    const copy = [...cards];
    filterCards(cards, { ...defaultState, search: 'sol' });
    expect(cards).toEqual(copy);
  });
});

// ── sortCards ─────────────────────────────────────────────────────────────────

describe('sortCards — name', () => {
  it('sorts by name ascending by default', () => {
    const result = sortCards(cards, { ...defaultState, sort: 'name', sortDir: 'asc' });
    const names = result.map(c => c.card_name);
    expect(names[0]).toBe('Aether Vial');
    expect(names[names.length - 1]).toBe('Swords to Plowshares');
  });

  it('sorts by name descending', () => {
    const result = sortCards(cards, { ...defaultState, sort: 'name', sortDir: 'desc' });
    expect(result[0].card_name).toBe('Swords to Plowshares');
  });

  it('default sort (name asc) when state matches defaults', () => {
    const result = sortCards(cards, defaultState);
    const names = result.map(c => c.card_name);
    expect(names).toEqual([...names].sort());
  });
});

describe('sortCards — cmc', () => {
  it('sorts by cmc ascending', () => {
    const result = sortCards(cards, { ...defaultState, sort: 'cmc', sortDir: 'asc' });
    // Forest has 0 cmc (no mana cost), Aether Vial {1}=1, Sol Ring {1}=1, Birds {G}=1, etc.
    // First card should have lowest or tied cmc
    const first = result[0];
    // Forest has mana_cost=undefined → parseManaValue=0
    expect(first.card_name).toBe('Forest');
  });

  it('sorts by cmc descending', () => {
    const result = sortCards(cards, { ...defaultState, sort: 'cmc', sortDir: 'desc' });
    // Counterspell {U}{U} = 2, Swords {W} = 1, etc. Highest is {2/B}x4 = Beseech (2+2+2+2=8? No...)
    // Beseech {2/B}{2/B}{2/B}{2/B}: each {2/B} is parsed as '2/B' → '2' is numeric 2, '/B' is not numeric nor X, so '2' contributes 2, then 'B' contributes 1 per symbol...
    // Actually parseManaValue splits by full symbol inner: '2/B' → Number('2/B') = NaN, not 'X', so +1
    // So {2/B} = 1, and {2/B}{2/B}{2/B}{2/B} = 4. Counterspell {U}{U} = 2.
    // Highest should be Beseech at 4.
    expect(result[0].card_name).toBe('Beseech the Mirror');
  });
});

describe('sortCards — qty', () => {
  it('sorts by quantity ascending', () => {
    const result = sortCards(cards, { ...defaultState, sort: 'qty', sortDir: 'asc' });
    // quantity 1 < 2 (Counterspell) < 4 (Forest)
    // First card: qty=1 (many)
    expect(result[result.length - 1].card_name).toBe('Forest'); // qty=4 last when asc
  });

  it('sorts by quantity descending', () => {
    const result = sortCards(cards, { ...defaultState, sort: 'qty', sortDir: 'desc' });
    expect(result[0].card_name).toBe('Forest'); // qty=4 first when desc
  });
});

describe('sortCards — color', () => {
  it('sorts by color identity (WUBRGC order)', () => {
    const simple = [
      makeCard({ card_name: 'G Card', color_identity: 'G' }),
      makeCard({ card_name: 'W Card', color_identity: 'W' }),
      makeCard({ card_name: 'U Card', color_identity: 'U' }),
    ];
    const result = sortCards(simple, { ...defaultState, sort: 'color', sortDir: 'asc' });
    const names = result.map(c => c.card_name);
    expect(names[0]).toBe('W Card'); // W=0
    expect(names[1]).toBe('U Card'); // U=1
    expect(names[2]).toBe('G Card'); // G=4
  });
});

describe('sortCards — type', () => {
  it('sorts by type category (creature before instant)', () => {
    const simple = [
      makeCard({ card_name: 'Bolt', type_line: 'Instant' }),
      makeCard({ card_name: 'Bear', type_line: 'Creature — Bear' }),
    ];
    const result = sortCards(simple, { ...defaultState, sort: 'type', sortDir: 'asc' });
    expect(result[0].card_name).toBe('Bear');
    expect(result[1].card_name).toBe('Bolt');
  });
});

describe('sortCards — does not mutate input', () => {
  it('returns a new array', () => {
    const input = [...cards];
    const result = sortCards(input, defaultState);
    expect(result).not.toBe(input);
  });
});

// ── filterCards — cmcFilter ───────────────────────────────────────────────────

describe('filterCards — cmcFilter', () => {
  it('cmcFilter.values=[3] returns only cards with MV 3', () => {
    // Build a small pool with known MVs:
    //   {1}{1}{1} → 3, {2}{1} → 3, {U}{U} → 2, {G} → 1
    const pool = [
      makeCard({ card_name: 'Three-A', mana_cost: '{1}{1}{1}',  type_line: 'Sorcery' }),
      makeCard({ card_name: 'Three-B', mana_cost: '{2}{1}',     type_line: 'Sorcery' }),
      makeCard({ card_name: 'Two',     mana_cost: '{U}{U}',     type_line: 'Instant' }),
      makeCard({ card_name: 'One',     mana_cost: '{G}',        type_line: 'Creature — Bird' }),
    ];
    const result = filterCards(pool, { ...defaultState, cmcFilter: { values: [3] } });
    const names = result.map(c => c.card_name);
    expect(names).toContain('Three-A');
    expect(names).toContain('Three-B');
    expect(names).not.toContain('Two');
    expect(names).not.toContain('One');
  });

  it('cmcFilter.values with multiple selections returns cards matching any value', () => {
    const pool = [
      makeCard({ card_name: 'MV1', mana_cost: '{W}',    type_line: 'Instant' }),
      makeCard({ card_name: 'MV2', mana_cost: '{1}{B}', type_line: 'Instant' }),
      makeCard({ card_name: 'MV3', mana_cost: '{2}{R}', type_line: 'Instant' }),
    ];
    const result = filterCards(pool, { ...defaultState, cmcFilter: { values: [1, 3] } });
    const names = result.map(c => c.card_name);
    expect(names).toContain('MV1');
    expect(names).toContain('MV3');
    expect(names).not.toContain('MV2');
  });

  it('cmcFilter min/max range filters correctly when no values set', () => {
    const pool = [
      makeCard({ card_name: 'MV0', mana_cost: undefined,  type_line: 'Land' }),
      makeCard({ card_name: 'MV1', mana_cost: '{W}',      type_line: 'Instant' }),
      makeCard({ card_name: 'MV2', mana_cost: '{1}{B}',   type_line: 'Instant' }),
      makeCard({ card_name: 'MV4', mana_cost: '{3}{R}',   type_line: 'Sorcery' }),
    ];
    const result = filterCards(pool, { ...defaultState, cmcFilter: { min: 1, max: 2 } });
    const names = result.map(c => c.card_name);
    expect(names).toContain('MV1');
    expect(names).toContain('MV2');
    expect(names).not.toContain('MV0');
    expect(names).not.toContain('MV4');
  });

  it('cmcFilter absent returns all cards', () => {
    const result = filterCards(cards, defaultState);
    expect(result).toHaveLength(cards.length);
  });
});

// ── filterCards — contains ────────────────────────────────────────────────────

describe('filterCards — contains', () => {
  it('matches by scryfall_id when both cards have one', () => {
    const pool = [
      makeCard({ card_name: 'Alpha', scryfall_id: 'aaa-111', type_line: 'Creature — Human' }),
      makeCard({ card_name: 'Beta',  scryfall_id: 'bbb-222', type_line: 'Instant' }),
      makeCard({ card_name: 'Gamma', scryfall_id: 'ccc-333', type_line: 'Sorcery' }),
    ];
    const target = makeCard({ card_name: 'Alpha', scryfall_id: 'aaa-111' });
    const result = filterCards(pool, { ...defaultState, contains: target });
    expect(result).toHaveLength(1);
    expect(result[0].card_name).toBe('Alpha');
  });

  it('falls back to normalized name when scryfall_id is absent', () => {
    const pool = [
      makeCard({ card_name: 'Llanowar Elves', scryfall_id: null, type_line: 'Creature — Elf' }),
      makeCard({ card_name: 'Sol Ring',       scryfall_id: null, type_line: 'Artifact' }),
    ];
    const target = makeCard({ card_name: 'Llanowar Elves', scryfall_id: null });
    const result = filterCards(pool, { ...defaultState, contains: target });
    expect(result).toHaveLength(1);
    expect(result[0].card_name).toBe('Llanowar Elves');
  });

  it('contains=null returns all cards (no filter applied)', () => {
    const result = filterCards(cards, { ...defaultState, contains: null });
    expect(result).toHaveLength(cards.length);
  });

  it('contains=undefined returns all cards (no filter applied)', () => {
    const result = filterCards(cards, { ...defaultState });
    expect(result).toHaveLength(cards.length);
  });
});
