---
id: p407
name: Cycling, Kicker, and Buyback — Hand-Cycle Draw, Additional-Cost Bonus, and Return-to-Hand
category: costs
cr_refs: [702.29a, 702.29b, 702.29c, 702.29d, 702.29e, 702.29f, 702.33a, 702.33b, 702.33c, 702.33d, 702.33e, 702.33f, 702.33g, 702.27a]
tags: [cycling, kicker, buyback, typecycling, multikicker, discard-to-draw, additional-cost, return-to-hand, kicked-status, Onslaught, Invasion, Urza-Saga, Astral-Slide, Decree-of-Justice, Vine-Trellis, Thornscape-Battlemage, Hunting-Drake, Capsize, Whispers-of-the-Muse, cycling-trigger, landcycling, basic-landcycling, kicked-targets]
created: 2026-03-29
examples_count: 2
---

# P407 — Cycling, Kicker, and Buyback — Hand-Cycle Draw, Additional-Cost Bonus, and Return-to-Hand

## Abstract
**Cycling** (702.29) is an activated ability: pay the cycling cost and discard the card to draw a card. Typecycling variants search your library for a specific card type instead. Cycling triggers ("when you cycle this card") fire from whatever zone the card ends up in after cycling. **Kicker** (702.33) is a static additional cost: pay the kicker cost when casting the spell for an enhanced effect. A spell is "kicked" if its controller declares intention to pay any kicker cost; the "kicked" status matters for linked abilities. Multikicker is a kicker variant that can be paid any number of times. **Buyback** (702.27) is also an additional cost: pay the buyback cost to return the spell to your hand as it resolves, rather than putting it into your graveyard. Buyback enables infinite-loop potential with instants and sorceries.

## The Definitive Rules

**CR 702.29a** (verbatim): *"Cycling is an activated ability that functions only while the card with cycling is in a player's hand. 'Cycling [cost]' means '[Cost], Discard this card: Draw a card.'"*

**CR 702.29b** (verbatim): *"Although the cycling ability can be activated only if the card is in a player's hand, it continues to exist while the object is on the battlefield and in all other zones. Therefore objects with cycling will be affected by effects that depend on objects having one or more activated abilities."*

**CR 702.29c** (verbatim): *"Some cards with cycling have abilities that trigger when they're cycled. 'When you cycle this card' means 'When you discard this card to pay an activation cost of a cycling ability.' These abilities trigger from whatever zone the card winds up in after it's cycled."*

**CR 702.29d** (verbatim): *"Some cards have abilities that trigger whenever a player 'cycles or discards' a card. These abilities trigger only once when a card is cycled."*

**CR 702.29e** (verbatim): *"Typecycling is a variant of the cycling ability. '[Type]cycling [cost]' means '[Cost], Discard this card: Search your library for a [type] card, reveal it, and put it into your hand. Then shuffle your library.' This type is usually a subtype (as in 'mountaincycling') but can be any card type, subtype, supertype, or combination thereof (as in 'basic landcycling')."*

**CR 702.29f** (verbatim): *"Typecycling abilities are cycling abilities, and typecycling costs are cycling costs. Any cards that trigger when a player cycles a card will trigger when a card is discarded to pay an activation cost of a typecycling ability. Any effect that stops players from cycling cards will stop players from activating cards' typecycling abilities. Any effect that increases or reduces a cycling cost will increase or reduce a typecycling cost. Any effect that looks for a card with cycling will find a card with typecycling."*

**CR 702.33a** (verbatim): *"Kicker is a static ability that functions while the spell with kicker is on the stack. 'Kicker [cost]' means 'You may pay an additional [cost] as you cast this spell.' Paying a spell's kicker cost(s) follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

**CR 702.33c** (verbatim): *"Multikicker is a variant of the kicker ability. 'Multikicker [cost]' means 'You may pay an additional [cost] any number of times as you cast this spell.' A multikicker cost is a kicker cost."*

**CR 702.33d** (verbatim): *"If a spell's controller declares the intention to pay any of that spell's kicker costs, that spell has been 'kicked.' If a spell has two kicker costs or has multikicker, it may be kicked multiple times. See rule 601.2b."*

**CR 702.33g** (verbatim): *"If part of a spell's ability has its effect only if that spell was kicked, and that part of the ability includes any targets, the spell's controller chooses those targets only if that spell was kicked. Otherwise, the spell is cast as if it did not have those targets. See rule 601.2c."*

**CR 702.27a** (verbatim): *"Buyback appears on some instants and sorceries. It represents two static abilities that function while the spell is on the stack. 'Buyback [cost]' means 'You may pay an additional [cost] as you cast this spell' and 'If the buyback cost was paid, put this spell into its owner's hand instead of into that player's graveyard as it resolves.' Paying a spell's buyback cost follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
CYCLING (702.29):
  WHAT IT IS:
    Activated ability. Functions ONLY while the card is in your hand.
    "[Cost], Discard this card: Draw a card."
    Effectively: pay cost + discard the cycling card = draw a fresh card.
    Net: replace the cycling card with a random new card.
  KEY PROPERTY (702.29b):
    The cycling ability CONTINUES TO EXIST on the battlefield and in other zones.
    This matters for effects like "target permanent with an activated ability"
      or "artifacts with activated abilities untap at upkeep" — cycling cards on
      the battlefield still qualify because cycling still exists there.
    But you can only ACTIVATE cycling from hand.
  THE CYCLING TRIGGER (702.29c):
    "When you cycle this card" = "When you discard this card to pay an activation
      cost of a cycling ability."
    The trigger fires from whatever zone the card ends up in AFTER cycling.
    Usually: you cycle, the card goes to GY. The trigger fires from the GY.
    This is important: Astral Slide and Astral Drift use this.
      "Whenever a player cycles a card, you may exile target creature."
      This triggers from the permanent (Astral Slide), not from the cycled card.
    For cards with their OWN cycling trigger ("when you cycle this card, draw a card"):
      The trigger fires from the GY. The card is in the GY when the trigger fires.
  TYPECYCLING (702.29e–f):
    "[Type]cycling [cost]" → instead of drawing a card, search for a [type] card.
    Mountaincycling: discard → search for a Mountain.
    Basic landcycling: discard → search for a basic land.
    Typecycling IS cycling. All cards that care about cycling also care about typecycling.
    "When a player cycles a card" triggers when a player typecycles.
    Effects that prevent cycling prevent typecycling.
    Effects that reduce cycling costs reduce typecycling costs.
  CYCLING AND THE DISCARD:
    Cycling uses "discard this card" as part of the activation cost.
    This is NOT the same as a normal discard effect.
    However: "whenever a player cycles or discards a card" triggers once when a
      card is cycled (702.29d). It sees the cycling as a discard for trigger purposes.
    Madness interacts: if you cycle a madness card, you're discarding it.
      Madness's first ability fires (exile instead of GY). Then:
        - Does the cycling draw still happen? YES. You paid the cost.
        - Is the madness trigger happening? YES. You may cast it for its madness cost.
        - The card is exiled, not in GY. If you don't cast it for madness cost: it goes to GY.
      KEY: cycling + madness = you get to cast the madness card AND draw from cycling.
  ASTRAL SLIDE COMBO:
    Astral Slide ({2}{W}: "whenever a player cycles a card, you may exile target creature.
      Return that creature to the battlefield under its owner's control at the beginning
      of the next end step"):
    Each cycling: exile your own creature (remove negative auras, reset ETBs) OR
      exile opponent's best blocker/attacker for the turn.
    In a cycling-heavy deck: many cycling cards = many Astral Slide triggers.
    Classic combo: Eternal Dragon (basic landcycling {W}{W}) + Astral Slide.
      Cycle Dragon: triggers Astral Slide. Exile something. Eternal Dragon goes to GY.
      Return Dragon from GY each upkeep (Eternal Dragon's ability). Repeat.

KICKER (702.33):
  WHAT IT IS:
    Static ability. Functions while the spell is on the stack.
    "Kicker [cost]" = "you may pay an additional [cost] as you cast this spell."
    Paying the kicker cost is optional. The base spell works without kicker.
    The "kicked" status: if you declare intention to pay any kicker cost, the spell is "kicked."
  KICKED STATUS (702.33d):
    "Kicked" is a binary. If you pay any kicker cost: the spell is kicked.
    Linked abilities: "if this spell was kicked, [additional effect]."
      Those abilities check the kicked status when the spell resolves.
    Example: Thornscape Battlemage ({2}{G}: 2/2):
      "Kicker {W} and/or {R}"
      "When Thornscape Battlemage enters, if it was kicked with its {W} kicker, destroy target
        enchantment."
      "When Thornscape Battlemage enters, if it was kicked with its {R} kicker, deal 2 damage
        to target creature."
      Pay {W} kicker: ETB destroys an enchantment.
      Pay {R} kicker: ETB deals 2 damage to a creature.
      Pay both {W} and {R}: both ETBs trigger. Destroy enchantment AND deal 2 damage.
      Base cost: {2}{G}. Full cost with both kickers: {2}{G}{W}{R} = 5 mana.
  KICKER TARGETS (702.33g):
    If the kicked effect includes targets: targets are chosen only if the spell WAS kicked.
    "If this spell was kicked, destroy target artifact" → if not kicked, no target chosen.
    This is important for timing: if you kicked the spell and opponent responds to counter:
      The spell is countered. The kick was paid but the spell never resolves.
      No refund on kicker costs.
  MULTIKICKER (702.33c):
    "Multikicker [cost]" = you may pay the cost "any number of times."
    Each payment adds one more to the multikicker count.
    Example: Everflowing Chalice ({0}: artifact): "Multikicker {2}."
      "Everflowing Chalice enters with a charge counter on it for each time it was kicked."
      Cast for {0}: enters with 0 counters. Taps for 0 mana. Useless.
      Cast with 1 multikicker ({2}): enters with 1 counter. Taps for {1}.
      Cast with 3 multikicker ({6}): enters with 3 counters. Taps for {3}.
    Multikicker is tracked as a count, not a binary.
  KICKER AND COPIES:
    If you copy a kicked spell: the copy is also "kicked."
    The copy retains all properties of the original (including kicked status).
    Example: Fork copies Burst Lightning kicked for its kicker cost:
      Burst Lightning ({R}: deal 2 damage; "Kicker {4}: deal 4 damage instead"):
      Copy the kicked Burst Lightning: the copy deals 4 damage (it's also kicked).
  KICKER AND COUNTERS:
    Countering a kicked spell: the kicker cost was paid (already gone). No refund.
    The "kicked" effect never happens — the spell was countered before resolving.

BUYBACK (702.27):
  WHAT IT IS:
    Additional cost for instants and sorceries. Functions while the spell is on the stack.
    "Buyback [cost]" = pay the cost as an additional cost to cast the spell.
    "If the buyback cost was paid: return this spell to your hand instead of GY when it resolves."
    The spell still RESOLVES (its effect happens). It just goes to hand instead of GY.
  HOW IT WORKS:
    Cast spell without buyback: spell resolves → effect happens → spell goes to GY.
    Cast spell WITH buyback (pay additional cost): spell resolves → effect happens → spell
      goes to HAND (not GY).
    The spell can be cast again immediately (with or without buyback again).
  BUYBACK AND COUNTERS:
    If the spell with buyback paid is countered: does it go to hand?
    NO. Buyback only applies "as [the spell] resolves." Countered spells don't resolve.
    Countered buyback spell → goes to GY (the countered zone, not hand).
    702.27a: "put this spell into its owner's hand instead of into that player's graveyard
      as it resolves." RESOLVES is the key word. Countered = doesn't resolve.
  BUYBACK AND INFINITE LOOPS:
    Buyback enables repeatable spell effects.
    Capsize ({1}{U}{U}: instant, "return target permanent to its owner's hand; buyback {3}"):
      Pay {1}{U}{U}{3} = {4}{U}{U} total: Capsize resolves → bounce permanent → Capsize
      returns to hand → cast Capsize again next turn.
    With enough mana: cast Capsize with buyback repeatedly = bounce all permanents.
    In a game with infinite mana (Palinchron combo): bounce everything in response.
    This is why buyback on a bounce spell is extremely powerful: generates tempo endlessly.
  BUYBACK TIMING:
    The buyback cost is declared when casting the spell (before it goes on the stack).
    You can't decide to pay buyback after the spell is on the stack.
    It's an additional cost: declared at announcement time (601.2b).
  WHISPERS OF THE MUSE:
    Whispers of the Muse ({U}: instant, "draw a card; buyback {5}"):
    Without buyback: {U} → draw 1 card. Standard cantrip.
    With buyback: {6}{U}? Wait: {U} + {5} = {5}{U} total.
    Pay {5}{U}: draw a card, return Whispers to hand.
    In the late game with excess mana: cast Whispers repeatedly for {5}{U} each time.
    In a game with infinite mana: draw entire library with buyback Whispers.
    This demonstrates buyback's primary use: converting excess mana into cards.
```

## Definitive Conclusions

- **Cycling can only be ACTIVATED from hand** — but the ability still exists in other zones; cycling cards on the battlefield count as having activated abilities for effects that care about that.
- **"When you cycle this card" triggers fire from the GY** — (or wherever the card ends up after cycling); they still trigger; the zone the card ends up in doesn't prevent the trigger.
- **Typecycling is cycling** — all effects that affect cycling affect typecycling; typecycling triggers "when you cycle" abilities on other permanents.
- **Cycling + Madness stacks** — cycling discards the card; madness fires; you may cast the card for its madness cost AND still draw from the cycling (the draw is part of the resolved cycling activation).
- **A kicked spell is "kicked" once any kicker cost is declared** — even if countered, the kick was paid; the status matters for linked abilities that check "if this was kicked" at resolution.
- **Buyback only applies if the spell RESOLVES** — if countered, the spell goes to GY (no buyback); the return-to-hand replacement only triggers on resolution.

## Canonical Example
**Astral Slide Deck with Cycling:**
You control: Astral Slide ({2}{W}: enchantment, "whenever a player cycles a card, you may exile target creature; return it at the next end step") and a Lightning Rift ({1}{R}: enchantment, "whenever a player cycles a card, you may pay {2}; if you do, deal 2 damage to any target").

In hand: Eternal Dragon ({5}{W}{W}: 5/5 spirit dragon, "at the beginning of your upkeep, you may return Eternal Dragon from your GY to your hand; basic landcycling {1}{W}") and Secluded Steppe ({0}: land, cycling {W}).

Opponent controls: Kokusho, the Evening Star (5/5, "when Kokusho dies, each opponent loses 5 life, you gain 5 life per opponent that lost life").

Your turn, main phase: Cycle Secluded Steppe (pay {W}, discard Secluded Steppe).
- You search for a basic Plains and put it in your hand (typecycling).
- Astral Slide triggers: exile Kokusho (remove it from battlefield, opponent can't get the death trigger now).
- Lightning Rift triggers: pay {2} → deal 2 damage to opponent.

End step: Kokusho returns (Astral Slide's delayed trigger).
Kokusho is now on the battlefield again for your opponent but they never got the death trigger.

Next turn: Cycle another cycling card → Astral Slide re-exiles Kokusho again.

**The Value Loop:** Each cycling activation → 2 damage (Lightning Rift) + remove blockers or reset ETBs (Astral Slide) + draw or search. A 40-card cycling deck might cycle 5-6 cards per turn, dealing 10-12 damage while denying opponent's creatures.

**Example 2 — Capsize with Buyback:**
Late game. You have 12 mana available. Opponent has 3 permanents: Seedborn Muse (3/4), Sol Ring (artifact), and a Forest.

Opponent tries to untap and draw for the turn.

You have Capsize ({1}{U}{U}: instant, "return target permanent to its owner's hand; buyback {3}") in hand.

Cast Capsize with buyback targeting Seedborn Muse: pay {1}{U}{U} + {3} = {4}{U}{U} (6 mana).
Capsize resolves: Seedborn Muse bounces to opponent's hand. Capsize returns to YOUR hand.

Cast Capsize with buyback targeting Sol Ring: another {4}{U}{U} (6 more mana = 12 total).
Capsize resolves: Sol Ring bounces. Capsize returns to hand again.

You've spent all 12 mana. Opponent's two most powerful permanents are bounced to hand.
Next turn: same situation if you can generate 12 mana again.
This is the "Capsize lock" — with enough mana, bounce everything every turn. The spell never goes to GY; you never run out of Capsizes.

## Commonly Confused With
- **P403 (Mutate)** — Kicker and mutate both use "additional cost" language but mutate is an alternative cost (replaces normal cost); kicker is always additional on top of normal cost. Mutate results in a creature merge; kicker grants enhanced ETB or resolution effect.
- **P402 (Companion)** — Buyback returns a spell to hand (to be re-cast); Companion brings a card from outside the game to hand once per game. Both involve getting spells from non-hand zones into hand, but by very different mechanisms.
- **P396 (Bestow)** — Bestow and kicker both offer choices when casting. Bestow is an alternative cost that changes the spell type (creature → Aura); kicker is an additional cost that leaves the spell type unchanged but adds effects.
- **P398 (Embalm/Eternalize)** — Both embalm and typecycling involve discarding/exiling to search for effects. Embalm exiles from GY to create a token; typecycling discards from hand to search for a specific card type.
