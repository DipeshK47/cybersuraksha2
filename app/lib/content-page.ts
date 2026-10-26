import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getSessionFromCookieHeader } from "./session";
import { getStudentSessionFromCookieHeader } from "./student-session";
import { studentContent, teacherContent } from "./content-access";
import { permitsModule, permitsSubject } from "./content-policy";
import { getPlayableModuleById } from "../data/module-registry";

export async function contentPage() {
  const cookie = (await headers()).get("cookie");
  const student = await getStudentSessionFromCookieHeader(cookie);
  const teacher = student ? null : await getSessionFromCookieHeader(cookie);
  if (!student && !teacher) redirect("/student-login");
  const access = student ? await studentContent(student.student) : await teacherContent(teacher!.teacher);
  return { student, teacher, access, role: student ? "student" as const : "teacher" as const };
}

export async function requireGradePage(grade: number, subject?: { strand?: string; name: string }) {
  const context = await contentPage();
  if (!context.access.grades.includes(grade) || (subject && !permitsSubject(context.access, subject))) notFound();
  return context;
}

export async function requireModulePage(moduleId: string, requestedGrade?: number) {
  const context = await contentPage();
  const playable = getPlayableModuleById(moduleId);
  if (!playable || !permitsModule(context.access, playable)) notFound();
  const grades = playable.grades.filter(grade => context.access.grades.includes(grade));
  return { ...context, grade: requestedGrade && grades.includes(requestedGrade) ? requestedGrade : grades[0] };
}
