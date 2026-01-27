'use client';

import { useState, useCallback } from 'react';
import type { PlayerRef } from '@remotion/player';

interface FrameAnnotation {
  id: string;
  frame: number;
  comment: string;
  timestamp: Date;
  position?: { x: number; y: number }; // relative % position on video
}

interface VideoFeedbackOverlayProps {
  playerRef: React.RefObject<PlayerRef | null>;
  compositionId: string;
  fps: number;
  durationInFrames: number;
}

export default function VideoFeedbackOverlay({
  playerRef,
  compositionId,
  fps,
  durationInFrames,
}: VideoFeedbackOverlayProps) {
  const [annotations, setAnnotations] = useState<FrameAnnotation[]>([]);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  const refreshFrame = useCallback(() => {
    const frame = playerRef.current?.getCurrentFrame() ?? 0;
    setCurrentFrame(frame);
    return frame;
  }, [playerRef]);

  const handleVideoClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnnotating) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const frame = refreshFrame();
    const comment = prompt(`Feedback at frame ${frame} (${(frame / fps).toFixed(1)}s):`);
    if (!comment) return;

    setAnnotations(prev => [...prev, {
      id: `vfb-${Date.now()}`,
      frame,
      comment,
      timestamp: new Date(),
      position: { x, y },
    }]);
  }, [isAnnotating, refreshFrame, fps]);

  const removeAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
  };

  const exportFeedback = () => {
    const prompt = annotations.map((a, i) =>
      `${i + 1}. At frame ${a.frame} (${(a.frame / fps).toFixed(1)}s): ${a.comment}`
    ).join('\n');

    const fullPrompt = `# Video Composition Feedback — ${compositionId}

## Composition: ${compositionId}
## Duration: ${durationInFrames} frames (${(durationInFrames / fps).toFixed(1)}s) @ ${fps}fps

## Requested Changes
${prompt}

## Instructions
Modify the \`${compositionId}\` Remotion composition in \`src/remotion/compositions/${compositionId}.tsx\` to apply the above changes. Each change references a specific frame number — use \`useCurrentFrame()\` and conditionals or \`interpolate()\` to target those frames.`;

    navigator.clipboard.writeText(fullPrompt);

    const blob = new Blob([fullPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${compositionId}-feedback-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    alert('Feedback copied to clipboard and downloaded.');
  };

  return (
    <div className="space-y-3">
      {/* Controls bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => { setIsAnnotating(!isAnnotating); refreshFrame(); }}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            isAnnotating
              ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30'
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          {isAnnotating ? 'Annotating...' : 'Annotate Video'}
        </button>

        {annotations.length > 0 && (
          <>
            <span className="text-xs text-gray-400">
              {annotations.length} annotation{annotations.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={exportFeedback}
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Export as Claude Code Prompt
            </button>
            <button
              onClick={() => setAnnotations([])}
              className="px-3 py-2 bg-red-500/20 text-red-400 rounded-xl text-xs hover:bg-red-500/30 transition-colors"
            >
              Clear
            </button>
          </>
        )}

        {isAnnotating && (
          <span className="text-xs text-accent-400">
            Frame: {currentFrame} ({(currentFrame / fps).toFixed(1)}s) — Click on the video to annotate
          </span>
        )}
      </div>

      {/* Click overlay — rendered inside VideoPlayerPanel over the player */}
      {isAnnotating && (
        <div
          className="absolute inset-0 z-10 cursor-crosshair"
          onClick={handleVideoClick}
          onMouseMove={refreshFrame}
        >
          {/* Annotation markers on video */}
          {annotations.map((ann, i) => ann.position && (
            <div
              key={ann.id}
              className="absolute w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold pointer-events-none shadow-md -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${ann.position.x}%`, top: `${ann.position.y}%` }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      )}

      {/* Annotation list */}
      {annotations.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {annotations.map((ann, i) => (
            <div key={ann.id} className="flex items-start gap-2 p-2 bg-white/5 rounded-lg">
              <span className="w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm">{ann.comment}</p>
                <p className="text-gray-500 text-xs">
                  Frame {ann.frame} ({(ann.frame / fps).toFixed(1)}s)
                </p>
              </div>
              <button
                onClick={() => removeAnnotation(ann.id)}
                className="text-gray-500 hover:text-red-400 text-xs flex-shrink-0"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
