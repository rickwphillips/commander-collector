# Rules Guru Architecture

## Overview

The Rules Guru provides in-game MTG rules assistance with full game context awareness. It uses different backends for dev and production, but **both leverage your MTG knowledge infrastructure**.

## Local Development Stack

```
┌─────────────────────────────────────────────────────────────┐
│ Rules Guru Chat (Browser)                                   │
│   - GuruChat.tsx component                                   │
│   - Sends messages with game context                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP POST /php-api/rules/chat.php
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ PHP Backend (apps/core/app/php-api/rules/chat.php)         │
│   - Detects local dev mode                                   │
│   - Builds conversation history                              │
│   - Calls Claude CLI with MCP config                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Shell exec: claude --bare --mcp-config
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Claude CLI (--bare mode)                                     │
│   - Uses ANTHROPIC_API_KEY from env                          │
│   - Connects to local MCP server                             │
│   - Orchestrates tool calls automatically                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ MCP Protocol (stdio)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Commander MCP Server (commander-mcp)                         │
│   Tools:                                                     │
│   - lookup_comprehensive_rule (CR database)                  │
│   - get_card (Scryfall + local cache)                        │
│   - search_comprehensive_rules (FTS5 search)                 │
│   - get_verified_pattern (pattern library)                   │
│   - analyze_deck, suggest_cards_for_deck                     │
│   - record_feedback, get_learned_synergy                     │
└─────────────────────────────────────────────────────────────┘
```

### Key Benefits

1. **Local MTG Knowledge**: All rules, patterns, and synergy data come from your local database
2. **Fast Iteration**: Edit patterns or rules → immediately reflected in chat
3. **MCP Tool Development**: Test new MCP tools without deploying
4. **Same LLM**: Uses Claude via API (not a different model)

### Why API Key Required?

The `claude` CLI needs authentication for non-interactive use. When called from PHP (not your terminal), it can't use your Cursor OAuth session, so it falls back to `ANTHROPIC_API_KEY` in `--bare` mode.

**You're not paying for the MTG knowledge** - that's all local. The API cost is just for Claude's reasoning/language generation.

## Production Stack

```
┌─────────────────────────────────────────────────────────────┐
│ Rules Guru Chat (Browser)                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP POST /php-api/rules/chat.php
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ PHP Backend (apps/core/app/php-api/rules/chat.php)         │
│   - Direct Anthropic API calls                               │
│   - Manual tool orchestration loop                           │
│   - Executes PHP-native tools                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS to api.anthropic.com
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Anthropic API (claude-haiku-4-5-20251001)                   │
│   - Receives messages + tool definitions                     │
│   - Returns tool_use blocks                                  │
│   - PHP executes tools and sends results back                │
└─────────────────────────────────────────────────────────────┘

PHP-Native Tools:
  • lookup_card (Scryfall API)
  • get_pattern (rules_patterns table)
  • compare_decklists (MySQL JOIN)
  • lookup_decklist (MySQL)
  • propose_pattern (echo + DB write)
  • log_correction (rules_ai_corrections table)
```

### Why Different from Dev?

1. **No Local Dependencies**: Prod doesn't need MCP server running
2. **Optimized Tool Set**: PHP-native tools are faster than MCP (no IPC overhead)
3. **Proven Reliability**: Direct API has been stable in prod for months
4. **Database Access**: Direct MySQL queries vs. MCP abstractions

## Game Context Integration

Both dev and prod receive the same game context from `CenterZone.tsx`:

```typescript
{
  gameType: '2hg' | 'commander',
  players: [{
    playerName: string,
    deckName: string,
    commander: string,
    life: number,
    commanderDamage: Record<string, number>,
    teamNumber?: number,
    teamName?: string,
    deckId?: string
  }],
  currentTurn?: number,
  currentPlayer?: string,
  currentTeam?: string  // 2HG only
}
```

This context is injected into the system prompt, allowing the Rules Guru to:
- Personalize answers to the active player
- Reference specific cards from their deck
- Understand team dynamics in 2HG
- Track commander damage across the table

## Files Modified for 2HG Support

### Rules Guru Prompt
- `~/.claude/skills/mtg-rules-guru/SKILL.md` - Added 2HG rules, misconceptions

### Game Context Passing
- `apps/core/app/game-manager/components/CenterZone.tsx` - Added gameType, teamNumber, teamName, currentTeam
- `apps/core/app/game-manager/components/GameBoard.tsx` - Passed teamNames prop

### Backend
- `apps/core/app/php-api/rules/chat.php` - Added dev mode (claude CLI + MCP) vs. prod mode (direct API)
- `apps/rules-guru/mcp-config.json` - MCP server configuration
- `apps/rules-guru/DEV-SETUP.md` - Local dev instructions
- `apps/rules-guru/setup-dev.sh` - One-command setup script

## Testing the Setup

1. **Verify MCP Tools**:
```bash
cd /Users/rickphillips/FreddyRhetorickContexts/commander-mcp
uv run commander-mcp --http &
# Visit http://localhost:8000/mcp in MCP Inspector
```

2. **Test Claude CLI + MCP**:
```bash
export ANTHROPIC_API_KEY='sk-ant-your-key'
cd apps/rules-guru
claude --bare --mcp-config mcp-config.json --print "What is Two-Headed Giant?"
```

3. **Test Full Stack**:
   - Start both dev servers
   - Create a 2HG game
   - Open Rules Guru chat
   - Ask "How does poison work in 2HG?"
   - Verify it mentions shared poison counters

## Future Improvements

1. **Unify Dev/Prod Tools**: Move PHP-native tools to MCP server, use MCP in both environments
2. **Pattern Sync**: Auto-update MCP patterns DB when PHP patterns change
3. **Feedback Loop**: Wire `log_correction` to MCP's learning system
4. **Cache Optimization**: Shared Scryfall cache between PHP and MCP
