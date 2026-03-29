---
id: p346
name: Cycling, Kicker, and Adventure — Alternate Draw and Additional Cost Mechanics
category: costs
cr_refs: [702.29a, 702.29b, 702.29c, 702.29e, 702.29f, 702.33a, 702.33b, 702.33c, 702.33d, 702.33e, 702.33g, 715.2, 715.3, 715.3a, 715.3b, 715.3d, 715.4]
tags: [cycling, typecycling, kicker, multikicker, adventure, alternate-cost, additional-cost, prowess-trigger, cycling-trigger, Escape, Cascading-Cataracts, Escape-to-the-Wilds, Bonecrusher-Giant, Brazen-Borrower, Skyclave-Apparition, Zenith-Flare, Nimble-Mongoose, Uro-Titan, kicked-spell-cast]
created: 2026-03-29
examples_count: 2
---

# P346 — Cycling, Kicker, and Adventure — Alternate Draw and Additional Cost Mechanics

## Abstract
**Cycling** is an activated ability on cards in hand: pay the cycling cost + discard → draw a card (702.29a). Cycling is its own activation, not casting; it doesn't trigger cast triggers, but some cards have "when you cycle this" triggers. **Kicker** is an additional cost paid when casting a spell — declaring intent to pay kicker is part of the announcement step (601.2b); the kicked/unkicked status affects linked abilities. **Multikicker** allows paying the kicker cost any number of times. **Adventure** spells (715.3) let you cast the creature as its "adventure" instant/sorcery first, then the creature card is exiled (not GY); you may cast the creature from exile later. The key rules: adventure is a real cast (triggers prowess, etc.); the creature in exile has an indeterminate timing window.

## The Definitive Rules

**CR 702.29a** (verbatim): *"Cycling is an activated ability that functions only while the card with cycling is in a player's hand. 'Cycling [cost]' means '[Cost], Discard this card: Draw a card.'"*

**CR 702.29c** (verbatim): *"Some cards with cycling have abilities that trigger when they're cycled. 'When you cycle this card' means 'When you discard this card to pay an activation cost of a cycling ability.' These abilities trigger from whatever zone the card winds up in after it's cycled."*

**CR 702.33a** (verbatim): *"Kicker is a static ability that functions while the spell with kicker is on the stack. 'Kicker [cost]' means 'You may pay an additional [cost] as you cast this spell.' Paying a spell's kicker cost(s) follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

**CR 702.33c** (verbatim): *"Multikicker is a variant of the kicker ability. 'Multikicker [cost]' means 'You may pay an additional [cost] any number of times as you cast this spell.' A multikicker cost is a kicker cost."*

**CR 715.3** (verbatim): *"As a player plays an adventurer card, the player chooses whether they play the card normally or as an Adventure."*

**CR 715.3d** (verbatim): *"Instead of putting a spell that was cast as an Adventure into its owner's graveyard as it resolves, its controller exiles it. For as long as that card remains exiled, that player may play it. It can't be cast as an Adventure this way, although other effects that allow a player to cast it may allow a player to cast it as an Adventure."*

## The Pattern

```
CYCLING (CR 702.29a–f):
  DEFINITION: Activated ability. Cost = [cycling cost] + discard this card. Effect = draw a card.
  FUNCTIONS ONLY FROM HAND (702.29a).
  THIS IS AN ABILITY, NOT A SPELL:
    Cycling is ACTIVATED, not cast.
    It doesn't trigger "whenever you cast a spell" effects.
    It doesn't trigger prowess.
    Storm count doesn't increase when you cycle.
    "When you cast" triggers don't fire from cycling.
  CYCLING TRIGGERS ON THE CYCLING:
    Some cards have "When you cycle this card, [effect]" (702.29c).
    These are separate triggered abilities — they fire BECAUSE you cycled.
    The cycling ability resolves → card goes from hand to GY → new zone triggers fire.
    Example: Astral Slide ({2}{W}): "Whenever a player cycles a card, you may exile target creature.
      Return it to the battlefield under its owner's control at the beginning of the next end step."
    Any cycling by ANY player triggers Astral Slide.
  TYPECYCLING (702.29e):
    Landcycling, forestcycling, etc.: "[type]cycling [cost]" means "Discard this, search for a [type] card."
    More specific than just drawing. Example: Twisted Abomination ({5}{B}): "Swampcycling {2}: Search for a Swamp."
    Typecycling IS a cycling ability. Effects that affect cycling (cost reduction, Astral Slide) also affect typecycling.
  COST REDUCTION APPLIES:
    Fluctuator ({2}: "Cycling abilities cost {2} less."): all cycling costs reduced by 2.
    Zenith Flare ({3}{R}{W}): "deals damage equal to the number of cards with cycling in your GY to any target."
    Cycling into Zenith Flare: you cycle other cards → build GY count → cast Zenith Flare for big damage.
  CYCLING FROM NON-HAND ZONES? NO:
    702.29a: "functions only while the card is in a player's hand."
    Can't cycle from exile, GY, or battlefield (though the ability exists in other zones per 702.29b).
  CYCLING THE CARD YOU'RE CYCLING: No recursion. You discard it (to GY) and draw a different card.

KICKER (CR 702.33a–h):
  DEFINITION: Additional cost you MAY pay when casting the spell.
  DECLARATION: Announced during 601.2b (before other choices are made, at announcement step).
  PAYING: At the same time as other costs (601.2f–h).
  KICKED vs. UNKICKED:
    If you declare you're paying any kicker cost: spell is "kicked" (702.33d).
    Kicker-linked abilities say "if this spell was kicked, [additional effect]."
    If not kicked: those effects don't apply.
  MULTIKICKER (702.33c):
    Can pay the kicker cost any number of times.
    "If this spell was kicked N times" or "for each time this spell was kicked": count applications.
    Example: Conqueror's Pledge ({4}{W}): "Kicker {5}. Create six 1/1 Kor Ally tokens. If kicked, create twelve instead."
      Not kicked: 6 tokens. Kicked once: 12 tokens.
    Example: Wolfbriar Elemental ({3}{G}): "Multikicker {G}. Create a 2/2 Wolf token for each time this was kicked."
      Kicked 5 times ({G} × 5 = 5 extra mana): 5 tokens. The more mana, the more tokens.
  KICKER AS ADDITIONAL COST:
    Kicker is an ADDITIONAL cost. It stacks with the base cost.
    Total cost = base mana cost + all kicker payments.
    A kicked spell's TOTAL MV is still just the base mana cost MV (X in mana cost, kicker doesn't change MV).
    But "did it enter kicked?" can be checked by linked abilities throughout its lifespan? No:
      Kicked status is relevant only for linked abilities on the same object.
      Other cards can check "if kicked" only if they reference that specific link.
  KICKER AND STORM:
    Casting a kicked spell: one cast. Storm count increases by 1 (the spell is cast once).
    The storm copies can't be "kicked" retroactively — storm copies are copies, not casts.
    Wait: storm copies copy the characteristics including kicked status (if the copies are set up that way).
      Actually: copies copy the spell's current state. If the spell is a kicked Stormscape Battlemage,
        the storm copies are also copies of the kicked Battlemage (with kicked linked abilities applying).

ADVENTURE SPELLS (CR 715.3):
  Adventurer cards have two frames: creature frame (main card) + Adventure inset (left side).
  CASTING AS ADVENTURE:
    Cast the Adventure face (the instant/sorcery inset) → it's a real cast (on the stack as an instant or sorcery).
    On the stack: Adventure characteristics only (715.3b). NOT a creature spell.
    Prowess triggers from Adventure cast (it's a noncreature spell cast).
    Storm count increases.
    Other "whenever you cast" effects trigger.
  ADVENTURE RESOLUTION:
    Instead of going to GY: Adventure spell goes to EXILE (715.3d).
    The card remains in exile. YOU MAY CAST THE CREATURE from exile later.
    Timing: you may play it as though it were in your hand. Normal casting timing (main phase, sorcery speed unless it has flash).
  CASTING THE CREATURE FROM EXILE:
    From exile, cast the CREATURE face (not the Adventure). It costs its normal mana cost.
    CAN'T cast it as an Adventure again from exile (715.3d) — only the creature.
    No time limit: the creature can stay in exile indefinitely until you can afford it.
  ZONE RULES:
    In hand/GY/exile/library (not on stack): card has only NORMAL (creature) characteristics (715.4).
    On stack as Adventure: only Adventure characteristics.
    On stack as creature: only creature characteristics.
  CLASSIC EXAMPLES:
    Bonecrusher Giant ({2}{R}, creature 4/3 "whenever a player casts a spell that targets a creature"):
      Adventure: Stomp ({1}{R}, "damage can't be prevented this turn. Deal 2 damage to any target.")
      Cast Stomp: deal 2 damage AND prevent damage prevention. Goes to exile.
      Later: cast Bonecrusher Giant as a 4/3 from exile.
    Brazen Borrower ({1}{U}{U}, creature 3/1 flying flash):
      Adventure: Petty Theft ({1}{U}, "return target nonland permanent an opponent controls to its owner's hand.")
      Cast Petty Theft: bounce something. Goes to exile.
      On your next main phase: cast Brazen Borrower from exile.

ADVENTURE TIMING WINDOWS:
  Once in exile: you may cast the creature "any time you could normally cast it."
    For a creature (not instant): during main phase, stack empty, your turn.
  You MUST exile it first before you can cast the creature. You can't skip the Adventure to cast it directly.
  Wait: you can CHOOSE whether to cast as Adventure or as the creature.
    "As a player plays an adventurer card, the player chooses whether they play the card normally or as an Adventure." (715.3)
    If you choose normal: cast the creature directly from hand. Goes to stack as creature. After resolution → battlefield.
    If you choose Adventure: Adventure resolves → exile → later cast the creature.

CYCLING vs. KICKER vs. ADVENTURE — WHAT TRIGGERS "CAST":
  Cycling: NOT a cast. Doesn't trigger prowess, storm, etc.
  Kicker: IS the same cast. A kicked spell is cast once (triggers prowess, storm, etc.).
    The kicked status is encoded into the spell; not two separate casts.
  Adventure: IS a real cast (for the Adventure face). Triggers prowess, storm, etc.
    Casting the creature from exile later is ALSO a real cast (separate from the Adventure cast).
    Two casts total: Adventure cast + creature cast from exile.
```

## Definitive Conclusions

- **Cycling is an activated ability, not a spell** — it doesn't trigger prowess, storm, or "whenever you cast" effects; it only triggers "when you cycle this card" abilities on the card itself.
- **Kicker is an additional cost declared at casting** — kicked spells are still one cast; kicker-linked abilities fire based on whether kicker was paid.
- **Adventure sends the card to exile on resolution** — the creature can be cast from exile later with no time limit; it can't be re-cast as an Adventure from exile.
- **Adventure casts trigger "cast" effects** — the Adventure cast and the later creature cast are both real casts (prowess, storm count, etc.).
- **Typecycling is a cycling ability** — Fluctuator and Astral Slide apply to typecycling; the "draw a card" is replaced with "search for [type]."
- **A card can only be cycled from hand** — cycling exists as an ability in other zones but can only be ACTIVATED from hand.

## Canonical Example
**Bonecrusher Giant — Adventure Into Combat:**
Your deck: Gruul midrange. You have Bonecrusher Giant in hand. Turn 3, you have {1}{R} available.
Cast Stomp (Adventure): "Damage can't be prevented this turn. Deal 2 damage to any target."
  You target opponent's Selfless Savior (1/1 with "sacrifice: give another creature indestructible").
  Opponent tries to activate Selfless Savior in response: "I'll sacrifice it to make my 4/4 indestructible."
  But wait: Stomp says "damage can't be prevented this turn." Indestructible prevents... no, indestructible prevents DESTRUCTION. Damage prevention is a different thing.
  Actually: "damage can't be prevented" stops prevention effects (like Shield's "prevent 1 damage").
  Indestructible is NOT a damage prevention effect — it prevents DESTRUCTION from damage.
  So: Selfless Savior's ability would give indestructible to the 4/4. The 4/4 would take 2 damage but not die.
  But Stomp is targeting the Savior (1/1): it deals 2 damage to Savior. Savior dies (0 toughness after 2 damage? No: 1/1, takes 2 ≥ 1 toughness. Dies.).
  Wait: Savior's ability is a response to something targeting it? Selfless Savior's ability says "sacrifice: give another creature indestructible." It doesn't say "in response to being targeted." It can be activated any time.
  Opponent CAN sacrifice Savior in response to Stomp targeting it. If Savior is sacrificed: it leaves the battlefield → no longer a valid target. Stomp fizzles.
  Even with "damage can't be prevented": if the target is gone, the spell has no valid target → countered (rule 608.2b).

OK: Stomp resolves normally (assume no response). Deals 2 damage. Bonecrusher Giant goes to EXILE (Adventure resolution rule).
On your next main phase (or whenever you have {2}{R}):
  Cast Bonecrusher Giant from exile as a 4/3 creature. Normal creature cast.
  Triggers: "whenever a player casts a spell that targets a creature this turn, Bonecrusher Giant deals 2 damage to that player."

You've spent {1}{R} (Stomp) + {2}{R} (creature) = 3R total over two turns. Value: 2 damage dealt + 4/3 creature with punisher effect.

**Example 2 — Cycling Engine with Zenith Flare:**
Ikoria cycling deck. You control Flourishing Fox (1/1 creature: "whenever you cycle, put a +1/+1 counter on Flourishing Fox") and Valiant Rescuer (1/1: "when you cycle, create a 1/1 Human token").

Turn 3: Cycle Drannith Stinger (cycling {R}): trigger Flourishing Fox (+1/+1 counter, now 2/2) + Valiant Rescuer (1/1 token created) + Drannith Stinger trigger ("when cycled, deal 1 damage to each opponent").
Turn 3 continued: Cycle Renewed Faith (cycling {1}{W}): Flourishing Fox is now 3/3. Token created.
Turn 3 continued: Cycle Imposing Vantasaur (cycling {1}{W}): Fox is 4/4. Token created.

End state: 4/4 Fox, 3 Human tokens, 3 damage dealt to opponent via Stinger triggers.
Cards in GY with cycling: Stinger, Renewed Faith, Imposing Vantasaur (3 cards).

Turn 4: Cast Zenith Flare ({3}{R}{W}) (X = number of cycling cards in GY = 3).
  Deals 3 damage to any target + you gain 3 life.
  If you had more cycling cards: more damage. 10 cycling cards in GY → 10 damage.

Cycling IS NOT casting: each cycle is an activated ability, not a spell. Prowess does NOT trigger from cycling.
BUT: if you have Improbable Alliance ({U}{R}) "whenever you draw your second card each turn": cycling draws a card → second card drawn from cycling triggers Alliance.

## Commonly Confused With
- **P329 (Casting Costs — Alternative and Additional)** — Kicker is an additional cost. It stacks with other additional costs (like buyback) but you can't use two alternative costs. Cycling is NOT a cast, so its cost isn't a casting cost at all — it's just an activation cost.
- **P336 (Storm and Cascade)** — Storm counts casts. Cycling doesn't increment storm count. Cascade requires casting the found card — an Adventure found via cascade would need to be cast as either face (normally Adventure face MV is the one relevant for cascade find).
- **P338 (Graveyard Recursion / Flashback)** — Flashback is cast from GY. Cycling discards to GY and draws. These are separate: a card with both flashback and cycling could cycle (discard + draw) OR be cast with flashback (from GY). Cycling the card puts it in GY where flashback can be used.
- **P342 (Turn Structure)** — Adventure creatures cast from exile follow normal sorcery-speed timing (main phase, empty stack). The Adventure itself follows normal instant-or-sorcery timing (sorceries: main phase; instants: any time with priority).
