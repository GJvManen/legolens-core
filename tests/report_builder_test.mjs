import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const rt=JSON.parse(fs.readFileSync(path.join(root,'data','report_export_runtime_v120.json'),'utf8'));
const js=fs.readFileSync(path.join(root,'v120_overrides.js'),'utf8');
for (const fmt of ['docx-ready-markdown','pptx-ready-outline','pdf-ready-html']) if (!rt.exports.includes(fmt)) throw new Error(`missing export ${fmt}`);
for (const action of ['export-brief-md','export-ppt-outline','export-evidence-csv']) if (!js.includes(action)) throw new Error(`missing ${action}`);
console.log('PASS report builder test');
