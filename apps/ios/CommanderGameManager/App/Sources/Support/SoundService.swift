import AVFoundation
import AudioToolbox
import Foundation
import UIKit

/// The board's sounds. The four web mp3s ship in the bundle; the poison
/// drone and the firework loop are synthesised with AVAudioEngine like the
/// web's AudioContext graphs.
@MainActor
final class SoundService {
    static let shared = SoundService()

    var enabled = true { didSet { if !enabled { stopAll() } } }

    private var players: [String: AVAudioPlayer] = [:]
    private var loops: [String: AVAudioPlayer] = [:]
    private var engine: AVAudioEngine?
    private var droneNodes: [AVAudioNode] = []
    private var fireworkTask: Task<Void, Never>?

    private init() {
        try? AVAudioSession.sharedInstance().setCategory(.ambient, mode: .default, options: [.mixWithOthers])
        try? AVAudioSession.sharedInstance().setActive(true)
    }

    // MARK: One-shots

    /// The iPhone keyboard's key click, for every plus and minus on the board.
    /// Plays regardless of the Sound setting, which covers the effect audio.
    func playClick() {
        AudioServicesPlaySystemSound(1104)
    }

    func playD20() { play("d-20") }
    func playD6() { play("d-6") }
    func playCitysBlessingIntro() { play("citys_blessing_intro") }

    private func play(_ name: String, volume: Float = 1) {
        guard enabled, let url = Bundle.main.url(forResource: name, withExtension: "mp3") else { return }
        let player = players[name] ?? (try? AVAudioPlayer(contentsOf: url))
        guard let player else { return }
        players[name] = player
        player.volume = volume
        player.currentTime = 0
        player.play()
    }

    // MARK: Intro reveal

    /// A soft whoosh under each seat's intro flash: band-passed noise that
    /// sweeps up and swells over `rise`, then sinks and darkens over `fall`,
    /// so it peaks with the light and goes quiet as the art lands. A soft
    /// high twinkle glitters around the crest and trails into the fall.
    func playRevealWhoosh(rise: Double, fall: Double) {
        guard enabled else { return }
        let sampleRate = 44_100.0
        let duration = rise + fall
        let frames = Int(sampleRate * duration)
        guard let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 1),
              let whoosh = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: AVAudioFrameCount(frames)),
              let twinkle = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: AVAudioFrameCount(frames)) else { return }
        whoosh.frameLength = AVAudioFrameCount(frames)
        twinkle.frameLength = AVAudioFrameCount(frames)
        let wd = whoosh.floatChannelData![0]
        let td = twinkle.floatChannelData![0]
        var lp: Float = 0, lp2: Float = 0
        // Sparkles begin just before the crest and trail into the fall.
        let grains = (0..<18).map { _ in
            Grain(at: rise - 0.08 + Double.random(in: 0...min(0.45, fall)),
                  hz: Double.random(in: 4200...8200),
                  length: Double.random(in: 0.18...0.4),
                  gain: Double.random(in: 0.009...0.021))
        }
        for i in 0..<frames {
            let t = Double(i) / sampleRate
            let noise = Float.random(in: -1...1)
            // Centre frequency climbs 300 → 2200 Hz to the crest, then eases back down.
            let u = t < rise ? t / rise : 1 - (t - rise) / fall
            let cutoff = Float(300 * pow(2200 / 300, u))
            let a1 = min(1, cutoff * 1.5 / Float(sampleRate) * 2 * .pi)
            let a2 = min(1, cutoff * 0.6 / Float(sampleRate) * 2 * .pi)
            lp += a1 * (noise - lp)
            lp2 += a2 * (noise - lp2)
            let band = lp - lp2
            let env = t < rise ? pow(t / rise, 2) : pow(max(0, 1 - (t - rise) / fall), 1.6)
            wd[i] = band * Float(env) * 0.12
            // Twinkle: a scatter of tiny high sparkles around the crest, each
            // a soft-attacked sine grain, so it glitters instead of striking.
            var sparkle = 0.0
            for g in grains {
                let gt = t - g.at
                guard gt >= 0, gt < g.length else { continue }
                let genv = gt < 0.03 ? gt / 0.03 : exp(-(gt - 0.03) * (4 / g.length))
                sparkle += sin(gt * g.hz * 2 * .pi) * genv * g.gain
            }
            td[i] = Float(sparkle)
        }
        // Two sends: the whoosh sits further back in the hall than the sparkle.
        playBuffer(whoosh, format: format, reverb: 0.75)
        playBuffer(twinkle, format: format, reverb: 0.55)
    }

    private struct Grain { let at: Double; let hz: Double; let length: Double; let gain: Double }

    // MARK: Poison ambience (web usePoisonSound)

    /// Called with the highest poison on the board (eliminated seats excluded).
    /// Drone from 7 (quiet), bubbles from 8, louder at 9+.
    func setPoisonLevel(_ poison: Int) {
        guard enabled, poison >= 7 else { stopPoison(); return }
        let volume: Float = poison == 7 ? 0.18 : poison == 8 ? 0.35 : 1
        startDrone(volume: 0.12 * volume)
        if poison >= 8 {
            startLoop("poison_bubbles", volume: poison == 8 ? 0.35 : 0.7)
        } else {
            stopLoop("poison_bubbles")
        }
        if poison >= 9 { startStabs() } else { stabTask?.cancel(); stabTask = nil }
    }

    func stopPoison() {
        stopLoop("poison_bubbles")
        stopDrone()
        stabTask?.cancel(); stabTask = nil
    }

    // MARK: Violin stabs (poison 9+): a thin high sawtooth with a slow bow
    // attack, every 4 to 11 seconds, like the web's soprano stabs.

    private var stabTask: Task<Void, Never>?

    private func startStabs() {
        guard stabTask == nil else { return }
        stabTask = Task { @MainActor in
            try? await Task.sleep(for: .seconds(3 + Double.random(in: 0...4)))
            while !Task.isCancelled {
                playStab()
                try? await Task.sleep(for: .seconds(4 + Double.random(in: 0...7)))
            }
        }
    }

    private func playStab() {
        let sampleRate = 44_100.0
        let freq = 1100 + Double.random(in: 0...600)
        let duration = 1.2 + Double.random(in: 0...0.8)
        let frames = Int(sampleRate * (duration + 0.05))
        guard let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 1),
              let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: AVAudioFrameCount(frames)) else { return }
        buffer.frameLength = AVAudioFrameCount(frames)
        let data = buffer.floatChannelData![0]
        let trem = 7.5 + Double.random(in: 0...2)
        var phase = 0.0
        var bp = 0.0, lp = 0.0
        for i in 0..<frames {
            let t = Double(i) / sampleRate
            phase += freq / sampleRate; if phase > 1 { phase -= 1 }
            let saw = 2 * phase - 1
            // Crude band-pass around 1.4× the pitch: a low-pass minus a lower low-pass.
            let a1 = min(1, freq * 1.4 * 1.6 / sampleRate * 2 * .pi)
            let a2 = min(1, freq * 1.4 * 0.6 / sampleRate * 2 * .pi)
            lp += a1 * (saw - lp)
            bp += a2 * (saw - bp)
            let band = lp - bp
            let env = t < 0.45 ? t / 0.45 : t < duration - 0.5 ? 1 : max(0, (duration - t) / 0.5)
            let tremolo = 1 + 0.25 * sin(t * trem * 2 * .pi)
            data[i] = Float(band * env * tremolo * 0.07)
        }
        playBuffer(buffer, format: format)
    }

    private func startLoop(_ name: String, volume: Float) {
        if let p = loops[name] { p.volume = volume; if !p.isPlaying { p.play() }; return }
        guard let url = Bundle.main.url(forResource: name, withExtension: "mp3"), let p = try? AVAudioPlayer(contentsOf: url) else { return }
        p.numberOfLoops = -1
        p.volume = volume
        p.play()
        loops[name] = p
    }

    private func stopLoop(_ name: String) {
        loops[name]?.stop()
        loops[name] = nil
    }

    /// Low filtered sawtooth with a slow tremolo: the web's "ominous drone".
    private func startDrone(volume: Float) {
        if let engine, engine.isRunning, let mixer = droneNodes.last as? AVAudioMixerNode {
            mixer.outputVolume = volume
            return
        }
        let engine = AVAudioEngine()
        let format = AVAudioFormat(standardFormatWithSampleRate: 44_100, channels: 1)!
        let synth = DroneSynth(sampleRate: Float(format.sampleRate))
        // Rendered on the audio thread: the block must not be main-actor isolated.
        let render: AVAudioSourceNodeRenderBlock = { @Sendable _, _, frameCount, audioBufferList in
            synth.render(frameCount, audioBufferList)
        }
        let source = AVAudioSourceNode(renderBlock: render)
        let mixer = AVAudioMixerNode()
        engine.attach(source)
        engine.attach(mixer)
        engine.connect(source, to: mixer, format: format)
        engine.connect(mixer, to: engine.mainMixerNode, format: format)
        mixer.outputVolume = 0
        do {
            try engine.start()
        } catch { return }
        self.engine = engine
        droneNodes = [source, mixer]
        // Fade in over ~3.5 s like the web.
        Task { @MainActor in
            for step in 1...35 {
                try? await Task.sleep(for: .milliseconds(100))
                guard self.engine === engine else { return }
                mixer.outputVolume = volume * Float(step) / 35
            }
        }
    }

    private func stopDrone() {
        engine?.stop()
        engine = nil
        droneNodes = []
    }

    // MARK: City's Blessing fireworks (web useSounds)

    /// After the intro fanfare (~33 s), a firework whoosh + thud every 7 to 15 s.
    /// Starts (or stops) the firework booms. They follow the scene's own
    /// launcher cycles, so each boom lands on a burst drawn in `CityBlessing`,
    /// which starts its clock at the same moment this is called. Every
    /// launcher booms, but a boom close on the heels of another is softer,
    /// and one inside half a second of the last is dropped.
    func setCitysBlessingActive(_ active: Bool) {
        guard active, enabled else { fireworkTask?.cancel(); fireworkTask = nil; return }
        guard fireworkTask == nil else { return }
        let launchers = CityBlessing.fireworkBursts
        fireworkTask = Task { @MainActor in
            let start = Date()
            var next = launchers.map { $0.delay + $0.dur * CityBlessing.burstPhase - Self.thudOffset }
            var lastBoom: Date?
            while !Task.isCancelled, let i = next.indices.min(by: { next[$0] < next[$1] }) {
                let wait = next[i] - Date().timeIntervalSince(start)
                if wait > 0 { try? await Task.sleep(for: .seconds(wait)) }
                if Task.isCancelled { return }
                next[i] += launchers[i].dur
                let gap = lastBoom.map { Date().timeIntervalSince($0) } ?? .infinity
                if gap < Self.minBoomGap { continue }
                // Full voice after a quiet spell, down to a third right after another boom.
                let attenuation = max(0.33, min(1, gap / Self.fullVoiceGap))
                playFirework(scale: launchers[i].scale, attenuation: attenuation)
                lastBoom = Date()
            }
        }
    }

    /// Booms closer together than this are dropped.
    private static let minBoomGap = 0.5
    /// Gap after which a boom is back at full voice.
    private static let fullVoiceGap = 3.0

    /// The boom starts at the top of the sound.
    private static let thudOffset = 0.0

    private func playFirework(scale: Double = 1, attenuation: Double = 1) {
        // Quieter on a phone, whose speaker sits right by the players; the
        // bigger launcher booms harder; a boom right after another is softer.
        let gain = Float(UIDevice.current.userInterfaceIdiom == .phone ? 0.22 : 0.45) * Float((0.7 + 0.2 * scale) * attenuation)
        // Just the boom: a falling sine thud, no launch hiss.
        let sampleRate = 44_100.0
        let duration = 0.6
        let frames = Int(sampleRate * duration)
        guard let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 1),
              let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: AVAudioFrameCount(frames)) else { return }
        buffer.frameLength = AVAudioFrameCount(frames)
        let data = buffer.floatChannelData![0]
        var thudPhase: Double = 0
        for i in 0..<frames {
            let t = Double(i) / sampleRate
            var sample: Float = 0
            let bt = t
            do {
                let freq = 120 * pow(45 / 120, min(bt / 0.3, 1))
                thudPhase += freq / sampleRate
                let env = Float(exp(-bt * 9)) * (bt < 0.006 ? Float(bt / 0.006) : 1)
                sample += Float(sin(thudPhase * 2 * .pi)) * env * 0.9
            }
            data[i] = sample * gain
        }
        playBuffer(buffer, format: format)
    }

    /// Plays one synthesised buffer through the shared engine and detaches
    /// its player when it has finished. `reverb` (0...1 wet mix) sends it
    /// through a large hall; the nodes then linger long enough for the tail.
    private func playBuffer(_ buffer: AVAudioPCMBuffer, format: AVAudioFormat, reverb: Float? = nil) {
        let engine = self.engine ?? AVAudioEngine()
        let player = AVAudioPlayerNode()
        engine.attach(player)
        var nodes: [AVAudioNode] = [player]
        if let reverb {
            let hall = AVAudioUnitReverb()
            hall.loadFactoryPreset(.largeHall2)
            hall.wetDryMix = reverb * 100
            engine.attach(hall)
            engine.connect(player, to: hall, format: format)
            engine.connect(hall, to: engine.mainMixerNode, format: format)
            nodes.append(hall)
        } else {
            engine.connect(player, to: engine.mainMixerNode, format: format)
        }
        if !engine.isRunning { try? engine.start() }
        self.engine = engine
        let tail: Duration = reverb == nil ? .zero : .seconds(4)
        let done = nodes
        player.scheduleBuffer(buffer, completionCallbackType: .dataPlayedBack) { @Sendable _ in
            Task { @MainActor in
                try? await Task.sleep(for: tail)
                done.forEach { engine.detach($0) }
            }
        }
        player.play()
    }

    private func stopAll() {
        players.values.forEach { $0.stop() }
        loops.keys.forEach(stopLoop)
        stopDrone()
        fireworkTask?.cancel(); fireworkTask = nil
        stabTask?.cancel(); stabTask = nil
    }
}

/// Low filtered sawtooth with a slow tremolo (the web's "ominous drone"),
/// generated on the audio render thread.
private final class DroneSynth: @unchecked Sendable {
    private var phase: Float = 0
    private var lfoPhase: Float = 0
    private var lp: Float = 0
    private let sampleRate: Float

    init(sampleRate: Float) { self.sampleRate = sampleRate }

    nonisolated func render(_ frameCount: AVAudioFrameCount, _ audioBufferList: UnsafeMutablePointer<AudioBufferList>) -> OSStatus {
        let buffers = UnsafeMutableAudioBufferListPointer(audioBufferList)
        guard let out = buffers[0].mData?.assumingMemoryBound(to: Float.self) else { return noErr }
        for i in 0..<Int(frameCount) {
            // Sawtooth at 58 Hz (Bb1), one-pole low-pass near 180 Hz, 0.12 Hz tremolo.
            phase += 58 / sampleRate
            if phase > 1 { phase -= 1 }
            let saw = 2 * phase - 1
            let alpha: Float = 180 / sampleRate * 2 * .pi
            lp += alpha * (saw - lp)
            lfoPhase += 0.12 / sampleRate
            if lfoPhase > 1 { lfoPhase -= 1 }
            let trem = 0.75 + 0.25 * sin(lfoPhase * 2 * .pi)
            out[i] = lp * trem
        }
        return noErr
    }
}
