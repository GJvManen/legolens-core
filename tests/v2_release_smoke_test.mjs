import fs from 'node:fs';

const required = [
  'README.md',
  'package.json',
  'index.html',
  'data/version.json',
  'docs/RELEASE_V2_0.md',
  'case-packs/index.json'
];

for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`Missing v2 smoke-test file: ${file}`);
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (pkg.version !== '2.0.0') throw new Error('package.json is not v2.0.0');

const version = JSON.parse(fs.readFileSync('data/version.json', 'utf8'));
if (version.release !== 'v2.0.0') throw new Error('data/version.json release is not v2.0.0');

const html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('data/bootstrap.js')) throw new Error('index.html missing bootstrap script');
if (!html.includes('app.js')) throw new Error('index.html missing app script');

console.log('PASS v2 release smoke test');
