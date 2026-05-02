# LegoLens Iran v94.2 — AI Update Connector & Dashboard Graphics

Generated: 2026-05-02T10:45:00Z

## Summary

v94.2 adds a safe AI Update Connector to the Admin panel and backend, without placing API keys in the browser. It also adds a dashboard graphics catalog and metrics layer for infrastructure, evidence, candidate triage, source reliability, claims, narrative/TTP mapping and update integrity.

## Data preservation

- Items preserved: 476 / 476
- Sources preserved: 382 / 382
- Families preserved: 10 / 10
- `needs_review` families preserved: 5
- New published content items added: 0
- Existing content removed: 0

## AI Update Connector

Admin now includes an AI Update Connector with backend endpoint, model profile, update mode, scope, max candidates and review policy. The connector calls `/api/ai/*` endpoints. Server-side calls may use `OPENAI_API_KEY`; when the key is absent, the backend returns a deterministic mock candidate for testing.

AI output is candidate-only and must pass human review before becoming a patch.

## Dashboard graphics added

See `data/dashboard_graphics_catalog_v94_2.json` and the new **Dashboard Graphics** tab in the app.

Priority graphics:

1. Infrastructure graph
2. Propagation Sankey
3. Incident timeline
4. Evidence completeness funnel
5. Candidate triage dashboard
6. Source reliability distribution
7. Claim verification matrix
8. Narrative × TTP heatmap
9. Update integrity panel
10. Platform/coverage mix

## Update mechanism

`update_manifest.json` now points to `update_package_v94_2.json`. Offline Check now still opens the import picker; HTTP/backend mode fetches the package directly.
