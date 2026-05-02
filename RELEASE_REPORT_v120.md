# LegoLens Iran v120 Release Report

Generated: 2026-05-02T15:45:00Z

## Status

**PASS** — v120 release gate and validation scaffold are included.

## Scope

v120 implements the stabilization, data quality, workflow, graph/reporting and governance recommendations from the v116 assessment while preserving all legacy core records.

## Core counts

- Items: 476
- Sources: 382
- Source families: 10
- Evidence records: 476
- Claims: 14
- Incidents: 6
- Network nodes: 925
- Network edges: 1803

## Implemented recommendation map

| Recommendation | v120 implementation |
|---|---|
| Eén versiebron | `data/version.json`, updated README, title, sidebar and release manifest |
| Reproduceerbare build | `package.json`, `scripts/build_bootstrap.mjs`, `scripts/validate_v120_release.mjs`, checksum script |
| Lazy-load architecture | `src/` module scaffold and `data/lazy_load_manifest_v120.json`; runtime remains backwards-compatible with bootstrap |
| Testen/release gate | v120 release gate plus data, graph, report and update tests |
| Datakwaliteit | Confidence scoring and evidence/source-family review workflows |
| Backend hardening | Localhost CORS default and v120 API endpoints |
| Analyst workflow | Today/Monitor/Investigate/Review/Report/Admin hubs |
| Graph Explorer | Graph intelligence sidecar with community/path-analysis model |
| Report Builder | DOCX/PPTX/PDF-ready report runtime templates plus export payloads |
| AI governance | Candidate-only AI governance with human-review-required policy |

## Known limitations

- DOCX/PPTX/PDF outputs are structured runtime/export templates inside the app, not full binary in-browser exports yet.
- Deep codebase refactoring into modules is scaffolded, not a full rewrite, to avoid breaking offline runtime compatibility.
- Source-family statuses are not auto-promoted; `needs_review` remains where human verification is still required.
