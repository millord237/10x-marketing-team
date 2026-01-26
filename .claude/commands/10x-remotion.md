---
description: Remotion API reference and composition helpers
allowed-tools: ["Read", "Write", "Edit", "Bash"]
---

# Remotion API Reference

Quick reference for building Remotion compositions.

## Launch Studio

```bash
npm run remotion:studio
```

Opens interactive Studio at http://localhost:3333 with:
- Timeline scrubbing
- Props editor (edit composition props live)
- Render queue
- Composition browser

## Core Components

```tsx
import {
  Composition,     // Register video compositions
  Sequence,        // Time-shift content
  AbsoluteFill,    // Layer content
  Series,          // Sequential scenes
  Loop,            // Repeat animations
  Folder,          // Organize compositions
  Still,           // Static images
  Img,             // Images with loading
  Video,           // Video playback
  Audio,           // Audio playback
} from 'remotion';
```

## Hooks

```tsx
import { useCurrentFrame, useVideoConfig } from 'remotion';

const frame = useCurrentFrame();
const { width, height, fps, durationInFrames } = useVideoConfig();
```

## Animation

```tsx
import { interpolate, spring, Easing } from 'remotion';

// Linear interpolation
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: 'clamp'
});

// Spring animation
const scale = spring({
  frame,
  fps,
  from: 0,
  to: 1,
  config: { mass: 1, damping: 10, stiffness: 100 }
});
```

## Transitions (@remotion/transitions)

```tsx
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { slide, fade, wipe, flip } from '@remotion/transitions';

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>
    <Scene1 />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    timing={linearTiming({ durationInFrames: 30 })}
    presentation={slide({ direction: 'from-right' })}
  />
  <TransitionSeries.Sequence durationInFrames={60}>
    <Scene2 />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

## Shapes (@remotion/shapes)

```tsx
import { Rect, Circle, Triangle, Star, Polygon } from '@remotion/shapes';

<Rect width={200} height={100} fill="red" cornerRadius={10} />
<Circle radius={100} fill="green" />
<Triangle length={150} fill="blue" direction="up" />
<Star points={5} outerRadius={100} innerRadius={50} fill="gold" />
```

## User Request

$ARGUMENTS

## Instructions

When asked about Remotion:
1. Provide code examples using the API above
2. Reference existing compositions in `src/remotion/compositions/`
3. Suggest testing in Studio with `npm run remotion:studio`
4. Follow the patterns established in the codebase
