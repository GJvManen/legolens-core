import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root = process.cwd();
const include = ['index.html','app.js','v120_overrides.js','v1_overrides.js','v120_overrides.css','v1_overrides.css','README.md','docs/PROJECT_OVERVIEW.md','docs/SYSTEM_EXPLANATION.md','docs/GITHUB_AND_CHATGPT_GUIDE.md','data/version.json','data/release_manifest.json','data/update_manifest.json','data/release_gate_v1_0.json','data/v1_build_validation.json','data/bootstrap.js','case-packs/iran/case.json'];
const lines = [];
for (const file of include) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) throw new Error('checksum target missing: ' + file);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  lines.push(`${hash}  ${file}`);
}
fs.writeFileSync(path.join(root, 'checksums.sha256'), lines.join('\n') + '\n');
console.log('Wrote checksums.sha256');
