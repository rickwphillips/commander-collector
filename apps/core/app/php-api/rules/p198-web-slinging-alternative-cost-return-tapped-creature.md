---
id: p198
name: Web-Slinging — Alternative Cost by Returning a Tapped Creature
category: costs
cr_refs: [702.188a]
tags: [web-slinging, alternative-cost, return-to-hand, tapped-creature, Spider-Man, Marvel-Universes-Beyond]
created: 2026-03-28
examples_count: 2
---

# P198 — Web-Slinging — Alternative Cost by Returning a Tapped Creature

## Abstract
Web-Slinging is an alternative cost from the Marvel Universes Beyond sets (specifically Spider-Man related). Instead of paying a spell's mana cost, you pay the web-slinging cost AND return a tapped creature you control to its owner's hand. The tapped creature acts as the "web" — you use it to propel yourself (cast the spell) and it goes back to your hand (like swinging on a web that pulls you in a direction). This creates interesting synergy with attack-heavy strategies where creatures are tapped after attacking.

## The Definitive Rules

**CR 702.188a** (verbatim): *"Web-slinging is a static ability that functions while the spell with web-slinging is on the stack. 'Web-slinging [cost]' means 'You may cast this spell by paying [cost] and returning a tapped creature you control to its owner's hand rather than paying its mana cost.' Casting a spell using its web-slinging ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
WEB-SLINGING:
  Alternative cost: pay web-slinging cost + return a tapped creature to hand
  Instead of paying the spell's normal mana cost

  WEB-SLINGING + TAPPED CREATURE CONDITION:
    Must return a tapped creature you control
    The creature must already be tapped (you don't tap it — you return it)
    Untapped creatures: cannot be used for web-slinging cost
    Tapped due to: attacking (most common), blocking, tap abilities, etc.

  WEB-SLINGING + TIMING:
    Can be cast any time you could normally cast it
    If it's an instant: any time with priority, even during combat
    If it's a sorcery: your main phase, stack empty, but can use tapped post-combat creatures
    Post-combat: creatures tapped from attacking → web-slinging using the tapped attacker

  WEB-SLINGING + BOUNCE:
    Returning a creature to hand is a "bounce" — the creature leaves the battlefield
    Leaves-the-battlefield triggers fire for that creature
    The creature loses all enchantments/equip/counters when bounced
    Summoning sickness: when replayed, it re-enters with summoning sickness
    Re-entry ETBs: when you recast the bounced creature, its ETB fires again

  WEB-SLINGING + ATTACK:
    Most powerful after combat: attack with a creature (it taps), deal damage,
    Then use it as web-slinging cost: bounce it, cast a web-slinging spell cheap
    The attacker "contributed" twice: combat damage + spell enabler
    Net: attack step + cheap spell cast for the price of the web-slinging cost

  WEB-SLINGING + SUMMONING SICKNESS RESET:
    Bounce a creature that was summoning sick: it re-enters next cast with sickness reset
    Could be beneficial if you need it fresh (though it tapped to attack this turn anyway)

  WEB-SLINGING + ETB ABUSE:
    Web-slinging bounces a creature → recast it next turn (ETB fires again)
    If the creature has a valuable ETB: web-slinging gives you a path to re-trigger it
    Example: ETB draw a card creature → attack, then bounce via web-slinging → recast to draw again

  WEB-SLINGING + COST:
    Web-slinging cost is typically cheaper than the normal mana cost
    You're trading a tapped creature (and a bounce) for the mana savings
    Creatures that can profitably be bounced: those with good ETBs, small creatures with no board impact

  WEB-SLINGING + SPIDER-MAN FLAVOR:
    Spider-Man web-slinging: shoot web at a building, swing past, web releases
    Rules flavor: tapped creature is the "anchor point" — you return it as you swing past
    Marvel UB: Spider-Man spells and abilities with web-slinging keyword
```

## Definitive Conclusions

- **Web-slinging pays [cost] + returns a tapped creature** instead of normal mana cost.
- **Creature must already be tapped** — most commonly a creature that attacked.
- **Returns to hand** — triggers leaves-the-battlefield, creature can be recast for ETB value.
- **Attack then bounce** is the primary pattern: creature attacks, then web-slinging spell uses it as cost.
- **Marvel/Spider-Man specific** — part of Universes Beyond.

## Canonical Example
**Spider-Man (Legendary Creature) attacking alongside web-slinging instants:**
Declare attackers: Spider-Man taps to attack, deals combat damage.
Now Spider-Man is tapped. Web-slinging instant (web-slinging {R} instead of {3}{R}):
Cast the instant: pay {R} + return Spider-Man to hand.
Spider-Man bounces. Instant resolves (does powerful effect).
Next turn: recast Spider-Man. ETB fires again. He can attack again.

**Example 2 — Multiple Attackers, Web-Slinging:**
Attack with three creatures (all tap). Post-combat, hold priority.
Cast web-slinging spell using one of the three tapped attackers.
Bounce that attacker: it goes to hand.
Cast web-slinging again? No — you can only pay this cost once per cast.
But: multiple web-slinging spells in hand → cast each using a different tapped attacker.
Three attackers + three web-slinging spells = three creatures bounced, three spells cast cheap.

## Commonly Confused With
- **P147 (Ninjutsu)** — Ninjutsu returns an unblocked attacker to hand to swap in a Ninja. Web-slinging returns any tapped creature (doesn't have to be attacking or unblocked).
- **P150 (Convoke)** — Convoke taps creatures to reduce mana costs. Web-slinging returns a tapped creature as part of the cost (bounce, not tap).
- **P198 vs Dash (P161)** — Dash haste + return at end step automatically. Web-slinging is a manual bounce when casting a spell.
