---
id: p495
name: Tarkir Dragonstorm Keywords — Behold, Endure, Harmonize, and Mobilize
category: costs
cr_refs: [701.4, 701.63, 702.180, 702.181]
tags: [behold, endure, harmonize, mobilize, additional-cost, reveal, dragon, graveyard-cast, alternative-cost, cost-reduction, attacking-tokens, combat, sacrifice, tarkir-dragonstorm, TDM]
created: 2026-03-29
examples_count: 4
---

# P495 — Tarkir Dragonstorm Keywords — Behold, Endure, Harmonize, and Mobilize

## Abstract
**Tarkir: Dragonstorm** (2025; CR 701.4, 701.63, 702.180, 702.181) introduced four distinct mechanics. **Behold** is an additional cost — either tap or reveal a Dragon card from your hand, with optional behold providing enhanced effects. **Endure** is a replacement instruction — N +1/+1 counters on this permanent OR create a 2/2 white Spirit token, chosen at resolution; the token fallback always works even if the source has left the battlefield. **Harmonize** is a graveyard cast alternative: pay the harmonize cost instead of the mana cost, optionally tap an untapped creature to reduce generic cost by its power, and the spell is always exiled when it leaves the stack regardless of outcome. **Mobilize** creates N tapped-and-attacking 1/1 red Warrior tokens when the creature attacks — those tokens enter combat without being declared as attackers, and are sacrificed at the beginning of the next end step (unless protected by Zurgo, Thunder's Decree's "can't be sacrificed" effect during your own end step).

## The Definitive Rules

**CR 701.4** (verbatim): *"'Behold' means 'reveal a card from your hand that has the [subtype] subtype or choose a [subtype] permanent you control.' If it's a cost, the player must reveal that card or choose a permanent you control with that subtype."*

**CR 701.63** (verbatim): *"'Endure N' means 'Put N +1/+1 counters on this permanent or create a 2/2 white Spirit creature token.'"*

**CR 702.180** (paraphrased from rulings): Harmonize is an alternative cost. "You may cast this card from your graveyard by paying [harmonize cost] rather than paying its mana cost. As an additional cost, you may tap an untapped creature to reduce the generic mana in this cost by an amount equal to that creature's power. If this spell would be put into a graveyard from the stack or exiled from the stack, exile it instead."

**CR 702.181** (paraphrased from rulings): Mobilize is a triggered ability. "When this creature attacks, create N tapped and attacking 1/1 red Warrior creature tokens. Sacrifice those tokens at the beginning of the next end step."

## The Pattern

```
BEHOLD (CR 701.4):
  "Behold a Dragon" = choose one of:
    (a) Choose a Dragon you control on the battlefield, OR
    (b) Reveal a Dragon card from your hand.
  The chosen creature/card is the "beheld Dragon."

  REQUIRED vs. OPTIONAL BEHOLD:
    Required behold: "As an additional cost to cast this spell, behold a Dragon."
      → Must have either a Dragon on battlefield or a Dragon card in hand to cast.
      → Cannot cast the spell without beholding.
    Optional behold: "You may behold a Dragon. If a Dragon was beheld, [enhanced effect]."
      → Can cast without beholding (no additional cost needed).
      → The enhanced effect only applies if beheld.
      → "If a Dragon was beheld" is checked at resolution, not at cast time.
      → A card already revealed (via Telepathy, etc.) can still be "revealed" again.

  BEHELD STATE PERSISTENCE:
    The "was beheld" state tracks from cast time through resolution.
    It does NOT check if the Dragon still exists.
    → If you behold a Dragon in hand, then discard it before the spell resolves,
      the "if a Dragon was beheld" condition is still TRUE.
    → If you behold a battlefield Dragon, then it dies before the spell resolves,
      the "if a Dragon was beheld" condition is still TRUE.

  DRAGON SUBTYPE REQUIREMENT:
    The card or permanent must have the Dragon creature subtype.
    A permanent that temporarily has the Dragon type (e.g., from a copy effect) qualifies
      while on the battlefield.
    A card in hand must have Dragon printed as its subtype — temporary type-granting
      effects don't apply to cards in hand.

  KEY CARDS:
    Caustic Exhale ({B}, Instant): "As an additional cost to cast this spell, behold a Dragon
      or pay {1}." Target creature gets -3/-3. (You can cast it by beholding a Dragon
      OR paying {1} extra — both routes are valid.)
    Dispelling Exhale ({1}{U}, Instant): OPTIONAL behold; Counter target spell unless
      its controller pays {2} (no behold) OR {4} (Dragon was beheld).

ENDURE (CR 701.63):
  "Endure N" = controller chooses one:
    (a) Put N +1/+1 counters on this permanent, OR
    (b) Create a 2/2 white Spirit creature token.
  Choice is made at RESOLUTION — not when the trigger goes on the stack.

  KEY RULINGS:
    If the permanent is no longer on the battlefield when endure resolves:
      → You CANNOT put counters on it (it's gone).
      → You CAN still create the Spirit token (the token fallback always works).

    If the permanent is a noncreature permanent:
      → +1/+1 counters can be placed on it (they sit dormant if it's not a creature).
      → The Spirit token is still a legal alternative.

    Doubled counters (Doubling Season, Hardened Scales):
      → If you choose option (a), the counter doublers apply normally.
      → If you choose option (b), the token creation is unaffected.

    Endure while the creature is legendary:
      → The Spirit token is 2/2 white Spirit, not legendary.
      → Multiple Spirit tokens from multiple Endure triggers don't affect each other.

  ANAFENZA, UNYIELDING LINEAGE — KEY INTERACTION:
    Anafenza ({2}{W}: 2/2 Spirit Soldier; Flash, First strike):
    "Whenever another nontoken creature you control dies, Anafenza endures 2."

    If 3 other nontoken creatures die simultaneously (e.g., board wipe):
      → 3 separate Endure 2 triggers fire.
      → Anafenza is also dead (if hit by the wipe).
      → All 3 triggers resolve with Anafenza NOT on the battlefield.
      → All 3 triggers create a 2/2 Spirit token (can't put counters on gone Anafenza).
      → Net: THREE Spirit tokens from a single board wipe.

    Self-referential death: Anafenza says "another nontoken creature," so her own
      death doesn't trigger her own ability.

HARMONIZE (CR 702.180):
  Harmonize = alternative graveyard-cast + creature-tap cost reduction:

  CASTING:
    (a) The card must be in YOUR graveyard.
    (b) Pay the harmonize cost (not the mana cost).
    (c) Optionally: tap one untapped creature to reduce generic cost by that creature's power.
    (d) Normal timing rules still apply (sorceries = sorcery speed).
    (e) Normal additional costs (if any) still apply on top of harmonize cost.

  COST REDUCTION:
    The tapped creature's POWER reduces the generic component of the harmonize cost.
    Power is checked at time of payment.
    Tapping a 0-power creature: legal, reduces by 0.
    Reducing below 0: generic cost doesn't go below 0.
    ONLY generic mana is reduced — colored components are unchanged.

    Example: Channeled Dragonfire harmonize cost = {5}{R}{R}.
      Tap a 3-power creature → pay {2}{R}{R} instead.
      Tap a 5-power creature → pay {R}{R} instead.
      Tap a 6-power creature → pay {R}{R} (can't reduce below 0 generic).

  ALWAYS EXILED — NO EXCEPTION:
    If the spell resolves → exiled from the stack (not put to GY again).
    If the spell is countered → exiled from the stack.
    If the spell is returned to hand → the card goes to hand (exception: it leaves the stack
      via going to hand, not GY). Actually: "if this spell would be put into a graveyard from
      the stack OR exiled from the stack, exile it instead." Return to hand = neither, so
      Remand still works as expected (returns to hand).

  COPY INTERACTIONS:
    If you copy a harmonize spell on the stack (Fork, Reverberate, etc.):
      → The copy resolves/is countered as a copy-object (no physical card).
      → The copy goes to its owner's GY as a copy-object — no card to exile.
      → Only the original card is exiled when it leaves the stack.

  MANA VALUE:
    The spell's mana value is ALWAYS determined by the printed mana cost, not the
      harmonize cost actually paid. Cascade finds Channeled Dragonfire ({R}) based on MV=1,
      regardless of the harmonize cost.

  ENTERS GY THIS TURN:
    If a harmonize card enters your GY during your turn (e.g., dies in combat, is milled),
      you can immediately cast it via harmonize if timing allows. The card is available
      for harmonize casting as soon as it's in your GY.

  KEY CARDS:
    Channeled Dragonfire ({R}): 2 damage to any target / Harmonize {5}{R}{R}
    Glacial Dragonhunt ({U}{R}): draw/discard, deal 3 on discard / Harmonize {4}{U}{R}
    Mammoth Bellow ({2}{G}{U}{R}): create 5/5 Elephant / Harmonize {5}{G}{U}{R}

MOBILIZE (CR 702.181):
  "Mobilize N" = triggered ability on attacking creatures.
  Trigger: "When this creature attacks..."
  Effect: Create N tapped and attacking 1/1 red Warrior creature tokens.
  Sacrifice: Those tokens are sacrificed at the beginning of the next end step.

  TOKENS ENTER ATTACKING — NOT DECLARED ATTACKING:
    The tokens enter as attacking creatures, but they were NEVER DECLARED as attackers.
    Consequence: effects that trigger "whenever a creature attacks" or
      "whenever a creature is declared as an attacker" do NOT fire for Mobilize tokens.
    Exception: effects that look at attacking creatures (e.g., "creatures you control
      that are attacking get +1/+1") DO apply — the tokens are attacking creatures once
      on the battlefield.

  MOBILIZE TOKENS AND COMBAT:
    You choose which player, planeswalker, or battle each token attacks when they enter.
      → Tokens need not match the attacking creature's target.
    Tokens bypassed the "declare attackers" step, so:
      → No exert trigger on these tokens (exert is a declare-attackers option).
      → No "when this creature is exerted" effects either.
      → Triggers that fire "at the beginning of combat" don't fire for them (they ETB
        mid-combat during the declare-attackers step).
    First strike and double strike still work — tokens participate in first-strike
      damage if they have those abilities.

  VARIABLE MOBILIZE:
    Avenger of the Fallen: "Mobilize X, where X is the number of creature cards in
      your GY."
    X is calculated when the trigger resolves (at declare attackers step).
    Removing GY cards between attack declaration and trigger resolution WILL reduce X.

  ZURGO EXCEPTION — END STEP SACRIFICE PROTECTION:
    Zurgo, Thunder's Decree ({R}{W}{B}: 2/4): "Mobilize 2. During your end step,
      Warrior tokens you control have 'This token can't be sacrificed.'"

    The Mobilize sacrifice trigger fires "at the beginning of the next end step."
    Zurgo's protection applies "during your end step."

    If Zurgo is present: your own Warrior tokens can't be sacrificed during your end step.
      → The sacrifice trigger fires, but the tokens have "can't be sacrificed" → the
        sacrifice cost can't be paid → the sacrifice doesn't happen.
      → Tokens survive YOUR end step.
      → Tokens persist into opponents' turns.
      → On the NEXT end step (opponent's or another player's), Zurgo's "your end step"
        protection doesn't apply → tokens ARE sacrificed at that end step trigger.
      → Net: Zurgo gives tokens one full extra round of life (survive your own end step,
        die at next player's end step).

    This means:
      → Mobilize tokens with Zurgo attack on your turn.
      → They survive through your end step.
      → They block on an opponent's turn (they're untapped since they entered tapped
        but remain on the field... wait: tokens entered tapped and attacking, so they
        ARE tapped at end of combat. They would untap at your next untap step, but
        they're sacrificed at the NEXT end step after creation.
      → With Zurgo, they survive to your NEXT untap step, untap, can block or attack again.

  KEY CARDS:
    Bone-Cairn Butcher ({1}{R}{W}{B}: 4/4 Demon): Mobilize 2. Attacking tokens have deathtouch.
    Avenger of the Fallen ({2}{B}: 2/4 Human Warrior): Deathtouch. Mobilize X (# creature cards in GY).
    Zurgo, Thunder's Decree ({R}{W}{B}: 2/4 Orc Warrior): Mobilize 2. Warrior tokens can't be
      sacrificed during your end step.
```

## Definitive Conclusions

- **Behold requires the Dragon subtype specifically** — a card in hand must have Dragon printed; battlefield permanents must have the subtype (temporary grants work); the "was beheld" state persists even if the beheld Dragon is later removed or discarded.
- **Endure's token fallback always creates a Spirit** — even when the source is no longer on the battlefield; Anafenza dying simultaneously with three other creatures nets three 2/2 Spirit tokens.
- **Harmonize is always exiled when it leaves the stack** — whether it resolves, is countered, or is removed; only returning to hand (Remand) bypasses this; copies of harmonize spells aren't affected.
- **Harmonize cost reduction taps one creature, reduces generic only** — tapping a creature reduces by its power (checked at payment time), never below 0; colored components are unchanged.
- **Mobilize tokens enter attacking without being declared** — "whenever a creature attacks" triggers don't fire; the tokens are still attacking creatures once on the battlefield; you choose each token's combat target.
- **Zurgo extends Mobilize tokens one extra round** — "can't be sacrificed" during your own end step means tokens survive until the next player's end step, allowing one additional untap and potential block/attack.

## Canonical Example

**Anafenza, Unyielding Lineage + Mass Removal:**

You control Anafenza ({2}{W}: 2/2 Spirit Soldier; Endure 2 on nontoken death) and three other nontoken creatures. Opponent casts Wrath of God. All four die simultaneously.

Anafenza says "another nontoken creature" — she triggers for each of the three other creatures: 3× Endure 2 triggers fire simultaneously, then Anafenza herself dies (she doesn't trigger for herself).

All 3 triggers resolve. Anafenza is not on the battlefield. Each trigger: choose Spirit token (can't put counters on gone Anafenza).

→ Three 2/2 white Spirit tokens enter the battlefield.

**Example 2 — Harmonize with Bone-Cairn Butcher:**

Bone-Cairn Butcher ({1}{R}{W}{B}: 4/4 Demon; Mobilize 2) dies. Channeled Dragonfire ({R}: deals 2 damage to any target; Harmonize {5}{R}{R}) is in your graveyard.

Butcher is gone. On your next main phase, you want to cast Channeled Dragonfire via harmonize. You control a 4/4 creature.

Pay harmonize {5}{R}{R}: tap the 4/4 creature → reduce {5} generic by 4 → cost is now {1}{R}{R}.
Spell resolves: deals 2 damage. Channeled Dragonfire is exiled (not put into GY again).

**Example 3 — Mobilize Tokens Attack:**

Bone-Cairn Butcher attacks. Mobilize 2 trigger fires. Create two tapped 1/1 red Warrior tokens entering as attacking. Bone-Cairn Butcher also has "Attacking tokens you control have deathtouch."

The two 1/1 Warriors are attacking and have deathtouch. You assign them to attack the opponent.
At beginning of next end step: sacrifice both Warrior tokens.

No "whenever a creature attacks" triggers fired for the Warriors when they entered attacking — they were never declared. However, something like Reconnaissance ({W}: return an attacking creature to its controller's hand) CAN target them after they've entered, because they ARE attacking creatures.

**Example 4 — Zurgo Warrior Persistence:**

Zurgo, Thunder's Decree attacks. Two Warriors enter tapped and attacking. Your turn ends — your end step begins. Sacrifice trigger fires on both Warriors, but they have "can't be sacrificed" during your end step (Zurgo's static). Sacrifice fails. Warriors survive to your opponent's turn.

On your opponent's turn, Warriors are untapped (your untap step happened). Opponent's end step begins: sacrifice trigger fires. No protection now — Warriors are sacrificed.

Net: Warriors lived for ~2 turns total (your combat turn + untap + opponents' full turn).

## Commonly Confused With
- **P494 (Exhaust)** — Exhaust is also a Tarkir/Aetherdrift mechanic but is an "activate only once" restriction, not any of these four mechanics. Both are from the 2025 expansion cycle.
- **P487 (Plot)** — Plot is also a "special action" that interacts with being cast; Harmonize is not a special action — it's a normal alternative-cost cast from the graveyard, which can be responded to.
- **P427 (Cascade)** — Cascade has a similar "free cast from exile" effect; Harmonize is different in that it's an alternative cost paid by the caster (not a random exile event), and the spell is cast from the graveyard, not from exile.
- **P024 (Zone Change Object Identity)** — Mobilize tokens enter as new objects attacking; they follow the same new-object rules as any other ETB creature once on the battlefield.
