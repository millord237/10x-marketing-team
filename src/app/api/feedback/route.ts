import { NextRequest, NextResponse } from 'next/server';
import { exportForClaudeCode, generateClaudeCodePrompt, type Annotation } from '@/lib/agentation-claude';

const MAX_BODY_SIZE = 1024 * 1024; // 1MB
const MAX_ANNOTATIONS = 50;
const MAX_PROJECT_NAME_LENGTH = 100;

// POST /api/feedback - Process annotations and generate Claude Code tasks
export async function POST(request: NextRequest) {
  try {
    // Check content length to prevent DoS
    const contentLength = parseInt(request.headers.get('content-length') || '0');
    if (contentLength > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: 'Request body too large (max 1MB)' },
        { status: 413 }
      );
    }

    const body = await request.json();
    const { annotations, projectName, pageUrl } = body as {
      annotations: Annotation[];
      projectName?: string;
      pageUrl?: string;
    };

    if (!annotations || !Array.isArray(annotations)) {
      return NextResponse.json(
        { error: 'Invalid annotations array' },
        { status: 400 }
      );
    }

    if (annotations.length > MAX_ANNOTATIONS) {
      return NextResponse.json(
        { error: `Too many annotations (max ${MAX_ANNOTATIONS})` },
        { status: 400 }
      );
    }

    // Sanitize projectName — no path separators or special chars
    const safeProjectName = (projectName || '10x-marketing-team')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, MAX_PROJECT_NAME_LENGTH);

    // Validate pageUrl if provided — only allow http/https
    let safePageUrl = 'http://localhost:3000';
    if (pageUrl) {
      try {
        const parsed = new URL(pageUrl);
        if (['http:', 'https:'].includes(parsed.protocol)) {
          safePageUrl = pageUrl;
        }
      } catch {
        // invalid URL, use default
      }
    } else {
      safePageUrl = request.headers.get('referer') || 'http://localhost:3000';
    }

    // Generate export data
    const exportData = exportForClaudeCode(
      annotations,
      safeProjectName,
      safePageUrl
    );

    // Generate Claude Code prompt
    const prompt = generateClaudeCodePrompt(exportData);

    return NextResponse.json({
      success: true,
      exportData,
      prompt,
      taskCount: exportData.tasks.length,
      criticalCount: exportData.tasks.filter(t => t.priority === 'critical').length,
    });
  } catch (error) {
    console.error('Feedback processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process feedback' },
      { status: 500 }
    );
  }
}

// GET /api/feedback - Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Agentation Feedback Integration',
    version: '1.0.0',
    capabilities: [
      'annotation-processing',
      'task-generation',
      'claude-code-export',
    ],
  });
}
