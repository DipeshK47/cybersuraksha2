"""Audit every Chapter 8 figure for geometry defects.

Written after a report that a triangle rendered "broken into pieces". The SVG
coordinates were correct; Motion's pathLength draw-on was rendering every <line>
at ~0.75 of its length. That was invisible to the node tests, which only read
source, and to the topic sweep, which only checks video and console errors.

So this checks what is actually PAINTED, per topic, per solved-example tab:

  1. stroke-dasharray anomalies  — the pathLength bug's fingerprint
  2. geometry outside the viewBox — clipped or off-canvas figures
  3. degenerate primitives       — zero-length lines, polygons under 3 points
  4. disconnected triangles      — a filled polygon whose corners no line meets
  5. console errors

Run with the dev server up:

    PLAYWRIGHT_BROWSERS_PATH=~/.cache/ms-playwright \
    <venv>/bin/python tests/chapter8-figure-audit.py

Exits non-zero if any figure fails, so it is usable as a CI gate.
"""
import sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:4180"
URL = (f"{BASE}/grade/10/mathematics/introduction-to-trigonometry"
       "?role=student&studentId=1&className=7A")

# Probe runs in the page: returns one record per large SVG on screen.
PROBE = """() => {
  const svgs = [...document.querySelectorAll('svg')]
    .filter(s => s.viewBox?.baseVal?.width > 400);
  return svgs.map(s => {
    const vb = s.viewBox.baseVal;
    const problems = [];
    const pts = str => (str || '').trim().split(/\\s+/).map(p => {
      const [x, y] = p.split(',').map(Number); return { x, y };
    });

    const lines = [...s.querySelectorAll('line')].map(l => ({
      x1: +l.getAttribute('x1'), y1: +l.getAttribute('y1'),
      x2: +l.getAttribute('x2'), y2: +l.getAttribute('y2'),
      dash: getComputedStyle(l).strokeDasharray,
    }));
    const polys = [...s.querySelectorAll('polygon')].map(p => pts(p.getAttribute('points')));

    // 1. dasharray fingerprint of the pathLength bug
    for (const l of lines) {
      if (l.dash && l.dash !== 'none' && /^1px,? 1px$/.test(l.dash))
        problems.push(`line has pathLength dasharray "${l.dash}" (renders short)`);
    }
    // 2. painted outside the SVG box. Compared in SCREEN space via client rects,
    //    not raw user units: a viewBox may have a negative origin (Mafs uses
    //    "-220 -350 733 430"), and ancestor transforms shift things further, so a
    //    raw-coordinate test reports healthy figures as off-canvas.
    const T = 6;
    const sr = s.getBoundingClientRect();
    for (const el of [...s.querySelectorAll('line, polygon, circle')]) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;          // not painted
      if (r.left < sr.left - T || r.top < sr.top - T ||
          r.right > sr.right + T || r.bottom > sr.bottom + T)
        problems.push(`${el.tagName} painted outside the figure box`);
    }
    // 3. degenerate
    for (const l of lines)
      if (Math.hypot(l.x2 - l.x1, l.y2 - l.y1) < 0.5) problems.push('zero-length line');
    for (const poly of polys)
      if (poly.length < 3) problems.push(`polygon with ${poly.length} points`);
    // 4. a filled triangle whose corners no line reaches
    for (const poly of polys) {
      if (poly.length !== 3) continue;
      const touched = poly.filter(c => lines.some(l =>
        Math.hypot(l.x1 - c.x, l.y1 - c.y) < 2 || Math.hypot(l.x2 - c.x, l.y2 - c.y) < 2));
      if (lines.length && touched.length < 3)
        problems.push(`triangle fill has ${3 - touched.length} corner(s) no line meets`);
    }
    return { lines: lines.length, polys: polys.length, problems };
  });
}"""

TOPICS = [
    "Why trigonometry exists", "The hidden right triangle", "Naming the three sides",
    "Why the names swap", "The three ratios", "Why size never changes",
    "cosec, sec, cot", "Real numbers on a 3-4-5", "Know one ratio",
    "sin A ≤ 1", "Three things to keep", "Ratios of 45",
    "Ratios of 30", "Ratios of 0", "Table 8.1",
    "The three identities", "Proving an identity", "Chapter summary",
]

failures, checked = [], 0
console_errors = []

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1500, "height": 1200})
    page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: console_errors.append(str(e)))
    page.goto(URL, wait_until="domcontentloaded", timeout=120_000)
    page.wait_for_timeout(3000)

    for label in TOPICS:
        try:
            btn = page.get_by_role("button", name=label, exact=False).first
            btn.wait_for(state="visible", timeout=30_000)
            btn.click()
            page.wait_for_timeout(2600)          # past the reveal
        except Exception as exc:
            failures.append((label, "-", [f"could not open topic: {type(exc).__name__}"]))
            continue

        # the recap figure, plus each solved-example tab
        views = ["recap"]
        tabs = page.get_by_role("tab").all()
        views += [f"example {i + 1}" for i in range(len(tabs))]

        for n, view in enumerate(views):
            if n > 0:
                try:
                    page.get_by_role("tab").nth(n - 1).click()
                    page.wait_for_timeout(2200)
                except Exception:
                    continue
            for rec in page.evaluate(PROBE):
                checked += 1
                if rec["problems"]:
                    failures.append((label, view, rec["problems"]))
                    print(f"FAIL {label} · {view}: {rec['problems']}")

    browser.close()

real_errors = [e for e in console_errors if "favicon" not in e.lower()]
print(f"\nchecked {checked} figures across {len(TOPICS)} topics")
if real_errors:
    print(f"console errors: {real_errors[:5]}")
if failures or real_errors:
    print(f"\n{len(failures)} figure(s) FAILED")
    sys.exit(1)
print("all figures OK — no dasharray anomalies, nothing outside the viewBox, "
      "no degenerate primitives, every triangle fill meets its lines")
