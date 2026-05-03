# Content Acquisition Layer

The Content Acquisition Layer is the planned ingestion architecture for LegoLens Core. Its goal is to make LegoLens more effective at collecting relevant content while preserving the review-first model.

## Core principle

No connector may write directly to approved content.

All collected material must enter the system as a candidate first.

```text
Source Registry
→ Connector
→ Raw Candidate
→ Normalization
→ Deduplication
→ Enrichment
→ Sensitivity / PII / policy checks
→ Review Queue
→ Human approval
→ Approved Content
→ Evidence / Claims / Graph / Reports
```

## Main components

```text
Content Acquisition Layer
  ├── Source Registry
  ├── Connector Registry
  ├── Connector Runner
  ├── Ingestion Scheduler
  ├── Raw Candidate Store
  ├── Normalization Engine
  ├── Deduplication Engine
  ├── Enrichment Engine
  ├── Sensitivity Filter
  ├── Candidate Queue
  ├── Review Workbench
  ├── Promotion Engine
  └── Ingestion Audit Log
```

## Source Registry

The Source Registry is the central list of sources that LegoLens is allowed to monitor.

Recommended fields:

```json
{
  "source_id": "src_sudan_unhcr",
  "name": "UNHCR Sudan Emergency",
  "url": "https://example.org",
  "type": "humanitarian",
  "case_ids": ["sudan"],
  "languages": ["en", "ar"],
  "reliability_class": "institutional",
  "status": "active",
  "review_status": "approved",
  "retrieval_policy": {
    "enabled": true,
    "frequency": "daily",
    "max_items_per_run": 25
  },
  "risk_policy": {
    "sensitive": true,
    "pii_risk": "medium",
    "human_review_required": true
  }
}
```

## Connector Registry

Connectors describe how content is retrieved.

Initial connector types should be simple, auditable and low-risk:

- manual URL importer
- RSS connector
- JSON feed connector
- CSV importer
- local archive importer
- research note importer
- ReliefWeb-style feed importer

Later connector types may include:

- web page importer
- sitemap importer
- PDF metadata importer
- YouTube metadata importer
- Telegram export importer
- web archive importer

## Candidate Pipeline

Every collected object becomes a candidate.

Candidate lifecycle:

```text
new
queued
normalized
deduplicated
enriched
policy_checked
needs_review
approved
rejected
duplicate
archived
```

Recommended candidate fields:

```json
{
  "candidate_id": "cand_sudan_000001",
  "case_id": "sudan",
  "source_id": "src_sudan_unhcr",
  "connector_id": "rss_unhcr_sudan",
  "title": "Displacement update signal",
  "url": "https://example.org/update",
  "retrieved_at": "2026-05-03T12:00:00Z",
  "language": "en",
  "status": "needs_review",
  "content_hash": "sha256:example",
  "deduplication": {
    "possible_duplicate": false,
    "similarity_score": 0.12,
    "matched_item_ids": []
  },
  "sensitivity": {
    "contains_pii": false,
    "sensitive_claim": true,
    "visual_evidence": false,
    "requires_human_review": true
  }
}
```

## Normalization Engine

The Normalization Engine converts different source formats into one candidate model.

It should normalize:

- title
- URL
- source ID
- connector ID
- published time
- retrieved time
- language
- raw text
- summary
- content hash
- case ID

## Deduplication Engine

Deduplication prevents reviewers from being overwhelmed.

Levels:

1. Exact duplicate: same URL, canonical URL, content hash or source plus published timestamp.
2. Near duplicate: similar title, similar summary, same source family or same claim area.
3. Later semantic duplicate: embedding similarity, event similarity and cross-language duplicate detection.

## Enrichment Engine

Enrichment may suggest, but must not approve.

Suggested enrichment tasks:

- language detection
- case-pack tagging
- risk-tag suggestion
- claim suggestion
- source-family mapping
- event-date extraction
- location hint extraction
- actor hint extraction
- evidence type suggestion

## Sensitivity Filter

The Sensitivity Filter is required for conflict and crisis contexts.

It should detect or flag:

- PII
- private persons
- casualty claims
- allegations
- sensitive images
- locations of vulnerable groups
- military details
- medical information
- minors

Policy result example:

```json
{
  "sensitivity_level": "high",
  "contains_pii": false,
  "contains_casualty_claim": true,
  "human_review_required": true,
  "external_publication_blocked": true,
  "reason": "Casualty-related claim requires corroboration."
}
```

## Review Queue

Review filters should include:

- case pack
- source
- connector
- language
- retrieved date
- sensitivity level
- duplicate likelihood
- risk tag
- claim suggestion
- review priority
- assignee

Bulk actions should include:

- approve
- reject
- mark duplicate
- needs more evidence
- assign reviewer
- archive
- export review patch

## Promotion Engine

Only approved candidates may become content items.

```text
Candidate approved
→ create item
→ create evidence record
→ update search index
→ update graph suggestions
→ write audit log
→ candidate status = approved
```

## Ingestion Audit Log

Every retrieval run must be auditable.

Recommended run fields:

```json
{
  "run_id": "run_20260503_001",
  "connector_id": "rss_unhcr_sudan",
  "case_id": "sudan",
  "started_at": "2026-05-03T12:00:00Z",
  "finished_at": "2026-05-03T12:00:08Z",
  "status": "success",
  "fetched": 20,
  "new_candidates": 8,
  "duplicates": 10,
  "errors": 0,
  "warnings": ["2 items missing published_at"]
}
```

## Source usefulness scoring

LegoLens should learn which sources are useful.

Metrics:

- runs
- fetched total
- new candidates
- approved candidates
- duplicates
- rejected items
- error rate
- approval rate
- duplicate rate
- evidence value score
- retrieval priority
- recommended frequency

High approval rate should increase retrieval priority. High duplicate rate should reduce frequency. High error rate should pause or flag a source.

## Ingestion Center

The Admin UI should eventually include:

```text
Admin → Ingestion Center
```

Sections:

- connector overview
- source registry
- candidate queue
- ingestion runs
- source health
- review backlog
- errors and warnings
- scheduler

Actions:

- run connector now
- pause connector
- approve source
- reject source
- export candidates
- export ingestion log
- reset connector state

## Backend API direction

Initial API surface:

```text
GET    /api/ingestion/connectors
POST   /api/ingestion/connectors/:id/run
GET    /api/ingestion/runs
GET    /api/ingestion/candidates
POST   /api/ingestion/candidates/:id/review
POST   /api/ingestion/candidates/:id/promote
GET    /api/sources
POST   /api/sources
GET    /api/sources/health
```

Browser-only mode should support manual import only. Scheduled ingestion belongs in backend/local-server mode.

## Security and responsible-use rules

Forbidden defaults:

- no automatic publication
- no credentials in frontend code
- no scraping of private accounts
- no unnecessary PII storage
- no direct publication of casualty claims
- no raw sensitive media in the core repository

Mandatory fields for every candidate:

- source ID
- connector ID
- retrieved timestamp
- content hash
- review status
- human review requirement

## Minimal implementation target

The first implementation release should include:

1. `schemas/candidate.schema.json`
2. `schemas/connector.schema.json`
3. `schemas/source.schema.json`
4. `data/candidate_queue.json`
5. `data/ingestion_runs.json`
6. `docs/INGESTION_ARCHITECTURE.md`
7. `docs/CONNECTOR_POLICY.md`
8. `tests/candidate_schema_test.mjs`
9. `tests/connector_registry_test.mjs`
10. Ingestion Center UI mockup
