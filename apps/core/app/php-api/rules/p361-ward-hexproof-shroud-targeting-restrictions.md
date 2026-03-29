---
id: p361
name: Ward, Hexproof, and Shroud — Targeting Restrictions and Key Differences
category: stack
cr_refs: [702.11a, 702.11b, 702.11c, 702.11d, 702.18a, 702.21a, 702.21b, 114.9, 601.2c]
tags: [ward, hexproof, shroud, targeting, cant-be-targeted, ward-triggers-on-target, own-spells-hexproof, self-targeting-shroud, Teferi-Mage-of-Zhalfir, Swiftfoot-Boots, Lightning-Greaves, ward-counter-unless-pay, hexproof-vs-shroud, protection-comparison]
created: 2026-03-29
examples_count: 2
---

# P361 — Ward, Hexproof, and Shroud — Targeting Restrictions and Key Differences

## Abstract
**Shroud** (702.18a): "Can't be the target of spells or abilities" — no one can target it, including its controller. **Hexproof** (702.11b): "Can't be the target of spells or abilities **your opponents** control" — you CAN target your own hexproof permanents/players. **Ward [cost]** (702.21a): a **triggered ability** — when an opponent's spell or ability targets it, counter that spell or ability unless the opponent pays [cost]. Ward doesn't prevent targeting; it punishes it unless the cost is paid. Ward triggers on targeting, not on entering the stack. The key distinctions matter for your own buff spells (hexproof allows, shroud prevents) and for interactions with ward (opponents CAN target ward permanents, but they must pay the cost or lose their spell).

## The Definitive Rules

**CR 702.18a** (verbatim): *"Shroud is a static ability. 'Shroud' means 'This permanent or player can't be the target of spells or abilities.'"*

**CR 702.11b** (verbatim): *"'Hexproof' on a permanent means 'This permanent can't be the target of spells or abilities your opponents control.'"*

**CR 702.11c** (verbatim): *"'Hexproof' on a player means 'You can't be the target of spells or abilities your opponents control.'"*

**CR 702.21a** (verbatim): *"Ward is a triggered ability. Ward [cost] means 'Whenever this permanent becomes the target of a spell or ability an opponent controls, counter that spell or ability unless that player pays [cost].'"*

**CR 702.11d** (verbatim): *"'Hexproof from [quality]' is a variant of the hexproof ability. 'Hexproof from [quality]' on a permanent means 'This permanent can't be the target of [quality] spells your opponents control or abilities your opponents control from [quality] sources.'"*

## The Pattern

```
THE THREE TARGETING-PROTECTION ABILITIES — COMPARISON:

  SHROUD (702.18a):
    "This permanent can't be the target of spells or abilities."
    ALL spells and abilities are prevented from targeting.
    Includes YOUR OWN spells and abilities.
    Example: Lightning Greaves ({2}): "Equipped creature has shroud and haste."
      If your creature has shroud (via Lightning Greaves): YOU can't target it with Giant Growth.
      Your opponent can't target it with Doom Blade.
      NO ONE can target it.
    NOTABLE: Shroud doesn't prevent non-targeting effects:
      "Destroy all creatures" = no target. Wrath of God: shrouded creatures die.
      "Each creature gets -1/-1" = no targeting. Shrouded creatures get -1/-1.
      Only spells/abilities that use "target [the shrouded permanent]" are prevented.
    DOWNSIDE: Can't target your own shroud creature to buff/equip/enchant it.
      Can't equip another Equipment to it (equip is "target creature you control").
      Can't cast Giant Growth on it ("target creature").
      Can't cast Counterspell to "target" ... wait, Counterspell targets the SPELL not the creature.
      Shrouded creatures can still be helped by non-targeting effects.

  HEXPROOF (702.11b):
    "Can't be the target of spells or abilities YOUR OPPONENTS control."
    OPPONENTS can't target it. YOU CAN target your own hexproof permanent.
    Example: Swiftfoot Boots ({2}): "Equipped creature has hexproof and haste."
      YOU can target the equipped creature with Giant Growth, Auras, Equip abilities.
      OPPONENT can't target it with Doom Blade.
    UPSIDE vs. SHROUD: You can still buff/enhance your hexproof creature.
    Player hexproof (702.11c): "You can't be the target of spells or abilities your opponents control."
      Your own self-targeting spells ("target player loses 1 life" = odd but you can choose yourself): fine.
      Opponent's "target player draws a card": can't target hexproof player. Even beneficial effects.
  HEXPROOF FROM [QUALITY] (702.11d):
    Partial hexproof: only hexproof against [quality] effects from opponents.
    Example: Hexproof from blue: opponents can't target with blue spells/abilities.
    Opponents CAN target with non-blue spells/abilities.
    Your own spells of any color can target (opponent restriction only).

  WARD [COST] (702.21a):
    TRIGGERED ABILITY — not a static restriction.
    Ward doesn't prevent targeting. The spell can legally be cast targeting the ward permanent.
    WHEN the targeting occurs: ward triggers.
    The trigger goes on the stack ABOVE the targeting spell (117.5, triggered abilities go on stack).
    Ward trigger resolves: "counter that spell unless the opponent pays [cost]."
    If opponent pays [cost]: their spell stays on the stack, continues to resolve.
    If opponent doesn't pay: spell is countered. Goes to GY (or wherever) without resolving.
  WARD AND TARGETING SEQUENCE:
    Opponent casts Lightning Bolt targeting your creature with Ward {2}.
    Lightning Bolt goes on stack.
    Triggers check: ward triggered ability triggers ("whenever this becomes target of opponent's spell").
    Ward trigger goes on stack ABOVE Lightning Bolt.
    Ward trigger resolves: "counter Lightning Bolt unless opponent pays {2}."
    Opponent chooses:
      Pay {2}: Lightning Bolt stays on stack. When it resolves: 3 damage to creature.
      Don't pay: Lightning Bolt countered. Creature unharmed.
  WARD WITH X COST (702.21b):
    "Ward {X} where X is equal to this creature's power" (hypothetical).
    X is determined when the ward TRIGGER RESOLVES, not when it triggers.
    Important if the creature's stats change between triggering and resolving.
  WARD DOESN'T HELP AGAINST NON-TARGETING EFFECTS:
    Same limitation as hexproof/shroud: non-targeting effects bypass ward.
    "Destroy all creatures" doesn't target. Ward doesn't trigger. Creature dies.
    Opponent casts "each creature gets -1/-1": no targeting. Ward doesn't trigger.

KEY DIFFERENCES:
  SHROUD vs. HEXPROOF:
    Shroud: no one can target. You CAN'T buff/enchant your own shroud creature.
    Hexproof: opponents can't target. YOU can buff/enchant your own hexproof creature.
    In practice: hexproof is almost universally better than shroud (same protection, plus you can help your creature).
    Shroud is mostly seen on old cards (pre-Magic 2012, when hexproof was introduced as shroud's replacement).

  HEXPROOF vs. WARD:
    Hexproof: hard stop. Opponents CANNOT target.
    Ward: soft stop. Opponents CAN target, but must pay the ward cost or the spell is countered.
    Ward is worse than hexproof for preventing targeting (opponents can still successfully target by paying).
    Ward is better than hexproof as a "tax": forces opponents to pay extra resources even if they do target.
    Ward can be multiple times more "expensive" than the spell itself.
    Example: Ward {4} on a 2/2. Opponent needs to pay {4} on top of whatever their removal costs.
      If they're trying to Lightning Bolt for {R}: pay {R} + {4} = {R}{4} total to kill a 2/2 efficiently? Usually not worth it.

  SHROUD vs. WARD:
    Shroud: hard stop on targeting.
    Ward: soft stop. The spell can target; opponent just needs to pay.
    Shroud is better at preventing targeting.
    Ward is better for "taxing" opponents and generating value from their attempts.

STACKING THESE ABILITIES:
  Can a permanent have both hexproof and ward?
    Yes. Example: a creature with "hexproof and ward {2}."
    Hexproof prevents opponents from targeting. Since opponents can't target it:
      Ward's trigger never fires (no targeting to trigger on).
    The ward ability is redundant if the creature already has hexproof from all opponents.
    But hexproof from a specific quality + ward: still useful.
    "Hexproof from blue, ward {2}": blue spells can't target. Non-blue spells from opponents still can target,
      and then ward taxes them {2}.

EFFECTS THAT BYPASS ALL THREE:
  "Choose a creature" vs. "target a creature": "choose" is NOT targeting.
    Rogue's Gloves: "whenever equipped creature deals combat damage to a player, you may search
      your library for a card with the same name as a creature your opponent controls, reveal it..."
    That's not targeting. Hexproof, shroud, ward: irrelevant.
  "Each creature": global effect. No targeting. All three ignored.
  "Non-targeting removal": Wrath of God, exile-all effects. All three irrelevant.
  Toxic/Poison from combat damage: damage in combat isn't a targeted spell/ability. Hexproof/shroud/ward
    don't prevent combat damage.

EFFECTS THAT SAY "AS THOUGH [X] DIDN'T HAVE HEXPROOF/SHROUD":
  Some cards specifically say "target a creature as though it didn't have hexproof" or similar.
  These override the protection explicitly.
  Example: "You may choose creatures with hexproof as targets."
    This allows targeting despite hexproof (but not shroud — shroud says "can't be target of any").
```

## Definitive Conclusions

- **Shroud prevents ALL targeting** — even your own spells; you can't equip, enchant, or buff a shrouded creature with targeted spells.
- **Hexproof prevents only OPPONENT targeting** — you can freely target your own hexproof permanents with your spells and abilities; opponents cannot target it.
- **Ward is a triggered ability, not a targeting prevention** — opponents CAN target ward permanents; the ward trigger fires and counters their spell unless they pay the cost.
- **Non-targeting effects bypass all three** — board wipes, global -X/-X, combat damage: none are "targeting" and none are affected by shroud/hexproof/ward.
- **Hexproof is universally better than shroud for your own creatures** — same protection from opponents, but you retain the ability to enhance your own creatures.
- **Ward with X means X is evaluated at trigger resolution** — not when triggered; value changes between targeting and resolution matter.

## Canonical Example
**Swiftfoot Boots (Hexproof) vs. Lightning Greaves (Shroud):**
You equip Swiftfoot Boots ({2}, equip {1}) to your 2/2. Creature gains hexproof and haste.
Opponent casts Doom Blade targeting your creature: ILLEGAL. Your creature has hexproof (opponent's targeting ability). Doom Blade can't target it. Opponent must cast it on a different creature.
You cast Giant Growth targeting your own creature (+3/+3): LEGAL. You're targeting YOUR OWN hexproof creature. Hexproof only stops OPPONENT targeting. Your creature is now 5/5.

If instead you had equipped Lightning Greaves ({2}, equip {0}) giving shroud and haste:
Opponent casts Doom Blade: also ILLEGAL (shroud stops all targeting, including opponents').
You cast Giant Growth targeting your own creature: ALSO ILLEGAL. Shroud stops ALL targeting, including YOUR OWN.
You can't buff your shrouded creature with targeted spells.
But: you can still equip OTHER Equipment to the creature (equip is a targeted ability)? NO. Equip says "target creature you control." Shroud prevents targeting. You CAN'T equip Lightning Greaves to the creature (to move it), or equip another Equipment.
WORKAROUND: Move Lightning Greaves to another creature first, then your original creature loses shroud, then equip the new Equipment.

**Example 2 — Ward {2} on a Modern Staple:**
Opponent controls Ledger Shredder ({1}{U}): 2/3 with ward {2} and a looting trigger.
You want to destroy it. You cast Lightning Bolt ({R}): "Deal 3 damage to any target."
Lightning Bolt can TARGET the creature (ward doesn't prevent targeting).
Lightning Bolt is cast targeting Ledger Shredder. Goes on the stack.
Ward triggers: "whenever this permanent becomes the target of a spell an opponent controls,
  counter that spell unless that player pays {2}."
Ward trigger goes on stack above Lightning Bolt.
Ward trigger resolves first: "counter Lightning Bolt unless you pay {2}."
You choose:
  Don't pay {2}: Lightning Bolt is countered. Ledger Shredder is safe. You spent {R} for nothing.
  Pay {2}: Lightning Bolt stays. Total paid: {R}+{2} = {3} to deal 3 damage. Ledger Shredder has 3 toughness... wait.
    Ledger Shredder: 2/3 toughness. 3 damage ≥ 3 toughness. It dies (SBA). Cost you {3} to Lightning Bolt a 2/3.
    Normal Lightning Bolt on a 2/3: 3 damage, 3 toughness = dies. Normally costs {R}.
    With ward {2}: effectively costs {R}+{2} = {3} to kill it. Taxed by 2 mana.

At 2 mana: some opponents will pay the ward cost. But for small removal spells, it makes them inefficient.
Ward scales: ward {4} on a 3-drop would cost {7} total to Lightning Bolt. Very rarely worth it.

## Commonly Confused With
- **P353 (Protection)** — Protection (DEBT) also prevents targeting (T) but adds damage prevention (D), enchant/equip restriction (E), and blocking restriction (B). Hexproof only prevents targeting; protection also prevents damage and attachment. Protection is stronger than hexproof for targeting AND damage prevention.
- **P006 (Intervening "If" Clause)** — Ward's trigger has no intervening "if" clause; it triggers whenever the targeting occurs and always fires. The "unless pays" is part of the trigger's effect, not an "if" condition. P006 covers double-check patterns; ward is a simple trigger with a choice in its effect.
- **P008 ("Can't" Restrictions)** — Shroud and hexproof are "can't be targeted" restrictions. These are absolute prohibitions (P008). Ward is NOT a "can't" — it allows targeting but taxes it. Important distinction: hexproof prevents the spell from even being legally cast (illegal target); ward allows the spell to be cast legally but then counters it unless cost paid.
- **P007 (Response Windows)** — Ward triggers fire when a spell targets the ward permanent. You get a window to respond to the ward trigger before the original spell resolves. If you want to save the targeting spell: pay the ward cost when the trigger resolves. If you want to use a different response: act while the trigger is on the stack.
