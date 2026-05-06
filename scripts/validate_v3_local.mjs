import fs from 'node:fs';

const required = [
  'app.js',
  'compat.js',
  'backend/server.mjs',
  'index.html',
  'package.json',
  'data/app_data.json',
  'data/source_set.json'
];

const missing = required.filter((file) => !fs.existsSync(file));
if (missing.length) {
  console.error('FAIL v3.0.0 validation: missing files:', missing.join(', '));
  process.exit(1);
}

const server = fs.readFileSync('backend/server.mjs', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredServerTokens = [
  '/api/ingestion/run-all',
  '/api/project/state',
  '/api/review/states',
  '/api/review/update',
  '/api/legacy/import',
  '/api/reports/export',
  'runtime/ingestion_candidates.json',
  'runtime/project_state.json',
  'runtime/audit_log.json'
];

const missingServerTokens = requiredServerTokens.filter((token) => !server.includes(token));
if (missingServerTokens.length) {
  console.error('FAIL v3.0.0 validation: backend missing tokens:', missingServerTokens.join(', '));
  process.exit(1);
}

const requiredAppTokens = ['run-all', 'Media library', 'Graph Stats', 'Legacy import'];
const missingAppTokens = requiredAppTokens.filter((token) => !app.toLowerCase().includes(token.toLowerCase()));
if (missingAppTokens.length) {
  console.error('FAIL v3.0.0 validation: UI missing tokens:', missingAppTokens.join(', '));
  process.exit(1);
}

if (!String(pkg.version || '').startsWith('3.0.0')) {
  console.error('FAIL v3.0.0 validation: package version is not 3.0.0:', pkg.version);
  process.exit(1);
}

console.log('PASS v3.0.0 validation');
