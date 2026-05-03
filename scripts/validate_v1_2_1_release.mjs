import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const fail = [];

const pkg = readJson('package.json');
const version = readJson('data/version.json');
const releaseManifest = readJson('data/release_manifest.json');
const updateManifest = readJson('data/update_manifest.json');
const caseIndex = readJson('case-packs/index.json');

if (pkg.version !== '1.2.1') fail.push('package.json version is not 1.2.1');
if (version.release !== 'v1.2.1') fail.push('data/version.json release is not v1.2.1');
if (version.core_version !== '1.2.1') fail.push('data/version.json core_version is not 1.2.1');
if (releaseManifest.release !== 'v1.2.1') fail.push('data/release_manifest.json release is not v1.2.1');
if (updateManifest.latest_release !== 'v1.2.1') fail.push('data/update_manifest.json latest_release is not v1.2.1');
if (caseIndex.core_release !== 'v1.2.1') fail.push('case-packs/index.json core_release is not v1.2.1');

const requiredDocs = [
  'README.md',
  'docs/PUBLICATION_EXPLANATION_MULTILINGUAL.md',
  'docs/i18n/README.md',
  'docs/PUBLICATION_AUDIT_v1_2_1.md',
  'docs/INTELLIGENCE_QUALITY_v1_2.md',
  'docs/CASE_PACK_CONTENT_ENRICHMENT_v1_2.md',
  'docs/RELEASE_REPORT_v1_2_1_PUBLICATION_UPDATE.md'
];
for (const file of requiredDocs) {
  if (!fs.existsSync(path.join(root, file))) fail.push(`missing required doc: ${file}`);
}

const expectedCasePacks = ['iran', 'sudan', 'gaza-regional-spillover', 'ukraine-donbas', 'red-sea-yemen', 'sahel'];
const indexedCasePacks = new Set((caseIndex.case_packs || []).map((pack) => pack.case_id));
for (const id of expectedCasePacks) {
  if (!indexedCasePacks.has(id)) fail.push(`case pack not indexed: ${id}`);
  if (!fs.existsSync(path.join(root, 'case-packs', id, 'case.json'))) fail.push(`missing case.json for ${id}`);
}

for (const id of expectedCasePacks.filter((id) => id !== 'iran')) {
  const starterFile = path.join(root, 'case-packs', id, 'starter_content.json');
  if (!fs.existsSync(starterFile)) {
    fail.push(`missing starter_content.json for ${id}`);
    continue;
  }
  const starter = JSON.parse(fs.readFileSync(starterFile, 'utf8'));
  for (const key of ['sources', 'items', 'claims', 'evidence']) {
    if (!Array.isArray(starter[key]) || starter[key].length < 5) fail.push(`${id} has insufficient ${key}`);
  }
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const req of ['data/bootstrap.js', 'app.js']) {
  if (!html.includes(req)) fail.push(`index.html missing ${req}`);
}

if (fail.length) {
  console.error('FAIL LegoLens v1.2.1 validation');
  for (const item of fail) console.error('-', item);
  process.exit(1);
}
console.log('PASS LegoLens v1.2.1 release validation');
