import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Sequence } from 'remotion';
import type { AdCreativeProps } from '../schemas';

export const AdCreative: React.FC<AdCreativeProps> = ({
  headline,
  benefit,
  cta,
  urgency,
  brandColor,
  accentColor,
  headlineFontSize,
  benefitFontSize,
  ctaFontSize,
  hookSeconds,
  benefitSeconds,
  ctaStartSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene timing from props (editable in Studio)
  const hookEnd = hookSeconds * fps;
  const benefitEnd = (hookSeconds + benefitSeconds) * fps;
  const ctaStart = ctaStartSeconds * fps;

  return (
    <AbsoluteFill>
      {/* Animated Background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${45 + frame * 0.5}deg, #0a0a14, #1a1a2e)`,
        }}
      />

      {/* Dynamic Accent Lines */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        {[...Array(5)].map((_, i) => {
          const delay = i * 60;
          const progress = interpolate(
            (frame + delay) % 180,
            [0, 180],
            [0, 1]
          );

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 4,
                height: '200%',
                background: `linear-gradient(180deg, transparent, ${brandColor}, transparent)`,
                left: `${15 + i * 20}%`,
                top: '-50%',
                transform: `translateY(${progress * 100}%) rotate(45deg)`,
                opacity: 0.3,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* Hook Scene */}
      <Sequence from={0} durationInFrames={hookEnd}>
        <HookScene
          headline={headline}
          brandColor={brandColor}
          accentColor={accentColor}
          frame={frame}
          fps={fps}
          fontSize={headlineFontSize}
        />
      </Sequence>

      {/* Benefit Scene */}
      <Sequence from={hookEnd} durationInFrames={benefitEnd - hookEnd}>
        <BenefitScene
          benefit={benefit}
          brandColor={brandColor}
          frame={frame - hookEnd}
          fps={fps}
          fontSize={benefitFontSize}
        />
      </Sequence>

      {/* CTA Scene */}
      <Sequence from={ctaStart} durationInFrames={durationInFrames - ctaStart}>
        <CTAScene
          cta={cta}
          urgency={urgency}
          brandColor={brandColor}
          accentColor={accentColor}
          frame={frame - ctaStart}
          fps={fps}
          fontSize={ctaFontSize}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

// Hook Scene
const HookScene: React.FC<{
  headline: string;
  brandColor: string;
  accentColor: string;
  frame: number;
  fps: number;
  fontSize: number;
}> = ({ headline, brandColor, accentColor, frame, fps, fontSize }) => {
  const words = headline.split(' ');

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
      }}
    >
      {/* Attention Grabber */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${brandColor}, ${accentColor})`,
            transform: `scale(${1 + Math.sin(frame * 0.1) * 0.1})`,
            boxShadow: `0 0 40px ${brandColor}80`,
          }}
        />
      </div>

      {/* Headline Words */}
      <div style={{ textAlign: 'center' }}>
        {words.map((word, i) => {
          const wordDelay = i * 8;
          const wordProgress = spring({
            frame: frame - wordDelay,
            fps,
            from: 0,
            to: 1,
            durationInFrames: 20,
          });

          return (
            <div
              key={i}
              style={{
                display: 'inline-block',
                margin: '0 12px 16px',
                opacity: wordProgress,
                transform: `translateY(${(1 - wordProgress) * 40}px) scale(${0.8 + wordProgress * 0.2})`,
              }}
            >
              <span
                style={{
                  fontSize,
                  fontWeight: 800,
                  color: i % 2 === 0 ? 'white' : brandColor,
                }}
              >
                {word}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Benefit Scene
const BenefitScene: React.FC<{
  benefit: string;
  brandColor: string;
  frame: number;
  fps: number;
  fontSize: number;
}> = ({ benefit, brandColor, frame, fps, fontSize }) => {
  const entrance = spring({ frame, fps, from: 0, to: 1, durationInFrames: 25 });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      {/* Benefit Card */}
      <div
        style={{
          padding: 60,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 32,
          border: `2px solid ${brandColor}40`,
          opacity: entrance,
          transform: `scale(${0.9 + entrance * 0.1})`,
          maxWidth: 800,
          textAlign: 'center',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 100,
            height: 100,
            margin: '0 auto 30px',
            borderRadius: 24,
            background: `linear-gradient(135deg, ${brandColor}, ${brandColor}80)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `rotate(${frame * 0.5}deg)`,
          }}
        >
          <svg width="50" height="50" viewBox="0 0 24 24" fill="white">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        {/* Text */}
        <p
          style={{
            fontSize,
            fontWeight: 600,
            color: 'white',
            lineHeight: 1.3,
          }}
        >
          {benefit}
        </p>
      </div>

      {/* Floating Elements */}
      {[...Array(4)].map((_, i) => {
        const angle = (i / 4) * Math.PI * 2 + frame * 0.01;
        const radius = 350 + Math.sin(frame * 0.05 + i) * 30;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 20,
              height: 20,
              borderRadius: 6,
              background: brandColor,
              opacity: 0.4,
              left: 540 + Math.cos(angle) * radius,
              top: 540 + Math.sin(angle) * radius,
              transform: `rotate(${frame * 2 + i * 45}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// CTA Scene
const CTAScene: React.FC<{
  cta: string;
  urgency: string;
  brandColor: string;
  accentColor: string;
  frame: number;
  fps: number;
  fontSize: number;
}> = ({ cta, urgency, brandColor, accentColor, frame, fps, fontSize }) => {
  const entrance = spring({ frame, fps, from: 0, to: 1, durationInFrames: 20 });
  const pulse = 1 + Math.sin(frame * 0.15) * 0.03;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${brandColor}, ${accentColor})`,
      }}
    >
      {/* Main CTA */}
      <div
        style={{
          textAlign: 'center',
          opacity: entrance,
          transform: `scale(${0.9 + entrance * 0.1})`,
        }}
      >
        {/* Urgency Badge */}
        <div
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 30,
            marginBottom: 30,
          }}
        >
          <span style={{ color: 'white', fontSize: 24, fontWeight: 600 }}>
            {urgency}
          </span>
        </div>

        {/* CTA Button */}
        <div
          style={{
            padding: '30px 80px',
            background: 'white',
            borderRadius: 20,
            transform: `scale(${pulse})`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          <span
            style={{
              fontSize,
              fontWeight: 800,
              background: `linear-gradient(90deg, ${brandColor}, ${accentColor})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {cta}
          </span>
        </div>

        {/* Arrow Animation */}
        <div
          style={{
            marginTop: 40,
            transform: `translateY(${Math.sin(frame * 0.2) * 10}px)`,
          }}
        >
          <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </div>

      {/* Corner Decorations */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 40,
          width: 100,
          height: 100,
          border: '4px solid rgba(255,255,255,0.3)',
          borderRadius: 20,
          transform: `rotate(${frame}deg)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          width: 80,
          height: 80,
          border: '4px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          transform: `rotate(${-frame * 0.5}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};
