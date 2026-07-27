<?php
/**
 * Front-face card type classification.
 *
 * A DFC / MDFC type line combines both faces with " // " ("Instant // Land",
 * "Creature — Elf Druid // Land"). A card's TYPE category is its FRONT side, so we
 * classify off side 0 only — otherwise a spell with a land back (e.g. Malakir
 * Rebirth // Malakir Mire) is wrongly filed under Land. Mirrors getTypeCategory()
 * and getCategory() in apps/core (DeckFilters.tsx, DeckBreakdown.tsx).
 *
 * IMPORTANT: this is for TYPE only. Color identity is the opposite concept: it
 * spans BOTH faces (including a back face's color indicator, which grants a color
 * with no mana cost), so it must never be reduced to the front face.
 */

if (!function_exists('cardFrontFace')) {
    /** The front-face portion of a (possibly double-faced) type line: text before " // ". */
    function cardFrontFace(?string $typeLine): string {
        $tl = $typeLine ?? '';
        $pos = strpos($tl, ' // ');
        return $pos === false ? $tl : substr($tl, 0, $pos);
    }
}

if (!function_exists('isBasicLandName')) {
    /**
     * True for the basic-land names that are exempt from the Commander singleton
     * rule (a deck may hold any number). Snow-Covered variants are basics too.
     * Mirrors BASIC_LAND_NAMES in apps/core (lib/cards/mergeIntoBuffer.ts).
     */
    function isBasicLandName(string $name): bool {
        static $basics = null;
        if ($basics === null) {
            $basics = array_flip([
                'plains', 'island', 'swamp', 'mountain', 'forest', 'wastes',
                'snow-covered plains', 'snow-covered island', 'snow-covered swamp',
                'snow-covered mountain', 'snow-covered forest',
            ]);
        }
        return isset($basics[strtolower(trim($name))]);
    }
}

if (!function_exists('cardTypeCategory')) {
    /**
     * Broad type category of a card, by its FRONT face. Returns exactly one of:
     * Land, Creature, Instant, Sorcery, Enchantment, Artifact, Planeswalker, Other.
     *
     * Precedence (Land before Creature) matches the deck-analysis groupings this
     * replaces, so single-faced cards keep their existing bucket and only DFCs change.
     */
    function cardTypeCategory(?string $typeLine): string {
        $t = cardFrontFace($typeLine);
        if (str_contains($t, 'Land'))         return 'Land';
        if (str_contains($t, 'Creature'))     return 'Creature';
        if (str_contains($t, 'Instant'))      return 'Instant';
        if (str_contains($t, 'Sorcery'))      return 'Sorcery';
        if (str_contains($t, 'Enchantment'))  return 'Enchantment';
        if (str_contains($t, 'Artifact'))     return 'Artifact';
        if (str_contains($t, 'Planeswalker')) return 'Planeswalker';
        return 'Other';
    }
}
