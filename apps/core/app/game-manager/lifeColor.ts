/**
 * Smooth life-total color ramp, shared by the standard PlayerPanel and the 2HG
 * TeamPanel so both read identically. Greens above the starting life, then
 * ambers → reds as it drops, dark red at 0. Returns '' at exactly the starting
 * life so callers fall back to the theme default (primary).
 */
export function lifeColor(life: number, startingLife: number): string {
  if (life <= 0) return '#6B0000';
  if (life > startingLife) {
    const gain = Math.min((life - startingLife) / startingLife, 1);
    const r = Math.round(180 - 140 * gain);
    const g = Math.round(120 + 102 * gain);
    const b = Math.round(60 - 36 * gain);
    return `rgb(${r},${g},${b})`;
  }
  const ratio = Math.max(0, Math.min((startingLife - life) / startingLife, 1));
  if (ratio <= 0) return '';
  const r = Math.round(180 + 71 * ratio);
  const g = Math.round(120 - 120 * ratio);
  const b = Math.round(60 - 60 * ratio);
  return `rgb(${r},${g},${b})`;
}
