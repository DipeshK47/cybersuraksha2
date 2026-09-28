/**
 * WebKit gate for the Mafs draggable angle lab — the Safari half of handoff
 * §10 item 3.
 *
 * WebKit is the engine Safari ships, so this is the closest coverage obtainable
 * off macOS. It is NOT literally Safari: no macOS media stack, different
 * networking, no Safari-only UI. Treat a pass here as "the engine is fine" and
 * a real-device check as still worthwhile for media playback specifically.
 *
 * Runs from Microsoft's Playwright image, which carries the GTK/ICU/GStreamer
 * libraries WebKit needs — the host cannot supply them without root:
 *
 *   apptainer exec --bind /scratch/$USER /scratch/$USER/playwright.sif bash -c '
 *     cd /scratch/$USER/pwjs
 *     PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
 *     node /scratch/$USER/CyberSuraksha/cybersuraksha/tests/trig-angle-lab-webkit.mjs'
 *
 * Needs the dev server up:
 *   CYBERSURAKSHA_EPHEMERAL_WORKERS=1 npm run dev -- --port 4180 -H 0.0.0.0
 *
 * Exits non-zero on failure so it is usable as a CI gate.
 */
import { webkit } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4180";
const URL =
  `${BASE}/grade/10/mathematics/introduction-to-trigonometry` +
  `?role=student&studentId=1&className=7A`;
const TOPIC = "Ratios of 0";

const failures = [];
const check = (label, ok, detail = "") => {
  if (ok) console.log(`ok   ${label}`);
  else {
    console.log(`FAIL ${label}  ${detail}`);
    failures.push(`${label}: ${detail}`);
  }
};

/** Topics are reached by clicking the chapter rail; there is no query param.
 *  Clicking before hydration silently does nothing, so wait for the button. */
async function openTopic(page) {
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 120_000 });
  const btn = page.getByRole("button", { name: TOPIC }).first();
  await btn.waitFor({ state: "visible", timeout: 60_000 });
  await page.waitForTimeout(2500);
  await btn.click();
  await page.waitForTimeout(2500);
}

const consoleErrors = [];
const browser = await webkit.launch();

// ── desktop ────────────────────────────────────────────────────────────────
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
page.on("pageerror", (e) => consoleErrors.push(String(e)));

console.log("── WebKit desktop 1440x1000 ──");
await openTopic(page);

const lab = page.locator("[data-angle-lab]");
await lab.waitFor({ state: "visible", timeout: 60_000 });
await lab.scrollIntoViewIfNeeded();

// .MafsView svg, not the first svg — the first is a 17px lucide icon.
const svg = lab.locator(".MafsView svg").first();
check("Mafs geometry mounted", (await svg.count()) > 0);
const box = await svg.boundingBox();
check("geometry has real size", !!box && box.width > 100 && box.height > 100,
      JSON.stringify(box));

const readout = page.locator("label[for='trig-angle-control'] output").first();
await page.locator("#trig-angle-control").fill("30");
await page.waitForTimeout(400);
check("slider sets 30°", (await readout.innerText()).includes("30"),
      await readout.innerText());

const presets = page.locator("[aria-label='Standard-angle shortcuts'] button");
check("five presets present", (await presets.count()) === 5,
      `found ${await presets.count()}`);
for (const want of ["0°", "45°", "90°"]) {
  await presets.filter({ hasText: want }).first().click();
  await page.waitForTimeout(900);
  const got = await readout.innerText();
  check(`preset ${want} applies`, got.includes(want.replace("°", "")), `readout=${got}`);
}

await presets.filter({ hasText: "90°" }).first().click();
await page.waitForTimeout(900);
const body = await lab.innerText();
check("tan 90° reads 'not defined'", body.includes("not defined"));
check("no Infinity/NaN leaked into readouts",
      !body.includes("Infinity") && !body.includes("NaN"));

// drag via Mafs's own hitbox
await presets.filter({ hasText: "45°" }).first().click();
await page.waitForTimeout(900);
const before = await readout.innerText();
const hb = await lab.locator(".mafs-movable-point-hitbox").first().boundingBox();
const sb = await svg.boundingBox();
await page.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2);
await page.mouse.down();
await page.mouse.move(hb.x + hb.width / 2 - sb.width * 0.12,
                      hb.y + hb.height / 2 - sb.height * 0.22, { steps: 25 });
await page.mouse.up();
await page.waitForTimeout(600);
check("dragging the point changes the angle", before !== (await readout.innerText()),
      `before=${before} after=${await readout.innerText()}`);

await lab.locator(".mafs-movable-point").first().focus();
const kbBefore = await readout.innerText();
for (let i = 0; i < 6; i++) await page.keyboard.press("ArrowLeft");
await page.waitForTimeout(500);
check("arrow keys move the point (keyboard accessible)",
      (await readout.innerText()) !== kbBefore,
      `before=${kbBefore} after=${await readout.innerText()}`);

const dots = page.locator("[aria-label='Teaching moments'] button");
check("eight teaching moments", (await dots.count()) === 8, `found ${await dots.count()}`);
await dots.nth(3).click();
await page.waitForTimeout(600);
check("selecting a moment marks it current",
      (await dots.nth(3).getAttribute("aria-current")) === "step");
await page.getByLabel("Next teaching moment").click();
await page.waitForTimeout(600);
check("next advances the tour",
      (await dots.nth(4).getAttribute("aria-current")) === "step");

const audioSrc = await page.evaluate(() => {
  const a = document.querySelector("[data-angle-lab] audio");
  return a ? a.getAttribute("src") || a.currentSrc : null;
});
check("tour beat has narration wired", !!audioSrc, `src=${audioSrc}`);

await page.screenshot({ path: "/scratch/$USER/CyberSuraksha/tmp-angle-lab-webkit.png" });
await page.close();

// ── mobile (iPhone-ish viewport, the real Safari risk surface) ─────────────
console.log("── WebKit mobile 390x844 ──");
const m = await browser.newPage({
  viewport: { width: 390, height: 844}, isMobile: true, hasTouch: true,
});
m.on("console", (x) => x.type() === "error" && consoleErrors.push(x.text()));
m.on("pageerror", (e) => consoleErrors.push(String(e)));
await openTopic(m);
const mlab = m.locator("[data-angle-lab]");
await mlab.waitFor({ state: "visible", timeout: 60_000 });
await mlab.scrollIntoViewIfNeeded();
const mb = await mlab.boundingBox();
check("lab fits the mobile viewport width", mb.width <= 391, `width=${mb.width}`);
const docW = await m.evaluate(() => document.documentElement.scrollWidth);
check("no horizontal page overflow on mobile", docW <= 391, `scrollWidth=${docW}`);
await m.screenshot({ path: "/scratch/$USER/CyberSuraksha/tmp-angle-lab-webkit-mobile.png" });
await m.close();

// ── reduced motion ─────────────────────────────────────────────────────────
console.log("── WebKit prefers-reduced-motion: reduce ──");
const r = await browser.newPage({
  viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce",
});
await openTopic(r);
const rlab = r.locator("[data-angle-lab]");
await rlab.waitFor({ state: "visible", timeout: 60_000 });
check("lab renders under reduced motion", await rlab.isVisible());
await r.close();

await browser.close();

const real = consoleErrors.filter((e) => !/favicon/i.test(e));
check("no console or page errors", real.length === 0, JSON.stringify(real.slice(0, 3)));

console.log();
if (failures.length) {
  console.log(`${failures.length} FAILED:`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
console.log("angle lab OK on WebKit (Safari engine)");
