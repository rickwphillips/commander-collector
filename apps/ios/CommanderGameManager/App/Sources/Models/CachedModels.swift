import Foundation
import SwiftData

/// A player from the web registry, cached for offline seating.
@Model
final class CachedPlayer {
    @Attribute(.unique) var id: String
    var name: String
    var userId: String?
    var updatedAt: Date

    init(id: String, name: String, userId: String?, updatedAt: Date = .now) {
        self.id = id
        self.name = name
        self.userId = userId
        self.updatedAt = updatedAt
    }
}

/// A deck from the web registry: what the seat picker needs to label a seat
/// and what the game log needs to name commanders.
@Model
final class CachedDeck {
    @Attribute(.unique) var id: String
    var playerId: String
    var playerName: String
    var name: String
    var commander: String
    var partner: String?
    /// Canonical WUBRG letters, or C.
    var colors: String
    var updatedAt: Date

    init(id: String, playerId: String, playerName: String, name: String, commander: String,
         partner: String?, colors: String, updatedAt: Date = .now) {
        self.id = id
        self.playerId = playerId
        self.playerName = playerName
        self.name = name
        self.commander = commander
        self.partner = partner
        self.colors = colors
        self.updatedAt = updatedAt
    }
}

/// A finished game waiting to be reported to the web app. `clientGameId` is
/// the idempotency key POST games.php accepts, so a retry after a dropped
/// response cannot create a duplicate. `eventLog` is the JSON-encoded
/// [GameLogEvent] that goes up with the save.
@Model
final class OutboxGame {
    enum Status: String, Codable { case pending, uploading, uploaded, failed }

    @Attribute(.unique) var clientGameId: String
    var playedAt: Date
    var payload: Data
    var eventLog: Data
    var statusRaw: String
    var attempts: Int
    var lastError: String?
    var lastAttemptAt: Date?
    var serverGameId: String?
    var createdAt: Date

    var status: Status {
        get { Status(rawValue: statusRaw) ?? .pending }
        set { statusRaw = newValue.rawValue }
    }

    init(clientGameId: String, playedAt: Date, payload: Data, eventLog: Data) {
        self.clientGameId = clientGameId
        self.playedAt = playedAt
        self.payload = payload
        self.eventLog = eventLog
        self.statusRaw = Status.pending.rawValue
        self.attempts = 0
        self.createdAt = .now
    }
}
