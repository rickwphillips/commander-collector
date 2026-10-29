import Foundation

/// Building the seating-phase state — port of buildSeatingState / emptySeatAt /
/// POSITIONS_BY_COUNT / TEAM_BY_POSITION in apps/core/app/game-manager/page.tsx.
public enum GameSetup {
    /// Which seats a table of N players uses. 2HG is always four.
    public static func positions(forPlayerCount count: Int, gameType: GameType) -> [SeatPosition] {
        if gameType == .twoHeadedGiant { return [.bottom, .left, .top, .right] }
        switch count {
        case 2: return [.bottom, .top]
        case 3: return [.bottom, .left, .top]
        default: return [.bottom, .left, .top, .right]
        }
    }

    /// 2HG pairs seats along the clockwise turn order so teammates are adjacent:
    /// Team 1 = bottom + left, Team 2 = top + right.
    public static func team(for position: SeatPosition) -> Int {
        switch position {
        case .bottom, .left: 1
        case .top, .right: 2
        }
    }

    /// An unfilled seat.
    public static func emptySeat(at position: SeatPosition, startingLife: Int, teamNumber: Int?) -> PlayerState {
        PlayerState(playerId: "", deckId: "", playerName: "", deckName: "",
                    commander: CommanderInfo(name: ""), position: position,
                    life: startingLife, teamNumber: teamNumber)
    }

    /// A seat is filled when it has a player, a deck and a commander name.
    public static func isSeatFilled(_ p: PlayerState) -> Bool {
        !p.playerId.isEmpty && !p.deckId.isEmpty && !p.commander.name.isEmpty
    }

    /// The state the board starts seating from.
    public static func seatingState(playerCount: Int, startingLife: Int, turnTimerSeconds: Int, gameType: GameType) -> GameState {
        let is2hg = gameType == .twoHeadedGiant
        let players = positions(forPlayerCount: playerCount, gameType: gameType).map { position in
            emptySeat(at: position, startingLife: startingLife, teamNumber: is2hg ? team(for: position) : nil)
        }
        return GameState(
            players: players,
            commanderDamage: .empty(seatCount: players.count),
            currentPlayerIdx: 0, turnNumber: 1, startingLife: startingLife,
            phase: .seating, turnTimerSeconds: turnTimerSeconds, turnStartTime: 0,
            notes: "", gameType: gameType
        )
    }

    /// Who sits where, chosen from the registry.
    public struct Seat: Hashable, Sendable {
        public var playerId: String
        public var playerName: String
        public var deckId: String
        public var deckName: String
        public var commander: CommanderInfo
        public var partner: CommanderInfo?
        public init(playerId: String, playerName: String, deckId: String, deckName: String, commander: CommanderInfo, partner: CommanderInfo? = nil) {
            self.playerId = playerId; self.playerName = playerName; self.deckId = deckId
            self.deckName = deckName; self.commander = commander; self.partner = partner
        }
    }

    public static func seating(_ state: GameState, idx: Int, seat: Seat) -> GameState {
        var out = state
        out.players[idx].playerId = seat.playerId
        out.players[idx].playerName = seat.playerName
        out.players[idx].deckId = seat.deckId
        out.players[idx].deckName = seat.deckName
        out.players[idx].commander = seat.commander
        out.players[idx].partner = seat.partner
        return out
    }

    /// Seating → playing. The clock stamps the first turn.
    public static func start(_ state: GameState, now: Double) -> GameState {
        var out = state
        out.phase = .playing
        out.turnStartTime = now
        return out
    }

    /// First player chosen (roll-off or pick): they take turn 1.
    public static func chooseFirstPlayer(_ state: GameState, idx: Int) -> GameState {
        var out = state
        out.firstPlayerIdx = idx
        out.currentPlayerIdx = idx
        return out
    }
}
