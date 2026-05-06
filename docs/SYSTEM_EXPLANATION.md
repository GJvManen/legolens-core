# LegoLens Core v3.0.0 system explanation

LegoLens Core v3.0.0 is a local-first review workspace.

The system is built around these principles:

- new material is collected as candidate records;
- attribution is preserved across case, source and review context;
- analyst review is required before internal use;
- share approval is separate from review;
- runtime state is stored locally;
- local outputs are generated only through explicit actions;
- screenshots are captured from the real browser interface.

## Runtime model

The application uses:

- `index.html` as the browser entrypoint;
- `app_v3.js` as the v3 interface runtime;
- `backend/server.mjs` as the local API runtime;
- `data/app_data.json` and `data/source_set.json` as v3 registries;
- `runtime/` for generated local state.

## Review states

The v3 review model uses candidate, triaged, needs-evidence, linked-to-claim, reviewed, rejected, share-blocked and share-approved states.

## Documentation

Use the repository README, `docs/RELEASE_NOTES_V3_0_0.md` and `docs/QC_REPORT_V3_0_0.md` as the current v3 documentation set.
