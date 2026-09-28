import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseUrl = process.env.TOY_AUDIT_URL ?? "http://localhost:4173";

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage({
  colorScheme: "light",
  viewport: { width: 1440, height: 1000 },
});
const pageErrors = [];

page.on("pageerror", (error) => pageErrors.push(error.message));

await page.goto(
  `${baseUrl}/module/toy-workshop?role=teacher&className=3-A`,
);
await page.waitForLoadState("networkidle");

assert.equal(await page.title(), "Toy Workshop — CyberSuraksha");
await page.getByRole("heading", { name: "Turn the viewpoint" }).waitFor();
assert.equal(
  await page
    .getByRole("img", { name: "front view projection of the five-block model" })
    .locator("rect")
    .count(),
  5,
);

await page.getByRole("button", { name: "top view" }).click();
const topProjection = page.getByRole("img", {
  name: "top view projection of the five-block model",
});
assert.equal(await topProjection.locator("rect").count(), 3);
assert.equal(
  new Set(await topProjection.locator("rect").evaluateAll((items) =>
    items.map((item) => item.getAttribute("y")),
  )).size,
  1,
);
await page.getByRole("button", { name: "side view" }).click();
const sideProjection = page.getByRole("img", {
  name: "side view projection of the five-block model",
});
assert.equal(await sideProjection.locator("rect").count(), 3);
assert.equal(
  new Set(await sideProjection.locator("rect").evaluateAll((items) =>
    items.map((item) => item.getAttribute("y")),
  )).size,
  3,
);
await page.getByRole("button", { name: "top view" }).click();
await page.getByRole("button", { name: "Height doubles" }).click();
await page.getByRole("dialog").waitFor();
await page
  .getByText("Place a book flat on a desk.", { exact: false })
  .waitFor();
await page.getByRole("button", { name: "I’ll try again" }).click();

await page.getByRole("button", { name: "Height disappears" }).click();
const nextButton = page.getByRole("button", { name: "Next station" });
await nextButton.waitFor();
assert.equal(await nextButton.isEnabled(), false);

const firstPractice = page.getByRole("region", { name: "Remix practice" });
await firstPractice.waitFor();
await firstPractice.getByRole("button", { name: "Top view" }).click();
await page.getByRole("dialog").waitFor();
await page
  .getByText("Place a book flat on a desk.", { exact: false })
  .waitFor();
await page.getByRole("button", { name: "I’ll try again" }).click();
await firstPractice.getByRole("button", { name: "Front view" }).click();
await firstPractice.getByRole("button", { name: "Next remix" }).click();
await firstPractice.getByRole("button", { name: "Give me a clue" }).click();
await firstPractice.getByText("The side camera looks along", { exact: false }).waitFor();
await firstPractice.getByRole("button", { name: "Width" }).click();
await page.getByRole("region", { name: "Remix practice complete" }).waitFor();
assert.equal(await nextButton.isEnabled(), true);

await nextButton.click();
await page.getByRole("heading", { name: "Run the roof scanner" }).waitFor();
await page.waitForTimeout(180);
assert.equal(await page.evaluate(() => window.scrollY), 0);
const cabin = page.getByRole("img", {
  name: "Handbook toy cabin with a grey roof, white sloping panel, black inner square and black front face",
});
await cabin.waitFor();
assert.equal(
  await cabin.locator("img").evaluate((image) => image.complete && image.naturalWidth > 0),
  true,
);
await page.getByRole("button", { name: "Scan from above" }).click();
assert.equal(
  await page.getByRole("region", { name: "Top view choices" }).count(),
  0,
);
const methodLesson = page.getByRole("region", {
  name: "Animated top-view explanation",
});
await methodLesson
  .getByText("How a top camera makes a flat map", { exact: false })
  .waitFor();
await methodLesson.getByRole("button", { name: "Width" }).click();
await page.getByRole("dialog").waitFor();
await page
  .getByText("Build one tower with one block", { exact: false })
  .waitFor();
await page.getByRole("button", { name: "I’ll try again" }).click();
await methodLesson.getByRole("button", { name: "Height", exact: true }).click();
await methodLesson
  .getByRole("button", { name: "Positions and colours" })
  .click();
assert.equal(
  await page.getByRole("region", { name: "Top view choices" }).getByRole("button").count(),
  4,
);

await page
  .getByRole("region", { name: "Top view choices" })
  .getByRole("button")
  .nth(3)
  .click();
const topPractice = page.getByRole("region", { name: "Remix practice" });
await topPractice.getByRole("button", { name: "Black" }).click();
await topPractice.getByRole("button", { name: "Next remix" }).click();
await topPractice.getByRole("button", { name: "Orange" }).click();
await page.getByRole("dialog").waitFor();
await page.getByText("Draw four seats in a 2 by 2 grid.", { exact: false }).waitFor();
await page.getByRole("button", { name: "I’ll try again" }).click();
await topPractice.getByRole("button", { name: "Blue" }).click();
await page.getByRole("region", { name: "Remix practice complete" }).waitFor();

await page.screenshot({
  fullPage: true,
  path: "../output/toy-workshop-local.png",
});

await page.emulateMedia({ colorScheme: "dark" });
await page.reload();
await page.waitForLoadState("networkidle");
assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
await page.screenshot({
  fullPage: true,
  path: "../output/toy-workshop-local-dark.png",
});

const stations = [
  ["Turn the viewpoint", "Turn the viewpoint"],
  ["Run the roof scanner", "Run the roof scanner"],
  ["See through the drawing", "See through the drawing"],
  ["Edge-sorting factory", "Run the edge-sorting factory"],
  ["Transparent crate", "Inspect the transparent crate"],
  ["Pattern conveyor", "Repair the toy conveyor"],
  ["Match the shadows", "Catch the mismatched shadow"],
  ["Edge colour circuit", "Light the matching-edge circuit"],
  ["Block assembly bay", "Build the final toy wall"],
  ["Tournament transfer", "Solve the final toy tournament"],
];

await page.evaluate(() => {
  window.localStorage.setItem(
    "cybersuraksha-toy-workshop-v1-preview",
    JSON.stringify({
      screen: 0,
      completed: Array.from({ length: 10 }, (_, index) => index),
      metrics: {
        visual: { attempts: 1, correct: 1 },
        counting: { attempts: 1, correct: 1 },
        pattern: { attempts: 1, correct: 1 },
        logic: { attempts: 1, correct: 1 },
      },
    }),
  );
});
await page.reload();
await page.waitForLoadState("networkidle");
await page.waitForTimeout(100);

const lessonMap = page.getByRole("complementary", {
  name: "Toy Workshop lesson map",
});
for (const [railTitle, heading] of stations) {
  process.stdout.write(`Checking ${railTitle}\n`);
  await lessonMap.getByRole("button", { name: new RegExp(railTitle) }).click();
  await page.getByRole("heading", { name: heading }).waitFor();
  await page.waitForTimeout(60);
  assert.equal(await page.evaluate(() => window.scrollY), 0);

  if (railTitle === "Match the shadows") {
    const pairFigures = page.locator("svg[aria-label*='paired with']");
    assert.equal(await pairFigures.count(), 4);
    assert.ok((await pairFigures.first().boundingBox()).width > 120);
    await page
      .getByRole("img", {
        name: "Six-block solid from the handbook side-view question",
      })
      .waitFor();
  }

  if (railTitle === "Edge colour circuit") {
    const circuit = page.getByRole("img", {
      name: "Shared-vertex solid with coloured corner dots and eighteen edges",
    });
    assert.equal(await circuit.locator("line").count(), 18);
    assert.equal(await circuit.locator("circle").count(), 12);
  }

  if (railTitle === "Block assembly bay") {
    await page.getByRole("button", { name: "Join pieces 1 + 2" }).click();
    await page.getByRole("button", { name: "Add piece 3" }).click();
    assert.equal(
      await page.locator("svg[aria-label^='Assembly option']").count(),
      4,
    );
    assert.equal(
      await page.getByRole("img", { name: "Assembly option D" }).locator("g").count(),
      11,
    );
  }

  if (railTitle !== "Turn the viewpoint") {
    await page.getByText(/Student handbook ·/).first().waitFor();
  }

  await page
    .getByRole("region", { name: "Remix practice complete" })
    .waitFor();
  await page.getByRole("button", { name: "Play remixes again" }).click();
  const stationPractice = page.getByRole("region", { name: "Remix practice" });
  await stationPractice.waitFor();
  await stationPractice.getByText("Remix 1 of 2", { exact: false }).waitFor();
  assert.ok(
    (await stationPractice.locator("button").count()) >= 3,
    `${railTitle} should offer answer choices and a hint`,
  );
}

assert.deepEqual(pageErrors, []);
await browser.close();
