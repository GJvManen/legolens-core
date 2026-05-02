# LegoLens Iran v115.0 — Local-first Professional Research UI

Generated: 2026-05-02T13:40:23.891663Z

## Scope

This release implements the requested UI and workflow sprint after v110 while keeping the current local-first architecture intact.

- v111 Interface regrouping: Overview, Monitor, Investigate, Review, Report, Admin.
- v112 Unified detail panel: item-centric summary/evidence/provenance/claims/graph/review/history tabs.
- v113 Work queues & bulk review: content, evidence, claim, source and duplicate review queues.
- v114 Report Builder 2.0: local report type/scope/chart/evidence appendix selector and export.
- v115 Graph Explorer: local SVG graph explorer with filters, top centrality nodes and propagation paths.

## Local-first constraints retained

- `data/*.json` remains the source of truth.
- Backend remains optional.
- OpenAI remains optional.
- No direct publication.
- Updates remain staged and patch-first.
- Existing item/source/family records are not deleted or renumbered.

## Validation summary

- Items retained: 476
- Sources retained: 382
- Families retained: 10
- Needs-review families retained: 5
- Preview assets missing: 0
- Work queue tasks: 524
- Report types: 6
- Graph explorer sample edges: 300
- Release gate: PASS

## How to run

Offline:

```text
Open index.html
```

With optional backend:

```bash
node backend/server.mjs
```

Then open:

```text
http://localhost:8787
```
