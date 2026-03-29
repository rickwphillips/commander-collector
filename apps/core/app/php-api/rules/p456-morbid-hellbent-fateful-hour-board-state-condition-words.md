---
id: p456
name: Morbid, Hellbent, and Fateful Hour — Creature-Died-This-Turn, Empty-Hand, and Low-Life Ability Words
category: triggered
cr_refs: [207.2c, 603.2, 603.4, 700.4, 603.6c]
tags: morbid, hellbent, fateful-hour, ability-word, creature-died, empty-hand, five-or-fewer-life, innistrad, dissension, dark-ascension, condition-check
created: 2026-03-29
examples_count: 8
---

# P456 — Morbid, Hellbent, and Fateful Hour — Creature-Died-This-Turn, Empty-Hand, and Low-Life Ability Words

## Abstract

Three ability words (CR 207.2c) create conditional effects based on game state conditions that change rapidly during gameplay: **Morbid** (Innistrad) provides a bonus if a creature died this turn; **Hellbent** (Dissension) provides a bonus if you have no cards in hand; and **Fateful Hour** (Dark Ascension) provides a bonus if you have 5 or fewer life. All three have no individual CR entries — the mechanic is in the card text. The key rules questions: *when exactly is the condition checked* (at casting, at resolution, or continuously), *what counts as a creature "dying"* for morbid, and *how does Hellbent interact with zero-card hands* (including empty hand from a prior discard).

## The Definitive Rules

### Ability Words (CR 207.2c)
Morbid, Hellbent, and Fateful Hour are ability words. No formal CR entries.

### Morbid — Creature Died This Turn
Morbid text pattern: *"[Effect]. Morbid — [Bonus effect] if a creature died this turn."*

"A creature died this turn" means a creature was put into a graveyard from the battlefield at any point during the current turn (including tokens, which briefly exist in the GY before ceasing to exist per CR 704.5d). Last Known Information applies — a creature counts even if it ceased to exist after dying.

**CR 603.6c**: Leaves-the-battlefield abilities use last known information (state immediately before leaving). For morbid, a creature that went to the GY "died" — even if it was later exiled from the GY.

Morbid typically checks "this turn" — the turn the spell is being cast or the ability is resolving.

### Hellbent — No Cards in Hand
Hellbent text pattern: *"[Effect]. Hellbent — [Bonus effect] if you have no cards in hand."*

An empty hand means zero cards. The condition is checked at the relevant time (typically resolution). Pitching a card to a cycling ability, discarding to madness, or playing the last card from your hand all reduce the hand to zero.

### Fateful Hour — 5 or Fewer Life
Fateful Hour text pattern: *"[Effect]. Fateful Hour — [Bonus effect] if you have 5 or fewer life."*

The condition checks your current life total at the relevant moment. Life total changes are tracked precisely (CR 118.1). A life total of 5 or below qualifies; exactly 6 does not.

## The Pattern

```
MORBID pattern:
Check: Has a creature died this turn?
  → "Died" = moved from battlefield to graveyard (creatures, creature tokens)
  → Token creatures count: they briefly enter GY before SBAs remove them
  → Opponent's creatures count (any creature, not just yours)
  → Creatures exiled directly (not going through GY) do NOT count for morbid
  → Creatures that left the battlefield via bounce, flicker, etc. do NOT count
  → If morbid is an intervening-if clause: checked at trigger time AND resolution
  → If morbid is a resolution condition (most common): checked when spell/ability resolves

HELLBENT pattern:
Check: Does the affected player have zero cards in hand right now?
  → Zero cards = 0 cards, no exceptions
  → Checked at resolution (or at cast time if casting condition)
  → Discarding the last card to pay for a cycling / madness / other effect:
    once that discard happens, Hellbent IS satisfied
  → Drawing a card between cast and resolution: breaks Hellbent
  → Maximum hand size: Hellbent is about CURRENT hand size, not max hand size

FATEFUL HOUR pattern:
Check: Does the affected player have 5 or fewer life right now?
  → Life total of exactly 5: qualifies
  → Life total of 6: does NOT qualify
  → Checked at resolution (for most uses)
  → Life total changes between cast and resolution matter if it's a resolution check
  → Life total at cast time matters if it's a cast condition
```

## Definitive Conclusions

**Morbid:**
- Opponent sacrificing a creature (e.g., paying for a cost) counts for morbid. Any creature death this turn counts.
- Tokens count: when a 1/1 Goblin token dies, morbid is satisfied.
- A creature exiled directly (Swords to Plowshares, etc.) does NOT count for morbid. The creature never visited the graveyard.
- A creature that died earlier and was reanimated counts for morbid — the death still happened this turn.
- Morbid checks "died this turn" — an ongoing game state that becomes true permanently for that turn once any creature dies.
- Key cards: *Tragic Slip* (Innistrad): "Target creature gets -1/-1 until end of turn. Morbid — That creature gets -13/-13 until end of turn instead if a creature died this turn." Turn 1: cast Fatal Push → creature dies → Tragic Slip for -13/-13.

**Hellbent:**
- Hellbent rewards aggressive discard strategies (Rakdos-style) where your hand is emptied early.
- If you discard your last card to cast a madness card, you have zero cards in hand while the Hellbent check would occur — but the madness spell itself is on the stack, not in hand.
- Key card interaction: *Hellhole Flailer* (Return to Ravnica adjacent): "Hellbent — {1}, Sacrifice Hellhole Flailer: It deals damage equal to its power to any target. Activate only if you have no cards in hand." Must have zero cards WHEN activating.
- Key card: *Anthem of Rakdos* — "Whenever a creature you control attacks, it gets +2/+0 until end of turn. Hellbent — If you have no cards in hand, each opponent loses 2 life."

**Fateful Hour:**
- Fateful Hour rewards low-life situations, creating high-tension game states.
- Key card: *Increasing Devotion* doesn't have Fateful Hour. Classic Fateful Hour cards: *Gather the Townsfolk* ("Create two 1/1 white Human creature tokens. Fateful Hour — If you have 5 or fewer life, create five of those tokens instead."), *Thraben Sentry* (transforms at 5 or fewer life).
- Life gained after the morbid check fails to matter once the condition is checked. If your life was 4 when Gather resolved, you get 5 tokens even if you're now at 20 life by the time the tokens are actually created (same resolution).

## Canonical Examples

**Morbid:**
- *Brimstone Volley*: "Brimstone Volley deals 3 damage to any target. Morbid — Brimstone Volley deals 5 damage to that permanent or player instead if a creature died this turn." Classic: player takes exactly 5 damage after a creature dies in combat, potentially a kill-shot.
- *Garruk, the Veil-Cursed* (DFC): "Morbid — At the beginning of your upkeep, if a creature died last turn, put a +1/+1 counter on each creature you control." (Note: "last turn" vs. "this turn" matters — this is a trigger with intervening if clause.)

**Hellbent:**
- *Anthem of Rakdos*: "Whenever a creature you control attacks, it gets +2/+0 until end of turn. Hellbent — If you have no cards in hand, each opponent loses 2 life." Playing aggressively, discarding your hand to Rakdos mechanics creates repeated life drain.

**Fateful Hour:**
- *Gather the Townsfolk* (Dark Ascension): Gets 5 tokens instead of 2 if you're at 5 or fewer life. A perfect topdeck when losing.
- *Thraben Sentry* transforms to "Thraben Militia" (a larger creature) when Fateful Hour triggers — White Weenie strategies use the 5-or-fewer threshold to suddenly power up their team.

## Commonly Confused With

- **P006** (Intervening If Clause) — many Morbid abilities are resolution conditions, not intervening-if; check the card text for "if [condition], [effect]" phrasing at different positions
- **P033** (Madness discard) — discarding to enable madness can simultaneously empty your hand for Hellbent
- **P339** ("Dies" vs. LTB) — for morbid, "died" means the creature went to the GY; exile does not trigger morbid
- **P363** (Tokens) — tokens that die satisfy morbid (briefly enter GY before ceasing to exist)
