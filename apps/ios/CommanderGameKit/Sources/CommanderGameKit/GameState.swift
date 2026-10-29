import Foundation

/// Seats in clockwise play order around the table.
public enum SeatPosition: String, Codable, CaseIterable, Sendable, Hashable {
    case bottom, left, top, right

    /// `CLOCKWISE` on the web: bottom → left → top → right → bottom.
    public static let clockwise: [SeatPosition] = [.bottom, .left, .top, .right]
    var clockwiseIndex: Int { SeatPosition.clockwise.firstIndex(of: self)! }
}

public enum GameType: String, Codable, Sendable, Hashable {
    case standard
    case twoHeadedGiant = "2hg"
}

public enum GamePhase: String, Codable, Sendable, Hashable {
    case setup, seating, playing, ended
}

public struct CommanderInfo: Codable, Hashable, Sendable {
    public var name: String
    public var artCropUrl: String?
    public init(name: String, artCropUrl: String? = nil) {
        self.name = name
        self.artCropUrl = artCropUrl
    }
}

/// One seat's state. Field names and JSON keys match `PlayerState` in
/// apps/core/app/lib/types.ts so a web state decodes directly.
public struct PlayerState: Codable, Hashable, Sendable {
    public var playerId: String
    public var deckId: String
    public var playerName: String
    public var deckName: String
    public var commander: CommanderInfo
    public var partner: CommanderInfo?
    public var position: SeatPosition
    public var life: Int
    public var poison: Int
    public var commanderTax: Int
    /// Second commander's tax for partner/background decks. 0 for single-commander decks.
    public var partnerCommanderTax: Int
    public var isMonarch: Bool
    public var hasInitiative: Bool
    public var hasCitysBlessing: Bool
    public var energy: Int
    public var experience: Int
    public var isEliminated: Bool
    public var isConceded: Bool
    public var eliminatedTurn: Int?
    /// 2HG only: team 1 or 2. nil in standard games.
    public var teamNumber: Int?

    public init(
        playerId: String, deckId: String, playerName: String, deckName: String,
        commander: CommanderInfo, partner: CommanderInfo? = nil, position: SeatPosition,
        life: Int = 40, poison: Int = 0, commanderTax: Int = 0, partnerCommanderTax: Int = 0,
        isMonarch: Bool = false, hasInitiative: Bool = false, hasCitysBlessing: Bool = false,
        energy: Int = 0, experience: Int = 0, isEliminated: Bool = false, isConceded: Bool = false,
        eliminatedTurn: Int? = nil, teamNumber: Int? = nil
    ) {
        self.playerId = playerId; self.deckId = deckId; self.playerName = playerName
        self.deckName = deckName; self.commander = commander; self.partner = partner
        self.position = position; self.life = life; self.poison = poison
        self.commanderTax = commanderTax; self.partnerCommanderTax = partnerCommanderTax
        self.isMonarch = isMonarch; self.hasInitiative = hasInitiative
        self.hasCitysBlessing = hasCitysBlessing; self.energy = energy; self.experience = experience
        self.isEliminated = isEliminated; self.isConceded = isConceded
        self.eliminatedTurn = eliminatedTurn; self.teamNumber = teamNumber
    }
}

/// Damage dealt by one source's commanders to one target: `[fromCommander, fromPartner]`
/// on the wire.
public struct CommanderDamage: Hashable, Sendable, Codable {
    public var fromCommander: Int
    public var fromPartner: Int
    public init(_ fromCommander: Int = 0, _ fromPartner: Int = 0) {
        self.fromCommander = fromCommander
        self.fromPartner = fromPartner
    }
    public var total: Int { fromCommander + fromPartner }
    public static let zero = CommanderDamage()

    public init(from decoder: Decoder) throws {
        var c = try decoder.unkeyedContainer()
        fromCommander = try c.decodeIfPresent(Int.self) ?? 0
        fromPartner = try c.decodeIfPresent(Int.self) ?? 0
    }
    public func encode(to encoder: Encoder) throws {
        var c = encoder.unkeyedContainer()
        try c.encode(fromCommander)
        try c.encode(fromPartner)
    }
}

/// `commanderDamage[target][source]`. JSON object keys are strings on the wire
/// (`Record<number, Record<number, [number, number]>>`), so the coding is custom.
public struct CommanderDamageMap: Hashable, Sendable, Codable {
    public var rows: [Int: [Int: CommanderDamage]]
    public init(_ rows: [Int: [Int: CommanderDamage]] = [:]) { self.rows = rows }

    public subscript(target: Int) -> [Int: CommanderDamage]? {
        get { rows[target] }
        set { rows[target] = newValue }
    }
    public subscript(target: Int, source: Int) -> CommanderDamage {
        get { rows[target]?[source] ?? .zero }
        set { rows[target, default: [:]][source] = newValue }
    }

    /// Every target has a zero row for every other seat — the shape the web
    /// game manager creates at game start.
    public static func empty(seatCount: Int) -> CommanderDamageMap {
        var rows: [Int: [Int: CommanderDamage]] = [:]
        for t in 0..<seatCount {
            var row: [Int: CommanderDamage] = [:]
            for s in 0..<seatCount where s != t { row[s] = .zero }
            rows[t] = row
        }
        return CommanderDamageMap(rows)
    }

    public init(from decoder: Decoder) throws {
        let raw = try decoder.singleValueContainer().decode([String: [String: CommanderDamage]].self)
        rows = Dictionary(uniqueKeysWithValues: raw.compactMap { k, v in
            Int(k).map { ($0, Dictionary(uniqueKeysWithValues: v.compactMap { k2, v2 in Int(k2).map { ($0, v2) } })) }
        })
    }
    public func encode(to encoder: Encoder) throws {
        var c = encoder.singleValueContainer()
        let raw = Dictionary(uniqueKeysWithValues: rows.map { k, v in
            (String(k), Dictionary(uniqueKeysWithValues: v.map { (String($0.key), $0.value) }))
        })
        try c.encode(raw)
    }
}

/// The whole table. Mirrors `GameManagerState` on the web minus the server
/// live-session fields (sessionCode, sessionSeats, viewerMap, viewingPlayerIdx),
/// which have no meaning when the game runs on the device.
public struct GameState: Hashable, Sendable, Codable {
    public var players: [PlayerState]
    public var commanderDamage: CommanderDamageMap
    public var currentPlayerIdx: Int
    public var turnNumber: Int
    public var startingLife: Int
    public var phase: GamePhase
    public var turnTimerSeconds: Int
    /// Milliseconds since the epoch, as `Date.now()` on the web.
    public var turnStartTime: Double
    public var notes: String
    public var gameType: GameType?
    /// 2HG only: custom team names keyed by team number; "Team N" when absent.
    public var teamNames: [Int: String]?
    /// Seat index of the player who went first; nil until chosen.
    public var firstPlayerIdx: Int?
    /// Seat → last heartbeat timestamp (ms) from a remote seat.
    public var remoteCheckins: [String: Double]?

    public init(
        players: [PlayerState], commanderDamage: CommanderDamageMap? = nil,
        currentPlayerIdx: Int = 0, turnNumber: Int = 1, startingLife: Int = 40,
        phase: GamePhase = .playing, turnTimerSeconds: Int = 300, turnStartTime: Double = 0,
        notes: String = "", gameType: GameType? = nil, teamNames: [Int: String]? = nil,
        firstPlayerIdx: Int? = nil, remoteCheckins: [String: Double]? = nil
    ) {
        self.players = players
        self.commanderDamage = commanderDamage ?? .empty(seatCount: players.count)
        self.currentPlayerIdx = currentPlayerIdx; self.turnNumber = turnNumber
        self.startingLife = startingLife; self.phase = phase
        self.turnTimerSeconds = turnTimerSeconds; self.turnStartTime = turnStartTime
        self.notes = notes; self.gameType = gameType; self.teamNames = teamNames
        self.firstPlayerIdx = firstPlayerIdx; self.remoteCheckins = remoteCheckins
    }

    public var isTwoHeadedGiant: Bool { gameType == .twoHeadedGiant }

    private enum CodingKeys: String, CodingKey {
        case players, commanderDamage, currentPlayerIdx, turnNumber, startingLife, phase
        case turnTimerSeconds, turnStartTime, notes, gameType, teamNames, firstPlayerIdx, remoteCheckins
    }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        players = try c.decode([PlayerState].self, forKey: .players)
        commanderDamage = try c.decodeIfPresent(CommanderDamageMap.self, forKey: .commanderDamage) ?? CommanderDamageMap()
        currentPlayerIdx = try c.decode(Int.self, forKey: .currentPlayerIdx)
        turnNumber = try c.decode(Int.self, forKey: .turnNumber)
        startingLife = try c.decode(Int.self, forKey: .startingLife)
        phase = try c.decode(GamePhase.self, forKey: .phase)
        turnTimerSeconds = try c.decode(Int.self, forKey: .turnTimerSeconds)
        turnStartTime = try c.decode(Double.self, forKey: .turnStartTime)
        notes = try c.decode(String.self, forKey: .notes)
        gameType = try c.decodeIfPresent(GameType.self, forKey: .gameType)
        if let raw = try c.decodeIfPresent([String: String].self, forKey: .teamNames) {
            teamNames = Dictionary(uniqueKeysWithValues: raw.compactMap { k, v in Int(k).map { ($0, v) } })
        } else {
            teamNames = nil
        }
        firstPlayerIdx = try c.decodeIfPresent(Int.self, forKey: .firstPlayerIdx)
        remoteCheckins = try c.decodeIfPresent([String: Double].self, forKey: .remoteCheckins)
    }

    public func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(players, forKey: .players)
        try c.encode(commanderDamage, forKey: .commanderDamage)
        try c.encode(currentPlayerIdx, forKey: .currentPlayerIdx)
        try c.encode(turnNumber, forKey: .turnNumber)
        try c.encode(startingLife, forKey: .startingLife)
        try c.encode(phase, forKey: .phase)
        try c.encode(turnTimerSeconds, forKey: .turnTimerSeconds)
        try c.encode(turnStartTime, forKey: .turnStartTime)
        try c.encode(notes, forKey: .notes)
        try c.encodeIfPresent(gameType, forKey: .gameType)
        if let teamNames {
            try c.encode(Dictionary(uniqueKeysWithValues: teamNames.map { (String($0.key), $0.value) }), forKey: .teamNames)
        }
        try c.encodeIfPresent(firstPlayerIdx, forKey: .firstPlayerIdx)
        try c.encodeIfPresent(remoteCheckins, forKey: .remoteCheckins)
    }
}

extension Array {
    /// `array[i]` with JavaScript's out-of-range behaviour (undefined → nil).
    subscript(safe index: Int) -> Element? {
        indices.contains(index) ? self[index] : nil
    }
}
