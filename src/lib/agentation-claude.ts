// Agentation + Claude Code Integration
// Bridges feedback annotations with AI-powered redesign suggestions

export interface Annotation {
  id: string;
  element: string;
  comment: string;
  timestamp: Date;
  viewport: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  metadata?: {
    cssClass?: string;
    accessibilityInfo?: string;
    computedStyles?: Record<string, string>;
  };
}

export interface RedesignTask {
  id: string;
  type: 'fix' | 'improve' | 'refactor' | 'add';
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'ux' | 'accessibility' | 'performance' | 'visual' | 'content';
  selector: string;
  currentState: string;
  desiredState: string;
  suggestedFix: string;
  codeSnippet?: string;
  relatedAnnotations: string[];
}

export interface ClaudeCodeExport {
  version: string;
  exportedAt: string;
  project: string;
  pageUrl: string;
  annotations: Annotation[];
  tasks: RedesignTask[];
  summary: string;
}

// Analyze annotations and generate redesign tasks
export function analyzeAnnotations(annotations: Annotation[]): RedesignTask[] {
  const tasks: RedesignTask[] = [];

  for (const annotation of annotations) {
    const task = analyzeAnnotation(annotation);
    if (task) {
      tasks.push(task);
    }
  }

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return tasks;
}

function analyzeAnnotation(annotation: Annotation): RedesignTask | null {
  const comment = annotation.comment.toLowerCase();
  const id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // Detect issue category from comment
  let category: RedesignTask['category'] = 'visual';
  let priority: RedesignTask['priority'] = 'medium';
  let type: RedesignTask['type'] = 'improve';

  // UX issues
  if (comment.includes('confusing') || comment.includes('unclear') || comment.includes('hard to')) {
    category = 'ux';
    priority = 'high';
    type = 'fix';
  }

  // Accessibility issues
  if (comment.includes('contrast') || comment.includes('readable') || comment.includes('small')) {
    category = 'accessibility';
    priority = 'high';
    type = 'fix';
  }

  // Content issues
  if (comment.includes('text') || comment.includes('copy') || comment.includes('message')) {
    category = 'content';
    type = 'improve';
  }

  // Visual issues
  if (comment.includes('color') || comment.includes('spacing') || comment.includes('align')) {
    category = 'visual';
    type = 'improve';
  }

  // Bug/broken
  if (comment.includes('broken') || comment.includes('bug') || comment.includes('error')) {
    priority = 'critical';
    type = 'fix';
  }

  // Feature request
  if (comment.includes('add') || comment.includes('need') || comment.includes('should have')) {
    type = 'add';
    priority = 'medium';
  }

  return {
    id,
    type,
    priority,
    category,
    selector: annotation.element,
    currentState: annotation.comment,
    desiredState: generateDesiredState(annotation.comment, category),
    suggestedFix: generateSuggestedFix(annotation, category),
    relatedAnnotations: [annotation.id],
  };
}

function generateDesiredState(comment: string, category: RedesignTask['category']): string {
  const states: Record<RedesignTask['category'], string[]> = {
    ux: [
      'Clear and intuitive interaction',
      'Obvious user flow',
      'Immediate feedback on actions',
    ],
    accessibility: [
      'WCAG 2.1 AA compliant',
      'Sufficient color contrast (4.5:1 minimum)',
      'Readable font size (16px+ minimum)',
    ],
    visual: [
      'Consistent with design system',
      'Proper spacing and alignment',
      'Visual hierarchy established',
    ],
    content: [
      'Clear, concise messaging',
      'Action-oriented copy',
      'Benefit-focused content',
    ],
    performance: [
      'Fast loading (<100ms)',
      'Smooth animations (60fps)',
      'Optimized assets',
    ],
  };

  return states[category][Math.floor(Math.random() * states[category].length)];
}

function generateSuggestedFix(annotation: Annotation, category: RedesignTask['category']): string {
  const fixes: Record<RedesignTask['category'], string[]> = {
    ux: [
      `Review the interaction pattern on ${annotation.element}. Consider adding visual feedback or clearer affordances.`,
      `Simplify the user flow for ${annotation.element}. Reduce cognitive load by breaking complex actions into steps.`,
    ],
    accessibility: [
      `Increase contrast ratio on ${annotation.element}. Use a color contrast checker to ensure 4.5:1 minimum.`,
      `Add ARIA labels to ${annotation.element} for screen reader support.`,
    ],
    visual: [
      `Apply consistent spacing to ${annotation.element} using the design system tokens (e.g., space-4, space-8).`,
      `Adjust ${annotation.element} alignment to match grid system.`,
    ],
    content: [
      `Rewrite copy on ${annotation.element} to be more action-oriented and benefit-focused.`,
      `Shorten text on ${annotation.element} while maintaining clarity.`,
    ],
    performance: [
      `Optimize ${annotation.element} rendering by reducing re-renders or using memoization.`,
      `Lazy load content in ${annotation.element} to improve initial page load.`,
    ],
  };

  return fixes[category][Math.floor(Math.random() * fixes[category].length)];
}

// Export for Claude Code consumption
export function exportForClaudeCode(
  annotations: Annotation[],
  projectName: string = '10x-marketing-team',
  pageUrl: string = 'http://localhost:3000'
): ClaudeCodeExport {
  const tasks = analyzeAnnotations(annotations);

  const criticalCount = tasks.filter(t => t.priority === 'critical').length;
  const highCount = tasks.filter(t => t.priority === 'high').length;

  const summary = [
    `Found ${annotations.length} feedback annotations.`,
    `Generated ${tasks.length} actionable tasks.`,
    criticalCount > 0 ? `${criticalCount} critical issues require immediate attention.` : '',
    highCount > 0 ? `${highCount} high priority issues to address.` : '',
  ].filter(Boolean).join(' ');

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    project: projectName,
    pageUrl,
    annotations,
    tasks,
    summary,
  };
}

// Generate Claude Code prompt from export
export function generateClaudeCodePrompt(exportData: ClaudeCodeExport): string {
  const taskList = exportData.tasks
    .map((task, i) => `${i + 1}. [${task.priority.toUpperCase()}] ${task.category}: ${task.currentState}\n   Fix: ${task.suggestedFix}\n   Selector: ${task.selector}`)
    .join('\n\n');

  return `# Landing Page Redesign Tasks

## Summary
${exportData.summary}

## Project
- Name: ${exportData.project}
- Page: ${exportData.pageUrl}
- Exported: ${exportData.exportedAt}

## Tasks

${taskList}

---

Please analyze these tasks and implement the suggested fixes. Prioritize critical and high priority issues first. After making changes, verify the fixes address the original feedback.`;
}
