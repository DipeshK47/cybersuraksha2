import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { Miniflare } from 'miniflare';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { hashPassword } from '../app/lib/password.ts';

// Exercise real handlers, migrations and D1 transactions in an isolated Worker.
// No fixture endpoint ships with the app, and no persistent database is opened.
const root = fileURLToPath(new URL('../', import.meta.url));
const routes = [
  ['/api/auth/teacher', 'auth/teacher'], ['/api/auth/student', 'auth/student'],
  ['/api/admin/school', 'admin/school'], ['/api/admin/classes', 'admin/classes'],
  ['/api/students', 'students'], ['/api/schools', 'schools'], ['/api/chat', 'chat'],
  ['/api/lms/assignments', 'lms/assignments'], ['/api/lms/inbox', 'lms/inbox'],
  ['/api/lms/marks', 'lms/marks'], ['/api/lms/progress', 'lms/progress'],
  ['/api/activity', 'activity'], ['/api/module-runs', 'module-runs'], ['/api/practice-attempt', 'practice-attempt'],
];
const dynamic = [
  ['^/api/lms/assignments/(\\d+)$', 'lms/assignments/[id]', ['id']],
  ['^/api/lms/inbox/(\\d+)$', 'lms/inbox/[id]', ['id']],
  ['^/api/lms/students/(\\d+)$', 'lms/students/[id]', ['id']],
  ['^/api/lms/assignments/(\\d+)/submissions/(\\d+)$', 'lms/assignments/[id]/submissions/[studentId]', ['id', 'studentId']],
];
const imports = [...routes, ...dynamic].map(([,path], i) => `import * as route${i} from './app/api/${path}/route.ts';`).join('\n');
const entry = `${imports}
export default { async fetch(request) {
 const path = new URL(request.url).pathname;
 const exact = [${routes.map(([path],i) => `[${JSON.stringify(path)}, route${i}]`).join(',')}].find(([key]) => key === path);
 let handler = exact?.[1]; let params = {};
 ${dynamic.map(([pattern,,keys],i) => `{ const match = path.match(new RegExp(${JSON.stringify(pattern)})); if (match) { handler = route${routes.length+i}; params = ${JSON.stringify(keys)}.reduce((p,k,n) => ({...p,[k]:match[n+1]}),{}); } }`).join('\n')}
 return handler?.[request.method] ? handler[request.method](request, { params: Promise.resolve(params) }) : new Response('Not found', {status:404});
}};`;
const bundle = await build({ stdin: { contents: entry, resolveDir: root }, bundle: true, write: false, format: 'esm', platform: 'neutral', conditions: ['workerd', 'worker'], external: ['cloudflare:workers', 'node:*'], define: { 'process.env.NODE_ENV': '"development"' }, plugins: [{ name: 'sql', setup(builder) { builder.onResolve({filter:/\.sql\?raw$/}, args => ({path:fileURLToPath(new URL(args.path.replace('?raw',''), `file://${args.resolveDir}/`)),namespace:'sql'})); builder.onLoad({filter:/.*/,namespace:'sql'}, async args => ({contents:await readFile(args.path,'utf8'),loader:'text'})); } }] });

test('school isolation, assignments, grading, marks and curriculum enforcement', async t => {
 const mf = new Miniflare({ modules: true, script: bundle.outputFiles[0].text, compatibilityDate: '2026-05-15', compatibilityFlags: ['nodejs_compat'], d1Databases: ['DB'] });
 const request = (path, cookie, method='GET', body) => mf.dispatchFetch('http://school.test'+path,{method, headers:{...(cookie?{cookie}:{}),...(body?{'content-type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
 const json = async (path, cookie, method='GET', body, status=200) => { const r = await request(path,cookie,method,body); const p = await r.json(); assert.equal(r.status,status,JSON.stringify(p)); return p; };
 const login = async (kind,body) => {const r=await request('/api/auth/'+kind,null,'POST',body);assert.equal(r.status,200,await r.clone().text());return r.headers.getSetCookie()[0].split(';')[0];};
 try {
 const admin = await login('teacher',{email:'teacher@dpsrkp.edu.in',password:'Teacher@123'});
 const student = await login('student',{school:'dps-rkp',className:'7A',rollNo:'20',password:'DPS20SAFE'});
 const workspace = await json('/api/lms/assignments',admin);
 const classroom = workspace.classes.find(c=>c.name==='7A');
 const learner = workspace.students.find(s=>s.rollNo==='20'&&s.classId===classroom.id);
 const chapter = workspace.modules.find(m=>m.title==='Pattern Detective');
 const db = await mf.getD1Database('DB');
 const hash = await hashPassword('SchoolTest@123');
 await db.prepare("INSERT INTO schools (id,name,slug) VALUES (200,'Second School','second-school')").run();
 await db.prepare("INSERT INTO classes (id,school_id,grade,section,name) VALUES (200,200,7,'A','7A')").run();
 await db.prepare("INSERT INTO teachers (id,school_id,name,email,password_hash,role,status) VALUES (200,200,'Other admin','other@school.test',?,'school_admin','active'),(201,1,'Teacher','limited@school.test',?,'teacher','active')").bind(hash,hash).run();
 await db.prepare("INSERT INTO teacher_classes (teacher_id,class_id) VALUES (201,?)").bind(classroom.id).run();
 await db.prepare("INSERT INTO students (id,school_id,class_id,class_name,roll_no,name,password_hash) VALUES (200,200,200,'7A','20','Other learner',?)").bind(hash).run();
 const other = await login('teacher',{email:'other@school.test',password:'SchoolTest@123'});
 const otherStudent = await login('student',{school:'second-school',className:'7A',rollNo:'20',password:'SchoolTest@123'});
 const limited = await login('teacher',{email:'limited@school.test',password:'SchoolTest@123'});
 await t.test('matching class/roll numbers across schools work and school lists are real',async()=>{
  assert.equal((await json('/api/schools')).schools.length,2);
  const second=await json('/api/lms/assignments',other);
  assert.deepEqual(second.students.map(s=>s.id),[200]);
  assert.equal((await request(`/api/lms/students/${learner.id}`,other)).status,404);
  assert.equal((await request('/api/admin/school',limited)).status,403);
 });
 const q1={id:randomUUID(),prompt:'Which message is safe?',topic:'Phishing',type:'choice',options:['Ask an adult','Share a password'],correctAnswer:'Ask an adult',marks:2};
 const q2={id:randomUUID(),prompt:'Explain how you would verify a caller.',topic:'Phishing',type:'text',options:[],marks:3};
 let body={title:'School assessment',classId:classroom.id,moduleIds:[],questions:[q1,q2],totalMarks:5,dueAt:Date.now()+86400000};
 let assignment;
 await t.test('drafts can be edited; keys and drafts stay private',async()=>{
  ({assignment}=await json('/api/lms/assignments',admin,'POST',body,201));
  assert.equal((await request(`/api/lms/inbox/${assignment.id}`,student)).status,404);
  assert.equal((await request(`/api/lms/assignments/${assignment.id}`,other)).status,404);
  assert.equal((await request(`/api/lms/assignments/${assignment.id}`,limited,'PATCH',{publish:true})).status,403);
  body={...body,title:'Edited school assessment'};
  await json(`/api/lms/assignments/${assignment.id}`,admin,'PUT',body);
  await json(`/api/lms/assignments/${assignment.id}`,admin,'PATCH',{publish:true});
  assert.equal((await request(`/api/lms/assignments/${assignment.id}`,admin,'PUT',body)).status,409);
  const inbox=await json(`/api/lms/inbox/${assignment.id}`,student);
  assert.equal(inbox.assignment.title,body.title);
  assert.ok(!inbox.assignment.questions.includes('correctAnswer'));
  assert.equal((await request(`/api/lms/inbox/${assignment.id}`,otherStudent)).status,404);
  assert.equal((await request(`/api/lms/assignments/${assignment.id}`,student)).status,401);
 });
 await t.test('server marks choices, validates answers and prevents duplicate submissions',async()=>{
  assert.equal((await request(`/api/lms/inbox/${assignment.id}`,student,'POST',{answers:{[q1.id]:'Invented'}})).status,400);
  const answers={[q1.id]:'Share a password',[q2.id]:'Call the known number instead of the caller’s number.'};
  const results=await Promise.all([request(`/api/lms/inbox/${assignment.id}`,student,'POST',{answers}),request(`/api/lms/inbox/${assignment.id}`,student,'POST',{answers})]);
  assert.deepEqual(results.map(r=>r.status).sort(),[201,409]);
  const detail=await json(`/api/lms/assignments/${assignment.id}`,admin);
  const row=detail.students.find(s=>s.id===learner.id);
  assert.equal(row.progress.status,'Awaiting grading');
  assert.equal(row.progress.marks,null);
  assert.equal(JSON.parse(row.submission.grades)[0].marks,0);
  assert.equal((await request(`/api/lms/assignments/${assignment.id}/submissions/${learner.id}`,student,'PATCH',{grades:[]})).status,401);
 });
 const grades=[{questionId:q1.id,marks:0,feedback:'Never share passwords.'},{questionId:q2.id,marks:2,feedback:'Also ask a trusted adult.'}];
 await t.test('teacher grading is bounded and scoped; feedback reaches students and marks records',async()=>{
  const endpoint=`/api/lms/assignments/${assignment.id}/submissions/${learner.id}`;
  assert.equal((await request(endpoint,admin,'PATCH',{grades:[{...grades[0],marks:99},grades[1]]})).status,400);
  assert.equal((await request(endpoint,other,'PATCH',{grades})).status,404);
  assert.equal((await request(endpoint,limited,'PATCH',{grades})).status,403);
  await json(endpoint,admin,'PATCH',{grades,feedback:'Review phishing and practise verification.'});
  const inbox=await json(`/api/lms/inbox/${assignment.id}`,student);
  assert.match(inbox.submission.feedback,/Review phishing/);
  const row=(await json('/api/lms/marks',admin)).rows.find(r=>r.student.id===learner.id&&r.assignmentId===assignment.id);
  assert.equal(row.progress.marks,2);
  assert.equal((await json('/api/lms/marks',other)).rows.length,0);
  const deadlines=await json('/api/chat',admin,'POST',{message:'Show deadlines'});
  assert.ok(deadlines.answer.includes(body.title));
  assert.ok(!(await json('/api/chat',other,'POST',{message:'Show deadlines'})).answer.includes(body.title));
  assert.match((await json('/api/chat',admin,'POST',{message:'What is our timetable?'})).answer,/No school timetable/);
  const own=await json('/api/lms/progress',student);
  assert.equal(own.student.id,learner.id);
  assert.equal(own.insights.find(i=>i.source==='Assignment').wrong,2);
 });
 await t.test('school curriculum changes take effect on APIs immediately',async()=>{
  const settings=await json('/api/admin/school',admin);
  await json('/api/admin/school',admin,'PUT',{schoolName:settings.schoolName,grades:[6],subjects:['Cybersecurity']});
  assert.equal((await json('/api/lms/assignments',admin)).classes.length,0);
  assert.equal((await request('/api/activity',student,'POST',{moduleId:chapter.id,type:'module_started',payload:{}})).status,403);
  assert.equal((await request('/api/module-runs',student,'POST',{moduleId:chapter.id})).status,403);
  assert.equal((await request('/api/practice-attempt',student,'POST',{questionId:'why-word',chosen:'three · sides · measure'})).status,403);
  assert.equal((await request(`/api/lms/inbox/${assignment.id}`,student)).status,403);
  assert.equal((await json('/api/lms/inbox',student)).assignments.length,0);
  assert.equal((await request('/api/admin/classes',admin,'POST',{grade:7,section:'X'})).status,400);
  assert.equal((await request('/api/students',admin,'POST',{className:'7A',students:[{rollNo:'90',name:'New learner'}]})).status,400);
  await json('/api/admin/school',admin,'PUT',{schoolName:settings.schoolName,grades:settings.grades,subjects:settings.subjects});
  assert.equal((await json('/api/lms/assignments',other)).classes.length,1);
 });
 await t.test('malformed cookies fail closed and validation rejects mismatched marks',async()=>{
  assert.equal((await request('/api/lms/assignments','cybersuraksha_session=%')).status,401);
  assert.equal((await request('/api/lms/assignments',admin,'POST',{...body,totalMarks:100})).status,400);
 });
 } finally { await mf.dispose(); }
});
