#!/usr/bin/env python3
"""Join per-scene Hindi narration clips into one story-hi.mp3 per lesson and write the cue manifest.

    python3 scripts/build-hindi-story-audio.py --clips <folder with the scene MP3s> [--scene6 english|silent] [--slugs a,b]

Input   <clips>/**/<lesson-slug>-hi-01.mp3 ... -05.mp3   (and optionally -06.mp3)
Output  public/audio/cyber/<lesson-slug>/story-hi.mp3     (next to the English story.mp3)
        app/module/cyber/lessons/new/story/hindi-audio.generated.json   (slug -> src, duration, scene cues)

The story player plays one track per lesson and seeks to each scene's cue, exactly as it does for the
English story.mp3, so the Hindi track keeps the house 0.65 s gap between scenes and its cue times come
from the real decoded clip lengths (never from the English timings).

Scene 06 (the Practice Lab intro) was not voiced in the first batch. Until `<slug>-hi-06.mp3` exists the
track uses `--scene6 english` (the English narration of that scene, cut from story.mp3 - the default) or
`--scene6 silent` (silence of the same length). Re-run this script once Hindi scene 06 clips exist and
they replace the fallback automatically. Existing manifest entries for other lessons are kept.
Needs ffmpeg and ffprobe on PATH.
"""
import argparse, json, subprocess, sys, tempfile, wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHAPTERS = ROOT / 'app/module/cyber/lessons/new/story/chapters'
MANIFEST = ROOT / 'app/module/cyber/lessons/new/story/hindi-audio.generated.json'
AUDIO = ROOT / 'public/audio/cyber'
RATE, GAP = 48000, 0.65          # house settings, see scripts/story-narration.py
FFMPEG = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y']
LEVEL = 'loudnorm=I=-18:TP=-1.5:LRA=11'   # same loudness as the English tracks
SILENCE = b'\0\0' * int(RATE * GAP)


def decode(path, start=None, length=None):
    """Clip -> 48 kHz mono 16-bit PCM bytes at the house loudness."""
    seek = ['-ss', str(start), '-t', str(length)] if start is not None else []
    out = subprocess.run(FFMPEG + seek + ['-i', str(path), '-af', LEVEL, '-ar', str(RATE), '-ac', '1', '-f', 's16le', '-'],
                         capture_output=True, check=True)
    return out.stdout


def duration(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(path)],
                         capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


def build(slug, clips, scene6):
    chapter = json.loads((CHAPTERS / f'{slug}.json').read_text(encoding='utf-8'))
    english = AUDIO / slug / 'story.mp3'
    count = len(chapter['scenes'])
    pcm = []
    for n in range(1, count + 1):
        clip = clips.get((slug, n))
        if clip:
            pcm.append(decode(clip))
        elif n == count and scene6 == 'english':
            cue = chapter['scenes'][-1]
            pcm.append(decode(english, cue['start'], cue['duration']))
        elif n == count and scene6 == 'silent':
            pcm.append(b'\0\0' * int(RATE * chapter['scenes'][-1]['duration']))
        else:
            raise SystemExit(f'{slug}: no clip for scene {n}')
    cues, time, track = [], 0.0, bytearray()
    for data in pcm:
        length = len(data) / 2 / RATE
        cues.append({'start': round(time, 6), 'duration': round(length, 6)})
        track += data + SILENCE
        time += length + GAP
    out = AUDIO / slug / 'story-hi.mp3'
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / 'story.wav'
        with wave.open(str(wav), 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE); w.writeframes(bytes(track))
        subprocess.run(FFMPEG + ['-i', str(wav), '-ar', str(RATE), '-ac', '1', '-b:a', '128k', str(out)], check=True)
    actual = duration(out)
    if abs(actual - time) > 0.15:
        raise SystemExit(f'{slug}: encoded length {actual:.3f}s differs from cue timeline {time:.3f}s')
    fallback = clips.get((slug, count)) is None
    return {'src': f'/audio/cyber/{slug}/story-hi.mp3', 'duration': round(time, 6), 'scenes': cues}, fallback


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--clips', required=True, type=Path)
    parser.add_argument('--scene6', choices=['english', 'silent'], default='english')
    parser.add_argument('--slugs', help='comma-separated lesson slugs (default: every lesson with clips 01-05)')
    args = parser.parse_args()

    clips = {}
    for path in args.clips.rglob('*-hi-[0-9][0-9].mp3'):
        slug, _, number = path.stem.rpartition('-hi-')
        clips[(slug, int(number))] = path
    slugs = sorted({slug for slug, _ in clips})
    if args.slugs:
        slugs = [s for s in args.slugs.split(',') if s]
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8')) if MANIFEST.exists() else {}
    built = fallbacks = 0
    for slug in slugs:
        if not (CHAPTERS / f'{slug}.json').exists():
            print(f'skip {slug}: no story chapter'); continue
        if not all((slug, n) in clips for n in range(1, 6)):
            print(f'skip {slug}: needs clips 01-05'); continue
        entry, fallback = build(slug, clips, args.scene6)
        manifest[slug] = entry
        built += 1; fallbacks += fallback
        print(f'{slug:<48} {entry["duration"]:7.2f}s' + ('  (scene 06 fallback: ' + args.scene6 + ')' if fallback else ''), flush=True)
    MANIFEST.write_text(json.dumps(dict(sorted(manifest.items())), ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'built {built} lessons ({fallbacks} with a scene 06 fallback); manifest has {len(manifest)} lessons')


if __name__ == '__main__':
    sys.exit(main())
