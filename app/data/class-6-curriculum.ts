import type { GradeSubject } from './curriculum';
import { class6Chapters } from './class6';

export const class6Subjects: GradeSubject[] = [
  { slug: 'cybersecurity', name: 'Cybersecurity', description: 'Protect private information, accounts and shared devices with safe everyday choices.' },
  { slug: 'artificial-intelligence', name: 'Artificial Intelligence', description: 'Explore examples, predictions and mistakes, and keep people responsible for AI-assisted work.' },
  { slug: 'computational-thinking-lab', name: 'Computational Thinking', description: 'Break tasks into steps, explain patterns, test rules and debug routes through practical challenges.' },
  { slug: 'cyber-fraud', name: 'Cyber Fraud', description: 'Recognise reward traps, secret requests and pressure, then seek trusted help through known routes.' },
].map(subject => ({ ...subject, strand: subject.name as GradeSubject['strand'], book: 'CyberShiksha Discovery Club · Class 6', chapters: [],
  modules: class6Chapters.filter(chapter => chapter.strand === subject.name).map(chapter => ({ title: chapter.title.en, strand: chapter.strand })),
}));
