"""Parse the CyberShiksha Hindi narration PDF into scenes.json.

Usage: python 1_parse_pdf.py <pdf> <scenes.json>

Layout (PyMuPDF text, one item per line):
  CLASS 6 · CYBERSECURITY · CHAPTER 01 OF 08
  <English title> / <Hindi title>
  Lesson 01 of 32
  class6-private-information          <- slug
  SCENE 01
  <scene heading>
  [PAUSE FOR LEARNER CHOICE]          <- only on scene 04
  <narration text ...>

PyMuPDF is used because it keeps Devanagari vowel signs (ि ू ै ...) intact where
pdfminer/pdfplumber drop them and pdftotext inserts stray spaces.
"""
import json, re, sys
import pymupdf

HEAD = re.compile(r'^CLASS (\d+) · (.+?) · CHAPTER (\d+) OF (\d+)\s*$')
LESSON = re.compile(r'^Lesson (\d+) of (\d+)\s*$')
SCENE = re.compile(r'^SCENE (\d\d)\s*$')
FOOT = re.compile(r'^CyberShiksha · Hindi narration')
PAGENO = re.compile(r'^\d+ / \d+$')
PAUSE = 'PAUSE FOR LEARNER CHOICE'
# PyMuPDF repeats a dependent vowel sign / nukta inside some words (बड़ेे, मंज़ूूर,
# फ़ैैसला, विद्याार्थी). Hindi never repeats an identical sign, so collapse them.
# Also handles a repeated pair, e.g. ट्रांांज़ैक्शन -> ट्रांज़ैक्शन.
_SIGN = r'[\u093e-\u094c\u0901-\u0903\u093c\u0962\u0963]'
DOUBLED = re.compile(r'(' + _SIGN + r'{1,2})\1+')


def clean(t):
    return DOUBLED.sub(r'\1', t)


def lines(pdf):
    with pymupdf.open(pdf) as doc:
        for page in doc:
            for raw in page.get_text().split('\n'):
                line = clean(raw.strip())
                if line and not FOOT.match(line) and not PAGENO.match(line):
                    yield line


def main(pdf, out):
    lessons, cur, scene, state = [], None, None, None
    for line in lines(pdf):
        m = HEAD.match(line)
        if m:
            cur = dict(cls=int(m[1]), module=m[2].strip(), chapter=int(m[3]),
                       chapters_in_module=int(m[4]), titles=[], slug=None, scenes=[])
            lessons.append(cur); scene = None; state = 'titles'
            continue
        if cur is None:
            continue
        m = LESSON.match(line)
        if m:
            cur['lesson'] = int(m[1]); state = 'slug'; continue
        if state == 'slug':
            cur['slug'] = line; state = 'between'; continue
        m = SCENE.match(line)
        if m:
            scene = dict(n=int(m[1]), heading=None, pause=False, text=[])
            cur['scenes'].append(scene); state = 'heading'; continue
        if state == 'heading':
            scene['heading'] = line; state = 'body'; continue
        if state == 'body' and line == PAUSE and not scene['text']:
            scene['pause'] = True; continue
        if state == 'titles':
            cur['titles'].append(line)
        elif state == 'body':
            scene['text'].append(line)
    for l in lessons:
        for s in l['scenes']:
            s['text'] = ' '.join(s['text']).strip()
    json.dump(lessons, open(out, 'w'), ensure_ascii=False, indent=1)
    n_sc = sum(len(l['scenes']) for l in lessons)
    n_ch = sum(len(s['text']) for l in lessons for s in l['scenes'])
    print(f'{len(lessons)} lessons, {n_sc} scenes, {n_ch} characters')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
