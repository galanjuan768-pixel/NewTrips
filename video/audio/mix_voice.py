"""Mezcla la voz en off con la banda sonora y la pone sobre el video.
Cada frase de la grabación se recorta y se ubica en el momento en que su texto aparece en pantalla;
la música baja automáticamente (sidechain) cuando hay voz.
Uso (desde video/):  python3 audio/mix_voice.py
"""
import subprocess

VOICES = ["audio/voz-toma2.m4a", "audio/voz-toma1.m4a"]  # toma principal y toma anterior (para "link en la bio")
MUSIC = "audio/audio.wav"
VIDEO = "newtrips-disena-tu-viaje.mp4"
OUT = "newtrips-disena-tu-viaje-voz.mp4"

# (toma, inicio en la grabación, fin en la grabación, posición en el video, velocidad)
SEGMENTS = [
    (0, 0.84, 2.12, 0.12, 1.00),    # ¿Cuál es el viaje de tus sueños?
    (0, 2.55, 3.06, 1.98, 1.20),    # ¿Playa?
    (0, 3.17, 3.80, 2.47, 1.20),    # ¿Montaña?
    (0, 3.95, 4.58, 2.98, 1.20),    # ¿Aventura?
    (0, 4.73, 5.27, 3.49, 1.20),    # ¿Europa?
    (0, 5.80, 6.94, 4.08, 1.00),    # Diseñá tu viaje, a tu medida.
    (0, 7.33, 8.56, 6.10, 1.00),    # Contanos a dónde querés ir,
    (0, 8.56, 10.10, 7.40, 1.00),   # cuándo, con quién… y qué te gusta.
    (0, 10.31, 10.77, 9.46, 1.00),  # ¡Y listo!  (clic del botón)
    (0, 11.18, 11.74, 9.97, 1.12),  # Tu destino.
    (0, 11.75, 12.34, 10.49, 1.12), # Tus fechas.
    (0, 12.36, 12.84, 11.03, 1.12), # Tu ritmo.
    (0, 12.85, 13.26, 11.50, 1.12), # Tu viaje.
    (0, 13.55, 14.87, 12.10, 1.00), # Nosotros te lo armamos a medida.
    (0, 15.08, 15.86, 14.35, 1.00), # Completá el formulario:
    (1, 17.13, 17.78, 15.25, 1.00), # link en la bio.  (la toma 2 se corta antes)
]

parts, labels = [], []
for i, (src, a, b, at, speed) in enumerate(SEGMENTS):
    d = (b - a) / speed
    chain = f"[c{src}_{i}]atrim={a}:{b},asetpts=PTS-STARTPTS"
    if speed != 1.0:
        chain += f",atempo={speed}"
    chain += f",afade=t=in:d=0.015,afade=t=out:st={d - 0.03:.3f}:d=0.03,adelay={int(at * 1000)}:all=1[s{i}]"
    parts.append(chain)
    labels.append(f"[s{i}]")

n = len(SEGMENTS)
uses = [[i for i, seg in enumerate(SEGMENTS) if seg[0] == k] for k in range(len(VOICES))]
VOICE_WAV = "audio/voz-montada.wav"
MIX_WAV = "audio/mezcla.wav"

# 1) voz limpia y ubicada en el tiempo del video (16 s exactos)
voice_graph = ";".join([
    *[f"[{k}:a]aformat=sample_rates=48000:channel_layouts=stereo,highpass=f=90,afftdn=nf=-40,"
      f"acompressor=threshold=-22dB:ratio=3:attack=5:release=90:makeup=2,asplit={len(uses[k])}"
      + "".join(f"[c{k}_{i}]" for i in uses[k]) for k in range(len(VOICES))],
    *parts,
    "".join(labels) + f"amix=inputs={n}:normalize=0:duration=longest,loudnorm=I=-16:TP=-2:LRA=9,aresample=48000,apad[o]",
])
subprocess.run(["ffmpeg", "-v", "error", "-y", *[a for v in VOICES for a in ("-i", v)], "-filter_complex", voice_graph,
                "-map", "[o]", "-t", "16", VOICE_WAV], check=True)

# 2) música que baja cuando hay voz + mezcla final a -14 LUFS
mix_graph = ";".join([
    "[1:a]asplit=2[voz][key]",
    "[0:a]volume=0.75[mus]",
    "[mus][key]sidechaincompress=threshold=0.02:ratio=6:attack=15:release=250[duck]",
    "[voz][duck]amix=inputs=2:normalize=0:duration=longest,loudnorm=I=-14:TP=-1.5:LRA=9,aresample=48000,apad[mix]",
])
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", MUSIC, "-i", VOICE_WAV, "-filter_complex", mix_graph,
                "-map", "[mix]", "-t", "16", MIX_WAV], check=True)

# 3) video original + mezcla nueva
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", VIDEO, "-i", MIX_WAV, "-map", "0:v", "-map", "1:a",
                "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", "16", "-movflags", "+faststart", OUT], check=True)
print("listo:", OUT)
