#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || path.resolve(process.cwd(), "data");
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const items = read("items.json");
const sources = read("sources.json");
const families = read("source_families.json");
let duplicateCandidates = [];
try { duplicateCandidates = read("duplicate_candidates.json"); } catch {}

const countBy = (arr, fn) => arr.reduce((acc, item) => {
  const key = fn(item) ?? "unknown";
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});

const dateQuality = countBy(items, item => item.date_quality);
const thumbs = countBy(items, item => item.thumbnail_mode);
const roles = countBy(items, item => item.provenance?.role || "missing");
const canonicalGroups = countBy(items.filter(item => item.canonical_id), item => item.canonical_id);
const duplicateGroups = Object.entries(canonicalGroups).filter(([, count]) => count > 1);

const sourceIds = new Set(sources.map(source => source.id));
const familyIds = new Set(families.map(family => family.id));
const orphanSourceRefs = items.filter(item => !sourceIds.has(item.source_id)).map(item => item.id);
const orphanFamilyRefs = items.filter(item => !familyIds.has(item.source_family_id)).map(item => item.id);
const sourceOrphanFamilyRefs = sources.filter(source => !familyIds.has(source.family_id)).map(source => source.id);
const pendingDuplicateClusters = duplicateCandidates.filter(candidate => !["resolved_lossless", "merged", "rejected"].includes(candidate.review_status)).length;
const resolvedDuplicateClusters = duplicateCandidates.filter(candidate => candidate.review_status === "resolved_lossless").length;

const now = new Date().toISOString();
const report = {
  run_date: now.slice(0, 10),
  generated_at: now,
  schema_version: "v74.1",
  metrics: {
    items: items.length,
    sources: sources.length,
    families: families.length,
    unique_canonical_ids: Object.keys(canonicalGroups).length,
    remaining_canonical_duplicate_groups: duplicateGroups.length,
    duplicate_extra_cards: duplicateGroups.reduce((sum, [, count]) => sum + count - 1, 0),
    exact_or_exact_date_items: (dateQuality["exact"] || 0) + (dateQuality["exact-id"] || 0) + (dateQuality["exact-date"] || 0),
    approx_or_relative_items: (dateQuality["approx"] || 0) + (dateQuality["web-search-relative"] || 0),
    date_quality_unknown: dateQuality["unknown"] || 0,
    published_date_unavailable_but_archived: dateQuality["archive-first-seen"] || 0,
    fallback_previews: thumbs["fallback"] || 0,
    native_or_existing_previews: (thumbs["native"] || 0) + (thumbs["local_asset"] || 0),
    local_generated_previews: thumbs["local_generated_preview"] || 0,
    items_with_discovery_metadata: items.filter(item => item.discovery?.first_seen_at && item.discovery?.last_verified_at && item.discovery?.added_at).length,
    items_with_provenance: items.filter(item => item.provenance).length,
    pending_duplicate_clusters: pendingDuplicateClusters,
    resolved_duplicate_clusters: resolvedDuplicateClusters,
    families_needing_review: families.filter(family => family.status === "needs_review").length,
    orphan_source_refs: orphanSourceRefs.length,
    orphan_family_refs: orphanFamilyRefs.length,
    source_orphan_family_refs: sourceOrphanFamilyRefs.length
  },
  role_counts: roles,
  families_needing_review: families.filter(family => family.status === "needs_review").map(family => family.name),
  checks: {
    no_unknown_date_quality: items.every(item => item.date_quality !== "unknown"),
    no_fallback_previews: items.every(item => item.thumbnail_mode !== "fallback"),
    discovery_metadata_present: items.every(item => item.discovery?.first_seen_at && item.discovery?.last_verified_at && item.discovery?.added_at),
    provenance_present: items.every(item => Boolean(item.provenance)),
    no_pending_duplicate_clusters: pendingDuplicateClusters === 0,
    orphan_items: [...orphanSourceRefs, ...orphanFamilyRefs],
    orphan_sources: sourceOrphanFamilyRefs
  },
  warnings: [
    "archive-first-seen is a monitoring timeline date, not a claimed publication date.",
    "local_generated_preview images are metadata previews, not scraped platform screenshots."
  ]
};

fs.writeFileSync(path.join(root, "qa_report.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report.metrics, null, 2));
