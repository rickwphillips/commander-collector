---
id: p238
name: Haunt — Exile Haunting a Creature, Trigger When That Creature Dies
category: triggered
cr_refs: [702.55a, 702.55b, 702.55c]
tags: [haunt, exile, trigger, death, creature, Ravnica-Guildpact, Cry-of-Contrition, Hunted-Horror, Restless-Bones]
created: 2026-03-28
examples_count: 2
---

# P238 — Haunt — Exile Haunting a Creature, Trigger When That Creature Dies

## Abstract
Haunt is a two-stage ability from Ravnica: City of Guilds block. When a permanent with haunt dies (or when an instant/sorcery with haunt is put into the graveyard during resolution), it exiles itself haunting target creature. The haunted creature "carries" the card in exile — and when that creature later dies, the haunt ability triggers again, repeating the original spell's effect. This creates a "delayed second cast" that fires on the targeted creature's death. Haunt cards are typically Orzhov (white/black) mechanics: use an effect now, get it again when a creature dies — synergizing with removal, sacrifice, and creature death themes.

## The Definitive Rules

**CR 702.55a** (verbatim): *"Haunt is a triggered ability. 'Haunt' on a permanent means 'When this permanent is put into a graveyard from the battlefield, exile it haunting target creature.' 'Haunt' on an instant or sorcery spell means 'When this spell is put into a graveyard during its resolution, exile it haunting target creature.'"*

**CR 702.55b** (verbatim): *"Cards that are in the exile zone as the result of a haunt ability 'haunt' the creature targeted by that ability. The phrase 'creature it haunts' refers to the object targeted by the haunt ability, regardless of whether or not that object is still a creature."*

**CR 702.55c** (verbatim): *"Triggered abilities of cards with haunt that refer to the haunted creature can trigger in the exile zone."*

## The Pattern

```
HAUNT SEQUENCE:
  1. Card with Haunt: a permanent or instant/sorcery that has "Haunt" as a triggered ability
  2. The permanent goes to GY (dies/destroyed) OR the instant/sorcery goes to GY during resolution
  3. Haunt ability triggers: exile this card haunting target creature
  4. Card is now in exile zone, haunting the targeted creature
  5. When the haunted creature dies: haunt trigger fires again (the original effect happens again)

HAUNT ON PERMANENTS:
  Permanent (creature or enchantment) with Haunt dies: haunt ability fires
  You choose a target creature (typically) to haunt
  The permanent is exiled (from GY) haunting that creature
  When that creature dies: the haunt ability from exile triggers → re-cast the effect

HAUNT ON INSTANTS/SORCERIES:
  Instant/sorcery with Haunt: first cast has its normal effect
  During resolution: the spell is put into GY (this is when haunt triggers)
  Haunt: exile it haunting target creature
  When that creature dies: trigger → the spell's effect fires again (for free)

HAUNT + TARGETING THE HAUNTED CREATURE:
  You typically choose an OPPONENT's creature to haunt
  When that creature dies (to your removal, opponent sacrifices, combat): haunt fires
  You can also haunt your OWN creature (if you plan to sacrifice it for the effect)

HAUNT + "CREATURE IT HAUNTS":
  CR 702.55b: the "creature it haunts" refers to the OBJECT targeted by the haunt ability
  Even if that object is no longer a creature (e.g., it became an artifact, it was exiled):
  The haunt card remembers what was targeted

HAUNT + EXILE ZONE ABILITIES:
  CR 702.55c: haunt abilities in the exile zone CAN trigger
  This is unusual: most abilities don't function from exile
  Haunt's triggered ability functions from exile (watching for the haunted creature to die)

HAUNT + ZONE CHANGE:
  If the haunted creature changes zones (bounced to hand, exiled): does haunt still fire when it dies?
  Key: haunt tracks the CARD OBJECT
  If the creature is bounced then recast: it's a NEW object — haunt no longer tracks it
  If it's exiled: the haunt creature is never "put into a graveyard from the battlefield" → haunt never fires
  If a token is haunted: token goes to GY then ceases to exist — does haunt fire?
    Yes: the token WAS "put into a graveyard from the battlefield" — haunt fires
    Then the token ceases to exist in the GY (704.5d: tokens in GY cease to exist as SBA)
    But: haunt triggered WHEN the token died — so it fires

HAUNT CARDS (Ravnica: Guildpact):
  Cry of Contrition ({B}, Sorcery — Haunt): "Target player discards a card. Haunt (When this spell is put into a graveyard during its resolution, exile it haunting target creature.)" "When the haunted creature dies, its controller discards a card."
    First use: opponent discards. Later: when the haunted creature dies, opponent discards again.
    Choose the opponent's most valuable creature to haunt: force discard when they inevitably remove it.

  Restless Bones ({2}{B}, Creature — Skeleton — Haunt): 1/1, "{B}: Regenerate target Skeleton."
    When dies: haunt target creature. When haunted creature dies: you may regenerate target Skeleton (the effect fires again).

HAUNT + SACRIFICE SYNERGY:
  Haunt your OWN sacrifice outlet creature: Viscera Seer, Ashnod's Altar, etc.
  Then sacrifice it when convenient: haunt fires on-demand
  This turns haunt into a "use now, trigger later at your convenience" effect

HAUNT + REMOVAL:
  Haunt an opponent's creature with removal potential
  Example: Cast a haunt-removal spell → opponent's best creature is now haunted
  Opponent tries to prevent you from ever killing it: but eventually it dies
  Patient play: haunt the creature, wait, kill it with other removal → haunt fires
```

## Definitive Conclusions

- **Haunt exiles a card** from the GY (or during resolution for instants/sorceries), haunting a target creature.
- **When the haunted creature dies**: the haunt ability triggers, repeating the card's effect.
- **Haunt tracks the specific game object**: zone changes that create new objects break the link.
- **Haunt functions in the exile zone** — unlike most abilities, triggered haunt abilities fire from exile.
- **Self-haunt on sacrifice outlets**: gives on-demand triggering by sacrificing your own haunted creature.

## Canonical Example
**Cry of Contrition in Orzhov Control:**
Cast Cry of Contrition ({B}): target opponent discards a card (they discard a key threat).
During resolution: Cry of Contrition goes to GY → haunt triggers.
Target the opponent's Tarmogoyf (most dangerous creature they control).
Cry of Contrition is now in exile, haunting Tarmogoyf.
Later: kill Tarmogoyf with removal. Haunt trigger fires: Cry of Contrition's effect again — opponent discards another card.
Net: 1 mana spell that forced two discards (at different times) while also removing the creature.
Alternatively: haunt a token that you control (via Sorin, etc.) — sacrifice the token at will to trigger the discard on command.

**Example 2 — Haunt on a Permanent (Restless Bones):**
Restless Bones ({2}{B}): 1/1 Skeleton with "{B}: Regenerate target Skeleton."
Restless Bones dies (don't pay regeneration): haunt triggers.
Target opponent's strongest creature with haunt.
Opponent's creature eventually dies: haunt fires — "you may regenerate target Skeleton."
In a Skeleton tribal deck: free regeneration for your Skeletons when opponents' creatures die.
If opponent's creature is a token: haunt still fires (token went to GY, that's the trigger condition).

## Commonly Confused With
- **P211 (Flashback)** — Flashback casts from GY by paying a cost; haunt fires automatically when the haunted creature dies (no cost, but timing is tied to the creature's death).
- **P228 (Unearth)** — Unearth returns creature from GY for one-time use; haunt fires an effect when a DIFFERENT creature dies.
- **P164 (Rebound)** — Rebound re-casts a spell at next upkeep; haunt re-creates an effect when a targeted creature dies.
