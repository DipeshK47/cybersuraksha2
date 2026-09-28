import handbookPages from "../data/handbook-chat-index.json";

export type HandbookSource = {
  id: string;
  kind: "handbook";
  title: string;
  label: string;
  grade: number;
  chapter: string | null;
  pdfPage: number;
  printedPage: number | null;
  excerpt: string;
};

type HandbookPage = (typeof handbookPages)[number];

const stopwords = new Set(
  "a an and are as at be by can did do does for from had has have how i in is it me my of on or our should that the their them there they this to was we were what when where which who why will with you your".split(
    " ",
  ),
);

function tokens(value: string) {
  return Array.from(
    new Set(
      value
        .toLowerCase()
        .match(/[a-z0-9]+/g)
        ?.filter((token) => token.length >= 2 && !stopwords.has(token)) ?? [],
    ),
  );
}

function countOccurrences(haystack: string, needle: string) {
  let count = 0;
  let cursor = 0;
  while ((cursor = haystack.indexOf(needle, cursor)) !== -1) {
    count += 1;
    cursor += needle.length;
  }
  return count;
}

function scorePage(page: HandbookPage, query: string, queryTokens: string[]) {
  const text = page.text.toLowerCase();
  const chapter = page.chapter?.toLowerCase() ?? "";
  let score = 0;

  if (query.length >= 5 && text.includes(query)) score += 14;
  for (const token of queryTokens) {
    score += Math.min(countOccurrences(text, token), 6);
    if (chapter.includes(token)) score += 5;
    if (page.part?.toLowerCase() === token) score += 2;
  }
  return score;
}

function excerptFor(page: HandbookPage, queryTokens: string[]) {
  const lower = page.text.toLowerCase();
  const firstMatch = queryTokens
    .map((token) => lower.indexOf(token))
    .filter((index) => index >= 0)
    .sort((left, right) => left - right)[0];
  const start = Math.max(0, (firstMatch ?? 0) - 180);
  const end = Math.min(page.text.length, start + 820);
  return `${start > 0 ? "…" : ""}${page.text.slice(start, end)}${
    end < page.text.length ? "…" : ""
  }`;
}

export function searchStudentHandbooks(
  question: string,
  grade: number,
  limit = 5,
): HandbookSource[] {
  const query = question.toLowerCase().trim();
  const queryTokens = tokens(query);
  if (!queryTokens.length) return [];

  return (handbookPages as HandbookPage[])
    .filter((page) => page.grade === grade)
    .map((page) => ({ page, score: scorePage(page, query, queryTokens) }))
    .filter((result) => result.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || left.page.pdfPage - right.page.pdfPage,
    )
    .slice(0, limit)
    .map(({ page }, index) => ({
      id: `H${index + 1}`,
      kind: "handbook" as const,
      title: `Class ${page.grade} Student Handbook`,
      label: `${page.chapter ?? page.part ?? "Handbook"} · PDF page ${
        page.pdfPage
      }${
        page.printedPage ? ` · printed page ${page.printedPage}` : ""
      }`,
      grade: page.grade,
      chapter: page.chapter,
      pdfPage: page.pdfPage,
      printedPage: page.printedPage,
      excerpt: excerptFor(page, queryTokens),
    }));
}
