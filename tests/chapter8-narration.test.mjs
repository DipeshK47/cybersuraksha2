import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { parse } from "@babel/parser";

const root = new URL("../", import.meta.url);
const chapter = new URL("app/grade/[grade]/[subject]/[chapter]/", root);

function propertyName(property) {
  return property?.key?.name ?? property?.key?.value;
}

function stringArray(node) {
  return node?.type === "ArrayExpression"
    ? node.elements.filter((item) => item?.type === "StringLiteral").map((item) => item.value)
    : [];
}

function collectTeachingSteps(node, result) {
  if (!node || typeof node !== "object") return;
  if (node.type === "ObjectExpression") {
    const properties = new Map(
      node.properties
        .filter((property) => property.type === "ObjectProperty")
        .map((property) => [propertyName(property), property.value]),
    );
    const caption = properties.get("caption");
    if (caption?.type === "StringLiteral") {
      const answer = properties.get("answer");
      result.push({
        caption: caption.value,
        math: stringArray(properties.get("math")),
        answer: answer?.type === "StringLiteral" ? answer.value : null,
        narrationSrc: properties.get("narrationSrc")?.type === "StringLiteral"
          ? properties.get("narrationSrc").value
          : null,
      });
    }
  }
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach((item) => collectTeachingSteps(item, result));
    else if (value && typeof value === "object") collectTeachingSteps(value, result);
  }
}

const signature = ({ caption, math, answer }) => JSON.stringify([caption, math, answer]);

test("every Chapter 8 recap and solved-example beat has one exact narration clip", async () => {
  const steps = [];
  // Must match the source list in scripts/build-chapter8-panel-narration.mjs.
  // §8.1–8.2 were brought onto the same narrated format, so they are covered too.
  for (const file of [
    "topic-panels.tsx", "topic-panels-8-2.tsx",
    "topic-panels-8-3.tsx", "topic-panels-8-4.tsx",
  ]) {
    const code = await readFile(new URL(file, chapter), "utf8");
    const ast = parse(code, { sourceType: "module", plugins: ["typescript", "jsx"] });
    collectTeachingSteps(ast, steps);
  }

  const manifestCode = await readFile(new URL("chapter8-narration.generated.ts", chapter), "utf8");
  const manifestAst = parse(manifestCode, { sourceType: "module", plugins: ["typescript"] });
  const declaration = manifestAst.program.body
    .filter((node) => node.type === "ExportNamedDeclaration")
    .flatMap((node) => node.declaration?.declarations ?? [])
    .find((node) => node.id?.name === "CHAPTER8_NARRATION");
  assert.equal(declaration?.init?.type, "ObjectExpression");
  const entries = declaration.init.properties;
  const byKey = new Map(entries.map((entry) => {
    const src = entry.value.properties.find((property) => propertyName(property) === "src").value.value;
    return [entry.key.value, src];
  }));

  assert.equal(steps.length, 380, "the complete Chapter 8 teaching script changed unexpectedly");
  assert.equal(entries.length, byKey.size, "the generated manifest contains a duplicate key");
  const lookedUpSteps = steps.filter((step) => !step.narrationSrc);
  assert.equal(
    byKey.size,
    new Set(lookedUpSteps.map(signature)).size,
    "the generated manifest lost a signature-based teaching beat",
  );

  const resolvedSources = [];
  for (const step of steps) {
    const key = signature(step);
    const src = step.narrationSrc ?? byKey.get(key);
    assert.ok(src, `missing narration for: ${step.caption}`);
    resolvedSources.push(src);
    const info = await stat(new URL(`public${src}`, root));
    assert.ok(info.size > 1_000, `${src} is empty or not a real audio clip`);
  }
  assert.equal(
    new Set(resolvedSources).size,
    steps.length,
    "every visual teaching beat must resolve to its own audio clip",
  );
});
