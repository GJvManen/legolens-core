# Data model

## Core entities

- `items.json`: approved content items.
- `sources.json`: known sources.
- `source_families.json`: grouped sources.
- `evidence.json`: evidence records linked to items.
- `candidate_queue.json`: proposed changes or new items awaiting review.
- `review_log.json`: audit trail for decisions.
- `claims_v93.json`: claim/narrative records.
- `incidents.json`: incident or context clusters.
- `network_graph.json`: nodes and edges for graph analysis.
- `version.json`: central version source.
- `release_manifest.json`: release metadata.

## Approval lifecycle

```text
candidate_queue → reviewed decision → promoted item → evidence → search index → reportable content
```

## Review statuses

Recommended statuses: `pending_review`, `approved`, `rejected`, `duplicate`, `needs_more_evidence`, `archived`.

## Evidence statuses

Recommended statuses: `new`, `needs_review`, `verified`, `partially_verified`, `disputed`, `duplicate`, `archived`, `rejected`.
