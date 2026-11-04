/** Every class the product has content for. */
export const schoolGrades = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
/**
 * Classes switched off for every school and every user, whatever a school's own settings say.
 * Nothing is removed: the lessons, chapters, class records and student progress all stay in place.
 * To bring a class back, delete its number from this list and deploy.
 */
export const platformDisabledGrades: readonly number[] = [3, 4, 5];
/** The classes a school can actually enable in its settings. */
export const availableSchoolGrades = schoolGrades.filter(grade => !platformDisabledGrades.includes(grade));
export const schoolSubjects = ["Computational Thinking", "Artificial Intelligence", "Cybersecurity", "Cyber Fraud"];
export type ContentAccess = { schoolName: string; grades: number[]; subjects: string[] };

export function permitsModule(access: ContentAccess, module: { grades: readonly number[]; strand: string }) {
  return module.grades.some(grade => access.grades.includes(grade)) && access.subjects.includes(module.strand);
}

export function permitsSubject(access: ContentAccess, subject: { strand?: string; name: string }) {
  return access.subjects.includes(subject.strand ?? subject.name);
}
