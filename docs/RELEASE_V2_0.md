# LegoLens Core v2.0.0 Release Documentation

## Release status

LegoLens Core v2.0.0 is the major framework release that moves LegoLens from a local-first, review-first intelligence framework toward a professional multi-case intelligence platform.

## Product positioning

LegoLens Core v2.0 is a neutral, review-first intelligence platform for collecting, reviewing, analyzing and exchanging structured intelligence across multiple case packs.

## Major capabilities

- Multi-case Case Pack Library: Iran, Sudan, Gaza Regional Spillover, Ukraine Donbas, Red Sea Yemen, Sahel and Demo Mode.
- Case dashboards with visual previews, metrics, claims, sources, reports and graph summaries.
- Content Acquisition Layer with source registry, connector registry, candidate queue, deduplication, enrichment, sensitivity checks and promotion workflow.
- Content Update Center with candidate-only import, diffing, deduplication, policy checks, audit logging and rollback model.
- Review Workbench with approve, reject, duplicate, needs-more-evidence and share-review actions.
- Exchange Center for STIX 2.1, TAXII 2.1, MISP Event JSON/API, MISP Taxonomies, MISP Galaxies and additional open standards.
- Stable chart layer with responsive cards, numeric labels and fallback bars.
- Graph Dataset Statistics with case-pack coverage, node/edge stats, platform mix and report coverage.
- External Connections for ChatGPT/OpenAI, MISP, TAXII, STIX file exchange, RSS, JSON and CSV.
- Multilingual UI foundation in 14 languages.
- Demo Mode with safe synthetic content.
- Local backend API foundation.
- Release gate and regression tests.

## Open standards and interoperability

Supported exchange directions include:

- STIX 2.1 bundle export/import as candidates.
- TAXII 2.1 backend-only collection push/pull model.
- MISP Event JSON import/export and later MISP API sync.
- MISP Taxonomies and Galaxies for context and classification.
- CACAO Security Playbooks for response workflow modeling.
- OpenC2 as blocked-by-default command-intent standard.
- Sigma and YARA for detection-rule exchange.
- CSAF for security advisory exchange.
- OSCAL for governance/compliance metadata.
- OCSF for event normalization.
- MITRE ATT&CK mapping through STIX/context models.
- OpenAPI for API documentation.
- GeoJSON for geospatial exports.
- SPDX and CycloneDX for software/supply-chain metadata.

## Safety model

LegoLens must not become an uncontrolled publishing pipe.

Rules:

- New content starts as candidates.
- Imported STIX/MISP data starts as external candidates.
- Reviewed does not mean share-approved.
- Sharing requires explicit export profile approval.
- MISP `to_ids` must not become true automatically.
- MISP distribution must not become public automatically.
- TAXII/MISP live APIs are backend-only.
- Secrets are never stored in frontend code.
- Sensitive claims require human review.

## Local validation

Run:

```bash
npm run build
npm run validate
npm test
npm run release:check
node backend/server.mjs
```

Open:

```text
http://localhost:8787
```

## Screenshot guide

See `docs/screenshots/v2_0/README.md` for annotated interface screenshots.
