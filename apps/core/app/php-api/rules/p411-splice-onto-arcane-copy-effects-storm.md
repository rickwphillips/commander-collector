---
id: p411
name: Splice onto Arcane and Copy Effects — Spliced Text IS Part of the Spell's Characteristics
category: stack
cr_refs: [702.47a, 702.47c, 702.47e, 707.2, 707.10, 612.10]
tags: [splice, copy-effects, storm-splice, text-changing-effect, spliced-text-copied, Fork-splice, Reverberate-splice, Glacial-Ray, Reach-Through-Mists, splice-onto-arcane, storm-copies-spliced-text, characteristics-on-stack, Arcane-spell, splice-text-inherited]
created: 2026-03-29
examples_count: 2
---

# P411 — Splice onto Arcane and Copy Effects — Spliced Text IS Part of the Spell's Characteristics

## Abstract
When you splice a card onto an Arcane spell, **the spliced text becomes part of the spell's characteristics** (CR 702.47c: this is a text-changing effect). Since copying a spell copies its characteristics as they exist on the stack at the time of copying (CR 707.2), any copy of the spliced spell — whether from Fork, Reverberate, storm, or any other copy effect — **inherits the spliced text**. The copy draws a card AND deals 2 damage (or whatever the splice added), even though the splice card was only revealed and its cost paid once. This is non-obvious because players assume splice text is "extra baggage" tied to the original cast, but it's actually woven into the spell's rules text at the moment the spell is put on the stack.

## The Definitive Rules

**CR 702.47a** (verbatim): *"Splice is a static ability that functions while a card is in your hand. 'Splice onto [quality] [cost]' means 'You may reveal this card from your hand as you cast a [quality] spell. If you do, that spell gains the text of this card's rules text and you pay [cost] as an additional cost to cast that spell.'"*

**CR 702.47c** (verbatim): *"The spell has the characteristics of the main spell, plus the rules text of each of the spliced cards. This is a text-changing effect (see rule 612, 'Text-Changing Effects'). The spell doesn't gain any other characteristics (name, mana cost, color, supertypes, card types, subtypes, etc.) of the spliced cards. Text gained by the spell that refers to a card by name refers to the spell on the stack, not the card from which the text was copied."*

**CR 702.47e** (verbatim): *"The spell loses any splice changes once it leaves the stack for any reason."*

**CR 707.2** (verbatim): *"When copying an object, the copy acquires the copiable values of the original object's characteristics and, for an object on the stack, choices made when casting or activating it."*

**CR 707.10** (verbatim): *"A copy of a spell or ability copies both the characteristics of the spell or ability and all decisions made for it."*

## The Pattern

```
SPLICE IS A TEXT-CHANGING EFFECT (702.47c):
  "The spell has the characteristics of the main spell, plus the rules text of each
    of the spliced cards."
  "This is a text-changing effect."
  Consequence: the spliced text IS part of the spell's characteristics.
  The spell on the stack has modified rules text — not "attached" splice instructions,
    but integrated rules text as part of the spell's characteristics.

COPYING A SPLICED SPELL (707.2):
  "When copying an object, the copy acquires the copiable values of the original
    object's characteristics."
  The original's characteristics include the spliced rules text.
  Therefore: the copy also has the spliced rules text.

  Example: Reach Through Mists ({U}: Arcane, "draw a card") + Glacial Ray splice:
    On the stack: "Draw a card. Glacial Ray deals 2 damage to any target."
    (This is the spell's rules text after text-changing effect from splice.)
    You copy this spell with Reverberate.
    The copy's characteristics = "Draw a card. [Glacial Ray deals 2 damage to any target.]"
    Both the copy AND the original have the spliced text.
    Each resolves independently: draw a card + deal 2 damage.

THE SPLICE CARD STAYS IN HAND (702.47a):
  The Glacial Ray card was revealed and its splice cost ({1}{R}) paid once.
  It never goes to the stack or leaves your hand.
  When the copy is created, no additional splice cost is paid.
  No additional Glacial Ray reveal is needed.
  The copy "got the text for free" — it inherited the characteristics.

CRITICAL LIMIT — 702.47e: "THE SPELL LOSES SPLICE CHANGES ONCE IT LEAVES THE STACK":
  This applies to the ORIGINAL spell. When it resolves, its text reverts to normal.
  But: the copy is a SEPARATE object on the stack. When the copy leaves the stack
    (resolves or ceases to exist), the splice changes are lost for the copy too.
  However: before leaving the stack, the copy DOES have the spliced text. It resolves
    with the full spliced text effects. After resolving, the splice changes no longer
    matter (the spell is gone).
  This rule doesn't prevent copies from having or using the spliced text.

STORM + SPLICE INTERACTION (702.40a × 702.47c):
  Storm: "When you cast this spell, copy it for each other spell cast before it this turn."
  If the storm spell is an Arcane spell with a splice:
    The storm spell on the stack has the spliced text (it's part of characteristics).
    Storm trigger fires: "copy it" — copies the spell as it is on the stack.
    Each storm copy inherits the spliced text.
  RESULT: In a storm deck that also uses Arcane spells:
    Cast an Arcane spell with Glacial Ray spliced (pay {1}{R} splice cost once).
    Storm count = 5: 5 copies created.
    Each copy deals 2 damage to any target.
    Original deals 2 damage + draws a card.
    TOTAL: 6 × 2 = 12 damage + 1 card drawn. One Glacial Ray revealed. One {1}{R} paid.

  This is extremely potent in a Kamigawa/Arcane storm deck.
  Classic example: Ideas Unbound ({U}{U}: Arcane sorcery, "draw 3, discard 3 at EOT") —
    NOT a storm spell, but with enough Arcane cycling (P407) + splice, you can build
    similar chains.

TARGETING FOR SPLICE COPIES:
  702.47d: "Choose targets for the added text normally."
  707.10c: "Some effects copy a spell and state that its controller may choose new
    targets for the copy."
  When a copy effect like Fork or Reverberate creates a copy, you may choose new targets.
  For the spliced text's targets: these are also changeable when the copy is created.
  Example: Glacial Ray spliced onto Reach Through Mists, targeting Goblin Guide (2/2).
    You Fork the spell. Copy of the spliced spell goes on stack.
    You may choose new targets for the copy: choose Monastery Swiftspear (1/2) instead.
    Copy: draws a card + deals 2 damage to Monastery Swiftspear.
    Original: draws a card + deals 2 damage to Goblin Guide.
    Monastery Swiftspear dies (2 damage = 2 toughness, lethal). Goblin Guide survives (2 damage, 2 toughness).

STORM COPIES AND TARGET CHOICE:
  Storm trigger creates copies: "you may choose new targets for any of the copies" (702.40a).
  Each storm copy of the spliced spell can have new targets.
  In a 5-copy storm scenario: target 5 different creatures (or the same one 5 times).
  5 × 2 damage = 10 damage to one target (enough to kill most creatures) or spread.

SPLICE ONTO NON-ARCANE (Edge Case):
  In theory, if a future mechanic allows "splice onto instant" or similar,
    the same rules apply: the text-changing effect makes it part of characteristics,
    and copies inherit it.
  As of Kamigawa (and all sets to date), splice only appears on "splice onto Arcane."
```

## Definitive Conclusions

- **Copies of spliced spells inherit the spliced text** — because splice is a text-changing effect (CR 702.47c), the spliced text is part of the spell's characteristics on the stack; copies always inherit characteristics (CR 707.2).
- **Storm copies also have the spliced text** — storm creates copies of the spell as it exists on the stack (with spliced text); each copy can deal damage / draw cards / etc. from the spliced text at no additional splice cost.
- **No additional splice cost is paid for copies** — the splice cost was paid once when the original was cast; the copy inherits the text-changed characteristics but didn't "cast" the splice again.
- **Targets in the spliced text can be changed on copies** — if the copy effect allows new target selection (Fork, Reverberate, storm's "may choose new targets"), the spliced text's targets can be changed independently.
- **CR 702.47e (loses splice changes on leaving the stack) applies to each spell object individually** — when the copy leaves the stack, it loses its splice changes, but this doesn't prevent it from resolving with those effects.

## Canonical Example
**Storm + Glacial Ray Splice Combo:**
You're playing a Kamigawa-era Arcane combo deck. Setup: turn 4, storm count building.

Spells cast this turn (storm count): 4 (you've cast 4 other spells).

In hand: Glacial Ray ({1}{R}: instant, Arcane — "Glacial Ray deals 2 damage to any target. Splice onto Arcane {1}{R}") and Peer Through Depths ({1}{U}: Arcane instant — "look at top 5 cards of library, reveal an instant or sorcery card, put it in hand, put rest on bottom").

You have an Arcane spell you want to storm with. Cast Peer Through Depths ({1}{U}).
Splice Glacial Ray onto Peer Through Depths: reveal Glacial Ray, pay {1}{R} additional.
Peer Through Depths now reads: "Look at top 5... [Glacial Ray deals 2 damage to any target.]"
Choose target for the damage: opponent's Tarmogoyf (current 3/4).

Storm trigger fires. Storm count = 4. Creates 4 copies of the spell.
Copies inherit the spliced text: each copy can deal 2 damage.
Choose new targets for each copy:
  Copy 1: deal 2 damage to Tarmogoyf (original target).
  Copy 2: deal 2 damage to Tarmogoyf again. (4 total — if Tarmogoyf is currently 3/4, it survives but takes 4 damage marked).
  Copy 3: deal 2 damage to opponent's Snapcaster Mage (2/1).
  Copy 4: deal 2 damage to opponent's face.

Resolution (LIFO):
Copy 4 resolves: look at 5, take an instant/sorcery + deal 2 to opponent (18 life).
Copy 3 resolves: look at 5, take a card + deal 2 to Snapcaster Mage (dies: 2/1 takes 2).
Copy 2 resolves: look at 5, take a card + deal 2 to Tarmogoyf (4 damage marked, survives if 3/4).
Copy 1 resolves: look at 5, take a card + deal 2 to Tarmogoyf (now 6 damage marked, dies if toughness ≤ 6).
Original resolves: look at 5, take a card + deal 2 to Tarmogoyf (moot — already dead).

Total: drew 4 cards, opponent took 2 damage to face, Snapcaster Mage died, Tarmogoyf destroyed.
Cost: {1}{U} (Peer) + {1}{R} (splice cost, paid once).
Glacial Ray still in hand.

**Example 2 — Reverberate Copying Spliced Splice Stack:**
You splice three Glacial Rays onto one Reach Through Mists (paying {1}{R} three times as additional costs).
Reach Through Mists + 3 spliced Glacial Rays = "draw a card. deal 2 damage (×3)."
Opponent casts Reverberate, copying your spliced spell. They choose new targets for all three damage instances.
The copy: draws a card (for YOU) — wait, who controls the copy?
Fork/Reverberate: "copy target instant/sorcery... you may choose new targets for the copy."
The opponent (Reverberate controller) controls the copy. The copy's controller draws a card.
Three 2-damage instances target their opponents (= you?) or creatures.

Wait — important: "draw a card" from Reach Through Mists is a non-targeted effect. The opponent's copy draws THEM a card (controller of the copy draws). And they direct the damage wherever they want.

Lesson: Splice is powerful, but copying it gives control of the copy (and its effects) to the copying player. This is relevant for politically using Twincast in multiplayer.

## Commonly Confused With
- **P409 (Copy Effects and Alternative/Additional Costs)** — P409 covers how copies inherit kicked, flashback, and buyback status. This pattern (P411) covers splice specifically because splice is a TEXT-CHANGING effect (not just an additional cost status), which is the reason the text is part of characteristics and therefore copied. The mechanism differs: kicker is a decision; splice is characteristic modification.
- **P406 (Ninjutsu/Splice)** — P406 covers the basics of how splice works (text added, card stays in hand, target independence). P411 specifically covers the interaction with copy effects and storm that makes splice far more powerful than its base rules suggest.
- **P405 (Storm/Affinity/Ward)** — Storm copies inherit characteristics. P405 covers what storm copies are (not casts). P411 shows the interaction: storm copies of spliced spells have the full spliced effect, making splice onto Arcane synergize exceptionally with storm.
