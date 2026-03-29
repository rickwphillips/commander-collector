---
id: p319
name: Enchantment Synergies — Aura Rules, Constellation, and Enchantress Effects
category: continuous
cr_refs: [303.4, 303.4a, 303.4c, 303.4e, 303.4f, 303.4g, 303.4j, 207.2c]
tags: [enchantment, Aura, constellation, enchantress, enchant, attach, controller-separate, hexproof-Aura, Pacifism, Ethereal-Armor, Sythis-Harvest-Hand, Eidolon-of-Blossoms, constellation, Aura-falls-off, Aura-illegal, bestow]
created: 2026-03-29
examples_count: 2
---

# P319 — Enchantment Synergies — Aura Rules, Constellation, and Enchantress Effects

## Abstract
Enchantments are non-creature permanents that stay on the battlefield. **Auras** are enchantment subtypes that attach to an object or player — defined by their "enchant [quality]" ability. When the enchanted permanent leaves the battlefield or becomes illegal, the Aura goes to its owner's graveyard (SBA CR 303.4c). The **Aura's controller is separate from the enchanted object's controller** (CR 303.4e). **Hexproof and shroud prevent targeting Auras onto permanents** — a permanent with hexproof can't be targeted by enemy Aura spells. **Constellation** is an ability word (like Landfall) flagging triggered abilities that fire when any enchantment enters under your control. Enchantress effects trigger on casting or entering of enchantments, generating card advantage.

## The Definitive Rules

**CR 303.4** (verbatim): *"Some enchantments have the subtype 'Aura.' An Aura enters the battlefield attached to an object or player. What an Aura can be attached to is defined by its enchant keyword ability."*

**CR 303.4a** (verbatim): *"An Aura spell requires a target, which is defined by its enchant ability."*

**CR 303.4c** (verbatim): *"If an Aura is enchanting an illegal object or player as defined by its enchant ability and other applicable effects, the object it was attached to no longer exists, or the player it was attached to has left the game, the Aura is put into its owner's graveyard. (This is a state-based action.)"*

**CR 303.4e** (verbatim): *"An Aura's controller is separate from the enchanted object's controller or the enchanted player; the two need not be the same. If an Aura enchants an object, changing control of the object doesn't change control of the Aura, and vice versa. Only the Aura's controller can activate its abilities. However, if the Aura grants an ability to the enchanted object (with 'gains' or 'has'), the enchanted object's controller is the only one who can activate that ability."*

**CR 303.4f** (verbatim): *"If an Aura is entering the battlefield under a player's control by any means other than by resolving as an Aura spell, and the effect putting it onto the battlefield doesn't specify the object or player the Aura will enchant, that player chooses what it will enchant as the Aura enters the battlefield. The player must choose a legal object or player according to the Aura's enchant ability and any other applicable effects."*

**CR 303.4g** (verbatim): *"If an Aura is entering the battlefield and there is no legal object or player for it to enchant, the Aura remains in its current zone, unless that zone is the stack. In that case, the Aura is put into its owner's graveyard instead of entering the battlefield."*

## The Pattern

```
AURA BASICS:
  An Aura has "Enchant [quality]": defines what it can attach to.
  "Enchant creature": can only attach to a creature on the battlefield.
  "Enchant land": can only attach to a land.
  "Enchant player": attaches to a player (unusual, but exists — e.g., Psychic Possession).
  When cast: Aura spell targets the legal object (CR 303.4a).
  When it resolves: attaches to the target.

AURA AND HEXPROOF/SHROUD:
  Casting an Aura targets the creature. Hexproof/shroud prevents being targeted by opponents.
  Opponent's creature has hexproof: you can't cast Aura spells targeting it.
  YOUR OWN creature has hexproof: you CAN still enchant it with your own Auras.
    (Hexproof: opponents can't target it. You can target your own hexproof.)
  YOUR creature has shroud: NEITHER you nor opponents can target it.
    Can't enchant a creature with shroud with any Aura spell.
    But: if an Aura enters the battlefield NOT as a spell (from GY via effect), no targeting →
    you can choose to attach it to a shroud creature (CR 303.4f: "choose what to enchant").
    This is a key difference: Aura spell vs. Aura entering via other means.

WHEN DOES AN AURA FALL OFF?
  SBA CR 303.4c: Aura falls off (goes to GY) when:
  (A) The enchanted permanent leaves the battlefield.
      Creature is bounced to hand: Aura goes to GY (creature left, Aura has nothing to enchant).
      Creature is destroyed: Aura goes to GY.
      Exception: if the creature is flickered (exiles and returns), the Aura sees a new object →
      Aura can't enchant the "new object" — falls to GY. (See P311.)
  (B) The enchanted permanent no longer meets the Aura's enchant condition.
      "Enchant creature" — your Enchanted creature stops being a creature (becomes just a land).
      Aura goes to GY (now enchanting an illegal object).
      But: a creature enchanted by "Enchant creature" gains +X/+Y — it's still a creature. Fine.
      If an effect says "this is no longer a creature," the Aura falls off.
  (C) The Aura itself can no longer be on that object (protection gained, etc.).
      Creature gains "Protection from white" — a white Aura on it becomes illegal attachment.
      SBA: white Aura falls off → GY.

CONTROLLER DIFFERENCE (CR 303.4e):
  You control Pacifism ({1}{W}) enchanting an opponent's Abzan Guide.
  You control Pacifism, NOT the Abzan Guide.
  If opponent gains control of your Pacifism via some effect → they control the Aura.
    But the Aura still enchants the Abzan Guide (they now control both — Aura doesn't fall off).
  If Pacifism grants an ability to the Abzan Guide ("enchanted creature has..."):
    The Abzan Guide's controller (opponent) can activate that ability, not you.
    But Pacifism says "enchanted creature can't attack or block" — that's a restriction.
    Restrictions apply regardless of who activates what. No activated ability involved.
  You steal the Abzan Guide (take control): Pacifism stays on it. You now control both.
    Aura's controller (you) and enchanted object's controller (you) are the same.

AURA CONTROLLER CAN CHOOSE ON NON-SPELL ENTRY (CR 303.4f):
  Replenish ({3}{W}): "Return all Aura cards from your GY to the battlefield."
  Multiple Auras returning at once: you choose which valid permanent to attach each to.
  "Enchant creature" Auras: choose among legal creatures. You can enchant YOUR creatures.
  Even if the target has hexproof: since these Auras aren't spells (they're entering via effect),
    you don't need to TARGET them. Just choose where to attach. Hexproof doesn't apply.
  You can put Auras on hexproof creatures via Replenish — powerful interaction.
  Similarly: Open the Vaults recovers all Auras and can target hexproof permanents.

CONSTELLATION (ability word):
  Like Landfall for enchantments. Triggers whenever an enchantment enters under your control.
  "Constellation — Whenever an enchantment enters under your control, [effect]."
  This triggers for ALL enchantments (not just Auras): Sagas, non-Aura enchantments, tokens.
  Eidolon of Blossoms ({2}{G}{G}): "Constellation — whenever an enchantment enters under
    your control, draw a card."
  Sythis, Harvest's Hand ({G}{W}): "Whenever you cast an enchantment spell, gain 1 life and
    draw a card."
  Note: Sythis triggers on CASTING (not entering). Eidolon triggers on ENTERING.
  This difference matters for: countered spells (Sythis already triggered; Eidolon didn't).
  And: enchantments entering without being cast (Replenish) — Eidolon triggers, Sythis doesn't.

ENCHANTRESS EFFECTS (broader category):
  Several cards trigger on casting or entering enchantments to draw cards.
  Mesa Enchantress ({2}{W}): "Whenever you cast an enchantment spell, draw a card."
  Verduran Enchantress ({2}{G}): same.
  Enchantress's Presence ({2}{G}): same.
  With 3+ enchantresses in play: each enchantment cast draws 3 cards.
  Classic "Enchantress" decks: ramp up enchantments, draw through the deck, gain value.
  Sythis (Commander): Commander + enchantress effect = consistent engine.

AURA SYNERGIES (Voltron):
  Voltron strategy: stack many Auras on one creature for game-ending power.
  Ethereal Armor ({W}): "Enchanted creature gets +1/+1 for each enchantment you control and has first strike."
    With 5 enchantments: +5/+5. With 10: +10/+10. Plus first strike.
  Rancor ({G}): "Enchanted creature gets +2/+2 and has trample. When Rancor is put into a GY from the battlefield, return it to its owner's hand."
    Rancor returns to hand when creature dies → reuse it. Classic Voltron Aura.
  Totem Armor (mechanic): "If enchanted creature would be destroyed, instead remove all damage from it and destroy this Aura." — Protects the creature by sacrificing the Aura.
    Example: Hyena Umbra (Totem Armor) — if the creature would die: Hyena Umbra is destroyed instead. Creature survives.

CONSTELLATION AND SAGAS:
  Sagas are a specific enchantment subtype (see P320 for detailed Saga rules).
  Sagas entering the battlefield triggers Constellation.
  Sagas advance their lore counters as turns pass, triggering abilities.
  Each chapter read can also trigger Constellation (if the chapter creates enchantments).
  Saga entering: Constellation trigger. Saga being sacrificed: NOT an enchantment entering.

MULTIPLE ROLE TOKENS:
  CR 303.7a: Role tokens (Cursed, Monster, Royal, Sorcerer, etc.) are Aura enchantments.
  A permanent can only have ONE Role from each player.
  If a second Role from the same player would attach: the older one goes to GY (SBA).
  Constellation: the new Role entering triggers Constellation. The old one going to GY doesn't.
```

## Definitive Conclusions

- **Auras fall off when the enchanted permanent becomes illegal** — bounced creatures, destroyed creatures, or creatures gaining protection all cause the Aura to go to the GY as an SBA.
- **Hexproof prevents targeting Aura spells but not non-spell Aura placement** — Replenish can attach Auras to hexproof creatures.
- **The Aura's controller is separate from the enchanted permanent's controller** — switching control of one doesn't switch the other.
- **Constellation triggers on ALL enchantments entering** — Auras, Sagas, Classes, any enchantment type.
- **Enchantress effects drawing cards on cast are different from ETB effects** — key for Replenish/non-cast entry scenarios.
- **Rancor returns to hand when it goes to the GY from the battlefield** — resilient Aura in Voltron strategies.

## Canonical Example
**Aura Hexproof Interaction — Replenish:**
Game state: Your opponent controls a creature with Hexproof (e.g., Dungrove Elder, hexproof as long as you control a Forest).
You want to enchant it with Pacifism but opponent's creature has hexproof — you can't TARGET it.
Plan B: discard Pacifism and use Replenish ({3}{W}) to return it.
Replenish resolves: return all Aura cards from your GY.
Pacifism is entering the battlefield (not being cast as a spell). CR 303.4f: choose what to enchant.
Hexproof only prevents TARGETING. This Aura isn't being cast — no target chosen.
Choose Dungrove Elder. Pacifism attaches to the hexproof creature. Legal!
Dungrove Elder now can't attack or block.
The hexproof ability didn't protect it from this non-targeting approach.

Note: if Dungrove Elder had SHROUD instead (can't be targeted by ANYTHING, including yours):
Shroud also only applies to targeting. Replenish still works — no target = no shroud issue.

**Example 2 — Sythis Enchantress Engine:**
Commander: Sythis, Harvest's Hand ({G}{W}). "Whenever you cast an enchantment spell, gain 1 life and draw a card."
Other permanents: Eidolon of Blossoms ({2}{G}{G}): "Constellation — whenever an enchantment enters, draw a card."
Turn 4: cast Sylvan Library ({1}{G}): enchantment.
  Sythis trigger: gain 1 life, draw 1 card.
  Sylvan Library enters → Eidolon of Blossoms Constellation trigger: draw 1 card.
  Net from casting Sylvan Library: drew 2 cards, gained 1 life.
Turn 5: cast Seal of Primordium ({G}): enchantment.
  Sythis trigger: gain 1, draw 1.
  Eidolon trigger: draw 1.
  2 draws, 1 life gain per enchantment cast.
Turn 6: cast Enchantress's Presence ({2}{G}): enchantment.
  Sythis trigger: gain 1, draw 1.
  Eidolon trigger: draw 1.
  Now you control: Sythis, Eidolon, Enchantress's Presence.
  Each additional enchantment cast → 3 draws (Sythis cast, Eidolon entry, Enchantress entry? Wait:
  Enchantress's Presence also triggers on cast: draw another card.
  So: cast any enchantment → Sythis (draw 1 cast) + Enchantress's Presence (draw 1 cast) + Eidolon (draw 1 enter) = 3 draws per enchantment cast. Gain 1 life.
  After several turns: hand is full, life total is high, board is covered in enchantments.
This is the Enchantress engine: each enchantment accelerates drawing more enchantments.

## Commonly Confused With
- **P299 (Bestow)** — Bestow is a morph-like alternative cast that makes the card an Aura while on the stack; it uses the Aura rules while being cast but falls back to creature rules if the target becomes illegal on resolution. Bestow interacts with Constellation (the Aura enters → triggers Constellation).
- **P311 (New Object Rule)** — When an enchanted creature is flickered, the Aura falls off (the new object returned is not attached). This is because the Aura was attached to the OLD object (pre-flicker), and the new object entering is not the enchanted one.
- **P305 (Protection)** — Protection from an enchantment color causes Auras of that color already enchanting the protected permanent to fall off as an SBA. This is in addition to preventing new Aura spells from targeting.
- **P315 (Token Rules)** — Role tokens are Aura tokens. They trigger Constellation when they enter. Multiple Roles from the same player → newest survives (SBA 303.7a).
