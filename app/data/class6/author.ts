import { l, type L, type LessonChapter, type LessonTask, type ChoiceTask, type TaskBase } from '../lesson-content';
export { l };

export const base = (prompt: L, context: L, success: L, hint: L): TaskBase => ({ prompt, context, success, hint, correction: hint });
export const choice = (b: TaskBase, options: [L, L][], correct: number): ChoiceTask => ({ ...b, kind: 'choice', options: options.map(([label, feedback], i) => ({ id: `option-${i}`, label, feedback })), correct: `option-${correct}` });
export const select = (b: TaskBase, items: [string, L, L][], expected: string[]): LessonTask => ({ ...b, kind: 'select', items: items.map(([id, label, feedback]) => ({ id, label, feedback })), expected });
export const match = (b: TaskBase, rows: [string, L, string, L][], options: [string, L][]): LessonTask => ({ ...b, kind: 'match', rows: rows.map(([id, label, answer, explanation]) => ({ id, label, answer, explanation })), options: options.map(([id, label]) => ({ id, label })) });
export const order = (b: TaskBase, items: [string, L][], expected: string[]): LessonTask => ({ ...b, kind: 'order', items: items.map(([id, label]) => ({ id, label })), expected });
export const numbers = (b: TaskBase, fields: [string, L, number, L][]): LessonTask => ({ ...b, kind: 'number', fields: fields.map(([id, label, answer, explanation]) => ({ id, label, answer, explanation, min: 0 })) });

type Draft = Omit<LessonChapter, 'scenes' | 'outcomes' | 'rubric'> & { story: [L, L, L]; outcomes: [L, L, L] };
/** The frame follows the existing six-scene story, decision and three-practical contract. */
export function chapter({ story, ...draft }: Draft): LessonChapter {
  const captions = [...story,
    l(`${draft.decision.context.en} Compare the actions, then inspect the explanation before moving on.`, `${draft.decision.context.hi} कदमों को मिलाएँ और आगे बढ़ने से पहले कारण पढ़ें।`),
    draft.decision.success,
    l(`Now open the practice lab. Work through ${draft.topics.map(t => t.en.toLowerCase()).join(', then ')}. Test each answer, read feedback and try again when needed. Save your evidence and explain one decision in your own words.`, `अब प्रैक्टिस लैब खोलें। पहले ${draft.topics[0].hi}, फिर ${draft.topics[1].hi} और ${draft.topics[2].hi} पर काम करें। जवाब जाँचें, कारण पढ़ें और ज़रूरत पर फिर कोशिश करें। अपनी जानकारी सेव करके एक फ़ैसला अपने शब्दों में समझाएँ।`),
  ];
  const labels = [l('The discovery club', 'डिस्कवरी क्लब'), l('A problem to solve', 'सुलझाने वाली समस्या'), l('Try the idea', 'विचार आज़माएँ'), l('Choose and explain', 'चुनें और समझाएँ'), l('See the consequence', 'नतीजा देखें'), l('Your turn in the lab', 'अब लैब में आपकी बारी')];
  return { ...draft, rubric: draft.outcomes, scenes: captions.map((caption, i) => ({ title: labels[i], caption, dialogue: i < 3 ? draft.topics[i] : i === 3 ? draft.decision.prompt : i === 4 ? draft.outcomes[1] : draft.reflection })) };
}
