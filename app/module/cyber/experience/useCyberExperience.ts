"use client";

import { useMemo } from "react";
import type { CyberLessonRuntime } from "../lesson-types";
import type {
  ExperienceAction,
  ExperienceDefinition,
  ExperienceSavedState,
} from "./experience-types";

const EMPTY_STATE: ExperienceSavedState = {
  scene: 0,
  completedActions: [],
  points: 0,
};

function readState(value: unknown): ExperienceSavedState {
  if (!value || typeof value !== "object" || Array.isArray(value)) return EMPTY_STATE;
  const candidate = value as Partial<ExperienceSavedState>;
  return {
    scene: typeof candidate.scene === "number" ? candidate.scene : 0,
    completedActions: Array.isArray(candidate.completedActions)
      ? candidate.completedActions.filter((item): item is string => typeof item === "string")
      : [],
    points: typeof candidate.points === "number" ? candidate.points : 0,
  };
}

export function useCyberExperience(
  runtime: CyberLessonRuntime,
  definition: ExperienceDefinition,
  assessmentIds: readonly [string, string, string],
) {
  const stateKey = `experience-${definition.id}`;
  const saved = readState(runtime.state[stateKey]);
  const scene = Math.min(Math.max(saved.scene, 0), definition.scenes.length - 1);

  const api = useMemo(() => {
    function save(next: ExperienceSavedState) {
      runtime.updateState({ [stateKey]: next });
    }

    function setScene(nextScene: number, checkpoint = definition.scenes[nextScene]) {
      const bounded = Math.min(Math.max(nextScene, 0), definition.scenes.length - 1);
      save({ ...saved, scene: bounded });
      runtime.setCheckpoint(checkpoint ?? definition.scenes[bounded]);
    }

    function act(action: ExperienceAction) {
      if (action.assessmentIndex !== undefined) {
        runtime.recordDecision({
          id: assessmentIds[action.assessmentIndex],
          correct: action.correct,
          kind: action.assessmentIndex === 2 ? "recall" : "drill",
          category: definition.id,
          unsafe: action.unsafe,
        });
      }

      if (!action.correct) {
        if (action.mistake) {
          runtime.recordMistake(action.mistake, {
            activity: `${definition.id}-${action.id}`,
            hints: definition.hints,
          });
        }
        return false;
      }

      const isNew = !saved.completedActions.includes(action.id);
      const completedActions = isNew
        ? [...saved.completedActions, action.id]
        : saved.completedActions;
      const nextScene = action.nextScene ?? saved.scene;
      save({
        scene: nextScene,
        completedActions,
        points: saved.points + (isNew ? 10 : 0),
      });
      runtime.setCheckpoint(action.checkpoint ?? definition.scenes[nextScene] ?? action.id);
      return true;
    }

    function has(actionId: string) {
      return saved.completedActions.includes(actionId);
    }

    function showHint() {
      runtime.recordHint(definition.hints, `${definition.id}-${scene}`);
    }

    function finish() {
      runtime.completeLesson({
        title: definition.completionTitle,
        summary: definition.completionSummary,
      });
    }

    return { act, finish, has, setScene, showHint };
  }, [assessmentIds, definition, runtime, saved, scene, stateKey]);

  return {
    ...api,
    actions: saved.completedActions,
    points: saved.points,
    scene,
  };
}
