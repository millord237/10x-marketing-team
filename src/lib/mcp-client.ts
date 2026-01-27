/**
 * MCP Client — connects to external MCP servers configured in mcp-servers.json
 *
 * Skills can use this to:
 * - Call tools from any connected MCP server
 * - Read resources exposed by MCP servers
 * - Fetch prompt templates from MCP servers
 *
 * Usage:
 *   import { mcpClient } from '@/lib/mcp-client';
 *   await mcpClient.initialize();
 *   const result = await mcpClient.callTool('filesystem', 'read_file', { path: './output/video.mp4' });
 *   const resource = await mcpClient.readResource('filesystem', 'file:///output/videos');
 *   const prompt = await mcpClient.getPrompt('github', 'create-issue', { title: 'Bug fix' });
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ─── Config Types ────────────────────────────────────────────────────────────

interface McpServerConfig {
  command: string;
  args?: string[];
  env?: Record<string, string>;
  description?: string;
  enabled?: boolean;
}

interface McpServersFile {
  servers: Record<string, McpServerConfig>;
}

interface ConnectedServer {
  config: McpServerConfig;
  client: Client;
  transport: StdioClientTransport;
}

// ─── MCP Client Manager ─────────────────────────────────────────────────────

class McpClientManager {
  private connections = new Map<string, ConnectedServer>();
  private initialized = false;
  private configPath: string;

  constructor() {
    this.configPath = resolve(process.cwd(), 'mcp-servers.json');
  }

  /**
   * Load config and connect to all enabled MCP servers
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    const config = this.loadConfig();
    const entries = Object.entries(config.servers).filter(
      ([, cfg]) => cfg.enabled !== false
    );

    const results = await Promise.allSettled(
      entries.map(([name, cfg]) => this.connectServer(name, cfg))
    );

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const name = entries[i][0];
      if (result.status === 'rejected') {
        console.error(`[MCP] Failed to connect to "${name}":`, result.reason);
      }
    }

    this.initialized = true;
    console.log(
      `[MCP] Initialized with ${this.connections.size}/${entries.length} servers connected`
    );
  }

  private loadConfig(): McpServersFile {
    try {
      const raw = readFileSync(this.configPath, 'utf-8');
      return JSON.parse(raw);
    } catch {
      console.warn(`[MCP] No mcp-servers.json found at ${this.configPath}, using empty config`);
      return { servers: {} };
    }
  }

  private async connectServer(name: string, config: McpServerConfig): Promise<void> {
    const env: Record<string, string> = {
      ...process.env as Record<string, string>,
      ...(config.env || {}),
    };

    const transport = new StdioClientTransport({
      command: config.command,
      args: config.args,
      env,
    });

    const client = new Client(
      { name: `10x-marketing/${name}`, version: '1.0.0' },
      { capabilities: {} }
    );

    await client.connect(transport);
    this.connections.set(name, { config, client, transport });
    console.log(`[MCP] Connected to "${name}" (${config.description || config.command})`);
  }

  // ─── Tools ──────────────────────────────────────────────────────────────

  /**
   * Call a tool on a specific MCP server
   */
  async callTool(
    serverName: string,
    toolName: string,
    args: Record<string, unknown> = {}
  ): Promise<unknown> {
    const conn = this.getConnection(serverName);
    const result = await conn.client.callTool({ name: toolName, arguments: args });
    return result;
  }

  /**
   * List all tools available on a specific server
   */
  async listTools(serverName: string): Promise<{ name: string; description?: string }[]> {
    const conn = this.getConnection(serverName);
    const result = await conn.client.listTools();
    return result.tools.map((t) => ({ name: t.name, description: t.description }));
  }

  /**
   * List all tools across all connected servers
   */
  async listAllTools(): Promise<{ server: string; name: string; description?: string }[]> {
    const all: { server: string; name: string; description?: string }[] = [];
    for (const [serverName] of this.connections) {
      try {
        const tools = await this.listTools(serverName);
        for (const t of tools) {
          all.push({ server: serverName, ...t });
        }
      } catch {
        // server may not support tools
      }
    }
    return all;
  }

  // ─── Resources ──────────────────────────────────────────────────────────

  /**
   * Read a resource from a specific MCP server
   */
  async readResource(serverName: string, uri: string): Promise<unknown> {
    const conn = this.getConnection(serverName);
    const result = await conn.client.readResource({ uri });
    return result;
  }

  /**
   * List resources available on a specific server
   */
  async listResources(serverName: string): Promise<{ uri: string; name?: string }[]> {
    const conn = this.getConnection(serverName);
    const result = await conn.client.listResources();
    return result.resources.map((r) => ({ uri: r.uri, name: r.name }));
  }

  /**
   * List all resources across all connected servers
   */
  async listAllResources(): Promise<{ server: string; uri: string; name?: string }[]> {
    const all: { server: string; uri: string; name?: string }[] = [];
    for (const [serverName] of this.connections) {
      try {
        const resources = await this.listResources(serverName);
        for (const r of resources) {
          all.push({ server: serverName, ...r });
        }
      } catch {
        // server may not support resources
      }
    }
    return all;
  }

  // ─── Prompts ────────────────────────────────────────────────────────────

  /**
   * Get a prompt from a specific MCP server
   */
  async getPrompt(
    serverName: string,
    promptName: string,
    args: Record<string, string> = {}
  ): Promise<unknown> {
    const conn = this.getConnection(serverName);
    const result = await conn.client.getPrompt({ name: promptName, arguments: args });
    return result;
  }

  /**
   * List prompts available on a specific server
   */
  async listPrompts(serverName: string): Promise<{ name: string; description?: string }[]> {
    const conn = this.getConnection(serverName);
    const result = await conn.client.listPrompts();
    return result.prompts.map((p) => ({ name: p.name, description: p.description }));
  }

  /**
   * List all prompts across all connected servers
   */
  async listAllPrompts(): Promise<{ server: string; name: string; description?: string }[]> {
    const all: { server: string; name: string; description?: string }[] = [];
    for (const [serverName] of this.connections) {
      try {
        const prompts = await this.listPrompts(serverName);
        for (const p of prompts) {
          all.push({ server: serverName, ...p });
        }
      } catch {
        // server may not support prompts
      }
    }
    return all;
  }

  // ─── Server Management ─────────────────────────────────────────────────

  /**
   * Get list of connected server names
   */
  getConnectedServers(): string[] {
    return [...this.connections.keys()];
  }

  /**
   * Check if a specific server is connected
   */
  isConnected(serverName: string): boolean {
    return this.connections.has(serverName);
  }

  /**
   * Dynamically connect a new server at runtime (not from config file)
   */
  async addServer(name: string, config: McpServerConfig): Promise<void> {
    if (this.connections.has(name)) {
      throw new Error(`Server "${name}" is already connected`);
    }
    await this.connectServer(name, config);
  }

  /**
   * Disconnect a specific server
   */
  async disconnectServer(name: string): Promise<void> {
    const conn = this.connections.get(name);
    if (!conn) return;
    await conn.client.close();
    this.connections.delete(name);
    console.log(`[MCP] Disconnected from "${name}"`);
  }

  /**
   * Disconnect all servers and reset
   */
  async shutdown(): Promise<void> {
    for (const [name] of this.connections) {
      await this.disconnectServer(name);
    }
    this.initialized = false;
  }

  private getConnection(serverName: string): ConnectedServer {
    const conn = this.connections.get(serverName);
    if (!conn) {
      throw new Error(
        `MCP server "${serverName}" is not connected. Connected: [${this.getConnectedServers().join(', ')}]`
      );
    }
    return conn;
  }
}

// Singleton export
export const mcpClient = new McpClientManager();
