const sorting = {
  src: "/cyber-missions/class-11/ai-sorting-lab.webp",
  alt: "Asha and Kabir compare paper, metal and plastic practice samples with a laptop classifier at a school festival workbench.",
  caption: "The team changes examples, checks predictions and keeps a person responsible for the result.",
};
const research = {
  src: "/cyber-missions/class-11/ai-source-desk.webp",
  alt: "Asha and Kabir compare a laptop assistant response with a printed memo, open reference book and source folder in the school library.",
  caption: "The actual source passage determines which assistant claims the team can support.",
};
const planning = {
  src: "/cyber-missions/class-11/festival-planning.webp",
  alt: "Two students plan a school festival using a laptop, notebooks and project folders.",
  caption: "Start with the task, the people using it and a testable definition of success.",
};
export const aiArtwork: Record<string, typeof sorting> = {
  "is-ai-needed-here": planning,
  "frame-a-useful-ai-problem": planning,
  "repair-the-dataset": sorting,
  "how-a-model-learns": sorting,
  "measure-mistakes-not-confidence": sorting,
  "whose-examples-are-missing": sorting,
  "can-this-assistant-be-trusted": research,
  "ai-evaluation-review": research,
};
