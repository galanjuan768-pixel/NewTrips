# lib/base.js

Utilidades compartidas por las composiciones nuevas (`egresados-padres`, `egresados-hype`, `egresados-pasos`):
helpers de animación (`tf`, `mb`, `fit`, easings), escenas, fotos, confeti, el cierre común `endCard()` y `finish()`,
que registra `renderAt`, `__prepare` y `__duration` para `render.cjs`.

Regenerar cualquiera (ejemplo):

```bash
cd video
python3 audio/build_audio.py egresados-hype/cues.json egresados-hype/audio.wav
PAGE=video/egresados-hype/index.html NODE_PATH=$(npm root -g) node render.cjs frames
ffmpeg -framerate 60 -i egresados-hype/renders/frames/%05d.png -i egresados-hype/audio.wav \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart \
  egresados-hype/newtrips-egresados-hype.mp4
```
