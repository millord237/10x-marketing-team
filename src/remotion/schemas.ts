// Shared Zod schemas for Remotion composition props
// Single source of truth — used by Root.tsx, dashboard, and video-generator
//
// These schemas power the Remotion Studio right-panel props editor.
// Using z.describe() for labels, @remotion/zod-types for rich controls,
// and .min()/.max()/.step() for number sliders.

import { z } from 'zod';
import { zColor, zTextarea } from '@remotion/zod-types';

// =============================================================================
// SOCIAL MEDIA VIDEO (9:16 vertical — TikTok, Reels, Shorts)
// =============================================================================

export const socialMediaVideoSchema = z.object({
  headline: z
    .string()
    .min(1)
    .max(100)
    .describe('Headline — the main hook text shown on screen'),
  subheadline: zTextarea()
    .describe('Subheadline — supporting text below the headline'),
  cta: z
    .string()
    .min(1)
    .max(40)
    .describe('Call to Action — e.g. "Link in bio"'),
  brandColor: zColor().describe('Brand Color — primary gradient color'),
  accentColor: zColor().describe('Accent Color — secondary gradient color'),
  // Typography controls
  headlineFontSize: z.number().min(24).max(120).step(2).describe('Headline Font Size'),
  subheadlineFontSize: z.number().min(16).max(72).step(2).describe('Subheadline Font Size'),
  ctaFontSize: z.number().min(16).max(64).step(2).describe('CTA Font Size'),
  // Animation controls
  particleCount: z.number().min(0).max(50).step(1).describe('Particle Count — floating dots'),
  hookDurationFrames: z.number().min(30).max(300).step(10).describe('Hook Duration (frames)'),
  gradientAngle: z.number().min(0).max(360).step(5).describe('Gradient Angle (degrees)'),
});

// =============================================================================
// PRODUCT DEMO (16:9 landscape — YouTube, Website, LinkedIn)
// =============================================================================

export const productDemoSchema = z.object({
  productName: z
    .string()
    .min(1)
    .max(60)
    .describe('Product Name — shown in intro and outro'),
  tagline: z
    .string()
    .min(1)
    .max(120)
    .describe('Tagline — subtitle under the product name'),
  features: z
    .array(
      z.object({
        title: z.string().min(1).describe('Feature Title'),
        description: zTextarea().describe('Feature Description'),
      })
    )
    .min(1)
    .max(5)
    .describe('Features — each gets its own scene section'),
  brandColor: zColor().describe('Brand Color'),
  // Typography controls
  productNameFontSize: z.number().min(48).max(200).step(4).describe('Product Name Font Size'),
  featureTitleFontSize: z.number().min(32).max(120).step(4).describe('Feature Title Font Size'),
  // Timing controls (in seconds — multiplied by fps in component)
  introSeconds: z.number().min(2).max(15).step(1).describe('Intro Duration (seconds)'),
  featureSeconds: z.number().min(4).max(30).step(1).describe('Per-Feature Duration (seconds)'),
  outroSeconds: z.number().min(2).max(15).step(1).describe('Outro Duration (seconds)'),
  // Visual controls
  gridOpacity: z.number().min(0).max(1).step(0.05).describe('Background Grid Opacity'),
});

// =============================================================================
// AD CREATIVE (1:1 square — Facebook/Instagram feed ads)
// =============================================================================

export const adCreativeSchema = z.object({
  headline: z
    .string()
    .min(1)
    .max(80)
    .describe('Headline — attention-grabbing hook'),
  benefit: zTextarea().describe('Benefit — the value proposition'),
  cta: z
    .string()
    .min(1)
    .max(40)
    .describe('CTA Button Text — e.g. "Start Free Trial"'),
  urgency: z
    .string()
    .min(1)
    .max(60)
    .describe('Urgency Badge — e.g. "Limited time offer"'),
  brandColor: zColor().describe('Brand Color'),
  accentColor: zColor().describe('Accent Color'),
  // Typography controls
  headlineFontSize: z.number().min(24).max(96).step(2).describe('Headline Font Size'),
  benefitFontSize: z.number().min(24).max(80).step(2).describe('Benefit Text Font Size'),
  ctaFontSize: z.number().min(24).max(80).step(2).describe('CTA Font Size'),
  // Timing controls (in seconds)
  hookSeconds: z.number().min(2).max(15).step(1).describe('Hook Scene Duration (seconds)'),
  benefitSeconds: z.number().min(4).max(20).step(1).describe('Benefit Scene Duration (seconds)'),
  ctaStartSeconds: z.number().min(10).max(50).step(1).describe('CTA Scene Start (seconds)'),
});

// =============================================================================
// TRANSITION SHOWCASE (demonstrates @remotion/transitions)
// =============================================================================

export const transitionShowcaseSchema = z.object({
  scenes: z
    .array(
      z.object({
        title: z.string().min(1).describe('Scene Title'),
        subtitle: z.string().describe('Scene Subtitle'),
        backgroundColor: zColor().describe('Scene Background Color'),
      })
    )
    .min(2)
    .max(6)
    .describe('Scenes — each scene transitions to the next'),
  transitionType: z
    .enum(['slide', 'fade', 'wipe', 'flip'])
    .describe('Transition Type — animation between scenes'),
  sceneDurationFrames: z.number().min(30).max(200).step(5).describe('Scene Duration (frames)'),
  transitionDurationFrames: z.number().min(5).max(60).step(5).describe('Transition Duration (frames)'),
  titleFontSize: z.number().min(32).max(120).step(4).describe('Title Font Size'),
});

// =============================================================================
// SHAPES DEMO (demonstrates @remotion/shapes)
// =============================================================================

export const shapesDemoSchema = z.object({
  title: z.string().min(1).describe('Title — displayed at the top'),
  shapes: z
    .array(z.enum(['rect', 'circle', 'triangle', 'star', 'polygon']))
    .min(1)
    .max(6)
    .describe('Shapes — which shapes to display'),
  brandColor: zColor().describe('Brand Color'),
  titleFontSize: z.number().min(24).max(96).step(4).describe('Title Font Size'),
  shapeSize: z.number().min(40).max(200).step(10).describe('Shape Size (px)'),
  shapeGap: z.number().min(20).max(160).step(10).describe('Gap Between Shapes (px)'),
});

// =============================================================================
// INFERRED TYPES
// =============================================================================

export type SocialMediaVideoProps = z.infer<typeof socialMediaVideoSchema>;
export type ProductDemoProps = z.infer<typeof productDemoSchema>;
export type AdCreativeProps = z.infer<typeof adCreativeSchema>;
export type TransitionShowcaseProps = z.infer<typeof transitionShowcaseSchema>;
export type ShapesDemoProps = z.infer<typeof shapesDemoSchema>;
