# Anuncio "Egresados" (Meta Ads)

Video vertical 1080×1920, 27,5 s (120 BPM), 60 fps, para Reels/Stories: `newtrips-egresados-ads.mp4`.
Objetivo: que familias, docentes o alumnos **agenden una reunión**.

## Recorrido

| Tiempo | Escena |
|---|---|
| 0–2,5 s | "¡Nos vamos de egresados!" + "La semana más esperada" |
| 2,5–4 s | "3 destinos · Elegí tu pase de abordar" |
| 4–11,5 s | Pase de abordar por destino: Camboriú, Villa Carlos Paz, Mar del Plata (sello "¡Nos vamos!") |
| 11,5–15 s | "Los cuidamos como si fueran nuestros": coordinadores, médico 24 hs, padres al tanto, todo por escrito |
| 15–17,5 s | 4,7 ★ · 173 opiniones en Google + reseña de Andrea N. |
| 17,5–20,5 s | "En una reunión te mostramos todo": destino y fechas, hotel y comidas, excursiones, plan de pagos en cuotas |
| 20,5–24,5 s | Agenda: se elige día y horario → "¡Reunión agendada!" |
| 24,5–27,5 s | Logo + "Agendá una reunión" + "Link acá abajo" + oficina y legajo |

## Datos

Todo sale de https://newtrips.vercel.app/egresados.html: destinos de secundaria, los cuatro puntos de "Lo que más valoran las familias",
la calificación en Google, la reseña, "todo por escrito, antes de confirmar", la oficina de egresados (Alvarado 1252) y el legajo EVT 12.379.
Las fotos (`img/camboriu.jpg`, `carlospaz.jpg`, `mardelplata.jpg`) son las del sitio; `*-fondo.jpg` son versiones desenfocadas.
El calendario (noviembre 2026, jueves 12, 18:00) es ilustrativo.

## Regenerar

```bash
cd video
python3 audio/build_audio.py egresados/cues.json egresados/audio.wav
PAGE=video/egresados/index.html NODE_PATH=$(npm root -g) node render.cjs frames
cd egresados && ffmpeg -framerate 60 -i renders/frames/%05d.png -i audio.wav \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k \
  -shortest -movflags +faststart newtrips-egresados-ads.mp4
```
