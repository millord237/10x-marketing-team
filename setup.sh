#!/bin/bash
# 10x Marketing Team - One-Line Setup Script
# Developed by 10x.in
#
# Usage: curl -fsSL https://raw.githubusercontent.com/Anit-1to10x/10x-marketing-team/master/setup.sh | bash
# Or:    npx degit Anit-1to10x/10x-marketing-team my-project && cd my-project && npm run setup

set -e

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║        🔥 10x MARKETING TEAM - AUTO SETUP 🔥                 ║"
echo "║                   Developed by 10x.in                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check for required tools
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        return 1
    else
        echo -e "${GREEN}✓ $1 found${NC}"
        return 0
    fi
}

echo -e "${BLUE}Checking requirements...${NC}"
echo ""

# Check Node.js
if ! check_command node; then
    echo -e "${YELLOW}Please install Node.js 18+ from https://nodejs.org${NC}"
    exit 1
fi

# Check npm
if ! check_command npm; then
    echo -e "${YELLOW}npm should come with Node.js${NC}"
    exit 1
fi

# Check git
if ! check_command git; then
    echo -e "${YELLOW}Please install git from https://git-scm.com${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Cloning repository...${NC}"

# Clone if not already in repo
if [ ! -f "package.json" ]; then
    git clone https://github.com/Anit-1to10x/10x-marketing-team.git
    cd 10x-marketing-team
fi

echo ""
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

echo ""
echo -e "${BLUE}Installing Remotion dependencies (FFmpeg & Chromium)...${NC}"
npx remotion install ffmpeg || true
npx remotion install ffprobe || true

echo ""
echo -e "${BLUE}Creating output directories...${NC}"
mkdir -p output/videos output/images output/exports output/compositions output/assets

echo ""
echo -e "${BLUE}Creating .env from example...${NC}"
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
else
    echo -e "${YELLOW}⚠ .env already exists, skipping${NC}"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║   🔥 10x MARKETING TEAM IS READY! 🔥                        ║"
echo "║                                                              ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║   NEXT STEPS:                                                ║"
echo "║   ───────────                                                ║"
echo "║   1. npm run dev           (start the app)                   ║"
echo "║   2. npm run remotion:studio (open video editor)             ║"
echo "║                                                              ║"
echo "║   IN CLAUDE CODE:                                            ║"
echo "║   ───────────────                                            ║"
echo "║   /10x-setup    (configure preferences)                      ║"
echo "║   /10x          (activate full agency)                       ║"
echo "║                                                              ║"
echo "║   🌐 10x.in                                                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
