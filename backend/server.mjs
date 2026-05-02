
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const RUNTIME = path.join(ROOT, 'runtime_config');
const OPENAI_RUNTIME_CONFIG = path.join(RUNTIME, 'openai_config.local.json');
const PORT = Number(process.env.PORT || 8787);
const CORS_ORIGIN = process.env.LEGOLENS_CORS_ORIGIN || `http://localhost:${PORT}`;
fs.mkdirSync(RUNTIME, {recursive:true});
const send = (res, code, body, type='application/json') => { res.writeHead(code, {'content-type':type, 'access-control-allow-origin':CORS_ORIGIN, 'vary':'origin', 'access-control-allow-methods':'GET,POST,OPTIONS', 'access-control-allow-headers':'content-type', 'access-control-allow-private-network':'true'}); res.end(type==='application/json' ? JSON.stringify(body, null, 2) : body); };
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(DATA, name), 'utf8'));
const readBody = async (req) => { let raw=''; for await (const chunk of req) raw += chunk; return raw ? JSON.parse(raw) : {}; };
const writeJson = (name, body) => fs.writeFileSync(path.join(DATA, name), JSON.stringify(body, null, 2) + '\n');
const maskKey = (key='') => key ? key.slice(0,7) + '…' + key.slice(-4) : null;
const readOpenAIRuntimeConfig = () => { try { return fs.existsSync(OPENAI_RUNTIME_CONFIG) ? JSON.parse(fs.readFileSync(OPENAI_RUNTIME_CONFIG, 'utf8')) : {}; } catch { return {}; } };
const writeOpenAIRuntimeConfig = (cfg) => { fs.mkdirSync(RUNTIME,{recursive:true}); fs.writeFileSync(OPENAI_RUNTIME_CONFIG, JSON.stringify({...cfg, updated_at:new Date().toISOString()}, null, 2) + '\n'); try{ fs.chmodSync(OPENAI_RUNTIME_CONFIG, 0o600); } catch{} };
const activeOpenAIConfig = () => { const cfg = readOpenAIRuntimeConfig(); const key = process.env.OPENAI_API_KEY || cfg.api_key || ''; const adminKey = process.env.OPENAI_ADMIN_KEY || cfg.admin_api_key || ''; return { ...cfg, api_key:key, admin_api_key:adminKey, configured:Boolean(key), admin_configured:Boolean(adminKey), key_source: process.env.OPENAI_API_KEY ? 'environment' : (cfg.api_key ? 'runtime_config' : 'none'), admin_key_source: process.env.OPENAI_ADMIN_KEY ? 'environment' : (cfg.admin_api_key ? 'runtime_config' : 'none'), key_masked: maskKey(key), admin_key_masked: maskKey(adminKey), model: process.env.OPENAI_MODEL || cfg.model || 'gpt-5.1-mini' }; };
const localProjectRegistry = () => {
  if (process.env.OPENAI_PROJECTS) {
    try { return {schema_version:'env-openai-projects', source:'OPENAI_PROJECTS', projects: JSON.parse(process.env.OPENAI_PROJECTS)}; } catch {}
  }
  const runtime = readOpenAIRuntimeConfig();
  if (Array.isArray(runtime.projects) && runtime.projects.length) return {schema_version:'runtime-openai-projects', source:'runtime_config', projects: runtime.projects};
  return readJson('openai_project_registry_v99.json');
};
const normalizeOpenAIProject = (p) => ({project_id:p.id||p.project_id, openai_project_id:p.id||p.openai_project_id||null, display_name:p.name||p.display_name||p.id||p.project_id, environment:p.status||p.environment||'openai_api_project', policy:'candidate_only', source:'openai_admin_api'});
const listOpenAIAdminProjects = async () => {
  const cfg = activeOpenAIConfig();
  if(!cfg.admin_api_key) return null;
  const r = await fetch('https://api.openai.com/v1/organization/projects?limit=100', {headers:{'authorization':'Bearer '+cfg.admin_api_key, 'content-type':'application/json'}});
  if(!r.ok) throw new Error('OpenAI Admin projects HTTP '+r.status+' '+await r.text());
  const json = await r.json();
  return {schema_version:'openai-admin-projects', source:'openai_admin_api', configured:true, projects:(json.data||[]).filter(p=>p.status!=='archived').map(normalizeOpenAIProject), raw_count:(json.data||[]).length, has_more:!!json.has_more};
};
const projectRegistry = async () => {
  try { const remote = await listOpenAIAdminProjects(); if(remote && remote.projects.length) return remote; } catch(err) { const local=localProjectRegistry(); return {...local, source:(local.source||'local_registry')+'_fallback_after_admin_error', admin_error:err.message}; }
  return {...localProjectRegistry(), admin_note:'No OPENAI_ADMIN_KEY/admin_api_key configured; showing local project profiles.'};
};
const authStatePath = path.join(DATA, 'openai_auth_state_runtime_v99.json');
const readAuthState = () => fs.existsSync(authStatePath) ? JSON.parse(fs.readFileSync(authStatePath, 'utf8')) : {authorized:false, selected_project:null, sessions:[]};
const writeAuthState = (state) => fs.writeFileSync(authStatePath, JSON.stringify(state, null, 2) + '\n');


const mockAiPackage = (payload={}, kind='discover') => {
  const now = new Date().toISOString();
  const cfg = activeOpenAIConfig();
  return { schema_version:'v99.3-ai-update-candidates', target:'AI Update Connector '+kind, generated_at:now, policy:{direct_publication:false,human_review_required:true,max_candidates:Number(payload.max_candidates||10)}, data:{ candidate_queue:[...readJson('candidate_queue.json'), {candidate_id:'cand_ai_'+Date.now(), candidate_type:'evidence_gap', title:'AI-suggestie: evidence gaps controleren voor high-priority candidates', confidence:0.74, risk_flags:['needs_human_verification', cfg.configured?'dry_run_or_mock_mode':'mock_mode_no_openai_key'], review_status:'pending_review', proposed_action:'collect_archive_or_screenshot', evidence:[], created_at:now, source:'ai_update_connector_mock'}], review_log:readJson('review_log.json') }, ai_connector:{configured:cfg.configured, mode:cfg.configured?'configured_mock':'mock', key_source:cfg.key_source, selected_project:cfg.selected_project||null, note:'Output is staged; no direct publication.'} };
};
const callOpenAI = async (payload={}, task='discover') => {
  const cfg = activeOpenAIConfig();
  if(!cfg.api_key) return mockAiPackage(payload, task);
  const schema = readJson(fs.existsSync(path.join(DATA,'ai_update_candidate_schema_v99.json')) ? 'ai_update_candidate_schema_v99.json' : 'ai_update_candidate_schema_v94_2.json');
  const body = { model: payload.model || cfg.model || 'gpt-5.1-mini', tools: task==='update-content' ? [{type:'web_search'}] : undefined, input: 'Create LegoLens Iran update candidates only. Never publish directly. Return JSON matching the provided schema. Task: '+task+'. For update-content, use web_search to find recent source URLs and return candidates with evidence; never publish directly. Selected project: '+JSON.stringify(cfg.selected_project||null)+' Payload: '+JSON.stringify(payload).slice(0,12000), text:{ format:{ type:'json_schema', name:'legolens_ai_update_candidates', strict:true, schema } } };
  const headers = {'content-type':'application/json','authorization':'Bearer '+cfg.api_key};
  if(cfg.organization) headers['OpenAI-Organization'] = cfg.organization;
  if(cfg.openai_project_id) headers['OpenAI-Project'] = cfg.openai_project_id;
  try {
    const r = await fetch('https://api.openai.com/v1/responses',{method:'POST',headers,body:JSON.stringify(body)});
    if(!r.ok) throw new Error('OpenAI HTTP '+r.status+' '+await r.text());
    const result=await r.json();
    let parsed=null;
    try{ parsed=JSON.parse(result.output_text || result.output?.[0]?.content?.[0]?.text || '{}'); }catch{}
    return {schema_version:'v99.3-ai-update-candidates', target:'AI Update Connector '+task, generated_at:new Date().toISOString(), policy:{direct_publication:false,human_review_required:true,max_candidates:Number(payload.max_candidates||25)}, data:{candidate_queue:[...readJson('candidate_queue.json'), ...((parsed&&parsed.candidates)||[])]}, raw_response_id:result.id||null, ai_connector:{configured:true, mode:'openai', key_source:cfg.key_source, key_masked:cfg.key_masked, selected_project:cfg.selected_project||null, note:'Model output staged as candidates only.'}};
  } catch(err) {
    const pkg = mockAiPackage(payload, task);
    pkg.ai_connector.mode = 'openai_call_failed_mock_fallback';
    pkg.ai_connector.error = err.message;
    pkg.data.review_log = [...(pkg.data.review_log||[]), {review_id:'ai_error_'+Date.now(), entity_type:'ai_connector', entity_id:task, action:'openai_call_failed_fallback_to_mock', reason:err.message, created_at:new Date().toISOString()}];
    return pkg;
  }
};
const server = http.createServer(async (req,res)=>{
  if(req.method==='OPTIONS') return send(res,204,{});
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if(url.pathname === '/api/health') return send(res,200,{ok:true, release:'v1.0.0', generated_at:new Date().toISOString()});
    if(url.pathname === '/api/update/manifest') return send(res,200,readJson('update_manifest.json'));
    if(url.pathname === '/api/version') return send(res,200,readJson('version.json'));
    if(url.pathname === '/api/release/manifest') return send(res,200,readJson('release_manifest.json'));
    if(url.pathname === '/api/release/validation') return send(res,200,readJson('v1_build_validation.json'));
    if(url.pathname === '/api/report/runtime') return send(res,200,readJson('report_export_runtime_v120.json'));
    if(url.pathname === '/api/quality/confidence') return send(res,200,readJson('confidence_scores_v118.json'));
    if(url.pathname === '/api/update/package' || url.pathname === '/update/package') return send(res,200,readJson('update_package_v1_0.json'));
    if(url.pathname === '/api/update/test-package') return send(res,200,readJson('test_update_package_v86.json'));
    if(url.pathname === '/api/release-gate') return send(res,200,readJson('release_gate_v1_0.json'));
    if(url.pathname === '/api/qa') return send(res,200,readJson('qa_report.json'));
    if(url.pathname === '/api/evidence/workbench') return send(res,200,readJson('evidence_workbench_v110.json'));
    if(url.pathname === '/api/evidence/tasks') return send(res,200,readJson('evidence_tasks_v110.json'));
    if(url.pathname === '/api/graph/analytics') return send(res,200,readJson('graph_analytics_v110.json'));
    if(url.pathname === '/api/claims/intelligence') return send(res,200,readJson('claim_intelligence_v110.json'));
    if(url.pathname === '/api/workbench/status') return send(res,200,readJson('analyst_workbench_v110.json'));
    if(url.pathname === '/api/interface/map') return send(res,200,readJson('interface_map_v111.json'));
    if(url.pathname === '/api/detail/config') return send(res,200,readJson('unified_detail_panel_v112.json'));
    if(url.pathname === '/api/work-queues') return send(res,200,readJson('work_queues_v113.json'));
    if(url.pathname === '/api/report-builder') return send(res,200,readJson('report_builder_runtime_v116.json'));
    if(url.pathname === '/api/report-builder/runtime') return send(res,200,readJson('report_builder_runtime_v116.json'));
    if(url.pathname === '/api/report-builder/audit') return send(res,200,readJson('report_builder_audit_v116.json'));
    if(url.pathname === '/api/graph/explorer') return send(res,200,readJson('graph_explorer_v115.json'));
    if(url.pathname === '/api/graph/dashboard') return send(res,200,readJson('graph_dashboard_v116.json'));
    if(url.pathname === '/api/graph/audit') return send(res,200,readJson('graph_explorer_audit_v116.json'));
    if(url.pathname === '/api/changelog/v116') return send(res,200,readJson('changelog_v116.json'));

    if(url.pathname === '/api/db/manifest') return send(res,200,readJson('review_database_manifest_v87.json'));
    
    if(url.pathname === '/api/openai/auth/status') {
      const st = readAuthState();
      const cfg = activeOpenAIConfig();
      return send(res,200,{ok:true, release:'v1.0.0', provider:'openai', configured:cfg.configured, authorized:cfg.configured||Boolean(st.authorized), mode:cfg.configured?'openai':'mock', key_source:cfg.key_source, key_masked:cfg.key_masked, config_source:cfg.key_source, selected_project:cfg.selected_project||st.selected_project||null, model:cfg.model, note:cfg.configured?'Server-side API key available.':'No API key configured; mock authorization mode available for workflow testing.'});
    }
    
    if(url.pathname === '/api/openai/config/status') {
      const cfg = activeOpenAIConfig();
      const st = readAuthState();
      return send(res,200,{ok:true, configured:cfg.configured, key_source:cfg.key_source, key_masked:cfg.key_masked, model:cfg.model, organization:cfg.organization||null, selected_project:cfg.selected_project||st.selected_project||null, runtime_config_path:'runtime_config/openai_config.local.json'});
    }
    if(url.pathname === '/api/openai/config/save' && req.method === 'POST') {
      const payload = await readBody(req);
      const previous = readOpenAIRuntimeConfig();
      const key = String(payload.api_key||'').trim();
      const adminKey = String(payload.admin_api_key||'').trim();
      if(!key && !previous.api_key && !process.env.OPENAI_API_KEY) return send(res,400,{ok:false,error:'api_key missing'});
      const reg = await projectRegistry();
      const project = (reg.projects||[]).find(p=>p.project_id===payload.project_id) || previous.selected_project || null;
      const cfg = {
        ...previous,
        api_key: key || previous.api_key || '',
        admin_api_key: adminKey || previous.admin_api_key || '',
        model: payload.model || previous.model || 'gpt-5.1-mini',
        organization: payload.organization || previous.organization || null,
        selected_project: project,
        selected_project_id: project?.project_id || payload.project_id || previous.selected_project_id || null,
        openai_project_id: project?.openai_project_id || payload.openai_project_id || previous.openai_project_id || null,
        saved_by: payload.requested_by || 'browser_admin',
        direct_publication: false,
        output_policy: 'candidate_only'
      };
      writeOpenAIRuntimeConfig(cfg);
      const active = activeOpenAIConfig();
      const st = readAuthState();
      st.authorized = true;
      st.selected_project = project || st.selected_project || null;
      st.configured_at = new Date().toISOString();
      writeAuthState(st);
      return send(res,200,{ok:true, configured:active.configured, admin_configured:active.admin_configured, key_source:active.key_source, admin_key_source:active.admin_key_source, config_source:active.key_source, key_masked:active.key_masked, admin_key_masked:active.admin_key_masked, model:active.model, selected_project:cfg.selected_project||null, runtime_config_path:'runtime_config/openai_config.local.json', note:'API key stored server-side; key is never returned.'});
    }
    if(url.pathname === '/api/openai/config/clear' && req.method === 'POST') {
      if(fs.existsSync(OPENAI_RUNTIME_CONFIG)) fs.rmSync(OPENAI_RUNTIME_CONFIG, {force:true});
      const st = readAuthState();
      st.authorized = Boolean(process.env.OPENAI_API_KEY);
      st.selected_project = null;
      st.cleared_at = new Date().toISOString();
      writeAuthState(st);
      return send(res,200,{ok:true, cleared:true, configured:Boolean(process.env.OPENAI_API_KEY), key_source:process.env.OPENAI_API_KEY?'environment':'none'});
    }
    if(url.pathname === '/api/openai/auth/start' && req.method === 'POST') {
      const payload = await readBody(req);
      const st = readAuthState();
      const cfg = activeOpenAIConfig();
      const session = {session_id:'auth_'+Date.now(), provider:'openai', mode:cfg.configured?'openai':'mock', requested_by:payload.requested_by||'browser_admin', created_at:new Date().toISOString(), configured:cfg.configured, key_source:cfg.key_source, key_masked:cfg.key_masked};
      st.authorized = true;
      st.sessions = [...(st.sessions||[]), session].slice(-20);
      writeAuthState(st);
      return send(res,200,{ok:true, authorized:true, configured:cfg.configured, key_source:cfg.key_source, key_masked:cfg.key_masked, mode:session.mode, session_id:session.session_id, projects:(await projectRegistry()).projects, note:session.mode==='mock'?'Mock authorization; save API key in Admin or set OPENAI_API_KEY for real OpenAI calls.':'Authorized through server-side API key.'});
    }
    if(url.pathname === '/api/openai/projects') {
      const reg = await projectRegistry();
      const cfg = activeOpenAIConfig();
      return send(res,200,{ok:true, source:reg.source||'data/openai_project_registry_v99.json', configured:cfg.configured, admin_configured:cfg.admin_configured, selected_project:cfg.selected_project||null, projects:reg.projects||[], admin_note:reg.admin_note||null, admin_error:reg.admin_error||null});
    }
    if(url.pathname === '/api/openai/project/select' && req.method === 'POST') {
      const payload = await readBody(req);
      const reg = await projectRegistry();
      const project = (reg.projects||[]).find(p=>p.project_id===payload.project_id);
      if(!project) return send(res,404,{ok:false,error:'project not found'});
      const st = readAuthState();
      st.authorized = true;
      st.selected_project = project;
      st.selected_at = new Date().toISOString();
      writeAuthState(st);
      const cfg = readOpenAIRuntimeConfig();
      writeOpenAIRuntimeConfig({...cfg, selected_project:project, selected_project_id:project.project_id, openai_project_id:project.openai_project_id||cfg.openai_project_id||null});
      return send(res,200,{ok:true, selected_project:project, policy:project.policy||'candidate_only', persisted:true});
    }
    if(url.pathname === '/api/openai/auth/revoke' && req.method === 'POST') {
      const st = readAuthState();
      st.authorized = false;
      st.revoked_at = new Date().toISOString();
      writeAuthState(st);
      return send(res,200,{ok:true, revoked:true});
    }
    if(url.pathname === '/api/ai/status') { const cfg=activeOpenAIConfig(); return send(res,200,{ok:true, release:'v1.0.0', configured:cfg.configured, mode:cfg.configured?'openai':'mock', key_source:cfg.key_source, key_masked:cfg.key_masked, selected_project:cfg.selected_project||null, policy:readJson('ai_connector_config_v94_2.json').security_policy}); }
    if(url.pathname === '/api/ai/test' && req.method === 'POST') { const payload = await readBody(req); const cfg=activeOpenAIConfig(); return send(res,200,{ok:true, configured:cfg.configured, key_source:cfg.key_source, key_masked:cfg.key_masked, selected_project:cfg.selected_project||null, echo:payload, note:'AI connector reachable. No publication performed.'}); }
    if(url.pathname === '/api/openai/projects/sync' && req.method === 'POST') {
      const reg = await projectRegistry();
      return send(res,200,{ok:true, source:reg.source, projects:reg.projects||[], admin_note:reg.admin_note||null, admin_error:reg.admin_error||null});
    }
    if(url.pathname === '/api/ai/update-content' && req.method === 'POST') { const payload = await readBody(req); return send(res,200, await callOpenAI(payload,'update-content')); }
    if(url.pathname === '/api/ai/discover' && req.method === 'POST') { const payload = await readBody(req); return send(res,200, await callOpenAI(payload,'discover')); }
    if(url.pathname === '/api/ai/expand-update' && req.method === 'POST') { const payload = await readBody(req); return send(res,200, await callOpenAI(payload,'expand-update')); }
    if(url.pathname === '/api/ai/classify-candidates' && req.method === 'POST') { const payload = await readBody(req); return send(res,200, await callOpenAI(payload,'classify-candidates')); }
    if(url.pathname === '/api/ai/generate-report' && req.method === 'POST') { const payload = await readBody(req); return send(res,200, await callOpenAI(payload,'generate-report')); }
    if(url.pathname === '/api/ai/suggest-claims' && req.method === 'POST') { const payload = await readBody(req); return send(res,200, await callOpenAI(payload,'suggest-claims')); }
    if(url.pathname === '/api/ai/suggest-incident-links' && req.method === 'POST') { const payload = await readBody(req); return send(res,200, await callOpenAI(payload,'suggest-incident-links')); }

    if(url.pathname === '/api/review/patch' && req.method === 'POST') {
      let raw=''; for await (const chunk of req) raw += chunk;
      const payload = raw ? JSON.parse(raw) : {};
      const out = {ok:true, stored:false, note:'Demo backend echoes patch. Persist using SQLite integration or export patch.', received_at:new Date().toISOString(), summary:payload.summary||null};
      return send(res,200,out);
    }
    // static files
    let p = path.join(ROOT, decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if(!p.startsWith(ROOT)) return send(res,403,{error:'forbidden'});
    if(fs.existsSync(p) && fs.statSync(p).isFile()) {
      const ext = path.extname(p).toLowerCase();
      const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.md':'text/markdown','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.sqlite':'application/octet-stream'};
      res.writeHead(200, {'content-type': types[ext] || 'application/octet-stream'});
      return fs.createReadStream(p).pipe(res);
    }
    return send(res,404,{error:'not found'});
  } catch(err) { return send(res,500,{error:err.message}); }
});
server.listen(PORT,()=>console.log(`LegoLens v120.1 backend: http://localhost:${PORT}`));
