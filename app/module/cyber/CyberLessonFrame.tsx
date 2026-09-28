"use client";

import Link from "next/link";
import { RotateCcw, ShieldCheck, X } from "lucide-react";
import type { ReactNode } from "react";
import {
  HintDrawer,
  MistakeDialog,
} from "../../components/learning/LearningSupport";
import type { CyberLessonMeta } from "../../data/cyber-lessons";
import { newMissions } from "../../data/new-missions";
import type {
  CyberLessonRole,
  CyberLessonRuntime,
} from "./lesson-types";
import styles from "./cyber-lesson-frame.module.css";

export function CyberLessonFrame({
  lesson,
  grade,
  role,
  studentId,
  className,
  runtime,
  children,
}: {
  lesson: CyberLessonMeta;
  grade: number;
  role: CyberLessonRole;
  studentId?: string;
  className?: string;
  runtime: CyberLessonRuntime;
  children: ReactNode;
}) {
  const query = new URLSearchParams({ role });
  if (studentId) query.set("studentId", studentId);
  if (className) query.set("className", className);
  const exitHref = `/grade/${grade}?${query.toString()}`;

  return (
    <main className={styles.page} data-accent={lesson.accent} data-edition={newMissions.some((mission) => mission.slug === lesson.slug) ? "practice" : undefined}>
      <a className={styles.skipLink} href="#cyber-lesson-content">
        Skip to lesson
      </a>

      <header className={styles.topbar}>
        <div className={styles.identity}>
          <Link
            aria-label={`Exit ${lesson.title}`}
            className={styles.iconButton}
            href={exitHref}
          >
            <X aria-hidden="true" />
          </Link>
          <div>
            <span>
              Class {grade} · {lesson.strand}
            </span>
            <strong>{lesson.title}</strong>
          </div>
        </div>

        <div className={styles.actions}>
          <span className={styles.checkpoint}>
            <ShieldCheck aria-hidden="true" />
            {runtime.checkpoint === "start" ? "Mission ready" : runtime.checkpoint}
          </span>
          <button onClick={runtime.resetLesson} type="button">
            <RotateCcw aria-hidden="true" /> Start over
          </button>
        </div>
      </header>

      <section
        aria-busy={!runtime.loaded}
        className={styles.content}
        id="cyber-lesson-content"
      >
        {runtime.loaded ? children : <p className={styles.loading}>Preparing the mission…</p>}
      </section>

      <footer aria-live="polite" className={styles.status}>
        {runtime.completed ? (
          <>
            <span>
              {role === "teacher"
                ? "Teacher preview complete. Student progress is unchanged."
                : !studentId
                  ? "Preview complete. Sign in as a student to save this lesson."
                  : runtime.saveStatus === "saving"
                    ? "Saving this lesson to the student profile…"
                    : runtime.saveStatus === "saved"
                      ? "Lesson saved to student and teacher progress."
                      : runtime.saveStatus === "error"
                        ? "The lesson is complete on this device, but it has not synced yet."
                        : "Lesson complete."}
            </span>
            {runtime.saveStatus === "error" ? (
              <button onClick={runtime.retrySave} type="button">
                Try saving again
              </button>
            ) : null}
          </>
        ) : (
          <span>{lesson.summary}</span>
        )}
      </footer>

      {runtime.hints ? (
        <HintDrawer hints={runtime.hints} onClose={runtime.closeHints} />
      ) : null}
      <MistakeDialog
        feedback={runtime.mistake}
        onClose={runtime.closeMistake}
        onShowHint={runtime.showHintFromMistake}
      />
    </main>
  );
}
