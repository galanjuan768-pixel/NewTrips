/* New Trips · "Diseñá tu viaje" — reel 1080×1920, 16 s, 120 BPM.
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
  const PHOTO = (n) => '../assets/photos/' + n + '.png';

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

  // ======================================================================
  // S1 · 0–2 s · Gancho: "¿CUÁL ES / EL VIAJE / DE TUS / SUEÑOS?" — un golpe por beat
  // ======================================================================
  const s1 = scene(0, 2);
  const S1W = [['¿CUÁL ES', C.cream, C.ink], ['EL VIAJE', C.ink, C.cream], ['DE TUS', C.cream, C.ink], ['SUEÑOS?', C.red, C.cream]];
  const s1c = S1W.map(([word, b, f], i) => {
    const card = h('div', { cls: 'layer', style: { background: b } }, s1.el);
    const rows = [];
    for (let k = -2; k <= 2; k++) {
      const r = h('div', {
        cls: 'disp abs', text: word,
        style: { left: '60px', top: '0', transformOrigin: '50% 50%', color: k ? 'transparent' : f, webkitTextStroke: k ? `3px ${f}` : '0px' },
      }, card);
      rows.push([k, r]);
    }
    h('div', { cls: 'mono abs', text: 'NEWTRIPS · VIAJES A MEDIDA', style: { left: '64px', top: '250px', fontSize: '24px', color: f, opacity: 0.75 } }, card);
    h('div', { cls: 'mono abs', text: `0${i + 1} / 04`, style: { right: '64px', top: '250px', fontSize: '24px', color: f, opacity: 0.75 } }, card);
    return { card, rows };
  });
  s1.prepare = () => {
    for (const c of s1c) {
      let lh = 0;
      for (const [, r] of c.rows) lh = fit(r, 960) * 0.86;
      for (const [k, r] of c.rows) r.style.top = (H / 2 - lh / 2 - 20 + k * lh * 1.02).toFixed(1) + 'px';
    }
  };
  s1.render = (lt) => {
    const i = Math.min(3, Math.floor(lt / BEAT)), u = lt - i * BEAT;
    s1c.forEach((c, j) => (c.card.style.display = j === i ? 'block' : 'none'));
    const e = E.outExpo(prog(u, 0, 0.22));
    const sq = kick(u, 0.25) * 0.07;
    for (const [k, r] of s1c[i].rows) {
      if (k === 0) {
        const s = lerp(1.7, 1, e);
        tf(r, { sx: s * (1 + sq), sy: s * (1 - sq) });
        mb(r, 0, lerp(34, 0, E.outExpo(prog(u, 0, 0.16))));
      } else {
        const dir = Math.sign(k);
        tf(r, { y: dir * ((1 - e) * 320 + u * 70), o: 0.28 * e });
      }
    }
  };

  // ======================================================================
  // S2 · 2–4 s · Destinos: foto a sangre + palabra gigante en cada beat; los signos entran en la corchea
  // ======================================================================
  const s2 = scene(2, 4);
  const S2D = [
    { img: 'camboriu', pos: '26% 50%', w: 'PLAYA', lab: 'CAMBORIÚ · BRASIL' },
    { img: 'bariloche', pos: '48% 50%', w: 'MONTAÑA', lab: 'BARILOCHE · RÍO NEGRO' },
    { img: 'talampaya', pos: '50% 50%', w: 'AVENTURA', lab: 'TALAMPAYA · LA RIOJA' },
    { img: 'europa', pos: '50% 50%', w: 'EUROPA', lab: 'ROMA · ITALIA' },
  ];
  const s2c = S2D.map((d, i) => {
    const card = h('div', { cls: 'layer', style: { background: C.ink, overflow: 'hidden' } }, s2.el);
    const img = h('img', { cls: 'cover', src: PHOTO(d.img), style: { objectPosition: d.pos, transformOrigin: '50% 50%' } }, card);
    h('div', { cls: 'layer', style: { background: 'linear-gradient(180deg, rgba(26,20,16,.45) 0%, rgba(26,20,16,0) 22%, rgba(26,20,16,0) 42%, rgba(26,20,16,.82) 100%)' } }, card);
    const word = h('div', { cls: 'disp abs', style: { left: '60px', top: '0', color: C.cream, textShadow: '0 12px 40px rgba(0,0,0,.35)', transformOrigin: '50% 100%' } }, card);
    const q1 = h('span', { text: '¿', style: { display: 'inline-block', color: C.yellow, transformOrigin: '50% 70%' } }, word);
    h('span', { text: d.w }, word);
    const q2 = h('span', { text: '?', style: { display: 'inline-block', color: C.yellow, transformOrigin: '50% 70%' } }, word);
    const lab = h('div', { cls: 'mono abs', text: `0${i + 1} — ${d.lab}`, style: { left: '64px', top: '250px', fontSize: '26px', color: C.cream } }, card);
    const flash = h('div', { cls: 'layer', style: { background: '#fff' } }, card);
    return { card, img, word, q1, q2, lab, flash };
  });
  s2.prepare = () => {
    for (const c of s2c) {
      const fs = fit(c.word, 960);
      c.word.style.top = (1500 - fs * 0.86).toFixed(1) + 'px';
    }
  };
  s2.render = (lt) => {
    const i = Math.min(3, Math.floor(lt / BEAT)), u = lt - i * BEAT;
    s2c.forEach((c, j) => (c.card.style.display = j === i ? 'block' : 'none'));
    const c = s2c[i], dir = i % 2 ? 1 : -1;
    const ei = E.outExpo(prog(u, 0, 0.45));
    tf(c.img, { x: dir * lerp(110, 0, E.outExpo(prog(u, 0, 0.3))), s: lerp(1.34, 1.06, ei) - u * 0.03 });
    mb(c.img, lerp(26, 0, E.outExpo(prog(u, 0, 0.14))), 0);
    const ew = E.outExpo(prog(u, 0, 0.26));
    tf(c.word, { y: lerp(280, 0, ew), sy: 1 + kick(u, 0.25) * 0.06 });
    mb(c.word, 0, lerp(30, 0, E.outExpo(prog(u, 0, 0.18))));
    const m = E.outBack(prog(u, 0.25, 0.38));
    tf(c.q1, { s: m, r: lerp(-50, 0, m) });
    tf(c.q2, { s: m, r: lerp(50, 0, m) });
    tf(c.lab, { x: lerp(-60, 0, E.outExpo(prog(u, 0.05, 0.3))), o: prog(u, 0.05, 0.15) });
    c.flash.style.opacity = lerp(0.6, 0, prog(u, 0, 0.12)).toFixed(3);
  };

  // ======================================================================
  // S3 · 4–6 s · "DISEÑÁ / TU VIAJE" + sticker "A TU MEDIDA"
  // ======================================================================
  const s3 = scene(4, 6);
  const l31 = h('div', { cls: 'disp abs', text: 'DISEÑÁ', style: { left: '60px', color: C.red, transformOrigin: '50% 50%' } }, s3.el);
  const l32 = h('div', { cls: 'disp abs', text: 'TU VIAJE', style: { left: '60px', color: C.ink, transformOrigin: '50% 50%' } }, s3.el);
  const st3 = h('div', {
    cls: 'abs', text: 'A TU MEDIDA',
    style: {
      right: '70px', background: C.yellow, color: C.ink, padding: '20px 40px', borderRadius: '999px',
      fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '64px', letterSpacing: '-.01em', whiteSpace: 'nowrap',
      boxShadow: '0 18px 40px rgba(26,20,16,.18)', border: `5px solid ${C.ink}`,
    },
  }, s3.el);
  const lab3 = h('div', { cls: 'mono abs', text: 'NO ELIJAS UN PAQUETE MÁS', style: { left: '64px', fontSize: '28px', color: C.inkSoft } }, s3.el);
  s3.prepare = () => {
    const h1 = fit(l31, 960) * 0.86, h2 = fit(l32, 960) * 0.86;
    const top1 = (H - (h1 + h2 + 24)) / 2 - 30;
    l31.style.top = top1 + 'px';
    l32.style.top = top1 + h1 + 24 + 'px';
    st3.style.top = top1 + h1 + h2 + 6 + 'px';
    lab3.style.top = top1 - 90 + 'px';
  };
  s3.render = (lt) => {
    const ex = E.inExpo(prog(lt, 1.5, 1.95)) * -1600;
    const breathe = 1 + Math.sin(lt * 5) * 0.006;
    const e1 = E.outExpo(prog(lt, 0, 0.32));
    tf(l31, { x: lerp(-1150, 0, e1), y: ex, s: breathe, sy: breathe * (1 - kick(lt, 0.25) * 0.08) });
    mb(l31, lerp(60, 0, E.outExpo(prog(lt, 0, 0.2))), 0);
    const e2 = E.outExpo(prog(lt, 0.5, 0.82));
    tf(l32, { x: lerp(1150, 0, e2), y: ex, s: breathe, sy: breathe * (1 - kick(lt, 0.75) * 0.08) });
    mb(l32, lerp(60, 0, E.outExpo(prog(lt, 0.5, 0.7))), 0);
    const m = E.outBack(prog(lt, 1.0, 1.32));
    tf(st3, { y: ex * 1.1, s: m * (1 + kick(lt, 1.25) * 0.08), r: lerp(-40, -7, m) + Math.sin(lt * 9) * 0.8 });
    tf(lab3, { x: lerp(-80, 0, E.outExpo(prog(lt, 0.1, 0.4))), y: ex, o: prog(lt, 0.1, 0.25) });
  };

  // ======================================================================
  // S4 · 5.75–10 s · El formulario "Diseñá tu viaje" completándose al ritmo
  // ======================================================================
  const s4 = scene(5.75, 10);
  const CARD = { x: 70, y: 250, w: 940, h: 1296 };
  const card = h('div', {
    cls: 'abs',
    style: {
      left: CARD.x + 'px', top: CARD.y + 'px', width: CARD.w + 'px', height: CARD.h + 'px', background: '#fff',
      borderRadius: '44px', boxShadow: '0 50px 90px rgba(26,20,16,.20), 0 2px 0 rgba(26,20,16,.05)', transformOrigin: '50% 50%',
    },
  }, s4.el);
  h('img', { cls: 'abs', src: '../assets/logo.png', style: { left: '46px', top: '42px', width: '128px', height: '128px' } }, card);
  h('div', { cls: 'abs', text: 'Diseñá tu viaje', style: { left: '192px', top: '46px', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '78px', letterSpacing: '-.025em', color: C.ink, whiteSpace: 'nowrap', lineHeight: '1' } }, card);
  h('div', { cls: 'mono abs', text: 'NEWTRIPS · TU VIAJE A MEDIDA', style: { left: '196px', top: '138px', fontSize: '22px', color: C.red } }, card);
  h('div', { cls: 'abs', style: { left: '56px', right: '56px', top: '204px', height: '3px', background: C.line } }, card);

  const FY = (i) => 236 + i * 178;
  function field(i, label) {
    const y = FY(i);
    const lab = h('div', { cls: 'mono abs', text: label, style: { left: '56px', top: y + 'px', fontSize: '22px', color: C.inkSoft } }, card);
    const done = h('div', { cls: 'abs', html: CHECK('#fff'), style: { right: '56px', top: y - 8 + 'px', width: '38px', height: '38px', borderRadius: '50%', background: C.red, transformOrigin: '50% 50%' } }, card);
    return { y, lab, done };
  }
  function box(y) {
    return h('div', {
      cls: 'abs',
      style: {
        left: '56px', top: y + 40 + 'px', width: '828px', height: '100px', borderRadius: '24px', boxSizing: 'border-box',
        border: `3px solid ${C.line}`, background: C.cream, display: 'flex', alignItems: 'center', padding: '0 28px',
        fontFamily: 'DM Sans', fontWeight: 600, fontSize: '40px', color: C.ink, whiteSpace: 'nowrap',
      },
    }, card);
  }
  function typed(bx) {
    const txt = h('span', {}, bx);
    const caret = h('span', { style: { display: 'inline-block', width: '4px', height: '50px', background: C.red, marginLeft: '4px', borderRadius: '2px' } }, bx);
    return { txt, caret };
  }
  const F = [
    field(0, '¿A DÓNDE SOÑÁS IR?'), field(1, '¿CUÁNDO?'), field(2, '¿QUIÉNES VIAJAN?'),
    field(3, '¿QUÉ TE GUSTA?'), field(4, 'PRESUPUESTO POR PERSONA'),
  ];
  const DONE_AT = [6.95, 7.45, 7.95, 8.55, 9.0];
  // 0 · destino
  const b0 = box(F[0].y), t0 = typed(b0);
  const thumb0 = h('img', { cls: 'abs', src: PHOTO('bariloche'), style: { right: '14px', top: '11px', width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', objectPosition: '48% 50%', transformOrigin: '50% 50%' } }, b0);
  // 1 · fechas
  const b1 = box(F[1].y), t1 = typed(b1);
  // 2 · pasajeros (dos contadores)
  const b2 = box(F[2].y);
  Object.assign(b2.style, { justifyContent: 'space-between', background: 'transparent', border: 'none', padding: '0' });
  function stepper(label) {
    const g = h('div', { style: { display: 'flex', alignItems: 'center', gap: '18px', background: C.cream, border: `3px solid ${C.line}`, borderRadius: '24px', height: '100px', boxSizing: 'border-box', padding: '0 18px 0 26px', width: '404px' } }, b2);
    h('span', { text: label, style: { flex: '1', fontSize: '36px' } }, g);
    const btn = (s) => h('span', { text: s, style: { width: '56px', height: '56px', borderRadius: '50%', border: `3px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', lineHeight: '1', boxSizing: 'border-box', transformOrigin: '50% 50%' } }, g);
    btn('–');
    const n = h('span', { text: '0', style: { width: '40px', textAlign: 'center', fontSize: '44px', fontWeight: 700, display: 'inline-block', transformOrigin: '50% 50%' } }, g);
    const plus = btn('+');
    return { n, plus };
  }
  const stA = stepper('Adultos'), stM = stepper('Menores');
  // 3 · intereses
  const chipsRow = h('div', { cls: 'abs', style: { left: '56px', top: F[3].y + 44 + 'px', display: 'flex', gap: '14px' } }, card);
  const chips = ['Nieve', 'Aventura', 'Gastronomía', 'Relax'].map((c) => h('span', {
    text: c,
    style: { display: 'inline-block', height: '84px', lineHeight: '78px', padding: '0 30px', borderRadius: '42px', boxSizing: 'border-box', border: `3px solid ${C.line}`, background: C.cream, fontSize: '36px', fontWeight: 600, transformOrigin: '50% 50%' },
  }, chipsRow));
  const CHIP_AT = [8.0, 8.25, 8.5];
  // 4 · presupuesto (slider)
  const TR = { x: 56, y: F[4].y + 70, w: 828 };
  h('div', { cls: 'abs', style: { left: TR.x + 'px', top: TR.y + 'px', width: TR.w + 'px', height: '14px', borderRadius: '7px', background: C.creamWarm } }, card);
  const fill = h('div', { cls: 'abs', style: { left: TR.x + 'px', top: TR.y + 'px', width: '100px', height: '14px', borderRadius: '7px', background: C.red } }, card);
  const knob = h('div', { cls: 'abs', style: { left: '0', top: TR.y - 19 + 'px', width: '52px', height: '52px', borderRadius: '50%', background: '#fff', border: `6px solid ${C.red}`, boxSizing: 'border-box', boxShadow: '0 6px 14px rgba(26,20,16,.2)' } }, card);
  h('div', { cls: 'mono abs', text: 'ECONÓMICO', style: { left: TR.x + 'px', top: TR.y + 44 + 'px', fontSize: '20px', color: C.inkSoft } }, card);
  h('div', { cls: 'mono abs', text: 'PREMIUM', style: { right: '56px', top: TR.y + 44 + 'px', fontSize: '20px', color: C.inkSoft } }, card);
  // botón
  const BT = { x: 56, y: FY(5), w: 828, h: 120 };
  const btn = h('div', {
    cls: 'abs',
    style: {
      left: BT.x + 'px', top: BT.y + 'px', width: BT.w + 'px', height: BT.h + 'px', borderRadius: '60px', background: C.red,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', transformOrigin: '50% 50%',
      boxShadow: '0 16px 30px rgba(237,28,36,.30)',
    },
  }, card);
  const btnTxt = h('span', { text: 'ENVIAR MI VIAJE SOÑADO', style: { fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '44px', color: C.cream, whiteSpace: 'nowrap' } }, btn);
  const btnIco = h('span', { html: ARROW(C.cream), style: { width: '56px', height: '56px', display: 'inline-block' } }, btn);
  // cursor
  const cursor = h('div', { cls: 'abs', html: POINTER, style: { left: '0', top: '0', transformOrigin: '10px 7px', zIndex: 5 } }, card);
  // confeti y barrido a rojo (coordenadas de cuadro)
  const conf = [];
  for (let k = 0; k < 54; k++) {
    const col = [C.red, C.yellow, C.ink, C.red, C.yellow][k % 5];
    conf.push(h('div', { cls: 'abs', style: { left: '0', top: '0', width: 12 + hash(k) * 16 + 'px', height: 8 + hash(k + 50) * 10 + 'px', background: col, borderRadius: '2px' } }, s4.el));
  }
  const wipe4 = h('div', { cls: 'abs', style: { left: '0', top: '0', borderRadius: '50%', background: C.red } }, s4.el);

  const setTyped = (tp, full, t, a, b, active) => {
    const n = Math.round(prog(t, a, b) * full.length);
    tp.txt.textContent = full.slice(0, n);
    const typing = t >= a && t < b;
    tp.caret.style.opacity = active && (typing || Math.floor(t * 4) % 2 === 0) ? '1' : '0';
  };
  const popN = (el, val, t, at) => {
    el.textContent = t >= at ? String(val) : '0';
    tf(el, { s: 1 + kick(t, at, 12) * 0.5 });
  };

  s4.render = (lt, t) => {
    // entrada y flotación de la tarjeta
    const e = E.outExpo(prog(t, 5.75, 6.3));
    const cy = lerp(1500, 0, e) + Math.sin(t * 2.2) * 6;
    tf(card, { y: cy, r: lerp(8, 0, e) + Math.sin(t * 1.3) * 0.35 });
    mb(card, 0, lerp(40, 0, E.outExpo(prog(t, 5.75, 6.05))));

    const act = t < 6.5 ? -1 : t < 7 ? 0 : t < 7.5 ? 1 : t < 8 ? 2 : t < 8.5 ? 3 : t < 9 ? 4 : 5;
    F.forEach((f, i) => {
      f.lab.style.color = act === i ? C.red : C.inkSoft;
      const d = E.outBack(prog(t, DONE_AT[i], DONE_AT[i] + 0.2));
      tf(f.done, { s: d, o: d > 0.01 ? 1 : 0 });
    });
    b0.style.borderColor = act === 0 ? C.red : C.line;
    b1.style.borderColor = act === 1 ? C.red : C.line;

    setTyped(t0, 'Bariloche', t, 6.5, 6.85, act === 0);
    tf(thumb0, { s: E.outBack(prog(t, 6.88, 7.1)) });
    setTyped(t1, 'Vacaciones de invierno', t, 7.0, 7.42, act === 1);

    popN(stA.n, 2, t, 7.5);
    popN(stM.n, 2, t, 7.75);
    for (const [p, at] of [[stA.plus, 7.5], [stM.plus, 7.75]]) {
      const on = kick(t, at, 10);
      p.style.background = on > 0.2 ? C.red : 'transparent';
      p.style.color = on > 0.2 ? '#fff' : C.ink;
      p.style.borderColor = on > 0.2 ? C.red : C.ink;
      tf(p, { s: 1 - on * 0.2 });
    }

    chips.forEach((c, i) => {
      const on = i < CHIP_AT.length && t >= CHIP_AT[i];
      c.style.background = on ? C.red : C.cream;
      c.style.color = on ? '#fff' : C.ink;
      c.style.borderColor = on ? C.red : C.line;
      tf(c, { s: on ? 1 + kick(t, CHIP_AT[i], 10) * 0.18 : 1 });
    });

    const p = lerp(0.12, 0.66, E.outExpo(prog(t, 8.5, 8.95)));
    const kx = TR.x + TR.w * p;
    fill.style.width = (TR.w * p).toFixed(1) + 'px';
    knob.style.left = (kx - 26).toFixed(1) + 'px';

    // cursor: arrastra el slider y después aprieta el botón
    const bx = BT.x + BT.w * 0.62, by = BT.y + BT.h * 0.55;
    const mv = E.inOutExpo(prog(t, 9.0, 9.4));
    const cx = lerp(kx + 6, bx, mv), cyy = lerp(TR.y + 12, by, mv);
    const cIn = prog(t, 8.3, 8.45), cOut = 1 - prog(t, 9.62, 9.75);
    const click = 1 - kick(t, 9.5, 14) * 0.25;
    cursor.style.left = (cx - 10).toFixed(1) + 'px';
    cursor.style.top = (cyy - 7).toFixed(1) + 'px';
    tf(cursor, { s: lerp(1.4, 1, cIn) * click, o: Math.min(cIn, cOut) });

    // botón
    const sent = t >= 9.5;
    const press = t < 9.5 ? 1 - 0.06 * prog(t, 9.4, 9.5) : 0.94 + 0.06 * E.spring(prog(t, 9.5, 9.95));
    btn.style.background = sent ? C.ink : t >= 9.38 ? C.redDark : C.red;
    btnTxt.textContent = sent ? '¡VIAJE ENVIADO!' : 'ENVIAR MI VIAJE SOÑADO';
    btnTxt.style.color = sent ? C.yellow : C.cream;
    btnIco.innerHTML = sent ? CHECK(C.yellow) : ARROW(C.cream);
    tf(btnIco, { x: sent ? 0 : kick(t, Math.floor(t * 4) / 4, 18) * 8, s: sent ? E.outBack(prog(t, 9.5, 9.7)) : 1 });
    tf(btn, { s: press });

    // confeti
    const ox = CARD.x + BT.x + BT.w / 2, oy = CARD.y + BT.y + BT.h / 2 + cy;
    const ct = t - 9.5;
    conf.forEach((c, k) => {
      if (ct < 0) { c.style.opacity = '0'; return; }
      const ang = -Math.PI / 2 + (hash(k + 7) - 0.5) * 2.4;
      const sp = 1000 + hash(k + 21) * 1100;
      const x = ox + Math.cos(ang) * sp * ct;
      const y = oy + Math.sin(ang) * sp * ct + 0.5 * 2600 * ct * ct;
      c.style.left = x.toFixed(1) + 'px';
      c.style.top = y.toFixed(1) + 'px';
      tf(c, { r: (hash(k + 3) - 0.5) * 1400 * ct, sx: Math.cos(ct * (8 + hash(k) * 10)), o: 1 });
    });

    // barrido circular rojo desde el botón, completo justo en 10 s
    const R = lerp(0, 2300, E.inExpo(prog(t, 9.7, 10.0)));
    Object.assign(wipe4.style, { width: 2 * R + 'px', height: 2 * R + 'px', left: ox - R + 'px', top: oy - R + 'px' });
  };

  // ======================================================================
  // S5 · 10–12 s · "TU DESTINO. / TUS FECHAS. / TU RITMO. / TU VIAJE."
  // ======================================================================
  const s5 = scene(10, 12);
  const lab5 = h('div', { cls: 'mono abs', text: 'CON NEWTRIPS, TODO A TU MEDIDA', style: { left: '64px', fontSize: '26px', color: C.cream } }, s5.el);
  const L5 = ['TU DESTINO.', 'TUS FECHAS.', 'TU RITMO.'].map((w) => h('div', { cls: 'disp abs', text: w, style: { left: '60px', color: C.cream, transformOrigin: '0% 50%' } }, s5.el));
  const band5 = h('div', { cls: 'abs', style: { left: '0', width: W + 'px', background: C.yellow, transformOrigin: '0% 50%' } }, s5.el);
  const last5 = h('div', { cls: 'disp abs', text: 'TU VIAJE.', style: { left: '60px', color: C.ink, transformOrigin: '50% 50%' } }, s5.el);
  s5.prepare = () => {
    const hs = L5.map((el) => fit(el, 920) * 0.86);
    const hl = fit(last5, 960) * 0.86;
    const total = hs.reduce((a, b) => a + b, 0) + hl + 4 * 22 + 30;
    let y = (H - total) / 2;
    lab5.style.top = y - 80 + 'px';
    L5.forEach((el, i) => { el.style.top = y + 'px'; y += hs[i] + 22; });
    y += 30;
    band5.style.top = y - 26 + 'px';
    band5.style.height = hl + 44 + 'px';
    last5.style.top = y + 'px';
  };
  s5.render = (lt) => {
    const drift = -lt * 24;
    L5.forEach((el, i) => {
      const a = i * BEAT, e = E.outExpo(prog(lt, a, a + 0.3));
      tf(el, { x: lerp(-1150, 0, e), y: drift, sx: 1 + kick(lt, a + 0.25) * 0.05 });
      mb(el, lerp(60, 0, E.outExpo(prog(lt, a, a + 0.2))), 0);
    });
    tf(lab5, { y: drift, o: prog(lt, 0.05, 0.2) });
    tf(band5, { sx: E.outExpo(prog(lt, 1.5, 1.7)), y: drift });
    const e4 = E.outExpo(prog(lt, 1.55, 1.8));
    tf(last5, { s: lerp(1.5, 1, e4) * (1 + kick(lt, 1.75) * 0.05), y: drift, o: prog(lt, 1.55, 1.6) });
    mb(last5, 0, lerp(30, 0, e4));
  };

  // ======================================================================
  // S6 · 12–14 s · "LO ARMAMOS A TU MEDIDA" + ruta con avión y destinos
  // ======================================================================
  const s6 = scene(12, 14);
  const t61 = h('div', { cls: 'disp abs', text: 'LO ARMAMOS', style: { left: '60px', top: '250px', color: C.cream, transformOrigin: '50% 50%' } }, s6.el);
  const t62 = h('div', { cls: 'disp abs', text: 'A TU MEDIDA', style: { left: '60px', color: C.yellow, transformOrigin: '50% 50%' } }, s6.el);
  const sub6 = h('div', { cls: 'mono abs', text: 'ASESOR PERSONALIZADO · CUOTAS SIN INTERÉS', style: { left: '0', width: W + 'px', textAlign: 'center', fontSize: '25px', color: C.cream, opacity: 0.85 } }, s6.el);
  const map = document.createElementNS(NS, 'svg');
  map.setAttribute('viewBox', `0 0 ${W} ${H}`);
  map.setAttribute('width', W); map.setAttribute('height', H);
  map.style.position = 'absolute'; map.style.left = '0'; map.style.top = '0';
  s6.el.appendChild(map);
  const SEG = [
    'M150 1540 C 190 1430, 240 1330, 330 1290',
    'C 470 1230, 700 1330, 800 1190',
    'C 880 1080, 620 1050, 430 1065',
    'C 300 1072, 560 870, 1220 760',
  ];
  const D6 = SEG.join(' ');
  map.innerHTML = `
    <defs><mask id="m6" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
      <path id="m6p" d="${D6}" fill="none" stroke="#fff" stroke-width="30"/></mask></defs>
    <path d="${D6}" fill="none" stroke="${C.yellow}" stroke-width="9" stroke-linecap="round" stroke-dasharray="1 24" mask="url(#m6)"/>
    <circle cx="150" cy="1540" r="16" fill="${C.cream}"/>`;
  const m6p = map.querySelector('#m6p');
  const start6 = h('div', { cls: 'mono abs', text: 'TU VIAJE EMPIEZA ACÁ', style: { left: '186px', top: '1524px', fontSize: '22px', color: C.cream } }, s6.el);
  const PINS = [
    { x: 330, y: 1290, img: 'salta', pos: '60% 50%', lab: 'SALTA', at: 12.5 },
    { x: 800, y: 1190, img: 'cataratas', pos: '70% 50%', lab: 'CATARATAS', at: 13.0 },
    { x: 430, y: 1065, img: 'punta-este', pos: '40% 50%', lab: 'PUNTA DEL ESTE', at: 13.5 },
  ].map((p) => {
    const g = h('div', { cls: 'abs', style: { left: p.x + 'px', top: p.y + 'px', width: '0', height: '0' } }, s6.el);
    const ring = h('div', { cls: 'abs', style: { left: '-30px', top: '-30px', width: '60px', height: '60px', borderRadius: '50%', border: `4px solid ${C.yellow}`, boxSizing: 'border-box' } }, g);
    const pin = h('div', { cls: 'abs', style: { left: '0', top: '0', transformOrigin: '0 0' } }, g);
    h('div', { cls: 'abs', style: { left: '-14px', top: '-14px', width: '28px', height: '28px', borderRadius: '50%', background: C.yellow, border: `5px solid ${C.ink}`, boxSizing: 'border-box' } }, pin);
    h('img', { cls: 'abs', src: PHOTO(p.img), style: { left: '-88px', top: '-240px', width: '176px', height: '176px', borderRadius: '50%', objectFit: 'cover', objectPosition: p.pos, border: `8px solid ${C.cream}`, boxSizing: 'border-box', boxShadow: '0 14px 30px rgba(0,0,0,.4)' } }, pin);
    h('div', { cls: 'mono abs', text: p.lab, style: { left: '0', top: '-58px', transform: 'translateX(-50%)', background: C.cream, color: C.ink, fontSize: '20px', padding: '6px 12px', borderRadius: '8px' } }, pin);
    return { ...p, ring, pin };
  });
  const plane = h('div', { cls: 'abs', html: PLANE, style: { left: '-48px', top: '-48px', transformOrigin: '48px 48px' } }, s6.el);
  const wipe6 = h('div', { cls: 'abs', style: { borderRadius: '50%', background: C.cream } }, s6.el);
  let LEN6 = [];
  s6.prepare = () => {
    const h1 = fit(t61, 960) * 0.86, h2 = fit(t62, 960) * 0.86;
    t62.style.top = 250 + h1 + 14 + 'px';
    sub6.style.top = 250 + h1 + h2 + 50 + 'px';
    const p = document.createElementNS(NS, 'path');
    map.appendChild(p);
    let acc = '';
    LEN6 = SEG.map((s) => { acc += ' ' + s; p.setAttribute('d', acc); return p.getTotalLength(); });
    map.removeChild(p);
    LEN6.unshift(0);
  };
  s6.render = (lt, t) => {
    const e1 = E.outExpo(prog(t, 12.0, 12.3)), e2 = E.outExpo(prog(t, 12.25, 12.55));
    tf(t61, { x: lerp(-1150, 0, e1) }); mb(t61, lerp(60, 0, e1), 0);
    tf(t62, { x: lerp(1150, 0, e2), sy: 1 + kick(t, 12.5) * 0.06 }); mb(t62, lerp(60, 0, e2), 0);
    tf(sub6, { y: lerp(30, 0, E.outExpo(prog(t, 12.5, 12.8))), o: prog(t, 12.5, 12.65) * 0.85 });
    tf(start6, { o: prog(t, 12.05, 12.25) });

    // avance por la ruta: llega a cada destino justo en el beat
    const KT = [12.0, 12.5, 13.0, 13.5, 13.85];
    let len = 0;
    for (let k = 0; k < 4; k++) {
      if (t >= KT[k]) len = lerp(LEN6[k], LEN6[k + 1], E.inOutCubic(prog(t, KT[k], KT[k + 1])));
    }
    const tot = LEN6[4];
    m6p.setAttribute('stroke-dasharray', `${len.toFixed(1)} ${tot + 10}`);
    const pt = m6p.getPointAtLength(len), pt2 = m6p.getPointAtLength(Math.min(tot, len + 2));
    const pt0 = m6p.getPointAtLength(Math.max(0, len - 2));
    const ang = (Math.atan2(pt2.y - pt0.y, pt2.x - pt0.x) * 180) / Math.PI;
    tf(plane, { x: pt.x, y: pt.y, r: ang, s: 1 + Math.sin(t * 10) * 0.03 });

    PINS.forEach((p) => {
      const m = E.outBack(prog(t, p.at - 0.04, p.at + 0.24));
      tf(p.pin, { s: m, o: m > 0.01 ? 1 : 0 });
      const rp = prog(t, p.at, p.at + 0.6);
      tf(p.ring, { s: 1 + rp * 4, o: (1 - rp) * (t >= p.at ? 1 : 0) });
    });

    const R = lerp(0, 2400, E.inExpo(prog(t, 13.72, 14.0)));
    Object.assign(wipe6.style, { width: 2 * R + 'px', height: 2 * R + 'px', left: 940 - R + 'px', top: 770 - R + 'px' });
  };

  // ======================================================================
  // S7 · 14–16 s · Cierre: escudo + wordmark + CTA al formulario
  // ======================================================================
  const s7 = scene(14, 16);
  const SHC = { x: 540, y: 590 };
  const rings7 = [14.0, 14.5, 15.0, 15.5].map(() => h('div', { cls: 'abs', style: { left: SHC.x - 230 + 'px', top: SHC.y - 230 + 'px', width: '460px', height: '460px', borderRadius: '50%', border: `6px solid ${C.red}`, boxSizing: 'border-box' } }, s7.el));
  const shield = h('img', { cls: 'abs', src: '../assets/logo.png', style: { left: SHC.x - 230 + 'px', top: SHC.y - 230 + 'px', width: '460px', height: '460px', transformOrigin: '50% 50%' } }, s7.el);
  const wm = h('img', { cls: 'abs', src: '../assets/logo-wordmark-black.png', style: { left: '170px', top: '900px', width: '740px' } }, s7.el);
  const cta = h('div', {
    cls: 'abs',
    style: {
      left: '80px', top: '1080px', width: '920px', height: '156px', borderRadius: '78px', background: C.red,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', transformOrigin: '50% 50%',
      boxShadow: '0 20px 44px rgba(237,28,36,.32)',
    },
  }, s7.el);
  h('span', { text: 'COMPLETÁ EL FORMULARIO', style: { fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontStretch: '75%', fontSize: '74px', color: C.cream, whiteSpace: 'nowrap', letterSpacing: '-.01em' } }, cta);
  const ctaIco = h('span', { html: ARROW(C.cream), style: { width: '64px', height: '64px', display: 'inline-block' } }, cta);
  const sub71 = h('div', { cls: 'mono abs', text: 'DISEÑÁ TU VIAJE · LINK EN LA BIO', style: { left: '0', width: W + 'px', textAlign: 'center', top: '1280px', fontSize: '30px', color: C.ink } }, s7.el);
  const sub72 = h('div', { cls: 'mono abs', text: '@NEWTRIPSVIAJES', style: { left: '0', width: W + 'px', textAlign: 'center', top: '1332px', fontSize: '30px', color: C.red } }, s7.el);
  s7.render = (lt, t) => {
    rings7.forEach((r, k) => {
      const a = 14 + k * BEAT, rp = E.outExpo(prog(t, a, a + 1.1));
      tf(r, { s: lerp(0.9, 2.3, rp), o: t >= a ? (1 - prog(t, a, a + 1.1)) * 0.55 : 0 });
    });
    const m = E.outBack(prog(t, 14.0, 14.42));
    tf(shield, { s: m * (1 + kick(t, 15.0, 10) * 0.05), r: lerp(-16, 0, m) + Math.sin(t * 3) * 1.2, y: Math.sin(t * 2.4) * 8 });
    const ew = E.outExpo(prog(t, 14.5, 14.8));
    tf(wm, { y: lerp(140, 0, ew), o: prog(t, 14.5, 14.56) });
    mb(wm, 0, lerp(24, 0, ew));
    const c = E.outBack(prog(t, 15.0, 15.32));
    tf(cta, { s: c * (1 + kick(t, 15.5, 9) * 0.06), o: c > 0.01 ? 1 : 0 });
    tf(ctaIco, { x: kick(t, Math.floor(t * 4) / 4, 14) * 12 });
    tf(sub71, { y: lerp(30, 0, E.outExpo(prog(t, 15.25, 15.55))), o: prog(t, 15.25, 15.35) });
    tf(sub72, { y: lerp(30, 0, E.outExpo(prog(t, 15.35, 15.65))), o: prog(t, 15.35, 15.45) });
  };

  // ---------- fondo global y API de render ----------
  const bgAt = (t) => (t < 4 ? C.ink : t < 10 ? C.cream : t < 12 ? C.red : t < 14 ? C.ink : C.cream);
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
  window.__duration = 16;
})();
