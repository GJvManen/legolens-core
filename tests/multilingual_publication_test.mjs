import fs from 'node:fs';

const file = 'docs/PUBLICATION_EXPLANATION_MULTILINGUAL.md';
if (!fs.existsSync(file)) throw new Error(`${file} missing`);
const text = fs.readFileSync(file, 'utf8');
const required = ['English', '中文', 'हिन्दी', 'Español', 'العربية', 'Français', 'বাংলা', 'Português', 'Русский', 'اردو', 'Bahasa Indonesia', 'Deutsch', '日本語', 'Nederlands'];
const missing = required.filter((label) => !text.includes(label));
if (missing.length) throw new Error(`Missing language sections: ${missing.join(', ')}`);
console.log('PASS multilingual publication test');
