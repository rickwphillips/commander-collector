---
id: p514
name: Survival (DSK) — Second Main Phase Trigger, Intervening-If Tapped Check, and Extra Phase Edge Cases
category: triggered
cr_refs: [603.4, 500.6, 507.1, 702.9]
tags: [survival, ability-word, tapped, second-main-phase, intervening-if, extra-phase, vigilance, extra-combat, duskmourn, DSK, main-phase-trigger]
created: 2026-03-30
examples_count: 4
---

# P514 — Survival (DSK) — Second Main Phase Trigger, Intervening-If Tapped Check, and Extra Phase Edge Cases

## Abstract
**Survival** (Duskmourn: House of Horror, 2024) is an ability word for a triggered ability that fires at the beginning of your second main phase **if** the creature is tapped at that moment. The critical rules details: (1) the tapped check is an **intervening "if" clause** — it must be true when the trigger would fire AND when the ability resolves; (2) if the creature isn't tapped when the second main phase begins, the ability doesn't even trigger; (3) you cannot tap the creature during the second main phase to retroactively get the trigger — the tapped state must exist at the beginning of that phase; (4) Survival triggers only on the **second** main phase of a turn — it will **not** trigger during third, fourth, or any additional main phases in the same turn, even if those are caused by extra combats or other effects; (5) Vigilance-attacking creatures that combat-tap are still tapped at the second main phase (vigilance prevents tapping to attack — those creatures won't be tapped, so Survival doesn't trigger from vigilance attacks).

## The Definitive Rules

**Official Ruling (2024-09-20):** *"Survival abilities (and other abilities that trigger at the beginning of your second main phase) will trigger at the beginning of the second main phase you take in a turn. They won't trigger during your third, fourth, or other additional main phases in a single turn, if effects somehow cause you to have more than two main phases."*

**Official Ruling (2024-09-20):** *"If a creature with a survival ability isn't tapped when your second main phase begins, the ability won't trigger at all. You won't be able to tap it during your second main phase in time to have that ability trigger."*

**Official Ruling (2024-09-20):** *"If a creature's survival ability triggers but that creature is untapped when the ability begins to resolve, that ability won't do anything."*

**Official Ruling (2024-09-20):** *"If a creature's survival ability triggers but the creature leaves the battlefield before the ability resolves, use its tapped or untapped status as it last existed on the battlefield to determine whether or not the ability will do anything."*

**CR 603.4 (Intervening If Clause):** *"Triggered abilities that have a condition listed as an intervening 'if' clause: (1) the ability only triggers if the condition is true at trigger time, and (2) the ability does nothing if the condition is not true when it resolves."*

**CR 500.6:** *"Some effects can add phases to a turn. A turn can have any number of phases of the same type."*

## The Pattern

```
SURVIVAL TRIGGER STRUCTURE:

  "Survival — At the beginning of your second main phase, if [this creature] is tapped,
    [effect]."

  This is an INTERVENING "IF" TRIGGER (CR 603.4):
    Check 1 (trigger time): Is the creature tapped when the second main phase BEGINS?
      → YES: trigger fires, goes on stack
      → NO: trigger does NOT fire at all
    Check 2 (resolution time): Is the creature STILL tapped when the trigger resolves?
      → YES: effect happens
      → NO: ability is removed from stack; does nothing

  TAPPED WINDOW:
    The only moment that matters for triggering is the VERY BEGINNING of the second main phase.
    You cannot tap the creature DURING the second main phase to get the trigger.
    "At the beginning of your second main phase" = the instant that phase starts.
    Example: Your Kona, Rescue Beastie ({3}{G}: 4/3) is untapped when second main starts.
      → Survival does not trigger. End of story.
      → You cannot activate {T} abilities or tap Kona now to try to trigger Survival.

  TYPICAL PATH TO TAPPED STATE:
    1. The creature attacked this turn (declared as attacker → tapped, unless vigilance).
    2. The creature was tapped by a {T} ability (mana ability, etc.) before second main phase.
    3. The creature was tapped by an opponent's effect.
    4. The creature was tapped by a blocking requirement (rare — blockers don't tap to block).

  VIGILANCE INTERACTION:
    Vigilance means the creature "doesn't tap to attack" — it attacks untapped.
    A vigilance creature that attacks will NOT be tapped after combat.
    → Survival does NOT trigger for a vigilance attacker.
    The point of Survival is: reward creatures that attacked. Vigilance + Survival = no reward
    unless the creature was tapped some other way.

EXTRA COMBAT AND EXTRA MAIN PHASES:

  Modern turns can have: Precombat Main → Combat → Postcombat Main (→ Combat → Postcombat Main → ...)

  WHEN SURVIVAL TRIGGERS:
    Survival triggers on your SECOND main phase of the turn.
    In a normal turn: the postcombat main phase IS your second main phase.
    In a turn with extra combats (Aggravated Assault, Moraug, etc.):
      → If Aggravated Assault creates an extra combat, it ALSO creates a postcombat main phase.
      → The turn structure becomes:
          Precombat Main (1st main) → Combat → Postcombat Main (2nd main) → Combat → Postcombat Main (3rd main) → ...
      → SURVIVAL TRIGGERS ONLY AT THE 2ND MAIN PHASE.
      → It does NOT trigger again at the 3rd, 4th, etc. main phases.
      → Once triggered (or missed) at the 2nd main phase, Survival is done for this turn.

  EXTRA MAIN PHASE EXAMPLE (Aggravated Assault):
    You attack with Defiant Survivor ({2}{G}: 3/2; "Survival — Manifest Dread" if tapped).
    Defiant Survivor is tapped. You activate Aggravated Assault (extra combat + extra main phase).
    Turn structure: 1st Main → Combat → 2nd Main (Survival triggers here!) → [Extra] Combat → 3rd Main.
    Survival triggers at the 2nd main phase. It fires, manifests dread.
    When the 3rd main phase begins: Survival does NOT trigger again.

  MORAUG PRECOMBAT LANDFALL:
    Moraug's landfall during PRECOMBAT main phase creates extra combat BEFORE regular combat.
    Structure: 1st Main → [Extra] Combat → [Extra] Main → Regular Combat → 2nd Main.
    Wait: the "extra main" after the Moraug-triggered extra combat is now the 2nd main phase.
    → Survival triggers there, before the regular combat even starts.
    → If the creature attacked in the Moraug extra combat and is tapped, Survival fires early.
    → After regular combat and the subsequent normal postcombat main phase: that's the 3rd main.
    → Survival does NOT fire again in the 3rd main phase.

  "ONCE ONLY" VARIANTS:
    Acrobatic Cheerleader ({1}{W}: 2/2): "Survival — put a flying counter on it. This ability
      triggers only once."
    The "triggers only once" language means the ability won't fire again even in a future turn's
    second main phase. Once the flying counter has been placed, the trigger is permanently gone.
    Other Survival abilities fire each turn (as long as the creature is tapped at the right time).

SUMMARY OF STATES:

  Tapped at beginning of 2nd main phase?
    → YES → Ability triggers → goes on stack → check tapped at resolution
      → Still tapped? → EFFECT FIRES
      → Untapped by resolution? → FIZZLES (does nothing)
    → NO → Nothing triggers

  Extra main phases beyond the 2nd?
    → Survival abilities: NO TRIGGER in 3rd+ main phases

  Vigilance attacker?
    → Vigilance = attacks without tapping → NOT tapped at 2nd main phase
    → Survival does NOT trigger for vigilance attackers
    (Unless tapped by some other effect)

  Creature leaves battlefield before resolution?
    → Use last-known-information for tapped status
    → If it was tapped when it left → ability resolves and fires
    → If it was untapped when it left → fizzles

{T} ACTIVATED ABILITY TIMING TRAP:
  Players sometimes try to: declare second main phase starts → tap creature with {T} ability
    → try to trigger Survival. This DOES NOT WORK.
  The trigger fires at the INSTANT the phase begins.
  If the creature isn't tapped at that instant, no trigger.
  You cannot use priority during the beginning-of-phase trigger window to pre-tap.
  (The phase begins → turn-based actions happen → triggered abilities placed on stack → priority.)
  Tapping during the beginning-of-phase is too late to retroactively set the trigger condition.
```

## Definitive Conclusions

- **Survival is an intervening "if" trigger** — tapped status is checked twice: at trigger time (phase beginning) and at resolution; if either check fails, no effect.
- **The creature must be tapped when the second main phase begins** — you cannot tap it afterward to retroactively trigger Survival.
- **Survival triggers ONLY at the second main phase** — extra main phases (third, fourth, etc.) from Aggravated Assault, Moraug, or similar effects do not trigger Survival again.
- **Vigilance attackers are untapped after combat** — they don't trigger Survival from combat unless tapped by another effect.
- **"Triggers only once" Survival variants** (Acrobatic Cheerleader) are permanent — once triggered and resolved, the ability is gone forever.
- **LKI applies if creature leaves battlefield** — if the creature was tapped when it left, the triggered ability still resolves.

## Canonical Example

**Kona, Rescue Beastie — Second Main Phase, Tapped:**

Turn: Kona, Rescue Beastie ({3}{G}: 4/3) attacks. Declared attacker → tapped.

After combat, your second main phase begins. Kona is tapped (attacked this turn). Survival ability triggers: "if Kona is tapped, you may put a permanent card from your hand onto the battlefield."

Trigger resolves: Kona is still tapped. You put Ghalta, Primal Hunger ({10}{G}{G}) from your hand onto the battlefield for free.

**Example 2 — Missed Survival Trigger:**

House Cartographer ({1}{G}: 2/2; "Survival — reveal top cards until land, put land in hand") didn't attack this turn. Its second main phase begins with it untapped. Survival does NOT trigger. You can't tap it now to retroactively get the trigger.

**Example 3 — Extra Combat + Survival Timing:**

You control Rip, Spawn Hunter ({2}{G}{W}: 4/4; "Survival — reveal top X cards, put creature/Vehicle cards into hand"). Rip attacks. After damage, postcombat main phase begins — but wait! You activate Aggravated Assault this turn in your second main phase.

Actually: the structure is 1st Main → Combat (Rip attacks, gets tapped) → 2nd Main. Survival triggers at the 2nd Main (Rip is tapped). Effect resolves: reveal top 4 cards (power 4), put creature/Vehicle cards from among them into hand.

Aggravated Assault was activated DURING the 2nd main phase. After the 2nd main phase, another combat begins. After that combat: 3rd main phase. Survival does NOT trigger in the 3rd main phase.

**Example 4 — Vigilance + Survival Non-Interaction:**

You control Reluctant Role Model ({1}{W}: 2/2 Vigilance; "Survival — put a flying, lifelink, or +1/+1 counter on it"). Vigilance allows it to attack without tapping.

It attacks without tapping. Second main phase begins: Reluctant Role Model is untapped. Survival does NOT trigger.

To get Survival value from Reluctant Role Model: you'd need to tap it with a {T} ability or an opponent's effect before the second main phase begins. In that case, it would trigger. But the vigilance attack itself provides no Survival value.

## Commonly Confused With
- **P511 (Flurry — Second Spell)** — Flurry is a "second spell each turn" trigger; Survival is a "second main phase if tapped" trigger. Both are ability words from recent sets with strict counting rules.
- **P006 (Intervening If Clause)** — P006 is the foundational pattern for all intervening "if" triggers. Survival follows this pattern exactly: condition must be true at trigger AND at resolution.
- **P510 (Extra Combat Phases)** — P510 covers how extra combats work and how they don't reset certain per-turn abilities. P514 covers how extra main phases created by extra combats do NOT give additional Survival triggers (Survival fires only at the 2nd main phase of any given turn).
- **P482 (Boast — Once Per Combat)** — Boast resets per combat phase; Survival resets per turn. "Once per combat" vs. "second main phase of the turn" are meaningfully different windows.
