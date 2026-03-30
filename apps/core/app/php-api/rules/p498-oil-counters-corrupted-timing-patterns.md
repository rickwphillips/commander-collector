---
id: p498
name: ONE — Oil Counters as Countdown Resource and Corrupted's Four Timing Patterns
category: triggered
cr_refs: [704.5a, 702.164, 120.3, 603.4, 613.3]
tags: [oil-counters, corrupted, archfiend-of-the-dross, evolved-spinoderm, tekuthal, vorinclex, proliferate, last-known-information, countdown, ability-word, activation-restriction, cost-reduction, resolution-check, continuous-static, phyrexia-all-will-be-one, ONE]
created: 2026-03-30
examples_count: 3
---

# P498 — ONE — Oil Counters as Countdown Resource and Corrupted's Four Timing Patterns

## Abstract
**Phyrexia: All Will Be One** (2023) introduced **oil counters** as a named counter type used as a built-in countdown mechanic on several key permanents. Each upkeep, a counter is removed; the permanent either causes you to lose the game or sacrifices itself when the last counter goes. Critically, removing all oil counters via a non-upkeep effect (e.g., Vampire Hexmage) does NOT immediately trigger the lose-the-game or sacrifice clause — it only fires when the upkeep trigger resolves using last-known information. **Proliferate** adds oil counters back, acting as a countdown restorer. **Vorinclex, Monstrous Raider** doubles any counters placed, including oil counters added by proliferate. **Corrupted** is an ability word appearing on 18 ONE cards with four distinct timing patterns depending on how the condition is embedded in the card's rules text: (1) activation restriction (checked at activation), (2) cast-time cost reduction (checked at casting), (3) resolution check (checked as the spell resolves), and (4) continuous static (checked continuously at all times including mid-combat).

## The Definitive Rules

**Oil counters** are normal named counters (like +1/+1 or loyalty). All counter rules apply — proliferate can add them, Vorinclex doubles them, Modular can move them (if applicable), etc.

**CR 704.5a** (loss): A player with 0 or less life loses the game. The Archfiend's lose-the-game clause is a triggered ability, not an SBA — it fires when the upkeep trigger resolves.

**CR 603.4 (Intervening "if" clause):** Archfiend's trigger reads "At the beginning of your upkeep, remove an oil counter from this creature. **Then** if it has no oil counters, you lose the game." The "then if" structure means: the removal happens first, then the check happens. Both are part of the same triggered ability resolution.

**Corrupted (ability word, CR 207.2c):** Corrupted is not a keyword — it cannot be granted, removed, or interacted with as an ability. Each card's Corrupted ability is independently worded with its own timing.

## The Pattern

```
OIL COUNTERS — COUNTDOWN MECHANICS:

  TWO KEY OIL-COUNTDOWN CARDS IN ONE:
    Archfiend of the Dross ({2}{B}{B}: 6/6 Flying):
      "This creature enters with four oil counters on it."
      "At the beginning of your upkeep, remove an oil counter from this creature.
        Then if it has no oil counters on it, you lose the game."
      "Whenever a creature an opponent controls dies, its controller loses 2 life."
    → Countdown: 4 upkeeps until you lose the game if not dealt with.
    → The lose-the-game clause is part of the SAME triggered ability as the removal.
    → The trigger fires, removes a counter, then checks — if 0 remain, you lose.

    Evolved Spinoderm ({2}{G}{G}: 5/5):
      "This creature enters with four oil counters on it."
      "This creature has trample as long as it has two or fewer oil counters on it.
        Otherwise, it has hexproof."
      "At the beginning of your upkeep, remove an oil counter from this creature.
        Then if it has no oil counters on it, sacrifice it."
    → Starts hexproof (3+ counters) → becomes trample (2 or fewer) → sacrificed (0).
    → The transition from hexproof to trample happens mid-game as counters deplete.

  NON-UPKEEP COUNTER REMOVAL — DOES NOT IMMEDIATELY TRIGGER LOSS/SACRIFICE:
    If you remove ALL oil counters via a non-upkeep effect (e.g., Vampire Hexmage,
      Power Conduit, Chisei Heart of Oceans), the permanent now has 0 oil counters.
    HOWEVER: the lose-the-game or sacrifice clause is PART OF the upkeep triggered ability.
    That ability hasn't triggered yet. The permanent sits at 0 counters.
    The loss/sacrifice only occurs the NEXT time the upkeep trigger resolves.

    Official ruling (Archfiend of the Dross, 2023-02-04):
    "If Archfiend of the Dross somehow loses all of its oil counters due to an effect
      other than its upkeep triggered ability, this won't cause you to lose the game
      until the next time that ability resolves."

    This creates a narrow window: at 0 oil counters, the next upkeep trigger will fire,
      remove no counter (already 0), then you lose the game immediately.

  LAST-KNOWN INFORMATION — ARCHFIEND DESTROYED ON STACK:
    If the Archfiend's upkeep trigger is on the stack and the Archfiend is then destroyed
      (e.g., opponent kills it in response), the trigger still resolves.
    The trigger uses LAST KNOWN INFORMATION for how many oil counters the Archfiend had.
    Official ruling: "If Archfiend of the Dross is no longer on the battlefield as its
      upkeep triggered ability resolves, use the number of oil counters it had the last
      time it existed on the battlefield to determine whether you lose the game."
    → If it had 0 counters before death: trigger resolves → you lose the game (even though
      the Archfiend is gone).
    → If it had 1 counter before death: trigger resolves → "remove a counter" from a
      nonexistent permanent (no effect) → "then if it has no counters" → uses LKI: 1
      counter (before removal) → actually, the removal was unsuccessful (0 result) →
      this nuance requires careful reading: the removal and check happen in sequence.
      The removal can't happen (card is gone), so oil counters LKI = 1 (unchanged) →
      "then if it has no oil counters" → 1 counter → no loss.
    → Net: only dangerous if the Archfiend had 0 oil counters when the trigger fired.

  PROLIFERATE AS OIL COUNTER RESTORER:
    Proliferate (CR 701.34): choose any number of permanents with a counter on them,
      give each another counter of each kind already on it.
    An Archfiend or Spinoderm with oil counters CAN be chosen for proliferate.
    This ADDS an oil counter, extending the countdown by one upkeep.
    With Tekuthal, Inquiry Dominus ({2}{U}{U}: 3/5 Flying): "If you would proliferate,
      proliferate twice instead." → One proliferate event becomes two → adds 2 oil counters.
    Strategic use: in a deck with Archfiend + proliferate effects, you can keep the
      Archfiend alive indefinitely by adding counters faster than the upkeep removes them.

  VORINCLEX — DOUBLES OIL COUNTERS ADDED:
    Vorinclex, Monstrous Raider ({4}{G}{G}: 6/6 Trample, Haste):
      "If you would put one or more counters on a permanent or player, put twice that
        many of each of those kinds of counters on that permanent or player instead."
    If you proliferate an oil counter: normally add 1 → Vorinclex doubles → add 2.
    But Vorinclex also halves counters opponents WOULD add: if an opponent proliferates
      your Archfiend's oil counters, they only add 0 (round down from 0.5).
    Vorinclex also affects poison counters placed by Toxic — very relevant in ONE.

  HEXPROOF TRANSITION (EVOLVED SPINODERM):
    Spinoderm has hexproof while it has 3+ oil counters, trample at 2 or fewer.
    This is a CONTINUOUS ABILITY checked in real time (layer 6 for keyword addition).
    Mid-combat: if something removes a counter dropping Spinoderm from 3 to 2,
      it IMMEDIATELY loses hexproof and gains trample — a mid-combat transition.
    Removal spells can't target it at 3+ counters. Once at 2 or fewer: targetable.

CORRUPTED — FOUR DISTINCT TIMING PATTERNS:

  Corrupted is an ability word labeling abilities with the condition
    "an opponent has three or more poison counters."
  The condition can appear in four structurally different positions on the card:

  PATTERN 1 — ACTIVATION RESTRICTION:
    "Activate only if an opponent has three or more poison counters."
    Check: at ACTIVATION TIME.
    Card: Chittering Skitterling ({2}{B}: 1/4):
      "Corrupted — Sacrifice an artifact or creature: Draw a card. Activate only if
        an opponent has three or more poison counters and only once each turn."
    If no opponent has 3+ poison at activation time: cannot activate.
    If an opponent drops below 3 after you've activated: the effect still resolves
      (you checked at activation; not a triggered condition).

  PATTERN 2 — CAST-TIME COST REDUCTION:
    "This spell costs {2} less to cast if an opponent has three or more poison counters."
    Check: at CAST TIME (when announcing total cost, CR 601.2f).
    Card: Distorted Curiosity ({2}{U}: Draw two cards):
      "Corrupted — This spell costs {2} less to cast if an opponent has three or more
        poison counters."
    If an opponent had 3+ poison when you began casting: costs {U} total.
    If they lost poison between announcement and payment (rare, but SBAs could change
      state): you've already locked in the cost at announcement.

  PATTERN 3 — RESOLUTION CHECK:
    "Exile that creature instead if its controller has three or more poison counters."
    Check: at RESOLUTION.
    Card: Anoint with Affliction ({1}{B}):
      "Exile target creature if it has mana value 3 or less.
        Corrupted — Exile that creature instead if its controller has three or more
        poison counters."
    The Corrupted clause is checked WHEN THE SPELL RESOLVES, not at cast time.
    If the opponent gained or lost poison counters between cast time and resolution,
      the current count at resolution determines whether the exile is unconditional.
    This is the classic intervening-check pattern: even high-MV creatures are exiled
      unconditionally if their controller is Corrupted at resolution time.

  PATTERN 4 — CONTINUOUS STATIC:
    "As long as an opponent has three or more poison counters, [this creature has X]."
    Check: CONTINUOUSLY at all times.
    Card: Apostle of Invasion ({4}{W}{W}: 4/4 Flying):
      "Corrupted — As long as an opponent has three or more poison counters, this
        creature has double strike."
    This is checked at EVERY game-state check, including mid-combat.
    Official ruling: "In a multiplayer game, Apostle of Invasion can lose double strike
      after dealing damage in the first combat damage step if all the opponents that had
      three or more poison counters left the game."
    → If the only Corrupted opponent is eliminated between first-strike and regular
      damage: Apostle loses double strike mid-combat and deals only regular damage.
    → Conversely, if an opponent reaches 3 poison mid-combat (from a triggered effect),
      Apostle immediately gains double strike.

  MULTIPLAYER NOTE — "AN OPPONENT":
    "An opponent has three or more poison counters" means AT LEAST ONE opponent.
    In Commander, if ANY opponent has 3+ poison, all Corrupted abilities are active
      (for the Corrupted player).
    In a 4-player game, Corrupted could apply from turn 1 if one player gets poisoned early.
```

## Definitive Conclusions

- **Archfiend of the Dross is {2}{B}{B}, not {4}{B}{B}** — a 6/6 flyer that enters with 4 oil counters.
- **Oil counters are removed at your upkeep** (same for Evolved Spinoderm) — not at the end step.
- **Non-upkeep counter removal doesn't immediately trigger loss/sacrifice** — the clause only fires when the upkeep trigger resolves using last-known information.
- **Last-known information applies if Archfiend is destroyed on the stack** — if it had 0 counters when the trigger fired, you still lose the game even though the Archfiend is gone.
- **Proliferate restores oil counters** — a valid strategy to extend Archfiend/Spinoderm's life indefinitely; Tekuthal doubles the effect.
- **Corrupted has four distinct timing patterns**: activation restriction (at activation), cost reduction (at cast time), resolution check (at resolution), and continuous static (checked at all times including mid-combat).

## Canonical Example

**Archfiend of the Dross — Counter Removal Trap:**

Archfiend of the Dross is on the battlefield with 1 oil counter. Your upkeep begins.

Opponent activates Vampire Hexmage in response to the upkeep trigger going on the stack: "Remove all counters from target permanent." Archfiend now has 0 oil counters.

The upkeep trigger resolves: "Remove an oil counter" — the Archfiend has no counters, so nothing is removed. "Then if it has no oil counters on it, you lose the game." → It has 0 counters. You lose the game.

The Hexmage maneuver was a trap: it brought the counter to 0, but the trigger still resolved and saw 0 counters → loss.

**Compare:** If Vampire Hexmage had fired before the upkeep trigger was on the stack (before the beginning of upkeep), the Archfiend would now sit at 0 counters. On the next upkeep, the trigger fires, removes no counter (already 0), sees 0 counters → you lose. One upkeep delay, same result.

**Example 2 — Corrupted Static Mid-Combat:**

You control Apostle of Invasion ({4}{W}{W}: 4/4 Flying). One opponent has exactly 3 poison counters. Apostle has double strike (Corrupted active).

First-strike damage: Apostle deals 4 damage to an opponent.

That opponent (who had 3 poison) is eliminated from the game between the first-strike and regular damage steps (they had 0 life after combat damage, lose to SBA).

Regular damage step: Apostle's Corrupted condition checks "an opponent has 3+ poison." The eliminated player is gone. No remaining opponent has 3+ poison. Apostle has LOST double strike. Regular damage doesn't fire a second time.

**Example 3 — Proliferate Restores Archfiend:**

You control Archfiend of the Dross with 1 oil counter and Tekuthal, Inquiry Dominus.

Main phase: activate a proliferate effect. Tekuthal: "If you would proliferate, proliferate twice instead."

First proliferate: choose Archfiend → add 1 oil counter → now 2 oil counters.
Second proliferate: choose Archfiend → add 1 oil counter → now 3 oil counters.

Your upkeep: remove 1 → 2 remaining. You survive another full turn cycle.
Next upkeep: remove 1 → 1 remaining. Proliferate again (if available) to restore.

## Commonly Confused With
- **P417 (Suspend/Vanishing)** — Vanishing also uses time counters removed each upkeep, but works in reverse (permanent disappears at 0). Oil counters are a "Phyrexian countdown" variant.
- **P493 (Toxic/Corrupted basics)** — P493 covers what Toxic and Corrupted are. P498 covers the timing nuances of Corrupted's four structural patterns and the deep oil counter rules.
- **P465 (Proliferate)** — Proliferate's core rules are in P465. P498 covers the specific interaction of proliferate as a counter restorer for oil-countdown permanents.
