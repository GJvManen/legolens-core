# LegoLens Core

`main` is de schone documentatiebranch van LegoLens Core.

Deze branch is bedoeld voor uitgebreide system documentatie, system workflows, projectuitleg, verantwoord gebruik en verwijzingen naar runtimebranches.

## Branches

- `main` — documentatie en uitleg.
- `3.0.1` — lichte runtimeversie van LegoLens v3.0.1.
- `archive/main-before-docs-only-2026-05-07` — backup van de eerdere main-branch.

Runtimebranch:

https://github.com/GJvManen/legolens-core/tree/3.0.1

## Runtime 3.0.1 starten

```bash
git checkout 3.0.1
npm install
npm start
```

Open daarna:

```text
http://localhost:8787
```

Validatie:

```bash
npm test
```

## Branchmodel

```text
main
- README met projectuitleg
- verwijzing naar runtimebranches
- geen runtimebestanden
- geen oude builds
- geen screenshots/testlogs

3.0.1
- index.html
- app.js
- app.css
- server.mjs
- package.json
- assets/brand/
```

## Kernprincipe

Alles komt eerst binnen als candidate. Review en delen zijn aparte stappen.

```text
reviewed != share_approved
```
