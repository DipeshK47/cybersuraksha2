"""Browser gate for the Mafs draggable angle lab (handoff §10 items 3 and 6).

Item 3 asked for the lab to be exercised under real interaction; item 6 asked
whether Mafs 0.21.0's React peer range (one transitive resize package lists React
through 18, while this app runs React 19) actually breaks at runtime. A build
passing does not answer item 6 — only mounting Mafs and driving it does, because
the peer-range risk is a runtime resize-observer path, not a compile-time one.

Run the dev server with ephemeral Workers state so the test never touches the
database:

    cd cybersuraksha
    CYBERSURAKSHA_EPHEMERAL_WORKERS=1 npm run dev -- --port 4180 -H 0.0.0.0

then:

    PLAYWRIGHT_BROWSERS_PATH=/home/$USER/.cache/ms-playwright \
    /scratch/$USER/envs/playwright/bin/python tests/trig-angle-lab-browser.py

Exits non-zero on the first failure so it is usable as a CI gate.

NOTE ON SAFARI: item 3 also asked for Safari. WebKit cannot be driven on this
Linux host, so this gate covers Chromium only. The Safari half is still open.
"""
import sys
from playwright.sync_api import sync_playwright
import os

BASE = "http://localhost:4180"
URL = (
    f"{BASE}/grade/10/mathematics/introduction-to-trigonometry"
    "?role=student&studentId=1&className=7A"
)
# The lab lives inside the 0°/90° topic, which is reached by clicking the chapter
# rail — there is no topic query parameter.
TOPIC = "Ratios of 0"


def open_topic(page):
    page.goto(URL, wait_until="domcontentloaded", timeout=120_000)
    # Wait for hydration before clicking. Clicking straight after
    # domcontentloaded lands on a not-yet-interactive rail and silently does
    # nothing, so the lab never mounts and the failure looks like a missing
    # component rather than a mis-timed click.
    btn = page.get_by_role("button", name=TOPIC, exact=False).first
    btn.wait_for(state="visible", timeout=60_000)
    page.wait_for_timeout(2500)
    btn.click()
    page.wait_for_timeout(2500)

failures = []
notes = []


def check(label, condition, detail=""):
    if condition:
        print(f"ok   {label}")
    else:
        print(f"FAIL {label}  {detail}")
        failures.append(f"{label}: {detail}")


with sync_playwright() as p:
    browser = p.chromium.launch()
    console_errors = []

    def run(page):
        page.on("console", lambda m: m.type == "error" and console_errors.append(m.text))
        page.on("pageerror", lambda e: console_errors.append(str(e)))
        open_topic(page)

        lab = page.locator("[data-angle-lab]")
        lab.wait_for(state="visible", timeout=60_000)
        lab.scroll_into_view_if_needed()

        # Mafs actually mounted. If the React 19 peer range were broken at
        # runtime this is where it would show: no SVG, or a crashed subtree.
        # .MafsView svg, not the first svg in the lab — the first svg is a 17px
        # lucide play icon in the tour controls.
        svg = lab.locator(".MafsView svg").first
        check("Mafs geometry mounted", svg.count() > 0)
        box = svg.bounding_box()
        check("geometry has real size", bool(box) and box["width"] > 100 and box["height"] > 100,
              f"box={box}")

        slider = page.locator("#trig-angle-control")
        readout = page.locator("#trig-angle-control ~ output, label[for='trig-angle-control'] output").first

        # ── slider drives the angle ──────────────────────────────────────────
        slider.fill("30")
        page.wait_for_timeout(400)
        check("slider sets 30°", "30" in readout.inner_text(), readout.inner_text())

        # ── presets ──────────────────────────────────────────────────────────
        presets = page.locator("[aria-label='Standard-angle shortcuts'] button")
        n = presets.count()
        check("five presets present", n == 5, f"found {n}")
        for want in ("0°", "45°", "90°"):
            presets.filter(has_text=want).first.click()
            page.wait_for_timeout(900)          # animateTo tweens
            got = readout.inner_text()
            check(f"preset {want} applies", want.rstrip("°") in got, f"readout={got}")

        # ── tan 90° must read "not defined", never Infinity or NaN ───────────
        presets.filter(has_text="90°").first.click()
        page.wait_for_timeout(900)
        body = lab.inner_text()
        check("tan 90° reads 'not defined'", "not defined" in body)
        check("no Infinity/NaN leaked into readouts",
              "Infinity" not in body and "NaN" not in body)

        # ── drag the point along the arc ─────────────────────────────────────
        # Grab Mafs's own hitbox rather than guessing a spot on the canvas.
        presets.filter(has_text="45°").first.click()
        page.wait_for_timeout(900)
        before = readout.inner_text()
        hit = lab.locator(".mafs-movable-point-hitbox").first
        hb = hit.bounding_box()
        cx, cy = hb["x"] + hb["width"] / 2, hb["y"] + hb["height"] / 2
        sb = svg.bounding_box()
        page.mouse.move(cx, cy)
        page.mouse.down()
        # toward the top of the canvas = toward 90 degrees
        page.mouse.move(cx - sb["width"] * 0.12, cy - sb["height"] * 0.22, steps=25)
        page.mouse.up()
        page.wait_for_timeout(600)
        after = readout.inner_text()
        check("dragging the point changes the angle", before != after,
              f"before={before} after={after}")

        # keyboard operability: Mafs gives the point tabindex=0 and arrow keys
        page.locator(".mafs-movable-point").first.focus()
        kb_before = readout.inner_text()
        for _ in range(6):
            page.keyboard.press("ArrowLeft")
        page.wait_for_timeout(500)
        check("arrow keys move the point (keyboard accessible)",
              readout.inner_text() != kb_before,
              f"before={kb_before} after={readout.inner_text()}")

        # ── narrated tour: 8 teaching moments ────────────────────────────────
        dots = page.locator("[aria-label='Teaching moments'] button")
        d = dots.count()
        check("eight teaching moments", d == 8, f"found {d}")
        dots.nth(3).click()
        page.wait_for_timeout(600)
        check("selecting a moment marks it current",
              dots.nth(3).get_attribute("aria-current") == "step")

        nxt = page.get_by_label("Next teaching moment")
        nxt.click()
        page.wait_for_timeout(600)
        check("next advances the tour",
              dots.nth(4).get_attribute("aria-current") == "step")

        audio_src = page.evaluate(
            "() => { const a = document.querySelector('[data-angle-lab] audio');"
            "return a ? a.getAttribute('src') || a.currentSrc : null; }")
        check("tour beat has narration wired", bool(audio_src), f"src={audio_src}")

        page.screenshot(path=os.path.expandvars("/scratch/$USER/CyberSuraksha/tmp-angle-lab.png"), full_page=False)

    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    print("── desktop 1440x1000 ──")
    run(page)
    page.close()

    # ── mobile layout (item 3 asked for it explicitly) ───────────────────────
    print("── mobile 390x844 ──")
    m = browser.new_page(viewport={"width": 390, "height": 844},
                         is_mobile=True, has_touch=True)
    open_topic(m)
    lab = m.locator("[data-angle-lab]")
    lab.wait_for(state="visible", timeout=60_000)
    lab.scroll_into_view_if_needed()
    lb = lab.bounding_box()
    check("lab fits the mobile viewport width", lb["width"] <= 390 + 1,
          f"width={lb['width']}")
    doc_w = m.evaluate("() => document.documentElement.scrollWidth")
    check("no horizontal page overflow on mobile", doc_w <= 390 + 1, f"scrollWidth={doc_w}")
    m.screenshot(path=os.path.expandvars("/scratch/$USER/CyberSuraksha/tmp-angle-lab-mobile.png"), full_page=False)
    m.close()

    # ── reduced motion ───────────────────────────────────────────────────────
    print("── prefers-reduced-motion: reduce ──")
    r = browser.new_page(viewport={"width": 1440, "height": 1000},
                         reduced_motion="reduce")
    open_topic(r)
    rl = r.locator("[data-angle-lab]")
    rl.wait_for(state="visible", timeout=60_000)
    check("lab renders under reduced motion", rl.is_visible())
    r.close()

    browser.close()

real_errors = [e for e in console_errors if "favicon" not in e.lower()]
check("no console or page errors", not real_errors, f"{real_errors[:3]}")

print()
if notes:
    print("Notes (not failures):")
    for n_ in notes:
        print(f"  - {n_}")
if failures:
    print(f"\n{len(failures)} FAILED:")
    for f in failures:
        print(f"  - {f}")
    sys.exit(1)
print("angle lab OK (Chromium; Safari not coverable on Linux)")
