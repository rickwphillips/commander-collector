'use client';

import { Box, Tooltip } from '@mui/material';
import Image from 'next/image';
import { ASSET_BASE } from '../lib/api';

const COLOR_NAME: Record<string, string> = {
  W: 'White', U: 'Blue', B: 'Black', R: 'Red', G: 'Green', C: 'Colorless',
};

// ── ManaSymbol ───────────────────────────────────────────────────

interface ManaSymbolProps {
  /** Single color code: W U B R G C */
  color: string;
  /** Pixel size of the symbol. Default 28. */
  size?: number;
  /** When true, shows a primary-color ring and full opacity. */
  active?: boolean;
  /** When true, dims to 40% opacity unless active. */
  dimmed?: boolean;
  /** Called when the symbol is clicked — renders as a button. */
  onClick?: () => void;
  /** Show color name tooltip. Default true. */
  tooltip?: boolean;
}

export function ManaSymbol({
  color,
  size = 28,
  active = false,
  dimmed = false,
  onClick,
  tooltip = true,
}: ManaSymbolProps) {
  const label = COLOR_NAME[color] ?? color;
  const isInteractive = !!onClick;

  const inner = (
    <Box
      component={isInteractive ? 'button' : 'span'}
      onClick={onClick}
      sx={{
        width: size,
        height: size,
        p: 0,
        border: 'none',
        borderRadius: '50%',
        background: 'none',
        cursor: isInteractive ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        outline: active ? '2px solid' : '2px solid transparent',
        outlineColor: active ? 'primary.main' : 'transparent',
        outlineOffset: '2px',
        opacity: dimmed && !active ? 0.4 : 1,
        transform: active && isInteractive ? 'scale(1.1)' : 'scale(1)',
        transition: 'opacity 0.15s, outline-color 0.15s, transform 0.15s',
        ...(isInteractive && {
          '&:hover': { opacity: 1, transform: 'scale(1.1)' },
        }),
      }}
    >
      <Image
        src={`${ASSET_BASE}/mana/${color}.svg`}
        alt={label}
        width={size}
        height={size}
        style={{ borderRadius: '50%', display: 'block' }}
      />
    </Box>
  );

  if (!tooltip) return inner;
  return <Tooltip title={label}>{inner}</Tooltip>;
}

// ── Arrangement helpers ──────────────────────────────────────────

interface Arrangement {
  positions: Array<{ left: number; top: number }>;
  width: number;
  height: number;
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Returns absolute top-left positions for n pips within a bounding box. */
function getArrangement(count: number, size: number): Arrangement {
  const gap = Math.round(size * 0.12);

  if (count === 2) {
    return {
      positions: [{ left: 0, top: 0 }, { left: size + 1, top: 0 }],
      width: 2 * size + gap,
      height: size,
    };
  }

  if (count === 3) {
    // Equilateral triangle, single pip at top-center
    const rowH = size * 0.866;
    return {
      positions: [
        { left: (size / 2) + 1, top: -1 },
        { left: 0,        top: rowH },
        { left: size + 1,     top: rowH },
      ],
      width: 2 * size,
      height: size + rowH,
    };
  }

  if (count === 4) {
    const fourGap = 1;
    // 2×2 square
    return {
      positions: [
        { left: 0,         top: 0 },
        { left: size + fourGap, top: 0 },
        { left: 0,         top: size + fourGap },
        { left: size + fourGap, top: size + fourGap },
      ],
      width: 2 * size + fourGap,
      height: 2 * size + fourGap,
    };
  }

  if (count === 5) {
    // Regular pentagon, point up (270° start, 72° spacing)
    const r  = size * 0.65;
    const cx = size * 1.15;
    const cy = size * 1.15;
    const positions = Array.from({ length: 5 }, (_, i) => {
      const θ = toRad(270 + i * 73);
      return {
        left: cx + r * Math.cos(θ) - size / 2,
        top:  cy + r * Math.sin(θ) - size / 2,
      };
    });
    return { positions, width: 2.3 * size, height: 2.3 * size };
  }

  // 1 color — single pip, offset right with margin
  return { positions: [{ left: size * 0.6, top: 0 }], width: size * 2.1, height: size };
}

/**
 * Centers an arrangement horizontally within a fixed-width column.
 * Height is kept natural so 1-2 pip cards don't reserve excess vertical space.
 */
function centerH(arr: Arrangement, fixedW: number): Arrangement {
  const dx = (fixedW - arr.width) / 2;
  return {
    positions: arr.positions.map(({ left, top }) => ({ left: left + dx, top })),
    width: fixedW,
    height: arr.height,
  };
}

// Fixed column width = pentagon footprint (widest arrangement).
const FIXED_SCALE = 2.3;

// ── ColorSymbols ─────────────────────────────────────────────────

interface ColorSymbolsProps {
  colors: string | string[];
  /**
   * Spacing size — controls layout distances and container dimensions. Default 28.
   * Symbols render at symbolScale * size so they don't overlap in dense arrangements.
   */
  size?: number;
  /**
   * Fraction of `size` to use for the rendered symbol. Default 0.72.
   * Each symbol is centered within its layout slot.
   */
  symbolScale?: number;
  /**
   * When true, all arrangements render inside the same fixed-size box
   * so the component never shifts surrounding layout regardless of count.
   */
  fixed?: boolean;
}

export function ColorSymbols({
  colors,
  size = 28,
  symbolScale = 0.73,
  fixed = false,
}: ColorSymbolsProps) {
  const chars = Array.isArray(colors) ? colors : colors.split('').filter(Boolean);
  const normalized = chars.length ? chars : ['C'];
  const count = normalized.length;

  const raw  = getArrangement(count, size);
  const arr  = fixed ? centerH(raw, FIXED_SCALE * size) : raw;

  // 1–2 pips keep the original size; 3+ scale down to avoid overlap in dense arrangements
  const symSize   = count >= 5 ? Math.round(size * symbolScale) : size;
  const slotInset = (size - symSize) / 2;

  return (
    <Box
      sx={{
        position: 'relative',
        width: arr.width,
        height: arr.height,
      }}
    >
      {normalized.map((c, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            left: arr.positions[i].left + slotInset,
            top:  arr.positions[i].top  + slotInset,
          }}
        >
          <ManaSymbol color={c} size={symSize} />
        </Box>
      ))}
    </Box>
  );
}
