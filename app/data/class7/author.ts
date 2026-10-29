import { l, type L, type LessonChapter, type ChoiceTask, type MatchTask, type TaskBase } from '../lesson-content';
import { match as plainMatch } from '../class6/author';
export { l, base, choice, select, match, order, numbers } from '../class6/author';

export function permissions(b: TaskBase, rows: Parameters<typeof plainMatch>[1], options: Parameters<typeof plainMatch>[2], simulation: NonNullable<MatchTask['simulation']>): MatchTask {
  return { ...(plainMatch(b, rows, options) as MatchTask), presentation: 'permissions', simulation };
}

type Draft = Omit<LessonChapter, 'scenes' | 'rubric'> & { story: [L, L, L]; decision: ChoiceTask };
export function chapter({ story, ...draft }: Draft): LessonChapter {
  const captions = [...story,
    l(`${draft.decision.context.en} Compare the actions, then explain which evidence supports your decision.`, `${draft.decision.context.hi} कदमों को मिलाएँ और बताएँ कि कौन सी जानकारी आपके फ़ैसले का समर्थन करती है।`),
    draft.decision.success,
    l(`Investigate ${draft.topics.map(t => t.en.toLowerCase()).join(', then ')}. Test your plan, read feedback and try a changed case. Save evidence; explain one limitation.`, `${draft.topics[0].hi}, फिर ${draft.topics[1].hi} और ${draft.topics[2].hi} जाँचें। प्लान टेस्ट करें, कारण पढ़ें और बदला मामला आज़माएँ। जानकारी सेव करें और एक सीमा समझाएँ।`),
  ];
  const labels = [l('The Connection Lab','कनेक्शन लैब'),l('What changed?','क्या बदला?'),l('Follow the evidence','जानकारी से समझें'),l('Decide and explain','फ़ैसला करें और समझाएँ'),l('Check the consequence','नतीजा जाँचें'),l('Investigate in the lab','लैब में जाँचें')];
  return { ...draft, rubric: draft.outcomes, scenes: captions.map((caption,index) => ({ title: labels[index], caption, dialogue: index<3 ? draft.topics[index] : index===3 ? draft.decision.prompt : index===4 ? draft.outcomes[1] : draft.reflection })) };
}
