import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import { createHindiTranslator } from '../app/lib/i18n/translate.ts';
import { class11Missions } from '../app/data/class-11-missions.ts';
import { class12Missions } from '../app/data/class-12-missions.ts';

const catalogue = JSON.parse(await readFile(new URL('../public/locales/hi.json', import.meta.url), 'utf8'));
const overrides = JSON.parse(await readFile(new URL('../app/lib/i18n/hi-overrides.json', import.meta.url), 'utf8'));
const translate = createHindiTranslator(catalogue, overrides);
const normalize = text => text.replace(/\s+/g, ' ').trim();

test('Hindi site copy keeps the CyberShiksha brand name', () => {
  for (const source of ['CyberShiksha', '© CyberShiksha', '← Back to CyberShiksha', 'Return to CyberShiksha']) {
    assert.ok(translate(source).includes('CyberShiksha'), source);
  }
});

test('Hindi catalogue has complete nonempty static text and preserves every template slot', () => {
  assert.ok(Object.keys(catalogue.messages).length >= 15000);
  for (const [source, translation] of Object.entries(catalogue.messages)) {
    assert.ok(translation.trim(), source);
    assert.deepEqual((source.match(/\{\{\d+\}\}/g) ?? []).sort(), (translation.match(/\{\{\d+\}\}/g) ?? []).sort(), source);
    assert.deepEqual((source.match(/\d+(?:[.,:]\d+)*/g) ?? []).sort(), (translation.match(/\d+(?:[.,:]\d+)*/g) ?? []).sort(), `Preserve every number: ${source}`);
  }
});

test('current authored source copy, including JSX feedback props and callback text, is covered', async () => {
  execFileSync(process.execPath,['scripts/extract-language-catalogue.cjs'],{cwd:new URL('../',import.meta.url),stdio:'pipe'});
  const source = JSON.parse(await readFile(new URL('../tmp/i18n/catalogue.json',import.meta.url),'utf8'));
  const missing = source.messages.filter(message => !catalogue.messages[message] && !overrides[message]);
  assert.deepEqual(missing,[]);
});

test('every narrated chapter caption, dialogue and status has a local Hindi translation', async () => {
  const directory = new URL('../app/module/cyber/lessons/new/story/chapters/', import.meta.url);
  let scenes = 0;
  for (const file of (await readdir(directory)).filter(file => file.endsWith('.json'))) {
    const script = JSON.parse(await readFile(new URL(file, directory), 'utf8'));
    for (const scene of script.scenes) {
      for (const field of ['caption', 'dialogue', 'status', 'title', 'label']) {
        const source = normalize(scene[field]);
        if (/[A-Za-z]{2}/.test(source)) assert.ok(catalogue.messages[source] || overrides[source], `${file}: ${field}: ${source}`);
      }
      scenes++;
    }
  }
  assert.ok(scenes >= 384);
});

test('all senior chapter titles and summaries switch to Hindi without changing lesson IDs', () => {
  for (const lesson of [...class11Missions, ...class12Missions]) {
    assert.match(translate(lesson.title), /[\u0900-\u097f]/u);
    assert.match(translate(lesson.summary), /[\u0900-\u097f]/u);
    assert.equal(translate(lesson.id), lesson.id);
  }
});

test('translations preserve whitespace and translate dynamic class/step labels', () => {
  assert.equal(translate('  Class  '), '  क्लास  ');
  assert.equal(translate('Class 12'), 'क्लास 12');
  assert.ok(translate('Scene 3 of 6').includes('3') && translate('Scene 3 of 6').includes('6'));
  assert.match(translate('Scene 3 of 6'), /सीन/);
  assert.equal(translate('DEMO-CF-031'), 'DEMO-CF-031');
  assert.equal(translate('1930'), '1930');
  assert.equal(translate('W25'),'सप्ताह 25');
  assert.equal(translate('William'),'William');
  const composite = translate('Class 11 · Festival team security lab · Challenge 1 of 3');
  assert.ok(composite.includes('3 में से चैलेंज 1'));
  assert.doesNotMatch(composite,/[A-Za-z]{3}/);
  for (const text of ['cyberpurschool.example','help@school.example','Registrations.csv','Rocket482?','Rohan123','sin','log']) assert.equal(translate(text),text);
  assert.doesNotMatch(translate('Risk chain: registration list → unauthorised download → public link weakness → named-access control.'),/[A-Za-z]{3}/);
});

test('Hindi uses familiar subject terms in Devanagari with Hindi sentences', async () => {
  for (const [source, expected] of Object.entries({
    Asset: 'एसेट', Assets: 'एसेट्स', Distribution: 'डिस्ट्रिब्यूशन',
    Authentication: 'ऑथेंटिकेशन', Authorisation: 'ऑथराइज़ेशन',
    Confidentiality: 'कॉन्फिडेंशियलिटी', Integrity: 'इंटेग्रिटी', Availability: 'अवेलेबिलिटी',
    Cybersecurity: 'साइबर सिक्योरिटी', 'Artificial Intelligence': 'आर्टिफिशियल इंटेलिजेंस',
    'Computational Thinking': 'कम्प्यूटेशनल थिंकिंग', 'Your digital risk map': 'आपका डिजिटल रिस्क मैप',
    'Distribution Machine': 'डिस्ट्रिब्यूशन मशीन', 'Check my map': 'मेरा मैप चेक करें',
    'How a school comes on board': 'स्कूल कैसे जुड़ सकता है',
  })) assert.equal(translate(source), expected, source);
  const script = JSON.parse(await readFile(new URL('../app/module/cyber/lessons/new/story/chapters/your-digital-risk-map.json', import.meta.url)));
  const caption = translate(script.scenes[2].caption);
  for (const term of ['एसेट', 'थ्रेट', 'वल्नरेबिलिटी', 'कंट्रोल', 'रजिस्ट्रेशन लिस्ट']) assert.ok(caption.includes(term), term);
  assert.match(caption, /एक एसेट है/);
  assert.doesNotMatch(caption, /[A-Za-z]|संपत्ति|भेद्यता|प्राधिकरण/);
});

test('Hindi handbook search returns Hindi source excerpts within the selected class', async () => {
  const file = new URL('../app/lib/handbook-search.ts',import.meta.url);
  const source = await readFile(file,'utf8');
  const compiled = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const exports = {};
  new Function('require','exports',compiled)(createRequire(file),exports);
  const hindi = exports.searchStudentHandbooks('पैटर्न',3,5,'hi');
  assert.ok(hindi.length > 0);
  for (const source of hindi) { assert.equal(source.grade,3); assert.match(source.excerpt,/[\u0900-\u097f]/); }
  const english = exports.searchStudentHandbooks('pattern',3,5);
  assert.ok(english.length > 0);assert.match(english[0].excerpt,/[A-Za-z]{3}/);
});

test('template translation can reorder slots, recursively translate values and preserve variable IDs', () => {
  const t = createHindiTranslator({messages: { 'Ready': 'तैयार' }, templates: [
    {source: 'Class {{0}}: {{1}}',parts:['Class ',': ',''],translation:'{{1}} — कक्षा {{0}}'},
    {source: 'Reference {{0}} saved.',parts:['Reference ',' saved.'],translation:'संदर्भ {{0}} सहेजा गया।'},
  ]});
  assert.equal(t('Class 12: Ready'), 'तैयार — कक्षा 12');
  assert.equal(t('Reference DEMO-CF-031 saved.'), 'संदर्भ DEMO-CF-031 सहेजा गया।');
  assert.equal(t('Reference <img onerror=alert(1)> saved.'), 'संदर्भ <img onerror=alert(1)> सहेजा गया।');
});

test('a near-matching long template has bounded work and never executes source expressions', () => {
  const started = performance.now();
  const text = 'Class ' + 'A: '.repeat(10000) + 'not a class report';
  const output = translate(text);
  assert.ok(output.includes('not') || /[\u0900-\u097f]/u.test(output));
  assert.ok(performance.now() - started < 3000);
});

test('language preference is local, with self-hosted Hindi font and no runtime translation provider', async () => {
  const [toggle, localizer, css] = await Promise.all([
    readFile(new URL('../app/components/LanguageToggle.tsx',import.meta.url),'utf8'),
    readFile(new URL('../app/lib/i18n/localize-dom.ts',import.meta.url),'utf8'),
    readFile(new URL('../app/hindi.css',import.meta.url),'utf8'),
  ]);
  assert.match(toggle,/fetch\('\/locales\/hi\.json'\)/);
  assert.match(toggle,/localStorage\.setItem/);
  assert.doesNotMatch(toggle+localizer,/translate\.google|googleapis|api-key|innerHTML/);
  assert.match(css,/public|\/fonts\/hindi/);
});
