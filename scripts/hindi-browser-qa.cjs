const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const base = process.env.BASE_URL || 'http://localhost:3000';
const out = path.resolve('.story-qa/hindi'); fs.mkdirSync(out,{recursive:true});
const capture = process.env.HINDI_QA_CAPTURE !== '0';
const catalogue = JSON.parse(fs.readFileSync('public/locales/hi.json','utf8'));
const overrides = JSON.parse(fs.readFileSync('app/lib/i18n/hi-overrides.json','utf8'));
const errors=[];
const sourceFiles=['app/lib/i18n/translate.ts','app/lib/i18n/localize-dom.ts'];
const sources=sourceFiles.map(file=>ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText);
const translationModule={};new Function('exports',sources[0])(translationModule);
const t=translationModule.createHindiTranslator(catalogue,overrides);
async function hindi(page) {
 await page.getByRole('button',{name:'हिन्दी',exact:true}).click();
 await page.waitForFunction(()=>document.documentElement.lang==='hi');
}
async function noOverflow(page) {
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'no page-wide horizontal overflow');
}
async function captureEnglish(page,name) {
 const fragments=await page.evaluate(()=>{
  const result=[];const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
  while((node=walker.nextNode())){
   const p=node.parentElement;if(!p||p.closest('script,style,code,pre,svg,[translate="no"],[data-no-translate]')||!p.getClientRects().length)continue;
   if(/[a-zA-Z]{3}/.test(node.data))result.push(node.data.trim());
  }return result;
 });
 fs.writeFileSync(path.join(out,`${name}-remaining-english.json`),JSON.stringify(fragments,null,2));
}
async function domChecks(browser) {
 const page=await browser.newPage();
 await page.setContent('<form><label>Kind<select id="answer"><option>Asset</option><option>Control</option><option>  View\n Only  </option></select></label><button type="button">Check my map</button><p id="result">Ready</p><input value="Student text" placeholder="Choose…" aria-label="Your answer"><pre>const control = true;</pre><p translate="no">Student text</p></form>');
 const originalValue=await page.locator('#answer option').nth(2).evaluate(option=>option.value);
 await page.evaluate(({sources,catalogue,overrides})=>{
  const modules=sources.map(source=>{const exports={};new Function('exports',source)(exports);return exports;});
  window.__localizer=modules[1].createPageLocalizer(modules[0].createHindiTranslator(catalogue,overrides));
  window.__original=modules[1].originalText;
  window.__localizer.setLanguage('hi');
 },{sources,catalogue,overrides});
 assert.equal(await page.locator('#answer option').first().getAttribute('value'),'Asset');
 assert.equal(await page.locator('#answer option').nth(2).getAttribute('value'),originalValue);
 assert.match(await page.locator('#answer option').first().innerText(),/[\u0900-\u097f]/);
 await page.locator('#answer').selectOption('Control');
 assert.equal(await page.locator('#answer').inputValue(),'Control');
 assert.equal(await page.locator('input').inputValue(),'Student text');
 assert.equal(await page.locator('pre').innerText(),'const control = true;');
 assert.equal(await page.locator('[translate=no]').innerText(),'Student text');
 await page.evaluate(()=>document.querySelector('#result').firstChild.data='Mission complete');
 await page.getByText('मिशन पूरा हुआ',{exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>window.__original(document.querySelector('#result'))),'Mission complete');
 await page.evaluate(()=>{
  const p=document.createElement('p');p.id='fragments';
  for(const text of ['Scene ','3',' of ','6'])p.append(document.createTextNode(text));
  document.body.append(p);
 });
 await page.waitForFunction(()=>document.querySelector('#fragments').textContent==='6 में से सीन 3');
 await page.evaluate(()=>{
  const p=document.createElement('p');p.id='added';p.textContent='Next challenge';document.body.append(p);
  document.querySelector('#answer option').textContent='View';
 });
 await page.getByText('अगला चैलेंज',{exact:true}).waitFor();
 await page.waitForFunction(()=>document.querySelector('#answer option').value==='View');
 await page.evaluate(()=>window.__localizer.setLanguage('en'));
 assert.equal(await page.locator('#added').innerText(),'Next challenge');
 assert.equal(await page.locator('#fragments').innerText(),'Scene 3 of 6');
 assert.equal(await page.locator('#answer option').first().getAttribute('value'),null);
 assert.equal(await page.locator('#answer option').first().innerText(),'View');
 await page.close(); console.log('PASS DOM: native option values, edited labels, dynamic feedback, restoration, user text and code');
}
async function lowerAndMiddle(browser) {
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await context.addInitScript(()=>localStorage.setItem('cybersuraksha-language','hi'));
 const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
 const cases=[
  {slug:'password-vault-builder',grade:6,solve:async root=>{
   await root.getByRole('button',{name:'Rocket482?',exact:true}).click();
   await root.getByRole('button',{name:'Mango!',exact:true}).click();
   await root.getByRole('button',{name:t('Test password'),exact:true}).click();
  }},
  {slug:'robot-or-not',grade:6,solve:async root=>{
   for(const [name,kind] of [['Puppy','Alive'],['Smart speaker','Machine'],['Dancing robot','Machine']]){
    await root.getByRole('button',{name:t(`Inspect ${name}`),exact:true}).click();
    await root.getByRole('button',{name:t(`Sort into ${kind} station`),exact:true}).click();
   }
   await root.getByRole('button',{name:t('Check sorting stations'),exact:true}).click();
  }},
  {slug:'training-day',grade:8,solve:async root=>{
   for(const [name,kind] of [['Golden retriever','Dog'],['Indie dog','Dog'],['Cat','Not dog']]) await root.getByRole('button',{name:t(`Label ${name} ${kind}`),exact:true}).click();
   await root.getByRole('button',{name:t('Run photo label check'),exact:true}).click();
  }},
 ];
 for(const item of cases){
  await page.goto(`${base}/module/cyber/${item.slug}?grade=${item.grade}`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.documentElement.lang==='hi');
  await page.getByRole('button',{name:'सीधे प्रैक्टिस पर जाएँ',exact:true}).click();
  const root=page.locator(`[data-new-mission="${item.slug}"]`);await item.solve(root);
  await root.getByRole('button',{name:'अगला चैलेंज',exact:true}).waitFor();await noOverflow(page);
  console.log(`PASS Hindi interactive stage: ${item.slug}`);
 }
 await context.close();
}
async function authenticated(browser){
 const c=await import(path.resolve('app/module/cyber/lessons/senior/security-content.ts'));
 const admin=await browser.newContext();
 assert.ok((await admin.request.post(`${base}/api/auth/teacher`,{data:{email:'teacher@dpsrkp.edu.in',password:'Teacher@123'}})).ok());
 const className=`11H${Date.now().toString().slice(-6)}`;
 const created=await admin.request.post(`${base}/api/students`,{data:{className,students:[{rollNo:'1',name:'Hindi QA Learner'}]}});
 assert.equal(created.status(),201);const learner=(await created.json()).students[0];
 const library=await(await admin.request.get(`${base}/api/lms/assignments`)).json();
 const classroom=library.classes.find(row=>row.name===className);
 const lesson=library.modules.find(row=>row.title==='Your digital risk map'&&row.grades.includes(11));
 const assigned=await admin.request.post(`${base}/api/lms/assignments`,{data:{title:'Hindi QA assignment',classId:classroom.id,moduleIds:[lesson.id],dueAt:Date.now()+86400000,totalMarks:100,publish:true}});
 assert.equal(assigned.status(),201);const assignment=(await assigned.json()).assignment;
 const student=await browser.newContext({viewport:{width:1280,height:1000},reducedMotion:'reduce'});
 await student.addInitScript(()=>localStorage.setItem('cybersuraksha-language','hi'));
 assert.ok((await student.request.post(`${base}/api/auth/student`,{data:{school:'dps-rkp',className,rollNo:'1',password:learner.accessCode}})).ok());
 const page=await student.newPage();page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`${base}/module/cyber/your-digital-risk-map?grade=11`,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>document.documentElement.lang==='hi');
 await page.getByRole('button',{name:'सीधे प्रैक्टिस पर जाएँ',exact:true}).click();
 const root=page.locator('[data-new-mission="your-digital-risk-map"]');
 for(let stage=0;stage<3;stage++){
  if(stage<2){
   const rows=stage===0?c.riskCards:c.impactCards;
   for(const [index,row]of rows.entries()) await root.getByRole('combobox').nth(index).selectOption(row.answer);
   await root.getByRole('button',{name:'मेरा मैप चेक करें',exact:true}).click();
  }else{
   await root.getByRole('button',{name:t('Move One editable poster copy down'),exact:true}).click();
   await root.getByRole('button',{name:t('Move One editable poster copy down'),exact:true}).click();
   for(const risk of c.priorities) await root.getByRole('listitem').filter({hasText:t(risk.label)}).getByRole('combobox').selectOption(risk.id);
   await root.getByRole('button',{name:t('Save risk register'),exact:true}).click();
  }
  await root.getByRole('button',{name:stage===2?'मिशन का रिव्यू करें':'अगला चैलेंज',exact:true}).click();
 }
 await page.getByRole('button',{name:'चैप्टर पूरा करें',exact:true}).click();
 await page.getByText(t('Lesson saved to student and teacher progress.'),{exact:true}).waitFor();
 const history=await(await admin.request.get(`${base}/api/lms/students/${learner.id}`)).json();
 const attempt=history.attempts.find(row=>row.moduleId===lesson.id&&row.completedAt);assert.equal(attempt.score,100);
 assert.equal(history.events.filter(row=>row.type==='question_answered'&&row.attemptId===attempt.id).length,3);
 const inbox=await(await student.request.get(`${base}/api/lms/inbox`)).json();
 assert.equal(inbox.assignments.find(row=>row.id===assignment.id).progress.marks,100);
 await page.goto(`${base}/dashboard`,{waitUntil:'networkidle'});await page.waitForFunction(()=>document.documentElement.lang==='hi');
 await page.getByRole('link',{name:t('Continue with Identity beyond a password'),exact:true}).waitFor();
 await captureEnglish(page,'signed-in-dashboard');await noOverflow(page);
 if(capture)await page.screenshot({path:path.join(out,'signed-in-dashboard.png'),fullPage:true});
 await student.close();await admin.close();console.log('PASS Hindi authenticated completion: canonical question text, server score 100, teacher history and assignment marks');
}
async function main(){
 const browser=await playwright.chromium.launch({channel:'chrome',headless:true});
 await domChecks(browser);
 for (const [name,viewport] of [['desktop',{width:1280,height:1000}],['phone',{width:390,height:844}]]) {
  const context=await browser.newContext({viewport,reducedMotion:'reduce'});
  const page=await context.newPage();page.on('pageerror',error=>errors.push(`${name}: ${error.message}`));
  await page.goto(base,{waitUntil:'networkidle'});
  await hindi(page);
  await page.getByRole('heading',{name:'आइडिया को आज़माकर देखें। जिज्ञासा को दें आगे बढ़ने की रफ़्तार।',exact:true}).waitFor();
  await page.getByRole('heading',{name:'स्कूल कैसे जुड़ सकता है',exact:true}).waitFor();
  await noOverflow(page);
  if(capture)await page.screenshot({path:path.join(out,`${name}-home.png`),fullPage:true});
  await page.goto(`${base}/grade/12/cyber-fraud?role=teacher`,{waitUntil:'networkidle'});
  await hindi(page);
  await page.getByRole('heading',{name:'साइबर फ्रॉड',exact:true}).waitFor();
  assert.equal(await page.evaluate(()=>localStorage.getItem('cybersuraksha-language')),'hi');
  await noOverflow(page);await captureEnglish(page,`${name}-library`);
  if(capture)await page.screenshot({path:path.join(out,`${name}-library.png`),fullPage:true});
  await page.reload({waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.documentElement.lang==='hi');
  await page.getByRole('heading',{name:'साइबर फ्रॉड',exact:true}).waitFor();
  for (const grade of [6,8,11]) {
   await page.goto(`${base}/grade/${grade}?role=teacher`,{waitUntil:'networkidle'});
   await page.waitForFunction(()=>document.documentElement.lang==='hi');await noOverflow(page);
   await captureEnglish(page,`${name}-class-${grade}`);
   assert.match(await page.locator('body').innerText(),/क्लास/);
  }
  await page.goto(`${base}/module/cyber/your-digital-risk-map?grade=11`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.documentElement.lang==='hi');
  await page.getByRole('button',{name:'सीधे प्रैक्टिस पर जाएँ',exact:true}).click();
  const root=page.locator('[data-new-mission="your-digital-risk-map"]');await root.waitFor();
  const selects=root.getByRole('combobox');assert.equal(await selects.count(),4);
  for(let index=0;index<4;index++)await selects.nth(index).selectOption('Asset');
  await root.getByRole('button',{name:'मेरा मैप चेक करें',exact:true}).click();
  assert.equal(await root.getAttribute('data-ready'),'false');
  for(const [index,value] of ['Asset','Threat','Vulnerability','Control'].entries()) await selects.nth(index).selectOption(value);
  await root.getByRole('button',{name:'मेरा मैप चेक करें',exact:true}).click();
  await root.getByRole('button',{name:'अगला चैलेंज',exact:true}).waitFor();
  await noOverflow(page);await captureEnglish(page,`${name}-lab`);
  if(capture)await page.screenshot({path:path.join(out,`${name}-lab.png`),fullPage:true});
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('cybersuraksha-cyber-your-digital-risk-map-v1-preview')));
  assert.equal(saved.answers['your-digital-risk-map-check-1'].correct,false);
  assert.equal(saved.answers['your-digital-risk-map-check-1'].question,"Build the festival team's first risk chain.");
  await root.getByRole('button',{name:'अगला चैलेंज',exact:true}).click();
  await page.getByRole('button',{name:'English',exact:true}).click();
  await page.waitForFunction(()=>document.documentElement.lang==='en');
  await root.getByRole('button',{name:'Check my map',exact:true}).waitFor();
  assert.equal(await root.getAttribute('data-stage'),'1');
  await hindi(page);
  assert.equal(await root.getAttribute('data-stage'),'1');
  await page.goto(`${base}/module/cyber/the-evidence-hearing?grade=12`,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.documentElement.lang==='hi');
  await page.getByRole('button',{name:'सीधे प्रैक्टिस पर जाएँ',exact:true}).waitFor();
  await noOverflow(page);await captureEnglish(page,`${name}-story`);
  if(capture)await page.screenshot({path:path.join(out,`${name}-story.png`),fullPage:true});
  assert.equal(await page.locator('audio').count()>0,true);
  await context.close(); console.log(`PASS ${name}: grades 6, 8, 11, 12; story, Hindi lab scoring, switch, reload and navigation`);
 }
 await lowerAndMiddle(browser);await authenticated(browser);
 const api=await browser.newContext();
 for(const message of ['मेरा नाम राहुल है','९८७६५४३२१०']){
  const response=await api.request.post(`${base}/api/chat`,{data:{message,grade:7,language:'hi'}});
  assert.equal(response.status(),200);assert.match((await response.json()).answer,/निजी जानकारी/);
 }
 await api.close();console.log('PASS Hindi privacy safeguards, including Devanagari phone digits');
 const context=await browser.newContext();
 const page=await context.newPage();await page.route('**/locales/hi.json',route=>route.abort());
 await page.goto(`${base}/student-login`,{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'हिन्दी',exact:true}).click();
 await page.getByText('हिन्दी लोड नहीं हुई। फिर से हिन्दी चुनें।',{exact:true}).waitFor();
 assert.equal(await page.locator('html').getAttribute('lang'),'en');
 await page.unroute('**/locales/hi.json');await hindi(page);
 await page.getByRole('heading',{name:'स्टूडेंट लॉगिन',exact:true}).waitFor();
 await context.close();
 assert.deepEqual(errors,[]);await browser.close();
 console.log('PASS load failure/retry and English fallback; no browser exceptions');
}
main().catch(error=>{console.error(error);process.exit(1)});
