# Environment Configuration

> API keys and environment variables required for cloud rendering.
> **NO LOCAL REMOTION SETUP REQUIRED** - Everything runs in the cloud.

## Required Environment Variables

Create a `.env` file in your project root:

```env
# =============================================================================
# REMOTION CLOUD RENDERING (Choose one or both)
# =============================================================================

# Remotion Lambda (AWS)
REMOTION_AWS_ACCESS_KEY_ID=your_aws_access_key
REMOTION_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
REMOTION_AWS_REGION=us-east-1
REMOTION_LAMBDA_FUNCTION_NAME=remotion-render
REMOTION_S3_BUCKET_NAME=your-remotion-bucket

# Remotion Cloud Run (Google Cloud)
REMOTION_GCP_PROJECT_ID=your-gcp-project
REMOTION_GCP_SERVICE_NAME=remotion-render
REMOTION_GCP_REGION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# Serve URL (where your Remotion bundle is deployed)
REMOTION_SERVE_URL=https://your-remotion-site.vercel.app

# =============================================================================
# OPTIONAL: AI SERVICES
# =============================================================================

# Anthropic Claude (for AI-powered content generation)
ANTHROPIC_API_KEY=sk-ant-your-api-key

# OpenAI (alternative AI provider)
OPENAI_API_KEY=sk-your-openai-key

# =============================================================================
# OPTIONAL: DEPLOYMENT
# =============================================================================

# Vercel (for deploying landing pages)
VERCEL_TOKEN=your_vercel_token

# Netlify (alternative deployment)
NETLIFY_AUTH_TOKEN=your_netlify_token
```

---

## Setup Guide (Cloud-Only)

### Option 1: Remotion Lambda (AWS)

1. **Get AWS Credentials**
   ```bash
   # Create IAM user with these permissions:
   # - AWSLambdaFullAccess
   # - AmazonS3FullAccess
   # - CloudWatchLogsFullAccess
   ```

2. **Deploy Lambda Function** (one-time setup via Remotion CLI or Console)
   ```bash
   # Using Remotion's deployment tool (runs in CI/CD, not locally)
   npx remotion lambda functions deploy
   npx remotion lambda sites create
   ```

3. **Set Environment Variables**
   ```env
   REMOTION_AWS_ACCESS_KEY_ID=AKIA...
   REMOTION_AWS_SECRET_ACCESS_KEY=...
   REMOTION_AWS_REGION=us-east-1
   REMOTION_LAMBDA_FUNCTION_NAME=remotion-render-mem2048mb-disk2048mb-240sec
   ```

4. **Render Videos** (no local Remotion needed)
   ```typescript
   import { renderMediaOnLambda } from '@remotion/lambda/client';

   const { renderId } = await renderMediaOnLambda({
     region: process.env.REMOTION_AWS_REGION,
     functionName: process.env.REMOTION_LAMBDA_FUNCTION_NAME,
     serveUrl: process.env.REMOTION_SERVE_URL,
     composition: 'SocialMediaVideo',
     inputProps: { headline: 'My Video' },
   });
   ```

---

### Option 2: Google Cloud Run

1. **Get GCP Credentials**
   - Create a Service Account in GCP Console
   - Download JSON key file
   - Grant roles: Cloud Run Admin, Storage Admin

2. **Set Environment Variables**
   ```env
   REMOTION_GCP_PROJECT_ID=my-project-123
   REMOTION_GCP_REGION=us-central1
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
   ```

3. **Render Videos**
   ```typescript
   import { renderMediaOnCloudrun } from '@remotion/cloudrun/client';

   const { publicUrl } = await renderMediaOnCloudrun({
     serviceName: process.env.REMOTION_GCP_SERVICE_NAME,
     region: process.env.REMOTION_GCP_REGION,
     composition: 'ProductDemo',
     inputProps: { productName: 'My Product' },
   });
   ```

---

### Option 3: Use Remotion's Managed Cloud (Easiest)

Remotion offers managed cloud rendering at [remotion.dev](https://remotion.dev):

```env
# Remotion Cloud API Key (from remotion.dev dashboard)
REMOTION_CLOUD_API_KEY=rmt_...
```

```typescript
import { renderMedia } from '@remotion/cloud';

const { url } = await renderMedia({
  apiKey: process.env.REMOTION_CLOUD_API_KEY,
  composition: 'AdCreative',
  inputProps: { headline: 'Amazing Offer' },
});
```

---

## API Key Security

### Best Practices

1. **Never commit `.env` files** to git
   ```gitignore
   # .gitignore
   .env
   .env.local
   .env.*.local
   ```

2. **Use environment variables** in production
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - AWS: Lambda Environment Configuration
   - GCP: Cloud Run Environment Variables

3. **Rotate keys regularly** and use least-privilege IAM policies

---

## Verification

Test your configuration:

```typescript
// test-config.ts
async function verifyConfig() {
  const required = [
    'REMOTION_SERVE_URL',
  ];

  const lambdaRequired = [
    'REMOTION_AWS_ACCESS_KEY_ID',
    'REMOTION_AWS_SECRET_ACCESS_KEY',
    'REMOTION_AWS_REGION',
    'REMOTION_LAMBDA_FUNCTION_NAME',
  ];

  const cloudRunRequired = [
    'REMOTION_GCP_PROJECT_ID',
    'REMOTION_GCP_REGION',
    'GOOGLE_APPLICATION_CREDENTIALS',
  ];

  console.log('Checking base config...');
  for (const key of required) {
    console.log(`${key}: ${process.env[key] ? '✓' : '✗'}`);
  }

  console.log('\nLambda config:');
  for (const key of lambdaRequired) {
    console.log(`${key}: ${process.env[key] ? '✓' : '✗'}`);
  }

  console.log('\nCloud Run config:');
  for (const key of cloudRunRequired) {
    console.log(`${key}: ${process.env[key] ? '✓' : '✗'}`);
  }
}

verifyConfig();
```

---

## Cost Estimates

### Remotion Lambda (AWS)
- ~$0.01 per 15-second video
- ~$0.05 per 60-second video
- Free tier: 1M Lambda requests/month

### Google Cloud Run
- ~$0.02 per 15-second video
- ~$0.08 per 60-second video
- Free tier: 2M requests/month

### Remotion Managed Cloud
- See pricing at [remotion.dev/pricing](https://remotion.dev/pricing)
