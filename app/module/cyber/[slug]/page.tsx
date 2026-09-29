import { headers } from "next/headers";
import { getStudentSessionFromCookieHeader } from "../../../lib/student-session";
import { notFound } from "next/navigation";
import { getCyberLesson } from "../../../data/cyber-lessons";
import { CyberLessonPage } from "../CyberLessonPage";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function CyberLessonRoute({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const lesson = getCyberLesson(slug);

  if (!lesson) notFound();

  const defaultGrade = lesson.grades[0] ?? 3;
  const requestedGrade =
    typeof query.grade === "string"
      ? Number.parseInt(query.grade, 10)
      : defaultGrade;
  const grade = lesson.grades.includes(requestedGrade)
    ? requestedGrade
    : defaultGrade;
  const session = await getStudentSessionFromCookieHeader((await headers()).get("cookie"));
  const role = session ? "student" : "teacher";
  const studentId = session ? String(session.student.id) : undefined;
  const className = session?.student.className;

  return (
    <CyberLessonPage
      className={className}
      grade={grade}
      lesson={lesson}
      role={role}
      studentId={studentId}
    />
  );
}
