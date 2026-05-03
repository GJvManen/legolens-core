# LegoLens Core v1.2.1 — Repository publication update

## Status

The repository has been updated toward LegoLens Core v1.2.1 publication-clean positioning.

## Published changes

- README updated to v1.2.1 neutral framework positioning.
- package metadata updated to `1.2.1`.
- `data/version.json` updated to `v1.2.1`.
- `data/update_manifest.json` updated to `v1.2.1`.
- Multilingual publication explanation added.
- Publication audit documentation added.
- Intelligence quality documentation added.
- Case pack content enrichment documentation added.
- Case Pack Library index added.
- New case pack metadata and starter content added for:
  - Sudan
  - Gaza Regional Spillover
  - Ukraine Donbas
  - Red Sea Yemen
  - Sahel
- Iran case pack metadata updated to v1.2.1 positioning.
- New validation tests added for publication audit, multilingual docs, intelligence quality and case pack content.

## Publication policy

The repository is positioned as a media-light core repository. Heavy media, generated social graphics, release ZIPs, databases and binary document artifacts should not be committed to `main`.

Legacy runtime media may still exist in historical repository content. A full repository-history cleanup should be performed locally with `git-filter-repo` if permanent removal from Git history is required.

## Review-first rule

Case-pack starter content is not automatically verified. It is intended for triage, workflow testing, graph modeling and analyst review. External publication requires human review and corroboration.

## Recommended local validation

```bash
npm test
npm run validate
```

## Recommended tag

```bash
git tag v1.2.1
git push origin v1.2.1
```
