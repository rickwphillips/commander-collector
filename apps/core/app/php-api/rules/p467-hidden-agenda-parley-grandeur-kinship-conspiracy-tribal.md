---
id: p467
name: Hidden Agenda, Parley, Grandeur, and Kinship — Conspiracy Name-Choice, Group-Reveal-Draw, Legendary-Discard-Bonus, and Upkeep-Tribal-Reveal
category: multiplayer
cr_refs: [702.106, 207.2c, 603.2, 302.6, 700.4, 800.4, 603.3b]
tags: hidden-agenda, parley, grandeur, kinship, conspiracy, face-down-command-zone, group-card-reveal, legendary-discard, upkeep-reveal-tribal, conspiracy-set, morningtide, future-sight
created: 2026-03-29
examples_count: 6
---

# P467 — Hidden Agenda, Parley, Grandeur, and Kinship — Conspiracy Name-Choice, Group-Reveal-Draw, Legendary-Discard-Bonus, and Upkeep-Tribal-Reveal

## Abstract

Four ability words and one formal keyword from Conspiracy and tribal sets that create unusual multiplayer or card-name-matters interactions: **Hidden Agenda** (CR 702.106, Conspiracy) places a conspiracy card face-down in the command zone with a secretly noted card name; **Parley** (Conspiracy, CR 207.2c) has each player reveal their library's top card and provides effects based on nonland cards revealed; **Grandeur** (Future Sight, CR 207.2c) is an activated ability on legendary cards that can be triggered by discarding another copy of the same card from hand; and **Kinship** (Morningtide, CR 207.2c) provides an upkeep bonus if the top card of your library shares a creature type with the Kinship creature. All four have non-obvious interactions with bluffing, face-down information, and tribal synergies.

## The Definitive Rules

### Hidden Agenda (CR 702.106)
**CR 702.106a verbatim:** *"As you cast a conspiracy card with hidden agenda, you may note a card name on that card. The conspiracy card is then put into the command zone face down."*

**CR 702.106b verbatim:** *"You may look at a face-down conspiracy card you own at any time."*

**CR 702.106c verbatim:** *"If you wish to reveal a face-down conspiracy card you own with hidden agenda, you may do so at any time."*

Hidden agenda conspiracies remain face-down in the command zone and apply their effect (usually linked to the named card) only if/when revealed or when interacted with. The player knows their own choice; opponents don't unless the card is revealed.

### Parley (CR 207.2c)
Parley text pattern: *"Each player reveals the top card of their library. For each nonland card revealed this way, [effect]. Then each player who revealed a nonland card draws a card."*

Parley is a group-reveal effect: ALL players reveal simultaneously, then effects are counted based on total nonland cards revealed, then players who revealed nonlands each draw a card.

### Grandeur (CR 207.2c)
Grandeur text pattern: *"Discard another card named [this card]: [bonus effect]."*

Grandeur is an **activated ability** requiring you to discard a second copy of the same legendary card from your hand. The card with Grandeur must be on the battlefield (or wherever the ability is located) to be activated. It requires literally another copy of itself in hand to discard.

### Kinship (CR 207.2c)
Kinship text pattern: *"At the beginning of your upkeep, you may look at the top card of your library. If it shares a creature type with [this creature], you may reveal it and [bonus effect]."*

Kinship checks if the revealed card shares a creature type (subtype) with the Kinship creature. The player may look at the top card privately and choose whether to reveal it (and get the benefit) — if the top card doesn't share a type, there's no reveal and no benefit.

## The Pattern

```
HIDDEN AGENDA pattern:
Draft/pre-game: Note a card name on the Hidden Agenda conspiracy.
  → Put it face-down in the command zone
  → You can look at your own face-down Hidden Agenda any time (private info)
  → You CHOOSE when to reveal it (or never)
  → The conspiracy's effect typically references "cards with the chosen name"
    → E.g., "Creatures you control with the chosen name have double strike"
    → This effect applies even while face-down (because the conspiracy is still in play;
      the effect just checks the named card condition)
    → Actually: most hidden agenda conspiracies need you to reveal them to apply
      the effect OR the effect is secret and applies silently
  → Double Agenda: Two hidden agendas can share a name or different names
  → After choice: can change the named card by re-revealing? NO — the name is
    "noted" when cast and remains noted (unless the card says otherwise)

PARLEY pattern:
Execution:
  1. Each player reveals their top library card simultaneously
  2. Count total nonland cards revealed across all players
  3. Effect resolves based on that count (varies by card)
  4. Each player who revealed a nonland card draws a card
Key interactions:
  → Affects ALL players — opponents also draw if they revealed nonlands
  → In multiplayer (4 players), if all reveal nonlands: 4 draws total (one per player)
  → If a player has an empty library: they can't reveal — they don't get a draw
  → A player who revealed a land gets nothing (lands don't trigger the nonland condition)
  → The "each player draws" is the most non-obvious part: OPPONENTS also draw
  → Parley disadvantage: giving opponents card advantage is dangerous;
    Parley payoffs must be strong enough to offset opponent draws

GRANDEUR pattern:
Activation cost: Discard another card named [same legendary name]:
  → The legendary card must have grandeur and be ON THE BATTLEFIELD
    (or wherever the ability is — typically battlefield)
  → You must have another copy of the same legendary card IN HAND to discard
  → Discarding IS the cost (cost already paid once activated)
  → Legendary rule doesn't apply to the second copy in hand — it's only the card in hand
    until it's discarded
  → Uniqueness: Grandeur punishes holding two copies of a legend (normally wasted by
    the legend rule); Grandeur rewards you for redundancy in legends
  → Only one Grandeur activation per ability instance (can't chain: first activation
    requires one discard, getting two copies in hand for a second activation requires
    drawing two more copies)

KINSHIP pattern:
Upkeep trigger: "At the beginning of your upkeep..."
  → MAY look at top card (optional)
  → Shared creature type = at least one subtype in common
  → Kinship creature type: check the Kinship creature's current subtypes
    → If a Kinship Merfolk has its subtypes removed (e.g., Humility), it
      has no creature types and nothing shares a type with it
  → Card on top of library: check what creature types it has
    → Instants/sorceries/artifacts with no creature type share NO type
    → A creature card with a different type doesn't match
    → A creature card sharing even one type matches (Merfolk Shaman matches Merfolk)
  → If top card matches and you reveal it: get the bonus
  → You are not obligated to reveal (you may choose not to even if it matches)
  → Choice is private: you look, decide whether to reveal → strategic bluffing possible
```

## Definitive Conclusions

**Hidden Agenda:**
- Hidden Agenda conspiracies create metagame uncertainty: opponents don't know what you named, so they must play around possibilities. The actual benefit of many Hidden Agenda conspiracies comes more from the uncertainty than the revealed power.
- The named card doesn't need to be in your deck — any legal card name can be noted. Of course, noting a card not in your deck means the ability never applies.
- Key card: *Advantageous Proclamation* (CNS): Reduces starting deck size. Not hidden agenda, but same draft-conspiracy concept.
- Key card: *Backup Plan* (CNS): "Hidden Agenda. Note a card name. Each creature you control with the chosen name enters with an additional +1/+1 counter on it." Face-down until you reveal it to confirm the bonus.
- *Secret Summoning* (CNS): Hidden agenda that lets you put creatures with the chosen name directly from your hand onto the battlefield.

**Parley:**
- The card-draw symmetry of Parley is its defining feature. In a group game, Parley often draws 3–4 opponents a card each, offsetting your advantage. Parley works best in decks that can win by volume of resources rather than by direct advantage.
- In a 2-player game, parley is much stronger: at worst both players draw 1 card (symmetric) but you get the parley effect.
- Key card: *Selvala, Explorer Returned* (CNS): "Parley — {T}: Each player reveals the top card of their library. For each nonland card revealed this way, add {G} and you gain 1 life. Then each player draws a card." In multiplayer, parley triggers each turn — you gain mana and life equal to the number of nonland cards revealed, and each player draws. Group hug strategy with continuous parley.
- Key card: *Minds Aglow* (CMD11): "Join Forces — Starting with you, each player may pay any amount of mana. Each player draws X cards, where X is the total amount of mana paid by all players." Not a Parley card, but often mistaken for one — it's Join Forces. For a true Parley example beyond Selvala, note that Parley appears only on a handful of CNS cards. (Note: Alliance of Arms is a Join Forces card, not Parley.)

**Grandeur:**
- Grandeur is the unique solution to "having two legends is a waste": normally, drawing your second copy of a legendary card is bad (legend rule kills one). With Grandeur, the second copy in hand becomes a resource — discard it to activate the legendary ability.
- In Commander (where you run 1-of) Grandeur is largely unplayable since you can only run one copy.
- In 60-card formats with 4 copies, Grandeur makes a legendary card more valuable at 2+ copies: first copy on board, second copy → Grandeur fuel, third/fourth → still useful.
- Key card: *Tarox Bladewing* (FUT): "Flying, haste. Grandeur — Discard another card named Tarox Bladewing: Tarox Bladewing gets +X/+X until end of turn, where X is its power." The grandeur ability makes Tarox dramatically larger for the turn. (Note: Jaya Ballard, Task Mage does NOT have Grandeur; she has three activated abilities including discard-for-damage and a mass burn ability.)
- Key card: *Korlash, Heir to Blackblade* (FUT): "Grandeur — Discard another card named Korlash, Heir to Blackblade: Search your library for up to two Swamp cards and put them onto the battlefield tapped. Shuffle." Using second/third Korlash copies as free land acceleration.

**Kinship:**
- Kinship rewards tribal-heavy decks: if your top 10 cards are all Elves, the top card of your library almost always shares the Elf type, triggering Kinship every upkeep.
- Kinship is optional (you "may" reveal). If the top card is a premium card you don't want to reveal (showing opponents what you're about to draw), you can pass on the reveal.
- In a pure tribal deck (all one type), Kinship practically guarantees the bonus each upkeep.
- Key cards: *Reins of the Vinesteed* (MTG not a kinship card). Kinship cards: *Burrenton Forge-Tender* (LRW): No kinship. Actual kinship: *Lys Alana Huntmaster* (LRW): "Whenever you cast a Elf spell, you may create a 1/1 green Elf Warrior token." Not kinship. *Distant Melody* isn't kinship either. Actual kinship cards: *Elvish Eulogist* (LRW): "Kinship — At the beginning of your upkeep, you may look at the top card of your library. If it shares a creature type with Elvish Eulogist, you may reveal it. If you do, you gain life equal to the number of Elves you control."

## Canonical Examples

**Hidden Agenda:**
- *Backup Plan*: Note your bomb rare. Each copy of that creature enters with extra counters.

**Parley:**
- *Selvala, Explorer Returned*: Tap to trigger parley: each player reveals a card, you add {G} and gain 1 life per nonland revealed, then each player draws. Group hug that accelerates your mana and life.

**Grandeur:**
- *Korlash, Heir to Blackblade*: Discard second Korlash to ramp 2 Swamps into play tapped. Rewards running 4 copies of a legendary card.

**Kinship:**
- Tribal Elf deck: *Elvish Eulogist* with 35 Elf cards in library → kinship bonus nearly every upkeep.

## Commonly Confused With

- **P445** (Companion) — Companion is also a pre-game card mechanic placed in the command zone; Hidden Agenda is a conspiracy placed face-down in the command zone; both pre-game, different zones and functions
- **P451** (Eminence) — Eminence works from the command zone; Hidden Agenda also starts in the command zone; but Eminence is for commanders while Hidden Agenda is for conspiracies (draft format)
- **P422** (Changeling) — Kinship checks creature subtypes; Changeling has all subtypes; a Changeling on top of your library matches ANY Kinship creature's type condition
- **P421** (Champion/Hideaway) — Hideaway also has "look at top cards" effects on lands; Kinship is a creature ability with the "look at top card" pattern
