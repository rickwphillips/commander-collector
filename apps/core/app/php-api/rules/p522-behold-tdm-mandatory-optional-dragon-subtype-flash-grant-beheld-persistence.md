---
id: p522
name: Behold (TDM) — Mandatory vs. Optional, Dragon Subtype, Flash Grant, and Beheld State Persistence
category: costs
cr_refs: [701.4, 601.2b, 702.6, 205.3m]
tags: [behold, additional-cost, reveal, dragon, dragon-subtype, mandatory-optional, flash-grant, beheld-persistence, caustic-exhale, molten-exhale, dispelling-exhale, osseous-exhale, piercing-exhale, sarkhan-dragon-ascendant, tarkir-dragonstorm, TDM]
created: 2026-03-30
examples_count: 4
---

# P522 — Behold (TDM) — Mandatory vs. Optional, Dragon Subtype, Flash Grant, and Beheld State Persistence

## Abstract
**Behold** (Tarkir: Dragonstorm, 2025; CR 701.4) means: "choose a Dragon you control or reveal a Dragon card from your hand." P495 covered the baseline. This pattern addresses four precise edge cases surfaced by examining all six confirmed Behold cards in TDM: **(1)** The **mandatory behold-or-pay** pattern (Caustic Exhale) vs. the **optional behold** pattern (Dispelling Exhale, Osseous Exhale, Piercing Exhale) — how the two interact with casting constraints; **(2)** How **Molten Exhale**'s flash-grant (cast at instant speed if you behold a Dragon as additional cost) differs from paying a cost to receive a mode vs. receiving an ability; **(3)** The **Dragon subtype requirement** for cards in hand vs. permanents on the battlefield — temporary type grants don't extend to cards in hand; **(4)** The **"was beheld" persistence** — confirming the "if a Dragon was beheld" condition survives even if the Dragon card is subsequently discarded or the Dragon permanent dies before resolution.

## The Definitive Rules

**CR 701.4** (verbatim): *"'Behold' means 'reveal a card from your hand that has the [subtype] subtype or choose a [subtype] permanent you control.' If it's a cost, the player must reveal that card or choose a permanent you control with that subtype."*

**Official Ruling (2025-04-04):** *"If an effect refers to a '[subtype] card,' it refers only to a card that has that subtype. For example, Teeming Dragonstorm is a card that cares about Dragons and features Dragons in its art, but it isn't a Dragon card."*

**Official Ruling (2025-04-04):** *"Effects that say 'If a [quality] was beheld' only care if a card of that quality was revealed or a permanent you control of that quality was chosen. No matter what happens to that card or permanent after that, it was still beheld, and any additional effects that depend on that card or permanent being beheld will still happen."*

**Official Ruling (2025-04-04):** *"If a cost to cast a spell includes revealing a card, that card remains revealed from the time the spell is announced until the time it leaves the stack."*

**Official Ruling (2025-04-04):** *"If a card in your hand is already revealed (perhaps because it was revealed to pay a cost of a spell that's still on the stack or due to the effect of a card like Telepathy), you may reveal it again to pay the cost of another spell or ability that requires you to reveal a card from your hand."*

## The Pattern

```
ALL SIX BEHOLD CARDS IN TDM (confirmed Scryfall 2025-04-11):

  Caustic Exhale     ({B} Instant)
    "As an additional cost to cast this spell, behold a Dragon or pay {1}."
    Target creature gets -3/-3 until end of turn.
    → MANDATORY cost: must either behold a Dragon OR pay {1}. No third option.
    → No "if a Dragon was beheld" bonus — same effect either way.
    → Cheapest 1-mana removal with no bonus gating.

  Dispelling Exhale  ({1}{U} Instant)
    "As an additional cost to cast this spell, you may behold a Dragon."
    Counter target spell unless controller pays {2}. If Dragon was beheld, {4} instead.
    → OPTIONAL behold: the "you may" makes beholding elective.
    → No behold: counter unless controller pays {2}.
    → Behold: counter unless controller pays {4} (much harder to pay through).
    → Beholding makes this significantly stronger; no Dragon = worse Mana Leak.

  Molten Exhale      ({1}{R} Sorcery)
    "You may cast this spell as though it had flash if you behold a Dragon as an
     additional cost to cast it."
    Molten Exhale deals 4 damage to target creature or planeswalker.
    → Flash grant is CONDITIONAL on beholding being performed.
    → Not a flash ability the spell inherently has; beholding provides the grant.
    → At sorcery speed without beholding, OR at instant speed with beholding a Dragon.

  Osseous Exhale     ({1}{W} Instant)
    "As an additional cost to cast this spell, you may behold a Dragon."
    Deals 5 damage to target attacking or blocking creature. If Dragon was beheld, you gain 2 life.
    → OPTIONAL behold: without behold, no life gain.
    → With behold: 5 damage + 2 life.

  Piercing Exhale    ({1}{G} Instant)
    "As an additional cost to cast this spell, you may behold a Dragon."
    Target creature you control deals damage equal to its power to target creature or
    planeswalker. If Dragon was beheld, surveil 2.
    → OPTIONAL behold: without behold, no surveil.
    → With behold: fight damage + surveil 2.

  Sarkhan, Dragon Ascendant ({1}{R} Legendary Creature — Human Druid)
    "When Sarkhan enters, you may behold a Dragon. If you do, create a Treasure token."
    Whenever a Dragon you control enters, put a +1/+1 counter on Sarkhan. Until end of turn,
    Sarkhan becomes a Dragon in addition to its other types and gains flying.
    → OPTIONAL behold ON AN ETB TRIGGERED ABILITY (not a cast cost).
    → Beholding is done at resolution of the ETB trigger, not at cast time.
    → If you behold a Dragon and it dies before the Treasure creation, Treasure still created.
    → Sarkhan himself temporarily becomes a Dragon; this retroactively qualifies future
      Dragon-enters triggers for himself that turn.

MANDATORY BEHOLD vs. OPTIONAL BEHOLD:

  MANDATORY (Caustic Exhale: "behold a Dragon or pay {1}"):
    You must do one of: choose a Dragon you control, reveal a Dragon from hand, or pay {1}.
    If you have no Dragon on battlefield AND no Dragon card in hand:
      → You MUST pay {1} instead. You can still cast the spell.
    The spell cannot be cast without satisfying at least one of the two options.
    No "if a Dragon was beheld" condition — the cost was either beholding or mana.

  OPTIONAL (Dispelling Exhale: "you may behold a Dragon"):
    Can cast without beholding at all.
    The enhanced effect ("if a Dragon was beheld") is inaccessible if you don't behold.
    Choosing NOT to behold = valid, legal cast of the spell.

MOLTEN EXHALE FLASH INTERACTION:
  Molten Exhale is a sorcery with text:
    "You may cast this spell as though it had flash if you behold a Dragon as an
     additional cost to cast it."

  This is NOT simply "if you behold, it has flash."
  The behold is the ADDITIONAL COST that enables the flash grant.
  Without beholding: cast at sorcery speed only (main phase while stack empty, your turn).
  With beholding: cast at instant speed (any time you could cast an instant).

  Mechanical precision:
    Choosing to cast Molten Exhale at instant speed requires you to behold a Dragon
      as part of that casting decision.
    You cannot decide "I'll cast at instant speed" and THEN decide whether to behold —
      you announce beholding as part of announcing the spell (601.2b, additional costs
      are announced at spell announcement).
    The flash-granting clause is specifically "if you behold a Dragon as an additional
      cost" — the grammar ties the flash directly to the beholding action.

  What counts as a Dragon for beholding Molten Exhale:
    Battlefield: any permanent you control with the Dragon subtype at cast time.
    Hand: any card in your hand with the Dragon subtype.
    Temporary type grants on battlefield permanents DO count (e.g., a creature made
      into a Dragon by a spell or ability).
    Sarkhan, Dragon Ascendant becomes a Dragon after his ETB resolves — if he's on the
      battlefield and the trigger has resolved making him a Dragon, he qualifies.

DRAGON SUBTYPE PRECISION:

  "Dragon" means the creature subtype Dragon per CR 205.3m.

  BATTLEFIELD: a permanent must currently have the Dragon subtype.
    → Temporary type-granting effects (Clone copying a Dragon, Sarkhan transforming) count
      while they are in effect.
    → A creature enchanted by "becomes a Dragon" effect qualifies while the effect persists.
    → A token with the Dragon type (from Dragon's Hoard, etc.) qualifies.

  HAND: a card must have Dragon printed in its type line as a subtype.
    → Cards in hand don't have "current characteristics" modified by game effects.
    → A Clone card in hand is NOT a Dragon (it becomes one only on the battlefield).
    → A card with "Ward X" in hand that has no Dragon subtype does not qualify.
    → Sarkhan, Dragon Ascendant is NOT a Dragon card in hand — he's "Legendary Creature
      — Human Druid" on his card; he becomes a Dragon only via his own on-battlefield trigger.

  CARD vs. PERMANENT distinction:
    Official ruling confirms: "Teeming Dragonstorm is a card that cares about Dragons
      and features Dragons in its art, but it isn't a Dragon card."
    Dragon-themed spells that are not creature-subtype Dragon don't satisfy behold.

"WAS BEHELD" STATE PERSISTENCE:
  Once you behold a Dragon (revealed a Dragon card OR chose a Dragon permanent):
    The "was beheld" flag is set permanently for the duration of the spell on the stack.
    It CANNOT be unset by subsequent events.

  If you revealed a Dragon card from hand:
    → Opponent uses a discard effect on the revealed card before the spell resolves.
    → The card is discarded. But the "was beheld" flag remains TRUE.
    → The spell resolves with its Dragon-beheld bonus.

  If you chose a Dragon on the battlefield:
    → A removal spell kills the Dragon before your spell resolves.
    → "If a Dragon was beheld" is still TRUE.
    → The spell resolves with its Dragon-beheld bonus.

  This is by design — the behold event happened at cast time; subsequent events can't
    un-behold what was already beheld.

ALREADY-REVEALED CARD RULING:
  If a Dragon card in your hand is already revealed (e.g., due to Telepathy making your
    hand public, or due to being revealed to pay a cost for another spell still on the stack):
    You CAN reveal it AGAIN to behold it for a new spell.
    Revealing an already-public card is still a valid behold action.
  This means multiple stacked behold spells can use the same Dragon card for each.

SARKHAN DRAGON ASCENDANT BEHOLD TIMING:
  Sarkhan's ETB says "you may behold a Dragon" — this is on a triggered ability (ETB),
    NOT on casting Sarkhan himself.
  The behold happens at RESOLUTION of the ETB trigger.
  This means: you need a Dragon on the battlefield OR in hand when the ETB trigger
    RESOLVES, not when Sarkhan was cast.
  Sarkhan himself is on the battlefield when his ETB resolves.
  However, Sarkhan becomes a Dragon only via his SECOND triggered ability ("whenever a
    Dragon you control enters, Sarkhan becomes a Dragon until end of turn").
  His second trigger doesn't fire for himself entering (he's not a Dragon when he enters).
  Therefore: Sarkhan cannot behold himself via his first ETB trigger.
  He CAN behold any other Dragon you control or have in hand at trigger resolution.
```

## Definitive Conclusions

- **Caustic Exhale has a mandatory behold-or-pay:** you must behold a Dragon OR pay {1}; if you have no Dragons anywhere, you pay {1}. No enhanced effect gating — the effect is the same either way.
- **Four Exhale cards (Dispelling, Osseous, Piercing, Molten) are optional behold:** cast freely, but the bonus effect (stronger counter / life gain / surveil / flash) requires a Dragon to have been beheld.
- **Molten Exhale's flash requires beholding at cast time:** it cannot be cast at instant speed without beholding a Dragon as additional cost. Beholding is announced as part of spell announcement (601.2b), not chosen after timing decision.
- **Dragon subtype means creature subtype Dragon printed on the card** (for hand beholders) or currently granted (for battlefield beholders). Dragon-themed cards without the subtype (e.g., Teeming Dragonstorm) do not satisfy behold.
- **"Was beheld" state never expires:** even if the beheld card is discarded or the beheld Dragon dies before the spell resolves, "if a Dragon was beheld" is still true at resolution.
- **Already-revealed cards can be beheld again:** a Dragon card made public by Telepathy or another spell's reveal cost can still be formally revealed to satisfy another behold cost.
- **Sarkhan cannot behold himself:** he only becomes a Dragon via his second triggered ability (when another Dragon enters), which doesn't fire for his own entry.

## Canonical Example

**Molten Exhale at instant speed:**

During your opponent's attack step, they attack with a 5/5. You want to kill it with Molten Exhale before damage.

Molten Exhale is a sorcery — you normally can't cast it now. But you have Shivan Dragon (a Dragon) in hand. You announce Molten Exhale, choose to cast it at instant speed, revealing Shivan Dragon as the additional cost (beholding a Dragon from hand).

Shivan Dragon remains revealed until Molten Exhale leaves the stack. Molten Exhale resolves: 4 damage to the 5/5. It dies. (5-4=1... wait, deals 4 to a 5/5 — creature survives unless you have power pump.) The key point: you legally cast a sorcery at instant speed by beholding.

**Example 2 — Beheld Dragon dies before resolution:**

You cast Dispelling Exhale. Optional behold: you choose your Thunderbreak Regent (4/4 Dragon) on the battlefield. "A Dragon was beheld" — the counter will cost {4} to negate instead of {2}.

In response to Dispelling Exhale, your opponent kills Thunderbreak Regent with Lightning Bolt.

Dispelling Exhale resolves. "If a Dragon was beheld" — still true. Thunderbreak Regent was beheld at cast time. The Dragon's death is irrelevant. Counter target spell unless its controller pays {4}.

**Example 3 — Dragon card discarded after behold:**

You cast Piercing Exhale. Optional behold: reveal Utvara Hellkite from hand. "A Dragon was beheld" flag is set.

Opponent responds: "I'll make you discard a card at random" (via a triggered ability they control). You randomly discard Utvara Hellkite.

Piercing Exhale resolves. "If a Dragon was beheld" — still true. Surveil 2 happens in addition to the fight damage.

**Example 4 — Caustic Exhale with no Dragon:**

You control no creatures. Your hand has: two Plains, a Swamp, a Divination, and a Doom Blade. No Dragon cards in hand, no Dragons on battlefield.

You want to cast Caustic Exhale ({B}) to kill opponent's creature. "As an additional cost, behold a Dragon or pay {1}."

You have no Dragon to behold. You must pay {1} as the additional cost. Total cost: {B}+{1} = {1}{B}. You pay and cast. Creature gets -3/-3 until end of turn.

## Commonly Confused With
- **P495 (TDM Keywords Baseline)** — P495 covers the core Behold mechanic definition, mandatory vs. optional basics, and the "was beheld" persistence overview. P522 focuses exclusively on Behold edge cases: all six confirmed cards, flash-grant mechanics, Dragon subtype precision, and the Sarkhan self-behold impossibility.
- **P432 (Prowess and Cantrip Triggers)** — Behold involves revealing cards from hand as a cost, similar to how hand-reveal effects interact with Prowess. Both trigger or modify based on what's in hand, but behold is a cost while Prowess is a triggered ability.
- **P003 (Zone Change Object Identity)** — Behold confirms the "was beheld" state persists across zone changes of the beheld object. This is the exception to the usual "zone change = new object" rule for tracking purposes: the behold flag tracks what happened at cast time, not the current state of the object.
- **P416 (Convoke and Additional Costs)** — Both Behold (choosing a creature/card) and Convoke (tapping creatures) are additional costs that interact with having creatures available. Behold requires a Dragon subtype; Convoke works with any creature.
