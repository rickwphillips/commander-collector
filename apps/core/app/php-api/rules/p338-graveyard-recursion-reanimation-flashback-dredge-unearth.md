---
id: p338
name: Graveyard Recursion — Reanimation, Flashback, Dredge, Unearth, and Madness
category: zones
cr_refs: [702.34a, 702.35a, 702.52a, 702.84a, 702.88a, 400.7, 603.6, 700.4]
tags: [reanimation, flashback, dredge, unearth, madness, graveyard, recursion, Reanimate, Animate-Dead, Faithless-Looting, Life-from-the-Loam, Griselbrand, Bloodghast, Ichorid, Archfiend-of-Ifnir, graveyard-hate, exile-graveyard, Narcomoeba]
created: 2026-03-29
examples_count: 2
---

# P338 — Graveyard Recursion — Reanimation, Flashback, Dredge, Unearth, and Madness

## Abstract
The graveyard is not just a discard pile — it's a resource zone enabling powerful recursive strategies. **Flashback** lets instants and sorceries be cast a second time from the GY (with an alternative cost), then exiles them. **Dredge** replaces drawing a card with milling N cards and returning the dredge card to hand. **Unearth** returns a creature from the GY to the battlefield temporarily (gains haste, exiles at end step). **Madness** intercepts discards and offers an alternative cost cast. **Reanimation** (general term for spells like Reanimate, Animate Dead) puts creatures from GY onto the battlefield directly. All interact critically with graveyard exile effects (Rest in Peace, Leyline of the Void).

## The Definitive Rules

**CR 702.34a** (verbatim): *"Flashback [cost] means 'You may cast this card from your graveyard if the resulting spell is an instant or sorcery spell by paying [cost] rather than paying its mana cost' and 'If the flashback cost was paid, exile this card instead of putting it anywhere else any time it would leave the stack.'"*

**CR 702.52a** (verbatim): *"Dredge N means 'As long as you have at least N cards in your library, if you would draw a card, you may instead mill N cards and return this card from your graveyard to your hand.'"*

**CR 702.84a** (verbatim): *"Unearth [cost] means '[Cost]: Return this card from your graveyard to the battlefield. It gains haste. Exile it at the beginning of the next end step. If it would leave the battlefield, exile it instead of putting it anywhere else. Activate only as a sorcery.'"*

**CR 702.35a** (verbatim): *"Madness [cost] means 'If a player would discard this card, that player discards it, but exiles it instead of putting it into their graveyard' and 'When this card is exiled this way, its owner may cast it by paying [cost] rather than paying its mana cost. If that player doesn't, they put this card into their graveyard.'"*

## The Pattern

```
REANIMATION (SPELLS AND ABILITIES):
  Generic term: spells that say "put target creature card from a graveyard onto the battlefield under your control."
  Examples:
    Reanimate ({B}): "Put target creature card from a graveyard onto the battlefield under your control.
      You lose life equal to its mana value."
    Animate Dead ({1}{B}): enchantment that brings back a creature from any GY.
    Unburial Rites ({4}{B}): "Return target creature card from your GY to the battlefield.
      Flashback {3}{W}."
    Necromancy ({2}{B}): similar to Animate Dead; brings back a creature from any GY.
  REANIMATION TARGETS:
    Any creature card in ANY graveyard (yours or opponent's).
    If you reanimate opponent's creature: it enters under YOUR control.
  THE "ENTERS UNDER YOUR CONTROL" RULE:
    Reanimated creature is a NEW object (CR 400.7). All previous effects, counters lost.
    Exception: Animate Dead is an Aura — it attaches to the creature and provides P/T modification.
    If the Aura is removed: the creature is destroyed (condition of Animate Dead).
  GRAVEYARD HATE vs. REANIMATION:
    If the target creature card is exiled before the reanimation resolves: spell fizzles.
    Rest in Peace (enchantment): "If a card would be put into a graveyard from anywhere, exile it instead."
    With Rest in Peace in play: creatures that die go to exile. Reanimation has nothing to target.
    Leyline of the Void ({2}{B}{B}): "If a card would be put into an opponent's graveyard from anywhere, exile it instead." Specifically exiles opponents' cards.
    Surgical Extraction: target a specific card in GY, exile it and all copies.

FLASHBACK (CR 702.34a):
  Alternative cost to cast instants/sorceries from GY.
  After casting with flashback: exiled instead of going to GY.
  FLASHBACK INTERACTS WITH COST REDUCTION:
    Faithless Looting ({R}: Draw 2, discard 2. Flashback {2}{R}).
    With Goblin Electromancer in play: flashback costs {1}{R} instead of {2}{R}.
    Cost reductions apply to the flashback cost (it's the alternative cost being used).
  FLASHBACK AND "WHEN YOU CAST":
    Casting via flashback = actual cast. Triggers prowess, storm count, etc.
  FLASHBACK AFTER EXILE:
    Dreadbore or Path to Exile: if your flashback card is exiled from GY (before you use it):
      It's no longer in GY → flashback can't be used. Exile loses it permanently.
    Rest in Peace: your spent spells can't flashback through RiP (they go to exile on resolution instead of GY).
  REBOUND (similar to flashback, CR 702.88a):
    Rebound appears on instants/sorceries. "When this resolves, exile it. At the beginning of your next upkeep, you may cast this card from exile without paying its mana cost."
    Rebound gives a FREE cast on next upkeep.
    Unlike flashback: doesn't require paying an alternative cost; it's fully free.
    Ephemerate ({W}): "Exile target creature you control, then return it to battlefield under your control. Rebound."
      Turn 1: cast Ephemerate. Blink a creature (ETB trigger). At upkeep: cast again for free. Another blink.
      Powerful because it doubles ETB value across two turns.

DREDGE (CR 702.52a):
  "If you would draw a card, you may instead mill N cards and return this card from GY to hand."
  Replaces A DRAW with mill N + return dredge card.
  IMPORTANT: this replaces the DRAW. You don't draw AND dredge.
  WHEN CAN YOU DREDGE:
    Any time you would draw a card: draw step, Opt, Brainstorm, etc.
    If you would draw via any effect: you may replace with dredge.
  DREDGE ONLY WORKS FROM GY:
    Dredge is a GY ability. The card must be in your GY to dredge.
  DREDGE FILLS GY FAST:
    Life from the Loam (Dredge 3): dredge 3, return Loam to hand.
      Each "draw" replaced by: mill 3, get Loam back. Mill fills GY for other effects.
    Stinkweed Imp (Dredge 5): mill 5, return Stinkweed to hand.
    Golgari Grave-Troll (Dredge 6): mill 6, return Troll to hand.
  DREDGE COMBO (VINTAGE DREDGE DECK):
    Goal: dredge through 50+ cards in turns 1-2. Fill GY with Narcomoeba (creature that enters when milled), Ichorid (free creature from GY), Prized Amalgam (returns when another creature enters from GY).
    Trigger Bridge from Below (if in GY when a creature dies): create Zombie tokens.
    This engine can generate 10+ creatures by turn 2 without casting spells.
  DREDGE AND REPLACE:
    If you dredge a card while your library is shorter than the dredge number: can't dredge (702.52b).

UNEARTH (CR 702.84a):
  "[Cost]: Return this card from your GY to the battlefield. It gains haste. Exile it at next end step."
  "If it would leave the battlefield, exile it instead of putting it anywhere else."
  TEMPORARY RECURSION: the creature comes back for one turn (until next end step).
  HASTE: it can attack immediately on the turn it's unearthed.
  LEAVES-BATTLEFIELD CLAUSE: "if it would leave the battlefield, exile it."
    If opponent Paths it (exile target creature): would go to exile → exile instead (same result — it's exiled).
    If opponent Doom Blades it: would go to GY → replaced with exile.
    If opponent bounces it: would go to hand → replaced with exile.
    The creature cannot be saved once unearthed — it will end up in exile regardless.
  UNEARTH TWICE? NO:
    After exile: the card is in exile. Unearth only works while in GY. Can't unearth from exile.
  EXAMPLES:
    Bloodghast ({1}{B}): "Bloodghast has haste as long as an opponent has 10 or fewer life. Landfall — Whenever a land enters under your control, you may return Bloodghast from your GY to the battlefield." No unearth, but it's a self-recurring creature.
    Dregscape Zombie ({1}{B}): "Unearth {B}." Return for {B} with haste for one turn.
    Extractor Demon: "Unearth {3}{B}."

MADNESS (CR 702.35a):
  Madness intercepts the discard event:
    Player would discard the madness card → it's exiled instead.
    Triggered ability: "you may cast it by paying the madness cost."
    If cast: it works normally (cast spell, resolves, etc.).
    If not cast: it's put into the GY.
  TIMING: madness cast happens when the discard happens.
    You can cast a madness card in response to the discard trigger being on the stack.
    But more accurately: the discard is replaced by exile, and you're given the chance to cast immediately.
    This can happen at instant speed (e.g., if discarded by Liliana's ability during opponent's turn).
  MADNESS EXAMPLES:
    Fiery Temper ({2}{R}, Madness {R}): when discarded (e.g., via Faithless Looting), cast for {R}.
      {R} Shock-equivalent (3 damage to any target). Free discount from the discard.
    Archfiend of Ifnir ({3}{B}{B}, Cycling {2}): 5/4 Flying. Does NOT have Madness.
      Has a triggered ability: "Whenever you cycle or discard another card, put a -1/-1 counter on each creature your opponents control." Strong in cycling/discard decks but is not itself a madness card.
    Circular Logic ({2}{U}, Madness {U}): counterspell for {U} when discarded.
  DISCARD OUTLETS FOR MADNESS:
    Any "discard a card" effect is a madness outlet.
    Insolent Neonate ({R}): discard a card, draw a card (activated ability).
    Merfolk Looter ({1}{U}): {T}: draw a card, then discard a card.
    Looting effects + madness = double value.

INTERACTION: GRAVEYARD EXILE EFFECTS:
  Rest in Peace ({1}{W}): "If a card would be put into a graveyard from anywhere, exile it instead."
  With RiP in play: ALL GY interactions die.
    Flashback: cards go to exile when resolving (via flashback or normally). Can't flashback again.
    Dredge: cards that would mill go to exile. Can't build GY for dredge returns.
    Reanimation: no creatures in GY to target.
    Unearth: can't unearth from exile (it was exiled before reaching GY).
    Madness: not directly affected — madness intercepts DISCARDS (not GY placement).
      The madness card would be exiled by the discard interception first. That's how madness works anyway.
      But: if you don't cast the madness spell, it's "put into the GY." With RiP: it goes to exile instead.
      Madness cards end up in exile if not cast.
```

## Definitive Conclusions

- **Flashback is an alternative cost to cast from GY** — cost reductions apply; the card exiles on resolution (can't GY again).
- **Dredge replaces a draw event** — you don't get both the draw AND the dredge; you choose one or the other.
- **Unearth is temporary** — the creature is exiled at end of turn regardless of how it leaves the battlefield.
- **Madness intercepts the discard event** — the card is exiled first, giving a window to cast it cheaply; if not cast, it goes to GY.
- **Rest in Peace shuts down nearly all graveyard strategies** — cards that would go to GY go to exile, breaking all GY-dependent effects.
- **Reanimated creatures are new objects** — all counters, previous effects, and history are lost on re-entry.

## Canonical Example
**Dredge Combo — Filling the Graveyard:**
Vintage Dredge. Turn 1:
  Play Bazaar of Baghdad ({T}: draw 2, discard 3). Activate.
  Draw 2, discard 3: discard Golgari Grave-Troll, Stinkweed Imp, and Ichorid.
  GY: Golgari Grave-Troll, Stinkweed Imp, Ichorid.
Turn 2 draw step:
  You would draw a card. Choose to DREDGE 6 (Golgari Grave-Troll).
  Mill 6 cards. Grave-Troll returns to hand.
  Milled cards might include: Narcomoeba (it enters when milled; it has a GY trigger).
  Milled also: more dredge cards, more creatures.
Turn 2 (still draw step replaced): potentially dredge again with other dredge cards.
  Wait: you replaced one draw with the dredge. If you want to dredge more: need more draw events.
  Bazaar: activate again (discard 3, draw 2). Use draws to dredge again.
  Each Bazaar activation: up to 2 dredge replacements. Mill 6+5 = 11 cards potentially.
After 2-3 turns of this: 30-40 cards milled. GY full of Prized Amalgams, Ichorids, Narcomoebas.
Ichorid: exile a black creature from your GY at the start of your upkeep: return Ichorid to the field.
  Attack with Ichorid. Sacrifice at end of turn.
  Next upkeep: repeat.
Prized Amalgam: returns at end of turn when a creature enters from your GY (like Ichorid).
The engine generates 5+ power attacking with 0 mana invested per turn.

**Example 2 — Faithless Looting + Fiery Temper:**
Your hand: Faithless Looting ({R}), Fiery Temper ({2}{R}, Madness {R}).
Opponent at 3 life. You have {R}{R} available.
Cast Faithless Looting: "Draw 2, then discard 2. Flashback {2}{R}."
Draw 2 cards. Now discard 2.
Discard Fiery Temper (madness card):
  Madness triggers: Fiery Temper is exiled instead of going to GY.
  Triggered ability: "you may cast this card by paying {R} rather than its mana cost."
  Cast Fiery Temper for {R}. Fiery Temper goes on stack.
Fiery Temper resolves: "Deal 3 damage to any target." Target opponent.
Opponent takes 3 damage. Opponent was at 3 life → 0 life → loses.

Total mana spent: {R} for Faithless Looting + {R} for madness Fiery Temper = {R}{R}.
Without madness: Fiery Temper costs {2}{R}.
Net savings: 2 mana + you also drew 2 cards first.
The discard cost of Faithless Looting was PAID by the madness card — you got a draw AND a cheap damage spell.

## Commonly Confused With
- **P311 (New Object Rule)** — Reanimated creatures are new objects. Spells targeting "that creature" before reanimation can't find the new object.
- **P315 (Token Rules)** — Tokens that "die" would go to GY, then cease to exist (SBA 704.5d). With Rest in Peace: they go to exile instead. Either way, they can't be reanimated (tokens can't be put from exile onto battlefield as a "creature card from GY" effect).
- **P329 (Casting Costs)** — Flashback is an alternative cost. Unearth is an activated ability cost (not an alternative cost for casting — the card isn't being "cast" via unearth; it's being put directly onto the battlefield).
- **P330 (Commander)** — Commander players care about graveyard hate because many commanders have ETB abilities or powerful recursion. Sending commanders to command zone instead of GY bypasses most graveyard hate effects.
