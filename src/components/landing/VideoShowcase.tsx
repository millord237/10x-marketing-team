'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const videoTypes = [
  {
    id: 'social',
    label: 'Social Media',
    preview: {
      title: 'Trending Product Launch',
      format: '9:16 Vertical',
      duration: '15 sec',
    },
  },
  {
    id: 'demo',
    label: 'Product Demo',
    preview: {
      title: 'SaaS Feature Walkthrough',
      format: '16:9 Landscape',
      duration: '60 sec',
    },
  },
  {
    id: 'ad',
    label: 'Ad Creative',
    preview: {
      title: 'Conversion-Focused Ad',
      format: '1:1 Square',
      duration: '30 sec',
    },
  },
];

export default function VideoShowcase() {
  const [activeType, setActiveType] = useState('social');
  const activeVideo = videoTypes.find(v => v.id === activeType);

  return (
    <section className="py-20 px-6" id="showcase">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            See It In
            <span className="text-gradient"> Action</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Watch how our AI creates professional marketing videos in real-time.
          </p>
        </motion.div>

        {/* Video Type Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {videoTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeType === type.id
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white'
                  : 'glass text-gray-300 hover:text-white'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Video Preview */}
        <motion.div
          key={activeType}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="glass-dark rounded-2xl p-8 aspect-video flex items-center justify-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10" />

            {/* Video Placeholder */}
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors animate-pulse-glow">
                <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                {activeVideo?.preview.title}
              </h3>
              <div className="flex items-center justify-center gap-4 text-gray-400">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                  </svg>
                  {activeVideo?.preview.format}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {activeVideo?.preview.duration}
                </span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
