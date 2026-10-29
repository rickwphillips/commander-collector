import SwiftUI
import CommanderGameKit

/// Placeholder for the iPad board. Phase 1 fills this in: seating, first-player
/// roll, life / commander damage / poison, turns and timer, elimination, winner
/// and the end summary, all driven by GameReducer and GameLog.
struct BoardView: View {
    let setup: GameSetupInput

    var body: some View {
        ContentUnavailableView(
            "Board coming next",
            systemImage: "rectangle.3.group",
            description: Text("\(setup.playerCount) players, \(setup.startingLife) life, \(setup.gameType == .twoHeadedGiant ? "Two-Headed Giant" : "standard").")
        )
        .navigationTitle("Game")
    }
}
