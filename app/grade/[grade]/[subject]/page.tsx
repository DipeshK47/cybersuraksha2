import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  IndianRupee,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import {
  getGradeCurriculum,
  getGradeSubject,
  type CurriculumStrand,
} from "../../../data/curriculum";
import { getPlayableModule } from "../../../data/module-registry";

/**
 * Library for one subject. It supports textbook chapters and interactive
 * CyberSuraksha lesson collections without changing their underlying routes.
 */
function StrandIcon({ strand }: { strand: CurriculumStrand }) {
  if (strand === "Artificial Intelligence") {
    return <BrainCircuit aria-hidden="true" />;
  }
  if (strand === "Cybersecurity") return <ShieldCheck aria-hidden="true" />;
  if (strand === "Cyber Fraud") return <IndianRupee aria-hidden="true" />;
  return <BookOpen aria-hidden="true" />;
}

function strandClassName(strand: CurriculumStrand) {
  if (strand === "Artificial Intelligence") return " moduleStrandAi";
  if (strand === "Cybersecurity") return " moduleStrandCybersecurity";
  if (strand === "Cyber Fraud") return " moduleStrandFraud";
  return "";
}

export default async function SubjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ grade: string; subject: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { grade: gradeParam, subject: subjectParam } = await params;
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
  const subject = getGradeSubject(gradeNumber, subjectParam);

  if (!grade || !subject) {
    return (
      <main className="gradePage">
        <section className="gradeMissing">
          <p>Subject not found</p>
          <h1>This subject is not available.</h1>
          <Link href={`/grade/${gradeParam}${roleQuery}`}>
            Back to the class
          </Link>
        </section>
      </main>
    );
  }

  const hasLessons = Boolean(subject.modules?.length);
  const firstWeek = subject.strand === "Cybersecurity" ? 1 : subject.strand === "Artificial Intelligence" ? 9 : subject.strand === "Computational Thinking" ? 17 : 25;

  return (
    <main className={`gradePage gradeTone-${grade.tone}`}>
      <header className="gradeNav">
        <Link className="gradeBack" href={`/grade/${grade.grade}${roleQuery}`}>
          <ArrowLeft aria-hidden="true" />
          Class {grade.grade} modules
        </Link>
        <div>
          <span>
            CyberSuraksha · Class {grade.grade} · {subject.name}
          </span>
          <Link href="/logout">Log out</Link>
        </div>
      </header>

      <div className="gradeShell">
        <section className="gradeIntro">
          <div className="gradeIntroNumber" aria-hidden="true">
            {grade.grade}
          </div>
          <div>
            <p>Class {grade.grade} · {subject.name}</p>
            <h1>{subject.name}</h1>
            <span>{subject.description}</span>
          </div>
          <dl className="gradeStats">
            <div>
              <dt>Chapters</dt>
              <dd>
                {hasLessons ? subject.modules?.length : subject.chapters.length}
              </dd>
            </div>
          </dl>
        </section>

        {hasLessons ? (
          <section
            className="moduleLibrary"
            aria-labelledby="lesson-library-title"
          >
            <div className="moduleLibraryHeading">
              <div>
                <p>{subject.book}</p>
                <h2 id="lesson-library-title">Interactive chapters</h2>
              </div>
              <span>Learn by making choices, solving cases, and trying again</span>
            </div>

            <div className="moduleCardGrid">
              {subject.modules?.map((module, index) => {
                const playable = getPlayableModule(grade.grade, module.title);
                const body = (
                  <>
                    <span className="moduleCardNumber">
                      W{firstWeek + index}
                    </span>
                    <span
                      className={`moduleStrand${strandClassName(module.strand)}`}
                    >
                      <StrandIcon strand={module.strand} />
                      {module.strand}
                    </span>
                    <h3>{module.title}</h3>
                    <span className="moduleCardStatus">
                      {playable ? "Play chapter" : "Planned chapter"}
                      {playable ? <ArrowRight aria-hidden="true" /> : null}
                    </span>
                  </>
                );

                return playable ? (
                  <Link
                    className="moduleNameCard moduleNameCardPlayable"
                    href={`${playable.href}${roleQuery}&grade=${grade.grade}`}
                    key={module.title}
                  >
                    {body}
                  </Link>
                ) : (
                  <article className="moduleNameCard" key={module.title}>
                    {body}
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {subject.chapters.length ? (
          <section
            className="moduleLibrary"
            aria-labelledby="chapter-library-title"
          >
            <div className="moduleLibraryHeading">
              <div>
                <p>{subject.book}</p>
                <h2 id="chapter-library-title">Chapters</h2>
              </div>
              <span>Open lessons are marked with a play button</span>
            </div>

            <div className="moduleCardGrid">
              {subject.chapters.map((chapter) => {
                const body = (
                  <>
                    <span className="moduleCardNumber">
                      {String(chapter.number).padStart(2, "0")}
                    </span>
                    <span className="moduleStrand">
                      {chapter.video || chapter.href ? (
                        <PlayCircle aria-hidden="true" />
                      ) : (
                        <BookOpen aria-hidden="true" />
                      )}
                      Chapter {chapter.number}
                    </span>
                    <h3>{chapter.title}</h3>
                    {chapter.note ? (
                      <p className="moduleCardNote">{chapter.note}</p>
                    ) : null}
                    <span className="moduleCardStatus">
                      {chapter.href ? (
                        <>
                          Start interactive lesson
                          <ArrowRight aria-hidden="true" />
                        </>
                      ) : chapter.video ? (
                        <>
                          Watch the lesson · {chapter.duration}
                          <ArrowRight aria-hidden="true" />
                        </>
                      ) : (
                        "Planned module"
                      )}
                    </span>
                  </>
                );
                const lessonHref = chapter.href
                  ? chapter.href
                  : chapter.slug && chapter.video
                    ? `/grade/${grade.grade}/${subject.slug}/${chapter.slug}`
                    : null;
                return lessonHref ? (
                  <Link
                    className="moduleNameCard moduleNameCardPlayable"
                    href={`${lessonHref}${roleQuery}`}
                    key={chapter.number}
                  >
                    {body}
                  </Link>
                ) : (
                  <article className="moduleNameCard" key={chapter.number}>
                    {body}
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
