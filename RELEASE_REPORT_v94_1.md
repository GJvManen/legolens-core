# LegoLens Iran v94.1 — update verification patch

Generated: 2026-05-02T09:35:43Z

## Doel
Deze patch controleert en verbetert het update-mechanisme van v94.0. De dataset is ongewijzigd en lossless behouden.

## Fixes
- `Check now` in `file://` modus opent nu direct de Import JSON picker en instrueert om `data/update_package_v94_1.json` te kiezen.
- `Check now` via HTTP/backend gebruikt nu het pakket uit `update_manifest.latest_package`.
- Backend `/api/update/package` serveert `update_package_v94_1.json`.
- Update manifest is genormaliseerd naar `v94.1`.
- Exportbestanden krijgen v94.1-namen.

## Beleid
- Geen automatische publicatie.
- Lossless gate blijft actief.
- Bestaande items, bronnen, families en `needs_review` families blijven behouden.
