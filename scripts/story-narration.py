"""Narrate one story chapter with the approved Rohan voice and write real cue times back to its script.

Usage (Kokoro lives in Codex's Python env):
  /Users/dipeshkumar/Documents/Codex/2026-09-27/do-u/work/piper-env/bin/python scripts/story-narration.py <lesson-slug>

Reads   app/module/cyber/lessons/new/story/chapters/<slug>.json  (each scene's `speech`, else `caption`)
Writes  public/audio/cyber/<slug>/story.mp3  and each scene's start/duration + total duration in the JSON.
Voice: Kokoro-82M `am_fenrir`, speed 0.92, 0.65 s between scenes, loudness -18 LUFS / -1.5 dBTP — same as Rohan.
"""
import fcntl
import json
import os
import pathlib
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = pathlib.Path(__file__).resolve().parent.parent
# Other machines (e.g. Claude cloud): set KOKORO_DIR to a folder with kokoro-v1.0.onnx + voices-v1.0.bin
# (https://github.com/thewh1teagle/kokoro-onnx/releases) and have ffmpeg on PATH.
VOICES = pathlib.Path(os.environ.get('KOKORO_DIR', '/Users/dipeshkumar/Documents/Codex/2026-09-27/do-u/work/voices'))
FFMPEG = os.environ.get('FFMPEG') or ('/opt/homebrew/bin/ffmpeg' if os.path.exists('/opt/homebrew/bin/ffmpeg') else 'ffmpeg')
GAP = 0.65

slug = sys.argv[1]
script_path = ROOT / 'app/module/cyber/lessons/new/story/chapters' / f'{slug}.json'
out_dir = ROOT / 'public/audio/cyber' / slug
out_dir.mkdir(parents=True, exist_ok=True)
story = json.loads(script_path.read_text())

# One synthesis at a time across parallel runs: the model is large and CPU-bound.
lock_path = ROOT / '.story-qa' / '.narration.lock'
lock_path.parent.mkdir(exist_ok=True)
with open(lock_path, 'w') as lock:
    fcntl.flock(lock, fcntl.LOCK_EX)
    model = Kokoro(str(VOICES / 'kokoro-v1.0.onnx'), str(VOICES / 'voices-v1.0.bin'))
    time, parts, rate = 0.0, [], 24000
    for scene in story['scenes']:
        samples, rate = model.create(scene.get('speech') or scene['caption'], voice='am_fenrir', speed=.92, lang='en-us')
        scene['start'] = round(time, 3)
        scene['duration'] = round(len(samples) / rate, 3)
        parts.extend([samples, np.zeros(int(rate * GAP), dtype=np.float32)])
        time += len(samples) / rate + GAP
        print(f"{scene['id']:<12} start {scene['start']:7.3f}  duration {scene['duration']:6.3f}", flush=True)

with tempfile.TemporaryDirectory() as tmp:
    wav = os.path.join(tmp, 'story.wav')
    sf.write(wav, np.concatenate(parts), rate)
    subprocess.run([FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', '-i', wav,
                    '-af', 'loudnorm=I=-18:TP=-1.5:LRA=11', '-ar', '48000', '-ac', '1', '-b:a', '128k',
                    str(out_dir / 'story.mp3')], check=True)

story['duration'] = round(time, 3)
script_path.write_text(json.dumps(story, indent=2, ensure_ascii=False) + '\n')
print(f'total {story["duration"]}s -> {out_dir / "story.mp3"}')
