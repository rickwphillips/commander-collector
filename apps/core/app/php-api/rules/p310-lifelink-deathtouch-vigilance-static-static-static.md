---
id: p310
name: Lifelink, Deathtouch, and Vigilance — Static Abilities With Non-Obvious Interactions
category: combat
cr_refs: [702.15a, 702.15b, 702.15e, 702.2a, 702.2b, 702.20a, 702.20b]
tags: [lifelink, deathtouch, vigilance, static-ability, life-gain, one-damage-lethal, no-tap-to-attack, Ajani-Pridemate, Wall-of-Denial, Vampire-Nighthawk, Glissa-Sunslayer, lifelink-triggers, deathtouch-trample]
created: 2026-03-29
examples_count: 2
---

# P310 — Lifelink, Deathtouch, and Vigilance — Static Abilities With Non-Obvious Interactions

## Abstract
Three static combat abilities with non-obvious rules. **Lifelink** causes the source's controller to gain life whenever it deals damage — this is a static ability (not triggered), so multiple lifelink sources generate separate life-gain events. **Deathtouch** makes any damage from this source lethal to creatures — importantly, the 1-damage-is-lethal rule applies during combat and interacts dramatically with trample. **Vigilance** lets a creature attack without tapping — it can attack AND still tap for activated abilities, and can potentially be declared as a blocker on your turn (unusual but possible).

## The Definitive Rules

**CR 702.15b** (verbatim): *"Damage dealt by a source with lifelink causes that source's controller, or its owner if it has no controller, to gain that much life (in addition to any other results that damage causes)."*

**CR 702.15e** (verbatim): *"If multiple sources with lifelink deal damage at the same time, they cause separate life gain events."*

**CR 702.2a** (Deathtouch, verbatim): *"Deathtouch is a static ability. A creature with deathtouch deals lethal damage to creatures it damages."*

**CR 702.2b** (verbatim): *"Any nonzero amount of combat damage assigned to a creature by a source with deathtouch is considered to be lethal damage, regardless of that creature's toughness. See rules 510.1c–d."*

**CR 702.20b** (Vigilance, verbatim): *"Attacking doesn't cause creatures with vigilance to tap."*

## The Pattern

```
LIFELINK:
  When a source with lifelink deals any damage: its controller gains that much life.
  This is a STATIC ability (not a triggered ability that goes on the stack).
  The life gain happens simultaneously with the damage being dealt.

  LIFELINK + MULTIPLE SOURCES:
    CR 702.15e: multiple lifelink sources create SEPARATE life gain events.
    Example: two creatures with lifelink each deal 3 damage simultaneously.
    Two separate life gain events of 3: controller gains 3, then gains 3 separately.
    With Ajani's Pridemate (ETB counter when you gain life):
      Pridemate sees TWO life gain events. Gets two +1/+1 counters.
      If they were ONE event (6 life gain): only one counter.
      But they're separate: two counters.
    Important: even if you gain 6 life total, the NUMBER of events matters for triggered synergies.

  LIFELINK + COMBAT DAMAGE:
    Blocked creature with lifelink: still gains life from the damage dealt to the blocker.
    2/2 Lifelink vs. 3/3: deals 2 damage to 3/3. Controller gains 2 life. Then 3/3 deals 3 back (2/2 dies).
    Net: gained 2 life, lost 2/2 creature.

  LIFELINK + NONCOMBAT DAMAGE:
    Lifelink works on all damage from that source, not just combat.
    Shock deals 2 damage: if Shock had lifelink (it can't normally, but via effects):
      The controller would gain 2 life from Shock's 2 damage.
    Soul Warden: "Whenever a creature enters, you gain 1 life." Not lifelink — that's a triggered ability.
    True lifelink: only on creatures dealing damage.

  LIFELINK + PREVENTION:
    If damage is prevented: no life is gained (prevented damage is not "dealt").
    Fog: prevents all combat damage. 0 damage dealt. 0 life gained.
    Partially prevented: gain life equal to the unprevenved portion.

  NOTABLE LIFELINK CARDS:
    Vampire Nighthawk ({1}{B}{B}): 2/3 Flying, Deathtouch, Lifelink.
      Attacks → hits opponent for 2 → gain 2 life. Even blocked → gains life from blocker damage.
      Three keywords in one 3-mana card: among the most efficient in Magic.

    Baneslayer Angel ({3}{W}{W}): 5/5 First Strike Lifelink. Protection from Demons and Dragons.
      Every attack: gain 5 life + first strike safety + protection.
      Former Standard powerhouse.

DEATHTOUCH:
  Any nonzero damage from a deathtouch source to a creature is lethal.
  "Lethal damage" = enough to destroy the creature via "too much damage" SBA.
  CR 510.1c: if a creature has deathtouch, 1 damage is considered lethal.

  DEATHTOUCH MISCONCEPTIONS:
    (A) "Any damage kills it instantly!" NO — deathtouch makes it lethal, but SBAs resolve later.
        During combat: 1 deathtouch damage marks the creature. It dies when SBAs check (after damage step).
        Before SBAs: opponent can still cast a Giant Growth to save it (nope, can they? After damage step:
        SBAs check before priority. Can't respond between damage being dealt and SBAs).
        Actually: SBAs check immediately. No window between damage and SBA check.
        Once deathtouch damage is on a creature → dies at next SBA check.

    (B) "1 deathtouch damage kills ANY creature including those with Indestructible!"
        WRONG. Deathtouch makes damage "lethal" for the SBA "destroy" check.
        Indestructible creatures can't be destroyed. They take the 1 damage (marked), but aren't destroyed.
        Deathtouch DOES NOT kill indestructible creatures via damage.
        To kill an indestructible creature: reduce toughness to 0 (-X/-X effects), exile, sacrifice.

    (C) "Deathtouch applies to players!" WRONG — deathtouch only affects creatures.
        1 damage from a deathtouch source to a player = 1 damage. Player doesn't die from 1 deathtouch.

  DEATHTOUCH + TRAMPLE (see P308):
    Combined: assign 1 damage to any blocker (1 is lethal with deathtouch), rest tramples to player.

  DEATHTOUCH + FIRST STRIKE:
    First strike step: deals 1 deathtouch damage to a blocker → blocker marked as "lethally damaged."
    SBAs after step 1: blocker dies (lethal deathtouch damage).
    Step 2: no blocker to deal damage back. The deathtouch creature takes 0.
    Result: any creature with first strike + deathtouch kills ANY blocker in step 1 and takes no damage.
    Even a 1/1 with first strike and deathtouch kills a 10/10 blocker without dying.
    Glissa, the Traitor ({B}{G}{G}): 3/3 First Strike Deathtouch. "When opponent's creature dies, return an artifact from GY to hand."
    Glissa: kills any blocker via first strike + deathtouch, then often triggers her own ETB recursion.

VIGILANCE:
  Static ability: "Attacking doesn't cause creatures with vigilance to tap."
  When a vigilance creature is declared as an attacker: it doesn't tap.
  It remains untapped through the attack → can still activate tap abilities after attacking.
  Can also still block (if somehow you could block during your own turn — unusual, but possible with certain effects).

  VIGILANCE INTERACTIONS:
    Tap abilities: creature can attack AND use its tap ability in the same turn.
    Example: Stoneforge Mystic ({1}{W}): "Tap: Search library for Equipment."
    If Stoneforge Mystic had Vigilance (it doesn't normally): attack AND tutor for Equipment in same turn.
    Creatures that both attack and tap: Cryptic Serpent with Vigilance granted would be insane.

    MORE COMMON: a knight with vigilance + tap for mana (Bloom Tender with vigilance):
    Bloom Tender taps → produces mana. But it's tapped. With vigilance: attack AND tap for mana.

    Cathedral of War (Exalted): "Whenever a creature attacks alone, it gets +1/+1."
    Vigilance + Exalted: attack alone with vigilance, get the +1/+1, remain untapped to activate abilities.

    VIGILANCE + DEFENDER:
    Creatures with Defender can't attack. Vigilance on a Defender is functionally useless
    (can't attack, so "doesn't tap when attacking" never applies).

  VIGILANCE NOTABLE CARDS:
    Loxodon Smiter ({1}{G}{W}): 4/4. "Can't be countered. If you discard it, put it onto battlefield."
      Also has no vigilance — this was an example of a good 3-drop without vigilance.
    Knight of the White Orchid ({W}{W}): 2/2 First Strike. "When ETBs, if opponent controls more lands,
      search for a Plains."
      Has vigilance? Checking: not by default, but many knight-themed creatures do.
    Angelic Overseer ({3}{W}{W}): 5/3. "Flying, Vigilance. As long as you control a Human, it's
      indestructible and hexproof."
      Vigilance + conditionally indestructible hexproof = powerful combination.

LIFELINK + DEATHTOUCH + VIGILANCE TOGETHER:
  Vampire Nighthawk: Flying, Deathtouch, Lifelink. Missing Vigilance but strong without it.
  Serra's Emissary ({4}{W}{W}{W}): Flying, Lifelink, Vigilance. Plus immunity ability.
  Lyra Dawnbringer ({3}{W}{W}): 5/5 Flying, First Strike, Lifelink, Vigilance.
    Attacks → doesn't tap → has first strike + lifelink → gains 5 life + stays untapped.
    Classic finisher: difficult to attack into (first strike), blocks reliably next turn (vigilance), lifelink races.
```

## Definitive Conclusions

- **Lifelink is a static ability** — life gain happens simultaneously with damage, not as a separate event.
- **Multiple lifelink sources create separate life-gain events** — relevant for "whenever you gain life" synergies.
- **Deathtouch does NOT kill indestructible creatures** — deathtouch marks damage as lethal for the "destroy" check, but indestructible prevents destruction.
- **Deathtouch + first strike kills any blocker without the first-striker taking damage** — the blocker dies in step 1 before it can deal damage in step 2.
- **Vigilance lets a creature attack and still use tap abilities** — it doesn't tap when attacking.

## Canonical Example
**Vampire Nighthawk Board Control:**
Turn 3: cast Vampire Nighthawk ({1}{B}{B}): 2/3 Flying, Deathtouch, Lifelink.
Opponent's board: 6/6 Wurm (no flying, no evasion).
Attack with Nighthawk: 6/6 Wurm can't block (no flying).
Nighthawk deals 2 to opponent. Lifelink: gain 2 life.
Opponent attacks with 6/6 Wurm:
  Declare Nighthawk as blocker.
  Combat damage step: Nighthawk deals 2 deathtouch damage to Wurm.
  Wurm deals 6 damage to Nighthawk.
  SBAs: Nighthawk has 6 damage, 3 toughness. Dead. Wurm has 2 deathtouch damage = lethal. Dead.
  Lifelink from that exchange: Nighthawk dealt 2 → gain 2 life.
  Net: gained 4 life total (2 from attack, 2 from blocking), killed a 6/6 with a 3-mana creature.
Vampire Nighthawk: efficiently kills large creatures (deathtouch), provides life advantage (lifelink), attacks freely (flying).

**Example 2 — Lyra Dawnbringer Racing:**
Board: Lyra Dawnbringer (5/5 Flying, First Strike, Lifelink, Vigilance). Life total: 10.
Opponent has: 5/5 Flying creature. Life total: 10.
Your turn: attack with Lyra.
Lyra doesn't tap (vigilance). First strike: deals damage in step 1.
Opponent blocks with their 5/5 Flying.
Step 1: Lyra (first strike) deals 5 to 5/5 → 5/5 dies. SBAs. Lifelink: gain 5. You're at 15.
Step 2: no blocker remaining. Lyra deals 5 to player. Wait: Lyra is blocked but blocker died.
CR 702.19d: "If blocked but no creatures blocking when damage assigned..." → deals to player?
No: that's for TRAMPLE. Without trample, a blocked creature with no remaining blockers deals 0 to player.
So: Lyra blocked, blocker dies in step 1, Lyra deals 0 in step 2 (no trample).
Wait, actually: "The rules for... 702.7b" says creatures that dealt damage in first step AND have double strike deal in step 2. First strike (without double strike) does NOT deal in step 2.
So Lyra with just first strike (no double strike): deals damage in step 1. Nothing in step 2.
Lifelink from step 1: gain 5 (damage to the 5/5). You go from 10 to 15.
Opponent's turn: their 5/5 Flying is dead. They must attack with something else.
Lyra stays untapped (vigilance): can block!
Their 3/3 attacks: Lyra blocks, kills it via first strike + 5 power (3/3 can't survive).
Lifelink: more life gain.
Lyra is a complete defensive + offensive powerhouse: attacks safely, stays back as a blocker.

## Commonly Confused With
- **P309 (First Strike/Double Strike)** — Deathtouch + first strike creates a powerful combination covered in both patterns; P309 focuses on the damage step mechanics, P310 focuses on the deathtouch and lifelink interactions.
- **P033 (Indestructible)** — Deathtouch doesn't kill indestructible creatures; this is a common point of confusion worth noting in both patterns.
- **P308 (Trample)** — Deathtouch + trample is covered in P308 but reinforced here; 1 deathtouch damage is lethal for trample's "must assign lethal" requirement.
- **P290 (Planeswalker Loyalty)** — Lifelink damage dealt to players still gains life; attacking a planeswalker with lifelink: the damage goes to the planeswalker (loyalty counters removed), not the player. Does lifelink trigger? Yes: the damage was dealt by the lifelink source, so the controller gains life.
