<?php
/**
 * Seed decklists for decks 25-32 (OTJ Commander, MKM Commander, Fallout Commander).
 * Decks already exist in the DB — this script only populates deck_cards.
 *
 * Usage: php scripts/seed-otj-mkm-fallout-decks.php
 *
 * Decks:
 *   25 — Most Wanted        (Olivia, Opulent Outlaw)    OTJ WBR
 *   26 — Desert Bloom       (Yuma, Proud Protector)     OTJ WRG
 *   27 — Quick Draw         (Stella Lee, Wild Card)     OTJ UR
 *   28 — Grand Larceny      (Gonti, Canny Acquisitor)   OTJ UB
 *   29 — Blame Game         (Alquist Proft, Master Sleuth) MKM WU
 *   30 — Strange Omens      (Marchesa, Dealer of Death) MKM UBR
 *   31 — Hail Caesar        (Caesar, Legion's Emperor)  MKM WBR
 *   32 — Mutant Menace      (The Wise Mothman)          Fallout UBG
 */

$secrets = getenv('HOME') . '/auth_secrets_dev.php';
require_once $secrets;

$pdo = new PDO(
    'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
    DB_USER, DB_PASS,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

// ── Deck card definitions ────────────────────────────────────────────────────
// deck_id => ['commander' => name, 'cards' => [card_name => qty]]

$decks = [

    // ── 25: Most Wanted (Olivia, Opulent Outlaw) — OTJ Commander WBR ─────────
    25 => [
        'name'      => 'Most Wanted',
        'commander' => 'Olivia, Opulent Outlaw',
        'cards'     => [
            'Swamp'                        => 5,
            'Plains'                       => 2,
            'Mountain'                     => 4,
            'Shadowblood Ridge'            => 1,
            'Concealed Courtyard'          => 1,
            'Inspiring Vantage'            => 1,
            'Command Tower'                => 1,
            'Clifftop Retreat'             => 1,
            'Nomad Outpost'                => 1,
            'Exotic Orchard'               => 1,
            'Bloodfell Caves'              => 1,
            'Scoured Barrens'              => 1,
            'Wind-Scarred Crag'            => 1,
            'Rocky Tar Pit'                => 1,
            'Sulfurous Springs'            => 1,
            'Tainted Peak'                 => 1,
            'Foreboding Ruins'             => 1,
            'Shineshadow Snarl'            => 1,
            'Luxury Suite'                 => 1,
            'Sundown Pass'                 => 1,
            'Needleverge Pathway'          => 1,
            'Urborg, Tomb of Yawgmoth'     => 1,
            'Sol Ring'                     => 1,
            'Arcane Signet'                => 1,
            'Fellwar Stone'                => 1,
            'Mardu Banner'                 => 1,
            'Talisman of Indulgence'       => 1,
            'Talisman of Conviction'       => 1,
            'Talisman of Hierarchy'        => 1,
            'Wayfarer\'s Bauble'           => 1,
            'Worn Powerstone'              => 1,
            'Mind Stone'                   => 1,
            'Orzhov Signet'                => 1,
            'Rakdos Signet'                => 1,
            'Boros Signet'                 => 1,
            'Blood Money'                  => 1,
            'Blasphemous Act'              => 1,
            'Vanquish the Horde'           => 1,
            'Path to Exile'                => 1,
            'Swords to Plowshares'         => 1,
            'Anguished Unmaking'           => 1,
            'Generous Gift'                => 1,
            'Chaos Warp'                   => 1,
            'Vandalblast'                  => 1,
            'Dire Fleet Daredevil'         => 1,
            'Captivating Crew'             => 1,
            'Brutal Cathar'                => 1,
            'Hellrider'                    => 1,
            'Professional Face-Breaker'    => 1,
            'Goldnight Redeemer'           => 1,
            'Etali, Primal Conqueror'      => 1,
            'Reckless Crew'                => 1,
            'Gonti, Lord of Luxury'        => 1,
            'Grenzo, Dungeon Warden'       => 1,
            'Goro-Goro and Satoru'         => 1,
            'Karazikar, the Eye Tyrant'    => 1,
            'Magda, Brazen Outlaw'         => 1,
            'Zara, Renegade Recruiter'     => 1,
            'Dockside Extortionist'        => 1,
            'Inspiring Refrain'            => 1,
            'Smuggler\'s Share'            => 1,
            'Hellish Rebuke'               => 1,
            'Whip of Erebos'               => 1,
            'Sword of Hearth and Home'     => 1,
            'Sword of the Animist'         => 1,
            'Sword of Feast and Famine'    => 1,
            'Rogue\'s Passage'             => 1,
            'Vault of the Archangel'       => 1,
            'Shattered Sanctum'            => 1,
            'Cabaretti Courtyard'          => 1,
            'Deserted Beach'               => 1,
            'Haunted Ridge'                => 1,
            'Stormcarved Coast'            => 1,
            'Olivia, Opulent Outlaw'       => 1, // commander
        ],
    ],

    // ── 26: Desert Bloom (Yuma, Proud Protector) — OTJ Commander WRG ─────────
    26 => [
        'name'      => 'Desert Bloom',
        'commander' => 'Yuma, Proud Protector',
        'cards'     => [
            'Forest'                       => 4,
            'Plains'                       => 4,
            'Mountain'                     => 2,
            'Scattered Groves'             => 1,
            'Sheltered Thicket'            => 1,
            'Sunpetal Grove'               => 1,
            'Canopy Vista'                 => 1,
            'Cinder Glade'                 => 1,
            'Command Tower'                => 1,
            'Jungle Shrine'                => 1,
            'Exotic Orchard'               => 1,
            'Wind-Scarred Crag'            => 1,
            'Blossoming Sands'             => 1,
            'Graypelt Refuge'              => 1,
            'Rugged Highlands'             => 1,
            'Krosan Verge'                 => 1,
            'Ash Barrens'                  => 1,
            'Boros Garrison'               => 1,
            'Selesnya Sanctuary'           => 1,
            'Gruul Turf'                   => 1,
            'Myriad Landscape'             => 1,
            'Shefet Dunes'                 => 1,
            'Hashep Oasis'                 => 1,
            'Dunes of the Dead'            => 1,
            'Sunscorched Desert'           => 1,
            'Painted Bluffs'               => 1,
            'Desert of the Fervent'        => 1,
            'Desert of the Indomitable'    => 1,
            'Desert of the True'           => 1,
            'Sol Ring'                     => 1,
            'Arcane Signet'                => 1,
            'Fellwar Stone'                => 1,
            "Kodama's Reach"                => 1,
            'Talisman of Unity'            => 1,
            'Talisman of Impulse'          => 1,
            'Talisman of Conviction'       => 1,
            'Rampant Growth'               => 1,
            'Cultivate'                    => 1,
            "Kodama's Reach"               => 1,
            'Three Visits'                 => 1,
            "Nature's Lore"                => 1,
            'Life from the Loam'           => 1,
            'Splendid Reclamation'         => 1,
            'Hour of Promise'              => 1,
            'Warden of the Eye'            => 1,
            'Retreat to Kazandu'           => 1,
            'Zendikar\'s Roil'             => 1,
            'Emeria Shepherd'              => 1,
            'Springbloom Druid'            => 1,
            'Tireless Tracker'             => 1,
            'World Shaper'                 => 1,
            'Ramunap Excavator'            => 1,
            'Dune Chanter'                 => 1,
            'Solphim, Mayhem Dominus'      => 1,
            'Tunneling Geopede'            => 1,
            'Omnath, Locus of Rage'        => 1,
            'Hazezon, Shaper of Sand'      => 1,
            'Ruin Grinder'                 => 1,
            'Scute Swarm'                  => 1,
            'Liesa, Forgotten Archangel'   => 1,
            'Pia Nalaar'                   => 1,
            'Ruin Ghost'                   => 1,
            'Wayward Guide-Beast'          => 1,
            'Lotus Cobra'                  => 1,
            'Generous Visitor'             => 1,
            'Wrenn and Seven'              => 1,
            'Swords to Plowshares'         => 1,
            'Path to Exile'                => 1,
            'Beast Within'                 => 1,
            'Generous Gift'                => 1,
            'Sunblast Angel'               => 1,
            'Nahiri, the Lithomancer'      => 1,
            'Dragonmaster Outcast'         => 1,
            'Fierce Empath'                => 1,
            'Yuma, Proud Protector'        => 1, // commander
        ],
    ],

    // ── 27: Quick Draw (Stella Lee, Wild Card) — OTJ Commander UR ────────────
    27 => [
        'name'      => 'Quick Draw',
        'commander' => 'Stella Lee, Wild Card',
        'cards'     => [
            'Island'                       => 10,
            'Mountain'                     => 9,
            'Izzet Boilerworks'            => 1,
            'Command Tower'                => 1,
            'Exotic Orchard'               => 1,
            'Shivan Reef'                  => 1,
            'Volatile Fjord'               => 1,
            'Highland Lake'                => 1,
            'Swiftwater Cliffs'            => 1,
            'Sulfur Falls'                 => 1,
            'Training Center'              => 1,
            'Steam Vents'                  => 1,
            'Sol Ring'                     => 1,
            'Arcane Signet'                => 1,
            'Fellwar Stone'                => 1,
            'Izzet Signet'                 => 1,
            'Talisman of Creativity'       => 1,
            'Thought Vessel'               => 1,
            'Mind Stone'                   => 1,
            'Worn Powerstone'              => 1,
            'Aetherflux Reservoir'         => 1,
            'Grapeshot'                    => 1,
            'Guttersnipe'                  => 1,
            'Electrostatic Field'          => 1,
            'Thermo-Alchemist'             => 1,
            'Aria of Flame'                => 1,
            'Young Pyromancer'             => 1,
            'Rionya, Fire Dancer'          => 1,
            'Ral, Storm Conduit'           => 1,
            'Niv-Mizzet, Parun'            => 1,
            'Niv-Mizzet, the Firemind'     => 1,
            'Crackling Drake'              => 1,
            'Talrand, Sky Summoner'        => 1,
            'Murmuring Mystic'             => 1,
            'Riddleform'                   => 1,
            'Stormchaser Drake'            => 1,
            'Rootha, Mercurial Artist'     => 1,
            'Veyran, Voice of Duality'     => 1,
            'Lier, Disciple of the Drowned' => 1,
            'Haughty Djinn'                => 1,
            'Baral, Chief of Compliance'   => 1,
            'Mizzix of the Izmagnus'       => 1,
            'Pore Over the Pages'          => 1,
            'Seize the Spoils'             => 1,
            'Creative Technique'           => 1,
            'Treasure Cruise'              => 1,
            'Dig Through Time'             => 1,
            'Magma Opus'                   => 1,
            'Jeska\'s Will'                => 1,
            'Bonus Round'                  => 1,
            'Repeated Reverberation'       => 1,
            'Thousand-Year Storm'          => 1,
            'Double Vision'                => 1,
            'Swarm Intelligence'           => 1,
            'Quiet Speculation'            => 1,
            'Mission Briefing'             => 1,
            'Snap'                         => 1,
            'Brainstorm'                   => 1,
            'Ponder'                       => 1,
            'Preordain'                    => 1,
            'Lightning Bolt'               => 1,
            'Shock'                        => 1,
            'Opt'                          => 1,
            'Chart a Course'               => 1,
            'Consider'                     => 1,
            'Impulse'                      => 1,
            'Fire Prophecy'                => 1,
            'Fiery Confluence'             => 1,
            'Mizzium Mortars'              => 1,
            'Counterspell'                 => 1,
            'Arcane Denial'                => 1,
            'Swan Song'                    => 1,
            'Stella Lee, Wild Card'        => 1, // commander
        ],
    ],

    // ── 28: Grand Larceny (Gonti, Canny Acquisitor) — OTJ Commander UB ───────
    28 => [
        'name'      => 'Grand Larceny',
        'commander' => 'Gonti, Canny Acquisitor',
        'cards'     => [
            'Swamp'                        => 7,
            'Island'                       => 8,
            'Dimir Aqueduct'               => 1,
            'Command Tower'                => 1,
            'Exotic Orchard'               => 1,
            'Sunken Hollow'                => 1,
            'Dismal Backwater'             => 1,
            'Jwar Isle Refuge'             => 1,
            'Underground River'            => 1,
            'Temple of Deceit'             => 1,
            'Watery Grave'                 => 1,
            'Sol Ring'                     => 1,
            'Arcane Signet'                => 1,
            'Fellwar Stone'                => 1,
            'Dimir Signet'                 => 1,
            'Talisman of Dominance'        => 1,
            'Thought Vessel'               => 1,
            'Mind Stone'                   => 1,
            'Worn Powerstone'              => 1,
            'Swiftfoot Boots'              => 1,
            'Lightning Greaves'            => 1,
            'Strionic Resonator'           => 1,
            'Helm of the Host'             => 1,
            'Lithoform Engine'             => 1,
            'Dauthi Voidwalker'            => 1,
            'Havengul Lich'                => 1,
            'Hostage Taker'                => 1,
            'Gonti, Lord of Luxury'        => 1,
            'Etrata, the Silencer'         => 1,
            'Zariel, Archduke of Avernus'  => 1,
            'Gonti, Lord of Luxury'     => 1,
            'Hullbreacher'                 => 1,
            'Notion Thief'                 => 1,
            'Sheoldred, Whispering One'    => 1,
            'Whispering Madness'           => 1,
            'Thada Adel, Acquisitor'       => 1,
            'Bribery'                      => 1,
            'Acquire'                      => 1,
            'Steal Enchantment'            => 1,
            'Treachery'                    => 1,
            'Callous Oppressor'            => 1,
            'Control Magic'                => 1,
            'Expropriate'                  => 1,
            'Siphon Insight'               => 1,
            'Insight'                      => 1,
            'Praetor\'s Grasp'             => 1,
            'Knowledge Exploitation'       => 1,
            'Nightveil Specter'            => 1,
            'Eyes Everywhere'              => 1,
            'Mind Flayer'                  => 1,
            'Thief of Sanity'              => 1,
            'Drowned Secrets'              => 1,
            'Extract from Darkness'        => 1,
            'Rise of the Dark Realms'      => 1,
            'Dire Fleet Ravager'           => 1,
            'Read the Bones'               => 1,
            'Rhystic Study'                => 1,
            'Phyrexian Arena'              => 1,
            'Fact or Fiction'              => 1,
            'Preordain'                    => 1,
            'Ponder'                       => 1,
            'Brainstorm'                   => 1,
            'Counterspell'                 => 1,
            'Arcane Denial'                => 1,
            'Swan Song'                    => 1,
            'Cyclonic Rift'                => 1,
            'Deadly Rollick'               => 1,
            'Doom Blade'                   => 1,
            'Feed the Swarm'               => 1,
            'Go for the Throat'            => 1,
            'Gonti, Canny Acquisitor'      => 1, // commander
        ],
    ],

    // ── 29: Blame Game (Alquist Proft, Master Sleuth) — MKM Commander WU ─────
    29 => [
        'name'      => 'Blame Game',
        'commander' => 'Alquist Proft, Master Sleuth',
        'cards'     => [
            'Plains'                       => 8,
            'Island'                       => 8,
            'Azorius Chancery'             => 1,
            'Command Tower'                => 1,
            'Exotic Orchard'               => 1,
            'Glacial Fortress'             => 1,
            'Mystic Gate'                  => 1,
            'Skycloud Expanse'             => 1,
            'Port Town'                    => 1,
            'Prairie Stream'               => 1,
            'Hallowed Fountain'            => 1,
            'Sol Ring'                     => 1,
            'Arcane Signet'                => 1,
            'Fellwar Stone'                => 1,
            'Azorius Signet'               => 1,
            'Talisman of Progress'         => 1,
            'Thought Vessel'               => 1,
            'Mind Stone'                   => 1,
            'Worn Powerstone'              => 1,
            'Search Warrant'               => 1,
            'Magnifying Glass'             => 1,
            'Evidence Examiner'            => 1,
            'Lonis, Cryptozoologist'       => 1,
            'Lonis, Genetics Expert'       => 1,
                                    'Ezrim, Agency Chief'          => 1,
            'Morska, Undersea Sleuth'      => 1,
            'Kaust, Eyes of the Glade'    => 1,
            'Etrata, Deadly Fugitive'      => 1,
            'Kylox\'s Voltstrider'         => 1,
                        'Abuelo, Ancestral Echo'       => 1,
            'Anzrag\'s Rampage'            => 1,
            'Deadly Cover-Up'              => 1,
            'Cryptic Coat'                 => 1,
                        'Tezzeret\'s Gambit'           => 1,
                        'Contentious Plan'             => 1,
            'Inexorable Tide'              => 1,
            'Tekuthal, Inquiry Dominus'    => 1,
            'Flux Channeler'               => 1,
            'Grateful Apparition'          => 1,
            'Thrummingbird'                => 1,
            'Sword of Truth and Justice'   => 1,
            'Contagion Clasp'              => 1,
            'Contagion Engine'             => 1,
            'Karn\'s Bastion'              => 1,
            'Academy Ruins'                => 1,
            'Evacuation'                   => 1,
            'Wrath of God'                 => 1,
            'Supreme Verdict'              => 1,
            'Time Wipe'                    => 1,
            'Counterspell'                 => 1,
            'Arcane Denial'                => 1,
            'Swan Song'                    => 1,
            'Absorb'                       => 1,
            'Cyclonic Rift'                => 1,
            'Path to Exile'                => 1,
            'Swords to Plowshares'         => 1,
            'Generous Gift'                => 1,
            'Rhystic Study'                => 1,
            'Brainstorm'                   => 1,
            'Ponder'                       => 1,
            'Preordain'                    => 1,
            'Fact or Fiction'              => 1,
            'Phyrexian Metamorph'          => 1,
            'Clever Impersonator'          => 1,
            'Spark Double'                 => 1,
            'Mirrormade'                   => 1,
            'Alquist Proft, Master Sleuth' => 1, // commander
        ],
    ],

    // ── 30: Strange Omens (Marchesa, Dealer of Death) — MKM Commander UBR ────
    30 => [
        'name'      => 'Strange Omens',
        'commander' => 'Marchesa, Dealer of Death',
        'cards'     => [
            'Swamp'                        => 4,
            'Island'                       => 4,
            'Mountain'                     => 3,
            'Dimir Aqueduct'               => 1,
            'Izzet Boilerworks'            => 1,
            'Rakdos Carnarium'             => 1,
            'Command Tower'                => 1,
            'Exotic Orchard'               => 1,
            'Sunken Hollow'                => 1,
            'Smoldering Marsh'             => 1,
            'Underground River'            => 1,
            'Sulfurous Springs'            => 1,
            'Shivan Reef'                  => 1,
            'Temple of Deceit'             => 1,
            'Temple of Epiphany'           => 1,
            'Temple of Malice'             => 1,
            'Crumbling Necropolis'         => 1,
            'Sol Ring'                     => 1,
            'Arcane Signet'                => 1,
            'Fellwar Stone'                => 1,
            'Dimir Signet'                 => 1,
            'Izzet Signet'                 => 1,
            'Rakdos Signet'                => 1,
            'Talisman of Dominance'        => 1,
            'Talisman of Creativity'       => 1,
            'Talisman of Indulgence'       => 1,
            'Thought Vessel'               => 1,
            'Worn Powerstone'              => 1,
            'Insidious Dreams'             => 1,
                        'Cryptic Pursuit'              => 1,
            'Scheming Symmetry'            => 1,
            'Ponder'                       => 1,
            'Brainstorm'                   => 1,
            'Preordain'                    => 1,
            'Rhystic Study'                => 1,
            'Phyrexian Arena'              => 1,
            'Painful Truths'               => 1,
            'Fact or Fiction'              => 1,
            'Dark Deal'                    => 1,
            'Grixis Charm'                 => 1,
            'Nicol Bolas, God-Pharaoh'     => 1,
            'Nicol Bolas, the Ravager'     => 1,
            'Sire of Insanity'             => 1,
            'Lord of the Void'             => 1,
            'Curse of Leeches'              => 1,
            'Rankle and Torbran'           => 1,
            'Liliana, Dreadhorde General'  => 1,
            'Sheoldred, Whispering One'    => 1,
            'Notion Thief'                 => 1,
            'Whispering Madness'           => 1,
            'Waste Not'                    => 1,
            'Sadistic Hypnotist'           => 1,
            'Syphon Mind'                  => 1,
            'Hymn to Tourach'              => 1,
            'Mindslicer'                   => 1,
            'Plaguecrafter'                => 1,
            'Dauthi Voidwalker'            => 1,
            'Counterspell'                 => 1,
            'Arcane Denial'                => 1,
            'Swan Song'                    => 1,
            'Cyclonic Rift'                => 1,
            'Deadly Rollick'               => 1,
            'Chaos Warp'                   => 1,
            'Blasphemous Act'              => 1,
            'Lightning Bolt'               => 1,
            'Feed the Swarm'               => 1,
            'Go for the Throat'            => 1,
            'Doom Blade'                   => 1,
            'Terminate'                    => 1,
            'Murderous Cut'                => 1,
            'Hero\'s Downfall'             => 1,
            'Marchesa, Dealer of Death'    => 1, // commander
        ],
    ],

    // ── 31: Hail Caesar (Caesar, Legion's Emperor) — MKM Commander WBR ───────
    31 => [
        'name'      => "Hail Caesar",
        'commander' => "Caesar, Legion's Emperor",
        'cards'     => [
            'Swamp'                        => 4,
            'Plains'                       => 4,
            'Mountain'                     => 3,
            'Orzhov Basilica'              => 1,
            'Boros Garrison'               => 1,
            'Rakdos Carnarium'             => 1,
            'Command Tower'                => 1,
            'Nomad Outpost'                => 1,
            'Exotic Orchard'               => 1,
            'Clifftop Retreat'             => 1,
            'Isolated Chapel'              => 1,
            'Dragonskull Summit'           => 1,
            'Sacred Foundry'               => 1,
            'Blood Crypt'                  => 1,
            'Godless Shrine'               => 1,
            'Inspiring Vantage'            => 1,
            'Concealed Courtyard'          => 1,
            'Shadowblood Ridge'            => 1,
            'Sol Ring'                     => 1,
            'Arcane Signet'                => 1,
            'Fellwar Stone'                => 1,
            'Orzhov Signet'                => 1,
            'Boros Signet'                 => 1,
            'Rakdos Signet'                => 1,
            'Talisman of Hierarchy'        => 1,
            'Talisman of Conviction'       => 1,
            'Talisman of Indulgence'       => 1,
            'Worn Powerstone'              => 1,
            'Mind Stone'                   => 1,
            'Elenda, the Dusk Rose'        => 1,
            'Odric, Lunarch Marshal'       => 1,
            'Kykar, Wind\'s Fury'          => 1,
            'Myrel, Shield of Argive'      => 1,
            'Bennie Bracks, Zoologist'     => 1,
            'Prava of the Steel Legion'    => 1,
            'Boros Charm'                  => 1,
            'March of the Multitudes'      => 1,
            'Secure the Wastes'            => 1,
            'Hour of Reckoning'            => 1,
            'Deploy to the Front'          => 1,
            'Martial Coup'                 => 1,
            'Conqueror\'s Flail'           => 1,
            'Door of Destinies'            => 1,
            'Vanquisher\'s Banner'         => 1,
            'Herald\'s Horn'               => 1,
            'Icon of Ancestry'             => 1,
            'Coat of Arms'                 => 1,
            'Intangible Virtue'            => 1,
            'Anointed Procession'          => 1,
            'Parallel Lives'               => 1,
            'Dolmen Gate'                  => 1,
            'Reconnaissance'               => 1,
            'Mass Hysteria'                => 1,
            'Fires of Yavimaya'            => 1,
            'Rhythm of the Wild'           => 1,
            'Cathars\' Crusade'            => 1,
            'Skullclamp'                   => 1,
            'Ashnod\'s Altar'              => 1,
            'Phyrexian Altar'              => 1,
            'Path to Exile'                => 1,
            'Swords to Plowshares'         => 1,
            'Generous Gift'                => 1,
            'Chaos Warp'                   => 1,
            'Vandalblast'                  => 1,
            'Anguished Unmaking'           => 1,
            'Blasphemous Act'              => 1,
            'Vanquish the Horde'           => 1,
            'Austere Command'              => 1,
            'Decree of Pain'               => 1,
            "Caesar, Legion's Emperor"     => 1, // commander
        ],
    ],

    // ── 32: Mutant Menace (The Wise Mothman) — Fallout Commander UBG ─────────
    32 => [
        'name'      => 'Mutant Menace',
        'commander' => 'The Wise Mothman',
        'cards'     => [
            'Swamp'                        => 4,
            'Forest'                       => 5,
            'Island'                       => 4,
            'Simic Growth Chamber'         => 1,
            'Dimir Aqueduct'               => 1,
            'Golgari Rot Farm'             => 1,
            'Command Tower'                => 1,
            'Opulent Palace'               => 1,
            'Exotic Orchard'               => 1,
            'Sunken Hollow'                => 1,
            'Hinterland Harbor'            => 1,
            'Woodland Cemetery'            => 1,
            'Overgrown Tomb'               => 1,
            'Watery Grave'                 => 1,
            'Breeding Pool'                => 1,
            'Sol Ring'                     => 1,
            'Arcane Signet'                => 1,
            'Fellwar Stone'                => 1,
            'Simic Signet'                 => 1,
            'Dimir Signet'                 => 1,
            'Golgari Signet'               => 1,
            'Talisman of Curiosity'        => 1,
            'Talisman of Resilience'       => 1,
            'Talisman of Dominance'        => 1,
            'Thought Vessel'               => 1,
            'Worn Powerstone'              => 1,
            'Nesting Grounds'              => 1,
            'Ozolith, the Shattered Spire' => 1,
            'The Ozolith'                  => 1,
            'Hardened Scales'              => 1,
            'Branching Evolution'          => 1,
            'Doubling Season'              => 1,
            'Vorel of the Hull Clade'      => 1,
            'Forgotten Ancient'            => 1,
            'Kalonian Hydra'               => 1,
            'Corpsejack Menace'            => 1,
            'Winding Constrictor'          => 1,
            'Rishkar, Peema Renegade'      => 1,
            'Animation Module'             => 1,
            'Hadana\'s Climb'              => 1,
            'Master Biomancer'             => 1,
            'Zameck Guildmage'             => 1,
            'Cytoplast Manipulator'        => 1,
            'Inspiring Call'               => 1,
            'Combine Chrysalis'            => 1,
            'Mutant\'s Prey'               => 1,
            'Simic Charm'                  => 1,
                                    'Tezzeret\'s Gambit'           => 1,
            'Contentious Plan'             => 1,
            'Inexorable Tide'              => 1,
            'Contagion Clasp'              => 1,
            'Contagion Engine'             => 1,
            'Karn\'s Bastion'              => 1,
            'Tekuthal, Inquiry Dominus'    => 1,
            'Flux Channeler'               => 1,
            'Grateful Apparition'          => 1,
            'Thrummingbird'                => 1,
            'Cyclonic Rift'                => 1,
            'Counterspell'                 => 1,
            'Arcane Denial'                => 1,
            'Swan Song'                    => 1,
            'Beast Within'                 => 1,
            'Generous Gift'                => 1,
            'Feed the Swarm'               => 1,
            'Go for the Throat'            => 1,
            'Doom Blade'                   => 1,
            'Deadly Rollick'               => 1,
            'Rhystic Study'                => 1,
            'Phyrexian Arena'              => 1,
            'Brainstorm'                   => 1,
            'Ponder'                       => 1,
            'Preordain'                    => 1,
            'The Wise Mothman'             => 1, // commander
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
            $entry = [
                'id'             => $card['id'],
                'name'           => $card['name'],
                'image_uri'      => $imageUri,
                'colors'         => implode('', $card['colors'] ?? []),
                'color_identity' => implode('', $card['color_identity'] ?? []),
                'type_line'      => $card['type_line'] ?? null,
                'mana_cost'      => $card['mana_cost'] ?? null,
            ];
            $map[strtolower($card['name'])] = $entry;
            // Also index by front-face name for DFCs
            if (str_contains($card['name'], ' // ')) {
                $map[strtolower(explode(' // ', $card['name'])[0])] = $entry;
            }
        }

        foreach ($data['not_found'] ?? [] as $nf) {
            echo "  [NOT FOUND] " . ($nf['name'] ?? json_encode($nf)) . "\n";
        }

        usleep(100000); // 100ms between batches
    }
    return $map;
}

// ── Populate scryfall_card_cache ─────────────────────────────────────────────
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

// ── UUID mint helper ─────────────────────────────────────────────────────────
// Mints a UUID v4-shaped identifier using random_int() for cryptographic
// uniformity. We generate in PHP rather than relying on MySQL UUID() so we
// have the value in hand before the INSERT (no lastInsertId() on CHAR(36) PKs).
function mintUuid(): string {
    return sprintf(
        '%08x-%04x-%04x-%04x-%012x',
        random_int(0, 0xffffffff),
        random_int(0, 0xffff),
        random_int(0, 0xffff),
        random_int(0, 0xffff),
        random_int(0, 0xffffffffffff)
    );
}

// ── list_cards idempotent insert ──────────────────────────────────────────────
// NOTE: list_cards does NOT have a UNIQUE KEY on (list_id, scryfall_id) as of
// v4.8.0, so ON DUPLICATE KEY UPDATE is not available. We use SELECT-then-
// UPDATE-or-INSERT instead. Schema migration to add the unique key is tracked
// separately; once it lands, this can be simplified to ON DUPLICATE KEY UPDATE.
function upsertListCard(PDO $pdo, string $listId, string $scryfallId, string $cardName, int $qty, int $isCommander): void {
    $stmt = $pdo->prepare(
        "SELECT id FROM list_cards WHERE list_id = ? AND scryfall_id = ? LIMIT 1"
    );
    $stmt->execute([$listId, $scryfallId]);
    $existing = $stmt->fetchColumn();

    if ($existing !== false) {
        $pdo->prepare(
            "UPDATE list_cards SET quantity = ?, is_commander = ?, card_name = ? WHERE id = ?"
        )->execute([$qty, $isCommander, $cardName, $existing]);
    } else {
        $pdo->prepare(
            "INSERT INTO list_cards (list_id, scryfall_id, card_name, quantity, is_commander, is_proxy)
             VALUES (?, ?, ?, ?, ?, 0)"
        )->execute([$listId, $scryfallId, $cardName, $qty, $isCommander]);
    }
}

// ── Insert cards only (decks already exist) ──────────────────────────────────
// Phase 2.2 step 4: writes go to list_cards via the deck's main list.
// deck_cards is frozen as a read-shadow; no new writes to it.
//
// NOTE: The $decks array was originally keyed by legacy integer deck IDs
// (25-32). After v4.7.0, decks.id is CHAR(36) UUID. We resolve each deck's
// UUID by looking it up by name (which is unique among seeded decks).
// The legacy integer key is kept only as documentation of the original order.

$deckByName = $pdo->prepare("SELECT id FROM decks WHERE name = ? AND deleted_at IS NULL LIMIT 1");
$listLookup = $pdo->prepare(
    "SELECT id FROM lists WHERE deck_id = ? AND role = 'main' AND deleted_at IS NULL LIMIT 1"
);
$listInsert = $pdo->prepare(
    "INSERT INTO lists (id, deck_id, name, role, format, source) VALUES (?, ?, ?, 'main', 'commander', 'seed')"
);

foreach ($decks as $legacyDeckId => $deck) {
    echo "\n=== [{$legacyDeckId}] {$deck['name']} (Commander: {$deck['commander']}) ===\n";

    // Resolve deck UUID from name (legacy int key is no longer the PK)
    $deckByName->execute([$deck['name']]);
    $deckId = $deckByName->fetchColumn();
    if (!$deckId) {
        echo "  [SKIP] Deck not found in DB by name: {$deck['name']} — run the deck-creation script first.\n";
        continue;
    }
    echo "  Resolved deck id=$deckId\n";

    // Look up or create the deck's main list
    $listLookup->execute([$deckId]);
    $listId = $listLookup->fetchColumn();
    if (!$listId) {
        $listId = mintUuid();
        $listInsert->execute([$listId, $deckId, $deck['name'] . ' (main)']);
        echo "  Created main list id=$listId\n";
    } else {
        echo "  Found existing main list id=$listId\n";
    }

    $uniqueNames = array_keys($deck['cards']);
    echo "  Looking up " . count($uniqueNames) . " unique card names on Scryfall…\n";
    $scryfallMap = scryfallLookup($uniqueNames);
    echo "  Resolved " . count($scryfallMap) . " cards.\n";

    cacheCards($pdo, $scryfallMap);
    echo "  Cache populated.\n";

    // Insert cards into list_cards (removed: INSERT INTO deck_cards)
    $inserted = 0;
    foreach ($deck['cards'] as $cardName => $qty) {
        $key = strtolower($cardName);
        $isCommander = (strtolower($cardName) === strtolower($deck['commander'])) ? 1 : 0;

        $scryfallId   = $scryfallMap[$key]['id'] ?? null;
        $resolvedName = $scryfallMap[$key]['name'] ?? $cardName;

        if (!$scryfallId) {
            echo "  [SKIP] No Scryfall ID for: $cardName\n";
            continue;
        }

        upsertListCard($pdo, $listId, $scryfallId, $resolvedName, $qty, $isCommander);
        $inserted++;
    }
    echo "  Inserted/updated $inserted card rows in list_cards.\n";
}

echo "\nDone.\n";
