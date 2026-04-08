import { describe, it, expect } from 'vitest';
import { mergeIntoBuffer } from '@/lib/cards/mergeIntoBuffer';
import type { Card } from '@/lib/cards/types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeCard(name: string, overrides: Partial<Card> = {}): Card {
  return {
    card_name: name,
    quantity: 1,
    color_identity: 'C',
    is_commander: false,
    is_proxy: false,
    scryfall_id: `sf-${name.replace(/\s/g, '-').toLowerCase()}`,
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('mergeIntoBuffer', () => {
  // ── Rule 2: singleton ON, scryfall_id match ──────────────────────────────

  it('singleton ON + scryfall_id match → emits duplicate, buffer unchanged', () => {
    const existing = makeCard('Sol Ring', { scryfall_id: 'sr-001', quantity: 1 });
    const incoming = makeCard('Sol Ring', { scryfall_id: 'sr-001', quantity: 1 });

    const { merged, events } = mergeIntoBuffer([existing], [incoming], true);

    expect(merged).toHaveLength(1);
    expect(merged[0].quantity).toBe(1); // unchanged
    expect(events).toHaveLength(1);
    expect(events[0].kind).toBe('duplicate');
    expect(events[0].card.card_name).toBe('Sol Ring');
  });

  // ── Rule 2: singleton OFF, scryfall_id match → increments qty ───────────

  it('singleton OFF + scryfall_id match → increments buffer row qty, emits incremented', () => {
    const existing = makeCard('Sol Ring', { scryfall_id: 'sr-001', quantity: 2 });
    const incoming = makeCard('Sol Ring', { scryfall_id: 'sr-001', quantity: 1 });

    const { merged, events } = mergeIntoBuffer([existing], [incoming], false);

    expect(merged).toHaveLength(1);
    expect(merged[0].quantity).toBe(3);
    expect(events).toHaveLength(1);
    expect(events[0].kind).toBe('incremented');
  });

  // ── Rule 1: basic land singleton ON → still increments ──────────────────

  it('basic land (Forest) + singleton ON → always increments, no events', () => {
    const existing = makeCard('Forest', { scryfall_id: 'forest-001', quantity: 3 });
    const incoming = makeCard('Forest', { scryfall_id: 'forest-001', quantity: 2 });

    const { merged, events } = mergeIntoBuffer([existing], [incoming], true);

    expect(merged).toHaveLength(1);
    expect(merged[0].quantity).toBe(5); // incremented, not deduped
    expect(events).toHaveLength(0);     // no events — basic lands are exempt
  });

  it('basic land with no existing row → adds new row', () => {
    const incoming = makeCard('Plains', { scryfall_id: 'plains-001', quantity: 4 });

    const { merged, events } = mergeIntoBuffer([], [incoming], true);

    expect(merged).toHaveLength(1);
    expect(merged[0].quantity).toBe(4);
    expect(events).toHaveLength(0);
  });

  // ── Rule 3: name fallback match → emits name-fallback-warn, buffer unchanged

  it('name-fallback match (no scryfall_id on incoming) → emits name-fallback-warn, buffer unchanged', () => {
    const existing = makeCard('Sol Ring', { scryfall_id: 'sr-001', quantity: 1 });
    // Incoming has no scryfall_id — triggers name-fallback path
    const incoming = makeCard('Sol Ring', { scryfall_id: null, quantity: 1 });

    const { merged, events } = mergeIntoBuffer([existing], [incoming], true);

    expect(merged).toHaveLength(1);
    expect(merged[0].quantity).toBe(1); // buffer unchanged — caller resolves
    expect(events).toHaveLength(1);
    expect(events[0].kind).toBe('name-fallback-warn');
    expect(events[0].card.card_name).toBe('Sol Ring');
    expect(events[0].existingCard?.card_name).toBe('Sol Ring');
  });

  it('name-fallback — no buffer match → card is added as new row, no events', () => {
    const existing = makeCard('Black Lotus', { scryfall_id: 'bl-001', quantity: 1 });
    const incoming = makeCard('Sol Ring', { scryfall_id: null, quantity: 1 });

    const { merged, events } = mergeIntoBuffer([existing], [incoming], true);

    expect(merged).toHaveLength(2);
    expect(events).toHaveLength(0);
  });

  // ── Rule 4: printing variation, singleton ON → merged-printing ───────────

  it('printing variation (same name, different scryfall_id) + singleton ON → merges into existing, emits merged-printing', () => {
    const existing = makeCard('Lightning Bolt', { scryfall_id: 'lb-alpha', quantity: 1 });
    const incoming = makeCard('Lightning Bolt', { scryfall_id: 'lb-m10', quantity: 1 });

    const { merged, events } = mergeIntoBuffer([existing], [incoming], true);

    expect(merged).toHaveLength(1);
    expect(merged[0].quantity).toBe(2); // summed
    expect(merged[0].scryfall_id).toBe('lb-alpha'); // existing row kept
    expect(events).toHaveLength(1);
    expect(events[0].kind).toBe('merged-printing');
  });

  // ── Rule 4: printing variation, singleton OFF → kept as separate rows ────

  it('printing variation + singleton OFF → kept as separate rows, no events', () => {
    const existing = makeCard('Lightning Bolt', { scryfall_id: 'lb-alpha', quantity: 1 });
    const incoming = makeCard('Lightning Bolt', { scryfall_id: 'lb-m10', quantity: 1 });

    const { merged, events } = mergeIntoBuffer([existing], [incoming], false);

    expect(merged).toHaveLength(2);
    expect(merged[0].scryfall_id).toBe('lb-alpha');
    expect(merged[1].scryfall_id).toBe('lb-m10');
    expect(events).toHaveLength(0);
  });

  // ── No match: brand-new card ─────────────────────────────────────────────

  it('card with no match in buffer → added as new row, no events', () => {
    const existing = makeCard('Sol Ring', { scryfall_id: 'sr-001', quantity: 1 });
    const incoming = makeCard('Black Lotus', { scryfall_id: 'bl-001', quantity: 1 });

    const { merged, events } = mergeIntoBuffer([existing], [incoming], true);

    expect(merged).toHaveLength(2);
    expect(events).toHaveLength(0);
  });

  // ── Multiple incoming cards: batch processing ────────────────────────────

  it('processes multiple incoming cards independently', () => {
    const existingSolRing = makeCard('Sol Ring', { scryfall_id: 'sr-001', quantity: 1 });
    const incomingSolRing  = makeCard('Sol Ring', { scryfall_id: 'sr-001', quantity: 1 }); // duplicate
    const incomingNewCard  = makeCard('Black Lotus', { scryfall_id: 'bl-001', quantity: 1 }); // new

    const { merged, events } = mergeIntoBuffer(
      [existingSolRing],
      [incomingSolRing, incomingNewCard],
      true, // singleton
    );

    expect(merged).toHaveLength(2); // sol ring unchanged + black lotus added
    expect(merged[0].quantity).toBe(1);
    expect(events).toHaveLength(1);
    expect(events[0].kind).toBe('duplicate');
  });

  // ── Buffer immutability ──────────────────────────────────────────────────

  it('does not mutate the original buffer array', () => {
    const original = makeCard('Sol Ring', { scryfall_id: 'sr-001', quantity: 1 });
    const buffer = [original];
    const incoming = makeCard('Sol Ring', { scryfall_id: 'sr-001', quantity: 1 });

    mergeIntoBuffer(buffer, [incoming], false);

    // original reference and buffer array are unchanged
    expect(buffer).toHaveLength(1);
    expect(buffer[0].quantity).toBe(1);
  });

  // ── Normalize: case-insensitive name fallback ────────────────────────────

  it('name-fallback normalize is case-insensitive', () => {
    const existing = makeCard('Sol Ring', { scryfall_id: 'sr-001', quantity: 1 });
    // Incoming has different casing and no scryfall_id
    const incoming = makeCard('sol ring', { scryfall_id: null, quantity: 1 });

    const { events } = mergeIntoBuffer([existing], [incoming], true);

    expect(events).toHaveLength(1);
    expect(events[0].kind).toBe('name-fallback-warn');
  });

  // ── Basic land: different scryfall_id → new row (different printing) ─────

  it('basic land with different scryfall_id → adds new row', () => {
    const existing = makeCard('Forest', { scryfall_id: 'forest-001', quantity: 3 });
    const incoming = makeCard('Forest', { scryfall_id: 'forest-002', quantity: 2 }); // different printing

    const { merged, events } = mergeIntoBuffer([existing], [incoming], true);

    // Basic lands bypass dedup entirely — new row added regardless of singleton
    expect(merged).toHaveLength(2);
    expect(events).toHaveLength(0);
  });
});
