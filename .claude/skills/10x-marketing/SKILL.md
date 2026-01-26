---
name: 10x-marketing
description: AI Marketing Agency with 20 agents, Remotion Studio & Agentation - Developed by 10x.in
homepage: https://10x.in
user-invocable: true
metadata: {"clawdbot":{"emoji":"🔥","os":["darwin","linux","win32"],"requires":{"anyBins":["node","npm"]},"skillKey":"10x-marketing"}}
---

# 10x Marketing Team

**20 AI agents** for video, copy, design & technical work with Remotion Studio and Agentation.

Developed by **10x.in**

---

## OUTPUT DIRECTORY - CRITICAL

**ALL generated content MUST be saved to the `output/` directory:**

```
{baseDir}/../../output/
├── videos/          # Rendered videos (.mp4, .webm)
├── images/          # Generated images (.png, .jpg)
├── compositions/    # Remotion composition files
├── exports/         # Agentation exports
└── assets/          # Temporary assets
```

**Rules:**
1. NEVER create files outside `output/` directory
2. Create subdirectories as needed
3. Use timestamps in filenames: `video-2024-01-15-143022.mp4`
4. Clean up temporary files after rendering

**Path Resolution:**
```typescript
// Cross-platform output path
const OUTPUT_DIR = path.join(process.cwd(), 'output');
const VIDEOS_DIR = path.join(OUTPUT_DIR, 'videos');
const IMAGES_DIR = path.join(OUTPUT_DIR, 'images');
```

---

## CROSS-PLATFORM COMPATIBILITY

### Windows Users
- Use forward slashes in paths or `path.join()`
- Ensure Node.js is in PATH
- Run `npm run setup` to install FFmpeg
- Use PowerShell or Git Bash for commands

### macOS Users
- Native support for all features
- Homebrew available for optional dependencies
- Full Remotion Studio support

### Linux Users
- Ensure Node.js 18+ installed
- May need `sudo` for global installs
- Docker available for sandboxed rendering

---

## QUICK START

```bash
# Full setup (all platforms)
npm run setup

# Start app with Agentation
npm run dev

# Open Remotion Studio
npm run remotion:studio

# Render to output/videos/
npm run remotion:render -- --out-dir=output/videos
```

---

## COMMANDS

| Command | Description |
|---------|-------------|
| `/10x` | Activate full 20-agent marketing agency |
| `/10x-setup` | Setup wizard with preferences |
| `/10x-video` | Video production with Remotion |
| `/10x-copy` | Copywriting team |
| `/10x-design` | Design team |
| `/10x-render` | Cloud rendering |
| `/10x-remotion` | Remotion API reference |
| `/10x-feedback` | Agentation visual feedback |

---

## AGENCY STRUCTURE (20 Agents)

### Leadership (3)
- **CEO** - Strategy & client relations
- **CMO** - Campaign strategy & KPIs
- **Creative Director** - Visual direction

### Content (6)
- **Head of Copy** - Messaging strategy
- **Ad Copywriter** - Meta, Google, LinkedIn, TikTok
- **Email Specialist** - Sequences & automations
- **Social Media Writer** - Organic posts
- **SEO Content Writer** - Blog & articles
- **UX Writer** - Interface copy

### Design (4)
- **UI Designer** - Components & layouts
- **Landing Page Specialist** - Conversion design
- **Brand Designer** - Visual identity
- **Motion Designer** - Remotion animations

### Video (4)
- **Video Director** - Strategy & direction
- **Script Writer** - Hooks & narratives
- **Motion Graphics Artist** - Remotion compositions
- **Editor** - Post-production

### Technical (3)
- **Frontend Developer** - React, Next.js, Tailwind
- **Analytics Specialist** - Tracking & data
- **QA Specialist** - Testing & accessibility

---

## REMOTION API REFERENCE

### Core Imports
```tsx
import { Composition, Sequence, AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
```

### Packages Available
- `@remotion/transitions` - slide, fade, wipe, flip
- `@remotion/shapes` - rect, circle, triangle, star, polygon
- `@remotion/paths` - SVG path animations
- `@remotion/gif` - GIF support
- `@remotion/noise` - Perlin noise
- `@remotion/motion-blur` - Trail effects
- `@remotion/three` - 3D support
- `@remotion/lottie` - Lottie animations
- `@remotion/player` - Embeddable player

### Video Formats
| Format | Aspect | Resolution | Use Case |
|--------|--------|------------|----------|
| Social | 9:16 | 1080x1920 | TikTok, Reels, Shorts |
| Demo | 16:9 | 1920x1080 | YouTube, Website |
| Ad | 1:1 | 1080x1080 | Feed ads |

### Render Command
```bash
# Local render to output directory
npx remotion render src/remotion/index.ts [CompositionId] output/videos/[filename].mp4

# With props
npx remotion render src/remotion/index.ts MyVideo output/videos/my-video.mp4 --props='{"title":"Hello"}'
```

---

## AGENTATION INTEGRATION

### Modes (via .env)
```env
NEXT_PUBLIC_AGENTATION_MODE=development  # development | always | manual | off
```

### Usage
1. Run `npm run dev`
2. Look for icon in bottom-right
3. Click elements to annotate
4. Copy feedback to Claude Code

### Export Location
All Agentation exports go to: `output/exports/`

---

## ENVIRONMENT VARIABLES

Copy `.env.example` to `.env`:

```env
# Rendering Mode
RENDERING_MODE=local

# Local Rendering (default - no setup needed)
# FFmpeg/Chromium auto-installed by Remotion

# AWS Lambda (optional)
REMOTION_AWS_ACCESS_KEY_ID=
REMOTION_AWS_SECRET_ACCESS_KEY=
REMOTION_AWS_REGION=us-east-1

# GCP Cloud Run (optional)
REMOTION_GCP_PROJECT_ID=
REMOTION_GCP_REGION=us-central1

# Remotion Cloud (optional)
REMOTION_CLOUD_API_KEY=

# Agentation
NEXT_PUBLIC_AGENTATION_MODE=development

# Output Directory (default: ./output)
OUTPUT_DIR=./output
```

---

## NATURAL LANGUAGE DETECTION

Respond to these patterns:

| User Says | Activate |
|-----------|----------|
| "create a video", "make a video" | `/10x-video` |
| "tiktok", "reels", "shorts" | `/10x-video` |
| "write copy", "ad copy" | `/10x-copy` |
| "landing page", "create a page" | `/10x-design` |
| "feedback", "annotate" | `/10x-feedback` |
| "render", "export video" | `/10x-render` |
| "marketing", "campaign" | `/10x` |
| "setup", "configure" | `/10x-setup` |

---

## QUALITY STANDARDS

### Copy
- Clear value prop in first 5 words
- Benefits over features
- Grade 6-8 reading level

### Design
- Mobile-first responsive
- WCAG 2.1 AA compliance
- 4.5:1 contrast minimum

### Video
- Hook in first 3 seconds
- Captions always
- Platform safe zones

### Code
- TypeScript strict mode
- Tailwind utilities
- Accessible

---

## FILE STRUCTURE

```
{baseDir}/
├── SKILL.md              # This file
├── skill.json            # Metadata
├── hooks/                # Event hooks
│   ├── on-session-start.sh
│   ├── on-user-prompt.sh
│   └── ...
├── templates/            # Code templates
├── examples/             # Usage examples
└── scripts/              # Utility scripts
```

---

Developed by **10x.in** 🚀
