#!/usr/bin/env node
/**
 * Claude Code PreToolUse hook for Bash (wired in .claude/settings.json).
 * Keeps every Claude session on the development branch: it blocks pushes to
 * main, force pushes, branch deletion, commits made on main and merging pull
 * requests. The person merges the pull request on the GitHub web page.
 */
import { execSync } from 'node:child_process';

let input = '';
process.stdin.setEncoding('utf8');
for await (const chunk of process.stdin) input += chunk;
let cmd = '';
try {
  cmd = JSON.parse(input).tool_input?.command ?? '';
} catch {
  process.exit(0);
}

const block = (msg) => {
  console.error(`BLOCKED by scripts/claude/guard.mjs: ${msg}`);
  process.exit(2);
};
const branch = () => {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
};
const MERGE_ON_WEB =
  'Push to development, then tell the user to open https://github.com/AI-DA-STC/nearlab/compare/main...development (or the open pull request) and merge it there.';

if (/\bgh\s+pr\s+merge\b/.test(cmd)) block(`Claude does not merge pull requests. ${MERGE_ON_WEB}`);

if (/\bgit\s+push\b/.test(cmd)) {
  if (/\bgit\s+push\b[^\n;&|]*\s(--force|-f|--force-with-lease)\b/.test(cmd)) block('force pushes are not allowed.');
  if (/\bgit\s+push\b[^\n;&|]*(\s--delete\b|\s-d\b|\s:[\w/-]+)/.test(cmd)) block('deleting branches is not allowed.');
  if (/\bgit\s+push\b[^\n;&|]*\bmain\b/.test(cmd)) block(`pushing to main is not allowed. ${MERGE_ON_WEB}`);
  if (branch() === 'main') block(`you are on main. Run \`git switch development\` first. ${MERGE_ON_WEB}`);
}
if (/\bgit\s+commit\b/.test(cmd) && branch() === 'main')
  block('do not commit on main. Run `git switch development`, then bring it up to date with `git merge origin/main`.');
if (/\bgit\s+(reset\s+--hard|clean\s+-[a-z]*f)/.test(cmd)) block('destructive git commands are for the user to run.');
process.exit(0);
