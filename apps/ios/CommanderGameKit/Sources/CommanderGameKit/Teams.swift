/// 2HG team labelling — port of apps/core/app/lib/teams.ts. One source of truth
/// for how a team is named so the native log matches the web's word for word.
public enum Teams {
    /// The editable custom name when set (non-blank), otherwise "Team N".
    public static func name(_ teamNumber: Int?, teamNames: [Int: String]?) -> String {
        if let t = teamNumber, let custom = teamNames?[t]?.trimmingCharacters(in: .whitespacesAndNewlines), !custom.isEmpty {
            return custom
        }
        return "Team \(teamNumber.map(String.init) ?? "null")"
    }

    /// The opposing team's number in a two-team game.
    /// Whether the team has been given a name of its own.
    public static func hasCustomName(_ teamNumber: Int?, teamNames: [Int: String]?) -> Bool {
        guard let t = teamNumber, let custom = teamNames?[t] else { return false }
        return !custom.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    public static func other(_ teamNumber: Int) -> Int { teamNumber == 1 ? 2 : 1 }

    /// "Name (A / B)".
    public static func label(_ teamNumber: Int?, players: [PlayerState], teamNames: [Int: String]?) -> String {
        // One pilot on both heads (1v1 2HG) is named once.
        var members: [String] = []
        for name in players.filter({ $0.teamNumber == teamNumber }).map(\.playerName) where !members.contains(name) { members.append(name) }
        return "\(name(teamNumber, teamNames: teamNames)) (\(members.joined(separator: " / ")))"
    }
}

import Foundation
