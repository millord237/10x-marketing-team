'use client';

import { useRef, useState } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import CompositionPropsEditor from './CompositionPropsEditor';
import VideoFeedbackOverlay from './VideoFeedbackOverlay';

interface CompositionConfig {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  defaultProps: Record<string, any>;
  width: number;
  height: number;
  durationInFrames: number;
  fps: number;
}

interface VideoPlayerPanelProps {
  composition: CompositionConfig;
  onClose: () => void;
}

export default function VideoPlayerPanel({ composition, onClose }: VideoPlayerPanelProps) {
  const playerRef = useRef<PlayerRef>(null);
  const [props, setProps] = useState<Record<string, any>>(composition.defaultProps);
  const [showEditor, setShowEditor] = useState(false);

  const maxWidth = 800;
  const scale = Math.min(maxWidth / composition.width, 500 / composition.height);
  const playerWidth = Math.round(composition.width * scale);
  const playerHeight = Math.round(composition.height * scale);

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <h2 className="text-white font-bold text-lg">{composition.title}</h2>
          <p className="text-gray-400 text-xs mt-0.5">
            {composition.width}x{composition.height} &middot; {composition.durationInFrames} frames &middot; {composition.fps}fps &middot; {(composition.durationInFrames / composition.fps).toFixed(1)}s
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEditor(!showEditor)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showEditor ? 'bg-primary-500 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {showEditor ? 'Hide Props' : 'Edit Props'}
          </button>
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-gray-300 hover:bg-white/20 transition-all"
          >
            Open in Studio
          </a>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Player area */}
        <div className="flex-1 p-6 space-y-4">
          <div className="relative flex items-center justify-center bg-black/40 rounded-xl overflow-hidden" style={{ minHeight: playerHeight }}>
            <Player
              ref={playerRef}
              component={composition.component}
              inputProps={props}
              durationInFrames={composition.durationInFrames}
              compositionWidth={composition.width}
              compositionHeight={composition.height}
              fps={composition.fps}
              style={{ width: playerWidth, height: playerHeight }}
              controls
              loop
              autoPlay={false}
            />

            {/* Feedback click overlay is positioned here by VideoFeedbackOverlay */}
          </div>

          {/* Feedback controls */}
          <VideoFeedbackOverlay
            playerRef={playerRef}
            compositionId={composition.id}
            fps={composition.fps}
            durationInFrames={composition.durationInFrames}
          />
        </div>

        {/* Props editor sidebar */}
        {showEditor && (
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 p-6 max-h-[600px] overflow-y-auto">
            <CompositionPropsEditor
              compositionId={composition.id}
              props={props}
              onChange={setProps}
            />
          </div>
        )}
      </div>
    </div>
  );
}
