# LegoLens Core — Full 3.0.1 system documentation

`main` is the documentation branch for **LegoLens Core**. This README documents the Full 3.0.1 package as the canonical system description for the interface, cases, data, GEO, media assets, backend, storage, connectors, governance, review, reporting, exchange and multilingual support.

Source package:

```text
legolens_3_0_1_full_new_interface_no_tests.zip
```

The package itself is not uploaded to `main`. Runtime branches remain separate.

---

## Build facts

| Area | Value |
|---|---:|
| Release | LegoLens 3.0.1 Full |
| Package files | 338 |
| UI version | `3.0.1-full` |
| Entry point | `index.html` |
| Browser runtime | `app.js`, `app.css`, `ui-v301-command-center.css`, `compat.js` |
| Backend | `backend/server.mjs` |
| Case packs | 7 |
| Interface routes | 19 |
| Framework languages | 15 |
| Source records | 196 |
| Source families | 25 |
| Connector records | 21 |
| Social media platforms | 20 |
| GEO observations | 39 |
| GeoJSON features | 289 |
| Timeline updates | 21 |
| App report templates | 9 |
| Professional report templates | 7 |
| Asset manifest files | 216 |
| Database migrations | 3 |

---

## System architecture

LegoLens Core 3.0.1 Full is a local-first, review-first Command Center for case-based intelligence work. It combines a static browser UI, local Node.js API, JSON seed registries, a SQLite-first storage contract, connector adapters, review workflows, provenance, GEO/media assets and report generation.

Core rule:

```text
reviewed != share_approved
```

Material from connectors, imports, source sync, legacy files or manual updates enters as candidate material first. Review, evidence linking, confidence assessment and share approval are separate steps.

### Architecture layers

| Layer | Responsibility |
|---|---|
| Interface | Static browser Command Center with 19 routes. |
| i18n | 15 supported languages with LTR/RTL handling. |
| Case/content | Case packs, claims, timelines, reports and case-source links. |
| Source registry | 196 sources across 25 source families. |
| GEO/media | GeoJSON, observations, maps, previews, thumbnails and case assets. |
| Backend/API | Local API, static serving, security headers and runtime writes. |
| Storage | SQLite-first contract plus JSON seed/import/export snapshots. |
| Connectors | Web, RSS, Telegram, social and static repository adapters. |
| Governance | Source policy, claim governance, decision logs and audit trail. |
| Review | Candidate states, triage, evidence linking and share decisions. |
| Reporting/exchange | Local report previews and controlled exchange outputs. |
| Security/deployment | Local use by default; shared deployment requires auth, roles and secret isolation. |

### API surface

```text
GET  /api/health
GET  /api/version
GET  /api/app-data
GET  /api/source-set
GET  /api/schema
GET  /api/ingestion/candidates
POST /api/ingestion/clear
POST /api/ingestion/run
GET  /api/review/states
POST /api/review/update
POST /api/legacy/import
GET  /api/reports/export
GET  /api/workflow/config
GET  /api/audit/seed
GET  /api/reports/blueprints
GET  /api/evidence/chains
GET  /api/geo/layers
GET  /api/reports/templates-v39
GET  /api/team/review
GET  /api/team/checklists
GET  /api/team/decision-log
GET  /api/evidence/claim-clusters
GET  /api/evidence/provenance-graph
GET  /api/evidence/conflict-flags
GET  /api/connectors/registry
GET  /api/connectors/health
GET  /api/storage/status
```

### Storage model

Runtime files are local and should not be committed as analyst data:

```text
runtime/ingestion_candidates.json
runtime/audit_log.json
runtime/legacy_import_log.json
```

Database migrations define the SQLite-first direction:

```text
database/migrations/001_init.sql
database/migrations/002_storage_state_indexes.sql
database/migrations/003_v47_database_first.sql
```

---

## Case packs

| Case | Role | Sources | Claims | Reports | Confidence |
|---|---|---:|---:|---:|---:|
| Iran | Nuclear/social-source monitoring | 30 | 8 | 8 | 67 |
| Sudan | Humanitarian-conflict monitoring | 18 | 12 | 0 | 66 |
| Gaza Regional Spillover | Regional spillover and source landscape | 18 | 12 | 0 | 67 |
| Ukraine Donbas | OSINT, map and civil-society sources | 19 | 12 | 0 | 66 |
| Red Sea Yemen | Maritime, shipping and Yemen context | 18 | 12 | 0 | 67 |
| Sahel | Instability, humanitarian and disinformation sources | 18 | 12 | 0 | 65 |
| Demo Mode | Demonstration workspace | 1 | 0 | 0 | 87 |

---

## Interface routes

```text
dashboard, today, datasets, case-dashboard, map, timeline, monitor,
investigate, graph-stats, frameworks, content-updates, content,
legacy-import, media-library, ingestion, review-queue, reports,
exchange, settings
```

---

## System workflows

The Full 3.0.1 system is organized around these workflows. The expanded workflow addendum is in `WORKFLOWS_3_0_1.md`.

| # | Workflow | Description |
|---:|---|---|
| 1 | Local startup and health check | Unpack package, install dependencies, start backend and verify `/api/health`. |
| 2 | App data bootstrap | Load routes, languages, case packs and source registries from API/JSON seeds. |
| 3 | Case workspace navigation | Move from dashboard to case dashboard, claims, sources, GEO and timeline. |
| 4 | Source registry management | Maintain source families, source records, status, language and case links. |
| 5 | Connector configuration and dry run | Configure adapters, test access and validate normalized samples without approval. |
| 6 | Candidate-only ingestion | Fetch, normalize and deduplicate material into the candidate queue only. |
| 7 | Legacy import | Map older JSON files into traceable candidate/import records. |
| 8 | Review queue triage | Classify candidates, request evidence, link claims, reject or continue review. |
| 9 | Evidence chain and provenance | Preserve repository-to-case-to-source-to-item-to-review-state attribution. |
| 10 | GEO observation workflow | Connect observations to GeoJSON, map route, case context and reports. |
| 11 | Media library workflow | Keep media assets tied to source metadata, case links and review state. |
| 12 | Timeline update workflow | Turn dated updates into case chronology with source/evidence references. |
| 13 | Reporting workflow | Generate local previews from reviewed records, evidence and GEO appendices. |
| 14 | Exchange and share approval | Separate internal review from external sharing decisions. |
| 15 | Audit, governance and deployment readiness | Log actions, preserve decisions and prepare secure deployment controls. |

---

## Supported languages

The canonical technical documentation is maintained once to prevent drift. Localized cards provide compact orientation for each supported framework language.

| Code | Language | Direction |
|---|---|---|
| nl | Nederlands | LTR |
| en | English | LTR |
| fa | فارسی | RTL |
| ar | العربية | RTL |
| fr | Français | LTR |
| de | Deutsch | LTR |
| es | Español | LTR |
| tr | Türkçe | LTR |
| ru | Русский | LTR |
| ur | اردو | RTL |
| zh | 中文 | LTR |
| hi | हिन्दी | LTR |
| pt | Português | LTR |
| id | Bahasa Indonesia | LTR |
| ja | 日本語 | LTR |

<details><summary>nl — Nederlands</summary>
LegoLens Core 3.0.1 Full is een lokale, review-first Command Center workspace voor casusonderzoek, bronnen, GEO, media, rapportage en gecontroleerde uitwisseling. Alles komt eerst binnen als candidate: `reviewed != share_approved`.
</details>

<details><summary>en — English</summary>
LegoLens Core 3.0.1 Full is a local-first, review-first Command Center workspace for cases, sources, GEO, media, reporting and controlled exchange. Everything enters as a candidate first: `reviewed != share_approved`.
</details>

<details><summary>fa — فارسی</summary>
LegoLens Core 3.0.1 Full یک محیط محلی و review-first برای پرونده‌ها، منابع، GEO، رسانه، گزارش و تبادل کنترل‌شده است. همه چیز ابتدا candidate است: `reviewed != share_approved`.
</details>

<details><summary>ar — العربية</summary>
LegoLens Core 3.0.1 Full هو مركز قيادة محلي قائم على المراجعة أولاً للقضايا والمصادر وGEO والوسائط والتقارير والتبادل المنضبط. كل شيء يبدأ كـ candidate: `reviewed != share_approved`.
</details>

<details><summary>fr — Français</summary>
LegoLens Core 3.0.1 Full est un espace Command Center local-first et review-first pour les cas, sources, GEO, médias, rapports et échanges contrôlés. Tout commence comme candidate: `reviewed != share_approved`.
</details>

<details><summary>de — Deutsch</summary>
LegoLens Core 3.0.1 Full ist ein lokaler review-first Command-Center-Arbeitsbereich für Fälle, Quellen, GEO, Medien, Berichte und kontrollierten Austausch. Alles beginnt als Candidate: `reviewed != share_approved`.
</details>

<details><summary>es — Español</summary>
LegoLens Core 3.0.1 Full es un Command Center local-first y review-first para casos, fuentes, GEO, medios, informes e intercambio controlado. Todo entra primero como candidate: `reviewed != share_approved`.
</details>

<details><summary>tr — Türkçe</summary>
LegoLens Core 3.0.1 Full vakalar, kaynaklar, GEO, medya, raporlama ve kontrollü paylaşım için yerel ve review-first bir Command Center alanıdır. Her şey önce candidate olur: `reviewed != share_approved`.
</details>

<details><summary>ru — Русский</summary>
LegoLens Core 3.0.1 Full — локальный review-first Command Center для кейсов, источников, GEO, медиа, отчетности и контролируемого обмена. Всё сначала становится candidate: `reviewed != share_approved`.
</details>

<details><summary>ur — اردو</summary>
LegoLens Core 3.0.1 Full کیسز، sources، GEO، media، reporting اور controlled exchange کے لیے مقامی review-first Command Center ہے۔ ہر چیز پہلے candidate ہے: `reviewed != share_approved`۔
</details>

<details><summary>zh — 中文</summary>
LegoLens Core 3.0.1 Full 是用于案例、来源、GEO、媒体、报告和受控交换的本地优先、审核优先 Command Center。所有内容首先进入 candidate：`reviewed != share_approved`。
</details>

<details><summary>hi — हिन्दी</summary>
LegoLens Core 3.0.1 Full cases, sources, GEO, media, reporting और controlled exchange के लिए local-first, review-first Command Center है। हर चीज पहले candidate होती है: `reviewed != share_approved`।
</details>

<details><summary>pt — Português</summary>
LegoLens Core 3.0.1 Full é um Command Center local-first e review-first para casos, fontes, GEO, mídia, relatórios e troca controlada. Tudo entra primeiro como candidate: `reviewed != share_approved`.
</details>

<details><summary>id — Bahasa Indonesia</summary>
LegoLens Core 3.0.1 Full adalah Command Center local-first dan review-first untuk kasus, sumber, GEO, media, pelaporan dan pertukaran terkontrol. Semua masuk pertama sebagai candidate: `reviewed != share_approved`.
</details>

<details><summary>ja — 日本語</summary>
LegoLens Core 3.0.1 Full はケース、ソース、GEO、メディア、レポート、管理された交換のための local-first / review-first Command Center です。すべてはまず candidate です: `reviewed != share_approved`。
</details>

---

## Local runtime

After unpacking the Full 3.0.1 package locally:

```bash
npm install
npm start
```

Open:

```text
http://localhost:8787
```

Validation:

```bash
npm test
```

---

## Branch model

- `main` — documentation and publication explanation for Full 3.0.1.
- `3.0.1` — lightweight runtime branch for quick local evaluation.
- `legolens-v3.0.1-runtime` — earlier/full-runtime context layer.
- `archive/3.0.0` — previous 3.0.0 baseline.

`main` should not contain the uploaded zip, active runtime files, test logs or generated analyst data.
