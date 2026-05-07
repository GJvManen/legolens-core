import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 8787);
const types = new Map([['.html','text/html; charset=utf-8'],['.js','text/javascript; charset=utf-8'],['.css','text/css; charset=utf-8'],['.svg','image/svg+xml; charset=utf-8'],['.json','application/json; charset=utf-8']]);

function send(res, code, body, type='text/plain; charset=utf-8') {
  res.writeHead(code, {'content-type': type, 'cache-control': 'no-store'});
  res.end(body);
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (url.pathname === '/api/health') return send(res, 200, JSON.stringify({ok:true, name:'LegoLens', version:'3.0.1'}), 'application/json; charset=utf-8');
  let pathname = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
  pathname = pathname.replace(/\.\./g, '');
  const file = path.join(root, pathname);
  if (!file.startsWith(root)) return send(res, 403, 'Forbidden');
  fs.readFile(file, (err, data) => {
    if (err) return send(res, 404, 'Not found');
    send(res, 200, data, types.get(path.extname(file)) || 'application/octet-stream');
  });
}).listen(port, () => console.log(`LegoLens v3.0.1 runtime: http://localhost:${port}`));
