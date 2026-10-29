import SwiftUI
import SwiftData
import CommanderGameKit

/// The game screen. Seating and play share the table layout; the end summary
/// replaces it once the host ends the game.
struct BoardView: View {
    @State private var session: GameSession
    @Environment(\.dismiss) private var dismiss

    init(setup: GameSetupInput) {
        _session = State(initialValue: GameSession(setup: setup))
    }

    init(resuming game: ActiveGame) {
        _session = State(initialValue: GameSession(resuming: game))
    }

    var body: some View {
        Group {
            if session.hasEnded {
                EndSummaryView(session: session, onDone: { dismiss() })
            } else {
                TableView(session: session)
            }
        }
        .navigationBarBackButtonHidden(session.isPlaying)
        .toolbar(.hidden, for: .navigationBar)
        .statusBarHidden(true)
        .persistentSystemOverlays(.hidden)
    }
}
