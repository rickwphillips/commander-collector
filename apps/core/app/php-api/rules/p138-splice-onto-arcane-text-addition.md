---
id: p138
name: Splice onto Arcane — Adding Text to Arcane Spells
category: stack
cr_refs: [702.47a, 702.47b, 702.47c, 702.47d, 702.47e]
tags: [splice, arcane, text-change, additional-cost, hand, reveal, kamigawa, glacial-ray]
created: 2026-03-28
examples_count: 2
---

# P138 — Splice onto Arcane — Adding Text to Arcane Spells

## Abstract
Splice onto Arcane lets you reveal a card with splice from your hand while casting an Arcane spell, pay the splice cost as an additional cost, and have the Arcane spell gain the rules text of the spliced card. The key: the spliced card STAYS IN YOUR HAND — you don't discard or exile it. You can splice the same card onto multiple spells on future turns. The text is added via a text-changing effect; the spell doesn't gain other characteristics (name, color, type) of the spliced card.

## The Definitive Rule

**CR 702.47a** (verbatim): *"'Splice onto [quality] [cost]' means 'You may reveal this card from your hand as you cast a [quality] spell. If you do, that spell gains the text of this card's rules text and you pay [cost] as an additional cost to cast that spell.' Since the card with splice remains in the player's hand, it can later be cast normally or spliced onto another spell."*

**CR 702.47c** (verbatim): *"The spell has the characteristics of the main spell, plus the rules text of each of the spliced cards... The spell doesn't gain any other characteristics (name, mana cost, color, supertypes, card types, subtypes, etc.) of the spliced cards."*

**CR 702.47c Example** (verbatim): *"Glacial Ray is a red card with splice onto Arcane that reads, 'Glacial Ray deals 2 damage to any target.' Suppose Glacial Ray is spliced onto Reach Through Mists, a blue spell. The spell is still blue, and Reach Through Mists deals the damage. This means that the ability can target a creature with protection from red and deal 2 damage to that creature."*

## The Pattern

```
SPLICE — HOW IT WORKS:
  1. Cast an Arcane spell (Arcane is a spell subtype, not a keyword — Kamigawa block)
  2. Reveal one or more cards with "splice onto Arcane" from your hand
  3. Pay each revealed card's splice cost as an additional cost
  4. The Arcane spell gains the RULES TEXT of each spliced card
  5. The spliced card(s) stay in your hand

WHAT THE SPELL GAINS:
  Rules text only — not: name, mana cost, color, types, subtypes
  The rules text is treated as if it's part of the original spell's text
  Targets for spliced text are chosen when you'd normally choose targets

CARD STAYS IN HAND:
  The spliced card is revealed (temporarily shown) but remains in hand
  Can be spliced onto the next Arcane spell you cast
  Can also be cast normally from hand on a future turn

PROTECTION INTERACTION (702.47c example):
  Glacial Ray (red, "deals 2 damage") spliced onto a blue Arcane spell:
  The combined spell is still blue (main spell's characteristics)
  A creature with protection from red: protection prevents damage from RED sources
  The damage is now dealt by the BLUE Arcane spell, not by Glacial Ray
  → Protection from red does NOT protect against the spliced damage

MULTIPLE SPLICE:
  Splice multiple cards onto one Arcane spell: all reveal simultaneously, order their effects
  The main spell's effects happen first, then spliced effects in chosen order

COPY OF SPLICED SPELL:
  A copy of the combined spell: has the combined text (including spliced text)
  The copy is an entirely new spell — the spliced card is still in your hand
  The copy carries the extra text but was never "spliced from your hand"

SPLICE TARGETS + ILLEGAL:
  If spliced text adds targets and those targets become illegal: that part of the spell fizzles
  But the main spell still resolves (and other legal parts of spliced text resolve)

ARCANE SUBTYPE:
  Arcane is a spell subtype: only appears on instant and sorcery spells from Kamigawa block
  A spell must be Arcane for splice onto Arcane to work
  Most modern instants/sorceries are NOT Arcane
```

## Definitive Conclusions

- **Spliced card stays in your hand.** Only its rules text is added to the Arcane spell.
- **The Arcane spell doesn't gain the spliced card's color, cost, or type.**
- **The spliced text's damage/effects use the main spell's characteristics** — important for protection.
- **Multiple cards can be spliced onto one Arcane spell simultaneously.**
- **Same splice card can be used every turn** as long as you keep casting Arcane spells.

## Canonical Example
**Reach Through Mists (Arcane {U}: draw a card) + Glacial Ray (splice onto Arcane {1}{R}: deal 2 damage):**
Cast Reach Through Mists. Reveal Glacial Ray, pay {1}{R} extra.
Result: draw a card AND deal 2 damage to any target.
Glacial Ray stays in hand → next Arcane spell, splice it again.
The damage is dealt "by Reach Through Mists" (the Arcane spell) → blue spell dealing damage → protection from red doesn't apply.

**Example 2 — Splicing Kodama's Might:**
Kodama's Might (Arcane {G}: target creature gets +2/+2 until end of turn) spliced onto Soulless Revival (Arcane, {B}: return target creature card from graveyard to hand).
Pay splice costs. Soulless Revival now ALSO grants +2/+2 to a creature. Kodama's Might stays in hand.

## Commonly Confused With
- **P046 (Flashback)** — Flashback casts from graveyard and exiles; splice keeps the card in hand and adds text to an existing spell.
- **P099 (Modal Spells)** — Modal spells choose from printed options; splice adds rules text from a separate card.
- **P138 and Storm (P036)** — Splice can interact with storm: copy a spliced spell via storm, but each copy has the spliced text.
