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

/// Tokens expire (24 h on the server). When a request comes back 401 this asks
/// `reauthorize` for a fresh token and retries the request once with it, so an
/// expired token at the table never surfaces as a sign-out. The request body is
/// buffered so the retry can resend it.
public struct ReauthMiddleware: ClientMiddleware {
    public typealias Reauthorizer = @Sendable () async -> String?
    private let reauthorize: Reauthorizer
    private let maxBodyBytes: Int

    public init(reauthorize: @escaping Reauthorizer, maxBodyBytes: Int = 8 * 1024 * 1024) {
        self.reauthorize = reauthorize
        self.maxBodyBytes = maxBodyBytes
    }

    public func intercept(
        _ request: HTTPRequest, body: HTTPBody?, baseURL: URL, operationID: String,
        next: @Sendable (HTTPRequest, HTTPBody?, URL) async throws -> (HTTPResponse, HTTPBody?)
    ) async throws -> (HTTPResponse, HTTPBody?) {
        var buffered: Data?
        if let body { buffered = try await Data(collecting: body, upTo: maxBodyBytes) }
        let firstBody = buffered.map { HTTPBody($0) }
        let (response, responseBody) = try await next(request, firstBody, baseURL)
        guard response.status == .unauthorized, let token = await reauthorize() else {
            return (response, responseBody)
        }
        var retry = request
        retry.headerFields[.authorization] = "Bearer \(token)"
        return try await next(retry, buffered.map { HTTPBody($0) }, baseURL)
    }
}

public extension Client {
    /// A client for `server` whose requests carry the bearer token from `token`.
    /// With `reauthorize`, a 401 is answered by asking for a new token and
    /// retrying once (see `ReauthMiddleware`).
    static func commander(server: URL = CommanderServer.production,
                          token: @escaping BearerAuthMiddleware.TokenProvider,
                          reauthorize: ReauthMiddleware.Reauthorizer? = nil) -> Client {
        var middlewares: [any ClientMiddleware] = [BrowserHeadersMiddleware()]
        // Outermost first: the bearer header is set before re-auth sees the
        // request, and re-auth overrides it on the retry.
        if let reauthorize { middlewares.append(ReauthMiddleware(reauthorize: reauthorize)) }
        middlewares.append(BearerAuthMiddleware(token: token))
        return Client(serverURL: server, transport: URLSessionTransport(), middlewares: middlewares)
    }
}
