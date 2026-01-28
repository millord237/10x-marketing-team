---
description: Complete setup wizard for 10x Marketing Team - OS-aware, zero-error installation
allowed-tools: ["Bash", "Read", "Write", "Edit", "AskUserQuestion", "Glob"]
---

# 10x Marketing Team — Complete Setup Wizard

You are the setup assistant. Your job is to detect the OS, verify all prerequisites, install everything automatically, and ensure ZERO errors. Every command must be OS-specific and version-pinned.

## CRITICAL RULES

- NEVER guess a command. Use the exact commands documented below.
- ALWAYS check if something is already installed before installing it.
- ALWAYS use `--legacy-peer-deps` with npm install to avoid peer dependency conflicts.
- Remotion v4 bundles FFmpeg automatically. NEVER run `npx remotion install ffmpeg` — that command was removed in v4.
- Pin versions exactly. Never use `latest` — always use the version from package.json.

## STEP 1: Detect OS and Architecture

Run this to detect the user's environment:

```bash
node -e "console.log(JSON.stringify({platform: process.platform, arch: process.arch, nodeVersion: process.version, npmVersion: require('child_process').execSync('npm --version', {encoding:'utf-8'}).trim()}))"
```

This gives you: `platform` (win32/darwin/linux), `arch` (x64/arm64), `nodeVersion`, `npmVersion`.

## STEP 2: Verify Node.js (REQUIRED: v18.17.0+)

### Check Node version:
```bash
node -v
```

### If Node.js is NOT installed or is below v18.17.0:

**Windows:**
```powershell
# Option A — winget (built into Windows 10/11, recommended)
winget install -e --id OpenJS.NodeJS.LTS

# Option B — Direct download (if winget unavailable)
# Download from: https://nodejs.org/dist/v18.20.4/node-v18.20.4-x64.msi
# Then run the installer
```

**macOS:**
```bash
# Option A — Homebrew (recommended)
brew install node@18
brew link --overwrite --force node@18
echo 'export PATH="/opt/homebrew/opt/node@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Option B — nvm (if Homebrew not installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.zshrc
nvm install 18.20.4
nvm use 18.20.4
nvm alias default 18.20.4
```

**Linux (Debian/Ubuntu):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf module install nodejs:18
```

After install, verify:
```bash
node -v   # Must show v18.17.0 or higher
npm -v    # Must show 9.0.0 or higher
```

## STEP 3: Verify npm version (REQUIRED: 9.0.0+)

```bash
npm -v
```

If below 9.0.0:
```bash
npm install -g npm@10.9.2
```

## STEP 4: Ask Setup Questions

Use `AskUserQuestion` to ask ALL these questions:

### Question 1: Business Information
Ask: "What's your business/project name?"
Store as: `BUSINESS_NAME`

### Question 2: Business Type
Options:
1. **SaaS/Software (Recommended if tech)** - Tech product focus
2. **E-commerce/Retail** - Product sales focus
3. **Agency/Services** - Service business focus
4. **Content Creator** - Personal brand focus

### Question 3: Primary Use Case
Options (multi-select):
1. **Social Media Videos (Recommended)** - TikTok, Reels, Shorts
2. **Product Demos** - YouTube, website videos
3. **Ad Creatives** - Facebook, Instagram, Google ads
4. **Landing Pages** - Conversion-focused pages
5. **All of the above** - Full marketing suite

### Question 4: Rendering Preference
Options:
1. **Local Rendering (Recommended)** - No cloud costs, FFmpeg bundled in Remotion v4
2. **Cloud Rendering (AWS Lambda)** - Requires AWS account
3. **Cloud Rendering (GCP Cloud Run)** - Requires GCP account
4. **Remotion Cloud (Easiest)** - Managed service, just need API key
5. **Both Local + Cloud** - Local for dev, cloud for production

### Question 5: Agentation Mode
Options:
1. **Development Only (Recommended)** - Shows only in dev mode
2. **Always On** - Available in all environments
3. **Manual Toggle** - Keyboard shortcut to toggle
4. **Off** - Disable visual feedback

### Question 6: Brand Colors
Options:
1. **Sky Blue (#0ea5e9)** - Modern, tech
2. **Purple (#8b5cf6)** - Creative, premium
3. **Green (#10b981)** - Growth, eco
4. **Orange (#f59e0b)** - Energy, action
5. **Pink (#ec4899)** - Bold, playful
6. **Custom** - Enter hex code

### Question 7: Initial Content
Options:
1. **Yes, full starter kit (Recommended)** - Landing page, sample videos, ad templates
2. **Yes, minimal** - Just the basics
3. **No, I'll start from scratch** - Empty project

## STEP 5: Run Setup Check and Install

```bash
npm run setup
```

This runs `scripts/setup-check.js` which:
- Verifies Node.js version
- Verifies npm version
- Creates `.env` from `.env.example` if missing
- Creates `public/` directory if missing
- Creates all `output/` subdirectories
- Then runs `npm install --legacy-peer-deps`

If `npm run setup` fails because npm itself is missing (chicken-and-egg), run manually:
```bash
node scripts/setup-check.js
npm install --legacy-peer-deps
```

## STEP 6: Create .env File

Create `.env` with the user's answers:

```env
# 10x Marketing Team Configuration
# Generated by /10x-setup on [DATE]
# Business: [BUSINESS_NAME]

RENDERING_MODE=[user_choice: local/lambda/cloudrun/remotion-cloud]

# Remotion Studio
NEXT_PUBLIC_REMOTION_STUDIO_URL=http://localhost:3000

# Next.js Dashboard
NEXT_PUBLIC_APP_URL=http://localhost:3001

# AWS Lambda (only if selected)
REMOTION_AWS_ACCESS_KEY_ID=
REMOTION_AWS_SECRET_ACCESS_KEY=
REMOTION_AWS_REGION=us-east-1
REMOTION_LAMBDA_FUNCTION_NAME=remotion-render

# GCP Cloud Run (only if selected)
REMOTION_GCP_PROJECT_ID=
REMOTION_GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=

# Remotion Cloud (only if selected)
REMOTION_CLOUD_API_KEY=

# Serve URL (for cloud rendering)
REMOTION_SERVE_URL=http://localhost:3000

# Agentation
NEXT_PUBLIC_AGENTATION_MODE=[user_choice]

# Branding
NEXT_PUBLIC_BUSINESS_NAME=[BUSINESS_NAME]
NEXT_PUBLIC_PRIMARY_COLOR=[user_color_choice]
NEXT_PUBLIC_BUSINESS_TYPE=[user_business_type]

# AI Integration (optional)
ANTHROPIC_API_KEY=
```

## STEP 7: Verify Installation

Run these checks sequentially:

```bash
# 1. Verify Remotion is installed and working
npx remotion --version
```

Expected output: `4.0.242`

```bash
# 2. Verify TypeScript compiles
npx tsc --noEmit
```

Expected: No errors

```bash
# 3. Verify Next.js builds
npm run build
```

If build fails, check for TypeScript errors and fix.

## STEP 8: Launch

```bash
# Start both Remotion Studio (port 3000) + Next.js Dashboard (port 3001)
npm run dev:all
```

Or start separately:
```bash
npm run remotion:studio   # Remotion Studio on port 3000
npm run dev               # Next.js Dashboard on port 3001
```

## STEP 9: Show Activation Message

After everything is complete, display:

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   10x MARKETING TEAM IS ACTIVATED!                           ║
║                Developed by 10x.in                           ║
║                                                              ║
║   Business: [BUSINESS_NAME]                                  ║
║   Type: [BUSINESS_TYPE]                                      ║
║   Rendering: [Local/Cloud]                                   ║
║   Agentation: [Mode]                                         ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   VERSIONS INSTALLED:                                        ║
║   Node.js:    [detected version]                             ║
║   npm:        [detected version]                             ║
║   Remotion:   4.0.242 (FFmpeg bundled)                       ║
║   Next.js:    14.2.21                                        ║
║   React:      18.3.1                                         ║
║   TypeScript: 5.7.3                                          ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   SERVICES:                                                  ║
║   Remotion Studio:  http://localhost:3000                     ║
║   Dashboard:        http://localhost:3001                     ║
║                                                              ║
║   QUICK COMMANDS:                                            ║
║   /10x          → Full agency (20 agents)                    ║
║   /10x-video    → Create videos                              ║
║   /10x-copy     → Write ad copy                              ║
║   /10x-design   → Design landing pages                       ║
║   /10x-render   → Render to cloud                            ║
║   /10x-feedback → Visual feedback mode                       ║
║                                                              ║
║   RECOMMENDED NEXT STEPS:                                    ║
║   1. Run: npm run dev:all                                    ║
║   2. Open: http://localhost:3000 (Remotion Studio)           ║
║   3. Try: /10x-video "Create a TikTok for [product]"         ║
║                                                              ║
║   10x.in                                                     ║
╚══════════════════════════════════════════════════════════════╝
```

## ERROR HANDLING

If any step fails:

1. Show the EXACT error message
2. Show the OS-specific fix command (not a generic suggestion)
3. Offer to retry
4. Never skip a critical step — the user must fix it before continuing

### Common Errors and Fixes:

**"ERESOLVE unable to resolve dependency tree"**
Fix: `npm install --legacy-peer-deps`

**"npx remotion install ffmpeg: command not found"**
Fix: This command was removed in Remotion v4. FFmpeg is bundled. Delete the failing script and use `npm run setup` instead.

**"EACCES permission denied" (macOS/Linux)**
Fix: Never use `sudo npm install`. Instead fix npm permissions:
```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**"execution of scripts is disabled" (Windows PowerShell)**
Fix:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemotionSigned -Scope CurrentUser
```

**Port already in use:**
Fix: `npm run port:free 3000` or `npm run port:free 3001`

## PINNED VERSION TABLE

| Package | Version | Notes |
|---------|---------|-------|
| Node.js | >=18.17.0 | LTS required for Next.js 14 |
| npm | >=9.0.0 | Ships with Node 18 |
| remotion | 4.0.242 | All @remotion/* packages must match |
| @remotion/zod-types | 4.0.242 | For Studio color pickers, textareas |
| next | 14.2.21 | Stable, tested |
| react | 18.3.1 | Required by Next.js 14 |
| typescript | 5.7.3 | Strict mode enabled |
| zod | 3.24.1 | For Remotion Studio prop schemas |
| three | 0.160.0 | For @remotion/three 3D support |
| tailwindcss | 3.4.17 | Dashboard styling |
