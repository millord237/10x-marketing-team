'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports to avoid SSR issues with Remotion
const VideoCard = dynamic(() => import('@/components/dashboard/VideoCard'), { ssr: false });
const VideoPlayerPanel = dynamic(() => import('@/components/dashboard/VideoPlayerPanel'), { ssr: false });

// Import composition components
import { SocialMediaVideo } from '@/remotion/compositions/SocialMediaVideo';
import { ProductDemo } from '@/remotion/compositions/ProductDemo';
import { AdCreative } from '@/remotion/compositions/AdCreative';
import { TransitionShowcase } from '@/remotion/compositions/TransitionShowcase';
import { ShapesDemo } from '@/remotion/compositions/ShapesDemo';

// Composition registry — mirrors Root.tsx
const compositions = [
  {
    id: 'SocialMediaVideo',
    title: 'Social Media Video',
    component: SocialMediaVideo,
    width: 1080,
    height: 1920,
    durationInFrames: 450,
    fps: 30,
    defaultProps: {
      headline: 'This Product Changed Everything',
      subheadline: "Here's what happened...",
      cta: 'Link in bio',
      brandColor: '#0ea5e9',
      accentColor: '#d946ef',
    },
  },
  {
    id: 'ProductDemo',
    title: 'Product Demo',
    component: ProductDemo,
    width: 1920,
    height: 1080,
    durationInFrames: 1800,
    fps: 30,
    defaultProps: {
      productName: '10x Marketing',
      tagline: 'Create Videos 10x Faster',
      features: [
        { title: 'AI-Powered', description: 'Claude writes your scripts' },
        { title: 'Templates', description: '100+ ready-to-use designs' },
        { title: 'Export', description: '4K quality in any format' },
      ],
      brandColor: '#0ea5e9',
    },
  },
  {
    id: 'AdCreative',
    title: 'Ad Creative',
    component: AdCreative,
    width: 1080,
    height: 1080,
    durationInFrames: 900,
    fps: 30,
    defaultProps: {
      headline: 'Stop Wasting Time on Video Editing',
      benefit: 'Create professional videos in minutes',
      cta: 'Start Free Trial',
      urgency: 'Limited time offer',
      brandColor: '#0ea5e9',
      accentColor: '#d946ef',
    },
  },
  {
    id: 'TransitionShowcase',
    title: 'Transition Showcase',
    component: TransitionShowcase,
    width: 1920,
    height: 1080,
    durationInFrames: 300,
    fps: 30,
    defaultProps: {
      scenes: [
        { title: 'Scene 1', subtitle: 'Introduction', backgroundColor: '#0ea5e9' },
        { title: 'Scene 2', subtitle: 'Features', backgroundColor: '#8b5cf6' },
        { title: 'Scene 3', subtitle: 'Call to Action', backgroundColor: '#ec4899' },
      ],
      transitionType: 'slide' as const,
    },
  },
  {
    id: 'ShapesDemo',
    title: 'Shapes Demo',
    component: ShapesDemo,
    width: 1920,
    height: 1080,
    durationInFrames: 300,
    fps: 30,
    defaultProps: {
      title: 'Animated Shapes',
      shapes: ['rect', 'circle', 'triangle', 'star', 'polygon'] as const,
      brandColor: '#0ea5e9',
    },
  },
];

export default function DashboardPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = compositions.find(c => c.id === selectedId);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Video <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Preview, edit props, and annotate all Remotion compositions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary !px-4 !py-2 text-sm"
            >
              Remotion Studio
            </a>
            <span className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
              {compositions.length} compositions
            </span>
          </div>
        </div>

        {/* Selected player */}
        {selected && (
          <div className="mb-8">
            <VideoPlayerPanel
              composition={selected}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}

        {/* Grid of cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {compositions.map(comp => (
            <VideoCard
              key={comp.id}
              {...comp}
              isSelected={comp.id === selectedId}
              onSelect={() => setSelectedId(comp.id === selectedId ? null : comp.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
