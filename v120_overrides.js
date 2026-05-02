(()=>{'use strict';
const BOOT=window.LEGOLENS_BOOTSTRAP||{data:{},assets:{}};
const data=BOOT.data||{};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>new Intl.NumberFormat('nl-NL').format(Number(n||0));
const arr=k=>Array.isArray(data[k])?data[k]:[];
const obj=k=>data[k]&&!Array.isArray(data[k])?data[k]:{};
const version=obj('version');
const release=version.release||obj('release_manifest').release||'v120.1';
const items=arr('items'),sources=arr('sources'),families=arr('source_families'),evidence=arr('evidence'),claims=arr('claims_v93'),incidents=arr('incidents');
const confidence=obj('confidence_scores_v118');
const familyReview=obj('source_family_review_workflow_v118');
const workflow=obj('analyst_workflow_v119');
const gate=obj('release_gate_v120');
const reportRuntime=obj('report_export_runtime_v120');
const graphIntel=obj('graph_intelligence_v120');
const badge=(t,cls='')=>`<span class="badge ${cls}">${esc(t)}</span>`;
const metric=(l,v,h='')=>`<div class="metric"><b>${esc(v)}</b><small>${esc(l)}</small>${h?`<small>${esc(h)}</small>`:''}</div>`;
function ensure(id,label){
  const nav=$('#nav');
  if(nav&&!nav.querySelector(`a[href="#${id}"]`)){
    const a=document.createElement('a'); a.href='#'+id; a.textContent=label; nav.insertBefore(a, nav.firstChild);
  }
  let sec=$('#'+id);
  if(!sec){sec=document.createElement('section');sec.id=id;sec.className='section';$('.main')?.prepend(sec)}
  return sec;
}
function download(name,payload,type='application/json'){
  const body=typeof payload==='string'?payload:JSON.stringify(payload,null,2);
  const blob=new Blob([body],{type}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1200);
}
function rows(list,label,value,limit=8){
  const max=Math.max(1,...(list||[]).map(x=>Number(x[value]||0)));
  return `<div class="v120-bars">${(list||[]).slice(0,limit).map(x=>`<div><span>${esc(x[label])}</span><i><b style="width:${Math.max(4,Math.round(Number(x[value]||0)/max*100))}%"></b></i><em>${fmt(x[value])}</em></div>`).join('')}</div>`;
}
function counts(){return {items:items.length,sources:sources.length,families:families.length,evidence:evidence.length,claims:claims.length,incidents:incidents.length};}
function topConfidence(){return (confidence.items||[]).slice().sort((a,b)=>a.score-b.score).slice(0,12);}
function sourceFamilyRows(){return (familyReview.families||families.map(f=>({family_id:f.id,name:f.name,current_status:f.status,item_count:f.item_count,next_action:'review'}))).slice(0,12);}
function renderToday(){
  const c=counts(), sum=confidence.summary||{}, rg=gate.summary||{};
  ensure('overview-hub','Today').innerHTML=`<div class="panel v120-hero"><div class="between"><div><p class="kicker">${esc(release)} • local-first analyst workspace</p><h2>Today</h2><p class="muted">Dagstart voor release health, open datakwaliteitsrisico’s en review-first werkzaamheden.</p></div>${badge(gate.status==='pass'?'release gate pass':'release gate check',gate.status==='pass'?'green':'amber')}</div><div class="metrics">${metric('Items',fmt(c.items))}${metric('Sources',fmt(c.sources))}${metric('Evidence',fmt(c.evidence))}${metric('Claims',fmt(c.claims))}${metric('Avg confidence',sum.average_score??'n/a')}${metric('Needs review',fmt(sum.needs_review||0))}</div><div class="grid"><div class="panel v120-card"><h3>Release acceptance</h3><p>${fmt(rg.checks_passed||0)} van ${fmt(rg.checks_total||0)} v120 checks passeren.</p><div class="row"><a class="btn btn-green" href="#admin-hub">Open Admin Hub</a><button class="btn" data-v120-action="export-release-status">Export status</button></div></div><div class="panel v120-card"><h3>Belangrijkste risico</h3><p>${fmt((confidence.items||[]).filter(x=>!x.has_archive).length)} items missen nog archive coverage of exacte datumkwaliteit. Gebruik Review voor verrijking.</p><a class="btn" href="#review-hub">Open Review</a></div></div></div>`;
}
function renderMonitor(){
  const dateStats=Object.entries((confidence.items||[]).reduce((m,x)=>{m[x.date_quality||'unknown']=(m[x.date_quality||'unknown']||0)+1;return m;},{})).map(([label,count])=>({label,count}));
  const bandStats=Object.entries((confidence.items||[]).reduce((m,x)=>{m[x.band||'unknown']=(m[x.band||'unknown']||0)+1;return m;},{})).map(([label,count])=>({label,count}));
  ensure('monitor-hub','Monitor').innerHTML=`<div class="panel"><div class="between"><div><h2>Monitor</h2><p class="muted">Operational monitoring: date quality, confidence bands, source-family review en evidence gaps.</p></div>${badge('review-first','green')}</div><div class="v120-chart-grid"><div class="v120-card"><h3>Confidence bands</h3>${rows(bandStats,'label','count',5)}</div><div class="v120-card"><h3>Date quality</h3>${rows(dateStats,'label','count',8)}</div><div class="v120-card wide"><h3>Source family review</h3><div class="table-wrap"><table class="table"><thead><tr><th>Family</th><th>Status</th><th>Items</th><th>Next action</th></tr></thead><tbody>${sourceFamilyRows().map(f=>`<tr><td>${esc(f.name)}</td><td>${badge(f.current_status,f.current_status==='needs_review'?'amber':'green')}</td><td>${fmt(f.item_count)}</td><td>${esc(f.next_action)}</td></tr>`).join('')}</tbody></table></div></div></div></div>`;
}
function renderInvestigate(){
  const low=topConfidence();
  ensure('investigate-hub','Investigate').innerHTML=`<div class="panel"><div class="between"><div><h2>Investigate</h2><p class="muted">Snelle ingang naar items met lage confidence, evidence gaps en broncontext.</p></div>${badge('lineage-ready')}</div><div class="table-wrap"><table class="table"><thead><tr><th>Score</th><th>Item</th><th>Family</th><th>Date</th><th>Action</th></tr></thead><tbody>${low.map(x=>`<tr><td>${badge(x.score,x.band==='low'?'red':'amber')}</td><td><b>${esc(String(x.title||x.item_id).slice(0,95))}</b><br><small>${esc(x.item_id)} • ${esc(x.source_id||'')}</small></td><td>${esc(x.source_family_id||'')}</td><td>${esc(x.date_quality||'')}</td><td>${esc(x.recommended_action)}</td></tr>`).join('')}</tbody></table></div><div class="row" style="margin-top:14px"><button class="btn" data-v120-action="export-confidence">Export confidence JSON</button><a class="btn" href="#graph-explorer">Open Graph Explorer</a></div></div>`;
}
function renderReview(){
  const open=(confidence.items||[]).filter(x=>x.band!=='high'||!x.has_archive).slice(0,40);
  ensure('review-hub','Review').innerHTML=`<div class="panel"><div class="between"><div><h2>Review</h2><p class="muted">Human review queue. AI en imports blijven candidates totdat een analist accepteert.</p></div>${badge(`${fmt(open.length)} zichtbaar`,'amber')}</div><div class="metrics">${metric('Open item checks',fmt((confidence.summary||{}).needs_review||open.length))}${metric('Families needing review',fmt((familyReview.summary||{}).needs_review||0))}${metric('Evidence records',fmt(evidence.length))}${metric('Policy','candidate-only')}</div><div class="table-wrap"><table class="table"><thead><tr><th>Band</th><th>Item</th><th>Archive</th><th>Review action</th></tr></thead><tbody>${open.map(x=>`<tr><td>${badge(x.band,x.band==='low'?'red':'amber')}</td><td><b>${esc(String(x.title||x.item_id).slice(0,80))}</b><br><small>${esc(x.item_id)}</small></td><td>${x.has_archive?badge('archive','green'):badge('missing','red')}</td><td>${esc(x.recommended_action)}</td></tr>`).join('')}</tbody></table></div></div>`;
}
function makeExecutiveBrief(){
  const c=counts(), sum=confidence.summary||{};
  return `# LegoLens Iran ${release} Executive Brief\n\nGenerated locally. Analyst draft until human-reviewed.\n\n## Snapshot\n\n- Items: ${c.items}\n- Sources: ${c.sources}\n- Evidence records: ${c.evidence}\n- Claims: ${c.claims}\n- Average confidence: ${sum.average_score||'n/a'}\n- Needs review: ${sum.needs_review||0}\n\n## Key findings\n\n1. v120 centralizes versioning and release/update metadata.\n2. All core v116 records are preserved and enriched with non-destructive confidence metadata.\n3. Source-family and evidence review remain human-gated.\n\n## Recommended next actions\n\n- Complete archive capture for medium/low confidence items.\n- Resolve source families marked needs_review.\n- Use Report Builder outputs only after analyst approval.\n`;
}
function makePptOutline(){
  return {schema_version:'v120.pptx-ready-outline', release, slides:[
    {title:'LegoLens Iran v120', bullets:['Workflow, Quality & Reporting release','Local-first, review-first architecture']},
    {title:'Release health', bullets:[`${(gate.summary||{}).checks_passed||0}/${(gate.summary||{}).checks_total||0} checks passed`, 'Central version source and update manifest added']},
    {title:'Data quality', bullets:[`${(confidence.summary||{}).items_scored||0} items scored`, `${(confidence.summary||{}).needs_review||0} records need analyst review`]},
    {title:'Workflow hubs', bullets:(workflow.routes||[]).map(r=>r.label)},
    {title:'Reporting outputs', bullets:(reportRuntime.templates||[]).map(t=>t.label)},
    {title:'Governance', bullets:['Candidate-only AI', 'Human review required', 'No direct publication']}
  ]};
}
function renderReportHub(){
  ensure('report-hub','Report').innerHTML=`<div class="panel"><div class="between"><div><h2>Report</h2><p class="muted">Professionele outputlaag: executive brief, incident report, evidence appendix en PPTX-ready outline.</p></div>${badge('v120 reporting','green')}</div><div class="v120-template-grid">${(reportRuntime.templates||[]).map(t=>`<div class="v120-card"><h3>${esc(t.label)}</h3><p>${(t.sections||[]).map(s=>badge(s)).join(' ')}</p></div>`).join('')}</div><div class="row"><button class="btn btn-green" data-v120-action="export-brief-md">Export executive brief MD</button><button class="btn" data-v120-action="export-ppt-outline">Export PPTX outline JSON</button><button class="btn" data-v120-action="export-evidence-csv">Export evidence appendix CSV</button><a class="btn" href="#report-builder">Open Report Builder</a></div></div>`;
}
function renderAdmin(){
  ensure('admin-hub','Admin Hub').innerHTML=`<div class="panel"><div class="between"><div><h2>Admin Hub</h2><p class="muted">Release manifest, update policy, backend hardening en validatie.</p></div>${badge(release,'green')}</div><div class="metrics">${metric('Gate status',gate.status||'n/a')}${metric('Latest manifest',(obj('update_manifest').latest_release)||release)}${metric('Central version',version.central_version_source?'yes':'no')}${metric('Offline mode',version.compatibility?.offline_mode?'yes':'no')}</div><div class="table-wrap"><table class="table"><thead><tr><th>Check</th><th>Status</th><th>Detail</th></tr></thead><tbody>${(gate.required_checks||[]).map(ch=>`<tr><td>${esc(ch.id)}</td><td>${badge(ch.status,ch.status==='PASS'?'green':'red')}</td><td>${esc(ch.detail)}</td></tr>`).join('')}</tbody></table></div><div class="row" style="margin-top:14px"><button class="btn" data-v120-action="export-release-status">Export release status</button><button class="btn" data-v120-action="export-update-manifest">Export update manifest</button></div></div>`;
}
function enhanceShell(){
  document.title=`LegoLens Iran ${release}`;
  const sm=document.querySelector('.brand small'); if(sm)sm.textContent=`${release} • workflow, quality & reporting`;
  const side=$('#sidebarStatus'); if(side)side.textContent=`${release} geladen • release gate ${gate.status||'ready'}`;
  const nav=$('#nav');
  if(nav){ ['overview-hub','monitor-hub','investigate-hub','review-hub','report-hub','admin-hub'].forEach((id,i)=>{const a=nav.querySelector(`a[href="#${id}"]`); if(a) a.classList.add('v120-primary-nav');}); }
}
function renderV120(){try{enhanceShell();renderToday();renderMonitor();renderInvestigate();renderReview();renderReportHub();renderAdmin();}catch(err){console.error('v120 render failed',err);}}
function csvEvidence(){const header=['evidence_id','entity_id','status','verification_status','archive_url','preview_path'];const lines=[header.join(',')];evidence.forEach(e=>lines.push(header.map(k=>'"'+String(e[k]??'').replace(/"/g,'""')+'"').join(',')));return lines.join('\n');}
document.addEventListener('click',e=>{const b=e.target.closest('[data-v120-action]'); if(!b)return; const a=b.dataset.v120Action; if(a==='export-confidence')download('confidence_scores_v118.json',confidence); if(a==='export-release-status')download('legolens_v120_release_status.json',{version,release_manifest:obj('release_manifest'),release_gate:gate,validation:obj('v120_build_validation')}); if(a==='export-update-manifest')download('update_manifest_v120.json',obj('update_manifest')); if(a==='export-brief-md')download('legolens_v120_executive_brief.md',makeExecutiveBrief(),'text/markdown'); if(a==='export-ppt-outline')download('legolens_v120_pptx_outline.json',makePptOutline()); if(a==='export-evidence-csv')download('legolens_v120_evidence_appendix.csv',csvEvidence(),'text/csv');});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(renderV120,260));else setTimeout(renderV120,260);
window.legolensV120Render=renderV120;
})();
