import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const sec=JSON.parse(fs.readFileSync(path.join(root,'data','security_model_v1.json'),'utf8'));
if (sec.defaults.api_keys_in_frontend !== false) throw new Error('api key policy unsafe');
if (sec.defaults.direct_publication !== false || sec.defaults.human_review_required !== true) throw new Error('review-first policy unsafe');
const backend=fs.readFileSync(path.join(root,'backend','server.mjs'),'utf8');
if (!backend.includes('OPENAI_API_KEY')) throw new Error('backend missing server-side OpenAI key handling');
console.log('PASS security config test');
