import assert from 'node:assert/strict';
import test from 'node:test';
import { loadSource } from './class-10-helpers.mjs';
const { chapters, manualFrame } = await loadSource(`
 export { class10FraudChapters as chapters } from './app/data/class10/fraud';
 export { manualFrame } from './app/module/cyber/lessons/class10/motion-state';
`);
const get = (suffix, id) => { const v=chapters.find(c=>c.slug===`class10-fraud-${suffix}`).visual; const target=v.exploration.variants.find(x=>x.id===id); return manualFrame(v,target.scene,target.step); };
const need=(frame,id,language,...patterns)=>{const n=frame.nodes.find(n=>n.id===id&&!n.hidden); assert.ok(n, id); const s=`${n.label[language]} ${n.value?.[language]??''}`; for(const p of patterns) assert.match(s,p,`${id}/${language}`); return n;};
test('independent comparison endpoints retain visible case facts in both languages',()=>{
 for(const lang of ['en','hi']) {
  const en=lang==='en'; let f=get('exam-update','versions');
  need(f,'source',lang,en?/Cedar/:/सीडर/,en?/no link/:/लिंक नहीं/); need(f,'copy',lang,en?/Maple/:/मेपल/,en?/link/i:/लिंक/);
  f=get('exam-update','reply'); const venue=need(f,'venue',lang,en?/confirmed/:/पुष्ट/,en?/contradicted/:/खंडित/); assert.equal(venue.status,'complete'); need(f,'office',lang,en?/unchanged/:/अपरिवर्तित/); need(f,'link',lang,en?/author/:/रचयिता/);
  f=get('familiar-voice','answer'); const known=need(f,'known',lang,en?/denies/:/मना/); assert.equal(known.status,'complete'); need(f,'voice',lang,en?/unknown/:/अज्ञात/);
  f=get('changing-basket','without'); const pouch=need(f,'pouch',lang,en?/removed/:/हटी/,/₹90/); assert.equal(pouch.status,'complete'); assert.equal(pouch.x,18); need(f,'total',lang,/₹780/);
  f=get('cashout-wall','gap'); need(f,'screen',lang,/₹12500/); need(f,'provider',lang,/₹0/,en?/confirmed/i:/पुष्ट/);
  f=get('help-without-fees','privacy'); need(f,'private',lang,/F46/,/₹1200/,/09:20/,en?/access/i:/पहुँच/); need(f,'seller',lang,en?/excluded|no secrets/i:/बाहर|रहस्य नहीं/);
 }
});
test('help routes connect adult support to provider and official, never seller',()=>{
 const f=get('help-without-fees','routes'); const active=f.edges.filter(e=>e.active); assert.ok(f.nodes.some(n=>n.id==='adult'&&!n.hidden));
 for(const to of ['provider','official']) assert.ok(active.some(e=>e.from==='adult'&&e.to===to),to);
 assert.ok(active.every(e=>e.from!=='seller'&&e.to!=='seller'));
});
test('all exploration targets and final scene frames resolve visible bilingual state and valid active edges',()=>{
 let count=0; for(const c of chapters) {const v=c.visual; const targets=[...v.exploration.variants,...v.scenes.map((s,scene)=>({scene,step:s.steps.length-1}))];
  for(const t of targets){const f=manualFrame(v,t.scene,t.step); count++; for(const n of f.nodes.filter(n=>!n.hidden)){assert.ok(n.label.en&&n.label.hi); assert.ok(n.value?.en&&n.value?.hi); assert.ok(n.x>=12&&n.x<=88&&n.y>=15&&n.y<=85);} for(const e of f.edges.filter(e=>e.active)) assert.ok(f.nodes.some(n=>n.id===e.from&&!n.hidden)&&f.nodes.some(n=>n.id===e.to&&!n.hidden));}
 } assert.equal(count,71);
});
test('other explored case records retain their numeric and independent-source limits',()=>{
 for(const lang of ['en','hi']) { const en=lang==='en';
  let f=get('payment-record','image'); need(f,'image',lang,/B22/,/₹750/); need(f,'pending',lang,en?/pending/:/लंबित/);
  f=get('payment-record','reversal'); need(f,'reversed',lang,/₹320/,/₹0/);
  f=get('payment-record','total'); need(f,'total',lang,/₹700/,/B22/); need(f,'pending',lang,/₹750/);
  f=get('changing-basket','with'); need(f,'pouch',lang,/₹90/,en?/selected/:/चुनी/); need(f,'total',lang,/₹870/);
  f=get('cashout-wall','display'); need(f,'screen',lang,/₹8000/,/₹12500/,/₹4500/);
  f=get('cashout-wall','fee'); need(f,'fee',lang,/₹600/);
  f=get('official-looking-call','support'); need(f,'official',lang,en?/verified/:/पुष्ट/);
  f=get('help-without-fees','ack'); need(f,'ack',lang,en?/not guaranteed/:/गारंटी नहीं/);
 }
});
