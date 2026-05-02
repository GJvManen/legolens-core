
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(process.cwd());
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const html = fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const js = fs.readFileSync(path.join(ROOT,'app.js'),'utf8');
const data = read('data/qa_report.json');
const gate = read('data/release_gate_v94.json');
let failures = [];
for (const [k,v] of Object.entries(gate.blocking_checks)) if(!v) failures.push(k);
for (const id of ['dashboard','updates','content','admin','tests','database','evidence-workbench','analysis','monitoring','reliability','claims','infrastructure']) {
  if(!html.includes(`id="${id}"`)) failures.push(`missing section ${id}`);
}
for (const needle of ['stagePackage','applyStaged','renderClaims','renderInfrastructure','renderTests']) {
  if(!js.includes(needle)) failures.push(`missing js ${needle}`);
}
if (data.metrics.items !== 476) failures.push('item count changed');
if (data.metrics.needs_review_families !== 5) failures.push('needs_review family count changed');
if (failures.length) { console.error('Release gate failed:', failures); process.exit(1); }
console.log('Release gate passed: v94');
