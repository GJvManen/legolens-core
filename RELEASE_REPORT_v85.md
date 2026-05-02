# LegoLens Iran — Release Report v85.0

Generated: 2026-05-02T08:30:00Z

## Summary

This release advances the project from v78.3 to v85.0 while preserving all existing content. It also repairs the update mechanism by replacing the old one-step check with a staged update flow.

## Content preservation

| Check | Result |
|---|---:|
| Items retained | 476 |
| Sources retained | 382 |
| Families retained | 10 |
| Needs-review families retained | 5 |
| Evidence records | 476 |
| Incidents | 6 |
| Candidate queue | 38 |

No canonical items, sources or families were removed.

## Release layers

| Release | Added |
|---|---|
| v78.4 | Stability release: modular app shell, official `index.html`, smoke-test audit |
| v79 | Local backend scaffold and SQLite export |
| v80 | Full-text search and Research mode |
| v81 | Evidence pipeline and gap tracking |
| v82 | FIMI/DISARM-like mapping |
| v83 | Network graph data and UI |
| v84 | Safe monitoring runbook |
| v85 | Report pack and hardened update mechanism |

## Update mechanism fix

The previous flow did not actually update the session after Check now. v85 now supports:

1. `Check now` from a local server or backend.
2. Offline `Import JSON`, including `data/update_package_v85.json`.
3. Staged diff preview.
4. Lossless blocking if existing item IDs disappear.
5. Explicit `Apply staged update`.
6. Session export and review patch export.

## Official entrypoint

Use `index.html`. Older versioned HTML files are not the canonical app entrypoint.
