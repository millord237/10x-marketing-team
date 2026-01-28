import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from 'remotion';
import { Rect, Circle, Triangle, Star, Polygon } from '@remotion/shapes';

import type { ShapesDemoProps } from '../schemas';

type ShapeType = 'rect' | 'circle' | 'triangle' | 'star' | 'polygon';

// Colors for different shapes
const shapeColors = [
  '#0ea5e9', // sky blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
];

// Render a shape based on type
const RenderShape: React.FC<{
  type: ShapeType;
  index: number;
  frame: number;
  fps: number;
  brandColor: string;
  shapeSize: number;
}> = ({ type, index, frame, fps, brandColor, shapeSize }) => {
  const delay = index * 10;
  const adjustedFrame = Math.max(0, frame - delay);

  const scale = spring({
    frame: adjustedFrame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 10, stiffness: 100 },
  });

  const rotation = interpolate(frame, [0, 300], [0, 360]);
  const color = shapeColors[index % shapeColors.length];

  const commonStyle: React.CSSProperties = {
    transform: `scale(${scale}) rotate(${rotation * (index % 2 === 0 ? 1 : -1)}deg)`,
    filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
  };

  switch (type) {
    case 'rect':
      return (
        <div style={commonStyle}>
          <Rect
            width={shapeSize}
            height={shapeSize}
            fill={color}
            cornerRadius={16}
          />
        </div>
      );
    case 'circle':
      return (
        <div style={commonStyle}>
          <Circle
            radius={shapeSize / 2}
            fill={color}
          />
        </div>
      );
    case 'triangle':
      return (
        <div style={commonStyle}>
          <Triangle
            length={shapeSize}
            fill={color}
            direction="up"
            cornerRadius={8}
          />
        </div>
      );
    case 'star':
      return (
        <div style={commonStyle}>
          <Star
            points={5}
            outerRadius={shapeSize / 2}
            innerRadius={shapeSize / 4}
            fill={color}
            cornerRadius={4}
          />
        </div>
      );
    case 'polygon':
      return (
        <div style={commonStyle}>
          <Polygon
            points={6}
            radius={shapeSize / 2}
            fill={color}
            cornerRadius={8}
          />
        </div>
      );
    default:
      return null;
  }
};

export const ShapesDemo: React.FC<ShapesDemoProps> = ({
  title,
  shapes,
  brandColor,
  titleFontSize,
  shapeSize,
  shapeGap,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleOpacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 20 },
  });

  const titleY = spring({
    frame,
    fps,
    from: -50,
    to: 0,
    config: { damping: 15, stiffness: 100 },
  });

  // Background gradient animation
  const gradientRotation = interpolate(frame, [0, 300], [0, 180]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${gradientRotation}deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`,
      }}
    >
      {/* Animated background grid */}
      <AbsoluteFill style={{ opacity: 0.1 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </AbsoluteFill>

      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <h1
          style={{
            fontSize: titleFontSize,
            fontWeight: 800,
            color: 'white',
            margin: 0,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.6)',
            marginTop: 16,
          }}
        >
          @remotion/shapes showcase
        </p>
      </div>

      {/* Shapes grid */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -30%)',
          display: 'flex',
          gap: shapeGap,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {shapes.map((shape, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <RenderShape
              type={shape}
              index={index}
              frame={frame}
              fps={fps}
              brandColor={brandColor}
              shapeSize={shapeSize}
            />
            <span
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 16,
                textTransform: 'capitalize',
                opacity: spring({
                  frame: Math.max(0, frame - index * 10 - 20),
                  fps,
                  from: 0,
                  to: 1,
                }),
              }}
            >
              {shape}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.4)',
            opacity: interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          Edit props in Remotion Studio to customize
        </p>
      </div>
    </AbsoluteFill>
  );
};
