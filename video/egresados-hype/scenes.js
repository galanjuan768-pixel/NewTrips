/* New Trips · Egresados HYPE (para alumnos) — "¿Tu promo ya eligió destino?".
   Estilo: oscuro, cuenta regresiva, tipografía gigante y cortes en cada beat. 1080×1920, ~18,4 s, 140 BPM.
   Cierre: agendar una reunión. */
(function () {
  const { W, H, C, lerp, prog, E, hash, kick, h, tf, mb, fit, CHECK, scene, SAFE_TOP, SAFE_BOTTOM, EG_IMG, confetti, renderConfetti, endCard, finish } = NTV;
  const B = 60 / 140; // beat a 140 BPM

  // ======================================================================
  // S1 · 0–4 beats · "¿TU PROMO / YA ELIGIÓ / DESTINO?"
  // ======================================================================
  const s1 = scene(0, 4 * B);
  const L1 = [['¿TU PROMO', C.cream], ['YA ELIGIÓ', C.cream], ['DESTINO?', C.yellow]].map(([w, c]) => h('div', { cls: 'disp abs', text: w, style: { left: '60px', color: c, transformOrigin: '50% 50%' } }, s1.el));
  const lab1 = h('div', { cls: 'mono abs', text: 'NEWTRIPS · EGRESADOS DE SECUNDARIA', style: { left: '64px', top: SAFE_TOP + 'px', fontSize: '26px', color: C.yellow } }, s1.el);
  s1.prepare = () => {
    let y = SAFE_TOP + 110;
    L1.forEach((el) => { const hh = fit(el, 960) * 0.86; el.style.top = y + 'px'; y += hh + 20; });
  };
  s1.render = (lt) => {
    tf(lab1, { o: prog(lt, 0.05, 0.2) });
    L1.forEach((el, i) => {
      const a = i * B, e = E.outExpo(prog(lt, a, a + 0.2));
      const shake = lt > 3 * B ? Math.sin(lt * 90 + i) * 6 * (1 - prog(lt, 3 * B, 4 * B)) : 0;
      tf(el, { s: lerp(2.0, 1, e), x: shake, o: prog(lt, a, a + 0.03) });
      mb(el, 0, lerp(40, 0, E.outExpo(prog(lt, a, a + 0.14))));
    });
  };

  // ======================================================================
  // S2 · 4–8 beats · Cuenta regresiva 3 · 2 · 1 · ¡YA!
  // ======================================================================
  const s2 = scene(4 * B, 8 * B);
  const CD = [['3', C.red, C.cream], ['2', C.yellow, C.ink], ['1', C.cream, C.red], ['¡YA!', C.ink, C.yellow]].map(([n, b, f]) => {
    const card = h('div', { cls: 'layer', style: { background: b } }, s2.el);
    const num = h('div', { cls: 'disp abs', text: n, style: { left: '0', color: f, transformOrigin: '50% 50%' } }, card);
    return { card, num };
  });
  s2.prepare = () => CD.forEach(({ num }, i) => {
    const fs = fit(num, i === 3 ? 900 : 520);
    num.style.left = (W - num.offsetWidth) / 2 + 'px';
    num.style.top = (H - fs * 0.86) / 2 - 80 + 'px';
  });
  s2.render = (lt) => {
    const i = Math.min(3, Math.floor(lt / B)), u = lt - i * B;
    CD.forEach((c, j) => (c.card.style.display = j === i ? 'block' : 'none'));
    const e = E.outExpo(prog(u, 0, 0.18));
    tf(CD[i].num, { s: lerp(2.4, 1, e) * (1 + u * 0.15), r: (i % 2 ? 1 : -1) * lerp(14, 0, e) });
    mb(CD[i].num, 0, lerp(40, 0, e));
  };

  // ======================================================================
  // S3 · 8–22 beats · Tres destinos: foto tipo polaroid + nombre gigante en marquesina
  // ======================================================================
  const DEST = [
    { img: 'camboriu', pos: '60% 50%', name: 'CAMBORIÚ', tag: 'PLAYA EN BRASIL', bg: C.red },
    { img: 'carlospaz', pos: '50% 55%', name: 'CARLOS PAZ', tag: 'LAS SIERRAS DE CÓRDOBA', bg: C.yellow },
    { img: 'mardelplata', pos: '50% 60%', name: 'MAR DEL PLATA', tag: 'LA COSTA ATLÁNTICA', bg: C.red },
  ];
  const D_DUR = (14 * B) / DEST.length;
  const s3 = scene(8 * B, 22 * B);
  const dd = DEST.map((d, i) => {
    const lay = h('div', { cls: 'layer', style: { background: C.ink, overflow: 'hidden' } }, s3.el);
    const rows = [0, 1, 2, 3, 4].map((r) => {
      const row = h('div', { cls: 'disp abs', text: `${d.name} · ${d.name} · ${d.name} · `, style: { left: '0', top: 120 + r * 340 + 'px', fontSize: '330px', color: 'transparent', webkitTextStroke: `4px ${r % 2 ? C.yellow : 'rgba(250,246,238,.35)'}`, opacity: 0.55 } }, lay);
      return row;
    });
    const pol = h('div', { cls: 'abs', style: { left: '110px', top: SAFE_TOP + 40 + 'px', width: '860px', padding: '22px 22px 90px', background: '#fff', boxSizing: 'border-box', boxShadow: '0 40px 90px rgba(0,0,0,.6)', transformOrigin: '50% 50%' } }, lay);
    h('img', { src: EG_IMG(d.img), style: { display: 'block', width: '816px', height: '560px', objectFit: 'cover', objectPosition: d.pos } }, pol);
    h('div', { cls: 'mono abs', text: `0${i + 1} / 03 · SECUNDARIA`, style: { left: '30px', bottom: '30px', fontSize: '24px', color: C.ink } }, pol);
    const name = h('div', { cls: 'disp abs', text: d.name, style: { left: '60px', color: d.bg === C.yellow ? C.yellow : C.cream, textShadow: '0 12px 40px rgba(0,0,0,.6)', transformOrigin: '50% 50%' } }, lay);
    const tag = h('div', { cls: 'abs', text: d.tag, style: { left: '50%', background: d.bg, color: d.bg === C.yellow ? C.ink : C.cream, fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '46px', padding: '14px 30px', borderRadius: '16px', whiteSpace: 'nowrap', transformOrigin: '50% 50%' } }, lay);
    const flash = h('div', { cls: 'layer', style: { background: '#fff' } }, lay);
    return { lay, rows, pol, name, tag, flash };
  });
  s3.prepare = () => dd.forEach((d) => {
    const fs = fit(d.name, 960);
    d.name.style.top = SAFE_TOP + 40 + 640 + 60 - fs * 0.3 + 'px';
    d.tag.style.top = SAFE_TOP + 40 + 640 + 60 + fs * 0.6 + 30 + 'px';
    d.tag.style.marginLeft = -d.tag.offsetWidth / 2 + 'px';
  });
  s3.render = (lt) => {
    const i = Math.min(DEST.length - 1, Math.floor(lt / D_DUR)), u = lt - i * D_DUR;
    dd.forEach((d, j) => (d.lay.style.display = j === i ? 'block' : 'none'));
    const d = dd[i];
    d.rows.forEach((r, k) => tf(r, { x: (k % 2 ? -1 : 1) * (u * 420) - (k % 2 ? 0 : 900) }));
    const e = E.outExpo(prog(u, 0, 0.35));
    tf(d.pol, { y: lerp(-1200, 0, e) + Math.sin(u * 6) * 6, r: lerp(-25, (i % 2 ? 3 : -3), e) + Math.sin(u * 3) * 1.2, s: 1 + kick(u, B, 10) * 0.04 + kick(u, 2 * B, 10) * 0.04 });
    mb(d.pol, 0, lerp(50, 0, E.outExpo(prog(u, 0, 0.2))));
    const en = E.outExpo(prog(u, B * 0.5, B * 0.5 + 0.25));
    tf(d.name, { s: lerp(1.8, 1, en), o: prog(u, B * 0.5, B * 0.5 + 0.03) });
    mb(d.name, 0, lerp(36, 0, en));
    const mt = E.outBack(prog(u, B * 1.5, B * 1.5 + 0.25));
    tf(d.tag, { s: mt, r: lerp(-14, -2, mt), o: mt > 0.01 ? 1 : 0 });
    d.flash.style.opacity = lerp(0.7, 0, prog(u, 0, 0.1)).toFixed(3);
  };

  // ======================================================================
  // S4 · 22–32 beats · "EL VIAJE PERFECTO TIENE:" + checklist que se completa en cada beat
  // ======================================================================
  const s4 = scene(22 * B, 32 * B);
  const t4 = ['EL VIAJE PERFECTO', 'TIENE:'].map((w, i) => h('div', { cls: 'disp abs', text: w, style: { left: '60px', color: i ? C.yellow : C.cream, transformOrigin: '0% 50%' } }, s4.el));
  const ITEMS = ['Toda tu promo', 'Playa y sol', 'Noches de boliche', 'Excursiones', 'Coordinadores', 'Médico 24 hs'];
  const rows4 = ITEMS.map((txt) => {
    const row = h('div', { cls: 'abs', style: { left: '70px', display: 'flex', alignItems: 'center', gap: '24px', transformOrigin: '0% 50%' } }, s4.el);
    const box = h('div', { style: { width: '74px', height: '74px', borderRadius: '18px', border: `5px solid ${C.yellow}`, boxSizing: 'border-box', flex: 'none', position: 'relative' } }, row);
    const chk = h('div', { html: CHECK(C.ink), style: { position: 'absolute', inset: '-5px', borderRadius: '18px', background: C.yellow, padding: '6px', transformOrigin: '50% 50%' } }, box);
    h('span', { text: txt, style: { fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '66px', letterSpacing: '-.02em', color: C.cream, whiteSpace: 'nowrap' } }, row);
    return { row, chk };
  });
  const conf4 = confetti(s4.el, 60, 4);
  s4.prepare = () => {
    let y = SAFE_TOP + 10;
    t4.forEach((el, i) => { const hh = fit(el, i ? 420 : 960) * 0.86; el.style.top = y + 'px'; y += hh + 12; });
    y += 40;
    rows4.forEach((r) => { r.row.style.top = y + 'px'; y += 104; });
  };
  s4.render = (lt) => {
    t4.forEach((el, i) => {
      const a = i * B * 0.5, e = E.outExpo(prog(lt, a, a + 0.25));
      tf(el, { x: lerp(-1150, 0, e) }); mb(el, lerp(60, 0, e), 0);
    });
    rows4.forEach((r, i) => {
      const a = (2 + i) * B, m = E.outExpo(prog(lt, a - B * 0.5, a - B * 0.5 + 0.25));
      tf(r.row, { x: lerp(-200, 0, m), o: prog(lt, a - B * 0.5, a - B * 0.5 + 0.05) });
      const c = E.outBack(prog(lt, a, a + 0.22));
      tf(r.chk, { s: c, r: lerp(-40, 0, c), o: c > 0.01 ? 1 : 0 });
    });
    renderConfetti(conf4, lt, 8 * B, 540, 1300, 4, 2.2);
  };

  // ======================================================================
  // S5 · 32–36 beats · "SUMÁ A TU CURSO / Y A LAS FAMILIAS"
  // ======================================================================
  const s5 = scene(32 * B, 36 * B);
  const L5 = [['SUMÁ A TU CURSO', C.ink], ['Y A LAS FAMILIAS', C.cream]].map(([w, c]) => h('div', { cls: 'disp abs', text: w, style: { left: '60px', color: c, transformOrigin: '50% 50%' } }, s5.el));
  const sub5 = h('div', { cls: 'abs', text: 'Armamos la propuesta para todo el curso', style: { left: '64px', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: '46px', color: C.cream, whiteSpace: 'nowrap' } }, s5.el);
  s5.prepare = () => {
    let y = SAFE_TOP + 180;
    L5.forEach((el) => { const hh = fit(el, 960) * 0.86; el.style.top = y + 'px'; y += hh + 18; });
    sub5.style.top = y + 50 + 'px';
  };
  s5.render = (lt) => {
    tf(sub5, { y: lerp(40, 0, E.outExpo(prog(lt, 2 * B, 2 * B + 0.3))), o: prog(lt, 2 * B, 2 * B + 0.05) });
    L5.forEach((el, i) => {
      const a = i * B, e = E.outExpo(prog(lt, a, a + 0.2));
      tf(el, { s: lerp(1.8, 1, e), o: prog(lt, a, a + 0.03) });
      mb(el, 0, lerp(36, 0, E.outExpo(prog(lt, a, a + 0.14))));
    });
  };

  // S6 · 36 beats → +3 s · Cierre
  endCard(36 * B, 3.0, 'AGENDÁ UNA REUNIÓN');

  const cuts = [4, 5, 6, 7, 8, 8 + 14 / 3, 8 + 28 / 3, 22, 32, 36].map((b) => b * B);
  finish((t) => (t < 4 * B ? C.ink : t < 8 * B ? C.ink : t < 22 * B ? C.ink : t < 32 * B ? C.ink : t < 36 * B ? C.red : C.cream), 36 * B + 3.0, 1, cuts);
})();
