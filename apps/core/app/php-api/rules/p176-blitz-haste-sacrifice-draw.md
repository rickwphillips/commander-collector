---
id: p176
name: Blitz — Alternative Cost with Haste, Sacrifice, and Draw
category: costs
cr_refs: [702.152a, 702.152b]
tags: [blitz, alternative-cost, haste, sacrifice, draw, end-step, Streets-of-New-Capenna, Riveteers]
created: 2026-03-28
examples_count: 2
---

# P176 — Blitz — Alternative Cost with Haste, Sacrifice, and Draw

## Abstract
Blitz is an alternative cost mechanic from Streets of New Capenna. Pay the blitz cost instead of the normal mana cost: the creature enters with haste and "when this permanent is put into a graveyard from the battlefield, draw a card." At the beginning of the next end step, it's sacrificed. Blitz is like dash — haste + return (but instead of returning to hand, it sacrifices and replaces itself with a card draw). This makes blitz creatures disposable threats: you attack immediately, and when it dies (to sacrifice or otherwise), you draw to replace it.

## The Definitive Rules

**CR 702.152a** (verbatim): *"Blitz represents three abilities: two static abilities that function while the card with blitz is on the stack, one of which may create a delayed triggered ability, and a static ability that functions while the object with blitz is on the battlefield. 'Blitz [cost]' means 'You may cast this card by paying [cost] rather than its mana cost,' 'If this spell's blitz cost was paid, sacrifice the permanent this spell becomes at the beginning of the next end step,' and 'As long as this permanent's blitz cost was paid, it has haste and "When this permanent is put into a graveyard from the battlefield, draw a card."'"*

## The Pattern

```
BLITZ:
  Alternative cost (instead of mana cost)
  If blitz cost paid:
    1. Has haste
    2. Delayed trigger: sacrifice at beginning of next end step
    3. Static ability: when put into graveyard from battlefield → draw a card

  BLITZ VS DASH:
    Dash: return to hand at end step
    Blitz: sacrifice + draw a card at end step
    Blitz doesn't keep the creature; you get a card draw instead
    Blitz is more aggressive, less sustainable than dash

  BLITZ + DRAW CONDITION:
    "When this permanent is put into a graveyard from the battlefield" — any death triggers the draw
    Sacrificed at end step → goes to graveyard → draw trigger fires
    Killed by removal BEFORE end step → also dies → draw trigger fires
    Either way: you draw a card when it dies (if blitz cost was paid)

  BLITZ + HASTE:
    The creature attacks immediately
    Can also use {T} abilities immediately
    Attack/use it, draw when it dies

  BLITZ + END STEP SACRIFICE:
    The delayed trigger fires at YOUR next end step
    "Beginning of the next end step" = the very next end step in turn order after the spell resolves
    If you blitz on your turn: your end step sacrifice
    If you blitz with flash on opponent's turn: the opponent's end step is next → sacrifice there

  BLITZ + MULTIPLE DAMAGE TRIGGERS:
    "When this dies, draw a card" pairs with other death triggers
    If creature has its own death trigger + blitz death trigger → both fire

  BLITZ COST COMPARISON:
    Blitz cost is usually cheaper than regular cost
    Ziatora's Envoy ({2}{B}{R}{G} = 5 mana, Blitz {3}{B}{R}{G} = 6 mana... hmm, not cheaper)
    Actually: some blitz costs are equal or slightly different, with the tradeoff being the temporary nature vs card draw
    The VALUE is haste + guaranteed card draw, even if cost is similar

  BLITZ CARDS:
    Rigo, Streetwise Mentor (Blitz): human scout with interesting abilities
    Exhibition Magician (Blitz): support spell
    Many 2-3 CMC creatures in Streets of New Capenna had blitz
```

## Definitive Conclusions

- **Blitz gives haste** and **sacrifices at end step** — the creature is temporary.
- **Death trigger draws a card** — any death (sacrifice, removal, combat) draws when blitz cost was paid.
- **Unlike dash**, blitz doesn't return to hand — it's gone, but replaces itself with a draw.
- **Attacking with a blitz creature AND drawing a card** is the core value.

## Canonical Example
**Evelyn, the Covetous (Blitz {3}{U}{B}{R}):**
Cast for blitz cost → enters with haste → attacks immediately. When she dies (at end step via sacrifice, or sooner to removal): draw a card.
Compare: cast normally, she stays on battlefield but no guaranteed draw.
Blitz play: guaranteed attack + guaranteed card draw for potentially lower cost.

**Example 2 — Blitz Aggro:**
Turn 2: cast a 3/1 creature with Blitz {1}{R}. It has haste. Attack for 3.
It gets sacrificed at end step → draw a card.
You paid {1}{R} for: 3 damage + a card drawn + whatever enters ability.
This is "Lightning Bolt + loot" territory — aggressive and card-neutral.

## Commonly Confused With
- **P161 (Dash)** — Dash also gives haste and is temporary, but returns to hand. Blitz sacrifices and draws a card.
- **P113 (Evoke)** — Evoke sacrifices on ETB (not at end step). Blitz sacrifices at end step with a draw on death.
- **P157 (Undying)** — Undying returns on first death. Blitz creature dying just draws a card (no return).
