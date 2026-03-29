---
id: p107
name: Lifelink — Simultaneous Damage and Life Gain
category: combat
cr_refs: [702.15a, 702.15b, 702.15c, 702.15d, 702.15e, 120.3]
tags: [lifelink, life-gain, damage, simultaneous, static-ability, multiple-sources, triggers, not-triggered]
created: 2026-03-28
examples_count: 2
---

# P107 — Lifelink — Simultaneous Damage and Life Gain

## Abstract
Lifelink is a static ability (not triggered). Damage dealt by a lifelink source causes the controller to gain life simultaneously with the damage being dealt — not afterward. There is no "lifelink trigger" on the stack. This means life gain from lifelink happens at the same time as the damage. Multiple lifelink sources dealing damage simultaneously each create separate life gain events (important for "whenever you gain life" triggers). You cannot "respond" to lifelink before the life is gained, because it's not a trigger.

## The Definitive Rule

**CR 702.15b** (verbatim): *"Damage dealt by a source with lifelink causes that source's controller, or its owner if it has no controller, to gain that much life (in addition to any other results that damage causes). See rule 120.3."*

**CR 702.15e** (verbatim): *"If multiple sources with lifelink deal damage at the same time, they cause separate life gain events (see rules 119.9–10)."*
*Example: "A player controls Ajani's Pridemate, which reads 'Whenever you gain life, put a +1/+1 counter on this creature,' and two creatures with lifelink. The creatures with lifelink deal combat damage simultaneously. Ajani's Pridemate's ability triggers twice."*

## The Pattern

```
LIFELINK IS STATIC (not triggered):
  Life is gained simultaneously with damage being dealt
  There is NO "lifelink trigger" that goes on the stack
  You CANNOT respond "in response to lifelink" — it doesn't use the stack
  The life gain is part of the damage event itself

SIMULTANEOUS MULTIPLE LIFELINK:
  Multiple lifelink creatures dealing damage at same time:
    Each creature's damage = separate life gain event (702.15e)
  Example: Two lifelink creatures each deal 3 damage simultaneously:
    → Two separate life gain events of 3 each
    → "Whenever you gain life" triggers TWICE (one per event)
    → "Whenever you gain 3 or more life" would trigger twice
    → NOT: one event of 6 life

LIFELINK FROM ANY ZONE (702.15d):
  Works regardless of what zone the source is in when dealing damage
  A lifelink creature enchanted with "damage deals double" in exile... still gains life from damage
  Last known information used if source changes zones before damage (702.15c)

LIFELINK AND COMBAT:
  Damage step: all combat damage is dealt simultaneously
  If attacking lifelink creature deals 4 damage:
    You gain 4 life AT THE MOMENT damage is dealt
  Opponent can't try to kill you before you gain the life
  (Because the life gain is simultaneous with damage, not after)

LIFELINK AND PREVENTION:
  Prevented damage isn't dealt → no lifelink life gain for prevented damage
  Redirect: damage dealt to new target → lifelink life still gained (it was still dealt)

LIFELINK AND DAMAGE DOUBLERS:
  Fiery Emancipation (triple damage): lifelink gives triple life too
  Because lifelink scales with the damage actually dealt

IMPORTANT: "Whenever you gain life" TRIGGERS fire from lifelink:
  Even though lifelink itself is static, life gain events trigger any "gain life" abilities
  Those triggered abilities go on the stack AFTER the damage/life gain
  → Lifelink life gain → triggers "when you gain life" abilities → they go on stack
  → Opponent can then respond to those triggers but can't prevent the life gain

MULTIPLICITY:
  Multiple instances of lifelink are redundant (702.15f)
```

## Definitive Conclusions

- **Lifelink is static — life gained simultaneously with damage, not after.** No stack, no response window.
- **Multiple simultaneous lifelink sources = multiple separate gain life events.** Each triggers "whenever you gain life" separately.
- **Damage doublers also double lifelink.** Lifelink scales with actual damage dealt.
- **Prevented damage = no lifelink.** The damage wasn't "dealt."
- **You can't respond to lifelink** — by the time anyone would get priority, the life is already gained.

## Canonical Example
**Baneslayer Angel (lifelink) attacks, blocked by 5/5:**
Combat damage: Baneslayer deals 5, takes 5. You gain 5 life simultaneously.
Your "Whenever you gain life" triggers go on the stack after the damage step resolves.

**Example 2 — Two lifelink creatures vs Ajani's Pridemate:**
You attack with two 3/3 lifelink creatures. Both deal 3 damage (blocked or to player simultaneously).
Two separate life gain events of 3 each → Ajani's Pridemate triggers TWICE → gets two counters.
(Not once for 6 life — it's two separate events of 3.)

## Commonly Confused With
- **P002 (Replacement vs Trigger)** — Lifelink is neither; it's a static modifier to the damage event itself.
- **P107 is often confused with a triggered ability** — lifelink doesn't trigger, it's concurrent with damage.
- **P007 (Priority Windows)** — No window exists to "respond to lifelink" before life is gained; it's simultaneous.
