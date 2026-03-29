---
id: p019
name: Mandatory Infinite Loop
category: zones
cr_refs: [720.1, 720.2, 720.3, 720.4, 603.6a, 603.6c, 707.10, 603.7]
tags: [infinite-loop, mandatory, worldgorger, animate-dead, zone-change, ETB, LTB, draw, game-rules, aura-return]
created: 2026-03-28
examples_count: 1
---

# P019 — Mandatory Infinite Loop

## Abstract
Some combinations of cards create loops where each iteration triggers the next, with no mandatory stopping condition. Magic's rules handle mandatory infinite loops explicitly: if a loop is truly infinite and mandatory (no player can choose to stop it), the game ends in a draw. If the loop is optional at any point (any player can choose not to repeat), then players must eventually make a choice that ends it. Worldgorger Dragon + Animate Dead is the canonical mandatory loop — but with a mana float, it becomes a controlled (stoppable) infinite mana engine.

## The Definitive Rule

**CR 720.1**: *"The game checks for infinite loops continually. If a loop would occur and all actions within the loop are mandatory, the game is a draw."*

**CR 720.2**: *"If any action in the loop is optional (a player can choose not to perform it), the game doesn't automatically end. That player must eventually make a different choice or the loop must end in some other way."*

**CR 720.3**: *"If a loop would repeat, the player who has to make the next decision decides how many times the loop repeats. They then make a different choice to break the loop."*

**Worldgorger Dragon ruling (2022-12-08)**: *"If an Aura is exiled with Worldgorger Dragon and then returns to the battlefield, the player who controls the Aura as it enters the battlefield chooses what it will enchant. An Aura put onto the battlefield this way doesn't target anything... but the Aura's enchant ability restricts what it can be attached to."*

## The Pattern

```
WORLDGORGER DRAGON + ANIMATE DEAD loop:

Setup: Worldgorger Dragon in graveyard, Animate Dead in hand.
1. Cast Animate Dead targeting Dragon in graveyard
2. Dragon ETB: exile all other permanents you control
   (Animate Dead is now exiled — it was on the battlefield as an Aura)
3. Animate Dead LTB fires (from being exiled by Dragon):
   "When this Aura leaves the battlefield, that creature's
    controller sacrifices it."
   → Dragon is sacrificed / dies
4. Dragon LTB fires: "Return all exiled cards to battlefield
   under their owners' control."
   → Animate Dead returns to the battlefield
5. Animate Dead ETB fires: it needs to enchant a creature card
   in a graveyard → Dragon is in the graveyard → attaches to Dragon
6. Dragon re-enters battlefield → GOTO step 2

STOPPING CONDITION:
  → Another creature card in any graveyard: player can choose to
    attach returning Animate Dead to THAT creature instead → loop ends
  → No other graveyard targets: loop is mandatory → draw (CR 720.1)

MANA ENGINE:
  Before Dragon dies each iteration, tap all your lands for mana.
  Lands return each iteration and can be tapped again.
  With N lands: generate N × (iterations) mana.
  Since you CHOOSE when to stop (break by targeting another creature),
  it's optional → not a draw → you accumulate infinite mana,
  then break the loop by reanimating something else.
```

## Definitive Conclusions

- **Mandatory loop = draw.** If Dragon + Animate Dead are the only creatures in any graveyard, the loop has no way out and the game is a draw.
- **One other graveyard creature breaks it.** Animate Dead returning to the battlefield attaches to Dragon by default, but the controller *chooses* the attachment target — they can attach to any legal creature card in a graveyard. Choosing a different target breaks the loop.
- **The loop is an infinite mana engine when breakable.** Each iteration, all permanents phase out and return. Tap lands for mana before Dragon dies. This is a real combo (paired with a mana outlet like Altar of Dementia for infinite mill, or Goblin Bombardment for infinite damage — but you need to break Dragon out of the Animate Dead loop first by having another creature in a graveyard to reanimate).
- **Necromancy and Dance of the Dead work identically.** Both are "return creature from graveyard, attach as Aura, LTB sacrifices it" — same loop structure.
- **Destroy Dragon before its ETB resolves = permanent exile.** If Worldgorger Dragon is destroyed (e.g., instant-speed removal) in response to its own ETB trigger, the LTB fires and resolves first — returning nothing (Dragon exiled nothing yet). Then Dragon's ETB resolves — it exiles all other permanents you control permanently, with no return trigger ever firing. This is a hard-counter to the combo: kill Dragon in response to its ETB to lock your opponent out of their entire battlefield. (Scryfall ruling 2022-12-08: "the 'leaves-the-battlefield' ability will trigger and resolve first. It won't return anything. Then the enters-the-battlefield ability will exile all other permanents you control indefinitely.")
- **Dragon LTB exiling itself is not possible.** Dragon's ETB says "exile all OTHER permanents." Dragon stays on the battlefield while exiling everything else, then dies when Animate Dead's LTB resolves.
- **Aura zone note.** When Animate Dead is exiled by Dragon, it loses its enchant target (Dragon is on the battlefield — the Aura was on the battlefield enchanting the Dragon creature). When Animate Dead returns from exile, per the ruling: it doesn't target (so no hexproof protection applies to the graveyard card), but enchant ability still restricts the attachment.

## Canonical Example
**Worldgorger Dragon + Animate Dead (Commander infinite mana):**
Have Dragon in GY and Animate Dead in play with another creature in an opponent's graveyard. The loop generates infinite mana. After N iterations, break by attaching Animate Dead to the other graveyard creature. Now you have a battlefield with that creature and no lands (all permanents are still returned — Dragon returned them on its last LTB). Spend the infinite mana before breaking the loop. With Altar of Dementia as the outlet, mill opponents for infinite before breaking.

## Commonly Confused With
- **P011 (Linked Ability Zone Reset)** — P011 is about ETB/LTB linked pairs resetting on zone changes. Worldgorger uses LTB consequences of Aura departure, not a linked exile/return pair.
- **P016 (Phasing — Not a Zone Change)** — Phasing is not a zone change. Dragon's exiling IS a zone change (permanents go to exile). Phasing and Dragon's exile are mechanically unrelated.
- **P009 (Zone-Change Trigger Race)** — Dragon's ETB/LTB triggers are sequential, not racing. The ETB exiles, Animate Dead's LTB fires from that exile, Dragon dies, Dragon's LTB fires. No simultaneity race.
