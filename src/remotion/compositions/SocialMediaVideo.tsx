import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';

interface SocialMediaVideoProps {
  headline: string;
  subheadline: string;
  cta: string;
  brandColor: string;
  accentColor: string;
}

export const SocialMediaVideo: React.FC<SocialMediaVideoProps> = ({
  headline,
  subheadline,
  cta,
  brandColor,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Animation calculations
  const hookEntrance = spring({ frame, fps, from: 0, to: 1, durationInFrames: 20 });
  const scaleIn = spring({ frame: frame - 10, fps, from: 0.8, to: 1, durationInFrames: 15 });

  // Background pulse animation
  const pulse = interpolate(frame % 60, [0, 30, 60], [1, 1.05, 1]);

  // Text reveal timing
  const headlineProgress = interpolate(frame, [15, 45], [0, 1], { extrapolateRight: 'clamp' });
  const subheadlineProgress = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp' });

  // CTA animation (appears at the end)
  const ctaProgress = interpolate(frame, [durationInFrames - 90, durationInFrames - 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {/* Animated Gradient Background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${brandColor} 0%, ${accentColor} 100%)`,
          transform: `scale(${pulse})`,
        }}
      />

      {/* Floating Particles */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        {[...Array(20)].map((_, i) => {
          const yOffset = interpolate(
            (frame + i * 30) % 200,
            [0, 200],
            [1920, -100]
          );
          const xOffset = 50 + Math.sin(i * 0.5) * 450;
          const size = 10 + (i % 3) * 10;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: xOffset,
                top: yOffset,
                width: size,
                height: size,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Hook Section */}
      <Sequence from={0} durationInFrames={150}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 60,
          }}
        >
          {/* Headline */}
          <div
            style={{
              opacity: hookEntrance,
              transform: `scale(${scaleIn}) translateY(${(1 - headlineProgress) * 50}px)`,
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: 72,
                fontWeight: 800,
                color: 'white',
                textShadow: '0 4px 30px rgba(0,0,0,0.3)',
                lineHeight: 1.1,
                marginBottom: 40,
              }}
            >
              {headline.split(' ').map((word, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    opacity: interpolate(headlineProgress, [i * 0.2, i * 0.2 + 0.3], [0, 1], {
                      extrapolateRight: 'clamp',
                    }),
                    transform: `translateY(${interpolate(
                      headlineProgress,
                      [i * 0.2, i * 0.2 + 0.3],
                      [20, 0],
                      { extrapolateRight: 'clamp' }
                    )}px)`,
                    marginRight: 16,
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Subheadline */}
            <p
              style={{
                fontSize: 36,
                color: 'rgba(255,255,255,0.9)',
                opacity: subheadlineProgress,
                transform: `translateY(${(1 - subheadlineProgress) * 30}px)`,
              }}
            >
              {subheadline}
            </p>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* CTA Section */}
      <Sequence from={durationInFrames - 120}>
        <AbsoluteFill
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: 200,
          }}
        >
          <div
            style={{
              padding: '24px 48px',
              background: 'white',
              borderRadius: 16,
              opacity: ctaProgress,
              transform: `scale(${interpolate(ctaProgress, [0, 1], [0.8, 1])})`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                background: `linear-gradient(90deg, ${brandColor}, ${accentColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {cta}
            </span>
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
