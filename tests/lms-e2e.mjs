// Use a disposable database: CYBERSURAKSHA_EPHEMERAL_WORKERS=1 vinext dev --port 3201.
// BASE_URL=http://127.0.0.1:3201 node --test tests/lms-e2e.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { newMissions } from '../app/data/new-missions.ts';
import prototypes from '../app/data/cyber-lessons.json' with { type: 'json' };
const base=process.env.BASE_URL ?? 'http://127.0.0.1:3201';
const request=async (path,cookie,method='GET',body) => fetch(base+path,{method,headers:{...(cookie?{cookie}:{}),...(body?{'content-type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),redirect:'manual'});
const cookie=r=>(r.headers.get('set-cookie')??'').split(';')[0];
async function json(path,session,method='GET',body){const r=await request(path,session,method,body);const p=await r.json();assert.ok(r.ok,JSON.stringify(p));return p;}

test('LMS publication, notifications, prior work, latest scores, retries and access scope',async()=>{
  assert.equal((await request('/api/lms/assignments')).status,401);
  assert.equal((await request('/api/lms/inbox')).status,401);
  const teacher=cookie(await request('/api/auth/teacher',null,'POST',{email:'teacher@dpsrkp.edu.in',password:'Teacher@123'}));
  const student=cookie(await request('/api/auth/student',null,'POST',{school:'dps-rkp',className:'7A',rollNo:'20',password:'DPS20SAFE'}));
  const library=await json('/api/lms/assignments',teacher);
  assert.deepEqual(library.modules.map(m=>m.id).sort(),newMissions.map(m=>m.id).sort(),'only the current 24 chapters are assignable');
  for(const grade of [3,4,5,6,7]) {
    const chapters=library.modules.filter(m=>m.grades.includes(grade));
    assert.equal(chapters.length,8,`eight chapters for Class ${grade}`);
    for(const strand of new Set(chapters.map(m=>m.strand))) assert.equal(chapters.filter(m=>m.strand===strand).length,2);
    if(grade===7) continue;
    const {class:section}=await json('/api/admin/classes',teacher,'POST',{grade,section:'QA'});
    assert.equal((await request('/api/lms/assignments',teacher,'POST',{title:`Class ${grade} chapter check`,classId:section.id,moduleIds:[chapters[0].id],dueAt:Date.now()+86400000,totalMarks:20})).status,201);
    const wrongBand=library.modules.find(m=>!m.grades.includes(grade));
    assert.equal((await request('/api/lms/assignments',teacher,'POST',{title:'Wrong band',classId:section.id,moduleIds:[wrongBand.id],dueAt:Date.now()+86400000,totalMarks:20})).status,400);
  }
  const klass=library.classes.find(c=>c.name==='7A');
  assert.equal((await request('/api/lms/assignments',teacher,'POST',{title:'Old prototype',classId:klass.id,moduleIds:[prototypes.find(m=>m.grades.includes(7)).id],dueAt:Date.now()+86400000,totalMarks:20})).status,400);
  const chapter=library.modules.find(m=>m.title==='Algorithm Optimization');
  assert.ok(chapter);
  const ids=newMissions.find(m=>m.id===chapter.id).assessmentIds;
  const learner=library.students.find(s=>s.className==='7A'&&s.rollNo==='20');
  assert.equal((await request('/api/lms/assignments',student)).status,401);
  assert.equal((await request('/api/lms/assignments',teacher,'POST',{title:'Invalid class',instructions:'',classId:999999,moduleIds:[chapter.id],dueAt:Date.now()+86400000,totalMarks:100})).status,404);
  const body={title:'LMS regression assignment',instructions:'Work through the story and practice.',classId:klass.id,moduleIds:[chapter.id],dueAt:Date.now()+86400000,totalMarks:80,publish:false};
  const {assignment}=await json('/api/lms/assignments',teacher,'POST',body);
  assert.ok(!(await json('/api/lms/inbox',student)).assignments.some(a=>a.id===assignment.id),'draft not disclosed');
  const history=async()=>json(`/api/lms/students/${learner.id}`,teacher);
  const event=(attemptKey,type,payload={})=>({moduleId:chapter.id,attemptKey,eventId:randomUUID(),type,payload});
  const key1=randomUUID();
  const events=[event(key1,'module_started'),event(key1,'story_answered',{id:'story',correct:true,category:'Optimization story'}),event(key1,'question_answered',{id:ids[0],correct:false,category:'Loop optimization',feedback:'Remove the repeated action.'}),event(key1,'question_answered',{id:ids[0],correct:true,category:'Loop optimization',retry:true}),event(key1,'question_answered',{id:ids[1],correct:true,category:'Loop optimization'}),event(key1,'question_answered',{id:ids[2],correct:true,category:'Loop optimization'}),event(key1,'module_completed')];
  await json('/api/activity',student,'POST',{events});
  const initial=await history();
  const one=initial.attempts.find(a=>a.id.endsWith(key1));
  assert.ok(Math.abs(one.score - 200/3) < 0.000001);
  await json('/api/activity',student,'POST',{events});
  const retried=await history();
  assert.equal(retried.attempts.length,initial.attempts.length,'replayed batch creates no attempt');
  assert.equal(retried.events.length,initial.events.length,'replayed batch creates no response');
  await json(`/api/lms/assignments/${assignment.id}`,teacher,'PATCH',{publish:true});
  let inbox=(await json('/api/lms/inbox',student)).assignments.find(a=>a.id===assignment.id);
  assert.equal(inbox.progress.status,'Already completed'); assert.equal(inbox.progress.marks,53.33); assert.equal(inbox.readAt,null);
  await json('/api/lms/inbox',student,'PATCH',{assignmentId:assignment.id});
  inbox=(await json('/api/lms/inbox',student)).assignments.find(a=>a.id===assignment.id);
  assert.ok(inbox.readAt);
  const key2=randomUUID();
  await json('/api/activity',student,'POST',{events:[event(key2,'module_started'),event(key2,'question_answered',{id:ids[0],correct:false,category:'Loop optimization'}),event(key2,'question_answered',{id:ids[1],correct:false,category:'Loop optimization'}),event(key2,'question_answered',{id:ids[2],correct:false,category:'Loop optimization'}),event(key2,'module_completed')]});
  inbox=(await json('/api/lms/inbox',student)).assignments.find(a=>a.id===assignment.id);
  assert.equal(inbox.progress.marks,0,'latest score replaces a higher previous score');
  assert.equal(inbox.progress.alreadyCompleted,false);
  const detail=await json(`/api/lms/assignments/${assignment.id}`,teacher);
  const submission=detail.students.find(s=>s.id===learner.id);
  assert.equal(submission.progress.marks,0);assert.ok(submission.attempts>=2);
  const report=await history(); assert.ok(report.events.some(e=>e.type==='question_answered'&&JSON.parse(e.payload).correct===false));
  assert.ok(report.events.some(e=>JSON.parse(e.payload).retry===true));
  const other=cookie(await request('/api/auth/student',null,'POST',{school:'dps-rkp',className:'8B',rollNo:'31',password:'DPS31SAFE'}));
  assert.equal((await request('/api/lms/inbox',other,'PATCH',{assignmentId:assignment.id})).status,404);
  const {invite}=await json('/api/admin/invites',teacher,'POST',{email:`lms-scope-${Date.now()}@example.test`,role:'teacher'});
  const restricted=cookie(await request('/api/auth/accept-invite',null,'POST',{token:invite.token,name:'LMS scope test',password:'ScopeTest@123'}));
  assert.equal((await json('/api/lms/assignments',restricted)).classes.length,0);
  assert.equal((await request(`/api/lms/assignments/${assignment.id}`,restricted)).status,404);
  assert.equal((await request(`/api/lms/students/${learner.id}`,restricted)).status,404);
});
