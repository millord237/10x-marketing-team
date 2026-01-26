'use client';

import { useCallback, useEffect, useState, useRef } from 'react';

// =============================================================================
// TYPES - Agentation Data Structures
// =============================================================================

interface Annotation {
  id: string;
  element: string;
  selector: string;
  comment: string;
  timestamp: Date;
  viewport: { x: number; y: number; width: number; height: number };
  boundingBox: { x: number; y: number; width: number; height: number };
  screenshot?: string;
  metadata?: {
    cssClass?: string;
    computedStyles?: Record<string, string>;
    accessibilityInfo?: string;
  };
}

interface AIAnalysis {
  category: 'ux' | 'accessibility' | 'visual' | 'content' | 'performance';
  priority: 'critical' | 'high' | 'medium' | 'low';
  agent: string;
  suggestedFix: string;
  codeSnippet?: string;
}

interface ProcessedFeedback {
  annotation: Annotation;
  analysis: AIAnalysis;
  status: 'pending' | 'in_progress' | 'completed';
}

// =============================================================================
// AGENTATION SUPERPOWERS COMPONENT
// =============================================================================

export default function AgentationFeedback() {
  const [isActive, setIsActive] = useState(true);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [processedFeedback, setProcessedFeedback] = useState<ProcessedFeedback[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPanel, setShowPanel] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  // =============================================================================
  // ELEMENT HIGHLIGHTING
  // =============================================================================

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Get element under cursor (excluding our overlay)
      const overlay = overlayRef.current;
      if (overlay) {
        overlay.style.pointerEvents = 'none';
      }

      const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;

      if (overlay) {
        overlay.style.pointerEvents = 'auto';
      }

      // Don't highlight our own UI
      if (element && !element.closest('[data-agentation]')) {
        setSelectedElement(element);
      } else {
        setSelectedElement(null);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isActive]);

  // =============================================================================
  // ANNOTATION CREATION
  // =============================================================================

  const createAnnotation = useCallback((element: HTMLElement, comment: string) => {
    const rect = element.getBoundingClientRect();

    // Generate smart selector
    let selector = element.tagName.toLowerCase();
    if (element.id) {
      selector = `#${element.id}`;
    } else if (element.className) {
      const classes = element.className.split(' ').filter(c => c && !c.startsWith('__'));
      if (classes.length > 0) {
        selector += `.${classes[0]}`;
      }
    }

    // Get text content for buttons/links
    const textContent = element.textContent?.trim().slice(0, 50);
    const elementName = element.tagName.toLowerCase();
    const displayName = textContent
      ? `${elementName}: "${textContent}"`
      : selector;

    const annotation: Annotation = {
      id: `ann-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      element: displayName,
      selector,
      comment,
      timestamp: new Date(),
      viewport: {
        x: window.scrollX,
        y: window.scrollY,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      boundingBox: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      },
      metadata: {
        cssClass: element.className,
        computedStyles: getRelevantStyles(element),
      },
    };

    setAnnotations(prev => [...prev, annotation]);

    // Auto-analyze with AI
    analyzeAnnotation(annotation);
  }, []);

  // Get relevant computed styles
  const getRelevantStyles = (element: HTMLElement): Record<string, string> => {
    const computed = window.getComputedStyle(element);
    return {
      color: computed.color,
      backgroundColor: computed.backgroundColor,
      fontSize: computed.fontSize,
      fontWeight: computed.fontWeight,
      padding: computed.padding,
      margin: computed.margin,
    };
  };

  // =============================================================================
  // AI ANALYSIS
  // =============================================================================

  const analyzeAnnotation = async (annotation: Annotation) => {
    setIsProcessing(true);

    // Simulate AI analysis (would call Claude API in production)
    await new Promise(resolve => setTimeout(resolve, 500));

    const comment = annotation.comment.toLowerCase();

    // Detect category and assign agent
    let category: AIAnalysis['category'] = 'visual';
    let priority: AIAnalysis['priority'] = 'medium';
    let agent = 'UI Designer';

    if (comment.includes('confus') || comment.includes('unclear') || comment.includes('hard')) {
      category = 'ux';
      agent = 'UX Writer';
      priority = 'high';
    } else if (comment.includes('contrast') || comment.includes('small') || comment.includes('read')) {
      category = 'accessibility';
      agent = 'QA Specialist';
      priority = 'high';
    } else if (comment.includes('text') || comment.includes('copy') || comment.includes('word')) {
      category = 'content';
      agent = 'Head of Copy';
    } else if (comment.includes('slow') || comment.includes('load') || comment.includes('lag')) {
      category = 'performance';
      agent = 'Frontend Developer';
      priority = 'high';
    }

    if (comment.includes('broken') || comment.includes('bug') || comment.includes('error')) {
      priority = 'critical';
    }

    const analysis: AIAnalysis = {
      category,
      priority,
      agent,
      suggestedFix: generateSuggestedFix(annotation, category),
      codeSnippet: generateCodeSnippet(category, annotation.selector),
    };

    setProcessedFeedback(prev => [...prev, {
      annotation,
      analysis,
      status: 'pending',
    }]);

    setIsProcessing(false);
  };

  const generateSuggestedFix = (annotation: Annotation, category: AIAnalysis['category']): string => {
    const fixes: Record<AIAnalysis['category'], string> = {
      ux: `Review interaction on \`${annotation.selector}\`. Add visual feedback or clearer affordances.`,
      accessibility: `Check contrast and size on \`${annotation.selector}\`. Ensure WCAG 2.1 AA compliance.`,
      visual: `Apply consistent spacing/alignment to \`${annotation.selector}\` using design tokens.`,
      content: `Rewrite copy on \`${annotation.selector}\` to be clearer and more action-oriented.`,
      performance: `Optimize \`${annotation.selector}\` rendering. Consider memoization or lazy loading.`,
    };
    return fixes[category];
  };

  const generateCodeSnippet = (category: AIAnalysis['category'], selector: string): string | undefined => {
    if (category === 'accessibility') {
      return `// Add to ${selector}
className="focus:ring-2 focus:ring-primary-500 focus:outline-none"
aria-label="Descriptive label"`;
    }
    if (category === 'visual') {
      return `// Fix spacing on ${selector}
className="flex items-center gap-4 p-6"`;
    }
    return undefined;
  };

  // =============================================================================
  // CLICK HANDLER
  // =============================================================================

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!isActive || !selectedElement) return;

    // Don't capture clicks on our UI
    if ((e.target as HTMLElement).closest('[data-agentation]')) return;

    e.preventDefault();
    e.stopPropagation();

    const comment = prompt('Add your feedback for this element:');
    if (comment) {
      createAnnotation(selectedElement, comment);
    }
  }, [isActive, selectedElement, createAnnotation]);

  // =============================================================================
  // EXPORT FOR CLAUDE CODE
  // =============================================================================

  const exportForClaudeCode = () => {
    const exportData = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      project: '10x-marketing-team',
      pageUrl: window.location.href,
      feedback: processedFeedback.map(pf => ({
        ...pf.annotation,
        analysis: pf.analysis,
      })),
      summary: generateSummary(),
      claudeCodePrompt: generateClaudeCodePrompt(),
    };

    // Copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));

    // Also download as file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `10x-feedback-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    alert('Feedback exported! Paste in Claude Code or use the downloaded file.');
  };

  const generateSummary = (): string => {
    const critical = processedFeedback.filter(pf => pf.analysis.priority === 'critical').length;
    const high = processedFeedback.filter(pf => pf.analysis.priority === 'high').length;
    return `${processedFeedback.length} issues found. ${critical} critical, ${high} high priority.`;
  };

  const generateClaudeCodePrompt = (): string => {
    const tasks = processedFeedback.map((pf, i) =>
      `${i + 1}. [${pf.analysis.priority.toUpperCase()}] [${pf.analysis.category}] ${pf.annotation.comment}
   Element: ${pf.annotation.element}
   Selector: ${pf.annotation.selector}
   Agent: ${pf.analysis.agent}
   Fix: ${pf.analysis.suggestedFix}`
    ).join('\n\n');

    return `# 10x Marketing Team - Visual Feedback

/10x-feedback

## Summary
${generateSummary()}

## Tasks
${tasks}

Process these issues starting with CRITICAL priority. Use the assigned agents.`;
  };

  // =============================================================================
  // KEYBOARD SHORTCUTS
  // =============================================================================

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + A to toggle
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'a') {
        e.preventDefault();
        setIsActive(prev => !prev);
      }
      // Escape to close panel
      if (e.key === 'Escape') {
        setShowPanel(false);
      }
      // P to toggle panel
      if (e.key === 'p' && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          setShowPanel(prev => !prev);
        }
      }
      // C to copy/export
      if (e.key === 'c' && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          if (processedFeedback.length > 0) {
            exportForClaudeCode();
          }
        }
      }
      // X to clear all
      if (e.key === 'x' && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          setAnnotations([]);
          setProcessedFeedback([]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [processedFeedback]);

  // =============================================================================
  // RENDER
  // =============================================================================

  if (!isActive) return null;

  return (
    <>
      {/* Full-screen overlay for click capture */}
      <div
        ref={overlayRef}
        data-agentation="overlay"
        className="fixed inset-0 z-[9998] cursor-crosshair"
        onClick={handleClick}
        style={{ background: 'rgba(14, 165, 233, 0.02)' }}
      >
        {/* Element highlight */}
        {selectedElement && (
          <div
            className="absolute border-2 border-primary-500 bg-primary-500/10 pointer-events-none transition-all duration-75"
            style={{
              left: selectedElement.getBoundingClientRect().left - 2,
              top: selectedElement.getBoundingClientRect().top - 2,
              width: selectedElement.getBoundingClientRect().width + 4,
              height: selectedElement.getBoundingClientRect().height + 4,
            }}
          />
        )}

        {/* Annotation markers */}
        {annotations.map((ann, i) => (
          <div
            key={ann.id}
            className="absolute w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center text-white text-xs font-bold pointer-events-none shadow-lg"
            style={{
              left: ann.boundingBox.x + ann.boundingBox.width / 2 - 12,
              top: ann.boundingBox.y - 12,
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Mode indicator */}
      <div
        data-agentation="indicator"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full text-sm font-semibold shadow-lg flex items-center gap-3"
      >
        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        AGENTATION SUPERPOWERS ACTIVE
        <span className="text-xs opacity-75">Click to annotate | P: Panel | C: Copy | X: Clear</span>
      </div>

      {/* Feedback panel */}
      {showPanel && (
        <div
          data-agentation="panel"
          className="fixed top-20 right-4 z-[9999] w-96 max-h-[calc(100vh-120px)] overflow-y-auto bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
        >
          <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="text-2xl">👁️</span>
                10x Feedback
              </h3>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium">
                  {processedFeedback.length} issues
                </span>
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {processedFeedback.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🎯</div>
                <p className="text-gray-400 text-sm">
                  Click any element to add feedback
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  AI will analyze and assign to the right agent
                </p>
              </div>
            ) : (
              processedFeedback.map((pf, i) => (
                <div
                  key={pf.annotation.id}
                  className={`p-4 rounded-xl border ${
                    pf.analysis.priority === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                    pf.analysis.priority === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
                    pf.analysis.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                    'bg-green-500/10 border-green-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{pf.annotation.comment}</p>
                      <p className="text-gray-500 text-xs mt-1">{pf.annotation.element}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      pf.analysis.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                      pf.analysis.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      pf.analysis.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {pf.analysis.priority}
                    </span>
                    <span className="px-2 py-1 bg-white/10 text-gray-300 rounded text-xs">
                      {pf.analysis.category}
                    </span>
                    <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded text-xs">
                      {pf.analysis.agent}
                    </span>
                  </div>

                  <p className="text-gray-400 text-xs mt-3 p-2 bg-black/20 rounded">
                    💡 {pf.analysis.suggestedFix}
                  </p>
                </div>
              ))
            )}

            {isProcessing && (
              <div className="flex items-center justify-center gap-2 py-4 text-primary-400">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                AI analyzing...
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl p-4 border-t border-white/10 flex gap-2">
            <button
              onClick={exportForClaudeCode}
              disabled={processedFeedback.length === 0}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              Export for Claude Code
            </button>
            <button
              onClick={() => {
                setAnnotations([]);
                setProcessedFeedback([]);
              }}
              disabled={processedFeedback.length === 0}
              className="py-3 px-4 bg-red-500/20 text-red-400 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-500/30 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </>
  );
}
