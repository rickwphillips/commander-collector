---
id: p469
name: Lieutenant, Sweep, and Radiance — Commander-Control Bonus, Land-Return-Scale, and Shared-Color Spread
category: multiplayer
cr_refs: [207.2c, 603.4, 900.1, 300.1, 305.1, 119.6, 700.4, 613.1]
tags: lieutenant, sweep, radiance, ability-word, commander-control, land-return-scaling, shared-color, commander-2014, saviors-of-kamigawa, ravnica-original
created: 2026-03-29
examples_count: 6
---

# P469 — Lieutenant, Sweep, and Radiance — Commander-Control Bonus, Land-Return-Scale, and Shared-Color Spread

## Abstract

Three ability words from different eras with unusual scaling or targeting mechanics: **Lieutenant** (Commander 2014) provides a bonus as long as you control your commander; **Sweep** (Saviors of Kamigawa) allows returning any number of lands you control to increase a spell's effect; and **Radiance** (Ravnica: City of Guilds original block) causes a spell's effect to spread to all other permanents sharing a color with the target. Lieutenant is the only ability word that explicitly interacts with the Commander zone/rule; Sweep creates a unique "return lands as additional cost" mechanic; Radiance creates wide-spreading effects that scale with opponents' use of the same colors.

## The Definitive Rules

### Lieutenant (CR 207.2c)
Lieutenant text pattern: *"As long as you control your commander, [this creature has / gets / you gain] [bonus effect]."*

Lieutenant checks a continuous condition: whether you currently control your commander. The bonus applies while the condition is true and disappears when it's not. If your commander is bounced, destroyed, or moved to the command zone, the bonus immediately stops. If your commander returns to the battlefield, the bonus resumes.

### Sweep (CR 207.2c)
Sweep text pattern: *"[Spell description]. Sweep — Return any number of [basic land type] lands you control to their owner's hand. [Spell does N per land returned]."*

Sweep is an additional cost or effect tied to returning lands. You return lands as part of casting the spell (additional cost style) and the spell's effect scales by the number of lands returned.

### Radiance (CR 207.2c)
Radiance text pattern: *"[Spell targets a permanent]. Radiance — [Spell] affects each other permanent that shares a color with [target]."*

Radiance spreads the effect to all OTHER permanents sharing at least one color with the targeted permanent. "Shares a color" means the permanent and the target have at least one color in common. Colorless permanents share no color with anything (not even other colorless permanents — sharing a color requires having a color, and colorless is not a color per CR 105.1).

## The Pattern

```
LIEUTENANT pattern:
Continuous condition: "As long as you control your commander, [bonus]"
  → Checked continuously (re-checked in every game state update)
  → "Your commander" = the specific legendary card designated as commander for this game
  → If commander is in the command zone → NOT controlled → bonus inactive
    (you don't "control" a card in the command zone — command zone ≠ battlefield)
  → If commander is on the stack (being cast) → NOT controlled → bonus inactive
  → If commander is on the battlefield → controlled → bonus active
  → If commander is in the GY, exile, hand, library → NOT controlled → bonus inactive
  → In multiplayer: if you lost your commander through theft (opponent controls it),
    you don't control it → bonus inactive
  → Two commanders (partner): "your commander" = either designated partner;
    bonus is active if you control EITHER partner
  → The Lieutenant creature itself can be the commander (if the creature IS your commander
    and has Lieutenant, the condition is "as long as you control this creature," which
    is always true while it's on the battlefield)

SWEEP pattern:
Additional cost as part of casting:
  → "Return any number of [land subtype] lands you control to your hand"
  → At the time of declaration, choose how many lands to return (can be zero)
  → The choice is made at casting time, lands returned as part of the cost
  → The spell's effect then scales by the number of lands returned
  → Lands go to HAND (not GY), so you get them back to replay
  → The trade-off: tapped lands are returned too, paying them back means you need
    to replay them (missing mana for the turn)
  → Sweep can return zero lands → spell still resolves, just with minimum effect
  → Since lands go to hand: landfall doesn't trigger (they're not entering the battlefield)
  → Relaying the lands later = landfall triggers when they re-enter
  → Land subtypes matter: "Return any number of Snow lands" vs "basic Island lands"

RADIANCE pattern:
Spread condition: "Each other permanent that shares a color with [target]"
  → "Shares a color" = has at least one color in common
  → Targets one permanent, affects many others
  → Colorless = no color → not affected by radiance (can't share a color when you have none)
  → A white-blue permanent shares a color with a white permanent AND with a blue permanent
  → Multicolor targets: radiance spreads to MORE permanents (more colors = more sharing)
  → This cuts both ways: targeting your own colored permanent spreads to opponent's
    permanents of the same color too
  → Radiance buff effects: "Tap target creature. Radiance — Tap each other creature
    that shares a color with target creature." Spreads a tap to ALL creatures of that color.
  → Using Radiance offensively: target a heavily-used color to mass-affect opponent's board
  → Using Radiance defensively: target your own creature to give all your creatures the benefit
  → Spreading: the effect hits ALL matching permanents (not just creatures) unless
    the card specifies "creature" or another type
```

## Definitive Conclusions

**Lieutenant:**
- Lieutenant is a powerful Commander-format mechanic that rewards keeping your commander on the battlefield. Because Commander games revolve around recastable commanders, Lieutenant incentivizes protecting your commander rather than recasting it.
- With Partner commanders, Lieutenant is active if EITHER partner is in play. This makes Partner + Lieutenant very effective.
- Lieutenant abilities range from +2/+2 to gaining abilities like "at the beginning of combat, create tokens" — the power scales with the ability text on the specific Lieutenant card.
- Key card: *Chasm Skulker* — not Lieutenant. *True-Name Nemesis* — not Lieutenant. Actual Lieutenant cards: *Breaker of Armies* — no. The Commander 2014 deck cards with Lieutenant: *Thunderfoot Baloth* (C14): "Lieutenant — As long as you control your commander, Thunderfoot Baloth gets +2/+2 and other creatures you control get +2/+2 and have trample." When your commander is in play, Thunderfoot itself gets +2/+2 (to 7/7) and every other creature gets +2/+2 with trample — massive anthem effect with trample spread.
- *Master Biomancer* from Return to Ravnica is not Lieutenant, but for reference: *Ulvenwald Hydra*, *Assault Suit*, and others from Commander products.
- *Bruse Tarl, Boorish Herder* is a partner commander — controlling either partner satisfies Lieutenant for Partner decks.

**Sweep:**
- Sweep is a powerful tempo play in land-heavy formats: returning 5 lands to hand generates an enormous effect (e.g., deal 5 damage or draw 5 cards) but costs you that many land drops for future turns.
- Fetch lands that have been tapped and used can be swept back to hand, then replayed: each replay fetches again, generating Landfall triggers on each re-entry. Combined with *Tireless Tracker* or *Aesi, Tyrant of Gyre Strait*, this creates significant value.
- Key cards: *Sink into Takenuma* (SOK): "Sweep — Return any number of Swamps you control to their owner's hand. Target player discards a card for each Swamp returned this way." Returning 5 Swamps forces the opponent to discard 5 cards. (Note: Horobi's Whisper is a real SOK card but it has Splice onto Arcane, NOT Sweep.)
- *Charge Across the Araba* (SOK): "Sweep — Return any number of Plains you control to their owner's hand. Creatures you control get +1/+1 until end of turn for each Plains returned this way." Return 6 Plains → each of your creatures gets +6/+6 until end of turn.

**Radiance:**
- Radiance is an unusual design that didn't return because of its complex effects on multiplayer: in a 4-player game with all players running the same colors, a single Radiance spell can affect every permanent on the table.
- The "spreads to other permanents sharing a color" mechanic is symmetric in a dangerous way: a Radiance buff to your creatures also buffs your opponents' creatures of the same color.
- Using Radiance for removal: target an opponent's creature of a color. Every other permanent (yours and opponents') of that color is also affected. Strategic use requires understanding the color distribution across all permanents.
- Key cards: *Carom* (RAV): "The next 1 damage that would be dealt to target creature this turn is dealt to another target creature instead. Radiance — Carom affects each other creature that shares a color with the first target creature." Redirects damage AND copies that redirect to all same-colored creatures.
- *Leave // Chance* (GRN) is not Radiance. Actual Ravnica original Radiance card: *Brightflame* (RAV): "Brightflame deals X damage to target creature and X damage to each other creature that shares a color with it. You gain life equal to the damage dealt this way."

## Canonical Examples

**Lieutenant:**
- *Thunderfoot Baloth*: Thunderfoot gets +2/+2 (to 7/7) and your entire team gets +2/+2 with trample as long as your commander is in play. Puts enormous pressure on opponents to remove your commander quickly.

**Sweep:**
- *Sink into Takenuma*: Return 6 Swamps to hand → target player discards 6 cards. Devastating hand destruction that rebuilds your mana base next turn.

**Radiance:**
- *Brightflame*: X=4 deals 4 to a white creature and 4 to every other white creature. Against a mono-white tokens deck, a single Brightflame can wipe the entire board.

## Commonly Confused With

- **P451** (Eminence) — Eminence works from the command zone; Lieutenant requires the commander to be on the battlefield (controlled); opposite zones for the condition
- **P455** (Domain/Converge/Chroma) — Chroma counts colored mana symbols; Radiance checks shared color on permanents; both involve color but measuring different things
- **P113** (Flanking — multi-blocker) — Radiance is different from flanking; both affect creatures in a spreading way but Radiance is about color while Flanking is about blocking
- **P464** (Detain/Bolster/Support) — Radiance targets one and spreads; Support targets up to N explicitly; both are multi-target effects but with different selection mechanics
