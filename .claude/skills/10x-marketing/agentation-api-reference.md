# Agentation Official API Reference

> Visual feedback annotation system with AI-powered analysis.
> Source: agentation.dev/api

## Overview

Agentation exposes **callbacks** that let you integrate annotations into your own workflows. Instead of traditional REST endpoints, Agentation uses a React component-based approach with event callbacks.

---

## Installation

```bash
npm install agentation
# or
yarn add agentation
# or
pnpm add agentation
```

---

## Basic Integration

```tsx
import { Agentation } from 'agentation';

function App() {
  return (
    <Agentation
      onAnnotationAdd={(annotation) => {
        console.log('New annotation:', annotation);
      }}
      onAnnotationUpdate={(annotation) => {
        console.log('Updated:', annotation);
      }}
      onAnnotationDelete={(id) => {
        console.log('Deleted:', id);
      }}
      onAnnotationsClear={() => {
        console.log('All cleared');
      }}
      onCopy={(markdown) => {
        console.log('Copied:', markdown);
      }}
    />
  );
}
```

---

## Callback Props

### `onAnnotationAdd`
Triggered when an annotation is created.

```tsx
onAnnotationAdd={(annotation: Annotation) => {
  // Sync to database
  await saveAnnotation(annotation);

  // Build AI analysis
  const analysis = await analyzeWithClaude(annotation);

  // Trigger webhook
  await fetch('/api/webhooks/annotation', {
    method: 'POST',
    body: JSON.stringify(annotation)
  });
}}
```

---

### `onAnnotationUpdate`
Triggered when annotation comments are edited.

```tsx
onAnnotationUpdate={(annotation: Annotation) => {
  await updateAnnotation(annotation.id, annotation);
}}
```

---

### `onAnnotationDelete`
Triggered when an annotation is removed.

```tsx
onAnnotationDelete={(id: string) => {
  await deleteAnnotation(id);
}}
```

---

### `onAnnotationsClear`
Triggered when all annotations are cleared simultaneously.

```tsx
onAnnotationsClear={() => {
  await clearAllAnnotations();
}}
```

---

### `onCopy`
Receives markdown output when the copy function is activated.

```tsx
onCopy={(markdown: string) => {
  // Custom clipboard handling
  await navigator.clipboard.writeText(markdown);

  // Or process markdown
  const json = parseMarkdownToJson(markdown);
  await sendToClaudeCode(json);
}}
```

---

## Configuration Options

### `copyToClipboard`
Control clipboard writing behavior.

```tsx
<Agentation
  copyToClipboard={false}  // Handle copying via onCopy instead
  onCopy={(markdown) => {
    // Custom copy logic
  }}
/>
```

| Value | Behavior |
|-------|----------|
| `true` (default) | Automatically copies to clipboard |
| `false` | Only fires `onCopy` callback |

---

## Annotation Data Structure

The `Annotation` object passed to callbacks contains comprehensive information:

```typescript
interface Annotation {
  // Identification
  id: string;                    // Unique annotation ID
  element: string;               // Element name/tag
  selector: string;              // CSS selector path

  // Content
  comment: string;               // User's comment text
  selectedText?: string;         // Optional selected text

  // Positioning
  x: number;                     // X coordinate
  y: number;                     // Y coordinate
  viewportX: number;             // Viewport X percentage
  viewportY: number;             // Viewport Y percentage

  // Metadata
  timestamp: string;             // ISO timestamp
  boundingBox: {                 // Element dimensions
    x: number;
    y: number;
    width: number;
    height: number;
  };

  // Advanced Fields
  nearbyElements?: string[];     // Surrounding elements
  computedStyles?: Record<string, string>;  // CSS styles
  accessibilityInfo?: {          // A11y information
    role?: string;
    label?: string;
    description?: string;
  };
  isMultiSelect?: boolean;       // Multi-select status
}
```

---

## TypeScript Support

Full TypeScript types are exported for type safety:

```typescript
import type {
  Annotation,
  AgentationProps,
  AgentationRef
} from 'agentation';

// Type-safe callback
const handleAdd = (annotation: Annotation) => {
  const { id, element, comment, boundingBox } = annotation;
  // Fully typed
};

// Component props
const props: AgentationProps = {
  onAnnotationAdd: handleAdd,
  copyToClipboard: true
};
```

---

## Integration Patterns

### 1. Database Sync
```tsx
<Agentation
  onAnnotationAdd={async (annotation) => {
    await supabase.from('annotations').insert(annotation);
  }}
  onAnnotationUpdate={async (annotation) => {
    await supabase
      .from('annotations')
      .update(annotation)
      .eq('id', annotation.id);
  }}
  onAnnotationDelete={async (id) => {
    await supabase.from('annotations').delete().eq('id', id);
  }}
/>
```

### 2. Analytics Dashboard
```tsx
<Agentation
  onAnnotationAdd={(annotation) => {
    // Track with analytics
    analytics.track('annotation_created', {
      element: annotation.element,
      category: categorize(annotation.comment),
      viewport: { x: annotation.viewportX, y: annotation.viewportY }
    });
  }}
/>
```

### 3. AI Integration (Claude/MCP)
```tsx
<Agentation
  onAnnotationAdd={async (annotation) => {
    // Send to Claude for analysis
    const analysis = await claude.analyze({
      context: `User annotated element: ${annotation.element}`,
      feedback: annotation.comment,
      styles: annotation.computedStyles
    });

    // Generate fix
    const fix = await claude.generateFix({
      selector: annotation.selector,
      issue: annotation.comment,
      analysis
    });

    // Apply via MCP tool
    await mcpServer.applyFix(fix);
  }}
/>
```

### 4. Webhook Trigger
```tsx
<Agentation
  onAnnotationAdd={async (annotation) => {
    await fetch('https://api.example.com/webhooks/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'annotation',
        data: annotation,
        timestamp: new Date().toISOString()
      })
    });
  }}
/>
```

### 5. Claude Code Export
```tsx
<Agentation
  copyToClipboard={false}
  onCopy={(markdown) => {
    // Parse markdown to structured format
    const tasks = parseToTasks(markdown);

    // Export for Claude Code consumption
    const export = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      annotations: tasks,
      summary: generateSummary(tasks)
    };

    // Copy structured JSON
    navigator.clipboard.writeText(JSON.stringify(export, null, 2));
  }}
/>
```

---

## AI Analysis Integration

### Category Detection
```typescript
function categorizeAnnotation(annotation: Annotation) {
  const comment = annotation.comment.toLowerCase();

  // UX Issues
  if (comment.includes('confusing') || comment.includes('unclear')) {
    return { category: 'ux', priority: 'high' };
  }

  // Accessibility
  if (comment.includes('contrast') || comment.includes('readable')) {
    return { category: 'accessibility', priority: 'high' };
  }

  // Content
  if (comment.includes('text') || comment.includes('copy')) {
    return { category: 'content', priority: 'medium' };
  }

  // Visual
  if (comment.includes('color') || comment.includes('spacing')) {
    return { category: 'visual', priority: 'medium' };
  }

  // Performance
  if (comment.includes('slow') || comment.includes('loading')) {
    return { category: 'performance', priority: 'high' };
  }

  return { category: 'general', priority: 'low' };
}
```

### Agent Routing
```typescript
function routeToAgent(annotation: Annotation) {
  const { category } = categorizeAnnotation(annotation);

  const agentMap = {
    'ux': ['UX Writer', 'UI Designer'],
    'accessibility': ['QA Specialist'],
    'content': ['Head of Copy', 'UX Writer'],
    'visual': ['Brand Designer', 'UI Designer'],
    'performance': ['Frontend Developer']
  };

  return agentMap[category] || ['QA Specialist'];
}
```

### Fix Generation
```typescript
async function generateFix(annotation: Annotation) {
  const { category } = categorizeAnnotation(annotation);

  const fixTemplates = {
    ux: `Review interaction pattern on ${annotation.element}.
         Consider adding visual feedback or clearer affordances.`,
    accessibility: `Increase contrast ratio on ${annotation.element}.
                   Use color contrast checker for 4.5:1 minimum.`,
    visual: `Apply consistent spacing to ${annotation.element}
            using design system tokens.`,
    content: `Rewrite copy on ${annotation.element} to be
             more action-oriented and benefit-focused.`,
    performance: `Optimize ${annotation.element} rendering by
                 reducing re-renders or using memoization.`
  };

  return fixTemplates[category];
}
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Shift + A` | Toggle annotation mode |
| `P` | Toggle annotation panel |
| `C` | Copy/export feedback |
| `X` | Clear all annotations |
| `Esc` | Close panel |

---

## Export Formats

### Markdown Export
```markdown
## Feedback Annotations

### 1. Button - Get Started
- **Location:** (320, 450)
- **Comment:** Button too small on mobile
- **Priority:** High

### 2. Heading - Welcome
- **Location:** (100, 200)
- **Comment:** Font size too large
- **Priority:** Medium
```

### JSON Export (Claude Code Format)
```json
{
  "version": "1.0.0",
  "exportedAt": "2024-01-15T10:30:00Z",
  "project": "my-landing-page",
  "pageUrl": "http://localhost:3000",
  "annotations": [
    {
      "id": "ann-1234",
      "element": "button: Get Started",
      "selector": "button.primary-cta",
      "comment": "Button too small on mobile",
      "x": 320,
      "y": 450,
      "boundingBox": { "x": 300, "y": 440, "width": 150, "height": 48 },
      "timestamp": "2024-01-15T10:25:00Z"
    }
  ],
  "tasks": [
    {
      "id": "task-5678",
      "type": "fix",
      "priority": "high",
      "category": "accessibility",
      "selector": "button.primary-cta",
      "currentState": "Button too small on mobile",
      "desiredState": "WCAG 2.1 AA compliant touch target (min 44x44px)",
      "suggestedFix": "Increase button padding to ensure minimum 44x44px touch target"
    }
  ],
  "summary": "Found 1 feedback annotation. Generated 1 actionable task. 1 high priority issue to address."
}
```

---

## React Component Reference

### AgentationFeedback (Full Implementation)
```tsx
'use client';

import { useState, useCallback, useEffect } from 'react';

interface Annotation {
  id: string;
  element: string;
  selector: string;
  comment: string;
  x: number;
  y: number;
  timestamp: Date;
  analysis?: {
    category: 'ux' | 'accessibility' | 'visual' | 'content' | 'performance';
    priority: 'critical' | 'high' | 'medium' | 'low';
    agent: string;
    suggestedFix: string;
  };
}

export function AgentationFeedback() {
  const [isActive, setIsActive] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);

  // Toggle annotation mode
  const toggleMode = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  // Handle element click
  const handleElementClick = useCallback((e: MouseEvent) => {
    if (!isActive) return;
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    const comment = prompt('Enter your feedback:');

    if (comment) {
      const annotation: Annotation = {
        id: `ann-${Date.now()}`,
        element: `${target.tagName.toLowerCase()}: ${target.textContent?.slice(0, 20)}`,
        selector: getSelector(target),
        comment,
        x: e.clientX,
        y: e.clientY,
        timestamp: new Date(),
        analysis: analyzeAnnotation(comment, target)
      };

      setAnnotations(prev => [...prev, annotation]);
    }
  }, [isActive]);

  // Analyze annotation with AI
  const analyzeAnnotation = (comment: string, element: HTMLElement) => {
    const lowerComment = comment.toLowerCase();

    let category: Annotation['analysis']['category'] = 'visual';
    let priority: Annotation['analysis']['priority'] = 'medium';
    let agent = 'UI Designer';

    if (lowerComment.includes('confusing') || lowerComment.includes('unclear')) {
      category = 'ux';
      priority = 'high';
      agent = 'UX Writer';
    } else if (lowerComment.includes('contrast') || lowerComment.includes('small')) {
      category = 'accessibility';
      priority = 'high';
      agent = 'QA Specialist';
    } else if (lowerComment.includes('text') || lowerComment.includes('copy')) {
      category = 'content';
      agent = 'Head of Copy';
    } else if (lowerComment.includes('slow') || lowerComment.includes('loading')) {
      category = 'performance';
      priority = 'high';
      agent = 'Frontend Developer';
    }

    return {
      category,
      priority,
      agent,
      suggestedFix: `Review ${element.tagName} element and address: ${comment}`
    };
  };

  // Export for Claude Code
  const exportFeedback = () => {
    const export = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      annotations,
      tasks: annotations.map(a => ({
        id: `task-${a.id}`,
        type: 'fix',
        priority: a.analysis?.priority || 'medium',
        category: a.analysis?.category || 'visual',
        selector: a.selector,
        currentState: a.comment,
        suggestedFix: a.analysis?.suggestedFix || ''
      }))
    };

    navigator.clipboard.writeText(JSON.stringify(export, null, 2));
    alert('Feedback exported to clipboard!');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'a') {
        e.preventDefault();
        toggleMode();
      }
      if (e.key === 'c' && isActive) {
        exportFeedback();
      }
      if (e.key === 'x' && isActive) {
        setAnnotations([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, toggleMode]);

  // Event listeners for annotation mode
  useEffect(() => {
    if (isActive) {
      document.addEventListener('click', handleElementClick, true);
    }
    return () => {
      document.removeEventListener('click', handleElementClick, true);
    };
  }, [isActive, handleElementClick]);

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={toggleMode}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 10000,
          padding: '12px 24px',
          background: isActive ? '#ef4444' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer'
        }}
      >
        {isActive ? '✕ Exit Feedback' : '📝 Give Feedback'}
      </button>

      {/* Annotation markers */}
      {annotations.map(ann => (
        <div
          key={ann.id}
          style={{
            position: 'fixed',
            left: ann.x - 8,
            top: ann.y - 8,
            width: 16,
            height: 16,
            background: '#ef4444',
            borderRadius: '50%',
            zIndex: 9999,
            cursor: 'pointer'
          }}
          title={ann.comment}
        />
      ))}

      {/* Annotation panel */}
      {isActive && annotations.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            width: 350,
            maxHeight: '80vh',
            background: 'white',
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            overflow: 'auto',
            zIndex: 10001,
            padding: 16
          }}
        >
          <h3>Feedback ({annotations.length})</h3>
          {annotations.map(ann => (
            <div key={ann.id} style={{ marginBottom: 12, padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
              <strong>{ann.element}</strong>
              <p>{ann.comment}</p>
              <small>
                {ann.analysis?.category} | {ann.analysis?.priority} | {ann.analysis?.agent}
              </small>
            </div>
          ))}
          <button onClick={exportFeedback} style={{ width: '100%', padding: 12 }}>
            Export for Claude Code
          </button>
        </div>
      )}
    </>
  );
}

// Utility: Get CSS selector for element
function getSelector(el: HTMLElement): string {
  if (el.id) return `#${el.id}`;
  if (el.className) return `.${el.className.split(' ').join('.')}`;
  return el.tagName.toLowerCase();
}
```

---

## Use Cases

| Use Case | Implementation |
|----------|----------------|
| Sync to database | `onAnnotationAdd` → Insert to DB |
| Analytics dashboards | `onAnnotationAdd` → Track events |
| AI integrations (MCP) | `onAnnotationAdd` → Send to Claude |
| Webhook triggers | `onAnnotationAdd` → POST to endpoint |
| Claude Code export | `onCopy` → Format as JSON tasks |

---

## Best Practices

1. **Always provide visual feedback** when annotation mode is active
2. **Categorize annotations** for proper agent routing
3. **Export in structured format** for AI processing
4. **Include element context** (selector, styles) for accurate fixes
5. **Prioritize issues** to focus on critical problems first
6. **Route to appropriate agents** based on issue category
