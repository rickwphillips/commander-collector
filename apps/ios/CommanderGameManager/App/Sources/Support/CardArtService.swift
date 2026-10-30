import CryptoKit
import Foundation
import UIKit

/// Commander art, straight from Scryfall and cached on disk. The web board
/// proxies art through the PHP API because phones at the table cannot reach
/// the CDN through the shared session; the iPad can, and going direct keeps
/// the shared server out of every refresh and re-render (Rick's rule: the
/// server is touched at sign-in, refresh and upload only).
///
/// Three things are cached per card name, each at most once per install:
/// the card's Scryfall record (art crop + full image URLs), the art crop
/// bytes and the full card image bytes.
actor CardArtService {
    static let shared = CardArtService()

    struct CardImages: Codable, Sendable {
        var artCrop: URL?
        var normal: URL?
    }

    private let session: URLSession
    private let directory: URL
    private var records: [String: CardImages] = [:]
    private var missing: Set<String> = []
    private var inFlight: [String: Task<CardImages?, Never>] = [:]
    private var lastRequest = Date.distantPast

    init() {
        let config = URLSessionConfiguration.default
        config.httpAdditionalHeaders = ["User-Agent": "CommanderGameManager/0.1 (iPad)", "Accept": "application/json;q=0.9,*/*;q=0.8"]
        config.requestCachePolicy = .returnCacheDataElseLoad
        session = URLSession(configuration: config)
        let caches = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0]
        directory = caches.appendingPathComponent("CardArt", isDirectory: true)
        try? FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
    }

    // MARK: Public

    /// The art crop for a commander name, or nil when Scryfall has no such card.
    func artCrop(for name: String) async -> UIImage? {
        guard let record = await record(for: name), let url = record.artCrop else { return nil }
        return await image(at: url, key: "art-\(name)")
    }

    /// The full card image (Scryfall "normal") for a commander name.
    func cardImage(for name: String) async -> UIImage? {
        guard let record = await record(for: name), let url = record.normal else { return nil }
        return await image(at: url, key: "card-\(name)")
    }

    /// Scryfall autocomplete for the commander search in the seat picker and
    /// the deck editor. Empty on any failure.
    func autocomplete(_ query: String) async -> [String] {
        let trimmed = query.trimmingCharacters(in: .whitespaces)
        guard trimmed.count >= 2 else { return [] }
        var comps = URLComponents(string: "https://api.scryfall.com/cards/autocomplete")!
        comps.queryItems = [URLQueryItem(name: "q", value: trimmed)]
        await throttle()
        guard let (data, response) = try? await session.data(from: comps.url!),
              (response as? HTTPURLResponse)?.statusCode == 200,
              let body = try? JSONDecoder().decode(Autocomplete.self, from: data) else { return [] }
        return body.data
    }

    /// Fetch and cache art for every name so the board never waits on the
    /// network once play starts.
    func prewarm(_ names: [String]) async {
        for name in names where !name.isEmpty {
            _ = await artCrop(for: name)
        }
    }

    // MARK: Lookup

    private struct Autocomplete: Decodable { var data: [String] }
    private struct ScryfallCard: Decodable {
        struct Uris: Decodable { var art_crop: URL?; var normal: URL? }
        struct Face: Decodable { var image_uris: Uris? }
        var image_uris: Uris?
        var card_faces: [Face]?
        var images: CardImages {
            let u = image_uris ?? card_faces?.first?.image_uris
            return CardImages(artCrop: u?.art_crop, normal: u?.normal)
        }
    }

    private func record(for rawName: String) async -> CardImages? {
        let name = rawName.trimmingCharacters(in: .whitespaces)
        guard !name.isEmpty, !missing.contains(name) else { return nil }
        if let hit = records[name] { return hit }
        if let disk = loadRecord(name) { records[name] = disk; return disk }
        if let task = inFlight[name] { return await task.value }
        let task = Task<CardImages?, Never> { await self.fetchRecord(name) }
        inFlight[name] = task
        let result = await task.value
        inFlight[name] = nil
        return result
    }

    private func fetchRecord(_ name: String) async -> CardImages? {
        var comps = URLComponents(string: "https://api.scryfall.com/cards/named")!
        comps.queryItems = [URLQueryItem(name: "exact", value: name)]
        await throttle()
        guard let (data, response) = try? await session.data(from: comps.url!) else { return nil }
        let status = (response as? HTTPURLResponse)?.statusCode ?? 0
        if status == 404 {
            // Try a fuzzy match once (deck names sometimes carry a nickname or a typo).
            comps.queryItems = [URLQueryItem(name: "fuzzy", value: name)]
            await throttle()
            guard let (fuzzyData, fuzzyResponse) = try? await session.data(from: comps.url!),
                  (fuzzyResponse as? HTTPURLResponse)?.statusCode == 200,
                  let card = try? JSONDecoder().decode(ScryfallCard.self, from: fuzzyData) else {
                missing.insert(name)
                return nil
            }
            return store(card.images, for: name)
        }
        guard status == 200, let card = try? JSONDecoder().decode(ScryfallCard.self, from: data) else { return nil }
        return store(card.images, for: name)
    }

    private func store(_ images: CardImages, for name: String) -> CardImages {
        records[name] = images
        if let data = try? JSONEncoder().encode(images) {
            try? data.write(to: file(for: "record-\(name)", ext: "json"), options: .atomic)
        }
        return images
    }

    private func loadRecord(_ name: String) -> CardImages? {
        guard let data = try? Data(contentsOf: file(for: "record-\(name)", ext: "json")) else { return nil }
        return try? JSONDecoder().decode(CardImages.self, from: data)
    }

    // MARK: Images

    private var imageCache = NSCache<NSString, UIImage>()

    private func image(at url: URL, key: String) async -> UIImage? {
        if let hit = imageCache.object(forKey: key as NSString) { return hit }
        let path = file(for: key, ext: "jpg")
        if let data = try? Data(contentsOf: path), let img = UIImage(data: data) {
            imageCache.setObject(img, forKey: key as NSString)
            return img
        }
        await throttle()
        guard let (data, response) = try? await session.data(from: url),
              (response as? HTTPURLResponse)?.statusCode == 200,
              let img = UIImage(data: data) else { return nil }
        try? data.write(to: path, options: .atomic)
        imageCache.setObject(img, forKey: key as NSString)
        return img
    }

    // MARK: Helpers

    /// Scryfall asks for 50 to 100 ms between requests.
    private func throttle() async {
        let gap = Date().timeIntervalSince(lastRequest)
        if gap < 0.1 { try? await Task.sleep(for: .milliseconds(Int((0.1 - gap) * 1000))) }
        lastRequest = Date()
    }

    /// Stable file name: a readable prefix plus a content hash (Swift's
    /// `hashValue` is salted per launch, so it cannot name a cache file).
    private func file(for key: String, ext: String) -> URL {
        let safe = String(key.unicodeScalars.map { CharacterSet.alphanumerics.contains($0) ? Character($0) : "_" }.prefix(60))
        let digest = SHA256.hash(data: Data(key.utf8)).prefix(8).map { String(format: "%02x", $0) }.joined()
        return directory.appendingPathComponent("\(safe)-\(digest)").appendingPathExtension(ext)
    }
}
