# LegoLens Core v3.0.0 Final QC Report

## Scope

This report records the v3.0.0 final local release validation for LegoLens Core.

## Validated areas

- JavaScript syntax checks.
- Backend syntax checks.
- Static UI validation.
- Browser smoke validation.
- Candidate-only all-case ingestion.
- Runtime candidate persistence.
- Review state and share-approval separation.
- Legacy import support.
- Local export previews.
- Audit event creation.

## Commands

```bash
node --check app.js
node --check compat.js
node --check backend/server.mjs
npm test
npm run browser:smoke
npm run release:check
npm run ingestion:run-all
```

## Results

```text
PASS v3.0.0 validation
PASS UI static test
PASS v3.0.0 static browser/layout smoke
PASS v3.0.0 final release gate
PASS ingestion run-all framework test with candidate-only fallback
```

## Final gate summary

```json
{
  "release": "v3.0.0",
  "cases_tested": 7,
  "candidate_outputs": 104,
  "stored": 104,
  "counts": {
    "fetch_error": 17,
    "metadata_only": 87
  },
  "persisted_after_restart": 104,
  "exports_tested": ["html", "csv", "geojson", "stix", "misp"],
  "audit_events": 6
}
```

## Safety checks

- Candidate-only ingestion remains enforced.
- Review status does not imply share approval.
- Export output should exclude connector secrets.
- Backend connector fields remain references rather than frontend secrets.
- Runtime files are local operational state, not publication artifacts.

## Interface documentation check

The v3.0.0 GitHub documentation uses lightweight SVG interface examples under `docs/screenshots/v3_0/`.

The examples are documentation mockups that reflect the v3.0.0 navigation and release workflow:

- overview dashboard;
- Content Updates run-all ingestion;
- Media Library attribution;
- Review Queue states;
- Reports/export previews;
- Admin connector settings.
