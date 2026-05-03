import fs from 'node:fs';

const requiredDocs = [
  'docs/INTELLIGENCE_QUALITY_v1_2.md',
  'docs/CASE_PACK_CONTENT_ENRICHMENT_v1_2.md',
  'docs/PUBLICATION_AUDIT_v1_2_1.md'
];
for (const file of requiredDocs) {
  if (!fs.existsSync(file)) throw new Error(`${file} missing`);
}
const quality = fs.readFileSync('docs/INTELLIGENCE_QUALITY_v1_2.md', 'utf8');
for (const term of ['confidence', 'Evidence status', 'Source reliability', 'Review-first']) {
  if (!quality.toLowerCase().includes(term.toLowerCase())) throw new Error(`Missing quality term: ${term}`);
}
console.log('PASS intelligence quality test');
