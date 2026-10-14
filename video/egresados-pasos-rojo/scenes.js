/* New Trips · Egresados para DELEGADOS y DOCENTES — "Organizar el viaje de egresados es más fácil de lo que pensás".
   Versión ROJO Y BLANCO. Estilo: editorial claro, mapa de rutas desde Mar del Plata y paso a paso. 1080×1920, 22 s, 120 BPM.
   El respaldo final (Google, legajo, factura) aparece más lento, uno cada 0,8 s.
   Cierre: agendar una reunión. */
(function () {
  const { W, H, C, NS, BEAT, lerp, prog, E, kick, h, tf, mb, fit, svg, CHECK, PLANE, scene, SAFE_TOP, SAFE_BOTTOM, STAR, EG_IMG, endCard, finish } = NTV;

  // ======================================================================
  // S1 · 0–3 s · "ORGANIZAR EL VIAJE / DE EGRESADOS / ES MÁS FÁCIL / DE LO QUE PENSÁS."
  // ======================================================================
  const s1 = scene(0, 3.0);
  const lab1 = h('div', { cls: 'mono abs', text: 'PARA DELEGADOS, DOCENTES Y FAMILIAS', style: { left: '64px', top: SAFE_TOP + 'px', fontSize: '26px', color: C.red } }, s1.el);
  const L1 = [['ORGANIZAR EL VIAJE', C.ink], ['DE EGRESADOS', C.ink], ['ES MÁS FÁCIL', C.red], ['DE LO QUE PENSÁS.', C.ink]].map(([w, c]) => h('div', { cls: 'disp abs', text: w, style: { left: '60px', color: c, transformOrigin: '0% 100%' } }, s1.el));
  const und = document.createElementNS(NS, 'svg');
  und.setAttribute('viewBox', '0 0 960 60'); und.setAttribute('width', 960); und.setAttribute('height', 60);
  Object.assign(und.style, { position: 'absolute', left: '60px' });
  und.innerHTML = `<path d="M6 40 C 180 10, 420 52, 620 24 S 900 30, 954 18" fill="none" stroke="rgba(237,28,36,.3)" stroke-width="16" stroke-linecap="round"/>`;
  s1.el.appendChild(und);
  const undP = und.querySelector('path');
  let UND_LEN = 1000;
  s1.prepare = () => {
    let y = SAFE_TOP + 70;
    L1.forEach((el, i) => {
      const hh = fit(el, 960) * 0.86; el.style.top = y + 'px';
      if (i === 2) und.style.top = y + hh - 18 + 'px';
      y += hh + 16;
    });
    UND_LEN = undP.getTotalLength();
  };
  s1.render = (lt) => {
    tf(lab1, { o: prog(lt, 0.05, 0.25) });
    L1.forEach((el, i) => {
      const a = i * 0.35, e = E.outExpo(prog(lt, a, a + 0.5));
      tf(el, { y: lerp(70, 0, e), o: prog(lt, a, a + 0.2) });
    });
    const d = E.inOutCubic(prog(lt, 1.2, 1.8));
    undP.setAttribute('stroke-dasharray', `${(UND_LEN * d).toFixed(1)} ${UND_LEN + 10}`);
  };

  // ======================================================================
  // S2 · 3–7 s · Mapa: salida desde Mar del Plata hacia los 3 destinos
  // ======================================================================
  const s2 = scene(3.0, 7.0);
  const t2 = h('div', { cls: 'disp abs', html: `3 DESTINOS, <span style="color:${C.red}">1 SALIDA</span>`, style: { left: '60px', top: SAFE_TOP - 10 + 'px', color: C.ink } }, s2.el);
  const sub2 = h('div', { cls: 'mono abs', text: 'TODOS LOS VIAJES SALEN DESDE MAR DEL PLATA', style: { left: '64px', fontSize: '24px', color: C.inkSoft } }, s2.el);
  const map = document.createElementNS(NS, 'svg');
  map.setAttribute('viewBox', `0 0 ${W} ${H}`); map.setAttribute('width', W); map.setAttribute('height', H);
  Object.assign(map.style, { position: 'absolute', left: '0', top: '0' });
  s2.el.appendChild(map);
  const O = { x: 620, y: 1190 };
  const DST = [
    { x: 250, y: 830, name: 'Villa Carlos Paz', reg: 'CÓRDOBA', img: 'carlospaz', d: `M${O.x} ${O.y} C 500 1080, 300 1020, 250 830`, at: 4.0 },
    { x: 830, y: 790, name: 'Camboriú', reg: 'BRASIL', img: 'camboriu', d: `M${O.x} ${O.y} C 800 1100, 960 960, 830 790`, at: 4.8 },
  ];
  let grid = '';
  for (let x = 60; x < W; x += 60) for (let y = 520; y < 1300; y += 60) grid += `<circle cx="${x}" cy="${y}" r="2.4" fill="rgba(237,28,36,.2)"/>`;
  // cada ruta punteada se revela con una máscara de trazo continuo
  map.innerHTML = `<defs>${DST.map((d, i) => `<mask id="mk${i}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><path id="mp${i}" d="${d.d}" fill="none" stroke="#fff" stroke-width="30"/></mask>`).join('')}</defs>${grid}${DST.map((d, i) => `<path id="rt${i}" d="${d.d}" fill="none" stroke="${C.red}" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 22" mask="url(#mk${i})"/>`).join('')}`;
  const routes = DST.map((_, i) => map.querySelector('#rt' + i));
  const masks = DST.map((_, i) => map.querySelector('#mp' + i));
  const lens = [];
  const pinO = h('div', { cls: 'abs', style: { left: O.x + 'px', top: O.y + 'px', width: '0', height: '0' } }, s2.el);
  const pinOin = h('div', { cls: 'abs', style: { left: '-140px', top: '-150px', width: '280px', transformOrigin: '50% 100%', textAlign: 'center' } }, pinO);
  h('img', { src: EG_IMG('mardelplata'), style: { width: '170px', height: '170px', borderRadius: '50%', objectFit: 'cover', border: `8px solid ${C.red}`, boxSizing: 'border-box', boxShadow: '0 14px 30px rgba(26,20,16,.25)' } }, pinOin);
  h('div', { html: `<b style="font-family:'Bricolage Grotesque';font-size:40px;display:block">Mar del Plata</b><span class="mono" style="font-size:20px;color:${C.red}">SALIDA · Y TAMBIÉN DESTINO</span>`, style: { marginTop: '6px', color: C.ink, lineHeight: '1.1' } }, pinOin);
  const pins = DST.map((d) => {
    const g = h('div', { cls: 'abs', style: { left: d.x + 'px', top: d.y + 'px', width: '0', height: '0' } }, s2.el);
    const inn = h('div', { cls: 'abs', style: { left: '-190px', top: '-250px', width: '380px', textAlign: 'center', transformOrigin: '50% 100%' } }, g);
    h('img', { src: EG_IMG(d.img), style: { width: '170px', height: '170px', borderRadius: '50%', objectFit: 'cover', border: `8px solid ${C.red}`, boxSizing: 'border-box', boxShadow: '0 14px 30px rgba(26,20,16,.25)' } }, inn);
    h('div', { html: `<b style="font-family:'Bricolage Grotesque';font-size:40px;display:block">${d.name}</b><span class="mono" style="font-size:20px;color:${C.red}">${d.reg}</span>`, style: { marginTop: '6px', color: C.ink, lineHeight: '1.1' } }, inn);
    return inn;
  });
  const plane = DST.map(() => h('div', { cls: 'abs', html: PLANE, style: { left: '-48px', top: '-48px', transformOrigin: '48px 48px' } }, s2.el));
  s2.prepare = () => {
    const fs = fit(t2, 960);
    sub2.style.top = SAFE_TOP - 10 + fs * 0.86 + 24 + 'px';
    routes.forEach((r) => lens.push(r.getTotalLength()));
  };
  s2.render = (lt, t) => {
    const e = E.outExpo(prog(lt, 0, 0.4));
    tf(t2, { y: lerp(60, 0, e), o: prog(lt, 0, 0.15) });
    tf(sub2, { o: prog(lt, 0.2, 0.4) });
    const mo = E.outBack(prog(lt, 0.3, 0.65));
    tf(pinOin, { s: mo, o: mo > 0.01 ? 1 : 0 });
    DST.forEach((d, i) => {
      const p = E.inOutCubic(prog(t, d.at - 0.6, d.at));
      const L = lens[i] || 1;
      masks[i].setAttribute('stroke-dasharray', `${(L * p).toFixed(1)} ${L + 10}`);
      const pt = routes[i].getPointAtLength(L * p), pt2 = routes[i].getPointAtLength(Math.min(L, L * p + 2));
      const pt0 = routes[i].getPointAtLength(Math.max(0, L * p - 2));
      const ang = (Math.atan2(pt2.y - pt0.y, pt2.x - pt0.x) * 180) / Math.PI;
      tf(plane[i], { x: pt.x, y: pt.y, r: ang, o: p > 0 && p < 1 ? 1 : 0 });
      const m = E.outBack(prog(t, d.at, d.at + 0.35));
      tf(pins[i], { s: m, o: m > 0.01 ? 1 : 0 });
    });
  };

  // ======================================================================
  // S3 · 7–15 s · Cómo funciona: 4 pasos (texto del sitio), uno cada 2 s
  // ======================================================================
  const s3 = scene(7.0, 15.0);
  const t3 = h('div', { cls: 'disp abs', text: 'ASÍ DE SIMPLE', style: { left: '60px', top: SAFE_TOP - 10 + 'px', color: C.ink } }, s3.el);
  const STEPS = [
    ['1', 'Nos escribís', 'Colegio, curso, cuántos chicos son y qué destino les gustaría.'],
    ['2', 'Armamos la propuesta', 'Destino, fechas, hotel, comidas, excursiones y plan de pagos, todo por escrito.'],
    ['3', 'Respondemos a las familias', 'Resolvemos las dudas de padres y colegio antes de confirmar.'],
    ['✈', '¡A viajar!', 'Coordinadores con el grupo, médico las 24 hs y novedades todos los días.'],
  ];
  const ST_Y0 = 470, ST_H = 190;
  const rail = h('div', { cls: 'abs', style: { left: '118px', top: ST_Y0 + 50 + 'px', width: '8px', height: ST_H * 3 + 'px', background: C.line, borderRadius: '4px' } }, s3.el);
  const railFill = h('div', { cls: 'abs', style: { left: '0', top: '0', width: '100%', height: '100%', background: C.red, borderRadius: '4px', transformOrigin: '50% 0%' } }, rail);
  const steps = STEPS.map(([n, a, b], i) => {
    const row = h('div', { cls: 'abs', style: { left: '70px', top: ST_Y0 + i * ST_H + 'px', width: '940px', display: 'flex', gap: '34px', transformOrigin: '0% 50%' } }, s3.el);
    const num = h('div', { html: n === '✈' ? PLANE.replace('#FFD23F', '#FAF6EE').replace('stroke="#1A1410"', 'stroke="none"').replace('width="96" height="96"', 'width="64" height="64"') : n, style: { width: '104px', height: '104px', borderRadius: '50%', background: C.red, color: C.cream, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '60px', transformOrigin: '50% 50%' } }, row);
    const tx = h('div', { style: { paddingTop: '6px' } }, row);
    h('div', { text: a, style: { fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '58px', letterSpacing: '-.02em', color: C.ink, lineHeight: '1.05' } }, tx);
    h('div', { text: b, style: { fontFamily: 'DM Sans', fontWeight: 500, fontSize: '32px', lineHeight: '1.3', color: C.inkSoft, marginTop: '6px', maxWidth: '780px' } }, tx);
    return { row, num };
  });
  s3.prepare = () => { fit(t3, 760); };
  s3.render = (lt) => {
    const e = E.outExpo(prog(lt, 0, 0.4));
    tf(t3, { y: lerp(60, 0, e), o: prog(lt, 0, 0.15) });
    const cur = Math.min(3, Math.floor(lt / 2));
    steps.forEach((st, i) => {
      const a = 0.3 + i * 2, m = E.outExpo(prog(lt, a, a + 0.4));
      tf(st.row, { y: lerp(80, 0, m), o: prog(lt, a, a + 0.15) * (i < cur ? 0.45 : 1) });
      tf(st.num, { s: E.outBack(prog(lt, a, a + 0.35)) * (1 + kick(lt, a + 0.35, 10) * 0.1) });
    });
    tf(railFill, { sy: E.inOutCubic(prog(lt, 0.3, 6.5)) });
  };

  // ======================================================================
  // S4 · 15–19 s · "EL PRIMER PASO: / UNA REUNIÓN" + respaldo
  // ======================================================================
  const s4 = scene(15.0, 19.0);
  const L4 = [['EL PRIMER PASO:', C.cream], ['UNA REUNIÓN', C.yellow]].map(([w, c]) => h('div', { cls: 'disp abs', text: w, style: { left: '60px', color: c, transformOrigin: '0% 50%' } }, s4.el));
  const sub4 = h('div', { cls: 'abs', text: 'En la oficina de egresados o por WhatsApp, con todas tus dudas resueltas.', style: { left: '64px', width: '940px', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '40px', lineHeight: '1.3', color: C.cream } }, s4.el);
  const BADGES = [[STAR(C.yellow), '4,7 en Google', '173 opiniones'], [CHECK(C.yellow), 'Legajo EVT 12.379', 'Ministerio de Turismo'], [CHECK(C.yellow), 'Factura oficial', 'por cada pago']];
  const badges = BADGES.map(([ico, a, b]) => {
    const el = h('div', { cls: 'abs', html: `<span style="width:76px;height:76px;display:inline-block;flex:none">${ico}</span><span><b style="font-family:'Bricolage Grotesque';font-size:56px;display:block;line-height:1.05">${a}</b><span class="mono" style="font-size:24px;color:rgba(255,255,255,.85)">${b}</span></span>`, style: { left: '70px', display: 'flex', alignItems: 'center', gap: '22px', color: C.cream, transformOrigin: '0% 50%' } }, s4.el);
    return el;
  });
  s4.prepare = () => {
    let y = SAFE_TOP + 20;
    L4.forEach((el) => { const hh = fit(el, 960) * 0.86; el.style.top = y + 'px'; y += hh + 14; });
    sub4.style.top = y + 30 + 'px';
    y += 30 + 120 + 60;
    badges.forEach((b) => { b.style.top = y + 'px'; y += 140; });
  };
  s4.render = (lt) => {
    L4.forEach((el, i) => {
      const a = i * BEAT, e = E.outExpo(prog(lt, a, a + 0.3));
      tf(el, { x: lerp(-1150, 0, e) }); mb(el, lerp(60, 0, e), 0);
    });
    tf(sub4, { y: lerp(40, 0, E.outExpo(prog(lt, 1.0, 1.3))), o: prog(lt, 1.0, 1.1) });
    badges.forEach((b, i) => { const a = 1.3 + i * 0.8, m = E.outBack(prog(lt, a, a + 0.35)); tf(b, { x: lerp(-80, 0, m), s: 0.6 + 0.4 * m, o: prog(lt, a, a + 0.06) }); });
  };

  // S5 · 19–22 s · Cierre
  endCard(19.0, 3.0, 'AGENDÁ UNA REUNIÓN');

  finish((t) => (t < 15 ? '#FFFFFF' : t < 19 ? C.red : '#FFFFFF'), 22.0, 1, [3.0, 7.0, 15.0, 19.0]);
})();
