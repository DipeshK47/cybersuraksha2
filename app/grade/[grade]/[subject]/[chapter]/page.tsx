import Link from "next/link";
import { getGradeCurriculum, getSubjectChapter } from "../../../../data/curriculum";
import { ChapterLesson } from "./ChapterLesson";

/**
 * A chapter lesson, laid out like the Class 3 missions. This server component
 * only resolves the chapter and hands it to the client shell, which owns the
 * rail selection and video seeking.
 */
export default async function ChapterPage({
  params,
  searchParams,
}: {
  params: Promise<{ grade: string; subject: string; chapter: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { grade: gradeParam, subject: subjectSlug, chapter: chapterSlug } =
    await params;
  const query = await searchParams;
  const role = query.role === "student" ? "student" : "teacher";
  const studentId =
    typeof query.studentId === "string" ? query.studentId : undefined;
  const className =
    typeof query.className === "string" ? query.className : undefined;
  const roleQuery =
    role === "student"
      ? `?role=student${studentId ? `&studentId=${studentId}` : ""}${
          className ? `&className=${encodeURIComponent(className)}` : ""
        }`
      : "?role=teacher";

  const gradeNumber = Number.parseInt(gradeParam, 10);
  const grade = getGradeCurriculum(gradeNumber);
  const found = getSubjectChapter(gradeNumber, subjectSlug, chapterSlug);

  if (!grade || !found) {
    return (
      <main className="gradePage">
        <section className="gradeMissing">
          <p>Lesson not found</p>
          <h1>This lesson is not available yet.</h1>
          <Link href={`/grade/${gradeParam}/${subjectSlug}${roleQuery}`}>
            Back to the chapter list
          </Link>
        </section>
      </main>
    );
  }

  const { subject, chapter } = found;

  return (
    <ChapterLesson
      backHref={`/grade/${grade.grade}/${subject.slug}${roleQuery}`}
      chapterNumber={chapter.number}
      chapterTitle={chapter.title}
      duration={chapter.duration}
      gradeNumber={grade.grade}
      poster={chapter.poster}
      subjectName={subject.name}
      subjectSlug={subject.slug}
      topics={chapter.topics ?? []}
      video={chapter.video}
    />
  );
}
