import http from 'node:http';
import { spawn } from 'node:child_process';

const PORT = 8787;
const base = `http://127.0.0.1:${PORT}`;

function request(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(base + path, {
      method,
      headers: payload ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) } : {}
    }, (res) => {
      let raw = '';
      res.on('data', (chunk) => raw += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: raw ? JSON.parse(raw) : null, raw }); }
        catch { resolve({ status: res.statusCode, body: raw, raw }); }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function waitForServer() {
  const started = Date.now();
  while (Date.now() - started < 8000) {
    try {
      const res = await request('/api/health');
      if (res.status === 200 && res.body?.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('server did not start');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const child = spawn(process.execPath, ['backend/server.mjs'], { stdio: ['ignore', 'pipe', 'pipe'] });
try {
  await waitForServer();
  const health = await request('/api/health');
  assert(health.body?.release === 'v3.0.0', 'health endpoint is not v3.0.0');

  await request('/api/ingestion/clear', 'POST', {});
  const runAll = await request('/api/ingestion/run-all', 'POST', { limit_per_case: 40 });
  assert(runAll.status === 200 && runAll.body?.ok, 'run-all failed');
  assert(runAll.body?.candidate_only === true, 'run-all is not candidate-only');
  assert(Array.isArray(runAll.body?.candidates), 'run-all candidates missing');

  const stored = await request('/api/ingestion/candidates');
  assert(stored.body?.candidates?.length === runAll.body.candidates.length, 'runtime candidates not persisted');

  const states = await request('/api/review/states');
  assert(states.body?.states?.includes('reviewed'), 'reviewed state missing');
  assert(states.body?.states?.includes('share_approved'), 'share_approved state missing');

  const first = stored.body.candidates[0];
  if (first) {
    const review = await request('/api/review/update', 'POST', { candidate_id: first.id, review_status: 'reviewed', reviewer: 'release_gate', note: 'Release gate review check' });
    assert(review.status === 200 && review.body?.ok, 'review update failed');
    assert(review.body?.candidate?.review_status === 'reviewed', 'review status not persisted');
    assert(review.body?.reviewed_is_share_approved === false, 'reviewed incorrectly implies share approval');
  }

  const legacy = await request('/api/legacy/import', 'POST', { items: [{}], sources: [{}], claims: [{}], evidence: [{}], media_manifests: [{}] });
  assert(legacy.status === 200 && legacy.body?.ok, 'legacy import failed');

  for (const format of ['html', 'csv', 'geojson', 'stix', 'misp']) {
    const exp = await request(`/api/reports/export?format=${format}`);
    assert(exp.status === 200, `export failed: ${format}`);
    assert(!String(exp.raw).match(/api[_-]?key|secret|token/i), `secret-like value leaked in ${format} export`);
  }

  const audit = await request('/api/audit');
  assert(Array.isArray(audit.body?.audit), 'audit endpoint invalid');

  console.log('PASS v3.0.0 final release gate');
} finally {
  child.kill('SIGTERM');
}
