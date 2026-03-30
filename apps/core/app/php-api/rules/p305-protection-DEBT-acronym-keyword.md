---
id: p305
name: Protection — The DEBT Acronym (Damage, Enchant/Equip, Block, Target)
category: continuous
cr_refs: [702.16a, 702.16b, 702.16c, 702.16d, 702.16e, 702.16f, 702.16j]
tags: [protection, DEBT, damage-prevention, enchant, equip, block, targeting, protection-from-everything, Emrakul-the-Aeons-Torn, True-Name-Nemesis, Mother-of-Runes, Akroma-Angel-of-Wrath, protection-from-colors]
created: 2026-03-29
examples_count: 2
---

# P305 — Protection — The DEBT Acronym (Damage, Enchant/Equip, Block, Target)

## Abstract
Protection is a static ability that grants four separate protections against the stated quality, summarized by the acronym **DEBT**: the protected permanent can't be **D**amaged by sources with that quality, can't be **E**nchanted/Equipped by Auras or Equipment with that quality, can't be **B**locked by creatures with that quality, and can't be **T**argeted by spells or abilities with that quality. "Protection from everything" applies all four protections to every possible quality. Protection is one of the strongest defensive abilities in Magic — but it does NOT protect against universal non-targeting, non-enchanting effects like Wrath of God.

## The Definitive Rules

**CR 702.16b** (verbatim): *"A permanent or player with protection can't be targeted by spells with the stated quality and can't be targeted by abilities from a source with the stated quality."*

**CR 702.16c** (verbatim): *"A permanent or player with protection can't be enchanted by Auras that have the stated quality. Such Auras attached to the permanent or player with protection will be put into their owners' graveyards as a state-based action."*

**CR 702.16d** (verbatim): *"A permanent with protection can't be equipped by Equipment that have the stated quality or fortified by Fortifications that have the stated quality. Such Equipment or Fortifications become unattached from that permanent as a state-based action, but remain on the battlefield."*

**CR 702.16e** (verbatim): *"Any damage that would be dealt by sources that have the stated quality to a permanent or player with protection is prevented."*

**CR 702.16f** (verbatim): *"Attacking creatures with protection can't be blocked by creatures that have the stated quality."*

**CR 702.16j** (verbatim): *"'Protection from everything' is a variant of the protection ability. A permanent or player with protection from everything has protection from each object regardless of that object's characteristic values. Such a permanent or player can't be targeted by spells or abilities and can't be enchanted by Auras. Such a permanent can't be equipped by Equipment, fortified by Fortifications, or blocked by creatures. All damage that would be dealt to such a permanent or player is prevented."*

## The Pattern

```
THE DEBT ACRONYM:
  Protection from [quality] provides four simultaneous protections:
    D — Damage: all damage from sources with that quality is PREVENTED
    E — Enchant/Equip: can't be enchanted by Auras or equipped by Equipment with that quality
    B — Block: creature can't be blocked by creatures with that quality
    T — Target: can't be targeted by spells or abilities with that quality (from sources with that quality)

  WHAT PROTECTION DOESN'T PROTECT AGAINST:
    Non-targeted, non-quality effects: Wrath of God doesn't target → destroys even protected creatures
    "Each creature" effects: sweepers, Earthquake (deals N damage to "each creature" → does this apply?)
    Wait: Earthquake deals damage — "protection from red" would prevent Earthquake's damage (source is red)
    So: protection from red = immune to Earthquake!
    But: "Sacrifice a creature" (not source-quality dependent) = still happens
    Protection from white doesn't stop Day of Judgment (white sorcery) from destroying your creature?
    Wait: Day of Judgment says "destroy all creatures." It doesn't target → T is satisfied.
    Does it deal damage? No. Does it enchant/equip? No. Does it block? No.
    "Destroy all creatures" is not Damage, Enchant, Block, OR Target.
    Conclusion: Day of Judgment DESTROYS creatures with protection from white.
    Protection doesn't prevent non-damage, non-targeting destruction effects.

  KEY DISTINCTION:
    Protection PREVENTS: damage (D), targeting (T), enchantment (E), blocking (B)
    Protection DOES NOT PREVENT: exile effects, sacrifice effects, -X/-X effects that reduce toughness to 0,
      "each creature" non-damage effects, countering the spell, preventing triggers from firing.

PROTECTION FROM A COLOR (most common):
  "Protection from black" means:
    - Can't be targeted by black spells or abilities from black sources
    - Can't be enchanted by black Auras or equipped by black Equipment
    - Can't be blocked by black creatures
    - Damage from black sources is prevented (even deathtouch from black sources!)

  NOTABLE "PROTECTION FROM" CARDS:
    Mother of Runes ({W}): 1/1. "{T}: Target creature you control gains protection from a color of your
      choice until EOT."
      Universal protection outlet: whatever spell opponent is about to cast, respond with protection.
      Opponent casts Lightning Bolt (red)? Give target protection from red → Bolt is countered (T).
      Opponent casts Murder (black)? Protection from black → Murder is countered.
      Mother of Runes is one of the most powerful 1-drops in Legacy.

    True-Name Nemesis ({1}{U}{U}): 3/1. "Protection from the chosen player."
      "As True-Name Nemesis enters, choose a player. It has protection from that player."
      In 1v1: choose your opponent → True-Name has protection from everything THEY control or own.
      Their spells can't target it. Their creatures can't block it. Their Equipments fall off.
      3/1 unblockable that can't be targeted or damaged by chosen opponent.
      One of the most oppressive creatures in Legacy for 1v1 formats.

    Emrakul, the Aeons Torn ({15}): "Protection from colored spells."
      This is "protection from colored spells" — a protection against spells, not permanents.
      Specifically: can't be targeted by colored spells. Colorless spells or abilities can target it.
      CR 702.16a: quality can be "any characteristic value or information."
      "Colored spells" = spells that are colored. Colorless spells still hit.
      Detention Sphere (white, enchantment): targets → hits the protection?
        Detention Sphere is a spell when cast. It's colored (white). Can't target Emrakul?
        Wait: "protection from colored spells" — Detention Sphere IS a colored spell → can't target.
        But: Detention Sphere says "exile target nonland permanent." Trying to target Emrakul: can't (T).
      Karn Liberated's -3: "Exile target permanent." Karn is colorless → can exile Emrakul!

    Akroma, Angel of Wrath ({5}{W}{W}{W}): 6/6. Flying, First Strike, Vigilance, Trample, Haste.
      "Protection from black and from red."
      Two color protections: no red damage, no black targeting, etc.
      Classic finisher immune to most removal (Murder = black, Lightning Bolt = red).

PROTECTION FROM EVERYTHING:
  "Protection from everything" = protection from all qualities simultaneously
  Can't be targeted, enchanted, equipped, blocked, damaged by ANYTHING
  Not just colors — protection from ALL characteristics.

  CARDS WITH PROTECTION FROM EVERYTHING:
    Teferi's Protection ({2}{W}): "Until your next turn, your life total can't change, and you have
      protection from everything."
      In Commander: cast during opponents' turns. For an entire round, you can't be targeted or damaged.
      All your permanents also phase out? Actually the protection applies to YOU, not your permanents.
      Wait: Teferi's Protection says "all permanents you control phase out" too. Combined effect.
      The protection prevents all damage to you and prevents targeting you.

    Emrakul, the Promised End ({13}): has built-in partial protection.
    Progenitus ({5}{W}{W}{U}{U}{B}{B}{R}{R}{G}{G}): "Protection from everything."
      10/10 trampler that can't be blocked, targeted, damaged, or enchanted.
      "Trample" is relevant: deal excess damage to the player (protection doesn't stop trample damage to players).
      Wait: protection from everything also prevents players from being damaged by it? No:
      The protection is on Progenitus, not the player. Players don't have protection from Progenitus.
      The opponent gets trampled by 10.
      Can't be blocked (B from everything). Deals 10 trample = lethal.

PROTECTION EDGE CASES:
  AURA EQUIP DETACHMENT (CR 702.16c–d):
    If an effect causes an illegal Aura/Equipment to become attached to a protected creature:
      The Aura/Equipment becomes detached as a state-based action.
      Aura → goes to owner's GY. Equipment → falls off but stays on battlefield.

  DEATHTOUCH + PROTECTION:
    Deathtouch: "Any damage is lethal." But protection prevents damage entirely.
    Creature with protection from black vs. a black 1/1 with Deathtouch:
      The black creature deals "damage" → D prevents it. Damage is prevented before deathtouch applies.
      Conclusion: deathtouch from a source with the protected quality = no damage = no death.
      True-Name Nemesis: immune to deathtouch from the chosen player's creatures.

  PROTECTION + COMBAT:
    Protection prevents being blocked by quality creatures (B).
    But: protection doesn't help with being blocked by OTHER creatures.
    "Protection from white" creature: can still be blocked by green creatures.
    "Protection from everything": can't be blocked by ANY creature.

  TRAMPLE + PROTECTION:
    Attacking creature with Trample vs. creature with protection from that color:
    The blocker can't be dealt damage by the source (D prevents it).
    Trample: "excess damage after lethal is assigned carries over."
    But if there IS no damage dealt to the blocker (protection prevents it), there's no lethal damage.
    Wait: trample and protection interact interestingly.
    If you MUST assign lethal damage to a blocker and the damage is prevented: you still must assign it.
    The damage is prevented on delivery, but you assigned it (spent the assignment).
    So: you can assign 0 lethal to the protected blocker (since prevention isn't known at assignment time).
    Actually: CR says you must assign lethal "damage" based on toughness. With damage-prevention from protection,
    you assign it, it gets prevented, but you've "assigned" it already. Excess goes to player.
    The rules say "damage is prevented after it's dealt" — so trample assigns, deals, protection prevents
    the blocker's portion, excess tramples to player.
    Concretely: 5/5 Trample attacks, blocked by 3/3 with protection from attacker's color.
    Attacker must assign 3 damage to the blocker (lethal). 2 trample to player.
    3 damage to blocker → prevented by protection. Blocker survives.
    2 damage to player → goes through (player doesn't have protection).
    Result: blocker survives, player takes 2.
```

## Definitive Conclusions

- **DEBT acronym: Damage, Enchant, Block, Target** — protection provides all four simultaneously.
- **Protection doesn't stop "each" or non-targeting destruction** — Wrath of God kills protected creatures (destroy, not damage/target).
- **Deathtouch + protection from the source: protection wins** — damage is prevented before deathtouch applies.
- **"Protection from everything" blocks all DEBT interactions** — nothing can damage, target, enchant, or block it.
- **Trample still deals excess damage to players past a protected blocker** — blocker's damage is prevented, but trample damage goes to the player.

## Canonical Example
**Mother of Runes Protecting Against Removal:**
Board: Tarmogoyf (4/5) + Mother of Runes (1/1). Opponent controls: nothing relevant.
Opponent casts Path to Exile targeting Tarmogoyf.
Path to Exile is white. It's on the stack targeting Tarmogoyf.
You have priority (APNAP, then passing). Activate Mother of Runes: "{T}: target creature gains protection."
Target: Tarmogoyf. Choose white.
Tarmogoyf now has protection from white.
Path to Exile on the stack: targets Tarmogoyf (now has protection from white).
"Can't be targeted by white spells" → T applies. Path to Exile is a white spell targeting a protected permanent.
Path to Exile's target is now illegal (protection from white = can't be targeted by white).
Path to Exile resolves: target is illegal → it does nothing (spell countered on resolution for illegal target).
Tarmogoyf survives. Protection from white lasts until EOT.
Mother of Runes: taxed for the rest of the turn, but Tarmogoyf is saved.

**Example 2 — True-Name Nemesis in Legacy:**
Board: True-Name Nemesis (3/1, protection from you — the opponent).
Turn: attack with True-Name Nemesis.
Defending player: tries to block with a 4/4 creature.
True-Name Nemesis has protection from defending player → B: can't be blocked by that player's creatures.
Their 4/4: belongs to the defending player → can't block.
Their 0/7 Wall: also their creature → can't block.
Their Maze of Ith (special land): "Untap target attacking creature; prevent all damage done by and to it."
Maze of Ith's ability targets an attacking creature. True-Name has protection from the chosen player.
If True-Name chose that player: Maze of Ith is owned by that player → T: can't target True-Name.
Maze of Ith fizzles.
True-Name Nemesis deals 3 damage unblocked.
After 7 attacks: 21 damage. Opponent dead from one 3-mana creature with no counter ever.
True-Name Nemesis: banned in Commander, powerhouse in Legacy.

## Commonly Confused With
- **P284 (Ward/Hexproof/Shroud)** — Ward adds a tax when targeted (doesn't prevent targeting); hexproof prevents targeting by opponents but not other interactions; protection adds DEBT protections beyond just targeting.
- **P033 (Indestructible)** — Indestructible prevents death from destruction and damage; protection prevents the damage itself from being dealt. Both can stop combat death, but through different mechanisms.
- **P287 (Phasing)** — Phasing temporarily makes the permanent non-existent on the battlefield; protection is a continuous static ability that protects while on the battlefield.
- **P263 (Emrakul's Protection from Colored Spells)** — Emrakul has protection from "colored spells" specifically (a spell characteristic), not from "colors" of permanents; colorless spells/abilities can still interact with it.
