import { describe, it, expect } from 'vitest';
import {
  STATS_SECTIONS,
  DEFAULT_SECTION_ORDER,
  VALID_SECTION_IDS,
  getSectionDef,
} from '@/app/lib/statsSections';

describe('getSectionDef', () => {
  it('returns correct definition for "overall"', () => {
    const def = getSectionDef('overall');
    expect(def).toBeDefined();
    expect(def!.id).toBe('overall');
    expect(def!.label).toBe('Overall Stats');
  });

  it('returns correct definition for "h2h"', () => {
    const def = getSectionDef('h2h');
    expect(def).toBeDefined();
    expect(def!.id).toBe('h2h');
    expect(def!.label).toBe('Head-to-Head');
  });

  it('returns correct definition for "colorMeta"', () => {
    const def = getSectionDef('colorMeta');
    expect(def).toBeDefined();
    expect(def!.label).toBe('Color Meta Analysis');
  });

  it('returns undefined for an id not in the list', () => {
    // Cast to any to test runtime behavior with invalid id
    expect(getSectionDef('nonexistent' as never)).toBeUndefined();
  });
});

describe('VALID_SECTION_IDS', () => {
  it('contains all 13 section IDs', () => {
    expect(VALID_SECTION_IDS.size).toBe(13);
  });

  it('contains "overall"', () => {
    expect(VALID_SECTION_IDS.has('overall')).toBe(true);
  });

  it('contains "deckStreaks"', () => {
    expect(VALID_SECTION_IDS.has('deckStreaks')).toBe(true);
  });

  it('does not contain "nonexistent"', () => {
    expect(VALID_SECTION_IDS.has('nonexistent')).toBe(false);
  });
});

describe('DEFAULT_SECTION_ORDER', () => {
  it('has 13 entries', () => {
    expect(DEFAULT_SECTION_ORDER).toHaveLength(13);
  });

  it('starts with "overall"', () => {
    expect(DEFAULT_SECTION_ORDER[0]).toBe('overall');
  });

  it('ends with "deckStreaks"', () => {
    expect(DEFAULT_SECTION_ORDER[DEFAULT_SECTION_ORDER.length - 1]).toBe('deckStreaks');
  });
});

describe('STATS_SECTIONS', () => {
  it('has 13 entries', () => {
    expect(STATS_SECTIONS).toHaveLength(13);
  });

  it('all entries have required fields', () => {
    for (const s of STATS_SECTIONS) {
      expect(s.id).toBeTruthy();
      expect(s.label).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(s.icon).toBeDefined();
    }
  });

  it('all IDs match a VALID_SECTION_IDS entry', () => {
    for (const s of STATS_SECTIONS) {
      expect(VALID_SECTION_IDS.has(s.id)).toBe(true);
    }
  });
});
