# LegoLens Iran v99.0 — Auth, Governance & Hardening Release

Generated: 2026-05-02T11:45:00Z

## Summary

This release upgrades v94.2 through v99.0 without changing the canonical published content set.

- v95: browser-tested release pipeline and release-gate test plan.
- v96: SQLite persistence scaffold for review/admin/auth state.
- v97: evidence automation work queues.
- v98: advanced graph analytics metrics.
- v99: multi-user governance and browser-admin ChatGPT/OpenAI authorization with project selection.

## ChatGPT/OpenAI authorization

The Admin panel now contains a **ChatGPT/OpenAI Authorization** card.

Flow:

1. Authorize ChatGPT/OpenAI from the browser UI.
2. The backend validates `OPENAI_API_KEY` or enters mock mode.
3. Load available backend project profiles.
4. Select a project.
5. Connect selected project.
6. AI discovery output remains candidate-only / staged update only.

No API key is stored in the browser.

## Validation

| Check | Result |
|---|---:|
| Items retained | 476 |
| Sources retained | 382 |
| Families retained | 10 |
| needs_review families retained | 5 |
| New public content added | 0 |
| AI key in browser | No |
| Project choices | 3 |
| Release gate | PASS |

## Important limitation

The project selection is a backend registry/profile selection for OpenAI API usage. It does not read or modify ChatGPT UI workspace/project contents. A production deployment should connect this to an enterprise identity provider and a managed secrets store.
