# New Trips · Viajes

Sitio web de **New Trips Viajes**: paquetes de viaje grupales en bus y avión por Argentina, Brasil, Chile, Uruguay y Europa, con cuotas sin interés y promociones.

**Sitio en vivo:** https://galanjuan768-pixel.github.io/NewTrips/

## Estructura

- `index.html` — página principal (home, catálogo de paquetes y detalle en una SPA React)
- `src/data.js` — datos de los paquetes (destinos, salidas, precios, promociones)
- `src/components.jsx`, `src/screens.jsx`, `src/listado.jsx`, `src/app.jsx` — código fuente React (JSX)
- `src/*.js` — versiones compiladas de los JSX que carga el navegador
- `src/styles.css`, `src/responsive.css`, `src/listado.css` — estilos
- `assets/` — logos, fotos de destinos y video del hero
- `vendor/` — React 18.3.1 (build de producción, servido localmente)

## Cómo editar

Para cambiar datos de paquetes (precios, fechas, promos) editá `src/data.js` directamente — no requiere compilación.

Para cambiar la interfaz, editá los `.jsx` y recompilá:

```bash
npm install --no-save @babel/cli @babel/core @babel/preset-react
npx babel --presets @babel/preset-react src/components.jsx -o src/components.js
npx babel --presets @babel/preset-react src/screens.jsx -o src/screens.js
npx babel --presets @babel/preset-react src/listado.jsx -o src/listado.js
npx babel --presets @babel/preset-react src/app.jsx -o src/app.js
```

## Deploy

El sitio se publica automáticamente en GitHub Pages con cada push (workflow en `.github/workflows/deploy-pages.yml`).

Para verlo localmente:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```
