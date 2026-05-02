# Handleiding: GitHub push en ChatGPT-koppeling

Deze handleiding beschrijft twee routes:

1. de output naar GitHub pushen;
2. LegoLens koppelen aan ChatGPT of de OpenAI API.

## Deel 1 — Project naar GitHub pushen

### Optie A: nieuwe GitHub repository via command line

```bash
unzip legolens_core_v1_0_bundle.zip
cd legolens_core_v1_0

git init
git add .
git commit -m "Release LegoLens Core v1.0"
git branch -M main
git remote add origin git@github.com:YOUR_ORG/legolens.git
git push -u origin main

git tag -a v1.0.0 -m "LegoLens Core v1.0"
git push origin v1.0.0
```

### Optie B: bestaande repository bijwerken

```bash
git clone git@github.com:YOUR_ORG/legolens.git
cd legolens
rsync -av --delete /path/to/legolens_core_v1_0/ ./
git status
git add .
git commit -m "Upgrade to LegoLens Core v1.0"
git push
```

### Optie C: GitHub CLI release maken

```bash
gh repo create YOUR_ORG/legolens --private --source=. --remote=origin --push
gh release create v1.0.0 ../legolens_core_v1_0_bundle.zip ../legolens_core_v1_0_bundle.sha256.txt   --title "LegoLens Core v1.0"   --notes-file RELEASE_REPORT_v1_0.md
```

## Deel 2 — ChatGPT koppelen aan de GitHub-repository

Gebruik de GitHub connector in ChatGPT wanneer beschikbaar voor je plan/omgeving. Ga in ChatGPT naar **Settings → Apps**, kies **GitHub**, autoriseer de gewenste repositories en vraag daarna in ChatGPT om de repository te analyseren, documentatie te verbeteren of issues voor te bereiden.

Let op: beschikbaarheid kan verschillen per ChatGPT-plan en ervaring.

## Deel 3 — Custom GPT met Actions

Een Custom GPT kan via Actions externe REST API's aanroepen. Daarvoor heb je nodig:

- een publiek bereikbare backend URL, bijvoorbeeld `https://legolens.example.org`;
- een OpenAPI-schema;
- authenticatie: geen, API key of OAuth;
- een privacy policy URL wanneer de GPT publiek gedeeld wordt.

Gebruik het voorbeeldschema in `docs/chatgpt/legolens_action_openapi.yaml`.

Belangrijk: een lokale `localhost` backend is niet direct bereikbaar voor ChatGPT Actions. Host de backend eerst veilig, bijvoorbeeld achter HTTPS en API-key-authenticatie.

## Deel 4 — OpenAI API integratie in de backend

Gebruik de backend voor server-side OpenAI API-calls. Zet de key niet in de frontend.

```bash
export OPENAI_API_KEY="your_api_key_here"
node backend/server.mjs
```

De backend gebruikt AI alleen candidate-only. AI-output mag suggesties doen, maar niet automatisch publiceren.

## Deel 5 — Automatisch koppelen met ChatGPT

Volledig automatisch pushen vanuit ChatGPT kan alleen als je een gecontroleerde integratie bouwt die GitHub-acties mag uitvoeren, bijvoorbeeld via:

- GitHub connector voor lezen/analyseren;
- een Custom GPT Action richting een eigen backend;
- een backend die GitHub API-calls uitvoert met een server-side token;
- expliciete menselijke goedkeuring voor writes, releases of destructive actions.

Aanbevolen veilige flow:

```text
ChatGPT analyseert repo → stelt patch voor → developer reviewt → CI draait → maintainer merged → release wordt getagd
```

Vermijd dat een AI-agent zonder review rechtstreeks naar `main` pusht.
