---
id: p347
name: Proliferate, Infect, Poison Counters, Energy Counters, and Alternate Win Conditions
category: zones
cr_refs: [701.34a, 701.34b, 702.90a, 702.90b, 702.90c, 702.80a, 120.3b, 120.3d, 120.3g, 122.1f, 122.1a, 107.14, 702.164a, 702.164c, 104.3d]
tags: [proliferate, infect, poison, wither, energy-counter, experience-counter, toxic, alternate-win, ten-poison-loss, minus-counters, Blighted-Agent, Skithiryx, Atraxa-Praetors-Voice, Throne-of-Eldraine, Kaladesh, Alaundo-the-Seer, Atraxa-proliferate, Phyrexian-Crusader, Viral-Drake]
created: 2026-03-29
examples_count: 2
---

# P347 — Proliferate, Infect, Poison Counters, Energy Counters, and Alternate Win Conditions

## Abstract
**Infect** changes how damage works: damage to players gives **poison counters** instead of life loss; damage to creatures puts **-1/-1 counters** instead of marking damage (702.90b–c). **Poison counters** accumulate on players; at 10+, that player loses as an SBA (122.1f). **Wither** (702.80a) gives -1/-1 counters to creatures but doesn't affect players. **Proliferate** (701.34a) adds one counter of EACH type already present to any chosen players/permanents — it can simultaneously advance poison, +1/+1 counters, loyalty counters, lore counters, and more. **Energy counters** ({E}) are player resources paid for activated abilities. **Toxic** (702.164a) gives additional poison counters equal to its value IN ADDITION to regular damage.

## The Definitive Rules

**CR 702.90b** (verbatim): *"Damage dealt to a player by a source with infect doesn't cause that player to lose life. Rather, it causes that source's controller to give the player that many poison counters."*

**CR 702.90c** (verbatim): *"Damage dealt to a creature by a source with infect isn't marked on that creature. Rather, it causes that source's controller to put that many -1/-1 counters on that creature."*

**CR 702.80a** (verbatim): *"Wither is a static ability. Damage dealt to a creature by a source with wither causes that source's controller to put that many -1/-1 counters on that creature, rather than having that damage be marked on that creature."*

**CR 701.34a** (verbatim): *"To proliferate means to choose any number of permanents and/or players that have a counter, then give each one additional counter of each kind that permanent or player already has."*

**CR 122.1f** (verbatim): *"If a player has ten or more poison counters, that player loses the game as a state-based action. A player is 'poisoned' if they have one or more poison counters."*

**CR 702.164c** (verbatim): *"Combat damage dealt to a player by a creature with toxic causes that creature's controller to give the player a number of poison counters equal to that creature's total toxic value, in addition to the damage's other results."*

**CR 107.14** (verbatim): *"The energy symbol is {E}. It represents one energy counter. To pay {E}, a player removes one energy counter from themselves."*

## The Pattern

```
INFECT (CR 702.90):
  DAMAGE TO PLAYERS:
    Normal damage: player loses life equal to damage amount.
    Infect damage to player: player gains POISON COUNTERS equal to damage amount. NO life loss.
    Example: Blighted Agent (1/1 infect, unblockable) deals 1 damage to a player → 1 poison counter.
    If you pump it to 4/4: deals 4 damage → 4 poison counters. Two hits = 8 poison. Almost lethal.
  DAMAGE TO CREATURES:
    Normal damage: marked damage (doesn't modify characteristics directly).
    Infect damage to creature: put -1/-1 counters on the creature. No damage marks.
    A 2/2 creature takes 2 infect damage: gets two -1/-1 counters → effectively 0/0 → dies (SBA 704.5f).
    This bypasses damage-dealing mechanics: a 1/1 infect creature can kill a 5/5 if it deals 5 infect
      damage over time (5 hits of 1 each, or 5 damage at once).
    Wait: can't deal 5 infect damage with a 1/1 in one hit. But over multiple turns with -1/-1 stacking.
  INFECT AND INDESTRUCTIBLE:
    Indestructible prevents DESTRUCTION, not -1/-1 counters.
    An indestructible 4/4 hit by 5 infect damage: gets five -1/-1 counters → becomes -1/-1.
    SBA 704.5f: creature with 0 or less toughness → GY. Indestructible doesn't prevent this!
    So: infect DOES kill indestructible creatures (via 704.5f, not 704.5g).
  PROTECTION FROM [QUALITY] vs. INFECT:
    Protection prevents damage from [quality] sources. If a creature has protection from black
      and is blocked by a black infect creature: the infect creature CAN'T deal damage to the
      protected creature (protection prevents the damage). So no -1/-1 counters.
    BUT: non-combat infect damage (spell dealing damage) — if the source is [quality]:
      protection still prevents it.
  LIFE GAIN INTERACTION:
    Infect damage to players: doesn't cause life loss. So life gain doesn't "offset" infect damage.
    You can't gain life to counteract poison counters.
    Poison counters are a separate resource from life. They accumulate independently.
    ONLY way to remove poison counters: specific effects (Leeches ({2}{W}: "Target player loses all
      poison counters."), or some newer cards).
  INFECT IN MULTIPLAYER:
    10 poison counters per PLAYER. Each player has their own poison counter count.
    Dealing 10 poison to one player: that player loses. Others unaffected.

WITHER (CR 702.80a):
  Similar to infect's creature-damage part: puts -1/-1 counters instead of marking damage.
  DIFFERENCE FROM INFECT: wither only affects creature damage. It does NOT change player damage.
    Wither source deals damage to a player: player LOSES LIFE normally.
    Infect source deals damage to a player: player gains POISON COUNTERS.
  Wither is largely deprecated (post-Shadowmoor). Infect is the modern version with player poison.

TOXIC (CR 702.164a–c):
  DIFFERENCE FROM INFECT: toxic gives ADDITIONAL poison counters, not INSTEAD of life loss.
    Infect: player takes 2 infect damage → 2 poison, 0 life lost.
    Toxic 2: player takes 2 damage → 2 life lost + 2 poison counters.
  Both life loss AND poison. More dangerous in creature combat.
  "Total toxic value" (702.164b): if a creature has toxic 2 and gains toxic 1 → total toxic value = 3.
    Gives 3 poison counters per hit.
  Example: Phyrexian Crusader ({1}{B}{B}): 2/2 first strike, protection from red and white, infect.
    Deals infect damage: player gets poison, creature gets -1/-1 counters. No life loss to player.
  Example: Venerated Rotpriest ({G}): "whenever a creature you control becomes the target of a spell,
    target opponent gets a poison counter." (Not toxic — a triggered ability, but poison-relevant.)

POISON COUNTER WIN CONDITION:
  10 or more poison counters: player loses (SBA 122.1f).
  Standard infect deck goal: deal exactly 10 infect damage to player.
  With pump spells: pump attacker to deal multiple counters per hit.
  Blighted Agent (1/1 unblockable infect): 10 turns at base. With pump: faster.
  Typical infect clock: 3-4 turns with multiple pump spells.
    Turn 1: Glistener Elf (1/1 infect).
    Turn 2: attack for 1 poison. Pump with Vines of Vastwood (hexproof + +4/+4) → 5 infect damage.
      5 poison counters from one combat.
    Turn 3: attack again with pump → another 5+ damage → 10 poison. Win.

PROLIFERATE (CR 701.34a):
  Choose any number of permanents AND/OR players that have at least one counter.
  Each chosen permanent/player gets ONE additional counter of EACH type it already has.
  "Of each kind": if a planeswalker has 5 loyalty counters, proliferate adds 1 more loyalty counter.
    It doesn't add multiple. One of each KIND present.
  WHAT IT CAN ADD:
    Poison counters on players (advance toward 10 poison win/loss).
    +1/+1 counters on creatures (grow them).
    -1/-1 counters on creatures (worsen opponent's creatures).
    Loyalty counters on planeswalkers (save planeswalkers, advance ultimates).
    Lore counters on Sagas (advance chapters, sacrifice sooner).
    Charge counters on artifacts (advance activated abilities).
    Energy counters on yourself (gain resources).
    Any counter type.
  WHAT IT CANNOT ADD:
    Can't give a counter to something that doesn't already have one.
    A player with 0 poison: proliferate can't give them poison.
    A permanent with no counters: proliferate doesn't help it.
  SIMULTANEOUS ADDITIONS:
    All chosen permanents/players gain counters simultaneously.
    Example: proliferate targeting yourself (2 poison, 5 energy), opponent's 3/3 with a +1/+1 counter,
      and your planeswalker (7 loyalty).
      You: 1 more poison (3 total), 1 more energy (6 total).
      Opponent's 3/3: 1 more +1/+1 counter (now 4/4).
      Planeswalker: 1 more loyalty (8 loyalty).
    All of these happen at the same time.
  PROLIFERATING YOUR OWN POISON: interesting corner case:
    If you have 1 poison counter and repeatedly proliferate: your own poison grows.
    Usually you don't WANT more poison. But in some edge cases, triggering something
      "whenever you gain a poison counter" could make this useful. Rare.

ENERGY COUNTERS ({E}) (CR 107.14):
  Resource stored on PLAYERS (not permanents, though some effects move them to permanents).
  "Pay {E}{E}" means "Remove 2 energy counters from yourself."
  Energy is EARNED from specific cards: Aetherworks Marvel, Dynavolt Tower, etc.
    "You get {E}{E}{E}" = add 3 energy counters to yourself.
  PERSISTS BETWEEN TURNS: unlike mana (which empties at step end), energy carries over.
  USE: pay energy for powerful activated effects.
    Aetherworks Marvel ({6}): "Whenever a permanent you control is put into a GY, you get {E}.
      {T}, pay {E}{E}{E}{E}{E}{E}: look at top 6 cards, cast one for free."
    Energy works as a hidden-action resource: build it up over turns, spend for powerful plays.
  PROLIFERATE + ENERGY:
    If you have energy counters: proliferate adds one more energy counter.
    Synergy with energy-heavy Kaladesh strategies.

EXPERIENCE COUNTERS:
  Not covered in CR as a global mechanic (each card that gives experience counters defines them).
  KEY RULE: experience counters are on PLAYERS, not permanents.
  Meren of Clan Nel Toth ({2}{B}{G}): "Whenever another creature you control dies, you get an
    experience counter. At the beginning of your end step, choose target creature card in your GY
    with MV ≤ experience counters, return it to the battlefield."
  Experience counters persist regardless of commander's location. Even if Meren dies/goes to
    command zone: experience counters on YOU remain.
  PROLIFERATE + EXPERIENCE:
    You have 3 experience counters: proliferate gives you 1 more (4 experience).
    Meren can now reanimate creatures with MV ≤ 4 instead of ≤ 3.
  No cap: experience counters can accumulate to any number.
  Only removed by specific effects.
```

## Definitive Conclusions

- **Infect changes damage type entirely for both players AND creatures** — players get poison (not life loss), creatures get -1/-1 counters (not damage marks).
- **Wither only affects creature damage** — wither damage to players is still normal life loss; infect affects both.
- **Toxic adds poison IN ADDITION to life loss** — unlike infect, toxic doesn't replace damage, it adds poison on top.
- **10 poison counters = lose the game as an SBA** — no response window; happens as soon as 10+ are present before priority.
- **Proliferate adds one counter of EACH type** — a permanent with both +1/+1 and -1/-1 counters gets one more of each; players with multiple counter types get one of each.
- **Energy and experience counters persist on players indefinitely** — they don't empty at phase end like mana; proliferate can grow them.

## Canonical Example
**Atraxa Proliferate Engine:**
You control Atraxa, Praetors' Voice ({G}{W}{U}{B}): 4/4 flying, vigilance, deathtouch, lifelink. "At the beginning of your end step, proliferate."
Board state:
  Opponent 1: 2 poison counters (took infect damage earlier).
  Opponent 2: 0 poison counters.
  Your Jace, the Mind Sculptor: 4 loyalty counters.
  Your 3/3 creature with two +1/+1 counters.
  Nissa, Who Shakes the World: 6 loyalty counters.

Beginning of your end step: Atraxa triggers → proliferate.
You choose: Opponent 1 (has 2 poison), Jace (has 4 loyalty), your 3/3 (has +1/+1 counters), Nissa (has 6 loyalty).
You do NOT choose: Opponent 2 (has 0 poison counters — can't proliferate what isn't there).
Result:
  Opponent 1: +1 poison → 3 poison counters.
  Jace: +1 loyalty → 5 loyalty counters.
  Your 3/3: +1 of EACH type → now has THREE +1/+1 counters (from two). 5/5 instead of 4/4 now? Wait.
    Wait: the 3/3 had two +1/+1 counters before. With counters: 3+2/3+2 = 5/5. After proliferate: three +1/+1 counters = 3+3/3+3 = 6/6.
  Nissa: +1 loyalty → 7 loyalty counters.

After 4 end steps with Atraxa proliferating: Opponent 1 would have 2+4=6 poison. Still alive.
After 8 end steps: 2+8=10 poison. Opponent 1 loses.
If opponent had 5 poison to start: 5+5=10 in 5 end steps. Turn 5 proliferate = Opponent 1 loses.
Jace goes from 4 → 12 loyalty in 8 turns. Can activate -12 ultimate after accumulating.
Jace at 12+ loyalty → ultimate: "Each player shuffles library and graveyard into library. Then exile all but the bottom 10 cards." With proliferate protection, Jace gets to extreme loyalty values.

**Example 2 — Infect Combat with Indestructible:**
You control Phyrexian Crusader ({1}{B}{B}): 2/2 first strike, protection from red and white, infect.
Opponent controls Darksteel Colossus ({11}): 11/11 trample, indestructible.

Phyrexian Crusader attacks. Opponent blocks with Darksteel Colossus.
First strike combat damage:
  Phyrexian Crusader deals 2 infect damage to Darksteel Colossus.
  INFECT on creatures: puts -1/-1 counters. Two -1/-1 counters on Darksteel Colossus.
  Darksteel Colossus: was 11/11, now 9/9 (two -1/-1 counters in layer 7c).
  SBA check: Colossus has 9 toughness, 0 damage marked. Fine.

Normal damage:
  Darksteel Colossus deals 11 combat damage to Phyrexian Crusader.
  Phyrexian Crusader: 2 toughness, 11 damage. SBA: would be destroyed (704.5g).
  But Crusader is being destroyed, not reduced to 0 toughness. Indestructible would prevent... wait:
    Crusader has no indestructible. It just dies from lethal damage.

Wait: that's wrong. If Phyrexian Crusader has FIRST STRIKE and Darksteel Colossus does NOT:
  First strike step: Crusader deals 2 to Colossus. Colossus now has two -1/-1 counters (9/9).
  SBA after first strike: Colossus is 9/9 with 0 damage. Fine. Crusader is untouched.
  Normal damage step: Colossus deals 11 to Crusader. Crusader: 2 toughness, 11 marked → destroyed.
Result: Crusader trades unfavorably in ONE combat. But over multiple combats: Colossus is getting -1/-1 counters each time!
After 11 combats (assuming Crusader survives somehow — block repeatedly): Colossus has 11 -1/-1 counters → 0/0 → SBA 704.5f: GY.
Indestructible doesn't save a creature with 0 or less toughness (704.5f is separate from 704.5g destruction). Infect kills indestructible creatures over time.

Real strategy: proliferate the -1/-1 counters. With Atraxa or proliferate spells, accelerate the Colossus's counter pile.

## Commonly Confused With
- **P335 (Hexproof / Indestructible)** — Indestructible prevents destruction (704.5g) but not toughness-0 death (704.5f). Infect puts -1/-1 counters that reduce toughness, triggering 704.5f — indestructible doesn't help. P347 covers infect; P335 covers what indestructible actually prevents.
- **P308 (Trample)** — Trample damage assigned beyond lethal to blockers goes to the player as normal damage. If the attacking creature has infect: that excess "trample" damage also goes to the player AS POISON COUNTERS (infect converts all damage to poison). Relevant for giant infect creatures with trample.
- **P345 (Saga Cards)** — Proliferate can advance Saga lore counters. This interacts with P345's rules about lore counter placement triggering chapter abilities and the sacrifice SBA. Proliferating a Saga from chapter II to III triggers Chapter III and eventually sacrifices it.
- **P333 (Planeswalkers)** — Proliferate adds loyalty counters to chosen planeswalkers. This effectively "heals" low-loyalty planeswalkers and can advance them toward ultimates. Combined with Atraxa (as in Example 1), this creates very powerful planeswalker engines.
