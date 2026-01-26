'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Agentation to avoid SSR issues
const Agentation = dynamic(
  () => import('agentation').then((mod) => mod.Agentation),
  { ssr: false }
);

interface AgentationProviderProps {
  children: React.ReactNode;
}

// Get agentation mode from environment or default to 'development'
const getAgentationMode = (): 'development' | 'always' | 'manual' | 'off' => {
  if (typeof window === 'undefined') return 'development';

  const envMode = process.env.NEXT_PUBLIC_AGENTATION_MODE;
  if (envMode === 'always' || envMode === 'manual' || envMode === 'off') {
    return envMode;
  }
  return 'development';
};

export function AgentationProvider({ children }: AgentationProviderProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [mode] = useState(getAgentationMode);

  useEffect(() => {
    // Determine if Agentation should be enabled
    if (mode === 'off') {
      setIsEnabled(false);
    } else if (mode === 'always') {
      setIsEnabled(true);
    } else if (mode === 'development') {
      setIsEnabled(process.env.NODE_ENV === 'development');
    } else if (mode === 'manual') {
      // Manual mode starts disabled, user toggles via keyboard shortcut
      setIsEnabled(false);
    }
  }, [mode]);

  // Listen for keyboard shortcut to toggle in manual mode
  useEffect(() => {
    if (mode !== 'manual') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + A to toggle Agentation
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'a') {
        e.preventDefault();
        setIsEnabled(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  return (
    <>
      {children}
      {/* Official Agentation component */}
      {isEnabled && <Agentation />}

      {/* Manual mode indicator */}
      {mode === 'manual' && !isEnabled && (
        <div
          className="fixed bottom-4 right-4 z-50 px-3 py-2 bg-slate-800/80 text-slate-400 text-xs rounded-lg backdrop-blur-sm"
          title="Press Cmd/Ctrl + Shift + A to toggle Agentation"
        >
          Press ⌘⇧A to annotate
        </div>
      )}
    </>
  );
}
