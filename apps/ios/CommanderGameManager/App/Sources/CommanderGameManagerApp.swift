import SwiftUI
import UIKit
import SwiftData

/// Orientation is decided per screen: the board locks to landscape (either
/// way up, so the iPad can be turned 180° on the table) and every other
/// screen turns freely.
final class OrientationDelegate: NSObject, UIApplicationDelegate {
    nonisolated(unsafe) static var mask: UIInterfaceOrientationMask = .all

    func application(_ application: UIApplication, supportedInterfaceOrientationsFor window: UIWindow?) -> UIInterfaceOrientationMask {
        Self.mask
    }

    /// Sets the mask and turns the current scene to match it right away.
    @MainActor
    static func lock(_ newMask: UIInterfaceOrientationMask) {
        mask = newMask
        guard let scene = UIApplication.shared.connectedScenes.first(where: { $0 is UIWindowScene }) as? UIWindowScene else { return }
        scene.requestGeometryUpdate(.iOS(interfaceOrientations: newMask)) { _ in }
        scene.keyWindow?.rootViewController?.setNeedsUpdateOfSupportedInterfaceOrientations()
    }
}

@main
struct CommanderGameManagerApp: App {
    @UIApplicationDelegateAdaptor(OrientationDelegate.self) private var orientation
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
        if DemoMode.joinSeat != nil {
            JoinTableView()
        } else if session.isSignedIn {
            HomeView()
        } else {
            LoginView()
        }
    }
}
