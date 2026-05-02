import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const dataDir = path.join(root, 'data');
const data = {};
for (const file of fs.readdirSync(dataDir).filter(f => f.endsWith('.json')).sort()) {
  data[path.basename(file, '.json')] = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
}
let assets = {hero: [], fallback: 'assets/fallback.jpg', screenshots: []};
for (const file of fs.readdirSync(path.join(root, 'assets')).filter(f => /^hero_.*\.jpg$/.test(f)).sort()) assets.hero.push('assets/' + file);
const shots = path.join(root, 'docs', 'screenshots');
if (fs.existsSync(shots)) for (const file of fs.readdirSync(shots).filter(f => /\.(png|jpg|jpeg)$/i.test(f)).sort()) assets.screenshots.push('docs/screenshots/' + file);
const payload = {schema_version: 'legolens.bootstrap.v1', generated_at: new Date().toISOString(), data, assets};
fs.writeFileSync(path.join(dataDir, 'bootstrap.js'), 'window.LEGOLENS_BOOTSTRAP = ' + JSON.stringify(payload) + ';\n');
console.log(`Wrote data/bootstrap.js with ${Object.keys(data).length} data entries`);
