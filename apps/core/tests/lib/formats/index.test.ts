import { describe, it, expect } from 'vitest';
import { getValidator, validate } from '@/lib/formats/index';
import { commanderValidator } from '@/lib/formats/commander';
import type { ValidationResult } from '@/lib/formats/types';

describe('getValidator', () => {
  it('returns commanderValidator for "commander" format', () => {
    const v = getValidator('commander');
    expect(v).toBe(commanderValidator);
  });

  it('returns commanderValidator for unknown format (default fallback)', () => {
    const v = getValidator('unknown-format');
    expect(v).toBe(commanderValidator);
  });

  it('returns commanderValidator when no format arg provided', () => {
    const v = getValidator();
    expect(v).toBe(commanderValidator);
  });
});

describe('validate', () => {
  it('returns a ValidationResult shape for commander format with empty cards', () => {
    const result = validate('commander', [], undefined);
    // Shape assertions
    expect(typeof result.legal).toBe('boolean');
    expect(result.format).toBe('commander');
    expect(Array.isArray(result.violations)).toBe(true);
  });

  it('returns legal: false for empty cards (no commander set)', () => {
    const result: ValidationResult = validate('commander', []);
    expect(result.legal).toBe(false);
  });

  it('delegates to commanderValidator for unknown format', () => {
    const result = validate('brawl', []);
    // Should behave identically to commander validation
    const expected = commanderValidator.validate([]);
    expect(result.legal).toBe(expected.legal);
    expect(result.format).toBe(expected.format);
  });
});
