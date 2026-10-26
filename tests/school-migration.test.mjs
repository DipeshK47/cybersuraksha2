import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { DatabaseSync } from 'node:sqlite';

test('school migration preserves existing students, progress and assignments', async () => {
  const db = new DatabaseSync(':memory:');
  try {
    for (const name of ['0000_baseline', '0001_student_sessions', '0002_keen_zaladane', '0003_aspiring_hiroim']) db.exec(await readFile(new URL(`../drizzle/${name}.sql`, import.meta.url), 'utf8'));
    db.exec("INSERT INTO schools(id,name,slug) VALUES(1,'First','first'),(2,'Second','second'); INSERT INTO classes(id,school_id,grade,name) VALUES(1,1,7,'7A'),(2,2,7,'7A'); INSERT INTO teachers(id,school_id,name,email,password_hash) VALUES(1,1,'Teacher','a@example.test','hash'); INSERT INTO students(id,school_id,class_id,class_name,roll_no,name,password_hash) VALUES(1,1,1,'7A','20','First learner','hash'); INSERT INTO runs(student_id,module_id,module_title,rank,drill) VALUES(1,'lesson','Lesson','EXPLORER',75); INSERT INTO assignments(id,school_id,teacher_id,class_id,title,module_ids,due_at,total_marks,created_at) VALUES(1,1,1,1,'Earlier work','[\"lesson\"]',100,10,1);");
    db.exec(await readFile(new URL('../drizzle/0004_icy_toro.sql', import.meta.url), 'utf8'));
    assert.equal(db.prepare('SELECT name FROM students WHERE id=1').get().name,'First learner');
    assert.equal(db.prepare('SELECT drill FROM runs WHERE student_id=1').get().drill,75);
    assert.equal(db.prepare('SELECT questions FROM assignments WHERE id=1').get().questions,'[]');
    db.exec("INSERT INTO students(school_id,class_id,class_name,roll_no,name,password_hash) VALUES(2,2,'7A','20','Second learner','hash')");
    assert.throws(()=>db.exec("INSERT INTO students(school_id,class_id,class_name,roll_no,name,password_hash) VALUES(1,1,'7A','20','Duplicate','hash')"),/UNIQUE/);
  } finally { db.close(); }
});
