/**
 * 10x Marketing Team - Hero Section Template
 *
 * A conversion-optimized hero section with:
 * - Animated gradient background
 * - Clear value proposition
 * - Social proof indicators
 * - Primary and secondary CTAs
 *
 * Usage:
 * <Hero
 *   headline="Your Main Value Proposition"
 *   subheadline="Supporting text that expands on the benefit"
 *   primaryCta={{ text: "Get Started Free", href: "/signup" }}
 *   secondaryCta={{ text: "Watch Demo", href: "#demo" }}
 *   stats={[
 *     { value: "10K+", label: "Users" },
 *     { value: "50M+", label: "Videos Created" },
 *   ]}
 * />
 */

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

interface CTAButton {
  text: string;
  href: string;
  onClick?: () => void;
}

interface Stat {
  value: string;
  label: string;
}

interface HeroProps {
  /** Main headline - keep under 10 words */
  headline: string;
  /** Highlighted word(s) in headline to apply gradient */
  highlightedText?: string;
  /** Supporting subheadline - expands on the benefit */
  subheadline: string;
  /** Primary CTA button */
  primaryCta: CTAButton;
  /** Secondary CTA button (optional) */
  secondaryCta?: CTAButton;
  /** Stats to display (optional, max 3 recommended) */
  stats?: Stat[];
  /** Badge text above headline (optional) */
  badge?: string;
  /** Custom background element (optional) */
  backgroundElement?: ReactNode;
  /** Brand colors */
  brandColor?: string;
  accentColor?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function Hero({
  headline,
  highlightedText,
  subheadline,
  primaryCta,
  secondaryCta,
  stats,
  badge,
  backgroundElement,
  brandColor = '#0ea5e9',
  accentColor = '#d946ef',
}: HeroProps) {
  // Split headline to apply gradient to highlighted text
  const renderHeadline = () => {
    if (!highlightedText) {
      return headline;
    }

    const parts = headline.split(highlightedText);
    return (
      <>
        {parts[0]}
        <span
          className="bg-clip-text text-transparent bg-gradient-to-r animate-gradient"
          style={{
            backgroundImage: `linear-gradient(90deg, ${brandColor}, ${accentColor}, ${brandColor})`,
            backgroundSize: '200% auto',
          }}
        >
          {highlightedText}
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background Effects */}
      {backgroundElement || (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: brandColor }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: brandColor }}
            />
            <span className="text-sm text-gray-300">{badge}</span>
          </motion.div>
        )}

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          {renderHeadline()}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          {subheadline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {/* Primary CTA */}
          <a
            href={primaryCta.href}
            onClick={primaryCta.onClick}
            className="px-8 py-4 font-semibold rounded-xl text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            style={{
              background: `linear-gradient(135deg, ${brandColor}, ${accentColor})`,
            }}
          >
            {primaryCta.text}
          </a>

          {/* Secondary CTA */}
          {secondaryCta && (
            <a
              href={secondaryCta.href}
              onClick={secondaryCta.onClick}
              className="px-8 py-4 font-semibold rounded-xl text-white transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              {secondaryCta.text}
            </a>
          )}
        </motion.div>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid gap-8 mt-20 max-w-3xl mx-auto"
            style={{
              gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
            }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-4xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${brandColor}, ${accentColor})`,
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-3 bg-white/50 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
}

// =============================================================================
// VARIANTS - Pre-configured hero styles
// =============================================================================

export function HeroMinimal(props: Omit<HeroProps, 'stats' | 'badge'>) {
  return <Hero {...props} />;
}

export function HeroWithVideo(
  props: HeroProps & { videoSrc: string }
) {
  return (
    <Hero
      {...props}
      backgroundElement={
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          <source src={props.videoSrc} type="video/mp4" />
        </video>
      }
    />
  );
}

export function HeroSplit(
  props: HeroProps & { imageSrc: string; imageAlt: string }
) {
  return (
    <section className="min-h-screen flex items-center px-6 py-20">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div>
          <Hero {...props} />
        </div>
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <img
            src={props.imageSrc}
            alt={props.imageAlt}
            className="rounded-2xl shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
