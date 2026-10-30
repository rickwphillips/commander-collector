import Foundation
@preconcurrency import MultipeerConnectivity
import Observation
import OSLog
import CommanderGameKit

private let log = Logger(subsystem: "com.rickwphillips.commander", category: "table-link")

/// What the host and a remote phone say to each other. The host owns the
/// game; a phone sends events for its seat and receives the whole state back,
/// exactly as the web remote does over the server, but here over the local
/// network with nothing in between.
enum RemoteMessage: Codable, Sendable {
    case join(seat: String)
    case state(GameState, log: [GameLogEvent])
    case event(LiveGameEvent)
    case ended
}

enum TableLink {
    static let serviceType = "cmdr-game"
    static let scheme = "cmdr"

    /// The QR payload for a seat: `cmdr://join?game=<id>&seat=<position>`.
    static func joinURL(gameId: String, seat: SeatPosition) -> URL {
        var c = URLComponents()
        c.scheme = scheme; c.host = "join"
        c.queryItems = [URLQueryItem(name: "game", value: gameId), URLQueryItem(name: "seat", value: seat.rawValue)]
        return c.url!
    }

    static func parseJoin(_ text: String) -> (gameId: String, seat: SeatPosition)? {
        guard let c = URLComponents(string: text), c.scheme == scheme, c.host == "join",
              let game = c.queryItems?.first(where: { $0.name == "game" })?.value,
              let seatRaw = c.queryItems?.first(where: { $0.name == "seat" })?.value,
              let seat = SeatPosition(rawValue: seatRaw) else { return nil }
        return (game, seat)
    }

    static func encode(_ m: RemoteMessage) -> Data? { try? JSONEncoder().encode(m) }
    static func decode(_ d: Data) -> RemoteMessage? { try? JSONDecoder().decode(RemoteMessage.self, from: d) }
}

// MARK: - Host

/// The iPad's side: advertises the game, accepts phones, maps each to the
/// seat it joined, forwards their events to the session and pushes every
/// state change back to all of them.
@Observable
@MainActor
final class TableHost {
    private(set) var connectedSeats: [String: MCPeerID] = [:]
    var onEvent: ((LiveGameEvent) -> Void)?
    private let peer: MCPeerID
    private let session: MCSession
    private let advertiser: MCNearbyServiceAdvertiser
    private let relay = Relay()
    private var latest: (GameState, [GameLogEvent])?

    init(gameId: String) {
        peer = MCPeerID(displayName: "Commander table")
        session = MCSession(peer: peer, securityIdentity: nil, encryptionPreference: .required)
        advertiser = MCNearbyServiceAdvertiser(peer: peer, discoveryInfo: ["game": gameId], serviceType: TableLink.serviceType)
        session.delegate = relay
        advertiser.delegate = relay
        relay.host = self
        relay.session = session
        advertiser.startAdvertisingPeer()
    }

    isolated deinit {
        advertiser.stopAdvertisingPeer()
        session.disconnect()
    }

    func broadcast(_ state: GameState, log: [GameLogEvent]) {
        latest = (state, log)
        send(.state(state, log: log), to: session.connectedPeers)
    }

    func end() {
        send(.ended, to: session.connectedPeers)
    }

    private func send(_ m: RemoteMessage, to peers: [MCPeerID]) {
        guard !peers.isEmpty, let data = TableLink.encode(m) else { return }
        try? session.send(data, toPeers: peers, with: .reliable)
    }

    fileprivate func received(_ m: RemoteMessage, from p: MCPeerID) {
        switch m {
        case .join(let seat):
            log.info("phone \(p.displayName, privacy: .public) joined seat \(seat, privacy: .public)")
            connectedSeats[seat] = p
            if let latest { send(.state(latest.0, log: latest.1), to: [p]) }
        case .event(let e):
            log.info("event \(e.typeName, privacy: .public) from seat \(e.seat, privacy: .public)")
            onEvent?(e)
        case .state, .ended:
            break
        }
    }

    fileprivate func lost(_ p: MCPeerID) {
        connectedSeats = connectedSeats.filter { $0.value != p }
    }

    /// Multipeer calls back on its own queues; everything hops to the main actor.
    private final class Relay: NSObject, MCSessionDelegate, MCNearbyServiceAdvertiserDelegate, @unchecked Sendable {
        weak var host: TableHost?
        /// Answered on Multipeer's own queue; the session is set once at init.
        nonisolated(unsafe) var session: MCSession?

        func advertiser(_ advertiser: MCNearbyServiceAdvertiser, didReceiveInvitationFromPeer peerID: MCPeerID, withContext context: Data?, invitationHandler: @escaping (Bool, MCSession?) -> Void) {
            invitationHandler(true, session)
        }
        func session(_ session: MCSession, peer peerID: MCPeerID, didChange state: MCSessionState) {
            if state == .notConnected { Task { @MainActor in self.host?.lost(peerID) } }
        }
        func session(_ session: MCSession, didReceive data: Data, fromPeer peerID: MCPeerID) {
            guard let m = TableLink.decode(data) else { return }
            Task { @MainActor in self.host?.received(m, from: peerID) }
        }
        func session(_ session: MCSession, didReceive stream: InputStream, withName streamName: String, fromPeer peerID: MCPeerID) {}
        func session(_ session: MCSession, didStartReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, with progress: Progress) {}
        func session(_ session: MCSession, didFinishReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, at localURL: URL?, withError error: Error?) {}
    }
}

// MARK: - Phone

/// A phone's side: finds tables nearby, joins one seat, mirrors the host's
/// state and sends this seat's events.
@Observable
@MainActor
final class TableClient {
    struct Table: Identifiable, Hashable {
        let peer: MCPeerID
        let gameId: String
        var id: String { peer.displayName + gameId }
    }
    enum Status: Equatable { case searching, connecting, connected, ended, lost }

    private(set) var tables: [Table] = []
    private(set) var status: Status = .searching
    private(set) var state: GameState?
    private(set) var log: [GameLogEvent] = []
    private(set) var seat: SeatPosition?
    private let peer: MCPeerID
    private let session: MCSession
    private let browser: MCNearbyServiceBrowser
    private let relay = Relay()
    private var target: Table?

    init() {
        peer = MCPeerID(displayName: UIDevice.current.name)
        session = MCSession(peer: peer, securityIdentity: nil, encryptionPreference: .required)
        browser = MCNearbyServiceBrowser(peer: peer, serviceType: TableLink.serviceType)
        session.delegate = relay
        browser.delegate = relay
        relay.client = self
        browser.startBrowsingForPeers()
    }

    isolated deinit {
        browser.stopBrowsingForPeers()
        session.disconnect()
    }

    func join(_ table: Table, seat: SeatPosition) {
        target = table
        self.seat = seat
        status = .connecting
        browser.invitePeer(table.peer, to: session, withContext: nil, timeout: 20)
    }

    /// From a scanned QR: join the table advertising that game id, once seen.
    func join(gameId: String, seat: SeatPosition) {
        self.seat = seat
        if let t = tables.first(where: { $0.gameId == gameId }) { join(t, seat: seat) } else { target = Table(peer: peer, gameId: gameId) }
    }

    func send(_ kind: LiveGameEvent.Kind) {
        guard let seat, status == .connected else { return }
        let e = LiveGameEvent(seat: seat.rawValue, ts: GameReducer.nowMillis(), kind: kind)
        if let data = TableLink.encode(.event(e)) { try? session.send(data, toPeers: session.connectedPeers, with: .reliable) }
    }

    func leave() {
        session.disconnect()
        status = .lost
    }

    fileprivate func found(_ p: MCPeerID, info: [String: String]?) {
        guard let game = info?["game"] else { return }
        let t = Table(peer: p, gameId: game)
        if !tables.contains(t) { tables.append(t) }
        if let target, target.gameId == game, target.peer == peer, let seat { join(t, seat: seat) }
    }

    fileprivate func lostPeer(_ p: MCPeerID) {
        tables.removeAll { $0.peer == p }
    }

    fileprivate func changed(_ p: MCPeerID, to s: MCSessionState) {
        switch s {
        case .connected:
            status = .connected
            if let seat, let data = TableLink.encode(.join(seat: seat.rawValue)) { try? session.send(data, toPeers: [p], with: .reliable) }
        case .notConnected:
            if status == .connected || status == .connecting { status = .lost }
        default: break
        }
    }

    fileprivate func received(_ m: RemoteMessage) {
        switch m {
        case .state(let s, let l): state = s; log = l
        case .ended: status = .ended
        case .join, .event: break
        }
    }

    private final class Relay: NSObject, MCSessionDelegate, MCNearbyServiceBrowserDelegate, @unchecked Sendable {
        weak var client: TableClient?

        func browser(_ browser: MCNearbyServiceBrowser, foundPeer peerID: MCPeerID, withDiscoveryInfo info: [String: String]?) {
            Task { @MainActor in self.client?.found(peerID, info: info) }
        }
        func browser(_ browser: MCNearbyServiceBrowser, lostPeer peerID: MCPeerID) {
            Task { @MainActor in self.client?.lostPeer(peerID) }
        }
        func session(_ session: MCSession, peer peerID: MCPeerID, didChange state: MCSessionState) {
            Task { @MainActor in self.client?.changed(peerID, to: state) }
        }
        func session(_ session: MCSession, didReceive data: Data, fromPeer peerID: MCPeerID) {
            guard let m = TableLink.decode(data) else { return }
            Task { @MainActor in self.client?.received(m) }
        }
        func session(_ session: MCSession, didReceive stream: InputStream, withName streamName: String, fromPeer peerID: MCPeerID) {}
        func session(_ session: MCSession, didStartReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, with progress: Progress) {}
        func session(_ session: MCSession, didFinishReceivingResourceWithName resourceName: String, fromPeer peerID: MCPeerID, at localURL: URL?, withError error: Error?) {}
    }
}
