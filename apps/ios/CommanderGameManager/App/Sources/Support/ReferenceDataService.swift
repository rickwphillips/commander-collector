import Foundation
import SwiftData
import CommanderAPI
import OpenAPIRuntime

/// Pulls players and decks from the API into the SwiftData cache. The cache is
/// what the seat picker reads, so a refresh failure (offline, expired token)
/// leaves the last good data in place and the game can still be set up.
@MainActor
enum ReferenceDataService {
    struct Summary { var players: Int; var decks: Int }

    static func refresh(using client: Client, into context: ModelContext) async throws -> Summary {
        let players = try await fetchPlayers(client)
        let decks = try await fetchDecks(client)

        let existingPlayers = try context.fetch(FetchDescriptor<CachedPlayer>())
        var playersById = Dictionary(uniqueKeysWithValues: existingPlayers.map { ($0.id, $0) })
        for p in players {
            if let cached = playersById.removeValue(forKey: p.id) {
                cached.name = p.name
                cached.userId = p.userId
                cached.updatedAt = .now
            } else {
                context.insert(CachedPlayer(id: p.id, name: p.name, userId: p.userId))
            }
        }
        for stale in playersById.values { context.delete(stale) }

        let existingDecks = try context.fetch(FetchDescriptor<CachedDeck>())
        var decksById = Dictionary(uniqueKeysWithValues: existingDecks.map { ($0.id, $0) })
        for d in decks {
            if let cached = decksById.removeValue(forKey: d.id) {
                cached.playerId = d.playerId; cached.playerName = d.playerName; cached.name = d.name
                cached.commander = d.commander; cached.partner = d.partner; cached.colors = d.colors
                cached.updatedAt = .now
            } else {
                context.insert(CachedDeck(id: d.id, playerId: d.playerId, playerName: d.playerName, name: d.name,
                                          commander: d.commander, partner: d.partner, colors: d.colors))
            }
        }
        for stale in decksById.values { context.delete(stale) }

        try context.save()
        return Summary(players: players.count, decks: decks.count)
    }

    struct PlayerRow { var id: String; var name: String; var userId: String? }
    struct DeckRow { var id: String; var playerId: String; var playerName: String; var name: String; var commander: String; var partner: String?; var colors: String }

    static func fetchPlayers(_ client: Client) async throws -> [PlayerRow] {
        let response = try await client.listPlayers()
        switch response {
        case .ok(let ok):
            switch try ok.body.json {
            case .case1(let rows):
                return rows.map { PlayerRow(id: $0.value1.id, name: $0.value1.name, userId: $0.value1.userId) }
            case .Player(let single):
                return [PlayerRow(id: single.id, name: single.name, userId: single.userId)]
            }
        case .unauthorized: throw SessionError.badCredentials
        case .notFound: return []
        case .undocumented(let status, _): throw SessionError.server("players: unexpected response \(status)")
        }
    }

    static func fetchDecks(_ client: Client) async throws -> [DeckRow] {
        let response = try await client.listDecks()
        func row(_ d: Components.Schemas.DeckWithPlayer) -> DeckRow {
            DeckRow(id: d.value1.id, playerId: d.value1.playerId, playerName: d.value2.playerName, name: d.value1.name,
                    commander: d.value1.commander, partner: d.value1.partner, colors: d.value1.colors)
        }
        switch response {
        case .ok(let ok):
            switch try ok.body.json {
            case .case1(let rows): return rows.map(row)
            case .DeckWithPlayer(let single): return [row(single)]
            }
        case .unauthorized: throw SessionError.badCredentials
        case .notFound: return []
        case .undocumented(let status, _): throw SessionError.server("decks: unexpected response \(status)")
        }
    }
}
