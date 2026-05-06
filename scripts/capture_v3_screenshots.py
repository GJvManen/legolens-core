#!/usr/bin/env python3
"""Capture real LegoLens Core v3.0.0 interface screenshots.

This script renders the application in Chromium with the same local data files used
by the v3 runtime and writes one PNG per route to docs/screenshots/v3_0/.

Requirements:
  python3 -m pip install playwright
  python3 -m playwright install chromium

Run from repository root:
  python3 scripts/capture_v3_screenshots.py
"""

import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path.cwd()
OUT = ROOT / "docs" / "screenshots" / "v3_0"
OUT.mkdir(parents=True, exist_ok=True)

APP = json.loads((ROOT / "data" / "app_data.json").read_text(encoding="utf-8"))
SRC = json.loads((ROOT / "data" / "source_set.json").read_text(encoding="utf-8"))
CSS = (ROOT / "app.css").read_text(encoding="utf-8")
COMPAT = (ROOT / "compat.js").read_text(encoding="utf-8")
APPJS = (ROOT / "app.js").read_text(encoding="utf-8") if (ROOT / "app.js").exists() else (ROOT / "app_v3.js").read_text(encoding="utf-8")

ROUTES = APP.get("routes") or [
    "dashboard", "today", "datasets", "case-dashboard", "map", "timeline",
    "monitor", "investigate", "graph-stats", "frameworks", "content-updates",
    "content", "legacy-import", "media-library", "ingestion", "review-queue",
    "reports", "exchange", "settings"
]

LABELS = {
    "dashboard": "Dashboard",
    "today": "Today",
    "datasets": "Datasets",
    "case-dashboard": "Case dashboards",
    "map": "Geo maps",
    "timeline": "Timeline",
    "monitor": "Monitor",
    "investigate": "Investigate",
    "graph-stats": "Graph Stats",
    "frameworks": "Frameworks",
    "content-updates": "Content updates",
    "content": "Content",
    "legacy-import": "Legacy import",
    "media-library": "Media library",
    "ingestion": "Ingestion",
    "review-queue": "Review Queue",
    "reports": "Reports",
    "exchange": "Exchange",
    "settings": "Settings",
}


def page_html(route: str) -> str:
    storage = {
        "route": route,
        "caseId": "iran",
        "theme": "light",
        "language": "nl",
        "mapMode": "online",
        "graphNode": "case_iran",
        "framework": "source_reliability_af",
        "leaderIndex": {},
    }
    return f"""<!doctype html>
<html><head><base href='{ROOT.as_uri()}/'><meta charset='utf-8'>
<meta name='viewport' content='width=device-width,initial-scale=1'>
<style>{CSS}</style></head><body><div id='app'></div><div id='toast' class='toast'></div>
<script>
Object.defineProperty(window,'localStorage',{{configurable:true,value:{{_s:{{'ll3v30': JSON.stringify({json.dumps(storage)})}},getItem(k){{return this._s[k]||null}},setItem(k,v){{this._s[k]=String(v)}},removeItem(k){{delete this._s[k]}}}}}});
const __APP_DATA__={json.dumps(APP)};
const __SOURCE_SET__={json.dumps(SRC)};
window.fetch=(u)=>{{u=String(u); if(u.includes('app_data')) return Promise.resolve(new Response(JSON.stringify(__APP_DATA__),{{status:200}})); if(u.includes('source_set')) return Promise.resolve(new Response(JSON.stringify(__SOURCE_SET__),{{status:200}})); return Promise.resolve(new Response('{{}}',{{status:404}}));}};
</script><script>{COMPAT}</script><script>{APPJS}</script></body></html>"""


def main() -> None:
    manifest = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
        for index, route in enumerate(ROUTES, 1):
            page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
            page.set_content(page_html(route), wait_until="domcontentloaded", timeout=20000)
            page.wait_for_timeout(250)
            title = page.locator("h2").first.inner_text(timeout=5000) if page.locator("h2").count() else LABELS.get(route, route)
            filename = f"{index:02d}-{route}.png"
            page.screenshot(path=str(OUT / filename), full_page=True)
            manifest.append({"file": filename, "route": route, "title": title})
            page.close()
        browser.close()
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"screenshots": len(manifest), "output": str(OUT)}, indent=2))


if __name__ == "__main__":
    main()
