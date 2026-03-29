---
id: p457
name: Fight — Non-Combat Mutual Damage, Deathtouch Interaction, Enrage Triggers, and Protection
category: combat
cr_refs: [701.14, 702.2, 702.27, 120.4, 603.2, 704.5g, 702.16]
tags: fight, keyword-action, non-combat-damage, deathtouch, enrage, protection, indestructible, toughness-zero, simultaneous
created: 2026-03-29
examples_count: 8
---

# P457 — Fight — Non-Combat Mutual Damage, Deathtouch Interaction, Enrage Triggers, and Protection

## Abstract

**Fight** (CR 701.14) is a keyword action where each of two creatures deals damage equal to its power to the other — simultaneously, as non-combat damage. This creates a cluster of non-obvious interactions: fight damage is **not combat damage** (so combat-damage-gated abilities like lifelink's old wording, intimidate, and Cunning Sparkmage's damage require checking; most static combat-damage abilities still apply); fight with a **deathtouch** creature kills the opponent even if the opponent's power is 0; **Enrage** triggers fire on the creature that was dealt damage, NOT the one doing the fighting; **protection** from a quality prevents the protected creature from being dealt damage; and when one or both fighters die during resolution, the other still deals its damage (no intervening check).

## The Definitive Rules

**CR 701.14a verbatim:** *"A spell or ability may instruct a creature to fight another creature or it may instruct two creatures to fight each other. Each of those creatures deals damage equal to its power to the other creature."*

**CR 701.14b verbatim:** *"If one or both creatures instructed to fight are no longer on the battlefield or are no longer creatures, neither of them fights or deals damage. If one or both creatures are illegal targets for a resolving spell or ability that instructs them to fight, neither of them fights or deals damage."*

**CR 701.14c verbatim:** *"If a creature fights itself, it deals damage to itself equal to twice its power."*

**CR 701.14d verbatim:** *"The damage dealt when a creature fights isn't combat damage."*

**Key supporting rules:**
- **CR 702.2b** (Deathtouch): Damage from a deathtouch source destroys via SBA.
- **CR 120.4b** (Damage sequence): Replacement and prevention effects apply when damage is dealt.
- **CR 702.16** (Protection): Prevents damage from sources with the protected quality.

## The Pattern

```
FIGHT resolution sequence:
1. Check both creatures are still on battlefield and still creatures
   → If either is gone or no longer a creature: neither deals damage (abort)
   → This check happens at resolution, not at the beginning
2. Both creatures deal damage to each other SIMULTANEOUSLY
   → Creature A deals [A's power] damage to Creature B
   → Creature B deals [B's power] damage to Creature A
   → Power is checked AT THE TIME of fighting (current power with all effects)
3. Damage processing (CR 120.4):
   → Replacement effects apply (Indestructible has no special interaction; damage still marked)
   → Prevention effects apply (Circle of Protection: Green prevents fight damage from green creatures)
4. State-based actions (after damage):
   → Deathtouch: Creature dealt any nonzero damage by a deathtouch source → destroyed
   → Toughness ≤ 0: destroyed (if wither/infect put counters, toughness may drop)
   → Damage ≥ toughness: destroyed (unless indestructible)

Special cases:
  → 0-power creature fights: deals 0 damage to opponent → no SBA kill from damage alone
    (but deathtouch source dealing 0 damage: still 0 damage — deathtouch only activates
     on NONZERO damage dealt, so 0-power deathtouch creature does nothing via fight)
  → PROTECTION: prevents the damage FROM the quality source
    → If Creature B has protection from red, a red Creature A deals 0 damage to B
    → B still deals damage to A normally
  → ENRAGE on target: fires if target was dealt nonzero damage
  → ENRAGE on the fighting creature: fires if that creature was dealt nonzero damage
```

## Definitive Conclusions

**Fight is non-combat damage:**
- Lifelink (static ability) applies to all damage, combat or not. A creature with lifelink that fights gains life equal to the damage it deals (CR 702.15a: lifelink applies to "damage dealt").
- Deathtouch applies to fight damage — any nonzero damage from a deathtouch source destroys the target via SBA.
- Double Strike does NOT cause a creature to deal damage twice in a fight. Fight is not a combat damage step — it's a single, simultaneous damage event. A creature with double strike deals its power damage once in a fight.
- First Strike similarly does not affect fight — fight damage is simultaneous, one event.
- Combat damage triggers (e.g., "Whenever [this creature] deals combat damage to a player") do NOT trigger from fight — fight damage is explicitly not combat damage.

**Deathtouch + Fight:**
- A 0/1 deathtouch creature can fight and kill a 0/4: it deals 0 damage (0 power) — but wait, CR 702.2b says "dealt damage by a source with deathtouch." Zero damage is NOT damage. So a 0-power deathtouch creature fighting does NOT kill via deathtouch. The 0/4 survives.
- But a 1/1 deathtouch creature fighting a 10/10 indestructible creature: the 1/1 deals 1 deathtouch damage → SBA destroys the 10/10 (indestructible prevents destruction from damage marking, CR 702.12b, but deathtouch destruction happens via SBA 704.5h for creatures with toughness > 0 that were dealt damage by a deathtouch source — specifically 704.5i... let me verify: CR 704.5h says "a creature has been dealt damage by a source with deathtouch since the last time state-based actions were checked" and is destroyed. INDESTRUCTIBLE prevents this: CR 702.12b says "A permanent with indestructible can't be destroyed." So deathtouch doesn't kill indestructible creatures!

**Deathtouch + Fight + Indestructible correction:**
- Indestructible prevents destruction from deathtouch. A deathtouch creature fighting an indestructible creature: the indestructible creature takes damage from deathtouch source, but SBA "destroy" is replaced by indestructibility. The indestructible creature survives.
- However: if the fight damage results in toughness ≤ 0 (via wither/infect counters), that's a different SBA (704.5f: toughness ≤ 0) which indestructible does NOT protect against.

**Enrage + Fight:**
- A creature with Enrage that is targeted by a fight spell takes damage = the other creature's power. If nonzero, Enrage triggers on the Enrage creature.
- BOTH creatures take damage simultaneously; if BOTH have Enrage, BOTH Enrage triggers go on the stack.
- Using Pyrohemia or a fight spell on your own Enrage creature to trigger its ability is a common strategy.
- If one creature is removed in response to the fight spell, the fight doesn't happen at all (CR 701.14b) — no Enrage trigger.

**Protection + Fight:**
- A creature with protection from green can't be dealt damage by green sources. A green creature fighting it deals 0 damage. The protected creature still deals its damage normally.
- Protection from creatures (some unusual protection text) would prevent fight damage entirely from ANY creature.

## Canonical Examples

**Fight:**
- *Pit Fight* (Gatecrash): "Target creature you control fights another target creature." Classic fight spell. Kills your opponent's blocker while giving your creature deathtouch — wait, deathtouch on YOUR creature means even 1 damage from your creature kills the opponent's.
- *Savage Punch* (Khans of Tarkir): "Target creature you control fights target creature you don't control. Ferocious — That creature fights with double its power if you control a creature with power 4 or greater." Note: Ferocious doubles power for damage calculation.

**Fight + Enrage (Ixalan dinosaurs):**
- *Old-Growth Troll* + *Raging Swordtooth*: Raging Swordtooth has "When Raging Swordtooth enters the battlefield, it deals 1 damage to each other creature you control." That's a triggered ETB ability dealing damage, not a fight, but it triggers Enrage on your own dinos.
- Cast *Titanic Brawl* (fight spell): target your *Ripjaw Raptor* (with Enrage) to fight an opponent's creature. Opponent's creature deals damage to Ripjaw Raptor → Enrage triggers → draw a card.

**Fight + Deathtouch:**
- *Ulvenwald Tracker*: "{1}{G}, {T}: Target creature you control fights target creature you don't control." Running a 1/1 deathtouch creature alongside Ulvenwald Tracker: fight the opponent's 5/5 with your 1/1 deathtouch. Your creature takes 5 damage and dies; opponent's creature takes 1 deathtouch damage and is destroyed by SBA.

## Commonly Confused With

- **P105** (Deathtouch) — deathtouch kills via SBA on ANY nonzero damage; 0-power fight deals 0 damage so deathtouch doesn't activate; indestructible blocks deathtouch destruction
- **P452** (Enrage) — Enrage triggers on "dealt damage," which includes fight damage; fight with a 0-power creature deals 0 damage and doesn't trigger Enrage
- **P106** (First Strike/Double Strike) — double strike and first strike don't apply to fight; fight is one simultaneous damage event
- **P341** (Combat Steps) — fight is not in the combat phase; it's a spell/ability effect that deals non-combat damage
