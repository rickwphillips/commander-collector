---
id: p264
name: Reconfigure — Equipment-Creature Hybrid That Can Attach or Detach
category: costs
cr_refs: [702.151a, 702.151b, 301.5, 301.6]
tags: [reconfigure, equipment, creature, artifact, attach, unattach, sorcery-speed, Kamigawa-Neon-Dynasty, Lizard-Blades, Simian-Sling, Gloomshrieker, Leashed-Tormentor]
created: 2026-03-29
examples_count: 2
---

# P264 — Reconfigure — Equipment-Creature Hybrid That Can Attach or Detach

## Abstract
Reconfigure is a keyword ability from Kamigawa: Neon Dynasty (2022). A permanent with reconfigure is both a creature AND an equipment. By default, it exists as a creature on the battlefield. By paying the reconfigure cost (sorcery speed only), you can attach it to another creature you control — at which point it stops being a creature and functions as an equipment. Paying the reconfigure cost again while attached unattaches it, returning it to creature status. This dual nature — creature when alone, equipment when attached — makes reconfigure permanents flexible combat resources that can serve as both attackers/blockers and equipment for other creatures.

## The Definitive Rules

**CR 702.151a** (verbatim): *"Reconfigure represents two activated abilities. Reconfigure [cost] means '[Cost]: Attach this permanent to another target creature you control. Activate only as a sorcery' and '[Cost]: Unattach this permanent. Activate only if this permanent is attached to a creature and only as a sorcery.'"*

**CR 702.151b** (verbatim): *"Attaching an Equipment with reconfigure to another creature causes the Equipment to stop being a creature until it becomes unattached from that creature."*

## The Pattern

```
RECONFIGURE STATE 1 — STANDALONE CREATURE:
  Default mode: the card is a creature (and an artifact)
  Can attack, block, tap like a normal creature
  Its creature stats (power/toughness) are its own
  To attach it: pay reconfigure cost as a sorcery → becomes attached equipment

RECONFIGURE STATE 2 — ATTACHED EQUIPMENT:
  While attached to another creature: STOPS being a creature
  Grants its printed bonus to the equipped creature (the equipment text)
  Can still be destroyed as an artifact (not as a creature — can't receive creature-removal)
  To detach: pay reconfigure cost again as a sorcery → becomes standalone creature again

RECONFIGURE RULES:
  1. Both attach and unattach use the SAME ability text (reconfigure [cost])
  2. Both are sorcery speed: can't reconfigure in response to spells/abilities mid-combat
  3. "Another target creature" — can't attach to itself (the word "another")
  4. No summoning sickness on the reconfigure activation (it's already on the battlefield)
  5. Being unattached (via opponent removing the host creature): snaps back to being a creature

RECONFIGURE + CREATURE DEATH:
  If the equipped creature dies: the reconfigure equipment remains on battlefield
  It reverts to standalone creature mode (no longer attached = becomes a creature again)
  Normal equipment fall-off rules: when host leaves, equipment stays
  Reconfigure: the equipment doesn't go with the host — it stays and reverts to creature mode

RECONFIGURE + SUMMONING SICKNESS:
  When reconfigure permanent enters the battlefield: it has summoning sickness as a creature
  Can't attack or use {T} abilities that turn (unless it has haste)
  BUT: you CAN activate the reconfigure ability to attach it (no tap required for reconfigure)
  Wait: attaching doesn't require tapping (the {T} isn't part of the cost)
  So: reconfigure permanent enters → immediately pay reconfigure cost → attach to another creature
  Attach on the turn it enters is legal (reconfigure cost doesn't use {T}).

RECONFIGURE + PROTECTION/AURAS:
  While attached: the reconfigure card is treated as an equipment, not a creature
  Creatures with "protection from artifacts": the reconfigure equipment can't attach to them
    (because equip/attach targeting requires the permanent to be targetable — protection blocks)
  Auras on the reconfigure permanent: if the aura is on it while it's a creature, and it attaches...
    The aura follows the reconfigure permanent (it's still the same object in both states)

RECONFIGURE NOTABLE CARDS (Kamigawa: Neon Dynasty):
  Lizard Blades ({1}{R}): 2/1 with double strike, Reconfigure {4}{R}
    As creature: 2/1 double strike beater.
    As equipment: gives equipped creature double strike (powerful ability).
    Cost: {4}{R} to reconfigure → expensive but double strike on a 5/5 is devastating.

  Simian Sling ({1}{R}): 1/1, Reconfigure {2}{R}. When equipped creature deals combat damage to
    a player, you may have it deal 1 damage to any target.
    As creature: 1/1 pingler.
    As equipment: gives equipped creature a triggered "ping 1 damage" when dealing combat damage.
    Pair with a trampler: trample deals excess, ping fires → 2 damage total per hit.

  Gloomshrieker ({2}{B}{G}): 3/2, Reconfigure {4}{B}{G}. Equipped creature has deathtouch.
    Equipped creature also gets a +1/+1 counter when it attacks.
    As creature: 3/2 body.
    As equipment: deathtouch + counter growth on host. Stacks counters for escalating threats.

  Leashed Tormentor ({3}{B}): 3/1, Reconfigure {4}{B}. Equipped creature has
    "{T}: Sacrifice a creature. Draw a card."
    As creature: 3/1 body.
    As equipment: sacrifice outlet + draw engine on any creature you control.
    Equip to a token generator: sacrifice tokens → draw cards.

RECONFIGURE + COMBAT TRICKS:
  Can't reconfigure during combat (sorcery speed) — no mid-combat swap
  But: you can attack as a creature, and after combat pay to reconfigure onto a bigger attacker
  Next turn: the bigger attacker has the bonus + the reconfigure creature isn't attacking alone
  Planning: reconfigure is a pre-combat decision (during your main phase before attacks)
```

## Definitive Conclusions

- **Reconfigure stops being a creature while attached** — it becomes equipment only.
- **Both attach and unattach are sorcery speed** — no flash reconfiguring mid-combat.
- **If the host dies, the reconfigure permanent reverts to creature** — it stays on battlefield.
- **Reconfigure can attach on the turn it enters** — the activation doesn't tap the permanent.
- **Protection from artifacts prevents equipping** — treated as equipment for attach-targeting.

## Canonical Example
**Lizard Blades Flexing Between Modes:**
Turn 2: cast Lizard Blades ({1}{R}). Enters as 2/1 double strike creature. Attack for 2 with double strike.
Turn 3: Your 5/5 enters. Use main phase: pay {4}{R} reconfigure → attach Lizard Blades to the 5/5.
Lizard Blades stops being a creature. Your 5/5 now has double strike.
Attack with 5/5 double striker: first strike damage = 5, then regular damage = 5. Ten damage in one swing.
Opponent's blocker dies to first strike, you still deal second-strike damage to the player (trample).
Turn 4 (if 5/5 dies): Lizard Blades snaps back to creature mode, attacks again as a 2/1 double striker.

**Example 2 — Leashed Tormentor Sacrifice Engine:**
Board: Leashed Tormentor (3/1 creature), plus token generators (Ophiomancer, Bitterblossom).
You have excess tokens every turn.
Pay {4}{B}: Reconfigure Tormentor onto your commander.
Your commander now has "{T}: Sacrifice a creature. Draw a card."
Every turn: sacrifice a Snake/Faerie token → draw a card → tap commander.
Commander is doing commander things PLUS providing sacrifice/draw through the equipped Tormentor.
If opponent Wraths: Tormentor stays on battlefield, falls off the dead commander, reverts to creature.
Re-equip next main phase.

## Commonly Confused With
- **P160 (Equipment Attach Rules)** — Standard equipment attach; Reconfigure specifically makes the equipment stop being a creature while attached and regain creature status when detached.
- **P064 (Bestow)** — Bestow also creates an enchantment-creature hybrid (aura when cast targeting, creature when the host dies); Reconfigure is an equipment-creature hybrid with a repeatable paid switch.
- **P155 (Vehicles)** — Vehicles are artifact creatures when crewed; Reconfigure equipment-creatures are always artifacts but switch between creature/equipment roles.
