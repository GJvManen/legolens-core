import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const items = JSON.parse(fs.readFileSync(path.join(root, 'data', 'items.json'), 'utf8'));
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const missing = items.filter(i => !fs.existsSync(path.join(root, 'assets', 'previews', `${i.id}.jpg`))).map(i => i.id);
if (missing.length) throw new Error(`missing preview assets for ${missing.length} items: ${missing.slice(0, 10).join(', ')}`);
for (const needle of ['thumbnail_mode', 'generated_local', 'thumbCandidates', 'generatedPreview']) {
  if (!app.includes(needle)) throw new Error(`preview runtime missing: ${needle}`);
}
console.log(`PASS preview assets test (${items.length} bundled previews)`);
