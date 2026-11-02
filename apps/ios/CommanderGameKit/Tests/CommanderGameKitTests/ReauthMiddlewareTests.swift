import XCTest
import HTTPTypes
import OpenAPIRuntime
@testable import CommanderAPI

/// `ReauthMiddleware`: a 401 asks for a new token and retries once with it,
/// resending the buffered body; any other status passes straight through.
final class ReauthMiddlewareTests: XCTestCase {
    private struct Seen: Sendable { var auth: String?; var body: String }

    private func run(statuses: [HTTPResponse.Status], newToken: String?) async throws -> (HTTPResponse, [Seen], Int) {
        let box = Box()
        let mw = ReauthMiddleware(reauthorize: { await box.bumpReauth(); return newToken })
        var request = HTTPRequest(method: .post, scheme: "https", authority: "x", path: "/decks.php")
        request.headerFields[.authorization] = "Bearer old"
        let (resp, _) = try await mw.intercept(request, body: HTTPBody("payload"), baseURL: URL(string: "https://x")!, operationID: "op") { req, body, _ in
            let text = try await String(collecting: body ?? HTTPBody(""), upTo: 1024)
            let idx = await box.record(Seen(auth: req.headerFields[.authorization], body: text))
            return (HTTPResponse(status: statuses[min(idx, statuses.count - 1)]), nil)
        }
        return (resp, await box.seen, await box.reauths)
    }

    func testPassesThroughNon401() async throws {
        let (resp, seen, reauths) = try await run(statuses: [.ok], newToken: "new")
        XCTAssertEqual(resp.status, .ok)
        XCTAssertEqual(seen.count, 1)
        XCTAssertEqual(reauths, 0)
    }

    func testRetriesOnceWithNewTokenAndSameBody() async throws {
        let (resp, seen, reauths) = try await run(statuses: [.unauthorized, .ok], newToken: "new")
        XCTAssertEqual(resp.status, .ok)
        XCTAssertEqual(reauths, 1)
        XCTAssertEqual(seen.map(\.auth), ["Bearer old", "Bearer new"])
        XCTAssertEqual(seen.map(\.body), ["payload", "payload"])
    }

    func testGivesUpWhenReauthFails() async throws {
        let (resp, seen, reauths) = try await run(statuses: [.unauthorized, .ok], newToken: nil)
        XCTAssertEqual(resp.status, .unauthorized)
        XCTAssertEqual(seen.count, 1)
        XCTAssertEqual(reauths, 1)
    }

    func testDoesNotLoopOnRepeated401() async throws {
        let (resp, seen, _) = try await run(statuses: [.unauthorized, .unauthorized], newToken: "new")
        XCTAssertEqual(resp.status, .unauthorized)
        XCTAssertEqual(seen.count, 2)
    }

    private actor Box {
        var seen: [Seen] = []
        var reauths = 0
        func record(_ s: Seen) -> Int { seen.append(s); return seen.count - 1 }
        func bumpReauth() { reauths += 1 }
    }
}
