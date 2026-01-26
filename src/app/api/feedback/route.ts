import { NextRequest, NextResponse } from 'next/server';
import { exportForClaudeCode, generateClaudeCodePrompt, type Annotation } from '@/lib/agentation-claude';

// POST /api/feedback - Process annotations and generate Claude Code tasks
export async function POST(request: NextRequest) {
  try {
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

    // Generate export data
    const exportData = exportForClaudeCode(
      annotations,
      projectName || '10x-marketing-team',
      pageUrl || request.headers.get('referer') || 'http://localhost:3000'
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
