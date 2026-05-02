import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
for (const needle of ['function promoteCandidateToItem', 'approved_to_content', 'addEvidenceForPromotedItem', 'addSearchDocForItem', 'persistLocalSession', 'Goedkeuren + toevoegen']) {
  if (!app.includes(needle)) throw new Error(`candidate approval runtime missing: ${needle}`);
}
if (!/function isPromotableCandidate[\s\S]*candidate_type/.test(app)) throw new Error('candidate promotion guard missing candidate_type handling');
console.log('PASS candidate approval test');
