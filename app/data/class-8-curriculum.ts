import type { GradeSubject } from "./curriculum";
import { class8Chapters } from "./class8";

export const class8Subjects: GradeSubject[] = [
  { slug: "cybersecurity", name: "Cybersecurity", description: "Protect a digital trail, account, shared device and class magazine with tested choices." },
  { slug: "artificial-intelligence", name: "Artificial Intelligence", description: "Explore examples, data, model mistakes and useful AI projects with people in charge." },
  { slug: "computational-thinking-lab", name: "Computational Thinking", description: "Build and test patterns, binary signals, logical rules, loops and practical algorithms." },
  { slug: "cyber-fraud", name: "Cyber Fraud", description: "Inspect offers, messages and payment claims, verify independently and get help calmly." },
].map(subject => ({ ...subject, strand: subject.name as GradeSubject["strand"], book: "CyberShiksha Future Lab · Class 8", chapters: [],
  modules: class8Chapters.filter(chapter => chapter.strand === subject.name).map(chapter => ({ title: chapter.title.en, strand: chapter.strand })),
}));
