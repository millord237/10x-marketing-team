#!/bin/bash
# 10x Marketing Team - One-Line Setup Script
# Developed by 10x.in
#
# Usage: curl -fsSL https://raw.githubusercontent.com/Anit-1to10x/10x-marketing-team/master/setup.sh | bash
# Or:    npx degit Anit-1to10x/10x-marketing-team my-project && cd my-project && npm run setup

set -e

echo ""
echo "========================================================================"
echo "        10x MARKETING TEAM - AUTO SETUP"
echo "        Developed by 10x.in"
echo "========================================================================"
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
        echo -e "${RED}[ERROR] $1 is not installed${NC}"
        return 1
    else
        echo -e "${GREEN}[OK] $1 found${NC}"
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

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}[ERROR] Node.js 18+ required. Current version: $(node -v)${NC}"
    echo -e "${YELLOW}Please upgrade Node.js from https://nodejs.org${NC}"
    exit 1
fi
echo -e "${GREEN}[OK] Node.js version $(node -v)${NC}"

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

# Try to install FFmpeg via Remotion
FFMPEG_INSTALLED=false
if npx remotion install ffmpeg 2>/dev/null; then
    FFMPEG_INSTALLED=true
    echo -e "${GREEN}[OK] FFmpeg installed via Remotion${NC}"
else
    echo -e "${YELLOW}[WARN] Could not install FFmpeg via Remotion${NC}"
fi

# Try to install FFprobe via Remotion
FFPROBE_INSTALLED=false
if npx remotion install ffprobe 2>/dev/null; then
    FFPROBE_INSTALLED=true
    echo -e "${GREEN}[OK] FFprobe installed via Remotion${NC}"
else
    echo -e "${YELLOW}[WARN] Could not install FFprobe via Remotion${NC}"
fi

# If FFmpeg failed, provide manual instructions
if [ "$FFMPEG_INSTALLED" = false ]; then
    echo ""
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}MANUAL FFMPEG INSTALLATION REQUIRED${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo ""
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macOS: Run 'brew install ffmpeg'"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "Linux: Run 'sudo apt install ffmpeg' or 'sudo yum install ffmpeg'"
    fi
    echo ""
    echo "After installing FFmpeg, run: npm run remotion:studio"
    echo ""
fi

echo ""
echo -e "${BLUE}Creating output directories...${NC}"
mkdir -p output/videos output/images output/exports output/compositions output/assets

echo ""
echo -e "${BLUE}Creating .env from example...${NC}"
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${GREEN}[OK] Created .env file${NC}"
else
    echo -e "${YELLOW}[SKIP] .env already exists${NC}"
fi

echo ""
echo "========================================================================"
echo ""
echo "   10x MARKETING TEAM IS READY!"
echo ""
echo "========================================================================"
echo ""
echo "   NEXT STEPS:"
echo "   -----------"
echo "   1. npm run dev           (start the app)"
echo "   2. npm run remotion:studio (open video editor)"
echo ""
echo "   IN CLAUDE CODE:"
echo "   ---------------"
echo "   /10x-setup    (configure preferences)"
echo "   /10x          (activate full agency)"
echo ""
echo "   Developed by 10x.in"
echo ""
echo "========================================================================"
echo ""
