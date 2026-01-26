# Agentation Quick Start for Claude Code

> **ZERO SETUP** - Copy, paste, and get visual feedback superpowers.

## Step 1: Install Package

```bash
npm install agentation
```

## Step 2: Add to Your App

That's it. No API keys required for basic usage.

---

## Ready-to-Use Code Templates

### Template 1: Basic Agentation Integration

```tsx
// components/FeedbackButton.tsx
// Add this component to any page for instant feedback collection

'use client';

import { Agentation } from 'agentation';
import { useState } from 'react';

export function FeedbackButton() {
  const [annotations, setAnnotations] = useState<any[]>([]);

  return (
    <Agentation
      onAnnotationAdd={(annotation) => {
        console.log('New feedback:', annotation);
        setAnnotations(prev => [...prev, annotation]);

        // Optional: Send to your backend
        fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(annotation),
        });
      }}
      onAnnotationUpdate={(annotation) => {
        setAnnotations(prev =>
          prev.map(a => a.id === annotation.id ? annotation : a)
        );
      }}
      onAnnotationDelete={(id) => {
        setAnnotations(prev => prev.filter(a => a.id !== id));
      }}
      onCopy={(markdown) => {
        // Export for Claude Code
        console.log('Exported:\n', markdown);
      }}
    />
  );
}
```

---

### Template 2: Full-Featured Feedback Component

```tsx
// components/feedback/AgentationFeedback.tsx
// Complete implementation with AI analysis

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

// Types
interface Annotation {
  id: string;
  element: string;
  selector: string;
  comment: string;
  x: number;
  y: number;
  viewportX: number;
  viewportY: number;
  timestamp: Date;
  boundingBox: { x: number; y: number; width: number; height: number };
  analysis?: {
    category: 'ux' | 'accessibility' | 'visual' | 'content' | 'performance';
    priority: 'critical' | 'high' | 'medium' | 'low';
    agent: string;
    suggestedFix: string;
  };
}

interface ExportData {
  version: string;
  exportedAt: string;
  project: string;
  pageUrl: string;
  annotations: Annotation[];
  tasks: any[];
  summary: string;
}

export default function AgentationFeedback() {
  const [isActive, setIsActive] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [showPanel, setShowPanel] = useState(true);

  // ===== AI ANALYSIS =====
  const analyzeComment = useCallback((comment: string, element: HTMLElement) => {
    const lower = comment.toLowerCase();

    type Category = 'ux' | 'accessibility' | 'visual' | 'content' | 'performance';
    type Priority = 'critical' | 'high' | 'medium' | 'low';

    let category: Category = 'visual';
    let priority: Priority = 'medium';
    let agent = 'UI Designer';

    // UX issues
    if (lower.includes('confusing') || lower.includes('unclear') || lower.includes('hard to')) {
      category = 'ux';
      priority = 'high';
      agent = 'UX Writer';
    }
    // Accessibility issues
    else if (lower.includes('contrast') || lower.includes('small') || lower.includes('readable')) {
      category = 'accessibility';
      priority = 'high';
      agent = 'QA Specialist';
    }
    // Content issues
    else if (lower.includes('text') || lower.includes('copy') || lower.includes('wording')) {
      category = 'content';
      agent = 'Head of Copy';
    }
    // Performance issues
    else if (lower.includes('slow') || lower.includes('loading') || lower.includes('lag')) {
      category = 'performance';
      priority = 'high';
      agent = 'Frontend Developer';
    }
    // Critical bugs
    if (lower.includes('broken') || lower.includes('bug') || lower.includes('error')) {
      priority = 'critical';
    }

    const fixes: Record<Category, string> = {
      ux: `Review interaction on ${element.tagName}. Add visual feedback or clearer affordances.`,
      accessibility: `Check contrast/size on ${element.tagName}. Ensure WCAG 2.1 AA compliance (4.5:1 minimum).`,
      visual: `Apply consistent spacing to ${element.tagName} using design system tokens.`,
      content: `Rewrite copy on ${element.tagName} to be more action-oriented and benefit-focused.`,
      performance: `Optimize ${element.tagName} rendering. Consider memoization or lazy loading.`,
    };

    return {
      category,
      priority,
      agent,
      suggestedFix: fixes[category],
    };
  }, []);

  // ===== GET SELECTOR =====
  const getSelector = useCallback((el: HTMLElement): string => {
    if (el.id) return `#${el.id}`;
    if (el.className && typeof el.className === 'string') {
      const classes = el.className.trim().split(/\s+/).filter(c => !c.startsWith('hover:'));
      if (classes.length > 0) return `.${classes.slice(0, 2).join('.')}`;
    }
    let path = el.tagName.toLowerCase();
    if (el.parentElement && el.parentElement !== document.body) {
      path = getSelector(el.parentElement) + ' > ' + path;
    }
    return path;
  }, []);

  // ===== TOGGLE MODE =====
  const toggleMode = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  // ===== HANDLE CLICK =====
  const handleElementClick = useCallback((e: MouseEvent) => {
    if (!isActive) return;

    const target = e.target as HTMLElement;

    // Ignore clicks on our own UI
    if (target.closest('[data-agentation]')) return;

    e.preventDefault();
    e.stopPropagation();

    const comment = prompt('📝 Enter your feedback:');
    if (!comment) return;

    const rect = target.getBoundingClientRect();
    const annotation: Annotation = {
      id: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      element: `${target.tagName.toLowerCase()}: ${target.textContent?.slice(0, 30) || '(empty)'}`,
      selector: getSelector(target),
      comment,
      x: e.clientX,
      y: e.clientY,
      viewportX: (e.clientX / window.innerWidth) * 100,
      viewportY: (e.clientY / window.innerHeight) * 100,
      timestamp: new Date(),
      boundingBox: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      },
      analysis: analyzeComment(comment, target),
    };

    setAnnotations(prev => [...prev, annotation]);
  }, [isActive, getSelector, analyzeComment]);

  // ===== HOVER HIGHLIGHT =====
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isActive) return;
    const target = e.target as HTMLElement;
    if (target.closest('[data-agentation]')) {
      setHoveredElement(null);
      return;
    }
    setHoveredElement(target);
  }, [isActive]);

  // ===== EXPORT FOR CLAUDE CODE =====
  const exportFeedback = useCallback(() => {
    const exportData: ExportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      project: '10x-marketing-team',
      pageUrl: window.location.href,
      annotations,
      tasks: annotations.map(a => ({
        id: `task-${a.id}`,
        type: 'fix',
        priority: a.analysis?.priority || 'medium',
        category: a.analysis?.category || 'visual',
        selector: a.selector,
        currentState: a.comment,
        desiredState: `Address: ${a.comment}`,
        suggestedFix: a.analysis?.suggestedFix || '',
        agent: a.analysis?.agent || 'UI Designer',
      })),
      summary: generateSummary(),
    };

    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    alert('✅ Feedback exported to clipboard!\n\nPaste in Claude Code to process.');
  }, [annotations]);

  const generateSummary = useCallback(() => {
    const critical = annotations.filter(a => a.analysis?.priority === 'critical').length;
    const high = annotations.filter(a => a.analysis?.priority === 'high').length;

    let summary = `Found ${annotations.length} feedback items.`;
    if (critical > 0) summary += ` ${critical} CRITICAL issues.`;
    if (high > 0) summary += ` ${high} high priority items.`;

    return summary;
  }, [annotations]);

  // ===== KEYBOARD SHORTCUTS =====
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + A = Toggle
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        toggleMode();
      }
      // P = Toggle panel
      if (e.key.toLowerCase() === 'p' && isActive) {
        setShowPanel(prev => !prev);
      }
      // C = Copy/export
      if (e.key.toLowerCase() === 'c' && isActive && !e.ctrlKey && !e.metaKey) {
        exportFeedback();
      }
      // X = Clear all
      if (e.key.toLowerCase() === 'x' && isActive) {
        if (confirm('Clear all annotations?')) {
          setAnnotations([]);
        }
      }
      // Esc = Exit mode
      if (e.key === 'Escape' && isActive) {
        setIsActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, toggleMode, exportFeedback]);

  // ===== EVENT LISTENERS =====
  useEffect(() => {
    if (isActive) {
      document.addEventListener('click', handleElementClick, true);
      document.addEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = 'crosshair';
    } else {
      document.body.style.cursor = '';
      setHoveredElement(null);
    }

    return () => {
      document.removeEventListener('click', handleElementClick, true);
      document.removeEventListener('mousemove', handleMouseMove);
      document.body.style.cursor = '';
    };
  }, [isActive, handleElementClick, handleMouseMove]);

  // ===== PRIORITY COLORS =====
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  return (
    <>
      {/* Hover highlight */}
      {isActive && hoveredElement && (
        <div
          data-agentation="highlight"
          style={{
            position: 'fixed',
            left: hoveredElement.getBoundingClientRect().x - 2,
            top: hoveredElement.getBoundingClientRect().y - 2,
            width: hoveredElement.getBoundingClientRect().width + 4,
            height: hoveredElement.getBoundingClientRect().height + 4,
            border: '2px solid #3b82f6',
            borderRadius: 4,
            pointerEvents: 'none',
            zIndex: 9998,
            background: 'rgba(59, 130, 246, 0.1)',
          }}
        />
      )}

      {/* Annotation markers */}
      {annotations.map(ann => (
        <div
          key={ann.id}
          data-agentation="marker"
          style={{
            position: 'fixed',
            left: ann.x - 12,
            top: ann.y - 12,
            width: 24,
            height: 24,
            background: getPriorityColor(ann.analysis?.priority),
            borderRadius: '50%',
            border: '2px solid white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            zIndex: 9999,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            color: 'white',
            fontWeight: 'bold',
          }}
          title={`${ann.analysis?.category?.toUpperCase()}: ${ann.comment}`}
        >
          {annotations.indexOf(ann) + 1}
        </div>
      ))}

      {/* Toggle button */}
      <button
        data-agentation="toggle"
        onClick={toggleMode}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 10000,
          padding: '12px 24px',
          background: isActive
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          border: 'none',
          borderRadius: 12,
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: 14,
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          transition: 'all 0.2s',
        }}
      >
        {isActive ? '✕ Exit Feedback' : '📝 Give Feedback'}
      </button>

      {/* Panel */}
      {isActive && showPanel && annotations.length > 0 && (
        <div
          data-agentation="panel"
          style={{
            position: 'fixed',
            top: 20,
            right: 80,
            width: 360,
            maxHeight: 'calc(100vh - 100px)',
            background: 'white',
            borderRadius: 16,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            zIndex: 10001,
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
              Feedback ({annotations.length})
            </h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowPanel(false)}
                style={{
                  padding: '4px 8px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                Hide (P)
              </button>
            </div>
          </div>

          {/* Annotations list */}
          <div style={{ maxHeight: 400, overflow: 'auto', padding: 12 }}>
            {annotations.map((ann, i) => (
              <div
                key={ann.id}
                style={{
                  padding: 12,
                  marginBottom: 8,
                  background: '#f9fafb',
                  borderRadius: 10,
                  borderLeft: `4px solid ${getPriorityColor(ann.analysis?.priority)}`,
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: getPriorityColor(ann.analysis?.priority),
                    textTransform: 'uppercase',
                  }}>
                    {ann.analysis?.priority} • {ann.analysis?.category}
                  </span>
                  <button
                    onClick={() => setAnnotations(prev => prev.filter(a => a.id !== ann.id))}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 14,
                      color: '#9ca3af',
                    }}
                  >
                    ×
                  </button>
                </div>
                <p style={{ margin: '0 0 8px', fontSize: 14, color: '#111827' }}>
                  {ann.comment}
                </p>
                <div style={{ fontSize: 11, color: '#6b7280' }}>
                  <div><strong>Element:</strong> {ann.element}</div>
                  <div><strong>Agent:</strong> {ann.analysis?.agent}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Export button */}
          <div style={{ padding: 12, borderTop: '1px solid #e5e7eb' }}>
            <button
              onClick={exportFeedback}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              📋 Export for Claude Code (C)
            </button>
            <div style={{
              marginTop: 8,
              textAlign: 'center',
              fontSize: 11,
              color: '#9ca3af',
            }}>
              Keyboard: P=Panel, C=Copy, X=Clear, Esc=Exit
            </div>
          </div>
        </div>
      )}

      {/* Mode indicator */}
      {isActive && (
        <div
          data-agentation="indicator"
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 16px',
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 500,
            zIndex: 10000,
          }}
        >
          📍 Click any element to add feedback
        </div>
      )}
    </>
  );
}
```

---

### Template 3: API Route for Feedback Storage

```typescript
// app/api/feedback/route.ts
// Store feedback in your database

import { NextResponse } from 'next/server';

// In-memory store (replace with your database)
const feedbackStore: any[] = [];

export async function POST(request: Request) {
  const annotation = await request.json();

  // Add to store
  feedbackStore.push({
    ...annotation,
    receivedAt: new Date().toISOString(),
  });

  // Optional: Send to external service
  // await sendToSlack(annotation);
  // await saveToDatabase(annotation);

  return NextResponse.json({ success: true, id: annotation.id });
}

export async function GET() {
  return NextResponse.json(feedbackStore);
}

export async function DELETE() {
  feedbackStore.length = 0;
  return NextResponse.json({ success: true, cleared: true });
}
```

---

### Template 4: Webhook Integration

```typescript
// Send feedback to Slack/Discord/etc

async function sendToSlack(annotation: any) {
  const webhook = process.env.SLACK_WEBHOOK_URL;
  if (!webhook) return;

  const color = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e',
  }[annotation.analysis?.priority] || '#6b7280';

  await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attachments: [{
        color,
        title: `[${annotation.analysis?.priority?.toUpperCase()}] New Feedback`,
        text: annotation.comment,
        fields: [
          { title: 'Element', value: annotation.element, short: true },
          { title: 'Category', value: annotation.analysis?.category, short: true },
          { title: 'Assigned Agent', value: annotation.analysis?.agent, short: true },
          { title: 'Suggested Fix', value: annotation.analysis?.suggestedFix, short: false },
        ],
        footer: `Page: ${annotation.pageUrl || 'Unknown'}`,
        ts: Math.floor(Date.now() / 1000),
      }],
    }),
  });
}
```

---

### Template 5: Process Feedback with Claude

```typescript
// Use Claude to generate fixes from feedback

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function processFeedbackWithClaude(feedbackJson: string) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `You are a frontend developer. Analyze this feedback and generate code fixes.

Feedback JSON:
${feedbackJson}

For each annotation:
1. Identify the exact issue
2. Generate a code fix (React/Tailwind)
3. Explain the fix

Format as actionable tasks I can implement immediately.`
    }],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// Usage
const feedback = localStorage.getItem('agentation-export');
if (feedback) {
  const fixes = await processFeedbackWithClaude(feedback);
  console.log(fixes);
}
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Shift + A` | Toggle feedback mode |
| `P` | Toggle panel visibility |
| `C` | Export to clipboard |
| `X` | Clear all annotations |
| `Esc` | Exit feedback mode |

---

## Export Format (Claude Code Compatible)

When you click "Export for Claude Code", you get this JSON:

```json
{
  "version": "1.0.0",
  "exportedAt": "2024-01-15T10:30:00.000Z",
  "project": "10x-marketing-team",
  "pageUrl": "http://localhost:3000",
  "annotations": [
    {
      "id": "ann-1705314600000-abc1",
      "element": "button: Get Started",
      "selector": ".primary-cta",
      "comment": "Button is too small on mobile",
      "x": 450,
      "y": 320,
      "analysis": {
        "category": "accessibility",
        "priority": "high",
        "agent": "QA Specialist",
        "suggestedFix": "Check contrast/size. Ensure WCAG 2.1 AA compliance."
      }
    }
  ],
  "tasks": [
    {
      "id": "task-ann-1705314600000-abc1",
      "type": "fix",
      "priority": "high",
      "category": "accessibility",
      "selector": ".primary-cta",
      "currentState": "Button is too small on mobile",
      "suggestedFix": "Check contrast/size. Ensure WCAG 2.1 AA compliance.",
      "agent": "QA Specialist"
    }
  ],
  "summary": "Found 1 feedback items. 1 high priority items."
}
```

---

## Usage with Claude Code

1. Click "Give Feedback" button on your page
2. Click elements and add comments
3. Press `C` or click "Export for Claude Code"
4. Paste the JSON in Claude Code
5. Ask: "Process this feedback and fix the issues"

Claude Code will:
- Read each annotation
- Generate code fixes
- Apply changes to your files
- Verify the fixes
