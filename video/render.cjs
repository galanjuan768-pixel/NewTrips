// Render cuadro por cuadro con Chromium (Playwright) + ffmpeg.
//   node render.cjs snapshot 0,0.3,2.1 [salida]   → PNG sueltos para revisar
//   node render.cjs frames                         → renders/frames/%05d.png a 60 fps
// Requiere playwright (NODE_PATH=$(npm root -g)) y ffmpeg.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..'); // raíz del repo: el video usa ../assets
const FPS = 60, DUR = 16, W = 1080, H = 1920;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2', '.jpg': 'image/jpeg' };

function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}

async function openPage(browser, url) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('pageerror:', e.message));
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => window.__prepare());
  return page;
}

async function shot(page, t, file) {
  await page.evaluate((tt) => window.renderAt(tt), t);
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: W, height: H } });
}

(async () => {
  const [mode = 'frames', arg, outArg] = process.argv.slice(2);
  const srv = await serve();
  const url = `http://127.0.0.1:${srv.address().port}/video/index.html`;
  const browser = await chromium.launch({ args: ['--font-render-hinting=none', '--disable-lcd-text'] });
  try {
    if (mode === 'snapshot') {
      const out = path.resolve(outArg || path.join(__dirname, 'snapshots'));
      fs.mkdirSync(out, { recursive: true });
      const page = await openPage(browser, url);
      for (const t of arg.split(',').map(Number)) {
        await shot(page, t, path.join(out, `t${t.toFixed(3).padStart(6, '0')}.png`));
      }
    } else {
      const out = path.join(__dirname, 'renders', 'frames');
      fs.mkdirSync(out, { recursive: true });
      const N = Math.round(FPS * DUR), WORKERS = Number(process.env.WORKERS || 4);
      let done = 0;
      await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
        const page = await openPage(browser, url);
        for (let i = w; i < N; i += WORKERS) {
          await shot(page, i / FPS, path.join(out, String(i).padStart(5, '0') + '.png'));
          if (++done % 60 === 0) console.log(`${done}/${N}`);
        }
      }));
    }
  } finally {
    await browser.close();
    srv.close();
  }
})();
