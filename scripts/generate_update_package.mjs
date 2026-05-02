import { readFile, writeFile } from 'node:fs/promises';
const files = {
  items:'items.json', sources:'sources.json', source_families:'source_families.json', candidate_queue:'candidate_queue.json', incidents:'incidents.json', evidence:'evidence.json', similarity_candidates:'similarity_candidates.json', qa_report:'qa_report.json', release_manifest:'release_manifest.json', narratives:'narratives.json', ttp_taxonomy:'ttp_taxonomy.json', review_log:'review_log.json', discovery_schedule:'discovery_schedule.json', reports_index:'reports_index.json', search_index:'search_index.json', evidence_pipeline:'evidence_pipeline.json', fimi_disarm_mapping:'fimi_disarm_mapping.json', network_graph:'network_graph.json', monitoring_runbook:'monitoring_runbook.json', report_pack_v85:'report_pack_v85.json'
};
const data = {};
for (const [key,file] of Object.entries(files)) data[key] = JSON.parse(await readFile(`data/${file}`, 'utf8'));
const pkg = { package_type:'legolens_update_package', schema_version:'v85.0', generated_at:new Date().toISOString(), target:'v85.0', content_policy:{direct_publication:false, lossless_required:true}, data };
await writeFile('data/update_package_v85.json', JSON.stringify(pkg, null, 2) + '\n');
console.log('Wrote data/update_package_v85.json');
