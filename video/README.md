# Reel "Diseñá tu viaje"

Video vertical para Reels / TikTok / Shorts que invita a completar el formulario para diseñar un viaje a medida.

**Archivo final:** `newtrips-disena-tu-viaje.mp4` — 1080×1920, 16 s, 60 fps, H.264 + AAC.

## Storyboard (120 BPM · 1 compás = 2 s)

| Tiempo | Escena | Qué pasa |
|---|---|---|
| 0–2 s | Gancho | "¿CUÁL ES / EL VIAJE / DE TUS / SUEÑOS?" — una palabra gigante por beat |
| 2–4 s | Destinos | Camboriú, Bariloche, Talampaya y Roma a sangre: "¿PLAYA? ¿MONTAÑA? ¿AVENTURA? ¿EUROPA?" |
| 4–6 s | Propuesta | "DISEÑÁ TU VIAJE" + sticker "A TU MEDIDA" |
| 6–10 s | Formulario | El formulario se completa al ritmo: destino, fechas, pasajeros, intereses, presupuesto y "Enviar" con confeti |
| 10–12 s | Beneficio | "TU DESTINO. TUS FECHAS. TU RITMO. TU VIAJE." |
| 12–14 s | Ruta | "LO ARMAMOS A TU MEDIDA": avión recorriendo Salta, Cataratas y Punta del Este |
| 14–16 s | Cierre | Escudo + logo + botón "COMPLETÁ EL FORMULARIO" · "link en la bio" · @newtripsviajes |

## Cómo se regenera

Cada cuadro se dibuja a partir del tiempo `t` (`scenes.js`), Chromium lo captura y ffmpeg arma el MP4.

```bash
cd video
python3 audio/build_audio.py                                   # audio/audio.wav (necesita numpy + ffmpeg)
NODE_PATH=$(npm root -g) node render.cjs snapshot 1,7.5,15     # capturas sueltas para revisar
NODE_PATH=$(npm root -g) node render.cjs frames                # 960 cuadros en renders/frames
ffmpeg -framerate 60 -i renders/frames/%05d.png -i audio/audio.wav \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k \
  -shortest -movflags +faststart newtrips-disena-tu-viaje.mp4
```

Requiere Node con `playwright` instalado globalmente, Chromium y ffmpeg.

- **Textos:** se cambian en `scenes.js`. Por ejemplo, el llamado final está en la escena S7.
- **Efectos de sonido:** los tiempos están en `audio/cues.json`.
