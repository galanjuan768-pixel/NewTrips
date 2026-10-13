/* New Trips · "Egresados" — anuncio para Meta Ads, 1080×1920, 27,5 s, 120 BPM. Cierre: agendar una reunión.
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
  const IMG = (n) => 'img/' + n + '.jpg'; // fotos de newtrips.vercel.app/egresados.html
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

  // ======================================================================
  // S1 · 0–2,5 s · "¡NOS VAMOS / DE EGRESADOS!" + "LA SEMANA MÁS ESPERADA"
  // ======================================================================
  const s1 = scene(0, 2.5);
  const lab1 = h('div', { cls: 'mono abs', text: 'NEWTRIPS · VIAJES DE EGRESADOS', style: { left: '64px', top: '200px', fontSize: '26px', color: C.cream } }, s1.el);
  const l11 = h('div', { cls: 'disp abs', text: '¡NOS VAMOS', style: { left: '60px', color: C.cream, transformOrigin: '50% 50%' } }, s1.el);
  const band1 = h('div', { cls: 'abs', style: { left: '0', width: W + 'px', background: C.yellow, transformOrigin: '0% 50%' } }, s1.el);
  const l12 = h('div', { cls: 'disp abs', text: 'DE EGRESADOS!', style: { left: '60px', color: C.ink, transformOrigin: '50% 50%' } }, s1.el);
  const st1 = h('div', { cls: 'abs', text: 'LA SEMANA MÁS ESPERADA', style: { left: '50%', background: C.ink, color: C.cream, padding: '20px 38px', borderRadius: '999px', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '54px', whiteSpace: 'nowrap', boxShadow: '0 18px 40px rgba(26,20,16,.3)', transformOrigin: '50% 50%' } }, s1.el);
  const conf1 = confetti(s1.el, 60, 1);
  s1.prepare = () => {
    const h1 = fit(l11, 960) * 0.86, h2 = fit(l12, 960) * 0.86;
    const y1 = SAFE_TOP + 120;
    l11.style.top = y1 + 'px';
    const y2 = y1 + h1 + 50;
    band1.style.top = y2 - 26 + 'px'; band1.style.height = h2 + 44 + 'px';
    l12.style.top = y2 + 'px';
    st1.style.top = y2 + h2 + 90 + 'px';
    st1.style.marginLeft = -st1.offsetWidth / 2 + 'px';
  };
  s1.render = (lt) => {
    tf(lab1, { o: prog(lt, 0.05, 0.2) });
    const e1 = E.outExpo(prog(lt, 0, 0.25));
    tf(l11, { s: lerp(1.7, 1, e1) * (1 - kick(lt, 0.25) * 0.05), o: prog(lt, 0, 0.04) });
    mb(l11, 0, lerp(34, 0, E.outExpo(prog(lt, 0, 0.16))));
    tf(band1, { sx: E.outExpo(prog(lt, 0.5, 0.7)) });
    const e2 = E.outExpo(prog(lt, 0.55, 0.8));
    tf(l12, { s: lerp(1.5, 1, e2) * (1 + kick(lt, 1.0) * 0.05), o: prog(lt, 0.55, 0.6) });
    mb(l12, 0, lerp(30, 0, e2));
    const m = E.outBack(prog(lt, 1.25, 1.55));
    tf(st1, { s: m, r: lerp(-20, -3, m) + Math.sin(lt * 7) * 0.8, o: m > 0.01 ? 1 : 0 });
    renderConfetti(conf1, lt, 0.55, 540, 900, 1, 3.4);
  };

  // ======================================================================
  // S2 · 2,5–4 s · "3 DESTINOS" + "ELEGÍ TU PASE DE ABORDAR"
  // ======================================================================
  const s2 = scene(2.5, 4.0);
  const t2 = h('div', { cls: 'disp abs', html: `<span style="color:${C.yellow}">3</span> DESTINOS`, style: { left: '60px', top: SAFE_TOP + 180 + 'px', color: C.cream, transformOrigin: '50% 50%' } }, s2.el);
  const sub2 = h('div', { cls: 'mono abs', text: 'ELEGÍ TU PASE DE ABORDAR', style: { left: '0', width: W + 'px', textAlign: 'center', fontSize: '36px', color: C.yellow } }, s2.el);
  const sub2b = h('div', { cls: 'mono abs', text: 'SECUNDARIA · TODOS SALEN DESDE MAR DEL PLATA', style: { left: '0', width: W + 'px', textAlign: 'center', fontSize: '24px', color: C.cream, opacity: 0.85 } }, s2.el);
  s2.prepare = () => {
    const fs = fit(t2, 960);
    sub2.style.top = SAFE_TOP + 180 + fs * 0.86 + 50 + 'px';
    sub2b.style.top = SAFE_TOP + 180 + fs * 0.86 + 110 + 'px';
  };
  s2.render = (lt) => {
    const e = E.outExpo(prog(lt, 0, 0.3));
    tf(t2, { s: lerp(1.6, 1, e) * (1 - kick(lt, 0.5) * 0.04), o: prog(lt, 0, 0.04) });
    mb(t2, 0, lerp(34, 0, E.outExpo(prog(lt, 0, 0.18))));
    tf(sub2, { y: lerp(30, 0, E.outExpo(prog(lt, 0.4, 0.7))), o: prog(lt, 0.4, 0.5) });
    tf(sub2b, { y: lerp(30, 0, E.outExpo(prog(lt, 0.6, 0.9))), o: prog(lt, 0.6, 0.7) * 0.85 });
  };

  // ======================================================================
  // S3 · 4–11,5 s · Un pase de abordar por destino (foto del sitio + sello)
  // ======================================================================
  const DEST = [
    { img: 'camboriu', pos: '60% 50%', name: 'Camboriú', region: 'BRASIL', tag: 'Playa en Brasil' },
    { img: 'carlospaz', pos: '50% 55%', name: 'Villa Carlos Paz', region: 'CÓRDOBA', tag: 'Las sierras de Córdoba' },
    { img: 'mardelplata', pos: '50% 60%', name: 'Mar del Plata', region: 'BUENOS AIRES', tag: 'La costa atlántica' },
  ];
  const PASS_DUR = 2.5;
  const PASS = { x: 70, y: SAFE_TOP, w: 940, h: SAFE_BOTTOM - SAFE_TOP };
  const s3 = scene(4.0, 4.0 + DEST.length * PASS_DUR);
  const barcode = (seed) => {
    let x = 0, r = '';
    for (let k = 0; x < 330; k++) { const w = 3 + Math.floor(hash(seed * 31 + k) * 4) * 3; if (k % 2 === 0) r += `<rect x="${x}" y="0" width="${w}" height="86" fill="${C.ink}"/>`; x += w; }
    return svg(r, '0 0 330 86', 330, 86);
  };
  const passes = DEST.map((d, i) => {
    const bgL = h('div', { cls: 'layer' }, s3.el);
    h('img', { cls: 'cover', src: IMG(d.img + '-fondo') }, bgL);
    h('div', { cls: 'mono abs', text: 'EGRESADOS DE SECUNDARIA', style: { left: '0', width: W + 'px', textAlign: 'center', top: '196px', fontSize: '26px', color: C.cream } }, bgL);
    const card = h('div', { cls: 'abs', style: { left: PASS.x + 'px', top: PASS.y + 'px', width: PASS.w + 'px', height: PASS.h + 'px', transformOrigin: '50% 50%' } }, s3.el);
    const body = h('div', { cls: 'layer', style: { borderRadius: '40px', overflow: 'hidden', background: C.cream, boxShadow: '0 40px 90px rgba(0,0,0,.45)' } }, card);
    const top = h('div', { cls: 'abs', style: { left: '0', top: '0', width: '100%', height: '100px', background: C.red } }, body);
    h('div', { cls: 'mono abs', text: 'PASE DE ABORDAR · VIAJE DE EGRESADOS', style: { left: '36px', top: '38px', fontSize: '22px', color: C.cream } }, top);
    h('div', { cls: 'mono abs', text: `0${i + 1} / 03`, style: { right: '36px', top: '38px', fontSize: '22px', color: C.cream } }, top);
    const ph = h('div', { cls: 'abs', style: { left: '0', top: '100px', width: '100%', height: '420px', overflow: 'hidden' } }, body);
    const img = h('img', { cls: 'cover', src: IMG(d.img), style: { objectPosition: d.pos, transformOrigin: '50% 50%' } }, ph);
    h('div', { cls: 'mono abs', text: 'DESTINO', style: { left: '44px', top: '546px', fontSize: '22px', color: C.inkSoft } }, body);
    const name = h('div', { cls: 'abs', text: d.name, style: { left: '42px', top: '578px', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '100px', letterSpacing: '-.03em', lineHeight: '1', color: C.ink, whiteSpace: 'nowrap', transformOrigin: '0% 50%' } }, body);
    const reg = h('div', { cls: 'mono abs', text: d.region, style: { left: '46px', top: '692px', fontSize: '26px', color: C.red } }, body);
    const tag = h('div', { cls: 'abs', text: d.tag, style: { left: '46px', top: '734px', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '40px', color: C.inkSoft, whiteSpace: 'nowrap' } }, body);
    // línea troquelada con muescas a los costados
    h('div', { cls: 'abs', style: { left: '40px', right: '40px', top: '822px', borderTop: `4px dashed ${C.line}` } }, body);
    for (const x of [-30, PASS.w - 30]) h('div', { cls: 'abs', style: { left: x + 'px', top: '794px', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(26,20,16,.85)' } }, card);
    const field = (x, k, v) => {
      h('div', { cls: 'mono abs', text: k, style: { left: x + 'px', top: '856px', fontSize: '20px', color: C.inkSoft } }, body);
      h('div', { cls: 'abs', text: v, style: { left: x + 'px', top: '884px', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '42px', color: C.ink, whiteSpace: 'nowrap' } }, body);
    };
    field(46, 'NIVEL', 'Secundaria'); field(330, 'GRUPO', 'Tu curso');
    h('div', { cls: 'abs', html: barcode(i + 1), style: { right: '44px', top: '858px' } }, body);
    const stamp = h('div', {
      cls: 'abs',
      html: `<div class="mono" style="font-size:20px">NEWTRIPS</div><div style="font-family:'Bricolage Grotesque';font-weight:800;font-size:44px;line-height:1;margin:6px 0">¡NOS<br>VAMOS!</div><div style="width:110px;height:22px;margin:0 auto;display:flex;gap:4px">${STAR(C.red).repeat(1)}${STAR(C.red)}${STAR(C.red)}</div>`,
      style: { left: '660px', top: '300px', width: '230px', height: '230px', borderRadius: '50%', border: `8px solid ${C.red}`, boxSizing: 'border-box', background: 'rgba(250,246,238,.94)', color: C.red, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transformOrigin: '50% 50%', boxShadow: '0 12px 30px rgba(0,0,0,.3)' },
    }, card);
    return { bgL, card, img, name, reg, tag, stamp };
  });
  s3.render = (lt) => {
    const i = Math.min(DEST.length - 1, Math.floor(lt / PASS_DUR)), u = lt - i * PASS_DUR;
    passes.forEach((p, j) => { const on = j === i; p.bgL.style.display = on ? 'block' : 'none'; p.card.style.display = on ? 'block' : 'none'; });
    const p = passes[i];
    p.bgL.style.opacity = prog(u, 0, 0.2).toFixed(3);
    const ein = E.outExpo(prog(u, 0, 0.45)), eout = E.inExpo(prog(u, PASS_DUR - 0.3, PASS_DUR));
    tf(p.card, { y: lerp(1300, 0, ein) + Math.sin(lt * 2) * 4, x: -1150 * eout, r: lerp(-6, 0, ein) - 7 * eout });
    mb(p.card, 50 * eout, lerp(50, 0, E.outExpo(prog(u, 0, 0.3))));
    tf(p.img, { s: lerp(1.15, 1.0, u / PASS_DUR) });
    tf(p.name, { x: lerp(-40, 0, E.outExpo(prog(u, 0.2, 0.5))), o: prog(u, 0.2, 0.3) });
    tf(p.reg, { o: prog(u, 0.3, 0.4) });
    tf(p.tag, { y: lerp(26, 0, E.outExpo(prog(u, 0.35, 0.65))), o: prog(u, 0.35, 0.45) });
    const st = E.outExpo(prog(u, 1.0, 1.18));
    tf(p.stamp, { s: lerp(2.2, 1, st) * (1 + kick(u, 1.18, 12) * 0.06), r: lerp(-40, -14, st), o: prog(u, 1.0, 1.04) });
  };

  // ======================================================================
  // S4 · 11,5–15 s · Para las familias: "LOS CUIDAMOS COMO SI FUERAN NUESTROS"
  // ======================================================================
  const s4 = scene(11.5, 15.0);
  const eye4 = h('div', { cls: 'mono abs', text: 'LO QUE MÁS VALORAN LAS FAMILIAS', style: { left: '64px', top: SAFE_TOP + 'px', fontSize: '26px', color: C.red } }, s4.el);
  const L4 = [['LOS CUIDAMOS', C.ink], ['COMO SI FUERAN', C.ink], ['NUESTROS', C.red]].map(([w, c]) => h('div', { cls: 'disp abs', text: w, style: { left: '60px', color: c, transformOrigin: '0% 50%' } }, s4.el));
  const ROW4 = ['Coordinadores con el grupo', 'Médico las 24 hs', 'Padres al tanto, todo el día', 'Todo lo pactado, por escrito'].map((txt) => {
    const row = h('div', { cls: 'abs', style: { left: '70px', display: 'flex', alignItems: 'center', gap: '24px', transformOrigin: '0% 50%' } }, s4.el);
    h('div', { html: CHECK('#fff'), style: { width: '64px', height: '64px', borderRadius: '50%', background: C.red, flex: 'none' } }, row);
    h('span', { text: txt, style: { fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '54px', letterSpacing: '-.02em', color: C.ink, whiteSpace: 'nowrap' } }, row);
    return row;
  });
  const wipe4 = wipe(s4.el, C.ink);
  s4.prepare = () => {
    let y = SAFE_TOP + 50;
    L4.forEach((el) => { const hh = fit(el, 960) * 0.86; el.style.top = y + 'px'; y += hh + 14; });
    y += 40;
    ROW4.forEach((r) => { r.style.top = y + 'px'; y += 104; });
  };
  s4.render = (lt, t) => {
    tf(eye4, { o: prog(lt, 0.05, 0.2) });
    L4.forEach((el, i) => {
      const a = i * 0.25, e = E.outExpo(prog(lt, a, a + 0.3));
      tf(el, { x: lerp(-1150, 0, e) });
      mb(el, lerp(60, 0, E.outExpo(prog(lt, a, a + 0.2))), 0);
    });
    ROW4.forEach((r, i) => {
      const a = 1.0 + i * 0.5, m = E.outBack(prog(lt, a, a + 0.3));
      tf(r, { x: lerp(-80, 0, m), s: 0.6 + 0.4 * m, o: prog(lt, a, a + 0.06) });
    });
    setWipe(wipe4, 540, 960, lerp(0, 2300, E.inExpo(prog(t, 14.75, 15.0))));
  };

  // ======================================================================
  // S5 · 15–17,5 s · 4,7 ★ en Google + reseña del sitio
  // ======================================================================
  const s5 = scene(15.0, 17.5);
  const big5 = h('div', { cls: 'disp abs', text: '4,7', style: { left: '0', top: SAFE_TOP + 10 + 'px', color: C.yellow, transformOrigin: '50% 50%' } }, s5.el);
  const stars5 = Array.from({ length: 5 }, (_, k) => h('div', { cls: 'abs', html: STAR(C.yellow), style: { left: 540 - 2.5 * 96 + k * 96 + 'px', width: '84px', height: '84px', transformOrigin: '50% 50%' } }, s5.el));
  const sub5 = h('div', { cls: 'mono abs', text: '173 OPINIONES EN GOOGLE', style: { left: '0', width: W + 'px', textAlign: 'center', fontSize: '32px', color: C.cream } }, s5.el);
  const quote5 = h('div', {
    cls: 'abs',
    html: `<div style="font-family:'Bricolage Grotesque';font-weight:800;font-size:56px;line-height:1.08;letter-spacing:-.02em">“Son como una familia: cuidaron a nuestros hijos como si fueran propios.”</div><div class="mono" style="font-size:24px;margin-top:22px;color:${C.red}">ANDREA N. · ★★★★★</div>`,
    style: { left: '70px', width: '940px', boxSizing: 'border-box', padding: '40px 44px', borderRadius: '36px', background: C.cream, color: C.ink, boxShadow: '0 30px 70px rgba(0,0,0,.4)', transformOrigin: '50% 50%' },
  }, s5.el);
  s5.prepare = () => {
    const fs = fit(big5, 380);
    big5.style.left = (W - big5.offsetWidth) / 2 + 'px';
    const yS = SAFE_TOP + 10 + fs * 0.86 + 20;
    stars5.forEach((s) => (s.style.top = yS + 'px'));
    sub5.style.top = yS + 110 + 'px';
    quote5.style.top = yS + 190 + 'px';
  };
  s5.render = (lt) => {
    const e = E.outExpo(prog(lt, 0, 0.3));
    tf(big5, { s: lerp(1.8, 1, e), o: prog(lt, 0, 0.04) });
    mb(big5, 0, lerp(34, 0, E.outExpo(prog(lt, 0, 0.18))));
    stars5.forEach((s, k) => { const a = 0.25 + k * 0.1, m = E.outBack(prog(lt, a, a + 0.25)); tf(s, { s: m, r: lerp(-60, 0, m), o: m > 0.01 ? 1 : 0 }); });
    tf(sub5, { o: prog(lt, 0.6, 0.75) });
    const q = E.outExpo(prog(lt, 0.9, 1.3));
    tf(quote5, { y: lerp(500, 0, q), r: lerp(5, -1.5, q), o: prog(lt, 0.9, 0.95) });
  };

  // ======================================================================
  // S6 · 17,5–20,5 s · "EN UNA REUNIÓN TE MOSTRAMOS TODO"
  // ======================================================================
  const s6 = scene(17.5, 20.5);
  const L6 = ['EN UNA REUNIÓN', 'TE MOSTRAMOS', 'TODO'].map((w) => h('div', { cls: 'disp abs', text: w, style: { left: '60px', color: C.cream, transformOrigin: '0% 50%' } }, s6.el));
  const CH6 = ['Destino y fechas', 'Hotel y comidas', 'Excursiones', 'Plan de pagos en cuotas'].map((txt) => h('div', {
    cls: 'abs', html: `<span style="width:44px;height:44px;border-radius:50%;background:${C.red};display:inline-block;flex:none">${CHECK('#fff')}</span>${txt}`,
    style: { left: '70px', height: '92px', padding: '0 34px 0 22px', borderRadius: '46px', background: C.cream, color: C.ink, display: 'flex', alignItems: 'center', gap: '18px', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '46px', whiteSpace: 'nowrap', boxShadow: '0 14px 30px rgba(0,0,0,.2)', transformOrigin: '0% 50%' },
  }, s6.el));
  const fine6 = h('div', { cls: 'mono abs', text: 'TODO POR ESCRITO, ANTES DE CONFIRMAR', style: { left: '64px', fontSize: '24px', color: C.cream } }, s6.el);
  const wipe6 = wipe(s6.el, C.cream);
  s6.prepare = () => {
    let y = SAFE_TOP + 20;
    L6.forEach((el) => { const hh = fit(el, 960) * 0.86; el.style.top = y + 'px'; y += hh + 14; });
    y += 40;
    CH6.forEach((c) => { c.style.top = y + 'px'; y += 112; });
    fine6.style.top = y + 10 + 'px';
  };
  s6.render = (lt, t) => {
    L6.forEach((el, i) => {
      const a = i * 0.25, e = E.outExpo(prog(lt, a, a + 0.3));
      tf(el, { x: lerp(-1150, 0, e), sx: 1 + kick(lt, a + 0.25) * 0.04 });
      mb(el, lerp(60, 0, E.outExpo(prog(lt, a, a + 0.2))), 0);
    });
    CH6.forEach((c, i) => {
      const a = 0.75 + i * 0.5, m = E.outBack(prog(lt, a, a + 0.3));
      tf(c, { x: lerp(-200, 0, E.outExpo(prog(lt, a, a + 0.3))), s: m, o: m > 0.01 ? 1 : 0 });
    });
    tf(fine6, { o: prog(lt, 2.4, 2.55) });
    setWipe(wipe6, 540, 1920, lerp(0, 2300, E.inExpo(prog(t, 20.25, 20.5))));
  };

  // ======================================================================
  // S7 · 20,5–24,5 s · Agenda: se elige día y horario → "¡REUNIÓN AGENDADA!"
  // ======================================================================
  const s7 = scene(20.5, 24.5);
  const CAL = { x: 70, y: SAFE_TOP, w: 940, h: SAFE_BOTTOM - SAFE_TOP };
  const cal = h('div', { cls: 'abs', style: { left: CAL.x + 'px', top: CAL.y + 'px', width: CAL.w + 'px', height: CAL.h + 'px', borderRadius: '44px', background: '#fff', boxShadow: '0 40px 90px rgba(26,20,16,.22)', transformOrigin: '50% 50%' } }, s7.el);
  h('img', { cls: 'abs', src: LOGO('logo'), style: { left: '40px', top: '36px', width: '104px', height: '104px' } }, cal);
  h('div', { cls: 'abs', text: 'Agendá una reunión', style: { left: '162px', top: '42px', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '68px', letterSpacing: '-.025em', color: C.ink, whiteSpace: 'nowrap', lineHeight: '1' } }, cal);
  h('div', { cls: 'mono abs', text: 'EGRESADOS · FAMILIAS, DOCENTES Y ALUMNOS', style: { left: '166px', top: '120px', fontSize: '20px', color: C.red } }, cal);
  h('div', { cls: 'abs', style: { left: '40px', right: '40px', top: '176px', height: '3px', background: C.line } }, cal);
  h('div', { cls: 'abs', text: 'Noviembre 2026', style: { left: '44px', top: '200px', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '40px', color: C.ink } }, cal);
  const GX = 44, GY = 270, CW7 = 122, CH7 = 64;
  'LMMJVSD'.split('').forEach((d, k) => h('div', { cls: 'mono abs', text: d, style: { left: GX + k * CW7 + 'px', top: GY + 'px', width: CW7 + 'px', textAlign: 'center', fontSize: '22px', color: C.inkSoft } }, cal));
  const days = {};
  for (let d = 1; d <= 30; d++) {
    const idx = d + 5; // el 1/11/2026 es domingo (columna 7)
    const col = idx % 7, row = Math.floor(idx / 7);
    days[d] = h('div', { cls: 'abs', text: String(d), style: { left: GX + col * CW7 + 11 + 'px', top: GY + 40 + row * CH7 + 'px', width: '100px', height: '56px', lineHeight: '56px', borderRadius: '28px', textAlign: 'center', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '34px', color: col >= 5 ? '#B9B1A8' : C.ink, transformOrigin: '50% 50%' } }, cal);
  }
  const DAY = 12; // jueves
  const SLOTS = ['17:00', '18:00', '19:00'];
  const slotY = GY + 40 + 6 * CH7 + 24;
  const slots = SLOTS.map((s, k) => h('div', { cls: 'abs', text: s, style: { left: 44 + k * 290 + 'px', top: slotY + 'px', width: '262px', height: '84px', lineHeight: '78px', borderRadius: '22px', border: `3px solid ${C.line}`, boxSizing: 'border-box', textAlign: 'center', fontFamily: 'DM Sans', fontWeight: 700, fontSize: '38px', color: C.ink, background: C.cream, transformOrigin: '50% 50%' } }, cal));
  const btn7 = h('div', { cls: 'abs', style: { left: '44px', top: slotY + 118 + 'px', width: '852px', height: '110px', borderRadius: '55px', background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', transformOrigin: '50% 50%', boxShadow: '0 16px 30px rgba(237,28,36,.3)' } }, cal);
  const btn7Txt = h('span', { text: 'CONFIRMAR REUNIÓN', style: { fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '46px', color: C.cream, whiteSpace: 'nowrap' } }, btn7);
  const btn7Ico = h('span', { html: CHECK(C.yellow), style: { width: '56px', height: '56px', display: 'none' } }, btn7);
  const cursor7 = h('div', { cls: 'abs', html: POINTER, style: { left: '0', top: '0', transformOrigin: '10px 7px', zIndex: 5 } }, cal);
  const conf7 = confetti(s7.el, 54, 9);
  const cellC = (d) => { const idx = d + 5; return { x: GX + (idx % 7) * CW7 + 61, y: GY + 40 + Math.floor(idx / 7) * CH7 + 28 }; };
  s7.render = (lt, t) => {
    const e = E.outExpo(prog(t, 20.5, 20.95)), ex = E.inExpo(prog(t, 24.15, 24.5));
    tf(cal, { y: lerp(1300, 0, e) - 1400 * ex + Math.sin(t * 2) * 4, r: lerp(6, 0, e) });
    mb(cal, 0, lerp(40, 0, E.outExpo(prog(t, 20.5, 20.8))) + 40 * ex);
    // cursor: día → horario → botón
    const pD = cellC(DAY), pS = { x: 44 + 290 + 131, y: slotY + 42 }, pB = { x: 520, y: slotY + 118 + 55 };
    const m1 = E.inOutExpo(prog(t, 21.0, 21.4)), m2 = E.inOutExpo(prog(t, 21.9, 22.3)), m3 = E.inOutExpo(prog(t, 22.75, 23.15));
    let cx = lerp(800, pD.x, m1), cy = lerp(900, pD.y, m1);
    cx = lerp(cx, pS.x, m2); cy = lerp(cy, pS.y, m2);
    cx = lerp(cx, pB.x, m3); cy = lerp(cy, pB.y, m3);
    const click = 1 - (kick(t, 21.5, 14) + kick(t, 22.4, 14) + kick(t, 23.25, 14)) * 0.25;
    cursor7.style.left = (cx - 10).toFixed(1) + 'px';
    cursor7.style.top = (cy - 7).toFixed(1) + 'px';
    tf(cursor7, { s: click, o: Math.min(prog(t, 20.85, 21.0), 1 - prog(t, 23.6, 23.75)) });
    const dSel = t >= 21.5;
    Object.assign(days[DAY].style, { background: dSel ? C.red : 'transparent', color: dSel ? '#fff' : C.ink });
    tf(days[DAY], { s: 1 + kick(t, 21.5, 10) * 0.25 });
    slots.forEach((s, k) => {
      const a = 21.6 + k * 0.08, m = E.outBack(prog(t, a, a + 0.25));
      const sel = k === 1 && t >= 22.4;
      Object.assign(s.style, { background: sel ? C.ink : C.cream, color: sel ? C.yellow : C.ink, borderColor: sel ? C.ink : C.line });
      tf(s, { s: m * (1 + (k === 1 ? kick(t, 22.4, 10) * 0.12 : 0)), o: m > 0.01 ? 1 : 0 });
    });
    const sent = t >= 23.25;
    btn7.style.background = sent ? C.ink : C.red;
    btn7Txt.textContent = sent ? '¡REUNIÓN AGENDADA!' : 'CONFIRMAR REUNIÓN';
    btn7Txt.style.color = sent ? C.yellow : C.cream;
    btn7Ico.style.display = sent ? 'inline-block' : 'none';
    tf(btn7, { s: (t < 23.25 ? 1 - 0.06 * prog(t, 23.15, 23.25) : 0.94 + 0.06 * E.spring(prog(t, 23.25, 23.7))) * E.outBack(prog(t, 21.7, 22.0)), o: prog(t, 21.7, 21.75) });
    renderConfetti(conf7, t, 23.25, CAL.x + 520, CAL.y + slotY + 173, 9);
  };

  // ======================================================================
  // S8 · 24,5–27,5 s · Cierre: "AGENDÁ UNA REUNIÓN" + "LINK ACÁ ABAJO"
  // ======================================================================
  const s8 = scene(24.5, 27.5);
  const SHC = { x: 540, y: 470 };
  const rings8 = [24.5, 25.0, 25.5, 26.0, 26.5, 27.0].map(() => h('div', { cls: 'abs', style: { left: SHC.x - 170 + 'px', top: SHC.y - 170 + 'px', width: '340px', height: '340px', borderRadius: '50%', border: `6px solid ${C.red}`, boxSizing: 'border-box' } }, s8.el));
  const shield = h('img', { cls: 'abs', src: LOGO('logo'), style: { left: SHC.x - 170 + 'px', top: SHC.y - 170 + 'px', width: '340px', height: '340px', transformOrigin: '50% 50%' } }, s8.el);
  const wm = h('img', { cls: 'abs', src: LOGO('logo-wordmark-black'), style: { left: '220px', top: '690px', width: '640px' } }, s8.el);
  const cta = h('div', { cls: 'abs', style: { left: '70px', top: '840px', width: '940px', height: '150px', borderRadius: '75px', background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', transformOrigin: '50% 50%', boxShadow: '0 20px 44px rgba(237,28,36,.32)' } }, s8.el);
  h('span', { text: 'AGENDÁ UNA REUNIÓN', style: { fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontStretch: '75%', fontSize: '84px', color: C.cream, whiteSpace: 'nowrap', letterSpacing: '-.01em' } }, cta);
  const link = h('div', { cls: 'abs', text: 'LINK ACÁ ABAJO', style: { left: '0', width: W + 'px', textAlign: 'center', top: '1030px', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '64px', letterSpacing: '-.01em', color: C.ink } }, s8.el);
  const DOWN = svg(`<path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`, '0 0 24 24', 86, 86);
  const arrow = h('div', { cls: 'abs', html: DOWN, style: { left: 540 - 70 + 'px', top: '1120px', width: '140px', height: '140px', borderRadius: '50%', background: C.yellow, border: `5px solid ${C.ink}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', transformOrigin: '50% 50%' } }, s8.el);
  const info8 = h('div', { cls: 'mono abs', html: 'OFICINA DE EGRESADOS · ALVARADO 1252 · MAR DEL PLATA<br>NEWTRIPS SRL · LEGAJO EVT N° 12.379', style: { left: '0', width: W + 'px', textAlign: 'center', top: '1300px', fontSize: '20px', lineHeight: '1.6', color: C.inkSoft } }, s8.el);
  s8.render = (lt, t) => {
    rings8.forEach((r, k) => {
      const a = 24.5 + k * BEAT, rp = E.outExpo(prog(t, a, a + 1.2));
      tf(r, { s: lerp(0.95, 2.2, rp), o: t >= a ? (1 - prog(t, a, a + 1.2)) * 0.5 : 0 });
    });
    const m = E.outBack(prog(t, 24.5, 24.9));
    tf(shield, { s: m, r: lerp(-16, 0, m) + Math.sin(t * 3) * 1.2, y: Math.sin(t * 2.4) * 6 });
    const ew = E.outExpo(prog(t, 24.75, 25.05));
    tf(wm, { y: lerp(120, 0, ew), o: prog(t, 24.75, 24.81) });
    mb(wm, 0, lerp(24, 0, ew));
    const c = E.outBack(prog(t, 25.0, 25.32));
    tf(cta, { s: c * (1 + kick(t, 26.0, 9) * 0.05 + kick(t, 27.0, 9) * 0.05), o: c > 0.01 ? 1 : 0 });
    tf(link, { y: lerp(40, 0, E.outExpo(prog(t, 25.25, 25.55))), o: prog(t, 25.25, 25.35) });
    const a = E.outBack(prog(t, 25.4, 25.7));
    const bounce = t >= 25.7 ? Math.abs(Math.sin(((t - 25.7) / BEAT) * Math.PI)) * 26 : 0;
    tf(arrow, { s: a, y: bounce, o: a > 0.01 ? 1 : 0 });
    tf(info8, { o: prog(t, 25.6, 25.8) });
  };

  // ---------- fondo global y API de render ----------
  const bgAt = (t) => (t < 2.5 ? C.red : t < 11.5 ? C.ink : t < 15 ? C.cream : t < 17.5 ? C.ink : t < 20.5 ? C.red : C.cream);
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
  window.__duration = 27.5;
})();
