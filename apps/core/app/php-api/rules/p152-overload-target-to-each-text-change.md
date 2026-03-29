---
id: p152
name: Overload — Replace "Target" with "Each" via Alternative Cost
category: costs
cr_refs: [702.96a, 702.96b, 702.96c]
tags: [overload, alternative-cost, text-change, target, each, cyclonic-rift, ravnica, board-wipe]
created: 2026-03-28
examples_count: 2
---

# P152 — Overload — Replace "Target" with "Each" via Alternative Cost

## Abstract
Overload offers an alternative cost for a spell. If you pay the overload cost instead of the normal mana cost, every instance of "target" in the spell's text is replaced with "each." This transforms a targeted spell into a global effect — the spell becomes untargeted and affects all legal objects or players. Because overloaded spells have no targets, they can't be countered by "counter target spell unless a cost is paid" effects, and protection/hexproof/shroud don't save creatures from them. The archetypal example is Cyclonic Rift: bounce one nonland permanent normally, or pay {6}{U} to bounce ALL opponents' nonland permanents.

## The Definitive Rules

**CR 702.96a** (verbatim): *"Overload is a keyword that represents two static abilities that function while the spell with overload is on the stack. Overload [cost] means 'You may choose to pay [cost] rather than pay this spell's mana cost' and 'If you chose to pay this spell's overload cost, change its text by replacing all instances of the word "target" with the word "each."' Casting a spell using its overload ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.96b** (verbatim): *"If a player chooses to pay the overload cost of a spell, that spell won't require any targets. It may affect objects that couldn't be chosen as legal targets if the spell were cast without its overload cost being paid."*

## The Pattern

```
OVERLOAD:
  Two abilities when on stack:
    1. Alternative cost: pay [overload cost] instead of mana cost
    2. Text replacement: all "target" → "each"

  WITHOUT OVERLOAD:
    Cast at normal cost, choose specific targets
    Spell has targets → protection/hexproof/shroud can protect against it
    Can be responded to with counterspells targeting the spell

  WITH OVERLOAD:
    Cast at overload cost (usually much higher)
    No targets → protection, hexproof, shroud do NOT protect
    Affects ALL objects/players that match the description after "each"
    Can still be countered as a spell (Counterspell still works — just counters the spell)
    But "counter target spell unless you pay 2" (Mana Leak) → still targets the SPELL not what it affects → Mana Leak still counters overloaded spells

  OVERLOAD + HEXPROOF/PROTECTION:
    "Target creature" with hexproof → normally protected
    "Each creature" (overloaded) → hexproof doesn't apply (no targeting)
    Protection from [color] = can't be targeted by [color] spells
    Overloaded spell: no targeting → protection doesn't protect
    Cyclonic Rift overloaded → returns hexproof creatures

  OVERLOAD + TOKENS:
    Tokens are permanents → "each nonland permanent" includes tokens
    Cyclonic Rift overloaded: returns all opponents' nonland permanents INCLUDING tokens

  OVERLOAD + "IF ABLE":
    Overloaded spells use "each" — so they affect each relevant object
    If some objects can't be affected (e.g., indestructible stops "destroy each creature"):
    Those unaffected objects are just... unaffected. The rest are.

  OVERLOAD + COPIES:
    If you copy an overloaded spell: copy is also overloaded (same text, no targets)
    The copy also says "each" and affects everything

  OVERLOAD + NEW SETS:
    Overload appeared in Ravnica block (Return to Ravnica)
    Limited number of cards: Cyclonic Rift, Mizzium Mortars, Teleportal, etc.

OVERLOADED SPELL LIMITATIONS:
  "Each" still requires legal objects to affect
  "Each creature you control gets +2/+2" (overloaded pump): only affects YOUR creatures
  "Each creature opponent controls" (overloaded removal): only opponent's creatures
  The replacing of "target" doesn't expand scope — just removes targeting requirement
```

## Definitive Conclusions

- **Overloaded spells have NO targets** — protection and hexproof do NOT apply.
- **Text replacement is complete** — every "target" becomes "each."
- **Still a spell on the stack** — can still be countered (just not targeted by protection).
- **Overload cost is typically much higher** than the base cost — global effect has a price.
- **Cyclonic Rift** is the definitive example: bounce one permanent for {1}{U} or bounce all opponents' nonland permanents for {6}{U}.

## Canonical Example
**Cyclonic Rift:**
Normal cast ({1}{U}): "Return target nonland permanent you don't control to its owner's hand."
Choose target → opponent can protect it with hexproof/protection.
Overload ({6}{U}): "Return each nonland permanent you don't control to its owner's hand."
No targets → hexproof, shroud, protection: all irrelevant. Everything goes back.
Staple in Commander — one-sided board reset at instant speed.

**Example 2 — Mizzium Mortars:**
Normal ({1}{R}): "Mizzium Mortars deals 4 damage to target creature you don't control."
Overload ({3}{R}{R}{R}): "Mizzium Mortars deals 4 damage to each creature you don't control."
Board wipe for 4 damage to all opponents' creatures — sweeps tokens and smaller creatures.
Opponent's hexproof Gaea's Cradle creature? Overloaded Mortars hits it anyway.

## Commonly Confused With
- **P150 (Convoke)** — Convoke taps creatures to pay cost. Overload is an alternative cost that changes spell text.
- **P129 (Spree)** — Spree chooses modes. Overload transforms "target" into "each" with one choice.
- **P103 (Hexproof)** — Hexproof protects from targeted spells. Overloaded spells bypass hexproof because they don't target.
