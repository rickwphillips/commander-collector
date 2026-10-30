import SwiftUI
import CommanderGameKit

/// The iPad lying flat, laid out like the web board: the left and right seats
/// run the full height of the table and are turned to face their players; the
/// top and bottom seats share the centre column with the turn tracker between
/// them. Every seat's overlays render inside that seat, so they face the
/// player too.
struct TableView: View {
    @Bindable var session: GameSession
    let onRestart: () -> Void
    @Environment(GameSettingsStore.self) private var settings
    @Environment(\.colorScheme) private var scheme
    @State private var seatingIdx: Int?
    @State private var showLog = false
    @State private var turnIndicatorOn = false
    @State private var introStarted = false

    private static let revealStep = 0.9
    private static let fadeSeconds = 0.8

    private func idx(_ position: SeatPosition) -> Int? {
        session.state.players.firstIndex { $0.position == position }
    }

    var body: some View {
        GeometryReader { geo in
            let w = geo.size.width, h = geo.size.height
            let count = session.state.players.count
            let sideW = min(max(w * 0.21, 160), 300)
            let leftW: CGFloat = count >= 3 ? (count == 3 ? min(max(w * 0.25, 200), 380) : sideW) : 0
            let rightW: CGFloat = count >= 4 ? sideW : 0
            let centerH = min(max(h * 0.18, 120), 220)
            let gap: CGFloat = 4
            TimelineView(.periodic(from: .now, by: 1)) { ctx in
                let elapsed = session.elapsedSeconds(now: ctx.date)
                HStack(spacing: gap) {
                    if let i = idx(.left) {
                        panel(i, elapsed: elapsed)
                            .frame(width: h, height: leftW)
                            .rotationEffect(.degrees(90))
                            .frame(width: leftW, height: h)
                    }
                    VStack(spacing: gap) {
                        if let i = idx(.top) {
                            panel(i, elapsed: elapsed).rotationEffect(.degrees(180))
                        }
                        CenterZoneView(session: session, showLog: $showLog, elapsedSeconds: elapsed, onRestart: onRestart)
                            .frame(height: centerH)
                        if let i = idx(.bottom) {
                            panel(i, elapsed: elapsed)
                        }
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    if let i = idx(.right) {
                        panel(i, elapsed: elapsed)
                            .frame(width: h, height: rightW)
                            .rotationEffect(.degrees(-90))
                            .frame(width: rightW, height: h)
                    }
                }
            }
            .padding(gap)
        }
        .background(Theme.tableBackground(scheme))
        .preferredColorScheme(settings.darkMode ? .dark : .light)
        .sheet(item: $seatingIdx) { i in
            SeatPickerSheet(session: session, idx: i, taken: Set(session.state.players.map(\.playerId)))
        }
        .sheet(isPresented: $showLog) {
            GameLogSheet(log: session.log)
        }
        .onChange(of: session.state.firstPlayerIdx, initial: true) { _, first in
            guard first != nil, !introStarted else { return }
            introStarted = true
            if session.firstPlayerChosenThisSession {
                let total = Double(max(0, session.state.players.count - 1)) * Self.revealStep + Self.fadeSeconds
                Task { try? await Task.sleep(for: .seconds(total)); turnIndicatorOn = true }
            } else {
                turnIndicatorOn = true
            }
        }
        .onChange(of: session.highestLivingPoison, initial: true) { _, poison in
            SoundService.shared.setPoisonLevel(session.isPlaying ? poison : 0)
        }
        .onDisappear { SoundService.shared.stopPoison() }
        .task { await CardArtService.shared.prewarm(session.state.players.flatMap { [$0.commander.name, $0.partner?.name ?? ""] }) }
    }

    /// Seat reveal delay: nil until a first player exists; 0 for every seat on
    /// a resume; otherwise the seat's ordinal in turn order × 0.9 s.
    private func backdropDelay(_ i: Int) -> Double? {
        guard let first = session.state.firstPlayerIdx, !session.state.isTwoHeadedGiant else {
            return session.state.isTwoHeadedGiant ? 0 : nil
        }
        guard session.firstPlayerChosenThisSession else { return 0 }
        let players = session.state.players
        let cw = SeatPosition.clockwise.compactMap { pos in players.firstIndex { $0.position == pos } }
        guard let start = cw.firstIndex(of: first) else { return 0 }
        let rotated = Array(cw[start...] + cw[..<start])
        return Double(rotated.firstIndex(of: i) ?? 0) * Self.revealStep
    }

    @ViewBuilder
    private func panel(_ i: Int, elapsed: Int) -> some View {
        if session.isSeating {
            SeatingPanel(player: session.state.players[i], teamNumber: session.state.players[i].teamNumber) {
                seatingIdx = i
            }
        } else {
            SeatPanel(session: session, idx: i, elapsedSeconds: elapsed, backdropDelay: backdropDelay(i),
                      backdropFlash: session.firstPlayerChosenThisSession, turnIndicatorOn: turnIndicatorOn)
        }
    }
}

extension Int: @retroactive Identifiable {
    public var id: Int { self }
}

/// A seat before the game starts (web `SeatingCard`): dashed border, the
/// position label, then either "Tap to choose player & deck" or the chosen
/// player, deck and commander with "Tap to edit".
struct SeatingPanel: View {
    let player: PlayerState
    let teamNumber: Int?
    let onTap: () -> Void
    @Environment(\.colorScheme) private var scheme

    private var filled: Bool { GameSetup.isSeatFilled(player) }

    var body: some View {
        Button(action: onTap) {
            ZStack(alignment: .topLeading) {
                VStack(spacing: 4) {
                    Text(player.position.rawValue.uppercased()).font(.system(size: 12, weight: .bold)).kerning(1).foregroundStyle(.secondary)
                    if filled {
                        Text(player.playerName).font(.system(size: 24, weight: .bold))
                        Text(player.deckName).font(.headline)
                        Text(player.partner.map { "\(player.commander.name) / \($0.name)" } ?? player.commander.name)
                            .font(.subheadline).foregroundStyle(.secondary)
                        Text("Tap to edit").font(.caption).foregroundStyle(.tertiary).padding(.top, 2)
                    } else {
                        Text("Tap to choose player & deck").font(.system(size: 18, weight: .semibold)).foregroundStyle(.secondary)
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .multilineTextAlignment(.center)
                if let teamNumber {
                    Text("TEAM \(teamNumber)").font(.system(size: 10, weight: .bold)).kerning(0.5).foregroundStyle(.white)
                        .padding(.horizontal, 6).padding(.vertical, 2)
                        .background(RoundedRectangle(cornerRadius: 4).fill(teamNumber == 1 ? Color.accentColor : .purple))
                        .padding(6)
                }
            }
            .background(RoundedRectangle(cornerRadius: 12).fill(filled ? Color.accentColor.opacity(0.08) : Theme.panelBackground(scheme)))
            .overlay(RoundedRectangle(cornerRadius: 12).strokeBorder(style: StrokeStyle(lineWidth: 2, dash: [8, 6])).foregroundStyle(filled ? Color.accentColor : Color.primary.opacity(0.2)))
        }
        .buttonStyle(.plain)
    }
}
