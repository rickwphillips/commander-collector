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
import { glassBackingSx } from './controlGlass';

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
  /**
   * The name of what this counter is counting (Energy, Poison, a commander,
   * etc.). Every counter has one: it is rendered inline as part of the control
   * (in 'row' layout) AND used as the modal header + long-press tooltip
   * identity. A leading `glyph` (⚡ / ✦) counts as the label, so the text is
   * suppressed when a glyph is given; use `labelNode` for a richer label, and
   * `labelSx` to restyle or hide (`display:'none'`) the text contextually.
   */
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
  /** Rich inline label content, replacing the default text label (e.g. a
   *  commander name + tax badge). Rendered by the component in the label slot. */
  labelNode?: ReactNode;
  /** Show the text label beside the glyph. Default true; set false for a
   *  glyph-only label (⚡ / ✦). */
  showLabel?: boolean;
  /** css override for the inline text label so the implementer decides how it
   *  displays contextually (size, color, or `display:'none'` to hide it). */
  labelSx?: SxProps<Theme>;
  /** Default font size for the inline text label (overridable via labelSx). */
  labelFont?: number | string;
  /** Frosted-glass backing (shared helper), for legibility over a busy animated
   *  board. Applied to the row wrapper; the implementer flips it on when a board
   *  animation is active. */
  glass?: boolean;
  /** className hooks so implementers can override presentation from a co-located
   *  `*.module.scss` instead of passing inline sx. `className` targets the row
   *  wrapper, `labelClassName` the text label, `valueClassName` the value cell. */
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  /** Extra sx merged onto the inline value (poison blur, XP shimmer, etc.). */
  valueSx?: SxProps<Theme>;
  /**
   * Custom inline value element (e.g. a <LifeTotal>). Replaces the default
   * value Typography in 'row' layout; tapping it still opens the focus modal,
   * which renders the numeric `value`. Ignored in 'cells' layout.
   */
  valueNode?: ReactNode;
  /**
   * Optional denominator shown after the value (e.g. the poison lethal `15`, the
   * commander-damage lethal `21`). Rendered INSIDE the control row so it sits
   * under the shared glass backing — unlike a sibling `/ 15` the caller would
   * otherwise append outside the frosted panel. 'row' layout only.
   */
  max?: number | string;
  /** Font size for the `max` denominator (defaults to the value font). */
  maxFont?: number | string;
  /** css override for the `max` denominator text (color, spacing, etc.). */
  maxSx?: SxProps<Theme>;
  /** Reserve blank space the width of a `/ NN` denominator when this row has no
   *  `max`, so sibling rows WITH one keep their − value + columns aligned. */
  reserveMax?: boolean;
  /** Render only the (tappable) value, hiding the inline − / + buttons. Tapping
   *  the value still opens the focus modal, so the row becomes a compact readout
   *  that edits in the modal (e.g. a remote cmd-damage row showing an opponent's
   *  life, tapped to record the commander damage they dealt). 'row' layout only. */
  valueOnly?: boolean;
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
  labelNode,
  showLabel = true,
  labelSx,
  labelFont,
  glass = false,
  className,
  labelClassName,
  valueClassName,
  valueSx,
  valueNode,
  max,
  maxFont,
  maxSx,
  reserveMax = false,
  valueOnly = false,
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
            // Keep the full tap target but pull the glyph to the value side (dec
            // hugs the value's left, inc its right). The wide button's dead space
            // then falls on the OUTER edge (toward the label / row end) instead of
            // between the glyph and the number, which is the "wasted space" a wide
            // remote tap target otherwise opens up around a small − / + glyph.
            sx={{ p: 0, minWidth: sz.btnMinWidth, minHeight: sz.btnMinHeight, justifyContent: dir === 'dec' ? 'flex-end' : 'flex-start' }}
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
      className={valueClassName}
      onClick={() => setModalOpen(true)}
      sx={{ cursor: 'pointer', display: 'inline-flex', ...valueSx }}
    >
      {valueNode}
    </Box>
  ) : (
    <Typography
      key={`${keyBase}-val`}
      className={valueClassName}
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

  // Optional denominator (e.g. `/ 15`, `/ 21`). Sits inside the row after the inc
  // button so it's covered by the glass backing, not appended by the caller.
  const maxEl = max !== undefined ? (
    <Typography
      key={`${keyBase}-max`}
      sx={{ fontSize: maxFont ?? sz.valueFont, color: 'text.secondary', whiteSpace: 'nowrap', lineHeight: 1, flexShrink: 0, ...maxSx }}
    >
      /{max}
    </Typography>
  ) : reserveMax ? (
    // Invisible placeholder the width of a "/NN" denominator so rows WITHOUT a max
    // keep their − value + columns aligned with sibling rows that carry one.
    <Typography
      key={`${keyBase}-maxph`}
      aria-hidden
      sx={{ fontSize: maxFont ?? sz.valueFont, whiteSpace: 'nowrap', lineHeight: 1, flexShrink: 0, visibility: 'hidden', ...maxSx }}
    >
      /00
    </Typography>
  ) : null;

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

  // Label slot: the component owns "what am I counting". `labelNode` supplies a
  // fully custom label (e.g. a rich stat-badge row); otherwise the component
  // composes an optional leading `glyph` icon + the text `label`. Pass
  // showLabel={false} for a glyph-only label; `labelSx` styles the whole region
  // (flex, blur, or display:none to hide), `labelFont` sizes the text.
  const labelEl =
    labelNode !== undefined ? (
      labelNode
    ) : glyph !== undefined || showLabel ? (
      <Box
        className={labelClassName}
        sx={{ display: 'flex', alignItems: 'center', gap: 0.4, minWidth: 0, overflow: 'hidden', ...labelSx }}
      >
        {glyph !== undefined && (
          <Box component="span" sx={{ fontSize: sz.valueFont, lineHeight: 1, color: glyphColor, display: 'inline-flex', flexShrink: 0 }}>
            {glyph}
          </Box>
        )}
        {showLabel && (
          <Typography component="span" noWrap sx={{ fontSize: labelFont ?? sz.valueFont, color: 'text.secondary', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {label}
          </Typography>
        )}
      </Box>
    ) : null;

  return (
    <Stack direction="row" alignItems="center" spacing={rowSpacing} className={className} sx={glassBackingSx(glass)}>
      {labelEl}
      {!valueOnly && decBtn}
      {valueEl}
      {!valueOnly && incBtn}
      {maxEl}
      {portal}
    </Stack>
  );
}
