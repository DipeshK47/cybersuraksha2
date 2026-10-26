export const schoolGrades = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export const schoolSubjects = ["Computational Thinking", "Artificial Intelligence", "Cybersecurity", "Cyber Fraud", "English", "Mathematics"];
export type ContentAccess = { schoolName: string; grades: number[]; subjects: string[] };

export function permitsModule(access: ContentAccess, module: { grades: readonly number[]; strand: string }) {
  return module.grades.some(grade => access.grades.includes(grade)) && access.subjects.includes(module.strand);
}

export function permitsSubject(access: ContentAccess, subject: { strand?: string; name: string }) {
  return access.subjects.includes(subject.strand ?? subject.name);
}
