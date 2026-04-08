<?php
// 410 Gone shim — Phase 5 cleanup
//
// This endpoint was the deck_cards CRUD interface before the unified card workflow
// refactor. The deck_cards table was dropped in v5.0.0. All card storage now lives
// in list_cards via lists.deck_id. Use /lists endpoints instead:
//
//   GET    /lists?deck_id=<uuid>&role=main      — read the deck's main card list
//   POST   /lists?id=<uuid>                     — replace the list's cards
//   POST   /lists?id=<uuid>&action=attach_deck  — attach a list to a deck
//   POST   /lists?id=<uuid>&action=detach_deck  — detach a list from its deck
//
// This shim will be removed in a future release. Update callers now.

require_once __DIR__ . '/config.php';

http_response_code(410);
header('Content-Type: application/json');
header('X-Deprecated-By: lists.php');
echo json_encode([
    'error' => 'Gone',
    'code' => 'ENDPOINT_REMOVED',
    'message' => 'deck-cards.php was removed in v5.0.0. Use /lists?deck_id=<uuid>&role=main instead.',
    'replacement' => '/php-api/lists.php',
    'docs' => 'See REFACTOR-PLAN-unified-card-workflow.md for the migration map.',
]);
exit;
