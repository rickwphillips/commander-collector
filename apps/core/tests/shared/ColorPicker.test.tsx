import { describe, it, expect } from 'vitest';
import { toggleColorSelection } from '../../../../packages/shared/src/components/ColorPicker';

describe('toggleColorSelection', () => {
  it('adds a color to empty array', () => {
    expect(toggleColorSelection([], 'W')).toEqual(['W']);
  });

  it('removes a color that is already selected', () => {
    expect(toggleColorSelection(['W', 'U'], 'W')).toEqual(['U']);
  });

  it('adds a color and maintains WUBRG order', () => {
    expect(toggleColorSelection(['R'], 'W')).toEqual(['W', 'R']);
  });

  it('sorts multiple colors in WUBRG order', () => {
    expect(toggleColorSelection(['G', 'U'], 'W')).toEqual(['W', 'U', 'G']);
  });

  it('clicking C clears all colors and sets C', () => {
    expect(toggleColorSelection(['W', 'U', 'B'], 'C')).toEqual(['C']);
  });

  it('clicking C when C is active clears everything', () => {
    expect(toggleColorSelection(['C'], 'C')).toEqual([]);
  });

  it('clicking a color when C is active removes C', () => {
    expect(toggleColorSelection(['C'], 'R')).toEqual(['R']);
  });

  it('clicking C on empty array sets C', () => {
    expect(toggleColorSelection([], 'C')).toEqual(['C']);
  });

  it('handles all five colors', () => {
    let colors: string[] = [];
    colors = toggleColorSelection(colors, 'G');
    colors = toggleColorSelection(colors, 'W');
    colors = toggleColorSelection(colors, 'R');
    colors = toggleColorSelection(colors, 'U');
    colors = toggleColorSelection(colors, 'B');
    expect(colors).toEqual(['W', 'U', 'B', 'R', 'G']);
  });

  it('removes last color to get empty array', () => {
    expect(toggleColorSelection(['R'], 'R')).toEqual([]);
  });
});
