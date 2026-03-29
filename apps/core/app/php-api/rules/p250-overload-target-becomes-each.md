---
id: p250
name: Overload — Pay Alternative Cost to Change "Target" to "Each"
category: stack
cr_refs: [702.96a, 702.96b, 702.96c]
tags: [overload, alternative-cost, text-change, mass-effect, Ravnica, Izzet, Cyclonic-Rift, Mizzium-Mortars, Vandalblast]
created: 2026-03-28
examples_count: 2
---

# P250 — Overload — Pay Alternative Cost to Change "Target" to "Each"

## Abstract
Overload is an alternative cost keyword: you may pay the overload cost instead of the normal mana cost, and if you do, the text of the spell changes all instances of "target" to "each" — making it affect all permanents or players matching the criteria instead of just one. This makes Overload spells function as either precise single-target removal/effects (at normal cost) or mass board effects (at overload cost, usually much higher). Cyclonic Rift is the most famous overload spell — single-target bounce for {1}{U} or mass bounce of ALL nonland permanents opponents control for {6}{U}. Overload is an Izzet (blue/red) mechanic from Return to Ravnica.

## The Definitive Rules

**CR 702.96a** (verbatim): *"Overload is a keyword that represents two static abilities that function while the spell with overload is on the stack. Overload [cost] means 'You may choose to pay [cost] rather than pay this spell's mana cost' and 'If you chose to pay this spell's overload cost, change its text by replacing all instances of the word "target" with the word "each."' Casting a spell using its overload ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.96b** (verbatim): *"If a player chooses to pay the overload cost of a spell, that spell won't require any targets. It may affect objects that couldn't be chosen as legal targets if the spell were cast without its overload cost being paid."*

**CR 702.96c** (verbatim): *"Overload's second ability creates a text-changing effect. See rule 612, 'Text-Changing Effects.'"*

## The Pattern

```
OVERLOAD:
  Alternative cost: pay overload cost instead of normal mana cost
  When paid: text changes "target" → "each"
  No targets required: the overloaded spell has NO targets
  Affects everything matching the criteria (can't be "aimed" or responded to by protection)

OVERLOAD + NO TARGETS:
  Overloaded spell: no targets → nothing to counter with countermagic that requires targets
  Protection from blue: doesn't stop Cyclonic Rift (no target = no targeting = protection doesn't prevent)
  Hexproof: doesn't stop overloaded Cyclonic Rift (hexproof = can't be TARGETED; overloaded Rift has no targets)
  This is CR 702.96b: "It may affect objects that couldn't be chosen as legal targets."
  An overloaded Rift hits hexproof and protection permanents because it doesn't target them

OVERLOAD + "EACH":
  "Target creature" → "each creature"
  "Target creature you control" → "each creature you control"
  "Target creature an opponent controls" → "each creature an opponent controls"
  The word "target" replaced by "each" — but the rest of the criteria stay

CYCLONIC RIFT ({1}{U}): "Return target nonland permanent an opponent controls to its owner's hand." Overload {6}{U}.
  Normal: {1}{U} → bounce one nonland permanent.
  Overload: {6}{U} → "Return each nonland permanent an opponent controls to its owner's hand."
  At instant speed: bounce EVERYTHING opponents have, permanently resetting their boards.
  7 mana for a mass board reset at instant speed — one of the most powerful cards in Commander.
  Overloaded Rift affects hexproof creatures, protection creatures, indestructible creatures (they bounce, not die).

MIZZIUM MORTARS ({1}{R}): "Mizzium Mortars deals 4 damage to target creature you don't control." Overload {3}{R}{R}{R}.
  Normal: {1}{R} → 4 damage to one creature.
  Overload: {3}{R}{R}{R} → 4 damage to EACH creature you don't control.
  Instant-speed mass removal (for 6 mana) that hits all opponents' creatures.
  Hits creatures with hexproof (no targeting).

VANDALBLAST ({R}): "Destroy target artifact an opponent controls." Overload {4}{R}.
  Normal: {R} → destroy one artifact.
  Overload: {4}{R} → destroy all artifacts opponents control.
  5 mana mass artifact removal.

OVERLOAD + TARGETING PROTECTION:
  The key ruling: overloaded spells have NO TARGETS (CR 702.96b).
  Therefore:
  - Hexproof: doesn't apply (not targeted)
  - Protection from blue: doesn't prevent Cyclonic Rift (protection stops damage/enchanting/blocking/TARGETING — no targeting here)
  - Shroud: doesn't apply (no targeting)
  - Ward: does NOT trigger (ward triggers on being TARGETED; overloaded spells don't target)
  The only "protection" from an overloaded spell: indestructibility (for mass damage) or landfall (Rift can't hit lands).
  Hexproof: not protection from overload.

OVERLOAD + SPLIT SECOND:
  If a spell with overload ALSO had split second (hypothetical): no one can respond
  Normally: overloaded spells can be responded to normally (no split second)
  Cyclonic Rift overloaded at opponent's end step: they can't play anything because it's their end step... wait
  Actually: casting Cyclonic Rift at instant speed means opponents have priority to respond
  The key play: cast overloaded Rift at the start of opponent's end step → they bounced everything → their turn ends → your turn with a clear board

OVERLOAD + COPIES:
  Can you copy an overloaded spell?
  Yes: the copy has the same text as the original (including "each" instead of "target")
  The copy of overloaded Cyclonic Rift: also bounces everything opponents control
  Twincast/Reverberate + Cyclonic Rift overloaded: two mass bounces
```

## Definitive Conclusions

- **Overload changes "target" to "each"** in the spell's text, making it affect all matching permanents.
- **No targets = no targeting** — hexproof, protection, ward don't prevent overloaded effects.
- **Cyclonic Rift** is the premier overload: instant-speed mass bounce of all opponent nonland permanents.
- **Copies of overloaded spells** retain the "each" text — overload two boards at once.
- **Overloaded spells at instant speed** (Cyclonic Rift, Mizzium Mortars) are asymmetric — choose when to deploy them.

## Canonical Example
**Cyclonic Rift in Commander:**
End of opponent's turn (right before your turn begins): opponent has 8 nonland permanents on the battlefield (creatures, planeswalkers, enchantments).
Cast Cyclonic Rift with overload ({6}{U}).
No targets required: the overloaded spell hits "each nonland permanent an opponent controls."
All 8 permanents return to their owner's hands. The opponent's board is empty.
Your turn: attack freely with your creatures (no blockers), cast your key spells.
End result: one spell at instant speed wiped 8 permanents without targeting any of them.
Hexproof creatures? Returned. Indestructible creatures? Returned (not destroyed). Everything bounces.
This is why Cyclonic Rift is arguably the strongest spell in Commander.

**Example 2 — Vandalblast Asymmetric Wipe:**
Opponent controls 5 artifacts (Sol Ring, Mana Crypt, Signets, Gilded Lotus).
You control 2 artifacts (Commander's Sphere, Swiftfoot Boots).
Cast Vandalblast with overload ({4}{R}): destroys all artifacts OPPONENTS control.
Your artifacts survive (Vandalblast says "opponents control" — your permanents unaffected).
Opponent loses all 5 artifacts: -5 mana artifacts destroyed.
Asymmetric mass artifact removal: a key Commander / Legacy combo tool.

## Commonly Confused With
- **P152 (various area effects)** — Many spells naturally affect "each"; Overload specifically changes "target" text via an alternative cost rather than having separate modes.
- **P230 (Entwine)** — Entwine pays extra to get ALL modes; Overload pays alternative cost to change single-target to mass effect.
- **P241 (Replicate)** — Replicate copies the spell multiple times; Overload changes the scope of a single spell to affect multiple targets.
