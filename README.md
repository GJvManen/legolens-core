# LegoLens Core v3.0.0

**LegoLens Core** is a local-first, review-first intelligence workspace for collecting source material as candidates, preserving attribution, reviewing findings, and exporting controlled local previews.

Version **3.0.0** aligns the repository around a persistent local backend, a compact v3 browser interface, candidate-only ingestion, explicit review states, legacy import support, audit logging, backup/restore, safe local exports and reproducible real interface screenshot capture.

---

## Release status

- **Current release:** `v3.0.0`
- **Release type:** final local release
- **Runtime model:** local Node.js backend with static browser UI
- **Safety model:** review-first, candidate-only ingestion, explicit share approval

Core rule:

```text
No connector, import, sync or update may directly create approved content.
Everything enters as a candidate first.
```

Important distinction:

```text
reviewed != share_approved
```

---

## v3.0.0 architecture

```mermaid
flowchart LR
    S[Sources / Imports] --> C[Candidate records]
    C --> A[Attribution chain]
    A --> R[Human review]
    R --> I[Internal reviewed content]
    I --> P[Explicit share approval]
    P --> E[Local export previews]
```

Runtime files are generated locally under `runtime/`:

```text
runtime/ingestion_candidates.json
runtime/project_state.json
runtime/audit_log.json
runtime/legacy_import_log.json
```

The shared attribution chain is:

```text
Repository -> Case -> Source family -> Source -> Platform -> Narrative -> Item -> Review state
```

---

## Included in v3.0.0

- Persistent local candidate store.
- Persistent local project state.
- Audit trail for ingestion, review, import, backup and restore.
- `POST /api/ingestion/run-all` for all-case candidate-only source sync.
- Review states: `candidate`, `triaged`, `needs_evidence`, `linked_to_claim`, `reviewed`, `rejected`, `share_blocked`, `share_approved`.
- Legacy JSON import support for `items.json`, `sources.json`, `claims.json`, `evidence.json` and media manifests.
- Media/source records with source, platform, status, URL status and attribution chain.
- Local export previews for HTML, CSV, GeoJSON, STIX and MISP.
- Backend-only connector references; secrets are not exported.

---

## Case packs

The v3 registry includes:

- Iran
- Sudan
- Gaza Regional Spillover
- Ukraine Donbas
- Red Sea Yemen
- Sahel
- Demo Mode

---

## Main API endpoints

### Health and runtime

```text
GET  /api/health
GET  /api/project/state
POST /api/project/backup
POST /api/project/restore
GET  /api/audit
```

### Ingestion

```text
POST /api/ingestion/run
POST /api/ingestion/run-all
POST /api/ingestion/clear
GET  /api/ingestion/candidates
```

Example:

```http
POST /api/ingestion/run-all
Content-Type: application/json

{
  "limit_per_case": 40
}
```

### Review

```text
GET  /api/review/states
POST /api/review/update
```

### Legacy import

```text
POST /api/legacy/import
```

### Reports and exports

```text
GET /api/reports/export?case_id=iran&format=html
GET /api/reports/export?case_id=iran&format=csv
GET /api/reports/export?case_id=iran&format=geojson
GET /api/reports/export?case_id=iran&format=stix
GET /api/reports/export?case_id=iran&format=misp
```

---

## Start locally

Requirements:

- Node.js `>=20`
- npm

```bash
npm install
npm start
```

Open:

```text
http://localhost:8787
```

---

## Validation

```bash
node --check app_v3.js
node --check compat.js
node --check backend/server.mjs
npm test
npm run browser:smoke
npm run release:check
npm run ingestion:run-all
npm run screenshots:capture
```

The release checks validate:

- v3.0.0 metadata.
- v3 browser entrypoint.
- Candidate-only all-case ingestion.
- Runtime candidate persistence.
- Review/share approval separation.
- Legacy import.
- HTML, CSV, GeoJSON, STIX-preview and MISP-preview exports.
- Export safety for secret-like values.
- Reproducible real interface screenshot capture.

---

## Screenshots and interface guide

Real v3.0 interface screenshots are generated from the running application, not drawn as mockups.

- [v3.0 screenshot guide](docs/screenshots/v3_0/README.md)
- Screenshot generator: `scripts/capture_v3_screenshots.py`

Generate the full route screenshot set locally:

```bash
npm run screenshots:capture
```

The generator writes `01-dashboard.png` through `19-settings.png` plus `manifest.json` to `docs/screenshots/v3_0/`. The previous v2/v3 mockup SVG files have been removed from the release documentation.

---

## Documentation

Important documents:

- `docs/RELEASE_NOTES_V3_0_0.md`
- `docs/QC_REPORT_V3_0_0.md`
- `docs/CONTENT_ACQUISITION_LAYER.md`
- `docs/screenshots/v3_0/README.md`

---

## Repository cleanup policy

The v3.0.0 release branch keeps the repository focused on the active local-first runtime.

Removed from the release documentation:

- obsolete v2 screenshot/mockup files;
- obsolete v3 screenshot mockup files;
- superseded `*_V3_FINAL.md` reports;
- legacy frontend entrypoints that are not loaded by `index.html`;
- package scripts that point to missing files.

Runtime-generated data under `runtime/` should not be committed.

---

## Responsible use

LegoLens is a review-first framework. Starter content, external imports and generated candidates are for triage and workflow testing. Do not publish or exchange findings externally without analyst review, corroboration and explicit sharing approval.

Sensitive claims, PII, casualty-related claims, allegations, visual evidence and vulnerable-location data require extra review before use or sharing.

---

## GitHub release checklist

Before tagging `v3.0.0`:

```bash
npm install
npm test
npm run browser:smoke
npm run release:check
npm run ingestion:run-all
npm run screenshots:capture
```

Verify:

- `package.json` version is `3.0.0`.
- `data/version.json` release is `v3.0.0`.
- `index.html` loads `app_v3.js`.
- v2/v3 screenshot mockups are not present in the release documentation.
- Real screenshots can be generated with `npm run screenshots:capture`.
- No runtime analyst data is committed.
- No connector secret, API key or private credential is committed.
