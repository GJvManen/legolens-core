#!/usr/bin/env node
import fs from 'fs';
const template = JSON.parse(fs.readFileSync(new URL('../data/export_patch_template.json', import.meta.url),'utf8'));
const patch = {...template, patch_id:'patch_'+new Date().toISOString().replace(/[^0-9]/g,'').slice(0,14), status:'draft'};
fs.writeFileSync(new URL('../data/admin_patch_draft.json', import.meta.url), JSON.stringify(patch,null,2)+'\n');
console.log('Wrote data/admin_patch_draft.json');
