---
id: p324
name: Infect, Wither, and Poison Counters — Damage That Bypasses Toughness and Life
category: combat
cr_refs: [702.90a, 702.90b, 702.90c, 702.80a, 120.3b, 120.3d, 704.5c, 120.3g]
tags: [infect, wither, poison-counter, minus-minus-counter, Phyrexian, Scars-of-Mirrodin, proliferate, toxic-vs-infect, indestructible-infect, Melira-infect, pump-spells, Blighted-Agent, Glistener-Elf, Ichorclaw-Myr, Phyrexian-Crusader]
created: 2026-03-29
examples_count: 2
---

# P324 — Infect, Wither, and Poison Counters — Damage That Bypasses Toughness and Life

## Abstract
**Infect** completely replaces how damage is dealt: damage to players gives poison counters instead of life loss; damage to creatures places -1/-1 counters instead of marking damage. **Wither** does the same to creatures (places -1/-1 counters) but still causes life loss to players. Both interact profoundly with game mechanics: -1/-1 counters from infect/wither reduce a creature's toughness to 0 (SBA kills it) rather than needing to "deal lethal damage" in the traditional sense. 10 poison counters = lose the game (CR 704.5c). **Toxic** is a modern revisit that gives poison counters in ADDITION to normal damage, unlike Infect which replaces damage entirely.

## The Definitive Rules

**CR 702.90b** (verbatim): *"Damage dealt to a player by a source with infect doesn't cause that player to lose life. Rather, it causes that source's controller to give the player that many poison counters."*

**CR 702.90c** (verbatim): *"Damage dealt to a creature by a source with infect isn't marked on that creature. Rather, it causes that source's controller to put that many -1/-1 counters on that creature."*

**CR 702.80a** (verbatim): *"Wither is a static ability. Damage dealt to a creature by a source with wither isn't marked on that creature. Rather, it causes that source's controller to put that many -1/-1 counters on that creature."*

**CR 120.3b** (verbatim): *"Damage dealt to a player by a source with infect causes that source's controller to give the player that many poison counters."*

**CR 120.3d** (verbatim): *"Damage dealt to a creature by a source with wither and/or infect causes that source's controller to put that many -1/-1 counters on that creature."*

**CR 120.3g** (verbatim): *"Combat damage dealt to a player by a creature with toxic causes that creature's controller to give the player a number of poison counters equal to that creature's total toxic value, in addition to the damage's other results."*

**CR 704.5c** (verbatim): *"If a player has ten or more poison counters, that player loses the game."*

## The Pattern

```
INFECT VS. WITHER VS. TOXIC:
  Infect (source deals damage):
    → To a player: poison counters instead of life loss
    → To a creature: -1/-1 counters instead of marked damage
  Wither (source deals damage):
    → To a player: normal life loss
    → To a creature: -1/-1 counters instead of marked damage
  Toxic N (source deals combat damage to a player):
    → To a player: normal life loss AND N poison counters
    → To a creature: normal marked damage (no infect/wither)

  SUMMARY:
    Infect: replaces damage entirely (counters or poison, never life/marked damage)
    Wither: replaces marked damage with -1/-1 counters; players still lose life
    Toxic: deals damage normally + adds poison counters

INFECT TO PLAYERS:
  No life loss. Only poison counters.
  A 5/5 infect creature connecting for 5: gives 5 poison counters (not 5 life loss).
  Player currently at 5 poison counters: needs 5 more to die. The 5/5 delivers the win.
  Since infect goes for poison (not life total), life gain is largely irrelevant.
  Lifelink + infect: the lifelink controller gains life (from the damage "dealt"), but the
    damage is still converted to poison for the player. So lifelink DOES work with infect.
    Actually: CR 120.3f: "Damage dealt by a source with lifelink causes that source's controller
    to gain that much life, in addition to the damage's other results."
    The damage event replaces life loss with poison counters. The lifelink side-effect: gain life.
    So a creature with infect + lifelink: gives poison counters AND the infect creature's controller gains life.
  Damage prevention: "prevent all damage to target player" → prevents the damage from being dealt.
    Since the damage isn't dealt: no poison counters are given. Prevention stops infect too.

INFECT TO CREATURES:
  -1/-1 counters placed. Not marked damage.
  Marked damage is cleared during cleanup. -1/-1 counters are NOT cleared during cleanup.
  A 1/1 infect creature hits a 5/5: places 1 -1/-1 counter. The 5/5 is now a 4/4.
  After combat: the 1/1 infect vs. 5/5 result: 5/5 survives combat (still alive, now 4/4).
  To kill a 5/5 with infect damage alone: need 5 total -1/-1 counters (from multiple attacks or large infect).
  Regeneration: a creature regenerated from infect damage... the infect placed -1/-1 counters.
    Regeneration removes damage marks. But infect damage placed counters, not marks.
    The counters REMAIN after regeneration. Regeneration doesn't remove counters.
    A regenerated 4/4 with 4 -1/-1 counters is now a 0/0... wait:
    Regeneration removes damage marks from the creature. The -1/-1 counters are NOT damage marks.
    SBA: 0/0 creature → destroyed again? Let's recalculate:
    Actually: if creature takes infect damage equal to its toughness (all as -1/-1 counters):
    SBA 704.5f: creature with toughness ≤ 0 goes to owner's GY. If the -1/-1 counters reduce toughness to 0: dies.
    Regeneration shield: "the next time this creature would be destroyed, instead remove all damage from it..."
    Toughness ≤ 0 SBA: that's NOT "would be destroyed" from damage. It's a different SBA.
    CR 704.5f: "Creature with toughness ≤ 0 is put into owner's GY. Regeneration can't replace this."
    So: infect reduces toughness to ≤ 0 via -1/-1 counters → SBA kills it. Regeneration can't save it.

WITHER TO CREATURES (key for defending):
  Wither: puts -1/-1 counters on blocking/attacking creatures.
  A 2/2 wither attacks a 3/3 blocker:
    2 damage: 2 -1/-1 counters on the 3/3 (now 1/1). 3 damage: 3 -1/-1 counters on the 2/2 (now -1/-1 → dead).
    Wait: wither damage → -1/-1 counters. Normal damage to the wither creature from the 3/3 → marked damage.
    So: 2/2 wither vs. 3/3. After combat damage:
    - 3/3 takes 2 wither damage: gets 2 -1/-1 counters → now 1/1. After cleanup: still 1/1.
    - 2/2 takes 3 marked damage (the 3/3 doesn't have wither): 2/2 with 3 damage → dies.
    Next turn: 1/1 still alive (the counters didn't go away at cleanup).
  Wither creatures: very effective at permanently weakening blockers.

PROLIFERATE AND POISON:
  Proliferate: choose any number of players and permanents with counters; put another of each kind.
  If a player has 1 poison counter: proliferate adds another. Now 2 poison.
  Proliferate + infect: deal 1 poison counter, then proliferate multiple times → quickly reach 10.
  Classic Scars of Mirrodin poison mechanic: infect creatures + Throne of Geth (proliferate artifact).
  "Infect aggro": race to 10 poison as fast as possible, ignoring the opponent's life total.

PUMP SPELLS AND INFECT:
  Infect creatures are usually small (1/1 or 2/2). They can be pumped for devastating single attacks.
  Giant Growth (+3/+3 until EOT): a 1/1 infect becomes 4/1 for one attack → 4 poison counters.
  Mutagenic Growth (pay 2 life or {G/P}): free pump.
  Groundswell (landfall — +4/+4 if land entered): potentially 5+ poison from one 1/1 infect.
  Blighted Agent ({1}{U}): 1/1 Infect, Unblockable. Unblockable + infect = guaranteed poison delivery.
    Turn 3: pump with 4 growth spells on one attack from Blighted Agent = 10 poison = win.
    This pattern was the "Infect" deck in Modern/Legacy.

INFECT INTERACTIONS:
  Deathtouch + infect: infect already puts -1/-1 counters. Deathtouch is about "lethal damage."
    Infect damage isn't "marked damage" — it's counters. Does deathtouch interact?
    CR 702.2b: "Any nonzero amount of combat damage assigned to a creature by a source with deathtouch is considered to be lethal damage."
    Infect damage to a creature places -1/-1 counters. But deathtouch applies to the damage assigned.
    So: 1 deathtouch infect damage → 1 -1/-1 counter on the creature. The creature now has toughness -1 less.
    If that reduces toughness to 0: SBA kills it.
    Actually: infect damage to a creature = -1/-1 counters. This might reduce toughness to 0 anyway.
    Deathtouch's "lethal damage" is about the "destroy" trigger. But infect damage → toughness ≤ 0 → destroyed differently.
    Net: any amount of infect damage to a creature will eventually kill it if enough counters accumulate.

MELIRA AND INFECT:
  Melira, Sylvok Outcast: "You can't get poison counters. Creatures you control can't have -1/-1 counters put on them."
  Melira protects you from infect completely:
    Infect damage to you: would give poison counters → Melira prevents poison counter placement.
    You take 0 poison damage effectively.
    Infect damage to your creatures: would place -1/-1 counters → Melira prevents it.
    Your creatures take... no damage? Not exactly: the damage is dealt but replaced.
    CR 702.90c: damage is placed as counters. Melira prevents the counters → the damage is essentially negated.
  In Commander: Melira shuts down all infect strategies targeting you.
  Also: Melira enables the infinite Persist loop (see P300) because -1/-1 counters can't be placed.
```

## Definitive Conclusions

- **Infect replaces damage entirely** — no life loss to players (only poison), no marked damage to creatures (only -1/-1 counters).
- **Wither puts -1/-1 counters on creatures only** — players still lose life from wither damage.
- **Toxic deals normal damage PLUS gives poison counters** — different from Infect; the damage and the poison are both real.
- **-1/-1 counters from infect/wither persist past cleanup** — unlike marked damage which is cleared each turn.
- **Toughness ≤ 0 from infect counters is a different SBA than destroy** — regeneration cannot prevent it.
- **Pump spells are central to infect's game plan** — making a 1/1 infect deliver 10 poison in one swing.
- **Melira, Sylvok Outcast completely negates infect** — prevents both poison counters and -1/-1 counter placement.

## Canonical Example
**Infect Aggro — Turn 4 Kill:**
Deck: "Infect" in Modern.
Turn 1: Forest. Cast Glistener Elf ({G}): 1/1 infect.
Turn 2: Forest. Hold up mana.
Opponent attacks. Pass turn.
Turn 3: Forest. Declare attack with Glistener Elf.
Opponent blocks with 2/2. You cast Vines of Vastwood ({G}, "can't be targeted by opponent's spells until EOT; or pay {G}{G} for +4/+4 until EOT").
Pay {G}{G}: Glistener Elf becomes 5/5 infect.
Opponent's 2/2 takes 5 wither damage? No: Glistener Elf has infect, not the blocker.
Wait: infect damage to the BLOCKER (a creature): puts -1/-1 counters.
5 damage from 5/5 infect → 5 -1/-1 counters on the 2/2 → 2/2 becomes -3/-3 → dies.
Glistener Elf takes 2 marked damage from the 2/2 (the 2/2 doesn't have infect).
SBAs: 2/2 dies (-3/-3 toughness). Glistener Elf has 2 marked damage (1/1, dies from SBA 704.5g).
Hmm: 5/5 with 2 damage = 5 power 5 toughness but 2 damage marked. Not dead (5 ≥ 2).
Glistener Elf survives! It's 5/5 until EOT after the combat damage step.
But wait: Glistener Elf blocked by the 2/2. The 2/2 blocked it. Glistener Elf dealt 5 to the blocker (infect: 5 -1/-1 counters). 2/2 dies. Glistener Elf dealt 0 to the player (it was blocked).
After combat: 0 poison to opponent (blocked). Not ideal. Need unblocked attacks.

Better plan:
Turn 3: attack with Glistener Elf. Opponent doesn't block.
Opponent's turn 4: they have removal.
Your turn 4: attack with Glistener Elf. No blockers.
During combat, Glistener Elf (1/1 infect) is about to connect for 1 poison.
Cast Invigorate ({G}: target gets +4/+0. This costs you 3 life instead of mana).
Glistener Elf becomes 5/1. Deals 5 infect damage → 5 poison counters.
Cast Might of Old Krosa (if it's your main phase, +4/+4; otherwise +2/+2). During combat → +2/+2.
Glistener Elf becomes 7/3. 7 poison counters total.
Cast Groundswell (landfall in effect → +4/+4 until EOT): Glistener Elf is 11/7.
That's 11 poison counters → opponent has 11 poison → loses the game.
Turn 3 kill is possible with the right hand. Turn 4 is typical.

**Example 2 — Wither vs. Infect in Creature Combat:**
Board: your 3/3 Wither creature attacks opponent's 4/4 blocker.
Combat damage step:
  Your 3/3 wither deals 3 damage to the 4/4: places 3 -1/-1 counters. 4/4 becomes 1/1.
  Opponent's 4/4 deals 4 damage to your 3/3: marks 4 damage on your 3/3.
SBAs: your 3/3 has 4 damage ≥ 3 toughness → destroyed.
Opponent's 4/4 is now 1/1. Survives combat.
At cleanup: marked damage cleared. But the -1/-1 counters remain. Opponent's creature is permanently 1/1.
NEXT TURN: opponent's 1/1 attacks. You block with a 1/1.
Infect 1/1 vs. 1/1 blocker: if YOUR creature has infect:
  1 infect damage to the 1/1 → 1 -1/-1 counter. 1/1 becomes 0/0 → dies.
  Your infect 1/1 also takes 1 damage from the blocker's normal damage → 1 marked damage on a 1/1 → dies.
Both die. Trade.
But: wither creature: the -1/-1 counters from previous turn weakened that 4/4 to 1/1.
It's permanently diminished. Even if it gained +1/+1 counters, it's still a smaller threat.
Wither's long-term effect: permanently weaken creatures the wither source fights.

## Commonly Confused With
- **P323 (Toxic)** — Toxic gives poison counters IN ADDITION to normal damage; infect REPLACES damage with poison. A 3/3 toxic 1 creature deals 3 damage AND gives 1 poison. A 3/3 infect creature gives 3 poison and 0 damage.
- **P300 (Undying/Persist)** — Melira + Persist creates an infinite loop because infect/wither can't place -1/-1 counters on your creatures (Melira's protection). Persist returns with -1/-1 counter → Melira prevents it → Persist triggers again → infinite.
- **P308 (Trample)** — Trample still applies with infect. Trample + infect: assign lethal infect damage (which may be just 1 with deathtouch) to the blocker, then the rest tramples through as infect damage (more -1/-1 on the blocker or more poison to the player? → the excess is dealt to the player, giving more poison counters).
- **P310 (Lifelink/Deathtouch)** — Deathtouch + infect: 1 deathtouch damage = "lethal" for trample assignment purposes; 1 infect damage = 1 -1/-1 counter. A 1/1 deathtouch infect can assign all its damage to a 10/10 blocker (1 = lethal for deathtouch trample) and trample the rest as infect (poison) to the player.
