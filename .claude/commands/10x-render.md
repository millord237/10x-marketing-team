---
description: Render videos via Remotion Lambda (AWS) or Cloud Run (GCP)
allowed-tools: ["Bash", "Read", "Write", "Edit"]
---

# Cloud Video Rendering

Render Remotion videos without local FFmpeg or Chromium.

## Available Providers

### 1. Remotion Lambda (AWS)

Required environment variables:
```env
REMOTION_AWS_ACCESS_KEY_ID=your_key
REMOTION_AWS_SECRET_ACCESS_KEY=your_secret
REMOTION_AWS_REGION=us-east-1
REMOTION_LAMBDA_FUNCTION_NAME=remotion-render
REMOTION_SERVE_URL=https://your-site.vercel.app
```

Render command:
```bash
npx remotion lambda render SocialMediaVideo --props='{"headline":"Your Text"}'
```

### 2. Google Cloud Run

Required environment variables:
```env
REMOTION_GCP_PROJECT_ID=your-project
REMOTION_GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
REMOTION_SERVE_URL=https://your-site.vercel.app
```

### 3. Remotion Cloud (Managed)

Easiest option - no infrastructure setup:
```env
REMOTION_CLOUD_API_KEY=rmt_your_api_key
```

## User Request

$ARGUMENTS

## Instructions

1. Check which provider credentials are available in `.env`
2. Verify the composition exists in Remotion Studio
3. Generate the appropriate render command
4. Monitor render progress
5. Provide the output URL when complete

## Local Rendering (If Needed)

```bash
npm run remotion:render -- SocialMediaVideo out/video.mp4
```

Requires FFmpeg and Chromium installed locally.
