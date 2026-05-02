import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
for (const p of ['README.md','docs/PROJECT_OVERVIEW.md','docs/SYSTEM_EXPLANATION.md','docs/GITHUB_AND_CHATGPT_GUIDE.md']) {
  const s=fs.readFileSync(path.join(root,p),'utf8');
  if (!s.includes('screenshot') && !s.includes('Screenshot') && p==='README.md') throw new Error('README missing screenshots');
  if (s.length < 1000) throw new Error(p+' too short');
}
if (!fs.existsSync(path.join(root,'docs','screenshots','01-system-overview.png'))) throw new Error('missing screenshot');
console.log('PASS docs test');
