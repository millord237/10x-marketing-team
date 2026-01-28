import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';
import { flip } from '@remotion/transitions/flip';

import type { TransitionShowcaseProps } from '../schemas';

interface Scene {
  title: string;
  subtitle: string;
  backgroundColor: string;
}

// Individual scene component
const SceneContent: React.FC<{ scene: Scene; titleFontSize: number }> = ({ scene, titleFontSize }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    from: 0.8,
    to: 1,
    config: { damping: 12, stiffness: 100 },
  });

  const titleOpacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 15 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: scene.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: titleFontSize,
            fontWeight: 800,
            color: 'white',
            margin: 0,
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          {scene.title}
        </h1>
        <p
          style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.8)',
            marginTop: 20,
          }}
        >
          {scene.subtitle}
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const TransitionShowcase: React.FC<TransitionShowcaseProps> = ({
  scenes,
  transitionType,
  sceneDurationFrames,
  transitionDurationFrames,
  titleFontSize,
}) => {
  const sceneDuration = sceneDurationFrames;
  const transitionDuration = transitionDurationFrames;

  // Build presentation inline to preserve correct generic types
  const renderTransition = () => {
    switch (transitionType) {
      case 'fade':
        return (
          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({ durationInFrames: transitionDuration })}
          />
        );
      case 'wipe':
        return (
          <TransitionSeries.Transition
            presentation={wipe({ direction: 'from-left' })}
            timing={linearTiming({ durationInFrames: transitionDuration })}
          />
        );
      case 'flip':
        return (
          <TransitionSeries.Transition
            presentation={flip({ direction: 'from-left' })}
            timing={linearTiming({ durationInFrames: transitionDuration })}
          />
        );
      case 'slide':
      default:
        return (
          <TransitionSeries.Transition
            presentation={slide({ direction: 'from-right' })}
            timing={linearTiming({ durationInFrames: transitionDuration })}
          />
        );
    }
  };

  return (
    <TransitionSeries>
      {scenes.map((scene, index) => (
        <React.Fragment key={index}>
          <TransitionSeries.Sequence durationInFrames={sceneDuration}>
            <SceneContent scene={scene} titleFontSize={titleFontSize} />
          </TransitionSeries.Sequence>
          {index < scenes.length - 1 && renderTransition()}
        </React.Fragment>
      ))}
    </TransitionSeries>
  );
};
