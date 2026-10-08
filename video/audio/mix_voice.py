"""Mezcla la voz en off con la banda sonora y la pone sobre el video.
Cada frase de la grabación se recorta y se ubica en el momento en que su texto aparece en pantalla;
la música baja automáticamente (sidechain) cuando hay voz.
Uso (desde video/):  python3 audio/mix_voice.py
"""
import subprocess

VOICE = "audio/voz-original.m4a"
MUSIC = "audio/audio.wav"
VIDEO = "newtrips-disena-tu-viaje.mp4"
OUT = "newtrips-disena-tu-viaje-voz.mp4"

# (inicio en la grabación, fin en la grabación, posición en el video, velocidad)
SEGMENTS = [
    (1.25, 2.70, 0.10, 1.00),    # ¿Cuál es el viaje de tus sueños?
    (3.15, 3.82, 1.98, 1.15),    # ¿Playa?
    (3.83, 4.42, 2.49, 1.15),    # ¿Montaña?
    (4.43, 4.92, 2.99, 1.15),    # ¿Aventura?
    (4.92, 5.52, 3.48, 1.15),    # ¿Europa?
    (6.18, 7.30, 4.08, 1.00),    # Diseñá tu viaje, a tu medida.
    (7.66, 8.83, 6.10, 1.00),    # Contanos a dónde querés ir,
    (8.96, 10.58, 7.35, 1.00),   # cuándo, con quién… y qué te gusta.
    (10.80, 11.32, 9.46, 1.00),  # ¡Y listo!  (clic del botón)
    (11.75, 12.51, 9.95, 1.12),  # Tu destino.
    (12.51, 12.97, 10.62, 1.12), # Tus fechas.
    (13.02, 13.51, 11.04, 1.12), # Tu ritmo.
    (13.51, 13.95, 11.50, 1.12), # Tu viaje.
    (14.34, 15.90, 12.10, 1.00), # Nosotros te lo armamos a medida.
    (16.11, 16.98, 14.25, 1.00), # Completá el formulario:
    (17.13, 17.78, 15.22, 1.00), # link en la bio.
]

parts, labels = [], []
for i, (a, b, at, speed) in enumerate(SEGMENTS):
    d = (b - a) / speed
    chain = f"[v{i}]atrim={a}:{b},asetpts=PTS-STARTPTS"
    if speed != 1.0:
        chain += f",atempo={speed}"
    chain += f",afade=t=in:d=0.015,afade=t=out:st={d - 0.03:.3f}:d=0.03,adelay={int(at * 1000)}:all=1[s{i}]"
    parts.append(chain)
    labels.append(f"[s{i}]")

n = len(SEGMENTS)
VOICE_WAV = "audio/voz-montada.wav"
MIX_WAV = "audio/mezcla.wav"

# 1) voz limpia y ubicada en el tiempo del video (16 s exactos)
voice_graph = ";".join([
    "[0:a]aformat=sample_rates=48000:channel_layouts=stereo,highpass=f=90,afftdn=nf=-40,"
    f"acompressor=threshold=-22dB:ratio=3:attack=5:release=90:makeup=2,asplit={n}" + "".join(f"[v{i}]" for i in range(n)),
    *parts,
    "".join(labels) + f"amix=inputs={n}:normalize=0:duration=longest,loudnorm=I=-16:TP=-2:LRA=9,aresample=48000,apad[o]",
])
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", VOICE, "-filter_complex", voice_graph,
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
