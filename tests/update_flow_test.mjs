import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data', 'update_manifest.json'), 'utf8'));

if (manifest.latest_release !== 'v1.2.1') throw new Error('latest_release mismatch');
if (manifest.latest_version !== '1.2.1') throw new Error('latest_version mismatch');
if (manifest.policy?.direct_publication !== false) throw new Error('direct publication policy mismatch');
if (manifest.policy?.human_review_required !== true) throw new Error('human review policy mismatch');
if (manifest.policy?.publication_clean !== true) throw new Error('publication clean policy mismatch');
if (manifest.case_pack_library !== 'case-packs/index.json') throw new Error('case pack library path mismatch');

console.log('PASS update flow test');
