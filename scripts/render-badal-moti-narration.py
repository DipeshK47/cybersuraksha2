#!/usr/bin/env python3
"""Render stable Badal and Moti MP3s from the lesson narration manifest.

Setup (outside the repository):
  python3 -m pip install --target /scratch/$USER/.edge-tts edge-tts

Run from `cybersuraksha`:
  PYTHONPATH=/scratch/$USER/.edge-tts python3 scripts/render-badal-moti-narration.py

The JSON beside the lesson is the single source of truth for displayed text,
spoken phrasing, stable clip ids and public URLs. The neural voice is used only
during authoring; the shipped lesson plays local MP3s and needs no TTS service.
"""

import asyncio
import json
import os
import pathlib
import subprocess

import edge_tts


HERE = pathlib.Path(__file__).resolve().parent
ACADEMY = HERE.parent
MANIFEST = ACADEMY / "app/module/badal-and-moti/badal-moti-narration.json"
OUTPUT = ACADEMY / "public/audio/badal-and-moti"
RAW = ACADEMY.parent / "tmp-badal-moti-narration-source"
FFMPEG = pathlib.Path(os.environ.get("FFMPEG", "/scratch/dk5288/bin/ffmpeg"))
FFPROBE = FFMPEG.with_name("ffprobe")
# Ava Multilingual speaks at a natural ~167 wpm on its own, so nothing is
# time-stretched afterwards. (Neerja's native pace is ~128 wpm; speeding her up
# 25% and then stretching to tempo is what made the first render sound processed.)
# LOCKED on 2026-09-03: Dipesh approved this voice for Badal and Moti and for every
# future lesson. Do not change it per chapter; a product-wide change is his call.
LOCKED_VOICE = "en-US-AvaMultilingualNeural"
LOCKED_RATE = "+5%"
VOICE = os.environ.get("NARRATION_VOICE", LOCKED_VOICE)
RATE = os.environ.get("NARRATION_RATE", LOCKED_RATE)
FORCE = os.environ.get("FORCE", "0") == "1"


def jobs_from_manifest():
    data = json.loads(MANIFEST.read_text())
    jobs = list(data["headings"].values())
    for group in data["examples"].values():
        jobs.extend(group)
    jobs.extend(data.get("clips", {}).values())
    return jobs


def duration(path):
    result = subprocess.run(
        [
            str(FFPROBE), "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return float(result.stdout.strip())


async def render_mp3(job):
    raw_path = RAW / f"{job['id']}.mp3"
    mp3_path = OUTPUT / f"{job['id']}.mp3"
    if not FORCE and mp3_path.exists() and mp3_path.stat().st_size > 10_000:
        print(f"reuse {mp3_path.name}", flush=True)
        return

    speech = job.get("spoken") or job["text"]
    communicate = edge_tts.Communicate(speech, VOICE, rate=RATE)
    await communicate.save(str(raw_path))

    words = len(speech.split())

    # No tempo change: the voice's own pace is the natural one. Trim the dead
    # air Edge leaves at both ends (it read as "slow" in the lesson), then a
    # gentle loudness pass so phone speakers are clear. Nothing else.
    filters = (
        "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,"
        "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.12,areverse,"
        "apad=pad_dur=0.12,highpass=f=70,loudnorm=I=-16:LRA=7:TP=-1.5"
    )
    subprocess.run(
        [
            str(FFMPEG), "-y", "-loglevel", "error", "-i", str(raw_path),
            "-filter:a", filters, "-codec:a", "libmp3lame", "-b:a", "128k", str(mp3_path),
        ],
        check=True,
    )
    seconds = duration(mp3_path)
    print(
        f"made {mp3_path.name}: {seconds:.1f}s, {words / (seconds / 60):.0f} wpm",
        flush=True,
    )


async def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    RAW.mkdir(parents=True, exist_ok=True)
    jobs = jobs_from_manifest()
    print(f"rendering {len(jobs)} clips with {VOICE} at {RATE}", flush=True)
    for job in jobs:
        await render_mp3(job)


if __name__ == "__main__":
    asyncio.run(main())
