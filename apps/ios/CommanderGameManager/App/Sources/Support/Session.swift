import Foundation
import Observation
import CommanderAPI
import OpenAPIRuntime

/// Who is signed in and the API client that acts for them. The token and the
/// password live in the Keychain: the server's tokens last 24 hours, so the
/// client signs in again by itself when one expires (see `ReauthMiddleware`).
/// Only an explicit Sign out ends the session; clearing the cache, a failed
/// refresh or an expired token never do.
@Observable
@MainActor
final class Session {
    private static let tokenAccount = "jwt"
    private static let passwordAccount = "password"
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
        return Client.commander(server: server, token: { token }, reauthorize: { [weak self] in
            guard let task = await MainActor.run(body: { self?.reauthenticate() }) else { return nil }
            return await task.value
        })
    }

    /// Signs in again with the stored credentials and returns the new token,
    /// or nil when there is nothing stored or the server refuses them. Runs
    /// one login at a time so parallel 401s share a single attempt.
    private var reauthTask: Task<String?, Never>?
    private func reauthenticate() -> Task<String?, Never>? {
        if let reauthTask { return reauthTask }
        guard !DemoMode.usesFakeAccount, let username, let password = KeychainStore.read(Self.passwordAccount) else { return nil }
        let task = Task<String?, Never> { @MainActor [weak self] in
            defer { self?.reauthTask = nil }
            do {
                try await self?.signIn(username: username, password: password)
                return self?.token
            } catch {
                return nil
            }
        }
        reauthTask = task
        return task
    }

    func signIn(username: String, password: String) async throws {
        let anonymous = Client.commander(server: server, token: { nil })
        let response = try await anonymous.login(body: .json(.init(username: username, password: password)))
        switch response {
        case .ok(let ok):
            let body = try ok.body.json
            KeychainStore.write(body.token, account: Self.tokenAccount)
            KeychainStore.write(password, account: Self.passwordAccount)
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
        KeychainStore.delete(Self.passwordAccount)
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
    /// A 401 that re-authentication could not clear.
    case sessionExpired
    case server(String)

    var errorDescription: String? {
        switch self {
        case .badCredentials: "Wrong username or password."
        case .sessionExpired: "Your sign-in expired and could not be renewed. Sign out and back in."
        case .server(let message): message
        }
    }
}
