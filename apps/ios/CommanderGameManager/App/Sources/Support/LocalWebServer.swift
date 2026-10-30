import Foundation
import Network
import OSLog

private let log = Logger(subsystem: "com.rickwphillips.commander", category: "web-server")

/// A small HTTP/1.1 server on the local network so phones can open the web
/// player panel in a browser. Each connection carries one request; a server-
/// sent-events response keeps its connection open until the phone drops it.
final class LocalWebServer: @unchecked Sendable {
    struct Request: Sendable {
        let method: String
        let path: String
        let query: [String: String]
        let headers: [String: String]
        let body: Data

        subscript(_ name: String) -> String? { query[name] }
    }

    enum Response: Sendable {
        case data(status: Int, contentType: String, body: Data, headers: [String: String] = [:])
        /// Headers are written at once; the stream then stays open for `onOpen` to feed.
        case stream(onOpen: @Sendable (SSEStream) -> Void)

        static func json(_ object: Any, status: Int = 200) -> Response {
            let data = (try? JSONSerialization.data(withJSONObject: object)) ?? Data("{}".utf8)
            return .data(status: status, contentType: "application/json", body: data)
        }
        static func json(_ data: Data, status: Int = 200) -> Response { .data(status: status, contentType: "application/json", body: data) }
        static func text(_ s: String, status: Int = 200) -> Response { .data(status: status, contentType: "text/plain; charset=utf-8", body: Data(s.utf8)) }
        static func notFound(_ what: String = "Not found") -> Response { .text(what, status: 404) }
        static func redirect(_ location: String) -> Response { .data(status: 302, contentType: "text/plain", body: Data(), headers: ["Location": location]) }
    }

    typealias Handler = @Sendable (Request) async -> Response

    private let listener: NWListener
    private let queue = DispatchQueue(label: "commander.web-server")
    private let handler: Handler
    let port: UInt16

    init(port: UInt16 = 8080, handler: @escaping Handler) throws {
        self.handler = handler
        self.port = port
        let params = NWParameters.tcp
        params.allowLocalEndpointReuse = true
        listener = try NWListener(using: params, on: NWEndpoint.Port(rawValue: port)!)
        listener.newConnectionHandler = { [weak self] c in self?.accept(c) }
        listener.stateUpdateHandler = { state in
            switch state {
            case .ready: log.info("listening on port \(port)")
            case .failed(let e): log.error("listener failed: \(e.localizedDescription, privacy: .public)")
            default: break
            }
        }
    }

    func start() { listener.start(queue: queue) }
    func stop() { listener.cancel() }

    /// The iPad's Wi-Fi IPv4 address (en0), or nil when it is not on a network.
    static func lanAddress() -> String? {
        var addrs: UnsafeMutablePointer<ifaddrs>?
        guard getifaddrs(&addrs) == 0, let first = addrs else { return nil }
        defer { freeifaddrs(addrs) }
        var fallback: String?
        for p in sequence(first: first, next: { $0.pointee.ifa_next }) {
            let ifa = p.pointee
            guard let sa = ifa.ifa_addr, sa.pointee.sa_family == UInt8(AF_INET), (ifa.ifa_flags & UInt32(IFF_UP)) != 0 else { continue }
            var host = [CChar](repeating: 0, count: Int(NI_MAXHOST))
            guard getnameinfo(sa, socklen_t(sa.pointee.sa_len), &host, socklen_t(host.count), nil, 0, NI_NUMERICHOST) == 0 else { continue }
            let name = String(cString: ifa.ifa_name)
            let ip = String(cString: host)
            if ip.hasPrefix("127.") || ip.hasPrefix("169.254.") { continue }
            if name == "en0" { return ip }
            if fallback == nil, name.hasPrefix("en") || name.hasPrefix("bridge") { fallback = ip }
        }
        return fallback
    }

    // MARK: - Connections

    private func accept(_ connection: NWConnection) {
        let state = ConnectionState(connection: connection)
        connection.stateUpdateHandler = { s in if case .failed = s { connection.cancel() } }
        connection.start(queue: queue)
        receive(state)
    }

    private final class ConnectionState: @unchecked Sendable {
        let connection: NWConnection
        var buffer = Data()
        init(connection: NWConnection) { self.connection = connection }
    }

    private func receive(_ state: ConnectionState) {
        state.connection.receive(minimumIncompleteLength: 1, maximumLength: 1 << 16) { [weak self] data, _, isComplete, error in
            guard let self else { return }
            if let data { state.buffer.append(data) }
            if let request = Self.parse(state.buffer) {
                self.dispatch(request, on: state.connection)
                return
            }
            if error != nil || isComplete { state.connection.cancel(); return }
            self.receive(state)
        }
    }

    /// Parses one complete request from the buffer, or nil while more is needed.
    private static func parse(_ buffer: Data) -> Request? {
        guard let headerEnd = buffer.range(of: Data("\r\n\r\n".utf8)) else { return nil }
        guard let head = String(data: buffer[buffer.startIndex..<headerEnd.lowerBound], encoding: .utf8) else { return nil }
        var lines = head.components(separatedBy: "\r\n")
        let requestLine = lines.removeFirst().split(separator: " ", omittingEmptySubsequences: true)
        guard requestLine.count >= 2 else { return nil }
        var headers: [String: String] = [:]
        for line in lines {
            guard let colon = line.firstIndex(of: ":") else { continue }
            headers[line[..<colon].trimmingCharacters(in: .whitespaces).lowercased()] = line[line.index(after: colon)...].trimmingCharacters(in: .whitespaces)
        }
        let length = Int(headers["content-length"] ?? "0") ?? 0
        let bodyStart = headerEnd.upperBound
        guard buffer.count - (bodyStart - buffer.startIndex) >= length else { return nil }
        let body = buffer[bodyStart..<(bodyStart + length)]
        let target = String(requestLine[1])
        let parts = target.split(separator: "?", maxSplits: 1)
        let path = String(parts[0]).removingPercentEncoding ?? String(parts[0])
        var query: [String: String] = [:]
        if parts.count > 1 {
            for pair in parts[1].split(separator: "&") {
                let kv = pair.split(separator: "=", maxSplits: 1)
                let key = String(kv[0]).removingPercentEncoding ?? String(kv[0])
                let value = kv.count > 1 ? (String(kv[1]).replacingOccurrences(of: "+", with: " ").removingPercentEncoding ?? String(kv[1])) : ""
                query[key] = value
            }
        }
        return Request(method: String(requestLine[0]).uppercased(), path: path, query: query, headers: headers, body: Data(body))
    }

    private func dispatch(_ request: Request, on connection: NWConnection) {
        Task { [handler] in
            let response = await handler(request)
            switch response {
            case .data(let status, let type, let body, let extra):
                var head = "HTTP/1.1 \(status) \(Self.reason(status))\r\nContent-Type: \(type)\r\nContent-Length: \(body.count)\r\nConnection: close\r\nCache-Control: \(type.hasPrefix("application/json") ? "no-store" : "max-age=3600")\r\n"
                for (k, v) in extra { head += "\(k): \(v)\r\n" }
                head += "\r\n"
                var payload = Data(head.utf8)
                if request.method != "HEAD" { payload.append(body) }
                connection.send(content: payload, completion: .contentProcessed { _ in connection.cancel() })
            case .stream(let onOpen):
                let head = "HTTP/1.1 200 OK\r\nContent-Type: text/event-stream\r\nCache-Control: no-cache\r\nConnection: keep-alive\r\nX-Accel-Buffering: no\r\n\r\n"
                let stream = SSEStream(connection: connection)
                connection.send(content: Data(head.utf8), completion: .contentProcessed { _ in onOpen(stream) })
                connection.stateUpdateHandler = { s in
                    switch s {
                    case .cancelled, .failed: stream.isOpen = false
                    default: break
                    }
                }
                // Keep reading so a client close is noticed promptly.
                connection.receive(minimumIncompleteLength: 1, maximumLength: 1 << 12) { _, _, isComplete, error in
                    if isComplete || error != nil { stream.isOpen = false; connection.cancel() }
                }
            }
        }
    }

    private static func reason(_ status: Int) -> String {
        switch status {
        case 200: "OK"
        case 302: "Found"
        case 400: "Bad Request"
        case 404: "Not Found"
        default: "Error"
        }
    }
}

/// One phone's open event stream.
final class SSEStream: @unchecked Sendable {
    private let connection: NWConnection
    var isOpen = true
    init(connection: NWConnection) { self.connection = connection }

    /// Sends one `data:` message (already JSON).
    func send(json: String) { write("data: \(json)\n\n") }
    func send(raw: String) { write(raw) }

    private func write(_ text: String) {
        guard isOpen else { return }
        connection.send(content: Data(text.utf8), completion: .contentProcessed { [weak self] error in
            if error != nil { self?.isOpen = false }
        })
    }

    func close() { isOpen = false; connection.cancel() }
}
