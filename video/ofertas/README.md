# Anuncio "Caribe y Brasil" (Meta Ads)

Video vertical 1080×1920, 26 s (120 BPM), 60 fps, para Reels/Stories en Meta Ads: `newtrips-caribe-brasil-ads.mp4`.

## Datos

Salen de la sección **Caribe** y **Brasil** de https://newtrips.vercel.app (`lib/paquetes-data.js`), sin la sección Grupales.
Para cada destino se muestra la oferta más baja publicada: el precio es por persona en base doble.

| Destino | Desde | Duración | Régimen | Extra que se muestra |
|---|---|---|---|---|
| Punta Cana | USD 860 | 9 días / 8 noches | Solo alojamiento | All inclusive desde USD 1.701 |
| Cancún | USD 959 | 9 días / 8 noches | Solo alojamiento | — |
| La Romana | USD 1.387 | 9 días / 8 noches | All inclusive | — |
| Natal + Pipa | USD 466 | 9 días / 8 noches | Desayuno incluido | Valija de 23 kg incluida |
| Maragogi | USD 631 | 9 días / 8 noches | Desayuno incluido | Valija de 23 kg incluida |
| Río + Búzios | USD 649 | 9 días / 8 noches | Solo alojamiento | Valija de 23 kg incluida |

Todos incluyen aéreo desde Buenos Aires, traslados, 8 noches de hotel y asistencia al viajero; no incluyen gastos de gestión.
Las cuotas, según el sitio, son para la parte terrestre (se aclara en letra chica).

**Antes de pautar, revisá que los precios sigan vigentes en el sitio.** Si cambian, se editan en `CARIBE` y `BRASIL` (`scenes.js`) y se vuelve a renderizar.

## Fotos

- `img/puntacana.jpg`, `cancun.jpg`, `laromana.jpg`, `natal.jpg`, `maragogi.jpg`, `buzios.jpg`: las del sitio.
- `img/ai-aerea.jpg`, `img/ai-catamaran.jpg`: generadas con Higgsfield; solo de fondo en el gancho y en el título "Caribe", sin nombre de destino.

## Pensado para Meta

- Gancho y precio en los primeros 2 segundos; se entiende sin sonido.
- Velocidad: `SPEED` en `scenes.js` (1,2 = 26 s; 1 = 31,2 s). Si se cambia, escalar también los tiempos de `cues.json`.
- Todo el texto importante entre y=270 e y=1250, fuera de las zonas que tapan la interfaz y el botón del anuncio.
- Cierre con "Link acá abajo" y una flecha hacia el botón de llamada a la acción.

## Regenerar

```bash
cd video
python3 audio/build_audio.py ofertas/cues.json ofertas/audio.wav
PAGE=video/ofertas/index.html NODE_PATH=$(npm root -g) node render.cjs frames
cd ofertas && ffmpeg -framerate 60 -i renders/frames/%05d.png -i audio.wav \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k \
  -shortest -movflags +faststart newtrips-caribe-brasil-ads.mp4
```
