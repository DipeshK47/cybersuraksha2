/** Compile authored bilingual text into offline story scripts and the Hindi catalogue. */
import { build } from "esbuild";
import { readFile, writeFile, mkdtemp, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const temporary = await mkdtemp(join(tmpdir(), "class8-assets-"));
const normalize = text => text.replace(/\s+/g, " ").trim();
try {
  const output = join(temporary, "content.mjs");
  await build({ stdin: { contents: 'export { class8Chapters } from "./app/data/class8"; export { ui } from "./app/module/cyber/lessons/class8/ui";', resolveDir: root, loader: "ts" }, bundle: true, platform: "node", format: "esm", outfile: output, logLevel: "silent" });
  const { class8Chapters, ui } = await import(pathToFileURL(output).href);
  const messages = {};
  function collect(value) {
    if (!value || typeof value !== "object") return;
    if (typeof value.en === "string" && typeof value.hi === "string") messages[normalize(value.en)] = normalize(value.hi);
    else for (const child of Object.values(value)) collect(child);
  }
  collect(class8Chapters); collect(ui);
  Object.assign(messages, {
    "Class 8 Future Lab": "क्लास 8 फ़्यूचर लैब",
    "Future Lab": "फ़्यूचर लैब",
    "Meera & Kabir": "मीरा और कबीर",
    "CyberShiksha Future Lab · Class 8": "साइबरशिक्षा फ़्यूचर लैब · क्लास 8",
    "Reflection saved": "अपने शब्दों वाला जवाब सेव हो गया",
    "Save reflection": "अपने शब्दों वाला जवाब सेव करें",
    "Protect a digital trail, account, shared device and class magazine with tested choices.": "चेक किए हुए फ़ैसलों से डिजिटल ट्रेल, अकाउंट, साझा डिवाइस और क्लास मैगज़ीन की सुरक्षा करें।",
    "Explore examples, data, model mistakes and useful AI projects with people in charge.": "लोगों की निगरानी में उदाहरण, डेटा, मॉडल की गलतियाँ और उपयोगी एआई प्रोजेक्ट समझें।",
    "Build and test patterns, binary signals, logical rules, loops and practical algorithms.": "पैटर्न, बाइनरी सिग्नल, लॉजिक के नियम, लूप और काम के एल्गोरिदम बनाएँ और टेस्ट करें।",
    "Inspect offers, messages and payment claims, verify independently and get help calmly.": "ऑफ़र, मैसेज और पेमेंट के दावे जाँचें, अलग भरोसेमंद रास्ते से पुष्टि करें और शांति से मदद लें।",
    "Build useful skills through 32 original chapters in computing, AI, cybersecurity and fraud awareness.": "कंप्यूटिंग, एआई, साइबर सिक्योरिटी और फ़्रॉड की जानकारी वाले 32 नए चैप्टर से काम के स्किल सीखें।",
  });
  const chaptersDir = join(root, "app/module/cyber/lessons/new/story/chapters");
  await mkdir(chaptersDir, { recursive: true });
  for (const chapter of class8Chapters) {
    const target = join(chaptersDir, `${chapter.slug}.json`);
    let previous;
    try { previous = JSON.parse(await readFile(target, "utf8")); } catch { /* First compilation has no timings. */ }
    const unchanged = previous?.scenes.length === 6 && chapter.scenes.every((scene, index) => previous.scenes[index].caption === scene.caption.en);
    const script = { duration: unchanged ? previous.duration : 0, ...(unchanged && previous.narrationHash ? { narrationHash: previous.narrationHash } : {}), scenes: chapter.scenes.map((scene, index) => ({ id: `${chapter.slug}-${index+1}`, label: ui.storyLabels[index].en, title: scene.title.en, mood: index === 1 ? "surprise" : index >= 4 ? "happy" : "thinking", caption: scene.caption.en, dialogue: scene.dialogue.en, status: ui.lab.en, tone: index === 1 ? "trouble" : index >= 4 ? "resolved" : "normal", start: unchanged ? previous.scenes[index].start : 0, duration: unchanged ? previous.scenes[index].duration : 0 })) };
    if (!process.argv.includes("--locales-only")) await writeFile(target, JSON.stringify(script, null, 2) + "\n");
    const wrapper = `// Generated from authored Class 8 content by scripts/build-class8-assets.mjs.\nimport { getClass8Chapter } from "../../../../../../data/class8";\nimport { createClass8Story } from "../../../class8/Class8Stories";\nimport script from "./${chapter.slug}.json";\nexport default createClass8Story(getClass8Chapter(${JSON.stringify(chapter.slug)})!, script);\n`;
    if (!process.argv.includes("--locales-only")) await writeFile(join(chaptersDir, `${chapter.slug}.tsx`), wrapper);
    messages[`${chapter.title.en} complete`] = `${chapter.title.hi} पूरा हुआ`;
    messages[`You solved three practice challenges in ${chapter.title.en}.`] = `आपने ${chapter.title.hi} में तीन प्रैक्टिस चैलेंज हल किए।`;
  }
  const generatedPath = join(root, "public/locales/class8-hi.json");
  let oldMessages = {};
  try { oldMessages = JSON.parse(await readFile(generatedPath, "utf8")); } catch { /* New authored catalogue. */ }
  const cataloguePath = join(root, "public/locales/hi.json");
  const catalogue = JSON.parse(await readFile(cataloguePath, "utf8"));
  for (const [source, translated] of Object.entries(messages)) {
    if (!(source in catalogue.messages) || catalogue.messages[source] === oldMessages[source]) catalogue.messages[source] = translated;
    if (source.includes("{{") && !catalogue.templates.some(template => template.source === source)) catalogue.templates.push({ source, parts: [], translation: translated });
  }
  await mkdir(dirname(generatedPath), { recursive: true });
  await writeFile(generatedPath, JSON.stringify(messages, null, 2) + "\n");
  await writeFile(cataloguePath, JSON.stringify(catalogue, null, 2) + "\n");
  console.log(`${process.argv.includes("--locales-only") ? "Updated text for" : "Compiled"} ${class8Chapters.length} six-scene stories and ${Object.keys(messages).length} authored Hindi messages. Existing measured cue timing was retained only for unchanged captions.`);
} finally { await rm(temporary, { recursive: true, force: true }); }
