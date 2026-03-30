---
id: p027
name: Protection — DEBT Only
category: combat
cr_refs: [702.16b, 702.16c, 702.16d, 702.16e, 702.16f, 702.19b]
tags: [protection, DEBT, damage-prevention, targeting, enchanted, blocked, wrath, trample, hexproof, shroud, indestructible]
created: 2026-03-28
examples_count: 3
---

# P027 — Protection — DEBT Only

## Abstract
Protection is commonly misread as "nothing of that quality can affect me." In reality, protection prevents exactly four things — captured by the acronym DEBT: the protected permanent can't be **D**amaged by sources with that quality, **E**nchanted/Equipped by permanents with that quality, **B**locked by (when attacking) creatures with that quality, or **T**argeted by spells/abilities from that quality. Everything else — global destruction effects, global -X/-X effects, mass exile, state-based actions — applies normally to a protected permanent. Protection is a precise surgical shield, not a blanket immunity.

## The Definitive Rule

**CR 702.16a**: Protection is a static ability. "Protection from [quality]" — quality is usually a color but can be any characteristic value.

**CR 702.16b (T — Targeted)**: *"A permanent or player with protection can't be targeted by spells with the stated quality and can't be targeted by abilities from a source with the stated quality."*

**CR 702.16c (E — Enchanted)**: *"A permanent or player with protection can't be enchanted by Auras that have the stated quality. Such Auras attached to the permanent or player with protection will be put into their owners' graveyards as a state-based action."*

**CR 702.16d (E — Equipped)**: *"A permanent with protection can't be equipped by Equipment that have the stated quality or fortified by Fortifications that have the stated quality. Such Equipment or Fortifications become unattached from that permanent as a state-based action, but remain on the battlefield."*

**CR 702.16e (D — Damaged)**: *"Any damage that would be dealt by sources that have the stated quality to a permanent or player with protection is prevented."*

**CR 702.16f (B — Blocked)**: *"Attacking creatures with protection can't be blocked by creatures that have the stated quality."*

**CR 702.19b (Trample + Protection example, verbatim)**: *"A 6/6 green creature with trample is blocked by a 2/2 creature with protection from green. The attacking creature's controller must assign at least 2 damage to the blocker, even though that damage will be prevented by the blocker's protection ability."*

## The Pattern

```
PROTECTION FROM [QUALITY] — WHAT IT BLOCKS:

  D — Damage: Any damage from a source with that quality → PREVENTED
      (combat damage, noncombat damage, burn spells, abilities)

  E — Enchanted/Equipped: Auras/Equipment with that quality → CAN'T ATTACH
      (If already attached when protection is gained → SBA removes them)

  B — Blocked (when attacking): Creatures with that quality → CAN'T BLOCK IT
      (Only applies when the protected creature is the attacker)
      (Does NOT prevent the protection creature from blocking an attacker of that quality)

  T — Targeted: Spells/abilities from sources with that quality → CAN'T TARGET IT

PROTECTION DOES NOT PREVENT:

  Global non-targeting effects from that quality source:
    "Destroy all creatures" (white spell) → still destroys protection-from-white creature
    "All creatures get -2/-2" (white enchantment, static) → still applies
    "Exile all creatures" (white spell, no targeting) → still exiles
    "Each creature gets -1/-1 for each opponent" (colorless, white permanent) → depends on SOURCE quality

  State-based actions:
    A creature with protection from white can still die from -1/-1 counters,
    toughness reduction, or the legend rule

  Effects that aren't in the DEBT framework:
    Non-damage lifeloss from a white source — not prevented
    White creatures entering can trigger ETB that affects the protected creature
      (the trigger isn't "targeting" the creature)

DIRECTION OF BLOCKING (B) IS ONE-WAY:
  My protection-from-white creature attacks → white creatures CAN'T block it
  White creature attacks → my protection-from-white creature CAN block it
    AND: when blocking, damage from white attacker is prevented (D applies)
    Result: protection-from-white creatures are excellent white-creature blockers

TRAMPLE + PROTECTION INTERACTION:
  Trample attacker must still assign "lethal" damage to protection blocker
  Even though damage will be prevented, the ASSIGNMENT obligation stands
  Attacker assigns N (lethal) to protection blocker + excess to player
  Result: protection blocker reduces trample damage but doesn't stop it entirely
```

## Definitive Conclusions

- **Wrath of God destroys a creature with protection from white.** Wrath says "destroy all creatures" — no targeting (T irrelevant), no damage (D irrelevant). Protection doesn't interact.
- **"All creatures get -2/-2" from a white enchantment applies to protection-from-white creatures.** Non-targeting static effect; none of the DEBT pillars apply.
- **Protection-from-white creatures are great white-creature blockers.** They can block white attackers, take zero combat damage (D prevents it), and deal their own damage normally.
- **Trample still deals damage to players even through protection blockers.** The attacker must assign lethal amounts to the protection blocker (even though they're prevented), then excess goes to the player.
- **A white Aura already on a creature becomes a problem the moment protection is gained.** The Aura violates E (protection can't be enchanted by it) → SBA removes the Aura immediately.
- **"Protection from everything" (702.16j) covers all four DEBT pillars against all sources.** Still doesn't stop global non-DEBT effects.
- **Hexproof only covers the T of DEBT.** Shroud only covers T (from all players). Indestructible covers destruction/lethal damage but not -X/-X. Protection is a broader but still specific shield.

## Canonical Example
**Wrath of God vs. Progenitus (Protection from Everything):**
Wrath of God says "Destroy all creatures." Progenitus has "protection from everything." Wrath doesn't target — T is irrelevant. Wrath doesn't deal damage — D is irrelevant. Wrath says "destroy" — but protection doesn't prevent destruction, only DEBT interactions. Progenitus is destroyed. (Exception: if Progenitus also has indestructible, *that* would save it — but protection alone doesn't.)

Wait — Progenitus's card text says "Can't be countered." Also protection from everything. But "Wrath of God" just destroys everything. Protection from everything means it can't be targeted by anything, damaged by anything, enchanted by anything, blocked by anything. "Destroy all" is none of those. Progenitus dies to Wrath.

**Example 2 — Black Knight blocks a white attacker:**
Black Knight (protection from white) is back on the battlefield. A white 4/4 swings at you. You block with Black Knight (2/2). Black Knight can block it (B only prevents the protected creature from being blocked, not from blocking). The white 4/4 assigns 2 damage to Black Knight → damage is prevented (D). Black Knight deals 2 damage to the white 4/4. End result: white 4/4 takes 2 damage, Black Knight takes 0.

**Example 3 — Trample through a protection blocker:**
A 6/6 green creature with trample attacks. You block with a 2/2 creature with protection from green. Your blocker has "protection from green" so it prevents all green damage. The attacker must still assign 2 (lethal) to the blocker first, then can assign 4 to you. Your blocker takes 0 actual damage (prevented). You take 4. Your blocker survives. (CR 702.19b example confirmed.)

## Commonly Confused With
- **P008 (Can't vs. May)** — Protection's "can't be targeted" is a "can't" effect, but P027 defines the precise scope of what protection's can't covers (DEBT only), while P008 is about conflicting can't/may permissions.
- **P007 (Priority Windows)** — Sometimes players try to respond to a Wrath with giving their creature protection. Worth noting: even if you give protection from white in response to Wrath of God, the Wrath still resolves and still destroys the creature, because Wrath doesn't use any of the DEBT mechanisms.
- **P002 (Replacement vs. Trigger)** — Protection's damage prevention is a replacement effect (D in DEBT). A triggered "whenever damage is dealt to this creature" would still fire... wait: if damage is prevented (never dealt), 614.6 says the replaced event never happens. No damage is dealt, so "whenever damage is dealt" triggers do NOT fire. Prevention means 0 damage occurs, not that 0 damage is redirected.

## Additional Notes — "Protection from Colored Spells" (Emrakul, the Aeons Torn)

Emrakul has "protection from spells that are one or more colors" — a narrower quality than "protection from colored." This distinction matters for all four DEBT pillars:

- **B (Blocked)**: Creatures on the battlefield are **permanents**, not spells. Colored creatures CAN block Emrakul — "colored spells" is a quality of objects on the stack, not objects on the battlefield. A 2/2 red creature can block Emrakul freely. (Gatherer ruling 2018-12-07: "Even though creatures are spells when they're cast, they're not spells when they're on the battlefield and can block Emrakul.")
- **T (Targeted)**: Triggered abilities of colored permanents CAN target Emrakul. An ability like Banishing Light's ETB trigger is from a permanent (not "a colored spell"), so Emrakul can be targeted by it. Only colored SPELLS on the stack can't target it. (Gatherer ruling 2018-12-07: "Triggered abilities of permanents entering the battlefield, such as that of Banishing Light, can target it.")
- **E (Enchanted by Aura spells)**: Colored Aura **spells** can't target Emrakul (T applies during casting). But colored Auras put onto the battlefield without casting (e.g., via Zur the Enchanter's attack trigger, or Eldrazi Conscription-style effects) CAN enchant Emrakul — they're not spells when they enter. (Gatherer ruling 2018-12-07: "Emrakul can't be the target of colored Aura spells, but colored Auras can be put onto the battlefield enchanting it.")
- **D (Damaged)**: Damage from "colored spells" (the spell itself dealing damage, e.g., a red instant) IS prevented. Damage from colored permanent abilities (e.g., a red creature dealing combat damage) is NOT prevented — the combat damage is from a permanent, not a "colored spell."

**The general principle**: "Protection from colored spells" is a quality that only applies to objects on the stack (where they are, in fact, spells). Once an object is a permanent on the battlefield, it is not a "spell" and therefore doesn't have the "colored spell" quality that Emrakul's protection blocks.

## Additional Notes — Protection Only Applies on the Battlefield

Protection is an ability that functions on the battlefield (or for players). It does NOT protect a spell while it's on the stack. For example, Emrakul, the Promised End has "protection from instants" — but while Emrakul is a spell on the stack waiting to resolve, it CAN be targeted by instant spells like Syncopate. Once Emrakul resolves and is on the battlefield, its protection from instants then applies. (Gatherer ruling 2025-01-24: "Protection abilities only apply while the object with the ability is on the battlefield. Notably, Emrakul may be the target of a spell that targets it while on the stack, such as Syncopate.")

Additionally, Emrakul the Promised End's "protection from instants" blocks the DEBT interactions from instant sources, but instants can still affect Emrakul in other non-DEBT ways. For example, Rally the Peasants gives all creatures +2/+0 — this is not targeting, damaging, enchanting, or blocking Emrakul, so it bypasses protection and the bonus applies. (Gatherer ruling 2025-01-24)
