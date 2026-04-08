/**
 * Commander format validator.
 *
 * Rules implemented:
 *  - Commander setup: 0/1/2 commander+partner rows, partner-pair mechanics
 *  - Card count: 100-card target (soft warning only)
 *  - Singleton: no duplicates except basic lands
 *  - Color identity: every card must be ⊆ commander identity
 *  - Banned: reads card.legalities?.commander === 'banned'
 *  - Format legality: reads card.legalities?.commander === 'not_legal'
 *
 * Severity rules:
 *  - HARD errors (legal: false): color identity, banned, format-illegal,
 *    singleton violation, illegal commander, missing commander.
 *  - SOFT warnings (legal stays true): card count off.
 *
 * Color identity AXIOM: always delegate to computeColorIdentity / isSubsetOf
 * from lib/cards/colorIdentity.ts. Never compute inline.
 */

import type { Card } from '../cards/types';
import {
  computeColorIdentity,
  isSubsetOf,
  type ColorIdentitySymbol,
} from '../cards/colorIdentity';
import type { FormatValidator, ValidationResult, Violation, DeckContext } from './types';

// ---------------------------------------------------------------------------
// Basic-land names exempt from the singleton rule.
// Snow-covered variants are basics and share the same game text.
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Fields not yet on Card that this validator needs.
// TODO(card-types): Add these to Card in lib/cards/types.ts once the Scryfall
// cache layer populates them:
//   - oracle_text?: string        (rules text for commander-legality checks)
//   - keywords?: string[]         (keyword abilities for partner-pair detection)
//   - legalities?: Record<string, string>  (e.g. { commander: 'legal' | 'banned' | 'not_legal' })
// The validator treats absent fields as empty/unknown and degrades gracefully
// (no false positives from missing data).
// ---------------------------------------------------------------------------

/** Extended Card shape — fields expected to exist after Phase 2 Scryfall cache work. */
type CardFull = Card & {
  oracle_text?: string;
  keywords?: string[];
  legalities?: Record<string, string>;
  power?: string | number | null;
  toughness?: string | number | null;
};

// ---------------------------------------------------------------------------
// Color-identity helpers
// ---------------------------------------------------------------------------

/**
 * Split a WUBRG-style color string (e.g. "WUG", "C", "") into individual
 * color symbols for use as oracleColors in computeColorIdentity.
 */
function splitColorIdentityString(ci: string): string[] {
  return ci.split('').filter((ch) => /[WUBRG]/.test(ch));
}

/**
 * Compute a card's color identity using the canonical function.
 * Passes mana_cost and supplements with the pre-computed color_identity string
 * from the DB (which covers ability costs, reminder text, etc.).
 */
function cardColorIdentity(card: Card): ColorIdentitySymbol[] {
  const oracleColors = splitColorIdentityString(card.color_identity ?? '');
  return computeColorIdentity(card.mana_cost ?? undefined, oracleColors);
}

// ---------------------------------------------------------------------------
// Unique identifier for a card row — for Violation.cardIds
// ---------------------------------------------------------------------------
function cardId(card: Card): string {
  if (card.scryfall_id) return card.scryfall_id;
  if (card.tempId) return card.tempId;
  if (card.id !== undefined) return String(card.id);
  return card.card_name;
}

// ---------------------------------------------------------------------------
// Basic-land check
// ---------------------------------------------------------------------------
function isBasicLand(card: Card): boolean {
  return BASIC_LAND_NAMES.has(card.card_name);
}

// ---------------------------------------------------------------------------
// Oracle text / type / keyword helpers
//
// All safely degrade when fields are absent.
// ---------------------------------------------------------------------------

function oracleText(card: CardFull): string {
  return (card.oracle_text ?? '').toLowerCase();
}

function typeLine(card: Card): string {
  return (card.type_line ?? '').toLowerCase();
}

function keywords(card: CardFull): string[] {
  return card.keywords ?? [];
}

// ---------------------------------------------------------------------------
// Commander legality helpers
// ---------------------------------------------------------------------------

/**
 * A legal commander is a legendary permanent with power/toughness.
 * (See memory/feedback_commander_legality.md.)
 * The "can be your commander" oracle text override is preserved for cards
 * that explicitly opt in (e.g. certain planeswalkers).
 */
function isLegendaryWithPT(card: CardFull): boolean {
  const tl = typeLine(card);
  if (!tl.includes('legendary')) return false;
  return card.power != null && card.toughness != null;
}

function hasCanBeYourCommander(card: CardFull): boolean {
  return oracleText(card).includes('can be your commander');
}

function isLegalCommander(card: CardFull): boolean {
  return isLegendaryWithPT(card) || hasCanBeYourCommander(card);
}

function hasPartnerKeyword(card: CardFull): boolean {
  return keywords(card).some((k) => k.toLowerCase() === 'partner');
}

function hasFriendsForever(card: CardFull): boolean {
  return keywords(card).some((k) => k.toLowerCase() === 'friends forever');
}

function hasChooseABackground(card: CardFull): boolean {
  return (
    keywords(card).some((k) => k.toLowerCase() === 'choose a background') ||
    oracleText(card).includes('choose a background')
  );
}

function hasDoctorsCompanion(card: CardFull): boolean {
  return (
    keywords(card).some((k) => k.toLowerCase() === "doctor's companion") ||
    oracleText(card).includes("doctor's companion")
  );
}

function isBackground(card: Card): boolean {
  return typeLine(card).includes('background');
}

function isDoctor(card: Card): boolean {
  const tl = typeLine(card);
  return tl.includes('creature') && tl.includes('doctor');
}

/**
 * Extract the named partner from "Partner with X" oracle text.
 * Returns null if not a "Partner with" card.
 */
function partnerWithName(card: CardFull): string | null {
  const match = oracleText(card).match(/partner with ([^(,\n]+)/i);
  return match ? match[1].trim() : null;
}

// ---------------------------------------------------------------------------
// Commander color identity computation
// ---------------------------------------------------------------------------

/**
 * Derive the commander color identity from the commander/partner card rows.
 * If `deck.colorIdentity` is provided as an override, that takes precedence.
 */
function commanderColorIdentity(
  commanderCards: Card[],
  deck?: DeckContext,
): ColorIdentitySymbol[] {
  // Explicit override wins
  if (deck?.colorIdentity && deck.colorIdentity.length > 0) {
    return deck.colorIdentity as ColorIdentitySymbol[];
  }

  if (commanderCards.length === 0) return [];

  // Union the identities from all commander/partner cards.
  const combined = new Set<ColorIdentitySymbol>();
  for (const c of commanderCards) {
    for (const color of cardColorIdentity(c)) {
      combined.add(color);
    }
  }

  // Belt-and-suspenders: if any colored symbol present, strip C (axiom boundary).
  // computeColorIdentity already enforces this; we re-enforce at the union step.
  const result = Array.from(combined);
  const hasColored = result.some((c) => c !== 'C');
  return hasColored ? result.filter((c) => c !== 'C') : result;
}

// ---------------------------------------------------------------------------
// Sub-checks
// ---------------------------------------------------------------------------

function pushCardCountViolation(cards: Card[], violations: Violation[]): void {
  const total = cards.reduce((sum, c) => sum + c.quantity, 0);
  if (total !== 100) {
    violations.push({
      rule: 'card_count',
      severity: 'warning',
      message: `Deck has ${total} card(s); Commander requires exactly 100.`,
    });
  }
}

function pushSingletonViolations(cards: Card[], violations: Violation[]): void {
  const violatorIds: string[] = [];
  for (const card of cards) {
    if (isBasicLand(card)) continue;
    if (card.quantity > 1) {
      violatorIds.push(cardId(card));
    }
  }
  if (violatorIds.length > 0) {
    violations.push({
      rule: 'singleton',
      severity: 'error',
      message: `${violatorIds.length} non-basic card(s) have quantity > 1. Commander is singleton.`,
      cardIds: violatorIds,
    });
  }
}

function pushBannedAndFormatViolations(cards: Card[], violations: Violation[]): void {
  const bannedIds: string[] = [];
  const notLegalIds: string[] = [];

  for (const card of cards) {
    const legalities = (card as CardFull).legalities;
    if (!legalities) continue; // No data: skip (no false positives)

    const status = legalities['commander'];
    if (status === 'banned') {
      bannedIds.push(cardId(card));
    } else if (status === 'not_legal') {
      notLegalIds.push(cardId(card));
    }
  }

  if (bannedIds.length > 0) {
    violations.push({
      rule: 'banned',
      severity: 'error',
      message: `${bannedIds.length} card(s) are banned in Commander.`,
      cardIds: bannedIds,
    });
  }
  if (notLegalIds.length > 0) {
    violations.push({
      rule: 'format_legality',
      severity: 'error',
      message: `${notLegalIds.length} card(s) are not legal in Commander.`,
      cardIds: notLegalIds,
    });
  }
}

function buildResult(violations: Violation[]): ValidationResult {
  const hasError = violations.some((v) => v.severity === 'error');
  return { legal: !hasError, format: 'commander', violations };
}

// ---------------------------------------------------------------------------
// Main validate function
// ---------------------------------------------------------------------------

function validate(cards: Card[], deck?: DeckContext): ValidationResult {
  const violations: Violation[] = [];

  // --- Partition by role ---------------------------------------------------
  // `role` is list-native (Phase 2+). On deck rows it may be undefined;
  // fall back to `is_commander` for deck-only rows during the transition.
  const commanderRows = cards.filter((c) => {
    if (c.role === 'commander') return true;
    // Fallback for deck rows that predate the `role` field
    if (c.role === undefined && c.is_commander) return true;
    return false;
  });
  const partnerRows = cards.filter((c) => c.role === 'partner');

  const combinedCount = commanderRows.length + partnerRows.length;

  // --- Commander setup check -----------------------------------------------

  if (commanderRows.length === 0) {
    violations.push({
      rule: 'commander_legality',
      severity: 'error',
      message: 'Flag a commander before validating.',
    });
    // Can still surface other issues even without a commander
    pushCardCountViolation(cards, violations);
    pushSingletonViolations(cards, violations);
    pushBannedAndFormatViolations(cards, violations);
    return buildResult(violations);
  }

  if (combinedCount > 2) {
    violations.push({
      rule: 'commander_legality',
      severity: 'error',
      message: `Too many commander/partner flags (${combinedCount}). Maximum is 2.`,
      cardIds: [...commanderRows, ...partnerRows].map(cardId),
    });
  } else if (commanderRows.length === 1 && partnerRows.length === 0) {
    // ── Single commander ────────────────────────────────────────────────────
    const cmd = commanderRows[0] as CardFull;
    if (!isLegalCommander(cmd)) {
      violations.push({
        rule: 'commander_legality',
        severity: 'error',
        message: `"${cmd.card_name}" is not a legal commander (must be a legendary permanent with power and toughness, or have "can be your commander" in its rules text).`,
        cardIds: [cardId(cmd)],
      });
    }
  } else if (commanderRows.length === 2 && partnerRows.length === 0) {
    // ── Partner pair: both flagged role='commander' ─────────────────────────
    const [a, b] = commanderRows as [CardFull, CardFull];

    const genericPair =
      (hasPartnerKeyword(a) || hasFriendsForever(a)) &&
      (hasPartnerKeyword(b) || hasFriendsForever(b));

    const aPartnerWith = partnerWithName(a);
    const bPartnerWith = partnerWithName(b);
    const namedPair =
      (aPartnerWith !== null &&
        aPartnerWith.toLowerCase() === b.card_name.toLowerCase()) ||
      (bPartnerWith !== null &&
        bPartnerWith.toLowerCase() === a.card_name.toLowerCase());

    if (!genericPair && !namedPair) {
      violations.push({
        rule: 'commander_legality',
        severity: 'error',
        message:
          `"${a.card_name}" and "${b.card_name}" are not a legal partner pair. ` +
          `Both must have Partner or Friends Forever, or one must have "Partner with <name>" naming the other.`,
        cardIds: [cardId(a), cardId(b)],
      });
    }

    // Each card in the pair must also be individually commander-legal
    for (const cmd of commanderRows as CardFull[]) {
      if (!isLegalCommander(cmd)) {
        violations.push({
          rule: 'commander_legality',
          severity: 'error',
          message: `"${cmd.card_name}" is not a legal commander (must be a legendary permanent with power and toughness, or have "can be your commander").`,
          cardIds: [cardId(cmd)],
        });
      }
    }
  } else if (commanderRows.length === 1 && partnerRows.length === 1) {
    // ── Commander + Background / Doctor's companion ─────────────────────────
    const cmd = commanderRows[0] as CardFull;
    const partner = partnerRows[0] as CardFull;

    if (!isLegalCommander(cmd)) {
      violations.push({
        rule: 'commander_legality',
        severity: 'error',
        message: `"${cmd.card_name}" is not a legal commander.`,
        cardIds: [cardId(cmd)],
      });
    }

    if (hasChooseABackground(cmd)) {
      if (!isBackground(partner)) {
        violations.push({
          rule: 'commander_legality',
          severity: 'error',
          message:
            `"${cmd.card_name}" has "Choose a Background", but "${partner.card_name}" is not a Background.`,
          cardIds: [cardId(partner)],
        });
      }
    } else if (isDoctor(cmd)) {
      if (!hasDoctorsCompanion(partner)) {
        violations.push({
          rule: 'commander_legality',
          severity: 'error',
          message:
            `"${cmd.card_name}" is a Doctor, but "${partner.card_name}" does not have "Doctor's companion".`,
          cardIds: [cardId(partner)],
        });
      }
    } else {
      violations.push({
        rule: 'commander_legality',
        severity: 'error',
        message:
          `"${cmd.card_name}" cannot pair with "${partner.card_name}". ` +
          `The commander must have "Choose a Background" or be a Doctor to use a partner-role card.`,
        cardIds: [cardId(cmd), cardId(partner)],
      });
    }
  }
  // Any other edge case (e.g. 0 commanders + partner rows) falls through
  // to the combinedCount > 2 branch or was caught by the commanderRows === 0 branch.

  // --- Gather commander-slot cards for color identity ----------------------
  const commanderSlotCards = [...commanderRows, ...partnerRows];
  const cmdIdentity = commanderColorIdentity(commanderSlotCards, deck);

  // --- Card count ----------------------------------------------------------
  pushCardCountViolation(cards, violations);

  // --- Singleton -----------------------------------------------------------
  pushSingletonViolations(cards, violations);

  // --- Color identity ------------------------------------------------------
  const colorViolatorIds: string[] = [];
  for (const card of cards) {
    // Commander/partner cards define the identity — exempt from the check
    if (card.role === 'commander' || card.role === 'partner') continue;
    // Deck-row fallback: skip the primary commander card
    if (card.role === undefined && card.is_commander) continue;

    const identity = cardColorIdentity(card);
    if (!isSubsetOf(identity, cmdIdentity)) {
      colorViolatorIds.push(cardId(card));
    }
  }
  if (colorViolatorIds.length > 0) {
    violations.push({
      rule: 'color_identity',
      severity: 'error',
      message: `${colorViolatorIds.length} card(s) are outside the commander's color identity.`,
      cardIds: colorViolatorIds,
    });
  }

  // --- Banned / format legality -------------------------------------------
  pushBannedAndFormatViolations(cards, violations);

  return buildResult(violations);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const commanderValidator: FormatValidator = {
  format: 'commander',
  validate,
};
