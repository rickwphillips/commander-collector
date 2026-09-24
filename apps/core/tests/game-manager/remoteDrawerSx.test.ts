import { describe, it, expect } from 'vitest';
import type { SxProps, Theme } from '@mui/material/styles';
import {
  remoteDrawerOuterSx,
  remoteDrawerContentSx,
  remoteDrawerChevronSx,
} from '@/game-manager/components/remoteDrawerSx';

// Locks the orientation-aware collapsible-drawer sx shared by the standard
// remote PlayerCard and the 2HG TeamPanel. The chevron rotations in particular
// were set by reasoning (a phone can't be driven headlessly), so pin the intended
// "points toward the shared life when open, outward when closed" behavior here.

const landscape = '@media (orientation: landscape)';
const portrait = '@media (orientation: portrait)';

// `SxProps<Theme>` is a union (plain object | array | theme callback), so neither a
// media-query key nor a bare style prop is indexable on it. These factories always
// return a plain object, so narrow once here instead of casting at every assertion.
type SxRecord = Record<string, unknown>;
const sxOf = (sx: SxProps<Theme>): SxRecord => sx as SxRecord;
const at = (sx: SxProps<Theme>, query: string): SxRecord => sxOf(sx)[query] as SxRecord;

describe('remoteDrawerOuterSx', () => {
  it('collapses WIDTH to the rail when closed in landscape, grows when open', () => {
    expect(at(remoteDrawerOuterSx(true), landscape)).toMatchObject({ flex: 1 });
    expect(at(remoteDrawerOuterSx(false), landscape)).toMatchObject({ flex: 'none', width: 24 });
  });

  it('stacks as a full-width column in portrait regardless of open state', () => {
    for (const open of [true, false]) {
      expect(at(remoteDrawerOuterSx(open), portrait)).toMatchObject({ flexDirection: 'column', width: '100%' });
    }
  });
});

describe('remoteDrawerContentSx', () => {
  it('fades and collapses the content to zero along the axis when closed', () => {
    expect(sxOf(remoteDrawerContentSx(false)).opacity).toBe(0);
    expect(sxOf(remoteDrawerContentSx(true)).opacity).toBe(1);
    expect(at(remoteDrawerContentSx(false), landscape)).toMatchObject({ width: 0 });
    expect(at(remoteDrawerContentSx(false), portrait)).toMatchObject({ height: 0 });
  });
});

describe('remoteDrawerChevronSx', () => {
  // Left column (cmd damage) sits LEFT of the life center. When OPEN its chevron
  // points outward (toward its own edge, "collapse me"); when CLOSED it points
  // inward toward life ("open me"). Right column is the mirror image.
  it('points outward when open (landscape)', () => {
    expect(at(remoteDrawerChevronSx(true, 'left'), landscape).transform).toBe('rotate(180deg)');
    expect(at(remoteDrawerChevronSx(true, 'right'), landscape).transform).toBe('rotate(0deg)');
  });

  it('points inward toward the life center when closed (landscape)', () => {
    expect(at(remoteDrawerChevronSx(false, 'left'), landscape).transform).toBe('rotate(0deg)');
    expect(at(remoteDrawerChevronSx(false, 'right'), landscape).transform).toBe('rotate(180deg)');
  });

  it('rotates to the vertical inner edge in portrait', () => {
    // Portrait stacks the sections. Open points outward, closed points toward life.
    expect(at(remoteDrawerChevronSx(true, 'left'), portrait).transform).toBe('rotate(270deg)');
    expect(at(remoteDrawerChevronSx(true, 'right'), portrait).transform).toBe('rotate(90deg)');
    expect(at(remoteDrawerChevronSx(false, 'left'), portrait).transform).toBe('rotate(90deg)');
    expect(at(remoteDrawerChevronSx(false, 'right'), portrait).transform).toBe('rotate(270deg)');
  });
});
