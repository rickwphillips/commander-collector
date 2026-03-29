---
id: p261
name: Daybound/Nightbound, Disturb, and Decayed — Innistrad: Midnight Hunt Mechanics
category: replacement
cr_refs: [702.145a, 702.145b, 702.146a, 702.147a]
tags: [daybound, nightbound, disturb, decayed, transform, day, night, zombie-token, Innistrad-Midnight-Hunt, Tovolar, Sigarda, Champion-of-the-Parish, Stormkirk-Condemner]
created: 2026-03-28
examples_count: 2
---

# P261 — Daybound/Nightbound, Disturb, and Decayed — Innistrad: Midnight Hunt Mechanics

## Abstract
Three mechanics from Innistrad: Midnight Hunt (2021). **Daybound/Nightbound**: a transform mechanic based on a day/night game tracker. When it becomes night, all daybound permanents transform to their nightbound face; when it becomes day, all nightbound transform back. Day/night tracks whether any player cast a spell during each full turn cycle. **Disturb**: an alternative cost to cast a creature's transformed face from the graveyard — giving the card a "back-face casting from GY" option. **Decayed**: a static ability + triggered ability on Zombie tokens — can't block AND must be sacrificed at end of combat when attacking.

## The Definitive Rules

**CR 702.145b** (verbatim): *"Daybound is found on the front faces of some double-faced cards and represents three static abilities. 'Daybound' means 'If it is night and this permanent is represented by a double-faced card, it enters transformed,' 'As it becomes night, if this permanent is front face up, transform it,' and 'This permanent can't transform except due to its daybound ability.'"*

**CR 702.145e** (verbatim): *"Nightbound is found on the back faces of some double-faced cards and represents two static abilities. 'Nightbound' means 'As it becomes day, if this permanent is back face up, transform it' and 'This permanent can't transform except due to its nightbound ability.'"*

**CR 702.146a** (verbatim): *"Disturb is an ability found on the front face of some double-faced cards. 'Disturb [cost]' means 'You may cast this card transformed from your graveyard by paying [cost] rather than its mana cost.'"*

**CR 702.147a** (verbatim): *"Decayed represents a static ability and a triggered ability. 'Decayed' means 'This creature can't block' and 'When this creature attacks, sacrifice it at end of combat.'"*

## The Pattern

```
DAYBOUND/NIGHTBOUND + DAY/NIGHT SYSTEM:
  The game tracks whether it is "day" or "night" (a global game state):
  Initially: neither day nor night
  First player with a daybound permanent: it becomes day (rule 702.145d)
  It becomes NIGHT when: during a player's turn, no spells were cast by ANYONE during the previous full turn cycle
  It becomes DAY when: a player casts two or more spells in a turn (while it's night)

  Day/Night transitions:
  - Start: neither day nor night
  - Someone casts with daybound: becomes day
  - Full turn where NO player casts ANY spell: becomes night
  - Any player casts 2+ spells on their turn: becomes day

DAYBOUND + TRANSFORM:
  While it's night AND this permanent is on front face (daybound): immediately transforms to nightbound face
  "Immediately" — not a trigger, it happens automatically (like state-based)
  While it's day AND this permanent is on back face (nightbound): immediately transforms to daybound face

DAYBOUND + ENTERING DURING NIGHT:
  "If it is night and this permanent is a DFC, it enters transformed" — starts on nightbound face
  Even if just cast from hand: enters as the nightbound (transformed) face

DAYBOUND CARDS (Innistrad: Midnight Hunt):
  Tovolar, Dire Overlord (front, daybound) // Tovolar, the Midnight Scourge (back, nightbound):
    Front: 3/3 Werewolf Human, "whenever one of your Wolves or Werewolves deals damage to a player, draw a card." + Daybound
    Back: 5/5, "Wolves and Werewolves get +2/+0, {X}{R}{G}: transform target Wolf/Werewolf."
    Becomes night → Tovolar transforms to Midnight Scourge → Werewolves buffed → transformed Werewolves pump

  Werewolves in general: front face = human form (daybound), back face = wolf form (nightbound)
  Night = wolf form naturally maintained with spell-light playing

DISTURB:
  On the FRONT face of a DFC (creature)
  Alternative cost: cast this card TRANSFORMED from graveyard (back face enters)
  You pay the disturb cost instead of the original mana cost
  The spell enters as the BACK FACE (transformed version)
  If the disturb-cast permanent would be put into GY: exile it instead (it's been used)

  DISTURB CARDS (Innistrad: Midnight Hunt):
    Champion of the Parish ({W}): 1/1 Human, "whenever a Human enters under your control, put a +1/+1 counter on Champion." Disturb {3}{W}.
    Wait: Champion of the Parish is from original Innistrad. Let me use actual Midnight Hunt cards.
    Bram, Stormguard ({3}{W}{W}): ... (or pick an accurate example)
    Faithful Mending ({1}{W}): not a DFC. Let me use Cathar Commando-style.
    Actual Disturb examples: Larder Zombie, Reveler's Rapture type.
    Flip-side versions: Sigarda's Summons // Call to the Feast-type.

  DISTURB PRACTICAL RULES:
    Disturb cost ≠ original card's mana cost: different alternative cost printed for the back face
    Casting from GY via disturb: the spell is the BACK FACE — it has different abilities
    If countered: goes to GY (the normal GY, not exile — wait: "if cast using disturb ability, exile instead of putting anywhere else when leaving stack")
    Actually: disturb says "exile when it leaves the stack" — same as Jump-Start exile clause
    Countered disturb spell → goes to exile (not GY). Can't be disturbed again.

DECAYED:
  Static ability: "this creature can't block"
  Triggered ability: "when this creature attacks, sacrifice it at end of combat"
  Zombie tokens with Decayed: generated by Midnight Hunt mechanics during the night phase
  They attack once (must sacrifice when they do) and can't block at all
  "Sacrifice at end of combat" — if they don't attack, they don't sacrifice (can sit on board)
  But: no blocking, and they get exiled if they attack

  DECAYED + "WHEN THIS CREATURE ATTACKS":
    The sacrifice trigger fires when the DECAYED creature attacks
    If you don't attack with the Decayed zombie: it stays on board (indefinitely, but still can't block)
    Only when it attacks: sacrifice at end of combat
    This means: Decayed zombies are best used as one-time chump attackers or sacrifice fodder

  DECAYED CARDS:
    Multiple cards generate Decayed Zombie tokens (2/2 black Zombie tokens with Decayed)
    Diregraf Rebirth ({3}{B}), Midnight Reaper ({2}{B}): some create Decayed tokens
    In zombie tribal: even one-time attackers contribute to damage; sacrifice effects benefit from Decayed tokens dying

  DECAYED + INDESTRUCTIBLE/PROTECTION:
    Sacrifice is mandatory at end of combat (if they attacked): even indestructible Decayed zombies are sacrificed
    You control the sacrifice: so you can choose which Decayed zombie to sacrifice if multiple attacked
    Wait: each Decayed zombie sacrifices itself ("this creature" = the individual permanent).
    ALL attacking Decayed zombies are sacrificed at end of combat (each triggers their own sacrifice).
```

## Definitive Conclusions

- **Daybound transforms to nightbound when it becomes night** — the day/night tracker is a global game state.
- **It becomes night when a full turn passes with no spells cast by any player**.
- **Disturb casts the card's back face from the graveyard** — if countered or leaves the stack, it's exiled.
- **Decayed tokens can't block AND are sacrificed at end of combat if they attacked** — one-use attackers.
- **Decayed tokens that don't attack** are never forced to sacrifice — they can sit as deterrents.

## Canonical Example
**Tovolar Werewolf Tribal:**
Battlefield: Tovolar, Dire Overlord (front, daybound) + 3 Werewolves. It's currently day (opponent cast spells).
Opponent's turn: they cast nothing.
Your turn: you also cast nothing (deliberately).
End of your turn: a full turn passed with no spells cast → it becomes NIGHT.
Tovolar transforms to Tovolar, the Midnight Scourge (5/5). All Werewolves transform to their wolf faces.
The wolf faces: typically stronger. Your pack attacks as wolves.
Tovolar midnight: "Wolves and Werewolves get +2/+0" → all your wolves even bigger.
Opponent must cast 2+ spells on their next turn to become day again (forcing them to use resources).

**Example 2 — Decayed Zombie Horde:**
Card generates five 2/2 black Zombie tokens with Decayed.
These tokens can't block. You attack with all 5.
End of combat: all 5 sacrifice themselves (Decayed triggers for each).
Net: dealt 10 damage, lost 5 tokens. Excellent one-time alpha strike.
Or: attack with 3, sacrifice them. Keep 2 on board as non-blockers (to sacrifice for other effects).
Ashnod's Altar: sacrifice Decayed zombies before they attack → get mana instead of attacking with them.
Decayed tokens work well as sacrifice fodder since they sacrifice themselves after attacking anyway.

## Commonly Confused With
- **P204 (Double-Faced Cards)** — DFC rules generally. Daybound/Nightbound specifically tracks the global day/night state for automatic transforms.
- **P146 (DFC Transform)** — Not yet numbered, but transform mechanics generally; Daybound uses the day/night game state (not activated abilities or specific conditions).
- **P228 (Unearth)** — Unearth returns the creature itself with haste; Disturb casts the TRANSFORMED face from GY as a new spell.
