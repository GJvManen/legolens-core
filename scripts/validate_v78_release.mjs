#!/usr/bin/env node
import fs from 'fs';
const read = f => JSON.parse(fs.readFileSync(new URL('../data/'+f, import.meta.url), 'utf8'));
const items=read('items.json'), sources=read('sources.json'), families=read('source_families.json'), incidents=read('incidents.json'), evidence=read('evidence.json'), qa=read('qa_report.json');
const sourceIds=new Set(sources.map(s=>s.id));
const familyIds=new Set(families.map(f=>f.id));
const incidentIds=new Set(incidents.map(i=>i.id));
const evidenceIds=new Set(evidence.map(e=>e.evidence_id));
const errors=[];
if(items.length!==476) errors.push('Expected 476 items retained from v74.1');
if(sources.length!==382) errors.push('Expected 382 sources retained from v74.1');
if(families.filter(f=>f.status==='needs_review').length!==5) errors.push('Expected 5 needs_review families preserved');
for(const it of items){
  if(it.source_id && !sourceIds.has(it.source_id)) errors.push('Orphan source '+it.id+' -> '+it.source_id);
  if(it.source_family_id && !familyIds.has(it.source_family_id)) errors.push('Orphan family '+it.id+' -> '+it.source_family_id);
  if(!it.incident_ids?.length) errors.push('Missing incident link '+it.id);
  for(const inc of it.incident_ids||[]) if(!incidentIds.has(inc)) errors.push('Unknown incident '+it.id+' -> '+inc);
  if(!it.evidence_ids?.every(e=>evidenceIds.has(e))) errors.push('Missing evidence '+it.id);
}
const c={};
for(const it of items){ if(it.canonical_id) c[it.canonical_id]=(c[it.canonical_id]||0)+1; }
const dups=Object.entries(c).filter(([_,v])=>v>1);
if(dups.length) errors.push('Remaining canonical duplicate groups: '+JSON.stringify(dups));
if(!qa.checks?.review_first_discovery) errors.push('Discovery was not verified as review-first.');
if(errors.length){ console.error(errors.join('\n')); process.exit(1); }
console.log('v78 release validation OK:', {items:items.length, sources:sources.length, families:families.length, incidents:incidents.length, evidence:evidence.length});
process.exit(0);
