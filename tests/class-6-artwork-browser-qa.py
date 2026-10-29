"""Check all Class 6 artwork on desktop/mobile using a disposable localhost server."""
import json
import os
from pathlib import Path
import re
import subprocess
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parent.parent
BASE = os.environ.get('BASE_URL', 'http://localhost:3226')
assert re.fullmatch(r'http://(localhost|127\.0\.0\.1):\d+', BASE)
OUT = ROOT / '.lms-qa/class6/artwork'
OUT.mkdir(parents=True, exist_ok=True)
NODE = os.environ['NODE24']
source = '''import {loadSource} from './tests/class-8-helpers.mjs';
const {class6Chapters, class6Artwork}=await loadSource('export {class6Chapters} from "./app/data/class6"; export {class6Artwork} from "./app/data/class6/artwork";');
console.log(JSON.stringify(class6Chapters.map(c=>({slug:c.slug,title:c.title,art:class6Artwork[c.slug]}))));'''
chapters = json.loads(subprocess.check_output([NODE, '--input-type=module', '-e', source], cwd=ROOT, text=True))
expect.set_options(timeout=30000)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel='chrome')
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
    assert context.request.post(BASE + '/api/auth/teacher', data={'email': 'teacher@dpsrkp.edu.in', 'password': 'Teacher@123'}).status == 200
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    def image_ready(image):
        expect(image).to_be_visible()
        image.evaluate('(img)=>img.scrollIntoView({block:"center"})')
        expect(image).to_have_js_property('complete', True)
        # With srcset width descriptors, naturalWidth is density-corrected for sizes.
        assert image.evaluate('(img)=>img.naturalWidth > 0'), image.get_attribute('src')
    def no_overflow():
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), page.url
    for subject in ['cybersecurity', 'artificial-intelligence', 'computational-thinking-lab', 'cyber-fraud']:
        page.set_viewport_size({'width': 1440, 'height': 1000})
        page.goto(BASE + f'/grade/6/{subject}?role=teacher', timeout=120000)
        page.wait_for_load_state('networkidle')
        cards = page.locator('.moduleNameCardPlayable')
        expect(cards).to_have_count(8)
        for i in range(8):
            image_ready(cards.nth(i).locator('img'))
        cards.first.focus()
        assert cards.first.evaluate('(el)=>getComputedStyle(el).outlineStyle') != 'none'
        page.evaluate('scrollTo(0,0)')
        page.screenshot(path=str(OUT / f'library-desktop-{subject}.png'), full_page=True)
        page.set_viewport_size({'width': 390, 'height': 1000})
        no_overflow()
        page.screenshot(path=str(OUT / f'library-mobile-{subject}.png'), full_page=True)
    for index, chapter in enumerate(chapters):
        slug = chapter['slug']
        page.set_viewport_size({'width': 1440, 'height': 1000})
        page.goto(BASE + f'/module/cyber/{slug}?grade=6&role=teacher', timeout=120000)
        page.wait_for_load_state('networkidle')
        story = page.locator(f'[data-story-player="{slug}"]')
        expect(story).to_be_visible()
        art = story.locator(f'[data-class6-artwork="{slug}"] img')
        image_ready(art)
        expect(art).to_have_attribute('alt', chapter['art']['alt']['en'])
        expect(story.locator('[data-story-actor]')).to_be_hidden()
        no_overflow()
        page.evaluate('scrollTo(0,0)')
        page.screenshot(path=str(OUT / f'desktop-story-{slug}.png'), full_page=True)
        page.set_viewport_size({'width': 390, 'height': 1000})
        image_ready(art)
        no_overflow()
        page.evaluate('scrollTo(0,0)')
        page.screenshot(path=str(OUT / f'mobile-story-{slug}.png'), full_page=True)
        page.get_by_role('button', name='हिन्दी', exact=True).click()
        expect(art).to_have_attribute('alt', chapter['art']['alt']['hi'])
        no_overflow()
        page.get_by_role('button', name='English', exact=True).click()
        page.get_by_role('button', name='Skip to practice', exact=True).click()
        practice = page.locator(f'[data-new-mission="{slug}"]')
        image_ready(practice.locator(f'[data-class6-artwork="{slug}"] img'))
        expect(practice.locator('[data-task-kind]')).to_be_visible()
        no_overflow()
        page.evaluate('scrollTo(0,0)')
        page.screenshot(path=str(OUT / f'mobile-practice-{slug}.png'), full_page=True)
        print(f'PASS {index+1}/32 {slug}: desktop/mobile artwork, Hindi alt, practice and layout', flush=True)
    assert not errors, errors
    print('PASS all 32 chapter images and 32 library previews; desktop/mobile stories and practice; Hindi descriptions; keyboard focus; no page errors', flush=True)
    browser.close()
