# LegoLens Iran v120 Optional Backend

Run from the bundle root:

```bash
node backend/server.mjs
```

Defaults:

- Port: `8787`
- CORS origin: `http://localhost:8787`
- Override CORS for a local dev shell with `LEGOLENS_CORS_ORIGIN=http://localhost:3000`
- OpenAI/API keys remain server-side via environment variables or `runtime_config/openai_config.local.json`.

v120 endpoints include `/api/version`, `/api/release/manifest`, `/api/release/validation`, `/api/quality/confidence`, `/api/report/runtime` and the existing review-first update/AI endpoints.
