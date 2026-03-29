---
id: p417
name: Suspend and Vanishing — Time Counter Mechanics, Free Cast from Exile, and Sacrifice on Last Counter
category: zones
cr_refs: [702.62a, 702.62b, 702.62c, 702.62d, 702.63a, 702.63b]
tags: [suspend, vanishing, time-counters, exile-zone-casting, haste-on-suspend-creature, free-cast, counter-removal, upkeep-trigger, Rift-Bolt, Lotus-Bloom, Greater-Gargadon, Phyrexian-Ingester, Timespiral, suspend-delay, vanishing-sacrifice, suspend-land, suspend-grafdiggers-cage, suspend-cast-not-suspended]
created: 2026-03-29
examples_count: 2
---

# P417 — Suspend and Vanishing — Time Counter Mechanics, Free Cast from Exile, and Sacrifice on Last Counter

## Abstract
**Suspend** (702.62) lets you exile a card from your hand with time counters on it for a cheaper cost; at each upkeep you remove a time counter, and when the last is removed, you cast it for free (and it gains haste if it's a creature). **Vanishing** (702.63) is the inverse: permanents enter with time counters, and when the last counter is removed (one per upkeep), the permanent is sacrificed. Both use the upkeep trigger to tick down. Key non-obvious interactions include: suspended cards gain haste only when cast from suspend (not always); grafdigger's cage prevents casting suspended cards (they're cast from exile); opponents can interact with time counters using proliferate or counter-removal effects; and a suspended card's controller doesn't change if control changes after suspending.

## The Definitive Rules

**CR 702.62a** (verbatim): *"Suspend is a keyword that represents three abilities. The first is a static ability that functions while the card with suspend is in a player's hand. The second and third are triggered abilities that function in the exile zone. 'Suspend N—[cost]' means 'If you could begin to cast this card by putting it onto the stack from your hand, you may pay [cost] and exile it with N time counters on it. This action doesn't use the stack,' and 'At the beginning of your upkeep, if this card is suspended, remove a time counter from it,' and 'When the last time counter is removed from this card, if it's exiled, you may play it without paying its mana cost if able. If you don't, it remains exiled. If you cast a creature spell this way, it gains haste until you lose control of the spell or the permanent it becomes.'"*

**CR 702.62b** (verbatim): *"A card is 'suspended' if it's in the exile zone, has suspend, and has a time counter on it."*

**CR 702.62c** (verbatim): *"While determining if you could begin to cast a card with suspend, take into consideration any effects that would prohibit that card from being cast."*

**CR 702.62d** (verbatim): *"Casting a spell as an effect of its suspend ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.63a** (verbatim): *"Vanishing is a keyword that represents three abilities. 'Vanishing N' means 'This permanent enters with N time counters on it,' 'At the beginning of your upkeep, if this permanent has a time counter on it, remove a time counter from it,' and 'When the last time counter is removed from this permanent, sacrifice it.'"*

**CR 702.63b** (verbatim): *"Vanishing without a number means 'At the beginning of your upkeep, if this permanent has a time counter on it, remove a time counter from it' and 'When the last time counter is removed from this permanent, sacrifice it.'"*

## The Pattern

```
SUSPEND (702.62):
  THREE ABILITIES:
  1. Static (in hand): "If you could begin to cast this card from hand, pay [cost] and exile
     it with N time counters." This action doesn't use the stack.
  2. Triggered (in exile): "At beginning of your upkeep, if this card is suspended, remove
     a time counter from it."
  3. Triggered (in exile): "When the last time counter is removed, if it's exiled, you may
     cast it without paying its mana cost. If you do and it's a creature, it gains haste."

KEY RULES:
  Suspending is a special action (doesn't use the stack) — can be done while split second
    is on the stack (P416).
  The card must be castable from hand to be suspended. If effects prevent casting (e.g.,
    the card is a sorcery and it's not your main phase), you still CAN suspend — 702.62c
    says "take into consideration any effects that would PROHIBIT casting." Timing
    restrictions that would normally prohibit the cast don't prevent suspending, but
    actual prohibitions (like "you can't cast spells") do.
    Clarification: Lotus Bloom ({0}: artifact, "tap: add 3 mana of any one color; suspend 3—{0}")
      can be suspended at any time from hand (its mana cost is {0}, and it's an artifact,
      which can be cast as a sorcery). The timing restriction doesn't prohibit suspending.
  The upkeep trigger fires at the beginning of YOUR upkeep (the card's owner's upkeep,
    or technically the controller's — actually the card is in exile, owned by its owner.
    The suspend trigger fires at "the beginning of YOUR upkeep" — "your" = the card's owner's
    upkeep). If the card was stolen and placed in exile, the original owner's upkeep ticks down.
  When the last counter is removed: "if it's exiled." If the card was somehow moved from exile
    before the trigger resolves, the trigger does nothing (the card isn't in exile).

HASTE ON SUSPENDED CREATURES (702.62a):
  "If you cast a creature spell this way, it gains haste until you lose control of the spell
    or the permanent it becomes."
  ONLY if cast via suspend (the last-counter trigger).
  Casting the same card from hand (normally) doesn't grant haste.
  Haste lasts "until you lose control" — if an opponent steals the suspended creature, it
    loses haste (you lost control of the permanent it became).
  This is powerful: Rift Bolt ({2}{R}: instant, deal 3 damage to any target; suspend 1—{R}):
    Suspend on turn 1 for {R}. Next turn: the last counter trigger fires, cast it for free.
    It deals 3 damage. (Rift Bolt is an instant, not a creature — no haste applies here.)
  Greater Gargadon ({9}{R}: 9/7; suspend 10—{R}):
    Suspend on turn 1 for {R}. Each turn: remove a counter (10 turns).
    While suspended (10 turns): you may sacrifice permanents to Greater Gargadon?
    No — that would require activating its ability. But Greater Gargadon doesn't have
    a sacrifice ability while suspended. It's suspended in exile.
    After 10 turns: cast for free with haste. Attack immediately.
    Synergy: while waiting for Gargadon's counters to tick down, sacrifice creatures
    to other effects (like Viscera Seer) before Gargadon "comes out."
    Actually: Greater Gargadon has "suspend 10—{R}" — you can sacrifice a permanent
    with the suspend timing. This allows you to remove counters early by... wait.
    Can you remove counters from a suspended card?
    COUNTER INTERACTION: Proliferate adds counters (including time counters). You can
    PROLIFERATE time counters onto a vanishing permanent to extend its life or onto a
    suspended card to DELAY it further. Also: effects that remove specific counters (like
    "remove a time counter from target permanent") can remove suspend counters.
    Opponents can proliferate your suspended card to delay it. You can proliferate
    vanishing to extend it.

GRAFDIGGER'S CAGE + SUSPEND:
  702.62c: "while determining if you could begin to cast a card with suspend, take into
    consideration any effects that would prohibit that card from being cast."
  The last-counter trigger says "you may play it without paying its mana cost if able."
  "If able" = can you begin to cast it?
  Grafdigger's Cage: "players can't cast spells from graveyards or libraries."
  Suspended card is in exile, not GY or library. So Cage doesn't prevent casting it.
  Wait: "from graveyards or libraries" — exile is neither. Cage does NOT stop suspend.
  CONFIRMED: Grafdigger's Cage does not prevent casting a suspended card.
  (Cage stops casting from GY and library; suspend casts from exile.)

PROLIFERATE AND TIME COUNTERS:
  Proliferate (choose any number of permanents and/or players with counters, add a counter
    of a type already there): can add time counters to both suspended cards AND vanishing permanents.
  Proliferate on suspended card: ADD a time counter → delays the card (one more upkeep needed).
    Opponents can use this to delay your suspended cards.
    You can use this to delay your OWN suspend (if you need more time before the card enters).
  Proliferate on vanishing permanent: ADD a time counter → extends the permanent's life.
    You can use proliferate with Vanishing creatures to keep them alive longer.
    Combine with Clockspinning (to remove counters) to control the timing.
  Clockspinning ({U}: instant, "add or remove a time counter from target permanent or suspended card"):
    Can remove ALL remaining time counters from a suspended card, forcing immediate cast.
    Can add time counters to vanishing to extend life.
    Can remove the last time counter from vanishing to force sacrifice.

VANISHING (702.63):
  THREE ABILITIES:
  1. Enters with N time counters.
  2. At upkeep: remove a time counter.
  3. "When the last time counter is removed from this permanent, sacrifice it."
  Sacrifice trigger fires when the LAST counter is removed. Not at upkeep — it's a separate
    trigger ("when the last time counter is removed").
  Removal of counters from non-upkeep effects: if someone removes all time counters at once
    (e.g., Vampire Hexmage removing all counters from a target), the trigger fires immediately
    (on the next priority — SBA check, then triggered abilities onto stack).
  RESULT: You can "kill" a vanishing permanent early by removing its time counters.

VANISHING PERMANENT LEAVES BATTLEFIELD — DIES TRIGGER:
  The vanishing trigger says "sacrifice it." Sacrifice = dies (goes to GY unless replaced).
  Dies triggers fire. If the permanent has an ETB or "when you sacrifice" trigger: they fire.
  Example: Ertai, the Corrupted (vanishing 3) dies from vanishing. Its dies trigger (if any) fires.

SUSPEND + "CAST WITHOUT PAYING ITS MANA COST" INTERACTIONS:
  When the last suspend counter is removed and you cast the card for free:
  It follows alternative cost rules (702.62d: "follows the rules for paying alternative costs").
  You can still pay additional costs (kicker, etc.) on top of the free cast.
  Example: a suspended card with kicker: when cast from suspend, you STILL have the option
    to pay the kicker cost for additional effects.
  You CANNOT pay the mana cost (it's replaced by free cast).
```

## Definitive Conclusions

- **Haste from suspend applies only to creatures cast via the last-counter trigger** — not to any other way of casting the same card; haste lasts until you lose control of the permanent.
- **Grafdigger's Cage does NOT stop suspended cards from being cast** — Cage prohibits casting from GY and library; suspended cards are in exile; the "if able" in suspend's trigger is satisfied.
- **Proliferate can delay suspended cards or extend vanishing permanents** — opponents can use proliferate to delay your key suspended spells; you can use it to extend vanishing creatures.
- **The vanishing sacrifice trigger fires immediately when the last counter is removed**, even by non-upkeep effects (like Vampire Hexmage removing all counters) — the trigger fires at the next priority window.
- **Suspended cards can still have additional costs paid when cast for free** — kicker, etc. can still be paid on top of the "free" suspend cast.

## Canonical Example
**Lotus Bloom and Greater Gargadon — Suspend Synergy:**
Turn 1: Suspend Lotus Bloom ({0}: artifact; suspend 3—{0}). Pay {0}, exile with 3 time counters.
Suspend Greater Gargadon ({9}{R}: 9/7; suspend 10—{R}). Pay {R}, exile with 10 time counters.

You now have 2 suspended cards in exile. Both tick down each of your upkeeps.

Turn 1-3 upkeeps: each removes a counter from Lotus Bloom.
Turn 4 upkeep: last counter removed from Lotus Bloom. Cast it for free. Sol Ring-like: {T}: add 3 mana.

Turn 1-10 upkeeps: each removes a counter from Gargadon.
Turn 11 upkeep: last counter removed from Gargadon. Cast for free with haste. Attack for 9.

The total investment: {R} (suspend both on turn 1) + 0 for Bloom + 0 for Gargadon.
You've effectively played two huge permanents for {R} over 10 turns.

Proliferate interaction: if you proliferate on turn 5 (when Gargadon has 5 counters left),
  you ADD a counter: now 6 counters. Gargadon takes 1 more upkeep to emerge.
  Opponent can use this to delay your 9/7 haste creature.

Clockspinning interaction: cast Clockspinning targeting Greater Gargadon, remove 1 counter.
  Now Gargadon has 4 counters (from 5). Speeds up its emergence by 1 turn.
  Cast Clockspinning with buyback ({1}{U} extra): remove counter AND return Clockspinning to hand.
  Repeat each turn: accelerate Gargadon's emergence.

**Example 2 — Vanishing and Vampire Hexmage:**
You control a Phyrexian Ingester ({5}{U}: 3/3 vanishing 2; "when Phyrexian Ingester enters, exile target nontoken creature"):
Ingester entered with 2 time counters.
Upkeep 1: remove 1 counter. 1 remaining.
Upkeep 2: remove last counter. Vanishing trigger: sacrifice Phyrexian Ingester.

But: before upkeep 2, opponent controls Vampire Hexmage ({1}{B}: 2/1, "when Vampire Hexmage enters, remove all counters from target permanent").

They target Phyrexian Ingester. Remove all counters (1 remaining → 0).
"When the LAST time counter is removed" — the Hexmage removed the last counter.
Vanishing trigger fires IMMEDIATELY (next priority window): sacrifice Phyrexian Ingester.
Ingester goes to GY before your upkeep. The exiled creature (from Ingester's ETB) stays in exile.
(The exiled creature is "exiled until Phyrexian Ingester leaves the battlefield" — it's now back.)

Wait: Phyrexian Ingester's exile effect: "when it enters, exile target creature... return that creature when Ingester leaves the battlefield." If Ingester dies early (via vanishing triggered by Hexmage), the exiled creature returns.

Lesson: opponents can weaponize vanishing by removing counters early to return exiled creatures.

## Commonly Confused With
- **P416 (Split Second)** — Suspending a card is a special action allowed during split second (116.2d). Vanishing sacrifice is a triggered ability (also allowed during split second). Both mechanics can be relevant in split-second scenarios.
- **P005 (Simultaneous Deaths and Triggers)** — Multiple vanishing permanents all losing their last counter in the same turn: each fires its sacrifice trigger separately, going on the stack in APNAP order. Each trigger resolves in order.
- **P410 (Replacement Effects — GY Hate)** — Grafdigger's Cage doesn't stop suspend (exile, not GY). Leyline of the Void doesn't prevent suspend activation (the card goes to exile directly via suspend, not via the GY). However, if a suspended card somehow goes to GY instead of resolving, the GY hate rules apply.
- **P407 (Cycling/Kicker/Buyback)** — Kicker costs can still be paid when casting a suspended card for free (additional costs on alternative-cost spells are allowed). This parallels how flashback spells can have kicker paid on top of the flashback cost.
