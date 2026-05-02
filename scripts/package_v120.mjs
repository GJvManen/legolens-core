import { spawnSync } from 'node:child_process';
import path from 'node:path';
const root = process.cwd();
const out = path.resolve(root, '..', '..', 'legolens_iran_v120_bundle.zip');
const dir = path.basename(root);
const res = spawnSync('zip', ['-qr', out, dir], {cwd: path.dirname(root), stdio: 'inherit'});
if (res.status !== 0) process.exit(res.status);
console.log(`Wrote ${out}`);
