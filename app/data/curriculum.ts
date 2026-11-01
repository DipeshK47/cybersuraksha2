import { getCyberLessonsForGrade } from "./cyber-lessons";
import { newMissions } from "./new-missions";
import { class12Subjects } from "./class-12-curriculum";
import { class11Subjects } from "./class-11-curriculum";
import { class8Subjects } from "./class-8-curriculum";
import { class9Subjects } from "./class-9-curriculum";
import { class10Subjects } from "./class-10-curriculum";
import { class6Subjects } from "./class-6-curriculum";
import { class7Subjects } from "./class-7-curriculum";

export type CurriculumStrand =
  | "Computational Thinking"
  | "Artificial Intelligence"
  | "Cybersecurity"
  | "Cyber Fraud"
  | "English";

export type CurriculumModule = {
  title: string;
  strand: CurriculumStrand;
};

/**
 * One teachable idea inside a chapter — a rail entry on the lesson page.
 * `at` is the second in the chapter video where this topic is taught. A topic
 * can also be taught by its own video or an interactive panel.
 */
export type ChapterTopic = {
  short: string;
  title: string;
  section: string;
  at?: number;
  /**
   * This topic's own lesson video. Each topic is taught from scratch in its own
   * video; until one is recorded a topic falls back to the chapter video and
   * uses `at` to seek into it.
   */
  video?: string;
  poster?: string;
  /** Display length for this topic's own video, for example `3:50`. */
  duration?: string;
  /** Key into TOPIC_PANELS — present once the topic has interactive teaching. */
  panel?: string;
};

/**
 * A chapter in a subject textbook. Senior classes are organised by subject and
 * chapter rather than by CT/AI mission, so they use this shape instead of
 * `CurriculumModule`.
 */
export type SubjectChapter = {
  number: number;
  title: string;
  /** Poems or roman-numeral sub-parts printed with the chapter in the book. */
  note?: string;
  /** Present once the chapter has a lesson page; also its URL segment. */
  slug?: string;
  /**
   * Route of an interactive lesson built as a Class 3 style module
   * (animation → activity → exercise) rather than as a film. A chapter with
   * one is playable without a video.
   */
  href?: string;
  /** Narrated lesson video under /public. A chapter with one is playable. */
  video?: string;
  /** Still image shown before the chapter video starts. */
  poster?: string;
  /** Runtime, for the card. */
  duration?: string;
  /** Every topic in the chapter, taught or not — drives the lesson rail. */
  topics?: ChapterTopic[];
};

export type GradeSubject = {
  slug: string;
  name: string;
  description: string;
  /** Textbook or curriculum source shown above the subject library. */
  book: string;
  chapters: SubjectChapter[];
  modules?: CurriculumModule[];
  strand?: CurriculumStrand;
};

export type GradeCurriculum = {
  grade: number;
  title: string;
  description: string;
  tone: string;
  modules: CurriculumModule[];
  /**
   * Subject libraries contain either textbook chapters or interactive lessons.
   * A grade can carry both subject libraries and its existing CT/AI modules.
   */
  subjects?: GradeSubject[];
};

const ct = (title: string): CurriculumModule => ({
  title,
  strand: "Computational Thinking",
});

const ai = (title: string): CurriculumModule => ({
  title,
  strand: "Artificial Intelligence",
});

const cyberSubjectDetails: Array<{
  slug: string;
  strand: Extract<
    CurriculumStrand,
    "Artificial Intelligence" | "Cybersecurity" | "Computational Thinking" | "Cyber Fraud"
  >;
  description: string;
}> = [
  {
    slug: "cybersecurity",
    strand: "Cybersecurity",
    description:
      "Practise safe choices for games, messages, accounts, photos, and websites through interactive missions.",
  },
  {
    slug: "artificial-intelligence",
    strand: "Artificial Intelligence",
    description:
      "Explore how smart tools learn, make suggestions, and still need careful human thinking.",
  },
  {
    slug: "computational-thinking-lab",
    strand: "Computational Thinking",
    description:
      "Build, run, and improve patterns, procedures, flowcharts, and algorithms through hands-on missions.",
  },
  {
    slug: "cyber-fraud",
    strand: "Cyber Fraud",
    description:
      "Spot suspicious offers, payment tricks, impersonation, and pressure before acting.",
  },
];

const cyberSubjectsForGrade = (grade: number): GradeSubject[] => {
  const curriculumSlugs = new Set(newMissions.map((mission) => mission.slug));
  const lessons = getCyberLessonsForGrade(grade).filter((lesson) => curriculumSlugs.has(lesson.slug));

  return cyberSubjectDetails
    .map(({ slug, strand, description }) => ({
      slug,
      name: strand,
      description,
      book: `CyberShiksha Interactive Curriculum · Class ${grade}`,
      chapters: [],
      modules: lessons
        .filter((lesson) => lesson.strand === strand)
        .map(({ title }) => ({ title, strand })),
      strand,
    }))
    .filter((subject) => subject.modules.length > 0);
};

const sourceCurriculum: GradeCurriculum[] = [
  {
    grade: 3,
    title: "Logic Explorers",
    description:
      "Play through four modules on digital safety, smart machines, problem solving, and scam awareness.",
    tone: "mint",
    modules: [
      ct("Secret Message Rescue"),
      ct("Toy Workshop"),
      ct("Double Century Vault"),
      ct("Nani Maa’s Vacation Challenge"),
      ct("Shape Forge"),
      ct("House of Hundreds I"),
      ct("Raksha Bandhan Factory"),
      ct("Fair Share Café"),
      ct("House of Hundreds II"),
      ct("Class Party Planner"),
      ct("Filling and Lifting Lab"),
      ct("Give and Take Market"),
      ct("Time Travel Calendar"),
      ct("Surajkund Mirror Maze"),
    ],
    subjects: [
      ...cyberSubjectsForGrade(3),
    ],
  },
  {
    grade: 4,
    title: "Pattern Detectives",
    description:
      "Protect private information, train simple machines, solve patterns, and practise safe responses.",
    tone: "cyan",
    modules: [
      ct("Cube Detective"),
      ct("Hide and Seek 3D"),
      ct("Coin Flip Magic"),
      ct("Sorting Network Race"),
      ct("Share and Measure Kitchen"),
      ct("Path Planner"),
      ct("Clean Village Strategy"),
      ct("Weigh It, Pour It"),
      ct("Equal Groups Factory"),
      ct("Animal Digit Code"),
      ct("Symmetry Studio"),
      ct("Clock and Calendar Escape"),
      ct("Transport Museum Logic"),
      ct("Data Detective"),
    ],
    subjects: cyberSubjectsForGrade(4),
  },
  {
    grade: 5,
    title: "Puzzle Engineers",
    description:
      "Investigate passwords, app permissions, AI training data, logic, and online fraud through play.",
    tone: "amber",
    modules: [
      ct("Travel Number Passport"),
      ct("Fraction Feast"),
      ct("Robot Turn Commander"),
      ct("Traveller Coin Code"),
      ct("Distance Quest"),
      ct("Dairy Farm Array Planner"),
      ct("Shape Pattern Workshop"),
      ct("Find the Fake Weight"),
      ct("Coconut Remainder Farm"),
      ct("Symmetrical Designer"),
      ct("Quilt Architect"),
      ct("Racing Seconds"),
      ct("Animal Jump Divisibility"),
      ct("Map Navigator"),
      ct("Picture Data City"),
    ],
    subjects: cyberSubjectsForGrade(5),
  },
  {
    grade: 6,
    title: "Codebreakers & AI Scouts",
    description:
      "Investigate public identity, suspicious media, algorithms, and pressure scams in interactive labs.",
    tone: "violet",
    modules: [
      ct("Pattern Observatory"),
      ct("Angle Mission Control"),
      ct("Number Logic Arena"),
      ct("Data Dashboard"),
      ct("Prime Time Star Maker"),
      ct("Area and Perimeter Builder"),
      ct("Fraction Case Files"),
      ct("Construction Grid"),
      ct("Symmetry Laboratory"),
      ct("Below Zero Expedition"),
      ai("AI or Automation?"),
      ai("Data Sorting Station"),
      ai("Pattern to Decision Lab"),
      ai("Digital Responsibility Case Files"),
    ],
    subjects: cyberSubjectsForGrade(6),
  },
  {
    grade: 7,
    title: "Data Investigators",
    description:
      "Test evidence, challenge recommendation systems, optimize algorithms, and verify urgent claims.",
    tone: "coral",
    modules: [
      ct("Large Number Control Room"),
      ct("Expression Factory"),
      ct("Binary Punched Cards"),
      ct("Letter-Number Decoder"),
      ct("Parallel City"),
      ct("RGB Logic Cards"),
      ct("Triangle Evidence Lab"),
      ct("Fraction Transit"),
      ai("AI Domain Dispatcher"),
      ai("AI Industry Command Centre"),
      ai("Data Visualization Detective"),
      ai("Bias and Fairness Tribunal"),
    ],
    subjects: cyberSubjectsForGrade(7),
  },
  {
    grade: 8,
    title: "AI Builders",
    description:
      "Number systems, proportional reasoning, the AI project cycle, classifiers, and responsible AI.",
    tone: "blue",
    modules: [
      ct("Square and Cube Laboratory"),
      ct("Power Grid"),
      ct("Number Systems Height Lab"),
      ct("Quadrilateral Family Tree"),
      ct("Divisibility Switchboard"),
      ct("Distribution Machine"),
      ct("Proportional Mixing Lab"),
      ai("AI Project Cycle Studio"),
      ai("AI for the World"),
      ai("Fair Classifier"),
      ai("Responsible AI Council"),
    ],
  },
  {
    grade: 11,
    title: "Digital Decision Makers",
    description: "Investigate risks, evaluate AI, test algorithms and verify suspicious requests through four practical modules.",
    tone: "mint",
    modules: [],
    subjects: class11Subjects,
  },
  {
    grade: 12,
    title: "Evidence, Systems and Responsibility",
    description: "Design safer services, evaluate AI evidence, build reliable workflows and respond to complex fraud through four practical modules.",
    tone: "mint",
    modules: [],
    subjects: class12Subjects,
  },
];

// Reuse the existing Classes 3–7 sequence for delivery in Classes 6–10.
export const curriculum: GradeCurriculum[] = [
  ...sourceCurriculum.filter(entry => entry.grade >= 3 && entry.grade <= 5),
  ...sourceCurriculum
    .filter((entry) => entry.grade >= 3 && entry.grade <= 7)
    .map((entry) => {
      const grade = entry.grade + 3;
      if (grade === 6) return { ...entry, grade, title: "Discovery Club", description: "Build safe digital habits and solve everyday problems through 32 original chapters.", modules: [], subjects: class6Subjects };
      if (grade === 7) return { ...entry, grade, title: "Connection Lab", description: "Connect ideas, test evidence and explain decisions through 32 original chapters.", modules: [], subjects: class7Subjects };
      if (grade === 8) return { ...entry, grade, title: "Future Lab", description: "Build useful skills through 32 original chapters in computing, AI, cybersecurity and fraud awareness.", modules: [], subjects: class8Subjects };
      if (grade === 9) return { ...entry, grade, title: "Signal Studio", description: "Test systems, explain decisions and recognise pressure through 32 original chapters.", modules: [], subjects: class9Subjects };
      if (grade === 10) return { ...entry, grade, title: "Decision Lab", description: "Compare alternatives, explain consequences and defend decisions through 32 original chapters.", modules: [], subjects: class10Subjects };
      return {
        ...entry,
        grade,
        modules: [],
        subjects: cyberSubjectsForGrade(grade),
      };
    }),
  ...sourceCurriculum.filter((entry) => entry.grade >= 11),
];

export function getGradeCurriculum(grade: number) {
  return curriculum.find((entry) => entry.grade === grade);
}

export function getGradeSubject(grade: number, slug: string) {
  return getGradeCurriculum(grade)?.subjects?.find(
    (subject) => subject.slug === slug,
  );
}

export function getSubjectChapter(
  grade: number,
  subjectSlug: string,
  chapterSlug: string,
) {
  const subject = getGradeSubject(grade, subjectSlug);
  const chapter = subject?.chapters.find((c) => c.slug === chapterSlug);
  return subject && chapter ? { subject, chapter } : null;
}

/** Chapters across every subject of a grade — 0 for the CT/AI classes. */
export function chapterCount(entry: GradeCurriculum) {
  return (
    entry.subjects?.reduce((total, subject) => total + subject.chapters.length, 0) ??
    0
  );
}

export function subjectModuleCount(entry: GradeCurriculum) {
  return (
    entry.subjects?.reduce(
      (total, subject) => total + (subject.modules?.length ?? 0),
      0,
    ) ?? 0
  );
}

export const moduleCount = curriculum.reduce(
  (total, grade) =>
    total + grade.modules.length + subjectModuleCount(grade) + chapterCount(grade),
  0,
);
