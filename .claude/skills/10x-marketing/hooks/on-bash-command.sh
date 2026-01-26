#!/bin/bash
# =============================================================================
# 10x Marketing Team - Pre-Bash Command Hook (PreToolUse: Bash)
# =============================================================================
# Fires before bash commands execute
# Provides context for marketing-specific commands
# 🔥 Developed by 10x.in
# =============================================================================

# CRITICAL: Always output valid JSON to prevent hook errors
output_json() {
  local decision="${1:-allow}"
  local reason="${2:-10x approved}"
  local context="${3:-}"
  local suppress="${4:-false}"

  if [ -n "$context" ]; then
    jq -n \
      --arg decision "$decision" \
      --arg reason "$reason" \
      --arg context "$context" \
      '{
        "hookSpecificOutput": {
          "hookEventName": "PreToolUse",
          "permissionDecision": $decision,
          "permissionDecisionReason": $reason,
          "additionalContext": $context
        }
      }' 2>/dev/null || echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}'
  else
    if [ "$suppress" = "true" ]; then
      echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"},"suppressOutput":true}'
    else
      echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}'
    fi
  fi
}

# Error handler - always allow on error
trap 'output_json "allow" "10x: Hook error, allowing" "" "true"; exit 0' ERR

# Read input with timeout
INPUT=$(timeout 2 cat 2>/dev/null || echo "{}")

# Parse command safely
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""' 2>/dev/null || echo "")

# Exit early if no command
if [ -z "$COMMAND" ]; then
  output_json "allow" "10x: No command" "" "true"
  exit 0
fi

# =============================================================================
# COMMAND CONTEXT
# =============================================================================

CONTEXT=""

# Remotion commands
if [[ "$COMMAND" == *"remotion"* ]]; then
  if [[ "$COMMAND" == *"lambda"* ]] && [[ "$COMMAND" == *"render"* ]]; then
    CONTEXT="☁️ CLOUD RENDER (Lambda): Rendering via AWS Lambda"
  elif [[ "$COMMAND" == *"lambda"* ]] && [[ "$COMMAND" == *"deploy"* ]]; then
    CONTEXT="🚀 DEPLOYING: Remotion Lambda function to AWS"
  elif [[ "$COMMAND" == *"preview"* ]]; then
    CONTEXT="🎬 PREVIEW: Opening Remotion preview"
  elif [[ "$COMMAND" == *"studio"* ]]; then
    CONTEXT="🎨 STUDIO: Opening Remotion Studio"
  elif [[ "$COMMAND" == *"render"* ]]; then
    CONTEXT="🎥 RENDER: Rendering video locally"
  fi
fi

# NPM install for 10x setup
if [[ "$COMMAND" == "npm install"* ]]; then
  if [[ "$COMMAND" == *"@remotion/lambda"* ]] || [[ "$COMMAND" == *"@remotion/player"* ]] || [[ "$COMMAND" == *"agentation"* ]]; then
    CONTEXT="⚙️ 10x SETUP: Installing marketing packages\n📦 @remotion/lambda - Cloud rendering\n📦 @remotion/player - Video embedding\n📦 agentation - Visual feedback\n🔥 Developed by 10x.in"
  fi
fi

# Development server
if [[ "$COMMAND" == "npm run dev"* ]] || [[ "$COMMAND" == "npm start"* ]]; then
  CONTEXT="🚀 PREVIEW: Starting development server at http://localhost:3000"
fi

# Build
if [[ "$COMMAND" == "npm run build"* ]]; then
  CONTEXT="📦 BUILD: Creating production build"
fi

# Git
if [[ "$COMMAND" == "git commit"* ]]; then
  CONTEXT="📝 COMMIT: Saving changes"
elif [[ "$COMMAND" == "git push"* ]]; then
  CONTEXT="🚀 PUSH: Deploying to remote"
fi

# =============================================================================
# OUTPUT
# =============================================================================

if [ -n "$CONTEXT" ]; then
  output_json "allow" "10x Marketing approved" "$CONTEXT"
else
  output_json "allow" "10x approved" "" "true"
fi

exit 0
