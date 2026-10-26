import { z } from "zod";

export type AssignmentQuestion = { id: string; prompt: string; topic: string; type: "choice" | "text"; options: string[]; correctAnswer?: string; marks: number };
export type QuestionGrade = { questionId: string; marks: number | null; feedback: string };
export type Submission = { answers: string; grades: string; feedback: string; submittedAt: number; gradedAt: number | null };

const questionSchema = z.object({
  id: z.string().uuid(), prompt: z.string().trim().min(1).max(2000), topic: z.string().trim().min(1).max(120),
  type: z.enum(["choice", "text"]), options: z.array(z.string().trim().min(1).max(500)).max(6).default([]),
  correctAnswer: z.string().trim().max(500).optional(), marks: z.number().positive().max(1000).multipleOf(0.01),
}).superRefine((q, ctx) => {
  if (q.type === "choice" && (q.options.length < 2 || new Set(q.options).size !== q.options.length || !q.options.includes(q.correctAnswer ?? ""))) ctx.addIssue({ code: "custom", message: "A choice question needs 2–6 different options and a correct answer from those options." });
  if (q.type === "text" && (q.options.length || q.correctAnswer)) ctx.addIssue({ code: "custom", message: "Written questions are marked by a teacher; remove options and answer key." });
});

export const assignmentSchema = z.object({
  title: z.string().trim().min(1).max(160), instructions: z.string().trim().max(4000).default(""),
  classId: z.number().int().positive(), moduleIds: z.array(z.string().min(1).max(100)).max(20),
  questions: z.array(questionSchema).max(30).default([]),
  dueAt: z.number().int().positive(), totalMarks: z.number().positive().max(10000).multipleOf(0.01), publish: z.boolean().default(false),
}).superRefine((a, ctx) => {
  if (!a.moduleIds.length && !a.questions.length) ctx.addIssue({ code: "custom", message: "Choose a lesson or add a question." });
  if (new Set(a.questions.map(q => q.id)).size !== a.questions.length) ctx.addIssue({ code: "custom", message: "Question identities must be unique." });
  const customMarks = Math.round(a.questions.reduce((sum, q) => sum + q.marks, 0) * 100);
  const total = Math.round(a.totalMarks * 100);
  if ((a.moduleIds.length && customMarks >= total) || (!a.moduleIds.length && customMarks !== total)) ctx.addIssue({ code: "custom", message: "Total marks must equal question marks, plus marks for any selected lessons." });
});

export function autoGrade(questions: AssignmentQuestion[], answers: Record<string, string>): QuestionGrade[] {
  return questions.map(q => ({ questionId: q.id, marks: q.type === "choice" ? answers[q.id] === q.correctAnswer ? q.marks : 0 : null, feedback: "" }));
}

export function studentQuestions(questions: string) {
  return JSON.stringify((JSON.parse(questions) as AssignmentQuestion[]).map(q => ({ id: q.id, prompt: q.prompt, topic: q.topic, type: q.type, options: q.options, marks: q.marks })));
}

export const submissionSchema = z.object({ answers: z.record(z.string().uuid(), z.string().trim().min(1).max(4000)) });
export const gradingSchema = z.object({
  grades: z.array(z.object({ questionId: z.string().uuid(), marks: z.number().min(0).max(1000).multipleOf(0.01), feedback: z.string().trim().max(2000).default("") })).min(1).max(30),
  feedback: z.string().trim().max(4000).default(""),
});
