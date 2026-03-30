---
id: p421
name: Champion and Hideaway — ETB Exile Mechanics, Linked Abilities, and Return-on-Leave
category: triggered
cr_refs: [702.72a, 702.72b, 702.72c, 702.75a, 702.75b, 607.1, 607.2k, 704.5d, 111.7]
tags: [champion, hideaway, linked-abilities, etb-exile, return-on-leave, blink-champion, champion-token, champion-changeling, Horde-of-Notions, Cloudthresher, Wren's-Run-Packmaster, Mosswort-Bridge, Spinerock-Knoll, Windbrisk-Heights, hideaway-blink, champion-forced-sacrifice, champion-removal, Lorwyn, hideaway-land, exile-face-down]
created: 2026-03-29
examples_count: 2
---

# P421 — Champion and Hideaway — ETB Exile Mechanics, Linked Abilities, and Return-on-Leave

## Abstract
**Champion** (702.72) and **Hideaway** (702.75) are Lorwyn-era triggered abilities that use exile as a holding zone. Champion represents two linked triggered abilities: an ETB that exiles one of your permanents (or sacrifices itself if you can't/won't) and a leave-the-battlefield trigger that returns the exiled card. Hideaway represents an ETB that looks at the top N cards of your library, exiles one face-down, and puts the rest on the bottom. Key non-obvious interactions: (1) blinking a champion creature returns the championed card immediately, then the re-entering champion must exile someone new — two triggers, two effects; (2) you can champion a token, but tokens cease to exist in exile (SBA 704.5d), so when the champion later leaves, nothing returns; (3) removing the championed card from exile does NOT force the champion to leave the battlefield — there's no SBA for "champion creature without a championed card"; (4) blinking a hideaway permanent breaks the link between the old exiled card and the new object — the new permanent can't access the old hideaway card; and (5) Changeling satisfies any champion condition (every creature type).

## The Definitive Rules

**CR 702.72a** (verbatim): *"Champion represents two triggered abilities. 'Champion an [object]' means 'When this permanent enters, sacrifice it unless you exile another [object] you control' and 'When this permanent leaves the battlefield, return the exiled card to the battlefield under its owner's control.'"*

**CR 702.72b** (verbatim): *"The two abilities represented by champion are linked. See rule 607, 'Linked Abilities.'"*

**CR 702.72c** (verbatim): *"A permanent is 'championed' by another permanent if the latter exiles the former as the direct result of a champion ability."*

**CR 702.75a** (verbatim): *"Hideaway is a triggered ability. 'Hideaway N' means 'When this permanent enters, look at the top N cards of your library. Exile one of them face down and put the rest on the bottom of your library in a random order. The exiled card gains "The player who controls the permanent that exiled this card may look at this card in the exile zone."'"*

**CR 607.1** (verbatim): *"An object may have two abilities printed on it such that one of them causes actions to be taken or objects or players to be affected and the other one directly refers to those actions, objects, or players. If so, these two abilities are linked: the second refers only to actions that were taken or objects or players that were affected by the first, and not by any other ability."*

**CR 607.2k** (verbatim): *"The two abilities represented by the champion keyword are linked abilities. See rule 702.72, 'Champion.'"*

## The Pattern

```
CHAMPION (702.72a):
  TWO LINKED TRIGGERED ABILITIES:
  1. ETB: "When this permanent enters, sacrifice it unless you exile another [object] you control."
  2. Leaves: "When this permanent leaves the battlefield, return the exiled card to the battlefield
       under its owner's control."

  KEY MECHANICS:
    MANDATORY-OR-SACRIFICE:
      The exile is not optional. You MUST exile another qualifying object you control,
        OR sacrifice the champion creature.
      If you have no qualifying objects (or deliberately choose not to exile): you sacrifice
        the champion creature itself. It never "sticks" on the battlefield.
      This is enforced by the trigger text — it's not "you may" exile; it's "unless you exile."
      You can CHOOSE which qualifying object to exile (any one you control of the right type).

    CHAMPION IS LINKED:
      The second ability ("return the exiled card") refers only to cards exiled by the FIRST
        ability of this SAME champion permanent.
      If another effect exiles one of your creatures, the champion's second ability doesn't return it.
      If something exiles cards from different champion creatures, each champion returns only its own.

    NO SBA FOR MISSING CHAMPIONED CARD:
      Once the champion is on the battlefield, there's NO state-based action checking whether
        the championed card is still in exile.
      If the championed card is moved from exile by another effect (Riftsweeper, Pull from
        Eternity, etc.): the champion stays on the battlefield indefinitely without issue.
      When champion eventually leaves: the second ability fires, but if the card isn't in exile,
        nothing returns (nothing to return). The trigger still fires but does nothing.

  CHAMPION AND BLINKING:
    Ephemerate ({W}: "exile target creature you control, return it to the battlefield"):
      You control a Changeling Titan ({4}{G}: 7/7; champion a creature):
        Changeling Titan has champion a creature.
      Better example: Wren's Run Packmaster ({3}{G}: 5/5; champion an Elf; {2}{G}: create a
        2/2 Wolf with deathtouch token; Wolf tokens get deathtouch from Packmaster).
      Packmaster enters: champion an Elf. You exile your Llanowar Elves.
      Packmaster is now on battlefield, Llanowar Elves in exile (championed).

      Now: cast Ephemerate targeting Packmaster.
      Ephemerate resolves:
        Step 1: Packmaster is exiled (leaves battlefield).
        Step 2: Packmaster's "leaves battlefield" trigger fires → "return the exiled card
          (Llanowar Elves) to the battlefield."
        Llanowar Elves returns to the battlefield immediately.
        Step 3: Packmaster re-enters the battlefield (from Ephemerate's "then return it").
        Step 4: Packmaster's ETB champion trigger fires → "sacrifice unless you exile another Elf."
        You must exile ANOTHER Elf. If the only Elf you had was Llanowar Elves (just returned),
          you can exile it again (it's on the battlefield). OR you sacrifice Packmaster.

      Net: Llanowar Elves returned to battlefield AND immediately championed again.
      If you rebound Ephemerate: at start of next upkeep, repeat the cycle. Each cycle you
        "free" the championed creature momentarily and re-exile it.
      This is expensive but can matter in specific scenarios (e.g., reset an Elf with -1/-1 counters).

  CHAMPION AND TOKENS:
    Can you champion a token? Yes — tokens are permanents you control of their type.
      Example: champion an Elf — you have an Elf token. You may exile that Elf token.
    WHAT HAPPENS IN EXILE (CR 704.5d):
      "A token is in a zone other than the battlefield, it ceases to exist."
      State-based action: when the token is exiled, SBAs are checked → token ceases to exist.
      The token disappears from exile. No card remains in exile for champion to track.
    DOES THE CHAMPION NEED TO SACRIFICE?
      NO — the ETB was "sacrifice unless you exile." You DID exile a creature (the token).
        The trigger resolved successfully. The sacrifice condition wasn't triggered.
        Championing succeeded. The champion is on the battlefield.
      The fact that the token later ceased to exist in exile is a separate event.
    WHEN CHAMPION LEAVES:
      "Return the exiled card to the battlefield." But there's nothing in exile (token gone).
      The trigger fires but does nothing (no card to return).
    SUMMARY: Championing a token gives you the champion with no "true" champion link.
      The champion permanent stays on the battlefield indefinitely without a championed card
      in exile, and when it eventually leaves, nothing returns.
      This is a real — if unusual — use case for "free" championing.

  CHAMPION AND CHANGELING (702.73):
    Changeling: "This object is every creature type."
    Any champion ability that requires a specific type (e.g., "champion an Elf", "champion
      a Beast", "champion a Faerie") can be satisfied by exiling a Changeling.
    Changelings (Avian Changeling, Mothdust Changeling, etc.) satisfy ALL type requirements.
    This makes Changelings excellent "universal" champon fodder.

  CHAMPION AND ZONE-CHANGE IDENTITY:
    When the championed card returns via the second trigger, it enters the battlefield as a
      new object (zone change from exile to battlefield).
    It doesn't "remember" any previous state (counters it had are gone, unless an effect
      causes them to persist — which nothing normally does).
    Auras attached to the championed creature before it was exiled: did not follow it to exile.
    Auras would need to re-attach on the championed creature's return if they can.

HIDEAWAY (702.75a):
  SINGLE ETB ABILITY:
    "When this permanent enters, look at the top N cards of your library. Exile one of them
     face down. Put the rest on the bottom in random order."
  The exiled card gains text: "The player who controls the permanent that exiled this card
    may look at this card in the exile zone."
  This text is gained by the EXILED CARD — not by the hideaway permanent.
  The hideaway permanent itself typically has a separate activated ability like "play the
    exiled card if [condition]" — this is the "payoff" ability, separate from the triggered ETB.

  HIDEAWAY AND BLINK — BROKEN LINK:
    Hideaway permanents are most often lands (Mosswort Bridge, Spinerock Knoll, Windbrisk Heights,
      Shelldock Isle) or enchantments.
    If you blink the hideaway permanent (flicker, exile+return):
      The returning permanent is a NEW OBJECT. The new object's hideaway trigger fires again:
        look at top N, exile a NEW card face down.
      The OLD hidden card is still in exile — but the old permanent that exiled it no longer
        exists as an object.
      The ability on the OLD hidden card says "the player who controls the permanent that exiled
        this card." The permanent that exiled it was the OLD object — which no longer exists.
      Nobody controls the old permanent. So nobody can look at (or cast) the old hidden card
        via that granted text.
      ALSO: the hideaway permanent's "play the exiled card" activated ability typically says
        "the card exiled with [this land's] hideaway ability" — the new object has a NEW exiled
        card. The old card is stranded in exile permanently.
      SUMMARY: blinking a hideaway permanent orphans the old hidden card in exile (unreachable)
        and forces a new card to be hidden.

  HIDEAWAY AND CONTROL CHANGE:
    The text on the hidden card: "the player who controls the permanent that exiled this card
      may look at this card."
    If control of the hideaway permanent changes: the NEW controller can now look at the
      hidden card (they now control the permanent that exiled it).
    The hideaway permanent's activation ability ("play the exiled card if [condition]") also
      becomes available to the new controller (it's an ability of the permanent they control).
    Original controller LOSES the ability to look at or play the card (they no longer control
      the permanent).

  GRAFDIGGER'S CAGE AND HIDEAWAY:
    Grafdigger's Cage: "players can't cast spells from graveyards or libraries."
    Hideaway casts from exile (the card was exiled, then played from exile).
    Cage doesn't stop hideaway (exile ≠ GY or library).
    (Same logic as P415/P417: Cage only restricts GY and library casting.)

  HIDEAWAY AND THE FACE-DOWN CARD:
    The exiled card is face-down. Face-down exiled cards have no characteristics.
    No player can interact with it as a card — it's just a hidden zone object.
    Riftsweeper ({1}{G}: 2/2; "when it enters, put target face-down card from exile into
      its owner's library at random"):
    Riftsweeper CAN target a face-down exiled card (hideaway'd card). It moves it to the
      library at random. Now the hideaway permanent has no card to play.
    The "play the exiled card" ability becomes unusable (no card there).
```

## Definitive Conclusions

- **Champion exiles a qualifying permanent you control, OR you sacrifice the champion** — it's not optional; if you have no qualifying permanents, you sacrifice the champion itself.
- **There's no SBA for "champion without a championed card in exile"** — once on the battlefield, the champion stays there regardless of what happens to the exiled card; blinking or removing the card from exile doesn't force the champion to leave.
- **Blinking a champion returns the championed card immediately, then the re-entering champion must exile someone new** — two triggers fire, with the return first; optimal play can retrieve and re-exile the same card.
- **Championing a token successfully "empties" the champion slot** — tokens cease to exist in exile (SBA 704.5d); the champion stays on the battlefield with no card in exile; when champion leaves, nothing returns.
- **Changeling satisfies any champion type restriction** — since Changeling creatures are every creature type, they're legal exile targets for Champion an Elf, Champion a Beast, Champion a Faerie, etc.
- **Blinking a hideaway permanent orphans the old hidden card in exile** — the new object exiles a different card and can only access its own new card; the old hidden card is permanently inaccessible.
- **Grafdigger's Cage does not stop hideaway** — hideaway plays the card from exile, not from GY or library.

## Canonical Example
**Wren's Run Packmaster + Ephemerate:**
You control Wren's Run Packmaster ({3}{G}: 5/5; champion an Elf; activated: create 2/2 Wolf token).
You have Llanowar Elves ({G}: 1/1 Elf).

Packmaster enters: champion ETB trigger fires → you exile Llanowar Elves (championed).
Packmaster is now a 5/5 with Wolf-generating ability.

Cast Ephemerate ({W}: exile target creature you control, return it to the battlefield under its owner's control) targeting Packmaster.
Ephemerate resolves:
1. Packmaster exiled (leaves battlefield). Packmaster's leaves-battlefield trigger fires.
2. Packmaster re-enters (Ephemerate immediately returns it).
3. Two triggers on the stack: (A) Packmaster's champion ETB trigger; (B) return Llanowar Elves.
   APNAP (you control both): put B on bottom, A on top? Actually — you choose order since
   both are your triggers. You want B to resolve first (get Elves back) before A fires,
   or A fires before B resolves? Let's think: if A resolves first ("exile an Elf or sacrifice"),
   you need an Elf to exile. Llanowar Elves is still in exile (B hasn't resolved yet).
   Can you champion Llanowar Elves again while it's in exile? It's not on the battlefield —
   you can't exile a creature that's already in exile.
   So: put A (champion ETB) on stack first (resolves last), put B (return Elves) on top.
   B resolves: Llanowar Elves returns to battlefield.
   A resolves: champion ETB — exile an Elf you control OR sacrifice Packmaster. You exile Elves again.
Result: Packmaster on battlefield, Llanowar Elves in exile again. Net: {W} spent, status restored.

**Example 2 — Mosswort Bridge + Riftsweeper:**
You play Mosswort Bridge (enters tapped — from its "enters tapped" ability printed in Oracle text via 702.75b errata). Hideaway 4 triggers: look at top 4, exile one face-down (say, a Primeval Titan), rest to bottom.
Mosswort Bridge's activation: "Whenever you attack with creatures with total power 10 or greater, you may play the exiled card without paying its mana cost."

Opponent casts Riftsweeper, targeting the face-down Primeval Titan in exile.
Riftsweeper ETB: put the face-down card into its owner's library at random.
Primeval Titan is now shuffled into your library at a random position.
Mosswort Bridge's activation condition can still be met — but there's no card to play.
The activation becomes a do-nothing (or fails to find a card) if triggered.
Titan must be re-found somehow (Ponder, Sensei's Divining Top, shuffling) to recover the value.

## Commonly Confused With
- **P420 (Evoke)** — Evoke is also an alternative-cost Lorwyn mechanic with a sacrifice trigger. Champion exiles a DIFFERENT permanent (not itself) and returns it later; evoke sacrifices itself (the caster) via a trigger. Both are Lorwyn designs but completely different mechanically.
- **P413 (Morph)** — Morph also exiles... no, morph doesn't exile. But both morph and hideaway involve face-down cards. Morph face-down cards are on the battlefield (as 2/2 creatures); hideaway face-down cards are in exile (not on the battlefield, not interactable as cards).
- **P012 (Blink/Bounce/ETB Recurrence)** — Blinking a champion creature to reuse its ETB is a classic blink strategy. But champion's double-trigger (return then re-exile) adds complexity vs. simple ETB blink loops.
- **P419 (Persist/Undying)** — Both persist and champion cause a creature to "return" after leaving. Persist returns the card itself on death; champion returns a DIFFERENT card when the champion leaves for any reason.
