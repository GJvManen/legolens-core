# LegoLens Iran — Release Report v94.0

Generated: 2026-05-02T09:35:00Z

## Summary

This release upgrades the v85 project through v94 while preserving all canonical content.

| Check | Result |
|---|---:|
| Items | 476 |
| Sources | 382 |
| Families | 10 |
| Families `needs_review` | 5 |
| Incidents | 6 |
| Evidence records | 476 |
| Claims | 14 |
| Actors | 10 |
| Infrastructure nodes | 41 |
| Candidate queue | 38 |
| Auto-publication | OFF |

## Release path

- v86 — regression tests, release gate, test update package
- v87 — persistent SQLite review database scaffold
- v88 — evidence workbench
- v89 — analytical network metrics
- v90 — confidence-scored monitoring jobs/candidates
- v91 — professional report pack
- v92 — source reliability history
- v93 — claim tracking
- v94 — actor and infrastructure layer

## Update mechanism

The update mechanism is staged and lossless:

`Check now / Import JSON → staged diff → lossless gate → Apply staged update → export session/patch`

Offline `file://` cannot fetch update packages. Use **Import JSON** with `data/update_package_v94.json` or run the backend and open `http://localhost:8787`.

## Notes

Actor and claim labels are analytic groupings. They are not attribution proof and not fact-check conclusions. Human review remains required for publication or external reporting.
