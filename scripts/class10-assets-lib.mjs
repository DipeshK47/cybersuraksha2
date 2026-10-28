import { expandSpeech } from './class9-assets-lib.mjs';

export function expandClass10Speech(text) {
  const pronunciation={TP:'T P',TN:'T N',FP:'F P',FN:'F N',NLP:'N L P',CNN:'C N N',RGB:'R G B',F1:'F one'};
  return expandSpeech(text).replace(/\b(TP|TN|FP|FN|NLP|CNN|RGB|F1)\b/g,word=>pronunciation[word]);
}
