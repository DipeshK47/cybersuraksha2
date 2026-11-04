"""Top bar regression against disposable localhost only.
BASE_URL=http://localhost:3218 python3 tests/top-bar-browser-qa.py

At every common screen width the bar must stay on one row from 900px up, and below that it
must stack into tidy tiers, with every control inside the bar and nothing hanging off screen.
"""
import os
import re
from playwright.sync_api import sync_playwright

BASE = os.environ.get('BASE_URL', 'http://localhost:3218')
assert re.fullmatch(r'http://(localhost|127\.0\.0\.1):\d+', BASE)
WIDTHS = [1920, 1680, 1536, 1440, 1366, 1280, 1180, 1100, 1024, 900, 899, 820, 768, 600, 480, 390, 360, 320]
PAGES = [
    ('dashboard', '/dashboard?role=teacher', '.dashboardNav', '.dashboardWrap'),
    ('class', '/grade/6/cybersecurity?role=teacher', '.gradeNav', '.gradeShell'),
    ('roster', '/teach', '.teacherHeader', '.teacherShell'),
]

MEASURE = '''([selector, content]) => {
  const bar = document.querySelector(selector);
  // Controls only: the language slot counts once, not its inner buttons.
  const items = [...bar.querySelectorAll('a, button, .dashboardOrg, [data-language-slot], .gradeNav > div > span')]
    .filter(e => !e.closest('[data-language-slot]') || e.matches('[data-language-slot]'))
    .filter(e => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().height > 0);
  const tops = items.map(e => e.getBoundingClientRect().top).sort((a, b) => a - b);
  let rows = 0, last = -1e9;
  for (const t of tops) { if (t - last > 10) rows++; last = t; }
  const bottom = bar.getBoundingClientRect().bottom;
  const logo = bar.querySelector('img') || bar.querySelector('a');
  return {
    rows,
    spill: items.filter(e => e.getBoundingClientRect().bottom > bottom + 1).length,
    sideways: document.documentElement.scrollWidth > innerWidth,
    edgeGap: Math.round(logo.getBoundingClientRect().left - document.querySelector(content).getBoundingClientRect().left),
  };
}'''

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel='chrome')
    context = browser.new_context(viewport={'width': 1440, 'height': 900})
    assert context.request.post(BASE + '/api/auth/teacher', data={'email': 'admin@dpsrkp.edu.in', 'password': 'Admin@123'}).status == 200
    page = context.new_page()
    failures = []
    for name, path, selector, content in PAGES:
        page.goto(BASE + path, timeout=120000)
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(1500)
        for width in WIDTHS:
            page.set_viewport_size({'width': width, 'height': 900})
            page.wait_for_timeout(250)
            m = page.evaluate(MEASURE, [selector, content])
            where = f'{name} @ {width}px {m}'
            if width >= 900 and m['rows'] != 1:
                failures.append(f'wraps: {where}')
            if m['spill']:
                failures.append(f'controls spill out of the bar: {where}')
            if m['sideways']:
                failures.append(f'page scrolls sideways: {where}')
            if width >= 900 and m['edgeGap'] != 0:
                failures.append(f'bar edge does not line up with the page: {where}')
        print(f'{name}: {len(WIDTHS)} widths checked', flush=True)
    browser.close()
    assert not failures, '\n'.join(failures)
print('Top bar holds at every width.')
