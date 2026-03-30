---
id: p555
name: Meld — Zone Identity, Dual-Card Permanent, and Mana Value Sum
category: zones
cr_refs: [712.4, 712.4a, 712.4b, 712.4c, 712.5, 712.8g, 701.42, 701.42a, 701.42b, 701.42c, 202.3c]
tags: [meld, dual-card, zone-identity, mana-value, exile, combined-back-face, new-object, counters, auras, equipment, commander]
created: 2026-03-31
examples_count: 3
---

# P555 — Meld — Zone Identity, Dual-Card Permanent, and Mana Value Sum

## Abstract

**Meld combines two specific cards into a single permanent represented by both physical cards.** When two meld pair cards are exiled together, they return melded — forming one new object on the battlefield with only the characteristics of the combined back face. This new object has **no relation** to either card that left the battlefield: counters, Auras, Equipment, and other effects that affected those cards don't carry over. The melded permanent's mana value equals the **sum** of both front faces' mana values. A copy of a melded permanent has MV 0 (it copies the combined back face only). When a melded permanent leaves the battlefield, **both physical cards** move to the destination zone. In any zone other than the battlefield, each card has only its front-face characteristics. Only cards from the same meld pair can meld; tokens and non-meld cards cannot.

## The Definitive Rules

**CR 712.4 (Meld Cards):** *"Some pairs of cards are meld cards. Each meld card has a back face that serves as half of one oversized card face. See rule 701.42, 'Meld.'"*

**CR 701.42a (Meld Action):** *"To meld two cards, put them onto the battlefield with their back faces up and combined. The resulting permanent is a single object represented by two cards."*

**CR 701.42c (Meld Failure):** *"If an instruction says to meld two cards and one or both of those cards can't be put onto the battlefield, they stay in their current zone."*

**CR 712.4b (Back Face Reference):** *"If a rule or effect references the back face of a meld card when not part of a melded permanent on the battlefield, it fails to determine its characteristics."*

**Official Ruling (2022-10-14):** *"When two cards are exiled and melded, they each leave the battlefield, then return together as one new object with no relation to either of the objects that left the battlefield. Counters, Auras, Equipment, and other effects that affected those two cards don't affect the melded permanent."*

**Official Ruling (2022-10-14):** *"The mana value of a melded permanent is the sum of the mana values of its front faces. A creature that becomes a copy of a melded permanent has only the characteristics of that combined back face, and its mana value is 0."*

**Official Ruling (2022-10-14):** *"When a pair of cards are melded, the result is a single creature that's represented by two cards. If the melded creature dies, both cards are put into your graveyard. As it leaves the battlefield, both of those cards are turned face up again. If the cards are put on the top or bottom of your library, you choose their relative order."*

**Official Ruling (2022-10-14):** *"Only two cards belonging to the same meld pair can be melded. Tokens, cards that aren't meld cards, or meld cards that don't form a meld pair can't be melded. If an effect instructs a player to meld cards that can't be melded, those cards remain in exile."*

**Official Ruling (2022-10-14):** *"While a meld card is in any zone other than the battlefield, it has only the characteristics of its front face."*

**Official Ruling (2022-10-14):** *"If an effect moves a melded permanent to a new zone and then affects 'that card,' it affects both cards."*

## The Pattern

```
MELD TRIGGER:

  A meld card has a conditional trigger:
    "If you both own and control [Card A] and [Card B], exile them,
     then meld them into [Combined Back Face]."

  Requirements to meld:
    1. You OWN both cards (they came from your deck)
    2. You CONTROL both cards (they're on your battlefield)
    3. Both are actual cards (not tokens, not copies)
    4. Both belong to the same meld pair

  If any requirement fails → both cards are exiled (trigger exiles first),
    then meld is attempted. If meld fails (701.42c), cards remain in exile.

EXILE AND MELD PROCESS:

  Step 1: Both cards leave the battlefield → exile zone
    - Each card's LTB triggers fire (if any)
    - Each card becomes a new object in exile
    - Counters removed, Auras detach and go to graveyard (SBA)
    - Equipment detaches but stays on the battlefield

  Step 2: The two cards combine into one melded permanent
    - Returns to the battlefield as ONE new object
    - Has ONLY the characteristics of the combined back face
    - No relation to either previous object
    - ETB triggers of the melded permanent fire

  New object rule (CR 109.1):
    - The melded permanent is a BRAND NEW object
    - No memory of counters, enchantments, or equipment from before
    - Any "enters the battlefield" replacement effects check the combined back face

CHARACTERISTICS OF MELDED PERMANENT:

  On the battlefield (melded, back face up):
    - Name: combined back face name only
    - Type: combined back face type line
    - Color: determined by color indicator on back face
    - P/T: combined back face P/T
    - Abilities: combined back face abilities only
    - Mana cost: NONE (back faces don't have mana costs)
    - Mana value: SUM of both front faces' mana values

  Example: Urza, Lord Protector (MV 3) + The Mightstone and Weakstone (MV 5)
    → Urza, Planeswalker (combined back face)
    → Mana value = 3 + 5 = 8

COPY OF MELDED PERMANENT:

  A copy of a melded permanent copies the combined back face.
    - Gets all characteristics of the back face
    - Mana value = 0 (no mana cost to copy; sum rule doesn't apply to copies)
    - The copy is NOT represented by two cards

  Example: Clone enters as a copy of Brisela, Voice of Nightmares
    → Clone has Brisela's abilities, P/T, type, etc.
    → Clone's mana value = 0

MELDED PERMANENT LEAVES THE BATTLEFIELD:

  When a melded permanent leaves the battlefield:
    - Both physical cards move to the destination zone
    - Both cards are turned face up (front faces visible again)
    - In the new zone, each card has only its front-face characteristics

  Death: both cards go to graveyard (two separate cards in GY)
  Exile: both cards go to exile (two separate cards in exile)
  Bounce: both cards go to hand (two separate cards in hand)
  Library: both cards go to library (owner chooses relative order)

  "That card" effects: if an effect references "that card" after moving
    a melded permanent, it affects BOTH cards.

NON-BATTLEFIELD ZONES:

  In any zone other than the battlefield:
    - Each card has only its front-face characteristics
    - They are two separate objects
    - Cannot be melded again from hand/graveyard/exile (meld triggers
      require both to be on the battlefield under your control)

TOKENS AND NON-MELD CARDS:

  Tokens cannot meld (they are not cards).
  Non-meld cards cannot meld (no meld pairing).
  Cards from different meld pairs cannot meld with each other.
  If instructed to meld invalid cards: they remain in exile.

COMMANDER RULES:

  Color identity: determined by FRONT FACE only (mana cost + rules text symbols).
  The combined back face's characteristics are not considered for color identity.

  If one card of a meld pair is your commander:
    - The pair can meld; the melded permanent is also your commander
    - If the melded permanent leaves the battlefield:
      only the card designated as commander may go to the command zone
    - The other card goes to the appropriate zone (graveyard, exile, etc.)
```

## Definitive Conclusions

- **Melding creates a new object** — counters, Auras, Equipment do not carry over.
- **Mana value = sum of front faces** — not 0, not combined back face (which has no mana cost).
- **Copy of melded permanent has MV 0** — copies the back face, which lacks mana costs.
- **Both cards move together** — when leaving the battlefield, both go to the same zone.
- **Front face only in non-battlefield zones** — each card reverts to its own identity.
- **Only valid meld pairs can meld** — tokens, copies, and mismatched pairs cannot.
- **Commander:** only the designated commander card may go to command zone on leave.

## Canonical Example

**Urza Meld:**

You control Urza, Lord Protector ({1}{W}{U}, MV 3) and The Mightstone and Weakstone ({5}, MV 5). You activate Urza's ability: "{7}: If you both own and control Urza and The Mightstone and Weakstone, exile them, then meld them into Urza, Planeswalker."

Both cards leave the battlefield (LTB triggers fire). Any Auras attached fall off. Any +1/+1 counters are removed.

Both cards return melded: Urza, Planeswalker enters the battlefield. MV = 3 + 5 = 8. New object — no memory of previous state.

**Example 2 — Copy of Melded Permanent:**

Opponent controls Brisela, Voice of Nightmares (melded from Gisela + Bruna). You cast Clone targeting Brisela.

Clone enters as a copy of Brisela. It has Brisela's abilities, P/T, type, and color. But its mana value is 0 (not the sum of Gisela + Bruna's front faces — that rule applies only to the actual melded permanent).

**Example 3 — Melded Permanent Dies:**

Urza, Planeswalker takes lethal damage and dies. Both physical cards (Urza, Lord Protector and The Mightstone and Weakstone) are put into your graveyard face-up. In the graveyard, they are two separate cards with their front-face characteristics. They can be individually reanimated, exiled, or otherwise interacted with — they are no longer melded.

## Commonly Confused With

- **P003 (Zone Change Identity)** — P003 covers single-object identity across zones; P555 covers two-object-to-one meld transformation.
- **P011 (Linked Ability Zone Reset)** — P011 covers linked exile-return pairs; P555 covers meld's unique dual-card exile-return.
- **P063 (Mutate)** — P063 covers merged permanents (one permanent, all abilities); P555 covers meld (one permanent, back-face only, MV = sum).
