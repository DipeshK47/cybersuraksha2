"use client";

import type { CyberLessonComponentProps } from "../../lesson-types";
import { useState, type ComponentType } from "react";
import type { LessonChapter } from "../../../../data/lesson-content";
import { getClass8Chapter } from "../../../../data/class8";
import type { Class8Task, TaskAnswer } from "../../../../data/class8/types";
import { PracticeShell, usePractice } from "../new/PracticeShell";
import { TaskBoard, initialAnswer } from "./TaskBoard";
import { buildTaskEvidence, recordTaskEvidence } from "./task-evidence";
import type { TaskDiagnosis } from "./task-feedback";
import { FeedbackPanel } from "./FeedbackPanel";
import { WorldIllustration } from "./WorldIllustration";
import type { TaskSimulationSnapshot } from "./task-simulation";
import { ui, useEvidenceLanguage } from "./ui";
import s from "./class8.module.css";

export type StructuredPracticeVisualProps = {
  chapter: LessonChapter;
  task: Class8Task;
  stage: number;
  answer: TaskAnswer;
  ready: boolean;
  simulation: TaskSimulationSnapshot | null;
};

export function Class8Lesson(props: CyberLessonComponentProps) {
  return <StructuredLesson {...props} chapter={getClass8Chapter(props.lesson.slug)!} />;
}

export function StructuredLesson({ chapter: suppliedChapter, Illustration = WorldIllustration, labTitle = ui.lab.en, PracticeVisual, ...props }: CyberLessonComponentProps & {
  chapter?: LessonChapter;
  PracticeVisual?: ComponentType<StructuredPracticeVisualProps>;
  labTitle?: string;
  Illustration?: ComponentType<{ theme: LessonChapter["sceneTheme"]; caption: string; resolved?: boolean }>;
}) {
  const evidenceLanguage = useEvidenceLanguage();
  const [diagnosis, setDiagnosis] = useState<TaskDiagnosis | null>(null);
  const [tested, setTested] = useState<{ boundary: string; snapshot: TaskSimulationSnapshot | null } | null>(null);
  const chapter = suppliedChapter ?? getClass8Chapter(props.lesson.slug)!;
  const stageValue = props.runtime.state[`practice-${chapter.slug}`];
  const stage = typeof stageValue === "number" ? Math.min(stageValue, 2) : 0;
  const runtime = { ...props.runtime, recordDecision: (decision: Parameters<typeof props.runtime.recordDecision>[0]) => props.runtime.recordDecision({ ...decision, category: chapter.topics[stage].en }) };
  const practice = usePractice({ ...props, runtime });
  const task = chapter.tasks[Math.min(practice.stage, 2)];
  const draftKey = `draft-${chapter.slug}-${practice.stage}`;
  const answer = props.runtime.state[draftKey] as TaskAnswer | undefined ?? initialAnswer(task);
  const boundary = JSON.stringify([props.runtime.runId, chapter.slug, practice.stage, task, answer]);
  const simulation = tested?.boundary === boundary ? tested.snapshot : null;
  const evidenceKey = `evidence-${chapter.slug}`;
  const evidence = (props.runtime.state[evidenceKey] ?? {}) as Record<string, string | ReturnType<typeof buildTaskEvidence>>;
  const reflectionKey = `reflection-${chapter.slug}`;
  const reflection = typeof props.runtime.state[reflectionKey] === "string" ? props.runtime.state[reflectionKey] as string : "";
  const reflectionSaved = props.runtime.state[`${reflectionKey}-saved`] === reflection && reflection.length > 0;
  function check() {
    const result = recordTaskEvidence(task, answer, props.runtime.trackActivity, chapter.topics[Math.min(practice.stage, 2)].en);
    setDiagnosis(result);
    if (!result.complete) return;
    const snapshot = buildTaskEvidence(task, answer);
    props.runtime.updateState({ [evidenceKey]: { ...evidence, [practice.stage]: snapshot } });
    practice.submit(result.correct, result.summary.en);
  }
  const notebook = <div className={s.notebook}><h2>{ui.evidence.en}</h2><ol>{Object.entries(evidence).sort(([a], [b]) => Number(a) - Number(b)).map(([key, value]) => <li key={key}><article data-class8-evidence={key} translate="no">{typeof value === "string" ? value : value.map((line, index) => <p key={index}><span>{line.label[evidenceLanguage]}</span>: <span>{line.value[evidenceLanguage]}</span></p>)}</article></li>)}</ol>
    <label>{chapter.reflection.en}<textarea aria-label={ui.reflect.en} maxLength={500} value={reflection} onChange={event => props.runtime.updateState({ [reflectionKey]: event.target.value })} /></label>
    <small>{ui.reflectionNote.en}</small><button className={s.secondary} type="button" disabled={!reflection.trim() || reflectionSaved} onClick={() => {
      props.runtime.trackActivity("story_feedback", { category: chapter.title.en, question: chapter.reflection.en, feedback: reflection, reflection: true });
      props.runtime.updateState({ [`${reflectionKey}-saved`]: reflection });
    }}>{reflectionSaved ? "Reflection saved" : "Save reflection"}</button>
  </div>;
  return <div className={s.lesson} data-class8-lesson={chapter.slug}><PracticeShell props={props} stage={practice.stage} eyebrow={labTitle} brief={chapter.summary.en} prompt={task.prompt.en} feedback={practice.feedback} feedbackCorrect={practice.feedbackCorrect} feedbackContent={<FeedbackPanel diagnosis={diagnosis} />} ready={practice.ready} onContinue={() => { setDiagnosis(null); practice.continuePractice(); }} onFinish={practice.finish} evidence={notebook}>
    <div className={s.topics} aria-label={ui.topics.en}>{chapter.topics.map((topic, index) => <div key={topic.en}><b>{index + 1}</b>{topic.en}</div>)}</div>
    {PracticeVisual ? <PracticeVisual chapter={chapter} task={task} stage={practice.stage} answer={answer} ready={practice.ready} simulation={simulation} /> : <Illustration theme={chapter.sceneTheme} caption={chapter.outcomes[Math.min(practice.stage, 2)].en} resolved={practice.ready} />}
    <TaskBoard key={`${props.runtime.runId}-${practice.stage}`} task={task} answer={answer} onChange={value => { setDiagnosis(null); practice.clearFeedback(); props.runtime.updateState({ [draftKey]: value }); }} onCheck={check} disabled={practice.ready} onSimulationChange={snapshot => setTested({ boundary, snapshot })} />
    <details onToggle={event => { if (event.currentTarget.open) props.runtime.trackActivity("hint_used", { category: chapter.topics[Math.min(practice.stage, 2)].en, feedback: task.hint.en }); }}><summary>{ui.taskHint.en}</summary><p>{task.hint.en}</p></details>
    {props.role === "teacher" && <details className={s.teacher}><summary>{ui.teacher.en}</summary><h3>{ui.objectives.en}</h3><ul>{chapter.outcomes.map(outcome => <li key={outcome.en}>{outcome.en}</li>)}</ul><p>{chapter.teacherPrompt.en}</p><ol>{chapter.rubric.map(point => <li key={point.en}>{point.en}</li>)}</ol></details>}
  </PracticeShell></div>;
}
