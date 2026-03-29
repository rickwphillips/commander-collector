---
id: p272
name: Impending and Exhaust — Time-Counter Non-Creature Entry and Once-Only Activation
category: replacement
cr_refs: [702.176a, 702.177a, 702.177b]
tags: [impending, exhaust, time-counter, non-creature, once-only, activated-ability, Duskmourn, Aetherdrift, Overlord-of-the-Heap, Hollow-Marauder, Elvish-Refueler]
created: 2026-03-29
examples_count: 2
---

# P272 — Impending and Exhaust — Time-Counter Non-Creature Entry and Once-Only Activation

## Abstract
Two mechanics from 2024-2025. **Impending** (Duskmourn: House of Horror): an alternative cost on creature cards that enters the permanent with N time counters. While it has those counters, it's NOT a creature — it functions as a non-creature permanent. At the beginning of each end step, remove a time counter. When the last counter is removed, the permanent finally becomes a creature (no longer just an enchantment/artifact). Impending delivers big, powerful creatures with a countdown delay — pay less mana but wait for the creature. **Exhaust** (Aetherdrift): a special kind of activated ability that can only be activated once — permanently, across all turns. Unlike "once per turn" abilities, an Exhaust ability is truly one-and-done for the entire game.

## The Definitive Rules

**CR 702.176a** (verbatim): *"Impending is a keyword that represents four abilities. The first is a static ability that functions while the spell with impending is on the stack. The second is static ability that creates a replacement effect that may apply to the permanent with impending as it enters the battlefield from the stack. The third is a static ability that functions on the battlefield. The fourth is a triggered ability that functions on the battlefield. 'Impending N—[cost]' means 'You may choose to pay [cost] rather than pay this spell's mana cost,' 'If you chose to pay this permanent's impending cost, it enters with N time counters on it,' 'As long as this permanent's impending cost was paid and it has a time counter on it, it's not a creature,' and 'At the beginning of your end step, if this permanent's impending cost was paid and it has a time counter on it, remove a time counter from it.'"*

**CR 702.177a** (verbatim): *"An exhaust ability is a special kind of activated ability. 'Exhaust — [Cost]: [Effect]' means '[Cost]: [Effect]. Activate only once.'"*

## The Pattern

```
IMPENDING:
  Alternative cost: pay impending cost instead of normal mana cost
  Impending cost is typically CHEAPER than normal mana cost
  If paid: permanent enters with N time counters AND is NOT a creature (even if it's a creature card)
  Each end step: if impending was paid and has time counters → remove one counter
  When all counters are gone: the permanent IS a creature again (the "not a creature" static ends)

  IMPENDING COUNTDOWN:
    N=4 Impending: enters with 4 time counters
    End step 1: 3 counters remaining. Still not a creature.
    End step 2: 2 counters. Not a creature.
    End step 3: 1 counter. Not a creature.
    End step 4: 0 counters. Static ability ("not a creature") no longer applies → becomes a creature.
    At 0 counters: the permanent is NOW a creature (with all its normal abilities).

  IMPENDING + OTHER TYPES:
    The creature card has types like "Enchantment Creature" or "Artifact Creature"
    While impending and has counters: the non-creature types still apply (it's an enchantment, etc.)
    Only the creature type is suppressed
    Target "artifact" removal still hits it (it's still an artifact if printed as such)

  IMPENDING + REMOVAL:
    While impending (has counters, not a creature):
      Can't be targeted by "destroy target creature" effects (it's not a creature!)
      CAN be targeted by "destroy target non-creature artifact/enchantment" effects
      A 4-turn delay that also provides partial immunity during the wait
    Once the counters are gone: it IS a creature → vulnerable to creature removal

  IMPENDING + PROLIFERATE:
    Adding time counters via Proliferate: delays the creature further
    An opponent Proliferating your impending permanent: adds a counter → longer wait
    Usually not good for the impending controller to be proliferated here

  IMPENDING + TIME-COUNTER REMOVAL:
    Effects that remove counters can accelerate the countdown
    If ALL counters are removed simultaneously (Hex Parasite, etc.): the permanent becomes a creature NOW
    Acceleration: you can use counter-removal on YOUR own Impending permanents to deploy them faster

  IMPENDING NOTABLE CARDS (Duskmourn: House of Horror):
    Overlord of the Heap ({5}{B}{B}, Creature Eldrazi 7/7 Trample):
      Impending 4 — {3}{B}: enters with 4 time counters for only {3}{B} (4 mana instead of 7).
      Four end steps later: becomes a 7/7 Trample creature.
      While counting down: it's a non-creature permanent (some type — enchantment?).
      Strategy: cast on turn 4, untaps as a 7/7 Trample on turn 8 for "free" (paid {3}{B}).

    Hollow Marauder ({4}{B}, Creature 5/5 Menace):
      Impending 3 — {2}{B}: enters with 3 time counters for {2}{B} (3 mana instead of 4).
      Three end steps later: becomes 5/5 Menace.
      {2}{B} for a future 5/5 Menace is incredible value — but you wait 3 turns.

  IMPENDING + HASTE:
    When the impending permanent's counters run out and it becomes a creature:
      Does it have haste? Only if it naturally has haste.
      No automatic haste on "becoming a creature" via impending.
      The permanent doesn't "enter the battlefield as a creature" — it was already on the battlefield.
      It simply gains the creature type/rules once the "not a creature" static ends.
      No summoning sickness for the first time (it was already on the field) — can attack immediately!
    Wait: Summoning sickness prevents attacking if the creature hasn't been under control since turn start.
    The permanent was under your control all along → no summoning sickness when counters run out.
    A creature that becomes a creature mid-turn (after being a non-creature): can attack that same turn?
    The rule is: summoning sickness applies to creatures that "came under your control this turn"
    Impending: the permanent came under your control turns ago → no summoning sickness.
    The 7/7 can attack THE TURN its counters run out! (Or even if counters are removed mid-turn.)

EXHAUST:
  Special activated ability: activatable only ONCE, ever
  "Activate only once" — not "once per turn," but once per game
  Even if the permanent changes zones and returns: the exhaust ability has been used permanently
  Similar to "monstrous" (can only become monstrous once) but as an activated ability

  EXHAUST RULES:
    Once activated: it's exhausted permanently
    "Activate only once" is tracked per ability instance
    If the permanent leaves and returns: it's a new instance → the exhaust can be used again
    Wait: the CR states "Activate only once" — does a zone change reset this?
    Rule 400.7: objects in different zones are different objects. A returned permanent is a new object.
    So: Exhaust resets when the permanent leaves and re-enters the battlefield.
    But in normal gameplay: you get one use per time the card is on the battlefield.

  EXHAUST NOTABLE CARDS (Aetherdrift):
    Elvish Refueler (Aetherdrift): has Exhaust with an interesting rule interaction.
      "Exhaust — {G}: [Effect]. Also has 'During your turn, as long as you haven't activated an
      exhaust ability this turn, you may activate exhaust abilities as though they haven't been activated.'"
      This specific card allows using other exhaust abilities within a turn if you haven't used one yet.
      Complex: Elvish Refueler gives you a window to use exhaust abilities as if fresh.

    Loot, the Pathfinder (Aetherdrift): has an Exhaust ability that's also a mana ability.
      A mana ability with Exhaust: it's a mana ability AND can only be used once.
      Special interaction with Elvish Refueler: see CR 702.177b example.

  EXHAUST APPLICATIONS:
    Exhaust abilities often have powerful effects that justify being once-per-game
    "Use it when it matters most" decision-making
    Unlike activated abilities that can be repeated: Exhaust is a one-time trump card
    Plan for: when is the most important turn to activate this?
```

## Definitive Conclusions

- **Impending enters as a non-creature with N time counters** — counts down each end step, becomes a creature at 0.
- **Impending permanents are NOT creatures while they have counters** — immune to creature removal during the countdown.
- **An Impending permanent can attack the turn its counters run out** — it was under your control before that turn, so no summoning sickness.
- **Exhaust abilities can only be activated once** per time the permanent is on the battlefield.
- **Zone changes reset Exhaust** — a returning permanent is a new object and can use its Exhaust again.

## Canonical Example
**Overlord of the Heap Impending Value:**
Turn 4: you have {3}{B}. Your hand has Overlord of the Heap.
Normal cost {5}{B}{B}: 7 mana away. But impending {3}{B}: cast it now.
Overlord enters with 4 time counters. It's NOT a creature.
Opponent casts "Destroy target creature" → can't target Overlord (not a creature!).
Opponent's "Wrath of God" → Overlord survives (not a creature → not affected by creature Wrath).
Turns 4-7: each end step, remove a counter. 3...2...1...0.
Turn 8, end step: counter runs out. Overlord is now a 7/7 Trample creature.
Turn 9: your turn begins. Overlord was under your control since turn 4 → no summoning sickness.
Attack with 7/7 Trample. Paid {3}{B} on turn 4 for a 7/7 Trample that arrived on turn 8.

**Example 2 — Exhaust on a Legendary Creature:**
Board: Bountiful Progenitor (legendary creature with "Exhaust — {2}{G}: create three 1/1 tokens").
Turn 5: use the Exhaust. Pay {2}{G}, create three tokens. Exhaust is used up — permanently.
Turns 6-20: the ability is exhausted. You have 3 tokens from it.
Turn 15: opponent bounces Bountiful Progenitor to your hand. You re-cast it.
The new instance enters the battlefield: it's a new object → Exhaust has NOT been used.
Turn 16: use Exhaust again. Create three more tokens.
Zone change reset: bouncing a permanent and re-casting resets Exhaust.

## Commonly Confused With
- **P233 (Vanishing)** — Vanishing has time counters on a permanent and it's exiled when the last counter is removed; Impending uses time counters to countdown to becoming a creature (no exile on last counter).
- **P226 (Monstrous)** — Monstrous is also "once per lifetime" (can only become monstrous once); Exhaust is explicitly "Activate only once" while Monstrous is "can't activate again after becoming monstrous." Monstrous DOES reset on zone change (new object); Exhaust similarly resets on zone change.
- **P255 (Suspend)** — Suspend exiles a card with time counters, removing one each upkeep for a future free cast; Impending has time counters on a permanent already on the battlefield counting down to becoming a creature.
