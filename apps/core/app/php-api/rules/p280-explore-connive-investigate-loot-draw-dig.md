---
id: p280
name: Explore, Connive, Investigate, and Loot — Drawing, Scrying, and Discarding Variants
category: triggered
cr_refs: [701.39, 701.39a, 701.39b, 701.39c, 702.119, 702.119a]
tags: [explore, connive, investigate, loot, scry, draw, discard, clue-token, counter, Ixalan, Strixhaven, Murders-at-Karlov-Manor, Ygra-Eater-of-All, Raffine-Scheming-Seer, Brinebound-Gift]
created: 2026-03-29
examples_count: 2
---

# P280 — Explore, Connive, Investigate, and Loot — Drawing, Scrying, and Discarding Variants

## Abstract
Four related draw/dig/filtering mechanics. **Explore**: reveal the top card of your library — if it's a land, put it in your hand; if not, put a +1/+1 counter on the exploring creature and optionally put the revealed card in the graveyard. **Connive**: draw a card, then discard a card — if you discarded a nonland, put a +1/+1 counter on the conniving creature. **Investigate**: create a Clue token (artifact: sacrifice, pay {2}, draw a card). **Loot**: draw a card, then discard a card (the generic action, not a specific keyword, but appears as "loot" in rules shorthand). Each has different tradeoffs: Explore is top-deck dependent, Connive requires discarding, Investigate creates a deferred draw, Loot is instant cantrip filtering.

## The Definitive Rules

**CR 701.39a** (verbatim): *"Certain spells, abilities, and effects instruct a player to explore. To do so, that player reveals the top card of their library. If a land card is revealed this way, the player puts it into their hand. If a nonland card is revealed this way, the player may put a +1/+1 counter on the creature that's exploring. Then the player may put the revealed card into their graveyard. (If that card wasn't put into the player's hand or graveyard, it remains on top of their library.)"*

**CR 701.39b** (verbatim): *"A permanent 'explores' when it's instructed to explore by a spell, ability, or effect."*

**CR 701.39c** (verbatim): *"If a creature explores and the library is empty, the explore attempt does nothing. The creature doesn't get a +1/+1 counter."*

## The Pattern

```
EXPLORE (CR 701.39):
  Reveal the top card of your library.
  IF LAND: put it in your hand (free land draw).
  IF NONLAND:
    - May put a +1/+1 counter on the exploring creature
    - May put the revealed card in your graveyard (or leave it on top)

  EXPLORE CHOICES:
    Land revealed: no choice — it goes to hand. No counter on creature.
    Nonland revealed: choose:
      (a) Put counter on creature AND graveyard the nonland card
      (b) Put counter on creature AND leave the nonland on top
      (c) Don't put counter AND graveyard the nonland
      (d) Don't put counter AND leave the nonland on top
    All four are available; you choose based on what's best

  EXPLORE + GRAVEYARD MATTERS:
    Dump useful cards to graveyard: self-mill with explore
    Keep good cards on top: leave nonland on top for next draw
    Counter creatures while filtering: explore repeatedly to grow creatures AND dig

  EXPLORE NOTABLE CARDS (Ixalan):
    Merfolk Branchwalker ({1}{G}, 2/1, "When enters, explore."):
      If top card is land: draw it. Branchwalker is 2/1.
      If nonland: counter on Branchwalker (3/2) + optional graveyard.
      Either way: great value for {1}{G}.

    Wildgrowth Walker ({1}{G}, 1/3, "Whenever a creature you control explores, it gets +1/+1 and you
      gain 3 life."):
      Mass explore triggers Walker to grow and gain life.
      Stack with 4 explorers in one turn: Walker becomes massive, gain 12 life.

CONNIVE (no specific CR entry as keyword - appears as spelled-out text):
  Draw a card, then discard a card.
  If you discarded a nonland card: put a +1/+1 counter on the conniving creature.
  Net: net-zero on cards drawn (draw one, discard one), but filter + potential counter.

  CONNIVE vs LOOT:
    Loot: draw then discard (same). No counter.
    Connive: draw then discard. PLUS: counter if discarded nonland.
    Connive is a strictly better loot (if the creature is alive to receive the counter).

  CONNIVE NOTABLE CARDS:
    Raffine, Scheming Seer ({W}{U}{B}, 1/4 Flying Ward {1}): "Whenever you attack, each attacking
      creature connives X, where X is the number of attacking creatures."
      8 attackers connive 8 times each: each attacker draws 8, discards 8, gains up to 8 counters each.
      Raffine turns your attacks into massive card filtering + counter buildup.

INVESTIGATE:
  Create a Clue artifact token (1/1?). No: Clues are non-creature artifact tokens.
  The Clue token is: "{2}, Sacrifice this artifact: Draw a card."
  Investigate = deferred drawing. The draw is available when you have {2} and want to sacrifice.

  INVESTIGATE vs DRAW:
    Investigate doesn't draw immediately — you create a token and draw LATER.
    Benefit: flexible timing. Draw when convenient.
    Benefit: Clue tokens are artifacts — synergy with artifact matters cards.
    Cost: {2} mana each time you convert a Clue to a draw.

  INVESTIGATE CARDS (Shadows over Innistrad, Murders at Karlov Manor):
    Thraben Inspector ({W}, 1/2, "When enters, Investigate."):
      Cast for {W}: get a 1/2 body + create a Clue token.
      Whenever convenient: pay {2}, sacrifice Clue → draw a card.
      Effectively: {W} for a 1/2 body + draw a card later for {2}.

    Alquist Proft, Master Sleuth ({3}{W}{U}, Legendary Creature, "Whenever you sacrifice a Clue,
      scry 1 then draw a card"):
      Scry + draw per Clue sacrifice. Efficient filtering.

    Lonis, Cryptozoologist ({G}{U}, 2/2, "Whenever a creature you control explores, investigate"):
      Explore → investigate → Clue → draw later.
      Explore + investigate combo: each exploration generates card advantage.

LOOT (generic action):
  Draw a card, then discard a card.
  Not a keyword — appears in rules text as "draw a card, then discard a card"
  Informally called "loot" (from Faithless Looting)
  Net: same hand size, but you've replaced one card with another (filtering)

  LOOT KEY CARDS:
    Faithless Looting ({R}, Instant): "Draw two cards, then discard two cards. Flashback {2}{R}."
      Two-for-two loot. Flashback for another two-for-two. 4 cards drawn, 4 discarded across two casts.
      Net: filtered 4 cards for {R} + {2}{R} = {3}{R}. Deck selection engine.

COMPARING THE FOUR:
  Explore: conditional land gain OR counter; graveyard control
  Connive: filter + counter (if discard nonland); better than loot for creatures
  Investigate: deferred draw at {2} cost; flexible timing; artifact synergy
  Loot: immediate filter; no counter; pure card cycling
```

## Definitive Conclusions

- **Explore reveals the top card** — land goes to hand, nonland optionally gives a +1/+1 counter and graveyard the card.
- **Connive is loot plus a counter** — draw then discard, gain a +1/+1 counter if the discarded card is nonland.
- **Investigate creates a Clue token** — a deferred "{2}, sacrifice: draw a card" artifact.
- **Loot is pure filtering** — draw and discard, net zero hand size, no bonus.
- **All four are neutral to positive on card count** — none blindly lose cards.

## Canonical Example
**Wildgrowth Walker + Merfolk Branchwalker Explore Synergy:**
Board: Wildgrowth Walker (1/3). Cast Merfolk Branchwalker ({1}{G}): when enters, explore.
Explore: reveal top card. It's a nonland. Choose: counter on Branchwalker AND graveyard the card.
Branchwalker gets +1/+1 → becomes 3/2.
Wildgrowth Walker trigger fires: "whenever a creature you control explores" → +1/+1 counter on Walker + gain 3 life.
Walker becomes 2/4. You gained 3 life.
Continue casting more explorers. Each exploration: Walker grows, you gain life, the exploring creature grows.
By turn 6: Wildgrowth Walker is a 5/7 you've gained 15 life from. All from explore synergy.

**Example 2 — Raffine Connive Storm:**
Board: Raffine, Scheming Seer ({W}{U}{B}). Attacking with Raffine + 5 other creatures.
All 6 creatures attack. Raffine's trigger: each attacking creature connives X, where X = 6 (number of attackers).
Raffine connives 6: draw 6, discard 6. If discarding 6 nonlands: Raffine gets 6 counters.
Raffine gains 6 +1/+1 counters (from 1/4 to 7/10).
Each other attacker also connives 6: they each draw 6, discard 6, potentially get 6 counters each.
All 6 attackers: massive hand filtering AND counter growth in one attack declaration.
After Raffine attack: all your creatures are larger, your hand is optimally filtered.

## Commonly Confused With
- **P213 (Cycling)** — Cycling discards a card to draw a card (net zero hand); Loot draws then discards (same result). Cycling is a permanent one-use ability on a card; loot is an effect on another spell.
- **P216 (Proliferate)** — Proliferate can add counters including the ones generated by Explore/Connive, but it's a separate mechanic.
- **P186 (Scry)** — Scry looks at top cards and rearranges without drawing; Explore specifically puts land in hand or adds a counter.
