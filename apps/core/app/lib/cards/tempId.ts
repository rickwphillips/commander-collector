/**
 * lib/cards/tempId.ts — ephemeral client-side card key.
 *
 * Existing scan page and CardGridEditor both use `Math.random().toString(36).slice(2)`.
 * This module centralises that pattern so all sites use the same generator.
 *
 * The result is NOT stored in the DB — it is only used to key unsaved rows in
 * React state. It is cleared (or replaced by the real DB id) when the card is saved.
 */

/**
 * Returns a short random string suitable for use as a temporary client-side id.
 * Mirrors the existing pattern in scan/page.tsx, CardEditDialog, and CardAddDialog.
 */
export function tempId(): string {
  return Math.random().toString(36).slice(2);
}
