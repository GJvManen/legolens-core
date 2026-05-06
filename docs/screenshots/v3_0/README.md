# LegoLens Core v3.0.0 Real Interface Screenshots

This folder is reserved for real browser screenshots captured from the running LegoLens Core v3.0.0 interface.

The previous documentation mockup SVG files have been removed from this folder. Do not add hand-drawn interface mockups here.

## Generate the screenshots

Run from the repository root:

```bash
python3 -m pip install playwright
python3 -m playwright install chromium
python3 scripts/capture_v3_screenshots.py
```

The script renders every v3 route with the correct v3 localStorage key (`ll3v30`) and writes one PNG per route to this directory.

## Expected output files

```text
01-dashboard.png
02-today.png
03-datasets.png
04-case-dashboard.png
05-map.png
06-timeline.png
07-monitor.png
08-investigate.png
09-graph-stats.png
10-frameworks.png
11-content-updates.png
12-content.png
13-legacy-import.png
14-media-library.png
15-ingestion.png
16-review-queue.png
17-reports.png
18-exchange.png
19-settings.png
manifest.json
```

## Capture rules

- Use real browser rendering, not design mockups.
- Use the v3.0.0 application state key: `ll3v30`.
- Use the repository data files:
  - `data/app_data.json`
  - `data/source_set.json`
- Capture every route defined in `data/app_data.json`.
- Verify the first `h2` on each capture matches the intended route.

## v3.0.0 interface principles

- All new material enters as a candidate.
- Review state and share approval are separate.
- Media/source records keep attribution chains visible.
- Exports are local previews unless explicitly approved for sharing.
- Connector secrets remain backend-only references.
