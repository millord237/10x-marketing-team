/**
 * 10x Marketing Team - Video Composition Templates
 *
 * Remotion composition templates for:
 * - Social Media (TikTok, Reels, Shorts)
 * - Product Demos
 * - Ad Creatives
 *
 * Each template follows the HOOK → BODY → CTA structure
 * optimized for maximum engagement and conversion.
 */

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Audio,
  Img,
  staticFile,
} from 'remotion';
import { ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface VideoProps {
  /** Brand primary color (hex) */
  brandColor: string;
  /** Brand accent color (hex) */
  accentColor: string;
}

interface SocialVideoProps extends VideoProps {
  /** Main hook text (attention grabber) */
  hook: string;
  /** Body content points */
  bodyPoints: string[];
  /** Call to action text */
  cta: string;
  /** Optional background music */
  musicSrc?: string;
}

interface ProductDemoProps extends VideoProps {
  /** Product/company name */
  productName: string;
  /** Main tagline */
  tagline: string;
  /** Features to showcase */
  features: Array<{
    title: string;
    description: string;
    iconSrc?: string;
  }>;
  /** Ending CTA */
  cta: string;
}

interface AdCreativeProps extends VideoProps {
  /** Problem statement */
  problem: string;
  /** Solution/benefit */
  solution: string;
  /** Social proof (optional) */
  socialProof?: string;
  /** CTA text */
  cta: string;
  /** Urgency text (optional) */
  urgency?: string;
}

// =============================================================================
// UTILITY COMPONENTS
// =============================================================================

/** Animated gradient background */
function GradientBackground({
  color1,
  color2,
  animate = true,
}: {
  color1: string;
  color2: string;
  animate?: boolean;
}) {
  const frame = useCurrentFrame();
  const angle = animate ? 135 + Math.sin(frame * 0.02) * 20 : 135;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
      }}
    />
  );
}

/** Floating particles effect */
function Particles({
  count = 20,
  color = 'rgba(255,255,255,0.2)',
}: {
  count?: number;
  color?: string;
}) {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {[...Array(count)].map((_, i) => {
        const yOffset = interpolate(
          (frame + i * 30) % 200,
          [0, 200],
          [height, -100]
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
              background: color,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

/** Animated text reveal */
function TextReveal({
  text,
  startFrame = 0,
  style,
}: {
  text: string;
  startFrame?: number;
  style?: React.CSSProperties;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <div style={style}>
      {words.map((word, i) => {
        const wordProgress = spring({
          frame: frame - startFrame - i * 5,
          fps,
          from: 0,
          to: 1,
          durationInFrames: 15,
        });

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: wordProgress,
              transform: `translateY(${(1 - wordProgress) * 20}px)`,
              marginRight: 12,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
}

/** Pulsing CTA button */
function CTAButton({
  text,
  brandColor,
  accentColor,
}: {
  text: string;
  brandColor: string;
  accentColor: string;
}) {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame * 0.15) * 0.03;

  return (
    <div
      style={{
        padding: '24px 48px',
        background: 'white',
        borderRadius: 16,
        transform: `scale(${pulse})`,
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
        {text}
      </span>
    </div>
  );
}

// =============================================================================
// SOCIAL MEDIA VIDEO (9:16 Vertical)
// =============================================================================

/**
 * Social Media Video Composition
 *
 * Structure:
 * - 0-3s: Hook (attention grabber)
 * - 3-12s: Body (main content)
 * - 12-15s: CTA
 *
 * Best for: TikTok, Instagram Reels, YouTube Shorts
 */
export function SocialMediaVideo({
  hook,
  bodyPoints,
  cta,
  brandColor,
  accentColor,
  musicSrc,
}: SocialVideoProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene timing (at 30fps)
  const hookEnd = 90; // 3 seconds
  const bodyEnd = durationInFrames - 90; // Last 3 seconds for CTA

  return (
    <AbsoluteFill>
      {/* Background */}
      <GradientBackground color1={brandColor} color2={accentColor} />
      <Particles />

      {/* Optional Music */}
      {musicSrc && <Audio src={staticFile(musicSrc)} volume={0.3} />}

      {/* Hook Scene (0-3s) */}
      <Sequence from={0} durationInFrames={hookEnd}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 60,
          }}
        >
          <TextReveal
            text={hook}
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: 'white',
              textAlign: 'center',
              textShadow: '0 4px 30px rgba(0,0,0,0.3)',
              lineHeight: 1.1,
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Body Scene (3-12s) */}
      <Sequence from={hookEnd} durationInFrames={bodyEnd - hookEnd}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 60,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            {bodyPoints.map((point, i) => {
              const pointDelay = i * 60; // 2 seconds between points
              const localFrame = frame - hookEnd;
              const isVisible = localFrame >= pointDelay;
              const pointProgress = spring({
                frame: localFrame - pointDelay,
                fps,
                from: 0,
                to: 1,
                durationInFrames: 20,
              });

              return (
                <div
                  key={i}
                  style={{
                    opacity: isVisible ? pointProgress : 0,
                    transform: `translateY(${isVisible ? (1 - pointProgress) * 30 : 30}px)`,
                    marginBottom: 30,
                  }}
                >
                  <span
                    style={{
                      fontSize: 48,
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    {point}
                  </span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* CTA Scene (Last 3s) */}
      <Sequence from={bodyEnd}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {(() => {
            const ctaProgress = spring({
              frame: frame - bodyEnd,
              fps,
              from: 0,
              to: 1,
              durationInFrames: 20,
            });

            return (
              <div
                style={{
                  opacity: ctaProgress,
                  transform: `scale(${0.8 + ctaProgress * 0.2})`,
                }}
              >
                <CTAButton
                  text={cta}
                  brandColor={brandColor}
                  accentColor={accentColor}
                />
              </div>
            );
          })()}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}

// =============================================================================
// PRODUCT DEMO VIDEO (16:9 Landscape)
// =============================================================================

/**
 * Product Demo Composition
 *
 * Structure:
 * - Intro: Logo + tagline
 * - Features: One feature per section
 * - Outro: CTA
 *
 * Best for: Website embeds, YouTube, LinkedIn
 */
export function ProductDemoVideo({
  productName,
  tagline,
  features,
  cta,
  brandColor,
  accentColor,
}: ProductDemoProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Calculate timing
  const introFrames = 180; // 6 seconds
  const featureFrames = Math.floor(
    (durationInFrames - introFrames - 180) / features.length
  );
  const outroStart = durationInFrames - 180;

  return (
    <AbsoluteFill style={{ background: '#0a0a14' }}>
      {/* Animated Grid Background */}
      <AbsoluteFill style={{ overflow: 'hidden', opacity: 0.3 }}>
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
      </AbsoluteFill>

      {/* Intro */}
      <Sequence from={0} durationInFrames={introFrames}>
        <AbsoluteFill
          style={{ justifyContent: 'center', alignItems: 'center' }}
        >
          {(() => {
            const logoScale = spring({
              frame,
              fps,
              from: 0,
              to: 1,
              durationInFrames: 30,
            });
            const taglineOpacity = interpolate(frame, [45, 75], [0, 1], {
              extrapolateRight: 'clamp',
            });

            return (
              <div style={{ textAlign: 'center' }}>
                <h1
                  style={{
                    fontSize: 120,
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${brandColor}, white)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    transform: `scale(${logoScale})`,
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
            );
          })()}
        </AbsoluteFill>
      </Sequence>

      {/* Features */}
      {features.map((feature, index) => (
        <Sequence
          key={index}
          from={introFrames + index * featureFrames}
          durationInFrames={featureFrames}
        >
          <AbsoluteFill
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 100,
            }}
          >
            {(() => {
              const localFrame = frame - (introFrames + index * featureFrames);
              const entrance = spring({
                frame: localFrame,
                fps,
                from: 0,
                to: 1,
                durationInFrames: 30,
              });
              const isLeft = index % 2 === 0;

              return (
                <>
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
                      paddingLeft: isLeft ? 0 : 400,
                      paddingRight: isLeft ? 400 : 0,
                      opacity: entrance,
                    }}
                  >
                    <h2
                      style={{
                        fontSize: 72,
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
                </>
              );
            })()}
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* Outro */}
      <Sequence from={outroStart}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            background: `linear-gradient(135deg, ${brandColor}, ${accentColor})`,
          }}
        >
          {(() => {
            const entrance = spring({
              frame: frame - outroStart,
              fps,
              from: 0,
              to: 1,
              durationInFrames: 30,
            });

            return (
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
                    {cta}
                  </span>
                </div>
              </div>
            );
          })()}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}

// =============================================================================
// AD CREATIVE VIDEO (1:1 Square)
// =============================================================================

/**
 * Ad Creative Composition
 *
 * Structure (PAS Framework):
 * - Problem: Pain point identification
 * - Agitate: Amplify the problem
 * - Solution: Present your offer
 * - CTA: Clear action
 *
 * Best for: Facebook/Instagram feed ads, retargeting
 */
export function AdCreativeVideo({
  problem,
  solution,
  socialProof,
  cta,
  urgency,
  brandColor,
  accentColor,
}: AdCreativeProps) {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene timing
  const problemEnd = Math.floor(durationInFrames * 0.3);
  const solutionEnd = Math.floor(durationInFrames * 0.7);

  return (
    <AbsoluteFill>
      {/* Animated Background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(${45 + frame * 0.5}deg, #0a0a14, #1a1a2e)`,
        }}
      />

      {/* Problem Scene */}
      <Sequence from={0} durationInFrames={problemEnd}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 60,
          }}
        >
          <TextReveal
            text={problem}
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: 'white',
              textAlign: 'center',
            }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Solution Scene */}
      <Sequence from={problemEnd} durationInFrames={solutionEnd - problemEnd}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 60,
          }}
        >
          {(() => {
            const entrance = spring({
              frame: frame - problemEnd,
              fps,
              from: 0,
              to: 1,
              durationInFrames: 25,
            });

            return (
              <div
                style={{
                  padding: 50,
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 32,
                  border: `2px solid ${brandColor}40`,
                  opacity: entrance,
                  transform: `scale(${0.9 + entrance * 0.1})`,
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: 48,
                    fontWeight: 600,
                    color: 'white',
                    marginBottom: socialProof ? 30 : 0,
                  }}
                >
                  {solution}
                </p>
                {socialProof && (
                  <p
                    style={{
                      fontSize: 24,
                      color: brandColor,
                    }}
                  >
                    {socialProof}
                  </p>
                )}
              </div>
            );
          })()}
        </AbsoluteFill>
      </Sequence>

      {/* CTA Scene */}
      <Sequence from={solutionEnd}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            background: `linear-gradient(135deg, ${brandColor}, ${accentColor})`,
          }}
        >
          {(() => {
            const entrance = spring({
              frame: frame - solutionEnd,
              fps,
              from: 0,
              to: 1,
              durationInFrames: 20,
            });

            return (
              <div
                style={{
                  textAlign: 'center',
                  opacity: entrance,
                  transform: `scale(${0.9 + entrance * 0.1})`,
                }}
              >
                {urgency && (
                  <div
                    style={{
                      display: 'inline-block',
                      padding: '12px 24px',
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: 30,
                      marginBottom: 30,
                    }}
                  >
                    <span
                      style={{ color: 'white', fontSize: 24, fontWeight: 600 }}
                    >
                      {urgency}
                    </span>
                  </div>
                )}
                <CTAButton
                  text={cta}
                  brandColor={brandColor}
                  accentColor={accentColor}
                />
              </div>
            );
          })()}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  SocialMediaVideo,
  ProductDemoVideo,
  AdCreativeVideo,
};
