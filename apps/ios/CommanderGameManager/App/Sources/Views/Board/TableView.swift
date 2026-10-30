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
    @State private var host: TableHost?
    @State private var webHost: WebTableHost?

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
                if session.state.isTwoHeadedGiant {
                    // Web 2HG grid: one team panel along each long edge (the top
                    // team turned to face its players), the centre strip between.
                    VStack(spacing: gap) {
                        teamPanel(2, elapsed: elapsed).rotationEffect(.degrees(180))
                        CenterZoneView(session: session, showLog: $showLog, elapsedSeconds: elapsed, onRestart: onRestart)
                            .frame(maxWidth: 520).frame(height: centerH)
                        teamPanel(1, elapsed: elapsed)
                    }
                } else {
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
            }
            .padding(gap)
        }
        .background(Theme.tableBackground(scheme))
        .preferredColorScheme(settings.darkMode ? .dark : .light)
        .environment(\.motionEnabled, settings.animationsEnabled)
        .transaction { t in if !settings.animationsEnabled { t.animation = nil } }
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
        .onChange(of: settings.soundEnabled) { _, on in
            // The service silences itself when switched off; switching back on
            // re-applies whatever the table is doing right now.
            SoundService.shared.setPoisonLevel(on && session.isPlaying ? session.highestLivingPoison : 0)
            SoundService.shared.setCitysBlessingActive(on && session.isPlaying && session.state.players.contains { $0.hasCitysBlessing })
        }
        .onDisappear {
            SoundService.shared.stopPoison()
            host?.end(); host = nil
            webHost?.end(); webHost = nil; WebTableHost.current = nil
            session.onStateChanged = nil
        }
        .onChange(of: session.isPlaying, initial: true) { _, playing in
            guard playing, host == nil, !session.isRemote else { return }
            // Phones with this app join over Multipeer; any phone's browser
            // joins through the table's own web server.
            let h = TableHost(gameId: session.clientGameId)
            let w = WebTableHost(gameId: session.clientGameId)
            let apply: (LiveGameEvent) -> Void = { e in session.dispatch(e.kind, seat: e.seat) }
            h.onEvent = apply
            w.onEvent = apply
            session.onStateChanged = { s, l in h.broadcast(s, log: l); w.broadcast(s, log: l) }
            host = h
            webHost = w
            WebTableHost.current = w
            h.broadcast(session.state, log: session.log)
            w.broadcast(session.state, log: session.log)
        }
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

    /// 2HG: both seats of a team in one panel while playing; two seating
    /// cards side by side while seating.
    @ViewBuilder
    private func teamPanel(_ team: Int, elapsed: Int) -> some View {
        if session.isSeating {
            HStack(spacing: 4) {
                ForEach(session.state.players.indices.filter { session.state.players[$0].teamNumber == team }, id: \.self) { i in
                    seatingCard(i)
                }
            }
        } else {
            TeamPanel(session: session, teamNumber: team, elapsedSeconds: elapsed, turnIndicatorOn: turnIndicatorOn)
        }
    }

    @ViewBuilder
    private func panel(_ i: Int, elapsed: Int) -> some View {
        if session.isSeating {
            seatingCard(i)
        } else {
            SeatPanel(session: session, idx: i, elapsedSeconds: elapsed, backdropDelay: backdropDelay(i),
                      backdropFlash: session.firstPlayerChosenThisSession, turnIndicatorOn: turnIndicatorOn)
        }
    }
}

extension TableView {
    /// A seating card with its picker rendered inside it, so the picker turns
    /// with the seat and faces the player who opened it.
    @ViewBuilder
    fileprivate func seatingCard(_ i: Int) -> some View {
        ZStack {
            SeatingPanel(player: session.state.players[i], teamNumber: session.state.players[i].teamNumber) { seatingIdx = i }
            if seatingIdx == i {
                SeatPickerSheet(session: session, idx: i, taken: Set(session.state.players.map(\.playerId))) { seatingIdx = nil }
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .transition(.opacity)
            }
        }
        .animation(.easeOut(duration: 0.15), value: seatingIdx)
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
        .accessibilityIdentifier("seat-\(player.position.rawValue)")
    }
}
