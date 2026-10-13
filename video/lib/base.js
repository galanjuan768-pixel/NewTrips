/* Utilidades compartidas por las composiciones de video (1080×1920).
   Cada cuadro se dibuja a partir de t: sin transiciones CSS, sin timers y sin azar sin semilla.
   Uso: <script src="../lib/base.js"></script> y luego const { h, tf, ... } = NTV; */
window.NTV = (function () {
  const W = 1080, H = 1920, BEAT = 0.5;
  const C = {
    red: '#ED1C24', redDark: '#B8131A', cream: '#FAF6EE', creamWarm: '#F2EBDA',
    ink: '#1A1410', inkSoft: '#4A3F37', yellow: '#FFD23F', line: 'rgba(26,20,16,.12)',
  };
  const NS = 'http://www.w3.org/2000/svg';
  const root = document.getElementById('root');
  const bg = document.getElementById('bg');
  const fx = document.getElementById('fx');
  const LOGO = (n) => '../../assets/' + n + '.png';

  // ---------- utilidades ----------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  const E = {
    outExpo: (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    inExpo: (x) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10)),
    inOutExpo: (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2),
    outBack: (x) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); },
    inOutCubic: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    spring: (x) => (x <= 0 ? 0 : 1 - Math.exp(-6 * x) * Math.cos(13 * x)),
  };
  const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  // golpe que decae después de un instante (para "kicks" en la corchea)
  const kick = (t, at, k = 16) => (t >= at ? Math.exp(-(t - at) * k) : 0);

  function h(tag, o = {}, parent) {
    const el = document.createElement(tag);
    if (o.cls) el.className = o.cls;
    if (o.style) Object.assign(el.style, o.style);
    if (o.text != null) el.textContent = o.text;
    if (o.html != null) el.innerHTML = o.html;
    if (o.src) el.src = o.src;
    if (parent) parent.appendChild(el);
    return el;
  }
  function tf(el, o) {
    const x = o.x || 0, y = o.y || 0, r = o.r || 0;
    const s = o.s != null ? o.s : 1;
    const sx = o.sx != null ? o.sx : s, sy = o.sy != null ? o.sy : s;
    el.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${r.toFixed(3)}deg) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    if (o.o != null) el.style.opacity = clamp(o.o).toFixed(3);
  }
  // motion blur direccional con un filtro SVG por elemento
  let fxN = 0;
  function mb(el, bx, by) {
    bx = Math.abs(bx); by = Math.abs(by);
    if (!el._f) {
      const id = 'mb' + fxN++;
      const f = document.createElementNS(NS, 'filter');
      f.setAttribute('id', id);
      for (const [k, v] of [['x', '-50%'], ['y', '-50%'], ['width', '200%'], ['height', '200%']]) f.setAttribute(k, v);
      const g = document.createElementNS(NS, 'feGaussianBlur');
      f.appendChild(g); fx.appendChild(f);
      el._f = { id, g };
    }
    if (bx < 0.25 && by < 0.25) { el.style.filter = 'none'; return; }
    el._f.g.setAttribute('stdDeviation', bx.toFixed(2) + ' ' + by.toFixed(2));
    el.style.filter = `url(#${el._f.id})`;
  }
  // ajusta el tamaño de fuente para que el texto ocupe un ancho exacto (se mide una vez, con las fuentes cargadas)
  function fit(el, w) {
    el.style.fontSize = '200px';
    const fs = (200 * w) / el.offsetWidth;
    el.style.fontSize = fs.toFixed(2) + 'px';
    return fs;
  }
  const svg = (inner, vb, w, hgt) => `<svg xmlns="${NS}" viewBox="${vb}" width="${w}" height="${hgt}" style="display:block">${inner}</svg>`;
  const CHECK = (stroke) => svg(`<path d="M6 12.5l4 4 8-9" fill="none" stroke="${stroke}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`, '0 0 24 24', '100%', '100%');
  const PLANE = svg('<path d="M46 24 L31 19.5 L22 5 L16.5 5 L21 19.5 L10 20.5 L6 14.5 L2.5 14.5 L4.5 24 L2.5 33.5 L6 33.5 L10 27.5 L21 28.5 L16.5 43 L22 43 L31 28.5 Z" fill="#FFD23F" stroke="#1A1410" stroke-width="1.5" stroke-linejoin="round"/>', '0 0 48 48', 96, 96);
  const POINTER = svg('<path d="M3 2 L3 19 L7.5 14.8 L10.5 21.5 L13.6 20.1 L10.6 13.5 L16.8 13.5 Z" fill="#1A1410" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/>', '0 0 24 24', 84, 84);
  const ARROW = (c) => svg(`<path d="M4 12h15M13 5.5l6.5 6.5-6.5 6.5" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`, '0 0 24 24', 64, 64);

  const scenes = [];
  function scene(start, end, z) {
    const el = h('section', { cls: 'scene', style: { zIndex: z || scenes.length + 1 } }, root);
    const s = { start, end, el, prepare: null, render: null };
    scenes.push(s);
    return s;
  }

  // capa de foto a sangre con degradés para que el texto se lea
  function photo(parent, src, pos, grad) {
    const card = h('div', { cls: 'layer', style: { overflow: 'hidden', background: C.ink } }, parent);
    const img = h('img', { cls: 'cover', src, style: { objectPosition: pos || '50% 50%', transformOrigin: '50% 50%' } }, card);
    h('div', { cls: 'layer', style: { background: grad || 'linear-gradient(180deg, rgba(26,20,16,.55) 0%, rgba(26,20,16,0) 30%, rgba(26,20,16,0) 55%, rgba(26,20,16,.7) 100%)' } }, card);
    const flash = h('div', { cls: 'layer', style: { background: '#fff', opacity: 0 } }, card);
    return { card, img, flash };
  }
  function wipe(parent, color) {
    return h('div', { cls: 'abs', style: { borderRadius: '50%', background: color, width: '0', height: '0' } }, parent);
  }
  function setWipe(el, cx, cy, R) {
    Object.assign(el.style, { width: 2 * R + 'px', height: 2 * R + 'px', left: cx - R + 'px', top: cy - R + 'px' });
  }
  const SHADOW = '0 10px 40px rgba(0,0,0,.35)';

  // zona segura de Reels/Stories en Meta: el contenido clave va entre y=270 e y=1250
  const SAFE_TOP = 270, SAFE_BOTTOM = 1250;
  const STAR = (c) => svg(`<path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" fill="${c}"/>`, '0 0 24 24', '100%', '100%');
  // confeti determinista que sale desde (ox, oy) en el instante t0
  function confetti(parent, n, seed) {
    return Array.from({ length: n }, (_, k) => {
      const col = [C.yellow, C.cream, C.red, C.ink, C.yellow][k % 5];
      return h('div', { cls: 'abs', style: { left: '0', top: '0', width: 12 + hash(k + seed) * 16 + 'px', height: 8 + hash(k + seed + 50) * 10 + 'px', background: col, borderRadius: '2px', opacity: 0 } }, parent);
    });
  }
  function renderConfetti(list, t, t0, ox, oy, seed, spread = 2.6) {
    const ct = t - t0;
    list.forEach((c, k) => {
      if (ct < 0 || ct > 1.6) { c.style.opacity = '0'; return; }
      const ang = -Math.PI / 2 + (hash(k + seed + 7) - 0.5) * spread, sp = 900 + hash(k + seed + 21) * 1200;
      c.style.left = (ox + Math.cos(ang) * sp * ct).toFixed(1) + 'px';
      c.style.top = (oy + Math.sin(ang) * sp * ct + 1300 * ct * ct).toFixed(1) + 'px';
      tf(c, { r: (hash(k + seed + 3) - 0.5) * 1400 * ct, sx: Math.cos(ct * (8 + hash(k + seed) * 10)), o: 1 - prog(ct, 1.2, 1.6) });
    });
  }

  const DOWN = svg(`<path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`, '0 0 24 24', 86, 86);

  // Cierre común: escudo + wordmark + botón + "LINK ACÁ ABAJO" con flecha + datos de la agencia.
  // Todos los tiempos son relativos a `start` (el cierre dura `dur`).
  function endCard(start, dur, cta, info) {
    const s = scene(start, start + dur);
    const SHC = { x: 540, y: 470 };
    const rings = Array.from({ length: Math.ceil(dur / BEAT) }, () => h('div', { cls: 'abs', style: { left: SHC.x - 170 + 'px', top: SHC.y - 170 + 'px', width: '340px', height: '340px', borderRadius: '50%', border: `6px solid ${C.red}`, boxSizing: 'border-box' } }, s.el));
    const shield = h('img', { cls: 'abs', src: LOGO('logo'), style: { left: SHC.x - 170 + 'px', top: SHC.y - 170 + 'px', width: '340px', height: '340px', transformOrigin: '50% 50%' } }, s.el);
    const wm = h('img', { cls: 'abs', src: LOGO('logo-wordmark-black'), style: { left: '220px', top: '690px', width: '640px' } }, s.el);
    const btn = h('div', { cls: 'abs', style: { left: '70px', top: '840px', width: '940px', height: '150px', borderRadius: '75px', background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', transformOrigin: '50% 50%', boxShadow: '0 20px 44px rgba(237,28,36,.32)' } }, s.el);
    const btnTxt = h('span', { text: cta, style: { fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontStretch: '75%', fontSize: '84px', color: C.cream, whiteSpace: 'nowrap', letterSpacing: '-.01em' } }, btn);
    const link = h('div', { cls: 'abs', text: 'LINK ACÁ ABAJO', style: { left: '0', width: W + 'px', textAlign: 'center', top: '1030px', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '64px', letterSpacing: '-.01em', color: C.ink } }, s.el);
    const arrow = h('div', { cls: 'abs', html: DOWN, style: { left: 540 - 70 + 'px', top: '1120px', width: '140px', height: '140px', borderRadius: '50%', background: C.yellow, border: `5px solid ${C.ink}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', transformOrigin: '50% 50%' } }, s.el);
    const inf = h('div', { cls: 'mono abs', html: info || 'OFICINA DE EGRESADOS · ALVARADO 1252 · MAR DEL PLATA<br>NEWTRIPS SRL · LEGAJO EVT N° 12.379', style: { left: '0', width: W + 'px', textAlign: 'center', top: '1300px', fontSize: '20px', lineHeight: '1.6', color: C.inkSoft } }, s.el);
    s.prepare = () => { const w = btnTxt.offsetWidth; if (w > 860) btnTxt.style.fontSize = (84 * 860 / w).toFixed(1) + 'px'; };
    s.render = (lt) => {
      rings.forEach((r, k) => { const a = k * BEAT, rp = E.outExpo(prog(lt, a, a + 1.2)); tf(r, { s: lerp(0.95, 2.2, rp), o: lt >= a ? (1 - prog(lt, a, a + 1.2)) * 0.5 : 0 }); });
      const m = E.outBack(prog(lt, 0, 0.4));
      tf(shield, { s: m, r: lerp(-16, 0, m) + Math.sin(lt * 3) * 1.2, y: Math.sin(lt * 2.4) * 6 });
      const ew = E.outExpo(prog(lt, 0.25, 0.55));
      tf(wm, { y: lerp(120, 0, ew), o: prog(lt, 0.25, 0.31) }); mb(wm, 0, lerp(24, 0, ew));
      const c = E.outBack(prog(lt, 0.5, 0.82));
      tf(btn, { s: c * (1 + kick(lt, 1.5, 9) * 0.05 + kick(lt, 2.5, 9) * 0.05), o: c > 0.01 ? 1 : 0 });
      tf(link, { y: lerp(40, 0, E.outExpo(prog(lt, 0.75, 1.05))), o: prog(lt, 0.75, 0.85) });
      const a = E.outBack(prog(lt, 0.9, 1.2));
      const bounce = lt >= 1.2 ? Math.abs(Math.sin(((lt - 1.2) / BEAT) * Math.PI)) * 26 : 0;
      tf(arrow, { s: a, y: bounce, o: a > 0.01 ? 1 : 0 });
      tf(inf, { o: prog(lt, 1.1, 1.3) });
    };
    return s;
  }

  // Registra renderAt/__prepare/__duration. `speed` comprime el tiempo; `cuts` da un golpe de zoom en cada corte.
  function finish(bgAt, duration, speed = 1, cuts = []) {
    window.renderAt = function (tReal) {
      const t = tReal * speed;
      bg.style.background = bgAt(t);
      if (cuts.length) tf(root, { s: 1 + cuts.reduce((acc, c) => acc + kick(t, c, 9), 0) * 0.035 });
      for (const s of scenes) {
        const on = t >= s.start && t < s.end;
        s.el.style.display = on ? 'block' : 'none';
        if (on) s.render(t - s.start, t);
      }
    };
    window.__prepare = async function () {
      await Promise.all(['800 100px "Bricolage Grotesque"', '600 40px "DM Sans"', '600 20px "JetBrains Mono"'].map((f) => document.fonts.load(f, 'ÁÑ¿?abc')));
      await document.fonts.ready;
      await Promise.all([...document.images].map((im) => im.decode().catch(() => {})));
      scenes.forEach((s) => (s.el.style.display = 'block'));
      scenes.forEach((s) => s.prepare && s.prepare());
      scenes.forEach((s) => (s.el.style.display = 'none'));
      window.renderAt(0);
      return true;
    };
    window.__duration = duration / speed;
  }

  const EG_IMG = (n) => '../egresados/img/' + n + '.jpg'; // fotos de newtrips.vercel.app/egresados.html
  return {
    W, H, C, NS, root, bg, fx, BEAT, clamp, lerp, prog, E, hash, kick, h, tf, mb, fit, svg, CHECK, PLANE, POINTER, ARROW, DOWN,
    scenes, scene, photo, wipe, setWipe, SHADOW, SAFE_TOP, SAFE_BOTTOM, STAR, confetti, renderConfetti, LOGO, EG_IMG, endCard, finish,
  };
})();
