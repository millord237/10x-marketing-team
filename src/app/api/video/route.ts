import { NextRequest, NextResponse } from 'next/server';
import {
  generateVideo,
  SocialVideoInputSchema,
  ProductDemoInputSchema,
  AdCreativeInputSchema,
  generateContentSuggestions,
} from '@/skills/video-generator';

const MAX_VIDEO_BODY_SIZE = 64 * 1024; // 64KB is generous for video config

// POST /api/video - Generate video configuration
export async function POST(request: NextRequest) {
  try {
    // Reject oversized payloads
    const contentLength = parseInt(request.headers.get('content-length') || '0');
    if (contentLength > MAX_VIDEO_BODY_SIZE) {
      return NextResponse.json(
        { error: 'Request body too large' },
        { status: 413 }
      );
    }

    const body = await request.json();
    const { type } = body;

    let validatedInput;

    // Validate based on video type
    switch (type) {
      case 'social':
        validatedInput = SocialVideoInputSchema.parse(body);
        break;
      case 'demo':
        validatedInput = ProductDemoInputSchema.parse(body);
        break;
      case 'ad':
        validatedInput = AdCreativeInputSchema.parse(body);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid video type. Must be: social, demo, or ad' },
          { status: 400 }
        );
    }

    // Generate video configuration
    const result = await generateVideo(validatedInput);

    // result already contains success: true, return directly
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }

    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate video' },
      { status: 500 }
    );
  }
}

// GET /api/video/suggestions - Get content suggestions
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic') || 'marketing';
  const type = (searchParams.get('type') || 'social') as 'social' | 'demo' | 'ad';

  const suggestions = generateContentSuggestions(topic, type);

  return NextResponse.json({
    success: true,
    topic,
    type,
    suggestions,
  });
}
