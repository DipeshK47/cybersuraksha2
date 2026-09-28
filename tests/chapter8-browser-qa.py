"""End-to-end browser gate for the Class 10 Chapter 8 lesson page.

This is the browser half of the Chapter 8 test suite; the node tests cover the
rendered markup, this drives the real player. It is kept in the repo rather than
/tmp so a restart cannot lose it.

Run the dev server with ephemeral Workers state so the test never touches the
database:

    cd cybersuraksha
    CYBERSURAKSHA_EPHEMERAL_WORKERS=1 npm run dev -- --port 4180

then, in a second terminal:

    /tmp/cybersuraksha-playwright-venv/bin/python tests/chapter8-browser-qa.py

Exits non-zero on the first failed assertion, so it is usable as a CI gate.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://localhost:4180"
URL = (
    f"{BASE}/grade/10/mathematics/introduction-to-trigonometry"
    "?role=student&studentId=1&className=7A"
)
OUT = Path("/tmp/cybersuraksha-chapter8-browser-qa")
OUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1100})
    console_errors = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: console_errors.append(str(error)))

    page.goto(URL, wait_until="domcontentloaded", timeout=120_000)
    page.get_by_text("Ratios of 45°", exact=True).first.wait_for(timeout=120_000)
    page.wait_for_timeout(5_000)  # wait for the Vinext client boundary to hydrate
    page.get_by_role("button", name="Ratios of 45°", exact=False).click()
    page.get_by_role("heading", name="Ratios of 45°", exact=True).wait_for()
    assert page.get_by_role("heading", name="Ratios of 45°", exact=True).is_visible()

    video = page.locator("video").first
    video.wait_for(state="visible")
    page.wait_for_function("document.querySelector('video')?.duration > 200")
    video_state = video.evaluate(
        "el => ({duration: el.duration, videoWidth: el.videoWidth, src: el.currentSrc})"
    )
    assert video_state["duration"] > 200
    assert video_state["videoWidth"] >= 1280
    assert video_state["src"].endswith("lesson-8-3-45.mp4")

    recap = page.get_by_label("Step-by-step animated explanation").first
    recap.scroll_into_view_if_needed()
    audio = recap.locator("audio")
    assert audio.count() == 1
    assert "/audio/chapter8/8-3-001.mp3" in (audio.get_attribute("src") or "")
    page.wait_for_function("document.querySelector('audio')?.readyState >= 3")

    recap.get_by_role("button", name="Play explanation").click()
    page.wait_for_timeout(1400)
    moving_time = audio.evaluate("el => el.currentTime")
    assert moving_time > 0.45
    recap.get_by_role("button", name="Pause explanation").click()
    frozen_time = audio.evaluate("el => el.currentTime")
    page.wait_for_timeout(500)
    assert abs(audio.evaluate("el => el.currentTime") - frozen_time) < 0.15

    assert recap.get_by_text("PREDICT", exact=True).is_visible()
    slider = recap.get_by_label("Teaching-step progress")
    slider.fill("800")
    page.wait_for_timeout(250)
    assert recap.get_by_text("equal halves ⇒ equal legs?", exact=True).is_visible()

    recap.get_by_role("button", name="Next teaching step").click()
    page.wait_for_timeout(300)
    assert "/audio/chapter8/8-3-002.mp3" in (recap.locator("audio").get_attribute("src") or "")
    assert recap.get_by_text("Reveal: yes.", exact=False).is_visible()

    q2_tab = page.get_by_role("tab", name="NCERT Ex 8.2 · Q2(ii)")
    q2_tab.click()
    assert q2_tab.get_attribute("aria-selected") == "true"
    assert page.get_by_text("Example 2 of 2", exact=False).is_visible()

    solved = page.get_by_text("Example 2 of 2", exact=False).locator(
        "xpath=following::*[@aria-label='Step-by-step animated explanation'][1]"
    )
    assert solved.get_by_text("Teacher's route", exact=True).is_visible()
    assert solved.get_by_role("group", name="Teaching pace").is_visible()
    solved.get_by_role("button", name="Next teaching step").click()
    page.wait_for_timeout(250)
    solved.get_by_role("button", name="Next teaching step").click()

    # Q2(ii) is (1 - tan^2 45)/(1 + tan^2 45), which is solved by substituting the
    # table value tan 45 = 1, not by applying 1 + tan^2 A = sec^2 A. recallFromSteps
    # deliberately ranks exact table values above identity prompts for numerical
    # examples (iso3d.tsx), so the gate asks for tan 45 here.
    checkpoint = solved.get_by_role("region", name="Quick recall: what is tan 45°?")
    assert checkpoint.is_visible()
    checkpoint.get_by_role("button", name="√3", exact=True).click()
    assert checkpoint.get_by_text("Not yet", exact=False).is_visible()
    checkpoint.get_by_role("button", name="Try again", exact=True).click()
    checkpoint.get_by_role("button", name="1", exact=True).click()
    checkpoint.get_by_role("button", name="Continue the calculation", exact=False).click()
    page.wait_for_timeout(250)
    assert solved.get_by_text("Substitute carefully", exact=False).is_visible()

    assert page.get_by_text("Question 1 of 6", exact=False).is_visible()
    assert page.get_by_text("Question 2 of 6", exact=False).count() == 0
    # Practice is ONE SHOT. A wrong answer scores zero, teaches inline, and
    # locks — it does not open a dialog offering another guess, so the old
    # "click wrong, dismiss, click right" path no longer exists.
    page.get_by_role("button", name="√2", exact=True).last.click()
    page.wait_for_timeout(500)
    body = page.inner_text("body")
    assert "A different one" not in body, "the second-chance dialog came back"
    assert "0 for this question" in body, "a wrong answer must say it scored nothing"

    choices = page.locator("[aria-label='Choose one answer']").last
    locked = choices.get_by_role("button")
    assert all(locked.nth(i).is_disabled() for i in range(locked.count())), \
        "a wrong answer must lock every option"
    # The real answer is stated rather than left for a retry to discover.
    # Lower-cased: the label is uppercased by CSS, not in the markup.
    assert "the answer was" in choices.locator("xpath=..").inner_text().lower()

    solution = page.get_by_text("Why this works", exact=True).locator("xpath=ancestor::section[1]")
    assert solution.is_visible()
    assert solution.locator("li").count() == 3
    page.get_by_role("button", name="Next question").click()
    assert page.get_by_text("Question 2 of 6", exact=False).is_visible()

    page.screenshot(path=str(OUT / "topic-45-full.png"), full_page=True)
    assert not console_errors, console_errors
    browser.close()

print(f"PASS: video={video_state}, audio progressed to {moving_time:.2f}s, no console errors")
print(OUT / "topic-45-full.png")
