# Case Pack Content Enrichment — v1.2

LegoLens v1.2 expands the Case Pack Library with content-rich starter packs.

## Included case packs

- Iran
- Sudan
- Gaza Regional Spillover
- Ukraine Donbas
- Red Sea Yemen
- Sahel

## Starter content model

Each enriched case pack should contain:

- `case.json`
- `sources.json`
- `items.json`
- `claims.json`
- `evidence.json`
- `graph.json`
- `risk_model.json`
- `README.md`

## Content policy

Starter content is intended for:

- analyst onboarding
- workflow testing
- review queue testing
- report template testing
- graph relationship modelling
- source reliability modelling

Starter content is not automatically verified. It must remain review-first.

## Media policy

Media is external by default:

```text
media_policy = external_media_packs_only
```

The public core repository should not include heavy screenshots, downloaded media, previews, social campaign graphics or raw visual evidence.

## Recommended next step

Use the Case Pack SDK in a future release to create, validate, import and export case packs consistently.
