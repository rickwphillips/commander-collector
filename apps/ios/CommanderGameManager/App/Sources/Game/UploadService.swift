import Foundation
import SwiftData
import CommanderGameKit
import CommanderAPI
import OpenAPIRuntime

/// The payload a finished game is saved with: exactly what POST games.php takes.
struct GameUpload: Codable {
    var playedAt: String
    var gameType: GameType
    var notes: String?
    var results: [Result]
    struct Result: Codable {
        var deckId: String
        var playerId: String
        var finishPosition: Int
        var eliminatedTurn: Int?
        var teamNumber: Int?
    }
}

extension OutboxGame {
    static func make(clientGameId: String, playedAt: Date, state: GameState, log: [GameLogEvent]) -> OutboxGame {
        let day = Calendar.current.dateComponents([.year, .month, .day], from: playedAt)
        let upload = GameUpload(
            playedAt: String(format: "%04d-%02d-%02d", day.year!, day.month!, day.day!),
            gameType: state.gameType ?? .standard,
            notes: GameOutcome.cleanNotes(state.notes),
            results: GameOutcome.results(state).map {
                .init(deckId: $0.deckId, playerId: $0.playerId, finishPosition: $0.finishPosition,
                      eliminatedTurn: $0.eliminatedTurn, teamNumber: $0.teamNumber)
            })
        let encoder = JSONEncoder()
        return OutboxGame(clientGameId: clientGameId, playedAt: playedAt,
                          payload: (try? encoder.encode(upload)) ?? Data(),
                          eventLog: (try? encoder.encode(log)) ?? Data())
    }
}

/// Sends queued games. Each attempt is one POST games.php carrying the client
/// game id (so a retry after a dropped response returns the same game) and the
/// whole event log. Failures keep the row with the error for a later retry.
@MainActor
enum UploadService {
    static func flush(client: Client, context: ModelContext) async {
        let pending = (try? context.fetch(FetchDescriptor<OutboxGame>())) ?? []
        for game in pending where game.status == .pending || game.status == .failed {
            if game.status == .failed, let last = game.lastAttemptAt, Date.now.timeIntervalSince(last) < backoff(game.attempts) { continue }
            await upload(game, client: client, context: context)
        }
    }

    static func backoff(_ attempts: Int) -> TimeInterval {
        min(3600, 30 * pow(2, Double(max(0, attempts - 1))))
    }

    static func upload(_ game: OutboxGame, client: Client, context: ModelContext) async {
        game.status = .uploading
        game.attempts += 1
        game.lastAttemptAt = .now
        try? context.save()
        do {
            let payload = try JSONDecoder().decode(GameUpload.self, from: game.payload)
            let log = try JSONDecoder().decode([GameLogEvent].self, from: game.eventLog)
            let body = Components.Schemas.CreateGameInput(
                playedAt: payload.playedAt,
                notes: payload.notes,
                gameType: .init(rawValue: payload.gameType.rawValue),
                results: payload.results.map {
                    .init(deckId: $0.deckId, playerId: $0.playerId, finishPosition: $0.finishPosition,
                          eliminatedTurn: $0.eliminatedTurn, teamNumber: $0.teamNumber)
                },
                clientGameId: game.clientGameId,
                events: try log.map { try apiEvent($0) })
            let response = try await client.createGame(body: .json(body))
            switch response {
            case .created(let r):
                game.serverGameId = try r.body.json.id
                game.status = .uploaded
                game.lastError = nil
            case .ok(let r):
                game.serverGameId = try r.body.json.id
                game.status = .uploaded
                game.lastError = nil
            case .badRequest(let r):
                game.status = .failed
                game.lastError = (try? r.body.json.error) ?? "Bad request"
            case .unauthorized:
                game.status = .failed
                game.lastError = "Signed out. Sign in again to upload."
            case .internalServerError(let r):
                game.status = .failed
                game.lastError = (try? r.body.json.error) ?? "Server error"
            case .undocumented(let status, _):
                game.status = .failed
                game.lastError = "Server answered \(status)"
            }
        } catch {
            game.status = .failed
            game.lastError = error.localizedDescription
        }
        try? context.save()
    }

    /// A Kit log event as the generated schema type: free-form payload, ISO timestamp.
    private static func apiEvent(_ e: GameLogEvent) throws -> Components.Schemas.GameLogEvent {
        let payloadData = try JSONEncoder().encode(e.payload ?? [:])
        let container = try JSONDecoder().decode(OpenAPIObjectContainer.self, from: payloadData)
        let ts = e.ts.flatMap { ISO8601DateFormatter().date(from: $0) }
        return .init(_type: e.type, payload: .init(additionalProperties: container), ts: ts)
    }
}
