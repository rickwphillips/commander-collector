import SwiftUI

/// The four counter glyphs the web renders (`CounterGlyph`): Phyrexian poison
/// symbol (green, red at lethal, 1.4× the row size), the {E} energy symbol in
/// cyan, the Commander emblem in gold for experience, and the silver tax
/// medallion reading `+2×tax`.
enum CounterKind { case poison, energy, xp, tax }

struct CounterGlyph: View {
    let kind: CounterKind
    var size: CGFloat = 16
    var poison = 0
    var poisonDanger = 10
    var taxValue = 0

    var body: some View {
        switch kind {
        case .poison:
            Image("phyrexian").resizable().renderingMode(.template)
                .foregroundStyle(poison >= poisonDanger ? Theme.danger : Theme.poisonGreen)
                .frame(width: size * 1.4, height: size * 1.4)
        case .energy:
            Image("energy").resizable().renderingMode(.template)
                .foregroundStyle(Theme.energyCyan)
                .frame(width: size, height: size)
        case .xp:
            Image("commander").resizable().renderingMode(.template)
                .foregroundStyle(Theme.gold)
                .frame(width: size, height: size)
        case .tax:
            TaxMedallion(tax: taxValue, size: size * 1.6)
        }
    }
}

/// Silver coin with `+N` where N is twice the tax (the generic mana it adds).
struct TaxMedallion: View {
    let tax: Int
    var size: CGFloat = 22

    var body: some View {
        ZStack {
            Circle().fill(RadialGradient(colors: [Color(hex: 0xD0D0D0), Color(hex: 0x7A7A7A)], center: .init(x: 0.38, y: 0.35), startRadius: 0, endRadius: size * 0.7))
            Circle().strokeBorder(Color(hex: 0x3A3A3A), lineWidth: 1.2)
            Circle().inset(by: 1.2).strokeBorder(.white.opacity(0.25), lineWidth: 1).mask(Rectangle().frame(height: size * 0.5).offset(y: -size * 0.25))
            Text("+\(tax * 2)")
                .font(.system(size: size * 0.45, weight: .heavy))
                .foregroundStyle(Color(hex: 0x111111))
                .minimumScaleFactor(0.5)
        }
        .frame(width: size, height: size)
        .shadow(color: .black.opacity(0.5), radius: 1.5, y: 1)
    }
}

/// Crown, as the web's `CrownIcon` path.
struct CrownGlyph: View {
    var body: some View {
        Image(systemName: "crown.fill").resizable().scaledToFit()
    }
}

/// City skyline for City's Blessing, purple gradient when active.
struct CityGlyph: View {
    var active = true
    var body: some View {
        Image(systemName: "building.2.crop.circle.fill").resizable().scaledToFit()
            .foregroundStyle(active
                ? AnyShapeStyle(LinearGradient(colors: [Theme.cityMagenta, Theme.cityPurple, Theme.cityIndigo], startPoint: .topLeading, endPoint: .bottomTrailing))
                : AnyShapeStyle(Color.secondary.opacity(0.4)))
    }
}

/// Castle for the initiative.
struct InitiativeGlyph: View {
    var body: some View {
        Image(systemName: "building.columns.fill").resizable().scaledToFit()
    }
}
