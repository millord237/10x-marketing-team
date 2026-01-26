#!/usr/bin/env node
// 10x Marketing Team - Statusline (Cross-platform)
// Developed by 10x.in - https://10x.in

const readline = require('readline');

// Read all input from stdin
let input = '';

process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
  input += chunk;
});

process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);

    // Extract values with defaults
    const modelDisplay = data?.model?.display_name || 'Claude';
    const currentDir = data?.workspace?.current_dir || '.';
    const cost = data?.cost?.total_cost_usd || 0;
    const percentUsed = data?.context_window?.used_percentage || 0;

    // Format values
    const dirName = currentDir.split(/[\\/]/).pop() || currentDir;
    const costFormatted = cost.toFixed(4);
    const percentFormatted = percentUsed.toFixed(1);

    // ANSI color codes
    const ORANGE = '\x1b[38;5;208m';
    const CYAN = '\x1b[38;5;51m';
    const GREEN = '\x1b[38;5;82m';
    const MAGENTA = '\x1b[38;5;201m';
    const BOLD = '\x1b[1m';
    const RESET = '\x1b[0m';

    // Build status line
    console.log(
      `${ORANGE}${BOLD}🔥 10x Marketing${RESET} | ` +
      `${CYAN}${modelDisplay}${RESET} | ` +
      `${GREEN}📁 ${dirName}${RESET} | ` +
      `${MAGENTA}💰 $${costFormatted}${RESET} | ` +
      `📊 ${percentFormatted}%`
    );
  } catch (e) {
    // Fallback if JSON parsing fails
    console.log('🔥 10x Marketing | Ready');
  }
});

// Handle empty input
process.stdin.on('close', () => {
  if (!input) {
    console.log('🔥 10x Marketing | Ready');
  }
});
