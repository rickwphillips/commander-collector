/**
 * Font size for the hero life number on a REMOTE phone panel (every drawer
 * state). The life box is a size container, so the number is measured off the
 * box's OWN dimensions rather than the viewport:
 *
 *   • cqh (box HEIGHT) binds in landscape — the orientation that frees height.
 *   • cqw (box WIDTH)  binds in portrait  — the orientation that frees width.
 *
 * `min(...)` picks whichever is tighter, so the number fills the applicable
 * direction and never exceeds the perpendicular one. The width cap is divided by
 * the digit count so a 3+ digit total (e.g. 120) shrinks to fit the panel width
 * instead of overflowing it, while 1-2 digit totals share the 2-digit size.
 */
export function remoteLifeFontSize(life: number): string {
  const digits = Math.max(2, String(life).length);
  const widthCapCqw = Math.round(92 / (0.62 * digits));
  return `min(84cqh, ${widthCapCqw}cqw)`;
}
