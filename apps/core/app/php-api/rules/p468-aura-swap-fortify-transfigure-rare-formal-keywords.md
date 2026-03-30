---
id: p468
name: Aura Swap, Fortify, and Transfigure — Aura-Exchange, Land-Equipment-Attach, and Creature-Tutor-Swap Keywords
category: costs
cr_refs: [702.65, 702.67, 702.71, 303.4, 301.5, 601.2b, 400.7, 110.5b]
tags: aura-swap, fortify, transfigure, formal-keyword, rare-mechanic, future-sight, coldsnap, future-sight-tutor, equipment-land, aura-exchange
created: 2026-03-29
examples_count: 5
---

# P468 — Aura Swap, Fortify, and Transfigure — Aura-Exchange, Land-Equipment-Attach, and Creature-Tutor-Swap Keywords

## Abstract

Three formal keyword abilities from niche sets with almost no rules discussion in common play: **Aura Swap** (CR 702.65, Future Sight) is an activated ability that exchanges a permanent Aura with an Aura card in hand; **Fortify** (CR 702.67, Coldsnap) is an activated ability on Fortifications that works like Equip but attaches to lands instead of creatures; and **Transfigure** (CR 702.71, Future Sight) is an activated ability that sacrifices the transfiguring creature to search for another creature with the same converted mana cost. All three see virtually no competitive play but have precise rules that are rarely documented.

## The Definitive Rules

### Aura Swap (CR 702.65)
**CR 702.65a verbatim:** *"Aura swap [cost] means '{cost}: Exchange this permanent with an Aura card in your hand. Play this ability only any time you could cast a sorcery.'"*

Aura Swap exchanges the Aura currently attached to a permanent with an Aura card in your hand. The new Aura from hand enters the battlefield attached to the same permanent the old Aura was attached to. The old Aura goes to hand.

Key: The new Aura must be able to legally attach to the thing the original Aura was attached to (it must be able to enchant that object/player).

### Fortify (CR 702.67)
**CR 702.67a verbatim:** *"Fortify [cost] means '{cost}: Attach this Fortification to target land you control. Play this ability only any time you could cast a sorcery.'"*

Fortify works exactly like Equip but applies to Fortification artifacts that attach to lands. A Fortification is an artifact subtype (like Equipment). Fortify can only be used on your own lands, and only at sorcery speed.

### Transfigure (CR 702.71)
**CR 702.71a verbatim:** *"Transfigure [cost] means '{cost}, Sacrifice this permanent: Search your library for a creature card with the same converted mana cost as this permanent, reveal that card, and put it into your hand. Then shuffle your library. Play this ability only any time you could cast a sorcery.'"*

Transfigure sacrifices the creature to search for ANY creature card with the same mana value. It's a tutor that converts one creature into another of the same cost.

## The Pattern

```
AURA SWAP pattern:
Activation: "[Cost]: Exchange this permanent with an Aura card in your hand."
  → "Sorcery speed" only (during your main phase, stack empty)
  → The Aura in hand must be a legal attachment:
    → If the current Aura is on a creature, the new Aura must be able to enchant creatures
    → If the current Aura is on a player, the new Aura must be able to enchant players
    → "Enchant creature" Aura in hand → can only swap onto creature-attached current Aura
    → "Enchant land" Aura in hand → can only swap with Aura on a land
  → The new Aura enters the battlefield attached directly (doesn't use the stack as a spell)
    → No "when you cast" triggers for the new Aura
    → ETB abilities of the new Aura DO trigger (it enters the battlefield)
    → No targeting when entering (the attachment is to whatever the old Aura was on)
  → The old Aura goes to hand (it becomes a card in hand again)
  → Exchange is simultaneous: old Aura → hand, new Aura → battlefield attached
  → Key: the swapped Aura bypasses the casting-and-resolving process
    → Normally, you'd cast the Aura and target; here you skip both steps

FORTIFY pattern:
Activation: "[Cost]: Attach this Fortification to target land you control."
  → Sorcery speed only
  → "Target land you control" — must target YOUR land (not opponent's)
  → The Fortification is an artifact subtype (like Equipment)
  → Fortifications have no power/toughness pump to creatures; they enhance lands
    → Example effects: "Fortified land has indestructible" / "Fortified land becomes
      a 4/4 artifact creature in addition to its other types"
  → Fortification rules are identical to Equipment rules (CR 301.5) but for lands
  → Can move between your lands (each move costs the Fortify activation cost)
  → Moving a Fortification doesn't sacrifice the old land or the fortification
  → No sorcery speed restriction on unattaching (but attaching = sorcery speed)
  → If the fortified land leaves the battlefield, the Fortification falls off
    and remains on the battlefield unattached (same as Equipment falling off a creature)

TRANSFIGURE pattern:
Activation cost: "[Cost], Sacrifice this permanent:"
  → Sacrifice is part of the cost (already paid when ability goes on stack)
  → Search for creature card with same MANA VALUE (converted mana cost)
    → Not the same name, same mana cost, or same type — just same MV
    → A 3 CMC creature transfigures into any other 3 CMC creature
    → X spells: MV of a transfigured spell with X in cost on the battlefield = X is 0
      unless otherwise stated; searching for creatures with MV equal to the printed cost
      (with X=0) might return only other X=0 creatures
  → "Reveal and put into hand" — not cast, not put onto battlefield
  → Sorcery speed only
  → Classic use: sacrifice a mediocre 3-drop to find a better 3-drop from your library
  → Combo use: sacrifice a cheap 1-2 CMC creature to find a specific same-CMC combo piece
```

## Definitive Conclusions

**Aura Swap:**
- Aura Swap is a rarely played ability but has unique rules: the incoming Aura from hand enters the battlefield already attached without being cast. This means it bypasses effects like "whenever you cast an Aura spell" but still triggers ETB abilities.
- The legality check for the new Aura: it must be able to enchant whatever the current Aura is attached to. If your Aura Swap Aura is on a creature with protection from white, you can't swap in a white Aura — white Auras can't be attached to creatures with protection from white (protection prevents being targeted and being attached).
- The old Aura goes to hand — not to the graveyard. This is different from the Aura being destroyed (which would go to the GY). This means you can potentially use Aura Swap multiple times by cycling your Auras back to hand.
- Key card: *Arcanum Wings* (FUT): "Enchant creature. Enchanted creature has flying. Aura swap {2}{U}." Pay {2}{U} to exchange Arcanum Wings with any Aura in hand — useful for swapping in a more powerful Aura on your flying creature.

**Fortify:**
- Fortify's primary use is protecting lands or making them into creatures. Very few Fortification cards were ever printed; the mechanic was essentially a one-set experiment.
- Like Equipment, a Fortification stays on the battlefield if the land it's attached to is destroyed — it floats on the battlefield unattached and can be re-attached to a new land via Fortify.
- Fortifications can be affected by artifact removal — destroy/exile effects targeting the Fortification itself.
- Key card: *Darksteel Garrison* (FUT): "Fortified land has indestructible. Whenever fortified land becomes tapped, target creature gets +1/+1 until end of turn. Fortify {3}." Makes the fortified land indestructible and rewards tapping it with a pump trigger.
- Key card: *Livewire Lash* — wait, that's Equipment. Actual fortification: *Runed Stalactite* (LRW) is not Fortification. The only real Fortification cards are *Darksteel Garrison* and a few others from Future Sight and subsequent sets.

**Transfigure:**
- Transfigure is a narrow tutor: you exchange one creature for another of the same CMC. The sacrifice is immediate (cost), so if Transfigure is countered (via Stifle), you still lose the creature but don't get the new one.
- Using Transfigure with CMC 1–2 creatures is most efficient: small sacrifice to find a specific combo piece or threat of the same cost.
- In curated lists (like Commander), Transfigure lets you run a "filler" creature of a specific CMC knowing it can convert into a powerful creature of that same CMC when needed.
- Key card: *Fleshwrither* (FUT): "Transfigure {1}{B}{B}." A 3/3 for {2}{B}{B}. Pay {1}{B}{B}, sacrifice Fleshwrither to search for any creature with mana value 4 (same as Fleshwrither's MV), which can be something like Sheoldred.

## Canonical Examples

**Aura Swap:**
- *Arcanum Wings*: Grants flying and allows swapping itself for any Aura in hand. Use it to attach a powerful Aura you drew onto the same creature mid-game.

**Fortify:**
- *Darksteel Garrison*: Fortified land becomes indestructible; tapping the fortified land pumps a creature by +1/+1.

**Transfigure:**
- *Fleshwrither*: Sacrifice this 4-drop to find any 4-drop. In a Commander deck, a toolbox of 4-drops of different types accessible via any Transfigure creature of CMC 4.

## Commonly Confused With

- **P040** (Aura/Bestow) — Bestow lets you cast an Aura as a creature or vice versa; Aura Swap exchanges a battlefield Aura with one from hand — both involve Auras but completely different mechanics
- **P099** (Equipment) — Fortify works identically to Equip but for lands; the same rules for Equipment (CR 301.5) apply to Fortification when substituting "land" for "creature"
- **P435** (Bestow Type Matters) — Aura Swap's legality for the incoming Aura matters (must be able to enchant the target); like bestow, the Aura's enchant restriction is relevant
- **P048** (Transmute) — Transmute sacrifices from hand to tutor for cards of the same MV; Transfigure sacrifices from battlefield to tutor for creatures of the same MV — similar tutoring pattern, different activation zones
