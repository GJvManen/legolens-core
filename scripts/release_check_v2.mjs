import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const warnings = [];

function exists(file) {
  return fs.existsSync(path.join(root, file));
}
function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
}

const required = [
  'README.md',
  'package.json',
  'index.html',
  'app.js',
  'data/bootstrap.js',
  'data/version.json',
  'data/release_manifest.json',
  'data/update_manifest.json',
  'case-packs/index.json',
  'docs/RELEASE_V2_0.md'
];

for (const file of required) {
  if (!exists(file)) errors.push(`missing required release file: ${file}`);
}

if (exists('package.json')) {
  const pkg = readJson('package.json');
  if (pkg.version !== '2.0.0') errors.push('package.json must be 2.0.0');
  for (const script of ['build', 'validate', 'test', 'release:check']) {
    if (!pkg.scripts?.[script]) errors.push(`package.json missing script: ${script}`);
  }
}

if (exists('data/version.json')) {
  const version = readJson('data/version.json');
  if (version.release !== 'v2.0.0') errors.push('data/version.json release must be v2.0.0');
}

if (exists('case-packs/index.json')) {
  const index = readJson('case-packs/index.json');
  const ids = new Set((index.case_packs || []).map((pack) => pack.case_id));
  for (const id of ['iran', 'sudan', 'gaza-regional-spillover', 'ukraine-donbas', 'red-sea-yemen', 'sahel']) {
    if (!ids.has(id)) errors.push(`case pack not indexed: ${id}`);
    if (!exists(`case-packs/${id}/case.json`)) warnings.push(`case pack metadata not present yet: ${id}`);
  }
}

const blockedExtensions = ['.zip', '.docx', '.pptx', '.pdf', '.sqlite', '.db'];
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}
const offenders = walk(root).filter((file) => blockedExtensions.includes(path.extname(file).toLowerCase()));
if (offenders.length) errors.push(`blocked publication files found: ${offenders.map((f) => path.relative(root, f)).join(', ')}`);

if (warnings.length) {
  console.warn('WARN LegoLens Core v2.0 release check');
  for (const warning of warnings) console.warn('-', warning);
}

if (errors.length) {
  console.error('FAIL LegoLens Core v2.0 release check');
  for (const error of errors) console.error('-', error);
  process.exit(1);
}

console.log('PASS LegoLens Core v2.0 release check');
