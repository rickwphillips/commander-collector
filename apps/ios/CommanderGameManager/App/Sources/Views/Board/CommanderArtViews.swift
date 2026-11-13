import SwiftUI

/// Loads one commander image (art crop or full card) through CardArtService
/// and republishes it; the views below read it.
@Observable
@MainActor
final class CommanderArtLoader {
    private(set) var image: UIImage?
    private(set) var settled = false
    private(set) var name: String?
    private var full = false

    func load(_ name: String, full: Bool = false) {
        guard name != self.name || full != self.full else { return }
        self.name = name
        self.full = full
        image = nil
        settled = false
        let n = name
        Task {
            let img = full ? await CardArtService.shared.cardImage(for: n) : await CardArtService.shared.artCrop(for: n)
            guard n == self.name else { return }
            image = img
            settled = true
        }
    }
}

/// Header thumbnail: the art crop at the given height, 626:457 like Scryfall's
/// crops, fading in once it resolves. Renders a transparent slot until then so
/// the header never jumps.
struct CommanderArt: View {
    let name: String
    var height: CGFloat = 36
    var cornerRadius: CGFloat = 4
    var revealDelay: Double? = 0
    @State private var loader = CommanderArtLoader()

    var body: some View {
        ZStack {
            if let img = loader.image, let delay = revealDelay {
                Image(uiImage: img)
                    .resizable()
                    .scaledToFill()
                    .transition(.opacity.animation(.easeIn(duration: 0.7).delay(delay)))
            } else if loader.settled, revealDelay != nil {
                CardImageUnavailable(compact: true)
            }
        }
        .frame(width: height * 626 / 457, height: height)
        .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
        .task(id: name) { loader.load(name) }
        .animation(.easeIn(duration: 0.7), value: loader.image == nil)
    }
}

/// Faded card backdrop for a seat: art at 12 % opacity, or the commander name
/// diagonally at 16 % when there is none. `revealDelay` nil keeps it hidden
/// (no first player yet); a number reveals it after that delay with the web's
/// fade + slight scale-down, and `flash` punctuates the end of the fade.
struct CommanderBackdrop: View {
    /// The intro fade; the flash swells in its last stretch and dies with it.
    static let fadeSeconds = 2.2
    /// How long before the fade ends the flash begins (rise + fall).
    static let flashSeconds = 1.2
    let name: String
    let revealDelay: Double?
    var flash = false
    @State private var loader = CommanderArtLoader()
    @State private var shown = false
    @State private var flashing = false

    var body: some View {
        GeometryReader { geo in
            ZStack {
                if loader.settled {
                    if let img = loader.image {
                        Image(uiImage: img).resizable().scaledToFill()
                            .frame(width: geo.size.width, height: geo.size.height)
                            .opacity(0.12)
                    } else {
                        Text(name.uppercased())
                            .font(.system(size: min(geo.size.height * 0.2, 44), weight: .black))
                            .lineLimit(1)
                            .minimumScaleFactor(0.3)
                            .rotationEffect(.degrees(-28))
                            .opacity(0.16)
                            .frame(width: geo.size.width, height: geo.size.height)
                    }
                }
            }
            .opacity(shown ? 1 : 0)
            .scaleEffect(shown ? 1 : 1.06)
            .overlay {
                // Drawn over the fade, not inside it, so it is not dimmed by
                // the art's own opacity while the art is still arriving.
                if flash {
                    RadialGradient(colors: [Color(hex: 0xFFF1D6), Color(hex: 0xFFE6BC).opacity(0)], center: .init(x: 0.5, y: 0.45), startRadius: 0, endRadius: max(geo.size.width, geo.size.height) * 0.6)
                        .opacity(flashing ? 0.48 : 0)
                }
            }
            .clipped()
            .allowsHitTesting(false)
        }
        .task(id: name) { loader.load(name) }
        .task(id: revealDelay) {
            guard let delay = revealDelay else { shown = false; return }
            try? await Task.sleep(for: .milliseconds(Int(delay * 1000)))
            withAnimation(.easeInOut(duration: Self.fadeSeconds)) { shown = true }
            guard flash else { return }
            // The art fades in slowly on its own; near the end a swell of
            // light rises and falls so the flash and the art land together.
            let rise = Self.flashSeconds * 0.4
            let fall = Self.flashSeconds - rise
            try? await Task.sleep(for: .milliseconds(Int((Self.fadeSeconds - Self.flashSeconds) * 1000)))
            SoundService.shared.playRevealWhoosh(rise: rise, fall: fall)
            withAnimation(.easeIn(duration: rise)) { flashing = true }
            try? await Task.sleep(for: .milliseconds(Int(rise * 1000)))
            withAnimation(.easeOut(duration: fall)) { flashing = false }
        }
    }
}

/// Faded backdrop for a 2HG team panel, from its two heads' commanders (the
/// left head on the left). Both have art: the two images, blended into each
/// other by a gradient across the middle. One has art: that image across the
/// panel, with the other commander's name on its own side. Neither: both names.
/// Each head is revealed on its own delay, like a seat's `CommanderBackdrop`:
/// a slow fade, and with `flash` a swell of light and a whoosh on its side.
struct TeamBackdrop: View {
    let names: [String]
    /// Per head, the delay (s) before it reveals.
    var revealDelays: [Double] = [0, 0]
    var flash = false
    @State private var loaders = [CommanderArtLoader(), CommanderArtLoader()]
    @State private var shown = [false, false]
    @State private var flashing = [false, false]

    private var settled: Bool { loaders.allSatisfy(\.settled) }
    private func name(_ i: Int) -> String { names.indices.contains(i) ? names[i] : "" }
    private func delay(_ i: Int) -> Double { revealDelays.indices.contains(i) ? revealDelays[i] : 0 }

    var body: some View {
        GeometryReader { geo in
            let w = geo.size.width, h = geo.size.height
            ZStack {
                if settled {
                    switch (loaders[0].image, loaders[1].image) {
                    case let (left?, right?):
                        // Each image covers its own side and reaches past the
                        // middle, fading out where the other fades in.
                        half(left, width: w * 0.62, height: h, fadeToTrailing: true).frame(width: w, height: h, alignment: .leading).revealed(shown[0])
                        half(right, width: w * 0.62, height: h, fadeToTrailing: false).frame(width: w, height: h, alignment: .trailing).revealed(shown[1])
                    case let (left?, nil):
                        art(left, width: w, height: h).revealed(shown[0])
                        nameMark(name(1), height: h).frame(width: w / 2, height: h).frame(width: w, height: h, alignment: .trailing).revealed(shown[1])
                    case let (nil, right?):
                        art(right, width: w, height: h).revealed(shown[1])
                        nameMark(name(0), height: h).frame(width: w / 2, height: h).frame(width: w, height: h, alignment: .leading).revealed(shown[0])
                    case (nil, nil):
                        HStack(spacing: 0) {
                            nameMark(name(0), height: h).frame(width: w / 2, height: h).revealed(shown[0])
                            nameMark(name(1), height: h).frame(width: w / 2, height: h).revealed(shown[1])
                        }
                    }
                }
                if flash {
                    ForEach(0..<2, id: \.self) { i in
                        RadialGradient(colors: [Color(hex: 0xFFF1D6), Color(hex: 0xFFE6BC).opacity(0)], center: .init(x: i == 0 ? 0.25 : 0.75, y: 0.45), startRadius: 0, endRadius: max(w / 2, h) * 0.6)
                            .opacity(flashing[i] ? 0.48 : 0)
                    }
                }
            }
            .frame(width: w, height: h)
            .clipped()
            .allowsHitTesting(false)
        }
        // Read here, in the body itself, so the view refreshes when the art settles.
        .animation(.easeIn(duration: 0.7), value: settled)
        .task(id: names) {
            for (i, loader) in loaders.enumerated() { loader.load(name(i)) }
        }
        .task(id: delay(0)) { await reveal(0) }
        .task(id: delay(1)) { await reveal(1) }
    }

    /// One head's introduction, timed as `CommanderBackdrop` times a seat's.
    private func reveal(_ i: Int) async {
        try? await Task.sleep(for: .milliseconds(Int(delay(i) * 1000)))
        if Task.isCancelled { return }
        withAnimation(.easeInOut(duration: CommanderBackdrop.fadeSeconds)) { shown[i] = true }
        guard flash else { return }
        let rise = CommanderBackdrop.flashSeconds * 0.4
        let fall = CommanderBackdrop.flashSeconds - rise
        try? await Task.sleep(for: .milliseconds(Int((CommanderBackdrop.fadeSeconds - CommanderBackdrop.flashSeconds) * 1000)))
        if Task.isCancelled { return }
        SoundService.shared.playRevealWhoosh(rise: rise, fall: fall)
        withAnimation(.easeIn(duration: rise)) { flashing[i] = true }
        try? await Task.sleep(for: .milliseconds(Int(rise * 1000)))
        withAnimation(.easeOut(duration: fall)) { flashing[i] = false }
    }

    private func art(_ image: UIImage, width: CGFloat, height: CGFloat) -> some View {
        Image(uiImage: image).resizable().scaledToFill().frame(width: width, height: height).clipped().opacity(0.12)
    }

    private func half(_ image: UIImage, width: CGFloat, height: CGFloat, fadeToTrailing: Bool) -> some View {
        art(image, width: width, height: height)
            .mask(LinearGradient(stops: [.init(color: .black, location: 0), .init(color: .black, location: 0.6), .init(color: .clear, location: 1)],
                                 startPoint: fadeToTrailing ? .leading : .trailing, endPoint: fadeToTrailing ? .trailing : .leading))
    }

    private func nameMark(_ name: String, height: CGFloat) -> some View {
        Text(name.uppercased())
            .font(.system(size: min(height * 0.2, 44), weight: .black))
            .lineLimit(1)
            .minimumScaleFactor(0.3)
            .rotationEffect(.degrees(-28))
            .opacity(0.16)
            .padding(.horizontal, 12)
    }
}

private extension View {
    /// The web's backdrop reveal: fade in while easing down from a slight zoom.
    func revealed(_ shown: Bool) -> some View {
        opacity(shown ? 1 : 0).scaleEffect(shown ? 1 : 1.06)
    }
}

/// Full-panel card preview: the card image, tap to zoom 2.5× and scroll, tap
/// the backdrop to close. Rendered inside the seat so it faces its player.
struct CardPreviewOverlay: View {
    let name: String
    let onClose: () -> Void
    @State private var loader = CommanderArtLoader()
    @State private var zoomed = false
    @Environment(\.compactTable) private var compact

    /// Zoomed size: 1.2× the image on the iPad; on a phone a card wide enough
    /// to read the rules text, which the image's own size overshoots.
    private func zoomedSize(_ img: UIImage) -> CGSize {
        let w = compact ? Self.phoneZoomWidth : img.size.width * 1.2
        return CGSize(width: w, height: w * img.size.height / img.size.width)
    }
    private static let phoneZoomWidth: CGFloat = 400

    var body: some View {
        ZStack {
            Color.black.opacity(0.88).onTapGesture(perform: onClose)
            if let img = loader.image {
                if zoomed {
                    let size = zoomedSize(img)
                    ScrollView([.horizontal, .vertical]) {
                        Image(uiImage: img).resizable().scaledToFit()
                            .frame(width: size.width, height: size.height)
                            .clipShape(RoundedRectangle(cornerRadius: 18))
                            .onTapGesture { zoomed = false }
                    }
                    .defaultScrollAnchor(.bottom)
                    .padding(8)
                } else {
                    Image(uiImage: img).resizable().scaledToFit()
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        .padding(18)
                        .onTapGesture { zoomed = true }
                }
            } else if loader.settled {
                CardImageUnavailable(name: name).frame(maxWidth: 320).aspectRatio(63 / 88, contentMode: .fit).padding(18)
            } else {
                ProgressView().tint(.white.opacity(0.6))
            }
            VStack {
                HStack {
                    Spacer()
                    Button(action: onClose) {
                        Image(systemName: "xmark").font(.title3.bold()).padding(8)
                            .background(Circle().fill(.black.opacity(0.5)))
                            .foregroundStyle(.white.opacity(0.85))
                    }
                    .accessibilityIdentifier("previewClose")
                    .padding(8)
                }
                Spacer()
            }
        }
        .task(id: name) { loader.load(name, full: true) }
    }
}

/// What stands in for a card image Scryfall could not supply (web
/// `card-not-found.webp`): a card-shaped frame with the name, or just the
/// frame and a symbol in the compact thumbnail size.
struct CardImageUnavailable: View {
    var name: String? = nil
    var compact = false

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: compact ? 3 : 12)
                .fill(Color(red: 0.16, green: 0.14, blue: 0.12))
            RoundedRectangle(cornerRadius: compact ? 3 : 12)
                .strokeBorder(Color.white.opacity(0.18), style: StrokeStyle(lineWidth: compact ? 1 : 2, dash: compact ? [] : [8, 6]))
            if compact {
                Image(systemName: "photo").font(.system(size: 12)).foregroundStyle(.white.opacity(0.45))
            } else {
                VStack(spacing: 10) {
                    Image(systemName: "photo.on.rectangle.angled").font(.system(size: 40)).foregroundStyle(.white.opacity(0.4))
                    if let name { Text(name).font(.headline).foregroundStyle(.white.opacity(0.85)).multilineTextAlignment(.center).padding(.horizontal, 12) }
                    Text("No card image available").font(.caption).foregroundStyle(.white.opacity(0.5))
                }
            }
        }
    }
}
