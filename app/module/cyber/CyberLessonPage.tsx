"use client";

import { createElement } from "react";
import type { CyberLessonMeta } from "../../data/cyber-lessons";
import { CyberLessonFrame } from "./CyberLessonFrame";
import type { CyberLessonRole } from "./lesson-types";
import { getCyberLessonComponent } from "./lessons/lesson-registry";
import { useCyberLessonRun } from "./useCyberLessonRun";

export function CyberLessonPage({
  lesson,
  grade,
  role,
  studentId,
  className,
}: {
  lesson: CyberLessonMeta;
  grade: number;
  role: CyberLessonRole;
  studentId?: string;
  className?: string;
}) {
  const runtime = useCyberLessonRun({ lesson, role, studentId });
  const lessonContent = createElement(getCyberLessonComponent(lesson.slug), {
    key: runtime.runId,
    grade,
    lesson,
    role,
    runtime,
  });

  return (
    <CyberLessonFrame
      className={className}
      grade={grade}
      lesson={lesson}
      role={role}
      runtime={runtime}
      studentId={studentId}
    >
      {lessonContent}
    </CyberLessonFrame>
  );
}
