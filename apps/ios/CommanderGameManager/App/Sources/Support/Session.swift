import Foundation
import Observation
import CommanderAPI
import OpenAPIRuntime

/// Who is signed in and the API client that acts for them. The token lives in
/// the Keychain; expiry never blocks play, it only blocks upload and refresh.
@Observable
@MainActor
final class Session {
    private static let tokenAccount = "jwt"
    private static let serverKey = "apiServer"

    private(set) var token: String?
    private(set) var username: String?
    /// The account's id, which a player row carries as `userId` when linked.
    private(set) var userId: String?
    var server: URL

    init() {
        if DemoMode.usesFakeAccount {
            token = "demo"
            username = "demo"
            userId = nil
            server = CommanderServer.local
            return
        }
        token = KeychainStore.read(Self.tokenAccount)
        username = UserDefaults.standard.string(forKey: "username")
        userId = UserDefaults.standard.string(forKey: "userId")
        server = UserDefaults.standard.url(forKey: Self.serverKey) ?? CommanderServer.production
    }

    var isSignedIn: Bool { token != nil }

    /// A client bound to the current server whose requests carry the current token.
    var client: Client {
        let token = self.token
        return Client.commander(server: server, token: { token })
    }

    func signIn(username: String, password: String) async throws {
        let anonymous = Client.commander(server: server, token: { nil })
        let response = try await anonymous.login(body: .json(.init(username: username, password: password)))
        switch response {
        case .ok(let ok):
            let body = try ok.body.json
            KeychainStore.write(body.token, account: Self.tokenAccount)
            UserDefaults.standard.set(body.user.username, forKey: "username")
            UserDefaults.standard.set(body.user.id, forKey: "userId")
            self.token = body.token
            self.username = body.user.username
            self.userId = body.user.id
        case .unauthorized:
            throw SessionError.badCredentials
        case .badRequest(let bad):
            throw SessionError.server((try? bad.body.json.error) ?? "Bad request")
        case .undocumented(let status, _):
            throw SessionError.server("Unexpected response \(status)")
        }
    }

    func signOut() {
        KeychainStore.delete(Self.tokenAccount)
        UserDefaults.standard.removeObject(forKey: "userId")
        token = nil
        username = nil
        userId = nil
    }

    func useServer(_ url: URL) {
        server = url
        UserDefaults.standard.set(url, forKey: Self.serverKey)
    }
}

enum SessionError: LocalizedError {
    case badCredentials
    case server(String)

    var errorDescription: String? {
        switch self {
        case .badCredentials: "Wrong username or password."
        case .server(let message): message
        }
    }
}
