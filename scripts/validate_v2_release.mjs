import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'README.md',
  'package.json',
  'index.html',
  'data/version.json',
  'data/release_manifest.json',
  'data/update_manifest.json',
  'case-packs/index.json',
  'docs/RELEASE_V2_0.md'
];

const errors = [];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`missing required file: ${file}`);
}

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

try {
  const pkg = readJson('package.json');
  if (pkg.version !== '2.0.0') errors.push('package.json version must be 2.0.0');
} catch (error) {
  errors.push(`package.json invalid: ${error.message}`);
}

try {
  const version = readJson('data/version.json');
  if (version.release !== 'v2.0.0') errors.push('data/version.json release must be v2.0.0');
  if (version.core_version !== '2.0.0') errors.push('data/version.json core_version must be 2.0.0');
} catch (error) {
  errors.push(`data/version.json invalid: ${error.message}`);
}

try {
  const caseIndex = readJson('case-packs/index.json');
  const ids = new Set((caseIndex.case_packs || []).map((pack) => pack.case_id));
  for (const id of ['iran', 'sudan', 'gaza-regional-spillover', 'ukraine-donbas', 'red-sea-yemen', 'sahel']) {
    if (!ids.has(id)) errors.push(`case pack missing from index: ${id}`);
  }
} catch (error) {
  errors.push(`case-packs/index.json invalid: ${error.message}`);
}

const indexHtml = fs.existsSync('index.html') ? fs.readFileSync('index.html', 'utf8') : '';
if (!indexHtml.includes('data/bootstrap.js')) errors.push('index.html missing bootstrap script');
if (!indexHtml.includes('app.js')) errors.push('index.html missing app script');

if (errors.length) {
  console.error('FAIL LegoLens Core v2.0 validation');
  for (const error of errors) console.error('-', error);
  process.exit(1);
}

console.log('PASS LegoLens Core v2.0 validation');
