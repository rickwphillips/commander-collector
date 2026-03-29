---
id: p214
name: Buyback — Additional Cost to Return a Spell to Hand After Resolving
category: costs
cr_refs: [702.27a]
tags: [buyback, additional-cost, return-to-hand, reuse-spell, Capsize, Whispers-of-the-Muse, Tempest]
created: 2026-03-28
examples_count: 2
---

# P214 — Buyback — Additional Cost to Return a Spell to Hand After Resolving

## Abstract
Buyback is an optional additional cost: pay the buyback cost when casting a spell to have it return to your hand instead of going to the graveyard after it resolves. This transforms any buyback spell into a repeatable effect — as long as you can afford the mana each turn. The most notorious buyback spell in competitive MTG is Capsize ({1}{U}{U}, buyback {3}) — the combination of bouncing any permanent AND returning to hand makes it an almost-unbreakable soft-lock in mono-blue decks.

## The Definitive Rules

**CR 702.27a** (verbatim): *"Buyback appears on some instants and sorceries. It represents two static abilities that function while the spell is on the stack. 'Buyback [cost]' means 'You may pay an additional [cost] as you cast this spell' and 'If the buyback cost was paid, put this spell into its owner's hand instead of into that player's graveyard as it resolves.' Paying a spell's buyback cost follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
BUYBACK MECHANICS:
  Optional additional cost when casting
  If paid: spell returns to HAND (instead of graveyard) when it resolves
  If not paid: spell resolves normally and goes to graveyard
  The buyback effect is from the second static ability — happens AT RESOLUTION (when the spell resolves)

BUYBACK + COUNTERING:
  If the spell with buyback is countered: it goes to GRAVEYARD (not hand)
  Buyback only returns to hand if the "buyback cost was paid" AND it resolves
  Countered spells don't resolve → buyback effect never triggers
  The spell goes to graveyard when countered regardless of buyback

BUYBACK + STORM:
  Cast a buyback spell with storm: storm triggers, copies are created
  Storm copies don't have the buyback effect (copies don't pay costs)
  Original spell: returns to hand (if buyback paid), storm copies: go to graveyard

BUYBACK + COPY SPELL:
  If you copy a buyback spell (via Reverberate): the copy doesn't have buyback
  Original: may return to hand. Copy: goes to graveyard.
  Because the copy didn't pay buyback cost (copies never pay costs)

BUYBACK + STORM COUNT:
  Each time you cast with buyback: adds 1 to storm count
  Repeating buyback spell each turn: adds to storm count

CAPSIZE ({1}{U}{U}, buyback {3}):
  Bounce any nonland permanent
  With buyback ({1}{U}{U}+{3}={4}{U}{U}): bounce a permanent AND return Capsize to hand
  Next turn: do it again. And again. As long as you have 6 mana each turn.
  Soft-lock: opponent can never maintain board presence if Capsize is active
  Common in Vintage/Legacy/Commander combo with infinite mana
  With infinite mana: Capsize everything, then win at leisure

BUYBACK + CARD ADVANTAGE:
  Whispers of the Muse ({U}): "Draw a card." Buyback {5}.
  Pay {6} total: draw a card AND return to hand
  Next turn: draw again. Infinite card draw with infinite mana.
  "Infinite mana + Whispers of the Muse = draw your whole deck"

BUYBACK + POLITICAL EFFECTS:
  Any instant/sorcery with buyback becomes repeatable
  Political spells (Charms, targeted removal) with buyback: very powerful
  "Lobotomy with buyback" would be game-breaking (there isn't one, but the pattern)

BUYBACK + GRAVEYARD INTERACTION:
  If you choose NOT to use buyback: spell goes to graveyard
  From graveyard: normal recursion applies (Eternal Witness, etc.)
  Strategic choice: buyback vs. letting it go to graveyard for later recursion
  Sometimes: cheaper to NOT use buyback and reanimate than to pay buyback cost every turn

BUYBACK IN COMMANDER:
  Capsize with infinite mana: win by bouncing opponents' entire boards
  Whispers of the Muse with infinite mana: draw your whole deck
  Buyback + Isochron Scepter? No — Scepter imprints and copies, doesn't reuse; Scepter casts copies
  Isochron Scepter casts a copy, not the original — the copy doesn't have buyback
```

## Definitive Conclusions

- **Buyback = additional cost that returns the spell to hand** when it resolves.
- **Only if resolved** — countered spells go to graveyard regardless of buyback.
- **Repeatable spell** — as long as you can pay, cast the same spell every turn.
- **Capsize** is the most powerful buyback spell — bounce anything + repeat = soft-lock.
- **Storm copies don't return to hand** — only the original spell with paid buyback returns.

## Canonical Example
**Capsize ({1}{U}{U}): "Return target nonland permanent to its owner's hand. Buyback {3}."**
Opponent has a dangerous enchantment in play.
Cast Capsize with buyback: pay {4}{U}{U}. Bounce enchantment. Capsize returns to hand.
Next turn: opponent replays enchantment ({3}).
Immediately: Capsize again with buyback ({4}{U}{U}). Bounce it again.
If you have 6 mana each turn and opponent needs less than 6 to replay: you win the resource war.
With infinite mana (e.g., Isochron Scepter + Dramatic Reversal or Basalt Monolith + Rings):
Bounce EVERYTHING opponent controls, then win.

**Example 2 — Whispers of the Muse Infinite Draw:**
Whispers of the Muse ({U}, Buyback {5}): "Draw a card."
You generate infinite mana via Paradox Engine (before banning) or Dramatic Reversal combo.
Cast Whispers of the Muse with buyback ({6} total): draw a card, Whispers returns to hand.
Cast again: draw a card.
Cast 50+ times: draw your entire deck.
Find your win condition (Laboratory Maniac, Thassa's Oracle, etc.) and win.
This is a common infinite mana payoff in Commander.

## Commonly Confused With
- **P210 (Kicker)** — Kicker is an additional cost for a bonus effect. Buyback is an additional cost to RETURN the spell to hand.
- **P164 (Rebound)** — Rebound automatically casts the spell again next upkeep (no cost). Buyback requires paying the buyback cost each cast.
- **P211 (Flashback)** — Flashback casts from graveyard once, then exiles. Buyback never reaches graveyard if paid.
