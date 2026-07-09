'use client';

import { Box } from '@mui/material';

/**
 * Life-total cracking overlay — lifted verbatim from PlayerCard, shared with
 * TeamPanel. Renders per-player "fingerprint" crack layers whose opacity is
 * driven by crackAlpha (a function of how much life has been lost). Place it
 * inside a position:relative + overflow:hidden container around the life number.
 */
export function LifeCracks({ fingerprint, crackAlpha }: { fingerprint: number; crackAlpha: (from: number) => number }) {
  const ox = 38 + (fingerprint % 7);
  const oy = 32 + (fingerprint % 5);
  const cp = (d: string, w: number, op: number) =>
    `<path d="${d}" stroke="rgba(10,0,0,${op})" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const crackSvg = (paths: string) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${paths}</svg>`;
  const crackLayers: Array<{ from: number; svg: string }> = [
    { from: 0.2, svg: crackSvg(
      cp(`M${ox},${oy} L${ox-14},${oy-18} L${ox-22},${oy-32}`, 1.6, 0.95) +
      cp(`M${ox},${oy} L${ox+8},${oy-22} L${ox+5},0`, 1.5, 0.92) +
      cp(`M${ox},${oy} L${ox+28},${oy-14} L${ox+48},${oy-26} L100,${oy-18}`, 1.4, 0.9) +
      cp(`M${ox},${oy} L${ox+22},${oy+18} L${ox+38},${oy+42} L100,${oy+60}`, 1.3, 0.88) +
      cp(`M${ox},${oy} L${ox+4},${oy+28} L${ox-2},${oy+52} L${ox+6},100`, 1.3, 0.87) +
      cp(`M${ox},${oy} L${ox-18},${oy+22} L${ox-34},${oy+48} L0,${oy+62}`, 1.2, 0.85) +
      cp(`M${ox},${oy} L${ox-28},${oy+6} L0,${oy+14}`, 1.2, 0.84)
    )},
    { from: 0.35, svg: crackSvg(
      cp(`M${ox-14},${oy-18} L${ox-30},${oy-12} L0,${oy-8}`, 1.0, 0.88) +
      cp(`M${ox-14},${oy-18} L${ox-8},${oy-34} L0,${oy-48}`, 0.9, 0.85) +
      cp(`M${ox+8},${oy-22} L${ox+22},${oy-14} L${ox+40},${oy-20} L100,${oy-30}`, 0.9, 0.85) +
      cp(`M${ox+28},${oy-14} L${ox+22},${oy+6} L${ox+36},${oy+18}`, 0.85, 0.82) +
      cp(`M${ox+22},${oy+18} L${ox+10},${oy+32} L${ox+16},${oy+50}`, 0.85, 0.82) +
      cp(`M${ox+4},${oy+28} L${ox+18},${oy+36} L${ox+28},${oy+58} L${ox+18},100`, 0.8, 0.8) +
      cp(`M${ox-18},${oy+22} L${ox-6},${oy+34} L${ox-12},${oy+52}`, 0.8, 0.8) +
      cp(`M${ox-28},${oy+6} L${ox-18},${oy-6} L${ox-10},${oy-20}`, 0.8, 0.8)
    )},
    { from: 0.5, svg: crackSvg(
      cp(`M${ox-30},${oy-12} L${ox-42},${oy-24} L${ox-36},${oy-40} L0,${oy-52}`, 0.75, 0.82) +
      cp(`M${ox-8},${oy-34} L${ox+4},${oy-48} L${ox-2},${oy-62} L${ox+10},${oy-80}`, 0.72, 0.8) +
      cp(`M${ox+40},${oy-20} L${ox+50},${oy-8} L${ox+62},${oy-16}`, 0.7, 0.78) +
      cp(`M${ox+36},${oy+18} L${ox+52},${oy+28} L${ox+68},${oy+20} L100,${oy+32}`, 0.7, 0.78) +
      cp(`M${ox+16},${oy+50} L${ox+30},${oy+62} L${ox+22},${oy+78} L${ox+36},100`, 0.68, 0.76) +
      cp(`M${ox-12},${oy+52} L${ox-24},${oy+64} L${ox-14},${oy+80} L0,${oy+90}`, 0.68, 0.76) +
      cp(`M${ox-42},${oy-24} L${ox-52},${oy-10} L0,${oy-4}`, 0.65, 0.74) +
      cp(`M${ox+10},${oy-80} L${ox+22},${oy-72} L${ox+36},${oy-82}`, 0.62, 0.72)
    )},
    { from: 0.7, svg: crackSvg(
      cp(`M${ox-22},${oy-32} L${ox-6},${oy-22} L${ox+4},${oy-38}`, 0.6, 0.8) +
      cp(`M${ox+5},0 L${ox-10},${oy-44} L${ox-20},${oy-58}`, 0.55, 0.78) +
      cp(`M${ox+48},${oy-26} L${ox+58},${oy-14} L${ox+72},${oy-22}`, 0.55, 0.76) +
      cp(`M${ox+62},${oy-16} L${ox+76},${oy-6} L${ox+84},${oy+8}`, 0.52, 0.74) +
      cp(`M${ox+28},${oy+58} L${ox+44},${oy+68} L${ox+38},${oy+84}`, 0.52, 0.74) +
      cp(`M${ox-24},${oy+64} L${ox-38},${oy+72} L${ox-28},${oy+86}`, 0.5, 0.72) +
      cp(`M${ox-52},${oy-10} L${ox-62},${oy+4} L${ox-50},${oy+18}`, 0.5, 0.72) +
      cp(`M${ox+22},${oy+6} L${ox+14},${oy+18} L${ox+24},${oy+30}`, 0.48, 0.7)
    )},
    { from: 0.85, svg: crackSvg(
      cp(`M${ox-6},${oy+8} L${ox+4},${oy+14} L${ox-2},${oy+22}`, 0.45, 0.8) +
      cp(`M${ox+10},${oy+4} L${ox+18},${oy+12} L${ox+12},${oy+22}`, 0.42, 0.78) +
      cp(`M${ox+6},${oy-10} L${ox+14},${oy-4} L${ox+8},${oy+6}`, 0.42, 0.76) +
      cp(`M${ox-10},${oy-6} L${ox-4},${oy+4} L${ox-12},${oy+12}`, 0.4, 0.74) +
      cp(`M${ox-36},${oy-40} L${ox-28},${oy-30} L${ox-38},${oy-22}`, 0.4, 0.72) +
      cp(`M${ox+36},${oy-82} L${ox+48},${oy-76} L${ox+42},${oy-64}`, 0.38, 0.7) +
      cp(`M${ox+84},${oy+8} L${ox+90},${oy+22} L${ox+80},${oy+34}`, 0.38, 0.7) +
      cp(`M${ox+44},${oy+68} L${ox+54},${oy+80} L${ox+44},${oy+92}`, 0.36, 0.68) +
      cp(`M${ox-62},${oy+4} L${ox-72},${oy+16} L${ox-62},${oy+28}`, 0.36, 0.68)
    )},
  ];
  return (
    <>
    {crackLayers.map(({ from, svg }) => (
      <Box key={from} sx={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
        backgroundSize: '100% 100%',
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
        userSelect: 'none',
        opacity: crackAlpha(from),
        transition: 'opacity 0.5s ease',
      }} />
    ))}
    </>
  );
}
