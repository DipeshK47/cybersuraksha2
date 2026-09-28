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
  const role = query.role === "student" ? "student" : "teacher";
  const studentId =
    typeof query.studentId === "string" ? query.studentId : undefined;
  const className =
    typeof query.className === "string" ? query.className : undefined;

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
