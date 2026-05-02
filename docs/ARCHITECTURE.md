# Architectuur

```text
LegoLens Core
├── apps/web                static UI + local bootstrap
├── backend                 optional Node backend/API
├── packages/core           framework concepts
├── packages/data-model     schemas and data contracts
├── packages/review         review-first workflow
├── packages/graph          graph explorer and intelligence
├── packages/reporting      reports and export templates
├── packages/connectors     import/update/AI connector patterns
├── case-packs/iran         bundled demonstration case
├── data                    runtime JSON data
├── assets                  previews, hero visuals, evidence assets
├── docs                    public documentation
└── tests                   release-gate tests
```

## Runtime modes

1. **Static/offline:** open `index.html`. All bundled data is loaded from `data/bootstrap.js`.
2. **Backend mode:** run `node backend/server.mjs` for API routes, OpenAI connector configuration and local services.
3. **Repository mode:** push the project to GitHub and let contributors work through issues, PRs and CI.

## Design principles

- Local-first by default.
- Optional backend for secrets and integrations.
- Case packs separate from core framework.
- Candidates must be reviewed before publication.
- Data contracts are schema-driven.
- Release gate validates data, docs, security and workflow.
