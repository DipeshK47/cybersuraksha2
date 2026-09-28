"""Open every Chapter 8 topic and verify its video and recap audio actually load.

chapter8-browser-qa.py drives one topic (45°) in depth. This sweeps all of them
shallowly, which is where a mis-wired src, a truncated export, or a topic-specific
console error shows up.

    cd cybersuraksha
    CYBERSURAKSHA_EPHEMERAL_WORKERS=1 npm run dev -- --port 4180
    /tmp/cybersuraksha-playwright-venv/bin/python tests/chapter8-topic-sweep.py
"""
import sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:4180"
URL = (f"{BASE}/grade/10/mathematics/introduction-to-trigonometry"
       "?role=student&studentId=1&className=7A")

# (button label, expected video basename)
TOPICS = [
    ("Why trigonometry exists", "lesson-8-1-why.mp4"),
    ("The hidden right triangle", "lesson-8-1-hidden.mp4"),
    ("Ratios of 45°", "lesson-8-3-45.mp4"),
    ("Ratios of 30° and 60°", "lesson-8-3-30-60.mp4"),
    ("Ratios of 0° and 90°", "lesson-8-3-0-90.mp4"),
    ("Table 8.1 — the values to know cold", "lesson-8-3-table.mp4"),
    ("The three identities", "lesson-8-4-identities.mp4"),
    ("Proving an identity", "lesson-8-4-proving.mp4"),
    ("Chapter summary", "lesson-8-summary.mp4"),
]

failures = []

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1100})
    console_errors = []
    page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: console_errors.append(str(e)))

    page.goto(URL, wait_until="domcontentloaded", timeout=120_000)
    page.get_by_text("Ratios of 45°", exact=True).first.wait_for(timeout=120_000)
    page.wait_for_timeout(5_000)  # Vinext client boundary hydration

    for label, expected in TOPICS:
        before = len(console_errors)
        try:
            page.get_by_role("button", name=label, exact=False).first.click()
            page.get_by_role("heading", name=label, exact=True).wait_for(timeout=30_000)
            video = page.locator("video").first
            video.wait_for(state="visible", timeout=30_000)
            page.wait_for_function(
                "() => { const v = document.querySelector('video');"
                " return v && v.readyState >= 1 && v.duration > 0; }",
                timeout=60_000,
            )
            state = video.evaluate(
                "el => ({duration: el.duration, w: el.videoWidth, h: el.videoHeight, src: el.currentSrc})"
            )
            problems = []
            if not state["src"].endswith(expected):
                problems.append(f"src is {state['src'].rsplit('/', 1)[-1]}, expected {expected}")
            if state["duration"] <= 0:
                problems.append(f"duration {state['duration']}")
            if state["w"] < 1280 or state["h"] < 720:
                problems.append(f"resolution {state['w']}x{state['h']}")
            new_errors = console_errors[before:]
            if new_errors:
                problems.append(f"console errors: {new_errors}")

            status = "FAIL" if problems else "ok  "
            print(f"{status} {label:42s} {state['duration']:7.2f}s  "
                  f"{state['w']}x{state['h']}  {state['src'].rsplit('/', 1)[-1]}")
            if problems:
                failures.append((label, problems))
        except Exception as exc:  # noqa: BLE001 - report, do not abort the sweep
            print(f"FAIL {label:42s} {type(exc).__name__}: {str(exc)[:110]}")
            failures.append((label, [str(exc)[:200]]))

    browser.close()

print()
if failures:
    print(f"{len(failures)} of {len(TOPICS)} topics FAILED:")
    for label, problems in failures:
        for p in problems:
            print(f"  - {label}: {p}")
    sys.exit(1)
print(f"all {len(TOPICS)} topics OK")
