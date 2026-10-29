"""Generate measured Indian English audio; requires edge-tts, soundfile, numpy,
and imageio-ffmpeg in an authoring environment. No synthesis service at runtime.
Usage: python scripts/narrate-class9.py [class9-slug ...] [--workers 2] [--force]
The Class 10 entrypoint calls this same engine with its own grade and settings.
"""
import argparse
import asyncio
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile

import edge_tts
import imageio_ffmpeg
import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / "app/module/cyber/lessons/new/story/chapters"
SETTINGS = json.loads((ROOT / "scripts/class9-voice.json").read_text())
FFMPEG = os.environ.get("FFMPEG") or imageio_ffmpeg.get_ffmpeg_exe()


def digest(story):
    payload = {"settings": SETTINGS, "speech": [s.get("speech") or s["caption"] for s in story["scenes"]]}
    return hashlib.sha256(json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode()).hexdigest()


def decode(mp3, wav):
    subprocess.run([FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-i", str(mp3), "-ar", str(SETTINGS["sampleRate"]), "-ac", "1", str(wav)], check=True)
    samples, rate = sf.read(wav, dtype="float32")
    if rate != SETTINGS["sampleRate"] or len(samples) == 0:
        raise ValueError("Decoded scene has no usable samples")
    return samples, rate


def encode(parts, rate, output, temp):
    wav = temp / "joined.wav"
    sf.write(wav, np.concatenate(parts), rate)
    target = temp / "story.mp3"
    norm = f'loudnorm=I={SETTINGS["targetLufs"]}:TP={SETTINGS["peakDb"]}:LRA=11'
    subprocess.run([FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav), "-af", norm, "-ar", str(rate), "-ac", "1", "-b:a", SETTINGS["bitrate"], str(target)], check=True)
    output.parent.mkdir(parents=True, exist_ok=True)
    os.replace(target, output)


async def narrate(path, force, semaphore):
    async with semaphore:
        story = json.loads(path.read_text())
        output = ROOT / "public/audio/cyber" / path.stem / "story.mp3"
        fingerprint = digest(story)
        if not force and output.exists() and story.get("narrationHash") == fingerprint and story.get("duration", 0) > 0:
            print(f"SKIP {path.stem}: matching Indian English audio", flush=True)
            return
        if len(story["scenes"]) != 6:
            raise ValueError(f"Expected six scenes: {path.stem}")
        with tempfile.TemporaryDirectory(prefix="cybersuraksha-narration-") as folder:
            temp = Path(folder)
            parts, elapsed = [], 0.0
            for index, scene in enumerate(story["scenes"]):
                mp3, wav = temp / f"scene-{index}.mp3", temp / f"scene-{index}.wav"
                for attempt in range(3):
                    try:
                        await edge_tts.Communicate(scene.get("speech") or scene["caption"], SETTINGS["voice"], rate=SETTINGS["rate"]).save(str(mp3))
                        samples, rate = await asyncio.to_thread(decode, mp3, wav)
                        break
                    except (edge_tts.exceptions.NoAudioReceived, subprocess.CalledProcessError, OSError, ValueError) as error:
                        if attempt == 2:
                            raise RuntimeError(f"Narration failed: {path.stem} scene {index+1}") from error
                        await asyncio.sleep(2 * (attempt + 1))
                scene["start"] = round(elapsed, 6)
                scene["duration"] = round(len(samples) / rate, 6)
                parts.extend([samples, np.zeros(round(rate * SETTINGS["gapSeconds"]), dtype=np.float32)])
                elapsed += len(samples) / rate + SETTINGS["gapSeconds"]
            await asyncio.to_thread(encode, parts, rate, output, temp)
        story["duration"], story["narrationHash"], story["narration"] = round(elapsed, 6), fingerprint, SETTINGS
        temporary = path.with_suffix(".json.tmp")
        temporary.write_text(json.dumps(story, ensure_ascii=False, indent=2) + "\n")
        os.replace(temporary, path)
        print(f"DONE {path.stem}: {elapsed:.3f}s, six measured en-IN scenes", flush=True)


async def main(grade=9):
    global SETTINGS
    if grade not in (6, 7, 9, 10):
        raise ValueError("Only Classes 6, 7, 9 and 10 use this narration engine")
    SETTINGS = json.loads((ROOT / f"scripts/class{grade}-voice.json").read_text())
    parser = argparse.ArgumentParser(description=f"Generate measured Indian English narration for Class {grade}")
    parser.add_argument("slugs", nargs="*")
    parser.add_argument("--workers", type=int, default=2, choices=range(1, 5))
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    paths = [SCRIPTS / f"{slug}.json" for slug in args.slugs] if args.slugs else sorted(SCRIPTS.glob(f"class{grade}-*.json"))
    if not paths:
        raise SystemExit(f"Compile the Class {grade} scripts before generating narration")
    if any(not path.stem.startswith(f"class{grade}-") for path in paths):
        raise SystemExit(f"Only Class {grade} narration is handled by this tool")
    semaphore = asyncio.Semaphore(args.workers)
    await asyncio.gather(*(narrate(path, args.force, semaphore) for path in paths))


if __name__ == "__main__":
    asyncio.run(main())
