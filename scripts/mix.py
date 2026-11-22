#!/usr/bin/env python3
"""Mix a model's sound design (bed + timed cues) and mux it onto the silent render.
usage: python3 scripts/mix.py <silent.mp4> <out.mp4> <duration> '<audio-json>' [audio_dir]
audio-json: {"bed": ["lux_pad", 0.5], "cues": [["impact", 1.2, 0.8], ...]}
"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np

SR = 44100
silent, out, dur, spec = sys.argv[1], sys.argv[2], float(sys.argv[3]), json.loads(sys.argv[4] or "null")
adir = sys.argv[5] if len(sys.argv) > 5 else "assets/audio"


def load(name):
    with wave.open(os.path.join(adir, name + ".wav")) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(np.float32) / 32767
    return x.reshape(-1, 2)


# optional delivery re-encode (smaller files for social): REENCODE_CRF=22
CRF = os.environ.get("REENCODE_CRF")
VOPT = ["-c:v", "libx264", "-crf", CRF, "-preset", "slow", "-pix_fmt", "yuv420p", "-profile:v", "high"] if CRF else ["-c:v", "copy"]

if not spec:
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", silent] + VOPT + ["-movflags", "+faststart", out], check=True)
    sys.exit(0)

n = int(round(dur * SR))
mixbuf = np.zeros((n, 2), np.float32)
if spec.get("bed"):
    name, g = spec["bed"][0], spec["bed"][1] if len(spec["bed"]) > 1 else 0.5
    b = load(name)
    reps = int(np.ceil(n / len(b)))
    b = np.tile(b, (reps, 1))[:n] * g
    fi, fo = int(0.04 * SR), int(min(0.7, dur * 0.15) * SR)
    b[:fi] *= np.linspace(0, 1, fi)[:, None]
    b[-fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
    mixbuf += b
for cue in spec.get("cues", []):
    name, at = cue[0], float(cue[1]); g = cue[2] if len(cue) > 2 else 1.0
    x = load(name) * g
    s = int(at * SR)
    if s >= n: continue
    L = min(len(x), n - s)
    mixbuf[s:s + L] += x[:L]
# gentle bus: soft clip, then ffmpeg loudness normalisation for social (-14 LUFS)
mixbuf = np.tanh(mixbuf * 1.1) / np.tanh(1.1)
tail = int(0.03 * SR); mixbuf[-tail:] *= np.linspace(1, 0, tail)[:, None]

with tempfile.TemporaryDirectory() as td:
    wav = os.path.join(td, "mix.wav")
    with wave.open(wav, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(mixbuf, -1, 1) * 32767).astype("<i2").tobytes())
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", silent, "-i", wav,
                    "-map", "0:v:0", "-map", "1:a:0", *VOPT,
                    "-af", "loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000",
                    "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out], check=True)
