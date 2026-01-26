import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AgentationProvider } from '@/components/providers/AgentationProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '10x Marketing Team | AI-Powered Video Creation',
  description: 'Create stunning marketing videos at 10x speed with AI-powered automation. Social media, product demos, and ad creatives in minutes.',
  keywords: ['marketing', 'video', 'AI', 'automation', 'remotion', 'content creation'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AgentationProvider>
          {children}
        </AgentationProvider>
      </body>
    </html>
  );
}
