---
id: p374
name: Daybound, Nightbound, and Day/Night — Automatic Transform Based on Spell Count
category: continuous
cr_refs: [702.145a, 702.145b, 702.145c, 702.145d, 702.145e, 702.145f, 702.145g, 730.1, 730.2a, 730.2b, 730.2c]
tags: [daybound, nightbound, day-night, transform, spell-count, automatic-transform, two-spell-becomes-day, zero-spell-becomes-night, Innistrad-midnight-hunt, Tovolar, Werewolf, Arlinn-Kord, Delver-of-Secrets, night-designation, game-designation, DFC-daybound]
created: 2026-03-29
examples_count: 2
---

# P374 — Daybound, Nightbound, and Day/Night — Automatic Transform Based on Spell Count

## Abstract
**Day and Night** (rule 730) are designations the game itself can have (not any particular permanent). Once established, the game always has exactly one (day or night). **Daybound** and **nightbound** (702.145) are abilities on opposite faces of double-faced cards: daybound creatures transform to their nightbound face when it becomes night, and nightbound creatures transform back when it becomes day. The transitions are automatic (not state-based actions — they happen "any time" the condition is true). **Day transitions**: at the beginning of the untap step (730.2): if it's DAY and the previous active player cast 0 spells: it becomes NIGHT. If it's NIGHT and the previous active player cast 2+ spells: it becomes DAY. If it's neither, no check happens. Strategy: control the game's designation by controlling your spell count per turn.

## The Definitive Rules

**CR 730.1** (verbatim): *"Day and night are designations that the game itself can have. The game starts with neither designation. 'It becomes day' and 'it becomes night' refer to the game gaining the day or night designation. It can become day or night through the daybound and nightbound keyword abilities (see rule 702.145). Other effects can also make it day or night. Once it has become day or night, the game will have exactly one of those designations from that point forward."*

**CR 730.2a** (verbatim): *"If it's day and the previous turn's active player didn't cast any spells during that turn, it becomes night."*

**CR 730.2b** (verbatim): *"If it's night, and previous turn's active player cast two or more spells during the previous turn, it becomes day."*

**CR 730.2c** (verbatim): *"If it's neither day nor night, this check doesn't happen and it remains neither."*

**CR 702.145b** (verbatim): *"Daybound is found on the front faces of some double-faced cards and represents three static abilities. 'Daybound' means 'If it is night and this permanent is represented by a double-faced card, it enters transformed,' 'As it becomes night, if this permanent is front face up, transform it,' and 'This permanent can't transform except due to its daybound ability.'"*

**CR 702.145e** (verbatim): *"Nightbound is found on the back faces of some double-faced cards and represents two static abilities. 'Nightbound' means 'As it becomes day, if this permanent is back face up, transform it' and 'This permanent can't transform except due to its nightbound ability.'"*

## The Pattern

```
DAY/NIGHT DESIGNATION (730.1–730.2):
  GAME START:
    Game starts with NEITHER day nor night.
    Neither/neither designation: 730.2c: "this check doesn't happen and it remains neither."
    How does it become day or night?
      When a permanent with daybound or nightbound enters the battlefield (702.145d, 702.145g).
      Or: effects that specifically say "it becomes day" or "it becomes night."
  BECOMING DAY:
    702.145d: "Any time a player controls a permanent with daybound, if it's neither day nor night,
      it becomes day."
    So: cast a creature with daybound → game becomes day immediately.
    Once day: all daybound creatures are front-face-up (if somehow nightbound, they transform back).
  BECOMING NIGHT:
    702.145g: "Any time a player controls a permanent with nightbound, if it's neither day nor night
      and there are no permanents with daybound on the battlefield, it becomes night."
    Nightbound entering with no daybound on field → becomes night.
  CHECK AT UNTAP STEP (730.2):
    "As the second part of the untap step, the game checks the previous turn."
    Only checks if the game IS already day or night.
    BECOMING NIGHT FROM DAY (730.2a): if previous active player cast 0 spells → becomes night.
    BECOMING DAY FROM NIGHT (730.2b): if previous active player cast 2+ spells → becomes day.
    "Previous turn's active player" = the player who just finished their turn.
    If the person who controls werewolves casts 0 spells on their turn:
      At the start of their NEXT turn (other players' turns don't affect this):
      Wait: "previous turn's active player" = the player whose turn just ended.
      Each player's untap step: checks IF the previous player's turn had 0 or 2+ spells.
      This applies at every untap step, not just yours.
  WHO'S THE "PREVIOUS TURN'S ACTIVE PLAYER"?
    In multiplayer: each player's untap step checks if the PREVIOUS ACTIVE PLAYER (whoever
      just took their turn before you) cast 0 or 2+ spells.
    In 2-player: it's always the opponent's turn just before yours.
    In 4-player Commander: if Player A just took their turn and cast 1 spell, then Player B untaps.
      Player B's untap check: Player A cast 1 spell (not 0, not 2+). No change to day/night.
  HOW TO CONTROL IT:
    Controlling NIGHT (want werewolves in night form for bonus abilities):
      On your turn: cast exactly 1 spell. Day/night doesn't change from you.
      But opponent's spell count matters too (when it's their turn's check).
      If opponents consistently cast 2+ spells: it'll keep flipping back to day.
      Pure "werewolf" strategy: you want night. Cast 1 spell per turn (not 0, which might accidentally
        help stay at night if you were already day... wait: you want night. 0 spells = night from day.
        Actually you'd WANT to cast 0 spells some turn to become night. Then stay there.
      To STAY night: you need opponents to cast 1 or fewer spells (not enough to flip back to day).
    Controlling DAY:
      Cast 2+ spells per turn (if it's night and you want day for your daybound creatures).
      Staying at day: pass your turn with ≥1 spell cast.

DAYBOUND (702.145a–d):
  THE THREE ABILITIES:
    1. "If it is night and this permanent is represented by a DFC, it enters transformed."
       → If you cast a daybound creature when it's night: it enters in nightbound form.
         The day-form was never on the battlefield.
    2. "As it becomes night, if this permanent is front face up, transform it."
       → Transform happens AUTOMATICALLY when it becomes night. Not a triggered ability.
         "As it becomes night" = simultaneously with the night transition.
    3. "This permanent can't transform except due to its daybound ability."
       → Can't be transformed by other effects (e.g., "transform target creature"). Only
         day/night changes can transform daybound permanents.
  ENTERING AT NIGHT (702.145b):
    Cast a daybound creature when it's already night: it ENTERS in nightbound form.
    ETB triggers for the nightbound face fire (if any).
    The daybound face's ETB triggers do NOT fire (it never entered as the daybound face).
    This is important: different ETB triggers might be on day vs. night faces.

NIGHTBOUND (702.145e–f):
  THE TWO ABILITIES:
    1. "As it becomes day, if this permanent is back face up, transform it."
       → Automatic transform to front (daybound) face when it becomes day.
    2. "This permanent can't transform except due to its nightbound ability."
       → Same restriction as daybound: only day/night transitions can flip it.
  NIGHTBOUND ENTERING AT DAY:
    702.145f: "If a player controls a permanent that is back face up with nightbound and it's day,
      that player transforms that permanent." Happens immediately.
    So: if you cast a nightbound face creature (how? — nightbound is only on back faces of DFCs).
      You can't normally cast the back face.
      But: disturb or other effects might put the back face on the battlefield.
      If it enters as nightbound at day: immediately transforms.

PRACTICAL GAME PLAY — INNISTRAD WEREWOLVES:
  Werewolves (front face = daybound, back face = nightbound):
    Day: wolves are in "human" form (daybound). Often weaker.
    Night: wolves are in "wolf/werewolf" form (nightbound). Stronger abilities.
  Strategy: wolf players want it to be night permanently.
    Turn 1: land, pass. (0 spells → if day, would become night at next untap. But game starts neither.)
    Wait: game starts neither. Need to establish day/night first.
    Cast Tovolar, Dire Overlord ({1}{R}{G}): Daybound. Enters → game becomes day (702.145d).
    Turn 2: if you cast 0 spells this turn (sandbag): at start of turn 3 (your untap step), check
      previous turn (yours): 0 spells → it becomes night. Werewolves transform.
    But: opponent can also cast 2+ spells on THEIR turn to flip back to day at YOUR untap step.
    The tension: you pass turns with few spells; opponent wants to cast lots of spells to stay day.
  TOVOLAR, DIRE OVERLORD:
    Front face (daybound): "Whenever a Wolf or Werewolf you control deals combat damage to a player,
      draw a card. {R}{G}: Each Wolf or Werewolf you control gains haste until end of turn."
    At night (Tovolar the Midnight Scourge, nightbound):
      Larger stat line. "Whenever you transform one or more Wolves or Werewolves under your control,
        put X +1/+1 counters on each of them, where X is the number of Wolves and Werewolves you control."
    The game is won when it stays night.
```

## Definitive Conclusions

- **Day/night starts as neither and only transitions from there** — entering day or night happens when a daybound/nightbound permanent enters the battlefield in the appropriate state.
- **Day/night check happens at each untap step** — for the previous turn's active player: 0 spells cast = night from day; 2+ spells cast = day from night; 1 spell = no change.
- **Daybound permanents transform automatically when it becomes night** — not a triggered ability; it's simultaneous with the transition and can't be prevented (702.145b).
- **Can't transform daybound/nightbound except via day/night transitions** — other "transform target creature" effects don't work on these cards.
- **If it's night when a daybound creature enters, it enters in nightbound form** — the ETBs that fire are from the nightbound (back) face, not the daybound (front) face.

## Canonical Example
**Tovolar Werewolf Engine — Controlling Day/Night:**
Commander game. You're playing a Werewolf tribal deck. You control the board with 4 Wolves/Werewolves.
It's currently day (someone cast Tovolar last turn to establish day).

Your Turn 4: you want it to become night for Werewolf bonuses.
  You cast exactly 1 spell (a creature): costs 1 spell total this turn.
  End of your turn: you cast 1 spell. (Not 0, not 2+.)
  At your END STEP: nothing happens for day/night (check is at untap step).

Opponent's Turn (Player 2): they cast 3 spells to deal with your threats.
  End of their turn: they cast 3 spells (≥ 2).

Your Turn 5 UNTAP STEP: check previous turn (Player 2's): they cast 3 spells.
  730.2b: It's day, previous player cast 2+ spells → becomes day? Wait: 730.2b says NIGHT → DAY if 2+ spells.
  It's currently DAY. 730.2b only applies when it's NIGHT. No change.
  730.2a: If it's day, and previous player cast 0 spells → becomes night. Player 2 cast 3 spells. No change.

Your Turn 5: you have all your mana. You want night. You cast 0 spells (hold back).
  All mana available, no spells cast.

Player 3's Untap Step (after your turn 5): check previous turn (yours): 0 spells.
  730.2a: it's day, previous player cast 0 spells → BECOMES NIGHT.
  All your daybound werewolves transform to their nightbound forms simultaneously.
  Tovolar becomes Tovolar the Midnight Scourge.
  His transform trigger: "When you transform one or more Wolves/Werewolves, put X +1/+1 counters
    on each, where X = number of Wolves and Werewolves you control." X = 5 (Tovolar + 4 others).
  Each of your 5 creatures gets 5 counters. Massive power spike.

But: if Player 3 cast 2+ spells on their turn: day might return.
At Player 4's untap step: Player 3's spells count. If 2+: becomes day. Werewolves flip back.
This tug-of-war is the design tension of daybound/nightbound.

**Example 2 — Entering a Daybound Creature at Night:**
It's night. Your hand has Arlinn, the Pack's Hope (daybound face: {2}{R}{G} planeswalker).
Arlinn's front face has daybound. Back face is nightbound.
You cast Arlinn when it's night:
  702.145b: "If it is night and this permanent is represented by a DFC, it enters transformed."
  Arlinn enters as her NIGHTBOUND back face: Arlinn, the Moon's Fury.
  The front face's ETB triggers (if any) DON'T fire.
  The BACK FACE's ETB triggers (if any) fire.
  Arlinn, the Moon's Fury enters with appropriate loyalty counters (back face's starting loyalty).

If it were day when you cast Arlinn:
  She would enter as the front face (Arlinn, the Pack's Hope). Front ETB fires.
  If it later becomes night: she transforms to back face.

This matters for planeswalkers with different starting loyalty on each face.

## Commonly Confused With
- **P348 (Morph/Megamorph)** — Morph turns creatures face-up as a special action for a cost. Daybound/nightbound transform automatically (no cost, no special action). Morph is player-controlled; daybound/nightbound is game-state-controlled.
- **P002 (Replacement Effects)** — Daybound entering "already transformed" at night is a replacement-like effect (702.145b). It's technically not a replacement effect per the CR (it's a static ability that causes the permanent to enter on the other face), but it functions similarly to how ETB replacement effects work (614.12).
- **P011 (ETB Triggers)** — If a daybound creature enters at night (in nightbound form), the ETB triggers that fire are from the NIGHTBOUND face. The daybound face's ETBs don't fire. Which face's triggers fire = which face actually entered the battlefield.
- **P345 (Double-Faced Cards/Transform)** — P345 covers DFCs generally. P374 covers the specific daybound/nightbound mechanic that controls transform via game-wide day/night designation. The key difference from other DFC transforms: this one is automatic and tied to a game state (number of spells cast per turn), not a card's individual activated/triggered abilities.
