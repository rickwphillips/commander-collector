import Foundation
import SwiftData
import CommanderGameKit

/// `-demo` launch argument (DEBUG builds only): exercise the board without
/// signing in. On a device that already holds a real token (the iPad), the real
/// account, server and cache are kept and only the board is seeded, from the
/// real cached players and decks, so a game saved from it is a genuine upload.
/// Without a token, a throwaway token and in-memory demo players are used
/// (simulator screenshots). `-demoBoard` also seats a four-player game and
/// starts it.
enum DemoMode {
    /// True when there is no real session to reuse.
    static var usesFakeAccount: Bool { isEnabled && KeychainStore.read("jwt") == nil }

    static var isEnabled: Bool {
        #if DEBUG
        CommandLine.arguments.contains("-demo") || CommandLine.arguments.contains("-demoBoard")
        #else
        false
        #endif
    }
    static var wantsBoard: Bool {
        #if DEBUG
        CommandLine.arguments.contains("-demoBoard")
        #else
        false
        #endif
    }

    static let players: [(String, String)] = [
        ("demo-rick", "Rick"), ("demo-sam", "Sam"), ("demo-amy", "Amy"), ("demo-jo", "Jo"),
    ]
    static let decks: [(String, String, String, String, String?)] = [
        ("demo-d1", "demo-rick", "Weapons", "Kaalia of the Vast", nil),
        ("demo-d2", "demo-sam", "Shardly Working", "Thraximundar", nil),
        ("demo-d3", "demo-amy", "Stoned Immaculate", "Atraxa, Praetors' Voice", nil),
        ("demo-d4", "demo-jo", "Sonic Self Defense Rush", "Tymna the Weaver", "Thrasios, Triton Hero"),
    ]

    @MainActor
    static func seed(_ context: ModelContext) {
        guard usesFakeAccount else { return }
        let existing = (try? context.fetch(FetchDescriptor<CachedPlayer>()))?.map(\.id) ?? []
        for (id, name) in players where !existing.contains(id) {
            context.insert(CachedPlayer(id: id, name: name, userId: nil))
        }
        let existingDecks = (try? context.fetch(FetchDescriptor<CachedDeck>()))?.map(\.id) ?? []
        for (id, pid, name, cmdr, partner) in decks where !existingDecks.contains(id) {
            let owner = players.first { $0.0 == pid }!.1
            context.insert(CachedDeck(id: id, playerId: pid, playerName: owner, name: name, commander: cmdr, partner: partner, colors: "WUBRG"))
        }
        try? context.save()
    }

    /// A seated, started four-player game for `-demoBoard`. Seats come from the
    /// real cache when it holds enough distinct players with decks.
    @MainActor
    static func board(from context: ModelContext) -> ActiveGame {
        var s = GameSetup.seatingState(playerCount: 4, startingLife: 40, turnTimerSeconds: 300, gameType: .standard)
        var seats: [GameSetup.Seat] = []
        let cached = (try? context.fetch(FetchDescriptor<CachedDeck>(sortBy: [SortDescriptor(\.name)]))) ?? []
        var usedPlayers = Set<String>()
        for d in cached where !usedPlayers.contains(d.playerId) && seats.count < 4 && !d.id.hasPrefix("demo-") {
            usedPlayers.insert(d.playerId)
            seats.append(GameSetup.Seat(playerId: d.playerId, playerName: d.playerName, deckId: d.id, deckName: d.name,
                                        commander: CommanderInfo(name: d.commander), partner: d.partner.map { CommanderInfo(name: $0) }))
        }
        if seats.count < 4 {
            seats = decks.map { d in
                let owner = players.first { $0.0 == d.1 }!
                return GameSetup.Seat(playerId: owner.0, playerName: owner.1, deckId: d.0, deckName: d.2,
                                      commander: CommanderInfo(name: d.3), partner: d.4.map { CommanderInfo(name: $0) })
            }
        }
        for (i, seat) in seats.prefix(4).enumerated() { s = GameSetup.seating(s, idx: i, seat: seat) }
        s = GameSetup.start(GameSetup.chooseFirstPlayer(s, idx: 0), now: GameReducer.nowMillis())
        let initial = s
        let events: [LiveGameEvent] = [
            LiveGameEvent(seat: "host", ts: 1, kind: .lifeChange(playerIdx: 1, delta: -6)),
            LiveGameEvent(seat: "host", ts: 2, kind: .poisonChange(playerIdx: 2, delta: 3)),
            LiveGameEvent(seat: "host", ts: 3, kind: .commanderDamageChange(targetIdx: 3, sourceIdx: 0, isPartner: false, delta: 7)),
            LiveGameEvent(seat: "host", ts: 4, kind: .toggleMonarch(playerIdx: 2)),
            LiveGameEvent(seat: "host", ts: 5, kind: .passTurn),
        ]
        var log = [GameLog.gameStartedEvent(s)]
        for e in events {
            let next = GameReducer.applyEvent(s, e)
            log += GameLog.diff(s, next)
            s = next
        }
        return ActiveGame(clientGameId: UUID().uuidString.lowercased(), startedAt: .now, initialState: initial, events: events, log: log, state: s)
    }
}
