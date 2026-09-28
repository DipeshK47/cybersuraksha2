"""Does answering correctly actually reveal the worked solution?

The §8.1–8.2 questions gained `solution.steps` + `rule`, but that was only ever
verified by reading source. This drives the real UI: answer correctly, then check
the "Why this works" panel appears with the right rule and the right ordered
steps, and that the question advances.

Covers a §8.1 topic and several §8.2 topics, since the solutions were added to
both files.

    PLAYWRIGHT_BROWSERS_PATH=~/.cache/ms-playwright \
    <venv>/bin/python tests/chapter8-practice-reveal.py

Exits non-zero on failure so it is usable as a CI gate.
"""
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = "http://localhost:4180"
URL = (f"{BASE}/grade/10/mathematics/introduction-to-trigonometry"
       "?role=student&studentId=1&className=7A")

# topic label -> (correct option text, a phrase that must appear in the steps)
CASES = [
    ("Why trigonometry exists", "three · sides · measure", "Greek roots"),
    ("Naming the three sides", "AC", "facing the right angle"),
    ("The three ratios", "BC/AC", "opposite/hypotenuse"),
    ("Know one ratio", "√7/4", "Pythagorean identity"),
    ("Three things to keep", "0", "QR"),
]

failures = []
console_errors = []


def check(label, ok, detail=""):
    print(f"{'ok  ' if ok else 'FAIL'} {label}" + ("" if ok else f"  — {detail}"))
    if not ok:
        failures.append(label)


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1500, "height": 1200})
    page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: console_errors.append(str(e)))
    page.goto(URL, wait_until="domcontentloaded", timeout=120_000)
    page.wait_for_timeout(3000)

    for topic, correct, phrase in CASES:
        try:
            btn = page.get_by_role("button", name=topic, exact=False).first
            btn.wait_for(state="visible", timeout=30_000)
            btn.click()
            page.wait_for_timeout(2500)

            choices = page.locator("[aria-label='Choose one answer']").first
            choices.wait_for(state="visible", timeout=30_000)
            choices.scroll_into_view_if_needed()
            page.wait_for_timeout(500)

            option = choices.get_by_role("button", name=correct, exact=False).first
            if option.count() == 0:
                check(f"{topic}: correct option present", False, f"no option matching {correct!r}")
                continue
            option.click()
            page.wait_for_timeout(1500)

            body = page.inner_text("body")
            check(f"{topic}: reveal panel appears", "Why this works" in body)

            steps = page.locator("ol li p")
            n = steps.count()
            check(f"{topic}: ordered steps rendered", n >= 2, f"found {n}")

            # search the whole reveal, not just the <ol>: `rule` renders in the
            # panel header, so a phrase can legitimately live there instead
            panel = page.locator("section", has=page.get_by_text("Why this works")).last
            joined = panel.inner_text() if panel.count() else " ".join(
                steps.nth(i).inner_text() for i in range(min(n, 12)))
            check(f"{topic}: reveal is this question's", phrase.lower() in joined.lower(),
                  f"expected {phrase!r} in: {joined[:130]}")

            nxt = page.get_by_role("button", name="Next question", exact=False)
            fin = page.get_by_role("button", name="Finish practice", exact=False)
            check(f"{topic}: advance control offered", nxt.count() > 0 or fin.count() > 0)
        except Exception as exc:
            check(f"{topic}: drove the flow", False, f"{type(exc).__name__}: {str(exc)[:110]}")

    page.screenshot(path=str(Path(__file__).resolve().parents[2] / "tmp-practice-reveal.png"))
    browser.close()

real = [e for e in console_errors if "favicon" not in e.lower()]
check("no console errors", not real, str(real[:2]))

print()
if failures:
    print(f"{len(failures)} FAILED: " + "; ".join(failures))
    sys.exit(1)
print("practice reveal works across §8.1 and §8.2")
