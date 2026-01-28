#!/usr/bin/env node
/**
 * 10x Marketing Team — Pre-install Environment Check
 * Verifies Node.js version, npm, and platform compatibility before npm install.
 * Cross-platform: Windows, macOS, Linux.
 *
 * This script runs BEFORE npm install (via "preinstall" or "setup" script).
 * It does NOT install Node.js itself — it tells the user exactly what to run.
 */

const os = require('os');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// =============================================================================
// VERSION REQUIREMENTS (pinned — must match package.json engines)
// =============================================================================

const REQUIRED_NODE_MAJOR = 18;
const REQUIRED_NODE_MIN = '18.17.0'; // minimum for Next.js 14
const REQUIRED_NPM_MIN = '9.0.0';

// =============================================================================
// UTILITIES
// =============================================================================

const platform = os.platform(); // 'win32', 'darwin', 'linux'
const arch = os.arch(); // 'x64', 'arm64'

function semverGte(current, minimum) {
  const c = current.replace(/^v/, '').split('.').map(Number);
  const m = minimum.replace(/^v/, '').split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((c[i] || 0) > (m[i] || 0)) return true;
    if ((c[i] || 0) < (m[i] || 0)) return false;
  }
  return true; // equal
}

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return null;
  }
}

function log(icon, msg) {
  console.log(`  ${icon}  ${msg}`);
}

// =============================================================================
// CHECKS
// =============================================================================

let errors = [];
let warnings = [];

console.log('');
console.log('  ╔══════════════════════════════════════════════════╗');
console.log('  ║   10x Marketing Team — Environment Check        ║');
console.log('  ╚══════════════════════════════════════════════════╝');
console.log('');

// --- Platform ---
const platformNames = { win32: 'Windows', darwin: 'macOS', linux: 'Linux' };
log('🖥️ ', `Platform: ${platformNames[platform] || platform} (${arch})`);

// --- Node.js ---
const nodeVersion = process.version;
const nodeMajor = parseInt(nodeVersion.replace('v', '').split('.')[0], 10);
if (nodeMajor < REQUIRED_NODE_MAJOR) {
  log('❌', `Node.js ${nodeVersion} — REQUIRES v${REQUIRED_NODE_MIN}+`);
  errors.push('node');
} else if (!semverGte(nodeVersion, REQUIRED_NODE_MIN)) {
  log('⚠️ ', `Node.js ${nodeVersion} — recommend v${REQUIRED_NODE_MIN}+`);
  warnings.push('node-version');
} else {
  log('✅', `Node.js ${nodeVersion}`);
}

// --- npm ---
const npmVersion = run('npm --version');
if (!npmVersion) {
  log('❌', 'npm not found');
  errors.push('npm');
} else if (!semverGte(npmVersion, REQUIRED_NPM_MIN)) {
  log('⚠️ ', `npm ${npmVersion} — recommend ${REQUIRED_NPM_MIN}+`);
  warnings.push('npm-version');
} else {
  log('✅', `npm ${npmVersion}`);
}

// --- Git ---
const gitVersion = run('git --version');
if (!gitVersion) {
  log('⚠️ ', 'git not found (optional, needed for version control)');
  warnings.push('git');
} else {
  log('✅', gitVersion);
}

// --- Disk space (rough check) ---
try {
  // node_modules + Remotion Chromium can be ~1.5GB
  const freeSpace = os.freemem();
  if (freeSpace < 2 * 1024 * 1024 * 1024) {
    log('⚠️ ', `Low memory: ${Math.round(freeSpace / 1024 / 1024)}MB free — Remotion needs ~2GB`);
    warnings.push('memory');
  }
} catch { /* ignore */ }

// --- .env file ---
const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');
if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    log('📝', 'Creating .env from .env.example...');
    fs.copyFileSync(envExamplePath, envPath);
    log('✅', '.env created');
  } else {
    log('⚠️ ', 'No .env file — will use defaults');
    warnings.push('env');
  }
} else {
  log('✅', '.env exists');
}

// --- public/ directory ---
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  log('📁', 'Created public/ directory (required by Remotion)');
} else {
  log('✅', 'public/ directory exists');
}

// --- output/ subdirectories ---
const outputDirs = ['output', 'output/videos', 'output/images', 'output/compositions', 'output/exports', 'output/assets'];
for (const dir of outputDirs) {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
log('✅', 'output/ directories verified');

// --- out/ directory for renders ---
const outDir = path.join(process.cwd(), 'out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('');

// =============================================================================
// ERROR REPORTING WITH EXACT FIX COMMANDS
// =============================================================================

if (errors.length > 0) {
  console.log('  ╔══════════════════════════════════════════════════╗');
  console.log('  ║   ❌ SETUP CANNOT CONTINUE — Fix these first:   ║');
  console.log('  ╚══════════════════════════════════════════════════╝');
  console.log('');

  if (errors.includes('node')) {
    console.log('  Node.js v18+ is required. Install it:');
    console.log('');

    switch (platform) {
      case 'win32':
        console.log('  Option A — winget (recommended, built into Windows 10/11):');
        console.log('    winget install -e --id OpenJS.NodeJS.LTS');
        console.log('');
        console.log('  Option B — nvm-windows (if you need multiple versions):');
        console.log('    1. Download installer: https://github.com/coreybutler/nvm-windows/releases');
        console.log('    2. Run: nvm install 18.20.4');
        console.log('    3. Run: nvm use 18.20.4');
        console.log('');
        console.log('  Option C — Direct download:');
        console.log('    https://nodejs.org/en/download/');
        break;

      case 'darwin':
        console.log('  Option A — Homebrew (recommended):');
        console.log('    brew install node@18');
        console.log('    brew link --overwrite --force node@18');
        console.log('');
        console.log('  Option B — nvm (if you need multiple versions):');
        console.log('    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash');
        console.log('    source ~/.zshrc');
        console.log('    nvm install 18');
        console.log('    nvm use 18');
        console.log('');
        console.log('  Option C — Direct download:');
        console.log('    https://nodejs.org/en/download/');
        break;

      case 'linux':
        console.log('  Option A — NodeSource (recommended for Debian/Ubuntu):');
        console.log('    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -');
        console.log('    sudo apt-get install -y nodejs');
        console.log('');
        console.log('  Option B — nvm (any distro):');
        console.log('    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash');
        console.log('    source ~/.bashrc');
        console.log('    nvm install 18');
        console.log('    nvm use 18');
        console.log('');
        console.log('  Option C — Fedora/RHEL:');
        console.log('    sudo dnf install nodejs');
        break;
    }
    console.log('');
    console.log('  After installing, restart your terminal and run: npm run setup');
    console.log('');
  }

  process.exit(1);
}

if (warnings.length > 0) {
  console.log('  ⚠️  Warnings (non-blocking):');
  for (const w of warnings) {
    switch (w) {
      case 'node-version':
        console.log(`     Node.js ${nodeVersion} works but v${REQUIRED_NODE_MIN}+ is recommended`);
        break;
      case 'npm-version':
        console.log(`     npm ${npmVersion} works but ${REQUIRED_NPM_MIN}+ is recommended. Run: npm install -g npm@latest`);
        break;
      case 'git':
        console.log('     git is optional but recommended for version control');
        break;
      case 'env':
        console.log('     No .env file — run /10x-setup in Claude to configure');
        break;
      case 'memory':
        console.log('     Low memory — Remotion rendering may be slow');
        break;
    }
  }
  console.log('');
}

// =============================================================================
// REMOTION v4 NOTE
// =============================================================================

console.log('  ╔══════════════════════════════════════════════════╗');
console.log('  ║   ✅ Environment OK — installing packages...    ║');
console.log('  ╚══════════════════════════════════════════════════╝');
console.log('');
console.log('  Note: Remotion v4 bundles FFmpeg automatically.');
console.log('  No separate FFmpeg or Chromium install needed.');
console.log('');
