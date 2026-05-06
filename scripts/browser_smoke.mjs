import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app_v3.js', 'utf8');

const checks = [
  ['v3 title', html.includes('LegoLens Core v3.0.0')],
  ['v3 script loaded', html.includes('app_v3.js')],
  ['overview section', app.includes('Overview')],
  ['content updates section', app.includes('Content Updates')],
  ['media library section', app.includes('Media Library')],
  ['graph stats section', app.includes('Graph Stats')],
  ['reports section', app.includes('Reports')],
  ['admin settings section', app.includes('Admin Settings')],
  ['run all endpoint', app.includes('/api/ingestion/run-all')]
];

const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
if (failed.length) {
  console.error('FAIL v3.0.0 static browser/layout smoke:', failed.join(', '));
  process.exit(1);
}

console.log('PASS v3.0.0 static browser/layout smoke');
