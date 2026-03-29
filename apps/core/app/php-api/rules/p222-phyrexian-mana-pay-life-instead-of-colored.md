---
id: p222
name: Phyrexian Mana — Pay 2 Life Instead of the Colored Mana Symbol
category: costs
cr_refs: [107.4f, 107.4g, 601.2f]
tags: [phyrexian-mana, pay-life, colored-mana, off-color-access, Gitaxian-Probe, Dismember, New-Phyrexia]
created: 2026-03-28
examples_count: 2
---

# P222 — Phyrexian Mana — Pay 2 Life Instead of the Colored Mana Symbol

## Abstract
Phyrexian mana symbols ({W/P}, {U/P}, {B/P}, {R/P}, {G/P}) can each be paid with either (a) the appropriate color of mana, OR (b) 2 life. This allows any deck to cast spells with Phyrexian mana costs — even off-color decks — by paying life instead of producing the colored mana. A spell with Phyrexian mana costs {U/P}{U/P} can be cast in a green deck by paying 4 life. The power: blue control staples can be splashed into red aggro decks; white removal lands in black midrange. Dismember ({1}{B/P}{B/P}) became a 4-of in nearly every non-black deck by paying life.

## The Definitive Rules

**CR 107.4f** (verbatim): *"A Phyrexian mana symbol is a hybrid mana symbol that represents a cost that can be paid either with one mana of the appropriate color or with 2 life."*

**CR 107.4g** (verbatim): *"There are five Phyrexian mana symbols: {W/P}, {U/P}, {B/P}, {R/P}, {G/P}. Each is associated with the colors white, blue, black, red, and green respectively."*

## The Pattern

```
PHYREXIAN MANA PAYMENT:
  Each Phyrexian symbol: pay EITHER one colored mana OR 2 life
  Mix: some symbols paid with mana, some paid with life
  Example: {U/P}{U/P} = 2 blue mana OR 4 life OR 1 blue mana + 2 life

  COLOR IDENTITY (FOR COMMANDER):
    Phyrexian mana symbols DO contribute to a card's color identity
    {B/P} on a card = that card has black in its color identity
    Even if you pay life instead of the mana: the symbol makes the card count as black for identity
    Gitaxian Probe ({U/P}): blue color identity → can only go in blue Commander decks

  PHYREXIAN MANA + COLOR:
    Does paying life instead of blue mana make the spell colorless?
    No: the card's color is determined by its mana cost (including Phyrexian symbols)
    Gitaxian Probe is BLUE regardless of how you pay for it
    Paying life to "bypass" a color doesn't change the spell's color

  GITAXIAN PROBE ({U/P}):
    "Pay {U/P} (1 blue mana OR 2 life) + look at target player's hand + draw a card."
    In ANY deck: pay 2 life → look at opponent's hand + draw a card.
    Banned in Modern, Legacy, Pauper: the 0-mana-cost (pay life) draw/look effect was too powerful.
    No card in hand: probe cost is just 2 life for a draw and free information.

  DISMEMBER ({1}{B/P}{B/P}):
    Normal cost: {1}{B}{B} (black mana) → deal 4 damage to target creature, it gets -4/-4 until end of turn.
    But can pay life: {1} + 4 life (paying 2 life each for {B/P}{B/P}) → same effect.
    ANY deck can cast Dismember for {1} + 4 life total.
    In Modern white aggro: Dismember removes any creature (even 4-toughness ones) for just {1} + 4 life.
    The life payment is the "color splash cost" — you pay with your life total.

  MENTAL MISSTEP ({U/P}):
    Counter target spell with mana value 1.
    Pay {U/P}: either {U} or 2 life.
    Banned in Legacy (and everywhere): 0-cost (pay life) counterspell that hits all 1-mana spells.
    Even green decks could counter Ancestral Recall-type effects by paying 2 life.

  PHYREXIAN MANA + MANA VALUE:
    Mana value counts the Phyrexian symbol as 1 (regardless of how it's paid)
    Gitaxian Probe: mana value 1 (the {U/P} counts as 1)
    Dismember: mana value 3 (1 + 1 + 1 for the three symbols)
    Important for cascade: cascading into Dismember requires cascade spell CMC ≤ 3

  PHYREXIAN MANA + DEVOID:
    Devoid makes spells colorless (no color)
    If a Phyrexian mana symbol is in the cost: the card IS colored (by the symbol), unless another effect overrides
    Devoid + Phyrexian mana: Devoid makes the card/spell colorless despite the Phyrexian symbol?
    CR: Devoid says the card "has no color" — overrides the Phyrexian color identity
    The card is colorless but can still be paid with life OR the color mana

  PHYREXIAN MANA + COST REDUCTION:
    Reducing generic mana in cost: Phyrexian symbols are colored, not generic → generic reducers don't reduce them
    Example: Goblin Electromancer reduces "instant/sorcery cost by {1}" — doesn't reduce {U/P}
    Specific colored mana reducers COULD reduce them

  COMPLEAT VERSION (post-March of the Machine):
    New Phyrexian mana variants: {G/W/P} etc. — pay life for any combination
    More complex hybrid-Phyrexian options
```

## Definitive Conclusions

- **Phyrexian mana can be paid with 2 life** instead of the required colored mana.
- **Color identity is unaffected** — Phyrexian symbols count for Commander color identity.
- **Card color is unaffected** — the card is still colored by its mana cost symbols.
- **Mana value** counts Phyrexian symbols as 1 each, regardless of life payment.
- **Dismember and Gitaxian Probe** are the most format-warping examples — banned in most formats.

## Canonical Example
**Dismember in a red Burn deck (Modern):**
Burn deck is mono-red: no black mana sources.
Opponent attacks with a Gurmag Angler (5/5) that can't be blocked.
Burn deck needs to kill the 5/5: Lightning Bolt only deals 3.
Cast Dismember ({1}{B/P}{B/P}): pay {1} + 2 life + 2 life = {1} + 4 life total.
Target Gurmag Angler: it gets -4/-4 → becomes 1/1 → deal 4 damage → 5/5 takes 4 damage → let's check:
Dismember says "target creature gets -4/-4 until end of turn." 5/5 - 4/4 = 1/1. Then Lightning Bolt for 3 more = still alive?
Actually Dismember says "deals 4 damage to target creature and it gets -4/-4." So: 5/5 takes 4 damage (5/5 → 5/5 with 4 damage), AND gets -4/-4 (becomes 1/1 with 4 damage). 4 damage ≥ 1 toughness → creature dies.
Dismember in mono-red: efficient removal at the cost of 4 life and 1 mana.

**Example 2 — Gitaxian Probe (Legacy, pre-ban):**
Storm deck: "I'm casting Gitaxian Probe to see your hand."
Pay 2 life: cast Probe, look at opponent's hand, draw a card.
Information: know if opponent has Force of Will (counterspell).
Build storm count: Probe = 1 spell cast toward storm.
The 0-mana spell + perfect information = massive advantage in combo/control matchups.
Banned because: free information + free draw + free storm count was too powerful.

## Commonly Confused With
- **P210 (Kicker)** — Kicker pays EXTRA for a bonus. Phyrexian mana pays DIFFERENTLY (life instead of colored mana) for the required cost.
- **P150 (Convoke)** — Convoke taps creatures to reduce mana cost. Phyrexian mana pays life for colored mana cost.
- **P209 (Energy)** — Energy is a stored resource spent via {E}. Phyrexian mana converts life directly to colored mana payment.
