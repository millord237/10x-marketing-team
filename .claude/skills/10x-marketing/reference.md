# 10x Marketing Team - Reference Documentation

## Platform-Specific Guidelines

### Meta Ads (Facebook/Instagram)
| Format | Dimensions | Duration | File Size |
|--------|------------|----------|-----------|
| Feed Video | 1:1 (1080x1080) | 15-60s | <4GB |
| Stories | 9:16 (1080x1920) | 15s max | <4GB |
| Reels | 9:16 (1080x1920) | 15-90s | <4GB |
| Carousel | 1:1 (1080x1080) | N/A | <30MB/image |

**Copy Limits:**
- Primary text: 125 characters (optimal)
- Headline: 27 characters (optimal)
- Description: 27 characters (optimal)

**Best Practices:**
- Lead with benefit, not feature
- Use social proof (numbers, testimonials)
- Create urgency without being pushy
- Test video vs. static images

### Google Ads
| Format | Headline | Description |
|--------|----------|-------------|
| Search | 30 chars x 15 | 90 chars x 4 |
| Display | 30 chars x 5 | 90 chars x 5 |
| YouTube | 15 chars (short) | 90 chars (long) |

**Best Practices:**
- Include keywords in headlines
- Use numbers and specifics
- Match ad to landing page
- Test responsive vs. standard

### LinkedIn Ads
| Format | Dimensions | Copy Limits |
|--------|------------|-------------|
| Single Image | 1200x627 | 150 intro, 70 headline |
| Video | 16:9, 1:1, 9:16 | 600 intro |
| Carousel | 1080x1080 | 255 per card |

**Best Practices:**
- Professional, authoritative tone
- B2B focus: ROI, efficiency, growth
- Industry-specific terminology OK
- Thought leadership positioning

### TikTok/Reels/Shorts
| Platform | Dimensions | Duration | Safe Zone |
|----------|------------|----------|-----------|
| TikTok | 9:16 (1080x1920) | 15-60s | 150px top/bottom |
| Reels | 9:16 (1080x1920) | 15-90s | 250px bottom |
| Shorts | 9:16 (1080x1920) | 15-60s | 200px bottom |

**Best Practices:**
- Hook in first 1-3 seconds
- Native, authentic feel
- Trending sounds when relevant
- Text overlays for sound-off viewing
- Strong CTA at end

## Email Marketing Guidelines

### Subject Line Formulas
```
[Number] + [Adjective] + [Noun] + [Promise]
Example: "5 Simple Tricks to Double Your Conversions"

[Question] + [Curiosity Gap]
Example: "Are you making this $10K mistake?"

[Urgency] + [Benefit]
Example: "Last chance: 50% off ends tonight"
```

### Email Structure
```
1. Subject Line (6-10 words, create curiosity)
2. Preview Text (40-90 chars, complement subject)
3. Opening Hook (1-2 sentences, personal)
4. Body (3-5 short paragraphs, one idea each)
5. CTA (single, clear action)
6. P.S. (optional, reinforce offer)
```

### Metrics Benchmarks
| Industry | Open Rate | CTR | Conversion |
|----------|-----------|-----|------------|
| E-commerce | 15-20% | 2-3% | 1-2% |
| SaaS | 20-25% | 3-4% | 2-3% |
| B2B Services | 18-22% | 2-3% | 1-2% |

## Landing Page Conversion Optimization

### Above the Fold Checklist
- [ ] Clear, benefit-driven headline
- [ ] Supporting subheadline
- [ ] Hero image or video
- [ ] Primary CTA button
- [ ] Trust indicators (logos, ratings)
- [ ] No navigation distractions

### Social Proof Types
1. **Testimonials**: Customer quotes with names/photos
2. **Case Studies**: Detailed success stories with metrics
3. **Logos**: Recognizable client/partner brands
4. **Numbers**: User count, revenue generated, ratings
5. **Reviews**: Third-party platform ratings
6. **Certifications**: Security, compliance badges

### CTA Button Best Practices
```
DO:
- Action verbs: "Get", "Start", "Claim", "Join"
- Benefit-focused: "Get My Free Guide"
- Contrast color from page
- Large, tappable (min 44x44px)
- White space around button

DON'T:
- Vague: "Submit", "Click Here"
- Multiple CTAs competing
- Low contrast
- Below the fold only
```

### Form Optimization
| Fields | Conversion Impact |
|--------|-------------------|
| 1 field | Baseline |
| 2-3 fields | -10% |
| 4-5 fields | -25% |
| 6+ fields | -40% |

**Recommendations:**
- Ask only what's necessary
- Use smart defaults
- Show progress for multi-step
- Inline validation
- Clear error messages

## SEO Content Guidelines

### Keyword Integration
```
Primary Keyword:
- Title tag (front-loaded)
- H1 heading
- First 100 words
- URL slug
- Meta description

Secondary Keywords:
- H2/H3 headings
- Body content (natural density)
- Image alt text
- Internal link anchors
```

### Content Structure
```markdown
# H1: Primary Keyword + Benefit (1 per page)

Introduction (100-150 words, hook + preview)

## H2: Section Topic (3-5 per article)

Body paragraphs (100-200 words each)

### H3: Subsection (as needed)

Details, examples, data

## Conclusion

Summary + CTA
```

### Meta Tags Template
```html
<title>[Primary Keyword] - [Benefit] | [Brand]</title>
<meta name="description" content="[Action verb] [benefit] with [product]. [Proof point]. [CTA].">
```

## Remotion Video Specifications

### Composition Settings
```typescript
// Social Media (TikTok/Reels/Shorts)
{
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 450 // 15 seconds
}

// Product Demo (YouTube/Website)
{
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 1800 // 60 seconds
}

// Square Ad (Feed)
{
  width: 1080,
  height: 1080,
  fps: 30,
  durationInFrames: 900 // 30 seconds
}
```

### Animation Timing Guidelines
```
Hook: Frames 0-90 (0-3 seconds)
- Immediate visual impact
- Text or motion to grab attention

Body: Frames 90-360 (3-12 seconds)
- Main content delivery
- Feature/benefit showcase

CTA: Frames 360-450 (12-15 seconds)
- Clear call to action
- Logo/branding
```

### Export Formats (via Cloud APIs)

All rendering is done via cloud APIs. No local Remotion installation required.

```typescript
// Lambda render with format options
await renderMediaOnLambda({
  codec: 'h264',        // MP4 (Universal)
  // codec: 'vp8',      // WebM (Web optimized)
  // codec: 'gif',      // GIF (Social preview)
  imageFormat: 'jpeg',  // or 'png' for transparency
  ...
});
```

## Cloud Rendering (NO LOCAL SETUP)

### Remotion Lambda (AWS)
```typescript
import { renderMediaOnLambda, getRenderProgress } from '@remotion/lambda';

// Start cloud render
const { renderId, bucketName } = await renderMediaOnLambda({
  region: 'us-east-1',           // AWS region
  functionName: 'remotion-render',
  serveUrl: 'https://your-site.com',
  composition: 'SocialMediaVideo',
  inputProps: {
    headline: 'Your Product Name',
    cta: 'Learn More'
  },
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

// progress.overallProgress = 0-1
// progress.outputFile = S3 URL when complete
```

**Lambda Regions:**
- us-east-1 (N. Virginia)
- us-west-2 (Oregon)
- eu-west-1 (Ireland)
- ap-northeast-1 (Tokyo)

**Lambda Limits:**
- Max 10GB storage
- ~5GB output (~2 hours Full HD)
- 1,000 concurrent functions (expandable via AWS)

### Google Cloud Run
```typescript
import { renderMediaOnCloudrun } from '@remotion/cloudrun';

const { publicUrl } = await renderMediaOnCloudrun({
  serviceName: 'remotion-render',
  region: 'us-central1',
  composition: 'ProductDemo',
  serveUrl: 'https://your-site.com',
  inputProps: {
    productName: '10x Marketing',
    tagline: 'Create Videos 10x Faster'
  },
  codec: 'h264',
});

// publicUrl = Cloud Storage URL of rendered video
```

**Cloud Run Regions:**
- us-central1
- us-east1
- europe-west1
- asia-east1

**Cloud Run Limits:**
- Max 32GB memory
- 8 vCPU maximum
- 60-minute timeout

### CLI Cloud Commands
```bash
# Lambda deploy
npx remotion lambda sites create
npx remotion lambda functions deploy

# Lambda render
npx remotion lambda render SocialMediaVideo --props='{"headline":"Test"}'

# Lambda progress
npx remotion lambda progress --render-id=abc123
```

## Remotion Transition Effects

### Available Presentations
```typescript
import { slide, fade, wipe, flip } from '@remotion/transitions';

// Slide (push animation)
slide({ direction: 'from-left' | 'from-right' | 'from-top' | 'from-bottom' })

// Fade (crossfade)
fade({ shouldFadeOutExitingScene: false })

// Wipe (directional overlay)
wipe({ direction: 'from-left' | 'from-top-left' | 'from-top' | 'from-top-right' |
                  'from-right' | 'from-bottom-right' | 'from-bottom' | 'from-bottom-left' })

// Flip (3D rotation)
flip({ direction: 'from-left' | 'from-right' | 'from-top' | 'from-bottom', perspective: 1000 })
```

### Timing Functions
```typescript
import { linearTiming, springTiming } from '@remotion/transitions';

// Linear (constant speed)
linearTiming({ durationInFrames: 30 })

// Spring (physics-based)
springTiming({ config: { damping: 200 } })
```

### Usage Example
```tsx
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

## Remotion Shapes Reference

```tsx
import { Rect, Circle, Triangle, Ellipse, Star, Polygon, Pie } from '@remotion/shapes';

// Rectangle
<Rect width={200} height={100} fill="red" cornerRadius={10} />

// Circle
<Circle radius={100} fill="green" stroke="white" strokeWidth={2} />

// Triangle
<Triangle length={150} fill="blue" direction="up" />

// Ellipse
<Ellipse rx={100} ry={50} fill="purple" />

// Star
<Star points={5} outerRadius={100} innerRadius={50} fill="gold" />

// Polygon
<Polygon points={6} radius={100} fill="orange" />

// Pie
<Pie radius={100} progress={0.75} fill="cyan" />
```

## Remotion Animation Functions

### interpolate()
```typescript
import { interpolate } from 'remotion';

// Basic interpolation
const opacity = interpolate(frame, [0, 30], [0, 1]);

// With clamping
const x = interpolate(frame, [0, 60], [0, 100], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

// Multi-point
const scale = interpolate(frame, [0, 30, 60], [0, 1.2, 1]);
```

### spring()
```typescript
import { spring } from 'remotion';

const scale = spring({
  frame,
  fps,
  from: 0,
  to: 1,
  config: {
    mass: 1,        // Lower = faster
    damping: 10,    // Deceleration
    stiffness: 100, // Bounciness
    overshootClamping: false,
  },
});
```

### Easing Functions
```typescript
import { Easing } from 'remotion';

// Basic
Easing.linear | ease | quad | cubic

// Special
Easing.bounce | elastic | back

// Modifiers
Easing.in(Easing.quad)    // Accelerate
Easing.out(Easing.quad)   // Decelerate
Easing.inOut(Easing.quad) // Both
```

## Agentation Feedback Categories

### Priority Levels
| Priority | Response Time | Examples |
|----------|---------------|----------|
| Critical | Immediate | Broken functionality, security issues |
| High | Same session | UX blockers, accessibility violations |
| Medium | Next iteration | Visual polish, copy improvements |
| Low | Backlog | Nice-to-haves, minor tweaks |

### Category Definitions
- **UX**: User flow, interaction, clarity issues
- **Accessibility**: WCAG compliance, contrast, screen readers
- **Visual**: Design, spacing, alignment, colors
- **Content**: Copy, messaging, tone issues
- **Performance**: Loading, animation, responsiveness

### Feedback Processing Flow
```
1. Receive annotations from Agentation export
2. Parse JSON structure
3. Categorize by priority and type
4. Generate code fixes for each issue
5. Apply edits using Edit tool
6. Verify fixes address original feedback
```
