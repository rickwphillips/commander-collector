---
id: p394
name: Renown, Awaken, and Devoid — One-Time Growth, Land Animation, and Colorless Override
category: continuous
cr_refs: [702.112a, 702.112b, 702.112c, 702.113a, 702.113b, 702.114a, 604.3, 604.3a]
tags: [renown, awaken, devoid, renowned-designation, combat-damage-counter, one-time-trigger, land-becomes-creature, alternative-cost, colorless-despite-colored-symbols, CDA-characteristic-defining-ability, Battle-for-Zendikar, Magic-Origins, Knight-of-the-White-Orchid, Kytheon-Hero-of-Akros, Retreat-to-Coralhelm, Planar-Outburst, Grip-of-Desolation, Ruination-Guide, Forerunner-of-Slaughter, land-creature-still-land]
created: 2026-03-29
examples_count: 2
---

# P394 — Renown, Awaken, and Devoid — One-Time Growth, Land Animation, and Colorless Override

## Abstract
**Renown N** (702.112) is a triggered ability: when this creature deals combat damage to a player, if it isn't already renowned, it gets N +1/+1 counters and gains the "renowned" designation. Renowned is not a copiable value or ability — it's a marker that tracks whether the creature has already triggered renown. Once renowned, the trigger never fires again (the intervening-if clause checks "if it isn't renowned"). **Awaken N** (702.113) is an alternative cost mechanic on instants/sorceries: pay the awaken cost instead of the normal cost, and an additional effect targets a land you control — that land gets N +1/+1 counters and becomes a 0/0 Elemental creature with haste (while remaining a land). **Devoid** (702.114) is a characteristic-defining ability (CDA): "this object is colorless." It overrides what the mana cost's color symbols would suggest — a card with {U}{R} in its cost but devoid is colorless, not blue-red. As a CDA (604.3), devoid functions in all zones including outside the game.

## The Definitive Rules

**CR 702.112a** (verbatim): *"Renown is a triggered ability. 'Renown N' means 'When this creature deals combat damage to a player, if it isn't renowned, put N +1/+1 counters on it and it becomes renowned.'"*

**CR 702.112b** (verbatim): *"Renowned is a designation that has no rules meaning other than to act as a marker that the renown ability and other spells and abilities can identify. Only permanents can be or become renowned. Once a permanent becomes renowned, it stays renowned until it leaves the battlefield. Renowned is neither an ability nor part of the permanent's copiable values."*

**CR 702.112c** (verbatim): *"If a creature has multiple instances of renown, each triggers separately. The first such ability to resolve will cause the creature to become renowned, and subsequent abilities will have no effect. (See rule 603.4)"*

**CR 702.113a** (verbatim): *"Awaken appears on some instants and sorceries. It represents two abilities: a static ability that functions while the spell with awaken is on the stack and a spell ability. 'Awaken N—[cost]' means 'You may pay [cost] rather than pay this spell's mana cost as you cast this spell' and 'If this spell's awaken cost was paid, put N +1/+1 counters on target land you control. That land becomes a 0/0 Elemental creature with haste. It's still a land.' Casting a spell using its awaken ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.113b** (verbatim): *"The controller of a spell with awaken chooses the target of the awaken spell ability only if that player chose to pay the spell's awaken cost. Otherwise the spell is cast as if it didn't have that target."*

**CR 702.114a** (verbatim): *"Devoid is a characteristic-defining ability. 'Devoid' means 'This object is colorless.' This ability functions everywhere, even outside the game. See rule 604.3."*

**CR 604.3** (verbatim): *"Some static abilities are characteristic-defining abilities. A characteristic-defining ability conveys information about an object's characteristics that would normally be found elsewhere on that object... Characteristic-defining abilities function in all zones. They also function outside the game and before the game begins."*

**CR 604.3a** (verbatim): *"A static ability is a characteristic-defining ability if it meets the following criteria: (1) It defines an object's colors, subtypes, power, or toughness; (2) it is printed on the card it affects...; (3) it does not directly affect the characteristics of any other objects; (4) it is not an ability that an object grants to itself; and (5) it does not set the values of such characteristics only if certain conditions are met."*

## The Pattern

```
RENOWN (702.112):
  WHAT IT IS:
    Triggered ability. Condition (intervening-if, P006 pattern):
      "When this creature deals combat damage to a player, IF it isn't renowned..."
    If the condition is met: put N +1/+1 counters on it, and it becomes renowned.
  THE RENOWNED DESIGNATION (702.112b):
    Renowned is a marker, not an ability. Not copiable. Not a counter.
    "Only permanents can be or become renowned."
    "Once a permanent becomes renowned, it stays renowned until it leaves the battlefield."
    CRITICAL: if a renowned creature leaves and re-enters the battlefield:
      It's a new object (P003: zone change). NOT renowned anymore.
      Re-entering resets the renowned designation: can trigger renown again.
    Copying a renowned creature (via Clone): the copy is NOT renowned (702.112b: not copiable).
      The clone can deal combat damage and become renowned (first time it hits a player).
  MULTIPLE RENOWN INSTANCES (702.112c):
    Each triggers separately. BUT: the intervening-if condition at RESOLUTION says "if it isn't
      renowned." After the first trigger resolves: the creature IS renowned.
    The second trigger: checks at resolution — is it renowned? YES → no effect (fizzles).
    Result: even with multiple renown instances, only ONE renown fires effectively.
    (The first to resolve makes the creature renowned; subsequent ones fizzle.)
  RENOWN TIMING:
    "When this creature deals combat damage to a player" — fires after damage step (513).
    Triggers at the moment of damage. Resolves during the combat damage step cleanup (after combat).
    Actually: triggered abilities go on the stack when priority is next received.
    After combat damage is dealt: priority goes to active player. Renown trigger is on the stack.
    Resolves: counters placed, becomes renowned.
    BEFORE NEXT COMBAT: the creature is now bigger (counters from renown).
    But: the counters are placed AFTER combat damage is dealt this turn.
    The creature doesn't benefit from its own counters THIS attack — benefits in future attacks.
  RENOWN AND BLOCKING:
    Renown only triggers on combat damage to PLAYERS, not planeswalkers.
    A renowned creature can still attack players normally.
    Renown doesn't fire again once the creature is renowned, no matter what.
    This contrasts with evolve (which fires on every ETB of a bigger creature)
      and training (which fires every attack with a qualifying creature).
    Renown is inherently one-time per creature lifecycle.
  RENOWN COUNTER SIZE:
    Renown 1: 1 counter. Renown 2: 2 counters. The N scales the counter reward.
    Kytheon, Hero of Akros ({W}: 2/1, "at end of turn, if Kytheon attacked this turn with 2+
      creatures, exile Kytheon, transform into Gideon, Battle-Forged"):
    This is NOT renown. Kytheon doesn't have renown. (Close thematically — hero grows — but different.)
    Example of actual renown: Knight of the White Orchid ({W}{W}: 2/2, renown 1, first strike,
      "if this creature is renowned, it has vigilance"):
      Hits a player: gets 1 +1/+1 counter, becomes renowned. Now 3/3 first strike vigilance.

AWAKEN (702.113a):
  WHAT IT IS:
    An alternative cost option on some instants and sorceries.
    "Awaken N—[cost]": pay [cost] instead of the normal mana cost.
    Doing so: the spell also includes a spell ability "put N +1/+1 counters on target land you control.
      That land becomes a 0/0 Elemental creature with haste. It's still a land."
  THE AWAKENED LAND:
    Gets N +1/+1 counters. Becomes a 0/0 Elemental creature with haste.
    "It's still a land." Critical: the land retains its land type, name, and abilities.
    It can still tap for mana, still has its basic land ability, still counts as a land.
    But now it's also a creature. It has summoning sickness if it just entered? No —
      it already exists; the effect adds creature types to it. If it had summoning sickness
      (just entered this turn), the awaken effect doesn't override that.
    Haste: the awaken ability gives the land haste (as part of the effect).
      Even if the land had summoning sickness (entered this turn), haste overrides it.
      So an awakened land CAN attack the same turn it was awakened.
    P/T: 0/0 base + N counters (in layer 7c). So it's an N/N creature effectively.
  AWAKEN AS ALTERNATIVE COST (602.102 pattern):
    You choose at casting time: pay normal cost (no awaken effect) or awaken cost (awakened land).
    If you pay normal cost: spell has its normal effect, no land is targeted.
    If you pay awaken cost: spell has its normal effect PLUS the land animation.
    702.113b: target is only chosen if the awaken cost was paid.
    If awaken cost was paid but no valid target (no lands you control): the spell is countered
      on resolution for having no legal targets? Actually: awaken requires targeting a land you control.
      If you can't target (have no lands), you can't pay the awaken cost (can't choose the target).
      Wait: if lands become invalid AFTER the spell is cast? Then the awaken ability fizzles on the
        awaken portion (target illegal), but the rest of the spell still resolves (partial resolution).
  AWAKENED LAND AND REMOVAL:
    Opponents can kill the awakened land like a creature: target it with removal.
    "Destroy target creature" — the awakened land is a creature → it's destroyed.
    When destroyed: it goes to the GY. The land is gone. (Losing your mana base is a real cost.)
    "Bounce" (return to hand): the land goes to the hand. Loses its creature status (zone change).
    "Exile": exiled. Not in play anymore.
    The counters and creature-type are part of the permanent on the battlefield. Gone when it leaves.
  AWAKENED LAND ATTACKING:
    Since it has haste: if awakened on your turn, it can attack immediately.
    It uses its power (0 + N counters = N) and toughness (same).
    It taps to attack (land's tap ability is not used while attacking).
    Can use the land's tap ability OR attack — not both in the same turn (tapping for attack
      prevents tapping for mana UNLESS it untaps). Haste doesn't give extra untap.
  EXAMPLE — RETREAT TO CORALHELM AND PLANAR OUTBURST:
    Planar Outburst ({3}{W}{W}: Sorcery, "Destroy all nonland creatures. Awaken 4—{5}{W}{W}"):
      Normal cast ({3}{W}{W}): destroy all nonland creatures. Wrath effect. No land animation.
      Awaken cast ({5}{W}{W}): destroy all nonland creatures (they're nonland, so they die).
        AND: target land you control gets 4 +1/+1 counters, becomes a 0/0 Elemental with haste.
        The awakened land is now a 4/4 creature (0+4 counters). It survived the board wipe
          because it was a LAND when the destruction happened?
        Wait: "destroy all nonland creatures." The land IS a nonland creature now (it's a creature).
        Hmm: the destruction says "nonland creatures." The awakened land is BOTH a land AND a creature.
        Rule: "nonland creature" means a permanent that is a creature AND not a land? Or
          a creature that is not a land?
        Actually: a permanent that is both a land and a creature IS a land. The effect says
          "nonland creatures" = creatures that aren't also lands. The land-creature is still a land.
        Therefore: an awakened land survives Planar Outburst! (It's a land creature, not a nonland.)
        This is the MAIN strategic value of awaken + board wipes: your awakened land survives!

DEVOID (702.114):
  WHAT IT IS:
    A characteristic-defining ability (CDA). Layer 5 (color).
    "Devoid" means "this object is colorless."
    Overrides the mana cost's color implications.
    A card with {U}{R} in its mana cost would normally be blue and red.
    A card with {U}{R} AND devoid: it is colorless (not blue, not red).
  CDA BEHAVIOR (604.3, 604.3a):
    Characteristic-defining abilities function in ALL ZONES, including the GY, hand, exile, and
      even outside the game.
    This means: a devoid card in your hand is colorless. In the GY: colorless. On the stack: colorless.
    Contrast with most effects that only change characteristics on the battlefield.
  DEVOID AND COLOR IDENTITY (Commander):
    Devoid makes the CARD colorless, but it does NOT affect color identity for Commander deckbuilding.
    Color identity is determined by: mana cost symbols + color indicator symbols + mana symbols in the
      rules text.
    Devoid doesn't remove the colored mana symbols from the card's mana cost.
    Example: Forerunner of Slaughter ({R}{C}: 3/2, devoid, "Other colorless creatures you control
      have haste"):
      The card has {R} in its mana cost. Color identity = Red.
      The card itself is colorless (devoid). But you need a Commander with Red in their color identity
      to include Forerunner of Slaughter in Commander.
    This creates a counterintuitive situation: a colorless card (devoid) that has a Red color identity.
  DEVOID AND COLOR-CHECKING EFFECTS:
    "Destroy target blue permanent" — a devoid card with {U} in its cost is NOT blue (devoid).
      It can't be targeted by this effect.
    "If this creature is colorless, draw a card" — devoid creatures qualify everywhere.
    "Protection from colorless" — protects from devoid creatures (they're colorless).
  DEVOID AND COPY EFFECTS:
    If you copy a devoid card (Clone becoming a copy of a devoid creature):
      Clone has devoid as a static ability. Clone is colorless? Yes: devoid is printed on the
        original; Clone "has the same name, mana cost, abilities..." — the copy includes devoid.
        Clone would be colorless (devoid overrides Clone's normal color).
  DEVOID AND THE LAYER SYSTEM:
    Devoid is a CDA. CDAs apply first in their layer (layer 5 for color).
    A devoid card that is then enchanted with "this creature is blue" (layer 5, timestamp-based):
      CDA applies first. Then the "becomes blue" effect applies. The creature is blue.
      Wait: 613.3: "Within a layer, CDAs apply first, then other effects in timestamp order."
      If the "becomes blue" effect is a non-CDA layer 5 effect with a later timestamp:
        It applies AFTER devoid. The creature ends up blue (the later effect overrides).
      But if another effect says "becomes colorless" (another layer 5 effect):
        Apply in timestamp order. The later effect wins.
    Key: devoid being a CDA means it applies first in layer 5. Non-CDA effects with later
      timestamps can still override it.
```

## Definitive Conclusions

- **Renowned is a one-time designation per creature lifecycle** — once renowned, the trigger never fires again (intervening-if fizzles at resolution); leaving and re-entering the battlefield resets the designation; copying a renowned creature creates a non-renowned copy.
- **Awakened lands are both lands and creatures — they survive "nonland creature" destruction** — this is the primary tactical value of awaken + board wipes; the awakened land is a creature with haste but still a land.
- **Awaken's land target is only chosen if the awaken cost was paid** (702.113b) — the normal spell effect happens either way; if the awaken target becomes invalid after casting, the spell portion still resolves but the awaken animation fizzles.
- **Devoid makes a card colorless in ALL zones** — including hand, GY, and exile — unlike most color modifications which only apply on the battlefield; devoid does NOT affect color identity for Commander deckbuilding purposes.
- **A devoid card with colored mana symbols has a color identity despite being colorless** — the mana cost symbols determine color identity; devoid removes the "color" characteristic but not the "color identity" designation used for Commander deck construction.

## Canonical Example
**Renown — Knight of the White Orchid:**
Knight of the White Orchid ({W}{W}: 2/2, First Strike, Renown 1, "As long as Knight of the White Orchid is renowned, it has vigilance"):
Turn 2: Knight of the White Orchid attacks. It's not renowned (first attack).
Combat damage step: Knight deals 2 combat damage to the defending player.
"When this creature deals combat damage to a player, if it isn't renowned" — condition true → trigger fires.
After combat: trigger resolves. Knight gets 1 +1/+1 counter (now 3/3). It becomes renowned.
Knight of the White Orchid now has: First Strike + Vigilance + 3/3 stats.

Turn 3: Knight attacks again. Renowned trigger attempts to fire again.
"When this creature deals combat damage to a player, if it isn't renowned" — the creature IS renowned.
The intervening-if condition (P006) fails at the trigger event. The trigger doesn't even go on the stack.
(Even if it did go on the stack, it would fizzle at resolution since the creature is still renowned.)
Knight stays 3/3 with First Strike and Vigilance, but grows no further from renown.

Opponent bounces Knight back to your hand. You replay it.
New object (P003). NOT renowned. Renown can fire again on its next successful attack.

**Example 2 — Awaken Land Survives Board Wipe:**
Planar Outburst is cast for its awaken cost ({5}{W}{W}):
Targets: your Plains (basic land).
The Plains gets 4 +1/+1 counters → it becomes a 0/0 Elemental creature with haste → it's still a land.
It's now a 4/4 Land Creature — Elemental Plains with haste.

Planar Outburst's main effect resolves: "Destroy all nonland creatures."
"Nonland creatures" = creatures that are not also lands.
Your opponent's 5/5 dragon: creature, not a land → destroyed.
Your opponent's 4/4 Human: creature, not a land → destroyed.
Your awakened Plains: it IS a land (still a land, per awaken's "it's still a land") → NOT a nonland creature.
Result: your awakened Plains survives. Everything else dies.

Now you have a 4/4 Elemental with haste on an empty board.
Attack immediately (haste). Opponent takes 4 damage. Potentially lethal within turns.

If opponent has "destroy target creature" — they can destroy your awakened land-creature.
If they do: the Plains goes to your GY. You lose that mana source.
Tactical note: awaken is risky (opponents can destroy your lands) but powerful (board wipe + threat).

## Commonly Confused With
- **P383 (Class Cards)** — Both renown and Class mechanics have "levels" or progression states (renowned vs. not; Class level 1/2/3). But renown is a one-time combat trigger; Classes use activated abilities to advance levels.
- **P384 (Exert/Amass/Explore)** — Renown is similar to exert in that both involve attacking; exert is a choice at attack declaration; renown triggers on dealing combat damage. Both are limited-use combat bonuses but work mechanically differently.
- **P389 (Meld/Prototype)** — Prototype also uses an alternative casting cost (like awaken). Both pay a different cost to get different effects: prototype changes the card's characteristics; awaken adds a land animation effect. Both follow alternative cost rules (601.2b).
- **P004 (Layer System)** — Devoid operates in Layer 5 (color) as a CDA. Understanding that CDAs apply first within their layer, and that later non-CDA effects can override devoid, requires the layer system.
