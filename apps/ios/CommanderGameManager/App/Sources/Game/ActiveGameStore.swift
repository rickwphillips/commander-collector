import Foundation
import CommanderGameKit

/// The whole in-progress game, written to the iPad after every action so the
/// table can carry on after a crash, a relaunch or a dead battery. Nothing in
/// here goes to the server until the game is finished.
struct ActiveGame: Codable, Equatable {
    /// Idempotency key for the eventual POST games.php.
    var clientGameId: String
    var startedAt: Date
    /// Board at the moment play began (after seating and the first-player choice).
    var initialState: GameState
    /// Every action since, in order. Folding these over `initialState` rebuilds `state`.
    var events: [LiveGameEvent]
    /// Durable, human-readable log derived from state diffs (what the web shows).
    var log: [GameLogEvent]
    /// Current board, kept so a resume is instant; always equals the fold.
    var state: GameState
}

enum ActiveGameStore {
    private static var url: URL {
        let dir = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("CommanderGameManager", isDirectory: true)
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir.appendingPathComponent("active-game.json")
    }

    static func load() -> ActiveGame? {
        guard let data = try? Data(contentsOf: url) else { return nil }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try? decoder.decode(ActiveGame.self, from: data)
    }

    static func save(_ game: ActiveGame) {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        guard let data = try? encoder.encode(game) else { return }
        try? data.write(to: url, options: .atomic)
    }

    static func clear() {
        try? FileManager.default.removeItem(at: url)
    }
}
