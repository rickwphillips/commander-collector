import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Orientation-aware collapsible side-column drawer for the REMOTE phone panels
 * (standard PlayerCard + 2HG TeamPanel). The phone shows one un-rotated panel,
 * so CSS `@media (orientation)` tracks the panel's own orientation:
 *
 *   • landscape → sections sit in a ROW, so the drawer collapses its WIDTH and
 *     the rail is a vertical bar on the inner edge (toward the panel center).
 *   • portrait  → sections stack in a COLUMN, so the drawer collapses its HEIGHT
 *     and the rail is a horizontal bar on the inner edge.
 *
 * Rail placement follows flex order: put the rail FIRST for a column that sits on
 * the RIGHT of center, LAST for one on the LEFT, and flipping flex-direction
 * (row↔column) lands it on the correct inner edge in both orientations.
 *
 * The HOST board must NOT use these — its seats are individually rotated while
 * sharing one screen orientation, so it uses a panel-space flex-width collapse.
 */

export const REMOTE_DRAWER_RAIL = 24;

/** Outer wrapper: collapses along the orientation axis; `open` sets collapsed size. */
export function remoteDrawerOuterSx(open: boolean): SxProps<Theme> {
  return {
    display: 'flex',
    overflow: 'hidden',
    minWidth: 0,
    '@media (orientation: landscape)': {
      flexDirection: 'row',
      ...(open ? { flex: 1 } : { flex: 'none', width: REMOTE_DRAWER_RAIL }),
    },
    '@media (orientation: portrait)': {
      flexDirection: 'column',
      width: '100%',
      flex: 'none',
    },
  };
}

/** Content pane: shrinks to zero along the axis when closed. */
export function remoteDrawerContentSx(open: boolean): SxProps<Theme> {
  return {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'hidden',
    opacity: open ? 1 : 0,
    transition: 'opacity 0.15s ease',
    '@media (orientation: landscape)': open ? { flex: 1 } : { flex: 'none', width: 0 },
    '@media (orientation: portrait)': open ? { flex: 'none', width: '100%' } : { flex: 'none', width: '100%', height: 0, minHeight: 0 },
  };
}

/** Rail: thin bar on the inner edge — vertical in landscape, horizontal in portrait. */
export const remoteDrawerRailSx: SxProps<Theme> = {
  flexShrink: 0,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  '@media (orientation: landscape)': { width: REMOTE_DRAWER_RAIL, alignSelf: 'stretch' },
  '@media (orientation: portrait)': { height: REMOTE_DRAWER_RAIL, width: '100%' },
};

/**
 * Chevron transform that always points toward the panel center (life) when open,
 * outward when closed. `side` is which side of center the column sits on.
 */
export function remoteDrawerChevronSx(open: boolean, side: 'left' | 'right'): SxProps<Theme> {
  return {
    display: 'block',
    fontSize: 22,
    color: 'text.secondary',
    transition: 'transform 0.25s ease',
    '@media (orientation: landscape)': {
      transform: side === 'left'
        ? (open ? 'rotate(0deg)' : 'rotate(180deg)')
        : (open ? 'rotate(180deg)' : 'rotate(0deg)'),
    },
    '@media (orientation: portrait)': {
      transform: side === 'left'
        ? (open ? 'rotate(90deg)' : 'rotate(270deg)')
        : (open ? 'rotate(270deg)' : 'rotate(90deg)'),
    },
  };
}
