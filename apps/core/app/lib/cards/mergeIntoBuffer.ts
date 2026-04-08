/**
 * mergeIntoBuffer — pure card-buffer merge helper.
 *
 * Applies dedup / singleton rules and returns both the new buffer and a list
 * of UI-relevant events the caller can surface as toasts or dialogs. This
 * function has NO side effects: it never calls window.confirm, renders
 * anything, or dispatches state. The caller decides how to present events.
 *
 * Rules (applied per incoming card):
 *
 * 1. Basic lands — always increment quantity, never dedup. Identified by name.
 *
 * 2. ID match (incoming.scryfall_id is set AND a buffer row shares that id):
 *    - Same printing, singleton ON  → emits `duplicate` event; buffer unchanged.
 *    - Same printing, singleton OFF → increment buffer row quantity; emits `incremented`.
 *
 * 3. Name fallback (no scryfall_id on incoming, OR no id match found):
 *    - Normalize incoming name and scan buffer for a normalized-name match.
 *    - If matched → emits `name-fallback-warn`; buffer unchanged. Caller must
 *      queue a "Merge / Keep both" dialog and re-call mergeIntoBuffer when resolved.
 *    - If not matched → push as new row.
 *
 * 4. Printing variation (same name, different scryfall_id — both set):
 *    - Singleton ON  → merge into existing row (sum quantities); emits `merged-printing`.
 *    - Singleton OFF → kept as separate row; no event emitted.
 */

import { normalize } from '@/lib/cards/matchKey';
import type { Card } from '@/lib/cards/types';

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * A UI-relevant event that mergeIntoBuffer produces.
 * The caller maps these to toasts or dialogs — mergeIntoBuffer itself has no
 * knowledge of the UI layer.
 */
export type MergeEvent =
  | {
      /** Card already present; quantity unchanged (singleton mode). */
      kind: 'duplicate';
      card: Card;
      existingCard: Card;
    }
  | {
      /**
       * Incoming card has no scryfall_id and a buffer row with the same
       * normalized name exists. The caller must ask the user to Merge or Keep
       * both, then re-call mergeIntoBuffer with the resolved decision.
       */
      kind: 'name-fallback-warn';
      card: Card;
      existingCard: Card;
    }
  | {
      /**
       * Same name, different scryfall_id (alternate printing), singleton ON.
       * The incoming card was merged (qty summed) into the existing row.
       */
      kind: 'merged-printing';
      card: Card;
      existingCard: Card;
    }
  | {
      /**
       * Same scryfall_id, singleton OFF — quantity was incremented.
       * Used for optional "Added 2× <name>" feedback.
       */
      kind: 'incremented';
      card: Card;
      existingCard: Card;
    };

/** Return value of mergeIntoBuffer. */
export interface MergeResult {
  /** The new buffer after applying all rules. */
  merged: Card[];
  /** Events the caller should present to the user. */
  events: MergeEvent[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BASIC_LAND_NAMES = new Set([
  'Plains',
  'Island',
  'Swamp',
  'Mountain',
  'Forest',
  'Wastes',
  'Snow-Covered Plains',
  'Snow-Covered Island',
  'Snow-Covered Swamp',
  'Snow-Covered Mountain',
  'Snow-Covered Forest',
]);

// ── Pure function ──────────────────────────────────────────────────────────────

/**
 * Merge `incoming` cards into `buffer` according to dedup / singleton rules.
 *
 * @param buffer   Current card buffer (read-only; not mutated).
 * @param incoming Cards to merge in.
 * @param singleton Whether the context enforces singleton (one copy per card).
 * @returns MergeResult — new buffer + events to surface to the user.
 */
export function mergeIntoBuffer(
  buffer: Card[],
  incoming: Card[],
  singleton: boolean,
): MergeResult {
  let next = [...buffer];
  const events: MergeEvent[] = [];

  for (const card of incoming) {
    const name = card.card_name;

    // Rule 1 — basic lands always increment, never dedup
    if (BASIC_LAND_NAMES.has(name)) {
      const existIdx = next.findIndex(
        (b) => b.card_name === name && b.scryfall_id === card.scryfall_id,
      );
      if (existIdx !== -1) {
        next = next.map((b, i) =>
          i === existIdx ? { ...b, quantity: b.quantity + card.quantity } : b,
        );
      } else {
        next = [...next, { ...card }];
      }
      continue;
    }

    // Rule 2 — exact scryfall_id match (same printing)
    if (card.scryfall_id) {
      const idIdx = next.findIndex(
        (b) => b.scryfall_id && b.scryfall_id === card.scryfall_id,
      );
      if (idIdx !== -1) {
        const existingCard = next[idIdx];
        if (singleton) {
          // Already present — no quantity change
          events.push({ kind: 'duplicate', card, existingCard });
        } else {
          // Increment quantity
          next = next.map((b, i) =>
            i === idIdx ? { ...b, quantity: b.quantity + card.quantity } : b,
          );
          events.push({ kind: 'incremented', card, existingCard });
        }
        continue;
      }

      // Rule 4 — same name, different scryfall_id (printing variation)
      const normName = normalize(name);
      const nameIdx = next.findIndex(
        (b) =>
          normalize(b.card_name) === normName &&
          b.scryfall_id &&
          b.scryfall_id !== card.scryfall_id,
      );
      if (nameIdx !== -1) {
        const existingCard = next[nameIdx];
        if (singleton) {
          // Merge — treat as same logical card
          next = next.map((b, i) =>
            i === nameIdx ? { ...b, quantity: b.quantity + card.quantity } : b,
          );
          events.push({ kind: 'merged-printing', card, existingCard });
        } else {
          // Keep as separate row (different printing intentionally kept)
          next = [...next, { ...card }];
        }
        continue;
      }

      // No ID or name match — new card
      next = [...next, { ...card }];
      continue;
    }

    // Rule 3 — name fallback (no scryfall_id on incoming card)
    const normName = normalize(name);
    const nameIdx = next.findIndex((b) => normalize(b.card_name) === normName);
    if (nameIdx !== -1) {
      const existingCard = next[nameIdx];
      // Emit event — caller must show "Merge / Keep both" dialog and re-resolve
      events.push({ kind: 'name-fallback-warn', card, existingCard });
      // Buffer is unchanged; caller applies the decision when resolved
      continue;
    }

    // No match at all — new card
    next = [...next, { ...card }];
  }

  return { merged: next, events };
}
