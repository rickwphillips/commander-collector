---
id: p279
name: Monarch and The Initiative — Designations That Grant End-Step Card Draw
category: multiplayer
cr_refs: [408.1, 408.2, 408.3, 408.4, 408.5, 408.6, 721.2]
tags: [monarch, initiative, designation, command-zone, card-draw, end-step, Conspiracy, Commander, Caves-of-Chaos-Adventurer, Dungeon, Embercleave, Court-of-Cunning]
created: 2026-03-29
examples_count: 2
---

# P279 — Monarch and The Initiative — Designations That Grant End-Step Card Draw

## Abstract
Two powerful player designations from Conspiracy and Commander sets. **Monarch**: when you become the monarch, you draw a card at the beginning of your end step. If an opponent deals combat damage to you, THEY become the monarch. The monarch designation incentivizes combat and creates a political arms race for card advantage. **The Initiative**: introduced in Commander Legends: Battle for Baldur's Gate, the initiative lets you venture into the Undercity dungeon (a specific dungeon only available via the initiative) at the beginning of your upkeep. Dealing combat damage to the initiative holder lets you take the initiative. Both are highly contested resources in multiplayer games.

## The Definitive Rules

**CR 408.1** (verbatim): *"The monarch is a designation that may be given to one player. See also 'Losing the Monarchy' below."*

**CR 408.2** (verbatim): *"When a player becomes the monarch, they draw a card."*

**CR 408.3** (verbatim): *"At the beginning of the monarch's end step, that player draws a card."*

**CR 408.4** (verbatim): *"Whenever a creature deals combat damage to the monarch, its controller becomes the monarch."*

**CR 408.5** (verbatim): *"There can only be one monarch at a time. If a player other than the current monarch becomes the monarch, the current monarch loses the designation and the new player gains it."*

## The Pattern

```
MONARCH RULES:
  Becoming the monarch: when you first gain the designation, draw a card immediately
  Each end step (YOURS): draw a card (continuous passive card advantage)
  Being dealt combat damage: attacker's controller becomes the new monarch
  Only one monarch at a time: gaining it removes it from the previous holder

  MONARCH COMBAT INTERACTION:
    Any creature that deals combat damage to the current monarch → attacker's controller is new monarch
    "Combat damage" specifically (not noncombat damage)
    Even a 1/1 token: if it deals any combat damage to the monarch, new monarch gained
    Trample damage: if the creature has trample and deals damage to the player, that qualifies
    Multiple creatures dealing combat damage simultaneously: the attacker's controller (one) becomes monarch
    Wait: multiple creatures can deal combat damage to the monarch in the same combat
    If creatures from different controllers deal combat damage: CR says "whenever a creature deals
    combat damage to the monarch" — this triggers for each creature.
    Multiple triggers: if two opponents' creatures hit the monarch simultaneously, both triggers fire.
    They resolve in APNAP order. The last one to resolve becomes the final monarch.

  MONARCH + FLYING BLOCKERS:
    Protecting the monarch: ensure your opponent can't deal combat damage to you
    Flying creatures attacking an unprotected monarch: steal it easily
    Fog effects, untap effects, creature tokens as blockers: protect the monarch

  MONARCH CARDS (Conspiracy: Take the Crown, Commander):
    Court of Cunning ({2}{U}, Enchantment — Court): "When Court of Cunning enters, you become the
      monarch. At the beginning of your end step, if you're the monarch, mill two cards, then if target
      opponent has 10 or more cards in their graveyard from Court's effect, they lose the game."
      "Court" cards all make you the monarch when they enter.
      Maintain the monarch designation: mill opponents each turn.

    Marchesa, the Black Rose ({1}{U}{B}{R}): "Dethrone. Whenever another creature you control dies,
      if you're not the monarch, return it from GY to battlefield with +1/+1 counter."
      Combo: Marchesa makes it good NOT to be the monarch (she returns creatures when you're not).
      Political twist: give someone else the monarch to maintain your Marchesa protection.

    Protector of the Crown ({6}{W}, 5/8): "When this enters, you become the monarch. All damage that
      would be dealt to you is dealt to Protector of the Crown instead."
      8 toughness: can absorb many attacks before becoming a liability.
      A 5/8 wall of toughness protecting your monarch designation.

THE INITIATIVE:
  Similar to Monarch: one player has "the initiative" at a time
  Gaining the initiative: begin venturing the Undercity dungeon (specific to the initiative)
  At the beginning of your upkeep: venture into the Undercity if you have the initiative
  Creature deals combat damage to initiative holder: attacker's controller takes the initiative

  UNDERCITY DUNGEON (Initiative only):
    A specific dungeon only accessible via the Initiative
    Branching path through underground rooms
    Final room: powerful effect (depends on path chosen)
    Different from the standard dungeons (Dungeon of the Mad Mage, etc.)

  INITIATIVE vs MONARCH COMPARISON:
    Monarch: draw a card each end step (card advantage)
    Initiative: venture each upkeep (dungeon progression, eventually powerful final rooms)
    Both: stolen by combat damage to the holder
    Monarch = immediate card advantage. Initiative = cumulative dungeon value.

GAINING THE MONARCH/INITIATIVE STRATEGICALLY:
  In Commander: you want the monarch when you're behind (need card draw)
  Giving the monarch to someone: creates attack incentives ("attack them to become monarch")
  Protecting the monarch when ahead: denying opponents the draw
  Initiative: venturing more = faster dungeon completion = bigger rewards

  FIRST MONARCH IN THE GAME:
    No one is the monarch at game start
    First card to make a player the monarch: the first to gain this designation gets a free draw
    Multiple players gaining it on the same turn: last one to gain it becomes the actual monarch

MONARCH PROTECTION STRATEGIES:
  Pillow fort (damage prevention, creature buffs): prevent opponents from dealing combat damage
  Fog of War ({G}, Fog): "Prevent all combat damage this turn." → No one steals the monarch.
  High-toughness walls: 0-power blocks have no creature deal combat damage → safe
```

## Definitive Conclusions

- **Becoming the monarch draws a card immediately** — then at each end step while you hold it.
- **Any creature dealing combat damage to the monarch transfers the designation** — even a 1/1 token.
- **Multiple simultaneous combat damage steals resolve APNAP** — the last one determines who ends up monarch.
- **The Initiative advances the Undercity dungeon each upkeep** — stolen by combat damage just like the Monarch.
- **Monarch is a contested resource** — maintaining it requires either pillow-fort protection or keeping opponents off attacking you.

## Canonical Example
**Protector of the Crown Monarch Hold:**
You cast Protector of the Crown ({6}{W}): 5/8. Triggered ETB: you become the monarch. Draw a card.
The 5/8 redirects all damage to itself instead of to you.
Opponents want to steal the monarch: must deal combat damage to you (the monarch).
But: all damage redirects to the 5/8 Protector instead of you.
To deal combat damage to you (the monarch): opponent must route damage through you — which means
all that damage hits the Protector, not you. You're shielded.
The Protector is the physical firewall: its 8 toughness absorbs attack after attack.
As long as the 5/8 lives: you're the monarch and drawing every end step.
Opponents must kill the Protector with removal, not combat, to unseat your monarch.

**Example 2 — Marchesa Monarch Intentional Loss:**
Board: Marchesa, the Black Rose (Dethrone, "When a creature you control dies and you're NOT the monarch, return it to battlefield with a +1/+1 counter").
You're the monarch: your creatures die → they DON'T return (you're the monarch).
You WANT to lose the monarch to protect your creatures.
Let an opponent steal it: allow their 1/1 to deal you 1 combat damage.
They become the monarch. Now you're not the monarch.
Your creatures: when they die, they return with +1/+1 counters (Marchesa's ability fires).
Your 3/3 dies: returns as 4/4 with a counter. Another creature dies: returns pumped.
Board refills with +1/+1 counters. Marchesa rewards being the NON-monarch.

## Commonly Confused With
- **P277 (Dungeons)** — Dungeons are traversed via "venture into the dungeon"; The Initiative gives automatic upkeep venturing into the specific Undercity dungeon.
- **P278 (Voting)** — Voting gives each player a choice in spell effects; Monarch is a passive card-draw designation.
- **P219 (Devotion/City's Blessing)** — City's Blessing is permanent once earned; Monarch is contested and changes hands via combat damage.
