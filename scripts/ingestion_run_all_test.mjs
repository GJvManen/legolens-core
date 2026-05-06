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
        try { resolve({ status: res.statusCode, body: raw ? JSON.parse(raw) : null }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
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

const child = spawn(process.execPath, ['backend/server.mjs'], { stdio: ['ignore', 'pipe', 'pipe'] });
try {
  await waitForServer();
  await request('/api/ingestion/clear', 'POST', {});
  const out = await request('/api/ingestion/run-all', 'POST', { limit_per_case: 40 });
  if (out.status !== 200 || !out.body?.ok) throw new Error('run-all failed');
  if (!out.body.candidate_only) throw new Error('run-all did not report candidate_only');
  if (!out.body.cases_tested || !Array.isArray(out.body.candidates)) throw new Error('run-all response shape invalid');
  const stored = await request('/api/ingestion/candidates');
  if (!stored.body?.candidates?.length) throw new Error('no runtime candidates stored');
  console.log('PASS ingestion run-all framework test with candidate-only fallback');
} finally {
  child.kill('SIGTERM');
}
