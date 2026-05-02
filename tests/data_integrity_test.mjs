import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const read = f => JSON.parse(fs.readFileSync(path.join(root,'data',f),'utf8'));
const items=read('items.json'), sources=read('sources.json'), evidence=read('evidence.json'), confidence=read('confidence_scores_v118.json');
const ids = new Set(items.map(i=>i.id));
const src = new Set(sources.map(s=>s.id));
const fail=[];
for (const i of items) { if (!i.id) fail.push('item missing id'); if (i.source_id && !src.has(i.source_id)) fail.push(`missing source ${i.source_id}`); }
for (const e of evidence) if (e.entity_id && !ids.has(e.entity_id)) fail.push(`evidence references missing item ${e.entity_id}`);
if ((confidence.items||[]).length !== items.length) fail.push('confidence coverage mismatch');
if (fail.length) { console.error(fail.slice(0,20).join('\n')); process.exit(1); }
console.log('PASS data integrity test');
