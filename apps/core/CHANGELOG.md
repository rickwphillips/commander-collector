# Changelog

## [5.7.0] - 2026-05-18

- Card metadata resolver, coach list editing, security fixes, and test coverage

## [5.6.0] - 2026-05-17

- Coach chat SSE streaming replaces fire-and-forget polling

## [5.5.0] - 2026-05-16

- Commander MCP integration: hover tooltips for **CR rule refs** and **P-numbers** in Rules Guru, PHP proxy (`/rules/cr-rule.php`, `/rules/pattern.php`) talking to the FastMCP streamable-HTTP transport, deck bracket scoring, banned-card badges, quick-lookup rules UI components
- Card name catalog shared package so Rules Guru only flags actual cards (fixes spinning on non-card bold text)
- Rules Guru feedback system: per-message thumb rating, session feedback drawer, three-state inline chip rating for card relevance (good / not relevant / bad)
- Replace chat polling loop with SSE stream
- New test suite for Rules Guru (vitest + testing-library covering API, SSE, MessageFeedback)
- Fixes: deckId int→string cast in active-game.php, card catalog apostrophe mismatch, double .php extension on MCP brain endpoints, session feedback drawer scroll/backdrop, full-width chat when drawer open

## [5.4.1] - 2026-05-06

- Fix game save 500 (missing id in game_results insert) and win-condition not firing when first player is seat 0

