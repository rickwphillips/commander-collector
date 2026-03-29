---
id: p023
name: Trigger Suppression vs. Replacement Effects
category: triggered
cr_refs: [603.1, 614.1, 614.1c, 614.1d, 112.3a, 603.2]
tags: [torpor-orb, trigger-suppression, replacement-effect, ETB, as-enters, enters-with, counters, static-ability, suppression]
created: 2026-03-28
examples_count: 1
---

# P023 — Trigger Suppression vs. Replacement Effects

## Abstract
Effects that suppress triggered abilities (like Torpor Orb) only suppress *triggers* — events that use "when/whenever/at" and go onto the stack. They do not suppress *replacement effects* — events that use "instead/as/with" and apply during the entry event itself. A creature that "enters with +1/+1 counters" still enters with those counters under Torpor Orb. A creature with an ETB trigger that says "when this enters, put a +1/+1 counter on it" gets suppressed. Same outcome, different mechanism, different interaction with suppression.

## The Definitive Rule

**CR 603.1**: Triggered abilities use "when," "whenever," or "at." They are distinct objects that go on the stack.

**CR 614.1c–d**: Replacement effects using "enters with," "as [this] enters," or "[this] enters as" apply during the entry event. They are not triggers and never use the stack.

**CR 112.3a**: Static abilities are continuously true. They are not triggered and cannot be suppressed by trigger suppression.

**Torpor Orb ruling (2024-04-12)**: *"Replacement effects are unaffected by Torpor Orb's ability. For example, a creature that enters the battlefield with one +1/+1 counter on it will still receive a +1/+1 counter."*

**Torpor Orb ruling (2024-04-12)**: *"Abilities that apply 'as [this creature] enters the battlefield,' including many abilities that ask a creature's controller to choose a color or creature type, are unaffected."*

## The Pattern

```
ENTERING CREATURE HAS:                    UNDER TORPOR ORB:
"When this enters, put a counter on it"   → SUPPRESSED (trigger)
"Enters with a +1/+1 counter"             → NOT suppressed (replacement)
"As this enters, choose a color"          → NOT suppressed (replacement)
"When this enters, draw a card"           → SUPPRESSED (trigger)
Flying / Hexproof / Deathtouch            → NOT suppressed (static ability)
"When this enters, target player loses 3" → SUPPRESSED (trigger)

OTHER PERMANENTS WATCHING:
"When a creature enters, do X"           → SUPPRESSED (trigger)
"When a creature with power ≥4 enters"   → SUPPRESSED (trigger)
"Artifacts entering have flash"           → NOT suppressed (static ability,
                                            and not a creature trigger anyway)

TORPOR ORB CHECKS AT ENTRY TIME:
  → Is the permanent a creature when it enters?
  → If yes: suppress ETB triggers
  → Evaluate using permanent as it exists on battlefield
     (e.g., March of the Machines makes artifacts into creatures → suppressed)
```

## Definitive Conclusions

- **The keyword to look for is "when/whenever/at."** These are always triggers. Torpor Orb stops these.
- **"As [this] enters" and "enters with" are always replacements.** Torpor Orb never stops these.
- **Passive static abilities survive.** Haste, hexproof, vigilance — all static. A creature with Haste entering under Torpor Orb still has haste.
- **Phyrexian Dreadnought + Torpor Orb:** Dreadnought's "when this enters, sacrifice unless you sacrifice 12 power" is a triggered ability. Torpor Orb suppresses it. 12/12 trampler for {1} with no downside.
- **Stifle vs. Torpor Orb:** Stifle counters individual triggers after they fire. Torpor Orb prevents triggers from firing at all. Neither affects replacement effects.
- **March of the Machines interaction:** If an artifact enters under March of the Machines, it's a creature at entry time. Torpor Orb suppresses ETB triggers for it — including triggers on OTHER permanents watching for "an artifact enters."
- **Torpor Orb entering simultaneously with creatures:** If Torpor Orb and a creature enter simultaneously (e.g., Sundering Titan effect), the creatures' ETB triggers are suppressed by Torpor Orb. Ruling confirms this.

## Canonical Example
**Torpor Orb + Phyrexian Dreadnought:**
Cast Dreadnought ({1}, 12/12 trample with "when this enters, sacrifice unless you sacrifice creatures with total power ≥12"). Torpor Orb suppresses the ETB trigger. 12/12 trample for {1}.

**Torpor Orb + Reclamation Sage vs. + Acidic Slime:**
Reclamation Sage: "When this enters, you may destroy target artifact or enchantment." → SUPPRESSED. Enters as a 2/1 Elf with no effect.
Acidic Slime: Same text structure, same result → SUPPRESSED.
Compare: A creature with deathtouch is still a deathtouch creature. Torpor Orb doesn't change its static abilities.

**Torpor Orb + Sylvan Caryatid:**
Hexproof and "{T}: Add one mana" — both are static/activated, not triggers. Caryatid enters normally, has hexproof, and taps for mana. Torpor Orb has no effect.

## Commonly Confused With
- **P002 (Replacement vs. Trigger)** — P002 is the foundational distinction. P023 is a specific application: what happens when a trigger *suppression* effect is in play.
- **P008 (Can't vs. May)** — P008 covers "can't do X" conflicting with permission to do X. Torpor Orb's suppression is different — it prevents the trigger event from occurring at all, not from being allowed once triggered.
