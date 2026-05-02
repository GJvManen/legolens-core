# Security Model

## Veiligheidsprincipes

- API keys nooit in browsercode.
- OpenAI of andere externe keys alleen server-side via environment variables of runtime config.
- CORS standaard beperken tot localhost.
- Direct publication uitgeschakeld.
- Human review verplicht.
- Audit log voor beslissingen.
- PII minimaliseren en waar nodig redacteren.

## Aanbevolen rollen

- viewer
- contributor
- analyst
- reviewer
- admin
- maintainer

## Environment variables

```bash
export OPENAI_API_KEY="..."
export LEGOLENS_CORS_ORIGIN="http://localhost:8787"
node backend/server.mjs
```
