---
id: p055
name: Champion — Exile-Return Linked Abilities
category: zones
cr_refs: [702.72a, 702.72b, 702.72c, 607]
tags: [champion, exile, return, linked-abilities, LTB, ETB, zone-change, sacrifice, new-object]
created: 2026-03-28
examples_count: 2
---

# P055 — Champion — Exile-Return Linked Abilities

## Abstract
Champion represents two linked triggered abilities: (1) when the champion permanent enters, sacrifice it unless you exile another qualifying permanent you control, and (2) when the champion permanent leaves the battlefield, return the exiled card to the battlefield. These abilities are linked — the second ability only returns cards exiled by the first ability of that specific permanent. Because the abilities are linked, if the champion permanent leaves before the first trigger resolves (e.g., instant-speed removal in response), no card was championed, so no card returns. If the champion is removed and returns as a new object, the second ability has no memory of what it exiled.

## The Definitive Rule

**CR 702.72a** (verbatim): *"Champion represents two triggered abilities. 'Champion an [object]' means 'When this permanent enters, sacrifice it unless you exile another [object] you control' and 'When this permanent leaves the battlefield, return the exiled card to the battlefield under its owner's control.'"*

**CR 702.72b** (verbatim): *"The two abilities represented by champion are linked. See rule 607, 'Linked Abilities.'"*

**CR 702.72c** (verbatim): *"A permanent is 'championed' by another permanent if the latter exiles the former as the direct result of a champion ability."*

## The Pattern

```
CHAMPION ENTER TRIGGER:
  When champion permanent enters:
  → You MUST sacrifice it UNLESS you exile another qualifying [object] you control
  → "Qualifying" = whatever champion specifies (e.g., "another Faerie", "another Elf")
  → The exile is a cost-like condition (sacrifice the permanent if you can't/won't exile)
  → Choice: exile a valid target OR sacrifice the champion permanent

CHAMPION LEAVE TRIGGER:
  When champion permanent leaves the battlefield (any zone change):
  → Return the championed card to the battlefield under its owner's control
  → "Championed card" = the card exiled by THIS permanent's enter trigger

LINK BETWEEN ABILITIES:
  These are LINKED (CR 607) — they refer to the same specific exile event
  The leave trigger only returns cards exiled by the enter trigger of this permanent
  If champion permanent leaves before enter trigger resolves:
    → Enter trigger resolves: no permanent to exile for → sacrifice the champion
    → OR: response: destroy champion → leave trigger fires
    → BUT: leave trigger fires before enter trigger resolves (LIFO order)
    → Leave trigger: "return the exiled card" → nothing was exiled yet → does nothing
    → Enter trigger resolves: no champion on battlefield → can't satisfy → fizzles?
    → Actually: enter trigger resolves, no champion permanent (it left) → must exile or sacrifice
    → Champion already left, sacrifice impossible → just exile a qualifying permanent from hand? No.
    → Actually: champion already left → trigger still resolves → "sacrifice it unless you exile" →
       "it" refers to the champion, which no longer exists → sacrifice attempt fails (creature gone) →
       just exile a qualifying permanent from GY? No — trigger says exile permanent you control.
    → Result: champion already sacrificed by leave trigger? No, leave trigger fires first.
    → CORRECT SEQUENCE: Destroy champion in response to enter trigger.
       Leave trigger goes on stack (above enter trigger). Leave trigger resolves:
         nothing exiled yet → does nothing.
       Enter trigger resolves: "sacrifice it unless you exile another X" — "it" (the champion)
         is in graveyard → can't sacrifice what's not there → just attempt fails, do nothing.
         Effect tries to exile a qualifying permanent or sacrifice champion. Champion is gone.
         Player must still exile a qualifying permanent if possible, or attempt to sacrifice.
         Since champion is gone, can't sacrifice. Either way, no one was championed.

SIMPLER COMMON CASE:
  Champion resolves normally: exile one qualifying permanent → it's championed.
  Later, champion dies → return the championed card.
  The championed card returns to BATTLEFIELD (not hand) under its owner's control.

ZONE CHANGE AND NEW OBJECT:
  If champion permanent is flickered (exiled and returned), it's a new object
  New object has no memory of what the old object exiled
  The original championed card is stuck in exile permanently (unless other means of retrieval)
  This is the "zone change identity" principle from P003

WHAT GETS RETURNED:
  Only creature tokens were championed? Tokens cease to exist when they leave exile
    (SBA 704.5d: token in zone other than battlefield → ceases to exist)
  Actually: tokens don't enter exile — or rather, they do exist in exile temporarily
  But 704.5d removes them → the championed card was a token → nothing returns
  If you champion a creature card (not a token): it returns to battlefield from exile
```

## Definitive Conclusions

- **Champion enter trigger must exile a qualifying permanent or sacrifice itself.** No middle ground.
- **Champion leave trigger only returns cards exiled by this specific champion permanent.** Linked abilities.
- **If champion permanent is flickered, the championed card is lost to exile.** New object = no memory.
- **Championing a token results in the token not returning.** Tokens in exile cease to exist via SBA.
- **Championed card returns to battlefield (not hand).** It "enters the battlefield" — ETBs fire.

## Canonical Example
**Mistbind Clique (Champion a Faerie):**
Mistbind Clique enters. Champion triggers: exile another Faerie you control or sacrifice Mistbind Clique. You exile Spellstutter Sprite. Sprite is championed by Mistbind Clique. Later, opponent destroys Mistbind Clique. Leave trigger fires: return Spellstutter Sprite to the battlefield. Sprite ETBs — trigger fires. You get Sprite back immediately.

**Example 2 — Removing champion before enter trigger resolves:**
Mistbind Clique enters. Enter trigger goes on stack. Opponent destroys Mistbind Clique with instant removal in response. Both triggers are now on the stack. Clique's leave trigger is on top (added after destroy resolves). Leave trigger resolves: nothing was championed yet → does nothing. Enter trigger resolves: "sacrifice it unless you exile..." — Clique is in graveyard. The trigger resolves, you must exile a Faerie or the attempt to sacrifice fails (Clique already gone). Either way, no Faerie was championed.

## Commonly Confused With
- **P011 (Linked Ability Zone Reset)** — Champion's linked abilities forget what was exiled when the champion permanent becomes a new object (blink, zone change). Same principle as Oblivion Ring.
- **P003 (Zone Change Identity)** — A champion that is exiled and returned is a new object with no memory of its previous linked exile.
