# Remotion Quick Start for Claude Code

> **ZERO LOCAL SETUP** - Copy, paste, and render videos in the cloud.

## Step 1: Set Environment Variables

Add to your `.env` file:

```env
# Required: Choose ONE provider

# OPTION A: Remotion Lambda (AWS) - Recommended
REMOTION_AWS_ACCESS_KEY_ID=AKIA...your-key
REMOTION_AWS_SECRET_ACCESS_KEY=your-secret-key
REMOTION_AWS_REGION=us-east-1
REMOTION_LAMBDA_FUNCTION_NAME=remotion-render
REMOTION_SERVE_URL=https://your-remotion-bundle.vercel.app

# OPTION B: Google Cloud Run
REMOTION_GCP_PROJECT_ID=your-project-123
REMOTION_GCP_REGION=us-central1
REMOTION_GCP_SERVICE_NAME=remotion-render
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
REMOTION_SERVE_URL=https://your-remotion-bundle.vercel.app

# OPTION C: Remotion Cloud (Easiest - managed by Remotion)
REMOTION_CLOUD_API_KEY=rmt_your_api_key
```

## Step 2: Install Client Package

```bash
# For Lambda
npm install @remotion/lambda

# For Cloud Run
npm install @remotion/cloudrun

# For Player (embedding in React apps)
npm install @remotion/player
```

---

## Ready-to-Use Code Templates

### Template 1: Render Social Video (TikTok/Reels/Shorts)

```typescript
// render-social-video.ts
// Copy this file to your project and run it

import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda/client';

const SOCIAL_VIDEO_PROPS = {
  headline: 'This Product Changed Everything',
  subheadline: "Here's what happened...",
  cta: 'Link in bio',
  brandColor: '#0ea5e9',
  accentColor: '#d946ef',
};

async function renderSocialVideo() {
  console.log('🎬 Starting cloud render...\n');

  const { renderId, bucketName } = await renderMediaOnLambda({
    region: process.env.REMOTION_AWS_REGION!,
    functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME!,
    serveUrl: process.env.REMOTION_SERVE_URL!,
    composition: 'SocialMediaVideo',
    inputProps: SOCIAL_VIDEO_PROPS,
    codec: 'h264',
    imageFormat: 'jpeg',
    maxRetries: 1,
    privacy: 'public',
  });

  console.log(`Render ID: ${renderId}`);
  console.log('Waiting for completion...\n');

  // Poll for progress
  while (true) {
    const progress = await getRenderProgress({
      renderId,
      bucketName,
      region: process.env.REMOTION_AWS_REGION!,
      functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME!,
    });

    const percent = Math.round(progress.overallProgress * 100);
    process.stdout.write(`\rProgress: ${percent}%`);

    if (progress.done) {
      console.log('\n\n✅ Video ready!');
      console.log(`📹 URL: ${progress.outputFile}`);
      return progress.outputFile;
    }

    if (progress.fatalErrorEncountered) {
      throw new Error(`Render failed: ${progress.errors?.[0]?.message}`);
    }

    await new Promise(r => setTimeout(r, 2000));
  }
}

// Run it
renderSocialVideo().catch(console.error);
```

---

### Template 2: Render Product Demo (YouTube/Website)

```typescript
// render-product-demo.ts

import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda/client';

const DEMO_PROPS = {
  productName: '10x Marketing',
  tagline: 'Create Videos 10x Faster',
  features: [
    { title: 'AI-Powered', description: 'Claude writes your scripts' },
    { title: 'Templates', description: '100+ ready-to-use designs' },
    { title: 'Cloud Render', description: 'No local setup required' },
  ],
  brandColor: '#0ea5e9',
};

async function renderProductDemo() {
  const { renderId, bucketName } = await renderMediaOnLambda({
    region: process.env.REMOTION_AWS_REGION!,
    functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME!,
    serveUrl: process.env.REMOTION_SERVE_URL!,
    composition: 'ProductDemo',
    inputProps: DEMO_PROPS,
    codec: 'h264',
  });

  // ... same progress polling as above
}
```

---

### Template 3: Render Ad Creative (Facebook/Instagram)

```typescript
// render-ad-creative.ts

import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda/client';

const AD_PROPS = {
  headline: 'Stop Wasting Time on Video Editing',
  benefit: 'Create professional videos in minutes',
  cta: 'Start Free Trial',
  urgency: 'Limited time offer',
  brandColor: '#0ea5e9',
  accentColor: '#d946ef',
};

async function renderAdCreative() {
  const { renderId, bucketName } = await renderMediaOnLambda({
    region: process.env.REMOTION_AWS_REGION!,
    functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME!,
    serveUrl: process.env.REMOTION_SERVE_URL!,
    composition: 'AdCreative',
    inputProps: AD_PROPS,
    codec: 'h264',
  });

  // ... same progress polling as above
}
```

---

### Template 4: Google Cloud Run Render

```typescript
// render-cloudrun.ts

import { renderMediaOnCloudrun } from '@remotion/cloudrun/client';

async function renderOnCloudRun(composition: string, props: any) {
  const { publicUrl, renderId } = await renderMediaOnCloudrun({
    serviceName: process.env.REMOTION_GCP_SERVICE_NAME!,
    region: process.env.REMOTION_GCP_REGION!,
    serveUrl: process.env.REMOTION_SERVE_URL!,
    composition,
    inputProps: props,
    codec: 'h264',
    privacy: 'public',
  });

  console.log('✅ Video ready:', publicUrl);
  return publicUrl;
}

// Usage
renderOnCloudRun('SocialMediaVideo', {
  headline: 'Amazing Product',
  cta: 'Learn More',
  brandColor: '#0ea5e9',
  accentColor: '#d946ef',
});
```

---

### Template 5: Embed Player in React App

```tsx
// VideoPlayer.tsx
// Embed rendered videos in your React app

import { Player } from '@remotion/player';
import { SocialMediaVideo } from './compositions/SocialMediaVideo';

export function VideoPlayer({ headline, cta }: { headline: string; cta: string }) {
  return (
    <Player
      component={SocialMediaVideo}
      durationInFrames={450}
      fps={30}
      compositionWidth={1080}
      compositionHeight={1920}
      inputProps={{
        headline,
        subheadline: "Here's what happened...",
        cta,
        brandColor: '#0ea5e9',
        accentColor: '#d946ef',
      }}
      controls
      autoPlay={false}
      loop
      style={{ width: '100%', maxWidth: 400 }}
    />
  );
}
```

---

### Template 6: API Route for Video Generation (Next.js)

```typescript
// app/api/render-video/route.ts

import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { composition, props } = await request.json();

  try {
    const { renderId, bucketName } = await renderMediaOnLambda({
      region: process.env.REMOTION_AWS_REGION!,
      functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME!,
      serveUrl: process.env.REMOTION_SERVE_URL!,
      composition,
      inputProps: props,
      codec: 'h264',
    });

    return NextResponse.json({ renderId, bucketName });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const renderId = searchParams.get('renderId');
  const bucketName = searchParams.get('bucketName');

  if (!renderId || !bucketName) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }

  const progress = await getRenderProgress({
    renderId,
    bucketName,
    region: process.env.REMOTION_AWS_REGION!,
    functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME!,
  });

  return NextResponse.json({
    progress: progress.overallProgress,
    done: progress.done,
    outputFile: progress.outputFile,
    errors: progress.errors,
  });
}
```

---

## Quick Reference: Composition IDs

| Composition ID | Format | Dimensions | Duration |
|----------------|--------|------------|----------|
| `SocialMediaVideo` | 9:16 vertical | 1080x1920 | 15s |
| `ProductDemo` | 16:9 landscape | 1920x1080 | 60s |
| `AdCreative` | 1:1 square | 1080x1080 | 30s |
| `ThinqMeshPromo` | 9:16 vertical | 1080x1920 | 15s |
| `ThinqMeshDemo` | 16:9 landscape | 1920x1080 | 30s |

---

## Quick Reference: Props

### SocialMediaVideo Props
```typescript
{
  headline: string;      // Main hook text
  subheadline: string;   // Supporting text
  cta: string;           // Call to action
  brandColor: string;    // Hex color (#0ea5e9)
  accentColor: string;   // Hex color (#d946ef)
}
```

### ProductDemo Props
```typescript
{
  productName: string;
  tagline: string;
  features: Array<{ title: string; description: string }>;
  brandColor: string;
}
```

### AdCreative Props
```typescript
{
  headline: string;
  benefit: string;
  cta: string;
  urgency: string;
  brandColor: string;
  accentColor: string;
}
```

---

## Troubleshooting

### "Missing AWS credentials"
Set `REMOTION_AWS_ACCESS_KEY_ID` and `REMOTION_AWS_SECRET_ACCESS_KEY` in `.env`

### "Function not found"
Run `npx remotion lambda functions deploy` once to deploy Lambda function

### "Serve URL not accessible"
Deploy your Remotion bundle to Vercel/Netlify and use that URL as `REMOTION_SERVE_URL`

### "Render timeout"
Increase Lambda timeout or reduce video duration/complexity
