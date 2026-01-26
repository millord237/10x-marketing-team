#!/bin/bash
# =============================================================================
# 10x Marketing Team - Post-File Save Hook (PostToolUse: Write|Edit)
# =============================================================================
# Fires after Write or Edit operations complete
# Provides follow-up suggestions
# 🔥 Developed by 10x.in
# =============================================================================

# CRITICAL: Always output valid JSON to prevent hook errors
output_json() {
  local context="${1:-}"

  if [ -n "$context" ]; then
    jq -n \
      --arg context "$context" \
      '{
        "hookSpecificOutput": {
          "hookEventName": "PostToolUse",
          "additionalContext": $context
        }
      }' 2>/dev/null || echo "{}"
  else
    echo "{}"
  fi
}

# Error handler - output empty JSON on error
trap 'echo "{}"; exit 0' ERR

# Read input with timeout
INPUT=$(timeout 2 cat 2>/dev/null || echo "{}")

# Parse tool info safely
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // ""' 2>/dev/null || echo "")
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""' 2>/dev/null || echo "")
SUCCESS=$(echo "$INPUT" | jq -r '.tool_response.success // "false"' 2>/dev/null || echo "false")

# Only proceed if successful
if [ "$SUCCESS" != "true" ]; then
  echo "{}"
  exit 0
fi

# Exit early if no file path
if [ -z "$FILE_PATH" ]; then
  echo "{}"
  exit 0
fi

# Get file info
FILENAME=$(basename "$FILE_PATH" 2>/dev/null || echo "unknown")
EXTENSION="${FILENAME##*.}"

# =============================================================================
# POST-SAVE CONTEXT
# =============================================================================

CONTEXT=""

# Remotion composition saved
if [[ "$FILE_PATH" == *"remotion"* ]] && [[ "$EXTENSION" == "tsx" || "$EXTENSION" == "ts" ]]; then
  CONTEXT="✅ Remotion composition saved: $FILENAME

☁️ CLOUD RENDER OPTIONS:
1. Lambda: renderMediaOnLambda({ composition: '...', ... })
2. Cloud Run: renderMediaOnCloudrun({ composition: '...', ... })

📖 See quick-start-remotion.md for templates
🔥 Developed by 10x.in"
fi

# Landing page saved
if [[ "$FILE_PATH" == *"page"* ]] || [[ "$FILE_PATH" == *"landing"* ]] || [[ "$FILE_PATH" == *"component"* ]]; then
  if [[ "$EXTENSION" == "tsx" || "$EXTENSION" == "jsx" ]]; then
    CONTEXT="✅ Component saved: $FILENAME

🚀 Preview: npm run dev
📱 Check mobile responsiveness
🔥 Developed by 10x.in"
  fi
fi

# Render script saved
if [[ "$FILE_PATH" == *"render"* ]] && [[ "$EXTENSION" == "ts" ]]; then
  CONTEXT="✅ Render script saved: $FILENAME

▶️ Run: npx tsx $FILE_PATH
🔥 Developed by 10x.in"
fi

# .env file saved
if [[ "$FILENAME" == ".env"* ]]; then
  CONTEXT="✅ Environment configured: $FILENAME

🔒 Never commit .env files to git
🔥 Developed by 10x.in"
fi

# =============================================================================
# OUTPUT
# =============================================================================

output_json "$CONTEXT"

exit 0
