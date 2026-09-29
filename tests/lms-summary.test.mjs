import test from 'node:test';
import assert from 'node:assert/strict';
import { assignmentSummary, attemptSummary } from '../app/lib/lms-summary.ts';
const assignment = { moduleIds: '["a","b"]', dueAt: 1000, totalMarks: 80, publishedAt: 300 };
const attempt = (id, moduleId, completedAt, score) => ({ id, moduleId, startedAt: completedAt ?? 900, completedAt, score });
test('latest completed work counts before publication and later scores replace it', () => {
  const rows = [attempt('1','a',100,100), attempt('2','b',200,50)];
  const before = assignmentSummary(assignment, rows, 500);
  assert.equal(before.status,'Already completed'); assert.equal(before.marks,60);
  rows.push(attempt('3','a',600,0),attempt('4','a',null,null));
  const after = assignmentSummary(assignment, rows, 900);
  assert.equal(after.status,'Completed'); assert.equal(after.marks,20); assert.equal(after.alreadyCompleted,false);
});
test('incomplete, overdue, late and ungraded histories are explicit', () => {
  assert.equal(assignmentSummary(assignment,[],500).marks,null);
  assert.equal(assignmentSummary(assignment,[],1100).status,'Overdue');
  assert.equal(assignmentSummary(assignment,[attempt('1','a',100,50)],500).status,'In progress');
  assert.equal(assignmentSummary(assignment,[attempt('1','a',100,50),attempt('2','b',1200,100)],1300).status,'Completed late');
  assert.equal(assignmentSummary(assignment,[attempt('1','a',100,null),attempt('2','b',200,100)],500).marks,null);
});
test('story responses stay visible while first practice answers determine the score', () => {
  const event = (id,type,payload) => ({id,type,payload:JSON.stringify(payload),createdAt:1});
  const s = attemptSummary([event('1','story_answered',{id:'story',correct:false}),event('2','story_answered',{id:'story',correct:true}),event('3','question_answered',{id:'practice',correct:true}),event('4','hint_used',{})]);
  assert.deepEqual(s,{correct:2,wrong:1,hints:1,mistakes:0,score:100});
});

test('a missing required exercise cannot yield a grade', () => {
  const rows=[{id:'1',type:'question_answered',payload:'{"id":"q1","correct":true}',createdAt:1}];
  assert.equal(attemptSummary(rows,['q1','q2']).score,null);
});

test('marks are rounded only at the end, not from a rounded percentage', () => {
  const result=assignmentSummary({...assignment,moduleIds:'["a"]',totalMarks:40},[attempt('1','a',500,200/3)],900);
  assert.equal(result.marks,26.67);
});
