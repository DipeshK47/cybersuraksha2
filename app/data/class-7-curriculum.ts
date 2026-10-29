import type { GradeSubject } from './curriculum';
import { class7Chapters } from './class7';

export const class7Subjects: GradeSubject[] = [
  {
    "slug": "cybersecurity",
    "name": "Cybersecurity",
    "description": "Connect privacy clues, manage access, inspect web addresses and test recovery plans."
  },
  {
    "slug": "artificial-intelligence",
    "name": "Artificial Intelligence",
    "description": "Compare helpers, train a small model, inspect mistakes and check generated explanations."
  },
  {
    "slug": "computational-thinking-lab",
    "name": "Computational Thinking",
    "description": "Model relevant details, trace binary signals and loops, and test sorting, search and rover routes."
  },
  {
    "slug": "cyber-fraud",
    "name": "Cyber Fraud",
    "description": "Check identity, requested actions and recurring costs, then record facts and seek trusted support."
  }
].map(subject => ({ ...subject, strand: subject.name as GradeSubject['strand'], book: 'CyberShiksha Connection Lab · Class 7', chapters: [],
  modules: class7Chapters.filter(chapter => chapter.strand === subject.name).map(chapter => ({ title: chapter.title.en, strand: chapter.strand })),
}));
