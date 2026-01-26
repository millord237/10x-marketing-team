import React from 'react';
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { fade } from '@remotion/transitions/fade';
import { wipe } from '@remotion/transitions/wipe';
import { flip } from '@remotion/transitions/flip';

interface Scene {
  title: string;
  subtitle: string;
  backgroundColor: string;
}

interface TransitionShowcaseProps {
  scenes: Scene[];
  transitionType: 'slide' | 'fade' | 'wipe' | 'flip';
}

// Individual scene component
const SceneContent: React.FC<{ scene: Scene }> = ({ scene }) => {
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
            fontSize: 80,
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

// Get presentation based on transition type
const getPresentation = (type: TransitionShowcaseProps['transitionType']) => {
  switch (type) {
    case 'slide':
      return slide({ direction: 'from-right' });
    case 'fade':
      return fade();
    case 'wipe':
      return wipe({ direction: 'from-left' });
    case 'flip':
      return flip({ direction: 'from-left' });
    default:
      return slide({ direction: 'from-right' });
  }
};

export const TransitionShowcase: React.FC<TransitionShowcaseProps> = ({
  scenes,
  transitionType,
}) => {
  const presentation = getPresentation(transitionType);
  const sceneDuration = 80; // frames per scene
  const transitionDuration = 20; // frames per transition

  return (
    <TransitionSeries>
      {scenes.map((scene, index) => (
        <React.Fragment key={index}>
          <TransitionSeries.Sequence durationInFrames={sceneDuration}>
            <SceneContent scene={scene} />
          </TransitionSeries.Sequence>
          {index < scenes.length - 1 && (
            <TransitionSeries.Transition
              presentation={presentation}
              timing={linearTiming({ durationInFrames: transitionDuration })}
            />
          )}
        </React.Fragment>
      ))}
    </TransitionSeries>
  );
};
