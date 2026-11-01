/** Export the existing Classes 6–10 stories as conversational Hindi recording copy. */
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const grades = [6, 7, 8, 9, 10];
const normalize = text => text.replace(/\s+/g, ' ').trim();
const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const numberTokens = text => (text.match(/\d+(?:\.\d+)*/g) ?? []).sort();
const baseRules = JSON.parse(await readFile(join(root, 'app/lib/i18n/hi-terms.json'), 'utf8'));
const voiceRules = JSON.parse(await readFile(join(root, 'scripts/hindi-narration-style.json'), 'utf8'));
const edits = JSON.parse(await readFile(join(root, 'scripts/hindi-narration-edits.json'), 'utf8'));
const rules = [...baseRules, ...voiceRules].map(rule => ({
  source: rule.english ? new RegExp(`\\b(?:${rule.english})\\b`, 'i') : null,
  pattern: new RegExp(`(?<![\\p{L}\\p{M}\\p{N}_])(?:${Object.keys(rule.forms).sort((a,b) => b.length-a.length).map(escape).join('|')})(?![\\p{L}\\p{M}\\p{N}_])`, 'gu'),
  forms: rule.forms,
}));

export function spokenHindi(english, hindi) {
  let text = normalize(hindi);
  for (const rule of rules) if (!rule.source || rule.source.test(english)) text = text.replace(rule.pattern, word => rule.forms[word]);
  return text.replace(/₹\s*(\d+(?:[.,]\d+)*)/g, '$1 रुपये').replace(/(\d+(?:\.\d+)*)%/g, '$1 परसेंट');
}

export async function loadChapters() {
  const directory = await mkdtemp(join(tmpdir(), 'hindi-recording-copy-'));
  try {
    const target = join(directory, 'course.mjs');
    await build({ stdin: { contents: grades.map(grade => `export {class${grade}Chapters} from "./app/data/class${grade}";`).join(''), resolveDir: root, loader: 'ts' }, bundle: true, platform: 'node', format: 'esm', outfile: target, logLevel: 'silent' });
    const courses = await import(pathToFileURL(target).href);
    return grades.flatMap(grade => courses[`class${grade}Chapters`].map((chapter, index) => ({ chapter, grade, lesson: index+1, moduleLesson: index%8+1 })));
  } finally { await rm(directory, { recursive: true, force: true }); }
}

const modules = { Cybersecurity: '01-cybersecurity', 'Artificial Intelligence': '02-artificial-intelligence', 'Computational Thinking': '03-computational-thinking', 'Cyber Fraud': '04-cyber-fraud' };
export function recordingLesson({ chapter, grade, lesson, moduleLesson }) {
  const source = { scenes: chapter.scenes.map(scene => ({ en: scene.caption.en, hi: scene.caption.hi })), topics: chapter.topics, question: chapter.decision.prompt, context: chapter.decision.context };
  const sourceHash = createHash('sha256').update(JSON.stringify(source)).digest('hex');
  const scenes = chapter.scenes.map((scene, index) => {
    const key = `${chapter.slug}:${index+1}`;
    const edit = edits[key];
    if (edit && edit.source !== scene.caption.hi) throw new Error(`Recording edit needs source review: ${key}`);
    let copy = edit?.text ?? scene.caption.hi;
    let sourceNumbers = scene.caption.hi;
    if (grade<=7 && index===3) {
      copy = `${chapter.decision.context.hi} ${chapter.decision.prompt.hi} अब दिए हुए options में अपना जवाब चुनें और उसे check करें। आगे जाने से पहले feedback पढ़ें।`;
      sourceNumbers += chapter.decision.prompt.hi;
    }
    if (grade<=7 && index===5) {
      copy = `अब practice lab में आपकी बारी है। यहाँ तीन हिस्से हैं। पहला, ${chapter.topics[0].hi}। दूसरा, ${chapter.topics[1].hi}। और तीसरा, ${chapter.topics[2].hi}। हर जवाब check करें और feedback पढ़ें। ज़रूरत हो तो फिर कोशिश करें। अपना record save करें। ${grade===6?'एक फ़ैसला अपने शब्दों में समझाएँ।':'अपने तरीके की एक limitation भी बताएँ।'}`;
    }
    const text = spokenHindi(scene.caption.en, copy);
    let spokenNumbers = text;
    for (const [literal, reading] of Object.entries(edit?.numberReadings ?? {})) {
      if (!sourceNumbers.includes(literal) || !spokenNumbers.includes(reading)) throw new Error(`Missing numeric reading: ${key}: ${literal}`);
      sourceNumbers = sourceNumbers.replace(literal, '');
      spokenNumbers = spokenNumbers.replace(reading, '');
    }
    if (JSON.stringify(numberTokens(spokenNumbers)) !== JSON.stringify(numberTokens(sourceNumbers))) throw new Error(`Numbers changed in recording copy: ${key}`);
    if (!/[\u0900-\u097f]/u.test(text) || text.includes('{{')) throw new Error(`Incomplete Hindi recording copy: ${key}`);
    return { id: `${chapter.slug}-${index+1}`, number: index+1, title: scene.title.hi, text, after: index===3 ? 'Wait for the learner decision before scene 5.' : index===5 ? 'Continue to the practice lab.' : 'Continue to the next scene.' };
  });
  return { grade, lesson, moduleLesson, strand: chapter.strand, slug: chapter.slug, title: chapter.title, sourceHash, script: `class-${grade}/${modules[chapter.strand]}/${String(moduleLesson).padStart(2,'0')}-${chapter.slug}.txt`, scenes };
}

export async function exportScripts(destination = join(root, 'docs/hindi-narration')) {
  const rows = await loadChapters();
  if (rows.length !== 160 || grades.some(grade => rows.filter(row=>row.grade===grade).length!==32)) throw new Error('Expected 32 lessons in each of Classes 6–10');
  const lessons = rows.map(recordingLesson);
  for (const lesson of lessons) {
    const target = join(destination, lesson.script);
    await mkdir(join(target, '..'), { recursive: true });
    await writeFile(target, lesson.scenes.map(scene=>scene.text).join('\n\n')+'\n');
  }
  for (const grade of grades) {
    const chapters = lessons.filter(lesson=>lesson.grade===grade);
    const contents = chapters.map(lesson => `## ${String(lesson.lesson).padStart(2,'0')} · ${lesson.title.en}\n\n${lesson.title.hi} · ${lesson.strand} · \`${lesson.slug}\`\n\n${lesson.scenes.map(scene=>`### Scene ${scene.number} · ${scene.title}\n\n${scene.text}${scene.number===4?'\n\n> Recording note: pause here for the learner decision. Scene 5 follows after the correct choice.':''}`).join('\n\n')}`).join('\n\n---\n\n');
    await writeFile(join(destination, `class-${grade}/Class-${grade}-Hindi-Narration.md`), `# Class ${grade} · Hindi narration scripts\n\n32 lessons · Four modules · Six scenes per lesson\n\nRead only the narration paragraphs. Headings, IDs and recording notes are not spoken. Each lesson also has a plain text recording file.\n\n${contents}\n`);
  }
  await writeFile(join(destination, 'manifest.json'), JSON.stringify({ language: 'hi-IN', style: 'Conversational Hindi with familiar English terms; Devanagari sentences and mixed-script technical vocabulary.', scope: 'Six story narration scenes for each interactive chapter; follows the existing English story track.', lessonCount: 160, sceneCount: 960, timing: 'Measure Hindi recordings before integration. English cue times must not be reused.', lessons }, null, 2)+'\n');
  console.log(`Exported ${lessons.length} Hindi lesson scripts, ${lessons.length*6} scenes and five class reading copies to ${destination}`);
  return lessons;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fileURLToPath(pathToFileURL(process.argv[1]))) await exportScripts();
