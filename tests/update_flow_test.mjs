import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const manifest=JSON.parse(fs.readFileSync(path.join(root,'data','update_manifest.json'),'utf8'));
const pkg=JSON.parse(fs.readFileSync(path.join(root,'data','update_package_v1_0.json'),'utf8'));
if (manifest.latest_release !== 'v1.0.0') throw new Error('latest_release mismatch');
if (pkg.target !== 'v1.0.0') throw new Error('update package target mismatch');
if (pkg.content_policy.direct_publication !== false || pkg.content_policy.human_review_required !== true) throw new Error('update policy mismatch');
console.log('PASS update flow test');
