/* New Trips · "Caribe y Brasil" — anuncio para Meta Ads, 1080×1920, 31,2 s, 100 BPM.
   Cada cuadro se dibuja desde cero a partir de t (renderAt): sin transiciones CSS,
   sin timers y sin azar sin semilla, para poder renderizar cualquier cuadro en cualquier orden. */
(function () {
  const W = 1080, H = 1920, BEAT = 0.6;
  const C = {
    red: '#ED1C24', redDark: '#B8131A', cream: '#FAF6EE', creamWarm: '#F2EBDA',
    ink: '#1A1410', inkSoft: '#4A3F37', yellow: '#FFD23F', line: 'rgba(26,20,16,.12)',
  };
  const NS = 'http://www.w3.org/2000/svg';
  const root = document.getElementById('root');
  const bg = document.getElementById('bg');
  const fx = document.getElementById('fx');
  const IMG = (n) => 'img/' + n + '.jpg'; // fotos del sitio newtrips.vercel.app (ai-*: generadas con Higgsfield)
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


  // Paquetes del sitio (sección Caribe y Brasil, sin salidas grupales). Precio = la oferta más baja del destino.
  const CARIBE = [
    { img: 'puntacana', pos: '50% 60%', name: 'Punta Cana', where: 'REP. DOMINICANA', reg: 'Solo alojamiento', price: '860', badge: 'ALL INCLUSIVE DESDE USD 1.701' },
    { img: 'cancun', pos: '62% 55%', name: 'Cancún', where: 'MÉXICO', reg: 'Solo alojamiento', price: '959' },
    { img: 'laromana', pos: '50% 55%', name: 'La Romana', where: 'REP. DOMINICANA', reg: 'All inclusive', price: '1.387', badge: 'ALL INCLUSIVE' },
  ];
  const BRASIL = [
    { img: 'natal', pos: '50% 55%', name: 'Natal + Pipa', where: 'BRASIL · NORDESTE', reg: 'Desayuno incluido', price: '466', badge: 'VALIJA DE 23 KG INCLUIDA' },
    { img: 'maragogi', pos: '50% 60%', name: 'Maragogi', where: 'BRASIL · NORDESTE', reg: 'Desayuno incluido', price: '631', badge: 'VALIJA DE 23 KG INCLUIDA' },
    { img: 'buzios', pos: '40% 55%', name: 'Río + Búzios', where: 'BRASIL · RÍO DE JANEIRO', reg: 'Solo alojamiento', price: '649', badge: 'VALIJA DE 23 KG INCLUIDA' },
  ];
  const CARD_DUR = 3.0;
  // zona segura de Reels/Stories en Meta: el contenido clave va entre y=270 e y=1250
  const SAFE_TOP = 270, SAFE_BOTTOM = 1250;

  // ======================================================================
  // S1 · 0–3 s · Gancho: "TU VERANO / EN EL CARIBE / O EN BRASIL" + "DESDE USD 466"
  // ======================================================================
  const s1 = scene(0, 3.0);
  const p1 = photo(s1.el, IMG('ai-aerea'), '50% 50%', 'linear-gradient(180deg, rgba(26,20,16,.55) 0%, rgba(26,20,16,.25) 45%, rgba(26,20,16,.55) 100%)');
  const lab1 = h('div', { cls: 'mono abs', text: 'NEWTRIPS · VERANO 2027', style: { left: '64px', top: '200px', fontSize: '26px', color: C.cream, textShadow: '0 2px 10px rgba(0,0,0,.5)' } }, s1.el);
  const L1 = [['TU VERANO', C.cream], ['EN EL CARIBE', C.yellow], ['O EN BRASIL', C.cream]].map(([w, c]) => h('div', { cls: 'disp abs', text: w, style: { left: '60px', color: c, textShadow: SHADOW, transformOrigin: '50% 50%' } }, s1.el));
  const st1 = h('div', { cls: 'abs', style: { left: '540px', width: '0', height: '0' } }, s1.el);
  const st1In = h('div', {
    cls: 'abs',
    style: { left: '-430px', top: '0', width: '860px', height: '290px', borderRadius: '34px', background: C.yellow, border: `6px solid ${C.ink}`, boxSizing: 'border-box', boxShadow: '0 24px 60px rgba(0,0,0,.4)', transformOrigin: '50% 50%', textAlign: 'center', color: C.ink },
  }, st1);
  h('div', { cls: 'mono', text: 'AÉREO + HOTEL + TRASLADOS', style: { marginTop: '26px', fontSize: '26px' } }, st1In);
  const st1Price = h('div', { cls: 'disp', html: '<span style="font-size:.5em;vertical-align:.55em;margin-right:.2em">DESDE</span>USD 466', style: { marginTop: '6px' } }, st1In);
  h('div', { cls: 'mono', text: 'POR PERSONA · BASE DOBLE', style: { marginTop: '6px', fontSize: '22px' } }, st1In);
  s1.prepare = () => {
    const hs = L1.map((el) => fit(el, 960) * 0.86);
    fit(st1Price, 700);
    let y = SAFE_TOP + 30;
    L1.forEach((el, i) => { el.style.top = y + 'px'; y += hs[i] + 16; });
    st1.style.top = y + 40 + 'px';
  };
  s1.render = (lt) => {
    tf(p1.img, { s: lerp(1.3, 1.06, E.outExpo(prog(lt, 0, 1.2))) - lt * 0.01 });
    tf(lab1, { o: prog(lt, 0.1, 0.3) });
    L1.forEach((el, i) => {
      const a = i * BEAT, e = E.outExpo(prog(lt, a, a + 0.3));
      tf(el, { y: lerp(120, 0, e), s: lerp(1.35, 1, e), o: prog(lt, a, a + 0.05) });
      mb(el, 0, lerp(30, 0, E.outExpo(prog(lt, a, a + 0.2))));
    });
    const m = E.outBack(prog(lt, 1.8, 2.15));
    tf(st1In, { s: m * (1 + kick(lt, 2.4, 9) * 0.05), r: lerp(-20, -3, m), o: m > 0.01 ? 1 : 0 });
  };

  // ======================================================================
  // Tarjetas de destino (Caribe y Brasil): foto real, datos y precio; entran y salen como un carrusel
  // ======================================================================
  const CARD = { x: 70, y: SAFE_TOP, w: 940, h: SAFE_BOTTOM - SAFE_TOP };
  function cardsScene(start, list, section) {
    const s = scene(start, start + list.length * CARD_DUR);
    const items = list.map((d, i) => {
      const bgL = h('div', { cls: 'layer', style: { overflow: 'hidden' } }, s.el);
      h('img', { cls: 'cover', src: IMG(d.img + '-fondo') }, bgL); // fondo ya desenfocado (ffmpeg) para que el render sea rápido
      const sec = h('div', { cls: 'mono abs', text: section, style: { left: '0', width: W + 'px', textAlign: 'center', top: '196px', fontSize: '26px', color: C.cream, opacity: 0.9 } }, bgL);
      const card = h('div', {
        cls: 'abs',
        style: { left: CARD.x + 'px', top: CARD.y + 'px', width: CARD.w + 'px', height: CARD.h + 'px', borderRadius: '44px', overflow: 'hidden', background: C.cream, boxShadow: '0 40px 90px rgba(0,0,0,.45)', transformOrigin: '50% 50%' },
      }, s.el);
      const ph = h('div', { cls: 'abs', style: { left: '0', top: '0', width: CARD.w + 'px', height: '540px', overflow: 'hidden' } }, card);
      const img = h('img', { cls: 'cover', src: IMG(d.img), style: { objectPosition: d.pos, transformOrigin: '50% 50%' } }, ph);
      h('div', { cls: 'mono abs', text: d.where, style: { left: '28px', bottom: '24px', background: 'rgba(26,20,16,.78)', color: C.cream, fontSize: '22px', padding: '10px 16px', borderRadius: '10px' } }, ph);
      h('div', { cls: 'mono abs', text: `${i + 1} / ${list.length}`, style: { right: '28px', top: '26px', background: 'rgba(250,246,238,.92)', color: C.ink, fontSize: '22px', padding: '10px 14px', borderRadius: '10px' } }, ph);
      const badge = d.badge ? h('div', { cls: 'abs', text: d.badge, style: { left: '26px', top: '24px', background: C.yellow, color: C.ink, fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '32px', padding: '12px 22px', borderRadius: '14px', border: `4px solid ${C.ink}`, whiteSpace: 'nowrap', transformOrigin: '0% 50%', boxShadow: '0 10px 24px rgba(0,0,0,.3)' } }, ph) : null;
      const name = h('div', { cls: 'abs', text: d.name, style: { left: '44px', top: '566px', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '92px', letterSpacing: '-.03em', lineHeight: '1', color: C.ink, whiteSpace: 'nowrap' } }, card);
      const ln1 = h('div', { cls: 'abs', text: `9 días · 8 noches · ${d.reg}`, style: { left: '46px', top: '676px', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '36px', color: C.inkSoft, whiteSpace: 'nowrap' } }, card);
      const ln2 = h('div', { cls: 'abs', text: 'Aéreo desde Buenos Aires + traslados', style: { left: '46px', top: '726px', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '36px', color: C.inkSoft, whiteSpace: 'nowrap' } }, card);
      h('div', { cls: 'abs', style: { left: '44px', right: '44px', top: '796px', height: '3px', background: C.line } }, card);
      const price = h('div', { cls: 'abs', style: { left: '40px', top: '812px', transformOrigin: '0% 60%' } }, card);
      h('div', { cls: 'mono', text: 'DESDE', style: { fontSize: '24px', color: C.red, marginLeft: '6px' } }, price);
      h('div', { text: `USD ${d.price}`, style: { fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontStretch: '75%', fontSize: '128px', lineHeight: '1', letterSpacing: '-.01em', color: C.red, whiteSpace: 'nowrap' } }, price);
      const per = h('div', { cls: 'mono abs', html: 'POR PERSONA<br>BASE DOBLE', style: { right: '44px', top: '868px', fontSize: '24px', lineHeight: '1.45', color: C.inkSoft, textAlign: 'right' } }, card);
      return { bgL, sec, card, img, badge, name, ln1, ln2, price, per };
    });
    s.render = (lt) => {
      const i = Math.min(list.length - 1, Math.floor(lt / CARD_DUR)), u = lt - i * CARD_DUR;
      items.forEach((it, j) => {
        const on = j === i;
        it.bgL.style.display = on ? 'block' : 'none';
        it.card.style.display = on ? 'block' : 'none';
      });
      const it = items[i];
      it.bgL.style.opacity = prog(u, 0, 0.25).toFixed(3);
      const ein = E.outExpo(prog(u, 0, 0.5)), eout = E.inExpo(prog(u, CARD_DUR - 0.35, CARD_DUR));
      tf(it.card, { x: lerp(1150, 0, ein) - 1150 * eout, r: lerp(7, 0, ein) - 7 * eout, y: Math.sin(lt * 2) * 4 });
      mb(it.card, lerp(50, 0, E.outExpo(prog(u, 0, 0.3))) + 50 * eout, 0);
      tf(it.img, { s: lerp(1.14, 1.0, u / CARD_DUR) });
      tf(it.name, { y: lerp(40, 0, E.outExpo(prog(u, 0.15, 0.45))), o: prog(u, 0.15, 0.25) });
      tf(it.ln1, { y: lerp(30, 0, E.outExpo(prog(u, 0.3, 0.6))), o: prog(u, 0.3, 0.4) });
      tf(it.ln2, { y: lerp(30, 0, E.outExpo(prog(u, 0.45, 0.75))), o: prog(u, 0.45, 0.55) });
      const m = E.outBack(prog(u, BEAT, BEAT + 0.35));
      tf(it.price, { s: lerp(0.4, 1, m) * (1 + kick(u, 2 * BEAT, 9) * 0.05), o: prog(u, BEAT, BEAT + 0.05) });
      tf(it.per, { o: prog(u, BEAT + 0.15, BEAT + 0.3) });
      if (it.badge) {
        const b = E.outBack(prog(u, 2 * BEAT, 2 * BEAT + 0.3));
        tf(it.badge, { s: b, r: lerp(-14, -3, b), o: b > 0.01 ? 1 : 0 });
      }
    };
    return s;
  }

  // ======================================================================
  // S2 · 3–4,2 s · Título CARIBE
  // ======================================================================
  const s2 = scene(3.0, 4.2);
  const p2 = photo(s2.el, IMG('ai-catamaran'), '50% 50%', 'linear-gradient(180deg, rgba(26,20,16,.45) 0%, rgba(26,20,16,.1) 40%, rgba(26,20,16,.45) 100%)');
  const t2 = h('div', { cls: 'disp abs', text: 'CARIBE', style: { left: '60px', top: '420px', color: C.cream, textShadow: SHADOW, transformOrigin: '50% 50%' } }, s2.el);
  const sub2 = h('div', { cls: 'mono abs', text: 'REP. DOMINICANA · MÉXICO', style: { left: '50%', transform: 'translateX(-50%)', fontSize: '34px', color: C.cream, background: 'rgba(26,20,16,.78)', padding: '14px 26px', borderRadius: '14px' } }, s2.el);
  const sub2w = h('div', { cls: 'abs', style: { left: '0', width: W + 'px', height: '0' } }, s2.el);
  sub2w.appendChild(sub2);
  s2.prepare = () => { const fs = fit(t2, 960); sub2w.style.top = 420 + fs * 0.86 + 40 + 'px'; };
  s2.render = (lt) => {
    tf(p2.img, { s: lerp(1.25, 1.08, E.outExpo(prog(lt, 0, 1))) });
    p2.flash.style.opacity = lerp(0.5, 0, prog(lt, 0, 0.12)).toFixed(3);
    const e = E.outExpo(prog(lt, 0, 0.3));
    tf(t2, { s: lerp(1.6, 1, e) * (1 - kick(lt, BEAT) * 0.04), o: prog(lt, 0, 0.04) });
    mb(t2, 0, lerp(34, 0, E.outExpo(prog(lt, 0, 0.18))));
    tf(sub2w, { y: lerp(30, 0, E.outExpo(prog(lt, 0.3, 0.6))), o: prog(lt, 0.3, 0.4) });
  };

  cardsScene(4.2, CARIBE, 'CARIBE · AÉREO DESDE BUENOS AIRES');

  // ======================================================================
  // S4 · 13,2–14,4 s · Título BRASIL con los tres destinos en miniatura
  // ======================================================================
  const s4 = scene(13.2, 14.4);
  const t4 = h('div', { cls: 'disp abs', text: 'BRASIL', style: { left: '60px', top: '380px', color: C.cream, transformOrigin: '50% 50%' } }, s4.el);
  const sub4 = h('div', { cls: 'mono abs', text: 'NORDESTE · RÍO DE JANEIRO', style: { left: '0', width: W + 'px', textAlign: 'center', fontSize: '34px', color: C.cream } }, s4.el);
  const th4 = BRASIL.map((d, i) => h('img', { cls: 'abs', src: IMG(d.img), style: { left: 120 + i * 300 - 20 + 'px', top: '920px', width: '240px', height: '240px', borderRadius: '50%', objectFit: 'cover', objectPosition: d.pos, border: `8px solid ${C.cream}`, boxSizing: 'border-box', boxShadow: '0 16px 36px rgba(0,0,0,.35)', transformOrigin: '50% 50%' } }, s4.el));
  s4.prepare = () => { const fs = fit(t4, 960); sub4.style.top = 380 + fs * 0.86 + 40 + 'px'; };
  s4.render = (lt) => {
    const e = E.outExpo(prog(lt, 0, 0.3));
    tf(t4, { s: lerp(1.6, 1, e), o: prog(lt, 0, 0.04) });
    mb(t4, 0, lerp(34, 0, E.outExpo(prog(lt, 0, 0.18))));
    tf(sub4, { y: lerp(30, 0, E.outExpo(prog(lt, 0.2, 0.5))), o: prog(lt, 0.2, 0.3) });
    th4.forEach((el, i) => {
      const a = 0.3 + i * 0.25, m = E.outBack(prog(lt, a, a + 0.3));
      tf(el, { s: m, r: lerp(-20, (i - 1) * 4, m), o: m > 0.01 ? 1 : 0 });
    });
  };

  cardsScene(14.4, BRASIL, 'BRASIL · AÉREO DESDE BUENOS AIRES');

  // ======================================================================
  // S6 · 23,4–25,8 s · Qué incluyen todos
  // ======================================================================
  const s6 = scene(23.4, 25.8);
  const t6 = h('div', { cls: 'disp abs', text: 'TODOS INCLUYEN', style: { left: '60px', top: SAFE_TOP + 20 + 'px', color: C.ink, transformOrigin: '0% 50%' } }, s6.el);
  const R6 = ['Aéreo desde Buenos Aires', 'Traslados en destino', '8 noches de hotel', 'Asistencia al viajero'].map((txt, i) => {
    const row = h('div', { cls: 'abs', style: { left: '70px', top: 560 + i * 140 + 'px', display: 'flex', alignItems: 'center', gap: '28px', transformOrigin: '0% 50%' } }, s6.el);
    h('div', { html: CHECK('#fff'), style: { width: '76px', height: '76px', borderRadius: '50%', background: C.red, flex: 'none' } }, row);
    h('span', { text: txt, style: { fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '66px', letterSpacing: '-.02em', color: C.ink, whiteSpace: 'nowrap' } }, row);
    return row;
  });
  const fine6 = h('div', { cls: 'mono abs', text: 'PRECIOS POR PERSONA EN BASE DOBLE · NO INCLUYEN GASTOS DE GESTIÓN', style: { left: '0', width: W + 'px', textAlign: 'center', top: '1150px', fontSize: '19px', color: C.inkSoft } }, s6.el);
  const wipe6 = wipe(s6.el, C.red);
  s6.prepare = () => { fit(t6, 960); };
  s6.render = (lt, t) => {
    const e = E.outExpo(prog(lt, 0, 0.3));
    tf(t6, { x: lerp(-1150, 0, e) }); mb(t6, lerp(60, 0, e), 0);
    R6.forEach((r, i) => {
      const a = 0.3 + i * 0.3, m = E.outBack(prog(lt, a, a + 0.3));
      tf(r, { x: lerp(-80, 0, m), s: 0.6 + 0.4 * m, o: prog(lt, a, a + 0.06) });
    });
    tf(fine6, { o: prog(lt, 1.5, 1.7) });
    setWipe(wipe6, 540, 960, lerp(0, 2300, E.inExpo(prog(t, 25.55, 25.8))));
  };

  // ======================================================================
  // S7 · 25,8–28,2 s · "RESERVÁ HOY / Y PAGALO / EN CUOTAS"
  // ======================================================================
  const s7 = scene(25.8, 28.2);
  const L7 = ['RESERVÁ HOY', 'Y PAGALO'].map((w) => h('div', { cls: 'disp abs', text: w, style: { left: '60px', color: C.cream, transformOrigin: '0% 50%' } }, s7.el));
  const band7 = h('div', { cls: 'abs', style: { left: '0', width: W + 'px', background: C.yellow, transformOrigin: '0% 50%' } }, s7.el);
  const last7 = h('div', { cls: 'disp abs', text: 'EN CUOTAS', style: { left: '60px', color: C.ink, transformOrigin: '50% 50%' } }, s7.el);
  const fine7 = h('div', { cls: 'mono abs', text: 'CUOTAS PARA LA PARTE TERRESTRE · CONSULTANOS', style: { left: '64px', fontSize: '24px', color: C.cream } }, s7.el);
  const wipe7 = wipe(s7.el, C.cream);
  s7.prepare = () => {
    const hs = L7.map((el) => fit(el, 940) * 0.86);
    const hl = fit(last7, 960) * 0.86;
    let y = SAFE_TOP + 60;
    L7.forEach((el, i) => { el.style.top = y + 'px'; y += hs[i] + 22; });
    y += 30;
    band7.style.top = y - 26 + 'px'; band7.style.height = hl + 44 + 'px';
    last7.style.top = y + 'px';
    fine7.style.top = y + hl + 64 + 'px';
  };
  s7.render = (lt, t) => {
    L7.forEach((el, i) => {
      const a = i * BEAT, e = E.outExpo(prog(lt, a, a + 0.3));
      tf(el, { x: lerp(-1150, 0, e), sx: 1 + kick(lt, a + BEAT / 2) * 0.04 });
      mb(el, lerp(60, 0, E.outExpo(prog(lt, a, a + 0.2))), 0);
    });
    tf(band7, { sx: E.outExpo(prog(lt, 2 * BEAT, 2 * BEAT + 0.25)) });
    const e4 = E.outExpo(prog(lt, 2 * BEAT + 0.05, 2 * BEAT + 0.35));
    tf(last7, { s: lerp(1.5, 1, e4) * (1 + kick(lt, 3 * BEAT) * 0.05), o: prog(lt, 2 * BEAT + 0.05, 2 * BEAT + 0.1) });
    mb(last7, 0, lerp(30, 0, e4));
    tf(fine7, { y: lerp(30, 0, E.outExpo(prog(lt, 1.6, 1.9))), o: prog(lt, 1.6, 1.7) });
    setWipe(wipe7, 540, 1920, lerp(0, 2300, E.inExpo(prog(t, 27.95, 28.2))));
  };

  // ======================================================================
  // S8 · 28,2–31,2 s · Cierre: logo + "RESERVÁ TU VERANO" + "LINK ACÁ ABAJO" (apunta al botón del anuncio)
  // ======================================================================
  const s8 = scene(28.2, 31.2);
  const SHC = { x: 540, y: 470 };
  const rings8 = [28.2, 28.8, 29.4, 30.0, 30.6].map(() => h('div', { cls: 'abs', style: { left: SHC.x - 170 + 'px', top: SHC.y - 170 + 'px', width: '340px', height: '340px', borderRadius: '50%', border: `6px solid ${C.red}`, boxSizing: 'border-box' } }, s8.el));
  const shield = h('img', { cls: 'abs', src: LOGO('logo'), style: { left: SHC.x - 170 + 'px', top: SHC.y - 170 + 'px', width: '340px', height: '340px', transformOrigin: '50% 50%' } }, s8.el);
  const wm = h('img', { cls: 'abs', src: LOGO('logo-wordmark-black'), style: { left: '220px', top: '690px', width: '640px' } }, s8.el);
  const cta = h('div', {
    cls: 'abs',
    style: { left: '80px', top: '840px', width: '920px', height: '150px', borderRadius: '75px', background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', transformOrigin: '50% 50%', boxShadow: '0 20px 44px rgba(237,28,36,.32)' },
  }, s8.el);
  h('span', { text: 'RESERVÁ TU VERANO', style: { fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontStretch: '75%', fontSize: '86px', color: C.cream, whiteSpace: 'nowrap', letterSpacing: '-.01em' } }, cta);
  const link = h('div', { cls: 'abs', text: 'LINK ACÁ ABAJO', style: { left: '0', width: W + 'px', textAlign: 'center', top: '1030px', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '64px', letterSpacing: '-.01em', color: C.ink, transformOrigin: '50% 50%' } }, s8.el);
  const DOWN = svg(`<path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`, '0 0 24 24', 86, 86);
  const arrow = h('div', { cls: 'abs', html: DOWN, style: { left: 540 - 70 + 'px', top: '1120px', width: '140px', height: '140px', borderRadius: '50%', background: C.yellow, border: `5px solid ${C.ink}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', transformOrigin: '50% 50%' } }, s8.el);
  s8.render = (lt, t) => {
    rings8.forEach((r, k) => {
      const a = 28.2 + k * BEAT, rp = E.outExpo(prog(t, a, a + 1.2));
      tf(r, { s: lerp(0.95, 2.2, rp), o: t >= a ? (1 - prog(t, a, a + 1.2)) * 0.5 : 0 });
    });
    const m = E.outBack(prog(t, 28.2, 28.6));
    tf(shield, { s: m, r: lerp(-16, 0, m) + Math.sin(t * 3) * 1.2, y: Math.sin(t * 2.4) * 6 });
    const ew = E.outExpo(prog(t, 28.5, 28.8));
    tf(wm, { y: lerp(120, 0, ew), o: prog(t, 28.5, 28.56) });
    mb(wm, 0, lerp(24, 0, ew));
    const c = E.outBack(prog(t, 28.8, 29.12));
    tf(cta, { s: c * (1 + kick(t, 30.0, 9) * 0.05), o: c > 0.01 ? 1 : 0 });
    const l = E.outExpo(prog(t, 29.1, 29.4));
    tf(link, { y: lerp(40, 0, l), o: prog(t, 29.1, 29.2) });
    const a = E.outBack(prog(t, 29.3, 29.6));
    const bounce = t >= 29.6 ? Math.abs(Math.sin(((t - 29.6) / BEAT) * Math.PI)) * 26 : 0;
    tf(arrow, { s: a, y: bounce, o: a > 0.01 ? 1 : 0 });
  };

  // ---------- fondo global y API de render ----------
  const bgAt = (t) => (t < 13.2 ? C.ink : t < 14.4 ? C.red : t < 23.4 ? C.ink : t < 25.8 ? C.cream : t < 28.2 ? C.red : C.cream);
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
  window.__duration = 31.2;
})();
