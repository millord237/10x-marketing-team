'use client';

import { motion } from 'framer-motion';

const skills = [
  {
    category: 'Content Generation',
    items: [
      { name: 'Script Writing', level: 95 },
      { name: 'Hook Creation', level: 90 },
      { name: 'CTA Optimization', level: 88 },
      { name: 'Trend Analysis', level: 85 },
    ],
  },
  {
    category: 'Video Production',
    items: [
      { name: 'Motion Graphics', level: 92 },
      { name: 'Transitions', level: 94 },
      { name: 'Text Animations', level: 96 },
      { name: 'Color Grading', level: 87 },
    ],
  },
  {
    category: 'Platform Optimization',
    items: [
      { name: 'TikTok/Reels Format', level: 98 },
      { name: 'YouTube Shorts', level: 95 },
      { name: 'LinkedIn Video', level: 88 },
      { name: 'Meta Ads', level: 91 },
    ],
  },
  {
    category: 'AI Capabilities',
    items: [
      { name: 'Claude Integration', level: 99 },
      { name: 'Voice Synthesis', level: 86 },
      { name: 'Image Generation', level: 84 },
      { name: 'Auto-Captioning', level: 93 },
    ],
  },
];

export default function Skills() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-transparent via-primary-900/10 to-transparent" id="skills">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our
            <span className="text-gradient"> Core Skills</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Powered by advanced AI and years of marketing expertise, here's what we do best.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {skills.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="card"
            >
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
                {category.category}
              </h3>
              <div className="space-y-4">
                {category.items.map((skill, skillIndex) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-primary-400">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 + skillIndex * 0.1 }}
                        className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skill Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: '🎬', label: '100+ Templates' },
            { icon: '⚡', label: 'Real-time Render' },
            { icon: '🌍', label: '50+ Languages' },
            { icon: '📊', label: 'Analytics Built-in' },
          ].map((item, i) => (
            <div key={i} className="glass-dark rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-gray-300 font-medium">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
