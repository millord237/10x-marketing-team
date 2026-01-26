'use client';

import { motion } from 'framer-motion';

export default function CTA() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl p-12 overflow-hidden"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600" />

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to 10x Your Marketing?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Join hundreds of marketing teams already creating stunning videos with AI.
              Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
                Schedule Demo
              </button>
            </div>
            <p className="text-white/60 mt-6 text-sm">
              No credit card required. 14-day free trial.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
