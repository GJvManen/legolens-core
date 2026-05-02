# LegoLens Iran v99.3 — OpenAI Content Update & Graphics Hotfix

Generated: 2026-05-02T12:55:00Z

## Fixes

- Restored robust thumbnails using CSS background previews plus local asset priority.
- Added optional OpenAI Admin API-key flow for loading real OpenAI API-platform projects.
- Added `POST /api/ai/update-content` to use the server-side OpenAI Responses API as a review-first content-update generator.
- Improved Reports and Dashboard Graphics with donut charts, propagation Sankey-lite, timeline bars, heatmap styling and report coverage panels.

## Security and governance

- Browser can send API/admin keys to the local backend, but keys are stored only in `runtime_config/openai_config.local.json`.
- Keys are never returned to the browser except masked fingerprints.
- OpenAI-generated content updates are staged as candidates/update packages only.
- Existing 476 items, 382 sources, 10 families and 5 needs_review families are retained.

## Backend

Start with:

```bash
node backend/server.mjs
```

Then open `http://localhost:8787`.

## New endpoints

- `GET /api/openai/projects`
- `POST /api/openai/projects/sync`
- `POST /api/ai/update-content`
- Existing `POST /api/openai/config/save` now accepts `admin_api_key`.
