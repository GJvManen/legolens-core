# LegoLens Iran v120.1 Hotfix

Generated: 2026-05-02T16:05:00Z

## Fixed

- Candidate approval now actually promotes new item candidates into the local Content collection.
- Approval creates an evidence record, updates the local search index, and stores `promoted_item_id` on the candidate.
- Approved local items are persisted in browser localStorage as a v120.1 local session overlay, so they survive a page reload.
- Existing content preview loading has been hardened. All 476 existing bundled items have matching `assets/previews/<item_id>.jpg` files.
- Newly approved local items receive a generated local SVG preview so they are visible even without downloaded thumbnails.

## Added validation

- Candidate approval runtime test.
- Preview asset coverage test.
- Existing v120 validation and data integrity tests still pass.

## Operational note

Approved items are stored locally in the browser session overlay. Use **Export session** to preserve the full content state or **Export review patch** to pass the approval decisions to a backend/maintainer. Use **Reset lokale sessie** in Admin to clear local approvals and return to bundled baseline data.
