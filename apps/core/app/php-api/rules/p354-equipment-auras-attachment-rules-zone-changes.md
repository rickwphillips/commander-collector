---
id: p354
name: Equipment and Auras — Attachment Rules, Equip Costs, Zone Changes, and Legality
category: zones
cr_refs: [301.5, 301.5a, 301.5b, 301.5c, 301.5d, 303.4, 303.4a, 303.4c, 303.4d, 303.4e, 303.4f, 303.4g, 702.6a, 702.6c, 702.6d, 704.5b, 704.5n]
tags: [equipment, aura, equip, attach, enchant, legality-aura, equip-sorcery-speed, equipment-ownership, aura-ownership, zone-change-attachment, blink-equipment, Swords-to-Plowshares-Aura, Umbra-mystic, totem-armor, Umbra-aura, Pacifism, Colossus-Hammer, Sigarda-equipment, Rancor-return, O-ring, controller-vs-owner]
created: 2026-03-29
examples_count: 2
---

# P354 — Equipment and Auras — Attachment Rules, Equip Costs, Zone Changes, and Legality

## Abstract
**Equipment** (301.5) are artifact permanents that attach to creatures you control via the **equip** activated ability (702.6a), which can only be activated at sorcery speed. Equipment's controller is separate from the equipped creature's controller (301.5d). **Auras** (303.4) are enchantments that enter the battlefield attached to a target defined by their **enchant** ability; casting an Aura requires targeting. If an Aura's target becomes illegal after it resolves, the Aura stays attached — but if the enchanted object stops existing or becomes an illegal permanent, the Aura is put into its owner's GY as an SBA (303.4c). Crucially: when a creature leaves the battlefield, **Equipment** remains (it becomes unattached, stays on battlefield); **Auras** go to the GY with their target (303.4c). Zone changes and blinking strip both kinds of attachments — the creature returns as a new object with nothing attached.

## The Definitive Rules

**CR 702.6a** (verbatim): *"Equip is an activated ability of Equipment cards. 'Equip [cost]' means '[Cost]: Attach this permanent to target creature you control. Activate only as a sorcery.'"*

**CR 301.5b** (verbatim): *"Equipment spells are cast like other artifact spells. Equipment enter the battlefield like other artifacts. They don't enter the battlefield attached to a creature. The equip keyword ability attaches the Equipment to a creature you control. Control of the creature matters only when the equip ability is activated and when it resolves. Spells and other abilities may also attach an Equipment to a creature. If an effect attempts to attach an Equipment to an object that can't be equipped by it, the Equipment doesn't move."*

**CR 301.5c** (verbatim): *"An Equipment that's also a creature can't equip a creature unless that Equipment has reconfigure. An Equipment that loses the subtype 'Equipment' can't equip a creature. An Equipment can't equip itself. An Equipment that equips an illegal or nonexistent permanent becomes unattached from that permanent but remains on the battlefield. (This is a state-based action. See rule 704.) An Equipment can't equip more than one creature. If a spell or ability would cause an Equipment to equip more than one creature, the Equipment's controller chooses which creature it equips."*

**CR 301.5d** (verbatim): *"An Equipment's controller is separate from the equipped creature's controller; the two need not be the same. Changing control of the creature doesn't change control of the Equipment, and vice versa. Only the Equipment's controller can activate its abilities. However, if the Equipment grants an ability to the equipped creature (with 'gains' or 'has'), the equipped creature's controller is the only one who can activate that ability."*

**CR 303.4c** (verbatim): *"If an Aura is enchanting an illegal object or player as defined by its enchant ability and other applicable effects, the object it was attached to no longer exists, or the player it was attached to has left the game, the Aura is put into its owner's graveyard. (This is a state-based action. See rule 704.)"*

**CR 303.4f** (verbatim): *"If an Aura is entering the battlefield under a player's control by any means other than by resolving as an Aura spell, and the effect putting it onto the battlefield doesn't specify the object or player the Aura will enchant, that player chooses what it will enchant as the Aura enters the battlefield. The player must choose a legal object or player according to the Aura's enchant ability and any other applicable effects."*

**CR 303.4g** (verbatim): *"If an Aura is entering the battlefield and there is no legal object or player for it to enchant, the Aura remains in its current zone, unless that zone is the stack. In that case, the Aura is put into its owner's graveyard instead of entering the battlefield."*

## The Pattern

```
EQUIP — ACTIVATED ABILITY AT SORCERY SPEED (702.6a):
  "Equip [cost]" = "[Cost]: Attach this to target creature you control."
  SORCERY SPEED means:
    - Only activate during YOUR main phase when the stack is empty.
    - Can't equip in response to something.
    - Can't equip during combat.
    - Can't equip on opponent's turn.
  EXCEPTION: Some cards say "Equip — {cost}. Activate any time you could cast an instant."
    That specific phrasing grants instant-speed equipping.
    The standard equip ability is sorcery-speed by default (702.6a: "activate only as a sorcery").
  TARGET MUST BE YOUR CREATURE:
    Standard equip: "target creature you control."
    You can't equip an opponent's creature with a standard equip ability.
    Some Equipment have "Equip opponent's creature" — that's a different, named ability.
  EQUIP CREATURE vs. EQUIP PLANESWALKER (702.6e):
    "Equip planeswalker" variant attaches the Equipment to a planeswalker you control.
    Standard equip can't attach to planeswalkers unless the card says otherwise.
  MULTIPLE EQUIP ABILITIES (702.6d):
    If an Equipment has multiple equip abilities (different costs, different restrictions):
      You can use any of them.
      Each is a separate activated ability with its own cost.

EQUIPMENT MOVEMENT:
  Equipment enters battlefield UNATTACHED (301.5b).
  To attach: activate equip ability (or use a spell/effect that attaches).
  WHAT HAPPENS WHEN EQUIPPED CREATURE LEAVES BATTLEFIELD:
    Equipment becomes unattached. STAYS ON BATTLEFIELD.
    The Equipment is still a permanent — it just floats free.
    It can be equipped to another creature next turn.
    Example: Sword of Fire and Ice equipped to your 2/2. Opponent destroys the 2/2.
      Sword stays on your battlefield. Unattached.
      Next main phase: equip to another creature for the equip cost.
  WHAT HAPPENS WHEN CREATURE BLINKS OR RETURNS:
    "Blink" = exile and return (like Swords to Plowshares except that exiles permanently).
    Flicker of Fate: "Exile target permanent, then return it to battlefield under its owner's control."
    The creature returns as a NEW OBJECT (400.7). New object = nothing attached.
    Equipment that was attached: becomes unattached, remains on battlefield.
    The returned creature has no Equipment. The Equipment is floating.
    This is the same for blinking the creature with a ETB ability — the creature comes back clean.
  CHANGING CONTROL OF CREATURE (301.5d):
    If an opponent steals your creature (Control Magic):
      Equipment STAYS under YOUR control (Equipment controller ≠ creature controller).
      But the Equipment's abilities that affect "equipped creature" still apply to the stolen creature.
      You control the Equipment and can activate its equip ability.
      But to re-equip it to a different creature: target creature YOU control.
      The stolen creature is now opponent's creature — you can't equip it with standard equip.
      Wait: you can't target your own creature (the stolen one is no longer yours).
      If the Equipment is attached to an opponent's creature (because they stole it):
        The Equipment stays attached but you still control the Equipment.
        You can't re-equip the Equipment to a different creature unless you target one you control.
        If the stolen creature leaves battlefield: Equipment unattaches, stays under your control.
  EQUIPMENT THAT CAN'T EQUIP (301.5c):
    Equipment that also is a creature: can't equip unless it has reconfigure.
    Equipment that lost "Equipment" subtype: can't equip. (Blood Moon turns nonbasic lands into
      Mountains but doesn't affect artifact subtypes. However, type-changing effects can.)
    Equipment can't equip ITSELF.

AURAS — CASTING AND TARGETING (303.4):
  CASTING AN AURA:
    Casting requires targeting a legal object/player per the enchant ability.
    "Enchant creature" = target any creature.
    "Enchant creature you control" = target creature you control.
    "Enchant black creature" = target creature that's black.
  THE TARGET MUST BE LEGAL WHEN THE AURA RESOLVES:
    If the target becomes illegal before the Aura resolves (creature gained protection, was bounced):
      The Aura spell fizzles (no legal target). Goes to GY without entering battlefield. (601.2c)
    "Shroud" and "hexproof" prevent TARGETING — Auras targeting a hexproof creature: illegal.
    Wait: hexproof prevents being targeted by opponents. You CAN target your own hexproof creature.
  AURA STAYS ATTACHED AFTER RESOLUTION EVEN IF CONDITION CHANGES:
    Once an Aura is on the battlefield attached to a creature, it stays unless:
      (a) The enchanted object ceases to exist (303.4c).
      (b) The Aura becomes illegal due to a continuous effect (protection, type changes).
      (c) The Aura is moved by a spell/ability.
    Example: Pacifism ({1}{W}): "Enchant creature. Enchanted creature can't attack or block."
      Enchant a green creature. Then that creature becomes colorless via an effect.
      Pacifism is an enchantment — it's white. If the creature gains "protection from white":
        Pacifism becomes an illegal attachment. SBA: Pacifism put into owner's GY.
      If the creature just changes color but doesn't gain protection: Pacifism stays attached.
  AURA FATE WHEN CREATURE LEAVES BATTLEFIELD (303.4c):
    Creature is destroyed, exiled, bounced, or sacrificed → creature goes to GY/exile/hand.
    The creature "no longer exists" on the battlefield.
    303.4c: Aura put into its owner's GY.
    IMPORTANT: Aura goes to GY. Equipment stays on battlefield.
  AURA WITHOUT TARGET (303.4g):
    If an Aura would enter the battlefield (via non-cast means like Replenish) and there's no legal
      enchant target: the Aura stays in whatever zone it was in (not in exile/library/GY if already there).
    If on the stack: goes to GY instead (303.4g: from stack → GY if no legal target).
  AURA RETURNING TO BATTLEFIELD (303.4f):
    If an Aura returns from GY to battlefield via Replenish or similar:
      Not a cast — no targeting. Player chooses what to enchant as it enters.
      Must choose a legal target per enchant ability.
      This is how Rancor ({G}) works its engine:
        Rancor: "Enchant creature. Enchanted creature gets +2/+0 and trample.
          When Rancor is put into a graveyard from the battlefield, return Rancor to its owner's hand."
        When the enchanted creature dies: Rancor goes to GY → Rancor triggers → returns to hand.
        On your next main phase: recast Rancor for {G} targeting any creature. Infinite reuse.

CONTROLLER DISTINCTIONS:
  EQUIPMENT: Equipment controller ≠ equipped creature controller (301.5d).
    Example: You equip Colossus Hammer ({1}) to your creature. Opponent steals your creature.
      Colossus Hammer: still under your control. But attached to opponent's creature.
      Colossus Hammer: "Equip {8}" — too expensive to re-equip. It stays on opponent's creature.
      The opponent benefits from the +10/+10 bonus from your Equipment on their creature.
      You can't voluntarily unattach it without a spell or effect.
      If opponent's creature dies: Colossus Hammer returns to your control unattached.
  AURA: Aura controller ≠ enchanted object controller (303.4e).
    Example: You enchant opponent's creature with Pacifism (you cast it).
      Pacifism is under YOUR control, enchanting their creature.
      "When Pacifism is removed, you draw a card" (hypothetical) → your effect.
      Opponent doesn't control Pacifism and can't activate its abilities (if any).

TOTEM ARMOR (special Aura rule):
  Some Auras have "totem armor": "If enchanted creature would be destroyed, instead remove all
    damage from it and destroy this Aura."
  This is a replacement effect. "Destroy creature" is replaced with "destroy this Aura."
  The creature SURVIVES. The Aura is sacrificed in the creature's place.
  Can't prevent exile (same as regeneration — it's a destruction-replacement, not exile-prevention).
  Can't prevent toughness-0 death (same as regeneration).
  Can prevent Wrath of God (if totem armor Aura present): Wrath says "destroy all creatures."
    Totem armor replaces "destroy creature" with "destroy this Aura."
    The creature survives (but the Aura is gone).

BLINKING EQUIPMENT vs. BLINKING THE CREATURE:
  Blinking the CREATURE (Flickerwisp targeting your creature):
    Creature leaves (Equipment becomes unattached, Equipment stays on battlefield) → creature returns.
    Returned creature: no Equipment attached. Equipment is floating free.
    Net effect: stripping Equipment from a creature, then getting creature back.
  Blinking the EQUIPMENT itself:
    Equipment leaves → goes to exile → returns to battlefield UNATTACHED.
    No change for the creature (it never had the Equipment when it returned).
    Useful to reset Equipment with "enters with counters" or activation-based effects.
```

## Definitive Conclusions

- **Equip is a sorcery-speed activated ability** — can't be activated in response to things, during combat, or on opponent's turn unless the card specifies otherwise.
- **Equipment stays on battlefield when the equipped creature leaves** — it becomes unattached and can be equipped to another creature; it does NOT go to the GY with the creature.
- **Auras go to the GY when the enchanted object ceases to exist** — creatures dying, being exiled, bouncing: all cause attached Auras to go to the GY.
- **Equipment and Aura controllers are separate from the attached object's controller** — stealing a creature doesn't steal the Equipment; you control the Equipment but can't re-equip opponents' creatures with standard equip.
- **Blinking a creature strips all attached Equipment and Auras** — the creature returns as a new object; Equipment floats, Auras go to GY (the enchanted object ceased to exist during exile).
- **Auras returning via non-cast effects (Replenish) choose new targets** — no targeting spell; controller chooses what to enchant as it enters the battlefield.
- **Totem armor Auras replace creature destruction with destroying the Aura** — the creature survives; still susceptible to exile and toughness-0.

## Canonical Example
**Sword of Feast and Famine — Equipment Control Interaction:**
You control a 2/2 creature equipped with Sword of Feast and Famine ({3}: equip {2}). Sword grants +2/+2 and protection from black and green, plus "when equipped creature deals combat damage to a player, untap all lands you control and opponent discards a card."

Opponent casts Control Magic ({3}{U}{U}): "Enchant creature you control... Actually: enchant creature. You control enchanted creature."
Your creature is stolen. WHAT HAPPENS TO THE SWORD?
  Sword controller = YOU (you equipped it). Creature controller = OPPONENT (via Control Magic).
  Sword remains attached to the stolen creature.
  Opponent's creature now has +2/+2 and protection from black and green (from your Sword).
  If opponent attacks you with your Sword-equipped creature:
    It deals combat damage. Sword triggers: "when equipped creature deals combat damage to a player..."
    Who controls the trigger? The Sword's CONTROLLER (you). The trigger fires, but... wait.
    Actually: rule 301.5d: "if the Equipment grants an ability to the equipped creature (with 'gains' or 'has'), the equipped creature's controller is the only one who can activate that ability."
    The Sword doesn't give the creature an activated ability — it has a triggered ability.
    Triggered ability: "when equipped creature deals combat damage" — this triggered ability's controller is the Sword's controller (YOU).
    So: YOUR Sword triggers. YOU get to untap your lands and opponent discards a card.
    Even though they stole your creature, the triggered ability still benefits you.
  To re-equip: You have equip {2}. Can you re-equip to a different creature?
    Standard equip: "attach to target creature YOU control."
    The stolen creature is now opponent's. You can't target it with equip.
    If you have another creature: you CAN equip the Sword to your own creature (pay {2}).
    The Sword moves from their creature to yours.

When opponent's creature (with the Sword) leaves battlefield:
  Sword becomes unattached. Returns to your control on the battlefield.
  Control Magic goes to GY (enchanted creature no longer exists — it's gone).

**Example 2 — Rancor Recursion and Aura Zone Rules:**
You control a 2/2 bear with Rancor ({G}) attached. It's now a 4/2 with trample.
Opponent attacks with a 5/5. You block with your 4/2 (trample has no effect on blocking).
4/2 takes 5 damage (≥ 2 toughness) → destroyed. Goes to GY.
Rancor: "When Rancor is put into a graveyard from the battlefield, return it to its owner's hand."
  WAIT: Rancor goes to GY when the creature dies (303.4c: Aura goes to owner's GY).
  Then Rancor triggers: "when Rancor is put into a GY FROM THE BATTLEFIELD" → YES, that just happened.
  Rancor returns to your hand.
  Next turn: cast Rancor for {G} on any creature. It's effectively reusable.
  Note: Rancor returns to your HAND, not the battlefield. You must CAST it again.
  If it went directly to battlefield: you'd need to choose a new target (303.4f).
  But Rancor returns to hand → cast it like normal (with targeting).

Compare with Pacifism ({1}{W}): "Enchant creature you control. Enchanted creature can't attack or block."
You cast it on your opponent's creature. The creature is destroyed.
Pacifism: no "return to hand" trigger. Just goes to GY.
Stays in GY. You need Replenish or another effect to return it.
If you DO Replenish (return all Auras from your GY to battlefield):
  Pacifism needs a target (legal enchant target: "creature" — any creature).
  You choose: enchant any creature on the battlefield (legal per "enchant creature").
  Pacifism returns to the battlefield enchanting the chosen creature.

## Commonly Confused With
- **P353 (Protection)** — Protection from a color causes Auras of that color to fall off as an SBA (702.16c). This is a protection-specific rule, not a general "Auras fall off when targeted" rule. The SBA happens because the attached Aura is now illegal per the enchant ability's criteria. P353 covers what protection does; P354 covers when Auras become illegal and go to GY.
- **P003 (Zone Change — New Object Identity)** — When a creature leaves the battlefield (exile, GY), it becomes a new object when it returns. Equipment was attached to the OLD object; it's not attached to the NEW object. This is why blinking a creature strips its Equipment. P003 establishes the rule; P354 applies it to attachments.
- **P332 (Phasing)** — Phasing doesn't cause a zone change. If an equipped creature phases out, the Equipment also phases out (with it) and phases back in still attached. This is different from blinking: phasing preserves attachment relationships because the permanent hasn't "left" in the zone-change sense.
- **P342 (Turn Structure)** — Equip can only be activated at sorcery speed (main phase, stack empty). This timing restriction connects to the turn structure and priority rules in P342.
