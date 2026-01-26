# 10x Marketing Team - One-Line Setup Script (Windows PowerShell)
# Developed by 10x.in
#
# Usage: irm https://raw.githubusercontent.com/Anit-1to10x/10x-marketing-team/master/setup.ps1 | iex
# Or:    npx degit Anit-1to10x/10x-marketing-team my-project; cd my-project; npm run setup

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        🔥 10x MARKETING TEAM - AUTO SETUP 🔥                 ║" -ForegroundColor Cyan
Write-Host "║                   Developed by 10x.in                        ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

function Check-Command {
    param([string]$Command)
    $exists = Get-Command $Command -ErrorAction SilentlyContinue
    if ($exists) {
        Write-Host "✓ $Command found" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $Command is not installed" -ForegroundColor Red
        return $false
    }
}

Write-Host "Checking requirements..." -ForegroundColor Blue
Write-Host ""

# Check Node.js
if (-not (Check-Command "node")) {
    Write-Host "Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Check npm
if (-not (Check-Command "npm")) {
    Write-Host "npm should come with Node.js" -ForegroundColor Yellow
    exit 1
}

# Check git
if (-not (Check-Command "git")) {
    Write-Host "Please install git from https://git-scm.com" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Cloning repository..." -ForegroundColor Blue

# Clone if not already in repo
if (-not (Test-Path "package.json")) {
    git clone https://github.com/Anit-1to10x/10x-marketing-team.git
    Set-Location 10x-marketing-team
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Blue
npm install

Write-Host ""
Write-Host "Installing Remotion dependencies (FFmpeg & Chromium)..." -ForegroundColor Blue
try { npx remotion install ffmpeg } catch { }
try { npx remotion install ffprobe } catch { }

Write-Host ""
Write-Host "Creating output directories..." -ForegroundColor Blue
New-Item -ItemType Directory -Force -Path "output/videos" | Out-Null
New-Item -ItemType Directory -Force -Path "output/images" | Out-Null
New-Item -ItemType Directory -Force -Path "output/exports" | Out-Null
New-Item -ItemType Directory -Force -Path "output/compositions" | Out-Null
New-Item -ItemType Directory -Force -Path "output/assets" | Out-Null

Write-Host ""
Write-Host "Creating .env from example..." -ForegroundColor Blue
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created .env file" -ForegroundColor Green
} else {
    Write-Host "⚠ .env already exists, skipping" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "║   🔥 10x MARKETING TEAM IS READY! 🔥                        ║" -ForegroundColor Cyan
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "╠══════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "║   NEXT STEPS:                                                ║" -ForegroundColor Cyan
Write-Host "║   ───────────                                                ║" -ForegroundColor Cyan
Write-Host "║   1. npm run dev           (start the app)                   ║" -ForegroundColor Cyan
Write-Host "║   2. npm run remotion:studio (open video editor)             ║" -ForegroundColor Cyan
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "║   IN CLAUDE CODE:                                            ║" -ForegroundColor Cyan
Write-Host "║   ───────────────                                            ║" -ForegroundColor Cyan
Write-Host "║   /10x-setup    (configure preferences)                      ║" -ForegroundColor Cyan
Write-Host "║   /10x          (activate full agency)                       ║" -ForegroundColor Cyan
Write-Host "║                                                              ║" -ForegroundColor Cyan
Write-Host "║   🌐 10x.in                                                  ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
