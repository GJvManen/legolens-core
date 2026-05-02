# Case Pack Guide

A case pack makes LegoLens reusable for a specific information environment.

## Minimal structure

```text
case-packs/my-case/
  case.json
  README.md
  data/
    items.json
    sources.json
    evidence.json
    claims.json
  previews/
```

## Required `case.json`

```json
{
  "schema_version": "legolens.case-pack.v1",
  "case_id": "my-case",
  "title": "My Case Monitor",
  "version": "1.0.0",
  "framework": "LegoLens Core",
  "framework_version": "1.0.0",
  "publication_policy": "review_first_no_direct_publication",
  "data_files": {}
}
```

## Best practices

- Keep sensitive data out of public repos.
- Add source notes and uncertainty flags.
- Do not publish candidates without review.
- Include a README explaining scope, limitations and responsible use.
