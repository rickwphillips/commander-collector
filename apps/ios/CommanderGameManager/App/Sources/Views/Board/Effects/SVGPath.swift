import SwiftUI

/// A SwiftUI `Path` built from an SVG `d` string, so the board can draw the
/// same silhouettes the web draws (absolute M/L/H/V/C/Q/Z commands, which is
/// all the web scenes use).
extension Path {
    init(svg d: String) {
        var path = Path()
        var numbers: [CGFloat] = []
        var command: Character = "M"
        var current = CGPoint.zero
        var number = ""

        func flushNumber() {
            if let v = Double(number) { numbers.append(CGFloat(v)) }
            number = ""
        }
        func apply() {
            switch command {
            case "M":
                var i = 0
                while i + 1 < numbers.count {
                    current = CGPoint(x: numbers[i], y: numbers[i + 1])
                    if i == 0 { path.move(to: current) } else { path.addLine(to: current) }
                    i += 2
                }
            case "L":
                var i = 0
                while i + 1 < numbers.count { current = CGPoint(x: numbers[i], y: numbers[i + 1]); path.addLine(to: current); i += 2 }
            case "H":
                for x in numbers { current.x = x; path.addLine(to: current) }
            case "V":
                for y in numbers { current.y = y; path.addLine(to: current) }
            case "C":
                var i = 0
                while i + 5 < numbers.count {
                    let c1 = CGPoint(x: numbers[i], y: numbers[i + 1]), c2 = CGPoint(x: numbers[i + 2], y: numbers[i + 3])
                    current = CGPoint(x: numbers[i + 4], y: numbers[i + 5])
                    path.addCurve(to: current, control1: c1, control2: c2)
                    i += 6
                }
            case "Q":
                var i = 0
                while i + 3 < numbers.count {
                    let c = CGPoint(x: numbers[i], y: numbers[i + 1])
                    current = CGPoint(x: numbers[i + 2], y: numbers[i + 3])
                    path.addQuadCurve(to: current, control: c)
                    i += 4
                }
            case "Z", "z":
                path.closeSubpath()
            default:
                break
            }
            numbers.removeAll()
        }

        for ch in d {
            if ch.isLetter {
                flushNumber()
                apply()
                command = ch
            } else if ch == "," || ch == " " || ch == "\n" || ch == "\t" {
                flushNumber()
            } else if ch == "-" && !number.isEmpty && !number.hasSuffix("e") {
                flushNumber()
                number = "-"
            } else {
                number.append(ch)
            }
        }
        flushNumber()
        apply()
        self = path
    }

    /// The path mapped from its SVG viewBox into `rect` (non-uniform, like
    /// `preserveAspectRatio="none"`).
    func fitted(viewBox: CGSize, in rect: CGRect) -> Path {
        applying(CGAffineTransform(translationX: rect.minX, y: rect.minY)
            .scaledBy(x: rect.width / viewBox.width, y: rect.height / viewBox.height))
    }
}
