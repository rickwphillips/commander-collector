import { describe, it, expect } from 'vitest';
import { tempId } from '@/lib/cards/tempId';

describe('tempId', () => {
  it('returns a string', () => {
    expect(typeof tempId()).toBe('string');
  });

  it('returns a non-empty string', () => {
    expect(tempId().length).toBeGreaterThan(0);
  });

  it('two consecutive calls return different values', () => {
    const a = tempId();
    const b = tempId();
    // Statistically extremely unlikely to collide; Math.random gives ~11 chars of base-36
    expect(a).not.toBe(b);
  });

  it('returns a base-36 alphanumeric string (no special chars)', () => {
    const id = tempId();
    expect(id).toMatch(/^[a-z0-9]+$/);
  });
});
