# LegoLens Core v3.0.0 Final Release Notes

LegoLens Core v3.0.0 is the final local-first 3.0 release.

## Highlights

- Persistent local project state.
- Persistent candidate-only ingestion queue.
- All-case ingestion endpoint: `POST /api/ingestion/run-all`.
- Review-first workflow with explicit review states.
- Clear separation between `reviewed` and `share_approved`.
- Legacy JSON import for items, sources, claims, evidence and media manifests.
- Media Library attribution records with source, platform, status, URL status and attribution chain.
- Local backup and restore workflow.
- Local export previews for HTML, CSV, GeoJSON, STIX and MISP.
- Backend-only connector references for secrets.

## Review states

The release documents and validates the following states:

- `candidate`
- `triaged`
- `needs_evidence`
- `linked_to_claim`
- `reviewed`
- `rejected`
- `share_blocked`
- `share_approved`

## Attribution chain

Every candidate and export-facing record should retain this chain:

```text
Repository → Case → Source family → Source → Platform → Narrative → Item → Review state
```

## Validation summary

```text
PASS v3.0.0 validation
PASS UI static test
PASS v3.0.0 static browser/layout smoke
PASS v3.0.0 final release gate
PASS ingestion run-all framework test with candidate-only fallback
```

## Release gate summary

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

## GitHub publication notes

- Do not commit private runtime data.
- Do not commit connector secrets or API keys.
- Keep STIX and MISP output as preview/export output unless explicit sharing approval has been recorded.
- Runtime files should be regenerated locally by the application.
