'use client';

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { ControlFocusModal } from './ControlFocusModal';

/**
 * StepperControl — the one counter primitive used across the game manager.
 *
 * Owns the full interaction so callers never re-implement it:
 *   • inline `− value +` buttons
 *   • long-press either button for the ±5 step (with a transient tooltip)
 *   • tap the value to open an enlarged focus modal (±1 big + ±5 row)
 *
 * The focus modal is card-scoped: it portals into the nearest
 * StepperOverlayProvider host (the card / panel root) and covers it with an
 * `absolute inset:0` overlay. That keeps it out of the counters' own
 * `overflow:hidden` scroll containers, which would otherwise clip it.
 */

// ─── Overlay host ────────────────────────────────────────────────────────────
// A StepperControl portals its focus modal into this element. Make a positioned
// card/panel root the host by rendering it AS a <StepperOverlayHost>: it is a
// plain <Box> that also captures its own DOM node (via a callback ref → state,
// so nothing reads a ref during render) and provides it through context.
const StepperOverlayContext = createContext<HTMLElement | null>(null);

export function StepperOverlayHost({
  children,
  sx,
}: {
  children: ReactNode;
  sx?: SxProps<Theme>;
}) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  return (
    <Box ref={setHost} sx={sx}>
      <StepperOverlayContext.Provider value={host}>
        {children}
      </StepperOverlayContext.Provider>
    </Box>
  );
}

// ─── Sizing ──────────────────────────────────────────────────────────────────
export interface StepperSize {
  /** Font size of the inline − / + glyphs. */
  btnFont: number | string;
  /** Font size of the inline value. */
  valueFont: number | string;
  /** Min width / height of each inline button (tap target). */
  btnMinWidth: number | string;
  btnMinHeight: number | string;
  /** Min width of the value cell. */
  valueMinWidth: number | string;
}

const DEFAULT_SIZE: StepperSize = {
  btnFont: 22,
  valueFont: 18,
  btnMinWidth: 40,
  btnMinHeight: 40,
  valueMinWidth: 28,
};

export interface StepperControlProps {
  /** Modal header + long-press tooltip identity. Not shown inline unless `showLabel`. */
  label: string;
  value: number | string;
  color?: string;
  onDec: () => void;
  onInc: () => void;
  /** Providing both enables long-press ±5 and the modal's ±5 row. */
  onDec5?: () => void;
  onInc5?: () => void;
  disableDec?: boolean;
  /** 'row' = self-contained flex row. 'cells' = three grid children (dec, value, inc). */
  layout?: 'row' | 'cells';
  size?: Partial<StepperSize>;
  /** Optional leading icon (⚡ / ✦ / img) shown before the label in 'row' layout. */
  glyph?: ReactNode;
  glyphColor?: string;
  /** Show the text label inline (default false — the modal always shows it). */
  showLabel?: boolean;
  labelFont?: number | string;
  /** Extra sx merged onto the inline value (poison blur, XP shimmer, etc.). */
  valueSx?: SxProps<Theme>;
  /**
   * Custom inline value element (e.g. a <LifeTotal>). Replaces the default
   * value Typography in 'row' layout; tapping it still opens the focus modal,
   * which renders the numeric `value`. Ignored in 'cells' layout.
   */
  valueNode?: ReactNode;
  /** Gap between the buttons and the value in 'row' layout (MUI spacing units). */
  rowSpacing?: number;
  /** slotProps for the ±5 long-press tooltip (per-seat rotation on the board). */
  tooltipSlotProps?: object;
  /** Unique-ish key prefix so sibling steppers' tooltips don't collide. */
  lpKeyPrefix?: string;
}

const HOLD_MS = 500;
const TOOLTIP_MS = 700;

export function StepperControl({
  label,
  value,
  color = 'text.primary',
  onDec,
  onInc,
  onDec5,
  onInc5,
  disableDec,
  layout = 'row',
  size,
  glyph,
  glyphColor,
  showLabel = false,
  labelFont,
  valueSx,
  valueNode,
  rowSpacing = 0.25,
  tooltipSlotProps,
  lpKeyPrefix,
}: StepperControlProps) {
  const sz: StepperSize = { ...DEFAULT_SIZE, ...size };
  const keyBase = lpKeyPrefix ?? label;

  const host = useContext(StepperOverlayContext);
  const [modalOpen, setModalOpen] = useState(false);

  // Self-contained long-press: hold a button for HOLD_MS to fire the ±5 step,
  // then flash a tooltip. `firedRef` guards the trailing click so a long-press
  // doesn't also register the ±1 tap on release.
  const [lpKey, setLpKey] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firedRef = useRef(false);

  const startLongPress = useCallback((key: string, cb?: () => void) => {
    if (!cb) return;
    firedRef.current = false;
    timerRef.current = setTimeout(() => {
      firedRef.current = true;
      cb();
      setLpKey(key);
      setTimeout(() => setLpKey((prev) => (prev === key ? null : prev)), TOOLTIP_MS);
    }, HOLD_MS);
  }, []);

  const cancelLongPress = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const guardClick = useCallback(
    (cb: () => void) => () => {
      if (firedRef.current) {
        firedRef.current = false;
        return;
      }
      cb();
    },
    [],
  );

  // One builder for both step buttons — the ±5 long-press tooltip wraps an
  // IconButton whose click does ±1 and whose hold does ±5.
  const stepButton = (dir: 'dec' | 'inc') => {
    const glyph = dir === 'dec' ? '−' : '+';
    const onTap = dir === 'dec' ? onDec : onInc;
    const onHold = dir === 'dec' ? onDec5 : onInc5;
    const k = `${keyBase}-${dir}`;
    return (
      <Tooltip
        key={k}
        open={lpKey === k}
        title={dir === 'dec' ? '-5' : '+5'}
        placement="top"
        slotProps={tooltipSlotProps}
        disableFocusListener
        disableHoverListener
        disableTouchListener
      >
        <span style={{ display: 'inline-flex' }}>
          <IconButton
            disabled={dir === 'dec' ? disableDec : undefined}
            onClick={guardClick(onTap)}
            onPointerDown={() => startLongPress(k, onHold)}
            onPointerUp={cancelLongPress}
            onPointerLeave={cancelLongPress}
            onPointerCancel={cancelLongPress}
            sx={{ p: 0, minWidth: sz.btnMinWidth, minHeight: sz.btnMinHeight }}
          >
            <Typography sx={{ fontSize: sz.btnFont, fontWeight: 700, lineHeight: 1 }}>{glyph}</Typography>
          </IconButton>
        </span>
      </Tooltip>
    );
  };
  const decBtn = stepButton('dec');

  const valueEl = valueNode !== undefined ? (
    <Box
      key={`${keyBase}-val`}
      onClick={() => setModalOpen(true)}
      sx={{ cursor: 'pointer', display: 'inline-flex', ...valueSx }}
    >
      {valueNode}
    </Box>
  ) : (
    <Typography
      key={`${keyBase}-val`}
      onClick={() => setModalOpen(true)}
      sx={{
        fontSize: sz.valueFont,
        fontWeight: 700,
        minWidth: sz.valueMinWidth,
        textAlign: 'center',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        color,
        ...valueSx,
      }}
    >
      {value}
    </Typography>
  );

  const incBtn = stepButton('inc');

  // ─── Focus modal (card-scoped overlay, portaled into the host) ──────────────
  // Reuses ControlFocusModal so the enlarged ±1/±5 control is identical to the
  // hero life modal. Portaled into the host so it isn't clipped by the counters'
  // overflow container.
  const modal = modalOpen ? (
    <ControlFocusModal
      open
      onClose={() => setModalOpen(false)}
      label={label}
      value={value}
      color={color}
      onDec={onDec}
      onInc={onInc}
      onDec5={onDec5}
      onInc5={onInc5}
      disableDec={disableDec}
    />
  ) : null;

  const portal = modal && (host ? createPortal(modal, host) : modal);

  if (layout === 'cells') {
    // Three grid children (dec, value, inc). The caller renders the label cell
    // and supplies the grid template so columns align across sibling rows.
    return (
      <>
        {decBtn}
        {valueEl}
        {incBtn}
        {portal}
      </>
    );
  }

  return (
    <Stack direction="row" alignItems="center" spacing={rowSpacing}>
      {glyph !== undefined && (
        <Box component="span" sx={{ fontSize: sz.valueFont, lineHeight: 1, color: glyphColor, display: 'inline-flex' }}>
          {glyph}
        </Box>
      )}
      {showLabel && (
        <Typography sx={{ fontSize: labelFont ?? sz.btnFont, color: 'text.secondary' }}>{label}</Typography>
      )}
      {decBtn}
      {valueEl}
      {incBtn}
      {portal}
    </Stack>
  );
}
