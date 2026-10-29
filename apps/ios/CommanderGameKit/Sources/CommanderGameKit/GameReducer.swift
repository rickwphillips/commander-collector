import Foundation

/// Pure state transforms — port of apps/core/app/game-manager/remoteTransforms.ts.
///
/// Every function takes a state and returns the next one; nothing here touches
/// the clock, persistence or UI. `applyEvent` is the single entry point the
/// game log is folded through: `events.reduce(initial, applyEvent)` rebuilds the
/// board, which is what makes undo, replay and crash recovery free.
///
/// Function names and the order of operations follow the TypeScript so the two
/// implementations can be diffed side by side, and the shared fixtures in
/// Tests/CommanderGameKitTests/Fixtures prove they agree.
public enum GameReducer {
    /// 2HG teams lose at 15 poison (a single player loses at 10).
    public static let twoHeadedGiantPoisonThreshold = 15
    static let poisonThreshold = 10
    static let commanderDamageThreshold = 21

    // MARK: - Elimination causes

    /// True if ANY per-player elimination cause still holds. Gates every
    /// un-eliminate path so undoing one cause does not revive a player who is
    /// still dead by another.
    static func stillEliminated(life: Int, poison: Int, damageOnTarget: [Int: CommanderDamage]?) -> Bool {
        if life <= 0 { return true }
        if poison >= poisonThreshold { return true }
        if let row = damageOnTarget {
            for d in row.values where d.fromCommander >= commanderDamageThreshold || d.fromPartner >= commanderDamageThreshold {
                return true
            }
        }
        return false
    }

    /// Lines of `notes` that do not contain `tag`, re-joined — the web's
    /// `notes.split('\n').filter(l => !l.includes(tag)).join('\n')`.
    static func stripping(_ notes: String, tag: String) -> String {
        notes.components(separatedBy: "\n").filter { !$0.contains(tag) }.joined(separator: "\n")
    }

    /// `[notes, line].filter(Boolean).join('\n')`.
    static func appending(_ notes: String, line: String) -> String {
        [notes, line].filter { !$0.isEmpty }.joined(separator: "\n")
    }

    // MARK: - reconcileTeams

    /// The only place 2HG team semantics live. The per-seat reducers are
    /// 2HG-agnostic; after one runs, this mirrors shared life and poison across
    /// the two heads of each team and eliminates both together when any
    /// team-level loss condition holds (life 0, poison 15, 21 from one commander
    /// summed across heads, either head conceded). Elimination is recomputed
    /// from scratch so undo is self-correcting.
    public static func reconcileTeams(prev: GameState, next: GameState) -> GameState {
        guard next.isTwoHeadedGiant else { return next }

        var teams: [Int: [Int]] = [:]
        var teamOrder: [Int] = []
        for (i, p) in next.players.enumerated() {
            guard let t = p.teamNumber else { continue }
            if teams[t] == nil { teamOrder.append(t) }
            teams[t, default: []].append(i)
        }

        var players = next.players
        for t in teamOrder {
            let idxs = teams[t]!
            if idxs.count < 2 { continue }

            let lifeChanged = idxs.first { next.players[$0].life != prev.players[safe: $0]?.life }
            let teamLife = lifeChanged.map { next.players[$0].life } ?? next.players[idxs[0]].life

            let poisonChanged = idxs.first { next.players[$0].poison != prev.players[safe: $0]?.poison }
            let teamPoison = poisonChanged.map { next.players[$0].poison } ?? idxs.map { next.players[$0].poison }.max()!

            var sources = Set<Int>()
            for i in idxs { sources.formUnion(next.commanderDamage[i]?.keys ?? [:].keys) }
            var cmdKill = false
            for s in sources {
                var own = 0, partner = 0
                for i in idxs {
                    let d = next.commanderDamage[i, s]
                    own += d.fromCommander
                    partner += d.fromPartner
                }
                if own >= commanderDamageThreshold || partner >= commanderDamageThreshold { cmdKill = true }
            }

            let conceded = idxs.contains { next.players[$0].isConceded }
            let eliminated = teamLife <= 0 || teamPoison >= twoHeadedGiantPoisonThreshold || cmdKill || conceded
            let wasEliminated = idxs.allSatisfy { prev.players[safe: $0]?.isEliminated ?? false }
            var eliminatedTurn: Int? = nil
            if eliminated {
                eliminatedTurn = wasEliminated
                    ? (prev.players[safe: idxs[0]]?.eliminatedTurn ?? next.turnNumber)
                    : next.turnNumber
            }

            for i in idxs {
                players[i].life = teamLife
                players[i].poison = teamPoison
                players[i].isEliminated = eliminated
                players[i].eliminatedTurn = eliminatedTurn
            }
        }

        var out = next
        out.players = players
        return out
    }

    // MARK: - Per-seat transforms

    public static func applyLifeChange(_ state: GameState, idx: Int, delta: Int) -> GameState {
        let target = state.players[idx]
        let newLife = target.life + delta
        let isNewLifeKill = target.life > 0 && newLife <= 0
        let isUndoLifeKill = target.life <= 0 && newLife > 0
        // Only revive if restoring life clears the LAST elimination cause.
        let canRevive = isUndoLifeKill && target.isEliminated && !target.isConceded
            && !stillEliminated(life: newLife, poison: target.poison, damageOnTarget: state.commanderDamage[idx])
        var out = state
        if isUndoLifeKill {
            out.notes = stripping(state.notes, tag: "[lifekill:\(idx)]")
        }
        out.players[idx].life = newLife
        if isNewLifeKill && !target.isEliminated {
            out.players[idx].isEliminated = true
            out.players[idx].eliminatedTurn = state.turnNumber
        }
        if canRevive {
            out.players[idx].isEliminated = false
            out.players[idx].eliminatedTurn = nil
        }
        return out
    }

    public static func applyPoisonChange(_ state: GameState, idx: Int, delta: Int) -> GameState {
        let target = state.players[idx]
        var out = state
        let poison = max(0, target.poison + delta)
        let canRevive = target.isEliminated && !target.isConceded
            && !stillEliminated(life: target.life, poison: poison, damageOnTarget: state.commanderDamage[idx])
        let isEliminated = poison >= poisonThreshold ? true : (canRevive ? false : target.isEliminated)
        let eliminatedTurn: Int? = (poison >= poisonThreshold && !target.isEliminated)
            ? state.turnNumber
            : (isEliminated ? target.eliminatedTurn : nil)
        out.players[idx].poison = poison
        out.players[idx].isEliminated = isEliminated
        out.players[idx].eliminatedTurn = eliminatedTurn

        let isUndoPoisonKill = target.isEliminated && target.poison >= poisonThreshold && poison < poisonThreshold
        if isUndoPoisonKill {
            out.notes = stripping(state.notes, tag: "[poisonkill:\(idx)]")
        }
        return out
    }

    /// Each commander taxes independently; `isPartner` targets the second
    /// commander. Per-player even in 2HG — reconcileTeams never mirrors tax.
    public static func applyCommanderTaxChange(_ state: GameState, idx: Int, delta: Int, isPartner: Bool = false) -> GameState {
        var out = state
        if isPartner {
            out.players[idx].partnerCommanderTax = max(0, state.players[idx].partnerCommanderTax + delta)
        } else {
            out.players[idx].commanderTax = max(0, state.players[idx].commanderTax + delta)
        }
        return out
    }

    public static func applyEnergyChange(_ state: GameState, idx: Int, delta: Int) -> GameState {
        var out = state
        out.players[idx].energy = max(0, state.players[idx].energy + delta)
        return out
    }

    public static func applyExperienceChange(_ state: GameState, idx: Int, delta: Int) -> GameState {
        var out = state
        out.players[idx].experience = max(0, state.players[idx].experience + delta)
        return out
    }

    /// Monarch is exclusive: toggling it on one seat clears every other seat.
    public static func applyToggleMonarch(_ state: GameState, idx: Int) -> GameState {
        var out = state
        for i in out.players.indices {
            out.players[i].isMonarch = i == idx ? !state.players[i].isMonarch : false
        }
        return out
    }

    public static func applyToggleInitiative(_ state: GameState, idx: Int) -> GameState {
        var out = state
        for i in out.players.indices {
            out.players[i].hasInitiative = i == idx ? !state.players[i].hasInitiative : false
        }
        return out
    }

    public static func applyToggleCitysBlessing(_ state: GameState, idx: Int) -> GameState {
        var out = state
        out.players[idx].hasCitysBlessing.toggle()
        return out
    }

    public static func applyCommanderDamageChange(
        _ state: GameState, targetIdx: Int, sourceIdx: Int, isPartner: Bool, delta: Int
    ) -> GameState {
        let current = state.commanderDamage[targetIdx, sourceIdx]
        let newDmg = CommanderDamage(
            isPartner ? current.fromCommander : max(0, current.fromCommander + delta),
            isPartner ? max(0, current.fromPartner + delta) : current.fromPartner
        )
        var newMap = state.commanderDamage
        newMap[targetIdx, sourceIdx] = newDmg
        let actualDelta = newDmg.total - current.total
        let target = state.players[targetIdx]
        let source = state.players[sourceIdx]
        let newLife = target.life - actualDelta

        // 21 from a single commander is a cmd kill; life hitting 0 is attributed to the source.
        let isNewCmdKill = !target.isEliminated && (newDmg.fromCommander >= commanderDamageThreshold || newDmg.fromPartner >= commanderDamageThreshold)
        let isNewLifeKill = !target.isEliminated && target.life > 0 && newLife <= 0 && !isNewCmdKill
        let isNewElimination = isNewCmdKill || isNewLifeKill
        // Which note tag to strip; the actual revive checks EVERY cause.
        let isUndoCmdElim = target.isEliminated
            && (current.fromCommander >= commanderDamageThreshold || current.fromPartner >= commanderDamageThreshold)
            && newDmg.fromCommander < commanderDamageThreshold && newDmg.fromPartner < commanderDamageThreshold
        let isUndoLifeElim = !isUndoCmdElim && target.isEliminated && target.life <= 0 && newLife > 0 && target.poison < poisonThreshold
        let isUndoElimination = target.isEliminated && !target.isConceded
            && !stillEliminated(life: newLife, poison: target.poison, damageOnTarget: newMap[targetIdx])

        let cmdLabel = source.partner.map { "\(source.commander.name) / \($0.name)" } ?? source.commander.name
        let cmdKillNoteTag = "[cmdkill:\(targetIdx):\(sourceIdx)]"
        let lifeKillNoteTag = "[lifekill:\(targetIdx):\(sourceIdx)]"
        let cmdKillLine = "\(cmdKillNoteTag) \(target.playerName) eliminated by \(cmdLabel) (\(source.playerName)) commander damage (turn \(state.turnNumber))"
        let lifeKillLine = "\(lifeKillNoteTag) \(target.playerName) brought to 0 life by \(cmdLabel) (\(source.playerName)) (turn \(state.turnNumber))"

        var out = state
        if isNewCmdKill { out.notes = appending(state.notes, line: cmdKillLine) }
        else if isNewLifeKill { out.notes = appending(state.notes, line: lifeKillLine) }
        else if isUndoCmdElim { out.notes = stripping(state.notes, tag: cmdKillNoteTag) }
        else if isUndoLifeElim { out.notes = stripping(state.notes, tag: lifeKillNoteTag) }

        out.commanderDamage = newMap
        out.players[targetIdx].life = target.life - actualDelta
        if isNewElimination {
            out.players[targetIdx].isEliminated = true
            out.players[targetIdx].eliminatedTurn = state.turnNumber
        }
        if isUndoElimination {
            out.players[targetIdx].isEliminated = false
            out.players[targetIdx].eliminatedTurn = nil
        }
        return out
    }

    /// Concede: eliminated at the current turn with a plain note line.
    public static func applyEliminate(_ state: GameState, idx: Int) -> GameState {
        let target = state.players[idx]
        let note = "\(target.playerName) conceded (turn \(state.turnNumber))"
        var out = state
        out.notes = state.notes.isEmpty ? note : "\(state.notes)\n\(note)"
        out.players[idx].isEliminated = true
        out.players[idx].isConceded = true
        out.players[idx].eliminatedTurn = state.turnNumber
        return out
    }

    public static func applyUndoEliminate(_ state: GameState, idx: Int) -> GameState {
        var out = state
        out.players[idx].isEliminated = false
        out.players[idx].isConceded = false
        out.players[idx].eliminatedTurn = nil
        return out
    }

    public static func applyLifeKillAttr(_ state: GameState, targetIdx: Int, sourcePlayerIdx: Int?) -> GameState {
        let target = state.players[targetIdx]
        let source = sourcePlayerIdx.map { state.players[$0] }
        let tag = "[lifekill:\(targetIdx)]"
        let line = source.map { "\(tag) \(target.playerName) brought to 0 life by \($0.playerName) (turn \(state.turnNumber))" }
            ?? "\(tag) \(target.playerName) brought to 0 life (turn \(state.turnNumber))"
        var out = state
        out.notes = appending(state.notes, line: line)
        return out
    }

    public static func applyPoisonKillAttr(_ state: GameState, targetIdx: Int, sourcePlayerIdx: Int?) -> GameState {
        let target = state.players[targetIdx]
        let source = sourcePlayerIdx.map { state.players[$0] }
        let tag = "[poisonkill:\(targetIdx)]"
        let line = source.map { "\(tag) \(target.playerName) eliminated by \($0.playerName)'s poison (turn \(state.turnNumber))" }
            ?? "\(tag) \(target.playerName) eliminated by poison (turn \(state.turnNumber))"
        var out = state
        out.notes = appending(state.notes, line: line)
        return out
    }

    public static func applyCheckin(_ state: GameState, seat: String, ts: Double) -> GameState {
        var out = state
        var map = state.remoteCheckins ?? [:]
        map[seat] = ts
        out.remoteCheckins = map
        return out
    }

    // MARK: - Turns

    /// 2HG: hand the turn to the other team as a unit. The turn number counts
    /// rounds: forward, it increments when play returns to the team that
    /// started; backward, it decrements when leaving the starting team.
    static func passTeamTurn(_ state: GameState, direction: Int, now: Double) -> GameState {
        let players = state.players
        let firstIdx = state.firstPlayerIdx ?? 0
        guard let curTeam = players[safe: state.currentPlayerIdx]?.teamNumber else { return state }
        let firstTeam = players[safe: firstIdx]?.teamNumber
        guard let nextIdx = players.firstIndex(where: { $0.teamNumber != nil && $0.teamNumber != curTeam && !$0.isEliminated }) else {
            return state
        }
        var newTurnNumber = state.turnNumber
        if direction > 0 {
            if players[nextIdx].teamNumber == firstTeam { newTurnNumber = state.turnNumber + 1 }
        } else if curTeam == firstTeam {
            if state.turnNumber == 1 { return state }
            newTurnNumber = state.turnNumber - 1
        }
        var out = state
        out.currentPlayerIdx = nextIdx
        out.turnNumber = newTurnNumber
        out.turnStartTime = now
        return out
    }

    /// Next turn: clockwise to the next live seat; the turn number increments
    /// when play passes through the first player's seat.
    public static func applyPassTurn(_ state: GameState, now: Double = nowMillis()) -> GameState {
        if state.isTwoHeadedGiant { return passTeamTurn(state, direction: +1, now: now) }
        let players = state.players
        let firstIdx = state.firstPlayerIdx ?? 0
        let curCW = players[state.currentPlayerIdx].position.clockwiseIndex
        let firstCW = players[firstIdx].position.clockwiseIndex
        var nextPlayerIdx = -1
        var stepsToNext = 0
        for step in 1...4 {
            let nextPos = SeatPosition.clockwise[(curCW + step) % 4]
            if let idx = players.firstIndex(where: { $0.position == nextPos && !$0.isEliminated }) {
                nextPlayerIdx = idx
                stepsToNext = step
                break
            }
        }
        if nextPlayerIdx == -1 { return state }
        let distToFirst = (firstCW - curCW + 4) % 4
        let newTurnNumber = (distToFirst >= 1 && distToFirst <= stepsToNext) ? state.turnNumber + 1 : state.turnNumber
        var out = state
        out.currentPlayerIdx = nextPlayerIdx
        out.turnNumber = newTurnNumber
        out.turnStartTime = now
        return out
    }

    /// Mirror of applyPassTurn going backwards. Refuses to step below turn 1.
    public static func applyPrevTurn(_ state: GameState, now: Double = nowMillis()) -> GameState {
        if state.isTwoHeadedGiant { return passTeamTurn(state, direction: -1, now: now) }
        let players = state.players
        let firstIdx = state.firstPlayerIdx ?? 0
        let curCW = players[state.currentPlayerIdx].position.clockwiseIndex
        let firstCW = players[firstIdx].position.clockwiseIndex
        var prevPlayerIdx = -1
        var stepsBack = 0
        for step in 1...4 {
            let prevPos = SeatPosition.clockwise[(curCW - step + 4) % 4]
            if let idx = players.firstIndex(where: { $0.position == prevPos && !$0.isEliminated }) {
                prevPlayerIdx = idx
                stepsBack = step
                break
            }
        }
        if prevPlayerIdx == -1 { return state }
        let distBackToFirst = (curCW - firstCW + 4) % 4
        let wouldDecrement = distBackToFirst < stepsBack
        if wouldDecrement && state.turnNumber == 1 { return state }
        var out = state
        out.currentPlayerIdx = prevPlayerIdx
        out.turnNumber = wouldDecrement ? max(1, state.turnNumber - 1) : state.turnNumber
        out.turnStartTime = now
        return out
    }

    static func applySetTeamName(_ state: GameState, team: Int, name: String) -> GameState {
        let trimmed = String(name.trimmingCharacters(in: .whitespacesAndNewlines).prefix(32))
        if trimmed.isEmpty { return state }
        var out = state
        var names = state.teamNames ?? [:]
        names[team] = trimmed
        out.teamNames = names
        return out
    }

    // MARK: - Dispatch

    /// Milliseconds since the epoch, as `Date.now()` on the web.
    public static func nowMillis() -> Double { (Date().timeIntervalSince1970 * 1000).rounded() }

    /// Apply one event. For 2HG the per-seat change is then folded into shared
    /// team life/poison and joint elimination. Unknown events return the state
    /// unchanged. `now` only matters for turn changes (turnStartTime).
    public static func applyEvent(_ state: GameState, _ event: LiveGameEvent, now: Double = nowMillis()) -> GameState {
        let next = applyEventInner(state, event, now: now)
        return reconcileTeams(prev: state, next: next)
    }

    /// Fold a whole log. `events.reduce(initial, applyEvent)`.
    public static func fold(_ initial: GameState, events: [LiveGameEvent], now: Double = nowMillis()) -> GameState {
        events.reduce(initial) { applyEvent($0, $1, now: now) }
    }

    static func applyEventInner(_ state: GameState, _ event: LiveGameEvent, now: Double) -> GameState {
        switch event.kind {
        case .lifeChange(let i, let d): return applyLifeChange(state, idx: i, delta: d)
        case .poisonChange(let i, let d): return applyPoisonChange(state, idx: i, delta: d)
        case .commanderTaxChange(let i, let d, let p): return applyCommanderTaxChange(state, idx: i, delta: d, isPartner: p)
        case .energyChange(let i, let d): return applyEnergyChange(state, idx: i, delta: d)
        case .experienceChange(let i, let d): return applyExperienceChange(state, idx: i, delta: d)
        case .toggleMonarch(let i): return applyToggleMonarch(state, idx: i)
        case .toggleInitiative(let i): return applyToggleInitiative(state, idx: i)
        case .toggleCitysBlessing(let i): return applyToggleCitysBlessing(state, idx: i)
        case .commanderDamageChange(let t, let s, let p, let d):
            return applyCommanderDamageChange(state, targetIdx: t, sourceIdx: s, isPartner: p, delta: d)
        case .eliminate(let i): return applyEliminate(state, idx: i)
        case .undoEliminate(let i): return applyUndoEliminate(state, idx: i)
        case .passTurn: return applyPassTurn(state, now: now)
        case .prevTurn: return applyPrevTurn(state, now: now)
        case .setTeamName(let team, let name): return applySetTeamName(state, team: team, name: name)
        case .checkin: return applyCheckin(state, seat: event.seat, ts: event.ts)
        case .lifeKillAttr(let i, let s): return applyLifeKillAttr(state, targetIdx: i, sourcePlayerIdx: s)
        case .poisonKillAttr(let i, let s): return applyPoisonKillAttr(state, targetIdx: i, sourcePlayerIdx: s)
        case .unknown: return state
        }
    }
}
