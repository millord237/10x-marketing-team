#!/usr/bin/env node
/**
 * 10x Marketing Team - Port Manager
 * Cross-platform utility to check, free, and find available ports.
 * Works on Windows, macOS, and Linux.
 *
 * Usage:
 *   node scripts/port-manager.js check <port>       - Check if port is in use
 *   node scripts/port-manager.js free <port>         - Kill process on port
 *   node scripts/port-manager.js find <startPort>    - Find next available port
 *   node scripts/port-manager.js start-studio        - Free port & start Remotion Studio
 *   node scripts/port-manager.js start-dev           - Free port & start Next.js dev
 *   node scripts/port-manager.js start-all           - Start both services
 */

const { execSync, spawn } = require('child_process');
const net = require('net');
const os = require('os');

const REMOTION_STUDIO_PORT = parseInt(process.env.REMOTION_STUDIO_PORT || '3000', 10);
const NEXTJS_DEV_PORT = parseInt(process.env.NEXTJS_DEV_PORT || '3001', 10);
const isWindows = os.platform() === 'win32';

// Check if a port is in use
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(true));
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(port, '127.0.0.1');
  });
}

// Find the next available port starting from a given port
async function findAvailablePort(startPort) {
  let port = startPort;
  while (port < startPort + 20) {
    const inUse = await isPortInUse(port);
    if (!inUse) return port;
    port++;
  }
  throw new Error(`No available port found in range ${startPort}-${startPort + 19}`);
}

// Kill process on a specific port
function freePort(port) {
  try {
    if (isWindows) {
      // Find PID using netstat on Windows
      const output = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      const lines = output.trim().split('\n');
      const pids = new Set();
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0') pids.add(pid);
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /PID ${pid} /F`, { stdio: 'pipe' });
          console.log(`Killed process ${pid} on port ${port}`);
        } catch {
          // Process may have already exited
        }
      }
    } else {
      // macOS / Linux
      try {
        const output = execSync(`lsof -ti :${port}`, {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'],
        });
        const pids = output.trim().split('\n').filter(Boolean);
        for (const pid of pids) {
          try {
            execSync(`kill -9 ${pid}`, { stdio: 'pipe' });
            console.log(`Killed process ${pid} on port ${port}`);
          } catch {
            // Process may have already exited
          }
        }
      } catch {
        // No process on port
      }
    }
  } catch {
    // Port is already free
  }
}

// Start a service on a port, freeing it first if needed
async function startService(name, command, args, preferredPort) {
  const inUse = await isPortInUse(preferredPort);

  if (inUse) {
    console.log(`Port ${preferredPort} is in use. Attempting to free it...`);
    freePort(preferredPort);

    // Wait a moment for the port to be released
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const stillInUse = await isPortInUse(preferredPort);
    if (stillInUse) {
      const nextPort = await findAvailablePort(preferredPort + 1);
      console.log(`Port ${preferredPort} still in use. Using port ${nextPort} instead.`);
      return { port: nextPort, freed: false };
    }
  }

  console.log(`Port ${preferredPort} is available for ${name}.`);
  return { port: preferredPort, freed: true };
}

// Main CLI handler
async function main() {
  const [, , action, ...rest] = process.argv;

  switch (action) {
    case 'check': {
      const port = parseInt(rest[0], 10);
      if (!port) { console.error('Usage: port-manager.js check <port>'); process.exit(1); }
      const inUse = await isPortInUse(port);
      console.log(`Port ${port}: ${inUse ? 'IN USE' : 'AVAILABLE'}`);
      process.exit(inUse ? 1 : 0);
    }

    case 'free': {
      const port = parseInt(rest[0], 10);
      if (!port) { console.error('Usage: port-manager.js free <port>'); process.exit(1); }
      freePort(port);
      console.log(`Port ${port} freed.`);
      break;
    }

    case 'find': {
      const startPort = parseInt(rest[0] || '3000', 10);
      const available = await findAvailablePort(startPort);
      console.log(available);
      break;
    }

    case 'start-studio': {
      const result = await startService('Remotion Studio', 'remotion', ['studio'], REMOTION_STUDIO_PORT);
      const child = spawn('npx', ['remotion', 'studio', 'src/remotion/index.ts', '--port', String(result.port)], {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd(),
      });
      child.on('exit', (code) => process.exit(code || 0));
      break;
    }

    case 'start-dev': {
      const result = await startService('Next.js Dev', 'next', ['dev'], NEXTJS_DEV_PORT);
      const child = spawn('npx', ['next', 'dev', '--port', String(result.port)], {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd(),
      });
      child.on('exit', (code) => process.exit(code || 0));
      break;
    }

    case 'start-all': {
      // Free both ports
      const studioResult = await startService('Remotion Studio', 'remotion', ['studio'], REMOTION_STUDIO_PORT);
      const devResult = await startService('Next.js Dev', 'next', ['dev'], NEXTJS_DEV_PORT);

      console.log(`\nStarting services:`);
      console.log(`  Remotion Studio: http://localhost:${studioResult.port}`);
      console.log(`  Next.js Dashboard: http://localhost:${devResult.port}\n`);

      const studio = spawn('npx', ['remotion', 'studio', 'src/remotion/index.ts', '--port', String(studioResult.port)], {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd(),
      });

      // Small delay so studio starts first
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const dev = spawn('npx', ['next', 'dev', '--port', String(devResult.port)], {
        stdio: 'inherit',
        shell: true,
        cwd: process.cwd(),
      });

      process.on('SIGINT', () => {
        studio.kill();
        dev.kill();
        process.exit(0);
      });
      break;
    }

    default:
      console.log(`10x Port Manager - Cross-platform port management

Usage:
  node scripts/port-manager.js check <port>     Check if port is in use
  node scripts/port-manager.js free <port>       Kill process on port
  node scripts/port-manager.js find <startPort>  Find next available port
  node scripts/port-manager.js start-studio      Free port & start Remotion Studio
  node scripts/port-manager.js start-dev         Free port & start Next.js dev
  node scripts/port-manager.js start-all         Start both services

Environment variables:
  REMOTION_STUDIO_PORT  (default: 3000)
  NEXTJS_DEV_PORT       (default: 3001)`);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
