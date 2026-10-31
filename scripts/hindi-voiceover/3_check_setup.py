"""Check the key, the model and both voices. Costs nothing."""
import sys, requests
import common


def main():
    h = common.headers()
    r = requests.get(f'{common.API}/v1/voices', headers=h, timeout=30)
    if r.status_code == 401:
        sys.exit('HTTP 401: wrong or deleted key')
    if not r.ok:
        sys.exit(f'Could not list voices (HTTP {r.status_code}). Set the key\'s Voices permission to Read.')
    mine = {v['name']: v['voice_id'] for v in r.json()['voices']}
    ok = True
    for key, name in common.VOICE_NAMES.items():
        if name in mine:
            print(f'voice {key}: "{name}" OK')
        else:
            ok = False
            cand = [n for n in mine if n.lower().startswith(key)]
            print(f'MISSING voice {key}: "{name}" is not in My Voices. Similar: {cand or "none"}')
    m = requests.get(f'{common.API}/v1/models', headers=h, timeout=30)
    if not m.ok:
        sys.exit(f'Could not list models (HTTP {m.status_code}). Set the key\'s Models permission to Access.')
    ids = [x['model_id'] for x in m.json()]
    if common.MODEL_ID in ids:
        print(f'model {common.MODEL_ID} OK')
    else:
        ok = False
        print(f'MISSING model {common.MODEL_ID}. Available: {ids}')
    sys.exit(print('Setup looks good.') if ok else 1)


if __name__ == '__main__':
    main()
