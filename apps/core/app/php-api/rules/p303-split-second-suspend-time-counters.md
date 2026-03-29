---
id: p303
name: Split Second and Suspend — Uncounterable Stack Lock and Time Counter Exile Casting
category: stack
cr_refs: [702.61a, 702.61b, 702.62a, 702.62b, 702.62d, 702.63a]
tags: [split-second, suspend, time-counter, uncounterable, no-response, exile, vanishing, Ancestral-Vision, Living-End, Krosan-Grip, Sudden-Death, Pact-of-Negation, cascade-combo]
created: 2026-03-29
examples_count: 2
---

# P303 — Split Second and Suspend — Uncounterable Stack Lock and Time Counter Exile Casting

## Abstract
**Split second** creates a hard lock on the stack — while a split-second spell is on the stack, players can't cast spells or activate non-mana abilities. Triggered abilities still trigger and go on the stack, but nothing new can be cast. This effectively makes split-second spells "uncounterable" by most counterspells (since casting a counterspell is casting a spell, which is blocked). **Suspend** is a mechanic where you exile a card with time counters; at the beginning of each upkeep, one counter is removed; when the last is removed, the card is cast for free (and if it's a creature, it gains haste). Suspend enables powerful effects with delayed timing.

## The Definitive Rules

**CR 702.61a** (verbatim): *"Split second is a static ability that functions only while the spell with split second is on the stack. 'Split second' means 'As long as this spell is on the stack, players can't cast other spells or activate abilities that aren't mana abilities.'"*

**CR 702.61b** (verbatim): *"Players may activate mana abilities and take special actions while a spell with split second is on the stack. Triggered abilities trigger and are put on the stack as normal while a spell with split second is on the stack."*

**CR 702.62a** (verbatim): *"Suspend is a keyword that represents three abilities. The first is a static ability that functions while the card with suspend is in a player's hand. The second and third are triggered abilities that function in the exile zone. 'Suspend N—[cost]' means 'If you could begin to cast this card by putting it onto the stack from your hand, you may pay [cost] and exile it with N time counters on it. This action doesn't use the stack,' and 'At the beginning of your upkeep, if this card is suspended, remove a time counter from it,' and 'When the last time counter is removed from this card, if it's exiled, you may play it without paying its mana cost if able...'"*

## The Pattern

```
SPLIT SECOND:
  While on stack: no spells can be cast, no non-mana activated abilities
  What CAN still happen:
    Mana abilities: tap a land, activate Llanowar Elves — these still work
    Special actions: (morph face-up, day/night changes, suspend exile) — still work
    TRIGGERED abilities: if something triggers (combat damage, ETB), the trigger still goes on the stack
      BUT: nothing NEW can be cast or activated in response

  WHY SPLIT SECOND IS "UNCOUNTERABLE":
    Counterspell: {U}{U}, Instant — "Counter target spell."
    When a split-second spell is on the stack:
      You CAN'T cast Counterspell. Split second prevents it.
      The split-second spell resolves uncountered.
    Exception: stifle targets a triggered ability (split second only blocks spells and activations)
      Stifle: "Counter target activated or triggered ability." Stifle IS a spell → blocked by split second.
      Actually: stifle IS a spell (instant), so it can't be cast either.
    What CAN counter a split-second spell: existing triggered abilities already on stack.
      But those are very unusual scenarios.

  NOTABLE SPLIT SECOND CARDS (Time Spiral block):
    Krosan Grip ({2}{G}): Instant — Split Second. "Destroy target artifact or enchantment."
      Opponent can't activate the artifact's ability in response.
      Opponent can't sacrifice the enchantment in response (activation blocked).
      Cannot respond with Disenchant to "trade" — they can't cast it either.
      Classic example: opponent activates Aetherflux Reservoir (50-life burn).
        Wait: the activation already happened → it's on the stack → split second is too late.
        Split second prevents NEW activations, not ones already on the stack.
      But: opponent CAN'T activate Basalt Monolith to save life → it's blocked.

    Sudden Death ({1}{B}): Instant — Split Second. "Target creature gets -4/-4 until EOT."
      Opponent can't activate "Regenerate" ability (activated ability → blocked).
      Opponent can't tap an indestructible creature to sacrifice it (sacrifice cost not relevant here).
      Fog also won't work (it's a spell).
      Pure targeted kill with no response window.

    Sudden Shock ({1}{R}): Instant — Split Second. "Deals 2 damage to any target."
      Hit a creature that would normally use an activated ability to respond.
      No activating Gobling Weld, no Rings of Brighthearth, no mana rocks for protection.

    Pact of Negation ({0}): Instant. "Counter target spell. At the beginning of your next upkeep,
      pay {3}{U}{U}. If you don't, lose the game."
      NOT split second, but often misunderstood: Pact of Negation IS a spell.
      You CAN cast Pact targeting a split-second spell? No — you can't cast Pact while split second is on stack.
      Pact is a spell = blocked by split second.

  SPLIT SECOND + TRIGGERS:
    Triggered abilities still fire (CR 702.61b).
    Example: Sulfuric Vortex (enchantment) triggers at your upkeep.
    When split-second spell is on stack, the upkeep trigger was already placed before the spell.
    Those triggers are already on the stack: they resolve BEFORE split second (LIFO order? No.)
    Actually: split second spell is on stack. Triggers go ON TOP. They resolve first.
    Then split second spell below tries to resolve.
    So a triggered ability can potentially "counter" a split second spell? No:
    Nothing counters it directly. But a triggered ability's effect might affect the board.

SUSPEND:
  From hand: pay the suspend cost (sorcery speed, stack not used) → exile with N time counters.
  Each upkeep: remove one time counter (triggered ability).
  When last counter removed: trigger fires → "you may play it without paying its mana cost"
    Casting from exile with free mana cost.
    If it's a creature spell: gains Haste "until you lose control of the spell or the permanent."

  SUSPEND NOTABLE CARDS:
    Ancestral Vision ({U}, Suspend 4 — {U}):
      No regular mana cost! MV = 0. Cannot be cast normally (no mana cost).
      Suspend: pay {U}, exile with 4 time counters.
      Upkeep 1: 3 counters. Upkeep 2: 2. Upkeep 3: 1. Upkeep 4: 0 → cast for free.
      Resolves: "Draw 3 cards."
      From turn 1 suspend: fires on turn 5 (opponent's turn 5 upkeep if it was your turn 1).
      Wait: your suspend was paid on your turn 1. Your upkeep on turns 2, 3, 4, 5 remove counters.
      On your upkeep turn 5: last counter removed. You may cast Ancestral Vision for free. Draw 3.
      4-turn investment for draw 3: powerful delayed value.

    Living End ({B}{B}{B}, Suspend 3 — {2}{B}):
      No regular mana cost! MV = 0.
      Suspend: exile with 3 time counters. After 3 upkeeps: cast for free.
      Resolves: each player sacrifices all creatures; each player returns all creature cards from GY.
      The key: it can't be cast normally (no mana cost).
      BUT: cascade can find it (MV 0 < any cascade spell's MV).
      This is the Living End combo: cascade into it immediately instead of waiting 3 turns.

    Crashing Footfalls ({G}{G}, Suspend 4 — {G}):
      Also MV 0. "Create two 4/4 green Rhino creature tokens."
      Can't be cast normally. Cascade finds it.
      Cascade + Violent Outburst: instant-speed two 4/4 rhinos.

    Riftwing Cloudskate ({3}{U}{U}): Creature. Suspend 5 — {U}.
      CAN be cast normally for {3}{U}{U}, but also suspendable for {U}.
      When it enters (either way): return target permanent to owner's hand.
      Suspended: it enters with Haste (it's a creature entering via suspend last counter).
      Flash + Haste + bounce: enters and attacks or surprises opponent.

  SUSPEND TIMING DETAILS:
    Paying the suspend cost is a SPECIAL ACTION (not a spell, doesn't use the stack).
    Opponents can't respond to the suspension action itself.
    The time counter removal is a triggered ability at upkeep.
    If a counter is added via Proliferate: extends the suspend time.
    If all counters are removed at once (other effect): last-counter trigger fires multiple times?
      No: the trigger checks "when the last time counter is removed." If all removed simultaneously,
      that's the "last" removal event. Trigger fires once.

  SUSPEND + HASTE:
    Creatures entering via suspend gain haste until "you lose control of the permanent."
    This means: the haste lasts as long as you control it.
    Permanent haste for suspension-cast creatures!
    If it changes controllers: haste ends (you lost control).

  VANISHING (related — CR 702.63a):
    Like suspend but for permanents already on battlefield.
    "Vanishing N": enters with N time counters. Each upkeep: remove one.
    When last removed: sacrifice the permanent.
    Used on: Fungus, Slivers, various creatures that "expire" after N turns.
    Example: Tidewalker ({3}{U}): "Vanishing 3. When last time counter removed, Tidewalker gains
      flying until EOT."
    Proliferate can extend vanishing permanents (add counters → more upkeeps before sacrifice).
```

## Definitive Conclusions

- **Split second blocks all spells and non-mana activations** — triggered abilities still fire and go on the stack.
- **Krosan Grip destroys artifacts/enchantments without any response window** — opponent can't sacrifice, activate, or counter it.
- **Suspend casts cards from exile for free when the last time counter is removed** — creatures gain haste on this free cast.
- **Zero-mana-value suspend cards (Living End, Ancestral Vision) are cascade targets** — cascade always finds them since any cascade spell's MV > 0.
- **Vanishing is suspend in reverse** — permanents on the battlefield lose counters and are sacrificed when depleted.

## Canonical Example
**Krosan Grip Destroying Aetherflux Reservoir Without Response:**
Opponent controls Aetherflux Reservoir (artifact that can pay 50 life → deal 50 damage).
You cast Krosan Grip targeting Aetherflux Reservoir.
Opponent sees Krosan Grip on the stack. They want to activate Aetherflux Reservoir to kill you.
Krosan Grip has split second: opponent CAN'T activate Aetherflux Reservoir (activated ability → blocked).
Opponent CAN still tap lands to generate mana (mana ability — allowed).
But they can't use that mana to cast a counterspell (casting a spell → blocked).
Krosan Grip resolves: Aetherflux Reservoir is destroyed.
No response window. No saves.
Compare to regular Naturalize: opponent could have activated Aetherflux Reservoir in response to Naturalize.
Split second: the window is closed entirely.

**Example 2 — Ancestral Vision Turn-1 Suspend:**
Turn 1: pay {U}. Exile Ancestral Vision face-up with 4 time counters. Stack not used.
Turns 2, 3, 4 upkeep: each removes one time counter (3, 2, 1 counters remaining).
Turn 5 upkeep: last time counter removed. Triggered ability fires.
"You may cast Ancestral Vision without paying its mana cost."
Cast Ancestral Vision (sorcery, but suspend fires at upkeep = you cast it now).
Wait: upkeep casting — instants and sorceries can be cast when triggered abilities put spells on the stack?
Actually: the trigger says "you may play it without paying mana cost if able." Playing requires priority.
The trigger is put on the stack at beginning of upkeep. When it resolves: cast it.
Ancestral Vision resolves: draw 3 cards.
Total investment: {U} on turn 1. Return: 3 cards on turn 5.
The delayed timing is the "cost": you're 4 turns behind on the cards but got them for almost free.
In Modern blue tempo decks: turn 1 Ancestral Vision is the best card-advantage investment possible.

## Commonly Confused With
- **P297 (Cascade)** — Cascade interacts with suspend's MV-0 cards specifically: Living End and Crashing Footfalls are the core cascade combo targets because they can't be cast normally.
- **P283 (Foretell)** — Foretell also exiles for a later discounted cast; but foretell goes to your exile during your turn manually, while suspend is a special action and uses time counters.
- **P216 (Proliferate)** — Proliferate adds counters to permanents AND exiled suspended cards — this can accelerate or extend suspend timing strategically.
- **P272 (Impending)** — Impending also uses time counters but in the opposite direction: the permanent starts as a non-creature and becomes a creature when counters run out (not sacrificed).
