---
id: p494
name: Exhaust — Once-Per-Object Activated Ability, Blink Reset, and Mana-Ability Exception
category: stack
cr_refs: [702.177a, 702.177b, 605.3, 400.7, 706.10]
tags: [exhaust, one-shot, activate-only-once, object-identity, blink-reset, mana-ability, copy-exhaust, sala-deck-boss, loot-pathfinder, greasewrench-goblin, elvish-refueler, aetherdrift, DFT, per-object-tracking, new-object]
created: 2026-03-30
examples_count: 3
---

# P494 — Exhaust — Once-Per-Object Activated Ability, Blink Reset, and Mana-Ability Exception

## Abstract
**Exhaust** (Aetherdrift, 2025; CR 702.177) is a keyword for activated abilities that can only be used once per battlefield presence. The restriction is **per-object** — if the permanent leaves the battlefield and returns (even same turn via blink), it is a new object and its exhaust ability can be used again. A card may have multiple separate exhaust abilities, each tracked independently. Two major edge cases: (1) Sala, Deck Boss copies non-mana exhaust abilities automatically, and since copying an ability is not "activating" it, the copy doesn't consume the one-use limit on the ability. (2) Elvish Refueler's "haven't activated an exhaust this turn" window is disrupted the moment you begin activating any exhaust ability — including Refueler's own.

## The Definitive Rules

**CR 702.177a** (verbatim): *"An exhaust ability is a special kind of activated ability. 'Exhaust — [Cost]: [Effect]' means '[Cost]: [Effect]. Activate only once.'"*

**CR 702.177b** (verbatim): *"An effect may allow you to take an action as long as you haven't activated an exhaust ability this turn. Such an effect allows that action only if you haven't begun to activate an exhaust ability this turn. Example: Elvish Refueler has an exhaust ability that costs mana and also has an ability that reads 'During your turn, as long as you haven't activated an exhaust ability this turn, you may activate exhaust abilities as though they haven't been activated.' Loot, the Pathfinder has an exhaust ability that is also a mana ability. If you've already activated both of these abilities in a previous turn, you can't activate Loot's mana ability during the process of activating Elvish Refueler's exhaust ability, because you have already begun to activate a different exhaust ability."*

## The Pattern

```
EXHAUST = "ACTIVATE ONLY ONCE" (702.177a):
  An exhaust ability works exactly like a normal activated ability EXCEPT it tracks
  whether it has been activated for the current battlefield presence of the permanent.
  The restriction is "Activate only once" — once per OBJECT, not once per game.

MULTIPLE EXHAUST ABILITIES (PER-ABILITY TRACKING):
  A single card may have multiple separate exhaust abilities (e.g., Loot, the Pathfinder has three).
  Each exhaust ability is tracked INDEPENDENTLY.
  Using Loot's {G} mana exhaust doesn't prevent using Loot's {U} draw exhaust later.
  You can use all three of Loot's exhaust abilities in the same turn (one at a time, or spread out).
  → Loot, the Pathfinder ({2}{G}{U}{R}: 2/4 double strike, vigilance, haste):
      Exhaust — {G}, {T}: Add three mana of any one color.
      Exhaust — {U}, {T}: Draw three cards.
      Exhaust — {R}, {T}: Loot deals 3 damage to any target.
    You can use all three in one turn for {G}{U}{R} and {T}{T}{T} total.

BLINK RESETS EXHAUST — THE NEW OBJECT RULE (CR 400.7):
  When a permanent leaves the battlefield and returns, it is a NEW OBJECT (CR 400.7).
  As a new object, it has no memory of previous activations.
  Official ruling (2025-02-07): "If an exhaust ability of a permanent is activated, and then
    that permanent leaves the battlefield and returns, it becomes a new object — its exhaust
    ability can be activated again."
  This applies to:
    → Blink (Ephemerate, Conjurer's Closet): exile and return → new object → exhaust reset.
    → Any zone change that returns the permanent: bounce + recast, die + reanimate.
    → Phasing out: phasing is NOT a zone change (CR 702.26d); phased-out permanents are
      the same object — exhaust state is PRESERVED through phasing.
  Blink Abuse: with Loot + Ephemerate, you can use all three exhaust abilities each time
    you blink Loot. Flickering once = three fresh exhausts = nine total effects over 2 turns.

COPY EFFECTS AND EXHAUST:
  If an effect copies a permanent with exhaust (creates a token copy), the token has
    the exhaust ability fresh — the token is a new object that has never activated.
  The token can use its exhaust ability once normally.
  Sala, Deck Boss ({1}{U}{R}: 3/3): "Whenever you activate an exhaust ability that isn't
    a mana ability, copy it. You may choose new targets for the copy."
    → The COPY of the exhaust ability is put on the stack. This is not "activating" the ability.
    → The original activation consumed the one-use limit for that exhaust.
    → The copy does NOT consume a use of anything — it's just a copy on the stack.
    → Net effect: you effectively get two uses of a non-mana exhaust — one activation + one copy.

SALA + LOOT INTERACTION (MANA ABILITY EXCEPTION):
  Loot has three exhaust abilities. Two of them ({U}: draw 3, {R}: deal 3) are non-mana.
  One of them ({G}: add three mana) IS a mana ability (CR 605.3: produces mana).
  Sala copies "exhaust abilities that aren't mana abilities."
  → {U} draw 3: activating triggers Sala → copy fires → draw 6 total.
  → {R} deal 3: activating triggers Sala → copy fires → deal 6 total.
  → {G} add 3 mana: mana ability — Sala does NOT copy this.
  Per turn with Sala + Loot: {G}{U}{R} = 3 mana added, draw 6 cards, deal 6 damage.

ELVISH REFUELER — THE SELF-DISRUPTING WINDOW (CR 702.177b):
  Elvish Refueler ({2}{G}: 2/3):
    "During your turn, as long as you haven't activated an exhaust ability this turn,
     you may activate exhaust abilities as though they haven't been activated."
    Exhaust — {1}{G}: Put a +1/+1 counter on this creature.
  The static ability lets you re-activate already-used exhaust abilities IF you haven't
    activated any exhaust yet this turn.
  BUT: the moment you "begin to activate" any exhaust ability (even Refueler's own),
    the condition is no longer met. So:
    → If Loot's mana exhaust ({G}) was used in a previous turn:
      You can activate Refueler's Exhaust first (costs {1}{G}), gaining the counter.
      Then the static ability is gone (you've activated exhaust this turn).
      You CANNOT then use Loot's exhausted {G} ability again.
    → If you try to use Loot's {G} mana exhaust DURING the process of activating Refueler:
      CR 702.177b says: "you can't activate Loot's mana ability during the process of
      activating Elvish Refueler's exhaust ability, because you have already begun to
      activate a different exhaust ability."
  Correct use: activate Refueler's static to re-use Loot's exhausted draw/damage abilities
    (those are non-mana and so can be reactivated — but only if you haven't activated ANY
    exhaust yet this turn, and Refueler's static is what allows the "re-use" of exhausted ones).
    Wait: re-reading Refueler: the static says "activate exhaust abilities as though they
    haven't been activated." This means the one-use restriction is lifted as long as the
    condition holds. The condition: haven't activated an exhaust this turn.
  Practical use: On a fresh turn (no exhaust activated yet):
    → All of Loot's exhausts from prior turns can be reactivated AS IF fresh.
    → Activate Loot's {U} draw 3 (it was exhausted; now it's as-if-fresh thanks to Refueler).
    → But you just activated an exhaust ability → condition broken → no more "as if fresh."
    → So Refueler effectively grants you ONE free exhaust reactivation per turn.
```

## Definitive Conclusions

- **Exhaust tracks per object, not per game** — a permanent that leaves and returns to the battlefield is a new object and can exhaust again; phasing preserves exhaust state.
- **Each exhaust ability on a card is tracked independently** — a creature with three exhaust abilities can use all three in the same turn; using one doesn't lock out the others.
- **Copying an exhaust ability is NOT activating it** — Sala, Deck Boss's copies of exhaust abilities don't consume the ability's one-use limit; the activation does, but the copy is free.
- **Sala doesn't copy mana abilities** — Loot's {G} mana exhaust is a mana ability and is excluded from Sala's copy trigger; only non-mana exhausts are copied.
- **Elvish Refueler grants ONE re-exhaust per turn** — the static ability allows exhaust reactivation only while no exhaust has been activated this turn; using any exhaust (including Refueler's own) immediately ends the window.

## Canonical Example

**Loot, the Pathfinder ({2}{G}{U}{R}: 2/4 double strike, vigilance, haste) + Sala, Deck Boss ({1}{U}{R}: 3/3):**

Turn setup: both are on the battlefield.

Step 1: Activate Loot's {U}, {T} exhaust: Draw three cards.
  → Sala trigger fires (non-mana exhaust): copy the "Draw three cards" ability.
  → Copy resolves first: draw 3 more cards.
  → Original resolves: draw 3 cards.
  → Net: draw 6 cards total from one activation.

Step 2: Activate Loot's {R}, {T} exhaust: Loot deals 3 damage to any target.
  → Sala trigger fires: copy "deal 3 damage to any target" (may choose new target).
  → Two damage abilities resolve: 6 total damage dealt.

Step 3: Activate Loot's {G}, {T} exhaust: Add three mana of any one color.
  → Sala does NOT trigger (mana ability exception).
  → Three mana added to your mana pool.

Total this turn from Loot: 6 cards drawn, 6 damage dealt, 3 mana produced. All three exhausts used once.

**Example 2 — Blink Reset:**
Loot, the Pathfinder has used all three exhaust abilities. You cast Ephemerate ({W}: "exile target creature you control, return it to the battlefield under its owner's control at the beginning of the next end step"):

Ephemerate exiles Loot. At the beginning of next end step, Loot returns to the battlefield. Loot is now a NEW OBJECT — all three exhaust abilities are fresh again. You can use them all again next turn.

With Sala present: next turn you draw 6 more cards, deal 6 more damage, add 3 more mana. Loot + Sala + blink engines create enormous value.

**Example 3 — Greasewrench Goblin ({R}: 2/1, Exhaust — {2}{R}: Discard up to 2 cards, draw that many, put a +1/+1 counter on it):**

The simplest exhaust creature. Use once: loot effect + counter. The counter stays. If you blink it (e.g., with Conjurer's Closet), it returns as a new object — exhaust is fresh, and the counter is also gone (it returned with no counters, as a new ETB). You can use the exhaust again, placing another counter.

## Commonly Confused With
- **P016 (Morph)** — Morph turns face-up as a special action (can't be responded to). Exhaust activates normally as an activated ability (can be responded to, countered with Stifle, etc.). Both involve one-time per-object mechanics but through completely different rules mechanisms.
- **P407 (Cycling/Kicker/Buyback)** — Those are cast-time additional costs. Exhaust is an activated ability on a permanent — used after the card is on the battlefield, not during casting.
- **P003 (Zone Change Object Identity)** — P003 covers when an object is considered "the same." Exhaust explicitly uses the new-object rule: blink creates a new object, resetting exhaust. This is one of the clearest practical examples of how zone changes matter for per-object tracking.
