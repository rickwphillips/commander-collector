import SwiftUI
import SwiftData

@main
struct CommanderGameManagerApp: App {
    /// Reference data (players, decks) and the finished-game outbox live in one
    /// SwiftData store so the game can be set up and finished with no network.
    let container: ModelContainer = {
        let schema = Schema([CachedPlayer.self, CachedDeck.self, OutboxGame.self])
        do {
            let config = ModelConfiguration(schema: schema, isStoredInMemoryOnly: DemoMode.usesFakeAccount)
            let container = try ModelContainer(for: schema, configurations: [config])
            DemoMode.seed(container.mainContext)
            if DemoMode.wantsBoard { ActiveGameStore.save(DemoMode.board(from: container.mainContext)) }
            return container
        } catch {
            fatalError("SwiftData store could not be opened: \(error)")
        }
    }()

    @State private var session = Session()
    @State private var settings = GameSettingsStore()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(session)
                .environment(settings)
        }
        .modelContainer(container)
    }
}

/// Signed-out → LoginView. Signed in → the game manager. The token is read from
/// the Keychain at launch, so a cold start at the table goes straight to the board.
struct RootView: View {
    @Environment(Session.self) private var session

    var body: some View {
        if session.isSignedIn {
            HomeView()
        } else {
            LoginView()
        }
    }
}
