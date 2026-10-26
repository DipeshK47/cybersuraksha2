import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { assignmentSchema, autoGrade, studentQuestions } from '../app/lib/assignment-assessment.ts';
import { assignmentSummary, eventDetails } from '../app/lib/lms-summary.ts';
import { learningInsights } from '../app/lib/learning-insights.ts';
import { permitsModule } from '../app/lib/content-policy.ts';
import { csvText } from '../app/lib/csv.ts';

const choice={id:randomUUID(),prompt:'Choose safely',topic:'Phishing',type:'choice',options:['Verify','Trust'],correctAnswer:'Verify',marks:2};
const written={id:randomUUID(),prompt:'Explain why',topic:'Phishing',type:'text',options:[],marks:3};
const assignment={id:1,title:'Assessment',instructions:'',classId:1,moduleIds:'[]',questions:JSON.stringify([choice,written]),totalMarks:5,dueAt:1000,publishedAt:100,createdAt:1};

test('question validation keeps answer keys valid and total marks consistent',()=>{
 const body={...assignment,moduleIds:[],questions:[choice,written],publish:false};
 assert.equal(assignmentSchema.safeParse(body).success,true);
 assert.equal(assignmentSchema.safeParse({...body,totalMarks:6}).success,false);
 assert.equal(assignmentSchema.safeParse({...body,questions:[{...choice,correctAnswer:'Invented'},written]}).success,false);
 assert.equal(assignmentSchema.safeParse({...body,questions:[{...choice,options:['Verify','Verify']},written]}).success,false);
 assert.equal(assignmentSchema.safeParse({...body,moduleIds:['lesson'],totalMarks:5}).success,false);
 assert.equal(assignmentSchema.safeParse({...body,moduleIds:['lesson'],totalMarks:10}).success,true);
 assert.equal(assignmentSchema.safeParse({...body,questions:[choice,{...written,id:choice.id}]}).success,false);
 assert.ok(!studentQuestions(assignment.questions).includes('correctAnswer'));
});

test('custom-only assignments await written grading and include late, zero and partial marks',()=>{
 const grades=autoGrade([choice,written],{[choice.id]:'Trust',[written.id]:'Explanation'});
 const submission={answers:'{}',grades:JSON.stringify(grades),feedback:'',submittedAt:1200,gradedAt:null};
 assert.equal(assignmentSummary(assignment,[],1500).status,'Overdue');
 assert.equal(assignmentSummary(assignment,[],1500,submission).status,'Awaiting grading');
 assert.equal(assignmentSummary(assignment,[],1500,submission).marks,null);
 submission.grades=JSON.stringify(grades.map(g=>({...g,marks:g.marks??2})));
 assert.equal(assignmentSummary(assignment,[],1500,submission).marks,2);
 assert.equal(assignmentSummary(assignment,[],1500,submission).status,'Completed late');
 submission.grades=JSON.stringify(grades.map(g=>({...g,marks:0})));
 assert.equal(assignmentSummary(assignment,[],1500,submission).marks,0);
});

test('mixed assignments reserve question marks then weight remaining lesson marks',()=>{
 const a={...assignment,moduleIds:'["lesson"]',totalMarks:15};
 const attempts=[{id:'1',moduleId:'lesson',startedAt:200,completedAt:300,score:50}];
 const submission={answers:'{}',grades:JSON.stringify([{questionId:choice.id,marks:2},{questionId:written.id,marks:1}]),feedback:'',submittedAt:400,gradedAt:500};
 assert.equal(assignmentSummary(a,attempts,900,submission).marks,8);
 assert.equal(assignmentSummary(a,[],900,submission).marks,null);
});

test('weak-section reports use first answers, newest attempts and minimum evidence',()=>{
 const event=(id,attemptId,question,correct,time)=>({id,attemptId,type:'question_answered',payload:JSON.stringify({id:question,correct,category:'Safety'}),createdAt:time});
 const insights=learningInsights({attempts:[{id:'old',moduleId:'lesson',startedAt:1},{id:'new',moduleId:'lesson',startedAt:2}],events:[event('1','old','a',true,1),event('2','new','a',false,2),event('3','new','a',true,3),event('4','new','b',false,4),event('5','new','c',true,5)],practice:[{chapterSlug:'math',topicSlug:'angle',isCorrect:0}],custom:[]});
 const lesson=insights.find(i=>i.source==='Lesson practice');
 assert.equal(lesson.attempted,3);assert.equal(lesson.wrong,2);assert.equal(lesson.accuracy,33);assert.equal(lesson.status,'Needs attention');
 assert.equal(insights.find(i=>i.source==='Subject practice').status,'Limited evidence');
 assert.deepEqual(eventDetails({payload:'null'}),{});
});

test('content policy requires both an assigned grade and enabled subject',()=>{
 const access={grades:[7],subjects:['Cybersecurity'],schoolName:'School'};
 assert.equal(permitsModule(access,{grades:[6,7],strand:'Cybersecurity'}),true);
 assert.equal(permitsModule(access,{grades:[8],strand:'Cybersecurity'}),false);
 assert.equal(permitsModule(access,{grades:[7],strand:'Cyber Fraud'}),false);
});

test('CSV exports preserve text and defuse spreadsheet formulas',()=>{
 assert.equal(csvText([['=HYPERLINK("x")','A,"B"',0,'Line\nbreak']]),'"\'=HYPERLINK(""x"")","A,""B""","0","Line\nbreak"');
 assert.match(csvText([[' @SUM(1,2)']]),/^"'/);
});
