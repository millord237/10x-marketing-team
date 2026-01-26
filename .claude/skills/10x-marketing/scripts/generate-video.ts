#!/usr/bin/env npx ts-node
/**
 * 10x Marketing Team - Cloud Video Generation Script
 *
 * Generates and renders Remotion videos via CLOUD APIs only.
 * NO LOCAL REMOTION SETUP REQUIRED.
 *
 * Usage:
 *   npx ts-node scripts/generate-video.ts --type social --headline "Your Hook" --provider lambda
 *   npx ts-node scripts/generate-video.ts --type demo --product "ProductName" --provider cloudrun
 *   npx ts-node scripts/generate-video.ts --type ad --problem "Pain Point" --provider cloud
 *
 * Required Environment Variables (see env-config.md):
 *   - REMOTION_SERVE_URL (required)
 *   - For Lambda: REMOTION_AWS_ACCESS_KEY_ID, REMOTION_AWS_SECRET_ACCESS_KEY, etc.
 *   - For Cloud Run: REMOTION_GCP_PROJECT_ID, GOOGLE_APPLICATION_CREDENTIALS, etc.
 *   - For Remotion Cloud: REMOTION_CLOUD_API_KEY
 */

// =============================================================================
// TYPES
// =============================================================================

interface VideoConfig {
  type: 'social' | 'demo' | 'ad';
  compositionId: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  props: Record<string, unknown>;
}

interface CLIArgs {
  type: 'social' | 'demo' | 'ad';
  provider: 'lambda' | 'cloudrun' | 'cloud';
  headline?: string;
  subheadline?: string;
  product?: string;
  tagline?: string;
  problem?: string;
  solution?: string;
  cta?: string;
  brandColor?: string;
  accentColor?: string;
  duration?: number;
  region?: string;
}

interface CloudRenderResult {
  success: boolean;
  renderId?: string;
  videoUrl?: string;
  error?: string;
  code: string;
}

// =============================================================================
// ENVIRONMENT VALIDATION
// =============================================================================

function validateEnvironment(provider: string): void {
  const required = ['REMOTION_SERVE_URL'];

  const providerEnvs: Record<string, string[]> = {
    lambda: [
      'REMOTION_AWS_ACCESS_KEY_ID',
      'REMOTION_AWS_SECRET_ACCESS_KEY',
      'REMOTION_AWS_REGION',
      'REMOTION_LAMBDA_FUNCTION_NAME',
    ],
    cloudrun: [
      'REMOTION_GCP_PROJECT_ID',
      'REMOTION_GCP_REGION',
    ],
    cloud: [
      'REMOTION_CLOUD_API_KEY',
    ],
  };

  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) missing.push(key);
  }

  for (const key of providerEnvs[provider] || []) {
    if (!process.env[key]) missing.push(key);
  }

  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nSee env-config.md for setup instructions.\n');
    process.exit(1);
  }

  console.log('✅ Environment validated\n');
}

// =============================================================================
// ARGUMENT PARSING
// =============================================================================

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const parsed: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : 'true';
      parsed[key] = value;
      if (value !== 'true') i++;
    }
  }

  if (!parsed.type || !['social', 'demo', 'ad'].includes(parsed.type)) {
    console.error('Error: --type must be one of: social, demo, ad');
    printUsage();
    process.exit(1);
  }

  if (!parsed.provider || !['lambda', 'cloudrun', 'cloud'].includes(parsed.provider)) {
    parsed.provider = 'lambda'; // Default to lambda
  }

  return {
    type: parsed.type as 'social' | 'demo' | 'ad',
    provider: parsed.provider as 'lambda' | 'cloudrun' | 'cloud',
    headline: parsed.headline,
    subheadline: parsed.subheadline,
    product: parsed.product,
    tagline: parsed.tagline,
    problem: parsed.problem,
    solution: parsed.solution,
    cta: parsed.cta || 'Learn More',
    brandColor: parsed.brandColor || '#0ea5e9',
    accentColor: parsed.accentColor || '#d946ef',
    duration: parsed.duration ? parseInt(parsed.duration) : undefined,
    region: parsed.region,
  };
}

function printUsage(): void {
  console.log(`
Usage:
  npx ts-node scripts/generate-video.ts [options]

Required:
  --type <social|demo|ad>     Video type

Options:
  --provider <lambda|cloudrun|cloud>  Cloud provider (default: lambda)
  --headline <text>           Main headline/hook
  --subheadline <text>        Supporting text
  --product <name>            Product name (for demo type)
  --problem <text>            Problem statement (for ad type)
  --cta <text>                Call to action (default: "Learn More")
  --brandColor <hex>          Brand color (default: #0ea5e9)
  --accentColor <hex>         Accent color (default: #d946ef)
  --duration <seconds>        Video duration
  --region <region>           Cloud region override

Examples:
  npx ts-node scripts/generate-video.ts --type social --headline "This is amazing" --provider lambda
  npx ts-node scripts/generate-video.ts --type demo --product "MyApp" --provider cloudrun
  npx ts-node scripts/generate-video.ts --type ad --problem "Wasting time?" --provider cloud
  `);
}

// =============================================================================
// VIDEO CONFIG GENERATORS
// =============================================================================

function generateSocialConfig(args: CLIArgs): VideoConfig {
  const fps = 30;
  const duration = args.duration || 15;

  return {
    type: 'social',
    compositionId: 'SocialMediaVideo',
    width: 1080,
    height: 1920,
    fps,
    durationInFrames: duration * fps,
    props: {
      headline: args.headline || 'This Changed Everything',
      subheadline: args.subheadline || "Here's what happened...",
      cta: args.cta,
      brandColor: args.brandColor,
      accentColor: args.accentColor,
    },
  };
}

function generateDemoConfig(args: CLIArgs): VideoConfig {
  const fps = 30;
  const duration = args.duration || 60;

  return {
    type: 'demo',
    compositionId: 'ProductDemo',
    width: 1920,
    height: 1080,
    fps,
    durationInFrames: duration * fps,
    props: {
      productName: args.product || 'Product Name',
      tagline: args.tagline || 'Your tagline here',
      features: [
        { title: 'Feature 1', description: 'Description of feature 1' },
        { title: 'Feature 2', description: 'Description of feature 2' },
        { title: 'Feature 3', description: 'Description of feature 3' },
      ],
      cta: args.cta,
      brandColor: args.brandColor,
    },
  };
}

function generateAdConfig(args: CLIArgs): VideoConfig {
  const fps = 30;
  const duration = args.duration || 30;

  return {
    type: 'ad',
    compositionId: 'AdCreative',
    width: 1080,
    height: 1080,
    fps,
    durationInFrames: duration * fps,
    props: {
      headline: args.problem || 'Your pain point here',
      benefit: args.solution || 'Our solution delivers results',
      cta: args.cta,
      urgency: 'Limited time offer',
      brandColor: args.brandColor,
      accentColor: args.accentColor,
    },
  };
}

// =============================================================================
// CLOUD RENDER CODE GENERATORS
// =============================================================================

function generateLambdaCode(config: VideoConfig): string {
  const region = process.env.REMOTION_AWS_REGION || 'us-east-1';
  const functionName = process.env.REMOTION_LAMBDA_FUNCTION_NAME || 'remotion-render';
  const serveUrl = process.env.REMOTION_SERVE_URL || 'YOUR_SERVE_URL';

  return `
// Remotion Lambda Render - NO LOCAL SETUP REQUIRED
// Copy this code to your project

import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda/client';

async function renderVideo() {
  const { renderId, bucketName } = await renderMediaOnLambda({
    region: '${region}',
    functionName: '${functionName}',
    serveUrl: '${serveUrl}',
    composition: '${config.compositionId}',
    inputProps: ${JSON.stringify(config.props, null, 4)},
    codec: 'h264',
    imageFormat: 'jpeg',
    maxRetries: 1,
    privacy: 'public',
  });

  console.log('Render started:', renderId);

  // Poll for progress
  let complete = false;
  while (!complete) {
    const progress = await getRenderProgress({
      renderId,
      bucketName,
      region: '${region}',
      functionName: '${functionName}',
    });

    console.log(\`Progress: \${Math.round(progress.overallProgress * 100)}%\`);

    if (progress.done) {
      console.log('\\n✅ Video ready:', progress.outputFile);
      complete = true;
      return progress.outputFile;
    }

    await new Promise(r => setTimeout(r, 2000));
  }
}

renderVideo();
`.trim();
}

function generateCloudRunCode(config: VideoConfig): string {
  const region = process.env.REMOTION_GCP_REGION || 'us-central1';
  const serviceName = process.env.REMOTION_GCP_SERVICE_NAME || 'remotion-render';
  const serveUrl = process.env.REMOTION_SERVE_URL || 'YOUR_SERVE_URL';

  return `
// Remotion Cloud Run Render - NO LOCAL SETUP REQUIRED
// Copy this code to your project

import { renderMediaOnCloudrun } from '@remotion/cloudrun/client';

async function renderVideo() {
  const { publicUrl, renderId } = await renderMediaOnCloudrun({
    serviceName: '${serviceName}',
    region: '${region}',
    serveUrl: '${serveUrl}',
    composition: '${config.compositionId}',
    inputProps: ${JSON.stringify(config.props, null, 4)},
    codec: 'h264',
    privacy: 'public',
  });

  console.log('\\n✅ Video ready:', publicUrl);
  return publicUrl;
}

renderVideo();
`.trim();
}

function generateRemotionCloudCode(config: VideoConfig): string {
  return `
// Remotion Managed Cloud Render - EASIEST OPTION
// Copy this code to your project

// Note: Use the Remotion Cloud API from remotion.dev
// This is a simplified example - check docs for exact API

const response = await fetch('https://api.remotion.dev/render', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${process.env.REMOTION_CLOUD_API_KEY}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    composition: '${config.compositionId}',
    inputProps: ${JSON.stringify(config.props, null, 4)},
    codec: 'h264',
  }),
});

const { videoUrl } = await response.json();
console.log('\\n✅ Video ready:', videoUrl);
`.trim();
}

// =============================================================================
// MAIN
// =============================================================================

function main() {
  console.log('\n🎬 10x Marketing Team - Cloud Video Generator');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const args = parseArgs();

  // Validate environment
  validateEnvironment(args.provider);

  console.log(`📹 Type: ${args.type}`);
  console.log(`☁️  Provider: ${args.provider}`);
  console.log(`🎨 Brand Color: ${args.brandColor}`);
  console.log(`✨ Accent Color: ${args.accentColor}\n`);

  // Generate config based on type
  let config: VideoConfig;
  switch (args.type) {
    case 'social':
      config = generateSocialConfig(args);
      break;
    case 'demo':
      config = generateDemoConfig(args);
      break;
    case 'ad':
      config = generateAdConfig(args);
      break;
  }

  console.log('📊 Video Configuration:');
  console.log(`   Composition: ${config.compositionId}`);
  console.log(`   Dimensions: ${config.width}x${config.height}`);
  console.log(`   Duration: ${config.durationInFrames / config.fps}s (${config.durationInFrames} frames)`);
  console.log(`   FPS: ${config.fps}\n`);

  // Generate cloud render code
  let code: string;
  switch (args.provider) {
    case 'lambda':
      code = generateLambdaCode(config);
      break;
    case 'cloudrun':
      code = generateCloudRunCode(config);
      break;
    case 'cloud':
      code = generateRemotionCloudCode(config);
      break;
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 Cloud Render Code (copy to your project):');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(code);
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Install instructions
  console.log('\n📦 Required Package:');
  switch (args.provider) {
    case 'lambda':
      console.log('   npm install @remotion/lambda');
      break;
    case 'cloudrun':
      console.log('   npm install @remotion/cloudrun');
      break;
    case 'cloud':
      console.log('   (No package needed - uses REST API)');
      break;
  }

  console.log('\n✅ No local Remotion installation required!');
  console.log('   All rendering happens in the cloud.\n');
}

main();
