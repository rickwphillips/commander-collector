---
id: p231
name: Splice onto Arcane — Add Text of One Card to Another Arcane Spell
category: stack
cr_refs: [702.47a, 702.47b, 702.47c, 702.47d]
tags: [splice, splice-onto-arcane, arcane-spell, text-change, additional-cost, Kamigawa, Through-the-Breach, Glacial-Ray]
created: 2026-03-28
examples_count: 2
---

# P231 — Splice onto Arcane — Add Text of One Card to Another Arcane Spell

## Abstract
Splice onto Arcane is a static ability that functions in hand. When you cast an Arcane spell, you may reveal any number of cards with "Splice onto Arcane" from your hand, pay their splice costs as additional costs, and those cards' rules text is added to the Arcane spell on the stack. The spliced cards remain in your hand (they're not cast or discarded). The Arcane spell gains the spliced text and may execute those effects in addition to its own. Splice is unique because it lets you "copy" effects from hand without actually casting them — the cards stay in hand for reuse.

## The Definitive Rules

**CR 702.47a** (verbatim): *"Splice is a static ability that functions while a card is in your hand. 'Splice onto [quality] [cost]' means 'You may reveal this card from your hand as you cast a [quality] spell. If you do, that spell gains the text of this card's rules text and you pay [cost] as an additional cost to cast that spell.' Paying a card's splice cost follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

**CR 702.47b** (verbatim): *"You can't choose to use a splice ability if you can't make the required choices (targets, etc.) for that card's rules text. You can't splice any one card onto the same spell more than once. If you're splicing more than one card onto a spell, reveal them all at once and choose the order in which their effects will happen. The effects of the main spell must happen first."*

**CR 702.47c** (verbatim): *"The spell has the characteristics of the main spell, plus the rules text of each of the spliced cards. This is a text-changing effect (see rule 612, 'Text-Changing Effects'). The spell doesn't gain any other characteristics (name, mana cost, color, supertypes, card types, subtypes, etc.) of the spliced cards."*

## The Pattern

```
SPLICE REQUIREMENTS:
  The triggering spell must be an ARCANE spell (Arcane is a subtype of instant/sorcery in Kamigawa block)
  The splice card must have "Splice onto Arcane" in its text
  You reveal splice cards when declaring the Arcane spell's targets

SPLICE + CARD STAYS IN HAND:
  The splice card is REVEALED but NOT discarded or cast
  After splicing: card remains in your hand
  Can splice the same card onto multiple different Arcane spells over multiple turns
  This is the key advantage: "reuse" the effect every time you cast an Arcane spell

SPLICE + TEXT ADDED:
  The Arcane spell GAINS the rules text of the spliced cards
  The spliced card's text is added to the spell's text as a text-changing effect
  Targets for the added text must be chosen when casting (601.2c)
  The added text is real: it's part of the spell when it resolves

SPLICE + COLORS:
  CR 702.47c: the spell doesn't gain the spliced card's other characteristics
  Only RULES TEXT is added — not name, not mana cost, not colors
  Example: Glacial Ray ({1}{R}) spliced onto a blue Arcane spell: the SPELL is still blue
  "The spell that deals 2 damage to any target" — the damage ability is there, but the spell is still blue
  Glacial Ray example: you can target a protection-from-red creature with the combined spell's damage ability
  Because the spell is blue (not red) despite Glacial Ray's text being added

THROUGH THE BREACH ({4}{R}):
  Arcane spell: "You may put a creature card from your hand onto the battlefield. It gains haste. Sacrifice it at the beginning of the next end step."
  Not a splice card itself, but a KEY Arcane spell to splice ONTO
  With Splice cards: add effects to the breach while also putting a creature into play

GLACIAL RAY ({1}{R}):
  Instant — Arcane: "Glacial Ray deals 2 damage to any target."
  Splice onto Arcane {1}{R}: "Glacial Ray deals 2 damage to any target." (same text)
  When splicing: add "Glacial Ray deals 2 damage to any target" to the host spell
  Pay {1}{R} extra: the host spell now also deals 2 damage
  If the host spell is blue: the damage ability is blue-sourced (protection from red doesn't stop it!)

SPLICE + MULTIPLE CARDS:
  Can splice multiple cards onto one Arcane spell
  Each adds its text, each costs its splice cost
  The effects happen: main spell first, then spliced cards in chosen order
  Example: Splice Glacial Ray AND Dreams of the Dead AND Consuming Vortex onto one Arcane spell
  One cast: multiple effects from multiple splice cards, each costing their splice costs, cards stay in hand

SPLICE + COUNTERING:
  If the Arcane spell is countered: all splice effects are also countered (spell doesn't resolve)
  But: the splice cards are still in your hand (they weren't cast or used up)
  The splice costs are paid as additional costs during casting — those mana payments are NOT returned

ARCANE SUBTYPE:
  Arcane was only in Kamigawa block: Betrayers of Kamigawa, Champions of Kamigawa, Saviors of Kamigawa
  Arcane instants and sorceries have "Arcane" in their type line
  Modern play: few Arcane spells remain competitive; splice is a niche mechanic

SPLICE + COPY:
  Copies of Arcane spells: copy the FULL text (including spliced text)
  Splice effect is text — so copies have the same text
  But: the spliced cards are still in your hand; copying the spell doesn't "unreveal" the splice

PRACTICAL SPLICE COMBO:
  Desperate Ritual ({1}{R}) — Arcane instant: "Add {R}{R}{R}."
  Manamorphose ({1}{R/G}) — Arcane: "Add two mana of any combination of colors. Draw a card."
  Both are Arcane!
  Splice Desperate Ritual onto Manamorphose: add {1}{R} to Manamorphose's cost, add {R}{R}{R} when it resolves
  But Desperate Ritual costs only {1}{R} to splice — net mana positive (+{R}{R}{R} from splice vs {1}{R} to splice cost)
  Pro Tip: these interact with Through the Breach and other Arcane spells
```

## Definitive Conclusions

- **Splice adds rules text** to a host Arcane spell; the splice card stays in hand.
- **Added text is colorless** — the spell doesn't gain the splice card's color or other characteristics.
- **Glacial Ray spliced onto blue Arcane**: the damage is blue-sourced (defeats red protection).
- **Multiple splices**: stack effects on one Arcane spell by paying multiple splice costs.
- **Countering the Arcane spell**: all effects countered, but splice costs are NOT refunded; splice cards remain in hand.

## Canonical Example
**Glacial Ray spliced in Kamigawa Standard/Block:**
Hand: Glacial Ray ({1}{R}, splice {1}{R}), Peer Through Depths (Arcane instant: look at top 5, take an instant or sorcery).
Cast Peer Through Depths (Arcane): declare splicing Glacial Ray.
Pay Peer Through Depths cost + Glacial Ray splice cost ({1}{R}): total {U}+{1}{R}.
Peer Through Depths gains Glacial Ray's text: "Glacial Ray deals 2 damage to any target."
Choose a target for the added Glacial Ray effect.
Resolve: Peer Through Depths effect (look at top 5) AND deal 2 damage to target.
Glacial Ray is still in hand.
Next Arcane spell: splice Glacial Ray again! Infinite reuse of a 2-damage effect on every Arcane spell.

**Example 2 — Splice + Through the Breach:**
Cast Through the Breach ({4}{R}), splice Nourishing Shoal (green Arcane, "exile a green card from hand, gain life equal to its mana value").
Pay {4}{R} + Nourishing Shoal splice cost.
Through the Breach gains "exile a green card from hand, gain that much life."
Resolve: put a creature from hand (e.g., Emrakul) onto battlefield with haste, sacrifice at end step, AND gain life from Shoal.
Shoal remains in hand for the next Arcane spell.

## Commonly Confused With
- **P230 (Entwine)** — Entwine chooses all modes of one modal spell. Splice adds text from a different card to a host spell.
- **P210 (Kicker)** — Kicker is a cost that enables additional effects printed on the SAME card. Splice adds effects from a DIFFERENT card.
- **P177 (Casualty)** — Casualty sacrifices a creature to copy a spell. Splice adds text from revealed hand cards (no sacrifice, card stays in hand).
