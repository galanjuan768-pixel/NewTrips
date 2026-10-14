/* New Trips · Egresados para PADRES — "Mientras ellos disfrutan, vos estás tranquilo". Versión ROJO Y BLANCO.
   Estilo: chat del coordinador con las familias. 1080×1920, 22 s, 120 BPM. Cierre: agendar una reunión.
   La lista de garantías se tilda más lento (una cada 0,9 s) para que se llegue a leer. */
(function () {
  const { W, H, C, BEAT, lerp, prog, E, kick, h, tf, mb, fit, svg, CHECK, scene, SAFE_TOP, SAFE_BOTTOM, STAR, LOGO, EG_IMG, endCard, finish } = NTV;

  // ======================================================================
  // S1 · 0–2,5 s · "MIENTRAS ELLOS / DISFRUTAN, / VOS ESTÁS TRANQUILO."
  // ======================================================================
  const s1 = scene(0, 2.5);
  const lab1 = h('div', { cls: 'mono abs', text: 'PARA MAMÁS Y PAPÁS DE EGRESADOS', style: { left: '64px', top: SAFE_TOP + 'px', fontSize: '26px', color: C.red } }, s1.el);
  const band1 = h('div', { cls: 'abs', style: { left: '0', width: W + 'px', background: C.red, transformOrigin: '0% 50%' } }, s1.el);
  const L1 = [['MIENTRAS ELLOS', C.red], ['DISFRUTAN,', C.red], ['VOS ESTÁS', '#FFFFFF'], ['TRANQUILO.', '#FFFFFF']].map(([w, c]) => h('div', { cls: 'disp abs', text: w, style: { left: '60px', color: c, transformOrigin: '0% 50%' } }, s1.el));
  s1.prepare = () => {
    let y = SAFE_TOP + 70;
    let bandTop = 0;
    L1.forEach((el, i) => { const hh = fit(el, 960) * 0.86; if (i === 2) { y += 40; bandTop = y - 34; } el.style.top = y + 'px'; y += hh + 12; });
    band1.style.top = bandTop + 'px'; band1.style.height = y - bandTop + 22 + 'px';
  };
  s1.render = (lt) => {
    tf(lab1, { o: prog(lt, 0.05, 0.2) });
    tf(band1, { sx: E.outExpo(prog(lt, 0.85, 1.1)) });
    L1.forEach((el, i) => {
      const a = [0, 0.4, 1.0, 1.4][i], e = E.outExpo(prog(lt, a, a + 0.3));
      tf(el, { x: lerp(-1150, 0, e), sx: 1 + kick(lt, a + 0.3, 14) * 0.04 });
      mb(el, lerp(60, 0, E.outExpo(prog(lt, a, a + 0.2))), 0);
    });
  };

  // ======================================================================
  // S2 · 2,5–13 s · El chat del coordinador con las familias
  // ======================================================================
  const s2 = scene(2.5, 13.0);
  const PH = { x: 90, y: SAFE_TOP - 20, w: 900, h: SAFE_BOTTOM - SAFE_TOP + 60 };
  const cap2 = h('div', { cls: 'mono abs', text: 'ASÍ TE MANTENEMOS AL TANTO', style: { left: '0', width: W + 'px', textAlign: 'center', top: PH.y - 56 + 'px', fontSize: '26px', color: C.red } }, s2.el);
  const phone = h('div', { cls: 'abs', style: { left: PH.x + 'px', top: PH.y + 'px', width: PH.w + 'px', height: PH.h + 'px', borderRadius: '56px', background: C.ink, padding: '14px', boxSizing: 'border-box', boxShadow: '0 40px 90px rgba(26,20,16,.35)', transformOrigin: '50% 60%' } }, s2.el);
  const screen = h('div', { cls: 'abs', style: { left: '14px', top: '14px', right: '14px', bottom: '14px', borderRadius: '44px', overflow: 'hidden', background: '#FDEBEC' } }, phone);
  const head = h('div', { cls: 'abs', style: { left: '0', top: '0', width: '100%', height: '128px', background: C.ink, display: 'flex', alignItems: 'center', gap: '22px', padding: '0 32px', boxSizing: 'border-box' } }, screen);
  h('img', { src: LOGO('logo'), style: { width: '78px', height: '78px', borderRadius: '50%', background: C.cream } }, head);
  const ht = h('div', {}, head);
  h('div', { text: 'Coordinación Newtrips', style: { fontFamily: 'DM Sans', fontWeight: 700, fontSize: '38px', color: C.cream } }, ht);
  const status = h('div', { cls: 'mono', text: 'EN LÍNEA', style: { fontSize: '20px', color: C.yellow, marginTop: '4px' } }, ht);
  const BODY = { top: 128, h: PH.h - 28 - 128 - 96 };
  const body = h('div', { cls: 'abs', style: { left: '0', top: BODY.top + 'px', width: '100%', height: BODY.h + 'px', overflow: 'hidden' } }, screen);
  const stack = h('div', { cls: 'abs', style: { left: '0', top: '0', width: '100%' } }, body);
  const bar = h('div', { cls: 'abs', style: { left: '0', bottom: '0', width: '100%', height: '96px', background: '#FAD3D5', display: 'flex', alignItems: 'center', gap: '16px', padding: '0 22px', boxSizing: 'border-box' } }, screen);
  h('div', { text: 'Mensaje', style: { flex: '1', height: '62px', lineHeight: '62px', borderRadius: '31px', background: '#fff', padding: '0 26px', fontFamily: 'DM Sans', fontSize: '30px', color: 'rgba(237,28,36,.55)' } }, bar);
  h('div', { style: { width: '62px', height: '62px', borderRadius: '50%', background: C.red } }, bar);
  const TICKS = svg('<path d="M2 12.5l3.5 3.5L13 8.5M9 15l1 1 7.5-7.5" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>', '0 0 20 24', 30, 30);
  // mensajes: de = 'c' (coordinación) o 'p' (familia); at = segundo absoluto en que aparece
  const MSGS = [
    { de: 'c', at: 3.2, hora: '09:12', txt: '¡Buen día, familias! Ya llegamos al hotel en Camboriú. Todos bien y con muchas ganas.' },
    { de: 'c', at: 4.4, hora: '09:15', foto: 'camboriu', txt: 'Primera mañana de playa' },
    { de: 'p', at: 5.9, hora: '09:20', txt: '¡Gracias por avisar! Qué lindo verlos.' },
    { de: 'c', at: 7.0, hora: '13:40', txt: 'Salimos de excursión. Los coordinadores van con el grupo todo el día.' },
    { de: 'c', at: 8.6, hora: '21:05', lista: ['Desayuno', 'Playa', 'Excursión', 'Cena'], txt: 'Resumen del día' },
    { de: 'c', at: 10.1, hora: '21:30', txt: 'Recuerden: hay médico disponible las 24 hs. Cualquier novedad, les avisamos al instante.' },
    { de: 'p', at: 11.6, hora: '21:32', txt: '¡Qué tranquilidad! Gracias, chicos.' },
  ];
  const bubbles = MSGS.map((m) => {
    const mine = m.de === 'p';
    const wrap = h('div', { cls: 'abs', style: { left: '0', width: '100%', display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', padding: '0 26px', boxSizing: 'border-box' } }, stack);
    const b = h('div', { style: { maxWidth: '660px', background: mine ? C.red : '#fff', borderRadius: mine ? '28px 28px 8px 28px' : '28px 28px 28px 8px', padding: m.foto ? '12px 12px 16px' : '20px 26px 14px', boxShadow: '0 4px 10px rgba(26,20,16,.08)', transformOrigin: mine ? '100% 100%' : '0% 100%' } }, wrap);
    if (m.foto) h('img', { src: EG_IMG(m.foto), style: { display: 'block', width: '620px', height: '350px', objectFit: 'cover', borderRadius: '20px', marginBottom: '12px' } }, b);
    h('div', { text: m.txt, style: { fontFamily: 'DM Sans', fontWeight: m.lista ? 700 : 500, fontSize: '34px', lineHeight: '1.3', color: mine ? '#fff' : C.red, padding: m.foto ? '0 12px' : '0' } }, b);
    if (m.lista) {
      const ul = h('div', { style: { marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 26px' } }, b);
      m.items = m.lista.map((it) => {
        const row = h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'DM Sans', fontWeight: 600, fontSize: '32px', color: C.red } }, ul);
        const box = h('span', { style: { width: '34px', height: '34px', borderRadius: '50%', border: `3px solid ${C.red}`, boxSizing: 'border-box', display: 'inline-block', flex: 'none', position: 'relative' } }, row);
        const ck = h('span', { html: CHECK('#fff'), style: { position: 'absolute', inset: '-3px', borderRadius: '50%', background: C.red, transformOrigin: '50% 50%' } }, box);
        h('span', { text: it }, row);
        return ck;
      });
    }
    h('div', { html: `<span class="mono" style="font-size:18px;color:${mine ? 'rgba(255,255,255,.85)' : 'rgba(237,28,36,.6)'};letter-spacing:.06em">${m.hora}</span>${mine ? TICKS : ''}`, style: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px', marginTop: '6px', padding: m.foto ? '0 12px' : '0' } }, b);
    return { ...m, wrap, b, top: 0, hh: 0 };
  });
  const typing = h('div', { cls: 'abs', style: { left: '26px', bottom: '14px', height: '64px', padding: '0 24px', borderRadius: '32px', background: '#fff', display: 'flex', alignItems: 'center', gap: '10px', transformOrigin: '0% 100%' } }, body);
  const dots = [0, 1, 2].map(() => h('div', { style: { width: '14px', height: '14px', borderRadius: '50%', background: C.red, opacity: 0.55 } }, typing));
  const GAP = 18, PAD_BOTTOM = 96;
  s2.prepare = () => {
    let y = 0;
    bubbles.forEach((m) => { m.top = y; m.hh = m.wrap.offsetHeight; m.wrap.style.top = y + 'px'; y += m.hh + GAP; });
  };
  s2.render = (lt, t) => {
    const e = E.outExpo(prog(lt, 0, 0.5));
    tf(phone, { y: lerp(1300, 0, e) + Math.sin(t * 1.6) * 5, r: lerp(5, 0, e) + Math.sin(t * 1.1) * 0.4 });
    mb(phone, 0, lerp(40, 0, E.outExpo(prog(lt, 0, 0.3))));
    tf(cap2, { o: prog(lt, 0.3, 0.45) });
    // el chat se desplaza para que el último mensaje quede abajo, como en un teléfono
    let shown = 0;
    bubbles.forEach((m) => {
      const p = E.outExpo(prog(t, m.at, m.at + 0.35));
      shown += (m.hh + GAP) * p;
      const pop = E.outBack(prog(t, m.at, m.at + 0.3));
      tf(m.b, { s: 0.6 + 0.4 * pop, o: prog(t, m.at, m.at + 0.08) });
      if (m.items) m.items.forEach((ck, k) => { const a = m.at + 0.4 + k * 0.35, c = E.outBack(prog(t, a, a + 0.22)); tf(ck, { s: c, o: c > 0.01 ? 1 : 0 }); });
    });
    tf(stack, { y: BODY.h - PAD_BOTTOM - shown });
    // "escribiendo…" antes de cada mensaje de la coordinación
    const next = bubbles.find((m) => m.de === 'c' && t >= m.at - 0.7 && t < m.at);
    tf(typing, { s: next ? 1 : 0, o: next ? 1 : 0 });
    dots.forEach((d, k) => tf(d, { y: -Math.abs(Math.sin(t * 9 - k * 0.8)) * 8 }));
    status.textContent = next ? 'ESCRIBIENDO…' : 'EN LÍNEA';
  };

  // ======================================================================
  // S3 · 13–17 s · "PADRES AL TANTO, TODO EL DÍA" + 3 garantías del sitio
  // ======================================================================
  const s3 = scene(13.0, 17.0);
  const L3 = ['PADRES AL TANTO,', 'TODO EL DÍA'].map((w, i) => h('div', { cls: 'disp abs', text: w, style: { left: '60px', color: i ? C.yellow : C.cream, transformOrigin: '0% 50%' } }, s3.el));
  const R3 = [['Coordinadores con el grupo', 'Viajan con los chicos de principio a fin'], ['Médico las 24 hs', 'Durante todo el viaje'], ['Fotos y novedades', 'Lo que van haciendo, todos los días']].map(([a, b]) => {
    const row = h('div', { cls: 'abs', style: { left: '70px', display: 'flex', alignItems: 'center', gap: '26px', transformOrigin: '0% 50%' } }, s3.el);
    h('div', { html: CHECK(C.ink), style: { width: '80px', height: '80px', borderRadius: '24px', background: C.yellow, flex: 'none', padding: '8px', boxSizing: 'border-box' } }, row);
    const tx = h('div', {}, row);
    h('div', { text: a, style: { fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '56px', letterSpacing: '-.02em', color: C.cream, whiteSpace: 'nowrap', lineHeight: '1.05' } }, tx);
    h('div', { text: b, style: { fontFamily: 'DM Sans', fontWeight: 500, fontSize: '32px', color: 'rgba(255,255,255,.85)', whiteSpace: 'nowrap' } }, tx);
    return row;
  });
  s3.prepare = () => {
    let y = SAFE_TOP + 40;
    L3.forEach((el) => { const hh = fit(el, 960) * 0.86; el.style.top = y + 'px'; y += hh + 14; });
    y += 70;
    R3.forEach((r) => { r.style.top = y + 'px'; y += 170; });
  };
  s3.render = (lt) => {
    L3.forEach((el, i) => {
      const a = i * BEAT, e = E.outExpo(prog(lt, a, a + 0.3));
      tf(el, { x: lerp(-1150, 0, e) }); mb(el, lerp(60, 0, E.outExpo(prog(lt, a, a + 0.2))), 0);
    });
    R3.forEach((r, i) => {
      const a = 1.0 + i * 0.9, m = E.outBack(prog(lt, a, a + 0.35));
      tf(r, { x: lerp(-80, 0, m), s: 0.6 + 0.4 * m, o: prog(lt, a, a + 0.06) });
    });
  };

  // ======================================================================
  // S4 · 17–19 s · 4,7 ★ + lo que cuentan las familias
  // ======================================================================
  const s4 = scene(17.0, 19.0);
  const head4 = h('div', { cls: 'abs', style: { left: '0', top: SAFE_TOP + 'px', width: W + 'px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px', transformOrigin: '50% 50%' } }, s4.el);
  h('div', { cls: 'disp', text: '4,7', style: { fontSize: '230px', color: C.red } }, head4);
  const h4r = h('div', {}, head4);
  const stars4 = Array.from({ length: 5 }, () => h('div', { html: STAR(C.red), style: { display: 'inline-block', width: '66px', height: '66px', marginRight: '6px', transformOrigin: '50% 50%' } }, h4r));
  h('div', { cls: 'mono', text: '173 OPINIONES EN GOOGLE', style: { fontSize: '28px', color: C.ink, marginTop: '10px' } }, h4r);
  const q4 = h('div', {
    cls: 'abs',
    html: `<div style="font-family:'Bricolage Grotesque';font-weight:800;font-size:64px;line-height:1.06;letter-spacing:-.02em">“Nos mandaban a cada rato las actividades que hacían los chicos.”</div><div class="mono" style="font-size:24px;margin-top:24px;color:#fff">VERÓNICA F. · ★★★★★</div>`,
    style: { left: '70px', top: '640px', width: '940px', boxSizing: 'border-box', padding: '44px 48px', borderRadius: '36px', background: C.red, color: '#fff', boxShadow: '0 30px 70px rgba(26,20,16,.2)', transformOrigin: '50% 50%' },
  }, s4.el);
  s4.render = (lt) => {
    const e = E.outExpo(prog(lt, 0, 0.3));
    tf(head4, { s: lerp(1.6, 1, e), o: prog(lt, 0, 0.04) }); mb(head4, 0, lerp(30, 0, e));
    stars4.forEach((st, k) => { const a = 0.2 + k * 0.08, m = E.outBack(prog(lt, a, a + 0.22)); tf(st, { s: m, r: lerp(-60, 0, m), o: m > 0.01 ? 1 : 0 }); });
    const q = E.outExpo(prog(lt, 0.6, 1.0));
    tf(q4, { y: lerp(500, 0, q), r: lerp(5, -1.2, q), o: prog(lt, 0.6, 0.65) });
  };

  // S5 · 19–22 s · Cierre
  endCard(19.0, 3.0, 'AGENDÁ UNA REUNIÓN');

  finish((t) => (t < 13 ? '#FFFFFF' : t < 17 ? C.red : '#FFFFFF'), 22.0);
})();
