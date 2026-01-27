import { NextRequest, NextResponse } from 'next/server';
import { mcpClient } from '@/lib/mcp-client';

// GET /api/mcp — List all connected servers + their tools/resources/prompts
export async function GET() {
  try {
    await mcpClient.initialize();

    const servers = mcpClient.getConnectedServers();
    const [tools, resources, prompts] = await Promise.all([
      mcpClient.listAllTools(),
      mcpClient.listAllResources(),
      mcpClient.listAllPrompts(),
    ]);

    return NextResponse.json({
      status: 'ok',
      servers,
      tools,
      resources,
      prompts,
    });
  } catch (error) {
    console.error('[MCP API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to query MCP servers' },
      { status: 500 }
    );
  }
}

// POST /api/mcp — Call a tool, read a resource, or get a prompt
export async function POST(request: NextRequest) {
  try {
    await mcpClient.initialize();

    const body = await request.json();
    const { action, server, name, args } = body as {
      action: 'call_tool' | 'read_resource' | 'get_prompt';
      server: string;
      name: string;
      args?: Record<string, unknown>;
    };

    if (!action || !server || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: action, server, name' },
        { status: 400 }
      );
    }

    if (!mcpClient.isConnected(server)) {
      return NextResponse.json(
        { error: `Server "${server}" is not connected`, connected: mcpClient.getConnectedServers() },
        { status: 404 }
      );
    }

    let result: unknown;

    switch (action) {
      case 'call_tool':
        result = await mcpClient.callTool(server, name, (args || {}) as Record<string, unknown>);
        break;
      case 'read_resource':
        result = await mcpClient.readResource(server, name);
        break;
      case 'get_prompt':
        result = await mcpClient.getPrompt(server, name, (args || {}) as Record<string, string>);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action. Must be: call_tool, read_resource, get_prompt' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[MCP API] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
