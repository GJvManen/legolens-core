import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const blockedExtensions = new Set(['.zip', '.docx', '.pptx', '.pdf', '.sqlite', '.db']);
const blockedNamePatterns = [/social/i, /campaign/i, /pitch/i];
const allowedLegacyMediaDirs = ['assets/', 'docs/screenshots/'];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = walk(root);
const offenders = files.filter((file) => {
  const rel = path.relative(root, file).split(path.sep).join('/');
  const ext = path.extname(file).toLowerCase();
  if (allowedLegacyMediaDirs.some((prefix) => rel.startsWith(prefix))) return false;
  if (blockedExtensions.has(ext)) return true;
  return blockedNamePatterns.some((pattern) => pattern.test(rel));
});

if (offenders.length) {
  console.error('Publication audit failed. Blocked publication files detected:');
  for (const file of offenders) console.error('-', path.relative(root, file));
  process.exit(1);
}

console.log('PASS publication audit test');
