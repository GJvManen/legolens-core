import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root = process.cwd();
const out = path.resolve(root, '..', 'legolens_core_v1_0_bundle.zip');
if (fs.existsSync(out)) fs.rmSync(out, {force:true});
execFileSync('zip', ['-qr', out, path.basename(root)], {cwd:path.dirname(root)});
console.log(out);
