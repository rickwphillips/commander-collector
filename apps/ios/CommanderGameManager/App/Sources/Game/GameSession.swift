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
    struct PendingKill: Identifiable, Equatable {
        enum Cause { case life, poison }
        var targetIdx: Int
        var cause: Cause
        var id: String { "\(targetIdx)-\(cause)" }
    }

    init(setup: GameSetupInput) {
        state = GameSetup.seatingState(
            playerCount: setup.playerCount, startingLife: setup.startingLife,
            turnTimerSeconds: setup.turnTimerSeconds, gameType: setup.gameType)
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
        if isPlaying { appendLog(GameLog.diff(prev, state)) }
        if let note { appendLog([GameLogEvent(type: "first_player_roll", payload: ["note": .string(note)])]) }
        persist()
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
        let event = LiveGameEvent(seat: seat, ts: GameReducer.nowMillis(), kind: kind)
        let prev = state
        state = GameReducer.applyEvent(prev, event)
        events.append(event)
        appendLog(GameLog.diff(prev, state, reverse: { if case .prevTurn = kind { true } else { false } }()))
        noteKillsNeedingAttribution(prev: prev, next: state, kind: kind)
        persist()
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

    /// Die rolls never touch the state; they are logged directly.
    func logDiceRoll(label: String, rolls: [Int]) {
        appendLog([GameLogEvent(type: "dice_roll", payload: [
            "label": .string(label), "rolls": .array(rolls.map { .int($0) }), "total": .int(rolls.reduce(0, +)),
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
        guard let initialState else { return }   // nothing to resume until play starts
        ActiveGameStore.save(ActiveGame(
            clientGameId: clientGameId, startedAt: startedAt, initialState: initialState,
            events: events, log: log, state: state))
    }

    func discard() {
        ActiveGameStore.clear()
    }
}
