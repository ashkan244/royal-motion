#!/usr/bin/env python3
"""Persian voice-over for the voiced stories (data/stories3.json rows with "vo").
Provider order (first that works wins, per line):
  1. ElevenLabs   — if ELEVENLABS_API_KEY is set (model ELEVEN_MODEL, default eleven_v3; voice ELEVEN_VOICE_ID)
  2. Google Gemini TTS (AI Studio) — if GEMINI_API_KEY is set (GEMINI_TTS_MODEL, GEMINI_VOICE)
  3. Microsoft neural voices via edge-tts — free, no key (fa-IR-DilaraNeural / fa-IR-FaridNeural)
Writes assets/audio/vo_<id>.wav (44.1 kHz stereo) and assets/audio/vo_meta.json {id: seconds}.
usage: python3 scripts/tts.py [--only X01,CI1] [--provider auto|eleven|gemini|edge]"""
import argparse, asyncio, base64, json, os, subprocess, sys, tempfile, urllib.request, wave

ap = argparse.ArgumentParser(); ap.add_argument("--only"); ap.add_argument("--group"); ap.add_argument("--provider", default=os.environ.get("TTS_PROVIDER", "auto")); ap.add_argument("--out", default="assets/audio")
a = ap.parse_args()
rows = [r for r in json.load(open("data/stories3.json", encoding="utf8")) if r.get("vo")]
if a.only: rows = [r for r in rows if r["tag"] in a.only.split(",")]
if a.group: rows = [r for r in rows if r.get("vg") == a.group]
os.makedirs(a.out, exist_ok=True)
EL_KEY, GM_KEY = os.environ.get("ELEVENLABS_API_KEY"), os.environ.get("GEMINI_API_KEY")
VOICES = {"female": "fa-IR-DilaraNeural", "male": "fa-IR-FaridNeural"}

def post(url, body, headers):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=dict({"Content-Type": "application/json"}, **headers))
    with urllib.request.urlopen(req, timeout=120) as r: return r.read()

def eleven(text, out_mp3):
    voice = os.environ.get("ELEVEN_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")
    data = post(f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128",
                {"text": text, "model_id": os.environ.get("ELEVEN_MODEL", "eleven_v3"), "language_code": "fa",
                 "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.35}}, {"xi-api-key": EL_KEY})
    open(out_mp3, "wb").write(data); return out_mp3

def gemini(text, out_wav):
    model = os.environ.get("GEMINI_TTS_MODEL", "gemini-2.5-flash-preview-tts")
    body = {"contents": [{"parts": [{"text": "با لحن گرم، شاد و صمیمی یک گوینده‌ی تبلیغاتی فارسی بخوان: " + text}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": os.environ.get("GEMINI_VOICE", "Kore")}}}}}
    res = json.loads(post(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GM_KEY}", body, {}))
    pcm = base64.b64decode(res["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
    with wave.open(out_wav, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
    return out_wav

def edge(text, out_mp3, gender):
    import edge_tts
    async def go():
        await edge_tts.Communicate(text, VOICES[gender], rate="+6%", pitch="+0Hz").save(out_mp3)
    asyncio.run(go()); return out_mp3

def to_wav(src, dst):
    # loudness-matched, gentle compression, 44.1k stereo, 120 ms lead-in
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", src, "-af",
                    "adelay=120|120,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,loudnorm=I=-16:TP=-1.5:LRA=9,aresample=44100",
                    "-ac", "2", "-sample_fmt", "s16", dst], check=True)
    with wave.open(dst) as w: return w.getnframes() / w.getframerate()

meta_p = os.path.join(a.out, "vo_meta.json")
meta = json.load(open(meta_p)) if os.path.exists(meta_p) else {}
order = {"auto": [p for p, k in (("eleven", EL_KEY), ("gemini", GM_KEY), ("edge", True)) if k], "eleven": ["eleven", "edge"], "gemini": ["gemini", "edge"], "edge": ["edge"]}[a.provider]
used = {}
with tempfile.TemporaryDirectory() as td:
    for i, r in enumerate(rows):
        sid, text = r["tag"], r["vo"]
        gender = "male" if i % 3 == 2 else "female"           # mostly female host, some male lines for variety
        for prov in order:
            try:
                raw = os.path.join(td, f"{sid}.{'wav' if prov == 'gemini' else 'mp3'}")
                {"eleven": lambda: eleven(text, raw), "gemini": lambda: gemini(text, raw), "edge": lambda: edge(text, raw, gender)}[prov]()
                meta[sid] = round(to_wav(raw, os.path.join(a.out, f"vo_{sid}.wav")), 2); used[sid] = prov
                print(f"✓ {sid} [{prov}] {meta[sid]}s  {text}")
                break
            except Exception as e:
                print(f"  {sid}: {prov} failed: {str(e)[:160]}", file=sys.stderr)
json.dump(meta, open(meta_p, "w"), ensure_ascii=False, indent=1)
print(f"voice-over: {len(used)}/{len(rows)} lines", {p: list(used.values()).count(p) for p in set(used.values())})
if len(used) < len(rows): sys.exit(1)
