#!/bin/bash
# =============================================================================
# 10x Marketing Team - Pre-File Change Hook (PreToolUse: Write|Edit)
# =============================================================================
# Fires before Write or Edit operations
# Validates changes and provides QA feedback
# 🔥 Developed by 10x.in
# =============================================================================

# CRITICAL: Always output valid JSON to prevent hook errors
output_json() {
  local decision="${1:-allow}"
  local reason="${2:-10x QA passed}"
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

# Error handler - always allow on error to prevent blocking
trap 'output_json "allow" "10x QA: Error in hook, allowing" "" "true"; exit 0' ERR

# Read input with timeout
INPUT=$(timeout 2 cat 2>/dev/null || echo "{}")

# Parse tool info safely
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // ""' 2>/dev/null || echo "")
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // ""' 2>/dev/null || echo "")
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // ""' 2>/dev/null || echo "")

# Exit early if no file path
if [ -z "$FILE_PATH" ]; then
  output_json "allow" "10x QA: No file path" "" "true"
  exit 0
fi

# Get filename
FILENAME=$(basename "$FILE_PATH" 2>/dev/null || echo "unknown")
EXTENSION="${FILENAME##*.}"

# =============================================================================
# VALIDATION RULES
# =============================================================================

ISSUES=""

# Check for Remotion compositions
if [[ "$FILE_PATH" == *"remotion"* ]] && [[ "$EXTENSION" == "tsx" || "$EXTENSION" == "ts" ]]; then
  # Check for cloud render imports
  if [[ "$CONTENT" == *"renderMediaOnLambda"* ]] && [[ "$CONTENT" != *"/client"* ]]; then
    ISSUES="${ISSUES}⚠️ Use '@remotion/lambda/client' for cloud rendering. "
  fi
  if [[ "$CONTENT" == *"renderMediaOnCloudrun"* ]] && [[ "$CONTENT" != *"/client"* ]]; then
    ISSUES="${ISSUES}⚠️ Use '@remotion/cloudrun/client' for cloud rendering. "
  fi
fi

# Check for landing pages
if [[ "$FILE_PATH" == *"page"* ]] || [[ "$FILE_PATH" == *"landing"* ]]; then
  if [[ "$CONTENT" == *"<img"* ]] && [[ "$CONTENT" != *"alt="* ]]; then
    ISSUES="${ISSUES}⚠️ Add alt text to images for accessibility. "
  fi
fi

# Check for placeholder text
if [[ "$CONTENT" == *"lorem ipsum"* ]] || [[ "$CONTENT" == *"Lorem Ipsum"* ]]; then
  ISSUES="${ISSUES}⚠️ Replace placeholder text with real copy. "
fi

# Check for generic CTAs
if [[ "$CONTENT" == *"click here"* ]] || [[ "$CONTENT" == *"Click Here"* ]]; then
  ISSUES="${ISSUES}⚠️ Use specific CTAs instead of 'Click Here'. "
fi

# Check for hardcoded secrets
if [[ "$CONTENT" == *"AKIA"* ]] || [[ "$CONTENT" == *"sk-"* ]] || [[ "$CONTENT" == *"secret"*"="* ]]; then
  ISSUES="${ISSUES}🔒 Potential hardcoded secret detected - use environment variables. "
fi

# =============================================================================
# OUTPUT
# =============================================================================

if [ -n "$ISSUES" ]; then
  output_json "allow" "10x QA: Notes for $FILENAME" "📋 10x Marketing QA for $FILENAME:\n$ISSUES\n🔥 Developed by 10x.in"
else
  output_json "allow" "10x QA passed" "" "true"
fi

exit 0
