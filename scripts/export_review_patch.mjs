#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] || path.resolve(process.cwd(), "data");
const candidates = JSON.parse(fs.readFileSync(path.join(root, "candidate_queue.json"), "utf8"));
const approved = candidates.filter(candidate => ["approved", "merged"].includes(candidate.review_status));

const patch = {
  generated_at: new Date().toISOString(),
  source: "candidate_queue.json",
  approved_candidates: approved.length,
  operations: approved.map(candidate => ({
    candidate_id: candidate.candidate_id,
    operation: candidate.review_status === "merged" ? "merge_or_mark_mirror" : "add_or_update",
    proposed_action: candidate.proposed_action,
    evidence: candidate.evidence
  }))
};

fs.writeFileSync(path.join(root, "review_patch.json"), JSON.stringify(patch, null, 2) + "\n");
console.log(`Exported ${patch.operations.length} reviewed operations to review_patch.json`);
