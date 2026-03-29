---
id: p042
name: Annihilator — Trigger Timing and Multiple Attacker Stacking
category: triggered
cr_refs: [702.86a, 702.86b, 603.3b, 117.5]
tags: [annihilator, sacrifice, attack, trigger, stacking, multiple-attackers, defending-player, APNAP]
created: 2026-03-28
examples_count: 2
---

# P042 — Annihilator — Trigger Timing and Multiple Attacker Stacking

## Abstract
Annihilator triggers when the creature attacks — not when damage is dealt or when it becomes blocked. The trigger fires once per attacking creature with annihilator, as the creature attacks. Multiple annihilator creatures trigger separately, and multiple instances of annihilator on one creature each trigger separately too. The defending player must sacrifice permanents when the trigger resolves, which happens at the beginning of the declare blockers step after all attack triggers are placed on the stack. Crucially, the defending player must sacrifice before they can declare blockers.

## The Definitive Rule

**CR 702.86a** (verbatim): *"Annihilator is a triggered ability. 'Annihilator N' means 'Whenever this creature attacks, defending player sacrifices N permanents.'"*

**CR 702.86b**: Multiple instances of annihilator each trigger separately.

**CR 603.3b**: Multiple triggered abilities go on the stack in APNAP order, active player first.

## The Pattern

```
WHEN ANNIHILATOR TRIGGERS:
  "Whenever this creature attacks" = when declared as an attacker
  → Triggers during the declare attackers step (after the attack is declared)
  → Goes on the stack, resolves before blockers are declared

MULTIPLE ANNIHILATOR CREATURES:
  Two creatures attack, each with Annihilator 2:
  → Two triggers, each requiring defender to sacrifice 2 permanents
  → Total: 4 sacrifices required
  Triggers go on stack in APNAP / controller-chosen order
  Defender resolves each sacrifice separately (most trigger stacking is bad for them)

ANNIHILATOR N ON ONE CREATURE:
  A 10/10 with Annihilator 6 attacks → 1 trigger → defender sacrifices 6
  Two instances of Annihilator 3 on one creature → 2 triggers → defender sacrifices 6
  (Same total, but 2 triggers means 2 SBA checks between them,
   and defender could theoretically respond between)

DEFENDING PLAYER MUST SACRIFICE BEFORE BLOCKING:
  Annihilator trigger fires during declare attackers step
  Trigger goes on stack, resolves, defender sacrifices
  Only THEN does declare blockers step begin
  If defender sacrifices ALL creatures before blocking → no blockers
  If defender sacrifices their planeswalker → they lose it before combat

WHAT CAN'T BE SACRIFICED:
  Sacrificing is a cost-like action; you choose what to sacrifice
  If the defending player has 0 permanents, they sacrifice 0
  (No permanents = no obligation; you can only sacrifice what exists)
  You CAN choose to sacrifice any permanents — lands, creatures, everything

ANNIHILATOR AND COMBAT DAMAGE:
  Annihilator only fires "whenever this attacks" — NOT when it deals damage
  The sacrifice happens BEFORE blockers, not when damage would be dealt
  Even if the attacker is blocked and dealt with before damage, annihilator already resolved

DEFENDING PLAYER CHOICE:
  Active player declares attacks → annihilator triggers go on stack
  APNAP: defending player gets to put their triggers on stack in their preferred order
  But the defending player is the one SACRIFICING, not the active player
  The defending player chooses WHICH permanents to sacrifice when trigger resolves
```

## Definitive Conclusions

- **Annihilator triggers during declare attackers, before blockers.** The defending player must sacrifice before they can declare blockers.
- **Multiple annihilator triggers stack individually.** Two creatures with Annihilator 2 each trigger separately, causing 4 total sacrifices.
- **Having 0 permanents means sacrificing 0.** You can't sacrifice what doesn't exist; annihilator doesn't cause a loss condition on its own.
- **The defender chooses what to sacrifice.** They can pick strategically — though the situation is usually dire regardless.
- **Annihilator fires once per attack declaration, not per damage.** Blocking and killing the attacker before damage doesn't prevent the annihilator sacrifice.

## Canonical Example
**Emrakul, the Aeons Torn (Annihilator 6) attacks:**
Emrakul attacks. Annihilator 6 triggers. Before the defender can declare blockers, the trigger resolves: they must sacrifice 6 permanents. If they have 3 creatures, 2 lands, and 1 planeswalker, they sacrifice all 6. Now they have 0 permanents. No blockers possible. Emrakul deals 15 trampling damage. Combined with the fact that Emrakul was cast by taking an extra turn, this usually ends the game.

**Example 2 — Multiple annihilators in an attack:**
You attack with an Artisan of Kozilek (Annihilator 2) and a It That Betrays (no annihilator). You also have an effect giving Artisan another instance of Annihilator 2. Artisan has 2 instances: 2 triggers, each requiring sacrifice of 2 → 4 total sacrifices. Opponent had 6 permanents, now has 2. Blockers are then declared with their remaining 2 permanents.

## Commonly Confused With
- **P005 (Simultaneous Event Ordering)** — Multiple annihilator triggers from multiple creatures go on the stack in APNAP order. P005 covers the ordering mechanism; P042 covers the annihilator trigger itself.
- **P028 (Simultaneous ETB)** — Annihilator triggers fire on "attacks," not ETB. Not related to P028 directly.
