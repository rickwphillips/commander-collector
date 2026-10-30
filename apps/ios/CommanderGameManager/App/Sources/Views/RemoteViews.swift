import SwiftUI
import CoreImage.CIFilterBuiltins
import VisionKit
import CommanderGameKit

/// A QR code image for a seat's join link.
struct QRCodeView: View {
    let text: String
    var size: CGFloat = 120

    var body: some View {
        if let img = Self.image(for: text) {
            Image(uiImage: img).interpolation(.none).resizable().frame(width: size, height: size)
                .padding(8).background(Color.white).clipShape(RoundedRectangle(cornerRadius: 6))
        }
    }

    static func image(for text: String) -> UIImage? {
        let filter = CIFilter.qrCodeGenerator()
        filter.message = Data(text.utf8)
        filter.correctionLevel = "M"
        guard let out = filter.outputImage else { return nil }
        let scaled = out.transformed(by: CGAffineTransform(scaleX: 8, y: 8))
        guard let cg = CIContext().createCGImage(scaled, from: scaled.extent) else { return nil }
        return UIImage(cgImage: cg)
    }
}

/// In-seat overlay showing the seat's QR (web "QR overlay"): scan with the
/// phone's camera or from the Join screen in this app.
struct SeatQROverlay: View {
    let gameId: String
    let seat: SeatPosition
    let connected: Bool
    let onClose: () -> Void
    @Environment(\.colorScheme) private var scheme

    var body: some View {
        ZStack {
            Theme.overlayBackground(scheme).onTapGesture(perform: onClose)
            VStack(spacing: 10) {
                QRCodeView(text: TableLink.joinURL(gameId: gameId, seat: seat).absoluteString, size: 140)
                Text(connected ? "Phone connected" : "Scan to join this seat").font(.caption).foregroundStyle(connected ? .green : .secondary)
                Text("Open Commander on the phone, tap Join a table, and scan. Same Wi-Fi or Bluetooth range; no server needed.")
                    .font(.caption2).foregroundStyle(.tertiary).multilineTextAlignment(.center).frame(maxWidth: 240)
                Text("tap to close").font(.caption2).foregroundStyle(.tertiary)
            }
            .padding(12)
        }
        .transition(.opacity)
    }
}

/// The phone's entry: scan a seat's QR or pick a table and seat from the
/// list of tables advertising nearby.
struct JoinTableView: View {
    @State private var client = TableClient()
    @State private var showScanner = false
    @State private var scanError: String?
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Group {
                if client.status == .connected, let seat = client.seat {
                    RemoteSeatView(client: client, seat: seat)
                } else {
                    List {
                        Section {
                            if DataScannerViewController.isSupported {
                                Button { showScanner = true } label: { Label("Scan a seat's QR code", systemImage: "qrcode.viewfinder") }
                            }
                            if let scanError { Text(scanError).foregroundStyle(.red).font(.footnote) }
                        }
                        Section {
                            if client.tables.isEmpty {
                                HStack { ProgressView(); Text("Looking for a table nearby…").foregroundStyle(.secondary) }
                            }
                            ForEach(client.tables) { t in
                                VStack(alignment: .leading, spacing: 6) {
                                    Text(t.peer.displayName).font(.headline)
                                    HStack {
                                        ForEach(SeatPosition.clockwise, id: \.self) { pos in
                                            Button(pos.rawValue.capitalized) { client.join(t, seat: pos) }.buttonStyle(.bordered).controlSize(.small)
                                        }
                                    }
                                }
                            }
                        } header: {
                            Text("Tables nearby")
                        } footer: {
                            Text(client.status == .connecting ? "Connecting…" : client.status == .lost ? "Connection lost." : client.status == .ended ? "The game ended." : "Pick the seat you are sitting in.")
                        }
                    }
                }
            }
            .navigationTitle(client.status == .connected ? "" : "Join a table")
            .toolbar(client.status == .connected ? .hidden : .visible, for: .navigationBar)
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close") { client.leave(); dismiss() } } }
            .onChange(of: client.tables) { _, tables in
                if let seat = DemoMode.joinSeat, client.status == .searching, let t = tables.first { client.join(t, seat: seat) }
            }
            .sheet(isPresented: $showScanner) {
                QRScannerView { text in
                    showScanner = false
                    if let (game, seat) = TableLink.parseJoin(text) { client.join(gameId: game, seat: seat) } else { scanError = "That is not a seat code." }
                }
            }
        }
    }
}

/// VisionKit scanner for the seat QR.
struct QRScannerView: UIViewControllerRepresentable {
    let onScan: (String) -> Void

    func makeUIViewController(context: Context) -> DataScannerViewController {
        let vc = DataScannerViewController(recognizedDataTypes: [.barcode(symbologies: [.qr])], qualityLevel: .balanced, isHighlightingEnabled: true)
        vc.delegate = context.coordinator
        try? vc.startScanning()
        return vc
    }
    func updateUIViewController(_ uiViewController: DataScannerViewController, context: Context) {}
    func makeCoordinator() -> Coordinator { Coordinator(onScan: onScan) }

    final class Coordinator: NSObject, DataScannerViewControllerDelegate {
        let onScan: (String) -> Void
        init(onScan: @escaping (String) -> Void) { self.onScan = onScan }
        func dataScanner(_ dataScanner: DataScannerViewController, didAdd addedItems: [RecognizedItem], allItems: [RecognizedItem]) {
            for item in addedItems { if case .barcode(let b) = item, let s = b.payloadStringValue { onScan(s); return } }
        }
    }
}

/// The phone's seat: the same seat panel the table shows (or the team panel
/// in Two-Headed Giant), driven by a session in remote mode, plus the turn
/// control (tap = next turn, hold = previous) and the game log.
struct RemoteSeatView: View {
    let client: TableClient
    let seat: SeatPosition
    @State private var session: GameSession?
    @State private var showLog = false
    @State private var checkinTask: Task<Void, Never>?

    var body: some View {
        Group {
            if let session, let idx = session.state.players.firstIndex(where: { $0.position == seat }) {
                VStack(spacing: 6) {
                    if session.state.isTwoHeadedGiant, let team = session.state.players[idx].teamNumber {
                        TeamPanel(session: session, teamNumber: team, elapsedSeconds: 0, turnIndicatorOn: true)
                    } else {
                        SeatPanel(session: session, idx: idx, elapsedSeconds: 0, backdropDelay: 0, backdropFlash: false, turnIndicatorOn: true)
                    }
                    HStack {
                        Button { client.leave() } label: { Image(systemName: "xmark.circle") }.foregroundStyle(.secondary)
                        Spacer()
                        RemoteTurnControl(isYourTurn: session.state.currentPlayerIdx == idx || (session.state.isTwoHeadedGiant && session.state.players[session.state.currentPlayerIdx].teamNumber == session.state.players[idx].teamNumber),
                                          onNext: { session.dispatch(.passTurn) }, onPrev: { session.dispatch(.prevTurn) })
                        Spacer()
                        Button { showLog = true } label: { Image(systemName: "list.bullet.rectangle") }.foregroundStyle(.secondary)
                    }
                    .padding(.horizontal, 12).padding(.bottom, 6)
                }
                .padding(6)
                .background(Theme.tableBackground(.dark))
                .preferredColorScheme(.dark)
                .sheet(isPresented: $showLog) { GameLogSheet(log: session.log) }
            } else {
                VStack(spacing: 8) { ProgressView(); Text("Waiting for the table…").foregroundStyle(.secondary) }
            }
        }
        .onChange(of: client.state, initial: true) { _, s in
            guard let s else { return }
            if let session { session.applyRemoteState(s, log: client.log) }
            else {
                let fresh = GameSession(remote: s, seat: seat.rawValue) { [client] kind in client.send(kind) }
                fresh.applyRemoteState(s, log: client.log)
                session = fresh
            }
        }
        .onAppear {
            checkinTask = Task { @MainActor in
                while !Task.isCancelled { client.send(.checkin); try? await Task.sleep(for: .seconds(5)) }
            }
        }
        .onDisappear { checkinTask?.cancel() }
    }
}

/// Web `TurnNavControl`: always present on the phone; reads "Your Turn" when it is.
struct RemoteTurnControl: View {
    let isYourTurn: Bool
    let onNext: () -> Void
    let onPrev: () -> Void
    @State private var fired = false
    @State private var tip = false

    var body: some View {
        Text(isYourTurn ? "YOUR TURN" : "NEXT TURN")
            .font(.system(size: 15, weight: .heavy)).kerning(0.5)
            .padding(.horizontal, 24).padding(.vertical, 10)
            .background(RoundedRectangle(cornerRadius: 8).fill(isYourTurn ? Color.accentColor : .clear))
            .overlay(RoundedRectangle(cornerRadius: 8).strokeBorder(Color.accentColor, lineWidth: 2))
            .foregroundStyle(isYourTurn ? .white : Color.accentColor)
            .overlay(alignment: .top) { if tip { Text("Previous Turn").font(.caption2.bold()).padding(6).background(Capsule().fill(Color(.systemGray))).foregroundStyle(.white).offset(y: -30) } }
            .contentShape(Rectangle())
            .onTapGesture { if fired { fired = false; return }; onNext() }
            .onLongPressGesture(minimumDuration: 0.5) {
                fired = true; onPrev()
                withAnimation { tip = true }
                Task { try? await Task.sleep(for: .milliseconds(700)); withAnimation { tip = false } }
            }
    }
}
