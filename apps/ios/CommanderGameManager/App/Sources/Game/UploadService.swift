import Foundation
import SwiftData
import CommanderGameKit
import CommanderAPI
import OpenAPIRuntime

/// What the end screen froze: the board plus, for a game ended early, the
/// host's ordering of the seats still alive.
struct FinishedGame: Codable {
    var state: GameState
    var survivorOrder: [Int]?
}

extension OutboxGame {
    /// The finished game as JSON; the request body is rebuilt from it at
    /// upload time by GameUploadBuilder.
    static func make(clientGameId: String, playedAt: Date, state: GameState, survivorOrder: [Int]?, log: [GameLogEvent]) -> OutboxGame {
        let encoder = JSONEncoder()
        return OutboxGame(clientGameId: clientGameId, playedAt: playedAt,
                          payload: (try? encoder.encode(FinishedGame(state: state, survivorOrder: survivorOrder))) ?? Data(),
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
            let finished = try JSONDecoder().decode(FinishedGame.self, from: game.payload)
            let log = try JSONDecoder().decode([GameLogEvent].self, from: game.eventLog)
            let body = try GameUploadBuilder.createGameInput(
                clientGameId: game.clientGameId, playedAt: game.playedAt, state: finished.state, log: log,
                survivorOrder: finished.survivorOrder)
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
                game.status = .rejected
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
}
