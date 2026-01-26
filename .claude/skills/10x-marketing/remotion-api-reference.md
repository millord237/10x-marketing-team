# Remotion Official API Reference

> Complete API documentation for programmatic video creation with React.
> Version: 4.0+ | Source: remotion.dev/docs

## Overview

Remotion treats videos as **functions of images over time**. By providing a frame number and canvas, you render anything using React, creating animation through frame-by-frame content changes.

```
A video is a function of images over time.
If you change content every frame, you'll end up with an animation.
```

---

## Core Concepts

### Video Properties (Required)
Every Remotion video requires these four properties:

| Property | Type | Description |
|----------|------|-------------|
| `width` | number | Canvas width in pixels |
| `height` | number | Canvas height in pixels |
| `durationInFrames` | number | Total frame count |
| `fps` | number | Frames per second |

**Note:** Frames are 0-indexed. First frame = 0, last frame = `durationInFrames - 1`

---

## Components

### `<Composition>`
Registers a video for rendering and display in Remotion Studio.

```tsx
import { Composition } from 'remotion';

<Composition
  id="MyVideo"
  component={MyComponent}
  durationInFrames={150}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{ title: "Hello World" }}
  schema={z.object({ title: z.string() })}
/>
```

**Required Props:**
| Prop | Type | Description |
|------|------|-------------|
| `id` | string | Unique identifier (letters, numbers, hyphens only) |
| `fps` | number | Frame rate |
| `durationInFrames` | number | Total frames |
| `width` | number | Width in pixels |
| `height` | number | Height in pixels |
| `component` or `lazyComponent` | React.FC | The video component |

**Optional Props:**
| Prop | Type | Description |
|------|------|-------------|
| `defaultProps` | object | Initial props (JSON-serializable) |
| `schema` | ZodSchema | Zod schema for validation |
| `calculateMetadata` | function | Dynamic metadata calculation |

---

### `<Sequence>`
Time-shifts display of components within your video.

```tsx
import { Sequence } from 'remotion';

<Sequence from={30} durationInFrames={60} name="Intro">
  <MyComponent />
</Sequence>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `from` | number | 0 | Start frame |
| `durationInFrames` | number | Infinity | Duration in frames |
| `layout` | "absolute-fill" \| "none" | "absolute-fill" | Positioning mode |
| `name` | string | - | Label in timeline |
| `style` | CSSProperties | - | Container styles |
| `className` | string | - | CSS class |
| `premountFor` | number | - | Pre-render frames |
| `postmountFor` | number | - | Continue rendering after end |
| `showInTimeline` | boolean | true | Timeline visibility |

**Key Behaviors:**
- Children calling `useCurrentFrame()` get frame values shifted by `from` prop
- Sequences can be nested; offsets cascade
- Default wrapping with `<AbsoluteFill>` (disable via `layout="none"`)

---

### `<AbsoluteFill>`
Helper component for layering content (absolutely positioned div).

```tsx
import { AbsoluteFill } from 'remotion';

<AbsoluteFill style={{ backgroundColor: 'blue' }}>
  <h1>Content</h1>
</AbsoluteFill>
```

**Built-in Styles:**
```css
position: absolute;
top: 0; left: 0; right: 0; bottom: 0;
width: 100%; height: 100%;
display: flex;
flex-direction: column;
```

**Note:** Layers rendered last appear on top (HTML stacking order).

---

### `<Series>`
Sequences scenes to play one after another.

```tsx
import { Series } from 'remotion';

<Series>
  <Series.Sequence durationInFrames={60}>
    <Scene1 />
  </Series.Sequence>
  <Series.Sequence durationInFrames={90} offset={-15}>
    <Scene2 />
  </Series.Sequence>
  <Series.Sequence durationInFrames={Infinity}>
    <Scene3 />
  </Series.Sequence>
</Series>
```

**Props (Series.Sequence):**
| Prop | Type | Description |
|------|------|-------------|
| `durationInFrames` | number | Display length (only last can be `Infinity`) |
| `offset` | number | Positive = delay, negative = overlap |
| `layout` | "absolute-fill" \| "none" | Positioning mode |
| `premountFor` | number | Pre-mount frames |

---

### `<Loop>`
Enables rapid animation repetition.

```tsx
import { Loop } from 'remotion';

<Loop durationInFrames={30} times={5}>
  <PulseAnimation />
</Loop>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `durationInFrames` | number | required | Frames per loop |
| `times` | number | Infinity | Number of repetitions |
| `layout` | "absolute-fill" \| "none" | "absolute-fill" | Positioning |

**Hook:** `Loop.useLoop()` returns `{ durationInFrames, iteration }` or `null`

---

### `<Folder>`
Organizes compositions visually in Studio sidebar.

```tsx
import { Folder, Composition } from 'remotion';

<Folder name="Marketing">
  <Composition id="Ad1" ... />
  <Composition id="Ad2" ... />
</Folder>
```

**Note:** Purely visual organization, no impact on rendering.

---

### `<Still>`
Simplified composition for rendering static images.

```tsx
import { Still } from 'remotion';

<Still
  id="Thumbnail"
  component={ThumbnailComponent}
  width={1280}
  height={720}
/>
```

**Note:** No `durationInFrames` or `fps` needed (single frame).

---

### `<Img>`
Enhanced image component ensuring load before render.

```tsx
import { Img, staticFile } from 'remotion';

<Img src={staticFile('logo.png')} style={{ width: 200 }} />
<Img src="https://example.com/image.jpg" />
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `src` | string | Image source (staticFile or URL) |
| `onError` | function | Error handler |
| `maxRetries` | number | Retry attempts (default: 2) |
| `pauseWhenLoading` | boolean | Pause Player during load |

---

### `<Video>` / `<Html5Video>`
Syncs video playback with Remotion timeline.

```tsx
import { Video, staticFile } from 'remotion';

<Video
  src={staticFile('background.mp4')}
  volume={0.5}
  playbackRate={1}
  trimBefore={30}
/>
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `src` | string | Video source |
| `volume` | number \| function | Volume (0-1) or per-frame callback |
| `playbackRate` | number | Speed (1 = normal, 2 = 2x) |
| `trimBefore` | number | Remove frames from start |
| `trimAfter` | number | Remove frames from end |
| `muted` | boolean | Mute audio |
| `loop` | boolean | Loop video |
| `toneFrequency` | number | Pitch adjustment (0.01-2) |

---

### `<OffthreadVideo>`
Extracts exact frames using FFmpeg (better accuracy than `<Video>`).

```tsx
import { OffthreadVideo, staticFile } from 'remotion';

<OffthreadVideo
  src={staticFile('video.mp4')}
  transparent={false}
  toneMapped={true}
/>
```

**Props:** Same as `<Video>` plus:
| Prop | Type | Description |
|------|------|-------------|
| `transparent` | boolean | Extract as PNG for transparency |
| `toneMapped` | boolean | Color space adjustments |
| `onVideoFrame` | function | Frame extraction callback |

---

### `<Audio>` / `<Html5Audio>`
Adds audio synchronized with timeline.

```tsx
import { Audio, staticFile } from 'remotion';

<Audio
  src={staticFile('music.mp3')}
  volume={(f) => interpolate(f, [0, 30], [0, 1])}
  playbackRate={1}
/>
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `src` | string | Audio source |
| `volume` | number \| function | Volume or per-frame callback |
| `playbackRate` | number | Speed control |
| `muted` | boolean | Mute audio |
| `loop` | boolean | Loop audio |
| `trimBefore/After` | number | Trim frames |

---

### `<IFrame>`
Embeds iframes with automatic `delayRender()`.

```tsx
import { IFrame } from 'remotion';

<IFrame src="https://example.com" />
```

**Note:** Website should not have animations (only `useCurrentFrame()` animations supported).

---

## Hooks

### `useCurrentFrame()`
Returns the current frame number.

```tsx
import { useCurrentFrame } from 'remotion';

const MyComponent = () => {
  const frame = useCurrentFrame();
  return <div>Frame: {frame}</div>;
};
```

**Note:** Inside `<Sequence>`, returns frame relative to sequence start.

---

### `useVideoConfig()`
Returns composition configuration.

```tsx
import { useVideoConfig } from 'remotion';

const MyComponent = () => {
  const { width, height, fps, durationInFrames, id, props } = useVideoConfig();
  return <div>{width}x{height} @ {fps}fps</div>;
};
```

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `width` | number | Composition width |
| `height` | number | Composition height |
| `fps` | number | Frame rate |
| `durationInFrames` | number | Total frames |
| `id` | string | Composition ID |
| `defaultProps` | object | Default props |
| `props` | object | Resolved props |
| `defaultCodec` | string | Default codec |

---

## Functions

### `interpolate()`
Maps a range of values to another.

```tsx
import { interpolate } from 'remotion';

// Fade in over first 30 frames
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateRight: 'clamp',
});

// Move from left to right
const x = interpolate(frame, [0, 60, 120], [-100, 0, 100]);
```

**Signature:**
```ts
interpolate(
  input: number,
  inputRange: number[],
  outputRange: number[],
  options?: {
    extrapolateLeft?: 'extend' | 'clamp' | 'wrap' | 'identity',
    extrapolateRight?: 'extend' | 'clamp' | 'wrap' | 'identity',
    easing?: (t: number) => number,
  }
): number
```

---

### `spring()`
Physics-based spring animation.

```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const MyComponent = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: {
      mass: 1,
      damping: 10,
      stiffness: 100,
      overshootClamping: false,
    },
  });

  return <div style={{ transform: `scale(${scale})` }} />;
};
```

**Options:**
| Option | Default | Description |
|--------|---------|-------------|
| `frame` | required | Current frame |
| `fps` | required | Frame rate |
| `from` | 0 | Start value |
| `to` | 1 | End value |
| `delay` | 0 | Delay in frames |
| `durationInFrames` | - | Lock to specific duration |
| `reverse` | false | Reverse animation |
| `config.mass` | 1 | Lower = faster |
| `config.damping` | 10 | Deceleration |
| `config.stiffness` | 100 | Bounciness |
| `config.overshootClamping` | false | Prevent overshoot |

---

### `measureSpring()`
Calculate spring animation duration.

```tsx
import { measureSpring } from 'remotion';

const duration = measureSpring({
  fps: 30,
  config: { damping: 200 },
  threshold: 0.005, // 0.5% of target
});
// Returns frame count until animation settles
```

---

### `staticFile()`
Reference files in the `public/` folder.

```tsx
import { staticFile } from 'remotion';

const src = staticFile('video.mp4'); // → /video.mp4
const nested = staticFile('assets/logo.png'); // → /assets/logo.png
```

---

### `random()`
Deterministic pseudorandom values (0-1).

```tsx
import { random } from 'remotion';

const value = random(seed); // Same seed = same output
random(1);       // Always returns 0.07301638228818774
random('my-id'); // String seeds work too
random(null);    // True randomness (bypass determinism)
```

---

### `delayRender()` / `continueRender()`
Pause rendering for async operations.

```tsx
import { delayRender, continueRender } from 'remotion';
import { useEffect, useState } from 'react';

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(d => {
        setData(d);
        continueRender(handle);
      });
  }, [handle]);

  if (!data) return null;
  return <div>{data.message}</div>;
};
```

**Note:** Default timeout is 30 seconds.

---

### `prefetch()`
Preload assets for instant playback.

```tsx
import { prefetch } from 'remotion';

const { waitUntilDone, free } = prefetch('https://example.com/video.mp4', {
  method: 'blob-url', // or 'base64'
  onProgress: ({ progress }) => console.log(progress),
});

await waitUntilDone();
// Asset is now cached
free(); // Release memory when done
```

---

### `getInputProps()`
Retrieve CLI input props.

```tsx
import { getInputProps } from 'remotion';

const props = getInputProps();
// From: npx remotion render --props='{"title": "Hello"}'
```

---

## Easing Functions

```tsx
import { Easing } from 'remotion';

// Basic
Easing.linear      // f(t) = t
Easing.ease        // Inertial animation
Easing.quad        // f(t) = t²
Easing.cubic       // f(t) = t³

// Parametric
Easing.poly(n)     // f(t) = t^n
Easing.bezier(x1, y1, x2, y2)  // Cubic bezier
Easing.back(s)     // Slight overshoot
Easing.elastic(b)  // Spring interaction

// Mathematical
Easing.circle      // Circular
Easing.sin         // Sinusoidal
Easing.exp         // Exponential

// Special
Easing.bounce      // Bouncing effect
Easing.step0       // Returns 1 for positive values
Easing.step1       // Returns 1 if >= 1

// Modifiers
Easing.in(fn)      // Run forwards
Easing.out(fn)     // Run backwards
Easing.inOut(fn)   // Symmetrical
```

---

## @remotion/transitions

### `<TransitionSeries>`
Enable transitions between sequences.

```tsx
import { TransitionSeries, linearTiming, slide } from '@remotion/transitions';

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

### Timing Functions
```tsx
import { linearTiming, springTiming } from '@remotion/transitions';

linearTiming({ durationInFrames: 30 })
springTiming({ config: { damping: 200 } })
```

### Presentation Effects

**slide()**
```tsx
import { slide } from '@remotion/transitions/slide';
slide({ direction: 'from-left' | 'from-right' | 'from-top' | 'from-bottom' })
```

**fade()**
```tsx
import { fade } from '@remotion/transitions/fade';
fade({ shouldFadeOutExitingScene: false })
```

**wipe()**
```tsx
import { wipe } from '@remotion/transitions/wipe';
wipe({ direction: 'from-left' | 'from-top-left' | ... })
```

**flip()**
```tsx
import { flip } from '@remotion/transitions/flip';
flip({ direction: 'from-left', perspective: 1000 })
```

---

## @remotion/shapes

SVG shape components for compositions.

```tsx
import { Rect, Circle, Triangle } from '@remotion/shapes';

// Rectangle
<Rect width={200} height={100} fill="red" cornerRadius={10} />

// Circle
<Circle radius={100} fill="green" stroke="red" strokeWidth={2} />

// Triangle
<Triangle length={150} fill="blue" direction="up" />
```

**Available Shapes:**
- `<Rect>` - Rectangle with optional corner radius
- `<Circle>` - Circle with radius
- `<Triangle>` - Equilateral triangle
- `<Ellipse>` - Ellipse shape
- `<Star>` - Star shape
- `<Polygon>` - Custom polygon
- `<Pie>` - Pie chart segment

---

## @remotion/paths

SVG path manipulation utilities.

```tsx
import {
  getLength,
  getPointAtLength,
  evolvePath,
  interpolatePath
} from '@remotion/paths';

// Get path length
const length = getLength('M 0 0 L 100 100');

// Get point at position
const point = getPointAtLength('M 0 0 L 100 100', 50);

// Animate path drawing
const evolved = evolvePath(progress, 'M 0 0 L 100 100');

// Interpolate between paths
const morphed = interpolatePath(progress, path1, path2);
```

---

## @remotion/gif

Display GIFs synchronized with timeline.

```tsx
import { Gif } from '@remotion/gif';

<Gif
  src={staticFile('animation.gif')}
  width={300}
  height={200}
  fit="contain"
  playbackRate={1}
  loopBehavior="loop"
/>
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `src` | string | GIF source |
| `width/height` | number | Dimensions |
| `fit` | "fill" \| "contain" \| "cover" | Sizing behavior |
| `playbackRate` | number | Speed multiplier |
| `loopBehavior` | "loop" \| "pause-after-finish" | End behavior |

---

## @remotion/noise

Procedural noise generation.

```tsx
import { noise2D, noise3D, noise4D } from '@remotion/noise';

// 2D noise (x, y)
const value2d = noise2D('seed', x, y);

// 3D noise (x, y, z) - good for animation
const value3d = noise3D('seed', x, y, frame * 0.01);

// 4D noise
const value4d = noise4D('seed', x, y, z, w);
```

---

## @remotion/motion-blur

Add motion blur effects.

```tsx
import { Trail, MotionBlur } from '@remotion/motion-blur';

// Trail effect
<Trail layers={10} lagInFrames={0.5}>
  <MovingElement />
</Trail>

// Motion blur
<MotionBlur samples={10} shutterAngle={180}>
  <FastMovingElement />
</MotionBlur>
```

---

## Player Component

Embed Remotion videos in React apps.

```tsx
import { Player } from '@remotion/player';

<Player
  component={MyVideo}
  durationInFrames={150}
  fps={30}
  compositionWidth={1920}
  compositionHeight={1080}
  inputProps={{ title: 'Hello' }}
  controls
  autoPlay
  loop
  style={{ width: '100%' }}
/>
```

**Key Props:**
| Prop | Type | Description |
|------|------|-------------|
| `component` | React.FC | Video component |
| `durationInFrames` | number | Duration |
| `fps` | number | Frame rate |
| `compositionWidth/Height` | number | Canvas size |
| `inputProps` | object | Props for component |
| `controls` | boolean | Show controls |
| `autoPlay` | boolean | Auto-start |
| `loop` | boolean | Loop playback |
| `playbackRate` | number | Speed (-4 to 4) |

**PlayerRef Methods:**
```ts
playerRef.current.play()
playerRef.current.pause()
playerRef.current.toggle()
playerRef.current.seekTo(frame)
playerRef.current.getCurrentFrame()
playerRef.current.mute() / unmute()
playerRef.current.getVolume() / setVolume(0-1)
playerRef.current.requestFullscreen()
```

**Events:**
- `play`, `pause`, `ended`
- `seeked`, `timeupdate`, `frameupdate`
- `ratechange`, `volumechange`, `mutechange`
- `fullscreenchange`, `scalechange`
- `waiting`, `resume`, `error`

---

## Cloud Rendering

### Remotion Lambda (AWS)
Serverless rendering on AWS Lambda.

```tsx
import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda';

const { renderId, bucketName } = await renderMediaOnLambda({
  region: 'us-east-1',
  functionName: 'remotion-render',
  serveUrl: 'https://your-site.com',
  composition: 'MyVideo',
  inputProps: { title: 'Hello' },
  codec: 'h264',
  imageFormat: 'jpeg',
  maxRetries: 1,
  privacy: 'public',
});

// Check progress
const progress = await getRenderProgress({
  renderId,
  bucketName,
  region: 'us-east-1',
  functionName: 'remotion-render',
});
```

### Google Cloud Run
Alternative cloud rendering.

```tsx
import { renderMediaOnCloudrun } from '@remotion/cloudrun';

const { publicUrl } = await renderMediaOnCloudrun({
  serviceName: 'remotion-render',
  region: 'us-central1',
  composition: 'MyVideo',
  serveUrl: 'https://your-site.com',
  inputProps: { title: 'Hello' },
  codec: 'h264',
});
```

---

## CLI Commands

```bash
# Start Studio (development)
npx remotion studio

# Preview composition
npx remotion preview src/index.ts CompositionId

# Render video
npx remotion render src/index.ts CompositionId out/video.mp4

# Render with props
npx remotion render src/index.ts CompositionId --props='{"title":"Hello"}'

# Render still image
npx remotion still src/index.ts CompositionId out/thumbnail.png

# Lambda commands
npx remotion lambda render ...
npx remotion lambda sites create ...
npx remotion lambda functions deploy ...
```

**Render Options:**
| Flag | Description |
|------|-------------|
| `--codec` | h264, h265, vp8, vp9, prores |
| `--quality` | 0-100 for JPEG frames |
| `--crf` | Constant rate factor |
| `--pixel-format` | yuv420p, yuv444p, etc. |
| `--image-format` | jpeg, png |
| `--scale` | Output scale multiplier |
| `--frames` | Specific frames to render |
| `--concurrency` | Parallel frame rendering |

---

## Standard Composition Presets

### Social Media (9:16 Vertical)
```tsx
{
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 450 // 15 seconds
}
```

### Product Demo (16:9 Landscape)
```tsx
{
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 1800 // 60 seconds
}
```

### Square Ad (1:1)
```tsx
{
  width: 1080,
  height: 1080,
  fps: 30,
  durationInFrames: 900 // 30 seconds
}
```

### Story Format (9:16)
```tsx
{
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 450 // 15 seconds (max per platform)
}
```

---

## Best Practices

### Performance
1. Use `<OffthreadVideo>` for frame-accurate video extraction
2. Set `transparent={false}` unless transparency needed
3. Use `<Img>` instead of `<img>` for guaranteed loading
4. Leverage `prefetch()` for Player preloading
5. Use `delayRender()` sparingly, always `continueRender()`

### Animation
1. Use `spring()` for natural, physics-based motion
2. Prefer `interpolate()` with `clamp` for bounded values
3. Use easing functions for polished animations
4. Keep animations under 60fps for smooth playback

### Organization
1. Use `<Folder>` to organize compositions
2. Use `<Series>` for sequential scenes
3. Use `<TransitionSeries>` for transitions between scenes
4. Keep compositions modular and reusable

### Rendering
1. Use Lambda/Cloud Run for scalable rendering
2. Use appropriate codecs per platform (h264 for compatibility)
3. Optimize asset sizes before rendering
4. Use `--quality` and `--crf` for file size control
