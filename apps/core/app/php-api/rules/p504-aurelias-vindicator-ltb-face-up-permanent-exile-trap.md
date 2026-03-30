---
id: p504
name: Aurelia's Vindicator — LTB Fires Before Face-Up Trigger Resolves, Creating Permanent Exile
category: triggered
cr_refs: [603.6, 603.6c, 608.2b, 702.168]
tags: [aurelias-vindicator, disguise, ltb-trigger, face-up-trigger, permanent-exile, trigger-ordering, linked-ability, zone-change, last-known-information, mkm, murders-at-karlov-manor]
created: 2026-03-30
examples_count: 2
---

# P504 — Aurelia's Vindicator — LTB Fires Before Face-Up Trigger Resolves, Creating Permanent Exile

## Abstract
**Aurelia's Vindicator** ({2}{W}{W}: 4/2 Angel Warrior with Flying, Lifelink, Ward {2}; Disguise {X}{3}{W}) has two linked abilities: a "turned face up" trigger that exiles up to X targets, and a leaves-the-battlefield trigger that returns those exiled cards to their owners' hands. If Aurelia's Vindicator **leaves the battlefield before its "turned face up" trigger resolves**, the LTB trigger fires with an empty exile pile — nothing is returned. Then the "turned face up" trigger resolves and exiles the targets **permanently** (because the LTB trigger has already fired and found nothing). This is one of the sharpest permanent-exile traps in MKM, entirely within the rules but highly non-obvious. A secondary ruling: if a creature targeted by the face-up trigger **dies before it resolves**, that creature becomes an illegal target and is NOT exiled — even if it would be a creature card in the graveyard at resolution time.

## The Definitive Rules

**Official ruling (2024-02-02):** "If Aurelia's Vindicator leaves the battlefield before its 'turned face up' ability has resolved, its leaves the battlefield ability will trigger and do nothing. Then the 'turned face up' ability will resolve and exile the targeted creatures and/or creature cards indefinitely."

**Official ruling (2024-02-02):** "If a creature targeted by the 'turned face up' ability dies before that ability resolves, it will become an illegal target even though it may be a creature card in a graveyard when the ability resolves. It won't be exiled."

**CR 603.6 (Zone-change triggers):** When a permanent leaves the battlefield, triggered abilities that "trigger when this permanent leaves" go on the stack. They use last known information from the moment before leaving.

**CR 608.2b (Illegal targets):** If a target becomes illegal before the spell or ability resolves, that target is not affected. If all targets are illegal, the spell or ability is countered.

## The Pattern

```
AURELIA'S VINDICATOR — CARD TEXT:
  Aurelia's Vindicator ({2}{W}{W}: 4/2, Angel Warrior):
    Flying, lifelink, ward {2}
    Disguise {X}{3}{W} (cast face down for {3} as 2/2 with ward {2}; turn face up by
      paying {X}{3}{W} as a special action)
    "When this creature is turned face up, exile up to X other target creatures from the
      battlefield and/or creature cards from graveyards."
    "When this creature leaves the battlefield, return the exiled cards to their owners'
      hands."

  Intended play pattern:
    Cast face-down. Turn face up paying {X}{3}{W}. Exile X creatures.
    When Aurelia's Vindicator eventually dies or leaves, the exiles return.
    → A temporary exile with "hostage" flavor.

THE TRAP — LTB FIRES BEFORE FACE-UP TRIGGER RESOLVES:

  NORMAL SEQUENCE:
    1. Turn Aurelia's Vindicator face up (special action — no stack).
    2. "Turned face up" trigger goes on stack (Target up to X creatures/cards).
    3. Trigger resolves: exiles them. Cards go to Aurelia's exile zone.
    4. [Later] Aurelia's Vindicator leaves the battlefield.
    5. LTB trigger fires, goes on stack.
    6. LTB resolves: returns exiled cards to owners' hands.

  TRAP SEQUENCE (opponent responds to face-up trigger):
    1. Turn Aurelia's Vindicator face up.
    2. "Turned face up" trigger goes on stack (targets chosen — say 3 creatures).
    3. → Opponent responds: kills Aurelia's Vindicator (Lightning Bolt, etc.).
    4. Aurelia's Vindicator leaves the battlefield.
    5. LTB trigger fires and goes on the stack ABOVE the face-up trigger.
    6. LTB resolves FIRST (LIFO): "return the exiled cards to their owners' hands."
       → No cards are currently exiled (face-up trigger hasn't resolved yet).
       → LTB finds nothing. Nothing is returned. LTB does nothing.
    7. Face-up trigger resolves: exile up to X creatures/cards from the battlefield/GY.
       → Aurelia's Vindicator is gone. The face-up trigger still resolves.
       → Targets are exiled indefinitely.
    8. No LTB trigger will fire again (Aurelia's Vindicator already left).

  RESULT: PERMANENT EXILE.
    The exiled creatures have no way to return. They're exiled permanently.
    Unless another effect specifically returns them (e.g., "exile Aurelia's Vindicator: return
      all cards it exiled" — but no such effect exists once LTB has fired).

  WHY LTB FIRES AND FINDS NOTHING:
    The LTB trigger is "When this creature leaves the battlefield, return the exiled cards."
    "Exiled cards" refers to the exile pile associated with Aurelia's Vindicator.
    That exile pile is populated when the face-up trigger resolves.
    Since LTB fires and resolves BEFORE the face-up trigger, the pile is empty.
    The LTB has "fired" and "resolved" — it cannot fire again.

SECOND RULING — CREATURE DIES BEFORE FACE-UP TRIGGER RESOLVES:

  If a TARGETED creature dies (from battlefield to GY) before the face-up trigger resolves:
    → The target becomes an illegal target.
    → Even though it is now a creature CARD in the GY (which the face-up trigger can target),
      the specific target was chosen as a battlefield creature.
    → Official ruling: "It will become an illegal target even though it may be a creature card
      in a graveyard when the ability resolves. It won't be exiled."
    → The creature is NOT exiled. It stays in the GY.

  CONTRAST: If you originally target a creature CARD IN A GRAVEYARD:
    → That target can be exiled.
    → If the GY card is shuffled into the library or goes to hand before resolution:
      it becomes an illegal target (no longer a creature card in a GY).

DISGUISE COST — X IS CHOSEN WHEN TURNING FACE UP:
  The disguise cost is {X}{3}{W}. You choose X when you pay the face-up cost.
  Higher X → more targets → more exiled → more permanent exiles in the trap scenario.
  With X=0: no targets, no exiles, no trap.
  With X=3: three creatures exiled permanently if the trap fires.

INTERACTION WITH FLICKER EFFECTS:
  If you blink Aurelia's Vindicator AFTER the face-up trigger resolves (cards are exiled):
    → Aurelia's Vindicator exiles, then returns.
    → LTB fires when it exiles: returns the exiled cards to their owners' hands.
    → Aurelia's Vindicator returns as a new object. It can be turned face up again.
  This is the INTENDED play — blink to get repeated exile-hostage cycles.

  If you blink it WHILE the face-up trigger is on the stack (before it resolves):
    → Same as the permanent exile trap: LTB fires with empty pile, then face-up trigger
      resolves into permanent exile.
```

## Definitive Conclusions

- **If Aurelia's Vindicator dies while its face-up trigger is on the stack, the exiles become permanent** — the LTB fires first (resolves finding nothing), then the face-up trigger resolves and exiles indefinitely.
- **The LTB is a one-time event** — once it has fired and resolved (even finding nothing), it cannot fire again; the exile pile remains permanently occupied.
- **Creatures targeted as battlefield creatures that die before resolution are illegal targets** — the fact that they're now creature cards in a graveyard does NOT retroactively make them legal targets for the graveyard-targeting clause.
- **The trap is created by response-order** — turning face up is a special action; immediately after, the trigger goes on the stack and opponents have a window to kill the Vindicator before the trigger resolves.

## Canonical Example

**Permanent Exile Trap:**

You have Aurelia's Vindicator face-down on the battlefield. You turn it face up paying {3}{3}{W} (X=3). The "turned face up" trigger goes on the stack. You choose three of your opponent's creatures as targets.

Opponent responds: casts Lightning Bolt targeting Aurelia's Vindicator (ward {2} applies — opponent pays {2}, Bolt resolves). Aurelia's Vindicator is destroyed (4/2, Bolt is 3 damage — wait, 3 damage isn't enough to kill a 4/2... let me use a different example).

Opponent responds: casts Murder targeting Aurelia's Vindicator (pays ward {2}, Murder resolves). Aurelia's Vindicator is destroyed.

→ LTB trigger fires, goes on stack above face-up trigger.
→ LTB resolves: "return the exiled cards to their owners' hands." Nothing exiled yet. Nothing returned.
→ Face-up trigger resolves: exile up to 3 target creatures. All three targets are still on the battlefield. They're exiled.

Three creatures are now in exile permanently. No future trigger will ever return them.

**Example 2 — Target Dies Before Trigger Resolves:**

You turn Aurelia's Vindicator face up (X=2). You target: (a) opponent's 5/5 Dragon on the battlefield, and (b) a creature card in opponent's graveyard.

Opponent responds to the face-up trigger by sacrificing the Dragon (triggers a death effect, Dragon goes to GY).

Face-up trigger resolves:
- Dragon was targeted as a battlefield creature → it's now in the GY → illegal target → not exiled.
- GY creature card → still a creature card in a GY → valid target → exiled.

One exile (the GY creature), zero exiles for the Dragon. Dragon stays in the GY (and would need separate effects to be exiled).

## Fugitive Codebreaker — Disguise Cost Reduction (Related MKM Pattern)

**Fugitive Codebreaker oracle text**: "Prowess, haste. Disguise {5}{R}. This cost is reduced by {1} for each instant and sorcery card in your graveyard. When this creature is turned face up, discard your hand, then draw three cards."

**Key distinction — face-down cast vs. face-up cost:**
- Casting face-down always costs {3} (the universal disguise alternative cost). The "this cost is reduced" reduction does NOT apply to this.
- Turning face-up pays the disguise cost of {5}{R}, which IS reduced by {1} per instant/sorcery in your graveyard.
- With 5 instants/sorceries in graveyard: turn face-up for {R} only (generic portion fully zeroed, colored {R} remains).
- The count is measured at the moment you pay the face-up cost (instants/sorceries that resolved earlier in the turn are already in the graveyard and count).

**Timing note**: Turning face-up is a special action (CR 702.36c — analogous to morph). It does not use the stack and cannot be responded to. Opponents cannot respond to the face-up action itself, only to the triggered ability that fires after it.

## Commonly Confused With
- **P011 (ETB and LTB Linked Abilities)** — P011 covers how LTB triggers work when permanents return their exiled cards. P504 is a specific case where the LTB fires BEFORE the exile trigger, creating the permanent exile trap.
- **P492 (Disguise and Collect Evidence)** — P492 covers Disguise mechanics generally. P504 covers this specific card's dangerous edge case.
- **P024 (Zone Change Object Identity)** — The face-up trigger targets specific objects. When the target's zone changes (dies) before resolution, it becomes a different object in a different zone — hence illegal for the original targeting.
