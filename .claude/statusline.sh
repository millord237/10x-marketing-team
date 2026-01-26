#!/bin/bash
# 10x Marketing Team - Claude Code Statusline
# This script displays contextual information about the current session

# Read JSON input from stdin
input=$(cat)

# Extract values using jq (fallback to defaults if not available)
MODEL_DISPLAY=$(echo "$input" | jq -r '.model.display_name // "Claude"' 2>/dev/null || echo "Claude")
CURRENT_DIR=$(echo "$input" | jq -r '.workspace.current_dir // "."' 2>/dev/null || echo ".")
COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0' 2>/dev/null || echo "0")
PERCENT_USED=$(echo "$input" | jq -r '.context_window.used_percentage // 0' 2>/dev/null || echo "0")

# Format cost (show 4 decimal places)
COST_FORMATTED=$(printf "%.4f" "$COST" 2>/dev/null || echo "$COST")

# Get just the directory name
DIR_NAME="${CURRENT_DIR##*/}"

# Colors (ANSI)
ORANGE='\033[38;5;208m'
CYAN='\033[38;5;51m'
GREEN='\033[38;5;82m'
MAGENTA='\033[38;5;201m'
RESET='\033[0m'
BOLD='\033[1m'

# Build the status line
echo -e "${ORANGE}${BOLD}🔥 10x Marketing${RESET} | ${CYAN}${MODEL_DISPLAY}${RESET} | ${GREEN}📁 ${DIR_NAME}${RESET} | ${MAGENTA}💰 \$${COST_FORMATTED}${RESET} | 📊 ${PERCENT_USED}%"
