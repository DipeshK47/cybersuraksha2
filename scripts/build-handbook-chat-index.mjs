import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const projectRoot = process.cwd();
const corpusPath = resolve(
  projectRoot,
  "../output/handbook-analysis/corpus/pages.jsonl",
);
const chapterPath = resolve(
  projectRoot,
  "../output/handbook-analysis/chapter_index.csv",
);
const outputPath = resolve(
  projectRoot,
  "app/data/handbook-chat-index.json",
);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...values] = rows;
  return values.map((value) =>
    Object.fromEntries(headers.map((header, index) => [header, value[index] ?? ""])),
  );
}

function cleanText(text) {
  return text
    .replace(/\s*Page\s+\d+\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

const [corpusText, chapterText] = await Promise.all([
  readFile(corpusPath, "utf8"),
  readFile(chapterPath, "utf8"),
]);

const chapters = parseCsv(chapterText)
  .filter((chapter) => chapter.edition === "student")
  .map((chapter) => ({
    grade: Number(chapter.grade),
    part: chapter.part,
    title: chapter.title,
    start: Number(chapter.start_pdf_page),
    end: Number(chapter.end_pdf_page),
  }));

const pages = corpusText
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line))
  .filter((page) => page.edition === "student")
  .map((page) => {
    const chapter = chapters.find(
      (candidate) =>
        candidate.grade === page.grade &&
        page.pdf_page >= candidate.start &&
        page.pdf_page <= candidate.end,
    );
    return {
      id: `${page.document_id}-p${page.pdf_page}`,
      documentId: page.document_id,
      grade: page.grade,
      part: chapter?.part ?? null,
      chapter: chapter?.title ?? null,
      pdfPage: page.pdf_page,
      printedPage: page.printed_page,
      text: cleanText(page.text),
    };
  })
  .filter((page) => page.text.length >= 40);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(pages)}\n`);
console.log(`Wrote ${pages.length} student-safe handbook pages to ${outputPath}`);
