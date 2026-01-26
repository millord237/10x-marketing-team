/**
 * 10x Marketing Team - Agentation Feedback Handler
 *
 * Processes visual annotations from Agentation and generates
 * actionable tasks for Claude Code to implement.
 *
 * Flow:
 * 1. User annotates elements on the page
 * 2. Annotations exported as JSON
 * 3. This handler categorizes and prioritizes
 * 4. Generates code fix suggestions
 * 5. Exports prompt for Claude Code
 */

// =============================================================================
// TYPES
// =============================================================================

/** Annotation from Agentation */
export interface Annotation {
  id: string;
  /** Element identifier (tag.class or semantic name) */
  element: string;
  /** User's feedback comment */
  comment: string;
  /** When annotation was created */
  timestamp: Date;
  /** Viewport at time of annotation */
  viewport: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Element bounding box */
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  /** Optional CSS/accessibility metadata */
  metadata?: {
    cssClass?: string;
    accessibilityInfo?: string;
    computedStyles?: Record<string, string>;
  };
}

/** Priority levels for tasks */
export type Priority = 'critical' | 'high' | 'medium' | 'low';

/** Category of the issue */
export type Category = 'ux' | 'accessibility' | 'visual' | 'content' | 'performance';

/** Task type */
export type TaskType = 'fix' | 'improve' | 'refactor' | 'add';

/** Generated redesign task */
export interface RedesignTask {
  id: string;
  type: TaskType;
  priority: Priority;
  category: Category;
  selector: string;
  issue: string;
  suggestedFix: string;
  codeSnippet?: string;
  relatedAnnotations: string[];
}

/** Export format for Claude Code */
export interface ClaudeCodeExport {
  version: string;
  exportedAt: string;
  project: string;
  pageUrl: string;
  summary: string;
  annotations: Annotation[];
  tasks: RedesignTask[];
}

// =============================================================================
// KEYWORD PATTERNS
// =============================================================================

const KEYWORD_PATTERNS: Record<Category, string[]> = {
  ux: [
    'confusing',
    'unclear',
    'hard to',
    'difficult',
    "can't find",
    'where is',
    'how do i',
    'lost',
    'stuck',
    'flow',
    'navigation',
    'click',
    'tap',
  ],
  accessibility: [
    'contrast',
    'readable',
    'small',
    'tiny',
    'can\'t see',
    'color blind',
    'screen reader',
    'keyboard',
    'focus',
    'aria',
    'alt text',
  ],
  visual: [
    'color',
    'spacing',
    'align',
    'margin',
    'padding',
    'font',
    'size',
    'layout',
    'design',
    'ugly',
    'weird',
    'off',
    'broken layout',
  ],
  content: [
    'text',
    'copy',
    'message',
    'wording',
    'typo',
    'spelling',
    'grammar',
    'tone',
    'confusing text',
    'unclear message',
  ],
  performance: [
    'slow',
    'loading',
    'lag',
    'freeze',
    'jank',
    'animation',
    'scroll',
    'performance',
  ],
};

const PRIORITY_PATTERNS: Record<Priority, string[]> = {
  critical: ['broken', 'bug', 'error', 'crash', 'not working', "can't", 'blocked'],
  high: ['urgent', 'important', 'must', 'need', 'required', 'asap'],
  medium: ['should', 'would be nice', 'consider', 'maybe'],
  low: ['minor', 'small', 'nitpick', 'polish', 'eventually'],
};

// =============================================================================
// ANALYSIS FUNCTIONS
// =============================================================================

/**
 * Detect category from comment text
 */
function detectCategory(comment: string): Category {
  const lowerComment = comment.toLowerCase();

  for (const [category, keywords] of Object.entries(KEYWORD_PATTERNS)) {
    for (const keyword of keywords) {
      if (lowerComment.includes(keyword)) {
        return category as Category;
      }
    }
  }

  return 'visual'; // Default category
}

/**
 * Detect priority from comment text
 */
function detectPriority(comment: string): Priority {
  const lowerComment = comment.toLowerCase();

  for (const [priority, keywords] of Object.entries(PRIORITY_PATTERNS)) {
    for (const keyword of keywords) {
      if (lowerComment.includes(keyword)) {
        return priority as Priority;
      }
    }
  }

  return 'medium'; // Default priority
}

/**
 * Detect task type from comment
 */
function detectTaskType(comment: string): TaskType {
  const lowerComment = comment.toLowerCase();

  if (lowerComment.includes('add') || lowerComment.includes('need') || lowerComment.includes('missing')) {
    return 'add';
  }
  if (lowerComment.includes('broken') || lowerComment.includes('fix') || lowerComment.includes('bug')) {
    return 'fix';
  }
  if (lowerComment.includes('refactor') || lowerComment.includes('clean up') || lowerComment.includes('reorganize')) {
    return 'refactor';
  }

  return 'improve';
}

/**
 * Generate suggested fix based on category and comment
 */
function generateSuggestedFix(annotation: Annotation, category: Category): string {
  const element = annotation.element;
  const comment = annotation.comment;

  const fixes: Record<Category, string[]> = {
    ux: [
      `Review the interaction pattern on \`${element}\`. Consider adding visual feedback (hover states, loading indicators) or clearer affordances.`,
      `Simplify the user flow for \`${element}\`. Break complex actions into smaller steps with clear progress indication.`,
      `Add tooltips or helper text to \`${element}\` to clarify its purpose.`,
    ],
    accessibility: [
      `Increase contrast ratio on \`${element}\` to meet WCAG 2.1 AA (4.5:1 for text, 3:1 for large text). Use a contrast checker tool.`,
      `Add ARIA labels to \`${element}\` for screen reader support: \`aria-label="descriptive text"\``,
      `Ensure \`${element}\` is keyboard accessible with visible focus states.`,
      `Increase font size on \`${element}\` to minimum 16px for body text.`,
    ],
    visual: [
      `Apply consistent spacing to \`${element}\` using design system tokens (e.g., \`space-4\`, \`space-8\`, or \`gap-4\`).`,
      `Adjust \`${element}\` alignment to match the grid system. Use flexbox or grid for consistent layout.`,
      `Review color usage on \`${element}\`. Ensure it matches the brand palette and has sufficient contrast.`,
      `Fix layout issues on \`${element}\`. Check for overflow, wrapping, or responsive breakpoints.`,
    ],
    content: [
      `Rewrite copy on \`${element}\` to be more action-oriented and benefit-focused. Lead with the user's gain.`,
      `Shorten text on \`${element}\` while maintaining clarity. Aim for 6th-8th grade reading level.`,
      `Fix typo/grammar issue on \`${element}\`: "${comment}"`,
      `Clarify messaging on \`${element}\`. Make the value proposition clear in the first 5 words.`,
    ],
    performance: [
      `Optimize \`${element}\` rendering. Consider memoization (\`React.memo\`, \`useMemo\`) to prevent unnecessary re-renders.`,
      `Lazy load content in \`${element}\` to improve initial page load time.`,
      `Reduce animation complexity on \`${element}\` or use CSS transforms instead of layout properties.`,
      `Check for memory leaks or excessive DOM nodes in \`${element}\`.`,
    ],
  };

  const categoryFixes = fixes[category];
  return categoryFixes[Math.floor(Math.random() * categoryFixes.length)];
}

/**
 * Generate code snippet suggestion
 */
function generateCodeSnippet(category: Category, element: string): string | undefined {
  const snippets: Record<Category, string> = {
    accessibility: `// Add to ${element}
<button
  aria-label="Descriptive action label"
  className="focus:ring-2 focus:ring-primary-500 focus:outline-none"
>
  ...
</button>`,
    visual: `// Fix spacing on ${element}
<div className="flex items-center gap-4 p-6">
  ...
</div>`,
    ux: `// Add loading state to ${element}
{isLoading ? (
  <Skeleton className="h-10 w-full" />
) : (
  <Content />
)}`,
    content: undefined,
    performance: `// Memoize ${element}
const MemoizedComponent = React.memo(function ${element.replace(/[^a-zA-Z]/g, '')}() {
  return <div>...</div>;
});`,
  };

  return snippets[category];
}

// =============================================================================
// MAIN FUNCTIONS
// =============================================================================

/**
 * Analyze a single annotation and generate a task
 */
export function analyzeAnnotation(annotation: Annotation): RedesignTask {
  const category = detectCategory(annotation.comment);
  const priority = detectPriority(annotation.comment);
  const type = detectTaskType(annotation.comment);

  return {
    id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    priority,
    category,
    selector: annotation.element,
    issue: annotation.comment,
    suggestedFix: generateSuggestedFix(annotation, category),
    codeSnippet: generateCodeSnippet(category, annotation.element),
    relatedAnnotations: [annotation.id],
  };
}

/**
 * Process all annotations and generate prioritized task list
 */
export function processAnnotations(annotations: Annotation[]): RedesignTask[] {
  const tasks = annotations.map(analyzeAnnotation);

  // Sort by priority
  const priorityOrder: Record<Priority, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Generate summary statistics
 */
export function generateSummary(tasks: RedesignTask[]): string {
  const criticalCount = tasks.filter(t => t.priority === 'critical').length;
  const highCount = tasks.filter(t => t.priority === 'high').length;
  const mediumCount = tasks.filter(t => t.priority === 'medium').length;
  const lowCount = tasks.filter(t => t.priority === 'low').length;

  const categoryBreakdown = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<Category, number>);

  const parts = [
    `Found ${tasks.length} issues from visual feedback.`,
  ];

  if (criticalCount > 0) {
    parts.push(`${criticalCount} CRITICAL issues require immediate attention.`);
  }
  if (highCount > 0) {
    parts.push(`${highCount} high priority issues to address.`);
  }
  if (mediumCount > 0) {
    parts.push(`${mediumCount} medium priority improvements.`);
  }
  if (lowCount > 0) {
    parts.push(`${lowCount} low priority polish items.`);
  }

  const categories = Object.entries(categoryBreakdown)
    .map(([cat, count]) => `${cat}: ${count}`)
    .join(', ');
  parts.push(`Categories: ${categories}.`);

  return parts.join(' ');
}

/**
 * Export for Claude Code consumption
 */
export function exportForClaudeCode(
  annotations: Annotation[],
  projectName: string = '10x-marketing-team',
  pageUrl: string = 'http://localhost:3000'
): ClaudeCodeExport {
  const tasks = processAnnotations(annotations);
  const summary = generateSummary(tasks);

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    project: projectName,
    pageUrl,
    summary,
    annotations,
    tasks,
  };
}

/**
 * Generate Claude Code prompt from export
 */
export function generateClaudeCodePrompt(exportData: ClaudeCodeExport): string {
  const taskList = exportData.tasks
    .map((task, i) => {
      let entry = `${i + 1}. [${task.priority.toUpperCase()}] [${task.category}] ${task.issue}`;
      entry += `\n   Selector: \`${task.selector}\``;
      entry += `\n   Fix: ${task.suggestedFix}`;
      if (task.codeSnippet) {
        entry += `\n   Example:\n\`\`\`tsx\n${task.codeSnippet}\n\`\`\``;
      }
      return entry;
    })
    .join('\n\n');

  return `# Visual Feedback - Redesign Tasks

## Summary
${exportData.summary}

## Project Info
- **Project**: ${exportData.project}
- **Page**: ${exportData.pageUrl}
- **Exported**: ${exportData.exportedAt}
- **Total Tasks**: ${exportData.tasks.length}

## Tasks

${taskList}

---

## Instructions

1. Start with CRITICAL and HIGH priority items
2. Use the provided selectors to locate elements
3. Apply suggested fixes, adapting as needed
4. Verify each fix addresses the original feedback
5. Run accessibility checks after visual changes
6. Test responsive behavior on mobile viewports

When finished, provide a summary of changes made.`;
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  analyzeAnnotation,
  processAnnotations,
  generateSummary,
  exportForClaudeCode,
  generateClaudeCodePrompt,
};
