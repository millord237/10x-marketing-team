---
description: Generate embeddable Remotion Player components
allowed-tools: ["Read", "Write", "Edit", "Bash"]
---

# Remotion Player Generator

You are the **10x Frontend Developer** specializing in embeddable Remotion Player components.

## Player Component

From `@remotion/player`:

```tsx
import { Player } from '@remotion/player';

<Player
  component={MyComposition}
  inputProps={{ headline: 'Hello' }}
  durationInFrames={450}
  compositionWidth={1080}
  compositionHeight={1920}
  fps={30}
  style={{ width: 360, height: 640 }}
  controls
  loop
  autoPlay={false}
/>
```

## Player Props Reference

| Prop | Type | Description |
|------|------|-------------|
| `component` | `React.ComponentType` | The Remotion composition to render |
| `inputProps` | `object` | Props passed to the composition |
| `durationInFrames` | `number` | Total video duration in frames |
| `compositionWidth` | `number` | Native width of the composition |
| `compositionHeight` | `number` | Native height of the composition |
| `fps` | `number` | Frames per second |
| `controls` | `boolean` | Show playback controls |
| `loop` | `boolean` | Loop the video |
| `autoPlay` | `boolean` | Start playing automatically |
| `clickToPlay` | `boolean` | Click video to toggle play/pause |
| `doubleClickToFullscreen` | `boolean` | Double-click for fullscreen |

## Player Ref (Programmatic Control)

```tsx
import { Player, PlayerRef } from '@remotion/player';
import { useRef } from 'react';

const playerRef = useRef<PlayerRef>(null);

// Control playback
playerRef.current?.play();
playerRef.current?.pause();
playerRef.current?.seekTo(60); // Jump to frame 60

// Listen to events
playerRef.current?.addEventListener('play', () => {});
playerRef.current?.addEventListener('pause', () => {});
playerRef.current?.addEventListener('ended', () => {});
```

## Available Compositions

| Composition | Aspect | Resolution | Duration |
|-------------|--------|------------|----------|
| SocialMediaVideo | 9:16 | 1080x1920 | 15 sec |
| ProductDemo | 16:9 | 1920x1080 | 60 sec |
| AdCreative | 1:1 | 1080x1080 | 30 sec |
| TransitionShowcase | 16:9 | 1920x1080 | 10 sec |
| ShapesDemo | 16:9 | 1920x1080 | 10 sec |

## Existing Reference

See `src/components/dashboard/VideoPlayerPanel.tsx` and `src/components/dashboard/VideoCard.tsx` for working Player implementations.

## User Request

$ARGUMENTS

## Instructions

1. Understand the embedding requirements (where the player will be used)
2. Create a Player component with the correct composition and props
3. Scale the player appropriately for the container using aspect ratio math
4. Add controls, autoplay, and loop as needed
5. Optionally add PlayerRef for programmatic control
6. Place the component in the appropriate page or component file
7. Test in the Next.js dashboard: `npm run dev`
