<?php
/**
 * Seed 6 more Commander precon decklists into the dev DB.
 * Decks: C17 Vampiric Bloodlust, C17 Draconic Domination, C17 Arcane Wizardry,
 *        C18 Nature's Vengeance, C18 Exquisite Invention, C17 Feline Ferocity
 * Assigns one deck to each of players 2–7 (random spread).
 * Usage: php scripts/seed-more-precon-decks.php
 */

$secrets = getenv('HOME') . '/auth_secrets_dev.php';
require_once $secrets;

$pdo = new PDO(
    'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
    DB_USER, DB_PASS,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

$decks = [

    // ── Vampiric Bloodlust (WBR) — C17 — player 2 ───────────────────────────
    [
        'player_id' => 2,
        'name'      => 'Vampiric Bloodlust',
        'commander' => 'Edgar Markov',
        'colors'    => 'BRW',
        'cards'     => [
            'Plains' => 4,
            'Swamp'  => 8,
            'Mountain' => 4,
            'Arid Mesa' => 1,
            'Blood Crypt' => 1,
            'Bloodstained Mire' => 1,
            'Bojuka Bog' => 1,
            'Command Tower' => 1,
            'Concealed Courtyard' => 1,
            'Crackling Doom' => 1,
            'Exotic Orchard' => 1,
            'Fetid Heath' => 1,
            'Graven Cairns' => 1,
            'Hanweir Battlements' => 1,
            "Haunted Fengraf" => 1,
            'Lavaclaw Reaches' => 1,
            'Maze of Ith' => 1,
            'Nomad Outpost' => 1,
            'Path of Ancestry' => 1,
            'Rakdos Carnarium' => 1,
            'Savage Lands' => 1,
            'Shadowblood Ridge' => 1,
            'Temple of Malice' => 1,
            'Temple of Silence' => 1,
            'Temple of the False God' => 1,
            'Urborg, Tomb of Yawgmoth' => 1,
            'Sol Ring' => 1,
            'Arcane Signet' => 1,
            'Boros Signet' => 1,
            'Rakdos Signet' => 1,
            'Orzhov Signet' => 1,
            'Loxodon Warhammer' => 1,
            'Mirror Entity' => 1,
            'Phyrexian Reclamation' => 1,
            'Strionic Resonator' => 1,
            'Swiftfoot Boots' => 1,
            'Lightning Greaves' => 1,
            'Stensia Masquerade' => 1,
            'Teferi\'s Protection' => 1,
            'Decree of Pain' => 1,
            'Malaria' => 1,
            'Patriarch\'s Bidding' => 1,
            'Olivia Voldaren' => 1,
            'Bloodlord of Vaasgoth' => 1,
            'Anowon, the Ruin Sage' => 1,
            'Captivating Vampire' => 1,
            'Champion of Dusk' => 1,
            'Drana, Liberator of Malakir' => 1,
            'Falkenrath Aristocrat' => 1,
            'Falkenrath Gorger' => 1,
            'Iroas, God of Victory' => 1,
            'Kalitas, Traitor of Ghet' => 1,
            'Licia, Sanguine Tribune' => 1,
            'Malakir Bloodwitch' => 1,
            'Marchesa, the Black Rose' => 1,
            'Mathas, Fiend Seeker' => 1,
            'Nirkana Revenant' => 1,
            'Olivia, Mobilized for War' => 1,
            'Patron of the Vein' => 1,
            'Rakish Heir' => 1,
            'Sangromancer' => 1,
            'Skeletal Vampire' => 1,
            'Shadow Alley Denizen' => 1,
            'Stromkirk Captain' => 1,
            'Stromkirk Condemned' => 1,
            'Tithe Taker' => 1,
            'Twilight Prophet' => 1,
            'Vish Kal, Blood Arbiter' => 1,
            'Vampire Nocturnus' => 1,
            'Butcher of Malakir' => 1,
            'New Blood' => 1,
            'Aggravate' => 1,
            'Kindred Boon' => 1,
            'Shared Animosity' => 1,
            'Bloodchief Ascension' => 1,
            'Sanguine Bond' => 1,
            'Curse of Disturbance' => 1,
            'Curse of Vitality' => 1,
            'Curse of Opulence' => 1,
            'Call the Bloodline' => 1,
            'Kheru Mind-Eater' => 1,
            'Havoc Festival' => 1,
            'Edgar Markov' => 1, // commander
        ],
    ],

    // ── Draconic Domination (WUBRG) — C17 — player 3 ────────────────────────
    [
        'player_id' => 3,
        'name'      => 'Draconic Domination',
        'commander' => 'The Ur-Dragon',
        'colors'    => 'BGRUW',
        'cards'     => [
            'Swamp' => 2,
            'Forest' => 2,
            'Island' => 2,
            'Plains' => 2,
            'Mountain' => 2,
            'Arid Mesa' => 1,
            'Badlands' => 1,
            'Blood Crypt' => 1,
            'Bloodstained Mire' => 1,
            'Breeding Pool' => 1,
            'Command Tower' => 1,
            'Crumbling Necropolis' => 1,
            'Exotic Orchard' => 1,
            'Jungle Shrine' => 1,
            'Mystic Monastery' => 1,
            'Nomad Outpost' => 1,
            'Opulent Palace' => 1,
            'Path of Ancestry' => 1,
            'Plateau' => 1,
            'Rupture Spire' => 1,
            'Savage Lands' => 1,
            'Seaside Citadel' => 1,
            'Temple of the False God' => 1,
            'Transguild Promenade' => 1,
            'Sol Ring' => 1,
            'Arcane Signet' => 1,
            'Fellwar Stone' => 1,
            'Chromatic Lantern' => 1,
            'Door of Destinies' => 1,
            'Dragonlord\'s Servant' => 1,
            'Dragonspeaker Shaman' => 1,
            'Temur Ascendancy' => 1,
            'Kindred Discovery' => 1,
            'Sarkhan Unbroken' => 1,
            'Crux of Fate' => 1,
            'Swords to Plowshares' => 1,
            'Cultivate' => 1,
            "Kodama's Reach" => 1,
            'Farseek' => 1,
            'Explosive Vegetation' => 1,
            'Mirari\'s Wake' => 1,
            'Boneyard Scourge' => 1,
            'Hellkite Tyrant' => 1,
            'Ramos, Dragon Engine' => 1,
            'Scalelord Reckoner' => 1,
            'Taigam, Ojutai Master' => 1,
            'Wasitora, Nekoru Queen' => 1,
            'Aether Charge' => 1,
            'Avaricious Dragon' => 1,
            'Bladewing the Risen' => 1,
            'Boltwing Marauder' => 1,
            'Broodmate Dragon' => 1,
            'Charnelhoard Wurm' => 1,
            'Chromium' => 1,
            'Dragon Broodmother' => 1,
            'Dragonlord Atarka' => 1,
            'Dragonlord Dromoka' => 1,
            'Dragonlord Kolaghan' => 1,
            'Dragonlord Ojutai' => 1,
            'Dragonlord Silumgar' => 1,
            'Eternal Dragon' => 1,
            'Karrthus, Tyrant of Jund' => 1,
            'Lathliss, Dragon Queen' => 1,
            'Mana-Charged Dragon' => 1,
            'Nicol Bolas' => 1,
            'O-Kagachi, Vengeful Kami' => 1,
            'Ojutai, Soul of Winter' => 1,
            'Palladia-Mors' => 1,
            'Scion of the Ur-Dragon' => 1,
            'Silumgar, the Drifting Death' => 1,
            'Steel Hellkite' => 1,
            'Stormbreath Dragon' => 1,
            'Sunscorch Regent' => 1,
            'Utvara Hellkite' => 1,
            'Vaevictis Asmadi' => 1,
            'Vorosh, the Hunter' => 1,
            'Skyshroud Claim' => 1,
            'Tempt with Discovery' => 1,
            'Path to Exile' => 1,
            'Kindred Summons' => 1,
            'Kess, Dissident Mage' => 1,
            'The Ur-Dragon' => 1, // commander
        ],
    ],

    // ── Arcane Wizardry (UBR) — C17 — player 4 ──────────────────────────────
    [
        'player_id' => 4,
        'name'      => 'Arcane Wizardry',
        'commander' => 'Inalla, Archmage Ritualist',
        'colors'    => 'BRU',
        'cards'     => [
            'Island' => 7,
            'Swamp' => 5,
            'Mountain' => 4,
            'Command Tower' => 1,
            'Crumbling Necropolis' => 1,
            'Exotic Orchard' => 1,
            'Izzet Boilerworks' => 1,
            'Nephalia Drownyard' => 1,
            'Path of Ancestry' => 1,
            'Rakdos Carnarium' => 1,
            'Sulfur Falls' => 1,
            'Temple of Deceit' => 1,
            'Temple of Epiphany' => 1,
            'Temple of Malice' => 1,
            'Temple of the False God' => 1,
            'Underground River' => 1,
            'Sol Ring' => 1,
            'Arcane Signet' => 1,
            'Dimir Signet' => 1,
            'Izzet Signet' => 1,
            'Rakdos Signet' => 1,
            'Thought Vessel' => 1,
            'Ashnod\'s Altar' => 1,
            'Kindred Dominance' => 1,
            'Patriarch\'s Bidding' => 1,
            'Scourge of Fleets' => 1,
            'Ghostly Flicker' => 1,
            'Rite of Replication' => 1,
            'Spelltwine' => 1,
            'Temporal Mastery' => 1,
            'Time Warp' => 1,
            'Cyclonic Rift' => 1,
            'Chaos Warp' => 1,
            'Merchant Scroll' => 1,
            'Ponder' => 1,
            'Brainstorm' => 1,
            'Counterspell' => 1,
            'Swiftfoot Boots' => 1,
            'Lightning Greaves' => 1,
            'Galecaster Colossus' => 1,
            'Kess, Dissident Mage' => 1,
            'Mairsil, the Pretender' => 1,
            'Arcanis the Omnipotent' => 1,
            'Body Double' => 1,
            'Burnished Hart' => 1,
            'Clever Impersonator' => 1,
            'Dualcaster Mage' => 1,
            'Etherium-Horn Sorcerer' => 1,
            'Fatespinner' => 1,
            'Glen Elendra Archmage' => 1,
            'Izzet Chemister' => 1,
            'Jace\'s Archivist' => 1,
            'Magus of the Mind' => 1,
            'Marchesa, the Black Rose' => 1,
            'Naru Meha, Master Wizard' => 1,
            'Nin, the Pain Artist' => 1,
            'Portal Mage' => 1,
            'Puppeteer Clique' => 1,
            'Reanimate' => 1,
            'Snapcaster Mage' => 1,
            'Taigam, Sidisi\'s Hand' => 1,
            'Temporal Adept' => 1,
            'Trinket Mage' => 1,
            'Trophy Mage' => 1,
            'Vindictive Lich' => 1,
            'Voidmage Prodigy' => 1,
            'Wanderwine Prophets' => 1,
            'Windfall' => 1,
            'Whir of Invention' => 1,
            'Azami, Lady of Scrolls' => 1,
            'Havengul Lich' => 1,
            'Talrand, Sky Summoner' => 1,
            'Vedalken AEthermage' => 1,
            'Apprentice Wizard' => 1,
            'Serendib Sorcerer' => 1,
            'Inalla, Archmage Ritualist' => 1, // commander
        ],
    ],

    // ── Nature's Vengeance (BRG) — C18 — player 5 ───────────────────────────
    [
        'player_id' => 5,
        'name'      => "Nature's Vengeance",
        'commander' => 'Lord Windgrace',
        'colors'    => 'BGR',
        'cards'     => [
            'Swamp' => 6,
            'Forest' => 7,
            'Mountain' => 5,
            'Ash Barrens' => 1,
            'Bojuka Bog' => 1,
            'Command Tower' => 1,
            'Exotic Orchard' => 1,
            'Golgari Rot Farm' => 1,
            'Gruul Turf' => 1,
            'Jund Panorama' => 1,
            'Kessig Wolf Run' => 1,
            'Lavaclaw Reaches' => 1,
            'Mosswort Bridge' => 1,
            'Overgrown Tomb' => 1,
            'Rakdos Carnarium' => 1,
            'Rith\'s Grove' => 1,
            'Savage Lands' => 1,
            'Sheltered Thicket' => 1,
            'Stomping Ground' => 1,
            'Temple of Abandon' => 1,
            'Temple of Malady' => 1,
            'Temple of the False God' => 1,
            "Urza's Mine" => 1,
            "Urza's Power Plant" => 1,
            "Urza's Tower" => 1,
            'Sol Ring' => 1,
            'Arcane Signet' => 1,
            'Golgari Signet' => 1,
            'Gruul Signet' => 1,
            'Rakdos Signet' => 1,
            'Tempt with Discovery' => 1,
            'Harrow' => 1,
            'Cultivate' => 1,
            "Kodama's Reach" => 1,
            'Skyshroud Claim' => 1,
            'Life from the Loam' => 1,
            'Splendid Reclamation' => 1,
            'Boundless Realms' => 1,
            'Gitrog Monster' => 1,
            'Azusa, Lost but Seeking' => 1,
            'Ancient Greenwarden' => 1,
            'Omnath, Locus of Rage' => 1,
            'Titania, Protector of Argoth' => 1,
            'Borborygmos Enraged' => 1,
            'World Shaper' => 1,
            'Multani, Yavimaya\'s Avatar' => 1,
            'Angry Mob' => 1,
            'Baloth Null' => 1,
            'Centaur Vinecrasher' => 1,
            'Dragonmaster Outcast' => 1,
            'Embodiment of Fury' => 1,
            'Embodiment of Spring' => 1,
            'Fury of the Horde' => 1,
            'Ghost of Ramirez DePietro' => 1,
            'Igneous Pouncer' => 1,
            'Liege of the Tangle' => 1,
            'Malignant Growth' => 1,
            'Mina and Denn, Wildborn' => 1,
            'Ob Nixilis, the Fallen' => 1,
            'Ramunap Excavator' => 1,
            'Rampaging Baloths' => 1,
            'Squandered Resources' => 1,
            'Undergrowth Champion' => 1,
            'Wayward Swordtooth' => 1,
            'Worm Harvest' => 1,
            'Zuran Orb' => 1,
            'Devastating Dreams' => 1,
            'From the Ashes' => 1,
            'Tempt with Vengeance' => 1,
            'Constant Mists' => 1,
            'Ruination' => 1,
            'Restore' => 1,
            'Creeping Mold' => 1,
            'Curse of Predation' => 1,
            'Curse of Chaos' => 1,
            'Curse of Vengeance' => 1,
            'Amulet of Vigor' => 1,
            'Retreat to Hagra' => 1,
            'Retreat to Kazandu' => 1,
            'Lord Windgrace' => 1, // commander
        ],
    ],

    // ── Exquisite Invention (UR) — C18 — player 6 ───────────────────────────
    [
        'player_id' => 6,
        'name'      => 'Exquisite Invention',
        'commander' => 'Brudiclad, Telchor Engineer',
        'colors'    => 'RU',
        'cards'     => [
            'Island' => 12,
            'Mountain' => 8,
            'Command Tower' => 1,
            'Exotic Orchard' => 1,
            'Izzet Boilerworks' => 1,
            'Myriad Landscape' => 1,
            'Reliquary Tower' => 1,
            'Rupture Spire' => 1,
            'Steam Vents' => 1,
            'Sulfur Falls' => 1,
            'Temple of Epiphany' => 1,
            'Temple of the False God' => 1,
            'Tolaria West' => 1,
            'Sol Ring' => 1,
            'Arcane Signet' => 1,
            'Darksteel Ingot' => 1,
            'Izzet Signet' => 1,
            'Thought Vessel' => 1,
            'Talisman of Creativity' => 1,
            'Commander\'s Sphere' => 1,
            'Conjurer\'s Closet' => 1,
            'Mirage Mirror' => 1,
            'Prototype Portal' => 1,
            'Sculpting Steel' => 1,
            'Swiftfoot Boots' => 1,
            'Lightning Greaves' => 1,
            'Counterspell' => 1,
            'Cyclonic Rift' => 1,
            'Ghostly Flicker' => 1,
            'Phyrexian Metamorph' => 1,
            'Rite of Replication' => 1,
            'Saheeli\'s Artistry' => 1,
            'Thirst for Knowledge' => 1,
            'Whir of Invention' => 1,
            'Windfall' => 1,
            'Chaos Warp' => 1,
            'Fact or Fiction' => 1,
            'Stolen Identity' => 1,
            'Blinkmoth Urn' => 1,
            'Geode Golem' => 1,
            'Hellkite Igniter' => 1,
            'Jhoira, Weatherlight Captain' => 1,
            'Jhoira\'s Familiar' => 1,
            'Jor Kadeen, the Prevailer' => 1,
            'Myr Battlesphere' => 1,
            'Myr Propagator' => 1,
            'Myr Retriever' => 1,
            'Myr Turbine' => 1,
            'Palladium Myr' => 1,
            'Saheeli, the Gifted' => 1,
            'Scuttling Doom Engine' => 1,
            'Sharding Sphinx' => 1,
            'Soul of New Phyrexia' => 1,
            'Steel Hellkite' => 1,
            'Thopter Assembly' => 1,
            'Thopter Spy Network' => 1,
            'Thousand-Year Storm' => 1,
            'Vedalken Archmage' => 1,
            'Whirler Rogue' => 1,
            'Wild-Field Scarecrow' => 1,
            'Altar of the Brood' => 1,
            'Chief Engineer' => 1,
            'Coretapper' => 1,
            'Decoction Module' => 1,
            'Duplicant' => 1,
            'Epochrasite' => 1,
            'Fabrication Module' => 1,
            'Feldon of the Third Path' => 1,
            'Foundry Inspector' => 1,
            'Goblin Welder' => 1,
            'Hangarback Walker' => 1,
            'Master of Etherium' => 1,
            'Metalwork Colossus' => 1,
            'Padeem, Consul of Innovation' => 1,
            'Precursor Golem' => 1,
            'Brudiclad, Telchor Engineer' => 1, // commander
        ],
    ],

    // ── Feline Ferocity (WG) — C17 — player 7 ───────────────────────────────
    [
        'player_id' => 7,
        'name'      => 'Feline Ferocity',
        'commander' => 'Arahbo, Roar of the World',
        'colors'    => 'GW',
        'cards'     => [
            'Forest' => 11,
            'Plains' => 9,
            'Ash Barrens' => 1,
            'Canopy Vista' => 1,
            'Command Tower' => 1,
            'Exotic Orchard' => 1,
            'Fortified Village' => 1,
            'Gavony Township' => 1,
            'Krosan Verge' => 1,
            'Path of Ancestry' => 1,
            'Scattered Groves' => 1,
            'Selesnya Sanctuary' => 1,
            'Sunpetal Grove' => 1,
            'Temple of Plenty' => 1,
            'Temple of the False God' => 1,
            'Wirewood Lodge' => 1,
            'Sol Ring' => 1,
            'Arcane Signet' => 1,
            'Selesnya Signet' => 1,
            'Talisman of Unity' => 1,
            'Beastmaster Ascension' => 1,
            'Coat of Arms' => 1,
            'Door of Destinies' => 1,
            'Kindred Summons' => 1,
            'Steely Resolve' => 1,
            'Sylvan Library' => 1,
            'Mirari\'s Wake' => 1,
            'Path to Exile' => 1,
            'Swords to Plowshares' => 1,
            'Cultivate' => 1,
            "Kodama's Reach" => 1,
            'Skyshroud Claim' => 1,
            'Tempt with Discovery' => 1,
            'Swiftfoot Boots' => 1,
            'Lightning Greaves' => 1,
            'Hunter\'s Prowess' => 1,
            'Unified Strike' => 1,
            'Ajani\'s Sunstriker' => 1,
            'Alms Collector' => 1,
            'Balan, Wandering Knight' => 1,
            'Brimaz, King of Oreskos' => 1,
            'Caracal' => 1,
            'Chameleon Colossus' => 1,
            'Changeling Hero' => 1,
            'Changeling Titan' => 1,
            'Fleecemane Lion' => 1,
            'Jazal Goldmane' => 1,
            'Jedit Ojanen of Efrava' => 1,
            'Kemba, Kha Regent' => 1,
            'Leonin Abunas' => 1,
            'Leonin Arbiter' => 1,
            'Leonin Battlemage' => 1,
            'Leonin Elder' => 1,
            'Leonin Relic-Warder' => 1,
            'Leonin Shikari' => 1,
            'Leonin Sun Standard' => 1,
            'Lost Leonin' => 1,
            'Mirri, Cat Warrior' => 1,
            'Mirri, Weatherlight Duelist' => 1,
            'Nazahn, Revered Bladesmith' => 1,
            'Oreskos Explorer' => 1,
            'Pride of Lions' => 1,
            'Pride Sovereign' => 1,
            'Prowling Serpopard' => 1,
            'Sacred Cat' => 1,
            'Silverblade Paladin' => 1,
            'Skyhunter Skirmisher' => 1,
            'Stalking Leonin' => 1,
            'Sunspear Shikari' => 1,
            'Temur Sabertooth' => 1,
            'Trained Caracal' => 1,
            'White Sun\'s Zenith' => 1,
            'Hungry Lynx' => 1,
            'Jareth, Leonine Titan' => 1,
            'Qasali Pridemage' => 1,
            'Curse of Bounty' => 1,
            'Curse of Vitality' => 1,
            'Arahbo, Roar of the World' => 1, // commander
        ],
    ],

];

// ── Scryfall collection lookup ───────────────────────────────────────────────
function scryfallLookup(array $names): array {
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
                'id'             => $card['id'],
                'name'           => $card['name'],
                'image_uri'      => $imageUri,
                'colors'         => implode('', $card['colors'] ?? []),
                'color_identity' => implode('', $card['color_identity'] ?? []),
                'type_line'      => $card['type_line'] ?? null,
                'mana_cost'      => $card['mana_cost'] ?? null,
            ];
        }

        foreach ($data['not_found'] ?? [] as $nf) {
            echo "  [NOT FOUND] " . ($nf['name'] ?? json_encode($nf)) . "\n";
        }

        usleep(100000);
    }
    return $map;
}

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

function colorFlags(string $colors): array {
    return [
        'has_w' => (int)str_contains($colors, 'W'),
        'has_u' => (int)str_contains($colors, 'U'),
        'has_b' => (int)str_contains($colors, 'B'),
        'has_r' => (int)str_contains($colors, 'R'),
        'has_g' => (int)str_contains($colors, 'G'),
    ];
}

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
    echo "\n=== {$deck['name']} (Commander: {$deck['commander']}) → player {$deck['player_id']} ===\n";

    $uniqueNames = array_keys($deck['cards']);
    echo "  Looking up " . count($uniqueNames) . " unique card names on Scryfall…\n";
    $scryfallMap = scryfallLookup($uniqueNames);
    echo "  Resolved " . count($scryfallMap) . " cards.\n";

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

    cacheCards($pdo, $scryfallMap);
    echo "  Cache populated.\n";

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
