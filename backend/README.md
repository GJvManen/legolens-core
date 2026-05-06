# LegoLens Core v3.0.0 Backend

This directory contains the local Node.js backend for LegoLens Core v3.0.0.

The backend supports the v3 local-first workflows:

- health and version checks;
- local project state;
- candidate-only ingestion;
- all-case source sync;
- review-state updates;
- legacy JSON import;
- audit logging;
- backup and restore;
- local report and export previews.

## Start

Run from the repository root:

```bash
node backend/server.mjs
```

Open:

```text
http://localhost:8787
```

## Runtime state

The backend creates local runtime files under `runtime/`.

Runtime files are operational local state and should not be committed with analyst data.

## Safety model

- Ingestion is candidate-only.
- Internal review is separate from share approval.
- Exports are local previews.
- External connector configuration stays backend-side.
