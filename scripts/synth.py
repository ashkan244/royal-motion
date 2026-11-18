#!/usr/bin/env python3
"""Royal Pars sound kit — every sound is synthesised here (no third-party samples,
so there is nothing to license). Deterministic: fixed seeds.
usage: python3 scripts/synth.py assets/audio
"""
import os, sys, wave
import numpy as np

SR = 44100
OUT = sys.argv[1] if len(sys.argv) > 1 else "assets/audio"
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(1405)


def N(d):
    return int(round(SR * d))


def t_(d):
    return np.arange(int(round(SR * d))) / SR


def env(n, a=0.005, r=None, curve=4.0):
    """attack then exponential release over n samples"""
    e = np.ones(n)
    na = max(1, int(a * SR))
    e[:na] = np.linspace(0, 1, na)
    if r is not None:
        x = np.linspace(0, 1, n - na)
        e[na:] = np.exp(-curve * x) * (1 - x) ** 0.5
    return e


def lp(x, fc):
    """one-pole low-pass; fc may be an array (time-varying)"""
    fc = np.broadcast_to(np.asarray(fc, float), x.shape)
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)):
        s += a[i] * (x[i] - s); y[i] = s
    return y


def hp(x, fc):
    return x - lp(x, fc)


def bp(x, f, q=2.0):
    """state-variable band-pass, f may vary over time"""
    f = np.broadcast_to(np.asarray(f, float), x.shape)
    y = np.empty_like(x); low = band = 0.0
    for i in range(len(x)):
        F = 2 * np.sin(np.pi * min(f[i], SR / 6) / SR)
        high = x[i] - low - band / q
        band += F * high; low += F * band
        y[i] = band
    return y


def norm(x, peak=0.89):
    m = np.max(np.abs(x)) or 1
    return x / m * peak


def stereo(x, width=0.0, seed=0):
    if width <= 0:
        return np.stack([x, x], 1)
    d = int(SR * 0.011 * width)
    r = np.concatenate([np.zeros(d), x[:-d]]) if d else x
    return np.stack([x * (1 - width * 0.2) + r * width * 0.2, r * (1 - width * 0.2) + x * width * 0.2], 1)


def save(name, x):
    if x.ndim == 1:
        x = stereo(x)
    x = np.clip(x, -1, 1)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())


def noise(d):
    return rng.standard_normal(int(round(SR * d)))


def sine(f, d, ph=0):
    t = t_(d)
    if np.ndim(f):
        return np.sin(2 * np.pi * np.cumsum(f) / SR + ph)
    return np.sin(2 * np.pi * f * t + ph)


def saw(f, d):
    t = t_(d)
    ph = np.cumsum(np.broadcast_to(f, t.shape)) / SR
    return 2 * (ph % 1) - 1


def reverb(x, d=1.6, mix=0.25, seed=3):
    """cheap convolution reverb from decaying noise"""
    r = np.random.default_rng(seed)
    n = N(d)
    ir = r.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir = lp(ir, 6000)
    L = len(x) + n
    y = np.fft.irfft(np.fft.rfft(x, L) * np.fft.rfft(ir, L), L)[:L]
    y = y / (np.max(np.abs(y)) or 1) * np.max(np.abs(x))
    out = np.concatenate([x, np.zeros(n)]) * (1 - mix) + y * mix
    return out


# ---------------------------------------------------------------- one-shots
def whoosh(d=0.8, f0=300, f1=3200, q=1.6, peak=0.45):
    n = noise(d)
    k = np.linspace(0, 1, len(n))
    f = f0 + (f1 - f0) * np.sin(np.pi * k) ** 1.5
    e = np.sin(np.pi * k ** peak) ** 2
    return norm(bp(n, f, q) * e)


def impact(d=1.6, f0=110, f1=38, click=0.6):
    t = t_(d)
    f = f1 + (f0 - f1) * np.exp(-t * 9)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2)
    nb = lp(noise(d), 1800) * np.exp(-t * 28) * click
    x = np.tanh((body + nb) * 2.2)
    return norm(reverb(x, 1.8, 0.18))


def shimmer(d=2.2, base=1568.0, seed=5):
    r = np.random.default_rng(seed)
    x = np.zeros(N(d))
    notes = [1, 5 / 4, 3 / 2, 2, 5 / 2, 3]
    for i, m in enumerate(notes):
        st = int(SR * (i * 0.045 + r.random() * 0.01))
        tt = np.arange(len(x) - st) / SR
        f = base * m
        s = (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * f * 2.76 * tt) + 0.12 * np.sin(2 * np.pi * f * 5.4 * tt))
        x[st:] += s * np.exp(-tt * (2.2 + i * 0.4)) * 0.6
    x += hp(noise(d), 7000) * np.exp(-t_(d) * 5) * 0.08
    return norm(reverb(x, 2.4, 0.35), 0.8)


def riser(d=2.4, f0=180, f1=1400):
    t = t_(d); k = t / d
    f = f0 * (f1 / f0) ** (k ** 1.6)
    tone = 0.5 * np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.25 * np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR)
    nz = bp(noise(d), 400 + 5000 * k ** 2, 1.2)
    x = (tone + nz * 0.8) * k ** 2.2
    x[-int(SR * 0.03):] *= np.linspace(1, 0, int(SR * 0.03))
    return norm(x)


def tick(f=2600, d=0.08):
    t = t_(d)
    x = bp(noise(d), f, 6) * np.exp(-t * 90) + 0.4 * np.sin(2 * np.pi * f * 0.5 * t) * np.exp(-t * 120)
    return norm(x, 0.8)


def beep(f=880, d=0.18):
    t = t_(d)
    x = (np.sin(2 * np.pi * f * t) + 0.2 * np.sin(2 * np.pi * f * 2 * t)) * env(len(t), 0.004, True, 3)
    return norm(x, 0.7)


def pop(d=0.18, f=180):
    t = t_(d)
    x = lp(noise(d), 5000) * np.exp(-t * 60) + np.sin(2 * np.pi * f * t) * np.exp(-t * 25) * 0.8
    return norm(x, 0.8)


def thump(d=0.5):
    t = t_(d)
    f = 60 + 90 * np.exp(-t * 30)
    return norm(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) + lp(noise(d), 900) * np.exp(-t * 40) * 0.4)


def kick(d=0.45):
    t = t_(d)
    f = 48 + 120 * np.exp(-t * 35)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5)
    x += bp(noise(d), 3000, 2) * np.exp(-t * 200) * 0.25
    return norm(np.tanh(x * 1.6), 0.95)


def snare(d=0.3):
    t = t_(d)
    x = hp(noise(d), 1200) * np.exp(-t * 22) * 0.8 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.6
    return norm(x, 0.85)


def clap(d=0.35):
    t = t_(d); x = np.zeros(len(t)); n = bp(noise(d), 1500, 1.5)
    for o in (0, 0.011, 0.022):
        s = int(o * SR); x[s:] += n[: len(x) - s] * np.exp(-t[: len(x) - s] * 60)
    x += n * np.exp(-t * 16) * 0.5
    return norm(x, 0.8)


def hat(d=0.06, open_=False):
    d = 0.28 if open_ else d
    t = t_(d)
    return norm(hp(noise(d), 8000) * np.exp(-t * (14 if open_ else 80)), 0.6)


def tom(f=110, d=0.6):
    t = t_(d)
    ff = f * (1 + 0.6 * np.exp(-t * 25))
    x = np.sin(2 * np.pi * np.cumsum(ff) / SR) * np.exp(-t * 6) + lp(noise(d), 2000) * np.exp(-t * 40) * 0.3
    return norm(np.tanh(x * 1.3), 0.9)


def cash():
    d = 1.2; x = np.zeros(N(d))
    for st, f in ((0.0, 2350), (0.07, 3120)):
        s = int(st * SR); tt = np.arange(len(x) - s) / SR
        x[s:] += (np.sin(2 * np.pi * f * tt) + 0.5 * np.sin(2 * np.pi * f * 2.41 * tt)) * np.exp(-tt * 5)
    r = np.random.default_rng(9)
    for i in range(14):
        s = int((0.12 + r.random() * 0.5) * SR); tt = t_(0.08); f = 5000 + r.random() * 4000
        seg = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 60) * 0.25
        x[s:s + len(seg)] += seg[: len(x) - s]
    return norm(reverb(x, 1.0, 0.2), 0.8)


def glitch(d=0.35, seed=4):
    r = np.random.default_rng(seed); x = np.zeros(N(d)); i = 0
    while i < len(x):
        L = int(SR * (0.008 + r.random() * 0.03))
        kind = r.integers(3)
        seg = (np.sign(np.sin(2 * np.pi * (200 + r.random() * 2000) * t_(L / SR))) if kind == 0 else
               noise(L / SR) if kind == 1 else np.zeros(L))
        x[i:i + L] = seg[: len(x) - i] * 0.6; i += L
    x = np.round(x * 6) / 6
    return norm(x, 0.7)


def paper(d=0.4):
    t = t_(d); n = noise(d)
    return norm(bp(n, 2500 + 2000 * np.sin(t * 40) ** 2, 0.8) * np.sin(np.pi * t / d) ** 2, 0.6)


def printer(d=1.6):
    t = t_(d); x = np.zeros(len(t))
    for k in range(int(d * 22)):
        s = int(k / 22 * SR); seg = bp(noise(0.03), 1800, 3) * np.exp(-t_(0.03) * 80)
        x[s:s + len(seg)] += seg[: len(x) - s]
    x += 0.15 * np.sin(2 * np.pi * 95 * t) * (np.sin(2 * np.pi * 11 * t) > 0)
    return norm(x, 0.6)


def reel(d=2.0):
    t = t_(d); x = np.zeros(len(t)); tt = 0.0
    while tt < d:
        s = int(tt * SR); seg = tick(1800 + 400 * (tt / d), 0.04) * 0.6
        x[s:s + len(seg)] += seg[: len(x) - s]
        tt += 0.035 + 0.11 * (tt / d) ** 2
    return norm(x, 0.7)


def flap(d=1.4):
    t = t_(d); x = np.zeros(len(t)); tt = 0.0; r = np.random.default_rng(2)
    while tt < d - 0.05:
        s = int(tt * SR); seg = bp(noise(0.02), 3500 + r.random() * 1500, 4) * np.exp(-t_(0.02) * 160)
        x[s:s + len(seg)] += seg[: len(x) - s]; tt += 0.018 + r.random() * 0.03
    return norm(x, 0.6)


def scratch(d=0.6):
    t = t_(d)
    return norm(bp(noise(d), 1500 + 1200 * np.sin(2 * np.pi * 7 * t), 1.0) * np.sin(np.pi * t / d), 0.6)


def neon(d=0.9):
    t = t_(d)
    hum = (np.sin(2 * np.pi * 100 * t) + 0.5 * np.sin(2 * np.pi * 200 * t) + 0.25 * np.sin(2 * np.pi * 300 * t))
    buzz = hp(noise(d), 3000) * 0.3 * (np.sin(2 * np.pi * 9 * t) > 0.3)
    return norm((hum * 0.4 + buzz) * env(len(t), 0.01, True, 2), 0.5)


def engine(d=2.2):
    t = t_(d); f = 38 + 60 * (t / d) ** 1.4
    x = saw(f, d) + 0.5 * saw(f * 2.01, d)
    x = lp(x, 400 + 1800 * (t / d)) * (0.4 + 0.6 * t / d)
    return norm(np.tanh(x * 2), 0.8)


SHOTS = {
    "whoosh": lambda: whoosh(0.8), "whoosh_soft": lambda: whoosh(1.1, 200, 1800, 1.2) * 0.7,
    "swish": lambda: whoosh(0.35, 800, 5000, 2.0, 0.3), "whoosh_rev": lambda: whoosh(0.9, 200, 2600, 1.4, 1.8),
    "impact": lambda: impact(), "impact_soft": lambda: impact(1.8, 80, 42, 0.25) * 0.8, "boom": lambda: impact(2.6, 90, 30, 1.0),
    "shimmer": lambda: shimmer(), "shimmer_low": lambda: shimmer(2.6, 784.0, 8),
    "riser": lambda: riser(), "riser_soft": lambda: riser(2.0, 120, 700) * 0.6, "riser_long": lambda: riser(4.0, 120, 1800),
    "tick": lambda: tick(), "tock": lambda: tick(1700), "beep": lambda: beep(), "beep_hi": lambda: beep(1760, 0.6),
    "pop": lambda: pop(), "pop_soft": lambda: pop(0.12, 320) * 0.6, "thump": lambda: thump(),
    "kick": lambda: kick(), "snare": lambda: snare(), "clap": lambda: clap(), "hat": lambda: hat(), "tom_hi": lambda: tom(180), "tom_lo": lambda: tom(95),
    "cash": cash, "glitch": glitch, "paper": paper, "printer": printer, "reel": reel, "flap": flap, "scratch": scratch, "neon": neon, "engine": engine,
}


# ---------------------------------------------------------------- music beds (12 s)
def place(buf, x, at, g=1.0):
    s = int(at * SR)
    if s >= len(buf): return
    L = min(len(x), len(buf) - s)
    buf[s:s + L] += x[:L] * g


def chord_pad(freqs, d, cutoff=1400, det=0.004):
    x = np.zeros(N(d))
    for f in freqs:
        for dd in (-det, 0, det):
            x += saw(f * (1 + dd), d) * 0.2
    x = lp(x, cutoff)
    return x


NOTE = lambda n: 440.0 * 2 ** ((n - 69) / 12)


def lux_pad(d=12.0):
    """slow, warm, luxurious: Dmaj9 -> Bm9 -> Gmaj7 -> Aadd9"""
    prog = [[50, 57, 61, 64, 66], [47, 54, 57, 61, 62], [43, 50, 54, 59, 62], [45, 52, 57, 59, 64]]
    seg = d / 4; buf = np.zeros(N(d) + SR * 3)
    for i, ch in enumerate(prog):
        p = chord_pad([NOTE(n) for n in ch], seg + 1.5, 1100) * 0.5
        p *= np.minimum(1, np.minimum(t_(seg + 1.5) / 0.9, (seg + 1.5 - t_(seg + 1.5)) / 1.2))
        place(buf, p, i * seg)
        # soft bell arpeggio
        for j, n in enumerate(ch[1:] + [ch[2] + 12]):
            tt = t_(1.6); f = NOTE(n + 12)
            b = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 3 * tt)) * np.exp(-tt * 3.5) * 0.12
            place(buf, b, i * seg + j * seg / 5)
        place(buf, np.sin(2 * np.pi * NOTE(ch[0] - 12) * t_(seg)) * 0.25 * np.minimum(1, t_(seg) / 0.3), i * seg)
    buf = reverb(buf[: N(d)], 2.6, 0.35)[: N(d)]
    return norm(buf, 0.8)


def rw_beat(d=12.0, bpm=124):
    """energetic Royal Week groove in A minor"""
    b = 60 / bpm; buf = np.zeros(N(d)); K, S, C, Hh, Ho = kick(), snare(), clap(), hat(), hat(open_=True)
    bass_notes = [45, 45, 48, 43]
    chords = [[57, 60, 64], [57, 60, 64], [60, 64, 67], [55, 59, 62]]
    beats = int(d / b)
    for i in range(beats):
        place(buf, K, i * b, 0.9)
        if i % 2 == 1: place(buf, C, i * b, 0.5)
        place(buf, Hh, i * b + b / 2, 0.35)
        if i % 4 == 3: place(buf, Ho, i * b + b / 2, 0.25)
        bar = (i // 4) % 4
        for s in (0, 0.75):
            f = NOTE(bass_notes[bar]); L = b * 0.45
            bs = lp(saw(f, L) + 0.5 * np.sin(2 * np.pi * f / 2 * t_(L)), 700) * env(N(L), 0.004, True, 3)
            place(buf, bs, i * b + s * b, 0.45)
        if i % 2 == 0:
            st = chord_pad([NOTE(n) for n in chords[bar]], b * 0.3, 2600, 0.006) * env(N(b * 0.3), 0.003, True, 4)
            place(buf, st, i * b + b * 0.5, 0.35)
    return norm(np.tanh(buf * 1.3), 0.85)


def rw_drums(d=12.0, bpm=100):
    """tribal / live-drum groove for the drummer nights"""
    b = 60 / bpm; buf = np.zeros(N(d)); T1, T2, K, S = tom(180), tom(95), kick(), snare()
    pat = [(0, K, 0.9), (0.5, T2, 0.6), (0.75, T2, 0.4), (1, S, 0.7), (1.5, T1, 0.5), (1.75, T1, 0.4)]
    for bar in range(int(d / (2 * b))):
        for off, s, g in pat:
            place(buf, s, (bar * 2 + off) * b, g)
        place(buf, hat(), (bar * 2 + 0.25) * b, 0.2); place(buf, hat(), (bar * 2 + 1.25) * b, 0.2)
    return norm(np.tanh(buf * 1.2), 0.85)


def tension(d=14.0):
    """countdown bed: low drone + heartbeat"""
    t = t_(d)
    drone = lp(saw(55, d) + saw(55.4, d) + 0.5 * saw(82.4, d), 300 + 500 * t / d) * 0.35
    buf = drone.copy()
    for s in np.arange(0, d, 1.0):
        place(buf, thump(), s, 0.5)
    return norm(buf, 0.75)


def bright_pad(d=12.0):
    """lighter brand bed: Emaj7 shimmer, for upbeat brand models"""
    buf = np.zeros(N(d)); b = 60 / 110
    prog = [[52, 59, 63, 68], [49, 56, 61, 64], [45, 52, 57, 61], [47, 54, 59, 63]]
    seg = d / 4
    for i, ch in enumerate(prog):
        p = chord_pad([NOTE(n) for n in ch], seg, 2000) * 0.35 * np.minimum(1, t_(seg) / 0.2)
        place(buf, p, i * seg)
        for j in range(int(seg / (b / 2))):
            n = ch[j % 4] + 12; tt = t_(0.4)
            place(buf, np.sin(2 * np.pi * NOTE(n) * tt) * np.exp(-tt * 8) * 0.18, i * seg + j * b / 2)
    for i in range(int(d / b)):
        place(buf, kick(), i * b, 0.35); place(buf, hat(), i * b + b / 2, 0.15)
    return norm(reverb(buf, 1.5, 0.2)[: N(d)], 0.8)


def teaser15(d=15.0, bpm=128):
    """arranged 8-bar track for the 15 s teaser (V2A2): drop at 0, groove, drum break
    (bar 5), snare-roll build (bar 6), gap, big drop on bar 7, ring-out on the last beat"""
    b = 60 / bpm; buf = np.zeros(N(d) + SR); K, S, C, Hh, Ho = kick(), snare(), clap(), hat(), hat(open_=True)
    T1, T2 = tom(190), tom(100)
    bass_notes = [45, 45, 48, 43, 45, 45, 41, 43]
    chords = [[57, 60, 64], [57, 60, 64], [60, 64, 67], [55, 59, 62], [57, 60, 64], [57, 60, 64], [53, 57, 60], [55, 59, 62]]
    def bassline(i, bar, g=0.5):
        f = NOTE(bass_notes[bar])
        for s in (0, 0.5, 0.75):
            L = b * 0.4
            bs = lp(saw(f, L) + 0.6 * np.sin(2 * np.pi * f / 2 * t_(L)), 650) * env(N(L), 0.004, True, 3)
            place(buf, bs, i * b + s * b, g)
    def stab(i, bar, g=0.38):
        st = chord_pad([NOTE(n) for n in chords[bar]], b * 0.32, 3000, 0.006) * env(N(b * 0.32), 0.003, True, 4)
        place(buf, st, i * b + b * 0.5, g)
    for i in range(32):
        bar = i // 4; beat = i % 4; t = i * b
        if bar in (0, 1, 2, 3):            # main groove
            place(buf, K, t, 0.95)
            if beat in (1, 3): place(buf, C, t, 0.55)
            place(buf, Hh, t + b / 2, 0.35)
            if bar >= 2: place(buf, Hh, t + b / 4, 0.15); place(buf, Hh, t + 3 * b / 4, 0.15)
            if beat == 3: place(buf, Ho, t + b / 2, 0.25)
            bassline(i, bar); stab(i, bar)
        elif bar == 4:                     # live-drum break (drummer nights)
            place(buf, K, t, 0.9); place(buf, T2, t + b * 0.5, 0.7); place(buf, T1, t + b * 0.75, 0.6)
            if beat in (1, 3): place(buf, S, t, 0.6)
            place(buf, T1, t + b * 0.25, 0.35)
        elif bar == 5:                     # build: kick then snare roll accelerating, gap before the drop
            if beat < 2: place(buf, K, t, 0.8)
            steps = [2, 4, 8, 8][beat]
            for k in range(steps):
                tt = t + k * b / steps
                if tt > 6 * 4 * b - b * 0.5: break      # last half beat: silence
                place(buf, S, tt, 0.25 + 0.5 * (i - 20 + k / steps) / 4)
        else:                              # bars 7–8: drop
            place(buf, K, t, 1.0)
            if beat in (1, 3): place(buf, C, t, 0.6); place(buf, S, t, 0.3)
            place(buf, Hh, t + b / 2, 0.38); place(buf, Hh, t + b / 4, 0.16); place(buf, Hh, t + 3 * b / 4, 0.16)
            if beat == 3: place(buf, Ho, t + b / 2, 0.28)
            if i < 31: bassline(i, bar, 0.55); stab(i, bar, 0.45)
            else:
                ring = chord_pad([NOTE(n) for n in [45, 57, 60, 64, 69]], 1.2, 2200, 0.006) * env(N(1.2), 0.003, True, 3)
                place(buf, ring, t, 0.6)
    return norm(np.tanh(buf[: N(d)] * 1.3), 0.86)


BEDS = {"lux_pad": lux_pad, "rw_beat": rw_beat, "rw_drums": rw_drums, "tension": tension, "bright_pad": bright_pad, "teaser15": teaser15}

if __name__ == "__main__":
    for k, f in SHOTS.items():
        save(k, f())
    for k, f in BEDS.items():
        save(k, stereo(f(), 0.6))
    print(f"synthesised {len(SHOTS)} one-shots + {len(BEDS)} beds -> {OUT}")
