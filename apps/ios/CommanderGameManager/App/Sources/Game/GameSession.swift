import Foundation
import Observation
import CommanderGameKit

/// The live game. Owns the board state, the action log and the derived
/// game log, and is the only thing that mutates them: every change goes
/// through `dispatch`, which applies the reducer, diffs the board into log
/// entries, and saves the whole game to disk.
@Observable
@MainActor
final class GameSession {
    private(set) var state: GameState
    private(set) var events: [LiveGameEvent] = []
    private(set) var log: [GameLogEvent] = []
    let clientGameId: String
    let startedAt: Date
    private var initialState: GameState?

    /// A kill that needs the host to say who dealt it (life or poison, no
    /// commander-damage source). The board shows a prompt while this is set.
    var pendingKillAttribution: PendingKill?

    /// Set when the crown moved from one seat to another (not gained from
    /// nobody), so the new holder's crown plays the longer transfer entry.
    private(set) var monarchTransferAt: Date?
    var monarchTransferRecent: Bool { monarchTransferAt.map { Date().timeIntervalSince($0) < 1.8 } ?? false }

    /// Last commander-damage source tapped per target seat: the tiebreak for
    /// which commander's art shows as the threat vignette.
    private(set) var lastCmdDmgSource: [Int: Int] = [:]

    /// True when the first player was rolled or picked in this session (fresh
    /// game), which stagger-reveals the seat backdrops in turn order. A resumed
    /// game fades them all in together.
    private(set) var firstPlayerChosenThisSession = false

    /// Remote mode (a phone at a seat): events go to the table over the local
    /// link instead of the reducer, and the state arrives back from the host.
    private var remoteTransport: ((LiveGameEvent.Kind) -> Void)?
    private(set) var remoteSeat: String?
    var isRemote: Bool { remoteTransport != nil }

    /// Host side: called after every change so the table can push the state
    /// to connected phones.
    var onStateChanged: ((GameState, [GameLogEvent]) -> Void)?

    /// Highest poison among living seats, for the shared poison ambience.
    var highestLivingPoison: Int { state.players.filter { !$0.isEliminated }.map(\.poison).max() ?? 0 }
    struct PendingKill: Identifiable, Equatable {
        enum Cause { case life, poison }
        var targetIdx: Int
        var cause: Cause
        var id: String { "\(targetIdx)-\(cause)" }
    }

    init(setup: GameSetupInput) {
        var s = GameSetup.seatingState(
            playerCount: setup.playerCount, startingLife: setup.startingLife,
            turnTimerSeconds: setup.turnTimerSeconds, gameType: setup.gameType)
        for (i, seat) in setup.prefill.enumerated() where i < s.players.count {
            if let seat { s = GameSetup.seating(s, idx: i, seat: seat) }
        }
        state = s
        clientGameId = UUID().uuidString.lowercased()
        startedAt = .now
    }

    /// A phone's mirror of the table's game.
    init(remote state: GameState, seat: String, send: @escaping (LiveGameEvent.Kind) -> Void) {
        self.state = state
        remoteTransport = send
        remoteSeat = seat
        clientGameId = ""
        startedAt = .now
    }

    /// Replace the mirrored state with what the host sent.
    func applyRemoteState(_ next: GameState, log newLog: [GameLogEvent]) {
        let prev = state
        state = next
        log = newLog
        noteMonarchTransfer(prev: prev, next: next)
    }

    /// A fresh game seated like a previous one (Restart).
    init(seating state: GameState) {
        self.state = state
        clientGameId = UUID().uuidString.lowercased()
        startedAt = .now
    }

    init(resuming game: ActiveGame) {
        state = game.state
        events = game.events
        log = game.log
        clientGameId = game.clientGameId
        startedAt = game.startedAt
        initialState = game.initialState
    }

    var isSeating: Bool { state.phase == .seating }
    var isPlaying: Bool { state.phase == .playing }
    var hasEnded: Bool { state.phase == .ended }
    var allSeatsFilled: Bool { state.players.allSatisfy(GameSetup.isSeatFilled) }
    var winnerIdx: Int? { isPlaying ? GameOutcome.winnerIdx(state) : nil }

    // MARK: Seating

    func seat(_ idx: Int, _ seat: GameSetup.Seat) {
        state = GameSetup.seating(state, idx: idx, seat: seat)
    }

    func chooseFirstPlayer(_ idx: Int, note: String?) {
        let prev = state
        state = GameSetup.chooseFirstPlayer(state, idx: idx)
        firstPlayerChosenThisSession = true
        if isPlaying { appendLog(GameLog.diff(prev, state)) }
        if let note { appendLog([GameLogEvent(type: "first_player_roll", payload: ["note": .string(note)])]) }
        persist()
    }

    /// Each round of the roll for first player, as the web logs it.
    func logRollForFirst(_ rolls: [(String, Int)], tiebreak: Bool) {
        appendLog([GameLogEvent(type: "roll_for_first", payload: [
            "sides": .int(20), "tiebreak": .bool(tiebreak),
            "rolls": .array(rolls.map { .object(["player": .string($0.0), "roll": .int($0.1)]) }),
        ])])
    }

    /// Back to seating with the same players (web Restart).
    func restartKeepingSeats() -> GameState {
        var fresh = GameSetup.seatingState(playerCount: state.players.count, startingLife: state.startingLife,
                                           turnTimerSeconds: state.turnTimerSeconds, gameType: state.gameType ?? .standard)
        for (i, p) in state.players.enumerated() where GameSetup.isSeatFilled(p) {
            fresh = GameSetup.seating(fresh, idx: i, seat: GameSetup.Seat(playerId: p.playerId, playerName: p.playerName, deckId: p.deckId, deckName: p.deckName, commander: p.commander, partner: p.partner))
        }
        ActiveGameStore.clear()
        return fresh
    }

    /// Seating → playing. Records game_started and, if the first player is
    /// already chosen, the turn order.
    func start() {
        guard isSeating, allSeatsFilled else { return }
        let seatingDone = state
        state = GameSetup.start(state, now: GameReducer.nowMillis())
        initialState = state
        var opening = [GameLog.gameStartedEvent(state)]
        if state.firstPlayerIdx != nil {
            var beforeChoice = seatingDone
            beforeChoice.firstPlayerIdx = nil
            opening += GameLog.diff(beforeChoice, state)
        }
        log = opening
        persist()
    }

    // MARK: Play

    func dispatch(_ kind: LiveGameEvent.Kind, seat: String = "host") {
        guard isPlaying else { return }
        if let remoteTransport { remoteTransport(kind); return }
        // Phone bookkeeping (view_open and the like) is not a game event: it
        // neither changes state nor belongs in the saved event list.
        if case .unknown = kind { return }
        let event = LiveGameEvent(seat: seat, ts: GameReducer.nowMillis(), kind: kind)
        let prev = state
        state = GameReducer.applyEvent(prev, event)
        // A checkin only refreshes the "phone connected" timestamp; keep it out
        // of the replayable event list but still push the state to every phone.
        if case .checkin = kind { persist(); return }
        events.append(event)
        appendLog(GameLog.diff(prev, state, reverse: { if case .prevTurn = kind { true } else { false } }()))
        noteKillsNeedingAttribution(prev: prev, next: state, kind: kind)
        noteMonarchTransfer(prev: prev, next: state)
        if case .commanderDamageChange(let target, let source, _, _) = kind { lastCmdDmgSource[target] = source }
        persist()
    }

    private func noteMonarchTransfer(prev: GameState, next: GameState) {
        let was = prev.players.firstIndex(where: \.isMonarch)
        let now = next.players.firstIndex(where: \.isMonarch)
        if let was, let now, was != now { monarchTransferAt = .now }
    }

    /// Life and poison kills happen before anyone says who dealt them. A
    /// commander-damage kill names its source in the reducer; the other two
    /// get a prompt, answered with life_kill_attr / poison_kill_attr.
    private func noteKillsNeedingAttribution(prev: GameState, next: GameState, kind: LiveGameEvent.Kind) {
        let idx: Int
        let cause: PendingKill.Cause
        switch kind {
        case .lifeChange(let i, _): idx = i; cause = .life
        case .poisonChange(let i, _): idx = i; cause = .poison
        default: return
        }
        let seats = next.isTwoHeadedGiant
            ? next.players.indices.filter { next.players[$0].teamNumber == next.players[idx].teamNumber }
            : [idx]
        let newlyDead = seats.contains { !prev.players[$0].isEliminated && next.players[$0].isEliminated }
        if newlyDead { pendingKillAttribution = PendingKill(targetIdx: idx, cause: cause) }
    }

    func attributeKill(_ pending: PendingKill, sourceIdx: Int?) {
        pendingKillAttribution = nil
        switch pending.cause {
        case .life: dispatch(.lifeKillAttr(playerIdx: pending.targetIdx, sourcePlayerIdx: sourceIdx))
        case .poison: dispatch(.poisonKillAttr(playerIdx: pending.targetIdx, sourcePlayerIdx: sourceIdx))
        }
    }

    /// Die rolls never touch the state; they are logged directly (web `die_roll`).
    func logDiceRoll(die: String, sides: Int?, count: Int, rolls: [Int], total: Int?) {
        let faces: [JSONValue] = sides == nil ? rolls.map { .string($0 == 1 ? "Heads" : "Tails") } : rolls.map { .int($0) }
        appendLog([GameLogEvent(type: "die_roll", payload: [
            "die": .string(die), "sides": sides.map { .int($0) } ?? .null, "count": .int(count),
            "rolls": .array(faces), "total": total.map { .int($0) } ?? .null,
        ])])
        persist()
    }

    func setNotes(_ notes: String) {
        guard isPlaying else { return }
        state.notes = notes
        persist()
    }

    func setTurnTimer(seconds: Int) {
        state.turnTimerSeconds = seconds
        persist()
    }

    // MARK: End

    func endGame() {
        guard isPlaying else { return }
        state.phase = .ended
        appendLog([GameLogEvent(type: "game_ended", payload: ["turn": .int(state.turnNumber)])])
        persist()
    }

    /// Seconds the active player has had the turn.
    func elapsedSeconds(now: Date) -> Int {
        guard state.turnStartTime > 0 else { return 0 }
        return max(0, Int(now.timeIntervalSince1970 - state.turnStartTime / 1000))
    }

    // MARK: Persistence

    private func appendLog(_ entries: [GameLogEvent]) {
        let ts = ISO8601DateFormatter().string(from: .now)
        log += entries.map { var e = $0; e.ts = e.ts ?? ts; return e }
    }

    private func persist() {
        guard !isRemote else { return }
        onStateChanged?(state, log)
        guard let initialState else { return }   // nothing to resume until play starts
        ActiveGameStore.save(ActiveGame(
            clientGameId: clientGameId, startedAt: startedAt, initialState: initialState,
            events: events, log: log, state: state))
    }

    func discard() {
        ActiveGameStore.clear()
    }
}
