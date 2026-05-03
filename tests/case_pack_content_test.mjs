import fs from 'node:fs';

const indexFile = 'case-packs/index.json';
if (!fs.existsSync(indexFile)) throw new Error('case-packs/index.json missing');
const index = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
const expected = ['iran', 'sudan', 'gaza-regional-spillover', 'ukraine-donbas', 'red-sea-yemen', 'sahel'];
const ids = new Set((index.case_packs || []).map((pack) => pack.case_id));
for (const id of expected) {
  if (!ids.has(id)) throw new Error(`Missing case pack in index: ${id}`);
  const caseFile = `case-packs/${id}/case.json`;
  if (!fs.existsSync(caseFile)) throw new Error(`Missing case metadata: ${caseFile}`);
  if (id !== 'iran') {
    const starter = `case-packs/${id}/starter_content.json`;
    if (!fs.existsSync(starter)) throw new Error(`Missing starter content: ${starter}`);
    const data = JSON.parse(fs.readFileSync(starter, 'utf8'));
    for (const key of ['sources', 'items', 'claims', 'evidence']) {
      if (!Array.isArray(data[key]) || data[key].length < 5) throw new Error(`${starter} has insufficient ${key}`);
    }
  }
}
console.log('PASS case pack content test');
