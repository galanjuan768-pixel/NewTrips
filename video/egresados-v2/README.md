# Anuncio "Egresados" v2 (Meta Ads)

Misma estructura que `../egresados/` (v1), más dinámica: `newtrips-egresados-ads-v2.mp4`, 1080×1920, ~25,4 s, 60 fps.

Cambios respecto de la v1:
- Apertura: "El viaje de tus sueños" + "Con toda tu promo".
- Opiniones: 4,7 ★ · 173 opiniones en Google + carrusel continuo con las 6 reseñas de egresados.html.
- "En una reunión te contamos todo": se suma "Noches de boliche"; todo queda dentro de la zona segura (y=270–1250).
- Ritmo: tiempos escritos sobre 28,5 s a 120 BPM y comprimidos con `SPEED = 1.12` (≈134 BPM), con un golpe de zoom en cada corte (`CUTS`).

Usa las fotos de `../egresados/img/`. Para regenerar:

```bash
cd video
python3 audio/build_audio.py egresados-v2/cues.json egresados-v2/audio.wav
PAGE=video/egresados-v2/index.html NODE_PATH=$(npm root -g) node render.cjs frames
cd egresados-v2 && ffmpeg -framerate 60 -i renders/frames/%05d.png -i audio.wav \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k \
  -shortest -movflags +faststart newtrips-egresados-ads-v2.mp4
```
