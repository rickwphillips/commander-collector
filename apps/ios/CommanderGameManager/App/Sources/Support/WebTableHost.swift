import CryptoKit
import Foundation
import Observation
import OSLog
import CommanderGameKit

private let log = Logger(subsystem: "com.rickwphillips.commander", category: "web-table")

/// The iPad as the web app's server for phones at the table: serves the web
/// player panel (the static export bundled as `RemoteWeb`) and answers the
/// handful of PHP endpoints that page uses, from this game's own state. A
/// phone opens the seat link in its browser; no app, no account, no server.
///
/// Seat codes derive from the game id, so the same QR keeps working after a
/// resume or a relaunch, and a phone that lost the page just reopens it.
@MainActor
@Observable
final class WebTableHost {
    static let basePath = "/app/projects/commander"
    static let port: UInt16 = 8080
    /// The host for the game on the table right now (the seat QR reads it).
    static weak var current: WebTableHost?

    let gameId: String
    private(set) var codes: [SeatPosition: String] = [:]
    private(set) var address: String?
    var onEvent: ((LiveGameEvent) -> Void)?

    private var server: LocalWebServer?
    private var streams: [SSEStream] = []
    private var latest: (state: GameState, log: [GameLogEvent])?
    private var keepalive: Task<Void, Never>?
    private var settle: Task<Void, Never>?
    private var artIds: [String: String] = [:]
    private let encoder: JSONEncoder = { let e = JSONEncoder(); return e }()

    init(gameId: String) {
        self.gameId = gameId
        for seat in SeatPosition.allCases { codes[seat] = Self.code(gameId: gameId, seat: seat) }
        address = LocalWebServer.lanAddress()
        do {
            let s = try LocalWebServer(port: Self.port) { [weak self] req in
                guard let self else { return .notFound() }
                return await self.handle(req)
            }
            s.start()
            server = s
            for seat in SeatPosition.allCases { log.info("seat \(seat.rawValue, privacy: .public): \(self.seatURL(seat)?.absoluteString ?? "no network", privacy: .public)") }
        } catch {
            log.error("could not start the web server: \(error.localizedDescription, privacy: .public)")
        }
        keepalive = Task { [weak self] in
            while !Task.isCancelled {
                try? await Task.sleep(for: .seconds(15))
                self?.pulse()
            }
        }
    }

    isolated deinit {
        keepalive?.cancel()
        settle?.cancel()
        streams.forEach { $0.close() }
        server?.stop()
    }

    /// `http://<ipad ip>:8080/app/projects/commander/game-manager/remote/?code=<seat code>`
    func seatURL(_ seat: SeatPosition) -> URL? {
        address = LocalWebServer.lanAddress()
        guard let address, let code = codes[seat] else { return nil }
        return URL(string: "http://\(address):\(Self.port)\(Self.basePath)/game-manager/remote/?code=\(code)")
    }

    func seat(forCode code: String) -> SeatPosition? { codes.first { $0.value == code }?.key }

    func broadcast(_ state: GameState, log: [GameLogEvent]) {
        latest = (state, log)
        push(state)
        // The web panel ignores pushes for a short grace period after it
        // sends an event (its optimistic update is ahead of the table), so a
        // change from another seat in that window would be missed until the
        // next push. Send the authoritative state again once every phone's
        // grace period has passed; the table is the source of truth.
        guard settle == nil else { return }
        settle = Task { [weak self] in
            try? await Task.sleep(for: .milliseconds(Self.settleDelayMs))
            guard !Task.isCancelled, let self else { return }
            self.settle = nil
            if let latest = self.latest { self.push(latest.state) }
        }
    }

    /// Just past the web panel's POST_EVENT_GRACE_MS (1500 ms).
    private static let settleDelayMs = 2000

    private func push(_ state: GameState) {
        guard let json = stateMessage(state) else { return }
        streams.removeAll { !$0.isOpen }
        streams.forEach { $0.send(json: json) }
    }

    func end() {
        let msg = "{\"type\":\"inactive\"}"
        streams.forEach { $0.send(json: msg); $0.close() }
        streams.removeAll()
        latest = nil
    }

    private func pulse() {
        streams.removeAll { !$0.isOpen }
        streams.forEach { $0.send(raw: ": ping\n\n") }
    }

    private static func code(gameId: String, seat: SeatPosition) -> String {
        SHA256.hash(data: Data("\(gameId):\(seat.rawValue)".utf8)).prefix(4).map { String(format: "%02x", $0) }.joined()
    }

    private func stateMessage(_ state: GameState) -> String? {
        guard let data = try? encoder.encode(state), let json = String(data: data, encoding: .utf8) else { return nil }
        return "{\"type\":\"state\",\"state\":\(json)}"
    }

    // MARK: - Routing

    func handle(_ req: LocalWebServer.Request) async -> LocalWebServer.Response {
        if req.path.hasPrefix("/php-api/") { return await api(req) }
        return staticFile(req)
    }

    private func api(_ req: LocalWebServer.Request) async -> LocalWebServer.Response {
        // The web joins its base and endpoint as `/php-api//live-game.php`.
        let endpoint = String(req.path.dropFirst("/php-api/".count)).trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        switch endpoint {
        case "live-game.php":
            guard let code = req["code"], let seat = seat(forCode: code) else { return .json(["error": "Code not found"], status: 404) }
            switch req.method {
            case "GET":
                guard let latest, let state = try? encoder.encode(latest.state), let stateJSON = String(data: state, encoding: .utf8) else {
                    return .json(["seat": seat.rawValue, "is_active": false, "remote_events": [], "updated_at": Self.now()])
                }
                let body = "{\"seat\":\"\(seat.rawValue)\",\"state\":\(stateJSON),\"remote_events\":[],\"updated_at\":\"\(Self.now())\",\"is_active\":true}"
                return .json(Data(body.utf8))
            case "POST":
                guard req["action"] == "event",
                      let wrapper = try? JSONDecoder().decode(EventWrapper.self, from: req.body) else { return .json(["error": "event required"], status: 400) }
                var event = wrapper.event
                event.seat = seat.rawValue
                if case .unknown = event.kind {} else { log.info("event \(event.typeName, privacy: .public) from \(seat.rawValue, privacy: .public)") }
                onEvent?(event)
                return .json(["ok": true])
            default:
                return .json(["ok": true])
            }
        case "live-game-stream.php":
            guard let code = req["code"], seat(forCode: code) != nil else {
                return .stream { s in s.send(raw: "retry: 3000\n"); s.send(json: "{\"type\":\"inactive\"}"); s.close() }
            }
            let first = latest.flatMap { stateMessage($0.state) }
            return .stream { [weak self] stream in
                stream.send(raw: "retry: 3000\n")
                if let first { stream.send(json: first) } else { stream.send(json: "{\"type\":\"inactive\"}") }
                Task { @MainActor in self?.streams.append(stream) }
            }
        case "game-log.php":
            guard let code = req["code"], seat(forCode: code) != nil, let latest,
                  let events = try? encoder.encode(latest.log), let json = String(data: events, encoding: .utf8) else { return .json(["events": []]) }
            return .json(Data("{\"events\":\(json)}".utf8))
        case "scryfall-cache.php":
            guard let name = req["name"], !name.isEmpty else { return .json(["results": []]) }
            guard let record = await CardArtService.shared.cardRecord(for: name) else { return .json(NSNull()) }
            let id = Self.artId(name)
            artIds[id] = name
            return .json(["scryfall_id": id, "name": name, "image_uri": record.normal?.absoluteString ?? NSNull(),
                          "colors": record.colorIdentity ?? "", "color_identity": record.colorIdentity ?? "", "type_line": NSNull(), "mana_cost": NSNull()])
        case "card-image.php":
            guard let id = req["scryfall_id"], let name = artIds[id] else { return .json(["error": "unknown card"], status: 404) }
            let wantsArt = !(req["art"] ?? "").isEmpty
            let data = wantsArt ? await CardArtService.shared.artCropData(for: name) : await CardArtService.shared.cardImageData(for: name)
            guard let data else { return .json(["error": "No image"], status: 404) }
            return .json(["data_uri": "data:image/jpeg;base64,\(data.base64EncodedString())", "cached": true])
        default:
            return .json(["error": "Not available at the table"], status: 404)
        }
    }

    private struct EventWrapper: Decodable { var event: LiveGameEvent }

    private static func artId(_ name: String) -> String {
        SHA256.hash(data: Data(name.utf8)).prefix(16).map { String(format: "%02x", $0) }.joined()
    }

    private static func now() -> String { ISO8601DateFormatter().string(from: .now) }

    // MARK: - Static files (the web app's export, bundled as RemoteWeb)

    private static let contentTypes: [String: String] = [
        "html": "text/html; charset=utf-8", "js": "application/javascript", "css": "text/css", "json": "application/json",
        "svg": "image/svg+xml", "png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg", "webp": "image/webp",
        "ico": "image/x-icon", "mp3": "audio/mpeg", "woff2": "font/woff2", "woff": "font/woff", "txt": "text/plain",
    ]

    private func staticFile(_ req: LocalWebServer.Request) -> LocalWebServer.Response {
        guard let root = Bundle.main.url(forResource: "RemoteWeb", withExtension: nil) else {
            return .text("The web panel is not bundled in this build (run apps/ios/scripts/bundle-remote-web.sh).", status: 404)
        }
        var path = req.path
        if path == "/" || path == Self.basePath || path == Self.basePath + "/" {
            return .redirect(Self.basePath + "/game-manager/remote/")
        }
        if path.hasPrefix(Self.basePath) { path = String(path.dropFirst(Self.basePath.count)) }
        guard !path.contains("..") else { return .notFound() }
        var url = root.appendingPathComponent(path)
        var isDir: ObjCBool = false
        if FileManager.default.fileExists(atPath: url.path, isDirectory: &isDir), isDir.boolValue {
            url = url.appendingPathComponent("index.html")
        }
        guard let data = try? Data(contentsOf: url) else { return .notFound() }
        let type = Self.contentTypes[url.pathExtension.lowercased()] ?? "application/octet-stream"
        return .data(status: 200, contentType: type, body: data)
    }
}
