---
id: p335
name: Protective Keywords — Hexproof, Indestructible, Ward, and Shroud
category: continuous
cr_refs: [702.11a, 702.11b, 702.11c, 702.11d, 702.12a, 702.12b, 702.18a, 702.21a, 702.21b]
tags: [hexproof, indestructible, ward, shroud, protection-keywords, evasion, non-targeting-effects, exile-bypasses, lethal-damage-immunity, deathtouch-indestructible, Mass-removal, Wrath-indestructible, Sigarda, Carnage-Tyrant, Hammer-of-Nazahn, Darksteel-Colossus, Hammer-of-Thor]
created: 2026-03-29
examples_count: 2
---

# P335 — Protective Keywords — Hexproof, Indestructible, Ward, and Shroud

## Abstract
The four primary "protection" keywords each defend a permanent differently. **Hexproof** prevents opponents from TARGETING the permanent with spells or abilities. **Shroud** prevents ANYONE (including the controller) from targeting. **Ward** is a triggered ability that counters spells/abilities targeting the permanent unless the opponent pays an additional cost. **Indestructible** prevents destruction (from damage, "destroy" effects) but NOT exile or sacrifice. Understanding what each does and doesn't stop is critical — a hexproof creature can still be Wrathed, a shroud creature can't be buffed, and an indestructible creature can be exiled.

## The Definitive Rules

**CR 702.11b** (verbatim): *"'Hexproof' on a permanent means 'This permanent can't be the target of spells or abilities your opponents control.'"*

**CR 702.11d** (verbatim): *"'Hexproof from [quality]' is a variant of the hexproof ability. 'Hexproof from [quality]' on a permanent means 'This permanent can't be the target of [quality] spells your opponents control or abilities your opponents control from [quality] sources.'"*

**CR 702.12b** (verbatim): *"A permanent with indestructible can't be destroyed. Such permanents aren't destroyed by lethal damage, and they ignore the state-based action that checks for lethal damage (see rule 704.5g)."*

**CR 702.18a** (verbatim): *"Shroud means 'This permanent or player can't be the target of spells or abilities.'"*

**CR 702.21a** (verbatim): *"Ward is a triggered ability. Ward [cost] means 'Whenever this permanent becomes the target of a spell or ability an opponent controls, counter that spell or ability unless that player pays [cost].'"*

## The Pattern

```
HEXPROOF (CR 702.11b):
  "Opponents can't target this permanent."
  Only stops TARGETING by opponents.
  Does NOT stop:
    • Your own targeting spells/abilities (you can target your hexproof creature).
    • Non-targeting effects (board wipes, "all creatures get -2/-2," etc.).
    • Auras attached without targeting (Enchant World puts Auras without targeting).
      Wait: Auras require targeting when CAST. But not when put onto battlefield by an effect.
      Example: Replenish puts Auras from GY onto battlefield — no targeting → bypasses hexproof.
    • "Each creature" effects (no targeting involved).
    • Sacrificing (no targeting involved: "sacrifice target creature" targets you, not the creature).
    • Counter-based abilities that don't say "target" (Languish: "each creature gets -4/-4" — no target).
  PRACTICAL EXAMPLES:
    Carnage Tyrant ({4}{G}{G}{G}): hexproof. Can't be targeted by opponent's spells.
      Opponent can't Doom Blade it. Can't Shock it. Can't Arrest it (which targets).
      Opponent CAN: Wrath of God (destroy all), Languish (-4/-4 to all), exile all creatures (no targeting).
    Sigarda, Host of Herons ({2}{G}{G}{W}{W}): hexproof + "opponents can't cause you to sacrifice."
      Doubly protected: can't be targeted, can't be sacrificed by opponent effects.
  HEXPROOF FROM [QUALITY] (CR 702.11d):
    "Hexproof from red" = can't be targeted by red spells or abilities from red sources.
    But CAN be targeted by blue, black, etc.
    Swiftfoot Boots: "Equipped creature has hexproof and haste."
    Gladecover Scout (1/1 Elf Scout): "Hexproof." All spells from opponents can't target it.

SHROUD (CR 702.18a):
  "This permanent can't be the target of ANY spells or abilities."
  Stricter than hexproof: includes your OWN targeting spells and abilities.
  You can't target your shroud creature with your own pump spells.
  You can't attach Equipment via the equip ability (equip targets).
  You can't target with your own beneficial spells.
  Rarely appears on player-controlled permanents now; mostly on older cards.
  Examples: Trolls of Tel-Jilad ("Shroud"). Canopy Cover gives shroud.
  Comparison:
    Hexproof: OPPONENTS can't target. You still can.
    Shroud: NOBODY can target. You included.
  KEY: Shroud is strictly worse for the controller in most situations.
    That's why modern design shifted to hexproof for "protect your stuff" effects.

WARD (CR 702.21a):
  "Whenever this permanent becomes the TARGET of an opponent's spell or ability:
    counter that spell or ability UNLESS the opponent pays [cost]."
  Ward is a TRIGGERED ABILITY. It goes on the stack.
  Ward fires AFTER the spell/ability is already on the stack (the permanent was targeted).
  The opponent can RESPOND to the ward trigger before it resolves.
  If they pay the cost when the ward resolves: the spell continues. They paid, so it wasn't countered.
  If they don't (or can't) pay: their spell is countered.
  WARD DOESN'T PREVENT TARGETING: it punishes targeting.
    A player CAN target a Ward creature; they just face an additional cost.
    Compare to hexproof: opponent CAN'T target at all.
  WARD EXAMPLES:
    Ward {2}: "Whenever this becomes the target of an opponent's spell/ability, counter it unless they pay {2}."
      Opponent uses Doom Blade. Ward {2} triggers. Opponent must pay {2} or Doom Blade is countered.
      If opponent has 2 extra mana: they pay, Doom Blade resolves, creature dies.
    Ward — sacrifice a permanent: opponent must sacrifice a permanent to resolve their spell.
      Strong tax but possible to pay.
    Ward — lose 3 life: opponent must lose 3 life.
  WARD AND COPY/REDIRECT:
    If a spell is copied to also target a ward creature: the ward triggers for each instance that targets it.
    Each targeting event that hits the ward creature triggers it.
  WARD DOES NOT STOP:
    Non-targeting effects (same as hexproof).
    Effects targeting the controller (not the permanent itself).
    The opponent's own targeting that doesn't involve paying — wait: ward is "opponents only" in standard text.
      "Whenever this permanent becomes the target of a spell or ability an OPPONENT controls."
      If you target your own creature (already a corner case unless you have shroud), no ward trigger.

INDESTRUCTIBLE (CR 702.12b):
  "Can't be destroyed. Isn't destroyed by lethal damage. Ignores the SBA for lethal damage."
  Indestructible bypasses:
    • "Destroy target creature" (Doom Blade, Go for the Throat).
    • "Destroy all creatures" (Wrath of God, Damnation).
    • Lethal combat damage (dealt but doesn't cause death).
    • Deathtouch + combat damage (deathtouch makes combat damage "lethal," but indestructible ignores lethal damage SBA).
    • Effects that say "destroy" explicitly.
  INDESTRUCTIBLE DOES NOT STOP:
    • Exile (Path to Exile, Swords to Plowshares).
    • Sacrifice ("sacrifice target creature").
    • -X/-X effects that reduce toughness to 0 (SBA 704.5f: toughness ≤ 0 → to GY, not "destroyed").
      Languish: -4/-4 to all. A 3/3 indestructible → -4/-4 → -1/-1 → toughness ≤ 0 → dies.
      Wait: indestructible ignores "destroyed" SBA (704.5g). But 704.5f (toughness ≤ 0) is separate.
      CR 702.12b: "Permanents with indestructible ignore the state-based action that checks for LETHAL DAMAGE."
      704.5f: "Creature with toughness ≤ 0 → GY." This is a different SBA. NOT covered by indestructible.
      So: -X/-X that brings toughness to 0 kills indestructible creatures.
    • "Exile all creatures" (even if indestructible — exile is not destroy).
    • Counter (a spell can be countered while it's on the stack; indestructible has no stack).
    • Being bounced to hand (not destruction).
    • Enchanting with pacifism-type auras (no destruction).
  DEATHTOUCH + INDESTRUCTIBLE:
    Deathtouch: "any amount of combat damage from this source is considered lethal."
    Indestructible: "isn't destroyed by lethal damage."
    A 1/1 deathtouch vs. 4/4 indestructible blocker:
      1/1 deals 1 combat damage → with deathtouch, this is "lethal damage" → SBA would destroy.
      But 4/4 is indestructible → ignores lethal damage destruction SBA.
      Result: 4/4 indestructible creature SURVIVES the deathtouch combat.
    Indestructible completely negates deathtouch in combat.

PROTECTION FROM ALL THINGS (complete immunity):
  Hexproof + Indestructible: very hard to interact with.
    Can't target → no spells/abilities. Can't destroy → no lethal damage.
    Still killed by: exile, sacrifice, toughness ≤ 0.
  Sigarda, Host of Herons: hexproof + "opponents can't cause you to sacrifice."
    Can't be targeted. Can't be forcibly sacrificed. But can still be exiled or bounced.
  TRUE SAFETY: protection from everything (some equipment/spells grant this temporarily).

COMPARISON TABLE:
  Effect          | Hexproof | Shroud | Ward   | Indestructible
  --------------- | -------- | ------ | ------ | --------------
  Targeted spells | STOPS(opp) | STOPS(all) | TAXES | NO effect
  Targeted abil.  | STOPS(opp) | STOPS(all) | TAXES | NO effect
  "Destroy" eff.  | NO       | NO     | NO     | STOPS
  Lethal damage   | NO       | NO     | NO     | STOPS
  Exile effects   | NO       | NO     | NO     | NO
  Sacrifice eff.  | NO       | NO     | NO     | NO
  -X/-X to 0 T   | NO       | NO     | NO     | NO (different SBA)
  "Each creature" | NO       | NO     | NO     | NO
```

## Definitive Conclusions

- **Hexproof only stops OPPONENT targeting** — "each creature" board wipes, sacrifice effects, and exile still work.
- **Shroud stops ALL targeting** — you can't target your own shroud creature with buffs or equip abilities.
- **Ward is a triggered ability that TAXES targeting** — it doesn't prevent targeting; it punishes it with a cost.
- **Indestructible stops "destroy" and lethal damage death** — exile, sacrifice, and -X/-X to toughness 0 bypass it.
- **Deathtouch + indestructible: the indestructible creature survives** — "lethal damage" doesn't destroy indestructible.
- **-X/-X to 0 toughness kills indestructible creatures** — it's a different SBA (toughness ≤ 0) not covered by indestructible.

## Canonical Example
**Darksteel Colossus vs. Removal Suite:**
Darksteel Colossus ({11}): 11/11 Indestructible. When it would be put into a graveyard from anywhere, reveal and shuffle it into its library instead.

Opponent's removal analysis:
→ Doom Blade ("destroy target non-black creature"): DOESN'T WORK. Colossus is indestructible.
→ Wrath of God ("destroy all creatures"): DOESN'T WORK. Indestructible.
→ Path to Exile ("exile target creature"): WORKS. Indestructible ≠ "can't be exiled."
   Also, Colossus's "shuffle from GY" ability doesn't trigger — it went to exile, not GY.
→ Swords to Plowshares ("exile target creature"): WORKS. Exiles the Colossus.
→ Languish (-4/-4 to all): 11/11 → 7/7. Still alive (7 > 0). Doesn't kill it.
→ Toxic Deluge (pay X life, -X/-X to all): pay 11 life → Colossus is 0/0. Toughness ≤ 0 → SBA.
   CR 704.5f: creature with toughness ≤ 0 → GY. This is NOT the "lethal damage" SBA.
   Indestructible doesn't protect against 704.5f. Darksteel Colossus DIES to Toxic Deluge.
→ Sacrifice effects (Grave Pact, Dictate of Erebos): if forced to sacrifice, no indestructible protection.

The lesson: "indestructible" is not "can't die." Exile and -X/-X effects are reliable removal.

**Example 2 — Ward Tax Decision:**
Your creature: Murktide Regent ({5}{U}{U}: 8/8 Delve, Ward {2}).
Opponent wants to remove it. They have: Doom Blade ({1}{B}) in hand with 3 total mana.
Opponent casts Doom Blade targeting Murktide Regent. Doom Blade goes on stack.
Ward trigger fires: "Whenever Murktide Regent becomes the target of a spell an opponent controls, counter that spell unless they pay {2}."
Ward trigger goes on the stack ABOVE Doom Blade.
Priority: you can respond. Opponent can respond. Both pass.
Ward trigger resolves: "counter Doom Blade unless opponent pays {2}."
Opponent has 3 mana (1 already used for Doom Blade + 2 available). They pay {2}.
Ward is satisfied. Doom Blade is NOT countered. Doom Blade resolves: Murktide Regent is destroyed.
Total cost to opponent: {1}{B} for Doom Blade + {2} for Ward = {3}{B} total. Very expensive removal.

Alternative: if opponent only had 1 mana left after casting Doom Blade (can't pay {2}):
Ward resolves: "counter Doom Blade unless they pay {2}." They can't pay. Doom Blade is COUNTERED.
Murktide Regent survives. Doom Blade is wasted.
Ward doesn't guarantee survival — it taxes. The more expensive the ward cost, the safer your creature.

## Commonly Confused With
- **P305 (Protection — DEBT)** — "Protection from [quality]" provides DEBT coverage: can't be Damaged, Enchanted, Equipped, Blocked, or Targeted by sources of that quality. Much broader than hexproof. A creature with protection from red: can't be targeted by red spells AND red creatures can't block it AND it can't be enchanted by red Auras AND red damage is prevented.
- **P311 (New Object Rule)** — Hexproof, shroud, and ward are permanent characteristics. When a creature's hexproof is removed (via Glaring Spotlight or similar), it becomes targetable. These are continuous effects tracking the current state.
- **P325 (Shield Counters)** — Shield counters prevent damage and "destroy" effects, similar to indestructible but one-time and removable. Indestructible is a keyword that's always on (until removed); shield counters are single-use replacements.
- **P332 (Phasing/Blinking)** — Phasing out makes a permanent "not exist" (can't be targeted, damaged, or destroyed). This combines aspects of hexproof and indestructible temporarily, but through a completely different mechanism.
