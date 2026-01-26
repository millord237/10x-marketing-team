import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import VideoShowcase from '@/components/landing/VideoShowcase';
import Skills from '@/components/landing/Skills';
import Pricing from '@/components/landing/Pricing';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <Hero />
        <Features />
        <VideoShowcase />
        <Skills />
        <Pricing />
        <CTA />
        <Footer />
      </div>

      {/* Agentation is now integrated at the root level via AgentationProvider */}
      {/* Access it via the bottom-right corner icon in development mode */}
    </main>
  );
}
