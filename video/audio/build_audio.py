"""Banda sonora del reel: base a 120 BPM (Fa mayor, F-C-Dm-Bb) + efectos sintetizados
alineados con cada golpe visual de audio/cues.json. Genera assets/audio.wav (48 kHz, -14 LUFS).
Uso (desde video/):  python3 audio/build_audio.py [cues.json] [salida.wav]
"""
import json
import subprocess
import sys
import numpy as np

SR = 48000
CUES = sys.argv[1] if len(sys.argv) > 1 else "audio/cues.json"
OUT = sys.argv[2] if len(sys.argv) > 2 else "audio/audio.wav"
cfg = json.load(open(CUES))
BPM, DUR = cfg["bpm"], cfg["duration"]
N = int(SR * DUR)
beat = 60 / BPM
step = beat / 2
mix = np.zeros((2, N))
rng = np.random.default_rng(7)


def add(x, t, gain=1.0, pan=0.0):
    i = int(round(t * SR))
    x = np.atleast_2d(x)
    if x.shape[0] == 1:
        x = np.vstack([x[0] * (1 - pan) ** 0.5, x[0] * (1 + pan) ** 0.5])
    a, b = max(0, i), min(N, i + x.shape[1])
    if b > a:
        mix[:, a:b] += x[:, a - i:b - i] * gain


def env(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def lowpass(x, alpha):
    """Filtro de un polo; alpha puede variar en el tiempo (array)."""
    alpha = np.broadcast_to(alpha, x.shape)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += alpha[i] * (x[i] - acc)
        y[i] = acc
    return y


def hz(note):  # nombre → frecuencia (A4 = 440)
    names = {"C": -9, "C#": -8, "D": -7, "Eb": -6, "E": -5, "F": -4, "F#": -3, "G": -2, "Ab": -1, "A": 0, "Bb": 1, "B": 2}
    return 440 * 2 ** ((names[note[:-1]] + 12 * (int(note[-1]) - 4)) / 12)


# ---------- instrumentos ----------
def kick():
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 50 + 120 * np.exp(-t / 0.03)
    return np.tanh(1.7 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.17))


def hat():
    n = int(0.06 * SR); x = np.diff(rng.standard_normal(n), prepend=0)
    return 0.3 * x * env(n, 0.012)


def clap():
    n = int(0.25 * SR); x = rng.standard_normal(n) * env(n, 0.05)
    for d in (0.0, 0.011, 0.022):
        x[int(d * SR):int(d * SR) + 200] *= 2.2
    return 0.45 * np.convolve(x, [1, 0, -1], "same")


def saw(freq, n, detune=0.0):
    t = np.arange(n) / SR
    return 2 * ((freq * (1 + detune) * t) % 1) - 1


def bass(freq, length):
    n = int(length * SR); s = saw(freq, n)
    k = np.exp(-np.arange(n) / (0.07 * SR))
    return 0.55 * lowpass(s, 0.015 + 0.18 * k) * env(n, 0.3)


def pad(freqs, length):
    n = int(length * SR)
    x = sum(saw(f, n, d) for f in freqs for d in (-0.004, 0.004)) / (2 * len(freqs))
    att = np.minimum(1, np.arange(n) / (0.25 * SR)); rel = np.minimum(1, (n - np.arange(n)) / (0.3 * SR))
    return 0.35 * lowpass(x, 0.03) * att * rel


def pluck(freq, length=0.3):
    n = int(length * SR); t = np.arange(n) / SR
    x = (np.sin(2 * np.pi * freq * t) + 0.3 * np.sin(4 * np.pi * freq * t)) * env(n, 0.09)
    return 0.22 * x


# ---------- efectos ----------
def sfx_impact():
    n = int(0.9 * SR); t = np.arange(n) / SR
    sub = np.sin(2 * np.pi * np.cumsum(38 + 90 * np.exp(-t / 0.05)) / SR) * env(n, 0.35)
    noise = lowpass(rng.standard_normal(n), 0.12) * env(n, 0.08)
    return np.tanh(1.4 * sub + 0.9 * noise)


def sfx_whoosh(length=0.45, peak=0.8):
    """Ruido con filtro que se abre y se cierra; el pico cae en length*peak."""
    n = int(length * SR); u = np.arange(n) / n
    shape = np.where(u < peak, (u / peak) ** 2.2, np.exp(-(u - peak) / (1 - peak) * 4))
    x = lowpass(rng.standard_normal(n), 0.01 + 0.35 * shape) * shape
    return 0.9 * x / (np.abs(x).max() + 1e-9)


def sfx_pop(pitch=1.0):
    n = int(0.12 * SR); t = np.arange(n) / SR
    f = (700 + 600 * np.exp(-t / 0.015)) * pitch
    return 0.6 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.03)


def sfx_click():
    n = int(0.012 * SR); x = np.diff(rng.standard_normal(n), prepend=0)
    return 0.5 * x * env(n, 0.002)


def sfx_riser(length=0.75):
    n = int(length * SR); u = np.arange(n) / n
    tone = np.sin(2 * np.pi * np.cumsum(220 + 900 * u ** 2) / SR)
    noise = lowpass(rng.standard_normal(n), 0.02 + 0.3 * u)
    return 0.5 * (0.6 * tone + noise) * u ** 1.6


def sfx_sparkle():
    out = np.zeros(int(0.9 * SR))
    for k, note in enumerate(["C6", "E6", "G6", "C7"]):
        n = int(0.6 * SR); t = np.arange(n) / SR
        x = np.sin(2 * np.pi * hz(note) * t) * env(n, 0.15)
        i = int(k * 0.045 * SR); out[i:i + n] += x[: len(out) - i]
    return 0.35 * out


def sfx_swish():
    return sfx_whoosh(0.4, 0.5) * 0.6


SFX = {
    "impact": lambda h: (sfx_impact(), 0.0),
    "whoosh": lambda h: (lambda L: (sfx_whoosh(L), L * 0.8))(h.get("len", 0.45)),
    "pop": lambda h: (sfx_pop(h.get("pitch", 1.0)), 0.0),
    "click": lambda h: (sfx_click(), 0.0),
    "riser": lambda h: (sfx_riser(h.get("len", 0.75)), 0.0),
    "sparkle": lambda h: (sfx_sparkle(), 0.0),
    "swish": lambda h: (sfx_swish(), 0.2),
}

# ---------- base musical ----------
PROG = [("F2", ["F3", "A3", "C4"]), ("C2", ["C3", "E3", "G3"]), ("D2", ["D3", "F3", "A3"]), ("Bb1", ["Bb2", "D3", "F3"])]
ARP = [0, 1, 2, 1, 2, 0, 1, 2]


def section(t):
    return next((m for a, b, m in cfg["groove"] if a <= t < b), "none")


for bar in range(int(DUR / (4 * beat))):
    t0 = bar * 4 * beat
    root, chord = PROG[bar % 4]
    if section(t0) != "none":
        add(pad([hz(n) for n in chord], 4 * beat), t0, 0.5)

for k in range(int(DUR / step)):
    t = k * step; mode = section(t)
    if mode in ("none", "pad"):
        continue
    root, chord = PROG[int(t // (4 * beat)) % 4]
    if k % 2 == 0:
        add(kick(), t, 0.85 if mode == "full" else 0.5)
    else:
        add(hat(), t, 0.5, pan=0.3 * (1 if k % 4 == 1 else -1))
    if mode == "full" and k % 4 == 2:
        add(clap(), t, 0.55)
    if mode == "full" or k % 2 == 0:
        add(bass(hz(root), step * 0.9), t, 0.5)
    add(pluck(hz(chord[ARP[k % 8]]) * 2), t, 0.5 if mode == "full" else 0.35, pan=0.25 * (1 if k % 2 else -1))

# ---------- efectos sincronizados ----------
hits = list(cfg["hits"])
for a, b, text in cfg.get("typing", []):  # un click por letra
    for j in range(len(text)):
        hits.append({"t": a + (b - a) * (j + 1) / len(text), "sfx": "click", "gain": 0.5})
for h in hits:
    x, lead = SFX[h["sfx"]](h)
    add(x, h["t"] - lead, h.get("gain", 0.7), h.get("pan", 0.0))

# fade-out final corto para no cortar en seco
fade = int(0.35 * SR)
mix[:, -fade:] *= np.linspace(1, 0, fade)

mix /= max(1e-9, np.abs(mix).max()) / 0.89
pcm = (np.clip(mix.T, -1, 1) * 32767).astype("<i2").tobytes()
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-",
                "-af", "loudnorm=I=-14:TP=-1.5:LRA=7", "-ar", str(SR), OUT], input=pcm, check=True)
print("listo:", OUT)
