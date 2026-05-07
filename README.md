# LegoLens Core — Full 3.0.1 documentatie

`main` is de documentatiebranch voor **LegoLens Core**.

Deze README is bijgewerkt op basis van de bijgevoegde full package:

```text
legolens_3_0_1_full_new_interface_no_tests.zip
```

De full package zelf wordt niet naar `main` geüpload. Deze branch beschrijft alleen de build, documentatiescope, runtimeverwijzing en reviewprincipes.

## Full 3.0.1 buildscope

| Onderdeel | Waarde |
|---|---:|
| Package | LegoLens 3.0.1 Full |
| Package-bestanden | 338 |
| Versie | `3.0.1` |
| UI-versie | `3.0.1-full` |
| Entrypoint | `index.html` |
| Startscript | `node backend/server.mjs` |
| Casussen | 7 |
| Interface-routes | 19 |
| Talen | 15 |
| Bronrecords | 196 |
| Source families | 25 |
| Connectorrecords | 21 |
| Social media platforms | 20 |
| GEO-observaties | 39 |
| GeoJSON-features | 289 |
| Timeline-updates | 21 |
| App-rapporttemplates | 9 |
| Professionele rapporttemplates | 7 |
| Asset-manifestbestanden | 216 |

## Inhoud van de full build

De Full 3.0.1 build bevat alle casussen, de nieuwe Command Center interface, content/data, GEO-observaties, media-assets, rapportage, backend, storage- en connectorstructuur. Testbestanden en runtime-output zijn uit de package verwijderd.

## Casussen

- Iran
- Sudan
- Gaza Regional Spillover
- Ukraine Donbas
- Red Sea Yemen
- Sahel
- Demo Mode

## Interface-routes

```text
dashboard, today, datasets, case-dashboard, map, timeline, monitor,
investigate, graph-stats, frameworks, content-updates, content,
legacy-import, media-library, ingestion, review-queue, reports,
exchange, settings
```

## Talen

```text
nl, en, fa, ar, fr, de, es, tr, ru, ur, zh, hi, pt, id, ja
```

RTL-weergave is relevant voor onder andere `fa`, `ar` en `ur`.

## Runtime lokaal starten uit de full package

Pak de full package lokaal uit en run:

```bash
npm install
npm start
```

Open daarna:

```text
http://localhost:8787
```

De package definieert `npm test` als syntaxisvalidatie voor:

```text
app.js
backend/server.mjs
```

## Branchmodel

- `main` — documentatie en publicatie-uitleg voor Full 3.0.1.
- `3.0.1` — lichte runtimebranch voor snelle lokale evaluatie.
- `legolens-v3.0.1-runtime` — eerdere/full-runtime contextlaag.
- `archive/3.0.0` — eerdere 3.0.0 baseline.

Runtimebranches blijven ongemoeid. `main` bevat geen actieve runtime, geen testlogs, geen zip-upload en geen gegenereerde analyst-data.

## Review-first principe

Alles komt eerst binnen als candidate. Review en delen zijn aparte stappen.

```text
reviewed != share_approved
```

Connectoren, imports, syncs en updates mogen geen direct goedgekeurde content maken. Publiceerbare output vereist expliciete share approval.
