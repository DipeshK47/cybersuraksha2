"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CyberLessonMeta } from "../../data/cyber-lessons";
import type {
  LessonHints,
  MistakeFeedback,
} from "../../components/learning/LearningSupport";
import { useActivityEmitter } from "../../lib/activity-client";
import type {
  CyberLessonRole,
  CyberLessonRuntime,
  LessonCompletion,
  LessonDecision,
  LessonSaveStatus,
  RecordedDecision,
} from "./lesson-types";

type StoredLessonRun = {
  version: 1;
  checkpoint: string;
  state: Record<string, unknown>;
  answers: Record<string, RecordedDecision>;
  leakIds: string[];
  completed: boolean;
  completion: LessonCompletion | null;
  startedAt: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function restoreStoredRun(value: string | null): StoredLessonRun | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed) || parsed.version !== 1) return null;
    if (typeof parsed.checkpoint !== "string") return null;
    if (!isRecord(parsed.state) || !isRecord(parsed.answers)) return null;
    if (!Array.isArray(parsed.leakIds)) return null;
    if (typeof parsed.completed !== "boolean") return null;
    if (typeof parsed.startedAt !== "number") return null;
    if (
      parsed.completion !== null &&
      (!isRecord(parsed.completion) ||
        typeof parsed.completion.title !== "string" ||
        typeof parsed.completion.summary !== "string")
    ) {
      return null;
    }
    return parsed as StoredLessonRun;
  } catch {
    return null;
  }
}

function score(
  answers: Record<string, RecordedDecision>,
  kind: "drill" | "recall",
) {
  const selected = Object.values(answers).filter(
    (answer) => answer.kind === kind,
  );
  if (!selected.length) return 0;
  return Math.round(
    (selected.filter((answer) => answer.correct).length / selected.length) *
      100,
  );
}

export function useCyberLessonRun({
  lesson,
  role,
  studentId,
}: {
  lesson: CyberLessonMeta;
  role: CyberLessonRole;
  studentId?: string;
}): CyberLessonRuntime {
  const [loaded, setLoaded] = useState(false);
  const [checkpoint, setCheckpointState] = useState("start");
  const [state, setState] = useState<Record<string, unknown>>({});
  const [answers, setAnswers] = useState<Record<string, RecordedDecision>>({});
  const [leakIds, setLeakIds] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [completion, setCompletion] = useState<LessonCompletion | null>(null);
  const [saveStatus, setSaveStatus] = useState<LessonSaveStatus>("idle");
  const [saveAttempt, setSaveAttempt] = useState(0);
  const [mistake, setMistake] = useState<MistakeFeedback | null>(null);
  const [hints, setHints] = useState<LessonHints | null>(null);
  const startedAt = useRef(0);
  const answersRef = useRef(answers);
  const leakIdsRef = useRef(leakIds);
  const savedCompletion = useRef(false);
  const completionEmitted = useRef(false);
  const lastMistakeHints = useRef<LessonHints | null>(null);
  const storageKey = useMemo(
    () =>
      `cybersuraksha-cyber-${lesson.slug}-v1-${studentId ?? "preview"}`,
    [lesson.slug, studentId],
  );
  const emit = useActivityEmitter(
    lesson.id,
    role === "student" && Boolean(studentId),
  );

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    leakIdsRef.current = leakIds;
  }, [leakIds]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const restored = restoreStoredRun(window.localStorage.getItem(storageKey));
      if (restored) {
        setCheckpointState(restored.checkpoint);
        setState(restored.state);
        setAnswers(restored.answers);
        answersRef.current = restored.answers;
        setLeakIds(restored.leakIds);
        leakIdsRef.current = restored.leakIds;
        setCompleted(restored.completed);
        setCompletion(restored.completion);
        startedAt.current = restored.startedAt;
      } else {
        window.localStorage.removeItem(storageKey);
        startedAt.current = Date.now();
      }
      setLoaded(true);
      emit("module_started", { restored: Boolean(restored) });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [emit, storageKey]);

  useEffect(() => {
    if (!loaded) return;
    const stored: StoredLessonRun = {
      version: 1,
      checkpoint,
      state,
      answers,
      leakIds,
      completed,
      completion,
      startedAt: startedAt.current,
    };
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(stored));
    } catch {
      // A full or unavailable storage area must not interrupt a lesson.
    }
  }, [answers, checkpoint, completed, completion, leakIds, loaded, state, storageKey]);

  const setCheckpoint = useCallback(
    (nextCheckpoint: string) => {
      setCheckpointState(nextCheckpoint);
      emit("screen_viewed", { checkpoint: nextCheckpoint });
    },
    [emit],
  );

  const updateState = useCallback((patch: Record<string, unknown>) => {
    setState((current) => ({ ...current, ...patch }));
  }, []);

  const recordDecision = useCallback(
    (decision: LessonDecision) => {
      const answered = answersRef.current;
      if (answered[decision.id]) return false;
      const recorded: RecordedDecision = {
        ...decision,
        answeredAt: Date.now(),
      };
      const nextAnswers = { ...answered, [decision.id]: recorded };
      answersRef.current = nextAnswers;
      setAnswers(nextAnswers);
      emit("question_answered", {
        id: decision.id,
        correct: decision.correct,
        kind: decision.kind,
        category: decision.category,
        checkpoint,
      });
      if (decision.unsafe && !leakIdsRef.current.includes(decision.id)) {
        const nextLeakIds = [...leakIdsRef.current, decision.id];
        leakIdsRef.current = nextLeakIds;
        setLeakIds(nextLeakIds);
        emit("privacy_leak", {
          id: decision.id,
          category: decision.category,
          checkpoint,
        });
      }
      return true;
    },
    [checkpoint, emit],
  );

  const recordMistake = useCallback(
    (
      feedback: MistakeFeedback,
      options?: { activity?: string; hints?: LessonHints },
    ) => {
      const activity = options?.activity ?? checkpoint;
      emit("mistake", { activity, checkpoint });
      lastMistakeHints.current = options?.hints ?? null;
      setMistake(feedback);
    },
    [checkpoint, emit],
  );

  const recordHint = useCallback(
    (nextHints: LessonHints, activity = checkpoint) => {
      emit("hint_used", { activity, checkpoint });
      lastMistakeHints.current = nextHints;
      setMistake(null);
      setHints(nextHints);
    },
    [checkpoint, emit],
  );

  const closeMistake = useCallback(() => setMistake(null), []);
  const closeHints = useCallback(() => setHints(null), []);
  const showHintFromMistake = useCallback(() => {
    setMistake(null);
    if (lastMistakeHints.current) setHints(lastMistakeHints.current);
  }, []);

  const completeLesson = useCallback((result: LessonCompletion) => {
    setCompletion(result);
    setCompleted(true);
  }, []);

  useEffect(() => {
    if (!completed || !loaded) return;
    const drill = score(answers, "drill");
    const recall = score(answers, "recall");
    const average = Math.round((drill + recall) / 2);
    const durationSeconds = Math.max(
      0,
      Math.round((Date.now() - startedAt.current) / 1_000),
    );

    if (!completionEmitted.current) {
      completionEmitted.current = true;
      emit("module_completed", {
        drill,
        recall,
        leaks: leakIds.length,
        durationSeconds,
      });
    }

    if (role === "teacher" || !studentId || savedCompletion.current) return;
    savedCompletion.current = true;
    setSaveStatus("saving");
    void fetch("/api/module-runs", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        moduleId: lesson.id,
        rank: average >= 90 ? "GHOST" : average >= 75 ? "GUARDED" : "EXPLORER",
        leaks: leakIds.length,
        drill,
        recall,
        path: leakIds.length ? "supported" : "independent",
        durationSeconds,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Progress could not be saved.");
        setSaveStatus("saved");
      })
      .catch(() => {
        savedCompletion.current = false;
        setSaveStatus("error");
      });
  }, [answers, completed, emit, leakIds, lesson.id, loaded, role, saveAttempt, studentId]);

  const retrySave = useCallback(() => {
    savedCompletion.current = false;
    setSaveStatus("idle");
    setSaveAttempt((attempt) => attempt + 1);
  }, []);

  const resetLesson = useCallback(() => {
    window.localStorage.removeItem(storageKey);
    setCheckpointState("start");
    setState({});
    setAnswers({});
    answersRef.current = {};
    setLeakIds([]);
    leakIdsRef.current = [];
    setCompleted(false);
    setCompletion(null);
    setSaveStatus("idle");
    setMistake(null);
    setHints(null);
    savedCompletion.current = false;
    completionEmitted.current = false;
    startedAt.current = Date.now();
    emit("module_started", { restarted: true });
  }, [emit, storageKey]);

  return {
    loaded,
    checkpoint,
    state,
    answers,
    completed,
    completion,
    saveStatus,
    mistake,
    hints,
    setCheckpoint,
    updateState,
    recordDecision,
    recordMistake,
    recordHint,
    closeMistake,
    closeHints,
    showHintFromMistake,
    completeLesson,
    resetLesson,
    retrySave,
  };
}
