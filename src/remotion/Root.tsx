import React from 'react';
import { Composition, Folder } from 'remotion';
import { z } from 'zod';
import { SocialMediaVideo } from './compositions/SocialMediaVideo';
import { ProductDemo } from './compositions/ProductDemo';
import { AdCreative } from './compositions/AdCreative';
import { TransitionShowcase } from './compositions/TransitionShowcase';
import { ShapesDemo } from './compositions/ShapesDemo';

// =============================================================================
// PROP SCHEMAS - Type-safe props with Zod validation
// =============================================================================

const socialMediaVideoSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  cta: z.string(),
  brandColor: z.string(),
  accentColor: z.string(),
});

const productDemoSchema = z.object({
  productName: z.string(),
  tagline: z.string(),
  features: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
  brandColor: z.string(),
});

const adCreativeSchema = z.object({
  headline: z.string(),
  benefit: z.string(),
  cta: z.string(),
  urgency: z.string(),
  brandColor: z.string(),
  accentColor: z.string(),
});

const transitionShowcaseSchema = z.object({
  scenes: z.array(
    z.object({
      title: z.string(),
      subtitle: z.string(),
      backgroundColor: z.string(),
    })
  ),
  transitionType: z.enum(['slide', 'fade', 'wipe', 'flip']),
});

const shapesDemoSchema = z.object({
  title: z.string(),
  shapes: z.array(z.enum(['rect', 'circle', 'triangle', 'star', 'polygon'])),
  brandColor: z.string(),
});

// =============================================================================
// ROOT COMPONENT - All compositions registered here
// =============================================================================

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ============================================ */}
      {/* MAIN COMPOSITIONS - Production Ready */}
      {/* ============================================ */}

      {/* Social Media Videos - 9:16 Vertical (TikTok, Reels, Shorts) */}
      <Composition
        id="SocialMediaVideo"
        component={SocialMediaVideo}
        schema={socialMediaVideoSchema}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          headline: 'This Product Changed Everything',
          subheadline: "Here's what happened...",
          cta: 'Link in bio',
          brandColor: '#0ea5e9',
          accentColor: '#d946ef',
        }}
      />

      {/* Product Demo - 16:9 Landscape */}
      <Composition
        id="ProductDemo"
        component={ProductDemo}
        schema={productDemoSchema}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          productName: '10x Marketing',
          tagline: 'Create Videos 10x Faster',
          features: [
            { title: 'AI-Powered', description: 'Claude writes your scripts' },
            { title: 'Templates', description: '100+ ready-to-use designs' },
            { title: 'Export', description: '4K quality in any format' },
          ],
          brandColor: '#0ea5e9',
        }}
      />

      {/* Ad Creative - 1:1 Square */}
      <Composition
        id="AdCreative"
        component={AdCreative}
        schema={adCreativeSchema}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          headline: 'Stop Wasting Time on Video Editing',
          benefit: 'Create professional videos in minutes',
          cta: 'Start Free Trial',
          urgency: 'Limited time offer',
          brandColor: '#0ea5e9',
          accentColor: '#d946ef',
        }}
      />

      {/* ============================================ */}
      {/* STUDIO DEMOS - Showcase Remotion Features */}
      {/* ============================================ */}

      <Folder name="StudioFeatures">
        {/* Transition Showcase - Demonstrates @remotion/transitions */}
        <Composition
          id="TransitionShowcase"
          component={TransitionShowcase}
          schema={transitionShowcaseSchema}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            scenes: [
              {
                title: 'Scene 1',
                subtitle: 'Introduction',
                backgroundColor: '#0ea5e9',
              },
              {
                title: 'Scene 2',
                subtitle: 'Features',
                backgroundColor: '#8b5cf6',
              },
              {
                title: 'Scene 3',
                subtitle: 'Call to Action',
                backgroundColor: '#ec4899',
              },
            ],
            transitionType: 'slide',
          }}
        />

        {/* Shapes Demo - Demonstrates @remotion/shapes */}
        <Composition
          id="ShapesDemo"
          component={ShapesDemo}
          schema={shapesDemoSchema}
          durationInFrames={300}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: 'Animated Shapes',
            shapes: ['rect', 'circle', 'triangle', 'star', 'polygon'],
            brandColor: '#0ea5e9',
          }}
        />
      </Folder>
    </>
  );
};
