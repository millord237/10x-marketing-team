/**
 * Shared Agentation Types
 * Used by agentation-claude integration
 */

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

export interface AIAnalysis {
  issue: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'ux' | 'accessibility' | 'performance' | 'visual' | 'content';
  suggestedFix: string;
  codeSnippet?: string;
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

export interface FeedbackSession {
  id: string;
  startedAt: Date;
  annotations: Annotation[];
  isActive: boolean;
}
