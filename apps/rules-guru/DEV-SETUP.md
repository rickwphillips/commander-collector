# Rules Guru - Local Development Setup

## Quick Start

The Rules Guru uses **Claude CLI + your local MCP server** for development, giving you MTG rules knowledge from your local commander-mcp server.

### Setup (One Time)

1. Get an Anthropic API key (free $5 credits at https://console.anthropic.com/)
2. Add it to `~/auth_secrets_dev.php`:

```php
<?php
// ... existing dev config ...

// Anthropic API Key for local Claude CLI
define('ANTHROPIC_API_KEY', 'sk-ant-api03-YOUR-KEY-HERE');
```

3. Start your dev servers:

```bash
# Terminal 1: Core app (includes PHP API)
cd apps/core
npm run dev

# Terminal 2: Rules Guru frontend
cd apps/rules-guru
npm run dev
```

## How It Works

### Dev Mode: Claude CLI + Local MCP

In local dev, `chat.php` uses the **Claude CLI** (not direct API calls) with your **local commander-mcp server**:

- ✅ **Local MTG Knowledge**: All rules, cards, patterns, and learned synergies come from your commander-mcp server
- ✅ **MCP Tools**: Comprehensive Rules lookup, card data, deck analysis, pattern matching
- ✅ **Free Credits**: $5 free tier gives you thousands of rules questions
- ✅ **Fast Iteration**: Changes to your MCP server tools reflect immediately

The difference from production isn't about *where the AI runs*, it's about **where the MTG knowledge comes from**:
- **Dev**: MTG data from local MCP (your database, your rules, your patterns)
- **Prod**: MTG data from PHP-native tools (prod database, pattern matching in PHP)

### Production: Direct API

Production uses the **Anthropic API** with PHP-native tools:
- Reliable uptime (no local MCP dependency)
- Optimized tool orchestration in PHP
- Production database and rules patterns

## Why This Setup?

Your local MCP server is the **source of truth** for MTG rules knowledge in development:
- Comprehensive Rules database
- Pattern library you're actively editing
- Learned synergies from feedback
- Card cache and deck analysis

Using Claude CLI + MCP config means **all that local knowledge** powers the Rules Guru chat, while the API key just handles auth.

## Troubleshooting

### "Anthropic API key not configured"

Add to `~/auth_secrets_dev.php`:
```php
define('ANTHROPIC_API_KEY', 'sk-ant-api03-YOUR-KEY-HERE');
```

Get your key at https://console.anthropic.com/settings/keys (free $5 credits included!)

### "Claude CLI error" or "exit code 1"

Test the setup:
```bash
# Verify claude CLI is installed
claude --version

# Test with MCP config (set key first!)
export ANTHROPIC_API_KEY='sk-ant-your-key'
claude --bare --mcp-config apps/rules-guru/mcp-config.json --print "What is layer 7c?"
```

If you see "Not logged in", that's expected - the `--bare` mode uses `ANTHROPIC_API_KEY` instead.

### MCP Server Not Found

The commander-mcp server should be at `/Users/rickphillips/FreddyRhetorickContexts/commander-mcp`. If you've moved it, update the path in `mcp-config.json`.

### Out of Free Credits?

- Check usage at https://console.anthropic.com/settings/usage
- Free tier: $5 (thousands of queries)
- Upgrade to paid tier if needed (pay-as-you-go, no monthly fee)
