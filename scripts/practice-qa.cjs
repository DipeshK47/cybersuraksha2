// Complete all current practice flows as teacher previews, without creating student records.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
let playwright;
try { playwright=require('playwright'); }
catch { playwright=require('/Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'); }
const {chromium}=playwright;
const solvers=Object.assign({},...['thinking','security','ai','fraud'].map(x=>require(`./practice-solvers-${x}.cjs`)));
const lower=['pattern-detective','step-by-step-morning','nanis-secret-code','surprise-pop-up','password-vault-builder','sharing-backpack','robot-or-not','teach-pet-machine'];
const middle=['flowchart-architect','loop-inspector','otp-guardian','qr-code-caution','password-vault','permission-control-panel','training-day','garbage-in-garbage-out'];
const out=process.env.PRACTICE_QA_OUTPUT||path.resolve('.practice-qa');fs.mkdirSync(out,{recursive:true});
const targets=process.argv.slice(2).length?process.argv.slice(2):Object.keys(solvers);
const capture=process.env.PRACTICE_QA_CAPTURE!=='0';
// These exercises must show their own setting, including each permission task.
const reviewedArt={
 'complex-algorithmic-logic':'report-card-workshop.webp',
 'algorithm-optimization':'sports-day-sort.webp',
 'surprise-pop-up':'castle-game.webp',
 'otp-guardian':'nani-phone-call.webp',
 'digital-arrest-simulation':'pretend-caller.webp',
 'email-header-inspector':'scholarship-inbox.webp',
 'recommendation-rabbit-hole':'recommendation-feed.webp',
 'permission-control-panel':['torch-permissions.webp','city-map-permission.webp','class-video-permission.webp'],
};
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});const errors=[],results=[];
try{for(const slug of targets)for(const width of [1280,390]){const ctx=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});const page=await ctx.newPage();page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(30000);page.on('pageerror',e=>errors.push(`${slug}: ${e.message}`));page.on('response',r=>{if(r.status()>=400)errors.push(`${slug}: ${r.status()} ${r.url()}`)});
try{const grade=lower.includes(slug)?3:middle.includes(slug)?5:6;await page.goto(`http://localhost:3200/module/cyber/${slug}?grade=${grade}`);await page.getByRole('button',{name:'Skip to practice',exact:true}).waitFor({timeout:60000});await page.waitForLoadState('networkidle');await page.getByRole('button',{name:'Skip to practice',exact:true}).click();const shell=page.locator(`[data-new-mission="${slug}"]`);await shell.waitFor();
assert.equal(await page.getByRole('link',{name:'Skip to lesson',exact:true}).evaluate(el=>getComputedStyle(el).clipPath),'inset(50%)','unfocused skip link must stay hidden');
for(let stage=0;stage<3;stage++){assert.equal(await shell.getAttribute('data-stage'),String(stage));assert.match(await shell.innerText(),new RegExp(`Class ${grade}`));assert.equal(await shell.getAttribute('data-ready'),'false');assert.equal(await page.getByRole('button',{name:'Next challenge',exact:true}).count(),0);if(capture)await shell.screenshot({path:path.join(out,`${slug}-${width}-challenge${stage+1}.png`)});
const art=Array.isArray(reviewedArt[slug])?reviewedArt[slug][stage]:reviewedArt[slug];
if(art){assert.ok((await shell.locator(':scope > [data-art]').evaluate(el=>getComputedStyle(el).backgroundImage)).includes(art),`wrong chapter header art: ${slug}, stage ${stage}`);}
if(slug==='permission-control-panel')assert.ok((await shell.locator('[data-app]').evaluate(el=>getComputedStyle(el).backgroundImage)).includes(art),'permission preview must match the app');
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,'document horizontal overflow');const overflow=await shell.locator('fieldset').evaluate(el=>el.scrollWidth>el.clientWidth+2);assert.equal(overflow,false,'activity horizontal overflow');
const images=await shell.locator('img').evaluateAll(imgs=>imgs.filter(x=>!x.complete||x.naturalWidth===0).map(x=>x.src));assert.deepEqual(images,[],'broken practice image');
if(stage===0){await solvers[slug].wrongStage(page,stage);await shell.locator('p[role="status"][data-result="retry"]').waitFor();assert.equal(await shell.getAttribute('data-ready'),'false');if(capture)await shell.screenshot({path:path.join(out,`${slug}-${width}-retry.png`)});}
if((slug==='password-vault-builder'||slug==='password-vault')&&stage===0){const text=await shell.locator('p[role="status"]').innerText();assert.match(text,/name|pattern|predictable/i);}
if(slug==='password-vault'&&stage===1){await page.getByRole('button',{name:'Reuse game password',exact:true}).click();await page.getByRole('button',{name:'Test account',exact:true}).click();await shell.locator('p[role="status"][data-result="retry"]').waitFor();assert.match(await shell.locator('p[role="status"]').innerText(),/same full password/);assert.equal(await shell.getAttribute('data-ready'),'false');}
if(slug==='password-vault-builder'&&stage===2)assert.equal(await shell.getByText('Rocket482?Mango!', {exact:true}).count(),1,'school challenge shows the game password the student actually built');
if(slug==='password-vault'&&stage===2){await page.getByRole('button',{name:'Reuse game password',exact:true}).click();await page.getByRole('button',{name:'Run leak',exact:true}).click();await shell.locator('p[role="status"][data-result="retry"]').waitFor();assert.equal(await shell.locator('[data-fallen="true"]').count(),2);assert.equal(await shell.getAttribute('data-ready'),'false');}
if(slug==='password-vault'&&stage===2){await page.getByRole('button',{name:'Reuse school password',exact:true}).click();await page.getByRole('button',{name:'Run leak',exact:true}).click();await shell.locator('p[role="status"][data-result="retry"]').waitFor();assert.match(await shell.locator('p[role="status"]').innerText(),/same password as school/);assert.equal(await shell.getAttribute('data-ready'),'false');}
await solvers[slug].solveStage(page,stage);await shell.locator('p[role="status"][data-result="correct"]').waitFor();if(slug==='password-vault-builder'||slug==='password-vault'){const value=await shell.locator('p[class*="passwordReadout"] code').innerText();assert.equal(value.length,16);assert.doesNotMatch(value,/\s|-/);}assert.equal(await shell.getAttribute('data-ready'),'true');assert.notEqual(await shell.locator('fieldset').getAttribute('disabled'),null);if(capture)await shell.screenshot({path:path.join(out,`${slug}-${width}-solved${stage+1}.png`)});await page.getByRole('button',{name:stage===2?'Review mission':'Next challenge',exact:true}).click();}
await page.locator(`[data-mission-ready="${slug}"]`).waitFor();await page.getByRole('button',{name:'Finish chapter',exact:true}).click();await page.locator(`[data-mission-complete="${slug}"]`).waitFor();await page.getByRole('button',{name:'Practise again',exact:true}).click();await page.getByRole('button',{name:'Skip to practice',exact:true}).waitFor();results.push({slug,width,grade,stages:3});console.log(`PASS ${slug} ${width}px: 3 challenges, retry, images, layout, completion, reset`);
}catch(e){errors.push(`${slug} ${width}px: ${e.message}`);console.error(`FAIL ${slug} ${width}px: ${e.message}`);await page.screenshot({path:path.join(out,`${slug}-${width}-failure.png`),fullPage:true}).catch(()=>{});}finally{await ctx.close();}}
}finally{await browser.close();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({results,errors},null,2))}assert.deepEqual(errors,[]);console.log(`ALL PASSED: ${results.length} flows, ${results.length*3} stage runs`)
})().catch(e=>{console.error(e);process.exitCode=1});
