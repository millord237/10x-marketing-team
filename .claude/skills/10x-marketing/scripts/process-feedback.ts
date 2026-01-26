#!/usr/bin/env npx ts-node
/**
 * 10x Marketing Team - Feedback Processing Script
 *
 * Processes Agentation feedback JSON and generates Claude Code tasks.
 *
 * Usage:
 *   npx ts-node scripts/process-feedback.ts --input feedback.json
 *   npx ts-node scripts/process-feedback.ts --input feedback.json --output tasks.md
 */

import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// TYPES (duplicated from feedback-handler.ts for standalone use)
// =============================================================================

interface Annotation {
  id: string;
  element: string;
  comment: string;
  timestamp: string;
  viewport: { x: number; y: number; width: number; height: number };
  boundingBox: { x: number; y: number; width: number; height: number };
  metadata?: {
    cssClass?: string;
    accessibilityInfo?: string;
    computedStyles?: Record<string, string>;
  };
}

type Priority = 'critical' | 'high' | 'medium' | 'low';
type Category = 'ux' | 'accessibility' | 'visual' | 'content' | 'performance';
type TaskType = 'fix' | 'improve' | 'refactor' | 'add';

interface RedesignTask {
  id: string;
  type: TaskType;
  priority: Priority;
  category: Category;
  selector: string;
  issue: string;
  suggestedFix: string;
}

// =============================================================================
// ARGUMENT PARSING
// =============================================================================

function parseArgs(): { input: string; output?: string } {
  const args = process.argv.slice(2);
  const parsed: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : '';
      parsed[key] = value;
      if (value) i++;
    }
  }

  if (!parsed.input) {
    console.error('Error: --input <file.json> is required');
    console.error('Usage: npx ts-node process-feedback.ts --input feedback.json [--output tasks.md]');
    process.exit(1);
  }

  return {
    input: parsed.input,
    output: parsed.output,
  };
}

// =============================================================================
// ANALYSIS FUNCTIONS
// =============================================================================

const KEYWORD_PATTERNS: Record<Category, string[]> = {
  ux: ['confusing', 'unclear', 'hard to', 'difficult', "can't find", 'flow', 'navigation'],
  accessibility: ['contrast', 'readable', 'small', 'tiny', "can't see", 'screen reader', 'keyboard'],
  visual: ['color', 'spacing', 'align', 'margin', 'padding', 'font', 'layout', 'design'],
  content: ['text', 'copy', 'message', 'wording', 'typo', 'spelling', 'grammar'],
  performance: ['slow', 'loading', 'lag', 'freeze', 'animation', 'scroll'],
};

const PRIORITY_PATTERNS: Record<Priority, string[]> = {
  critical: ['broken', 'bug', 'error', 'crash', 'not working', "can't", 'blocked'],
  high: ['urgent', 'important', 'must', 'need', 'required'],
  medium: ['should', 'would be nice', 'consider'],
  low: ['minor', 'small', 'nitpick', 'polish'],
};

function detectCategory(comment: string): Category {
  const lower = comment.toLowerCase();
  for (const [cat, keywords] of Object.entries(KEYWORD_PATTERNS)) {
    if (keywords.some(k => lower.includes(k))) return cat as Category;
  }
  return 'visual';
}

function detectPriority(comment: string): Priority {
  const lower = comment.toLowerCase();
  for (const [pri, keywords] of Object.entries(PRIORITY_PATTERNS)) {
    if (keywords.some(k => lower.includes(k))) return pri as Priority;
  }
  return 'medium';
}

function detectTaskType(comment: string): TaskType {
  const lower = comment.toLowerCase();
  if (lower.includes('add') || lower.includes('need') || lower.includes('missing')) return 'add';
  if (lower.includes('broken') || lower.includes('fix') || lower.includes('bug')) return 'fix';
  if (lower.includes('refactor') || lower.includes('clean up')) return 'refactor';
  return 'improve';
}

function generateSuggestedFix(annotation: Annotation, category: Category): string {
  const fixes: Record<Category, string> = {
    ux: `Review interaction on \`${annotation.element}\`. Add visual feedback or clearer affordances.`,
    accessibility: `Check contrast/size on \`${annotation.element}\`. Ensure WCAG 2.1 AA compliance.`,
    visual: `Apply consistent spacing/alignment to \`${annotation.element}\` using design tokens.`,
    content: `Rewrite copy on \`${annotation.element}\` to be clearer and more action-oriented.`,
    performance: `Optimize \`${annotation.element}\` rendering. Consider memoization or lazy loading.`,
  };
  return fixes[category];
}

function analyzeAnnotation(annotation: Annotation): RedesignTask {
  const category = detectCategory(annotation.comment);
  return {
    id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: detectTaskType(annotation.comment),
    priority: detectPriority(annotation.comment),
    category,
    selector: annotation.element,
    issue: annotation.comment,
    suggestedFix: generateSuggestedFix(annotation, category),
  };
}

// =============================================================================
// OUTPUT GENERATION
// =============================================================================

function generateMarkdown(annotations: Annotation[], tasks: RedesignTask[]): string {
  const criticalCount = tasks.filter(t => t.priority === 'critical').length;
  const highCount = tasks.filter(t => t.priority === 'high').length;

  let md = `# Visual Feedback - Redesign Tasks

Generated: ${new Date().toISOString()}
Total Annotations: ${annotations.length}
Total Tasks: ${tasks.length}

## Summary

`;

  if (criticalCount > 0) md += `- **${criticalCount} CRITICAL** issues require immediate attention\n`;
  if (highCount > 0) md += `- **${highCount} HIGH** priority issues to address\n`;
  md += `- ${tasks.length - criticalCount - highCount} other improvements\n\n`;

  md += `## Tasks\n\n`;

  const priorityOrder: Priority[] = ['critical', 'high', 'medium', 'low'];

  for (const priority of priorityOrder) {
    const priorityTasks = tasks.filter(t => t.priority === priority);
    if (priorityTasks.length === 0) continue;

    md += `### ${priority.toUpperCase()} Priority\n\n`;

    for (const task of priorityTasks) {
      md += `#### [${task.category.toUpperCase()}] ${task.issue}\n\n`;
      md += `- **Element:** \`${task.selector}\`\n`;
      md += `- **Type:** ${task.type}\n`;
      md += `- **Fix:** ${task.suggestedFix}\n\n`;
    }
  }

  md += `---

## Instructions for Claude Code

1. Start with CRITICAL and HIGH priority items
2. Use the provided selectors to locate elements
3. Apply suggested fixes, adapting as needed
4. Verify each fix addresses the original feedback
5. Run accessibility checks after changes
6. Test on mobile viewports
`;

  return md;
}

// =============================================================================
// MAIN
// =============================================================================

function main() {
  console.log('📋 10x Marketing Team - Feedback Processor\n');

  const args = parseArgs();

  // Read input file
  const inputPath = path.resolve(args.input);
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found: ${inputPath}`);
    process.exit(1);
  }

  console.log(`Reading: ${inputPath}`);
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  // Extract annotations (handle both raw array and wrapped format)
  const annotations: Annotation[] = Array.isArray(data) ? data : data.annotations || [];

  console.log(`Found ${annotations.length} annotations\n`);

  // Process annotations
  const tasks = annotations.map(analyzeAnnotation);

  // Sort by priority
  const priorityOrder: Record<Priority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Generate output
  const markdown = generateMarkdown(annotations, tasks);

  // Output
  if (args.output) {
    const outputPath = path.resolve(args.output);
    fs.writeFileSync(outputPath, markdown);
    console.log(`✅ Tasks saved to: ${outputPath}`);
  } else {
    console.log(markdown);
  }

  // Summary
  console.log('\n📊 Summary:');
  console.log(`   Critical: ${tasks.filter(t => t.priority === 'critical').length}`);
  console.log(`   High: ${tasks.filter(t => t.priority === 'high').length}`);
  console.log(`   Medium: ${tasks.filter(t => t.priority === 'medium').length}`);
  console.log(`   Low: ${tasks.filter(t => t.priority === 'low').length}`);
}

main();
