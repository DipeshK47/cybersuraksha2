"""Render the three fictional voice notes with the approved local story narrator.

Run with the same Python environment and KOKORO_DIR as story-narration.py.
"""
import os
from pathlib import Path
import subprocess
import tempfile

import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
VOICES = Path(os.environ.get("KOKORO_DIR", "/Users/dipeshkumar/Documents/Codex/2026-09-27/do-u/work/voices"))
OUT = ROOT / "public/audio/cyber/deepfake-voice-relative-scam"
# Keep these transcripts in sync with voiceTasks in FraudMissions.tsx.
NOTES = [
    "It's me. I had an accident. Please send money now. Don't call anyone else.",
    "Don't call my old number. Just trust my voice and pay quickly.",
    "I still need that money now. Please don't tell anyone.",
]

OUT.mkdir(parents=True, exist_ok=True)
model = Kokoro(str(VOICES / "kokoro-v1.0.onnx"), str(VOICES / "voices-v1.0.bin"))
for index, note in enumerate(NOTES, 1):
    samples, rate = model.create(note, voice="am_fenrir", speed=.92, lang="en-us")
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "note.wav"
        sf.write(wav, samples, rate)
        subprocess.run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav),
            "-af", "loudnorm=I=-18:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "1", "-b:a", "128k",
            str(OUT / f"practice-{index}.mp3"),
        ], check=True)
    print(f"practice-{index}.mp3", flush=True)
