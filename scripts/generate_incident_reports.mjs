#!/usr/bin/env node
import fs from 'fs';
const data = f => JSON.parse(fs.readFileSync(new URL('../data/'+f, import.meta.url),'utf8'));
const incidents=data('incidents.json');
const narratives=Object.fromEntries(data('narratives.json').map(n=>[n.id,n]));
const ttps=Object.fromEntries(data('ttp_taxonomy.json').map(t=>[t.id,t]));
const out = new URL('../reports/', import.meta.url);
fs.mkdirSync(out,{recursive:true});
for(const inc of incidents){
  const md = [
    '# '+inc.title,
    '',
    'Items: '+inc.item_count,
    'Sources: '+inc.source_count,
    'Review: '+inc.review_status,
    '',
    '## Narratives',
    ...inc.primary_narratives.map(id=>'- '+(narratives[id]?.label||id)),
    '',
    '## TTPs',
    ...inc.ttp_ids.map(id=>'- '+(ttps[id]?.label||id)),
    ''
  ].join('\n');
  fs.writeFileSync(new URL('incident_'+inc.id+'.md', out), md);
}
console.log('Generated', incidents.length, 'incident reports');
