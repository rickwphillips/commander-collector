#!/bin/bash
# Rules Guru Dev Setup - Configure local MCP + API key

set -e

echo "🎮 Rules Guru Development Setup"
echo "================================"
echo ""
echo "This script will configure your local dev environment to use:"
echo "  • Claude CLI for AI responses"
echo "  • Your local commander-mcp server for MTG knowledge"
echo ""
echo "You'll need an Anthropic API key (free \$5 credits at https://console.anthropic.com/)"
echo ""

# Check if claude CLI is installed
if ! command -v claude &> /dev/null; then
    echo "❌ Error: claude CLI not found"
    echo "   Install it from your Cursor installation"
    exit 1
fi

echo "✅ Claude CLI found: $(claude --version 2>&1 | head -1)"
echo ""

# Check if commander-mcp exists
MCP_DIR="/Users/rickphillips/FreddyRhetorickContexts/commander-mcp"
if [ ! -d "$MCP_DIR" ]; then
    echo "❌ Error: commander-mcp not found at $MCP_DIR"
    exit 1
fi

echo "✅ Commander MCP server found"
echo ""

# Prompt for API key
read -p "Enter your Anthropic API key (starts with sk-ant-): " API_KEY

if [[ ! "$API_KEY" =~ ^sk-ant- ]]; then
    echo "❌ Error: API key should start with 'sk-ant-'"
    exit 1
fi

# Check if auth_secrets_dev.php exists
SECRETS_FILE="$HOME/auth_secrets_dev.php"

if [ -f "$SECRETS_FILE" ]; then
    echo ""
    echo "📝 Updating existing $SECRETS_FILE"
    
    # Check if ANTHROPIC_API_KEY already exists
    if grep -q "ANTHROPIC_API_KEY" "$SECRETS_FILE"; then
        # Replace existing key
        sed -i.bak "s/define('ANTHROPIC_API_KEY',.*/define('ANTHROPIC_API_KEY', '$API_KEY');/" "$SECRETS_FILE"
        echo "   Updated ANTHROPIC_API_KEY"
    else
        # Append new key
        echo "" >> "$SECRETS_FILE"
        echo "// Anthropic API Key for Rules Guru (local dev)" >> "$SECRETS_FILE"
        echo "define('ANTHROPIC_API_KEY', '$API_KEY');" >> "$SECRETS_FILE"
        echo "   Added ANTHROPIC_API_KEY"
    fi
else
    echo ""
    echo "📝 Creating $SECRETS_FILE"
    cat > "$SECRETS_FILE" << EOF
<?php
// Local development secrets for Commander Collector

// Database credentials (adjust as needed)
define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'commander_collector');
define('DB_USER', 'commander_dev');
define('DB_PASS', 'devpassword');

// Anthropic API Key for Rules Guru (local dev with MCP)
define('ANTHROPIC_API_KEY', '$API_KEY');
EOF
    echo "   Created new secrets file"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Start core app:        cd apps/core && npm run dev"
echo "  2. Start rules guru:      cd apps/rules-guru && npm run dev"
echo "  3. Open a 2HG game and click the guru chat icon"
echo ""
echo "Your chat will now use:"
echo "  • Local MTG knowledge from commander-mcp"
echo "  • Claude CLI with your API key for AI responses"
echo ""
