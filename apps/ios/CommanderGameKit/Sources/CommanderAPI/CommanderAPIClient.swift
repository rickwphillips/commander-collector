import Foundation
import OpenAPIRuntime
import OpenAPIURLSession
import HTTPTypes

/// Where the PHP API lives. Matches the `servers` list in docs/openapi.yaml.
public enum CommanderServer {
    public static let production = URL(string: "https://rickwphillips.com/php-api")!
    public static let local = URL(string: "http://localhost:8081/php-api")!
}

/// Adds `Authorization: Bearer <token>` to every request when a token is
/// available. The token provider is read per request so a re-login takes
/// effect immediately without rebuilding the client.
public struct BearerAuthMiddleware: ClientMiddleware {
    public typealias TokenProvider = @Sendable () -> String?
    private let token: TokenProvider

    public init(token: @escaping TokenProvider) { self.token = token }

    public func intercept(
        _ request: HTTPRequest, body: HTTPBody?, baseURL: URL, operationID: String,
        next: @Sendable (HTTPRequest, HTTPBody?, URL) async throws -> (HTTPResponse, HTTPBody?)
    ) async throws -> (HTTPResponse, HTTPBody?) {
        var request = request
        if let token = token() {
            request.headerFields[.authorization] = "Bearer \(token)"
        }
        return try await next(request, body, baseURL)
    }
}

/// The host's web firewall rejects requests that do not look like a browser
/// (bare clients get a 406), so every request carries a browser-style
/// User-Agent and Accept header.
public struct BrowserHeadersMiddleware: ClientMiddleware {
    public init() {}
    public func intercept(
        _ request: HTTPRequest, body: HTTPBody?, baseURL: URL, operationID: String,
        next: @Sendable (HTTPRequest, HTTPBody?, URL) async throws -> (HTTPResponse, HTTPBody?)
    ) async throws -> (HTTPResponse, HTTPBody?) {
        var request = request
        request.headerFields[.userAgent] = "CommanderGameManager/1.0 (iPad; iOS) Mozilla/5.0 AppleWebKit/605.1.15 (KHTML, like Gecko)"
        if request.headerFields[.accept] == nil { request.headerFields[.accept] = "application/json" }
        return try await next(request, body, baseURL)
    }
}

public extension Client {
    /// A client for `server` whose requests carry the bearer token from `token`.
    static func commander(server: URL = CommanderServer.production, token: @escaping BearerAuthMiddleware.TokenProvider) -> Client {
        Client(
            serverURL: server,
            transport: URLSessionTransport(),
            middlewares: [BrowserHeadersMiddleware(), BearerAuthMiddleware(token: token)]
        )
    }
}
