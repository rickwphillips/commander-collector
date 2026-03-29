---
id: p223
name: Bestow — Enchantment Creature That Can Be Cast as an Aura
category: costs
cr_refs: [702.103a, 702.103b, 702.103c, 702.103d, 702.103e]
tags: [bestow, enchantment-creature, aura, fall-off-to-creature, Theros, Boon-Satyr, Herald-of-Torment, constellation]
created: 2026-03-28
examples_count: 2
---

# P223 — Bestow — Enchantment Creature That Can Be Cast as an Aura

## Abstract
Bestow is an alternative cost: instead of casting the enchantment creature normally, you can cast it "for its bestow cost" to have it become an Aura enchanting a creature. When cast with bestow, it's NOT a creature while on the stack — it's an Aura. If the enchanted creature leaves the battlefield, the bestow card stops being an Aura and enters the battlefield as a creature (it doesn't go to the graveyard). This "fallback to creature" mechanic makes bestow spells resilient: they either enchant something (Aura mode) or crash as a standalone creature.

## The Definitive Rules

**CR 702.103a** (verbatim): *"Bestow represents two static abilities, one of which functions while the card is on the stack and one of which functions while the card is on the battlefield. 'Bestow [cost]' means 'You may cast this card as an Aura spell with enchant creature for its bestow cost rather than its mana cost, and this card becomes an Aura with enchant creature as long as it is an Aura on the stack or on the battlefield.'"*

**CR 702.103b** (verbatim): *"If you chose to pay the bestow cost, the card is an Aura spell while it's on the stack, and it enchants target creature on resolution."*

**CR 702.103c** (verbatim): *"If a bestow card would be put into a graveyard from anywhere and the bestow cost was paid to cast it, instead it stops being an Aura and becomes an enchantment creature, then is placed on the battlefield under the control of the player who controlled it as an Aura."*

**CR 702.103d** (verbatim): *"If a bestow card would be put into a graveyard for any other reason while it's an Aura (including because its enchanted creature leaves the battlefield), instead it stops being an Aura and enters the battlefield as an enchantment creature."*

**CR 702.103e** (verbatim): *"A bestow card's characteristics are those of the Aura while it's on the stack or battlefield as an Aura spell or Aura permanent. They are those of the enchantment creature while it's anywhere else."*

## The Pattern

```
BESTOW CASTING OPTIONS:
  Option 1 (Normal): cast as enchantment creature for normal mana cost
  → Creature on stack, enters as a creature
  Option 2 (Bestow): cast as Aura for bestow cost (usually higher)
  → Aura on stack, enchants target creature when it resolves

BESTOW + FALLBACK:
  If the enchanted creature leaves the battlefield:
  The bestow card "stops being an Aura and enters the battlefield as an enchantment creature"
  NOT: goes to graveyard like a regular Aura!
  The bestow card STAYS in the game as a creature instead of dying with the enchanted creature
  This is the key resilience of bestow vs. regular Auras

BESTOW + COUNTERING:
  Bestow card cast with bestow cost (as an Aura spell) is countered:
  CR 702.103c: "if would be put into graveyard... instead stops being Aura and becomes enchantment creature"
  A countered bestow Aura spell → enters battlefield as a creature (not graveyard!)
  Very odd: countering the Aura causes the card to ENTER PLAY as a creature
  It's like countering the Aura mode just "defaults" to the creature mode

  Wait — let me re-read CR 702.103c: "if would be put into graveyard from anywhere and bestow cost was paid"
  Countered spells go to graveyard — so CR 702.103c applies: instead of GY, enters as creature
  This is correct: counter a bestow spell → it enters as a creature

BESTOW + TARGETING:
  When cast with bestow: it's an Aura spell that needs to target a creature
  If the target becomes illegal before it resolves (e.g., creature gains hexproof): Aura countered
  But: counter a bestow Aura → it enters as creature (per above)

BESTOW + ENCHANTRESS:
  Bestow cast as an Aura: it's an Aura spell → triggers "whenever you cast an enchantment spell"
  Resolves as an enchantment Aura → triggers "whenever an enchantment enters"
  If the bestow creature later becomes a standalone creature: another "creature enters" trigger
  Multiple trigger points!

BESTOW + CONSTELLATION:
  Constellation: "whenever an enchantment enters the battlefield under your control, [effect]"
  Bestow card entering as an Aura on creature: triggers Constellation (enchantment entered)
  Bestow card "falling off" an enchanted creature → enters as enchantment creature: ANOTHER Constellation trigger!
  Strategic: let the enchanted creature die to get a second Constellation trigger from the same bestow card

BOON SATYR ({1}{G}{G}):
  3/2 enchantment creature with Flash and Bestow {4}{G}{G}
  Normal cast ({1}{G}{G}): 3/2 flash creature
  Bestow ({4}{G}{G}): attach to a creature → that creature gets +3/+2
  If enchanted creature is killed: Boon Satyr stops being Aura → enters as 3/2 creature
  Net: enchanted target was killed, but you still have a 3/2 in play

HERALD OF TORMENT ({1}{B}{B}):
  3/3 enchantment creature with flying and Bestow {4}{B}{B}
  "At the beginning of your upkeep, pay 1 life" (while enchanting)
  Bestowed: gives the enchanted creature flying (+3/+3, gives flying)
  Fallback: Herald itself flies and is a 3/3 if the enchanted dies

BESTOW + LAYERS:
  Bestow card as Aura: adds text/P/T to enchanted creature (layer 3/7 effects)
  When it becomes a standalone creature: no longer has those layer effects on the previously enchanted creature
  Each mode (Aura vs. Creature) has entirely different characteristics
```

## Definitive Conclusions

- **Bestow = cast as Aura OR creature** — pay bestow cost for Aura mode.
- **Fallback to creature**: if the enchanted creature leaves (dies, bounced, exiled), bestow card enters battlefield as a creature instead of going to graveyard.
- **Countered bestow Aura** also enters as a creature — countering it just converts to creature mode.
- **Constellation synergy**: two constellation triggers per bestow card — once on entry, once if it falls off.
- **More resilient than regular Auras**: regular Auras go to graveyard when enchanted creature dies; bestow doesn't.

## Canonical Example
**Boon Satyr ({1}{G}{G}, Bestow {4}{G}{G}) in Theros Limited:**
You have a 4/4 creature. Cast Boon Satyr with bestow ({4}{G}{G}): it becomes an Aura.
Target your 4/4: enchant it → your creature is now 7/6.
Opponent uses Doom Blade on your 7/6.
Doom Blade resolves: the enchanted creature is destroyed.
Boon Satyr: "instead of going to graveyard, stops being an Aura, enters as enchantment creature."
Boon Satyr (3/2) enters the battlefield.
The bestowed creature died, but you have a fresh 3/2 in play. 2-for-1 in your favor.

**Example 2 — Bestow + Constellation in Commander:**
Control Eidolon of Blossoms (enchantment creature with Constellation: "draw a card").
Cast Boon Satyr with bestow on one of your creatures:
Eidolon sees an enchantment enter → draw a card.
Later: opponent destroys the enchanted creature.
Boon Satyr falls off → enters as enchantment creature:
Eidolon sees ANOTHER enchantment enter → draw another card!
Two draws from one bestow card: cast + fallback.

## Commonly Confused With
- **P186 (Disguise)** — Disguise is face-down casting. Bestow is Aura/creature alternative casting. Both have special casting modes.
- **P207 (Adventure)** — Adventure casts as instant/sorcery then exiles for later permanent cast. Bestow casts as Aura or stays as creature if Aura mode fails.
- **P220 (Ward)** — Ward is a triggered protection ability. Bestow is a casting alternative for enchantment creatures.
