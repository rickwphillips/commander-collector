import Foundation
import CommanderGameKit

/// The biggest commander-damage threat against a seat (web
/// `computeThreatSource`): the opposing commander (or partner) that has dealt
/// the most, with intensity ramping from 7 damage to lethal at 21.
struct ThreatSource: Equatable {
    var commanderName: String
    var sourceIdx: Int
    var intensity: Double
    var damage: Int

    static func compute(targetIdx: Int, state: GameState, tiebreakSource: Int?) -> ThreatSource? {
        guard !state.players[targetIdx].isEliminated, let incoming = state.commanderDamage[targetIdx] else { return nil }
        struct Candidate { let srcIdx: Int; let partner: Bool; let dmg: Int }
        var candidates: [Candidate] = []
        for (src, dmg) in incoming where state.players.indices.contains(src) {
            if dmg.fromCommander > 0 { candidates.append(Candidate(srcIdx: src, partner: false, dmg: dmg.fromCommander)) }
            if dmg.fromPartner > 0 { candidates.append(Candidate(srcIdx: src, partner: true, dmg: dmg.fromPartner)) }
        }
        guard let best = candidates.sorted(by: { a, b in
            if a.dmg != b.dmg { return a.dmg > b.dmg }
            if a.srcIdx == tiebreakSource { return true }
            if b.srcIdx == tiebreakSource { return false }
            return a.srcIdx < b.srcIdx
        }).first else { return nil }
        let src = state.players[best.srcIdx]
        let name = best.partner ? (src.partner?.name ?? "") : src.commander.name
        return ThreatSource(commanderName: name, sourceIdx: best.srcIdx,
                            intensity: max(0, min(Double(best.dmg - 7) / 14, 1)), damage: best.dmg)
    }
}
