import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT || 8787);
const DATA = path.join(ROOT, 'data');
const RUNTIME = path.join(ROOT, 'runtime');
fs.mkdirSync(RUNTIME, { recursive: true });

const FILES = {
  candidates: path.join(RUNTIME, 'ingestion_candidates.json'),
  projectState: path.join(RUNTIME, 'project_state.json'),
  audit: path.join(RUNTIME, 'audit_log.json'),
  legacyImport: path.join(RUNTIME, 'legacy_import_log.json')
};

const REVIEW_STATES = ['candidate', 'triaged', 'needs_evidence', 'linked_to_claim', 'reviewed', 'rejected', 'share_blocked', 'share_approved'];
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.md': 'text/markdown; charset=utf-8' };

function send(res, code, body, type = 'application/json; charset=utf-8') {
  res.writeHead(code, {
    'content-type': type,
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type'
  });
  res.end(type.startsWith('application/json') ? JSON.stringify(body, null, 2) : body);
}
function readJsonFile(file, fallback) { try { return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback; } catch { return fallback; } }
function writeJsonFile(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); }
function readData(name, fallback = {}) { return readJsonFile(path.join(DATA, name), fallback); }
async function readBody(req) { let raw = ''; for await (const chunk of req) raw += chunk; return raw ? JSON.parse(raw) : {}; }
function appData() { return readData('app_data.json', { case_packs: [], repo_narratives: [] }); }
function sourceSet() { return readData('source_set.json', { sources: [], source_families: [] }); }
function candidates() { return readJsonFile(FILES.candidates, []); }
function projectState() { return readJsonFile(FILES.projectState, { schema_version: 'legolens-project-state-v3', review_states: {}, imports: [], updated_at: null }); }
function auditLog() { return readJsonFile(FILES.audit, []); }
function audit(event, details = {}) { const row = { id: 'audit_' + Date.now() + '_' + Math.random().toString(16).slice(2), event, details, created_at: new Date().toISOString() }; const log = auditLog(); log.push(row); writeJsonFile(FILES.audit, log.slice(-1000)); return row; }
function cases() { return appData().case_packs || []; }
function caseFor(caseId) { return cases().find(c => c.id === caseId) || cases()[0] || { id: caseId, title: caseId, map: { places: [] } }; }
function sourceFor(id) { return (sourceSet().sources || []).find(s => s.source_id === id || s.id === id); }
function sourcesForCase(caseId) { return (sourceSet().sources || []).filter(s => (s.case_ids || []).includes(caseId)); }
function familyName(id) { const f = (sourceSet().source_families || []).find(x => x.id === id || x.source_family_id === id); return f?.name || id || 'Source family'; }
function narrativeLabel() { const n = (appData().repo_narratives || [])[0] || {}; return n.label || n.name || n.id || 'Narrative n/a'; }
function placeFor(caseId, idx) { const places = caseFor(caseId).map?.places || []; const p = places[idx % Math.max(places.length, 1)] || {}; return { lat: p.lat ?? null, lon: p.lon ?? null, label: p.label || '' }; }
function isHttpUrl(u) { return /^https?:\/\//i.test(String(u || '')); }
function attributionChain(caseId, src = {}, extra = {}) {
  const c = caseFor(caseId);
  return [
    'Repository',
    c.title || caseId,
    familyName(src.source_family || extra.source_family || caseId),
    src.name || extra.source_name || src.source_id || 'Source n/a',
    src.platform || src.type || extra.platform || 'Platform n/a',
    narrativeLabel(),
    extra.title || extra.content_title || src.name || src.source_id || 'Item n/a',
    extra.review_status || src.review_status || src.status || 'candidate'
  ].join(' -> ');
}
function countStatuses(rows) { return rows.reduce((acc, x) => { const k = x.fetch_status || 'unknown'; acc[k] = (acc[k] || 0) + 1; return acc; }, {}); }
function mergeCandidates(rows) { const by = new Map(candidates().map(x => [x.id, x])); for (const c of rows) by.set(c.id, c); const merged = [...by.values()]; writeJsonFile(FILES.candidates, merged); return merged; }
async function fetchCandidate(src, caseId, idx) {
  const now = new Date().toISOString();
  const p = placeFor(caseId, idx);
  const base = {
    id: `cand_${caseId}_${src.source_id || src.id || idx}`,
    case_id: caseId,
    source_id: src.source_id || src.id || null,
    source_name: src.name || src.title || null,
    source_family: src.source_family || null,
    platform: src.platform || src.type || 'source',
    candidate_type: 'online_source_fetch',
    fetched_at: now,
    review_status: 'candidate',
    title: src.name || src.title || src.source_id || 'Source candidate',
    url: src.url || null,
    geo: { lat: p.lat, lon: p.lon },
    place: p.label,
    candidate_only: true
  };
  base.attribution_chain = attributionChain(caseId, src, base);
  if (!isHttpUrl(src.url)) return { ...base, fetch_status: 'metadata_only', content_excerpt: 'Source record has no retrievable public http(s) URL in repository metadata.' };
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 1200);
  try {
    const r = await fetch(src.url, { signal: ac.signal, headers: { 'user-agent': 'LegoLens-Core/3.0' } });
    const ct = r.headers.get('content-type') || '';
    let txt = '';
    try { txt = await r.text(); } catch {}
    clearTimeout(timer);
    const title = (txt.match(/<title[^>]*>([^<]{1,180})<\/title>/i) || [])[1] || base.title;
    const excerpt = txt.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 360);
    return { ...base, fetch_status: r.ok ? 'fetched' : 'http_' + r.status, http_status: r.status, content_type: ct, content_title: title, content_excerpt: excerpt || ('Fetched ' + ct + ' from public URL.') };
  } catch (err) {
    clearTimeout(timer);
    return { ...base, fetch_status: 'fetch_error', error: String(err.message || err), content_excerpt: 'Online fetch failed locally. The original public URL remains available for manual review.' };
  }
}
function exportRows(caseId) { return candidates().filter(c => !caseId || c.case_id === caseId); }
function asCsv(rows) { const cols = ['id', 'case_id', 'source_id', 'source_name', 'platform', 'fetch_status', 'review_status', 'url', 'attribution_chain']; const esc = v => '"' + String(v ?? '').replace(/"/g, '""') + '"'; return [cols.join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))].join('\n') + '\n'; }
function asHtml(rows, caseId) { return '<!doctype html><meta charset="utf-8"><title>LegoLens export</title><h1>LegoLens Core v3.0.0 export</h1><p>Case: ' + (caseId || 'all') + '</p><table border="1" cellspacing="0" cellpadding="6"><tr><th>ID</th><th>Source</th><th>Status</th><th>Review</th><th>Attribution</th></tr>' + rows.map(r => `<tr><td>${r.id}</td><td>${r.source_name || ''}</td><td>${r.fetch_status || ''}</td><td>${r.review_status || ''}</td><td>${r.attribution_chain || ''}</td></tr>`).join('') + '</table>'; }
function asGeoJson(rows) { return { type: 'FeatureCollection', features: rows.filter(r => r.geo && r.geo.lat != null && r.geo.lon != null).map(r => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [Number(r.geo.lon), Number(r.geo.lat)] }, properties: { id: r.id, case_id: r.case_id, source_name: r.source_name, review_status: r.review_status, attribution_chain: r.attribution_chain } })) }; }
function asStix(rows) { return { type: 'bundle', id: 'bundle--legolens-preview', spec_version: '2.1', objects: rows.map(r => ({ type: 'note', spec_version: '2.1', id: 'note--' + String(r.id).replace(/[^a-zA-Z0-9-]/g, '-'), created: r.fetched_at || new Date().toISOString(), modified: r.fetched_at || new Date().toISOString(), abstract: r.title, content: r.content_excerpt || '', labels: ['legolens-preview', r.review_status || 'candidate'], external_references: r.url ? [{ source_name: r.source_name || 'source', url: r.url }] : [] })) }; }
function asMisp(rows) { return { Event: { info: 'LegoLens Core v3.0.0 MISP preview', distribution: '0', published: false, Attribute: rows.map(r => ({ type: r.url ? 'link' : 'text', category: 'External analysis', value: r.url || r.title || r.id, comment: r.attribution_chain || '', to_ids: false })) } }; }

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (url.pathname === '/api/health') return send(res, 200, { ok: true, release: 'v3.0.0', generated_at: new Date().toISOString() });
    if (url.pathname === '/api/version') return send(res, 200, readData('version.json', { version: '3.0.0' }));
    if (url.pathname === '/api/app-data') return send(res, 200, appData());
    if (url.pathname === '/api/source-set') return send(res, 200, sourceSet());
    if (url.pathname === '/api/schema') return send(res, 200, { ok: true, release: 'v3.0.0', candidate_only: true, run_all: true, review_states: REVIEW_STATES });
    if (url.pathname === '/api/audit') return send(res, 200, { ok: true, audit: auditLog() });
    if (url.pathname === '/api/project/state') return send(res, 200, { ok: true, state: projectState() });
    if (url.pathname === '/api/project/backup' && req.method === 'POST') { const backup = { schema_version: 'legolens-backup-v3', created_at: new Date().toISOString(), project_state: projectState(), candidates: candidates(), audit: auditLog(), legacy_import_log: readJsonFile(FILES.legacyImport, []) }; audit('project_backup_created'); return send(res, 200, { ok: true, backup }); }
    if (url.pathname === '/api/project/restore' && req.method === 'POST') { const body = await readBody(req); const b = body.backup || body; if (Array.isArray(b.candidates)) writeJsonFile(FILES.candidates, b.candidates); if (b.project_state) writeJsonFile(FILES.projectState, b.project_state); if (Array.isArray(b.audit)) writeJsonFile(FILES.audit, b.audit); if (Array.isArray(b.legacy_import_log)) writeJsonFile(FILES.legacyImport, b.legacy_import_log); audit('project_restored'); return send(res, 200, { ok: true, restored: true }); }
    if (url.pathname === '/api/ingestion/candidates') return send(res, 200, { ok: true, candidates: candidates() });
    if (url.pathname === '/api/ingestion/clear' && req.method === 'POST') { writeJsonFile(FILES.candidates, []); audit('ingestion_candidates_cleared'); return send(res, 200, { ok: true, candidates: [] }); }
    if (url.pathname === '/api/ingestion/run' && req.method === 'POST') { const body = await readBody(req); const caseId = body.case_id || cases()[0]?.id || 'default'; let srcs = body.source_id ? [sourceFor(body.source_id)].filter(Boolean) : sourcesForCase(caseId); srcs = srcs.slice(0, Math.max(1, Math.min(Number(body.limit || 40), 40))); const rows = []; for (let i = 0; i < srcs.length; i++) rows.push(await fetchCandidate(srcs[i], caseId, i)); const stored = mergeCandidates(rows).length; audit('ingestion_run', { case_id: caseId, candidates: rows.length, stored }); return send(res, 200, { ok: true, case_id: caseId, candidates: rows, counts: countStatuses(rows), stored, candidate_only: true }); }
    if (url.pathname === '/api/ingestion/run-all' && req.method === 'POST') { const body = await readBody(req); const limit = Math.max(1, Math.min(Number(body.limit_per_case || 40), 40)); const selected = Array.isArray(body.case_ids) ? cases().filter(c => body.case_ids.includes(c.id)) : cases(); const rows = []; for (const c of selected) { const srcs = sourcesForCase(c.id).slice(0, limit); for (let i = 0; i < srcs.length; i++) rows.push(await fetchCandidate(srcs[i], c.id, i)); } const stored = mergeCandidates(rows).length; audit('ingestion_run_all', { cases_tested: selected.length, candidates: rows.length, stored }); return send(res, 200, { ok: true, cases_tested: selected.length, limit_per_case: limit, candidates: rows, counts: countStatuses(rows), stored, candidate_only: true }); }
    if (url.pathname === '/api/review/states') return send(res, 200, { ok: true, states: REVIEW_STATES });
    if (url.pathname === '/api/review/update' && req.method === 'POST') { const body = await readBody(req); if (!REVIEW_STATES.includes(body.review_status)) return send(res, 400, { ok: false, error: 'invalid review_status', states: REVIEW_STATES }); const rows = candidates(); const row = rows.find(c => c.id === body.candidate_id || c.candidate_id === body.candidate_id); if (!row) return send(res, 404, { ok: false, error: 'candidate not found' }); row.review_status = body.review_status; row.reviewed_by = body.reviewer || 'local_analyst'; row.review_note = body.note || ''; row.reviewed_at = new Date().toISOString(); row.attribution_chain = attributionChain(row.case_id, row, row); writeJsonFile(FILES.candidates, rows); const st = projectState(); st.review_states = st.review_states || {}; st.review_states[row.id] = { review_status: row.review_status, reviewed_by: row.reviewed_by, reviewed_at: row.reviewed_at, note: row.review_note }; st.updated_at = new Date().toISOString(); writeJsonFile(FILES.projectState, st); audit('review_state_updated', { candidate_id: row.id, review_status: row.review_status }); return send(res, 200, { ok: true, candidate: row, reviewed_is_share_approved: row.review_status === 'share_approved' }); }
    if (url.pathname === '/api/legacy/import' && req.method === 'POST') { const body = await readBody(req); const imported = { id: 'import_' + Date.now(), created_at: new Date().toISOString(), counts: { items: (body.items || []).length, sources: (body.sources || []).length, claims: (body.claims || []).length, evidence: (body.evidence || []).length, media_manifests: (body.media_manifests || body.media || []).length }, candidate_only: true }; const log = readJsonFile(FILES.legacyImport, []); log.push(imported); writeJsonFile(FILES.legacyImport, log); audit('legacy_import', imported.counts); return send(res, 200, { ok: true, import: imported }); }
    if (url.pathname === '/api/reports/export') { const caseId = url.searchParams.get('case_id') || ''; const format = (url.searchParams.get('format') || 'html').toLowerCase(); const rows = exportRows(caseId); audit('report_export', { case_id: caseId || 'all', format, rows: rows.length }); if (format === 'csv') return send(res, 200, asCsv(rows), 'text/csv; charset=utf-8'); if (format === 'geojson') return send(res, 200, asGeoJson(rows)); if (format === 'stix') return send(res, 200, asStix(rows)); if (format === 'misp') return send(res, 200, asMisp(rows)); return send(res, 200, asHtml(rows, caseId), 'text/html; charset=utf-8'); }

    const p = path.join(ROOT, decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!p.startsWith(ROOT)) return send(res, 403, { error: 'forbidden' });
    if (fs.existsSync(p) && fs.statSync(p).isFile()) { const ext = path.extname(p).toLowerCase(); res.writeHead(200, { 'content-type': mime[ext] || 'application/octet-stream' }); return fs.createReadStream(p).pipe(res); }
    return send(res, 404, { error: 'not found' });
  } catch (err) { return send(res, 500, { error: err.message }); }
});

server.listen(PORT, () => console.log(`LegoLens Core v3.0.0 backend: http://localhost:${PORT}`));
