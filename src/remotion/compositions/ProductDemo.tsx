import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
import type { ProductDemoProps } from '../schemas';

interface Feature {
  title: string;
  description: string;
}

export const ProductDemo: React.FC<ProductDemoProps> = ({
  productName,
  tagline,
  features,
  brandColor,
  productNameFontSize,
  featureTitleFontSize,
  introSeconds,
  featureSeconds,
  outroSeconds,
  gridOpacity,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Calculate section timing from props
  const introEnd = introSeconds * fps;
  const featuresDuration = featureSeconds * fps;
  const outroStart = durationInFrames - outroSeconds * fps;

  return (
    <AbsoluteFill style={{ background: '#0a0a14' }}>
      {/* Animated Grid Background */}
      <AbsoluteFill style={{ overflow: 'hidden', opacity: gridOpacity }}>
        {[...Array(10)].map((_, i) => (
          <div
            key={`h-${i}`}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: i * 120,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${brandColor}40, transparent)`,
              transform: `translateX(${Math.sin((frame + i * 20) * 0.02) * 100}px)`,
            }}
          />
        ))}
        {[...Array(20)].map((_, i) => (
          <div
            key={`v-${i}`}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: i * 120,
              width: 1,
              background: `linear-gradient(180deg, transparent, ${brandColor}40, transparent)`,
              transform: `translateY(${Math.cos((frame + i * 20) * 0.02) * 100}px)`,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* Intro Section */}
      <Sequence from={0} durationInFrames={introEnd}>
        <IntroSection
          productName={productName}
          tagline={tagline}
          brandColor={brandColor}
          frame={frame}
          fps={fps}
          productNameFontSize={productNameFontSize}
        />
      </Sequence>

      {/* Feature Sections */}
      {features.map((feature, index) => (
        <Sequence
          key={index}
          from={introEnd + index * featuresDuration}
          durationInFrames={featuresDuration}
        >
          <FeatureSection
            feature={feature}
            index={index}
            brandColor={brandColor}
            frame={frame - (introEnd + index * featuresDuration)}
            fps={fps}
            featureTitleFontSize={featureTitleFontSize}
          />
        </Sequence>
      ))}

      {/* Outro Section */}
      <Sequence from={outroStart} durationInFrames={outroSeconds * fps}>
        <OutroSection
          productName={productName}
          brandColor={brandColor}
          frame={frame - outroStart}
          fps={fps}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// Intro Section Component
const IntroSection: React.FC<{
  productName: string;
  tagline: string;
  brandColor: string;
  frame: number;
  fps: number;
  productNameFontSize: number;
}> = ({ productName, tagline, brandColor, frame, fps, productNameFontSize }) => {
  const logoScale = spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 });
  const taglineOpacity = interpolate(frame, [45, 75], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          transform: `scale(${logoScale})`,
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: productNameFontSize,
            fontWeight: 800,
            background: `linear-gradient(135deg, ${brandColor}, #fff)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 20,
          }}
        >
          {productName}
        </h1>
        <p
          style={{
            fontSize: 36,
            color: 'rgba(255,255,255,0.7)',
            opacity: taglineOpacity,
          }}
        >
          {tagline}
        </p>
      </div>

      {/* Decorative Ring */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          border: `2px solid ${brandColor}40`,
          borderRadius: '50%',
          transform: `scale(${logoScale * 1.2}) rotate(${frame}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Feature Section Component
const FeatureSection: React.FC<{
  feature: Feature;
  index: number;
  brandColor: string;
  frame: number;
  fps: number;
  featureTitleFontSize: number;
}> = ({ feature, index, brandColor, frame, fps, featureTitleFontSize }) => {
  const entrance = spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 });
  const slideIn = interpolate(frame, [0, 30], [100, 0], { extrapolateRight: 'clamp' });

  const isLeft = index % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 100,
      }}
    >
      {/* Feature Number */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 100,
          opacity: entrance * 0.3,
        }}
      >
        <span
          style={{
            fontSize: 200,
            fontWeight: 900,
            color: brandColor,
          }}
        >
          0{index + 1}
        </span>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: isLeft ? 0 : 400,
          paddingRight: isLeft ? 400 : 0,
          opacity: entrance,
          transform: `translateX(${isLeft ? -slideIn : slideIn}px)`,
        }}
      >
        <h2
          style={{
            fontSize: featureTitleFontSize,
            fontWeight: 700,
            color: 'white',
            marginBottom: 24,
          }}
        >
          {feature.title}
        </h2>
        <p
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.5,
          }}
        >
          {feature.description}
        </p>
      </div>

      {/* Feature Visual Placeholder */}
      <div
        style={{
          position: 'absolute',
          right: isLeft ? 100 : 'auto',
          left: isLeft ? 'auto' : 100,
          width: 500,
          height: 400,
          borderRadius: 24,
          background: `linear-gradient(135deg, ${brandColor}20, ${brandColor}40)`,
          border: `2px solid ${brandColor}40`,
          opacity: entrance,
          transform: `translateX(${isLeft ? slideIn : -slideIn}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: brandColor,
            transform: `rotate(${frame * 2}deg)`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// Outro Section Component
const OutroSection: React.FC<{
  productName: string;
  brandColor: string;
  frame: number;
  fps: number;
}> = ({ productName, brandColor, frame, fps }) => {
  const entrance = spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${brandColor}, #1a1a2e)`,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          opacity: entrance,
          transform: `scale(${0.8 + entrance * 0.2})`,
        }}
      >
        <h2
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: 'white',
            marginBottom: 30,
          }}
        >
          Ready to get started?
        </h2>
        <div
          style={{
            padding: '20px 60px',
            background: 'white',
            borderRadius: 12,
            display: 'inline-block',
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: brandColor,
            }}
          >
            Try {productName} Free
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
