# Intelligence Quality — LegoLens Core v1.2

v1.2 introduces the first structured intelligence-quality layer for LegoLens Core.

## Goals

- Make confidence explainable.
- Track evidence status explicitly.
- Improve source reliability handling.
- Prepare case packs for review-first publication workflows.
- Support cross-case graph analysis.

## Evidence status model

Recommended statuses:

- `unverified`
- `partially_verified`
- `verified`
- `disputed`
- `duplicate`
- `sensitive`
- `needs_corroboration`
- `needs_geolocation`
- `needs_translation`
- `archived`

## Confidence explanation

Confidence scores should be shown with reasons, for example:

```text
Confidence: 78%
✓ evidence present
✓ source known
✓ human review available
⚠ source reliability mixed
⚠ date precision uncertain
```

## Source reliability

Source reliability should not be treated as permanent truth. It is a working assessment that can change over time.

Recommended dimensions:

- source type
- track record
- corroboration
- transparency
- proximity to event
- bias / perspective
- archive availability

## Review-first rule

No imported or AI-generated item becomes approved content automatically. All publication-oriented decisions require human review.
