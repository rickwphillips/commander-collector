import SwiftUI
import CommanderGameKit

/// One seat during play, the web `PlayerCard` on the iPad: header bar with
/// commander thumbnail, tax medallions, XP badge, PASS, name, status icons
/// and the `+` menu; then three columns: commander damage (collapsible), the
/// hero life, counters (collapsible). Every overlay (menu, counters focus,
/// commander snapshot, card preview, rules text, kill prompts) is rendered
/// inside this view so it faces the seat's player.
struct SeatPanel: View {
    @Bindable var session: GameSession
    let idx: Int
    let elapsedSeconds: Int
    /// Delay (s) before the backdrop reveals; nil keeps it hidden.
    let backdropDelay: Double?
    let backdropFlash: Bool
    let turnIndicatorOn: Bool
    @Environment(GameSettingsStore.self) private var settings
    @Environment(\.colorScheme) private var scheme
    private var motion: Bool { settings.animationsEnabled }

    @State private var overlay: SeatOverlay?
    @State private var cmdDmgOpen = true
    @State private var countersOpen = true
    @State private var damageFlash = 0
    @State private var flashTrigger = 0
    @State private var cityBlessingVisible = false
    @State private var cityBlessingExiting = false
    @State private var concedeTurn = ""
    /// Intro: the seat sits dimmed until its turn in the reveal order, then
    /// brightens with the backdrop so each player is introduced in turn.
    @State private var introduced = false

    private var state: GameState { session.state }
    private var player: PlayerState { state.players[idx] }
    private var isActive: Bool {
        guard state.firstPlayerIdx != nil else { return false }
        if state.isTwoHeadedGiant { return state.players[state.currentPlayerIdx].teamNumber == player.teamNumber }
        return state.currentPlayerIdx == idx
    }
    private var poisonLethal: Int { state.isTwoHeadedGiant ? GameReducer.twoHeadedGiantPoisonThreshold : 10 }
    private var poisonProgress: Double { min(Double(player.poison) / Double(poisonLethal), 1) }
    private var isPoisoned: Bool { player.poison >= poisonLethal }
    private var isCmdDmgHigh: Bool { (state.commanderDamage[idx] ?? [:]).values.contains { $0.fromCommander >= 21 || $0.fromPartner >= 21 } }
    private var isWarning: Bool { player.life <= 0 || isPoisoned || isCmdDmgHigh }
    private var lifeColor: Color? { Theme.lifeColor(player.life, startingLife: state.startingLife) }
    private var threat: ThreatSource? { ThreatSource.compute(targetIdx: idx, state: state, tiebreakSource: session.lastCmdDmgSource[idx]) }
    private var glassActive: Bool { cityBlessingVisible || player.hasInitiative || poisonProgress >= 0.6 }
    private var timer: TimerTokens { TimerTokens(elapsed: isActive ? elapsedSeconds : 0, total: state.turnTimerSeconds, isActive: isActive && turnIndicatorOn) }
    private var energyGlow: Double { player.energy > 0 ? min(Double(player.energy) / 8, 1) : 0 }
    private var opponents: [Int] { state.players.indices.filter { $0 != idx } }
    private var killPrompt: GameSession.PendingKill? {
        guard let p = session.pendingKillAttribution, p.targetIdx == idx else { return nil }
        return p
    }

    var body: some View {
        GeometryReader { geo in
            let sz = Sizes(panelHeight: geo.size.height)
            ZStack {
                Theme.panelBackground(scheme)
                if isWarning { (scheme == .dark ? Color(red: 180/255, green: 40/255, blue: 40/255).opacity(0.18) : Color(red: 220/255, green: 80/255, blue: 80/255).opacity(0.08)) }
                CommanderBackdrop(name: player.commander.name, revealDelay: backdropDelay, flash: backdropFlash)
                // Motion off fades the effects out and leaves the icons;
                // Motion on inserts them fresh, so each starts over.
                if motion {
                    if player.hasInitiative { InitiativeTorch().transition(.opacity) }
                    PoisonOverlay(poison: player.poison, progress: poisonProgress).transition(.opacity)
                }

                VStack(spacing: 0) {
                    header(sz)
                    Divider()
                    columns(sz)
                }
                .shadow(color: Theme.energyCyan.opacity(energyGlow * 0.9), radius: 4 + energyGlow * 14)
                .opacity(introduced ? 1 : 0.35)

                if cityBlessingVisible && motion { CityBlessing(exiting: cityBlessingExiting, commanders: [player.commander.name] + (player.partner.map { [$0.name] } ?? []), threat: threat).transition(.opacity) }
                if player.isEliminated { EliminatedOverlay(conceded: player.isConceded, poisoned: isPoisoned).accessibilityIdentifier("s\(idx)-eliminated") }
                if overlay == .concedeConfirm {
                    Theme.gold.opacity(0.12).allowsHitTesting(false)
                    Text("CONCEDE?").font(.system(size: 22, weight: .black)).kerning(2).foregroundStyle(Theme.gold)
                        .shadow(color: .black.opacity(0.5), radius: 8, y: 2).rotationEffect(.degrees(-10)).allowsHitTesting(false)
                }
                if let killPrompt { killPromptOverlay(killPrompt, sz) }
                overlayView(sz)
            }
            .saturation(1 + poisonProgress * 0.5)
            .opacity(player.isEliminated ? 0.5 : 1)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(border)
            .animation(.easeInOut(duration: 0.3), value: isActive)
        }
        .animation(.easeInOut(duration: GameSettingsStore.motionFadeSeconds), value: motion)
        .onChange(of: player.life) { old, new in
            guard new < old else { return }
            damageFlash = old - new
            flashTrigger += 1
            Task { try? await Task.sleep(for: .seconds(1)); if flashTrigger >= 0 { damageFlash = 0 } }
        }
        .onChange(of: player.hasCitysBlessing, initial: true) { _, has in
            if has {
                cityBlessingExiting = false
                if !cityBlessingVisible && motion { SoundService.shared.playCitysBlessingIntro() }
                cityBlessingVisible = true
                SoundService.shared.setCitysBlessingActive(motion)
            } else if cityBlessingVisible {
                cityBlessingExiting = true
                SoundService.shared.setCitysBlessingActive(false)
                Task { try? await Task.sleep(for: .milliseconds(3800)); if !player.hasCitysBlessing { cityBlessingVisible = false; cityBlessingExiting = false } }
            }
        }
        .onChange(of: player.isEliminated) { _, _ in overlay = nil }
        .task(id: backdropDelay) {
            // Only the intro sequence (first player chosen at this table) dims
            // the seats; a resume or a remote view shows everything at once.
            guard backdropFlash, motion, let delay = backdropDelay else { introduced = true; return }
            introduced = false
            try? await Task.sleep(for: .milliseconds(Int(delay * 1000)))
            withAnimation(.easeInOut(duration: 0.8)) { introduced = true }
        }
    }

    // MARK: Header

    private func header(_ sz: Sizes) -> some View {
        ZStack {
            HStack(spacing: 6) {
                CommanderArt(name: player.commander.name, height: sz.art, revealDelay: backdropDelay.map { $0 + 0.8 })
                    .onTapGesture { overlay = .preview(name: player.commander.name) }
                ForEach(taxMedallions, id: \.name) { m in
                    HStack(spacing: 2) {
                        Text("+").font(.system(size: 11, weight: .bold)).foregroundStyle(.secondary)
                        TaxMedallion(tax: m.tax, size: 22)
                    }
                    .onTapGesture { overlay = .rules(title: "Commander tax", text: RulesText.commanderTax(name: m.name, tax: m.tax)) }
                }
                XpBadge(experience: player.experience)
                if isActive && !state.isTwoHeadedGiant && !session.isRemote {
                    Button { session.dispatch(.passTurn) } label: {
                        Text("PASS").font(.system(size: sz.pass, weight: .bold))
                            .padding(.horizontal, 10).padding(.vertical, 3)
                            .overlay(RoundedRectangle(cornerRadius: 6).strokeBorder(Color.accentColor, lineWidth: 2))
                    }
                    .buttonStyle(.plain).foregroundStyle(Color.accentColor)
                }
                Spacer()
                statusIcons(sz)
                if remoteConnected && !session.isRemote {
                    Image(systemName: "iphone").font(.system(size: sz.icon * 0.7)).foregroundStyle(.green).symbolEffect(.pulse)
                }
                Button { withAnimation(.easeOut(duration: 0.15)) { overlay = overlay == .stateMenu ? nil : .stateMenu } } label: {
                    Image(systemName: "plus").font(.system(size: sz.menu, weight: .semibold))
                        .rotationEffect(.degrees(overlay == .stateMenu ? 45 : 0))
                        .foregroundStyle(overlay == .stateMenu ? Color.accentColor : .secondary)
                        .frame(width: 30, height: 30).contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .accessibilityIdentifier("s\(idx)-menu")
            }
            VStack(spacing: 0) {
                Text(player.playerName).font(.system(size: sz.name, weight: .bold)).lineLimit(1)
                Text("\(player.deckName) · \(player.commander.name)\(player.partner.map { " / \($0.name)" } ?? "")")
                    .font(.system(size: sz.deck)).foregroundStyle(.secondary).lineLimit(1)
            }
            .frame(maxWidth: 0.55 * UIScreen.main.bounds.width)
            .allowsHitTesting(false)
        }
        .padding(.horizontal, 8).padding(.vertical, 4)
        .background(headerBackground)
    }

    private struct Medallion { let name: String; let tax: Int }
    private var taxMedallions: [Medallion] {
        var m = [Medallion(name: player.commander.name, tax: player.commanderTax)]
        if let p = player.partner { m.append(Medallion(name: p.name, tax: player.partnerCommanderTax)) }
        return m.filter { $0.tax > 0 }
    }

    @ViewBuilder private var headerBackground: some View {
        if isActive && settings.highlightMode && turnIndicatorOn {
            if timer.isExpired {
                BlinkingFill(on: Color(hex: 0xE93535).opacity(0.25), off: .black.opacity(0.08))
            } else {
                LinearGradient(colors: [timer.color.opacity(0.3), timer.color.opacity(0.7), timer.color.opacity(0.3)], startPoint: .leading, endPoint: .trailing)
            }
        } else {
            Color.black.opacity(0.08)
        }
    }

    private func statusIcons(_ sz: Sizes) -> some View {
        HStack(spacing: 8) {
            let anyMonarch = state.players.contains(where: \.isMonarch)
            let anyInitiative = state.players.contains(where: \.hasInitiative)
            if player.isMonarch || anyMonarch {
                statusIcon(active: player.isMonarch, size: sz.icon, rules: ("Monarch", RulesText.monarch), toggle: .toggleMonarch(playerIdx: idx)) {
                    ShimmerCrown(size: sz.icon, active: player.isMonarch)
                }
            }
            if player.hasInitiative || anyInitiative {
                statusIcon(active: player.hasInitiative, size: sz.icon, rules: ("Initiative", RulesText.initiative), toggle: .toggleInitiative(playerIdx: idx)) {
                    InitiativeGlyph().foregroundStyle(player.hasInitiative ? Theme.initiativeBlue : Color.secondary.opacity(0.4))
                }
            }
            if player.hasCitysBlessing {
                statusIcon(active: true, size: sz.icon, rules: ("City's Blessing", RulesText.citysBlessing), toggle: .toggleCitysBlessing(playerIdx: idx)) {
                    CityGlyph(active: true)
                }
            }
        }
    }

    /// Tap shows the reminder text; hold toggles the status (take it, or give it up).
    private func statusIcon<G: View>(active: Bool, size: CGFloat, rules: (String, String), toggle: LiveGameEvent.Kind, @ViewBuilder glyph: () -> G) -> some View {
        glyph()
            .frame(width: size, height: size)
            .opacity(active ? 1 : 0.6)
            .overlay {
                // The glyph redraws every frame while it shimmers; the gestures
                // live on this still layer so a hold is never interrupted.
                HoldOrTap(onTap: { overlay = .rules(title: rules.0, text: rules.1) }, onHold: { session.dispatch(toggle) })
            }
            .accessibilityElement(children: .ignore)
            .accessibilityIdentifier("s\(idx)-status-\(rules.0)")
            .accessibilityValue(active ? "on" : "off")
    }

    // MARK: Columns

    /// Web: every open drawer and the life column are `flex: 1`, so the three
    /// share the width equally and a closed drawer is a 24 pt rail.
    private func columns(_ sz: Sizes) -> some View {
        GeometryReader { geo in
            let rail: CGFloat = 24
            let open = (cmdDmgOpen ? 1 : 0) + (countersOpen ? 1 : 0)
            let share = (geo.size.width - CGFloat(2 - open) * rail) / CGFloat(open + 1)
            HStack(spacing: 0) {
                CommanderDamageColumn(session: session, targetIdx: idx, open: $cmdDmgOpen, overlay: $overlay, glass: glassActive, threat: threat, sizes: sz)
                    .frame(width: cmdDmgOpen ? share : rail).clipped()
                Divider()
                lifeColumn(sz)
                Divider()
                CountersColumn(session: session, idx: idx, open: $countersOpen, overlay: $overlay, glass: glassActive, poisonLethal: poisonLethal, sizes: sz)
                    .frame(width: countersOpen ? share : rail).clipped()
            }
            .animation(.easeInOut(duration: 0.2), value: cmdDmgOpen)
            .animation(.easeInOut(duration: 0.2), value: countersOpen)
        }
    }

    private func lifeColumn(_ sz: Sizes) -> some View {
        let closed = (cmdDmgOpen ? 0 : 1) + (countersOpen ? 0 : 1)
        let fontSize = closed == 0 ? sz.life : closed == 1 ? sz.life * 1.5 : sz.life * 2
        let lost = Theme.lostRatio(player.life, startingLife: state.startingLife)
        return ZStack {
            LifeCracks(fingerprint: idx, lostRatio: lost)
            if let threat, threat.intensity > 0, motion { ThreatNames(name: threat.commanderName, intensity: threat.intensity, fingerprint: idx) }
            VStack(spacing: 2) {
                LifeNumber(value: player.life, fontSize: fontSize, color: lifeColor, damageFlash: damageFlash, energy: player.energy, poison: player.poison, poisonLethal: poisonLethal)
                    .accessibilityIdentifier("s\(idx)-life")
                    .accessibilityValue("\(player.life)")
                    .onTapGesture { overlay = .focus(.life) }
                    .overlay(alignment: .topLeading) {
                        MonarchCrown(isMonarch: player.isMonarch, transferHint: session.monarchTransferRecent, size: fontSize * 0.55)
                            .offset(x: -fontSize * 0.3, y: -fontSize * 0.3)
                    }
                HStack(spacing: 10) {
                    StepButton(symbol: "minus", size: StepperSize(buttonFont: sz.lifeBtn, buttonWidth: 52, buttonHeight: 44), id: "s\(idx)-life-dec") { session.dispatch(.lifeChange(playerIdx: idx, delta: $0 ? -5 : -1)) }
                    StepButton(symbol: "plus", size: StepperSize(buttonFont: sz.lifeBtn, buttonWidth: 52, buttonHeight: 44), id: "s\(idx)-life-inc") { session.dispatch(.lifeChange(playerIdx: idx, delta: $0 ? 5 : 1)) }
                }
            }
            .padding(6)
            .background(GlassBacking(active: glassActive))
            .fixedSize(horizontal: false, vertical: true)
            if damageFlash > 0 && motion { DamageSwipes(magnitude: damageFlash, trigger: flashTrigger) }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .clipped()
    }

    // MARK: Border

    @ViewBuilder private var border: some View {
        let shape = RoundedRectangle(cornerRadius: 12)
        if overlay == .concedeConfirm {
            shape.strokeBorder(Theme.gold, lineWidth: 3).shadow(color: Theme.gold.opacity(0.6), radius: 12)
        } else if isActive && turnIndicatorOn && !settings.highlightMode {
            if timer.isExpired {
                BlinkingStroke(shape: shape)
            } else {
                shape.strokeBorder(timer.color, lineWidth: 3).shadow(color: timer.color.opacity(0.53), radius: 8)
            }
        } else if isWarning {
            shape.strokeBorder(Theme.danger, lineWidth: 2)
        } else {
            shape.strokeBorder(Color.primary.opacity(0.12), lineWidth: 1)
        }
    }

    // MARK: Overlays

    @ViewBuilder private func overlayView(_ sz: Sizes) -> some View {
        switch overlay {
        case .none:
            EmptyView()
        case .stateMenu, .concedeConfirm:
            StateMenuOverlay(session: session, idx: idx, overlay: $overlay, concedeTurn: $concedeTurn)
                .transition(.opacity)
        case .rules(let title, let text):
            RulesTipOverlay(title: title, text: text) { overlay = nil }
        case .focus(let target):
            focusModal(target)
        case .snapshot(let src, let partner):
            CommanderSnapshotOverlay(session: session, viewerIdx: idx, sourceIdx: src, partner: partner, overlay: $overlay, sizes: sz)
        case .preview(let name):
            CardPreviewOverlay(name: name) { overlay = nil }
        case .qr:
            SeatQROverlay(gameId: session.clientGameId, seat: player.position, connected: remoteConnected) { overlay = nil }
        }
    }

    /// A phone has checked in for this seat within the last 15 s (web rule).
    private var remoteConnected: Bool {
        guard let ts = state.remoteCheckins?[player.position.rawValue] else { return false }
        return GameReducer.nowMillis() - ts < 15_000
    }

    @ViewBuilder private func focusModal(_ target: FocusTarget) -> some View {
        let close = { overlay = nil }
        switch target {
        case .life:
            FocusModal(title: "Life Total", value: player.life, color: lifeColor ?? .accentColor, onChange: { session.dispatch(.lifeChange(playerIdx: idx, delta: $0)) }, onClose: close)
        case .poison:
            FocusModal(title: "Poison", value: player.poison, color: isPoisoned ? Theme.danger : player.poison > 0 ? Theme.poisonGreen : .primary, onChange: { session.dispatch(.poisonChange(playerIdx: idx, delta: $0)) }, onClose: close)
        case .energy:
            FocusModal(title: "Energy", value: player.energy, color: player.energy > 0 ? Theme.energyCyan : .primary, onChange: { session.dispatch(.energyChange(playerIdx: idx, delta: $0)) }, onClose: close)
        case .experience:
            FocusModal(title: "Experience", value: player.experience, color: player.experience > 0 ? Theme.gold : .primary, onChange: { session.dispatch(.experienceChange(playerIdx: idx, delta: $0)) }, onClose: close)
        case .tax(let partner):
            FocusModal(title: partner ? (player.partner?.name ?? "Partner") : "Commander Tax", value: partner ? player.partnerCommanderTax : player.commanderTax, color: .orange,
                       onChange: { session.dispatch(.commanderTaxChange(playerIdx: idx, delta: $0, isPartner: partner)) }, onClose: close)
        case .commanderDamage(let src, let partner):
            let source = state.players[src]
            let dmg = state.commanderDamage[idx, src]
            FocusModal(title: "CMD Dmg — \(partner ? (source.partner?.name ?? "") : source.commander.name)", value: partner ? dmg.fromPartner : dmg.fromCommander,
                       color: (partner ? dmg.fromPartner : dmg.fromCommander) >= 21 ? Theme.danger : .primary, disableDec: source.isEliminated,
                       onChange: { session.dispatch(.commanderDamageChange(targetIdx: idx, sourceIdx: src, isPartner: partner, delta: $0)) }, onClose: close)
        case .memberEnergy, .memberExperience, .memberTax:
            EmptyView()
        }
    }

    private func killPromptOverlay(_ kill: GameSession.PendingKill, _ sz: Sizes) -> some View {
        let poison = kill.cause == .poison
        let tint: Color = poison ? Color(hex: 0x7FFF7F) : .white
        let living = opponents.filter { !state.players[$0].isEliminated && (state.players[$0].teamNumber == nil || state.players[$0].teamNumber != player.teamNumber) }
        return ZStack {
            (poison ? Color(red: 0, green: 40/255, blue: 0).opacity(0.78) : Color.black.opacity(0.72))
            VStack(spacing: 8) {
                Text(poison ? "Who poisoned \(player.playerName)?" : "Who brought \(player.playerName) to 0?")
                    .font(.system(size: sz.kill, weight: .bold)).foregroundStyle(tint).multilineTextAlignment(.center)
                ForEach(living, id: \.self) { s in
                    Button(state.players[s].playerName) { session.attributeKill(kill, sourceIdx: s) }
                        .frame(maxWidth: .infinity).padding(.vertical, 6)
                        .overlay(RoundedRectangle(cornerRadius: 6).strokeBorder(tint.opacity(0.5)))
                }
                Button("Skip") { session.attributeKill(kill, sourceIdx: nil) }.foregroundStyle(tint.opacity(0.5)).font(.system(size: sz.kill))
            }
            .foregroundStyle(tint)
            .padding(16)
        }
        .transition(.opacity)
    }

    // MARK: Sizes

    /// Font and control sizes derived from the panel height (the web uses
    /// viewport-relative clamps).
    /// Gap between rows in the commander damage and counters drawers.
    static let drawerRowSpacing: CGFloat = 8
    /// Used when the full gap would push the rows into a scroll view.
    static let compactDrawerRowSpacing: CGFloat = 3

    struct Sizes {
        let name, deck, pass, icon, menu, art, life, lifeBtn, crown, label, source, badge, value, kill: CGFloat
        let stepper: StepperSize
        init(panelHeight h: CGFloat) {
            let k = min(max(h / 360, 0.75), 1.1)
            // The player name and commander line read the same in every seat:
            // the side seats are narrow, not small.
            name = 15; deck = 11.5; pass = 12 * k; icon = 22 * k; menu = 18 * k; art = 36 * k
            life = max(34, min(h * 0.28, 112)); lifeBtn = 36 * k; crown = 52 * k
            label = 12 * k; source = 15 * k; badge = 11 * k; value = 20 * k; kill = 13 * k
            stepper = StepperSize(buttonFont: 20 * k, valueFont: 20 * k, buttonWidth: 30 * k, buttonHeight: 32 * k, valueWidth: 26 * k, labelFont: 11 * k)
        }
    }
}

/// The hero life number with its reaction stack (web `LifeTotal`): red flash on
/// a hit, blue pulse + sizzle above 5 energy, green boil at 8+ poison. A flash
/// overrides the idle animations; energy outranks poison.
struct LifeNumber: View {
    @Environment(\.motionEnabled) private var motion
    let value: Int
    let fontSize: CGFloat
    let color: Color?
    let damageFlash: Int
    let energy: Int
    let poison: Int
    let poisonLethal: Int

    var body: some View {
        TimelineView(.animation(minimumInterval: 1 / 30, paused: (damageFlash == 0 && energy <= 5 && poison < 8) || !motion)) { ctx in
            let t = ctx.date.timeIntervalSinceReferenceDate
            let energetic = damageFlash == 0 && energy > 5
            let boiling = damageFlash == 0 && !energetic && poison >= 8
            let boilAmp: Double = poison >= poisonLethal ? 5 : poison >= poisonLethal - 1 ? 3.8 : 1.5
            let sizzle = Double(min(energy - 5, 10)) * 0.2
            Text("\(value)")
                .font(.system(size: fontSize, weight: .black).monospacedDigit())
                .foregroundStyle(damageFlash > 0 ? Color(red: 0.9, green: 0, blue: 0) : (color ?? .accentColor))
                .shadow(color: damageFlash > 0 ? Color(red: 0.86, green: 0, blue: 0).opacity(0.9) : energetic ? Theme.energyCyan.opacity(0.6 + 0.4 * sin(t * 3)) : .clear,
                        radius: damageFlash > 0 ? 24 : energetic ? 10 + 10 * (sin(t * 3) + 1) : 0)
                .offset(x: energetic ? sizzle * sin(t * 51) : boiling ? boilAmp * 0.6 * sin(t * 2.4) : 0,
                        y: energetic ? sizzle * cos(t * 37) : boiling ? boilAmp * 0.5 * sin(t * 3.1 + 1) : 0)
                .rotationEffect(.degrees(boiling ? sin(t * 2.0) * min(boilAmp * 0.6, 2.5) * 0.4 : 0))
                .contentTransition(.numericText(value: Double(value)))
                .animation(.snappy(duration: 0.25), value: value)
                .animation(.easeOut(duration: 0.4), value: color)
                .animation(.easeOut(duration: 0.6), value: damageFlash)
        }
        .fixedSize()
    }
}

/// Header crown that shimmers while held and reads dim when another seat holds it.
struct ShimmerCrown: View {
    @Environment(\.motionEnabled) private var motion
    let size: CGFloat
    let active: Bool
    var body: some View {
        TimelineView(.animation(minimumInterval: 1 / 20, paused: (!active) || !motion)) { ctx in
            let g = (sin(ctx.date.timeIntervalSinceReferenceDate / 2 * 2 * .pi) + 1) / 2
            Image(systemName: "crown.fill").resizable().scaledToFit()
                .foregroundStyle(active ? Theme.gold : Color.secondary.opacity(0.4))
                .brightness(active ? 0.5 * g : 0)
                .shadow(color: active ? Theme.brightGold.opacity(0.3 + 0.7 * g) : .clear, radius: 2 + 5 * g)
        }
    }
}

struct BlinkingFill: View {

    @Environment(\.motionEnabled) private var motion
    let on: Color, off: Color
    var body: some View {
        if !motion {
            on
        } else {
            TimelineView(.periodic(from: .now, by: 0.25)) { ctx in
                (Int(ctx.date.timeIntervalSinceReferenceDate * 4) % 2 == 0 ? on : off)
            }
        }
    }
}

struct BlinkingStroke<S: InsettableShape>: View {

    @Environment(\.motionEnabled) private var motion
    let shape: S
    var body: some View {
        TimelineView(.periodic(from: .now, by: 0.25)) { ctx in
            let on = !motion || Int(ctx.date.timeIntervalSinceReferenceDate * 4) % 2 == 0
            shape.strokeBorder(on ? Theme.danger : .clear, lineWidth: 3).shadow(color: on ? Theme.danger.opacity(0.6) : .clear, radius: 12)
        }
    }
}
