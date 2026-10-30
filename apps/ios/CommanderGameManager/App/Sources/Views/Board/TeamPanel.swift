import SwiftUI
import CommanderGameKit

/// Two-Headed Giant team panel (web `TeamPanel`): both pilots' commanders
/// flank an editable team name; the body shows the opposing team (their
/// shared life, the damage you have dealt them, and a stepper for the
/// commander damage each of their commanders has dealt your team), the
/// team's shared life and poison in the middle, and each pilot's own tax,
/// energy, experience and status toggles on the right. Overlays render in
/// the panel, so they face the team.
struct TeamPanel: View {
    @Bindable var session: GameSession
    let teamNumber: Int
    let elapsedSeconds: Int
    let turnIndicatorOn: Bool
    @Environment(GameSettingsStore.self) private var settings
    @Environment(\.colorScheme) private var scheme

    @State private var overlay: SeatOverlay?
    @State private var editingName = false
    @State private var nameDraft = ""
    @State private var damageFlash = 0
    @State private var flashTrigger = 0
    @State private var cityBlessingVisible = false
    @State private var cityBlessingExiting = false
    @State private var concedeTurn = ""

    private var state: GameState { session.state }
    private var members: [Int] { state.players.indices.filter { state.players[$0].teamNumber == teamNumber } }
    private var opponents: [Int] { state.players.indices.filter { state.players[$0].teamNumber == Teams.other(teamNumber) } }
    private var primary: Int { members.first ?? 0 }
    private var life: Int { state.players[primary].life }
    private var poison: Int { state.players[primary].poison }
    private var teamEnergy: Int { members.map { state.players[$0].energy }.max() ?? 0 }
    private var eliminated: Bool { members.allSatisfy { state.players[$0].isEliminated } }
    private var conceded: Bool { members.contains { state.players[$0].isConceded } }
    private var isActive: Bool { state.firstPlayerIdx != nil && state.players[state.currentPlayerIdx].teamNumber == teamNumber }
    private var teamColor: Color { teamNumber == 1 ? .accentColor : .purple }
    private var poisonProgress: Double { min(Double(poison) / 15, 1) }
    private var lifeColor: Color? { Theme.lifeColor(life, startingLife: state.startingLife) }
    private var threat: ThreatSource? { ThreatSource.compute(targetIdx: primary, state: state, tiebreakSource: session.lastCmdDmgSource[primary]) }
    private var glassActive: Bool { cityBlessingVisible || members.contains { state.players[$0].hasInitiative } || poisonProgress >= 0.6 }
    private var timer: TimerTokens { TimerTokens(elapsed: isActive ? elapsedSeconds : 0, total: state.turnTimerSeconds, isActive: isActive && turnIndicatorOn) }
    private var teamName: String { Teams.name(teamNumber, teamNames: state.teamNames) }
    private var killPrompt: GameSession.PendingKill? {
        guard let p = session.pendingKillAttribution, members.contains(p.targetIdx) else { return nil }
        return p
    }

    var body: some View {
        GeometryReader { geo in
            let sz = SeatPanel.Sizes(panelHeight: geo.size.height)
            ZStack {
                Theme.panelBackground(scheme)
                if members.contains(where: { state.players[$0].hasInitiative }) { InitiativeTorch() }
                PoisonOverlay(poison: poison, progress: poisonProgress)
                VStack(spacing: 0) {
                    header(sz)
                    Divider()
                    HStack(alignment: .top, spacing: 12) {
                        opposingSection(sz).frame(maxWidth: .infinity)
                        sharedLife(sz).frame(maxWidth: .infinity)
                        pilotsSection(sz).frame(maxWidth: .infinity)
                    }
                    .padding(10)
                }
                .shadow(color: Theme.energyCyan.opacity(min(Double(teamEnergy) / 8, 1) * 0.9), radius: 4 + min(Double(teamEnergy) / 8, 1) * 14)
                if cityBlessingVisible { CityBlessing(exiting: cityBlessingExiting) }
                if eliminated { EliminatedOverlay(conceded: conceded, poisoned: poison >= 15) }
                if overlay == .concedeConfirm {
                    Theme.gold.opacity(0.12).allowsHitTesting(false)
                    Text("CONCEDE?").font(.system(size: 22, weight: .black)).kerning(2).foregroundStyle(Theme.gold).rotationEffect(.degrees(-10)).allowsHitTesting(false)
                }
                if let killPrompt { killPromptOverlay(killPrompt, sz) }
                overlayView(sz)
            }
            .saturation(1 + poisonProgress * 0.5)
            .opacity(eliminated ? 0.5 : 1)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(border)
        }
        .onChange(of: life) { old, new in
            guard new < old else { return }
            damageFlash = old - new
            flashTrigger += 1
            Task { try? await Task.sleep(for: .seconds(1)); damageFlash = 0 }
        }
        .onChange(of: members.contains { state.players[$0].hasCitysBlessing }, initial: true) { _, has in
            if has {
                cityBlessingExiting = false
                if !cityBlessingVisible { SoundService.shared.playCitysBlessingIntro() }
                cityBlessingVisible = true
                SoundService.shared.setCitysBlessingActive(true)
            } else if cityBlessingVisible {
                cityBlessingExiting = true
                SoundService.shared.setCitysBlessingActive(false)
                Task { try? await Task.sleep(for: .milliseconds(3800)); if !members.contains(where: { state.players[$0].hasCitysBlessing }) { cityBlessingVisible = false; cityBlessingExiting = false } }
            }
        }
    }

    // MARK: Header

    private func header(_ sz: SeatPanel.Sizes) -> some View {
        HStack(spacing: 10) {
            if let m = members.first { brief(m, sz: sz, trailing: false) }
            Spacer()
            HStack(spacing: 6) {
                RoundedRectangle(cornerRadius: 2).fill(teamColor).frame(width: 12, height: 12)
                if editingName {
                    TextField("Team name", text: $nameDraft, onCommit: commitName)
                        .textFieldStyle(.roundedBorder).frame(width: 160).font(.system(size: 14, weight: .heavy))
                        .onSubmit(commitName)
                } else {
                    Text(teamName.uppercased()).font(.system(size: 14, weight: .heavy)).kerning(0.5).lineLimit(1)
                        .onTapGesture { nameDraft = teamName; editingName = true }
                }
                if isActive && !eliminated { Text("ACTIVE").font(.system(size: 10, weight: .bold)).kerning(0.5).foregroundStyle(Color.accentColor) }
                Button { withAnimation(.easeOut(duration: 0.15)) { overlay = overlay == .stateMenu ? nil : .stateMenu } } label: {
                    Image(systemName: "gearshape").font(.system(size: 14)).foregroundStyle(.secondary).frame(width: 28, height: 28).contentShape(Rectangle())
                }
                .buttonStyle(.plain)
            }
            Spacer()
            if members.count > 1 { brief(members[1], sz: sz, trailing: true) }
        }
        .padding(.horizontal, 10).padding(.vertical, 4)
        .background(headerBackground)
    }

    private func commitName() {
        editingName = false
        let trimmed = nameDraft.trimmingCharacters(in: .whitespaces)
        if !trimmed.isEmpty, trimmed != teamName { session.dispatch(.setTeamName(team: teamNumber, name: String(trimmed.prefix(32)))) }
    }

    @ViewBuilder private var headerBackground: some View {
        if isActive && settings.highlightMode && turnIndicatorOn {
            if timer.isExpired { BlinkingFill(on: Color(hex: 0xE93535).opacity(0.25), off: .black.opacity(0.08)) }
            else { LinearGradient(colors: [timer.color.opacity(0.3), timer.color.opacity(0.7), timer.color.opacity(0.3)], startPoint: .leading, endPoint: .trailing) }
        } else {
            Color.black.opacity(0.08)
        }
    }

    /// A pilot's art, name and commander (web `CommanderBrief`).
    private func brief(_ idx: Int, sz: SeatPanel.Sizes, trailing: Bool) -> some View {
        let p = state.players[idx]
        return HStack(spacing: 6) {
            if !trailing { CommanderArt(name: p.commander.name, height: sz.art).onTapGesture { overlay = .preview(name: p.commander.name) } }
            VStack(alignment: trailing ? .trailing : .leading, spacing: 0) {
                HStack(spacing: 4) {
                    Text(p.playerName).font(.system(size: sz.name, weight: .bold)).foregroundStyle(teamColor).lineLimit(1)
                    XpBadge(experience: p.experience)
                    ForEach([(p.commander.name, p.commanderTax), (p.partner?.name ?? "", p.partnerCommanderTax)].filter { $0.1 > 0 && !$0.0.isEmpty }, id: \.0) { m in
                        TaxMedallion(tax: m.1, size: 20).onTapGesture { overlay = .rules(title: "Commander tax", text: RulesText.commanderTax(name: m.0, tax: m.1)) }
                    }
                }
                Text("\(p.deckName) · \(p.commander.name)\(p.partner.map { " / \($0.name)" } ?? "")").font(.system(size: sz.deck)).foregroundStyle(.secondary).lineLimit(1)
            }
            if trailing { CommanderArt(name: p.commander.name, height: sz.art).onTapGesture { overlay = .preview(name: p.commander.name) } }
        }
    }

    // MARK: Opposing team

    private func opposingSection(_ sz: SeatPanel.Sizes) -> some View {
        let oppPrimary = opponents.first ?? 0
        let opp = state.players[oppPrimary]
        let oppEliminated = opponents.allSatisfy { state.players[$0].isEliminated }
        let oppEnergy = opponents.map { state.players[$0].energy }.max() ?? 0
        return VStack(alignment: .leading, spacing: 6) {
            VStack(alignment: .leading, spacing: 2) {
                Text(Teams.name(Teams.other(teamNumber), teamNames: state.teamNames).uppercased())
                    .font(.system(size: sz.name, weight: .bold)).kerning(0.5).foregroundStyle(teamNumber == 1 ? .purple : .accentColor).lineLimit(1)
                HStack(alignment: .center, spacing: 10) {
                    LifeNumber(value: opp.life, fontSize: sz.life * 0.6, color: Theme.lifeColor(opp.life, startingLife: state.startingLife), damageFlash: 0, energy: oppEnergy, poison: opp.poison, poisonLethal: 15)
                    VStack(alignment: .leading, spacing: 0) {
                        ForEach(dealtToOpponents, id: \.name) { r in
                            HStack(spacing: 4) {
                                Text(r.name).font(.system(size: sz.badge)).foregroundStyle(.secondary).lineLimit(1)
                                Text("\(r.value)").font(.system(size: sz.badge, weight: .heavy)).foregroundStyle(r.value >= 21 ? Color(hex: 0xB71C1C) : .primary) + Text("/21").font(.system(size: sz.badge)).foregroundStyle(.secondary)
                            }
                            .onTapGesture { overlay = .preview(name: r.name) }
                        }
                    }
                }
                HStack(spacing: 6) {
                    if opp.poison > 0 { CounterGlyph(kind: .poison, size: sz.badge, poison: opp.poison, poisonDanger: 15); Text("\(opp.poison)/15").font(.system(size: sz.badge, weight: .heavy)).foregroundStyle(opp.poison >= 15 ? Theme.danger : Theme.poisonGreen) }
                    ForEach(opponents, id: \.self) { o in
                        PlayerStatusBadges(player: state.players[o], size: sz.badge, startingLife: state.startingLife, showLife: false, showPoison: false)
                    }
                }
            }
            .opacity(oppEliminated ? 0.5 : 1)
            Divider()
            Text("CMD DAMAGE TAKEN").font(.system(size: sz.label, weight: .semibold)).kerning(0.5).foregroundStyle(.secondary)
            ScrollView(.vertical) {
                VStack(spacing: 2) {
                    ForEach(opponents, id: \.self) { src in
                        CommanderDamageRow(session: session, targetIdx: primary, sourceIdx: src, showPlayer: false, glass: glassActive, overlay: $overlay, sizes: sz)
                    }
                }
            }
            .scrollBounceBehavior(.basedOnSize)
        }
    }

    private struct Dealt { let name: String; let value: Int }
    /// Commander damage this team has dealt each opposing head (read-only here).
    private var dealtToOpponents: [Dealt] {
        guard let oppPrimary = opponents.first else { return [] }
        var out: [Dealt] = []
        for m in members {
            let p = state.players[m]
            let dmg = state.commanderDamage[oppPrimary, m]
            if dmg.fromCommander > 0 { out.append(Dealt(name: p.commander.name, value: dmg.fromCommander)) }
            if let partner = p.partner, dmg.fromPartner > 0 { out.append(Dealt(name: partner.name, value: dmg.fromPartner)) }
        }
        return out
    }

    // MARK: Shared life

    private func sharedLife(_ sz: SeatPanel.Sizes) -> some View {
        let lost = Theme.lostRatio(life, startingLife: state.startingLife)
        return VStack(spacing: 4) {
            ZStack {
                LifeCracks(fingerprint: teamNumber, lostRatio: lost)
                if let threat, threat.intensity > 0 { ThreatNames(name: threat.commanderName, intensity: threat.intensity, fingerprint: teamNumber) }
                HStack(spacing: 12) {
                    StepButton(symbol: "minus", size: StepperSize(buttonFont: sz.lifeBtn, buttonWidth: 48, buttonHeight: 44)) { session.dispatch(.lifeChange(playerIdx: primary, delta: $0 ? -5 : -1)) }
                    LifeNumber(value: life, fontSize: sz.life, color: lifeColor, damageFlash: damageFlash, energy: teamEnergy, poison: poison, poisonLethal: 15)
                        .onTapGesture { overlay = .focus(.life) }
                        .overlay(alignment: .topLeading) {
                            MonarchCrown(isMonarch: members.contains { state.players[$0].isMonarch }, transferHint: session.monarchTransferRecent, size: sz.life * 0.5)
                                .offset(x: -sz.life * 0.3, y: -sz.life * 0.3)
                        }
                    StepButton(symbol: "plus", size: StepperSize(buttonFont: sz.lifeBtn, buttonWidth: 48, buttonHeight: 44)) { session.dispatch(.lifeChange(playerIdx: primary, delta: $0 ? 5 : 1)) }
                }
                .padding(6)
                .background(GlassBacking(active: glassActive))
                if damageFlash > 0 { DamageSwipes(magnitude: damageFlash, trigger: flashTrigger) }
            }
            .frame(minHeight: sz.life * 1.3)
            .clipped()
            Text("SHARED LIFE").font(.system(size: sz.label)).kerning(1).foregroundStyle(.secondary)
            StepperControl(value: poison, color: poison >= 15 ? Color(hex: 0x2E7D32) : .primary, max: 15, glass: glassActive, size: sz.stepper,
                           valueBlur: CGFloat(pow(poisonProgress, 2.5) * 1.5), focus: .poison, overlay: $overlay,
                           onChange: { session.dispatch(.poisonChange(playerIdx: primary, delta: $0)) }) {
                HStack(spacing: 4) {
                    CounterGlyph(kind: .poison, size: sz.label, poison: poison, poisonDanger: 15)
                    Text("Poison").font(.system(size: sz.label)).foregroundStyle(.secondary)
                }
            }
            .modifier(PoisonPulse(active: poison == 14))
            .fixedSize()
            if isActive && !eliminated {
                Button { session.dispatch(.passTurn) } label: {
                    Text("PASS TURN").font(.system(size: sz.label, weight: .heavy)).kerning(1)
                        .padding(.horizontal, 12).padding(.vertical, 4)
                        .overlay(RoundedRectangle(cornerRadius: 6).strokeBorder(Color.accentColor, lineWidth: 2))
                }
                .buttonStyle(.plain).foregroundStyle(Color.accentColor)
            }
        }
    }

    // MARK: Pilots

    private func pilotsSection(_ sz: SeatPanel.Sizes) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            ForEach(members, id: \.self) { m in
                let p = state.players[m]
                HStack(alignment: .top, spacing: 8) {
                    CommanderArt(name: p.commander.name, height: sz.art * 1.2).onTapGesture { overlay = .preview(name: p.commander.name) }
                    VStack(alignment: .leading, spacing: 3) {
                        HStack(spacing: 8) {
                            Text(p.playerName).font(.system(size: sz.name, weight: .bold)).foregroundStyle(teamColor).lineLimit(1)
                            taxStepper(m, partner: false, value: p.commanderTax, sz: sz)
                            if p.partner != nil { taxStepper(m, partner: true, value: p.partnerCommanderTax, sz: sz) }
                        }
                        HStack(spacing: 10) {
                            StepperControl(value: p.energy, color: p.energy > 0 ? Theme.energyCyan : .secondary, glass: glassActive, size: .compact, focus: .memberEnergy(idx: m), overlay: $overlay,
                                           onChange: { session.dispatch(.energyChange(playerIdx: m, delta: $0)) }) { CounterGlyph(kind: .energy, size: sz.label) }
                                .fixedSize()
                            StepperControl(value: p.experience, color: p.experience > 0 ? Theme.gold : .secondary, glass: glassActive, size: .compact, focus: .memberExperience(idx: m), overlay: $overlay,
                                           onChange: { session.dispatch(.experienceChange(playerIdx: m, delta: $0)) }) { CounterGlyph(kind: .xp, size: sz.label) }
                                .fixedSize()
                        }
                        HStack(spacing: 10) {
                            let teammateMonarch = members.contains { $0 != m && state.players[$0].isMonarch }
                            let teammateInitiative = members.contains { $0 != m && state.players[$0].hasInitiative }
                            abilityToggle(active: p.isMonarch, redundant: !p.isMonarch && teammateMonarch, color: Theme.gold, size: sz.icon,
                                          rules: ("Monarch", RulesText.monarch), toggle: .toggleMonarch(playerIdx: m)) { ShimmerCrown(size: sz.icon, active: p.isMonarch) }
                            abilityToggle(active: p.hasInitiative, redundant: !p.hasInitiative && teammateInitiative, color: Theme.initiativeBlue, size: sz.icon,
                                          rules: ("Initiative", RulesText.initiative), toggle: .toggleInitiative(playerIdx: m)) { InitiativeGlyph().foregroundStyle(p.hasInitiative ? Theme.initiativeBlue : Color.secondary.opacity(0.4)) }
                            abilityToggle(active: p.hasCitysBlessing, redundant: false, color: Theme.cityPurple, size: sz.icon,
                                          rules: ("City's Blessing", RulesText.citysBlessing), toggle: .toggleCitysBlessing(playerIdx: m)) { CityGlyph(active: p.hasCitysBlessing) }
                        }
                    }
                }
            }
        }
    }

    private func taxStepper(_ m: Int, partner: Bool, value: Int, sz: SeatPanel.Sizes) -> some View {
        StepperControl(value: value, color: value > 0 ? .orange : .secondary, glass: glassActive, size: .compact, focus: .memberTax(idx: m, partner: partner), overlay: $overlay,
                       onChange: { session.dispatch(.commanderTaxChange(playerIdx: m, delta: $0, isPartner: partner)) }) {
            CounterGlyph(kind: .tax, size: sz.label, taxValue: value)
        }
        .fixedSize()
    }

    /// Tap = reminder text, hold = toggle. A status the teammate already holds
    /// is redundant and reads dim (one monarch / initiative per game).
    private func abilityToggle<G: View>(active: Bool, redundant: Bool, color: Color, size: CGFloat, rules: (String, String), toggle: LiveGameEvent.Kind, @ViewBuilder glyph: () -> G) -> some View {
        glyph()
            .frame(width: size, height: size)
            .opacity(active ? 1 : redundant ? 0.25 : 0.6)
            .contentShape(Rectangle())
            .onTapGesture { overlay = .rules(title: rules.0, text: rules.1 + (redundant ? "\n\nYour team already has it." : "")) }
            .onLongPressGesture(minimumDuration: 0.5) { if !redundant { session.dispatch(toggle) } }
    }

    // MARK: Border and overlays

    @ViewBuilder private var border: some View {
        let shape = RoundedRectangle(cornerRadius: 12)
        if overlay == .concedeConfirm {
            shape.strokeBorder(Theme.gold, lineWidth: 3).shadow(color: Theme.gold.opacity(0.6), radius: 12)
        } else if isActive && turnIndicatorOn && !settings.highlightMode {
            if timer.isExpired { BlinkingStroke(shape: shape) }
            else { shape.strokeBorder(timer.color, lineWidth: 3).shadow(color: timer.color.opacity(0.53), radius: 8) }
        } else {
            shape.strokeBorder(Color.primary.opacity(0.12), lineWidth: 1)
        }
    }

    @ViewBuilder private func overlayView(_ sz: SeatPanel.Sizes) -> some View {
        switch overlay {
        case .none: EmptyView()
        case .stateMenu, .concedeConfirm: teamMenu
        case .rules(let title, let text): RulesTipOverlay(title: title, text: text) { overlay = nil }
        case .focus(let target): focusModal(target)
        case .snapshot(let src, let partner): CommanderSnapshotOverlay(session: session, viewerIdx: primary, sourceIdx: src, partner: partner, overlay: $overlay, sizes: sz)
        case .preview(let name): CardPreviewOverlay(name: name) { overlay = nil }
        case .qr: SeatQROverlay(gameId: session.clientGameId, seat: state.players[primary].position, connected: false) { overlay = nil }
        }
    }

    /// Team options: concede (a team action, both heads) and undo.
    private var teamMenu: some View {
        ZStack {
            Theme.overlayBackground(scheme).onTapGesture { overlay = nil }
            VStack(spacing: 0) {
                if eliminated {
                    menuRow("Undo concede", symbol: "arrow.uturn.backward", color: Theme.danger) { session.dispatch(.undoEliminate(playerIdx: primary)); overlay = nil }
                } else if overlay == .concedeConfirm {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Concede for the whole team?").font(.system(size: 12, weight: .semibold)).foregroundStyle(Theme.gold)
                        HStack(spacing: 6) {
                            Button("Confirm concede") { session.dispatch(.eliminate(playerIdx: primary)); overlay = nil }.buttonStyle(.borderedProminent).tint(Theme.gold).controlSize(.small)
                            Button("Cancel") { overlay = .stateMenu }.buttonStyle(.bordered).controlSize(.small)
                        }
                    }
                    .padding(12).background(Theme.gold.opacity(0.12))
                } else {
                    menuRow("Concede", symbol: "person.fill.xmark", color: .secondary) { overlay = .concedeConfirm }
                }
                if !session.isRemote {
                    Divider()
                    menuRow("Pair a phone", symbol: "qrcode", color: .secondary) { overlay = .qr }
                }
            }
            .frame(maxWidth: 260)
            .background(RoundedRectangle(cornerRadius: 10).fill(Theme.menuBackground(scheme)))
            .overlay(RoundedRectangle(cornerRadius: 10).strokeBorder(Color.primary.opacity(0.12)))
        }
        .transition(.opacity)
    }

    private func menuRow(_ label: String, symbol: String, color: Color, action: @escaping () -> Void) -> some View {
        HStack(spacing: 10) { Image(systemName: symbol); Text(label).font(.system(size: 13, weight: .semibold)) }
            .foregroundStyle(color).padding(.horizontal, 12).padding(.vertical, 10).frame(maxWidth: .infinity, alignment: .leading)
            .contentShape(Rectangle()).onTapGesture(perform: action)
    }

    @ViewBuilder private func focusModal(_ target: FocusTarget) -> some View {
        let close = { overlay = nil }
        switch target {
        case .life:
            FocusModal(title: "Shared Life", value: life, color: lifeColor ?? .accentColor, onChange: { session.dispatch(.lifeChange(playerIdx: primary, delta: $0)) }, onClose: close)
        case .poison:
            FocusModal(title: "Poison", value: poison, color: poison >= 15 ? Theme.danger : poison > 0 ? Theme.poisonGreen : .primary, onChange: { session.dispatch(.poisonChange(playerIdx: primary, delta: $0)) }, onClose: close)
        case .memberEnergy(let m):
            FocusModal(title: "\(state.players[m].playerName): Energy", value: state.players[m].energy, color: Theme.energyCyan, onChange: { session.dispatch(.energyChange(playerIdx: m, delta: $0)) }, onClose: close)
        case .memberExperience(let m):
            FocusModal(title: "\(state.players[m].playerName): Experience", value: state.players[m].experience, color: Theme.gold, onChange: { session.dispatch(.experienceChange(playerIdx: m, delta: $0)) }, onClose: close)
        case .memberTax(let m, let partner):
            let p = state.players[m]
            FocusModal(title: partner ? (p.partner?.name ?? "Partner") : "\(p.playerName): Commander Tax", value: partner ? p.partnerCommanderTax : p.commanderTax, color: .orange,
                       onChange: { session.dispatch(.commanderTaxChange(playerIdx: m, delta: $0, isPartner: partner)) }, onClose: close)
        case .commanderDamage(let src, let partner):
            let source = state.players[src]
            let dmg = state.commanderDamage[primary, src]
            FocusModal(title: "CMD Dmg — \(partner ? (source.partner?.name ?? "") : source.commander.name)", value: partner ? dmg.fromPartner : dmg.fromCommander,
                       color: (partner ? dmg.fromPartner : dmg.fromCommander) >= 21 ? Theme.danger : .primary, disableDec: source.isEliminated,
                       onChange: { session.dispatch(.commanderDamageChange(targetIdx: primary, sourceIdx: src, isPartner: partner, delta: $0)) }, onClose: close)
        case .energy, .experience, .tax:
            EmptyView()
        }
    }

    private func killPromptOverlay(_ kill: GameSession.PendingKill, _ sz: SeatPanel.Sizes) -> some View {
        let poisonKill = kill.cause == .poison
        let tint: Color = poisonKill ? Color(hex: 0x7FFF7F) : .white
        let living = opponents.filter { !state.players[$0].isEliminated }
        return ZStack {
            (poisonKill ? Color(red: 0, green: 40/255, blue: 0).opacity(0.78) : Color.black.opacity(0.72))
            VStack(spacing: 8) {
                Text(poisonKill ? "Who poisoned \(teamName)?" : "Who brought \(teamName) to 0?").font(.system(size: sz.kill, weight: .bold)).foregroundStyle(tint)
                HStack(spacing: 8) {
                    ForEach(living, id: \.self) { s in
                        Button(state.players[s].playerName) { session.attributeKill(kill, sourceIdx: s) }
                            .padding(.horizontal, 14).padding(.vertical, 6).overlay(RoundedRectangle(cornerRadius: 6).strokeBorder(tint.opacity(0.5)))
                    }
                    Button("Skip") { session.attributeKill(kill, sourceIdx: nil) }.foregroundStyle(tint.opacity(0.5))
                }
            }
            .foregroundStyle(tint)
        }
        .transition(.opacity)
    }
}
