import Foundation

struct LyricLine: Identifiable, Equatable {
    let id: Int
    let time: Double
    let text: String
}

enum LRCParser {
    static func parse(_ input: String) -> [LyricLine] {
        let stamp = try! NSRegularExpression(pattern: #"\[(\d+):(\d{2}(?:\.\d+)?)\]"#)
        let offsetPattern = try! NSRegularExpression(pattern: #"(?i)\[offset:([+-]?\d+)\]"#)
        let ns = input as NSString
        let offsetMatch = offsetPattern.firstMatch(in: input, range: NSRange(location: 0, length: ns.length))
        let offset = offsetMatch.flatMap { Double(ns.substring(with: $0.range(at: 1))) }.map { $0 / 1000 } ?? 0
        var rows: [(Double, String)] = []
        for raw in input.components(separatedBy: .newlines) {
            let line = raw as NSString
            let matches = stamp.matches(in: raw, range: NSRange(location: 0, length: line.length))
            guard let last = matches.last else { continue }
            let text = line.substring(from: NSMaxRange(last.range)).trimmingCharacters(in: .whitespaces)
            for match in matches {
                guard let minutes = Double(line.substring(with: match.range(at: 1))), let seconds = Double(line.substring(with: match.range(at: 2))), seconds < 60 else { continue }
                rows.append((max(0, minutes * 60 + seconds + offset), text))
            }
        }
        return rows.enumerated().sorted { a, b in a.element.0 == b.element.0 ? a.offset < b.offset : a.element.0 < b.element.0 }.enumerated().map {
            LyricLine(id: $0.offset, time: $0.element.element.0, text: $0.element.element.1)
        }
    }
    static func activeIndex(in lines: [LyricLine], at position: Double) -> Int? {
        // Last timestamp at or before playback; supports backward seeks and blank instrumental gaps.
        var low = 0, high = lines.count
        while low < high {
            let mid = (low + high) / 2
            if lines[mid].time <= position { low = mid + 1 } else { high = mid }
        }
        return low > 0 ? low - 1 : nil
    }
}

struct LyricsRecord: Decodable {
    let instrumental: Bool?
    let plainLyrics: String?
    let syncedLyrics: String?
}
