import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(process.cwd());
const data = p => JSON.parse(fs.readFileSync(path.join(root, 'data', p), 'utf8'));
const items = data('items.json');
const sources = data('sources.json');
const families = data('source_families.json');
const gate = data('release_gate_v99.json');
const failures = [];
if (items.length !== 476) failures.push('items count changed');
if (sources.length !== 382) failures.push('sources count changed');
if (families.length !== 10) failures.push('families count changed');
if (families.filter(f => f.status === 'needs_review').length !== 5) failures.push('needs_review family count changed');
if (!data('chatgpt_authorization_config_v99.json').security_model || data('chatgpt_authorization_config_v99.json').security_model.api_key_in_browser !== false) failures.push('auth security model invalid');
if ((data('openai_project_registry_v99.json').projects || []).length < 1) failures.push('no project registry choices');
if (gate.status !== 'pass') failures.push('release gate status is not pass');
if (failures.length) { console.error('FAIL', failures); process.exit(1); }
console.log('PASS LegoLens v99 release gate');
