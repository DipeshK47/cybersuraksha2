import Link from "next/link";
import {
  Award,
  ArrowRight,
  Binary,
  Blocks,
  Bot,
  BrainCircuit,
  CalendarDays,
  CheckSquare2,
  ClipboardCheck,
  Clock3,
  FileChartColumn,
  Flame,
  GraduationCap,
  type LucideIcon,
  ScanSearch,
  Shapes,
  Sparkles,
  ShieldCheck,
  Target,
} from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { studentAssignments } from "../../db/lms";
import { AssignmentNotification } from "../components/lms/LmsPortal";
import {
  chapterCount,
  curriculum,
  moduleCount,
  type CurriculumStrand,
} from "../data/curriculum";
import { getPlayableModule } from "../data/module-registry";
import { getStudentWithRuns } from "../../db/academy";
import { getSessionFromCookieHeader } from "../lib/session";
import { getStudentSessionFromCookieHeader } from "../lib/student-session";

// Keyed by grade, not by array position: an index-based list silently yields
// `undefined` for a newly added class and crashes the whole dashboard render.
const gradeIcons: Record<number, LucideIcon> = {
  3: Shapes,
  4: ScanSearch,
  5: Blocks,
  6: Bot,
  7: Binary,
  8: BrainCircuit,
  10: GraduationCap,
};

const strandShortLabels: Partial<Record<CurriculumStrand, string>> = {
  "Computational Thinking": "CT",
  "Artificial Intelligence": "AI",
  Cybersecurity: "Cybersecurity",
  "Cyber Fraud": "Cyber Fraud",
};

export default async function DashboardPage() {
  // Identity comes from the verified session only. It was previously read from
  // the query string, which let anyone view any learner's profile and runs by
  // editing `?studentId=`.
  const cookieHeader = (await headers()).get("cookie");
  const studentSession = await getStudentSessionFromCookieHeader(cookieHeader);
  const teacherSession = studentSession
    ? null
    : await getSessionFromCookieHeader(cookieHeader);
  if (!studentSession && !teacherSession) redirect("/");

  const role = studentSession ? "student" : "teacher";
  const studentId = studentSession ? String(studentSession.student.id) : undefined;
  const className = studentSession?.student.className;
  const assignedGrade = className ? Number.parseInt(className, 10) : undefined;
  const assignedCurriculum = curriculum.find(
    (grade) => grade.grade === assignedGrade,
  );
  const studentProfile = studentSession
    ? await getStudentWithRuns(studentSession.student.id).catch(() => null)
    : null;
  const inbox = studentSession ? await studentAssignments(studentSession.student.id) : [];
  const pendingAssignments = inbox.filter(a => a.progress.completedAt == null);
  const studentName = studentProfile?.student.name ?? "Student Explorer";
  const studentRoll = studentProfile?.student.rollNo ?? "—";
  const completedMissions = studentProfile?.runs.length ?? 0;
  // Subject-organised classes have no missions to count, so guard the divisor.
  // Dividing by 0 rendered a literal "NaN%" beside a bar that looked complete.
  const totalMissions =
    assignedCurriculum?.modules.length ||
    (assignedCurriculum ? chapterCount(assignedCurriculum) : 12);
  const missionProgress =
    totalMissions > 0
      ? Math.min(100, Math.round((completedMissions / totalMissions) * 100))
      : 0;
  const latestRun = studentProfile?.runs.at(-1);
  const reportScore = latestRun
    ? Math.round((latestRun.drill + latestRun.recall) / 2)
    : 0;
  const pendingModules = assignedCurriculum?.modules.slice(
    completedMissions,
    completedMissions + 2,
  );
  const nextModule = pendingModules?.[0]?.title ?? "Choose your next mission";
  const nextPlayableModule =
    assignedCurriculum && pendingModules?.[0]
      ? getPlayableModule(assignedCurriculum.grade, pendingModules[0].title)
      : undefined;
  const roleQuery =
    role === "student"
      ? `?role=student${studentId ? `&studentId=${studentId}` : ""}${
          className ? `&className=${encodeURIComponent(className)}` : ""
        }`
      : "?role=teacher";

  return (
    <main className="dashboardPage">
      <header className="dashboardNav">
        <div className="dashboardNavInner">
          <Link className="dashboardBrand" href={`/dashboard${roleQuery}`}>
            <span className="dashboardBrandMark">
              <Sparkles aria-hidden="true" />
            </span>
            <span className="dashboardBrandName">CyberSuraksha</span>
            <span className="dashboardBrandSub">CT + AI</span>
          </Link>
          <nav className="dashboardNavRight" aria-label={`${role} navigation`}>
            {role === "teacher" ? (
              <>
                <span className="dashboardOrg">Delhi Public School, R.K. Puram</span>
                <Link className="dashboardGhost" href="/teach">
                  My classes
                </Link>
                <Link className="dashboardGhost" href="/teach/lms">
                  Classroom
                </Link>
                <Link className="dashboardGhost" href="/teach/results">
                  Results
                </Link>
              </>
            ) : (
              <>
                <span className="dashboardOrg">
                  {className ? `Class ${className}` : "Student"}
                </span>
                <AssignmentNotification />
                <Link className="dashboardGhost" href="#student-overview">
                  My profile
                </Link>
              </>
            )}
            <Link className="dashboardGhost" href="/logout">
              Log out
            </Link>
          </nav>
        </div>
      </header>

      <div
        className={`dashboardWrap ${
          role === "student" ? "dashboardWrapStudent" : "dashboardWrapTeacher"
        }${
          role === "student" && !assignedCurriculum
            ? " dashboardNoAssignedGrade"
            : ""
        }`}
      >
        {role === "student" ? (
          <section
            className="studentOverview"
            id="student-overview"
            aria-labelledby="student-overview-title"
          >
            <article className="studentProfileCard">
              <div className="studentProfileTop">
                <span className="studentAvatar" aria-hidden="true">
                  {studentName
                    .split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")}
                </span>
                <span className="studentStatus">
                  <span />
                  Active learner
                </span>
              </div>
              <p className="studentCardEyebrow">Student profile</p>
              <h1 id="student-overview-title">{studentName}</h1>
              <div className="studentIdentity">
                <span>Class {className ?? "7A"}</span>
                <span>Roll {studentRoll}</span>
                <span>DPS R.K. Puram</span>
              </div>
              <div className="studentStreak">
                <Flame aria-hidden="true" />
                <span>
                  <b>3 week</b>
                  learning streak
                </span>
              </div>
            </article>

            <article className="missionProgressCard">
              <div className="missionProgressHeading">
                <span className="studentInsightIcon">
                  <Target aria-hidden="true" />
                </span>
                <div>
                  <p className="studentCardEyebrow">Mission progress</p>
                  <h2>Your learning journey</h2>
                </div>
                <strong>{missionProgress}%</strong>
              </div>
              <div
                className="missionProgressTrack"
                role="progressbar"
                aria-label="Mission progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={missionProgress}
              >
                <span style={{ width: `${missionProgress}%` }} />
              </div>
              <div className="missionProgressMeta">
                <span>
                  <b>{completedMissions}</b> completed
                </span>
                <span>
                  <b>{Math.max(totalMissions - completedMissions, 0)}</b> to go
                </span>
              </div>
              <div className="nextMission">
                <span>
                  <small>Up next</small>
                  <b>{nextModule}</b>
                </span>
                <Link
                  href={
                    nextPlayableModule
                      ? `${nextPlayableModule.href}${roleQuery}&grade=${assignedGrade ?? 7}`
                      : `/grade/${assignedGrade ?? 7}${roleQuery}`
                  }
                  aria-label={`Continue with ${nextModule}`}
                >
                  Continue mission <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>

            <div className="studentInsightGrid">
              <article className="studentInsightCard studentReportCard">
                <span className="studentInsightIcon">
                  <FileChartColumn aria-hidden="true" />
                </span>
                <p className="studentCardEyebrow">Latest report</p>
                <strong>{latestRun ? `${reportScore}%` : "New"}</strong>
                <h2>{latestRun?.rank ?? "Ready to begin"}</h2>
                <p>
                  {latestRun
                    ? `${latestRun.moduleTitle} · drill ${latestRun.drill}% · recall ${latestRun.recall}%`
                    : "Complete a mission to unlock your first performance report."}
                </p>
              </article>

              <article className="studentInsightCard studentScheduleCard">
                <span className="studentInsightIcon">
                  <CalendarDays aria-hidden="true" />
                </span>
                <p className="studentCardEyebrow">Class schedule</p>
                <h2>This week</h2>
                <ul className="studentSchedule">
                  <li>
                    <b>Mon · 10:30</b>
                    <span>CT Lab</span>
                  </li>
                  <li>
                    <b>Wed · 12:15</b>
                    <span>AI Studio</span>
                  </li>
                </ul>
              </article>

              <article className="studentInsightCard studentDeadlineCard">
                <span className="studentInsightIcon">
                  <ClipboardCheck aria-hidden="true" />
                </span>
                <p className="studentCardEyebrow">Assignments</p>
                <strong>{pendingAssignments.length}</strong>
                <h2>From your teacher</h2>
                <ul className="studentDeadlineList">
                  {pendingAssignments.slice(0, 3).map(assignment => (
                    <li key={assignment.id}>
                      <Link href={`/learn/assignments#assignment-${assignment.id}`}>{assignment.title}</Link>
                      <b>{new Date(assignment.dueAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</b>
                    </li>
                  ))}
                  {!pendingAssignments.length && <li>No pending assignments.</li>}
                </ul>
                <Link className="dashboardGhost" href="/learn/assignments">View all assignments <ArrowRight aria-hidden="true" /></Link>
              </article>

              <article className="studentInsightCard studentAchievementCard">
                <span className="studentInsightIcon">
                  <Award aria-hidden="true" />
                </span>
                <p className="studentCardEyebrow">Achievements</p>
                <strong>{latestRun ? 3 : 1}</strong>
                <h2>Badge cabinet</h2>
                <div className="achievementChips">
                  <span>
                    <Sparkles aria-hidden="true" /> First step
                  </span>
                  <span className={latestRun ? "" : "achievementLocked"}>
                    <ShieldCheck aria-hidden="true" /> Safety scout
                  </span>
                  <span className={latestRun?.rank === "GHOST" ? "" : "achievementLocked"}>
                    <Award aria-hidden="true" /> Ghost rank
                  </span>
                </div>
              </article>
            </div>
          </section>
        ) : null}

        <section className="dashboardHero">
          <p className="dashboardEyebrow">
            Mission control · Classes 3–10
          </p>
          <h1>
            Think it through.
            <em>Build what comes next.</em>
          </h1>
          <p>
            Explore Computational Thinking, Artificial Intelligence,
            Cybersecurity, and Cyber Fraud through hands-on challenges.
          </p>
        </section>

        <section className="gradeGrid" id="classes" aria-label="Choose a class">
          {curriculum.map((grade) => {
            const Icon = gradeIcons[grade.grade] ?? Sparkles;
            const isAssigned = assignedGrade === grade.grade;
            return (
              <Link
                className={`gradeCard gradeTone-${grade.tone}${
                  isAssigned ? " gradeCardAssigned" : ""
                }`}
                href={`/grade/${grade.grade}${roleQuery}`}
                key={grade.grade}
              >
                <span className="gradeCardTop">
                  <span className="gradeNumber">
                    <small>Class</small>
                    {grade.grade}
                  </span>
                  <span className="gradeIcon">
                    <Icon aria-hidden="true" />
                  </span>
                </span>
                {isAssigned ? (
                  <span className="assignedBadge">Your class</span>
                ) : null}
                <div className="gradeCardCopy">
                  <h2>{grade.title}</h2>
                  <p>{grade.description}</p>
                </div>
                <span className="gradeMeta">
                  {grade.modules.length ? (
                    <>
                      <b>{grade.modules.length}</b> modules
                      <i>
                        {Array.from(
                          new Set(
                            grade.modules
                              .map((module) => strandShortLabels[module.strand])
                              .filter(Boolean),
                          ),
                        ).join(" + ")}
                        {/* Subject libraries sit beside the existing mission modules. */}
                        {grade.subjects
                          ? ` + ${grade.subjects.map((subject) => subject.name).join(" + ")}`
                          : ""}
                      </i>
                    </>
                  ) : (
                    <>
                      <b>{chapterCount(grade)}</b> chapters
                      <i>
                        {(grade.subjects ?? [])
                          .map((subject) => subject.name)
                          .join(" + ")}
                      </i>
                    </>
                  )}
                </span>
                <span className="gradeCta">
                  {role === "student" ? "Enter class" : "View modules"}
                  <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </section>
      </div>

      <footer className="dashboardFoot">
        <span>
          <Clock3 aria-hidden="true" /> <b>{moduleCount}</b> planned modules
        </span>
        <span>
          <CheckSquare2 aria-hidden="true" /> Interactive, not slides
        </span>
        <span>
          <ShieldCheck aria-hidden="true" /> Real scenarios, safe practice
        </span>
      </footer>
    </main>
  );
}
