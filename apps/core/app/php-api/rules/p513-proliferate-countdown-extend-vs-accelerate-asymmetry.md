---
id: p513
name: Proliferate — Countdown Extend vs. Accelerate Asymmetry, and Exile Zone Unreachability
category: triggered
cr_refs: [701.34, 701.27, 406.1, 122.3, 709.1, 503.2, 704.5s]
tags: [proliferate, vanishing, fading, impending, saga, lore-counter, cumulative-upkeep, suspend, time-counter, fade-counter, age-counter, countdown-down, countdown-up, exile, atraxa, clockspinning, tarkir-dragonstorm, TDM]
created: 2026-03-30
examples_count: 4
---

# P513 — Proliferate — Countdown Extend vs. Accelerate Asymmetry, and Exile Zone Unreachability

## Abstract
Proliferate interacts with time-based counter mechanics in **two opposite directions** depending on which direction the clock runs. **Countdown-down mechanics** (Vanishing, Fading, Impending) remove counters each upkeep — proliferate ADDS a counter, extending the permanent's remaining time. **Countdown-up mechanics** (Sagas, Cumulative Upkeep) add counters each upkeep — proliferate ALSO adds a counter, accelerating the permanent toward its terminus (sacrifice or escalating cost). **Suspend** is in a third category: the cards are in exile, and proliferate cannot target cards in exile — making suspended cards **unreachable** by proliferate. This asymmetry is the critical rules trap: the same action (proliferate) helps your Vanishing creature but hurts your Saga, and cannot affect an opponent's suspended card at all.

## The Definitive Rules

**CR 701.34a (Proliferate):** *"Choose any number of permanents and/or players, then give each another counter of each kind that permanent or player already has."*

**CR 701.34b:** *"You can't choose a permanent that has no counters on it."*

**CR 702.24a (Vanishing):** *"Vanishing N means 'This permanent enters the battlefield with N time counters on it,' 'At the beginning of your upkeep, if this permanent has a time counter on it, remove a time counter from it,' and 'When the last time counter is removed from this permanent, sacrifice it.'"*

**CR 702.21a (Fading):** *"Fading N means 'This permanent enters the battlefield with N fade counters on it,' 'At the beginning of your upkeep, remove a fade counter from this permanent. If you can't, sacrifice it.'"*

**CR 702.195 (Impending):** *"Impending N—[cost] means 'If you cast this spell for [cost], it enters the battlefield with N time counters on it and it isn't a creature until its last time counter is removed. At the beginning of your upkeep, remove a time counter from this permanent. When the last time counter is removed from this permanent, it becomes a creature.'"* [Note: Fading removes fade counters; Impending removes time counters.]

**CR 709.1 (Sagas):** *"Saga cards have the enchantment type Saga. Each chapter ability is a triggered ability with an intervening 'if' clause... 'When one or more lore counters are put onto this Saga, if the number of lore counters on it is [chapter number] or more for the first time...' "* [Paraphrase; full wording in CR section 709.]

**CR 702.62a (Suspend):** *"Suspend N—[cost] means 'If you could begin to cast this card... you may pay [cost] and exile it face up from your hand with N time counters on it...'"* and thereafter the time counters are removed from exile.

**CR 321.1 (Exile Zone):** The exile zone is a zone. Proliferate specifies "permanents and/or players" — cards in exile are neither permanents nor players.

**CR 503.2 (Cumulative Upkeep):** *"Cumulative upkeep... means 'At the beginning of your upkeep, put an age counter on this permanent, then you may pay [cost] for each age counter on it. If you don't, sacrifice this permanent.'"*

## The Pattern

```
PROLIFERATE'S DIRECTION OF EFFECT ON TIME-BASED COUNTERS:

COUNTDOWN-DOWN MECHANICS (counters removed each upkeep):

  Vanishing N:
    Counters: Time counters (N at entry)
    Each upkeep: REMOVE 1 time counter
    When last removed: sacrifice
    PROLIFERATE EFFECT: +1 time counter → extends life by 1 upkeep
    Example: Riftwing Cloudskate (Vanishing 3). Turn 3: 1 counter left.
      Proliferate: now 2 counters. It survives 2 more upkeeps instead of 1.
    VERDICT: EXTENDS the permanent's lifetime.

  Fading N:
    Counters: Fade counters (N at entry)
    Each upkeep: REMOVE 1 fade counter (sacrifice if can't remove)
    PROLIFERATE EFFECT: +1 fade counter → extends life by 1 upkeep
    Example: Blastoderm (Fading 3). Proliferate when 1 counter left → 2 counters left.
    VERDICT: EXTENDS the permanent's lifetime.

  Impending N (TDM / LCI / future sets):
    Counters: Time counters (N at entry; creature while has 1+)
    Each upkeep: REMOVE 1 time counter
    When last removed: becomes a creature
    PROLIFERATE EFFECT: +1 time counter → delays becoming a creature
    Example: Dragon with Impending 4. It's a noncreature on the battlefield with counters.
      Proliferate: stays noncreature one more upkeep.
    VERDICT: DELAYS the permanent's transformation (extends noncreature state).

  Oil Counters (Phyrexia):
    Some oil counter permanents have "remove an oil counter" upkeep triggers.
    PROLIFERATE EFFECT: +1 oil counter → adds charges (mechanism-dependent).
    Oil counters going up = charges going UP = generally beneficial (not a pure countdown).
    These are more complex — verify per card. Oil counters on Slobad are charges to use,
    so proliferating adds charges (POSITIVE).

COUNTDOWN-UP MECHANICS (counters added each upkeep):

  Sagas:
    Counters: Lore counters (1 added ETB as turn-based action; 1 added at precombat main phase)
    When chapter threshold crossed: chapter ability fires
    When last chapter fired: sacrifice at next SBA check
    PROLIFERATE EFFECT: +1 lore counter → advances toward final chapter and sacrifice
    Example: Urza's Saga (3 chapters). At 2 lore counters, you proliferate.
      → Goes to 3 counters. Chapter III triggers. Saga sacrifices at next SBA.
    VERDICT: ACCELERATES (hurts!) — forces earlier sacrifice, skips future chapters.
    Exception: If combined with counter-removal effects (see P508), can re-trigger chapters.

  Cumulative Upkeep:
    Counters: Age counters (1 added each upkeep)
    Each upkeep: pay [cost] × (number of age counters) or sacrifice
    PROLIFERATE EFFECT: +1 age counter → raises the cost at NEXT upkeep check
    Example: Mystic Remora (Cumulative Upkeep {1}). Has 3 age counters.
      Proliferate: now 4 counters. Next upkeep, you must pay {4} or sacrifice.
    VERDICT: ACCELERATES (hurts!) — increases the cumulative cost, may force earlier sacrifice.
    Opponent target: proliferating their Cumulative Upkeep permanent is an attack.

SUSPEND — UNREACHABLE:

  Suspend cards are in the EXILE zone with time counters.
  Proliferate specifies "permanents and/or players."
  Exile is a zone. Cards in exile are NOT permanents.
  → PROLIFERATE CANNOT TARGET SUSPENDED CARDS.
  → You cannot extend an opponent's Ancestral Vision with proliferate.
  → You cannot accelerate Restore Balance's countdown.
  → You cannot add or remove time counters from suspended cards via proliferate.

  Exception: abilities that specifically say "target card in exile" can interact.
  Proliferate itself: cannot. Clockspinning ({U}: add or remove 1 counter from target
    permanent or suspended card) CAN target suspended cards because it says so explicitly.

COMPARATIVE TABLE:

  Mechanic          | Direction  | Proliferate Effect
  ------------------|------------|---------------------
  Vanishing         | Down ↓     | Extends (GOOD for controller)
  Fading            | Down ↓     | Extends (GOOD for controller)
  Impending         | Down ↓     | Delays transformation (context-dependent)
  Saga              | Up ↑       | Accelerates → earlier sacrifice (BAD for controller)
  Cumulative Upkeep | Up ↑       | Accelerates → higher cost (BAD for controller)
  Suspend (exile)   | Down ↓     | UNREACHABLE — not a permanent
  Oil Counters      | Varies     | Depends on the specific card's use of oil counters
  Charge Counters   | Varies     | Adds one charge → effect depends on card
  Time Counters     | Varies     | Depends on whether they count down or up

THE ATRAXA PROBLEM:

  Atraxa, Praetors' Voice proliferates at each end step.
  In a Saga-heavy deck: Atraxa will inadvertently accelerate all your Sagas.
  Players often build Atraxa decks without realizing their Sagas will sacrifice faster.

  In a Vanishing or Impending deck: Atraxa extends all your creatures with time counters.
  This is synergistic and intentional.

  Solution for Saga players: either don't run Atraxa, or run Sagas you WANT to sacrifice
    faster (Urza's Saga for the Construct token, triggering reanimation, etc.).

PROLIFERATE AND PLANESWALKERS:

  Planeswalker loyalty counters are on permanents.
  Proliferate ADDS a loyalty counter to any planeswalker with loyalty counters.
  This cannot be used as a cost-substitute — loyalty abilities still require paying loyalty.
  But Atraxa proliferating each end step effectively gives all your planeswalkers +1 loyalty
    each turn without activating them. VERY powerful in planeswalker builds.

PROLIFERATE AND POISON COUNTERS:

  Poison counters are on players (not permanents).
  Proliferate can target "players" — players with at least 1 poison counter are valid targets.
  Atraxa proliferating at end step: adds 1 poison counter to any poisoned opponent.
  10 poison counters = game loss (SBA 704.5c).
  "Infect" builds use proliferate to multiply the pace of poison accumulation.
```

## Definitive Conclusions

- **Proliferate extends countdown-down permanents** — Vanishing, Fading, and Impending gain one more upkeep of survival per proliferate.
- **Proliferate accelerates countdown-up permanents** — Sagas and Cumulative Upkeep permanents advance toward their termini faster; this is generally BAD for the controller.
- **Proliferate cannot reach suspended cards** — suspend cards are in exile, not on the battlefield; proliferate targets only permanents and players.
- **Clockspinning is a unique exception** — it can target "permanents and suspended cards," making it the primary tool for interacting with counters in exile.
- **Atraxa + Sagas is an anti-synergy trap** — Atraxa's end-step proliferate will sacrifice your Sagas ahead of schedule.
- **Proliferating an opponent's Cumulative Upkeep permanent is an attack** — it raises their mandatory payment, potentially forcing an earlier sacrifice.
- **Planeswalker loyalty counters are proliferable** — Atraxa builds exploit this for passive loyalty generation; this cannot substitute for activated loyalty costs.

## Canonical Example

**Atraxa + Urza's Saga Trap:**

You control Atraxa, Praetors' Voice ({G}{W}{U}{B}: 4/4) and Urza's Saga ({0}: Enchantment-Saga with chapters I, II, III). Urza's Saga has 1 lore counter (Chapter I just fired — you gained an artifact land). Your end step: Atraxa proliferates. Urza's Saga goes from 1 to 2 lore counters. Chapter II triggers (you may search for an artifact with CMC 0 or 1). SBAs check: it has 2 counters but only 2 chapters of activity; chapter III fires at 3. Next upkeep, another lore counter is added naturally: 3 lore counters. Chapter III triggers (create a Construct). After chapter III fires, Urza's Saga is sacrificed at next SBA.

**Without Atraxa**: Saga completes in 3 upkeeps (3 natural lore counter additions). Chapter I fires at turn 1, II at turn 2, III at turn 3.
**With Atraxa**: Atraxa's end-step proliferate at each step means the Saga completes faster — depending on timing, it may complete in 2 upkeeps instead of 3 (end step after Chapter I adds a counter, pushing it to 2 on turn 1's end step; turn 2 upkeep = 3rd counter, Chapter II and III sequence faster).

This is the anti-synergy: Atraxa is eating your Saga turns.

**Example 2 — Atraxa + Riftwing Cloudskate (Beneficial):**

You control Riftwing Cloudskate ({4}{U}: 2/2 Flying; Vanishing 3; ETB: return target permanent to its owner's hand) with 1 time counter remaining. It would be sacrificed at your next upkeep.

Atraxa proliferates at your end step: Riftwing goes to 2 time counters. You have 2 more upkeeps before it's sacrificed. Atraxa extended Riftwing's life.

**Example 3 — Suspend is Unreachable:**

Your opponent cast Ancestral Vision ({U}: Sorcery with Suspend 4; draw 3 cards) for free, exiling it with 4 time counters. Over three upkeeps they've removed 3 counters: 1 time counter remains. On their final upkeep before Ancestral Vision fires, you would like to proliferate that counter away — but you can't. Suspended cards are in exile. Proliferate targets permanents and players, not exile.

You'd need Clockspinning ({U}: Add or remove 1 counter from target permanent or suspended card) to remove that counter — but that costs mana and uses the stack. Proliferate cannot help you here.

**Example 4 — Blastoderm Extended:**

You control Blastoderm ({2}{G}{G}: 5/5; Fading 3; can't be the target of spells or abilities) with 1 fade counter (would sacrifice at next upkeep). You activate Atraxa's proliferate (end step). Blastoderm goes to 2 fade counters. It survives 2 more upkeeps.

Note: Blastoderm can't be targeted by spells or abilities, but proliferate CHOOSES permanents — it doesn't target them. Proliferate's "choose" is not targeting. The untargetable Blastoderm CAN be chosen for proliferate. The counter is still added even though it can't be targeted.

## Commonly Confused With
- **P508 (Sagas — Lore Counter Acceleration)** — P508 covers Doubling Season, counter removal, and Clockspinning interactions specific to Sagas. P513 covers the broader proliferate-direction asymmetry across ALL counter-countdown mechanics.
- **P025 (Counter Placement — Cost vs. Effect)** — P025 covers Doubling Season and Hardened Scales with counter-placement replacement effects. P513 is about proliferate adding one counter to each qualifying permanent.
- **P255 (Suspend)** — P255 covers when the last time counter is removed from a suspended card. P513 covers why proliferate can't reach those cards at all.
- **P188 (Exhaust — Once Only)** — Exhaust is a different one-use counter system. Proliferate could add exhaust counters back... but exhaust is specifically "once" — re-adding an exhaust counter doesn't reset usability (the ability tracks uses, not counters remaining, per the mechanic's intent).
