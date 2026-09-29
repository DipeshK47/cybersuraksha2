// Run against the disposable QA server, never a school's database.
// LMS_QA_BASE=http://127.0.0.1:3201 node scripts/lms-browser-qa.cjs
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('/Users/dipeshkumar/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.env.LMS_QA_BASE??'http://127.0.0.1:3201';
const out=process.env.LMS_QA_OUTPUT??'.lms-qa';
fs.mkdirSync(out,{recursive:true});
(async()=>{
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const teacher=await browser.newContext({viewport:{width:1440,height:1100}});
 const student=await browser.newContext({viewport:{width:390,height:844}});
 const errors=[];
 const observe=p=>p.on('pageerror',e=>errors.push(e.message));
 await teacher.request.post(base+'/api/auth/teacher',{data:{email:'teacher@dpsrkp.edu.in',password:'Teacher@123'}});
 await student.request.post(base+'/api/auth/student',{data:{school:'dps-rkp',className:'7A',rollNo:'21',password:'DPS21SAFE'}});
 const page=await teacher.newPage();observe(page);
 await page.goto(base+'/teach/lms/new');
 await page.getByRole('heading',{name:'Assignment details'}).waitFor();
 await page.getByLabel('Assignment title').fill('Think clearly. Sort smarter.');
 await page.getByLabel('Instructions').fill('Watch Kabir’s story, compare the two algorithms, and complete all three practice challenges.');
 const gradeSelect=page.getByRole('combobox',{name:'Class',exact:true});
 assert.deepEqual(await gradeSelect.locator('option').allTextContents(),[3,4,5,6,7].map(g=>`Class ${g}`));
 const libraryBefore=await (await teacher.request.get(base+'/api/lms/assignments')).json();
 assert.equal(libraryBefore.modules.length,24);
 for(const grade of [3,4,5,6,7]) {
  await gradeSelect.selectOption(String(grade));
  const expected=libraryBefore.modules.filter(m=>m.grades.includes(grade));
  assert.equal(expected.length,8);
  assert.equal(await page.getByRole('checkbox').count(),8);
  for(const m of expected) assert.equal(await page.getByRole('checkbox',{name:new RegExp('^'+m.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))}).count(),1);
  assert.equal(await page.getByRole('checkbox',{checked:true}).count(),0,'class changes clear selected chapters');
  await page.getByRole('checkbox').first().check();
 }
 await gradeSelect.selectOption('3');
 await page.getByRole('searchbox',{name:'Search chapters'}).fill('Password');
 assert.equal(await page.getByRole('checkbox').count(),1);
 await gradeSelect.selectOption('7');
 assert.equal(await page.getByRole('searchbox',{name:'Search chapters'}).inputValue(),'');
 await page.getByRole('combobox',{name:'Class section',exact:true}).selectOption({label:'7A'});
 const deadline=new Date(Date.now()+3*86400000);deadline.setMinutes(deadline.getMinutes()-deadline.getTimezoneOffset());
 await page.getByLabel(/^Deadline/).fill(deadline.toISOString().slice(0,16));
 await page.getByLabel(/^Total marks/).fill('40');
 await page.getByRole('checkbox',{name:/^Algorithm Optimization/}).check();
 await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
 await page.waitForTimeout(100);
 await page.screenshot({path:out+'/lms-assignment-composer.png',fullPage:true});
 await page.getByRole('button',{name:'Publish assignment',exact:true}).click();
 await page.waitForURL(/\/teach\/lms\/\d+/);
 await page.getByRole('heading',{name:'Student submissions'}).waitFor();
 const assignmentId=Number(page.url().split('/').at(-1));
 await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
 await page.waitForTimeout(100);
 await page.screenshot({path:out+'/lms-assignment-results.png',fullPage:true});
 const learner=await student.newPage();observe(learner);
 await learner.goto(base+'/dashboard');
 await learner.getByRole('heading',{name:'From your teacher',exact:true}).waitFor();
 assert.ok(await learner.getByRole('link',{name:'Think clearly. Sort smarter.',exact:true}).count()>0,'dashboard lists the teacher assignment');
 await learner.getByRole('link',{name:/View all assignments/}).click();
 await learner.getByRole('heading',{name:'Assignments',exact:true}).waitFor();
 const card=learner.locator(`[data-assignment-id="${assignmentId}"]`);
 await card.waitFor();assert.match(await card.innerText(),/NEW/);
 assert.match(await card.innerText(),/Due .*40 marks/s);
 assert.ok(await card.getByRole('link',{name:/Algorithm Optimization/}).isVisible(),'chapter links are visible without expanding a disclosure');
 assert.match(await card.getByRole('link',{name:/^(Start|Continue|Review) assignment$/}).getAttribute('href'),/module\/cyber\/algorithm-optimization\?.*grade=7/);
 await card.getByRole('link',{name:/^(Start|Continue|Review) assignment$/}).click();
 await learner.locator('[data-story-player="algorithm-optimization"]').waitFor();
 // Use the existing chapter QA solver; it manipulates the real learner controls.
 const qa=require('../app/module/cyber/lessons/new/story/chapters/algorithm-optimization.qa.cjs');
 await learner.getByRole('button',{name:/^Scene 4:/}).click();
 await qa.wrongAttempt(learner);
 await qa.solve(learner);
 await learner.getByRole('button',{name:'Skip to practice',exact:true}).click();
 await learner.locator('[data-new-mission="algorithm-optimization"]').waitFor();
 console.log('Practice controls:',(await learner.locator('[data-new-mission="algorithm-optimization"]').innerText()).slice(0,1600));
 await learner.screenshot({path:out+'/lms-student-lesson.png',fullPage:true});
 const solver=require('./practice-solvers-thinking.cjs')['algorithm-optimization'];
 await solver.wrongStage(learner,0);
 for(let stage=0;stage<3;stage++) {
  await solver.solveStage(learner,stage);
  if(stage<2) await learner.getByRole('button',{name:'Next challenge',exact:true}).click();
 }
 await learner.getByRole('button',{name:'Review mission',exact:true}).click();
 await learner.getByRole('button',{name:'Finish chapter',exact:true}).click();
 await learner.getByText('Lesson saved to student and teacher progress.',{exact:true}).waitFor();
 const result=await (await student.request.get(base+'/api/lms/inbox')).json();
 const submission=result.assignments.find(a=>a.id===assignmentId);
 assert.ok(submission.readAt,'starting the assignment marks the notification read');
 assert.ok(Math.abs(submission.progress.score - 200/3) < 0.000001);
 assert.equal(submission.progress.marks,26.67);
 await learner.reload();
 await learner.locator('[data-mission-complete="algorithm-optimization"]').waitFor();

 // Report must already show the embedded story mistake before the chapter is complete.
 const library=await (await teacher.request.get(base+'/api/lms/assignments')).json();
 const target=library.students.find(s=>s.rollNo==='21'&&s.className==='7A');
 await page.goto(base+`/teach/lms/students/${target.id}`);
 await page.getByRole('heading',{name:'Diya Sharma',exact:true}).waitFor();
 await page.waitForTimeout(1000);
 const report=await (await teacher.request.get(base+`/api/lms/students/${target.id}`)).json();
 assert.ok(report.events.some(e=>e.type==='story_answered'&&JSON.parse(e.payload).correct===false),'story mistake persisted');
 assert.ok(report.events.some(e=>e.type==='story_answered'&&JSON.parse(e.payload).correct===true),'story success persisted');
 await page.locator('details').first().locator('summary').click();
 await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
 await page.waitForTimeout(100);
 await page.screenshot({path:out+'/lms-student-report.png',fullPage:true});
 // Check desktop and mobile layouts on all new screens.
 for(const width of [390,768,1440]){
  await page.setViewportSize({width,height:1000});
  for(const route of ['/teach/lms','/teach/lms/new',`/teach/lms/${assignmentId}`,`/teach/lms/students/${target.id}`]){
   await page.goto(base+route);await page.waitForTimeout(600);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow ${width} ${route}`);
   assert.ok(!(await page.locator('body').innerText()).includes('Something went wrong'),`route ${route}`);
  }
 }
 for(const width of [390,1440]) {
  await learner.setViewportSize({width,height:1000});
  await learner.goto(base+'/dashboard');
  await learner.getByRole('heading',{name:'From your teacher',exact:true}).waitFor();
  assert.ok(await learner.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'dashboard assignment section overflow');
  await learner.screenshot({path:out+`/student-dashboard-${width}.png`,fullPage:true});
 }
 await learner.setViewportSize({width:390,height:844});
 await learner.goto(base+'/learn/assignments');
 await learner.getByRole('heading',{name:'Assignments',exact:true}).waitFor();
 await learner.waitForTimeout(500);assert.ok(await learner.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'student inbox overflow');
 await learner.screenshot({path:out+'/lms-student-inbox.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1100});await page.goto(base+'/teach/lms');await page.waitForTimeout(700);
 await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));
 await page.waitForTimeout(100);
 await page.screenshot({path:out+'/lms-teacher-workspace.png',fullPage:true});
 assert.deepEqual(errors,[],'browser errors');
 console.log('PASS Class 3–7 dropdown, exact chapters, selection resets, publish, visible student links/deadlines, direct start, student inbox, real story/practice outcomes, completion grade, resume, reports and responsive layouts');
 await teacher.close();await student.close();
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
