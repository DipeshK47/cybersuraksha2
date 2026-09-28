/**
 * Does the lesson MEDIA actually play in WebKit?
 *
 * The angle-lab WebKit gate proved layout and interaction. The one gap it left
 * was playback: WebKit on Linux decodes through GStreamer while Safari on macOS
 * uses AVFoundation, so "the engine renders fine" does not by itself mean the
 * H.264/AAC lesson films and the MP3 narration will play for a Safari student.
 *
 * This drives both to a running clock, which is the part that actually differs.
 *
 *   apptainer exec --bind /scratch/$USER /scratch/$USER/playwright.sif bash -c '
 *     cd /scratch/$USER/pwjs
 *     PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
 *     node /scratch/$USER/CyberSuraksha/cybersuraksha/tests/chapter8-webkit-media.mjs'
 */
import { webkit } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:4180";
const URL =
  `${BASE}/grade/10/mathematics/introduction-to-trigonometry` +
  `?role=student&studentId=1&className=7A`;

const failures = [];
const check = (label, ok, detail = "") => {
  console.log(ok ? `ok   ${label}` : `FAIL ${label}  ${detail}`);
  if (!ok) failures.push(label);
};

const browser = await webkit.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 120_000 });
await page.waitForTimeout(4000);

// ── the lesson film: H.264 + AAC in MP4 ─────────────────────────────────────
const video = page.locator("video").first();
await video.waitFor({ state: "attached", timeout: 60_000 });

const meta = await video.evaluate(async (v) => {
  if (v.readyState < 1) {
    await new Promise((r) => {
      v.addEventListener("loadedmetadata", r, { once: true });
      setTimeout(r, 20000);
    });
  }
  return { src: v.currentSrc, duration: v.duration, w: v.videoWidth, h: v.videoHeight };
});
check("video metadata decoded", meta.duration > 1 && meta.w >= 1280,
      JSON.stringify(meta));

const played = await video.evaluate(async (v) => {
  v.muted = true;                       // WebKit blocks unmuted autoplay
  const before = v.currentTime;
  try { await v.play(); } catch (e) { return { error: String(e) }; }
  await new Promise((r) => setTimeout(r, 2500));
  const after = v.currentTime;
  v.pause();
  return { before, after, advanced: after - before };
});
check("video CLOCK advances (GStreamer decoded H.264)",
      played.advanced > 0.4, JSON.stringify(played));

// ── the narration: MP3 ──────────────────────────────────────────────────────
await page.getByRole("button", { name: "The three ratios" }).first().click();
await page.waitForTimeout(3000);

const audioInfo = await page.evaluate(async () => {
  const a = document.querySelector("audio");
  if (!a) return { error: "no audio element" };
  a.muted = true;
  if (a.readyState < 1) {
    await new Promise((r) => {
      a.addEventListener("loadedmetadata", r, { once: true });
      setTimeout(r, 20000);
    });
  }
  const before = a.currentTime;
  try { await a.play(); } catch (e) { return { src: a.currentSrc, error: String(e) }; }
  await new Promise((r) => setTimeout(r, 2000));
  const after = a.currentTime;
  a.pause();
  return { src: a.currentSrc, duration: a.duration, advanced: after - before };
});
check("narration mp3 metadata decoded",
      audioInfo.duration > 0.5, JSON.stringify(audioInfo));
check("narration CLOCK advances (MP3 decoded)",
      audioInfo.advanced > 0.3, JSON.stringify(audioInfo));

await browser.close();
check("no page errors", errors.length === 0, JSON.stringify(errors.slice(0, 3)));

console.log();
if (failures.length) {
  console.log(`${failures.length} FAILED: ${failures.join(", ")}`);
  process.exit(1);
}
console.log("WebKit plays both the lesson film and the narration");
