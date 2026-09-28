import { getCyberLessonsForGrade } from "./cyber-lessons";
import { newMissions } from "./new-missions";

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
      book: `CyberSuraksha Interactive Curriculum · Class ${grade}`,
      chapters: [],
      modules: lessons
        .filter((lesson) => lesson.strand === strand)
        .map(({ title }) => ({ title, strand })),
      strand,
    }))
    .filter((subject) => subject.modules.length > 0);
};

export const curriculum: GradeCurriculum[] = [
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
      {
        slug: "english",
        name: "English",
        description:
          "Grammar from every chapter of Santoor — yesterday words, end marks, word pairs and more — taught with animations, games and exercises.",
        book: "NCERT Santoor — Textbook of English for Class 3",
        chapters: [
          { number: 1, title: "Colours", note: "Unit 1 · Fun with Friends · Poem" },
          {
            number: 2,
            title: "Badal and Moti",
            note: "Unit 1 · Fun with Friends · -ed words · ? and . · word pairs",
            href: "/module/badal-and-moti",
          },
          { number: 3, title: "Best Friends", note: "Unit 1 · Fun with Friends · Poem" },
          { number: 4, title: "Out in the Garden", note: "Unit 2 · Toys and Games" },
          { number: 5, title: "Talking Toys", note: "Unit 2 · Toys and Games" },
          { number: 6, title: "Paper Boats", note: "Unit 2 · Toys and Games · Poem" },
          { number: 7, title: "The Big Laddoo", note: "Unit 3 · Good Food" },
          { number: 8, title: "Thank God", note: "Unit 3 · Good Food · Poem" },
          { number: 9, title: "Madhu’s Wish", note: "Unit 3 · Good Food" },
          { number: 10, title: "Night", note: "Unit 4 · The Sky · Poem" },
          { number: 11, title: "Chanda Mama Counts the Stars", note: "Unit 4 · The Sky" },
          { number: 12, title: "Chandrayaan", note: "Unit 4 · The Sky" },
        ],
      },
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
    grade: 10,
    title: "Board Scholars",
    description:
      "Mathematics and English, chapter by chapter, straight from the NCERT Class X books.",
    tone: "lime",
    modules: [],
    subjects: [
      {
        slug: "mathematics",
        name: "Mathematics",
        description:
          "Number systems, algebra, geometry, trigonometry, mensuration, statistics and probability.",
        book: "NCERT Mathematics — Textbook for Class X",
        chapters: [
          { number: 1, title: "Real Numbers" },
          { number: 2, title: "Polynomials" },
          { number: 3, title: "Pair of Linear Equations in Two Variables" },
          { number: 4, title: "Quadratic Equations" },
          { number: 5, title: "Arithmetic Progressions" },
          { number: 6, title: "Triangles" },
          { number: 7, title: "Coordinate Geometry" },
          {
            number: 8,
            title: "Introduction to Trigonometry",
            slug: "introduction-to-trigonometry",
            video: "/videos/lesson-8-2-final.mp4",
            poster: "/videos/lesson-8-2-poster.png",
            duration: "5:56",
            // `at` values come from timing.json — the narration beat starts.
            topics: [
              {
                short: "Why", title: "Why trigonometry exists", section: "8.1",
                video: "/videos/lesson-8-1-why.mp4",
                poster: "/videos/lesson-8-1-why-poster.png",
                panel: "why",
              },
              {
                short: "Hidden", title: "The hidden right triangle", section: "8.1",
                video: "/videos/lesson-8-1-hidden.mp4",
                poster: "/videos/lesson-8-1-hidden-poster.png",
                panel: "hidden",
              },
              { short: "Naming", title: "Naming the three sides", section: "8.2", at: 73, panel: "naming" },
              { short: "Swap", title: "Why the names swap with the angle", section: "8.2", at: 108, panel: "swap" },
              { short: "Ratios", title: "The three ratios · SOH CAH TOA", section: "8.2", at: 138, panel: "ratios" },
              { short: "Size", title: "Why size never changes a ratio", section: "8.2", at: 178, panel: "size" },
              { short: "Flip", title: "cosec, sec, cot — the other three", section: "8.2", at: 225, panel: "recip" },
              { short: "Numbers", title: "Real numbers on a 3-4-5 triangle", section: "8.2", at: 263, panel: "numbers" },
              { short: "One→Six", title: "Know one ratio, find all six", section: "8.2", at: 290, panel: "kmethod" },
              { short: "Limits", title: "sin A ≤ 1, and what tan can do", section: "8.2", at: 310, panel: "limits" },
              { short: "Recap", title: "Three things to keep", section: "8.2", at: 334, panel: "recap" },
              {
                short: "45°", title: "Ratios of 45°", section: "8.3",
                video: "/videos/lesson-8-3-45.mp4",
                poster: "/videos/lesson-8-3-45-poster.png",
                duration: "3:50",
                panel: "ratios45",
              },
              {
                short: "30/60", title: "Ratios of 30° and 60°", section: "8.3",
                video: "/videos/lesson-8-3-30-60.mp4",
                poster: "/videos/lesson-8-3-30-60-poster.png",
                duration: "3:50",
                panel: "ratios3060",
              },
              {
                short: "0/90", title: "Ratios of 0° and 90°", section: "8.3",
                video: "/videos/lesson-8-3-0-90.mp4",
                poster: "/videos/lesson-8-3-0-90-poster.png",
                duration: "1:52",
                panel: "ratios0090",
              },
              {
                short: "Table", title: "Table 8.1 — the values to know cold", section: "8.3",
                video: "/videos/lesson-8-3-table.mp4",
                poster: "/videos/lesson-8-3-table-poster.png",
                duration: "1:40",
                panel: "table81",
              },
              {
                short: "Identity", title: "The three identities", section: "8.4",
                video: "/videos/lesson-8-4-identities.mp4",
                poster: "/videos/lesson-8-4-identities-poster.png",
                duration: "1:43",
                panel: "identity",
              },
              {
                short: "Proving", title: "Proving an identity", section: "8.4",
                video: "/videos/lesson-8-4-proving.mp4",
                poster: "/videos/lesson-8-4-proving-poster.png",
                duration: "1:51",
                panel: "proving",
              },
              {
                short: "Summary", title: "Chapter summary", section: "8.5",
                video: "/videos/lesson-8-summary.mp4",
                poster: "/videos/lesson-8-summary-poster.png",
                duration: "1:55",
                panel: "summary",
              },
            ],
          },
          { number: 9, title: "Some Applications of Trigonometry" },
          { number: 10, title: "Circles" },
          { number: 11, title: "Areas Related to Circles" },
          { number: 12, title: "Surface Areas and Volumes" },
          { number: 13, title: "Statistics" },
          { number: 14, title: "Probability" },
        ],
      },
      {
        slug: "english",
        name: "English",
        description:
          "Prose, drama and the poems printed alongside each chapter of First Flight.",
        book: "NCERT First Flight — Textbook in English for Class X",
        chapters: [
          {
            number: 1,
            title: "A Letter to God",
            note: "Poems · Dust of Snow · Fire and Ice",
            slug: "a-letter-to-god",
            video: "/videos/a-letter-to-god.mp4",
            poster: "/videos/a-letter-to-god-poster.jpg",
            duration: "20:49",
            topics: [
              {
                short: "Film lesson",
                title: "A Letter to God — complete chapter lesson",
                section: "1.1",
                at: 0,
              },
            ],
          },
          {
            number: 2,
            title: "Nelson Mandela: Long Walk to Freedom",
            note: "Poem · A Tiger in the Zoo",
          },
          {
            number: 3,
            title: "Two Stories about Flying",
            note: "I. His First Flight · II. Black Aeroplane — Poems · How to Tell Wild Animals · The Ball Poem",
          },
          {
            number: 4,
            title: "From the Diary of Anne Frank",
            note: "Poem · Amanda!",
          },
          {
            number: 5,
            title: "Glimpses of India",
            note: "I. A Baker from Goa · II. Coorg · III. Tea from Assam — Poem · The Trees",
          },
          { number: 6, title: "Mijbil the Otter", note: "Poem · Fog" },
          {
            number: 7,
            title: "Madam Rides the Bus",
            note: "Poem · The Tale of Custard the Dragon",
          },
          {
            number: 8,
            title: "The Sermon at Benares",
            note: "Poem · For Anne Gregory",
          },
          { number: 9, title: "The Proposal", note: "One-act play" },
        ],
      },
    ],
  },
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
