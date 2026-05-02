import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const c=JSON.parse(fs.readFileSync(path.join(root,'case-packs','iran','case.json'),'utf8'));
if (c.schema_version !== 'legolens.case-pack.v1') throw new Error('invalid case pack schema');
if (c.framework_version !== '1.0.0') throw new Error('case pack framework mismatch');
if (c.counts.items !== 476 || c.counts.sources !== 382) throw new Error('case pack counts mismatch');
console.log('PASS case pack test');
