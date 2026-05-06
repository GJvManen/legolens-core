# LegoLens Core v3.0.0 Release Notes

LegoLens Core v3.0.0 is the final local-first 3.0 release.

## Release focus

- Local-first runtime with Node.js backend and static browser UI.
- Candidate-only ingestion across all configured case packs.
- Persistent local runtime state.
- Explicit review and share-approval separation.
- Legacy JSON import support.
- Media/source attribution records.
- Audit logging for ingestion, review, import, backup and restore.
- Local export previews for HTML, CSV, GeoJSON, STIX and MISP.
- Reproducible real interface screenshot capture through `scripts/capture_v3_screenshots.py`.

## Core workflow

```text
Source / Import -> Candidate -> Attribution -> Review -> Internal use -> Explicit share approval -> Local export preview
```

## Review states

- `candidate`
- `triaged`
- `needs_evidence`
- `linked_to_claim`
- `reviewed`
- `rejected`
- `share_blocked`
- `share_approved`

Important rule:

```text
reviewed != share_approved
```

## Attribution chain

```text
Repository -> Case -> Source family -> Source -> Platform -> Narrative -> Item -> Review state
```

## Screenshot policy

The release repository no longer stores hand-drawn v2/v3 screenshot mockups as release screenshots.

Real screenshots must be generated from the running application:

```bash
npm run screenshots:capture
```

The capture script writes real Chromium browser captures to `docs/screenshots/v3_0/`.

## Validation commands

```bash
node --check app_v3.js
node --check compat.js
node --check backend/server.mjs
npm test
npm run browser:smoke
npm run release:check
npm run ingestion:run-all
```

## Publication notes

- Do not commit private runtime data.
- Do not commit connector secrets or API keys.
- Keep STIX and MISP output as preview/export output unless explicit sharing approval has been recorded.
- Runtime files should be regenerated locally by the application.
