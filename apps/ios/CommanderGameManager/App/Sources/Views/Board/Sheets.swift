import SwiftUI
import SwiftData
import CommanderGameKit

/// The derived game log, newest last.
struct GameLogSheet: View {
    let log: [GameLogEvent]
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List(Array(log.enumerated()), id: \.offset) { _, e in
                VStack(alignment: .leading, spacing: 2) {
                    Text(describe(e)).font(.body)
                    Text(e.type).font(.caption2).foregroundStyle(.tertiary)
                }
            }
            .navigationTitle("Game log")
            .toolbar { ToolbarItem(placement: .confirmationAction) { Button("Done") { dismiss() } } }
        }
    }

    private func str(_ v: JSONValue?) -> String {
        switch v {
        case .string(let s): s
        case .int(let i): String(i)
        case .double(let d): String(d)
        case .bool(let b): b ? "on" : "off"
        case .array(let a): a.map { str($0) }.joined(separator: ", ")
        default: ""
        }
    }

    private func describe(_ e: GameLogEvent) -> String {
        let p = e.payload ?? [:]
        switch e.type {
        case "game_started": return "Game started (\(str(p["gameType"])), \(str(p["startingLife"])) life)"
        case "turn_order": return "\(str(p["firstPlayer"])) goes first. Order: \(str(p["order"]))"
        case "pass_turn": return "Turn \(str(p["turn"])): \(str(p["to"]))"
        case "turn_revert": return "Turn stepped back to \(str(p["turn"])): \(str(p["to"]))"
        case "turn_change": return "Turn \(str(p["turn"]))"
        case "life_change": return "\(str(p["player"])) life \(str(p["from"])) → \(str(p["to"]))"
        case "poison_change": return "\(str(p["player"])) poison \(str(p["from"])) → \(str(p["to"]))"
        case "commander_damage": return "\(str(p["source"])) dealt commander damage to \(str(p["target"])): \(str(p["from"])) → \(str(p["to"]))"
        case "eliminate":
            let by = p["source"].map { " by " + str($0) } ?? ""
            return "\(str(p["player"])) eliminated (\(str(p["cause"]))\(by)), turn \(str(p["turn"]))"
        case "concede": return "\(str(p["player"])) conceded"
        case "monarch": return "\(str(p["player"])) monarch \(str(p["value"]))"
        case "initiative": return "\(str(p["player"])) initiative \(str(p["value"]))"
        case "citys_blessing": return "\(str(p["player"])) City's Blessing \(str(p["value"]))"
        case "energy_change": return "\(str(p["player"])) energy → \(str(p["to"]))"
        case "experience_change": return "\(str(p["player"])) experience → \(str(p["to"]))"
        case "commander_tax": return "\(str(p["player"])) commander tax → \(str(p["to"]))"
        case "first_player_roll": return str(p["note"])
        case "roll_for_first":
            if case .array(let rs)? = p["rolls"] {
                let parts = rs.map { r -> String in
                    if case .object(let o) = r { return "\(str(o["player"])) \(str(o["roll"]))" }
                    return ""
                }
                return "Roll for first: \(parts.joined(separator: ", "))"
            }
            return "Roll for first"
        case "die_roll":
            let total = p["total"].map { str($0) } ?? ""
            return "Rolled \(str(p["die"])): \(str(p["rolls"]))" + (total.isEmpty ? "" : " (total \(total))")
        case "kill_attribution": return "\(str(p["player"]))'s \(str(p["cause"])) kill credited to \(str(p["source"]).isEmpty ? "unknown" : str(p["source"]))"
        case "game_ended": return "Game ended on turn \(str(p["turn"]))"
        default: return e.type
        }
    }
}
