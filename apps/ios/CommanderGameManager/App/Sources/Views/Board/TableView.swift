import SwiftUI
import CommanderGameKit

/// The iPad lying flat: each seat's panel faces its player. bottom is upright,
/// top is upside down, left and right are turned to face the sides. The centre
/// holds the turn tracker.
struct TableView: View {
    @Bindable var session: GameSession
    @State private var seatingIdx: Int?
    @State private var showLog = false

    private func idx(_ position: SeatPosition) -> Int? {
        session.state.players.firstIndex { $0.position == position }
    }

    var body: some View {
        GeometryReader { geo in
            let w = geo.size.width
            let h = geo.size.height
            let sideW = min(w * 0.22, 300)          // rotated side panels: their on-screen width
            let endH = min(h * 0.28, 320)           // top/bottom panels: their on-screen height
            let hasSides = idx(.left) != nil || idx(.right) != nil
            VStack(spacing: 8) {
                if let i = idx(.top) {
                    panel(i).frame(height: endH).rotationEffect(.degrees(180))
                }
                HStack(spacing: 8) {
                    if let i = idx(.left) {
                        panel(i)
                            .frame(width: h - 2 * endH - 32, height: sideW)
                            .rotationEffect(.degrees(90))
                            .frame(width: sideW, height: h - 2 * endH - 32)
                    }
                    CenterZoneView(session: session, showLog: $showLog)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                    if let i = idx(.right) {
                        panel(i)
                            .frame(width: h - 2 * endH - 32, height: sideW)
                            .rotationEffect(.degrees(-90))
                            .frame(width: sideW, height: h - 2 * endH - 32)
                    } else if hasSides {
                        Color.clear.frame(width: sideW)
                    }
                }
                if let i = idx(.bottom) {
                    panel(i).frame(height: endH)
                }
            }
            .padding(8)
        }
        .background(Color(.systemGroupedBackground))
        .sheet(item: $seatingIdx) { i in
            SeatPickerSheet(session: session, idx: i, taken: Set(session.state.players.map(\.playerId)))
        }
        .sheet(isPresented: $showLog) {
            GameLogSheet(log: session.log)
        }
        .sheet(item: $session.pendingKillAttribution) { pending in
            KillAttributionSheet(session: session, pending: pending)
        }
    }

    @ViewBuilder
    private func panel(_ i: Int) -> some View {
        if session.isSeating {
            SeatingPanel(player: session.state.players[i], teamNumber: session.state.players[i].teamNumber) {
                seatingIdx = i
            }
        } else {
            SeatPanel(session: session, idx: i)
        }
    }
}

extension Int: @retroactive Identifiable {
    public var id: Int { self }
}

/// A seat before the game starts: who sits here.
struct SeatingPanel: View {
    let player: PlayerState
    let teamNumber: Int?
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 6) {
                if let teamNumber {
                    Text("Team \(teamNumber)").font(.caption).foregroundStyle(.secondary)
                }
                if GameSetup.isSeatFilled(player) {
                    Text(player.playerName).font(.title2.bold())
                    Text(player.deckName).font(.headline)
                    Text(player.partner.map { "\(player.commander.name) / \($0.name)" } ?? player.commander.name)
                        .font(.subheadline).foregroundStyle(.secondary)
                } else {
                    Image(systemName: "person.crop.circle.badge.plus").font(.system(size: 40))
                    Text("Tap to seat a player").font(.headline)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(RoundedRectangle(cornerRadius: 20).fill(Color(.secondarySystemGroupedBackground)))
        }
        .buttonStyle(.plain)
    }
}
