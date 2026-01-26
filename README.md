# 🔥 10x Marketing Team

**20 AI agents** for video creation, copywriting, landing pages, and ads with Remotion Studio and Agentation visual feedback.

---

## One-Line Setup (AFSSL)

### macOS / Linux
```bash
curl -fsSL https://raw.githubusercontent.com/Anit-1to10x/10x-marketing-team/master/setup.sh | bash
```

### Windows (PowerShell)
```powershell
irm https://raw.githubusercontent.com/Anit-1to10x/10x-marketing-team/master/setup.ps1 | iex
```

### Using npx (All Platforms)
```bash
npx degit Anit-1to10x/10x-marketing-team my-project && cd my-project && npm run setup
```

---

## Quick Start (If Already Cloned)

```bash
# Full setup (installs dependencies + FFmpeg)
npm run setup

# Start the app
npm run dev

# Open Remotion Studio
npm run remotion:studio

# In Claude Code
/10x-setup    # Run setup wizard
/10x          # Activate agency
```

---

## Claude Code Commands

| Command | Description |
|---------|-------------|
| `/10x-setup` | **Setup wizard** - OS-aware, asks preferences, configures everything |
| `/10x` | Activate full 20-agent marketing agency |
| `/10x-video` | Video production with Remotion Studio |
| `/10x-copy` | Copywriting team (ads, emails, social) |
| `/10x-design` | Design team (UI, landing pages, brand) |
| `/10x-render` | Cloud rendering (Lambda, Cloud Run, Remotion Cloud) |
| `/10x-remotion` | Remotion API reference |
| `/10x-feedback` | Agentation visual feedback guide |

---

## Agency Structure (20 Agents)

### Leadership (3)
- **CEO** - Strategy & client relations
- **CMO** - Campaign strategy & KPIs
- **Creative Director** - Visual direction

### Content Division (6)
- **Head of Copy** - Messaging strategy
- **Ad Copywriter** - Meta, Google, LinkedIn, TikTok
- **Email Specialist** - Sequences & automations
- **Social Media Writer** - Organic posts
- **SEO Content Writer** - Blog & articles
- **UX Writer** - Interface copy

### Design Division (4)
- **UI Designer** - Components & layouts
- **Landing Page Specialist** - Conversion design
- **Brand Designer** - Visual identity
- **Motion Designer** - Remotion animations

### Video Production (4)
- **Video Director** - Strategy & direction
- **Script Writer** - Hooks & narratives
- **Motion Graphics Artist** - Remotion compositions
- **Editor** - Post-production

### Technical Team (3)
- **Frontend Developer** - React, Next.js, Tailwind
- **Analytics Specialist** - Tracking & data
- **QA Specialist** - Testing & accessibility

---

## Remotion Compositions

| Composition | Aspect | Resolution | Duration |
|-------------|--------|------------|----------|
| SocialMediaVideo | 9:16 | 1080x1920 | 15s |
| ProductDemo | 16:9 | 1920x1080 | 60s |
| AdCreative | 1:1 | 1080x1080 | 30s |
| TransitionShowcase | 16:9 | 1920x1080 | 10s |
| ShapesDemo | 16:9 | 1920x1080 | 10s |

### Remotion Packages Included
- `@remotion/transitions` - slide, fade, wipe, flip
- `@remotion/shapes` - rect, circle, triangle, star, polygon
- `@remotion/paths` - SVG path animations
- `@remotion/gif` - GIF support
- `@remotion/noise` - Perlin noise
- `@remotion/motion-blur` - Trail effects
- `@remotion/three` - 3D support
- `@remotion/lottie` - Lottie animations
- `@remotion/lambda` - AWS Lambda rendering
- `@remotion/cloudrun` - GCP Cloud Run rendering

---

## Agentation Visual Feedback

Official Agentation package for desktop-wide visual feedback.

**Modes** (set in `.env`):
- `development` - Only in dev mode (default)
- `always` - Always available
- `manual` - Toggle with Cmd+Shift+A
- `off` - Disabled

**Usage**:
1. Run `npm run dev`
2. Look for icon in bottom-right corner
3. Click to annotate elements
4. Copy output to paste in Claude Code

---

## Environment Variables

Copy `.env.example` to `.env`:

```env
# Rendering: local, lambda, cloudrun, remotion-cloud
RENDERING_MODE=local

# Agentation: development, always, manual, off
NEXT_PUBLIC_AGENTATION_MODE=development

# AWS Lambda (optional)
REMOTION_AWS_ACCESS_KEY_ID=
REMOTION_AWS_SECRET_ACCESS_KEY=

# GCP Cloud Run (optional)
REMOTION_GCP_PROJECT_ID=

# Remotion Cloud (optional)
REMOTION_CLOUD_API_KEY=
```

---

## Project Structure

```
10x-marketing-team/
├── .claude/
│   ├── commands/           # Claude Code slash commands
│   │   ├── 10x.md
│   │   ├── 10x-setup.md
│   │   ├── 10x-video.md
│   │   ├── 10x-copy.md
│   │   ├── 10x-design.md
│   │   ├── 10x-render.md
│   │   ├── 10x-remotion.md
│   │   └── 10x-feedback.md
│   ├── skills/             # Skill definitions
│   ├── statusline.js       # Cross-platform statusline
│   └── settings.json       # Permissions & statusline config
├── output/                 # ALL generated content goes here
│   ├── videos/             # Rendered videos
│   ├── images/             # Generated images
│   ├── exports/            # Agentation exports
│   ├── compositions/       # Generated compositions
│   └── assets/             # Temporary assets
├── src/
│   ├── app/
│   ├── components/
│   └── remotion/
│       ├── Root.tsx
│       └── compositions/
├── setup.sh                # One-line setup (macOS/Linux)
├── setup.ps1               # One-line setup (Windows)
├── remotion.config.ts
├── package.json
├── .env.example
└── .gitignore
```

---

## Scripts

```bash
npm run setup              # Full setup with FFmpeg
npm run dev                # Start Next.js dev server
npm run build              # Build for production
npm run remotion:studio    # Open Remotion Studio
npm run remotion:render    # Render compositions
npm run remotion:install-deps  # Install FFmpeg/FFprobe
```

---

## Tech Stack

- **Framework**: Next.js 14, React 18, TypeScript
- **Video**: Remotion 4.0+ (all packages)
- **Styling**: Tailwind CSS, Framer Motion
- **Feedback**: Agentation (official)
- **Rendering**: Local (FFmpeg) + Cloud (Lambda/Cloud Run)

---

## License

MIT

---

Developed by **10x.in** 🚀

[10x.in](https://10x.in)
