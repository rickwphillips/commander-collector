import { describe, it, expect } from 'vitest';
import { categorizeByType } from '@/lib/cards/categorize';

describe('categorizeByType', () => {
  it('classifies a Creature type line as creature', () => {
    expect(categorizeByType('Creature — Human Wizard')).toBe('creature');
  });

  it('classifies a Planeswalker type line as planeswalker', () => {
    expect(categorizeByType('Legendary Planeswalker — Jace')).toBe('planeswalker');
  });

  it('classifies an Instant type line as instant', () => {
    expect(categorizeByType('Instant')).toBe('instant');
  });

  it('classifies a Sorcery type line as sorcery', () => {
    expect(categorizeByType('Sorcery')).toBe('sorcery');
  });

  it('classifies an Enchantment type line as enchantment', () => {
    expect(categorizeByType('Enchantment — Aura')).toBe('enchantment');
  });

  it('classifies an Artifact type line as artifact', () => {
    expect(categorizeByType('Artifact — Equipment')).toBe('artifact');
  });

  it('classifies a Land type line as land', () => {
    expect(categorizeByType('Basic Land — Forest')).toBe('land');
  });

  it('classifies a Battle type line as battle', () => {
    expect(categorizeByType('Battle — Siege')).toBe('battle');
  });

  it('classifies an unrecognized type line as other', () => {
    // "Emblem" matches none of the checked keywords
    expect(categorizeByType('Emblem — Jace')).toBe('other');
  });

  it('returns other for null', () => {
    expect(categorizeByType(null)).toBe('other');
  });

  it('returns other for undefined', () => {
    expect(categorizeByType(undefined)).toBe('other');
  });

  it('returns other for empty string', () => {
    expect(categorizeByType('')).toBe('other');
  });

  it('priority: Artifact Creature → creature beats artifact', () => {
    expect(categorizeByType('Legendary Artifact Creature — Golem')).toBe('creature');
  });

  it('priority: Enchantment Creature → creature beats enchantment', () => {
    expect(categorizeByType('Enchantment Creature — Nymph')).toBe('creature');
  });

  it('priority: Artifact Land → land beats artifact', () => {
    // Land check comes BEFORE Artifact in the priority list
    // Wait — looking at the source: Creature > Planeswalker > Battle > Land > Instant > Sorcery > Enchantment > Artifact
    // So "Artifact Land" → land (Land check fires before Artifact check)
    expect(categorizeByType('Artifact Land')).toBe('land');
  });

  it('all category results are lowercase strings', () => {
    const inputs = [
      'Creature',
      'Planeswalker',
      'Instant',
      'Sorcery',
      'Enchantment',
      'Artifact',
      'Land',
      'Battle',
      'Token',
    ];
    for (const tl of inputs) {
      const result = categorizeByType(tl);
      expect(result).toBe(result.toLowerCase());
    }
  });
});
