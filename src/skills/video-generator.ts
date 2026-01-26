// Video Generation Skill
// Orchestrates Remotion compositions with AI-generated content
// Supports local rendering AND cloud rendering (Lambda/Cloud Run)

import { z } from 'zod';

// =============================================================================
// INPUT SCHEMAS
// =============================================================================

export const SocialVideoInputSchema = z.object({
  type: z.literal('social'),
  headline: z.string().min(1).max(100),
  subheadline: z.string().optional(),
  cta: z.string().default('Link in bio'),
  brandColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#0ea5e9'),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#d946ef'),
  duration: z.number().min(5).max(60).default(15),
  platform: z.enum(['tiktok', 'reels', 'shorts']).default('tiktok'),
});

export const ProductDemoInputSchema = z.object({
  type: z.literal('demo'),
  productName: z.string().min(1),
  tagline: z.string(),
  features: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })).min(1).max(5),
  brandColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#0ea5e9'),
  duration: z.number().min(30).max(180).default(60),
});

export const AdCreativeInputSchema = z.object({
  type: z.literal('ad'),
  headline: z.string().min(1).max(80),
  benefit: z.string().min(1),
  cta: z.string().default('Start Free Trial'),
  urgency: z.string().optional(),
  brandColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#0ea5e9'),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#d946ef'),
  duration: z.number().min(15).max(60).default(30),
  format: z.enum(['square', 'landscape', 'vertical']).default('square'),
});

// Cloud rendering options
export const CloudRenderOptionsSchema = z.object({
  provider: z.enum(['lambda', 'cloudrun']).default('lambda'),
  region: z.string().default('us-east-1'),
  functionName: z.string().optional(),
  serviceName: z.string().optional(),
  codec: z.enum(['h264', 'h265', 'vp8', 'vp9', 'prores']).default('h264'),
  imageFormat: z.enum(['jpeg', 'png']).default('jpeg'),
  privacy: z.enum(['public', 'private']).default('public'),
});

export type SocialVideoInput = z.infer<typeof SocialVideoInputSchema>;
export type ProductDemoInput = z.infer<typeof ProductDemoInputSchema>;
export type AdCreativeInput = z.infer<typeof AdCreativeInputSchema>;
export type CloudRenderOptions = z.infer<typeof CloudRenderOptionsSchema>;
export type VideoInput = SocialVideoInput | ProductDemoInput | AdCreativeInput;

// =============================================================================
// OUTPUT TYPES
// =============================================================================

export interface VideoOutput {
  success: boolean;
  videoId: string;
  composition: string;
  props: Record<string, unknown>;
  renderCommand: string;
  cloudRenderCode?: string;
  lambdaRenderCode?: string;
  cloudRunRenderCode?: string;
  previewUrl?: string;
  exportFormats: string[];
}

export interface CloudRenderOutput {
  success: boolean;
  renderId?: string;
  bucketName?: string;
  publicUrl?: string;
  progress?: number;
  status: 'pending' | 'rendering' | 'complete' | 'error';
  error?: string;
}

// =============================================================================
// VIDEO GENERATION
// =============================================================================

export async function generateVideo(input: VideoInput): Promise<VideoOutput> {
  const videoId = `video-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  switch (input.type) {
    case 'social':
      return generateSocialVideo(videoId, input);
    case 'demo':
      return generateProductDemo(videoId, input);
    case 'ad':
      return generateAdCreative(videoId, input);
    default:
      throw new Error('Unknown video type');
  }
}

function generateSocialVideo(videoId: string, input: SocialVideoInput): VideoOutput {
  const fps = 30;
  const durationInFrames = input.duration * fps;

  const props = {
    headline: input.headline,
    subheadline: input.subheadline || "Here's what happened...",
    cta: input.cta,
    brandColor: input.brandColor,
    accentColor: input.accentColor,
  };

  const propsJson = JSON.stringify(props);

  return {
    success: true,
    videoId,
    composition: 'SocialMediaVideo',
    props,
    renderCommand: `npx remotion render src/remotion/index.ts SocialMediaVideo out/${videoId}.mp4 --props='${propsJson}'`,
    lambdaRenderCode: generateLambdaCode('SocialMediaVideo', props),
    cloudRunRenderCode: generateCloudRunCode('SocialMediaVideo', props),
    exportFormats: ['mp4', 'webm', 'gif'],
  };
}

function generateProductDemo(videoId: string, input: ProductDemoInput): VideoOutput {
  const props = {
    productName: input.productName,
    tagline: input.tagline,
    features: input.features,
    brandColor: input.brandColor,
  };

  const propsJson = JSON.stringify(props);

  return {
    success: true,
    videoId,
    composition: 'ProductDemo',
    props,
    renderCommand: `npx remotion render src/remotion/index.ts ProductDemo out/${videoId}.mp4 --props='${propsJson}'`,
    lambdaRenderCode: generateLambdaCode('ProductDemo', props),
    cloudRunRenderCode: generateCloudRunCode('ProductDemo', props),
    exportFormats: ['mp4', 'webm'],
  };
}

function generateAdCreative(videoId: string, input: AdCreativeInput): VideoOutput {
  const props = {
    headline: input.headline,
    benefit: input.benefit,
    cta: input.cta,
    urgency: input.urgency || 'Limited time offer',
    brandColor: input.brandColor,
    accentColor: input.accentColor,
  };

  const propsJson = JSON.stringify(props);

  return {
    success: true,
    videoId,
    composition: 'AdCreative',
    props,
    renderCommand: `npx remotion render src/remotion/index.ts AdCreative out/${videoId}.mp4 --props='${propsJson}'`,
    lambdaRenderCode: generateLambdaCode('AdCreative', props),
    cloudRunRenderCode: generateCloudRunCode('AdCreative', props),
    exportFormats: ['mp4', 'webm', 'gif'],
  };
}

// =============================================================================
// CLOUD RENDERING CODE GENERATORS
// =============================================================================

function generateLambdaCode(composition: string, props: Record<string, unknown>): string {
  return `
import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda';

// Start Lambda render (NO LOCAL SETUP REQUIRED)
const { renderId, bucketName } = await renderMediaOnLambda({
  region: 'us-east-1',
  functionName: 'remotion-render',
  serveUrl: process.env.REMOTION_SERVE_URL,
  composition: '${composition}',
  inputProps: ${JSON.stringify(props, null, 2)},
  codec: 'h264',
  imageFormat: 'jpeg',
  maxRetries: 1,
  privacy: 'public',
});

console.log('Render started:', renderId);

// Check progress
const checkProgress = async () => {
  const progress = await getRenderProgress({
    renderId,
    bucketName,
    region: 'us-east-1',
    functionName: 'remotion-render',
  });

  console.log(\`Progress: \${Math.round(progress.overallProgress * 100)}%\`);

  if (progress.done) {
    console.log('Video URL:', progress.outputFile);
    return progress.outputFile;
  }

  // Check again in 1 second
  setTimeout(checkProgress, 1000);
};

checkProgress();
`.trim();
}

function generateCloudRunCode(composition: string, props: Record<string, unknown>): string {
  return `
import { renderMediaOnCloudrun } from '@remotion/cloudrun';

// Start Cloud Run render (NO LOCAL SETUP REQUIRED)
const { publicUrl, renderId } = await renderMediaOnCloudrun({
  serviceName: 'remotion-render',
  region: 'us-central1',
  composition: '${composition}',
  serveUrl: process.env.REMOTION_SERVE_URL,
  inputProps: ${JSON.stringify(props, null, 2)},
  codec: 'h264',
  privacy: 'public',
});

console.log('Video URL:', publicUrl);
`.trim();
}

// =============================================================================
// CLOUD RENDER EXECUTION
// =============================================================================

export interface RenderOnLambdaParams {
  composition: string;
  props: Record<string, unknown>;
  region?: string;
  functionName?: string;
  serveUrl: string;
  codec?: 'h264' | 'h265' | 'vp8' | 'vp9' | 'prores';
}

export interface RenderOnCloudRunParams {
  composition: string;
  props: Record<string, unknown>;
  region?: string;
  serviceName?: string;
  serveUrl: string;
  codec?: 'h264' | 'h265' | 'vp8' | 'vp9' | 'prores';
}

// Note: These functions require @remotion/lambda and @remotion/cloudrun packages
// They are provided as templates for users to implement in their own projects

export async function renderOnLambda(params: RenderOnLambdaParams): Promise<CloudRenderOutput> {
  // This is a template - actual implementation requires AWS credentials
  console.log('Lambda render would be initiated with:', params);

  return {
    success: true,
    status: 'pending',
    renderId: `render-${Date.now()}`,
  };
}

export async function renderOnCloudRun(params: RenderOnCloudRunParams): Promise<CloudRenderOutput> {
  // This is a template - actual implementation requires GCP credentials
  console.log('Cloud Run render would be initiated with:', params);

  return {
    success: true,
    status: 'pending',
    renderId: `render-${Date.now()}`,
  };
}

// =============================================================================
// AI-ASSISTED CONTENT GENERATION
// =============================================================================

export interface ContentSuggestions {
  headlines: string[];
  hooks: string[];
  ctas: string[];
  benefits: string[];
}

export function generateContentSuggestions(topic: string, type: 'social' | 'demo' | 'ad'): ContentSuggestions {
  // These would be generated by Claude API in production
  const suggestions: Record<string, ContentSuggestions> = {
    social: {
      headlines: [
        'This Changed Everything',
        'Nobody Talks About This',
        'Stop Making This Mistake',
        "What They Don't Tell You",
        'I Tested This For 30 Days',
      ],
      hooks: [
        "Here's something wild...",
        'I was wrong about this...',
        'POV: You just discovered...',
        'The truth about...',
        'Wait until you see this...',
      ],
      ctas: ['Link in bio', 'Follow for more', 'Save this', 'Comment below', 'Share with a friend'],
      benefits: [],
    },
    demo: {
      headlines: [
        'Introducing the Future',
        'See It In Action',
        'Watch How It Works',
        'The Easiest Way to...',
        'Built for Teams Like Yours',
      ],
      hooks: [],
      ctas: ['Try it free', 'Get started', 'Book a demo', 'Learn more', 'Start your trial'],
      benefits: [
        'Save hours every week',
        'Increase conversions by 40%',
        'Scale your content effortlessly',
        'Automate your workflow',
        'No credit card required',
      ],
    },
    ad: {
      headlines: [
        'Stop Wasting Time',
        "You're Leaving Money on the Table",
        'Finally, An Easier Way',
        'The #1 Tool for...',
        'Join 10,000+ Happy Customers',
      ],
      hooks: [],
      ctas: ['Start Free Trial', 'Get 50% Off', 'Claim Your Spot', 'Join Now', 'Get Instant Access'],
      benefits: [
        'Results in minutes, not hours',
        'No experience needed',
        'Trusted by 10,000+ teams',
        'Risk-free guarantee',
        'Cancel anytime',
      ],
    },
  };

  return suggestions[type] || suggestions.social;
}

// =============================================================================
// COMPOSITION TEMPLATES
// =============================================================================

export interface CompositionPreset {
  id: string;
  name: string;
  description: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  platform: string[];
}

export const compositionPresets: CompositionPreset[] = [
  {
    id: 'social-vertical',
    name: 'Social Media (Vertical)',
    description: 'TikTok, Instagram Reels, YouTube Shorts',
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 450, // 15 seconds
    platform: ['tiktok', 'reels', 'shorts'],
  },
  {
    id: 'product-demo',
    name: 'Product Demo (Landscape)',
    description: 'YouTube, Website embeds, LinkedIn',
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 1800, // 60 seconds
    platform: ['youtube', 'website', 'linkedin'],
  },
  {
    id: 'ad-square',
    name: 'Ad Creative (Square)',
    description: 'Facebook/Instagram feed ads',
    width: 1080,
    height: 1080,
    fps: 30,
    durationInFrames: 900, // 30 seconds
    platform: ['facebook', 'instagram'],
  },
  {
    id: 'story-vertical',
    name: 'Story Format',
    description: 'Instagram/Facebook Stories',
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 450, // 15 seconds max per story
    platform: ['instagram-story', 'facebook-story'],
  },
  {
    id: 'linkedin-video',
    name: 'LinkedIn Video',
    description: 'Professional video format',
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 900, // 30 seconds
    platform: ['linkedin'],
  },
];

// =============================================================================
// TRANSITION PRESETS
// =============================================================================

export interface TransitionPreset {
  id: string;
  name: string;
  presentation: string;
  timing: string;
  durationInFrames: number;
  code: string;
}

export const transitionPresets: TransitionPreset[] = [
  {
    id: 'slide-right',
    name: 'Slide from Right',
    presentation: 'slide',
    timing: 'linear',
    durationInFrames: 30,
    code: `slide({ direction: 'from-right' })`,
  },
  {
    id: 'slide-left',
    name: 'Slide from Left',
    presentation: 'slide',
    timing: 'linear',
    durationInFrames: 30,
    code: `slide({ direction: 'from-left' })`,
  },
  {
    id: 'fade',
    name: 'Crossfade',
    presentation: 'fade',
    timing: 'linear',
    durationInFrames: 30,
    code: `fade()`,
  },
  {
    id: 'wipe-right',
    name: 'Wipe from Right',
    presentation: 'wipe',
    timing: 'linear',
    durationInFrames: 30,
    code: `wipe({ direction: 'from-right' })`,
  },
  {
    id: 'flip-horizontal',
    name: 'Flip Horizontal',
    presentation: 'flip',
    timing: 'spring',
    durationInFrames: 45,
    code: `flip({ direction: 'from-left', perspective: 1000 })`,
  },
];

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  generateVideo,
  generateContentSuggestions,
  renderOnLambda,
  renderOnCloudRun,
  compositionPresets,
  transitionPresets,
  SocialVideoInputSchema,
  ProductDemoInputSchema,
  AdCreativeInputSchema,
  CloudRenderOptionsSchema,
};
