/**
 * Regression tests for color name consolidation.
 *
 * Verifies that consumers of COLOR_NAMES still produce correct labels
 * after switching from inline constants to shared imports.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// ── Mock next/image since ManaSymbol uses it ────────────────────────────────
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => (
    <img {...props} src={props.src as string} alt={props.alt as string} />
  ),
}));

// ── Imports (after mocks) ───────────────────────────────────────────────────
import { COLOR_NAMES, COLOR_NAMES_LOWER } from '@/lib/utils';

// Shared ManaSymbol uses COLOR_NAMES for tooltip labels
import { ManaSymbol as SharedManaSymbol } from '../../../../packages/shared/src/components/ManaSymbol';

// Core ManaSymbol extends COLOR_NAMES with hybrid/Phyrexian names
import { ManaSymbol as CoreManaSymbol } from '@/components/ManaSymbol';

describe('COLOR_NAMES regression — shared ManaSymbol', () => {
  it.each([
    ['W', 'White'],
    ['U', 'Blue'],
    ['B', 'Black'],
    ['R', 'Red'],
    ['G', 'Green'],
    ['C', 'Colorless'],
  ])('tooltip for %s shows "%s"', (color, expectedLabel) => {
    render(<SharedManaSymbol color={color} />);
    expect(screen.getByLabelText(expectedLabel)).toBeInTheDocument();
  });

  it('unknown color falls back to code', () => {
    render(<SharedManaSymbol color="X" />);
    expect(screen.getByAltText('X')).toBeInTheDocument();
  });
});

describe('COLOR_NAMES regression — core ManaSymbol', () => {
  it.each([
    ['W', 'White'],
    ['U', 'Blue'],
    ['B', 'Black'],
    ['R', 'Red'],
    ['G', 'Green'],
    ['C', 'Colorless'],
  ])('base color %s shows "%s"', (color, expectedLabel) => {
    render(<CoreManaSymbol color={color} />);
    expect(screen.getByLabelText(expectedLabel)).toBeInTheDocument();
  });

  it.each([
    ['WU', 'White/Blue Hybrid'],
    ['BR', 'Black/Red Hybrid'],
    ['WP', 'Phyrexian White'],
    ['GP', 'Phyrexian Green'],
    ['2W', '2/White Hybrid'],
  ])('extended color %s shows "%s"', (color, expectedLabel) => {
    render(<CoreManaSymbol color={color} />);
    expect(screen.getByLabelText(expectedLabel)).toBeInTheDocument();
  });
});

describe('COLOR_NAMES_LOWER regression — QuerySentence usage', () => {
  it.each([
    ['W', 'white'],
    ['U', 'blue'],
    ['B', 'black'],
    ['R', 'red'],
    ['G', 'green'],
    ['C', 'colorless'],
  ])('%s maps to lowercase "%s"', (color, expected) => {
    expect(COLOR_NAMES_LOWER[color]).toBe(expected);
  });
});

describe('COLOR_NAMES consistency', () => {
  it('core utils and shared utils export identical COLOR_NAMES', async () => {
    const shared = await import('../../../../packages/shared/src/lib/utils');
    expect(COLOR_NAMES).toEqual(shared.COLOR_NAMES);
  });

  it('core utils and shared utils export identical COLOR_NAMES_LOWER', async () => {
    const shared = await import('../../../../packages/shared/src/lib/utils');
    expect(COLOR_NAMES_LOWER).toEqual(shared.COLOR_NAMES_LOWER);
  });
});
