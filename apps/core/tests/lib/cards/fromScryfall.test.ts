import { describe, it, expect } from 'vitest';
import { cardFromScryfall } from '@/lib/cards/fromScryfall';
import type { ScryfallCachedCard } from '@/lib/types';

function makeScryfallData(overrides: Partial<ScryfallCachedCard> = {}): ScryfallCachedCard {
  return {
    scryfall_id: 'scry-001',
    name: 'Lightning Bolt',
    image_uri: 'https://example.com/bolt.jpg',
    back_image_uri: null,
    colors: 'R',
    color_identity: 'R',
    type_line: 'Instant',
    mana_cost: '{R}',
    ...overrides,
  };
}

describe('cardFromScryfall', () => {
  it('sets card_name from the data.name when data is provided', () => {
    const card = cardFromScryfall('bolt', makeScryfallData({ name: 'Lightning Bolt' }));
    expect(card.card_name).toBe('Lightning Bolt');
  });

  it('falls back to the name argument when data is null', () => {
    const card = cardFromScryfall('My Custom Card', null);
    expect(card.card_name).toBe('My Custom Card');
  });

  it('sets is_proxy = true when proxy opt is true', () => {
    const card = cardFromScryfall('Lightning Bolt', makeScryfallData(), { proxy: true });
    expect(card.is_proxy).toBe(true);
  });

  it('sets is_proxy = false when proxy opt is false', () => {
    const card = cardFromScryfall('Lightning Bolt', makeScryfallData(), { proxy: false });
    expect(card.is_proxy).toBe(false);
  });

  it('defaults is_proxy to false when opts is omitted', () => {
    const card = cardFromScryfall('Lightning Bolt', makeScryfallData());
    expect(card.is_proxy).toBe(false);
  });

  it('maps image_uri from Scryfall data', () => {
    const card = cardFromScryfall('Bolt', makeScryfallData({ image_uri: 'https://example.com/img.jpg' }));
    expect(card.image_uri).toBe('https://example.com/img.jpg');
  });

  it('maps mana_cost from Scryfall data', () => {
    const card = cardFromScryfall('Bolt', makeScryfallData({ mana_cost: '{R}' }));
    expect(card.mana_cost).toBe('{R}');
  });

  it('maps type_line from Scryfall data', () => {
    const card = cardFromScryfall('Bolt', makeScryfallData({ type_line: 'Instant' }));
    expect(card.type_line).toBe('Instant');
  });

  it('maps color_identity from Scryfall data', () => {
    const card = cardFromScryfall('Bolt', makeScryfallData({ color_identity: 'R' }));
    expect(card.color_identity).toBe('R');
  });

  it('sets notFound = false when data is provided', () => {
    const card = cardFromScryfall('Bolt', makeScryfallData());
    expect(card.notFound).toBe(false);
  });

  it('sets notFound = true when data is null', () => {
    const card = cardFromScryfall('Unknown Card', null);
    expect(card.notFound).toBe(true);
  });

  it('sets is_commander = false', () => {
    const card = cardFromScryfall('Bolt', makeScryfallData());
    expect(card.is_commander).toBe(false);
  });

  it('sets quantity = 1', () => {
    const card = cardFromScryfall('Bolt', makeScryfallData());
    expect(card.quantity).toBe(1);
  });

  it('assigns a tempId (non-empty string)', () => {
    const card = cardFromScryfall('Bolt', makeScryfallData());
    expect(typeof card.tempId).toBe('string');
    expect(card.tempId!.length).toBeGreaterThan(0);
  });

  it('each call produces a unique tempId', () => {
    const a = cardFromScryfall('Bolt', makeScryfallData());
    const b = cardFromScryfall('Bolt', makeScryfallData());
    expect(a.tempId).not.toBe(b.tempId);
  });

  it('null data yields null image_uri', () => {
    const card = cardFromScryfall('Unknown', null);
    expect(card.image_uri).toBeNull();
  });

  it('null data yields null mana_cost', () => {
    const card = cardFromScryfall('Unknown', null);
    expect(card.mana_cost).toBeNull();
  });

  it('null data yields empty color_identity', () => {
    const card = cardFromScryfall('Unknown', null);
    expect(card.color_identity).toBe('');
  });
});
