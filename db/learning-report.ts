import { and, eq } from "drizzle-orm";
import { getDb } from ".";
import { learnerHistory, studentAssignments } from "./lms";
import { assignments, assignmentSubmissions, questionAttempts, students, topicProgress } from "./schema";
import { schoolContent } from "../app/lib/content-access";
import { learningInsights } from "../app/lib/learning-insights";
import type { AssignmentQuestion, QuestionGrade } from "../app/lib/assignment-assessment";

export async function learningReport(student: Pick<typeof students.$inferSelect, "id" | "name" | "rollNo" | "className" | "schoolId">) {
  const db = getDb();
  const history = await learnerHistory(student.id);
  const practice = await db.select().from(questionAttempts).where(eq(questionAttempts.studentId, student.id));
  const topics = await db.select().from(topicProgress).where(eq(topicProgress.studentId, student.id));
  const custom = await db.select({ questions: assignments.questions, grades: assignmentSubmissions.grades }).from(assignmentSubmissions)
    .innerJoin(assignments, eq(assignments.id, assignmentSubmissions.assignmentId))
    .where(and(eq(assignmentSubmissions.studentId, student.id), eq(assignments.schoolId, student.schoolId ?? -1)));
  return { student: { id: student.id, name: student.name, rollNo: student.rollNo, className: student.className }, ...history, practice, topics,
    schoolName: student.schoolId ? (await schoolContent(student.schoolId)).schoolName : "School",
    insights: learningInsights({ ...history, practice, custom: custom.map(row => ({ questions: JSON.parse(row.questions) as AssignmentQuestion[], grades: JSON.parse(row.grades) as QuestionGrade[] })) }),
    assignments: await studentAssignments(student.id) };
}
