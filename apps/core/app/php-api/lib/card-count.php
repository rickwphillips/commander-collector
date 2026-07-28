<?php
/**
 * THE card counter (PHP side).
 *
 * A row is not a card. One list_cards row can hold many copies (Island x13), so
 * count($rows) under-reports the deck: a 102-card deck stored in 82 rows reads
 * as 82. Every "how many cards" answer the coach/guru agent receives must come
 * from here, so the agent can never be handed a number that disagrees with the
 * deck page.
 *
 * Mirrors totalCardCount() in apps/core/app/lib/cards/count.ts.
 */

if (!function_exists('cardQuantityTotal')) {
    /**
     * Total cards across rows, summing copies rather than counting rows.
     *
     * @param array $rows Rows carrying a 'quantity' key (missing defaults to 1).
     */
    function cardQuantityTotal(array $rows): int {
        $total = 0;
        foreach ($rows as $row) {
            $total += (int)($row['quantity'] ?? 1);
        }
        return $total;
    }
}
