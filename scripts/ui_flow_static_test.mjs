import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('app_v3.js', 'utf8');

const checks = [
  ['root app container', html.includes('id="app"') || html.includes("id='app'")],
  ['v3 app entrypoint', html.includes('app_v3.js')],
  ['Content Updates UI', /content[- ]updates/i.test(app)],
  ['Media Library UI', /media[- ]library/i.test(app)],
  ['Graph Stats UI', /graph[- ]stats/i.test(app)],
  ['Legacy Import UI', /legacy[- ]import/i.test(app)],
  ['Admin Settings UI', /admin[- ]settings/i.test(app)],
  ['run-all sync handler', /run-all/i.test(app)]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  console.error('FAIL UI static test:', failed.map(([name]) => name).join(', '));
  process.exit(1);
}

console.log('PASS UI static test');
