# LegoLens Core v2.0.0

LegoLens Core is a neutral, review-first intelligence platform for monitoring complex information environments.

Version 2.0.0 productizes the framework with multi-case dashboards, content acquisition, candidate-only updates, stable chart rendering, demo mode, connector configuration templates and Exchange Center governance for STIX/TAXII/MISP and other open standards.

## What is included

- Neutral LegoLens Core branding.
- Multi-case Case Pack Library: Iran, Sudan, Gaza Regional Spillover, Ukraine Donbas, Red Sea Yemen, Sahel and Demo Mode.
- Case dashboards with preview carousels, metrics, claims, sources, evidence and graph summaries.
- Content Acquisition Layer with source registry, connector registry, candidate queue, deduplication, enrichment and sensitivity checks.
- Content Update Center with candidate-only update flow and transactional update model.
- Review Workbench for approve, reject, duplicate, needs-more-evidence and share-review actions.
- Exchange Center for STIX 2.1, TAXII 2.1, MISP Event JSON/API and other open standards.
- External Connections for ChatGPT/OpenAI, MISP, TAXII, STIX, RSS, JSON and CSV.
- Stable chart layer with responsive cards, numeric labels and fallback bars.
- Graph Dataset Statistics with case-pack coverage, node/edge stats, platform mix and report coverage.
- Multilingual UI foundation and publication files.
- Release gate and regression tests.

## Start locally

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

## Core rule

All new content enters as candidates. Connectors and exchange imports may not write directly to approved content.

```text
new content → candidates → review → approved content → evidence / claims / graph / reports / exchange
```

## v2.0 release documentation

- Full release documentation: `docs/RELEASE_V2_0.md`
- Screenshot guide: `docs/screenshots/v2_0/README.md`
- Content Acquisition Layer: `docs/CONTENT_ACQUISITION_LAYER.md`
- External standards and connectors: `docs/EXTERNAL_STANDARDS_CONNECTORS_V2.md`

## Responsible use

LegoLens is a review-first framework. Starter content, external imports and generated candidates are for triage and workflow testing. Do not publish or exchange findings externally without analyst review, corroboration and sharing approval.
