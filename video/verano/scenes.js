/* New Trips · "Verano 2027: Caribe y Brasil" — reel 1080×1920, 18 s, 120 BPM.
   Cada cuadro se dibuja desde cero a partir de t (renderAt): sin transiciones CSS,
   sin timers y sin azar sin semilla, para poder renderizar cualquier cuadro en cualquier orden. */
(function () {
  const W = 1080, H = 1920, BEAT = 0.5;
  const C = {
    red: '#ED1C24', redDark: '#B8131A', cream: '#FAF6EE', creamWarm: '#F2EBDA',
    ink: '#1A1410', inkSoft: '#4A3F37', yellow: '#FFD23F', line: 'rgba(26,20,16,.12)',
  };
  const NS = 'http://www.w3.org/2000/svg';
  const root = document.getElementById('root');
  const bg = document.getElementById('bg');
  const fx = document.getElementById('fx');
  const PHOTO = (n) => '../../assets/photos/' + n + '.png';
  const IMG = (n) => 'img/' + n + '.png'; // fotos del Caribe generadas con Higgsfield
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

  // ======================================================================
  // S1 · 0–2 s · "VERANO / 2027" con un sol que sale
  // ======================================================================
  const s1 = scene(0, 2);
  const SUN = { x: 540, y: 1170, r: 470 };
  const rays = h('div', { cls: 'abs', style: { left: SUN.x + 'px', top: SUN.y + 'px', width: '0', height: '0' } }, s1.el);
  for (let k = 0; k < 16; k++) {
    h('div', { cls: 'abs', style: { left: '-9px', top: '-760px', width: '18px', height: '220px', borderRadius: '9px', background: C.yellow, opacity: 0.55, transformOrigin: '9px 760px', transform: `rotate(${k * 22.5}deg)` } }, rays);
  }
  const sun = h('div', { cls: 'abs', style: { left: SUN.x - SUN.r + 'px', top: SUN.y - SUN.r + 'px', width: 2 * SUN.r + 'px', height: 2 * SUN.r + 'px', borderRadius: '50%', background: C.yellow, transformOrigin: '50% 50%' } }, s1.el);
  const lab1 = h('div', { cls: 'mono abs', text: 'NEWTRIPS · TEMPORADA DE VERANO', style: { left: '64px', top: '250px', fontSize: '26px', color: C.cream } }, s1.el);
  const ver1 = h('div', { cls: 'disp abs', text: 'VERANO', style: { left: '60px', top: '310px', color: C.cream, transformOrigin: '50% 50%' } }, s1.el);
  const y27 = h('div', { cls: 'disp abs', text: '2027', style: { left: '0', color: C.ink, transformOrigin: '50% 50%' } }, s1.el);
  const st1 = h('div', {
    cls: 'abs', text: '¿DÓNDE LO PASÁS?',
    style: { left: '50%', top: '1540px', background: C.ink, color: C.cream, padding: '20px 40px', borderRadius: '999px', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '58px', whiteSpace: 'nowrap', boxShadow: '0 18px 40px rgba(26,20,16,.25)', transformOrigin: '50% 50%' },
  }, s1.el);
  s1.prepare = () => {
    fit(ver1, 960);
    const fs = fit(y27, 760);
    y27.style.left = (W - y27.offsetWidth) / 2 + 'px';
    y27.style.top = SUN.y - (fs * 0.86) / 2 - 10 + 'px';
    st1.style.marginLeft = -st1.offsetWidth / 2 + 'px';
  };
  s1.render = (lt) => {
    const es = E.outExpo(prog(lt, 0, 0.7));
    const pulse = 1 + kick(lt, Math.floor(lt * 2) / 2, 8) * 0.025;
    tf(sun, { y: lerp(1100, 0, es), s: pulse });
    tf(rays, { y: lerp(1100, 0, es), r: lt * 18, o: prog(lt, 0.3, 0.7) });
    const e1 = E.outExpo(prog(lt, 0, 0.24));
    tf(ver1, { s: lerp(1.7, 1, e1), sy: lerp(1.7, 1, e1) * (1 - kick(lt, 0.5) * 0.06) });
    mb(ver1, 0, lerp(34, 0, E.outExpo(prog(lt, 0, 0.16))));
    const e2 = E.outExpo(prog(lt, 1.0, 1.24));
    tf(y27, { y: lerp(-140, 0, e2), s: lerp(1.6, 1, e2) * (1 + kick(lt, 1.25) * 0.05), o: prog(lt, 1.0, 1.04) });
    mb(y27, 0, lerp(34, 0, E.outExpo(prog(lt, 1.0, 1.16))));
    const m = E.outBack(prog(lt, 1.5, 1.8));
    tf(st1, { s: m, r: lerp(-30, 5, m), o: m > 0.01 ? 1 : 0 });
    tf(lab1, { o: prog(lt, 0.1, 0.25) });
  };

  // ======================================================================
  // S2 · 2–4 s · Pantalla partida: "¿CARIBE" arriba, "O BRASIL?" abajo, sello "¡LOS DOS!"
  // ======================================================================
  const s2 = scene(2, 4);
  const halves = [
    { src: IMG('catamaran'), pos: '50% 45%', word: '¿CARIBE', lab: 'CARIBE · AÉREO' },
    { src: PHOTO('camboriu'), pos: '28% 50%', word: 'O BRASIL?', lab: 'BRASIL · BUS' },
  ].map((d, i) => {
    const box = h('div', { cls: 'abs', style: { left: '0', top: i * 960 + 'px', width: W + 'px', height: '960px', overflow: 'hidden' } }, s2.el);
    const ph = photo(box, d.src, d.pos, i ? 'linear-gradient(180deg, rgba(26,20,16,0) 40%, rgba(26,20,16,.65) 100%)' : 'linear-gradient(180deg, rgba(26,20,16,.45) 0%, rgba(26,20,16,0) 35%, rgba(26,20,16,0) 50%, rgba(26,20,16,.55) 100%)');
    const word = h('div', { cls: 'disp abs', text: d.word, style: { left: '60px', color: C.cream, textShadow: SHADOW, transformOrigin: '50% 50%' } }, box);
    const lab = h('div', { cls: 'mono abs', text: d.lab, style: { left: '64px', top: i ? '60px' : '250px', fontSize: '24px', color: C.cream, textShadow: '0 2px 10px rgba(0,0,0,.5)' } }, box);
    return { box, ph, word, lab };
  });
  const split = h('div', { cls: 'abs', style: { left: '0', top: '953px', width: W + 'px', height: '14px', background: C.cream, transformOrigin: '50% 50%' } }, s2.el);
  const both = h('div', {
    cls: 'abs', html: '<span style="display:block;font-size:30px;letter-spacing:.14em;font-family:JetBrains Mono;font-weight:700">¿Y SI SON</span>¡LOS DOS!',
    style: { left: '540px', top: '960px', width: '0', height: '0' },
  }, s2.el);
  const bothIn = h('div', { cls: 'abs', style: { left: '-170px', top: '-170px', width: '340px', height: '340px', borderRadius: '50%', background: C.yellow, color: C.ink, border: `6px solid ${C.ink}`, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '62px', lineHeight: '1', transformOrigin: '50% 50%', boxShadow: '0 20px 50px rgba(0,0,0,.35)' } }, both);
  while (both.firstChild && both.firstChild !== bothIn) bothIn.appendChild(both.firstChild);
  s2.prepare = () => {
    halves.forEach((hv, i) => {
      const fs = fit(hv.word, 960);
      hv.word.style.top = (i ? 960 - 120 - fs * 0.86 : 960 - 90 - fs * 0.86) + 'px';
    });
  };
  s2.render = (lt) => {
    halves.forEach((hv, i) => {
      const a = i * 0.25, e = E.outExpo(prog(lt, a, a + 0.32));
      tf(hv.box, { x: (i ? 1 : -1) * lerp(1080, 0, e) });
      mb(hv.box, lerp(50, 0, E.outExpo(prog(lt, a, a + 0.2))), 0);
      tf(hv.ph.img, { s: lerp(1.25, 1.06, E.outExpo(prog(lt, a, a + 1))) + lt * 0.02 });
      const wa = 0.5 + i * 0.5, ew = E.outExpo(prog(lt, wa, wa + 0.25));
      tf(hv.word, { y: lerp(i ? 200 : -200, 0, ew), s: lerp(1.4, 1, ew), o: prog(lt, wa, wa + 0.04) });
      mb(hv.word, 0, lerp(30, 0, ew));
      tf(hv.lab, { o: prog(lt, a + 0.1, a + 0.25) });
    });
    tf(split, { sx: E.outExpo(prog(lt, 0.25, 0.5)) });
    const m = E.outBack(prog(lt, 1.5, 1.82));
    tf(bothIn, { s: m * (1 + kick(lt, 1.75) * 0.08), r: lerp(-60, -8, m) + Math.sin(lt * 8) * 1.5, o: m > 0.01 ? 1 : 0 });
  };

  // ======================================================================
  // S3 · 4–7 s · CARIBE: tres fotos, título fijo y chips que se acumulan
  // ======================================================================
  const s3 = scene(4, 7);
  const S3P = [
    { src: IMG('punta-cana'), pos: '50% 50%', lab: 'PUNTA CANA · REP. DOMINICANA' },
    { src: IMG('cancun'), pos: '50% 50%', lab: 'CANCÚN · MÉXICO' },
    { src: IMG('hamaca'), pos: '50% 50%', lab: 'VOS ELEGÍS EL DESTINO' },
  ].map((d) => ({ ...photo(s3.el, d.src, d.pos), lab: d.lab }));
  const lab3 = h('div', { cls: 'mono abs', text: '', style: { left: '64px', top: '250px', fontSize: '26px', color: C.cream, textShadow: '0 2px 10px rgba(0,0,0,.5)' } }, s3.el);
  const tit3 = h('div', { cls: 'disp abs', text: 'CARIBE', style: { left: '60px', top: '300px', color: C.cream, textShadow: SHADOW, transformOrigin: '50% 50%' } }, s3.el);
  const PLANE_SM = svg('<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" fill="currentColor"/>', '0 0 24 24', 44, 44);
  const CHIPS3 = [
    { html: `<span style="display:inline-block;transform:rotate(90deg)">${PLANE_SM}</span>VUELO`, at: 4.5, bg: C.cream, fg: C.ink },
    { html: 'HOTEL + TRASLADOS', at: 5.0, bg: C.cream, fg: C.ink },
    { html: 'ARMADO A TU MEDIDA', at: 5.5, bg: C.red, fg: C.cream },
  ].map((c, i) => ({
    ...c,
    el: h('div', {
      cls: 'abs', html: c.html,
      style: { left: '60px', top: 1180 + i * 122 + 'px', height: '100px', padding: '0 36px', borderRadius: '50px', background: c.bg, color: c.fg, display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '50px', whiteSpace: 'nowrap', boxShadow: '0 14px 30px rgba(0,0,0,.25)', transformOrigin: '0% 50%' },
    }, s3.el),
  }));
  s3.prepare = () => { fit(tit3, 960); };
  s3.render = (lt, t) => {
    const i = Math.min(2, Math.floor(lt)), u = lt - i;
    S3P.forEach((p, j) => (p.card.style.display = j === i ? 'block' : 'none'));
    const p = S3P[i];
    tf(p.img, { s: lerp(1.3, 1.08, E.outExpo(prog(u, 0, 0.5))) - u * 0.03, x: (i % 2 ? 1 : -1) * lerp(90, 0, E.outExpo(prog(u, 0, 0.3))) });
    mb(p.img, lerp(24, 0, E.outExpo(prog(u, 0, 0.14))), 0);
    p.flash.style.opacity = lerp(0.6, 0, prog(u, 0, 0.12)).toFixed(3);
    lab3.textContent = p.lab;
    tf(lab3, { x: lerp(-60, 0, E.outExpo(prog(u, 0.05, 0.3))), o: prog(u, 0.05, 0.15) });
    const e = E.outExpo(prog(lt, 0, 0.25));
    tf(tit3, { s: lerp(1.6, 1, e) * (1 + kick(u, 0, 12) * 0.05 * (i > 0)), o: prog(lt, 0, 0.04) });
    mb(tit3, 0, lerp(32, 0, E.outExpo(prog(lt, 0, 0.16))));
    CHIPS3.forEach((c) => {
      const m = E.outBack(prog(t, c.at, c.at + 0.28));
      tf(c.el, { x: lerp(-200, 0, E.outExpo(prog(t, c.at, c.at + 0.3))), s: m, o: m > 0.01 ? 1 : 0 });
    });
  };

  // ======================================================================
  // S4 · 7–10 s · BRASIL: Camboriú + tarjeta con lo que incluye
  // ======================================================================
  const s4 = scene(7, 10);
  const p4 = photo(s4.el, PHOTO('camboriu'), '30% 50%');
  const lab4 = h('div', { cls: 'mono abs', text: 'BALNEARIO CAMBORIÚ · BRASIL', style: { left: '64px', top: '250px', fontSize: '26px', color: C.cream, textShadow: '0 2px 10px rgba(0,0,0,.5)' } }, s4.el);
  const tit4 = h('div', { cls: 'disp abs', text: 'BRASIL', style: { left: '60px', top: '300px', color: C.cream, textShadow: SHADOW, transformOrigin: '50% 50%' } }, s4.el);
  const card4 = h('div', { cls: 'abs', style: { left: '60px', top: '1010px', width: '960px', height: '520px', borderRadius: '40px', background: C.cream, boxShadow: '0 30px 70px rgba(0,0,0,.35)', transformOrigin: '50% 50%' } }, s4.el);
  h('div', { cls: 'abs', text: 'Camboriú con Federación', style: { left: '48px', top: '40px', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '60px', letterSpacing: '-.02em', color: C.ink, whiteSpace: 'nowrap', lineHeight: '1' } }, card4);
  h('div', { cls: 'mono abs', text: 'SALIDAS EN BUS · VERANO 2027', style: { left: '50px', top: '114px', fontSize: '22px', color: C.red } }, card4);
  const ROWS4 = ['12 días · 7 noches', 'Hotel con pileta climatizada', 'Media pensión', 'Family Plan'].map((txt, i) => {
    const row = h('div', { cls: 'abs', style: { left: '48px', top: 180 + i * 80 + 'px', display: 'flex', alignItems: 'center', gap: '22px', transformOrigin: '0% 50%' } }, card4);
    h('div', { html: CHECK('#fff'), style: { width: '50px', height: '50px', borderRadius: '50%', background: C.red, flex: 'none' } }, row);
    h('span', { text: txt, style: { fontFamily: 'DM Sans', fontWeight: 600, fontSize: '44px', color: C.ink, whiteSpace: 'nowrap' } }, row);
    return row;
  });
  const ROW4_AT = [7.75, 8.25, 8.75, 9.25];
  const wipe4 = wipe(s4.el, C.ink);
  s4.prepare = () => { fit(tit4, 960); };
  s4.render = (lt, t) => {
    tf(p4.img, { s: lerp(1.3, 1.12, E.outExpo(prog(lt, 0, 0.6))), x: lerp(40, -40, lt / 3) });
    mb(p4.img, lerp(24, 0, E.outExpo(prog(lt, 0, 0.14))), 0);
    p4.flash.style.opacity = lerp(0.6, 0, prog(lt, 0, 0.12)).toFixed(3);
    const e = E.outExpo(prog(lt, 0, 0.25));
    tf(tit4, { s: lerp(1.6, 1, e), sy: lerp(1.6, 1, e) * (1 - kick(lt, 0.25) * 0.06), o: prog(lt, 0, 0.04) });
    mb(tit4, 0, lerp(32, 0, E.outExpo(prog(lt, 0, 0.16))));
    tf(lab4, { x: lerp(-60, 0, E.outExpo(prog(lt, 0.05, 0.3))), o: prog(lt, 0.05, 0.15) });
    const ec = E.outExpo(prog(t, 7.5, 7.9));
    tf(card4, { y: lerp(900, 0, ec) + Math.sin(t * 2.2) * 5, r: lerp(6, 0, ec) });
    mb(card4, 0, lerp(40, 0, E.outExpo(prog(t, 7.5, 7.75))));
    ROWS4.forEach((r, i) => {
      const m = E.outBack(prog(t, ROW4_AT[i], ROW4_AT[i] + 0.25));
      tf(r, { x: lerp(-60, 0, m), s: 0.6 + 0.4 * m, o: prog(t, ROW4_AT[i], ROW4_AT[i] + 0.06) });
    });
    setWipe(wipe4, 540, 1270, lerp(0, 2300, E.inExpo(prog(t, 9.72, 10.0))));
  };

  // ======================================================================
  // S5 · 10–14 s · Tablero de salidas (split-flap) + precio de Camboriú
  // ======================================================================
  const s5 = scene(10, 14);
  const tit5 = h('div', { cls: 'disp abs', text: 'PRÓXIMAS SALIDAS', style: { left: '60px', top: '300px', color: C.cream, transformOrigin: '50% 50%' } }, s5.el);
  const lab5 = h('div', { cls: 'mono abs', text: 'VERANO 2027 · EMBARQUES EN TU CIUDAD', style: { left: '64px', top: '250px', fontSize: '26px', color: C.yellow } }, s5.el);
  const COLS = [9, 8, 5], CW = 40, CG = 3, GAP = 22, CH = 74;
  const BX = (W - (COLS.reduce((a, b) => a + b, 0) * (CW + CG) - CG + GAP * 2)) / 2;
  const colX = [BX, BX + COLS[0] * (CW + CG) + GAP, BX + (COLS[0] + COLS[1]) * (CW + CG) + 2 * GAP];
  const BOARD_Y = 600;
  ['DESTINO', 'SALIDA', 'VÍA'].forEach((t, c) => h('div', { cls: 'mono abs', text: t, style: { left: colX[c] + 'px', top: BOARD_Y - 44 + 'px', fontSize: '20px', color: 'rgba(250,246,238,.55)' } }, s5.el));
  const ROWS5 = [['CAMBORIÚ', '11 ENE', 'BUS'], ['CAMBORIÚ', '25 ENE', 'BUS'], ['CAMBORIÚ', '08 FEB', 'BUS'], ['CARIBE', 'A MEDIDA', 'AÉREO']];
  const POOL = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ0123456789';
  const cells = [];
  ROWS5.forEach((row, r) => {
    let idx = 0;
    row.forEach((txt, c) => {
      const chars = txt.padEnd(COLS[c], ' ').split('');
      chars.forEach((ch, k) => {
        const el = h('div', {
          cls: 'abs',
          style: {
            left: colX[c] + k * (CW + CG) + 'px', top: BOARD_Y + r * (CH + 26) + 'px', width: CW + 'px', height: CH + 'px',
            borderRadius: '6px', background: '#2B231E', boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.35)', overflow: 'hidden',
          },
        }, s5.el);
        const tx = h('div', { cls: 'abs', text: '', style: { left: '0', top: '0', width: '100%', height: '100%', lineHeight: CH + 'px', textAlign: 'center', fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: '42px', color: c === 1 || r === 3 ? C.yellow : C.cream, transformOrigin: '50% 50%' } }, el);
        h('div', { cls: 'abs', style: { left: '0', top: CH / 2 - 1 + 'px', width: '100%', height: '2px', background: 'rgba(0,0,0,.55)' } }, el);
        cells.push({ el, tx, ch, r, i: idx++ });
      });
    });
  });
  const ROW5_AT = [10.5, 11.0, 11.5, 12.0];
  const price = h('div', { cls: 'abs', style: { left: '540px', top: '1290px', width: '0', height: '0' } }, s5.el);
  const priceIn = h('div', {
    cls: 'abs',
    style: { left: '-420px', top: '-150px', width: '840px', height: '300px', borderRadius: '34px', background: C.yellow, border: `6px solid ${C.ink}`, boxSizing: 'border-box', boxShadow: '0 24px 60px rgba(0,0,0,.4)', transformOrigin: '50% 50%', textAlign: 'center', color: C.ink },
  }, price);
  h('div', { cls: 'mono', text: 'CAMBORIÚ · 12 DÍAS EN BUS', style: { marginTop: '30px', fontSize: '24px' } }, priceIn);
  const priceTxt = h('div', { cls: 'disp', text: '$1.599.999', style: { marginTop: '8px', color: C.ink } }, priceIn);
  h('div', { cls: 'mono', text: 'POR PERSONA · BASE DOBLE', style: { marginTop: '10px', fontSize: '22px' } }, priceIn);
  const wipe5 = wipe(s5.el, C.red);
  s5.prepare = () => { fit(tit5, 960); fit(priceTxt, 680); };
  s5.render = (lt, t) => {
    const e = E.outExpo(prog(lt, 0, 0.3));
    tf(tit5, { x: lerp(-1150, 0, e) }); mb(tit5, lerp(60, 0, e), 0);
    tf(lab5, { o: prog(lt, 0.1, 0.25) });
    for (const c of cells) {
      const rowIn = E.outExpo(prog(t, 10.0 + c.r * 0.08, 10.35 + c.r * 0.08));
      tf(c.el, { y: lerp(60, 0, rowIn), o: rowIn });
      const st = ROW5_AT[c.r] + c.i * 0.018, settle = st + 0.28 + c.i * 0.006;
      let ch = ' ', flip = 1;
      if (t >= settle) { ch = c.ch; flip = 1 - kick(t, settle, 20) * 0.35; }
      else if (t >= st) {
        const f = t * 30;
        ch = POOL[Math.floor(hash(c.r * 97 + c.i * 13 + Math.floor(f)) * POOL.length)];
        flip = 0.55 + 0.45 * (f - Math.floor(f));
      }
      if (c.ch === ' ' && t >= st) ch = t >= settle ? ' ' : ch;
      c.tx.textContent = ch;
      tf(c.tx, { sy: flip });
    }
    const m = E.outBack(prog(t, 12.75, 13.1));
    tf(priceIn, { s: m * (1 + kick(t, 13.25) * 0.05), r: lerp(-25, -3, m) + Math.sin(t * 6) * 0.6, o: m > 0.01 ? 1 : 0 });
    setWipe(wipe5, 540, 1290, lerp(0, 2300, E.inExpo(prog(t, 13.72, 14.0))));
  };

  // ======================================================================
  // S6 · 14–16 s · "RESERVÁ HOY / Y PAGALO EN / CUOTAS / SIN INTERÉS"
  // ======================================================================
  const s6 = scene(14, 16);
  const L6 = ['RESERVÁ HOY', 'Y PAGALO EN', 'CUOTAS'].map((w) => h('div', { cls: 'disp abs', text: w, style: { left: '60px', color: C.cream, transformOrigin: '0% 50%' } }, s6.el));
  const band6 = h('div', { cls: 'abs', style: { left: '0', width: W + 'px', background: C.yellow, transformOrigin: '0% 50%' } }, s6.el);
  const last6 = h('div', { cls: 'disp abs', text: 'SIN INTERÉS', style: { left: '60px', color: C.ink, transformOrigin: '50% 50%' } }, s6.el);
  const sub6 = h('div', { cls: 'mono abs', text: 'SIN TARJETA DE CRÉDITO', style: { left: '64px', fontSize: '30px', color: C.cream } }, s6.el);
  const wipe6 = wipe(s6.el, C.cream);
  s6.prepare = () => {
    const hs = L6.map((el) => fit(el, 940) * 0.86);
    const hl = fit(last6, 960) * 0.86;
    let y = (H - (hs.reduce((a, b) => a + b, 0) + hl + 3 * 22 + 30 + 90)) / 2;
    L6.forEach((el, i) => { el.style.top = y + 'px'; y += hs[i] + 22; });
    y += 30;
    band6.style.top = y - 26 + 'px'; band6.style.height = hl + 44 + 'px';
    last6.style.top = y + 'px';
    sub6.style.top = y + hl + 60 + 'px';
  };
  s6.render = (lt, t) => {
    const drift = -lt * 24;
    L6.forEach((el, i) => {
      const a = i * BEAT, e = E.outExpo(prog(lt, a, a + 0.3));
      tf(el, { x: lerp(-1150, 0, e), y: drift, sx: 1 + kick(lt, a + 0.25) * 0.05 });
      mb(el, lerp(60, 0, E.outExpo(prog(lt, a, a + 0.2))), 0);
    });
    tf(band6, { sx: E.outExpo(prog(lt, 1.5, 1.7)), y: drift });
    const e4 = E.outExpo(prog(lt, 1.55, 1.8));
    tf(last6, { s: lerp(1.5, 1, e4), y: drift, o: prog(lt, 1.55, 1.6) });
    mb(last6, 0, lerp(30, 0, e4));
    tf(sub6, { y: drift + lerp(30, 0, E.outExpo(prog(lt, 1.6, 1.85))), o: prog(lt, 1.6, 1.7) });
    setWipe(wipe6, 540, 1920, lerp(0, 2300, E.inExpo(prog(t, 15.75, 16.0))));
  };

  // ======================================================================
  // S7 · 16–18 s · Cierre: escudo + wordmark + "RESERVÁ TU VERANO"
  // ======================================================================
  const s7 = scene(16, 18);
  const SHC = { x: 540, y: 590 };
  const rings7 = [16.0, 16.5, 17.0, 17.5].map(() => h('div', { cls: 'abs', style: { left: SHC.x - 230 + 'px', top: SHC.y - 230 + 'px', width: '460px', height: '460px', borderRadius: '50%', border: `6px solid ${C.red}`, boxSizing: 'border-box' } }, s7.el));
  const shield = h('img', { cls: 'abs', src: LOGO('logo'), style: { left: SHC.x - 230 + 'px', top: SHC.y - 230 + 'px', width: '460px', height: '460px', transformOrigin: '50% 50%' } }, s7.el);
  const wm = h('img', { cls: 'abs', src: LOGO('logo-wordmark-black'), style: { left: '170px', top: '900px', width: '740px' } }, s7.el);
  const cta = h('div', {
    cls: 'abs',
    style: { left: '80px', top: '1080px', width: '920px', height: '156px', borderRadius: '78px', background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', transformOrigin: '50% 50%', boxShadow: '0 20px 44px rgba(237,28,36,.32)' },
  }, s7.el);
  h('span', { text: 'RESERVÁ TU VERANO', style: { fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontStretch: '75%', fontSize: '84px', color: C.cream, whiteSpace: 'nowrap', letterSpacing: '-.01em' } }, cta);
  const ctaIco = h('span', { html: ARROW(C.cream), style: { width: '64px', height: '64px', display: 'inline-block' } }, cta);
  const sub71 = h('div', { cls: 'mono abs', text: 'CONSULTANOS · LINK EN LA BIO', style: { left: '0', width: W + 'px', textAlign: 'center', top: '1280px', fontSize: '30px', color: C.ink } }, s7.el);
  const sub72 = h('div', { cls: 'mono abs', text: '@NEWTRIPSVIAJES', style: { left: '0', width: W + 'px', textAlign: 'center', top: '1332px', fontSize: '30px', color: C.red } }, s7.el);
  s7.render = (lt, t) => {
    rings7.forEach((r, k) => {
      const a = 16 + k * BEAT, rp = E.outExpo(prog(t, a, a + 1.1));
      tf(r, { s: lerp(0.9, 2.3, rp), o: t >= a ? (1 - prog(t, a, a + 1.1)) * 0.55 : 0 });
    });
    const m = E.outBack(prog(t, 16.0, 16.4));
    tf(shield, { s: m * (1 + kick(t, 17.0, 10) * 0.05), r: lerp(-16, 0, m) + Math.sin(t * 3) * 1.2, y: Math.sin(t * 2.4) * 8 });
    const ew = E.outExpo(prog(t, 16.25, 16.55));
    tf(wm, { y: lerp(140, 0, ew), o: prog(t, 16.25, 16.31) });
    mb(wm, 0, lerp(24, 0, ew));
    const c = E.outBack(prog(t, 16.5, 16.82));
    tf(cta, { s: c * (1 + kick(t, 17.5, 9) * 0.06), o: c > 0.01 ? 1 : 0 });
    tf(ctaIco, { x: kick(t, Math.floor(t * 4) / 4, 14) * 12 });
    tf(sub71, { y: lerp(30, 0, E.outExpo(prog(t, 16.75, 17.05))), o: prog(t, 16.75, 16.85) });
    tf(sub72, { y: lerp(30, 0, E.outExpo(prog(t, 16.85, 17.15))), o: prog(t, 16.85, 16.95) });
  };

  // ---------- fondo global y API de render ----------
  const bgAt = (t) => (t < 2 ? C.red : t < 14 ? C.ink : t < 16 ? C.red : C.cream);
  window.renderAt = function (t) {
    bg.style.background = bgAt(t);
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
  window.__duration = 18;
})();
