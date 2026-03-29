---
id: p158
name: Champion — Exile a Creature of a Type on Entry
category: triggered
cr_refs: [702.72a, 702.72b, 702.72c]
tags: [champion, exile, ETB, LTB, return, creature-type, sacrifice, Lorwyn, Auntie-Tobo, Changeling]
created: 2026-03-28
examples_count: 2
---

# P158 — Champion — Exile a Creature of a Type on Entry

## Abstract
Champion is a two-linked-trigger mechanic from Lorwyn. When the champion creature enters, if you can't exile another creature of the specified type you control, you must sacrifice the champion. If you can and do, that creature is exiled and "championed" by the champion. When the champion leaves the battlefield (for any reason), the championed card returns to play. This enables a form of temporary protection (exile a creature to save it from a board wipe, it returns when the champion leaves) or a powerful ETB blink-on-leave setup.

## The Definitive Rules

**CR 702.72a** (verbatim): *"Champion represents two triggered abilities. 'Champion an [object]' means 'When this permanent enters, sacrifice it unless you exile another [object] you control' and 'When this permanent leaves the battlefield, return the exiled card to the battlefield under its owner's control.'"*

**CR 702.72b** (verbatim): *"The two abilities represented by champion are linked. See rule 607, 'Linked Abilities.'"*

**CR 702.72c** (verbatim): *"A permanent is 'championed' by another permanent if the latter exiles the former as the direct result of a champion ability."*

## The Pattern

```
CHAMPION:
  Entry trigger: "When this enters, sacrifice it unless you exile another [type] you control"
  Departure trigger: "When this leaves the battlefield, return the exiled card under owner's control"
  Linked abilities (CR 607): the second trigger only returns cards exiled by the first ability

  CHAMPION ETB:
    You can choose ANY [type] creature you control to exile
    If you control no [type] creatures other than the champion: sacrifice the champion
    The sacrifice is mandatory if no exile target — "sacrifice it unless" is not optional

  CHAMPION + SACRIFICE OUTLET:
    If the champion is sacrificed for another reason: the LTB trigger still fires
    The championed card returns to battlefield
    Sacrificing a champion to sac outlet: save a creature from exile (exile it with champion, then sac champion)

  CHAMPION + BLINK:
    Blink the champion (exile then return it): LTB fires → championed card returns
    Then the champion re-enters: new ETB trigger → exile a new creature
    Old championed card is back; now a new creature is championed
    Flickerwisp + Champion = "steal" ETB triggers and rescue your own creature

  CHAMPION + PROTECTION FROM BOARD WIPES:
    Champion an important creature → board wipe → champion dies → championed card returns
    Your championed creature survived the board wipe (was exiled during it)
    The champion sacrificed itself (or died to wipe) → return trigger fires

  CHAMPION + CHANGELING:
    Changeling is every creature type
    A Champion that champions a Changeling = a Champion that champions any type
    Also: Changeling cards themselves can be championed by type-specific champions

  CHAMPION + ZONE CHANGE:
    If the champion leaves the battlefield and the championed card is no longer in exile:
    The return trigger still fires (just looks for the card; if it's not there, nothing happens)
    If opponent exiles the championed card while it's championed: when champion leaves, it tries to return a card that's already somewhere else

  CHAMPION + MULTIPLE:
    Each champion can only champion one creature (exiles one)
    Multiple champions: each exiles one creature separately

LINKED ABILITY DETAIL:
  The "return" trigger specifically only returns cards exiled by "this permanent's champion ability"
  If you exile a creature some other way (not from the champion ETB): champion's LTB doesn't affect it
  Only the championed card (directly exiled by the entry trigger) returns

CHAMPION TARGETS:
  Commonly: "Champion a [creature type]" (Elf, Faerie, Goblin, etc.)
  Some: "Champion a creature" (any creature type)
  Changeling satisfies any type requirement
```

## Definitive Conclusions

- **Champion exiles one creature when entering** — sacrifice the champion if no target available.
- **When champion leaves, the championed card returns** — linked triggers per CR 607.
- **Changeling satisfies any champion type** — useful for off-tribe champion strategies.
- **Sacrifice the champion before it dies** to a board wipe → championed card returns safely.
- **Blink effects reset champion** — championed card returns, then a new creature is championed.

## Canonical Example
**Auntie Tobo's Hut / Wort, Boggart Auntie (Champion a Goblin):**
Enter Wort → ETB: exile another Goblin you control.
You exile your best Goblin (e.g., Goblin Ringleader).
Wort dies to removal → LTB: Goblin Ringleader returns to battlefield under your control.
ETB of returning card: Goblin Ringleader enters → its ETB may trigger again if it has one.

**Example 2 — Champion + Board Wipe:**
Control Aethersnipe (Champion a creature) + an important creature.
Champion the important creature: it's exiled.
Opponent casts Wrath of God → Aethersnipe dies (champion dies in wipe).
LTB trigger: important creature returns to battlefield — it survived the wipe!
Net: lost Aethersnipe, important creature back.

## Commonly Confused With
- **P116 (Haunt)** — Haunt exiles itself to haunt a creature; triggers fire when the haunted creature dies. Champion exiles another creature and returns it when the champion leaves.
- **P113 (Evoke)** — Evoke sacrifices itself after entering. Champion stays until it leaves.
- **P114 (Changeling)** — Changeling allows creatures to be championed by any-type champion.
