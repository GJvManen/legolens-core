# LegoLens Iran v99.2 — API-key save & thumbnail hotfix

Generated: 2026-05-02T12:00:52.843336Z

## Fixes

1. Admin API-key save flow hardened:
   - backend endpoint `/api/openai/config/save` tested;
   - runtime config path: `runtime_config/openai_config.local.json`;
   - browser receives only masked key/status;
   - if backend is unreachable, Admin downloads `openai_config.local.json` instead of pretending the key was saved.

2. Thumbnail rendering restored and hardened:
   - asset previews present: 476 / 476;
   - fallback order: thumbnail_url → preview_path → assets/previews/<item_id>.jpg → thumbnail_fallback_url → assets/fallback.jpg → generated SVG metadata preview;
   - cards no longer render blank if the bundle is moved or an asset path is unavailable.

## Validation

- Items: 476
- Sources: 382
- Families: 10
- Candidate queue: 38
- Missing preview assets: 0
- Direct publication: off
- AI output policy: candidate-only

## Usage

Start backend:

```bash
cd legolens_iran_v99_2_bundle
node backend/server.mjs
```

Open `http://localhost:8787`, go to Admin, enter the API-key, click **Sla API-key op**, then **Laad projecten** and **Verbind geselecteerd project**.
