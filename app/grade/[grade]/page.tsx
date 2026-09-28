import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  BrainCircuit,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";
import { ThemeToggle } from "../../components/ThemeToggle";
import {
  chapterCount,
  getGradeCurriculum,
  subjectModuleCount,
  type CurriculumStrand,
} from "../../data/curriculum";
import { getPlayableModule } from "../../data/module-registry";

const strandOrder: CurriculumStrand[] = [
  "Computational Thinking",
  "Artificial Intelligence",
  "Cybersecurity",
  "Cyber Fraud",
];

const strandLabels: Record<CurriculumStrand, string> = {
  "Computational Thinking": "CT",
  "Artificial Intelligence": "AI",
  Cybersecurity: "Cyber",
  "Cyber Fraud": "Fraud",
  English: "English",
};

function StrandIcon({ strand }: { strand: CurriculumStrand }) {
  if (strand === "Artificial Intelligence") {
    return <BrainCircuit aria-hidden="true" />;
  }
  if (strand === "Cybersecurity") return <ShieldCheck aria-hidden="true" />;
  if (strand === "Cyber Fraud") return <IndianRupee aria-hidden="true" />;
  return <BookOpenCheck aria-hidden="true" />;
}

function strandClassName(strand: CurriculumStrand) {
  if (strand === "Artificial Intelligence") return " moduleStrandAi";
  if (strand === "Cybersecurity") return " moduleStrandCybersecurity";
  if (strand === "Cyber Fraud") return " moduleStrandFraud";
  return "";
}

export default async function GradePage({
  params,
  searchParams,
}: {
  params: Promise<{ grade: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { grade: gradeParam } = await params;
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
  const grade = getGradeCurriculum(Number.parseInt(gradeParam, 10));

  if (!grade) {
    return (
      <main className="gradePage">
        <section className="gradeMissing">
          <p>Class not found</p>
          <h1>This classroom is not available.</h1>
          <Link href={`/dashboard${roleQuery}`}>Return to CyberSuraksha</Link>
        </section>
      </main>
    );
  }

  const cyberModules = grade.subjects?.filter((subject) => subject.strand && subject.strand !== "English") ?? [];
  const otherSubjects = grade.subjects?.filter((subject) => !subject.strand || subject.strand === "English") ?? [];
  const visibleLegacyModules = cyberModules.length ? [] : grade.modules;
  const strandCounts = visibleLegacyModules.reduce<
    Partial<Record<CurriculumStrand, number>>
  >(
    (counts, module) => ({
      ...counts,
      [module.strand]: (counts[module.strand] ?? 0) + 1,
    }),
    {},
  );
  // Senior classes are organised by subject; they carry no mission modules.
  const subjects = grade.subjects;
  const chapters = chapterCount(grade);
  const subjectLessons = subjectModuleCount(grade);

  return (
    <main className={`gradePage gradeTone-${grade.tone}`}>
      <header className="gradeNav">
        <Link className="gradeBack" href={`/dashboard${roleQuery}`}>
          <ArrowLeft aria-hidden="true" />
          All classes
        </Link>
        <div>
          <span>CyberSuraksha · Class {grade.grade}</span>
          <Link href="/logout">Log out</Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="gradeShell">
        <section className="gradeIntro">
          <div className="gradeIntroNumber" aria-hidden="true">
            {grade.grade}
          </div>
          <div>
            <p>Class {grade.grade} curriculum</p>
            <h1>{grade.title}</h1>
            <span>{grade.description}</span>
          </div>
          <dl className="gradeStats">
            {visibleLegacyModules.length ? (
              <>
                <div>
                  <dt>Modules</dt>
                  <dd>{visibleLegacyModules.length}</dd>
                </div>
                {strandOrder.map((strand) =>
                  strandCounts[strand] ? (
                    <div key={strand}>
                      <dt>{strandLabels[strand]}</dt>
                      <dd>{strandCounts[strand]}</dd>
                    </div>
                  ) : null,
                )}
              </>
            ) : null}
            {subjects ? (
              <>
                <div>
                  <dt>{cyberModules.length ? "Modules" : "Subjects"}</dt>
                  <dd>{cyberModules.length || subjects.length}</dd>
                </div>
                {subjectLessons ? (
                  <div>
                    <dt>{cyberModules.length ? "Cyber chapters" : "Lessons"}</dt>
                    <dd>{subjectLessons}</dd>
                  </div>
                ) : null}
                {chapters ? (
                  <div>
                    <dt>{cyberModules.length ? "Other chapters" : "Chapters"}</dt>
                    <dd>{chapters}</dd>
                  </div>
                ) : null}
              </>
            ) : null}
          </dl>
        </section>

        {visibleLegacyModules.length ? (
        <section className="moduleLibrary" aria-labelledby="module-library-title">
          <div className="moduleLibraryHeading">
            <div>
              <p>Your learning path</p>
              <h2 id="module-library-title">Modules</h2>
            </div>
            <span>Handbook aligned · Learn through interactive missions</span>
          </div>

          <div className="moduleCardGrid">
            {visibleLegacyModules.map((module, index) => {
              const playable = getPlayableModule(grade.grade, module.title);
              const cardContent = (
                <>
                  <span className="moduleCardNumber">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`moduleStrand${strandClassName(module.strand)}`}
                  >
                    <StrandIcon strand={module.strand} />
                    {module.strand}
                  </span>
                  <h3>{module.title}</h3>
                  <span className="moduleCardStatus">
                    {playable ? "Start interactive mission" : "Planned module"}
                    <ArrowRight aria-hidden="true" />
                  </span>
                </>
              );

              return playable ? (
                <Link
                  className="moduleNameCard moduleNameCardPlayable"
                  href={`${playable.href}${roleQuery}&grade=${grade.grade}`}
                  key={module.title}
                >
                  {cardContent}
                </Link>
              ) : (
                <article className="moduleNameCard" key={module.title}>
                  {cardContent}
                </article>
              );
            })}
          </div>
        </section>
        ) : null}

        {(cyberModules.length ? [
          { title: "CyberSuraksha modules", description: "Open a module to play its two chapters", items: cyberModules },
          { title: "Other subjects", description: "Explore other class lessons", items: otherSubjects },
        ] : [{ title: "Subjects", description: "Open a subject to see its lessons", items: subjects ?? [] }]).filter((group) => group.items.length).map((group) => (
          <section
            className="moduleLibrary"
            aria-label={group.title}
            key={group.title}
          >
            <div className="moduleLibraryHeading">
              <div>
                <p>Your learning path</p>
                <h2>{group.title}</h2>
              </div>
              <span>{group.description}</span>
            </div>

            <div className="trackGrid">
              {group.items.map((subject, index) => (
                <Link
                  className="moduleNameCard moduleNameCardPlayable"
                  href={`/grade/${grade.grade}/${subject.slug}${roleQuery}`}
                  key={subject.slug}
                >
                  <span className="moduleCardNumber">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`moduleStrand${
                      subject.strand ? strandClassName(subject.strand) : ""
                    }`}
                  >
                    <StrandIcon strand={subject.strand ?? "English"} />
                    {subject.strand ?? "Subject"}
                  </span>
                  <h3>{subject.name}</h3>
                  <p className="moduleCardNote">{subject.description}</p>
                  <span className="moduleCardStatus">
                    {subject.modules?.length
                      ? `${subject.modules.length} chapters`
                      : `${subject.chapters.length} chapters`}
                    <ArrowRight aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
