---
id: p382
name: Adventure Cards — Casting the Adventure Half, Exiling, and Casting the Creature
category: stack
cr_refs: [715.1, 715.2, 715.2a, 715.2b, 715.2c, 715.3, 715.3a, 715.3b, 715.3c, 715.3d, 715.4, 715.5]
tags: [adventure, adventurer-card, adventure-half, creature-half, exile-then-cast, alternative-characteristics, adventure-spell-on-stack, copy-adventure, alternative-name, cast-again-from-exile, Brazen-Borrower, Bonecrusher-Giant, Lovestruck-Beast, Questing-Beast, Edgewall-Innkeeper, Fae-of-Wishes, adventure-second-cast-not-adventure]
created: 2026-03-29
examples_count: 2
---

# P382 — Adventure Cards — Casting the Adventure Half, Exiling, and Casting the Creature

## Abstract
**Adventure cards** (rule 715) are two-in-one cards: a creature card with a smaller "adventure" frame inset. When in hand, you choose to cast the adventure (the inset spell — usually an instant or sorcery with different characteristics) OR cast the creature normally. If you cast the adventure half: it uses ONLY the adventure's characteristics while on the stack (different name, type, cost, effect). Instead of going to the graveyard when it resolves, the card is exiled. From exile, the same card may be cast as its creature (normal characteristics). This gives adventure cards two separate uses: a spell first, then a creature. Critical rules: the card is a single card (715.2c); the creature can only be cast once from exile — it's "played" not re-adventured; copying an adventure spell creates a copy with the adventure characteristics but no card to exile; and spells/abilities that "look for a creature card" in exile may or may not find an adventure card (depends on whether it's being searched as its creature characteristics or as its exiled-after-adventure characteristics).

## The Definitive Rules

**CR 715.3** (verbatim): *"As a player plays an adventurer card, the player chooses whether they play the card normally or as an Adventure."*

**CR 715.3a** (verbatim): *"When casting an adventurer card as an Adventure, only the alternative characteristics are evaluated to see if it can be cast."*

**CR 715.3b** (verbatim): *"While on the stack as an Adventure, the spell has only its alternative characteristics."*

**CR 715.3c** (verbatim): *"If an Adventure spell is copied, the copy is also an Adventure. It has the alternative characteristics of the spell and not the normal characteristics of the card that represents the Adventure spell. Any rule or effect that refers to a spell cast as an Adventure refers to the copy as well."*

**CR 715.3d** (verbatim): *"Instead of putting a spell that was cast as an Adventure into its owner's graveyard as it resolves, its controller exiles it. For as long as that card remains exiled, that player may play it. It can't be cast as an Adventure this way, although other effects that allow a player to cast it may allow a player to cast it as an Adventure."*

**CR 715.4** (verbatim): *"In every zone except the stack, and while on the stack not as an Adventure, an adventurer card has only its normal characteristics."*

**CR 715.2c** (verbatim): *"Although adventurer cards are printed with multiple sets of characteristics, each adventurer card is only one card. For example, a player who has drawn or discarded an adventurer card has drawn or discarded one card, not two."*

## The Pattern

```
ADVENTURE CARDS (715):
  WHAT THEY ARE:
    A single card with two sets of characteristics:
      Normal characteristics: creature name, mana cost, type line, creature abilities, P/T.
      Adventure characteristics: adventure spell name, mana cost, type (instant/sorcery),
        effect — all printed in the inset frame.
    Both sets of characteristics are "copiable values" of the card (715.2b).
  CHOOSING HOW TO CAST:
    From hand (or wherever you can cast from): choose AT CAST TIME which set to use.
    Option A: Cast normally (creature). Uses normal creature characteristics. Goes on stack.
      If it resolves: enters the battlefield as a creature. Standard rules apply.
      If it's countered: goes to the GY (no adventure use).
    Option B: Cast as an adventure. Uses adventure characteristics. Goes on stack as a spell.
      While on the stack: only adventure characteristics exist (715.3b).
      The spell is the adventure (different name, different type, different effect).
  AFTER THE ADVENTURE RESOLVES:
    715.3d: "Instead of putting the spell into its owner's graveyard as it resolves, its
      controller exiles it."
    The CARD is exiled. (Not a copy — the actual physical card.)
    From exile: the card may be played as its creature (normal characteristics).
    "May play it" = normal casting rules apply (mana cost, timing, etc.).
    CANNOT be cast as an adventure again from exile (715.3d: "it can't be cast as an Adventure
      this way"). It can only be cast as its creature.
    OTHER EFFECTS: if another effect says "cast this card from exile" without the adventure
      restriction: that effect might allow casting it as an adventure again.
      715.3d: "although other effects that allow a player to cast it may allow a player to cast
        it as an Adventure." So: if Chandra's ability lets you cast from exile, that might re-enable.
  CHARACTERISTICS IN EACH ZONE:
    In hand: only creature characteristics (715.4). It looks like a creature in your hand.
    On stack (as adventure): only adventure characteristics (715.3b).
    On stack (as creature): only creature characteristics (715.4).
    On the battlefield: only creature characteristics (715.4).
    In GY: only creature characteristics (715.4). (It's a creature card in the GY.)
    In exile (after adventure): It's the full card in exile. Effects that care about its
      characteristics see... what? 715.4: "In every zone except the stack, and while on the
      stack not as an Adventure, an adventurer card has only its normal characteristics."
      So in exile: it has only its NORMAL CHARACTERISTICS (creature).
      But: effects that "look for a creature card named X in exile" would find it.
  COPYING AN ADVENTURE SPELL:
    715.3c: A copy of an adventure spell is also an adventure spell.
    The copy has the adventure characteristics (not the creature's characteristics).
    But: a copy is not a card. When the copy resolves: no card goes to exile.
      (Copies cease to exist when they leave the stack — rule 704.5e.)
    The ORIGINAL spell (not the copy): still goes to exile when it resolves.
    The copy resolves first (LIFO): effect happens, copy ceases to exist.
    Original resolves: effect happens again, original card is exiled.

SPECIFIC CARD EXAMPLES:
  BONECRUSHER GIANT ({2}{R}: 4/3, "Whenever Bonecrusher Giant becomes the target of a spell,
    it deals 2 damage to that spell's controller"):
    Adventure: Stomp ({1}{R}: "Damage can't be prevented this turn. Stomp deals 2 damage to
      any target.")
    Stomp first: pay {1}{R}. Deal 2 damage (can't be prevented). Card exiled.
    Then: pay {2}{R} to cast Bonecrusher Giant. 4/3 with anti-targeting trigger.
    Total: {1}{R} + {2}{R} = {3}{R}{R} and you got an early shock + a 4/3.
  BRAZEN BORROWER ({1}{U}{U}: 3/1 flying, "can't block"):
    Adventure: Petty Theft ({1}{U}: "Return target nonland permanent an opponent controls to
      its owner's hand.")
    Petty Theft first: pay {1}{U}. Bounce a permanent. Card exiled.
    Then: pay {1}{U}{U} for Brazen Borrower. 3/1 flying.
    Combined: {1}{U} + {1}{U}{U} = {2}{U}{U}{U} for a bounce + 3/1 flyer.
    Also: Petty Theft is at INSTANT SPEED. Brazen Borrower is sorcery speed.
      Wait: Brazen Borrower's type is "Creature — Faerie Rogue." Casting as creature = sorcery speed.
      Petty Theft (adventure) is an instant — can be cast any time you have priority.
    This is a key benefit: some adventures are instants while the creature itself is a sorcery-speed cast.
  LOVESTRUCK BEAST ({2}{G}: 5/5 with "this creature can't attack unless you control a
    1/1 Human creature token"):
    Adventure: Heart's Desire ({G}: "Create a 1/1 white Human creature token.")
    Heart's Desire first: pay {G}. Create a Human token (enables Lovestruck Beast to attack).
    Then: cast Lovestruck Beast. It can attack immediately (if you cast Heart's Desire first
      and still control the Human).

ADVENTURE AND ZONE-CHANGING:
  IF ADVENTURE IS COUNTERED:
    The spell was an adventure. Countered spells go to the GY (unless another effect says otherwise).
    715.3d: the exile happens "as it resolves." If countered, it DOESN'T resolve.
    Countered adventure → goes to GY. No exile. Can't cast creature from exile.
    The adventure must successfully resolve to exile the card.
  IF ADVENTURE RESOLVES BUT CARD WOULD GO ELSEWHERE:
    An effect says "instead of its GY, exile it" — but 715.3d already exiles it automatically.
    "Instead of exile, put it in your GY": a hypothetical effect could override the exile.
    If the card reaches the GY somehow: no longer "exiled after adventure." Can't re-cast.
  ADVENTURE IN EXILE AND CARD SEARCHING:
    "Search your library for a creature card": does an adventure card in exile matter? No.
      The search is about the library, not exile.
    "Return target creature card from exile to hand": could this return the exiled adventure?
      In exile, the card has its normal (creature) characteristics (715.4).
      An adventure card in exile is a creature card in exile.
      YES: effects that can return creature cards from exile can target an adventure card in exile.
      If returned to hand: you can cast the adventure again OR cast the creature normally.

EDGEWALL INNKEEPER ({G}: "Whenever you cast a creature spell that has an Adventure, draw a card"):
  This triggers when you cast any creature spell with an adventure.
  Note: "cast as an adventure" is NOT casting a creature spell — the adventure spell has ONLY
    the adventure characteristics (715.3b: while on stack as adventure, only adventure characteristics).
  But: "cast the CREATURE" after the adventure: this IS casting a creature spell.
    Innkeeper triggers when you cast Bonecrusher Giant from exile (as the creature).
    Innkeeper does NOT trigger when you cast Stomp (the adventure) — Stomp is an instant, not a creature.
  In hand: the card IS a creature card (715.4: in zones other than stack, has normal characteristics).
    But Innkeeper triggers when cast as a creature spell.
    So: cast the adventure (no trigger) → exile card → cast the creature (trigger: draw).
    Innkeeper synergizes specifically with the CREATURE cast, not the adventure cast.

FAE OF WISHES ({1}{U}: 1/4, "You may choose a noncreature card you own from outside the game"):
  Adventure: Granted ({3}{U}: "You may choose a noncreature card you own from outside the game,
    reveal it, and put it into your hand.")
  This lets you tutor non-creature cards from your sideboard.
  In Commander: your "outside the game" is technically the game itself (no sideboard).
    But in paper Commander, this accesses your sideboard (tournament rules vary).
  Cast Granted (adventure) first: tutor a non-creature card from outside the game.
  Then: cast Fae of Wishes (1/4 creature) from exile.
```

## Definitive Conclusions

- **The adventure resolves before the creature is cast** — the adventure half is a separate cast (instant/sorcery on the stack); the card is exiled when it resolves; the creature is cast later from exile for its normal mana cost.
- **While on the stack as an adventure, the spell has ONLY the adventure characteristics** — opponents targeting the adventure spell can only interact with the adventure name/type (e.g., "counter target instant" works on Petty Theft even though the card is "Brazen Borrower").
- **A countered adventure goes to the GY, not exile** — the exile happens "as it resolves"; a countered spell doesn't resolve; no adventure use was had.
- **Copying an adventure spell doesn't create an exile** — the copy has the adventure's effect, but copies cease to exist when they leave the stack; only the original card is exiled.
- **In exile, an adventure card has only its creature characteristics** — effects that target creature cards in exile can target it; it can be cast as the creature from exile (not as the adventure again, unless another effect allows it).
- **Edgewall Innkeeper triggers on casting the creature, not on casting the adventure** — the adventure spell is an instant/sorcery on the stack, not a creature spell.

## Canonical Example
**Brazen Borrower Instant-Speed Tempo Sequence:**
Turn 3: Opponent plays Teferi, Hero of Dominaria on their main phase.
Your response: end of their turn (you have priority at instant speed):

You cast Petty Theft ({1}{U}) — the adventure half of Brazen Borrower.
While on stack: it's "Petty Theft — Instant" with the adventure characteristics. Not a creature.
Petty Theft resolves: return Teferi to its owner's hand (opponent's hand — "an opponent controls").
Brazen Borrower card: exiled. NOT the graveyard.

Your turn 4: you have {1}{U}{U}.
Cast Brazen Borrower from exile (as the creature). Pay {1}{U}{U}.
On the stack: creature with its normal characteristics (3/1 flying, "can't block").
Resolves: 3/1 flying creature enters the battlefield.

Sequence recap:
- Opponent tapped out for Teferi.
- You instant-speed bounced Teferi AND deployed a 3/1 flyer for the combined cost of the whole card.
- Total: {1}{U} (Petty Theft) + {1}{U}{U} (Brazen Borrower creature) = {2}{U}{U}{U}.
- Teferi is back in opponent's hand. You have a 3/1 flyer.
- This tempo sequence is the reason Brazen Borrower was format-defining in Standard.

Note: Petty Theft is cast at instant speed. Brazen Borrower (creature) is cast at sorcery speed.
If opponent held Teferi, you couldn't respond. You'd play Petty Theft on your own turn.

**Example 2 — Adventure Countered vs. Resolved:**
Scenario: You have Bonecrusher Giant in hand. Opponent has a counterspell.

Option A (Adventure Countered):
You cast Stomp ({1}{R} — the adventure). Opponent counters it.
Stomp doesn't resolve. Bonecrusher Giant goes to YOUR GRAVEYARD. Not exiled.
No adventure benefit. No creature to cast from exile.
You've lost the card entirely (must cast it normally from hand if you have another copy).

Option B (Adventure Resolves):
You cast Stomp ({1}{R}). Opponent has no counterspell.
Stomp resolves: 2 damage dealt, damage can't be prevented this turn.
Bonecrusher Giant card: exiled.
Later: you cast Bonecrusher Giant from exile for {2}{R}.

Option C (Opponent Counters the CREATURE Cast):
Stomp resolved. Card exiled. You cast Bonecrusher Giant from exile.
Opponent counters the creature.
Bonecrusher Giant goes to GY (countered from exile → goes to GY).
The adventure already happened (you got the 2 damage). The creature just dies to a counter.

The key insight: the adventure and the creature are SEPARATE cast events.
One can be countered while the other resolves. Countering the adventure is the more devastating play.

## Commonly Confused With
- **P372 (Aftermath)** — Aftermath is also "cast from GY, exile after use." Adventure is "cast adventure half, exile card, cast creature from exile." Key difference: aftermath right-half is cast FROM THE GY; adventure creature is cast FROM EXILE (after the adventure half resolved). Also: aftermath exiles the card after the GY spell resolves; adventure exiles after the adventure resolves.
- **P376 (Plot)** — Both adventure and plot involve exiling a card face-up and casting it later. Adventure's exile is automatic (adventure spell → exile → creature); plot requires paying a cost to exile. Also, plot cards are cast face-down (hidden info), adventure cards are exiled face-up and visible.
- **P368 (Rebound)** — Rebound also exiles an instant/sorcery and casts it for free later. Key difference: rebound re-casts the SAME spell type from exile; adventure exiles a spell but then allows casting a DIFFERENT card face (the creature).
- **P380 (Voting)** — Not related mechanically, but relevant in political contexts: Adventure cards were part of Eldraine block which also featured Throne of Eldraine tournament events. Not rules-related.
