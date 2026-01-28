---
description: Render videos via local, Remotion Lambda (AWS), or Cloud Run (GCP)
allowed-tools: ["Bash", "Read", "Write", "Edit"]
---

# Video Rendering

Render Remotion videos locally or via cloud providers.

## User Request

$ARGUMENTS

## Instructions

1. Check which provider credentials are available in `.env`
2. Verify the composition exists and has valid props
3. Generate the appropriate render command
4. Monitor render progress
5. Provide the output path or URL when complete

## Local Rendering (Default — No Setup Needed)

Remotion v4 bundles FFmpeg automatically. No separate install required.

```bash
# Render to MP4 (H.264 — best compatibility)
npx remotion render src/remotion/index.ts SocialMediaVideo out/social.mp4

# Render with custom props
npx remotion render src/remotion/index.ts SocialMediaVideo out/social.mp4 --props='{"headline":"My Video","brandColor":"#8b5cf6"}'

# Render as WebM (VP8)
npx remotion render src/remotion/index.ts SocialMediaVideo out/social.webm --codec=vp8

# Render as GIF
npx remotion render src/remotion/index.ts SocialMediaVideo out/social.gif --codec=gif

# Render a still/thumbnail
npx remotion still src/remotion/index.ts SocialMediaVideo out/thumb.png --frame=45

# Higher quality (CRF 1-51, lower = better, 18 = visually lossless)
npx remotion render src/remotion/index.ts SocialMediaVideo out/hq.mp4 --crf=18

# ProRes (for editing in Final Cut / Premiere)
npx remotion render src/remotion/index.ts SocialMediaVideo out/edit.mov --codec=prores --prores-profile=4444
```

## Cloud Rendering

### AWS Lambda

Required in `.env`:
```env
REMOTION_AWS_ACCESS_KEY_ID=your_key
REMOTION_AWS_SECRET_ACCESS_KEY=your_secret
REMOTION_AWS_REGION=us-east-1
REMOTION_LAMBDA_FUNCTION_NAME=remotion-render
REMOTION_SERVE_URL=https://your-deployed-site.com
```

Commands:
```bash
# Deploy Lambda function (one-time)
npx remotion lambda functions deploy

# Deploy site bundle (after code changes)
npx remotion lambda sites create src/remotion/index.ts

# Render on Lambda
npx remotion lambda render SocialMediaVideo --props='{"headline":"Cloud Video"}'

# Check progress
npx remotion lambda progress <render-id>
```

### Google Cloud Run

Required in `.env`:
```env
REMOTION_GCP_PROJECT_ID=your-project
REMOTION_GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
```

### Remotion Cloud (Managed — Easiest)

Required in `.env`:
```env
REMOTION_CLOUD_API_KEY=rmt_your_api_key
```

## Output Formats Quick Reference

| Format | Codec Flag | File Extension | Best For |
|--------|-----------|---------------|----------|
| MP4 (H.264) | `--codec=h264` (default) | `.mp4` | Social media, web |
| WebM (VP8) | `--codec=vp8` | `.webm` | Web embedding |
| GIF | `--codec=gif` | `.gif` | Short loops, previews |
| ProRes | `--codec=prores` | `.mov` | Professional editing |
| H.265 | `--codec=h265` | `.mp4` | Smaller file, newer devices |
| PNG Still | via `remotion still` | `.png` | Thumbnails |
| JPEG Still | via `remotion still --image-format=jpeg` | `.jpg` | Thumbnails |
