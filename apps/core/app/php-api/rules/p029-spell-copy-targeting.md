---
id: p029
name: Spell Copy Targeting — Same Targets By Default, Independent Fizzle
category: stack
cr_refs: [707.10, 707.10c, 608.2b, 702.40a]
tags: [copy, spell-copy, targets, fizzle, fork, twincast, reverberate, storm, new-targets, independent, illegal-target]
created: 2026-03-28
examples_count: 3
---

# P029 — Spell Copy Targeting — Same Targets By Default, Independent Fizzle

## Abstract
When a spell is copied (by Fork, Twincast, storm triggers, Hive Mind, etc.), the copy automatically inherits all decisions made for the original — including targets, mode, value of X, and kicker status. By default the copy hits the same target as the original. If the copy effect includes "you may choose new targets for the copy," the controller may redirect any or all targets to legal objects, or leave them pointing at illegal targets if they choose. The copy and the original are fully independent objects on the stack: if the copy fizzles because all its targets became illegal, the original resolves normally, and vice versa. A spell fizzles only when ALL of its targets are illegal at resolution — partial illegality causes partial failure, not full fizzle.

## The Definitive Rule

**CR 707.10** (verbatim): *"To copy a spell, activated ability, or triggered ability means to put a copy of it onto the stack; a copy of a spell isn't cast and a copy of an activated ability isn't activated. A copy of a spell or ability copies both the characteristics of the spell or ability and all decisions made for it, including modes, targets, the value of X, and additional or alternative costs."*

**CR 707.10c** (verbatim): *"Some effects copy a spell or ability and state that its controller may choose new targets for the copy. The player may leave any number of the targets unchanged, even if those targets would be illegal. If the player chooses to change some or all of the targets, the new targets must be legal. Once the player has decided what the copy's targets will be, the copy is put onto the stack with those targets."*

**CR 608.2b** (verbatim excerpt): *"If all its targets, for every instance of the word 'target,' are now illegal, the spell or ability doesn't resolve. It's removed from the stack and, if it's a spell, put into its owner's graveyard. Otherwise, the spell or ability will resolve normally. Illegal targets, if any, won't be affected by parts of a resolving spell's effect for which they're illegal."*

**CR 707.10b**: A copy of an ability has the same source as the original. If the ability refers to its source by name, the copy refers to that same object.

## The Pattern

```
SPELL COPY — DEFAULT BEHAVIOR:
  Copy inherits: targets, mode, X value, kicker, additional costs
  Copy does NOT inherit: the mana paid (relevant for effects asking "if {G} was spent")
  Copy is placed on the stack above the original → resolves FIRST (LIFO)
  Copy is owned/controlled by the player who created it (not the original caster)

RETARGETING — "you may choose new targets for the copy":
  Controller of the copy may change any/all targets
    → New targets MUST be legal
  Controller of the copy may leave targets unchanged
    → Can leave them even if currently ILLEGAL (they'll just fizzle at resolution)
  Mixed: leave some, change others — fine

FIZZLE RULES (per CR 608.2b):
  All targets illegal at resolution → spell doesn't resolve → removed from stack
  Some targets illegal → spell resolves; illegal targets not affected
  Original fizzling has NO effect on the copy
  Copy fizzling has NO effect on the original

COPY RESOLUTION ORDER (LIFO stack):
  Original: Lightning Bolt targeting Player A
  Twincast: copy of Bolt, you redirect copy to Player B
  → Stack (top to bottom): [Copy targeting B] [Original targeting A]
  → Copy resolves first → 3 damage to B
  → Original resolves next → 3 damage to A
  Total: 6 damage split across two players

STORM COPIES:
  Storm trigger creates N copies (one per prior spell)
  Storm trigger reads: "you may choose new targets for each copy"
  Each copy is retargetable independently
  Original storm spell still resolves after all copies
  Stack order: copies in APNAP / controller-chosen order, original at bottom

HIVE MIND COPIES:
  Each opponent gets a copy of your spell
  Each opponent controls their own copy
  Each opponent may choose new targets for their copy (if effect allows)
  Each copy resolves independently
```

## Definitive Conclusions

- **A copy uses the same targets as the original** unless the copy effect specifically says "you may choose new targets."
- **The copy and original are independent.** If the copy fizzles, the original resolves normally. If the original fizzles (because you respond to your own spell), the copy also fizzles — separately, for the same reason. Neither affects the other.
- **You can deliberately leave a copy pointing at an illegal target.** This wastes the copy but is legal to do (707.10c allows it). The copy fizzles; the original is unaffected.
- **Partial target illegality doesn't fizzle a spell.** A Jace's Ingenuity targeting two creatures (if it had two targets) where one gains hexproof: the spell resolves, affects the legal target, ignores the hexproof target.
- **Storm copies are all independently retargetable.** Mass Manipulation with storm creates multiple copies; each can hit a different target.
- **A copy of Fling checks the creature sacrificed for the ORIGINAL Fling** (CR 707.10 example). The copy doesn't have its own "cost object" — it references the original's cost payment.
- **A copy of Dawnglow Infusion gains NO life**, even if the original was cast with {G} and {W}. Mana isn't an object; copies can't reference the original's mana payment (CR 707.10 example).
- **You cannot copy a spell and cast the copy at a different time.** Copies are put directly onto the stack — they don't go to hand or exile to be cast later.
- **Bouncing a spell to hand bypasses "can't be countered."** Effects that return a spell to its owner's hand (Venser, Shaper Savant; Eye of Nowhere) remove the spell from the stack without countering it — the spell just no longer exists. This works against spells that "can't be countered by spells or abilities" because bouncing isn't countering. (Gatherer ruling 2021-03-19 on Venser: "The spell isn't countered; it just no longer exists. This works even against a spell that can't be countered.") Note: if the spell had flashback, bouncing still triggers the flashback exile replacement (the spell goes to exile, not hand — CR 702.34a: exile fires whenever the spell would leave the stack).
- **Counterspell vs. "this spell can't be countered": the counterspell still resolves; any secondary effects of the counterspell still apply.** When a counterspell like Mana Drain targets an uncounterable spell, Mana Drain still resolves — the counter-target-spell part simply does nothing (P008: can't overrides can). But Mana Drain's secondary effect ("add mana equal to that spell's mana value") still applies, because Mana Drain resolved successfully. (Gatherer ruling 2020-11-10: "If the target is legal but not countered, because an effect says the spell can't be countered, you do add mana.") This applies generally: if a counterspell has additional effects, those effects still resolve even if the counter-part is prevented.
- **A fizzled spell is NOT "countered."** A spell that fails to resolve because all its targets became illegal is removed from the stack and put into the owner's graveyard, but it was never countered — it simply didn't resolve. Cards that trigger "whenever a spell is countered" (such as Baral, Chief of Compliance) do NOT trigger when a spell fizzles. "Counter" is a specific keyword action (CR 701.5): only effects that specifically use the word "counter" qualify. (Gatherer ruling 2021-03-19 on Baral: "A spell or ability counters a spell only if it specifically contains the word 'counter' in its text. If a spell or ability you control causes all the targets of a spell to become illegal, that spell doesn't resolve but it's not countered.")

## Canonical Example
**Fork + opponent's Lightning Bolt:**
Opponent casts Lightning Bolt targeting you. You cast Fork targeting Bolt. Fork resolves, creates a copy of Bolt. Fork says "You may choose new targets for the copy." You redirect the copy to the opponent's creature. Stack: [copy targeting their creature] [original Bolt targeting you]. Copy resolves: their creature takes 3 damage. Original Bolt resolves: you take 3 damage. (Fork doesn't save you — it just lets you also kill their creature.)

**Example 2 — Twincast + your own Fireball:**
You cast Fireball for X=5 targeting Creature A (5 damage). You cast Twincast copying Fireball. You redirect the copy to Creature B (copy uses same X=5). Stack: [copy targeting B, X=5] [original targeting A, X=5]. Both resolve: A takes 5 damage, B takes 5 damage. Total: 10 damage for the price of 7 mana + 2U for Twincast.

**Example 3 — Copy fizzle independence:**
You cast Doom Blade targeting an opponent's black creature. Opponent responds by making it non-black. You copy Doom Blade with Reverberate (same target — now non-black and illegal). Copy resolves first: all targets illegal (non-black creature can't be targeted by Doom Blade) → copy fizzles. Original Doom Blade resolves next: same creature is still non-black → original also fizzles. Each fizzles independently. If you had redirected the copy to a different legal black creature, the copy would have resolved even though the original fizzled.

## Commonly Confused With
- **P017 (Copy Spell Delayed Triggers)** — P017 covers whether a copy of a spell also creates the same delayed triggered abilities (e.g., Hive Mind + pact). P029 covers target inheritance and fizzle independence. Different aspects of the copy mechanic.
- **P007 (Priority Windows)** — After a copy is placed on the stack, there IS a priority window before it resolves. Players can respond to the copy (or the original) independently. P007 covers the window mechanics; P029 covers what the copy inherits.
- **P024 (Zone-Change Object Identity in Targeting)** — If the target of the original spell changed zones after the copy was made but before it resolves, that's a P024 concern (is it still the same object?). P029 is about the initial target inheritance and independent fizzle, not the zone-change identity problem.
