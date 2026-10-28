import assert from 'node:assert/strict';
import test from 'node:test';
import { loadSource } from './class-10-helpers.mjs';

const { chapters, manualFrame } = await loadSource(`
  export { class10AiChapters as chapters } from './app/data/class10/ai';
  export { manualFrame } from './app/module/cyber/lessons/class10/motion-state';
`);
const chapter = suffix => chapters.find(c => c.slug === `class10-ai-${suffix}`);
const languages = ['en', 'hi'];
function endpoints(suffix, check) {
  const visual = chapter(suffix).visual, missing = [];
  for (const variant of visual.exploration.variants) {
    // Resolve directly, without visiting any previous scene or step.
    const frame = manualFrame(visual, variant.scene, variant.step);
    for (const language of languages) {
      const need = (id, ...patterns) => {
        const node = frame.nodes.find(n => n.id === id && !n.hidden);
        const text = node ? [node.label[language], node.value?.[language]].filter(Boolean).join(' ') : '';
        for (const pattern of patterns) if (!pattern.test(text)) missing.push(`${variant.id}/${language}/${id}: missing ${pattern}`);
      };
      check({ variant, frame, language, need, missing });
    }
  }
  assert.deepEqual(missing, []);
}

test('every baseline exploration retains card order, both predictions and checked targets', () => {
  endpoints('baseline-comparison', ({ variant, language, need }) => {
    need('pack', /A B C D E F/);
    need('purpose', language === 'en' ? /workshop/ : /कार्यशाला/);
    need('rule', language === 'en' ? /yes yes no no yes no/ : /हाँ हाँ नहीं नहीं हाँ नहीं/);
    need('model', language === 'en' ? /yes no yes no no no/ : /हाँ नहीं हाँ नहीं नहीं नहीं/);
    need('labels', language === 'en' ? /yes no yes no yes no/ : /हाँ नहीं हाँ नहीं हाँ नहीं/);
    need('errors', ...(variant.id === 'rule-errors' ? [/B/, /C/] : variant.id === 'model-errors' ? [/E/] : [/2/, /1/]));
  });
});

test('every window exploration shows the applicable input, arithmetic/output and boundary convention', () => {
  endpoints('moving-window', ({ variant, language, need, frame, missing }) => {
    const changed = variant.id === 'changed';
    need('image', /\[10,20,30\]/, changed ? /\[40,0,60\]/ : /\[40,50,60\]/, /\[70,80,90\]/);
    need('limit', /2×2/, /1/, language === 'en' ? /no padding/i : /बिना भराव/);
    if (variant.id === 'top-left') {
      need('window', /10 20 \/ 40 50/); need('sum', /10\+20\+40\+50\s*=\s*120/);
    } else if (variant.id === 'top-right') {
      need('window', /20 30 \/ 50 60/); need('sum', /20\+30\+50\+60\s*=\s*160/);
    } else {
      need('output', changed ? /\[70,110\].*\[190,230\]/ : /\[120,160\].*\[240,280\]/);
      need('rule', /≥200/, /3/, ...(changed ? [] : [/2/]));
    }
    if (changed) {
      need('pixel', /50\s*→\s*0/);
      if (!frame.nodes.some(n => n.id === 'pixel' && n.status === 'warning')) missing.push(`${variant.id}/${language}: changed input must be marked`);
      need('limit', language === 'en' ? /No object recognition/ : /वस्तु की पहचान/);
    }
  });
});

test('all English and Hindi word-order variants retain both sentences, fixed coordinates and equal vectors', () => {
  endpoints('word-count-vectors', ({ variant, language, need }) => {
    const hindi = variant.id.startsWith('hindi');
    need('sentence', hindi ? /अदिति ने विहान को बुलाया।/ : /Aditi helps Vihaan\./);
    need('reversed', hindi ? /विहान ने अदिति को बुलाया।/ : /Vihaan helps Aditi\./);
    need('vocabulary', hindi ? /\[अदिति,ने,विहान,को,बुलाया\]/ : /\[aditi,helps,vihaan\]/);
    need('counts', hindi ? /\[1,1,1,1,1\]/ : /\[1,1,1\]/, language === 'en' ? /Both/ : /दोनों/);
    need('roles', hindi ? /अदिति.*विहान/ : /Aditi.*Vihaan/);
    need('tokens', language === 'en' ? /split spaces/ : /स्पेस पर बाँटें/, language === 'en' ? /final/ : /अंतिम/);
    need('context', language === 'en' ? /order|roles/i : /क्रम|भूमिका/);
  });
});

test('normal, workload, changed and stopped model-card variants each retain their actual batch and limits', () => {
  endpoints('model-card-stop-rule', ({ variant, language, need, frame, missing }) => {
    const changed = ['changed', 'stopped'].includes(variant.id);
    need('validation', changed ? /3,5,6,20/ : /3,4,6,9/, language === 'en' ? (changed ? /Changed/i : /Normal/i) : (changed ? /बदला/ : /सामान्य/));
    need('training', /2/, /8/);
    need('model', language === 'en' ? (changed ? /review,abstain,pass,pass/ : /review,review,pass,pass/) : (changed ? /समीक्षा,बिना निर्णय,पास,पास/ : /समीक्षा,समीक्षा,पास,पास/));
    need('queue', /2/, language === 'en' ? /check|review/ : /जाँच|समीक्षा/);
    need('limits', /0–10/, /2/);
    need('purpose', language === 'en' ? /teacher/i : /टीचर/);
    if (changed) {
      need('limits', /20/, language === 'en' ? /outside/ : /बाहर/);
      need('queue', language === 'en' ? /abstention/ : /बिना निर्णय/);
      if (!frame.nodes.some(n => n.id === 'limits' && n.status === 'warning')) missing.push(`${variant.id}/${language}: range violation must be marked`);
    } else need('limits', /0/, language === 'en' ? /unused/ : /बची/);
    if (variant.id === 'stopped') {
      need('stop', language === 'en' ? /Whole batch paused for teacher/ : /पूरा बैच टीचर के लिए रुका/);
      if (!frame.nodes.some(n => n.id === 'stop' && n.status === 'warning')) missing.push(`${variant.id}/${language}: paused batch must be marked`);
    }
  });
});

test('recall has its own TP/FN state and F1 includes TP/FP/FN with the explicit denominator', () => {
  const visual = chapter('four-boxes').visual;
  assert.deepEqual(visual.exploration.variants.map(v => v.id), ['accuracy', 'precision', 'recall', 'f1']);
  assert.equal(visual.scenes[4].steps.length, 4);
  endpoints('four-boxes', ({ variant, frame, language, need, missing }) => {
    const expected = { accuracy:['tp','tn'], precision:['tp','fp'], recall:['tp','fn'], f1:['tp','fp','fn'] }[variant.id];
    const activeCounts = frame.nodes.filter(n => ['tp','fp','fn','tn'].includes(n.id) && !n.hidden && n.status === 'active').map(n => n.id).sort();
    if (JSON.stringify(activeCounts) !== JSON.stringify([...expected].sort())) missing.push(`${variant.id}/${language}: active counts ${activeCounts}`);
    for (const [id, count] of [['tp',6],['fp',2],['fn',2],['tn',10]]) need(id, new RegExp(`\\b${count}\\b`));
    need('metric', variant.id === 'accuracy' ? /16\/20.*80%/ : variant.id === 'f1' ? /2×6\/\(2×6\+2\+2\).*12\/16.*75%/ : /6\/8.*75%/);
    if (variant.id === 'f1') need('metric', /2TP\/\(2TP\+FP\+FN\)/);
    if (variant.id === 'recall') {
      need('metric', language === 'en' ? /Recall/i : /रिकॉल/);
      if (/F1/.test(frame.nodes.find(n => n.id === 'metric').value?.[language] ?? '')) missing.push(`recall/${language}: must not teach F1 with recall's count set`);
    }
  });
});
