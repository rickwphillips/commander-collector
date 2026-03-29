---
id: p350
name: Land Types, Basic Lands, Fetch Lands, and Nonbasic Rules
category: zones
cr_refs: [305.1, 305.2, 305.3, 305.4, 305.5, 305.6, 305.7, 305.8, 305.9, 107.4a]
tags: [land-type, basic-land, nonbasic-land, fetch-land, land-play, basic-land-type, Plains-Island-Swamp-Mountain-Forest, intrinsic-ability, land-subtype, Cabal-Coffers, Urborg, Blood-Crypt, Breeding-Pool, Prismatic-Vista, Fetchland, Verdant-Catacombs, special-action, one-land-per-turn]
created: 2026-03-29
examples_count: 2
---

# P350 — Land Types, Basic Lands, Fetch Lands, and Nonbasic Rules

## Abstract
**Basic lands** (Plains, Island, Swamp, Mountain, Forest) are unique: they have the **supertype "basic"** (305.8) and the basic land type intrinsically provides a mana ability (305.6). A land with a basic land type generates the appropriate mana **even without having that text printed** — the type CREATES the ability (305.6). **Nonbasic lands** lack the "basic" supertype; they may still have basic land types (dual lands like Breeding Pool are Forest and Island, but not basic). Playing a land is a **special action** (305.1) — it doesn't use the stack, can't be countered, and no one can respond to it. You can play only one land per turn unless an effect allows more (305.2). **"Putting" a land onto the battlefield** (fetch effects, ramp spells) isn't "playing" a land — it doesn't count toward your land-per-turn limit (305.4).

## The Definitive Rules

**CR 305.1** (verbatim): *"A player who has priority may play a land card from their hand during a main phase of their turn when the stack is empty. Playing a land is a special action; it doesn't use the stack. Rather, the player simply puts the land onto the battlefield. Since the land doesn't go on the stack, it is never a spell, and players can't respond to it with instants or activated abilities."*

**CR 305.6** (verbatim): *"The basic land types are Plains, Island, Swamp, Mountain, and Forest. If an object uses the words 'basic land type,' it's referring to one of these subtypes. An object with the land card type and a basic land type has the intrinsic ability '{T}: Add [mana symbol],' even if the text box doesn't actually contain that text or the object has no text box. For Plains, [mana symbol] is {W}; for Islands, {U}; for Swamps, {B}; for Mountains, {R}; and for Forests, {G}."*

**CR 305.7** (verbatim): *"If an effect sets a land's subtype to one or more of the basic land types, the land no longer has its old land type. It loses all abilities generated from its rules text, its old land types, and any copiable effects affecting that land, and it gains the appropriate mana ability for each new basic land type. Note that this doesn't remove any abilities that were granted to the land by other effects."*

**CR 305.8** (verbatim): *"Any land with the supertype 'basic' is a basic land. Any land that doesn't have this supertype is a nonbasic land, even if it has a basic land type."*

**CR 305.4** (verbatim): *"Effects may also allow players to 'put' lands onto the battlefield. This isn't the same as 'playing a land' and doesn't count as a land played during the current turn."*

## The Pattern

```
BASIC LANDS vs. NONBASIC LANDS:
  BASIC LANDS:
    Have the supertype "basic" in their type line.
    The five basic land types: Plains, Island, Swamp, Mountain, Forest.
    Intrinsically generate mana from the type (305.6):
      Plains: {T}: Add {W}.
      Island: {T}: Add {U}.
      Swamp: {T}: Add {B}.
      Mountain: {T}: Add {R}.
      Forest: {T}: Add {G}.
    You may have any number of copies of basic lands in a deck (no 4-copy limit).
    Basic lands CAN be fetched by "search your library for a basic land."
  NONBASIC LANDS:
    Lack the "basic" supertype.
    May have basic land types (dual lands):
      Breeding Pool: "Forest Island" → is both Forest and Island, but NOT basic.
        It has "{T}: Add {G} or {U}" in its text, but since it's a Forest and Island,
        it ALSO has the intrinsic {T}: add {G} (from Forest type) and {T}: add {U} (from Island type).
        Wait: the printed text "{T}: Add {G} or {U}" is on the card. The intrinsic abilities from
          being a Forest and Island are also there. Are they redundant?
          Yes — they produce the same effect. Having both is fine, just redundant.
    Cannot be fetched by "search your library for a basic land" (not basic).
    Subject to "nonbasic land" restrictions (Blood Moon, Ruination, etc.).
    Limited to 4 copies per deck in Constructed.
  SNOW LANDS:
    Snow-Covered Plains, Island, etc.: have supertype "snow" in addition to "basic."
    They ARE basic lands (they have the "basic" supertype).
    Can be fetched by "search for a basic land."
    Additionally: have the "snow" supertype for snow-specific interactions.

INTRINSIC MANA ABILITY (305.6):
  A land with a basic land type generates mana from that type.
  Even WITHOUT text on the card:
    If an effect says "CARDNAME becomes a Forest until end of turn":
      The land now has the Forest basic land type.
      It GAINS the intrinsic ability {T}: add {G} — even if no text was added to the card.
    If the land had other abilities: they're REPLACED (305.7):
      "Sets a land's subtype to one or more of the basic land types:
        - Loses its old land type (and mana abilities from old type).
        - Loses all abilities from rules text and copiable effects.
        - Gains the new basic land type's intrinsic mana ability."
      BUT: abilities granted by OTHER EFFECTS still remain (not from its own text or type).
  Example: Blood Moon ({2}{R}): "Nonbasic lands are Mountains."
    Your Breeding Pool (Forest Island) is nonbasic → becomes Mountain (loses Forest and Island types,
      loses all its printed abilities, gains {T}: add {R} from Mountain type).
    But: any +1/+1 counters, Auras, or other external effects on Breeding Pool still apply.
  Example: Urborg, Tomb of Yawgmoth ({B}): "Each land is a Swamp in addition to its other land types."
    All lands gain Swamp type. They keep their other types.
    They gain {T}: add {B} (intrinsic from Swamp type) IN ADDITION to their existing abilities.
    Breeding Pool: still Forest and Island (and Swamp now) → {G}, {U}, or {B}.
    Wait: Urborg says "in addition to," not "instead of." Different from Blood Moon.
    305.7 says: setting to basic types loses old types. BUT "gaining a type" ≠ "setting to."
    Urborg grants the Swamp type (adds it). Lands keep old types AND gain Swamp.

PLAYING A LAND (CR 305.1–305.3):
  SPECIAL ACTION:
    Not a spell. Not on the stack. No response.
    Opponent CANNOT respond to a land being played.
    Land enters immediately when you "play" it.
  REQUIREMENTS (305.1–305.3):
    1. Your turn (305.3).
    2. Main phase (305.1).
    3. Stack is empty (305.1).
    4. You have priority (305.1).
    5. You haven't played your one land this turn yet (305.2).
  ONE LAND PER TURN:
    By default: one land play per turn.
    Effects that increase this: "You may play one additional land on each of your turns."
    Teferi, Temporal Archmage (-1): "You may play an additional land this turn."
    Oracle of Mul Daya ({3}{G}): "You may play an additional land each turn."
  "PLAYING" vs. "PUTTING":
    Playing: from hand, special action, counts toward land limit.
    Putting (305.4): effects like fetch lands, ramp spells, Cultivate.
      "Search your library for a basic land card, put it onto the battlefield tapped."
      This is NOT "playing" a land. Doesn't count toward your land-per-turn.
      You can play a land this turn AND search up a fetch AND Cultivate for another.
      Multiple "put" effects: each can occur independently of each other.

FETCH LANDS (Verdant Catacombs, Scalding Tarn, etc.):
  "{T}, pay 1 life, sacrifice [this land]: search your library for a [Forest or Plains/etc.] card,
    put it onto the battlefield, then shuffle your library."
  This is an activated ability. The found land is "put" onto the battlefield (not played).
  INTERACTION:
    You've played a land this turn (305.2). You sacrifice a fetch land.
    Fetch finds a land and PUTS it onto battlefield. This is 305.4: not playing. No limit violation.
    You're fine — you've played 1 land (your normal play) + fetched 1 land (via ability).
  FETCH LANDS CAN FIND NONBASIC LANDS:
    Example: Verdant Catacombs searches for "a Forest or Plains card."
    Breeding Pool is a Forest. It's findable! Even though it's nonbasic.
    Caveat: Verdant says "Forest or Plains CARD" — the type is checked on the card (in library).
    Breeding Pool in library: it has the subtype "Forest" and "Island." The Forest type qualifies.
    Scalding Tarn searches for "Island or Mountain." Volcanic Island (Island Mountain) is findable.

CABAL COFFERS + URBORG INTERACTION (CLASSIC):
  Cabal Coffers ({2}): "{T}, {2}: add {B} for each Swamp you control."
  Urborg, Tomb of Yawgmoth: "each land is a Swamp in addition to its other types."
  With Urborg in play: ALL lands (including Cabal Coffers itself) are Swamps.
  Cabal Coffers can tap for mana: number of Swamps you control (all lands are Swamps).
    If you control 5 lands total: all 5 are Swamps. Coffers + {2}: add {B}{B}{B}{B}{B} = 5 black mana.
    Minus the {2} cost: net 3 mana. More lands = more mana.
  Cabal Coffers counts ITSELF as a Swamp (it's a land, Urborg makes it a Swamp). So 5 lands = 5 Swamps.
  The "put" effect of Coffers doesn't count Coffers in the Swamp count... wait. Coffers says "for each
    Swamp YOU CONTROL." You control Coffers (now a Swamp). It counts.

BLOOD MOON — NONBASIC LAND SHUTDOWN:
  Blood Moon ({2}{R}): "Nonbasic lands are Mountains."
  Any land WITHOUT the "basic" supertype becomes a Mountain (just {T}: add {R}).
  Their abilities, their original land types, everything from their printed text: gone.
  Breeding Pool → Mountain. Cabal Coffers → Mountain. Maze of Ith → Mountain.
  EXCEPTIONS (abilities remain):
    Abilities granted by OTHER EFFECTS (not from the land's own text/type): remain.
    If an opponent's effect said "Breeding Pool gains shroud until end of turn":
      Under Blood Moon: Breeding Pool becomes a Mountain but shroud (from external effect) stays.
  SNOW BASICS SURVIVE BLOOD MOON:
    Snow-Covered Mountain is basic (has "basic" supertype). Blood Moon doesn't affect basic lands.
    Snow-Covered Plains, Forest, etc.: all survive Blood Moon (they're basic).
  BASIC LANDS ARE UNTOUCHED:
    Blood Moon only says "nonbasic lands are Mountains." Plains, Island, etc. are basic → unaffected.
```

## Definitive Conclusions

- **Basic lands have intrinsic mana abilities from their subtype** — even without printed text; if an effect makes a land a Forest, it gains {T}: add {G} automatically.
- **Playing a land is a special action** — can't be countered, doesn't use the stack, no one can respond; requires main phase + empty stack + your turn.
- **"Putting" a land onto the battlefield doesn't count toward the one-land-per-turn limit** — fetch lands, ramp spells, and similar effects are separate from your daily land play.
- **Nonbasic lands can have basic land types** — dual lands like Breeding Pool are both Forest and Island but aren't basic; Blood Moon turns them into Mountains.
- **Setting a land's subtype replaces old subtypes** — Blood Moon wipes Breeding Pool of all abilities/types and replaces with Mountain; adding a subtype (Urborg) retains existing types.

## Canonical Example
**Fetch Land on Turn 3 — Not Counting as a Land Play:**
You control: Verdant Catacombs (fetch land). It's turn 3. You've already played a land this turn (a Forest).

You activate Verdant Catacombs: "{T}, pay 1 life, sacrifice this: search for a Forest or Plains, put it onto the battlefield."
You find Breeding Pool (Forest Island) — it qualifies as a Forest.
Breeding Pool enters the battlefield untapped (you chose not to pay 2 life for untapped; or it just enters untapped per its own text? Breeding Pool says "As Breeding Pool enters, you may pay 2 life. If you don't, it enters tapped." You choose: pay 2 life → enters untapped, OR don't pay → enters tapped.)

This Breeding Pool PUT onto the battlefield via the fetch land's ability: doesn't count toward your land plays this turn (305.4).
You've played 1 land (the Forest) + put 1 land (Breeding Pool via fetch) = 2 lands total, but only 1 "land played."

Next turn: you can play 1 more land + fetch again if you still have a fetch land.

**Example 2 — Blood Moon Targeting Greedy Mana Base:**
Commander game. Player A controls:
  Breeding Pool (Forest Island — nonbasic)
  Stomping Ground (Forest Mountain — nonbasic)
  Sacred Foundry (Mountain Plains — nonbasic)
  Steam Vents (Island Mountain — nonbasic)
  No basic lands in their 5-color deck.

Player A casts Blood Moon ({2}{R}).
Blood Moon resolves: "Nonbasic lands are Mountains."
ALL FOUR of Player A's lands are now Mountains (just {T}: add {R}).
Their Breeding Pool, Stomping Ground, etc.: LOSE all printed abilities.
LOSE their land types (no longer Forest, Island, Mountain, Plains — just Mountain).
Gain intrinsic Mountain mana: {T}: add {R} only.
Player A: can only produce {R} mana. Their 4-color Atraxa deck is effectively shut down.

Player B (who cast Blood Moon): has two basic Islands and a basic Forest.
Blood Moon says "NONBASIC lands." Their Islands and Forest are BASIC → unaffected.
Player B produces {U}{U}{G} freely.

Player A must find Blood Moon removal (enchantment removal like Wear//Tear) using the only mana they can make: {R}.
If their Wear//Tear is {R}{W} (for Tear): they can make {R} but not {W}.
They're stuck unless they draw a basic land to play.

The counterplay to Blood Moon in greedy mana bases: always include a few basic lands (1-2 each of key types) so Blood Moon doesn't completely shut off access to non-red mana.

## Commonly Confused With
- **P328 (Mana Types and Color Identity)** — Color identity for Commander deckbuilding counts mana symbols in the card's text. A basic land's intrinsic mana ability (from its subtype) is NOT printed text for color identity purposes. A Plains has {W} in its text box for Commander identity purposes even though the ability is "intrinsic" — but basic lands are always legal in any deck regardless of color identity rules (they're basics).
- **P342 (Turn Structure)** — Land plays require main phase + empty stack + your turn. The exact timing window for playing lands is covered in P342's main phase section; P350 covers the rules about what COUNTS as playing a land and what doesn't.
- **P347 (Proliferate)** — Proliferate doesn't interact with lands directly, but fetch lands and ramp create scenarios where proliferate-friendly decks build board states quickly. No mechanical connection, just strategic.
- **P004 (Layer System)** — Blood Moon's effect ("nonbasic lands are Mountains") applies in layer 4 (type-changing) and layer 6 (ability changes). Other effects that later modify land types or abilities interact with Blood Moon in timestamp order within those layers.
