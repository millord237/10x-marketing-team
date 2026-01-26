#!/bin/bash
# =============================================================================
# 10x Marketing Team - Session Start Hook
# =============================================================================
# Fires when Claude Code session begins
# Auto-detects setup status and initializes statusline
# 🔥 Developed by 10x.in
# =============================================================================

# Error handling - output valid JSON on any error
trap 'echo "{\"hookSpecificOutput\":{\"hookEventName\":\"SessionStart\",\"error\":\"Hook failed\"}}"' ERR

# Read input from stdin (with timeout to prevent hanging)
INPUT=$(timeout 2 cat 2>/dev/null || echo "{}")

# Parse session info safely
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"' 2>/dev/null || echo "unknown")
CWD=$(echo "$INPUT" | jq -r '.cwd // "."' 2>/dev/null || echo ".")

# Get script directory for state file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STATE_DIR="$SCRIPT_DIR/../state"
STATE_FILE="$STATE_DIR/statusline.json"

# Ensure state directory exists
mkdir -p "$STATE_DIR" 2>/dev/null || true

# Check for package.json
HAS_PACKAGE_JSON="false"
[ -f "$CWD/package.json" ] && HAS_PACKAGE_JSON="true"

# Check for .env file
HAS_ENV="false"
[ -f "$CWD/.env" ] || [ -f "$CWD/.env.local" ] && HAS_ENV="true"

# Check for Remotion Lambda client
HAS_REMOTION_LAMBDA="false"
[ -f "$CWD/node_modules/@remotion/lambda/package.json" ] && HAS_REMOTION_LAMBDA="true"

# Check for Agentation
HAS_AGENTATION="false"
[ -f "$CWD/node_modules/agentation/package.json" ] && HAS_AGENTATION="true"

# Determine initial mode
INITIAL_MODE="Ready"
if [ "$HAS_ENV" = "false" ] || [ "$HAS_REMOTION_LAMBDA" = "false" ]; then
  INITIAL_MODE="Setup Required"
fi

# Update statusline state
cat > "$STATE_FILE" 2>/dev/null << EOF
{
  "activeMode": "$INITIAL_MODE",
  "currentTask": "Awaiting",
  "activeAgents": [],
  "sessionCost": 0,
  "lastUpdated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "setupStatus": {
    "hasPackageJson": $HAS_PACKAGE_JSON,
    "hasEnvFile": $HAS_ENV,
    "hasRemotionLambda": $HAS_REMOTION_LAMBDA,
    "hasAgentation": $HAS_AGENTATION
  },
  "branding": {
    "name": "10x Marketing",
    "icon": "🔥",
    "developer": "10x.in"
  }
}
EOF

# Build context message
read -r -d '' CONTEXT << 'CONTEXT_EOF'
# 🔥 10x Marketing Team - Session Initialized

## Agency Status: ONLINE (20 Agents Ready)
**Developed by 10x.in**

### Quick Commands:
- `/10x` - Activate full agency (all 20 agents)
- `/10x-copy` - Copywriting team
- `/10x-design` - Design team
- `/10x-video` - Video production with Remotion
- `/10x-feedback` - Agentation visual feedback
- `/10x-render` - Cloud render videos
- `/10x-setup` - Run setup wizard

### Natural Language Support:
Just describe what you need:
- "Create a TikTok video for my product"
- "Write ad copy for Facebook"
- "Build a landing page"

### Capabilities:
- Cloud Video Rendering (Lambda/Cloud Run)
- AI-Powered Copywriting
- Landing Page Generation
- Visual Feedback Collection

🔥 Developed by 10x.in | Awaiting your instructions...
CONTEXT_EOF

# Output JSON with setup status
jq -n \
  --arg context "$CONTEXT" \
  --arg has_package "$HAS_PACKAGE_JSON" \
  --arg has_env "$HAS_ENV" \
  --arg has_remotion "$HAS_REMOTION_LAMBDA" \
  --arg has_agentation "$HAS_AGENTATION" \
  --arg mode "$INITIAL_MODE" \
  '{
    "hookSpecificOutput": {
      "hookEventName": "SessionStart",
      "additionalContext": $context,
      "statusline": {
        "mode": $mode,
        "task": "Awaiting",
        "branding": "🔥 10x Marketing | Developed by 10x.in"
      },
      "setupStatus": {
        "hasPackageJson": ($has_package == "true"),
        "hasEnvFile": ($has_env == "true"),
        "hasRemotionLambda": ($has_remotion == "true"),
        "hasAgentation": ($has_agentation == "true"),
        "needsSetup": (($has_env == "false") or ($has_remotion == "false"))
      },
      "autoSetup": {
        "enabled": true,
        "installCommand": "npm install @remotion/lambda @remotion/player agentation"
      }
    }
  }' 2>/dev/null || echo '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"🔥 10x Marketing Team Ready | Developed by 10x.in"}}'

exit 0
