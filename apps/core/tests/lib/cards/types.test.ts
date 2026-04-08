import { describe, it, expect } from 'vitest';
import { fromApiCard, toApiCard, type ApiCardRow, type Card } from '@/lib/cards/types';

// Minimal valid ApiCardRow for tests
function makeRow(overrides: Partial<ApiCardRow> = {}): ApiCardRow {
  return {
    card_name: 'Lightning Bolt',
    scryfall_id: 'abc-123',
    quantity: 1,
    is_commander: 0,
    is_proxy: 0,
    ...overrides,
  };
}

// Minimal valid Card for tests
function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    card_name: 'Lightning Bolt',
    scryfall_id: 'abc-123',
    color_identity: 'R',
    quantity: 1,
    is_commander: false,
    is_proxy: false,
    ...overrides,
  };
}

describe('fromApiCard', () => {
  it('converts is_commander 0 → false', () => {
    const card = fromApiCard(makeRow({ is_commander: 0 }));
    expect(card.is_commander).toBe(false);
  });

  it('converts is_commander 1 → true', () => {
    const card = fromApiCard(makeRow({ is_commander: 1 }));
    expect(card.is_commander).toBe(true);
  });

  it('converts is_proxy 0 → false', () => {
    const card = fromApiCard(makeRow({ is_proxy: 0 }));
    expect(card.is_proxy).toBe(false);
  });

  it('converts is_proxy 1 → true', () => {
    const card = fromApiCard(makeRow({ is_proxy: 1 }));
    expect(card.is_proxy).toBe(true);
  });

  it('converts is_custom 0 → false when present', () => {
    const card = fromApiCard(makeRow({ is_custom: 0 }));
    expect(card.is_custom).toBe(false);
  });

  it('converts is_custom 1 → true when present', () => {
    const card = fromApiCard(makeRow({ is_custom: 1 }));
    expect(card.is_custom).toBe(true);
  });

  it('omits is_custom when not in row', () => {
    const card = fromApiCard(makeRow());
    expect(card.is_custom).toBeUndefined();
  });

  it('passes through role = commander', () => {
    const card = fromApiCard(makeRow({ role: 'commander' }));
    expect(card.role).toBe('commander');
  });

  it('passes through role = partner', () => {
    const card = fromApiCard(makeRow({ role: 'partner' }));
    expect(card.role).toBe('partner');
  });

  it('omits role when null in row', () => {
    const card = fromApiCard(makeRow({ role: null }));
    expect(card.role).toBeUndefined();
  });

  it('falls back to empty string for missing color_identity', () => {
    const card = fromApiCard(makeRow({ color_identity: undefined }));
    expect(card.color_identity).toBe('');
  });

  it('passes card_name through unchanged', () => {
    const card = fromApiCard(makeRow({ card_name: 'Forest' }));
    expect(card.card_name).toBe('Forest');
  });
});

describe('toApiCard', () => {
  it('converts is_commander false → 0', () => {
    const row = toApiCard(makeCard({ is_commander: false }));
    expect(row.is_commander).toBe(0);
  });

  it('converts is_commander true → 1', () => {
    const row = toApiCard(makeCard({ is_commander: true }));
    expect(row.is_commander).toBe(1);
  });

  it('converts is_proxy false → 0', () => {
    const row = toApiCard(makeCard({ is_proxy: false }));
    expect(row.is_proxy).toBe(0);
  });

  it('converts is_proxy true → 1', () => {
    const row = toApiCard(makeCard({ is_proxy: true }));
    expect(row.is_proxy).toBe(1);
  });

  it('converts is_custom false → 0 when present', () => {
    const row = toApiCard(makeCard({ is_custom: false }));
    expect(row.is_custom).toBe(0);
  });

  it('converts is_custom true → 1 when present', () => {
    const row = toApiCard(makeCard({ is_custom: true }));
    expect(row.is_custom).toBe(1);
  });

  it('omits is_custom when undefined', () => {
    const row = toApiCard(makeCard({ is_custom: undefined }));
    expect(row.is_custom).toBeUndefined();
  });

  it('passes role through when present', () => {
    const row = toApiCard(makeCard({ role: 'commander' }));
    expect(row.role).toBe('commander');
  });

  it('drops tempId and notFound (client-only fields)', () => {
    const card = makeCard({ notFound: true });
    // tempId is on Card interface; cast needed to attach it
    (card as Card & { tempId: string }).tempId = 'tmp-abc';
    const row = toApiCard(card);
    expect((row as unknown as Record<string, unknown>)['tempId']).toBeUndefined();
    expect((row as unknown as Record<string, unknown>)['notFound']).toBeUndefined();
  });
});

describe('fromApiCard → toApiCard round-trip', () => {
  it('boolean flags survive a round trip (0 → false → 0)', () => {
    const row = makeRow({ is_commander: 0, is_proxy: 0 });
    const card = fromApiCard(row);
    const back = toApiCard(card);
    expect(back.is_commander).toBe(0);
    expect(back.is_proxy).toBe(0);
  });

  it('boolean flags survive a round trip (1 → true → 1)', () => {
    const row = makeRow({ is_commander: 1, is_proxy: 1 });
    const card = fromApiCard(row);
    const back = toApiCard(card);
    expect(back.is_commander).toBe(1);
    expect(back.is_proxy).toBe(1);
  });

  it('role field passes through the round trip', () => {
    const row = makeRow({ role: 'commander' });
    const card = fromApiCard(row);
    const back = toApiCard(card);
    expect(back.role).toBe('commander');
  });

  it('core string fields survive the round trip', () => {
    const row = makeRow({ card_name: 'Counterspell', scryfall_id: 'xyz-999' });
    const card = fromApiCard(row);
    const back = toApiCard(card);
    expect(back.card_name).toBe('Counterspell');
    expect(back.scryfall_id).toBe('xyz-999');
  });
});
