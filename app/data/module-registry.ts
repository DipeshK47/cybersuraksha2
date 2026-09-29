import type { CurriculumStrand } from "./curriculum";
import { cyberLessons } from "./cyber-lessons";
import { newMissions } from "./new-missions";

export type PlayableModule = {
  id: string;
  title: string;
  grades: readonly number[];
  strand: CurriculumStrand;
  href: string;
};

/**
 * The single integration point for interactive modules.
 *
 * Adding a finished module here makes it discoverable by the class library,
 * dashboard continuation links, and completion API without hard-coding routes
 * across the academy.
 */
export const playableModules: PlayableModule[] = [
  {
    id: "grade-3-secret-message-rescue",
    title: "Secret Message Rescue",
    grades: [3],
    strand: "Computational Thinking",
    href: "/module/secret-message-rescue",
  },
  {
    id: "grade-3-toy-workshop",
    title: "Toy Workshop",
    grades: [3],
    strand: "Computational Thinking",
    href: "/module/toy-workshop",
  },
  {
    id: "grade-3-double-century-vault",
    title: "Double Century Vault",
    grades: [3],
    strand: "Computational Thinking",
    href: "/module/double-century-vault",
  },
  {
    id: "grade-3-nani-maa-vacation-challenge",
    title: "Nani Maa’s Vacation Challenge",
    grades: [3],
    strand: "Computational Thinking",
    href: "/module/nani-maa-vacation-challenge",
  },
  {
    id: "grade-3-english-badal-and-moti",
    title: "Badal and Moti",
    grades: [3],
    strand: "English",
    href: "/module/badal-and-moti",
  },
  ...cyberLessons.map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    grades: lesson.grades,
    strand: lesson.strand,
    href: `/module/cyber/${lesson.slug}`,
  })),
];

/** The current story chapters, using the same identities and routes as the class library. */
export const assignmentChapters = playableModules.filter(module => newMissions.some(chapter => chapter.id === module.id));

export function getPlayableModule(grade: number, title: string) {
  return playableModules.find(
    (module) => module.grades.includes(grade) && module.title === title,
  );
}

export function getPlayableModuleById(id: string) {
  return playableModules.find((module) => module.id === id);
}
