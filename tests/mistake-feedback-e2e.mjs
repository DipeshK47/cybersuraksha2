import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BASE_URL ?? "http://localhost:3001";
const outputDir = path.resolve(
  process.cwd(),
  "../output/mistake-feedback-audit",
);

const checks = [
  {
    slug: "secret-message-rescue",
    wrongChoice: "Okay to share",
    wrongChoiceIndex: 0,
    forbidden: ["ATM PIN"],
  },
  {
    slug: "double-century-vault",
    wrongChoice: "234",
    forbidden: ["243"],
  },
  {
    slug: "nani-maa-vacation-challenge",
    wrongChoice: "Has extra",
    wrongChoiceIndex: 0,
    forbidden: ["Jar A", "Needs more"],
  },
  {
    slug: "toy-workshop",
    wrongChoice: "Height doubles",
    forbidden: ["Height disappears"],
  },
];

await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const [index, check] of checks.entries()) {
    const context = await browser.newContext({
      colorScheme: index % 2 ? "dark" : "light",
      reducedMotion: "no-preference",
      viewport: { width: 1440, height: 1000 },
    });
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.goto(
      `${baseUrl}/module/${check.slug}?role=student&studentId=992&className=3A`,
      { waitUntil: "domcontentloaded" },
    );
    await page.waitForTimeout(500);

    if (
      check.slug === "double-century-vault" ||
      check.slug === "nani-maa-vacation-challenge"
    ) {
      await page
        .getByRole("button", { exact: true, name: "Play" })
        .click({ force: true });
      await page.waitForTimeout(100);
      const nextStep = page.getByRole("button", {
        exact: true,
        name: "Next step",
      });
      for (let step = 0; step < 10; step += 1) {
        if (await nextStep.isEnabled()) {
          await nextStep.click({ force: true });
          await page.waitForTimeout(80);
        }
      }
      await page.getByRole("button", { name: /ready/i }).click({ force: true });
      await page.waitForTimeout(250);
    }

    const choices = page.getByRole("button", {
      exact: true,
      name: check.wrongChoice,
    });
    await choices.nth(check.wrongChoiceIndex ?? 0).click();

    const dialog = page.getByRole("dialog");
    await dialog.waitFor({ state: "visible" });
    const dialogText = (await dialog.innerText()).replace(/\s+/g, " ").trim();

    assert.match(
      dialogText,
      /smaller example/i,
      `${check.slug} should label the parallel example`,
    );
    assert.match(
      dialogText,
      /remember the rule/i,
      `${check.slug} should explain the reusable concept`,
    );
    for (const forbiddenText of check.forbidden) {
      assert.doesNotMatch(
        dialogText,
        new RegExp(forbiddenText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
        `${check.slug} revealed current-answer content: ${forbiddenText}`,
      );
    }

    await page.screenshot({
      fullPage: true,
      path: path.join(outputDir, `${check.slug}.png`),
    });
    assert.deepEqual(consoleErrors, [], `${check.slug} logged browser errors`);
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`Verified ${checks.length} live wrong-answer dialogs at ${baseUrl}`);
