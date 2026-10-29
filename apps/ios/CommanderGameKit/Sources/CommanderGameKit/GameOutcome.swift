import Foundation

/// Winner detection, first-player rolls and the save payload — ports of the
/// corresponding pieces of GameBoard.tsx / page.tsx.
public enum GameOutcome {
    /// Seats still in the game.
    public static func activeSeats(_ state: GameState) -> [Int] {
        state.players.indices.filter { !state.players[$0].isEliminated }
    }

    /// The winning seat once the game is decided: the last player standing, or in
    /// 2HG any seat of the last team standing. nil while more than one side lives.
    public static func winnerIdx(_ state: GameState) -> Int? {
        let alive = activeSeats(state)
        if state.isTwoHeadedGiant {
            let teams = Set(alive.compactMap { state.players[$0].teamNumber })
            return teams.count == 1 ? alive.first : nil
        }
        return alive.count == 1 ? alive.first : nil
    }

    /// One row of the `results[]` POST games.php takes.
    public struct Result: Hashable, Sendable {
        public var deckId: String
        public var playerId: String
        public var finishPosition: Int
        public var eliminatedTurn: Int?
        public var teamNumber: Int?
    }

    /// Finish positions as handleSaveGame derives them: the survivor is 1st and
    /// the eliminated are ordered by how late they fell. 2HG places the
    /// surviving team 1st and the other team 2nd.
    public static func results(_ state: GameState) -> [Result] {
        if state.isTwoHeadedGiant {
            let winningTeam = state.players.first { !$0.isEliminated }?.teamNumber
            return state.players.map { p in
                let won = p.teamNumber != nil && p.teamNumber == winningTeam
                return Result(deckId: p.deckId, playerId: p.playerId, finishPosition: won ? 1 : 2,
                              eliminatedTurn: won ? nil : p.eliminatedTurn, teamNumber: p.teamNumber)
            }
        }
        var out: [Result] = []
        if let winner = state.players.first(where: { !$0.isEliminated }) {
            out.append(Result(deckId: winner.deckId, playerId: winner.playerId, finishPosition: 1, eliminatedTurn: nil, teamNumber: nil))
        }
        // Stable sort, descending by eliminatedTurn (nil counts as 0), as the web's sort does.
        let losers = state.players.filter(\.isEliminated).enumerated()
            .sorted { a, b in
                let ta = a.element.eliminatedTurn ?? 0, tb = b.element.eliminatedTurn ?? 0
                return ta != tb ? ta > tb : a.offset < b.offset
            }
            .map(\.element)
        for (i, p) in losers.enumerated() {
            out.append(Result(deckId: p.deckId, playerId: p.playerId, finishPosition: i + 2, eliminatedTurn: p.eliminatedTurn, teamNumber: nil))
        }
        return out
    }

    /// Notes with the machine-readable kill tags stripped, nil when empty.
    public static func cleanNotes(_ notes: String) -> String? {
        let stripped = notes.replacing(/\[(?:cmdkill|poisonkill):[^\]]+\]\s*/, with: "")
            .trimmingCharacters(in: .whitespacesAndNewlines)
        return stripped.isEmpty ? nil : stripped
    }

    public struct Roll: Hashable, Sendable {
        public var idx: Int
        public var roll: Int
    }
    public struct RollResult: Hashable, Sendable {
        public var winnerIdx: Int
        public var detail: String
        public var rolls: [Roll]
    }

    /// Standard start-of-game roll-off: every seat rolls a d20, highest goes
    /// first, ties among the top rollers are re-rolled between them.
    public static func rollForFirstPlayer(_ state: GameState, using rng: inout some RandomNumberGenerator) -> RollResult {
        var contenders = activeSeats(state)
        var rounds: [[Roll]] = []
        for _ in 0..<50 {
            let rolls = contenders.map { Roll(idx: $0, roll: Int.random(in: 1...20, using: &rng)) }
            rounds.append(rolls)
            let top = rolls.max { $0.roll < $1.roll }!.roll
            let leaders = rolls.filter { $0.roll == top }
            if leaders.count == 1 {
                let winner = leaders[0].idx
                let summary = rounds.map { round in round.map { "\(state.players[$0.idx].playerName) \($0.roll)" }.joined(separator: ", ") }
                    .joined(separator: "; re-roll: ")
                return RollResult(winnerIdx: winner, detail: "Roll (d20): \(summary). \(state.players[winner].playerName) goes first.", rolls: rounds.flatMap { $0 })
            }
            contenders = leaders.map(\.idx)
        }
        let winner = contenders[0]
        return RollResult(winnerIdx: winner, detail: "Roll: \(state.players[winner].playerName) goes first.", rolls: rounds.flatMap { $0 })
    }

    /// 2HG roll — port of rollForFirstTeam: every active player rolls a d20 and
    /// the roll is redone only when the highest is tied across opposing teams.
    public static func rollForFirstTeam(_ state: GameState, using rng: inout some RandomNumberGenerator) -> RollResult {
        let active = activeSeats(state)
        var rolls: [Roll] = []
        for _ in 0..<50 {
            rolls = active.map { Roll(idx: $0, roll: Int.random(in: 1...20, using: &rng)) }
            let top = rolls.max { $0.roll < $1.roll }!.roll
            let leaders = rolls.filter { $0.roll == top }
            let teams = Set(leaders.map { state.players[$0.idx].teamNumber })
            if teams.count > 1 { continue }
            let winner = leaders[0].idx
            let team = state.players[winner].teamNumber.map(String.init) ?? "?"
            let summary = rolls.map { "\(state.players[$0.idx].playerName) \($0.roll)" }.joined(separator: ", ")
            return RollResult(winnerIdx: winner, detail: "2HG roll (d20): \(summary). Team \(team) (\(state.players[winner].playerName)) goes first.", rolls: rolls)
        }
        let winner = active[0]
        return RollResult(winnerIdx: winner, detail: "2HG roll: Team \(state.players[winner].teamNumber.map(String.init) ?? "?") goes first.", rolls: rolls)
    }
}
