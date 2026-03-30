---
id: p493
name: Toxic and Corrupted — Combat-Only Poison Delivery and Three-Counter Threshold Payoffs
category: combat
cr_refs: [702.164a, 702.164b, 702.164c, 120.3g, 120.3b, 120.3e, 704.5c]
tags: [toxic, corrupted, infect, poison-counters, combat-damage-only, total-toxic-value, phyrexia-all-will-be-one, ONE, proliferate, double-strike, Bloated-Contaminator, Venerated-Rotpriest, Skrelv-Hive, Necrogen-Communion, Phyrexian-Mite, poison-win-condition, wither-comparison]
created: 2026-03-30
examples_count: 3
---

# P493 — Toxic and Corrupted — Combat-Only Poison Delivery and Three-Counter Threshold Payoffs

## Abstract
**Toxic N** (Phyrexia: All Will Be One, 2023; CR 702.164) is a static ability: when a creature with Toxic deals **combat damage to a player**, that player gets N poison counters **in addition to** the normal damage. Toxic is specifically limited to combat damage — non-combat damage from a Toxic creature gives no poison. Multiple Toxic instances on a creature stack (total toxic value). **Corrupted** is an ability word (not a keyword) found on ONE cards: its abilities trigger or function only when an opponent has 3+ poison counters, creating a threshold mechanic around the poison win condition. Critically, if a creature has both **Infect** and **Toxic**, the player receives both the Infect poison counters (from the damage replacement) AND the Toxic bonus poison counters — these effects stack.

## The Definitive Rules

**CR 702.164a** (verbatim): *"Toxic is a static ability. It is written 'toxic N,' where N is a number."*

**CR 702.164b** (verbatim): *"Some rules and effects refer to a creature's 'total toxic value.' A creature's total toxic value is the sum of all N values of toxic abilities that creature has. Example: If a creature with toxic 2 gains toxic 1 due to another effect, its total toxic value is 3."*

**CR 702.164c** (verbatim): *"Combat damage dealt to a player by a creature with toxic causes that creature's controller to give the player a number of poison counters equal to that creature's total toxic value, in addition to the damage's other results. See rule 120.3."*

**CR 120.3g** (verbatim): *"Combat damage dealt to a player by a creature with toxic causes that creature's controller to give the player a number of poison counters equal to that creature's total toxic value, in addition to the damage's other results."*

**CR 120.3b** (verbatim): *"Damage dealt to a player by a source with infect causes that source's controller to give the player that many poison counters. This is not damage to the player; it is just giving the player that many poison counters."*

**CR 704.5c** (verbatim): *"If a player has ten or more poison counters, that player loses the game. This is checked as a state-based action."*

## The Pattern

```
TOXIC — COMBAT DAMAGE ONLY (702.164c, 120.3g):
  Toxic gives poison counters ONLY when dealing COMBAT DAMAGE to a PLAYER.
  Non-combat triggers:
    → Venerated Rotpriest ({G}: 1/2, Toxic 1): its second ability "whenever a creature you
      control becomes the target of a spell, target opponent gets a poison counter" is NOT
      from Toxic — that's a separately printed triggered ability.
    → Toxic itself only fires on combat damage.
  Non-player damage:
    → If a Toxic creature deals combat damage to a planeswalker or battle, NO poison counters.
    → Only player targets generate poison from Toxic.
  Non-combat damage:
    → Lightning Bolt dealing 3 damage to a player via a Toxic creature? Does Toxic fire?
      No — Toxic requires COMBAT damage. Non-combat damage from a Toxic source doesn't trigger Toxic.

TOTAL TOXIC VALUE STACKS (702.164b):
  Multiple Toxic instances add together.
  Toxic 2 + Toxic 1 = total toxic value 3 → 3 poison counters per hit.
  Cards that grant Toxic to a creature (Necrogen Communion: "enchanted creature has Toxic 2")
    combine with any existing Toxic on the creature.
  Example: Creature with Toxic 1 equips Grafted Wargear (increases power but doesn't give Toxic).
    No stacking there — but if Toxic 1 creature is enchanted with Necrogen Communion ({1}{B}: Aura,
    "enchanted creature has Toxic 2"): total toxic value = 1 + 2 = 3.

TOXIC + INFECT INTERACTION (120.3b + 120.3g):
  Infect is a replacement effect for damage dealt to players:
    "Damage this source deals to players is dealt as poison counters instead."
    (More precisely: 120.3b — damage to player from infect source = that many poison counters,
    NOT life loss.)
  Toxic fires IN ADDITION to the damage's other results (120.3g).
  If a creature has BOTH Infect AND Toxic N:
    Step 1: Infect replacement fires — combat damage becomes poison counters (one per damage).
    Step 2: Toxic fires — N additional poison counters are also given.
    Result: player receives (damage amount) poison from Infect + N poison from Toxic.
  Example: a 3/3 creature with Infect and Toxic 2 deals combat damage for 3:
    Infect: player receives 3 poison counters (no life loss).
    Toxic: player receives 2 MORE poison counters (total toxic value 2).
    Total: 5 poison counters from a single combat hit.
  Note: No printed card has both Infect and Toxic, but either can be granted by effects
    (e.g., a Toxic creature gains Infect from an aura, or vice versa).

DOUBLE STRIKE + TOXIC:
  Double strike deals both first strike and regular combat damage.
  Each is a separate combat damage step.
  Toxic fires on EACH combat damage step that hits a player.
  A 2/2 with Double Strike and Toxic 1 hitting a player for 2 hits each:
    → First strike damage: 2 damage + 1 poison counter.
    → Regular damage: 2 more damage + 1 more poison counter.
    → Total: 4 damage + 2 poison counters.
  Important: Trample + Toxic:
    If a Toxic creature tramples over a blocker, the excess damage that hits the player:
      → The player takes the trample excess as combat damage.
      → Toxic fires for the FULL toxic value, not proportional to excess damage.
    Example: 4/4 Toxic 2 blocked by 1/1. Assign 1 damage to blocker, 3 trample to player.
      → Player takes 3 damage AND 2 poison counters (full Toxic value).

TOXIC vs. INFECT (key distinction):
  Infect:
    - Replaces ALL damage to players with poison counters (combat and non-combat).
    - Deals damage to creatures as -1/-1 counters (instead of normal damage).
  Toxic:
    - Adds poison counters IN ADDITION to normal damage (additive, not replacing).
    - Only applies to COMBAT damage.
    - Does not affect how damage is dealt to creatures.
  Infect is stronger per hit but forces the player to die by poison alone (they don't lose life).
  Toxic lets a player die by BOTH life loss AND poison — potentially faster for agressive builds.

CORRUPTED — ABILITY WORD (not a keyword):
  "Corrupted" is an ability word (like Metalcraft, Morbid, etc.) — it's NOT a keyword.
  It cannot be granted, removed, or interacted with as a "keyword ability."
  Its condition: "an opponent has 3 or more poison counters."
  It appears as:
    Static Corrupted: "As long as an opponent has 3+ poison, [effect]."
    Triggered Corrupted: "Whenever X, if an opponent has 3+ poison, [effect]."
    Activated Corrupted: "Activate only if an opponent has 3+ poison."
  The threshold (3 counters) is checked continuously for static effects, or at the time
    the triggered/activated ability checks, not at the time the trigger fires.
  "An opponent" = at least one opponent. In multiplayer, if ANY opponent has 3+, Corrupted is active.

PROLIFERATE + TOXIC/CORRUPTED:
  Proliferate (CR 701.34): choose any number of permanents AND/OR players with a counter,
    give each another counter of each kind already there.
  Players with 1+ poison counters CAN be chosen for proliferate: they get another poison counter.
  Bloated Contaminator ({2}{G}: 4/4, Trample, Toxic 1; "whenever this creature deals combat damage
    to a player, proliferate"):
    → Deals 4 damage + 1 poison counter to player.
    → Proliferate trigger fires: you can choose that player (they now have 1+ poison) and
      give them ANOTHER poison counter (total: 2 from this hit).
    → Choose other players with counters too.
  This makes Bloated Contaminator exceptionally efficient at poison delivery.
```

## Definitive Conclusions

- **Toxic is COMBAT damage only** — non-combat damage from a Toxic creature gives no poison; only when combat damage hits a player does Toxic's poison counter grant fire.
- **Toxic stacks across multiple instances** — a creature with Toxic 2 that gains Toxic 1 has total toxic value 3; all three counters are given per combat hit.
- **Toxic + Infect: both stack** — if a creature has Infect AND Toxic N, the player receives the Infect poison counters (replacing damage) AND N additional poison counters from Toxic; the combined effect is extremely potent.
- **Double strike doubles Toxic triggers** — each combat damage step where the creature hits a player triggers Toxic separately; a double striker deals two rounds of poison.
- **Corrupted is an ability word, not a keyword** — it cannot be granted or removed; its threshold (3+ poison on an opponent) is checked at the time specified by the Corrupted ability's structure.
- **10 poison counters = lose the game** (CR 704.5c) — this is a state-based action checked whenever a player would receive priority.

## Canonical Example

**Bloated Contaminator ({2}{G}: 4/4 Trample, Toxic 1):**
Bloated Contaminator attacks. Blocked by a 3/3. Controller assigns 3 damage to blocker, 1 trample damage to player.
→ Player takes 1 combat damage (life loss) AND 1 poison counter (Toxic 1, full value regardless of trample amount).
→ Proliferate trigger fires (combat damage dealt to a player).
→ Choose the defending player (1 poison counter): they get another → 2 total.
→ Also choose any other permanent/player with counters.

Next turn: Contaminator attacks unblocked. Deals 4 damage and 1 poison.
→ Player now at reduced life, 3 poison counters.
→ Corrupted threshold reached for opponents! Skrelv's Hive creatures gain lifelink.

**Example 2 — Toxic + Infect via Enchantment:**
Creature: 3/3 Phyrexian with Toxic 2.
Opponent gives it Grafted Exoskeleton ({4}: Equipment, "equipped creature has infect; when equipped, if it becomes unattached from a permanent, sacrifice that permanent"):
Now the 3/3 has Infect AND Toxic 2.

It attacks and deals 3 combat damage to a player (unblocked).
→ Infect: player receives 3 poison counters (no life loss — damage replaced).
→ Toxic 2: player receives 2 MORE poison counters (in addition to infect result).
→ Total: 5 poison counters from a single unblocked hit.
One more unblocked hit like this: 5 more counters = 10 total → player loses the game.
(The 3/3 needs to hit once with Infect+Toxic 2 to give 5 poison, then 5 more to win.)

**Example 3 — Venerated Rotpriest Poison Loop:**
Venerated Rotpriest ({G}: 1/2, Toxic 1; "whenever a creature you control becomes the target of a spell, target opponent gets a poison counter"):

You cast Mutagenic Growth ({G/P}: target creature gets +2/+2 until end of turn) on Venerated Rotpriest.
Rotpriest's triggered ability fires: target opponent gets a poison counter.
But Mutagenic Growth also targets Rotpriest, a creature you control → Rotpriest triggers again? No — the trigger fires once for each SPELL targeting a creature you control. Mutagenic Growth is one spell. One trigger.
Opponent gets 1 poison counter from the trigger.

Now use Defiler of Vigor to pump multiple creatures: Rotpriest triggers for each creature targeted by the spell, each time giving opponent a poison counter. If you buff 5 creatures in a mass-pump: 5 Rotpriest triggers.

Combat: Rotpriest swings unblocked → 1 damage + 1 poison (Toxic 1).
Total path to 10 poison: spell triggers + combat damage.

## Commonly Confused With
- **P428 (Wither/Infect)** — P428 covers how Infect and Wither deal damage as counters. Toxic is additive (not a replacement); Infect is a replacement. Together they stack (P493 covers the interaction). P428 does not address Toxic.
- **P461 (Threshold/Metalcraft/Delirium)** — Corrupted is structurally similar to Metalcraft (needs N artifacts) and Threshold (needs 7+ GY cards) as an "ability word with a condition." Corrupted's condition is opponent poison count, not a self-resource count.
- **P465 (Proliferate)** — Proliferate can target players with poison counters, allowing rapid acceleration through the Toxic/Corrupted threshold. The Bloated Contaminator canonical example above demonstrates proliferate as a Toxic enabler.
