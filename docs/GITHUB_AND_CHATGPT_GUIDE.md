# GitHub and assistant workflow — LegoLens Core v3.0.0

This guide describes the safe repository workflow for LegoLens Core v3.0.0.

## Repository workflow

Use pull requests for changes to `main`.

Recommended flow:

```text
branch -> commit -> pull request -> CI -> review -> merge
```

Do not push generated runtime data or local analyst state.

## Local validation

Run from the repository root:

```bash
npm install
npm test
npm run browser:smoke
npm run release:check
npm run ingestion:run-all
```

## Screenshot workflow

Real screenshots are generated from the running browser interface:

```bash
npm run screenshots:capture
```

Generated screenshots can be committed from a normal local Git client when binary image upload is required.

## Assistant usage

An assistant can help inspect files, propose patches and prepare pull requests. Destructive changes, release tags and merges should remain review-controlled.

## Safety rules

- Keep runtime data out of commits.
- Keep local configuration out of commits.
- Keep candidate-only ingestion and human review as the default workflow.
- Use CI and pull request review before merging changes to `main`.
