#!/bin/bash
# =============================================================================
# 10x Marketing Team - User Prompt Hook
# =============================================================================
# Fires when user submits a prompt
# Routes to appropriate agents based on intent
# Updates statusline with active mode
# 🔥 Developed by 10x.in
# =============================================================================

# Error handling - always output valid JSON
trap 'echo "{}"' ERR

# Read input from stdin with timeout
INPUT=$(timeout 2 cat 2>/dev/null || echo "{}")

# Parse prompt safely
PROMPT=$(echo "$INPUT" | jq -r '.prompt // ""' 2>/dev/null || echo "")
PROMPT_LOWER=$(echo "$PROMPT" | tr '[:upper:]' '[:lower:]' 2>/dev/null || echo "")
CWD=$(echo "$INPUT" | jq -r '.cwd // "."' 2>/dev/null || echo ".")

# Get script directory for state file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STATE_FILE="$SCRIPT_DIR/../state/statusline.json"

# Initialize variables
AGENTS=""
CONTEXT=""
MODE=""
TASK=""

# =============================================================================
# SLASH COMMAND DETECTION
# =============================================================================

case "$PROMPT" in
  "/10x")
    CONTEXT="🔥 FULL AGENCY ACTIVATED - All 20 agents ready"
    AGENTS="all"
    MODE="Full Agency"
    TASK="Marketing Campaign"
    ;;
  "/10x-setup"*)
    CONTEXT="⚙️ SETUP WIZARD - Installing packages and configuring API keys"
    AGENTS="technical"
    MODE="Setup"
    TASK="Configuration"
    ;;
  "/10x-copy"*)
    CONTEXT="✍️ CONTENT TEAM - Head of Copy, Ad Copywriter, Email Specialist ready"
    AGENTS="content"
    MODE="Copywriting"
    TASK="Writing Copy"
    ;;
  "/10x-design"*)
    CONTEXT="🎨 DESIGN TEAM - Creative Director, UI Designer, Landing Specialist ready"
    AGENTS="design"
    MODE="Design"
    TASK="Creating Design"
    ;;
  "/10x-video"*)
    CONTEXT="🎬 VIDEO TEAM - Video Director, Motion Artist, Editor ready. Remotion loaded"
    AGENTS="video"
    MODE="Video Production"
    TASK="Creating Video"
    ;;
  "/10x-feedback"*)
    CONTEXT="👁️ AGENTATION MODE - Visual feedback superpowers enabled"
    AGENTS="feedback"
    MODE="Feedback"
    TASK="Processing Feedback"
    ;;
  "/10x-render"*)
    CONTEXT="🎥 CLOUD RENDER - Lambda/Cloud Run ready"
    AGENTS="render"
    MODE="Cloud Render"
    TASK="Rendering Video"
    ;;
  "/10x-remotion"*)
    CONTEXT="📚 REMOTION API - Full documentation loaded"
    AGENTS="video"
    MODE="Remotion API"
    TASK="API Reference"
    ;;
  "/10x-transitions"*)
    CONTEXT="🔄 TRANSITIONS - slide, fade, wipe, flip available"
    AGENTS="video"
    MODE="Transitions"
    TASK="Creating Transitions"
    ;;
  "/10x-shapes"*)
    CONTEXT="🔶 SHAPES - Rect, Circle, Triangle, Star available"
    AGENTS="video"
    MODE="Shapes"
    TASK="Creating Shapes"
    ;;
  "/10x-player"*)
    CONTEXT="▶️ PLAYER - Embeddable component generator"
    AGENTS="video"
    MODE="Player"
    TASK="Creating Player"
    ;;
esac

# =============================================================================
# NATURAL LANGUAGE DETECTION (if no slash command matched)
# =============================================================================

if [ -z "$AGENTS" ]; then
  # Video keywords
  if [[ "$PROMPT_LOWER" == *"video"* ]] || [[ "$PROMPT_LOWER" == *"tiktok"* ]] || \
     [[ "$PROMPT_LOWER" == *"reel"* ]] || [[ "$PROMPT_LOWER" == *"shorts"* ]] || \
     [[ "$PROMPT_LOWER" == *"animation"* ]] || [[ "$PROMPT_LOWER" == *"remotion"* ]]; then
    AGENTS="video"
    MODE="Video Production"
    TASK="Creating Video"
    CONTEXT="🎬 VIDEO TEAM - Detected video request"
  fi

  # Copy keywords
  if [[ "$PROMPT_LOWER" == *"copy"* ]] || [[ "$PROMPT_LOWER" == *"headline"* ]] || \
     [[ "$PROMPT_LOWER" == *"ad "* ]] || [[ "$PROMPT_LOWER" == *"email"* ]] || \
     [[ "$PROMPT_LOWER" == *"caption"* ]] || [[ "$PROMPT_LOWER" == *"write"* ]]; then
    AGENTS="${AGENTS:+$AGENTS,}content"
    MODE="${MODE:-Copywriting}"
    TASK="${TASK:-Writing Copy}"
    CONTEXT="${CONTEXT:+$CONTEXT\n}✍️ CONTENT TEAM - Detected copy request"
  fi

  # Design keywords
  if [[ "$PROMPT_LOWER" == *"landing"* ]] || [[ "$PROMPT_LOWER" == *"page"* ]] || \
     [[ "$PROMPT_LOWER" == *"design"* ]] || [[ "$PROMPT_LOWER" == *"component"* ]] || \
     [[ "$PROMPT_LOWER" == *"website"* ]]; then
    AGENTS="${AGENTS:+$AGENTS,}design"
    MODE="${MODE:-Design}"
    TASK="${TASK:-Creating Design}"
    CONTEXT="${CONTEXT:+$CONTEXT\n}🎨 DESIGN TEAM - Detected design request"
  fi

  # Render keywords
  if [[ "$PROMPT_LOWER" == *"render"* ]] || [[ "$PROMPT_LOWER" == *"export"* ]] || \
     [[ "$PROMPT_LOWER" == *"lambda"* ]] || [[ "$PROMPT_LOWER" == *"cloud run"* ]]; then
    AGENTS="${AGENTS:+$AGENTS,}render"
    MODE="${MODE:-Cloud Render}"
    TASK="${TASK:-Rendering}"
    CONTEXT="${CONTEXT:+$CONTEXT\n}🎥 CLOUD RENDER - Detected render request"
  fi

  # Marketing keywords (full agency)
  if [[ "$PROMPT_LOWER" == *"marketing"* ]] || [[ "$PROMPT_LOWER" == *"campaign"* ]] || \
     [[ "$PROMPT_LOWER" == *"promote"* ]] || [[ "$PROMPT_LOWER" == *"launch"* ]]; then
    AGENTS="all"
    MODE="Full Agency"
    TASK="Marketing Campaign"
    CONTEXT="🔥 FULL AGENCY - Comprehensive marketing activated"
  fi

  # Setup keywords
  if [[ "$PROMPT_LOWER" == *"setup"* ]] || [[ "$PROMPT_LOWER" == *"install"* ]] || \
     [[ "$PROMPT_LOWER" == *"configure"* ]] || [[ "$PROMPT_LOWER" == *"api key"* ]]; then
    AGENTS="technical"
    MODE="Setup"
    TASK="Configuration"
    CONTEXT="⚙️ SETUP MODE - Configuration wizard"
  fi
fi

# =============================================================================
# UPDATE STATUSLINE STATE
# =============================================================================

if [ -n "$MODE" ] && [ -f "$STATE_FILE" ]; then
  # Update state file with new mode
  TMP_FILE=$(mktemp)
  jq --arg mode "$MODE" --arg task "$TASK" \
    '.activeMode = $mode | .currentTask = $task | .lastUpdated = now | todate' \
    "$STATE_FILE" > "$TMP_FILE" 2>/dev/null && mv "$TMP_FILE" "$STATE_FILE" 2>/dev/null || rm -f "$TMP_FILE"
fi

# =============================================================================
# OUTPUT
# =============================================================================

if [ -n "$CONTEXT" ]; then
  jq -n \
    --arg context "$CONTEXT" \
    --arg agents "$AGENTS" \
    --arg mode "$MODE" \
    --arg task "$TASK" \
    '{
      "hookSpecificOutput": {
        "hookEventName": "UserPromptSubmit",
        "additionalContext": ("🔥 10x MARKETING TEAM\n================\n" + $context + "\n\nActive: " + $agents + " | 🔥 Developed by 10x.in"),
        "statusline": {
          "mode": $mode,
          "task": $task,
          "agents": $agents
        }
      }
    }' 2>/dev/null || echo "{}"
else
  # No routing needed - output empty
  echo "{}"
fi

exit 0
