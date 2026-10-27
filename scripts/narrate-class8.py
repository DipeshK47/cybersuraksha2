"""Produce Class 8 English narration and measured cue timing.

Requires kokoro-onnx, numpy, soundfile and imageio-ffmpeg in a tool environment.
Set KOKORO_DIR to the official v1.0 model/voices folder. No model is shipped in the app.
Usage: python scripts/narrate-class8.py [class8-slug ...]
"""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf
import imageio_ffmpeg
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / "app/module/cyber/lessons/new/story/chapters"
MODELS = Path(os.environ["KOKORO_DIR"])
GAP = 0.65
FFMPEG = os.environ.get("FFMPEG") or imageio_ffmpeg.get_ffmpeg_exe()
paths = [SCRIPTS / f"{slug}.json" for slug in sys.argv[1:]] if len(sys.argv) > 1 else sorted(SCRIPTS.glob("class8-*.json"))
model = Kokoro(str(MODELS / "kokoro-v1.0.onnx"), str(MODELS / "voices-v1.0.bin"))
for script_path in paths:
    story = json.loads(script_path.read_text())
    output = ROOT / "public/audio/cyber" / script_path.stem / "story.mp3"
    digest = hashlib.sha256(json.dumps([scene["caption"] for scene in story["scenes"]], ensure_ascii=False).encode()).hexdigest()
    if output.exists() and story.get("narrationHash") == digest and story.get("duration", 0) > 0:
        print(f"SKIP {script_path.stem}: unchanged measured audio", flush=True)
        continue
    parts, elapsed = [], 0.0
    for scene in story["scenes"]:
        samples, rate = model.create(scene.get("speech") or scene["caption"], voice="am_fenrir", speed=0.92, lang="en-us")
        scene["start"] = round(elapsed, 3)
        scene["duration"] = round(len(samples) / rate, 3)
        parts.extend([samples, np.zeros(round(rate * GAP), dtype=np.float32)])
        elapsed += len(samples) / rate + GAP
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="class8-audio-") as temp:
        wav = Path(temp) / "story.wav"
        sf.write(wav, np.concatenate(parts), rate)
        subprocess.run([FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav), "-af", "loudnorm=I=-18:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "1", "-b:a", "128k", str(output)], check=True)
    story["duration"] = round(elapsed, 3)
    story["narrationHash"] = digest
    script_path.write_text(json.dumps(story, indent=2, ensure_ascii=False) + "\n")
    print(f"DONE {script_path.stem}: {elapsed:.3f}s, six measured scenes", flush=True)
