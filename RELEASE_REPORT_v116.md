# LegoLens Iran v116.1 — Graph Explorer, Report Builder & UI Cleanup hotfix

Generated: 2026-05-02T14:03:09.472535Z

## Scope

This hotfix addresses the additional user-reported issues:

1. Graph Explorer did not reliably work because the previous v116 override contained a JavaScript syntax error.
2. Report Builder did not provide a reliable local preview/export workflow.
3. Layout and operational update text were cleaned up; release/update notes belong in changelog and release reports.

## Implemented

- Rebuilt `v116_overrides.js` from scratch and syntax-checked it.
- Added working Graph Explorer filters: edge type, node type and incident focus.
- Added local graph SVG export and graph dashboard JSON export.
- Added extra graph charts: node distribution, edge distribution, degree histogram, platform mix, infrastructure reuse, incident connectivity, source family risk, claim × incident matrix and evidence readiness.
- Rebuilt Report Builder as a local workflow with report type, scope, format, chart selection, preview and export.
- Added exports for HTML, Markdown, JSON and CSV.
- Moved release/update explanatory text out of operational interface into `data/changelog_v116.json` and this report.

## Local-first constraints retained

- `data/*.json` remains the source of truth.
- Backend remains optional.
- No content records were added, removed, merged or renumbered.
- OpenAI remains optional.
- No automatic publication.

## Validation

- Items retained: 476
- Sources retained: 382
- Families retained: 10
- Needs-review families retained: 5
- Preview assets missing: 0
- Release gate: PASS
- Graph Explorer audit: PASS
- Report Builder audit: PASS

## Run

Offline: open `index.html`.

Optional backend:

```bash
node backend/server.mjs
```
