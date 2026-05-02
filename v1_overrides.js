(()=>{'use strict';
const BOOT=window.LEGOLENS_BOOTSTRAP||{data:{}};
const data=BOOT.data||{};
const $=(s,r=document)=>r.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arr=k=>Array.isArray(data[k])?data[k]:[];
const obj=k=>data[k]&&!Array.isArray(data[k])?data[k]:{};
const version=obj('version');
const release=version.release||'v1.0.0';
function badge(t,cls='green'){return `<span class="badge ${cls}">${esc(t)}</span>`;}
function metric(l,v){return `<div class="metric"><b>${esc(v)}</b><small>${esc(l)}</small></div>`;}
function ensure(id,label){const nav=$('#nav');if(nav&&!nav.querySelector(`a[href="#${id}"]`)){const a=document.createElement('a');a.href='#'+id;a.textContent=label;nav.insertBefore(a,nav.firstChild);}let s=$('#'+id);if(!s){s=document.createElement('section');s.id=id;s.className='section';$('.main')?.prepend(s);}return s;}
function download(name,payload,type='application/json'){const body=typeof payload==='string'?payload:JSON.stringify(payload,null,2);const blob=new Blob([body],{type});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1200);}
function renderV1Home(){const c=obj('release_manifest').counts||{};ensure('v1-home','v1.0').innerHTML=`<div class="panel v120-hero"><div class="between"><div><p class="kicker">${esc(release)} • Stable Community Release</p><h2>LegoLens Core + Iran Case Pack</h2><p class="muted">Open-source, review-first intelligence framework voor complexe informatieomgevingen. Iran is de eerste case pack; dezelfde methode is inzetbaar in andere conflict-, crisis- en informatiecontexten.</p></div>${badge('community-ready')}</div><div class="metrics">${metric('Items',c.items||0)}${metric('Sources',c.sources||0)}${metric('Evidence',c.evidence||0)}${metric('Case pack','Iran 1.0')}</div><div class="grid"><div class="panel v120-card"><h3>Waarom v1.0?</h3><p>Deze release stabiliseert de app, scheidt framework en casus, voegt governance toe en maakt de output geschikt voor GitHub-publicatie en communitybijdragen.</p></div><div class="panel v120-card"><h3>Breder toepasbaar</h3><p>Het framework analyseert signalen, claims, bronnen, evidence, netwerken en rapportage. Dat patroon komt terug in veel conflict- en crisisomgevingen.</p></div></div><div class="row"><a class="btn btn-green" href="docs/PROJECT_OVERVIEW.md">Projectomschrijving</a><a class="btn" href="docs/SYSTEM_EXPLANATION.md">Systeem uitleg</a><a class="btn" href="docs/GITHUB_AND_CHATGPT_GUIDE.md">GitHub + ChatGPT</a><button class="btn" data-v1-action="export-v1-status">Export v1 status</button></div></div>`;}
function enhance(){document.title='LegoLens Core v1.0 + Iran Case Pack';const sm=document.querySelector('.brand small');if(sm)sm.textContent='Core v1.0 • stable, review-first & community-ready';const side=$('#sidebarStatus');if(side)side.textContent='v1.0.0 geladen • stable';renderV1Home();}
document.addEventListener('click',e=>{const b=e.target.closest('[data-v1-action]');if(!b)return;if(b.dataset.v1Action==='export-v1-status')download('legolens_v1_status.json',{version:obj('version'),release_manifest:obj('release_manifest'),release_gate:obj('release_gate_v1_0'),case_pack:obj('case_pack_manifest_v1')});});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(enhance,500));else setTimeout(enhance,500);
})();
