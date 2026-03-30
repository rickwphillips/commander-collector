---
id: p482
name: Escalate, Battle Cry, and Boast — Per-Extra-Mode-Cost, All-Attackers-Pump, and Once-Per-Combat Activation
category: costs
cr_refs: [702.114, 702.85, 702.131, 601.2b, 508.1, 603.2, 117.1]
tags: escalate, battle-cry, boast, formal-keyword, per-mode-cost, attack-pump, once-per-combat, eldritch-moon, mirrodin-besieged, kaldheim
created: 2026-03-29
examples_count: 6
---

# P482 — Escalate, Battle Cry, and Boast — Per-Extra-Mode-Cost, All-Attackers-Pump, and Once-Per-Combat Activation

## Abstract

Three formal keywords from different sets with modest but non-obvious rules: **Escalate** (CR 702.114, Eldritch Moon) is an additional cost on modal spells that lets you choose more modes by paying the escalate cost for each additional mode beyond the first; **Battle Cry** (CR 702.85, Mirrodin Besieged) is a triggered ability that gives each OTHER attacking creature +1/+0 whenever the Battle Cry creature attacks; and **Boast** (CR 702.131, Kaldheim) is an activated ability that can only be used once per turn and only if the creature attacked this turn. All three interact with spell copying, multiple combat phases, and attack-triggered abilities.

## The Definitive Rules

### Escalate (CR 702.114)
**CR 702.114a verbatim:** *"Escalate [cost] means 'As an additional cost to cast this spell, you may choose more than one mode. You pay [cost] for each chosen mode beyond the first.'"*

Escalate is on modal spells (spells that say "Choose one" or "Choose two"). Normally a "Choose one" spell picks exactly one mode. With Escalate, you can pick additional modes by paying the escalate cost per additional choice.

### Battle Cry (CR 702.85)
**CR 702.85a verbatim:** *"Whenever this creature attacks, each other attacking creature gets +1/+0 until end of turn."*

Battle Cry is a triggered ability. Multiple Battle Cry creatures each trigger separately, each giving ALL OTHER attacking creatures +1/+0. In a large attack, multiple Battle Cry triggers stack for each non-Battle-Cry attacker.

### Boast (CR 702.131)
**CR 702.131a verbatim:** *"Boast — [Cost]: [Effect]. Activate only if this creature attacked this turn and only once each turn."*

Boast is an activated ability with two restrictions: (1) the creature must have attacked this turn (attacked at all, including during an additional combat phase); (2) it can only be activated once each turn.

## The Pattern

```
ESCALATE pattern:
"Choose one" with Escalate:
  → Without escalate payment: choose exactly 1 mode
  → For each additional mode beyond the first: pay escalate cost
  → Escalate cost is the same each time (cumulative per additional mode)
  → "Choose one" + 2 additional modes via Escalate: pay escalate cost × 2
  → "Choose up to three" + Escalate: the "up to three" allows choosing 1-3; Escalate
    allows paying for modes beyond the first at escalate cost per mode
  → Copying an Escalate spell: the copy has the same modes chosen; no escalate cost for copy
  → Escalate vs. Spree (P477): Escalate has ONE cost per additional mode;
    Spree has INDIVIDUAL costs per mode (each mode has its own additional cost)
  → Both require at least 1 mode choice (can't choose 0)

BATTLE CRY pattern:
Trigger: "Whenever this creature attacks, each OTHER attacking creature gets +1/+0"
  → Each Battle Cry creature independently triggers
  → In a 5-attacker board with 2 Battle Cry creatures:
    → Battle Cry A triggers: the OTHER 4 attackers each get +1/+0
    → Battle Cry B triggers: the OTHER 4 attackers each get +1/+0
    → Battle Cry creatures each give the other Battle Cry creature +1/+0 (they're "other attackers")
    → Net: each non-Battle-Cry attacker gets +2/+0 (from both triggers)
    → Each Battle Cry creature gets +1/+0 (from the other Battle Cry trigger)
  → Multiple combat phases: Battle Cry creatures attacking again in a second combat
    → Their triggers fire again → more pumps
  → Battle Cry only applies until end of turn (not permanent)

BOAST pattern:
Restrictions:
  1. "Only if this creature attacked this turn": must have been declared as attacker
     → Attacked = was declared as an attacker this turn (even in additional combat phases)
     → If the creature was declared an attacker and then removed from combat (blocked, tapped
       by opponent, removed from combat by effect), it "attacked" (was declared) → Boast still
       unlocks
     → A creature that did NOT attack this turn can't activate Boast
  2. "Only once each turn": one activation regardless of how many combat phases
  → Boast is activated at any time you have priority (not just during combat)
    → You can Boast in your main phase after combat, or during opponent's turn
    → Wait: "only if this creature attacked this turn" → it has to have attacked BEFORE activation
    → So you can't Boast before your creature has attacked (must attack first)
    → Can Boast during combat after the creature has been declared as attacker? YES
      → After declare attackers step, the creature "attacked this turn" → Boast unlocks
  → Boast is sorcery-speed or instant-speed based on the card's text — check each card
    (most Boast abilities don't specify timing restriction beyond "attacked this turn")
```

## Definitive Conclusions

**Escalate:**
- Escalate makes "Choose one" spells into efficient combo-spells when you have extra mana. Instead of casting two separate modal spells, you cast one spell for the cost of both.
- Escalate cost is a cost, not an additional mode restriction. You can choose the same mode twice? No — the spell says "choose [N] modes that haven't been chosen." Each mode can only be chosen once unless the card says "you may choose the same mode more than once."
- Key card: *Collective Brutality* (EMN): "Escalate—Discard a card. Choose one or more — Target opponent reveals their hand. You choose an instant or sorcery card from it. That player discards that card; Target creature gets -2/-2 until end of turn; Target opponent loses 2 life and you gain 2 life." Pay escalate (discard a card) for each additional mode beyond the first. Choosing all three modes requires discarding 2 cards total.
- Key card: *Collective Defiance* (EMN): Red version. Escalate {discard a card}. Three modes available.

**Battle Cry:**
- Battle Cry is a linear aggro keyword: it rewards attacking with large groups. Battle Cry creatures are typically small (1/1 or 2/1) but increase the whole team's power.
- Multiple Battle Cry creatures form a "pump chain": a 5-creature attack with 3 Battle Cry creatures means non-Battle-Cry creatures get +3/+0, and Battle Cry creatures get +2/+0 (from the other two Battle Cry triggers).
- Key card: *Hero of Bladehold* (MBS): "Battle cry. Whenever Hero of Bladehold attacks, create two 1/1 white Soldier creature tokens that are tapped and attacking." Creates more attackers who also benefit from Battle Cry. (The tokens enter tapped and attacking — they don't have haste as a keyword; they simply enter already in the attacking state.)
- Key card: *Signal Pest* (MBS): "Battle cry. Signal Pest can't be blocked except by creatures with flying or reach." A 0/1 that can only be blocked by flying/reach creatures — not unblockable, but hard to block — that pumps all other attackers.

**Boast:**
- Boast is essentially a "reward for attacking" activated ability. It creates decision points: attack to unlock the boast, or hold back for blocking and forfeit the boast activation.
- The once-per-turn restriction matters in extra-combat scenarios: even with multiple combat phases (via extra combat effects), you only get one Boast activation per turn.
- Key card: *Usher of the Fallen* (KHM): "Boast — {1}{W}: Create a 1/1 white Human Warrior creature token." Requires attacking to unlock, creates a token for {1}{W}. (Note: Magda, Brazen Outlaw does NOT have Boast — she has "Whenever a Dwarf you control becomes tapped, create a Treasure token" and "Sacrifice five Treasures: Search your library for an artifact or Dragon card...")
- Key card: *Usher of the Fallen* (KHM): "Boast — {1}{W}: Create a 1/1 white Human Warrior creature token."

## Canonical Examples

**Escalate:**
- *Collective Brutality* with all 3 modes: discard 2 cards total (1 for Escalate + 1 as mode 1's cost) → opponent discards + destroy a small creature + life drain. All three effects for significant investment.

**Battle Cry:**
- Three 1/1 Battle Cry creatures + three 3/3 creatures attack. Non-battle-cry 3/3s each get +3/+0 → each becomes 6/3. Each Battle Cry creature gets +2/+0 from the other two Battle Cry triggers → 3/1 each.

**Boast:**
- *Usher of the Fallen*: Attack → after declare attackers, Boast {1}{W} → create a 1/1 Human Warrior token. Build up a board of tokens through repeated attacks.

## Commonly Confused With

- **P477** (Plot/Spree/Offspring) — Spree has per-mode additional costs; Escalate has a single cost paid per mode beyond the first; both are multi-mode additional cost mechanics but with different cost structures
- **P475** (Exert/Enlist/Saddle) — Boast and Exert both require having attacked; Exert is a choice at declare attackers with a downside (skip untap); Boast is an activated ability unlocked after attacking
- **P451** (Battalion) — Battle Cry triggers on ANY attack (solo); Battalion requires 3+ attackers to trigger; both are attack-triggered army buffs
- **P429** (Exalted) — Exalted buffs the creature when it attacks ALONE; Battle Cry buffs all OTHER attackers; opposite design philosophies for attack bonuses
