<?php
/**
 * Seed 4 Commander Masters 2023 precon decklists into the dev DB.
 * Usage: php scripts/seed-precon-decks.php
 * Assigns each deck to an existing player and fetches scryfall_id for every card.
 */

$secrets = getenv('HOME') . '/auth_secrets_dev.php';
require_once $secrets;

$pdo = new PDO(
    'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
    DB_USER, DB_PASS,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

// ── Deck definitions ────────────────────────────────────────────────────────
// player_id => existing player to assign the deck to
// colors    => canonical WUBRG string
// cards     => [card_name => quantity]  (commander last so is_commander flag is easy)

$decks = [

    // ── Eldrazi Unbound (Colorless) — assigned to player 2 ──────────────────
    [
        'player_id' => 2,
        'name'      => 'Eldrazi Unbound',
        'commander' => 'Zhulodok, Void Gorger',
        'colors'    => '',
        'cards'     => [
            'Wastes' => 15,
            'War Room' => 1,
            'Blast Zone' => 1,
            'Mirrorpool' => 1,
            "Urza's Mine" => 1,
            "Urza's Tower" => 1,
            'Arch of Orazca' => 1,
            'Eldrazi Temple' => 1,
            'Tyrite Sanctum' => 1,
            'Forge of Heroes' => 1,
            'Reliquary Tower' => 1,
            "Rogue's Passage" => 1,
            "Bonders' Enclave" => 1,
            'Arcane Lighthouse' => 1,
            'Guildless Commons' => 1,
            'Mage-Ring Network' => 1,
            'Scavenger Grounds' => 1,
            'Sea Gate Wreckage' => 1,
            'Ruins of Oran-Rief' => 1,
            "Urza's Power Plant" => 1,
            'Geier Reach Sanitarium' => 1,
            'Temple of the False God' => 1,
            'Tomb of the Spirit Dragon' => 1,
            'Shrine of the Forsaken Gods' => 1,
            'Sol Ring' => 1,
            'Mind Stone' => 1,
            'Fireshrieker' => 1,
            'Mystic Forge' => 1,
            'Thran Dynamo' => 1,
            'Endless Atlas' => 1,
            'Mazemind Tome' => 1,
            'Mirage Mirror' => 1,
            'Hedron Archive' => 1,
            'Perilous Vault' => 1,
            'Thought Vessel' => 1,
            'Kaldra Compleat' => 1,
            'Worn Powerstone' => 1,
            'Unstable Obelisk' => 1,
            'Dreamstone Hedron' => 1,
            'Forsaken Monument' => 1,
            'Lightning Greaves' => 1,
            'Darksteel Monolith' => 1,
            'Everflowing Chalice' => 1,
            'Transmogrifying Wand' => 1,
            "Investigator's Journal" => 1,
            'Duplicant' => 1,
            'Endbringer' => 1,
            'Endless One' => 1,
            'Geode Golem' => 1,
            'Scaretiller' => 1,
            'Meteor Golem' => 1,
            'Palladium Myr' => 1,
            'Burnished Hart' => 1,
            'Oblivion Sower' => 1,
            'Steel Hellkite' => 1,
            'It That Betrays' => 1,
            'Matter Reshaper' => 1,
            'Abstruse Archaic' => 1,
            'Bane of Bala Ged' => 1,
            'Myriad Construct' => 1,
            'Hangarback Walker' => 1,
            'Skittering Cicada' => 1,
            'Solemn Simulacrum' => 1,
            'Stonecoil Serpent' => 1,
            'Ancient Stone Idol' => 1,
            'Artisan of Kozilek' => 1,
            'Metalwork Colossus' => 1,
            'Crashing Drawbridge' => 1,
            'Flayer of Loyalties' => 1,
            'Phyrexian Triniform' => 1,
            'Suspicious Bookcase' => 1,
            'Soul of New Phyrexia' => 1,
            'Ornithopter of Paradise' => 1,
            'Omarthis, Ghostfire Initiate' => 1,
            'Kozilek, the Great Distortion' => 1,
            'All Is Dust' => 1,
            'Rise of the Eldrazi' => 1,
            'Calamity of the Titans' => 1,
            'Warping Wail' => 1,
            "Titan's Presence" => 1,
            'Desecrate Reality' => 1,
            'Not of This World' => 1,
            'Spatial Contortion' => 1,
            "Ugin's Mastery" => 1,
            'Ugin, the Ineffable' => 1,
            'Zhulodok, Void Gorger' => 1, // commander
        ],
    ],

    // ── Enduring Enchantments (WBG) — assigned to player 3 ──────────────────
    [
        'player_id' => 3,
        'name'      => 'Enduring Enchantments',
        'commander' => 'Anikthea, Hand of Erebos',
        'colors'    => 'BGW',
        'cards'     => [
            'Swamp' => 5,
            'Forest' => 8,
            'Plains' => 6,
            'Ash Barrens' => 1,
            'Canopy Vista' => 1,
            'Krosan Verge' => 1,
            'Tainted Wood' => 1,
            'Command Tower' => 1,
            'Tainted Field' => 1,
            'Exotic Orchard' => 1,
            'Orzhov Basilica' => 1,
            'Golgari Rot Farm' => 1,
            'Sungrass Prairie' => 1,
            'Temple of Malady' => 1,
            'Temple of Plenty' => 1,
            'Fortified Village' => 1,
            'Shineshadow Snarl' => 1,
            'Temple of Silence' => 1,
            'Necroblossom Snarl' => 1,
            'Sandsteppe Citadel' => 1,
            'Selesnya Sanctuary' => 1,
            'Cast Out' => 1,
            'Abundance' => 1,
            'Grasp of Fate' => 1,
            "Mirari's Wake" => 1,
            'Felidar Retreat' => 1,
            'Omen of the Sun' => 1,
            'Cunning Rhetoric' => 1,
            'Ghoulish Impetus' => 1,
            'Omen of the Hunt' => 1,
            'Starfield of Nyx' => 1,
            'Font of Fertility' => 1,
            'The Eldest Reborn' => 1,
            'Cacophony Unleashed' => 1,
            'Dreadhorde Invasion' => 1,
            'Battle for Bretagard' => 1,
            'Binding the Old Gods' => 1,
            'Sandwurm Convergence' => 1,
            'Battle at the Helvault' => 1,
            "Enchantress's Presence" => 1,
            'Khalni Heart Expedition' => 1,
            'Boon of the Spirit Realm' => 1,
            'The Mending of Dominaria' => 1,
            'Sigil of the Empty Throne' => 1,
            'The Binding of the Titans' => 1,
            'Love Song of Night and Day' => 1,
            'Nyx Weaver' => 1,
            'Doomwake Giant' => 1,
            'Greater Tanuki' => 1,
            'Sanctum Weaver' => 1,
            'Destiny Spinner' => 1,
            'Mindwrack Harpy' => 1,
            'Satyr Enchanter' => 1,
            'Jukai Naturalist' => 1,
            'Mesa Enchantress' => 1,
            'Nessian Wanderer' => 1,
            'Nyxborn Behemoth' => 1,
            'Starfield Mystic' => 1,
            'Ondu Spiritdancer' => 1,
            'Setessan Champion' => 1,
            'Composer of Spring' => 1,
            'Courser of Kruphix' => 1,
            'Spirited Companion' => 1,
            'Eidolon of Blossoms' => 1,
            'Narci, Fable Singer' => 1,
            'Verduran Enchantress' => 1,
            'Archon of Sun\'s Grace' => 1,
            'Erebos, Bleak-Hearted' => 1,
            "Demon of Fate's Design" => 1,
            'Heliod, God of the Sun' => 1,
            'Herald of the Pantheon' => 1,
            'Sythis, Harvest\'s Hand' => 1,
            'Arasta of the Endless Web' => 1,
            'Dryad of the Ilysian Grove' => 1,
            'Farseek' => 1,
            'Culling Ritual' => 1,
            "Kodama's Reach" => 1,
            'Rampant Growth' => 1,
            'Extinguish All Hope' => 1,
            'Sol Ring' => 1,
            'Arcane Signet' => 1,
            'Path to Exile' => 1,
            'Calix, Destiny\'s Hand' => 1,
            'Anikthea, Hand of Erebos' => 1, // commander
        ],
    ],

    // ── Sliver Swarm (WUBRG) — assigned to player 4 ─────────────────────────
    [
        'player_id' => 4,
        'name'      => 'Sliver Swarm',
        'commander' => 'Sliver Gravemother',
        'colors'    => 'BGRUW',
        'cards'     => [
            'Swamp' => 2,
            'Forest' => 3,
            'Island' => 2,
            'Plains' => 2,
            'Mountain' => 2,
            'Grasslands' => 1,
            'Ash Barrens' => 1,
            'Flood Plain' => 1,
            'Canopy Vista' => 1,
            'Cinder Glade' => 1,
            'Savage Lands' => 1,
            'Command Tower' => 1,
            'Jungle Shrine' => 1,
            'Nomad Outpost' => 1,
            'Rocky Tar Pit' => 1,
            'Sunken Hollow' => 1,
            'Exotic Orchard' => 1,
            'Opulent Palace' => 1,
            'Prairie Stream' => 1,
            'Mountain Valley' => 1,
            'Seaside Citadel' => 1,
            'Frontier Bivouac' => 1,
            'Mystic Monastery' => 1,
            'Path of Ancestry' => 1,
            'Scattered Groves' => 1,
            'Smoldering Marsh' => 1,
            'Sheltered Thicket' => 1,
            'Irrigated Farmland' => 1,
            'Sandsteppe Citadel' => 1,
            'Secluded Courtyard' => 1,
            'Unclaimed Territory' => 1,
            'Blur Sliver' => 1,
            'Clot Sliver' => 1,
            'Realmwalker' => 1,
            'Blade Sliver' => 1,
            'Brood Sliver' => 1,
            'Crypt Sliver' => 1,
            'Might Sliver' => 1,
            'Quick Sliver' => 1,
            'Regal Sliver' => 1,
            'Sinew Sliver' => 1,
            'Venom Sliver' => 1,
            'Syphon Sliver' => 1,
            'Winged Sliver' => 1,
            'Gemhide Sliver' => 1,
            'Lazotep Sliver' => 1,
            'Synapse Sliver' => 1,
            'Cleaving Sliver' => 1,
            'Firewake Sliver' => 1,
            'Harmonic Sliver' => 1,
            'Hatchery Sliver' => 1,
            'Manaweft Sliver' => 1,
            'Megantic Sliver' => 1,
            'Necrotic Sliver' => 1,
            'Sentinel Sliver' => 1,
            'Shifting Sliver' => 1,
            'Sliver Hivelord' => 1,
            'Spiteful Sliver' => 1,
            'Striking Sliver' => 1,
            'Taunting Sliver' => 1,
            'Diffusion Sliver' => 1,
            'Galerider Sliver' => 1,
            'Lavabelly Sliver' => 1,
            'Bonescythe Sliver' => 1,
            'Capricious Sliver' => 1,
            'Hollowhead Sliver' => 1,
            'Titan of Littjara' => 1,
            'Two-Headed Sliver' => 1,
            'Crystalline Sliver' => 1,
            'Hibernation Sliver' => 1,
            'Bonesplitter Sliver' => 1,
            'Constricting Sliver' => 1,
            'Cloudshredder Sliver' => 1,
            'Rukarumel, Biologist' => 1,
            'Farseek' => 1,
            'Decimate' => 1,
            'Windfall' => 1,
            'Cultivate' => 1,
            'Harsh Mercy' => 1,
            'Three Visits' => 1,
            "Nature's Lore" => 1,
            'Cleansing Nova' => 1,
            'Crippling Fear' => 1,
            'Distant Melody' => 1,
            'Sol Ring' => 1,
            'Arcane Signet' => 1,
            'Fellwar Stone' => 1,
            "Herald's Horn" => 1,
            'Icon of Ancestry' => 1,
            'Pillar of Origins' => 1,
            "Vanquisher's Banner" => 1,
            "Descendants' Fury" => 1,
            'For the Ancestors' => 1,
            'Sliver Gravemother' => 1, // commander
        ],
    ],

    // ── Planeswalker Party (WUR) — assigned to player 5 ─────────────────────
    [
        'player_id' => 5,
        'name'      => 'Planeswalker Party',
        'commander' => 'Commodore Guff',
        'colors'    => 'RUW',
        'cards'     => [
            'Island' => 7,
            'Plains' => 7,
            'Mountain' => 4,
            'Port Town' => 1,
            'Mystic Gate' => 1,
            'Command Tower' => 1,
            'Cascade Bluffs' => 1,
            'Exotic Orchard' => 1,
            'Furycalm Snarl' => 1,
            "Karn's Bastion" => 1,
            'Prairie Stream' => 1,
            'Rugged Prairie' => 1,
            'Forge of Heroes' => 1,
            'Frostboil Snarl' => 1,
            'Reliquary Tower' => 1,
            'Myriad Landscape' => 1,
            'Mystic Monastery' => 1,
            'Skycloud Expanse' => 1,
            'Temple of Triumph' => 1,
            'Interplanar Beacon' => 1,
            'Mobilized District' => 1,
            'Temple of Epiphany' => 1,
            'Temple of Enlightenment' => 1,
            'Gideon Jura' => 1,
            'Jace Beleren' => 1,
            'The Wanderer' => 1,
            'Ajani Steadfast' => 1,
            'Jace, Mirror Mage' => 1,
            'Nahiri, the Harbinger' => 1,
            'Sarkhan the Masterless' => 1,
            'Chandra, Legacy of Fire' => 1,
            'Elspeth, Sun\'s Champion' => 1,
            'Narset, Parter of Veils' => 1,
            'Chandra, Awakened Inferno' => 1,
            'Narset of the Ancient Way' => 1,
            'Teyo, Geometric Tactician' => 1,
            'Vronos, Masked Inquisitor' => 1,
            'Chandra, Torch of Defiance' => 1,
            'Jace, Architect of Thought' => 1,
            'Saheeli, Sublime Artificer' => 1,
            'Fog Bank' => 1,
            'Spark Double' => 1,
            'Thrummingbird' => 1,
            'Deepglow Skate' => 1,
            'Flux Channeler' => 1,
            "Jaya's Phoenix" => 1,
            'Silent Arbiter' => 1,
            'Wall of Denial' => 1,
            'Oreskos Explorer' => 1,
            'Onakke Oathkeeper' => 1,
            "Cartographer's Hawk" => 1,
            'Grateful Apparition' => 1,
            'Mangara, the Diplomat' => 1,
            'Sparkshaper Visionary' => 1,
            'Leori, Sparktouched Hunter' => 1,
            'Narset, Enlightened Master' => 1,
            'Kazuul, Tyrant of the Cliffs' => 1,
            'Sol Ring' => 1,
            'Boros Signet' => 1,
            'Izzet Signet' => 1,
            "Norn's Annex" => 1,
            'Arcane Signet' => 1,
            'Fellwar Stone' => 1,
            'Azorius Signet' => 1,
            'The Chain Veil' => 1,
            'Gatewatch Beacon' => 1,
            'Honor-Worn Shaku' => 1,
            "Nevinyrral's Disk" => 1,
            "Wayfarer's Bauble" => 1,
            'Talisman of Progress' => 1,
            'Talisman of Conviction' => 1,
            'Talisman of Creativity' => 1,
            'Oath of Jace' => 1,
            'Oath of Gideon' => 1,
            'Oath of Teferi' => 1,
            'Path to Exile' => 1,
            "Semester's End" => 1,
            'Swords to Plowshares' => 1,
            'Guff Rewrites History' => 1,
            'Repeated Reverberation' => 1,
            'Blasphemous Act' => 1,
            'Promise of Loyalty' => 1,
            'Deploy the Gatewatch' => 1,
            "Urza's Ruinous Blast" => 1,
            'Commodore Guff' => 1, // commander
        ],
    ],
];

// ── Scryfall collection lookup ───────────────────────────────────────────────
function scryfallLookup(array $names): array {
    // Returns [name_lowercase => ['id'=>..., 'name'=>..., 'image_uris'=>...]]
    $identifiers = array_map(fn($n) => ['name' => $n], $names);
    $map = [];
    $chunks = array_chunk($identifiers, 75);

    foreach ($chunks as $chunk) {
        $payload = json_encode(['identifiers' => $chunk]);
        $ch = curl_init('https://api.scryfall.com/cards/collection');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_TIMEOUT        => 20,
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                'User-Agent: CommanderCollectorSeeder/1.0',
            ],
        ]);
        $body = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($code !== 200) {
            echo "  [WARN] Scryfall batch error $code\n";
            continue;
        }

        $data = json_decode($body, true);
        foreach ($data['data'] ?? [] as $card) {
            $imageUri = $card['image_uris']['normal']
                ?? $card['card_faces'][0]['image_uris']['normal']
                ?? null;
            $map[strtolower($card['name'])] = [
                'id'           => $card['id'],
                'name'         => $card['name'],
                'image_uri'    => $imageUri,
                'colors'       => implode('', $card['colors'] ?? []),
                'color_identity' => implode('', $card['color_identity'] ?? []),
                'type_line'    => $card['type_line'] ?? null,
                'mana_cost'    => $card['mana_cost'] ?? null,
            ];
        }

        // Log not-found
        foreach ($data['not_found'] ?? [] as $nf) {
            echo "  [NOT FOUND] " . ($nf['name'] ?? json_encode($nf)) . "\n";
        }

        usleep(100000); // 100ms between batches to respect rate limits
    }
    return $map;
}

// ── Populate scryfall_card_cache from Scryfall data ──────────────────────────
function cacheCards(PDO $pdo, array $scryfallMap): void {
    $insert = $pdo->prepare("
        INSERT INTO scryfall_card_cache
            (scryfall_id, name, image_uri, colors, color_identity, type_line, mana_cost)
        VALUES
            (:scryfall_id, :name, :image_uri, :colors, :color_identity, :type_line, :mana_cost)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            image_uri = VALUES(image_uri),
            colors = VALUES(colors),
            color_identity = VALUES(color_identity),
            type_line = VALUES(type_line),
            mana_cost = VALUES(mana_cost)
    ");
    foreach ($scryfallMap as $card) {
        $insert->execute([
            ':scryfall_id'    => $card['id'],
            ':name'           => $card['name'],
            ':image_uri'      => $card['image_uri'],
            ':colors'         => $card['colors'],
            ':color_identity' => $card['color_identity'],
            ':type_line'      => $card['type_line'],
            ':mana_cost'      => $card['mana_cost'],
        ]);
    }
}

// ── Color string → flags ────────────────────────────────────────────────────
function colorFlags(string $colors): array {
    return [
        'has_w' => (int)str_contains($colors, 'W'),
        'has_u' => (int)str_contains($colors, 'U'),
        'has_b' => (int)str_contains($colors, 'B'),
        'has_r' => (int)str_contains($colors, 'R'),
        'has_g' => (int)str_contains($colors, 'G'),
    ];
}

// ── Seed each deck ───────────────────────────────────────────────────────────
$deckInsert = $pdo->prepare("
    INSERT INTO decks (player_id, name, commander, colors, has_w, has_u, has_b, has_r, has_g)
    VALUES (:player_id, :name, :commander, :colors, :has_w, :has_u, :has_b, :has_r, :has_g)
");

$cardInsert = $pdo->prepare("
    INSERT INTO deck_cards (deck_id, scryfall_id, card_name, quantity, is_commander, is_proxy)
    VALUES (:deck_id, :scryfall_id, :card_name, :quantity, :is_commander, 0)
    ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)
");

foreach ($decks as $deck) {
    echo "\n=== {$deck['name']} (Commander: {$deck['commander']}) ===\n";

    // Collect unique card names (no quantity) for Scryfall lookup
    $uniqueNames = array_keys($deck['cards']);
    echo "  Looking up " . count($uniqueNames) . " unique card names on Scryfall…\n";
    $scryfallMap = scryfallLookup($uniqueNames);
    echo "  Resolved " . count($scryfallMap) . " cards.\n";

    // Insert deck
    $flags = colorFlags($deck['colors']);
    $deckInsert->execute([
        ':player_id' => $deck['player_id'],
        ':name'      => $deck['name'],
        ':commander' => $deck['commander'],
        ':colors'    => $deck['colors'],
        ':has_w'     => $flags['has_w'],
        ':has_u'     => $flags['has_u'],
        ':has_b'     => $flags['has_b'],
        ':has_r'     => $flags['has_r'],
        ':has_g'     => $flags['has_g'],
    ]);
    $deckId = (int)$pdo->lastInsertId();
    echo "  Inserted deck id=$deckId\n";

    // Populate scryfall_card_cache
    cacheCards($pdo, $scryfallMap);
    echo "  Cache populated.\n";

    // Insert cards
    $inserted = 0;
    foreach ($deck['cards'] as $cardName => $qty) {
        $key = strtolower($cardName);
        $isCommander = (strtolower($cardName) === strtolower($deck['commander'])) ? 1 : 0;

        $scryfallId = $scryfallMap[$key]['id'] ?? null;
        $resolvedName = $scryfallMap[$key]['name'] ?? $cardName;

        if (!$scryfallId) {
            echo "  [SKIP] No Scryfall ID for: $cardName\n";
            continue;
        }

        $cardInsert->execute([
            ':deck_id'      => $deckId,
            ':scryfall_id'  => $scryfallId,
            ':card_name'    => $resolvedName,
            ':quantity'     => $qty,
            ':is_commander' => $isCommander,
        ]);
        $inserted++;
    }
    echo "  Inserted $inserted card rows.\n";
}

echo "\nDone.\n";
