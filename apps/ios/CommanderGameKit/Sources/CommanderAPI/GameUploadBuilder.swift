import Foundation
import OpenAPIRuntime
import CommanderGameKit

/// Builds the `POST games.php` body for a finished game: the same payload the
/// web's handleSaveGame sends, plus the client game id (idempotency) and the
/// whole event log so the web's log view shows the game.
public enum GameUploadBuilder {
    public static func playedAtString(_ date: Date, calendar: Calendar = .current) -> String {
        let c = calendar.dateComponents([.year, .month, .day], from: date)
        return String(format: "%04d-%02d-%02d", c.year ?? 1970, c.month ?? 1, c.day ?? 1)
    }

    public static func createGameInput(
        clientGameId: String, playedAt: Date, state: GameState, log: [GameLogEvent], survivorOrder: [Int]? = nil
    ) throws -> Components.Schemas.CreateGameInput {
        try Components.Schemas.CreateGameInput(
            playedAt: playedAtString(playedAt),
            notes: GameOutcome.cleanNotes(state.notes),
            gameType: .init(rawValue: (state.gameType ?? .standard).rawValue),
            results: GameOutcome.results(state, survivorOrder: survivorOrder).map {
                .init(deckId: $0.deckId, playerId: $0.playerId, finishPosition: $0.finishPosition,
                      eliminatedTurn: $0.eliminatedTurn, teamNumber: $0.teamNumber)
            },
            clientGameId: clientGameId,
            events: log.map { try apiEvent($0) }
        )
    }

    /// A Kit log event as the generated schema type: free-form payload, ISO timestamp.
    public static func apiEvent(_ e: GameLogEvent) throws -> Components.Schemas.GameLogEvent {
        let payloadData = try JSONEncoder().encode(e.payload ?? [:])
        let container = try JSONDecoder().decode(OpenAPIObjectContainer.self, from: payloadData)
        let ts = e.ts.flatMap { ISO8601DateFormatter().date(from: $0) }
        return .init(_type: e.type, payload: .init(additionalProperties: container), ts: ts)
    }
}
