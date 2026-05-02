#!/usr/bin/env node
import fs from 'fs';
const schedule = JSON.parse(fs.readFileSync(new URL('../data/discovery_schedule.json', import.meta.url),'utf8'));
console.log(JSON.stringify({mode:'stub', auto_publication:false, jobs:schedule.jobs.map(j=>({job_id:j.job_id, output:j.output, requires_review:j.requires_review}))}, null, 2));
