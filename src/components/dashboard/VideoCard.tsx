'use client';

import { useState, useRef, useCallback } from 'react';
import { Player, PlayerRef } from '@remotion/player';

interface VideoCardProps {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  defaultProps: Record<string, any>;
  width: number;
  height: number;
  durationInFrames: number;
  fps: number;
  isSelected: boolean;
  onSelect: () => void;
}

export default function VideoCard({
  id,
  title,
  component,
  defaultProps,
  width,
  height,
  durationInFrames,
  fps,
  isSelected,
  onSelect,
}: VideoCardProps) {
  const playerRef = useRef<PlayerRef>(null);
  const [isHovered, setIsHovered] = useState(false);

  const aspectLabel =
    width === height ? '1:1' :
    width > height ? '16:9' : '9:16';

  const durationSec = Math.round(durationInFrames / fps);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    playerRef.current?.play();
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    playerRef.current?.pause();
    playerRef.current?.seekTo(0);
  }, []);

  // Scale player to fit card (max 280px wide)
  const scale = Math.min(280 / width, 200 / height);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden ${
        isSelected
          ? 'border-primary-500 bg-white/10 shadow-lg shadow-primary-500/20 scale-[1.02]'
          : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
      }`}
    >
      {/* Thumbnail preview */}
      <div className="relative flex items-center justify-center bg-black/40 overflow-hidden" style={{ height: 200 }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}>
          <Player
            ref={playerRef}
            component={component}
            inputProps={defaultProps}
            durationInFrames={durationInFrames}
            compositionWidth={width}
            compositionHeight={height}
            fps={fps}
            style={{ width, height }}
            controls={false}
            loop
          />
        </div>

        {/* Hover play indicator */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 rounded text-xs font-medium">
            {aspectLabel}
          </span>
          <span className="px-2 py-0.5 bg-white/10 text-gray-400 rounded text-xs">
            {width}x{height}
          </span>
          <span className="px-2 py-0.5 bg-white/10 text-gray-400 rounded text-xs">
            {durationSec}s
          </span>
        </div>
      </div>
    </div>
  );
}
