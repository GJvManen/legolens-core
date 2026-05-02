# Volledige uitleg van het LegoLens-systeem

## 1. Wat is LegoLens?

LegoLens is een framework dat teams helpt om ruwe informatie om te zetten in bruikbare intelligence. Het systeem begint bij signalen en eindigt bij gevalideerde rapportage. Daartussen zitten verrijking, review, evidence, graph-analyse en governance.

## 2. Hoofdstroom

```text
Signaal → Candidate → Review → Content Item → Evidence → Analyse → Rapportage → Monitoring
```

### Signaal
Een signaal is een mogelijke nieuwe observatie: een bron, post, link, screenshot, claim, trend of externe update.

### Candidate
Een candidate is nog geen gepubliceerde content. Het is een voorgesteld item dat eerst door een analist moet worden bekeken.

### Review
De review-laag bepaalt wat er gebeurt: goedkeuren, afwijzen, markeren als duplicate of terugzetten naar needs more evidence.

### Content item
Een goedgekeurd candidate wordt een content item. Vanaf dat moment kan het meedoen in search, graph, evidence, claims en rapportage.

### Evidence
Evidence beschrijft waarom een item relevant of betrouwbaar is: bron-URL, preview, screenshot, metadata, archive, capture status en verificatiestatus.

### Analyse
De analyse-laag verbindt items met claims, narratieven, incidenten, bronnen, source families en graph-relaties.

### Rapportage
Rapportage zet gevalideerde inzichten om in executive briefs, incident reports, evidence appendices en dashboard output.

## 3. Waarom review-first?

Review-first betekent dat het systeem helpt met verzamelen en structureren, maar geen automatische waarheid produceert. Dat is cruciaal in conflictsituaties, omdat verkeerde duiding echte schade kan veroorzaken. AI, imports en externe signalen blijven daarom candidates totdat een mens ze beoordeelt.

## 4. Belangrijkste datatypes

| Type | Betekenis |
|---|---|
| `item` | Contentobject, post, artikel, signaal of observatie |
| `source` | Herkomst van items |
| `source_family` | Groepering van bronnen |
| `evidence` | Bewijslaag rond een item |
| `claim` | Bewering of narratief element |
| `incident` | Gebeurtenis of analysecluster |
| `candidate` | Nog niet goedgekeurde suggestie |
| `review_log` | Audit trail van beslissingen |
| `case_pack` | Dataset en context voor een specifieke casus |

## 5. Hoe werkt de UI?

- **Today:** dagstart, release status en open risico's.
- **Monitor:** overzicht van confidence, date quality en source-family review.
- **Investigate:** items met lage confidence, evidence gaps en broncontext.
- **Review:** menselijke beoordeling van candidates en datakwaliteit.
- **Report:** rapportage-outputs en exports.
- **Admin Hub:** manifesten, release gate, update status en configuratie.
- **Content:** goedgekeurde items en previews.
- **Graph Explorer:** netwerkrelaties tussen items, bronnen en claims.

## 6. Hoe werkt het confidence-model?

Het confidence-model is uitlegbaar en niet bedoeld als automatische waarheid. Het combineert bijvoorbeeld bronbetrouwbaarheid, evidence-completeness, datumkwaliteit, archiefbeschikbaarheid, reviewstatus en onzekerheidsflags. De score helpt prioriteren; de analist beslist.

## 7. Hoe werkt rapportage?

Rapportages mogen alleen worden gebruikt als hun onderliggende items en evidence voldoende zijn beoordeeld. De output kan bestaan uit:

- executive summary
- key findings
- claims en evidence
- bronbetrouwbaarheid
- onzekerheden
- open vragen
- aanbevolen vervolgstappen
- evidence appendix

## 8. Hoe werkt de case-packstructuur?

LegoLens Core is generiek. De Iran-data staat als case pack bovenop de kern. Een nieuw project kan een eigen case pack maken met dezelfde structuur: `case.json`, items, sources, evidence, claims, graph en previews.

## 9. Hoe werkt AI-koppeling?

AI is optioneel en server-side. AI mag kandidaten voorstellen, samenvatten, clusteren en evidence gaps markeren. AI mag niet zelfstandig publiceren, verifiëren of bestaande records overschrijven. De OpenAI API-key hoort in environment variables of backend runtime config, nooit in browsercode.

## 10. Waarom werkt dit ook buiten Iran?

De onderliggende informatieproblemen zijn vergelijkbaar in veel conflict- en crisiscontexten: snelle signalen, tegenstrijdige claims, onduidelijke bronnen, narratieve escalatie en behoefte aan evidence-backed rapportage. LegoLens abstraheert dit naar een generieke workflow die per case pack kan worden ingevuld.

## 11. Release-data

Deze v1.0-bundel bevat 476 items, 382 bronnen, 476 evidence-records en 10 source families. De officiële entrypoint is `index.html`.
