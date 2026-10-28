import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {loadSource,root} from './class-10-helpers.mjs';

test('Class 10 extraction recognises bilingual authoring and excludes diagram metadata',async()=>{
  execFileSync(process.execPath,['scripts/extract-language-catalogue.cjs'],{cwd:root,stdio:'pipe'});
  const catalogue=JSON.parse(await readFile(new URL('../tmp/i18n/catalogue.json',import.meta.url),'utf8'));
  const {chapters}=await loadSource('export {class10Chapters as chapters} from "./app/data/class10";');
  const technical=new Set(['flow','records','trace','grid','compare','timeline','card','circle','box']);
  for(const word of technical)assert.ok(!catalogue.sources[word]?.replaceAll('\\','/').startsWith('app/data/class10/'),`Technical diagram metadata leaked: ${word}`);
  for(const c of chapters){
    for(const value of [c.summary,...c.visual.scenes.flatMap(s=>s.steps.flatMap(step=>[step.label,step.description]))])assert.ok(catalogue.messages.includes(value.en),value.en);
  }
  const translations=[];
  function visit(value){if(!value||typeof value!=='object')return;if(typeof value.en==='string'){if(value.hi!==value.en&&/[A-Za-z]{2}/.test(value.hi)&&value.hi.length>30)translations.push(value.hi);}else Object.values(value).forEach(visit);}
  chapters.forEach(visit);assert.ok(translations.length,'Fixture must include bilingual technical prose');
  for(const hindi of translations)assert.ok(!catalogue.messages.includes(hindi),`Hindi translation treated as English source: ${hindi}`);
});
