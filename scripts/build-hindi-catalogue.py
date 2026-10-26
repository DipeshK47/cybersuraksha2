"""Offline catalogue preparation; the app never calls a translation service.

Only authored source copy is translated. Never use this on learner records.
The cache makes interrupted runs resumable; editorial overrides win at runtime.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.request import Request,urlopen
from urllib.parse import urlencode
import json,re,time,random
from hindi_style import conversational_hindi

ROOT=Path(__file__).resolve().parent.parent
WORK=ROOT/'tmp/i18n'
catalogue=json.loads((WORK/'catalogue.json').read_text())
cache_path=WORK/'hi-cache.json'
cache=json.loads(cache_path.read_text()) if cache_path.exists() else {}
def faithful(source,translation):
    return bool(translation.strip()) and sorted(re.findall(r'\d+(?:[.,:]\d+)*',source))==sorted(re.findall(r'\d+(?:[.,:]\d+)*',translation)) and sorted(re.findall(r'\{\{\d+\}\}',source))==sorted(re.findall(r'\{\{\d+\}\}',translation))
cache={source:translation for source,translation in cache.items() if faithful(source,translation)}
# The shipped catalogue is also the durable translation store, so reviewed copy
# survives deleting the disposable offline cache.
published=ROOT/'public/locales/hi.json'
if published.exists():
    cache.update({source:translation for source,translation in json.loads(published.read_text())['messages'].items() if faithful(source,translation)})
overrides=json.loads((ROOT/'app/lib/i18n/hi-overrides.json').read_text())
cache.update({source:translation for source,translation in overrides.items() if faithful(source,translation)})

def translate(batch):
    if len(batch)==1 and not re.search(r'[A-Za-z]{3}',batch[0]): return {batch[0]:batch[0]}
    if len(batch)==1 and re.search(r'_{3,}',batch[0]):
        original=batch[0]
        sections=re.split(r'(_{3,})',original)
        return {original:' '.join(section if re.fullmatch(r'_{3,}',section) else translate([section.strip()])[section.strip()] for section in sections if section.strip())}
    if len(batch)==1 and len(batch[0])>1200:
        original=batch[0]
        middle=original.rfind(' ',0,1000)
        if middle>0:
            return {original:translate([original[:middle]])[original[:middle]]+' '+translate([original[middle+1:]])[original[middle+1:]]}
    # Fixed ASCII delimiters let the offline build detect omitted/reordered entries.
    protected=[]
    def protect(match):
        index=len(protected);protected.append(match.group(0));return f'QZPV{index:04}VPZQ'
    masked=[re.sub(r'\{\{\d+\}\}',protect,text) for text in batch]
    source='\n'.join(f'ZXQ{i:04}QXZ\n{text}' for i,text in enumerate(masked)) if len(batch)>1 else masked[0]
    url='https://translate.googleapis.com/translate_a/single?'+urlencode({'client':'gtx','sl':'en','tl':'hi','dt':'t','q':source})
    for attempt in range(4):
        try:
            request=Request(url,headers={'User-Agent':'Mozilla/5.0'})
            with urlopen(request,timeout=45) as response: result=json.load(response)
            text=''.join(item[0] for item in result[0] if item[0])
            retained=[int(match.group(1)) for match in re.finditer(r'QZPV\s*(\d{4})\s*VPZQ',text,re.I)]
            if sorted(retained)!=list(range(len(protected))): raise ValueError('Translation changed protected numbers or slots')
            text=re.sub(r'QZPV\s*(\d{4})\s*VPZQ',lambda match:protected[int(match.group(1))],text,flags=re.I)
            markers=list(re.finditer(r'ZXQ\s*(\d{4})\s*QXZ',text))
            if len(batch)==1:
                if sorted(re.findall(r'\{\{\d+\}\}',batch[0]))!=sorted(re.findall(r'\{\{\d+\}\}',text)): raise ValueError('Translation changed template placeholders')
                if sorted(re.findall(r'\d+(?:[.,:]\d+)*',batch[0]))!=sorted(re.findall(r'\d+(?:[.,:]\d+)*',text)): raise ValueError('Translation changed a number')
                return {batch[0]:text.strip()}
            if len(markers)!=len(batch): raise ValueError('Translation omitted a batch delimiter')
            output={}
            for index,marker in enumerate(markers):
                number=int(marker.group(1)); translated=text[marker.end():markers[index+1].start() if index+1<len(markers) else len(text)].strip()
                original=batch[number]
                original_slots=re.findall(r'\{\{\d+\}\}',original)
                translated=re.sub(r'\{\s*\{\s*(\d+)\s*\}\s*\}',r'{{\1}}',translated)
                if sorted(original_slots)!=sorted(re.findall(r'\{\{\d+\}\}',translated)): raise ValueError('Translation changed template placeholders')
                if sorted(re.findall(r'\d+(?:[.,:]\d+)*',original))!=sorted(re.findall(r'\d+(?:[.,:]\d+)*',translated)): raise ValueError('Translation changed a number')
                if not translated: raise ValueError('Empty translation')
                output[original]=translated
            return output
        except Exception as error:
            if isinstance(error,ValueError) or attempt==3:
                if len(batch)>1:
                    middle=len(batch)//2
                    return translate(batch[:middle])|translate(batch[middle:])
                if isinstance(error,ValueError) and len(batch[0])>8:
                    original=batch[0]; middle=original.rfind(' ',0,len(original)//2)
                    if middle>0: return {original:translate([original[:middle]])[original[:middle]]+' '+translate([original[middle+1:]])[original[middle+1:]]}
                if len(batch)==1 and not re.search(r'\s',batch[0]) and re.search(r'\d',batch[0]): return {batch[0]:batch[0]}
                if isinstance(error,ValueError): print('Protected fragment needs review:',repr(batch[0]),repr(text),flush=True)
                raise
            time.sleep(min(20,2**attempt)+random.random())

missing=[text for text in catalogue['messages'] if text not in cache]
batches=[]; batch=[]; length=0
for text in missing:
    if batch and length+len(text)>2600: batches.append(batch);batch=[];length=0
    batch.append(text);length+=len(text)+20
if batch: batches.append(batch)
print(f'Preparing {len(missing)} messages in {len(batches)} offline batches',flush=True)
failures=[]
with ThreadPoolExecutor(max_workers=3) as pool:
    futures={pool.submit(translate,batch):batch for batch in batches}
    for index,future in enumerate(as_completed(futures),1):
        try:
            result=future.result()
            cache.update(result)
            temporary=WORK/'hi-cache-next.json'
            temporary.write_text(json.dumps(cache,ensure_ascii=False,sort_keys=True))
            temporary.replace(cache_path)
        except Exception as error:
            failures.append({'messages':futures[future],'error':str(error)})
        if index%10==0 or index==len(futures): print(f'{index}/{len(futures)} batches; {len(cache)} messages cached',flush=True)
if failures:
    (WORK/'needs-review.json').write_text(json.dumps(failures,ensure_ascii=False,indent=2))
    raise RuntimeError(f'{len(failures)} batches need review; completed messages are cached')
out=ROOT/'public/locales'
out.mkdir(parents=True,exist_ok=True)
messages={text:conversational_hindi(text,overrides.get(text,cache[text])) for text in catalogue['messages']}
assert all(faithful(source,translation) for source,translation in messages.items())
templates=[{'source':item['source'],'parts':item['parts'],'translation':messages[item['source']]} for item in catalogue['templates']]
(out/'hi.json').write_text(json.dumps({'messages':messages,'templates':templates},ensure_ascii=False,separators=(',',':')))
handbook=json.loads((ROOT/'app/data/handbook-chat-index.json').read_text())
handbook_hi={f"{page['documentId']}:{page['pdfPage']}":messages.get(re.sub(r'\s+',' ',page['text']).strip(),page['text']) for page in handbook}
(ROOT/'app/data/handbook-hi.json').write_text(json.dumps(handbook_hi,ensure_ascii=False,separators=(',',':')))
print(f'Saved {len(messages)} local Hindi messages and {len(templates)} templates',flush=True)
