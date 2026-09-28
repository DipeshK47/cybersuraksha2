import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.TOY_AUDIT_URL ?? "http://localhost:4173";
const label = process.env.TOY_AUDIT_LABEL ?? "current";
const outputDirectory = new URL(
  `../../output/toy-workshop-audit/${label}/`,
  import.meta.url,
);
const stations = [
  "Turn the viewpoint",
  "Run the roof scanner",
  "See through the drawing",
  "Edge-sorting factory",
  "Transparent crate",
  "Pattern conveyor",
  "Match the shadows",
  "Edge colour circuit",
  "Block assembly bay",
  "Tournament transfer",
];

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});

for (const colorScheme of ["light", "dark"]) {
  const page = await browser.newPage({
    colorScheme,
    viewport: { width: 1365, height: 768 },
  });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(`${baseUrl}/module/toy-workshop?role=teacher&className=3-A`);
  await page.waitForLoadState("networkidle");
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
  await page.waitForTimeout(150);

  const lessonMap = page.getByRole("complementary", {
    name: "Toy Workshop lesson map",
  });

  for (const [index, station] of stations.entries()) {
    await lessonMap
      .getByRole("button", { name: new RegExp(station) })
      .click();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: new URL(
        `${String(index + 1).padStart(2, "0")}-${colorScheme}.png`,
        outputDirectory,
      ).pathname,
    });

    const detailPrefix = `${String(index + 1).padStart(2, "0")}`;
    if (index === 0) {
      for (const view of ["top", "side"]) {
        await page.getByRole("button", { name: `${view} view` }).click();
        await page.screenshot({
          path: new URL(
            `${detailPrefix}-${view}-${colorScheme}.png`,
            outputDirectory,
          ).pathname,
        });
      }
    }
    if (index === 1) {
      await page.getByRole("button", { name: "Scan from above" }).click();
      await page.waitForTimeout(850);
      await page.screenshot({
        path: new URL(
          `${detailPrefix}-scanned-${colorScheme}.png`,
          outputDirectory,
        ).pathname,
      });
      await page
        .getByRole("region", { name: "Animated top-view explanation" })
        .screenshot({
          path: new URL(
            `${detailPrefix}-method-${colorScheme}.png`,
            outputDirectory,
          ).pathname,
        });
      await page.getByRole("button", { name: "Play remixes again" }).click();
      await page.getByRole("region", { name: "Remix practice" }).waitFor();
      await page.screenshot({
        path: new URL(
          `${detailPrefix}-remix-${colorScheme}.png`,
          outputDirectory,
        ).pathname,
      });
      await page
        .getByRole("region", { name: "Remix practice" })
        .getByRole("button", { name: "White" })
        .click();
      await page.getByRole("dialog").screenshot({
        path: new URL(
          `${detailPrefix}-mistake-${colorScheme}.png`,
          outputDirectory,
        ).pathname,
      });
      await page.getByRole("button", { name: "I’ll try again" }).click();
    }
    if (index === 2) {
      await page.getByRole("button", { name: "Reveal hidden faces" }).click();
      await page.waitForTimeout(300);
      await page.screenshot({
        path: new URL(
          `${detailPrefix}-revealed-${colorScheme}.png`,
          outputDirectory,
        ).pathname,
      });
    }
    if (index === 7) {
      await page.getByRole("button", { name: "Trace all" }).click();
      await page.waitForTimeout(300);
      await page.screenshot({
        path: new URL(
          `${detailPrefix}-traced-${colorScheme}.png`,
          outputDirectory,
        ).pathname,
      });
    }
    if (index === 8) {
      await page.getByRole("button", { name: "Join pieces 1 + 2" }).click();
      await page.getByRole("button", { name: "Add piece 3" }).click();
      await page.waitForTimeout(750);
      await page.screenshot({
        path: new URL(
          `${detailPrefix}-assembled-${colorScheme}.png`,
          outputDirectory,
        ).pathname,
      });
    }
    if (index === 9) {
      await page
        .getByRole("button", { name: "Apply the even-number clue" })
        .click();
      await page.waitForTimeout(300);
      await page.screenshot({
        path: new URL(
          `${detailPrefix}-revealed-${colorScheme}.png`,
          outputDirectory,
        ).pathname,
      });
    }
  }

  if (pageErrors.length) {
    throw new Error(`${colorScheme} browser errors: ${pageErrors.join("; ")}`);
  }
  await page.close();
}

await browser.close();
