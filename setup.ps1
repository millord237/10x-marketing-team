# 10x Marketing Team - One-Line Setup Script (Windows PowerShell)
# Developed by 10x.in
#
# Usage: irm https://raw.githubusercontent.com/Anit-1to10x/10x-marketing-team/master/setup.ps1 | iex
# Or:    npx degit Anit-1to10x/10x-marketing-team my-project; cd my-project; npm run setup

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "        10x MARKETING TEAM - AUTO SETUP" -ForegroundColor Cyan
Write-Host "        Developed by 10x.in" -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""

function Check-Command {
    param([string]$Command)
    $exists = Get-Command $Command -ErrorAction SilentlyContinue
    if ($exists) {
        Write-Host "[OK] $Command found" -ForegroundColor Green
        return $true
    } else {
        Write-Host "[ERROR] $Command is not installed" -ForegroundColor Red
        return $false
    }
}

function Check-NodeVersion {
    $version = node -v
    $major = [int]($version -replace 'v(\d+)\..*', '$1')
    if ($major -ge 18) {
        Write-Host "[OK] Node.js version $version" -ForegroundColor Green
        return $true
    } else {
        Write-Host "[ERROR] Node.js 18+ required. Current version: $version" -ForegroundColor Red
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

# Check Node.js version
if (-not (Check-NodeVersion)) {
    Write-Host "Please upgrade Node.js from https://nodejs.org" -ForegroundColor Yellow
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

# Try to install FFmpeg via Remotion
$ffmpegInstalled = $false
try {
    npx remotion install ffmpeg 2>$null
    $ffmpegInstalled = $true
    Write-Host "[OK] FFmpeg installed via Remotion" -ForegroundColor Green
} catch {
    Write-Host "[WARN] Could not install FFmpeg via Remotion" -ForegroundColor Yellow
}

# Try to install FFprobe via Remotion
$ffprobeInstalled = $false
try {
    npx remotion install ffprobe 2>$null
    $ffprobeInstalled = $true
    Write-Host "[OK] FFprobe installed via Remotion" -ForegroundColor Green
} catch {
    Write-Host "[WARN] Could not install FFprobe via Remotion" -ForegroundColor Yellow
}

# If FFmpeg failed, provide manual instructions
if (-not $ffmpegInstalled) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host "MANUAL FFMPEG INSTALLATION REQUIRED" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: Install via winget (Windows 11+)"
    Write-Host "  winget install ffmpeg"
    Write-Host ""
    Write-Host "Option 2: Install via Chocolatey"
    Write-Host "  choco install ffmpeg"
    Write-Host ""
    Write-Host "Option 3: Download from https://ffmpeg.org/download.html"
    Write-Host ""
    Write-Host "After installing FFmpeg, run: npm run remotion:studio"
    Write-Host ""
}

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
    Write-Host "[OK] Created .env file" -ForegroundColor Green
} else {
    Write-Host "[SKIP] .env already exists" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan
Write-Host "   10x MARKETING TEAM IS READY!" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "   NEXT STEPS:"
Write-Host "   -----------"
Write-Host "   1. npm run dev           (start the app)"
Write-Host "   2. npm run remotion:studio (open video editor)"
Write-Host ""
Write-Host "   IN CLAUDE CODE:"
Write-Host "   ---------------"
Write-Host "   /10x-setup    (configure preferences)"
Write-Host "   /10x          (activate full agency)"
Write-Host ""
Write-Host "   Developed by 10x.in"
Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""
