/**
 * lib/cards/types.ts — canonical Card interface + PHP ↔ TS adapters.
 *
 * BOUNDARY CONTRACT
 * -----------------
 * PHP returns integers for boolean columns: `is_commander`, `is_proxy`, `is_custom` are
 * `0 | 1` on the wire. All callers that read from the API MUST use `fromApiCard()` to
 * convert them to booleans. All callers that write to the API MUST use `toApiCard()` to
 * convert booleans back to `0 | 1`. This is the ONE place where that translation lives.
 *
 * ROLE vs IS_COMMANDER
 * --------------------
 * `is_commander` is a deck-native flag that exists on deck_cards today (Phase 0/1).
 * `role` is a list-native flag introduced in Phase 2 (list_cards.role = 'commander' |
 * 'partner'). Both fields coexist on Card during the transition so that:
 *   - Existing deck pages can still read/write `is_commander` without change.
 *   - New list pages can use `role` for validation (Phase 2 commander validator).
 * After Phase 5 cleanup, `is_commander` on list_cards is removed from the DB and
 * `role` is the sole source of truth. Until then, they are allowed to disagree —
 * decks own their `is_commander`; lists own their `role`.
 *
 * PEERS RULE (enforced by architecture, not this file)
 * Decks and lists are peers. Neither is subordinate to the other.
 * `is_commander` is deck-native and stays forever on the deck side.
 * `role` is list-native and stays forever on the list side.
 */

// ── Wire shape (what PHP returns / expects) ───────────────────────────────────

/** Raw API row as PHP returns it. is_commander / is_proxy / is_custom are 0|1. */
export interface ApiCardRow {
  id?: string;
  card_name: string;
  scryfall_id: string | null;
  image_uri?: string | null;
  back_image_uri?: string | null;
  color_identity?: string;
  colors?: string;
  type_line?: string | null;
  mana_cost?: string | null;
  /** Oracle text from scryfall_card_cache. Used by commander validator (Background, Doctor's companion, "can be your commander", Partner with X). */
  oracle_text?: string | null;
  /** Keyword list from scryfall_card_cache. Used by commander validator (Partner, Friends Forever, etc.). */
  keywords?: string[] | null;
  /** Format legalities map from scryfall_card_cache.legalities (Phase 2.1+). Keys are format names, values are 'legal'|'not_legal'|'banned'|'restricted'. */
  legalities?: Record<string, string> | null;
  quantity: number;
  /** PHP boolean — 0 or 1 */
  is_commander: 0 | 1 | number;
  /** PHP boolean — 0 or 1 */
  is_proxy: 0 | 1 | number;
  /** PHP boolean — 0 or 1; present on list_cards only (Phase 2+) */
  is_custom?: 0 | 1 | number;
  /** list_cards.role — 'commander' | 'partner'; present on list rows only (Phase 2+) */
  role?: 'commander' | 'partner' | null;
  /** Deck context: which deck_id this card belongs to */
  deck_id?: string;
  /** List context: which list_id this card belongs to */
  list_id?: string;
  /** Whether a Scryfall lookup failed for this card */
  notFound?: boolean;
}

// ── Canonical Card (TypeScript side) ─────────────────────────────────────────

/**
 * Card — the single canonical representation of a card in any context.
 *
 * Subsumes: ScannedCard, DeckCard (after boolean conversion), ListCard (after
 * boolean conversion), EditableCard. Optional fields diverge by context.
 *
 * Required fields are the minimum set that every context shares.
 * Optional fields are present only in specific contexts.
 */
export interface Card {
  // ── Identity ────────────────────────────────────────────────────────────────
  /** Database row id — absent for unsaved cards. */
  id?: string;
  card_name: string;
  scryfall_id?: string | null;

  // ── Scryfall data (joined from scryfall_card_cache) ──────────────────────
  image_uri?: string | null;
  back_image_uri?: string | null;
  /** WUBRG string or 'C' for colorless; empty string when unknown. */
  color_identity: string;
  /** Raw color string (from Scryfall colors array, joined). May differ from identity. */
  colors?: string;
  type_line?: string | null;
  mana_cost?: string | null;
  /** Oracle text. Optional — populated by scryfall_card_cache join (Phase 2.1+). */
  oracle_text?: string | null;
  /** Keyword list. Optional — populated by scryfall_card_cache join (Phase 2.1+). */
  keywords?: string[] | null;
  /** Format legalities map. Optional — populated by scryfall_card_cache.legalities (Phase 2.1+). Keys: format name. Values: 'legal'|'not_legal'|'banned'|'restricted'. */
  legalities?: Record<string, string> | null;

  // ── Card count ──────────────────────────────────────────────────────────────
  quantity: number;

  // ── Boolean flags (always boolean on the TS side) ───────────────────────────
  /**
   * Deck-native flag. Sourced from deck_cards.is_commander.
   * Allowed to disagree with `role` — they are peers from different tables.
   * @deprecated Phase 5: replaced by `role === 'commander'` on list rows.
   */
  is_commander: boolean;
  /** Whether the card is a proxy (non-foil physical stand-in). */
  is_proxy: boolean;
  /**
   * Whether this card row is user-customised (custom art, altered, etc.).
   * List-native (list_cards only). Absent on deck_cards rows.
   */
  is_custom?: boolean;

  // ── Commander role (list-native, Phase 2+) ───────────────────────────────
  /**
   * List-cards role flag. Only present on list rows after Phase 2 migration.
   * `undefined` means "not set / not applicable" (deck-only rows, pre-Phase 2 rows).
   * Allowed to disagree with `is_commander` — they are peers from different tables.
   */
  role?: 'commander' | 'partner';

  // ── Context keys ─────────────────────────────────────────────────────────────
  /** Which deck this card belongs to (deck context). */
  deck_id?: string;
  /** Which list this card belongs to (list context). */
  list_id?: string;

  // ── UI helpers ────────────────────────────────────────────────────────────────
  /**
   * Ephemeral client-side key for unsaved cards (before DB id is assigned).
   * Replaces the per-page `_key` / `id: tempId()` patterns.
   * Always set by `fromApiCard` and `cardFromScryfall`; cleared on save.
   */
  tempId?: string;

  /** Whether a Scryfall lookup failed for this card name. */
  notFound?: boolean;
}

// ── Adapters ──────────────────────────────────────────────────────────────────

/**
 * fromApiCard — convert a raw PHP API row to a canonical Card.
 *
 * Handles the `0|1` → boolean conversion for is_commander, is_proxy, is_custom
 * in ONE place so no page ever needs to write `!!row.is_commander` again.
 */
export function fromApiCard(row: ApiCardRow): Card {
  return {
    id:             row.id,
    card_name:      row.card_name,
    scryfall_id:    row.scryfall_id ?? null,
    image_uri:      row.image_uri   ?? null,
    back_image_uri: row.back_image_uri ?? null,
    color_identity: row.color_identity ?? '',
    colors:         row.colors,
    type_line:      row.type_line   ?? null,
    mana_cost:      row.mana_cost   ?? null,
    oracle_text:    row.oracle_text ?? null,
    keywords:       row.keywords    ?? null,
    legalities:     row.legalities  ?? null,
    quantity:       row.quantity,
    is_commander:   Boolean(row.is_commander),
    is_proxy:       Boolean(row.is_proxy),
    ...(row.is_custom !== undefined && { is_custom: Boolean(row.is_custom) }),
    ...(row.role != null ? { role: row.role } : {}),
    deck_id:        row.deck_id,
    list_id:        row.list_id,
    notFound:       row.notFound,
  };
}

/**
 * toApiCard — convert a canonical Card back to a PHP-ready payload.
 *
 * Converts boolean flags to 0|1 and drops client-only fields (tempId, notFound).
 */
export function toApiCard(card: Card): ApiCardRow {
  const row: ReturnType<typeof toApiCard> = {
    card_name:      card.card_name,
    scryfall_id:    card.scryfall_id ?? null,
    image_uri:      card.image_uri   ?? null,
    back_image_uri: card.back_image_uri ?? null,
    color_identity: card.color_identity,
    colors:         card.colors,
    type_line:      card.type_line   ?? null,
    mana_cost:      card.mana_cost   ?? null,
    oracle_text:    card.oracle_text ?? null,
    keywords:       card.keywords    ?? null,
    legalities:     card.legalities  ?? null,
    quantity:       card.quantity,
    is_commander:   card.is_commander ? 1 : 0,
    is_proxy:       card.is_proxy     ? 1 : 0,
  };

  if (card.id !== undefined)      row.id       = card.id;
  if (card.deck_id !== undefined)  row.deck_id  = card.deck_id;
  if (card.list_id !== undefined)  row.list_id  = card.list_id;
  if (card.role    !== undefined)  row.role     = card.role;
  if (card.is_custom !== undefined) {
    row.is_custom = card.is_custom ? 1 : 0;
  }

  return row;
}
