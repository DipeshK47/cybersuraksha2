"""Real-media regression for immediate exploration after a rounded scene seek.

BASE_URL=http://localhost:3218 ITERATIONS=30 /path/to/playwright/python tests/class-10-exploration-race-qa.py
Uses fresh authenticated headless contexts, native audio and actual controls.
No media mocks, playback delays or changes to the full animation harness.
"""
import json
import os
import re
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

expect.set_options(timeout=60000)

BASE = os.environ.get('BASE_URL', 'http://localhost:3218')
assert re.fullmatch(r'http://(localhost|127\.0\.0\.1):\d+', BASE), 'Use disposable localhost'
SLUG = 'class10-ai-moving-window'
ROOT = Path(__file__).resolve().parent.parent
SCRIPT = json.loads((ROOT / 'app/module/cyber/lessons/new/story/chapters' / f'{SLUG}.json').read_text())
BOUNDARY = SCRIPT['scenes'][3]['start']
INSTRUMENT = r'''(() => {
 window.race=[];
 const snapshot=event=>{
  const a=document.querySelector('audio'),s=document.querySelector('[data-story-player]'),e=document.querySelector('[data-class10-explanation]');
  window.race.push({event,at:performance.now(),paused:a?.paused,time:a?.currentTime,ready:a?.readyState,story:s?.dataset.scene,playing:s?.dataset.playing,mode:e?.dataset.mode,visual:e?.dataset.visualScene});
 };
 for(const event of ['play','playing','pause','seeking','seeked','timeupdate','waiting'])
  document.addEventListener(event,e=>{if(e.target.tagName==='AUDIO')snapshot(event)},true);
 document.addEventListener('click',e=>{const b=e.target.closest('button');if(b)snapshot('click:'+b.textContent)},true);
 new MutationObserver(changes=>{if(changes.some(c=>c.target.matches?.('[data-story-player],[data-class10-explanation]')))snapshot('mutation')})
  .observe(document,{subtree:true,attributes:true,attributeFilter:['data-scene','data-playing','data-mode','data-visual-scene']});
})()'''

with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=True)
    # Authenticate once; share cookies only, keeping every course context fresh.
    auth = browser.new_context()
    assert auth.request.post(BASE+'/api/auth/teacher', data={'email':'teacher@dpsrkp.edu.in','password':'Teacher@123'}).status == 200
    cookies = auth.cookies()
    auth.close()
    iterations = int(os.environ.get('ITERATIONS', '30'))
    rounded = 0
    for iteration in range(iterations + 1):
        context = browser.new_context(viewport={'width':1440,'height':1000})
        context.add_cookies(cookies)
        page = context.new_page()
        page.add_init_script(INSTRUMENT)
        page.set_default_timeout(30000)
        events, errors = [], []
        page.on('pageerror', lambda error: errors.append(str(error)))
        def activity(request):
            if request.method == 'POST' and request.url.endswith('/api/activity'):
                body = request.post_data_json
                events.extend(row.get('type') for row in body.get('events', [body]))
        page.on('request', activity)
        try:
            page.goto(BASE+f'/module/cyber/{SLUG}?role=teacher&grade=10')
            story = page.locator(f'[data-story-player="{SLUG}"]')
            explanation = story.locator('[data-class10-explanation]')
            expect(story).to_be_visible()
            page.wait_for_function('()=>{const a=document.querySelector("audio");return a&&a.readyState>=1&&Number.isFinite(a.duration)&&a.duration>0}')
            # The final context deterministically preserves the native rounded
            # seek by pausing on the first actual play event. No event is mocked.
            if iteration == iterations:
                story.locator('audio').evaluate('a=>a.addEventListener("play",()=>a.pause(),{once:true})')
            story.locator('nav button').nth(5).click()
            expect(story).to_have_attribute('data-scene', '3')
            expect(story).to_have_attribute('data-solved', 'false')
            if iteration == iterations:
                page.wait_for_function('()=>window.race.some(e=>e.event==="pause")')
                expect(story).to_have_attribute('data-scene', '3')
            story.get_by_role('button', name='Top-left window', exact=True).click()
            # Wait for the actual cancellation event, not a time delay.
            page.wait_for_function('()=>window.race.some(e=>e.event==="pause")')
            expect(explanation).to_have_attribute('data-mode', 'explore')
            expect(explanation).to_have_attribute('data-visual-scene', '2')
            expect(explanation).to_have_attribute('data-step', '1')
            expect(story).to_have_attribute('data-scene', '3')
            expect(story).to_have_attribute('data-solved', 'false')
            expect(story).to_have_attribute('data-playing', 'false')
            assert '10+20+40+50 = 120' in explanation.inner_text()
            assert not [event for event in events if event in ('story_answered','question_answered')]
            trace = page.evaluate('window.race')
            assert not [row for row in trace if row['story']=='2'], trace
            rounded += any(row['time'] is not None and 0 < BOUNDARY-row['time'] < .0000011 for row in trace)
            # Explicit transport play and Follow narration must still return
            # to authoritative audio after local exploration.
            if iteration == 0:
                story.get_by_role('button', name='Play story', exact=True).click()
                expect(explanation).to_have_attribute('data-mode', 'follow')
                page.wait_for_function('t=>document.querySelector("audio").currentTime>t', arg=BOUNDARY+.02)
                story.get_by_role('button', name='Top-left window', exact=True).click()
                expect(explanation).to_have_attribute('data-mode', 'explore')
                explanation.locator('[data-control="follow"]').click()
                expect(explanation).to_have_attribute('data-mode', 'follow')
                expect(story).to_have_attribute('data-playing', 'true')
            assert not errors, errors
            print(f'PASS context {iteration+1}: '+('native early pause' if iteration==iterations else 'immediate exploration'), flush=True)
        except Exception:
            print('PAGE ERRORS', errors, flush=True)
            print('VITE OVERLAY', page.locator('vite-error-overlay').evaluate_all('els=>els.map(e=>e.shadowRoot?.textContent)'), flush=True)
            print(json.dumps(page.evaluate('window.race'), indent=2), flush=True)
            raise
        finally:
            context.close()
    browser.close()
    print(f'PASS {iterations} immediate interactions + 1 native early pause; rounded seek observed in {rounded}/{iterations+1} contexts', flush=True)
