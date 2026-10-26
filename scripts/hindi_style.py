"""Keep authored Hindi conversational, with English subject terms in Devanagari.

Offline only. English source context prevents, for example, rewriting गोपनीयता
as confidentiality when the source actually means privacy.
"""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
RULES = []
for rule in json.loads((ROOT / 'app/lib/i18n/hi-terms.json').read_text()):
    source = re.compile(r'\b(?:' + rule['english'] + r')\b', re.I) if rule.get('english') else None
    forms = rule['forms']
    # Devanagari vowel marks are part of a word, even though Python's \w omits them.
    pattern = re.compile(r'(?<![\w\u0900-\u097f])(?:' + '|'.join(re.escape(word) for word in sorted(forms, key=len, reverse=True)) + r')(?![\w\u0900-\u097f])')
    RULES.append((source, pattern, forms))


def conversational_hindi(source, translation):
    for english, hindi, forms in RULES:
        if english is None or english.search(source):
            translation = hindi.sub(lambda match: forms[match.group()], translation)
    return translation


def preserved(source, translation):
    return bool(translation.strip()) and all(
        sorted(re.findall(pattern, source)) == sorted(re.findall(pattern, translation))
        for pattern in (r'\d+(?:[.,:]\d+)*', r'\{\{\d+\}\}')
    )


if __name__ == '__main__':
    catalogue_path = ROOT / 'public/locales/hi.json'
    overrides_path = ROOT / 'app/lib/i18n/hi-overrides.json'
    catalogue = json.loads(catalogue_path.read_text())
    overrides = json.loads(overrides_path.read_text())
    overrides = {source: conversational_hindi(source, text) for source, text in overrides.items()}
    revised = {source: conversational_hindi(source, overrides.get(source, text)) for source, text in catalogue['messages'].items()}
    assert all(preserved(source, text) for source, text in revised.items())
    assert all(preserved(source, text) for source, text in overrides.items())
    changed = sum(text != catalogue['messages'][source] for source, text in revised.items())
    catalogue['messages'] = revised
    for template in catalogue['templates']:
        template['translation'] = revised[template['source']]
    handbook = json.loads((ROOT / 'app/data/handbook-chat-index.json').read_text())
    handbook_hi = {f"{page['documentId']}:{page['pdfPage']}": revised[re.sub(r'\s+', ' ', page['text']).strip()] for page in handbook}
    overrides_path.write_text(json.dumps(overrides, ensure_ascii=False, indent=2) + '\n')
    catalogue_path.write_text(json.dumps(catalogue, ensure_ascii=False, separators=(',', ':')))
    (ROOT / 'app/data/handbook-hi.json').write_text(json.dumps(handbook_hi, ensure_ascii=False, separators=(',', ':')))
    print(f'Updated {changed} Hindi messages; templates, overrides and handbook excerpts are in sync.')
